import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from authentication.models import User
from .models import TicTacToeMatch, TicTacToePlayerStats

# store game data in variables
games = {}
waiting_players = []


class TicTacToeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """connect to websocket"""
        # grab user id from the url
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.player_symbol = None
        self.room_id = None
        self.room_group_name = None
        self.looking_for_match = False

        # accept websocket
        await self.accept()

        # get query string to check for room
        query = self.scope.get("query_string", b"").decode()

        # if room parameter is in the query, join that room
        if "room=" in query:
            # get the room id from the query string
            room = query.split("room=")[1].split("&")[0]
            self.room_id = room
            self.room_group_name = f"tictactoe_{room}"

            # add to group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            # tell client we connected
            await self.send(
                text_data=json.dumps(
                    {"action": "connection_established", "room_id": self.room_id}
                )
            )

            # check if room exists already, if not create it
            if self.room_group_name not in games:
                # make new game
                self.player_symbol = "X"

                # initialize the game data
                games[self.room_group_name] = {
                    "board": [None, None, None, None, None, None, None, None, None],
                    "current_player": "X",
                    "players": {
                        "X": {
                            "id": self.user_id,
                            "username": self.scope["user"].username,
                        },
                        "O": None,
                    },
                    "state": "waiting",
                    "winner": None,
                    "score": {"X": 0, "O": 0},
                    "ready_for_new_game": {"X": False, "O": False},
                }

                # tell client to wait for someone to join
                await self.send(
                    text_data=json.dumps(
                        {
                            "action": "waiting_for_opponent",
                            "your_symbol": self.player_symbol,
                            "game_state": games[self.room_group_name],
                        }
                    )
                )
            else:
                # room exists already, try to join
                game = games[self.room_group_name]

                # check if player already has a symbol in this game (reconnecting)
                if game["players"]["X"] and game["players"]["X"]["id"] == self.user_id:
                    self.player_symbol = "X"

                    # send game state to reconnected player
                    await self.send(
                        text_data=json.dumps(
                            {
                                "action": "game_started",
                                "your_symbol": self.player_symbol,
                                "is_your_turn": game["current_player"]
                                == self.player_symbol,
                                "game_state": game,
                            }
                        )
                    )
                    return

                # check if player already is O
                if game["players"]["O"] and game["players"]["O"]["id"] == self.user_id:
                    self.player_symbol = "O"

                    # send game state to reconnected player
                    await self.send(
                        text_data=json.dumps(
                            {
                                "action": "game_started",
                                "your_symbol": self.player_symbol,
                                "is_your_turn": game["current_player"]
                                == self.player_symbol,
                                "game_state": game,
                            }
                        )
                    )
                    return

                # check if we can join as player O
                if game["state"] == "waiting" and game["players"]["O"] is None:
                    self.player_symbol = "O"
                    game["players"]["O"] = {
                        "id": self.user_id,
                        "username": self.scope["user"].username,
                    }
                    game["state"] = "playing"

                    # tell both players game started
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {"type": "game_started", "game_state": game},
                    )
                else:
                    # can't join, game is full or over
                    await self.send(
                        text_data=json.dumps(
                            {
                                "action": "error",
                                "message": "Game is already full or has ended",
                            }
                        )
                    )
        else:
            # no room specified, just confirm connection
            await self.send(text_data=json.dumps({"action": "connection_established"}))

    async def disconnect(self, close_code):
        """handle disconnect"""
        # check if in matchmaking queue
        if self.looking_for_match:
            # remove from queue
            for i in range(len(waiting_players)):
                if waiting_players[i]["user_id"] == self.user_id:
                    waiting_players.pop(i)
                    break

        # if in a game room, handle that
        if hasattr(self, "room_group_name") and self.room_group_name in games:
            game = games[self.room_group_name]

            # only care if game is still being played
            if game["state"] == "playing":
                # mark game as over
                game["state"] = "ended"

                # tell other player what happened
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "player_disconnected",
                        "player_symbol": self.player_symbol,
                        "message": "Your opponent disconnected. The game has ended.",
                        "game_state": game,
                    },
                )

                # remove the game
                del games[self.room_group_name]

        # leave the channel group
        if hasattr(self, "room_group_name") and self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def receive(self, text_data):
        """handle messages from client"""
        # parse the message
        data = json.loads(text_data)
        action = data.get("action")

        # figure out what to do based on action
        if action == "find_match":
            await self.find_match()
        elif action == "cancel_matchmaking":
            await self.cancel_matchmaking()
        elif action == "make_move":
            await self.make_move(data)
        elif action == "player_ready":
            await self.mark_player_ready(data)

    async def find_match(self):
        """put player in matchmaking queue or match with waiting player"""
        # don't add again if already in queue
        if self.looking_for_match:
            return

        # check if anyone is waiting
        if len(waiting_players) > 0:
            # get first player in queue
            opponent = waiting_players.pop(0)

            # create room with random id
            self.room_id = str(uuid.uuid4())[:8]
            self.room_group_name = f"tictactoe_{self.room_id}"

            # join the room
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            # create game data
            self.player_symbol = "O"
            games[self.room_group_name] = {
                "board": [None, None, None, None, None, None, None, None, None],
                "current_player": "X",
                "players": {
                    "X": {"id": opponent["user_id"], "username": opponent["username"]},
                    "O": {"id": self.user_id, "username": self.scope["user"].username},
                },
                "state": "playing",
                "winner": None,
                "score": {"X": 0, "O": 0},
                "ready_for_new_game": {"X": False, "O": False},
            }

            # add opponent to room
            await self.channel_layer.group_add(
                self.room_group_name, opponent["channel_name"]
            )

            # notify both players
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "matchmaking_complete",
                    "room_id": self.room_id,
                    "game_state": games[self.room_group_name],
                },
            )
        else:
            # no match, add to queue
            self.looking_for_match = True
            waiting_players.append(
                {
                    "user_id": self.user_id,
                    "username": self.scope["user"].username,
                    "channel_name": self.channel_name,
                }
            )

            # tell player they're in queue
            await self.send(
                text_data=json.dumps(
                    {
                        "action": "matchmaking_queued",
                        "message": "Waiting for an opponent...",
                    }
                )
            )

    async def cancel_matchmaking(self):
        """cancel matchmaking"""
        # only cancel if actually in queue
        if not self.looking_for_match:
            return

        # find and remove from queue
        for i in range(len(waiting_players)):
            if waiting_players[i]["user_id"] == self.user_id:
                waiting_players.pop(i)
                self.looking_for_match = False

                # tell client it's cancelled
                await self.send(
                    text_data=json.dumps(
                        {
                            "action": "matchmaking_cancelled",
                            "message": "Matchmaking cancelled.",
                        }
                    )
                )
                break

    async def make_move(self, data):
        """handle a player making a move"""
        # get the position they want to place
        position = int(data.get("position", -1))

        # make sure everything is valid
        if not hasattr(self, "room_group_name"):
            return
        if not hasattr(self, "player_symbol"):
            return
        if self.room_group_name not in games:
            return

        game = games[self.room_group_name]

        # check if valid move
        if game["state"] != "playing":
            return
        if game["current_player"] != self.player_symbol:
            return
        if position < 0:
            return
        if position > 8:
            return
        if game["board"][position] is not None:
            return

        # place the symbol on the board
        game["board"][position] = self.player_symbol

        # check if someone won
        winner = self.check_for_winner(game["board"])
        if winner:
            # we have a winner
            game["winner"] = winner
            game["state"] = "ended"
            game["score"][winner] += 1

            # save to database
            await self.save_game_to_db(self.room_group_name, winner)
        elif None not in game["board"]:
            # no winner but board is full = draw
            game["state"] = "ended"
            game["winner"] = "draw"

            # save to database
            await self.save_game_to_db(self.room_group_name, "draw")
        else:
            # game continues, switch players
            if self.player_symbol == "X":
                game["current_player"] = "O"
            else:
                game["current_player"] = "X"

        # tell everyone about the move
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "move_made",
                "position": position,
                "symbol": self.player_symbol,
                "game_state": game,
            },
        )

    async def mark_player_ready(self, data):
        """handle player ready for next game"""
        # get which player is ready
        symbol = data.get("symbol")

        # validate request
        if not hasattr(self, "room_group_name"):
            return
        if not hasattr(self, "player_symbol"):
            return
        if self.room_group_name not in games:
            return
        if self.player_symbol != symbol:
            return

        game = games[self.room_group_name]

        # make sure ready tracking exists
        if "ready_for_new_game" not in game:
            game["ready_for_new_game"] = {"X": False, "O": False}

        # mark player ready
        game["ready_for_new_game"][symbol] = True

        # tell everyone
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "player_ready", "symbol": symbol, "game_state": game},
        )

        # check if both players ready
        if (
            game["ready_for_new_game"]["X"] == True
            and game["ready_for_new_game"]["O"] == True
        ):
            # reset game
            game["board"] = [None, None, None, None, None, None, None, None, None]
            game["current_player"] = "X"
            game["state"] = "playing"
            game["winner"] = None
            game["ready_for_new_game"] = {"X": False, "O": False}

            # tell players game started
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "game_started", "game_state": game}
            )

    def check_for_winner(self, board):
        """Check if there's a winner"""
        # rows
        if board[0] == board[1] == board[2] and board[0] is not None:
            return board[0]
        if board[3] == board[4] == board[5] and board[3] is not None:
            return board[3]
        if board[6] == board[7] == board[8] and board[6] is not None:
            return board[6]

        # columns
        if board[0] == board[3] == board[6] and board[0] is not None:
            return board[0]
        if board[1] == board[4] == board[7] and board[1] is not None:
            return board[1]
        if board[2] == board[5] == board[8] and board[2] is not None:
            return board[2]

        # diagonals
        if board[0] == board[4] == board[8] and board[0] is not None:
            return board[0]
        if board[2] == board[4] == board[6] and board[2] is not None:
            return board[2]

        # no winner
        return None

    async def save_game_to_db(self, room_id, winner_symbol):
        """save game to database"""
        # convert to sync function because database stuff
        await sync_to_async(self.do_db_save)(room_id, winner_symbol)

    def do_db_save(self, room_id, winner_symbol):
        """do the actual database save"""
        try:
            # get game data
            game = games[room_id]

            # get player objects from database
            player_x = User.objects.filter(id=game["players"]["X"]["id"]).first()
            player_o = User.objects.filter(id=game["players"]["O"]["id"]).first()

            if player_x is None or player_o is None:
                print("Can't find players in database")
                return

            # get or create player stats
            try:
                x_stats = TicTacToePlayerStats.objects.get(user=player_x)
            except:
                x_stats = TicTacToePlayerStats.objects.create(user=player_x)

            try:
                o_stats = TicTacToePlayerStats.objects.get(user=player_o)
            except:
                o_stats = TicTacToePlayerStats.objects.create(user=player_o)

            # update stats
            x_stats.games_played = x_stats.games_played + 1
            o_stats.games_played = o_stats.games_played + 1

            if winner_symbol == "draw":
                # it's a draw
                # create match record
                new_match = TicTacToeMatch()
                new_match.room_id = room_id
                new_match.player1 = player_x
                new_match.player2 = player_o
                new_match.is_draw = True
                new_match.save()

                # update stats
                x_stats.draws = x_stats.draws + 1
                o_stats.draws = o_stats.draws + 1
            else:
                # someone won
                if winner_symbol == "X":
                    winner = player_x
                else:
                    winner = player_o

                # create match record
                new_match = TicTacToeMatch()
                new_match.room_id = room_id
                new_match.player1 = player_x
                new_match.player2 = player_o
                new_match.winner = winner
                new_match.is_draw = False
                new_match.save()

                # update stats
                if winner_symbol == "X":
                    x_stats.wins = x_stats.wins + 1
                    o_stats.losses = o_stats.losses + 1
                else:
                    o_stats.wins = o_stats.wins + 1
                    x_stats.losses = x_stats.losses + 1

            # save updated stats
            x_stats.save()
            o_stats.save()
        except Exception as e:
            print(f"Error saving match: {str(e)}")

    # Functions to handle group events

    async def matchmaking_complete(self, event):
        """handle when matchmaking finds an opponent"""
        # get data
        game = event["game_state"]
        self.room_id = event["room_id"]
        self.room_group_name = f"tictactoe_{self.room_id}"

        # figure out which player we are
        if game["players"]["X"]["id"] == self.user_id:
            self.player_symbol = "X"
        else:
            self.player_symbol = "O"

        # not looking for match anymore
        self.looking_for_match = False

        # tell client
        await self.send(
            text_data=json.dumps(
                {
                    "action": "game_started",
                    "room_id": self.room_id,
                    "your_symbol": self.player_symbol,
                    "is_your_turn": game["current_player"] == self.player_symbol,
                    "game_state": game,
                }
            )
        )

    async def game_started(self, event):
        """handle game started event"""
        # get game data
        game = event["game_state"]

        # make sure we know which player we are
        if not hasattr(self, "player_symbol") or self.player_symbol is None:
            if game["players"]["X"]["id"] == self.user_id:
                self.player_symbol = "X"
            else:
                self.player_symbol = "O"

        # tell client
        await self.send(
            text_data=json.dumps(
                {
                    "action": "game_started",
                    "your_symbol": self.player_symbol,
                    "is_your_turn": game["current_player"] == self.player_symbol,
                    "game_state": game,
                }
            )
        )

    async def move_made(self, event):
        """someone made a move"""
        # get game
        game = event["game_state"]

        # tell client
        await self.send(
            text_data=json.dumps(
                {
                    "action": "move_made",
                    "position": event["position"],
                    "symbol": event["symbol"],
                    "is_your_turn": game["current_player"] == self.player_symbol,
                    "your_symbol": self.player_symbol,
                    "game_state": game,
                }
            )
        )

    async def player_ready(self, event):
        """player ready for next game"""
        # tell client
        await self.send(
            text_data=json.dumps(
                {
                    "action": "player_ready",
                    "symbol": event["symbol"],
                    "game_state": event["game_state"],
                }
            )
        )

    async def player_disconnected(self, event):
        """other player disconnected"""
        # tell client
        await self.send(
            text_data=json.dumps(
                {
                    "action": "player_disconnected",
                    "disconnected_player": event["player_symbol"],
                    "message": event["message"],
                    "game_state": event["game_state"],
                }
            )
        )
