import json
import uuid
import time
import math
import asyncio
import random
from threading import Timer
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from django.db.models import Q
from authentication.services import user_service
from authentication.models import User
from .models import Match
from tournament.models import Tournament
from tournament.serializers import TournamentSerializer
from authentication.serializers import UserSerializer

predefined_players = []
players_queue = []
grouped_players = {}
rooms_queue = {}
all_players = []

class Game(AsyncWebsocketConsumer):
    async def disconnect(self, close_code):
        global predefined_players
        global players_queue
        global rooms_queue
        global all_players

        if hasattr(self, "id") and self.id in all_players:
            all_players.remove(self.id)
            ##print("------------------------------")
            ##print("all_players::remove ", all_players)
            ##print("------------------------------")

        if hasattr(self, "room_group_name"):
            if self.room_group_name in rooms_queue:
                game_state = rooms_queue[self.room_group_name]['state']
                if game_state != -1 and game_state != 2 and hasattr(self, "id"):
                    await sync_to_async(self.end_game) (self.id, "pair disconnect")
            if self.room_group_name in predefined_players:
                predefined_players.remove(self.room_group_name)

        if hasattr(self, "room_name") and self.room_name in players_queue:
            players_queue.remove(self.room_name)

        if hasattr(self, "room_group_name") and self.room_group_name in rooms_queue:
            rooms_queue[self.room_group_name]['state'] = 2
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'send_game_state',
                        'message': 'game interrupt',
                        'state': rooms_queue[self.room_group_name]['state'],
                        }
                    )
            del rooms_queue[self.room_group_name]

        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_msg',
                    'message': 'pair disconnected',
                    'room_name': self.room_group_name
                    }
                )

    async def init_match(self):
        #print("Game::init_match()")
        global rooms_queue
        ball = {
                'radius': 2,
                'color': "#FFFFFF",
                'border_touch': False,
                'x': 50,
                'y': 50,
                'vx': -0.3 if self.rand(0, 1) else 0.3,
                'vy': -1 if self.rand(0, 1) else 1,
                'ax': 0,
                'ay': 0,
                }
        paddles = [
                {
                    'color': "#FFFFFF",
                    'index': 0,
                    'name': "",
                    'score': 0,
                    'id': "",
                    'y': 10,
                    'h': 20,
                    'w': 4,
                    'upState': 0,
                    'downState': 0,
                    },
                {
                    'color': "#FFFFFF",
                    'index': 1,
                    'name': "",
                    'score': 0,
                    'id': "",
                    'y': 10,
                    'h': 20,
                    'w': 4,
                    'upState': 0,
                    'downState': 0,
                    }
                ]
        rooms_queue[self.room_group_name] = { 'ball': ball, 'paddles': paddles, 'state': -1, 'pause_txt': "PAUSE" }
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_game_update',
                    'message': 'initializing game object',
                    'obj': rooms_queue[self.room_group_name]
                    }
                )

    async def start_match(self):
        #print("Game::start_match()")
        global rooms_queue
        if self.room_group_name in rooms_queue:
            rooms_queue[self.room_group_name]['state'] = 0
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'send_game_state',
                        'message': 'state update',
                        'state': rooms_queue[self.room_group_name]['state'],
                    }
                )
            asyncio.create_task(self.game_loop())

    def start_game_timer(*count):
        #print("start_game_timer()")
        global rooms_queue
        try:
            me = count[0]
            counter = count[1]
            if hasattr(me, "room_group_name") == False or me.room_group_name not in rooms_queue:
                return
            if counter == 0:
                rooms_queue[me.room_group_name]['state'] = 1
                rooms_queue[me.room_group_name]['pause_txt'] = "PAUSE"
                async_to_sync(me.channel_layer.group_send)(
                        me.room_group_name, {
                            'type': 'send_game_state',
                            'message': 'state update',
                            'state': rooms_queue[me.room_group_name]['state']
                            }
                        )
            else:
                rooms_queue[me.room_group_name]['pause_txt'] = str(counter)
                s = Timer(0.75, me.start_game_timer, ([counter - 1]))
                s.start()

            async_to_sync(me.channel_layer.group_send)(
                    me.room_group_name, {
                        'type': 'send_pause_txt',
                        'pause_txt': rooms_queue[me.room_group_name]['pause_txt'],
                        'state': rooms_queue[me.room_group_name]['state'],
                        }
                    )

        except Exception as e:
            pass
            #print(f"start_game_time::exception::{str(e)}")
        

    def end_game(self, loser_id, cause):
        #print("Game::end_game()")
        global rooms_queue
        if self.room_group_name in rooms_queue:
            loser_index = 1
            winner_index = 0
            if loser_id == rooms_queue[self.room_group_name]["paddles"][0]["id"]:
                winner_index = 1
                loser_index = 0
            winner = rooms_queue[self.room_group_name]['paddles'][winner_index]
            rooms_queue[self.room_group_name]["result"] = winner
            rooms_queue[self.room_group_name]["result"]['cause'] = cause
            async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'send_game_update',
                        'message': 'obj update',
                        'obj': rooms_queue[self.room_group_name],
                        }
                    )

            user1 = None
            user2 = None
            get_user = lambda username: User.objects.filter(username=username).first()
            if self.room_group_name in rooms_queue:
                user1 = get_user(rooms_queue[self.room_group_name]["paddles"][0]["name"])
                user2 = get_user(rooms_queue[self.room_group_name]["paddles"][1]["name"])

            if user1 and user2:
                Match.objects.create(
                    player1=user1,
                    player2=user2,
                    game="Ping Pong",
                    winner=(user2 if winner_index else user1),
                    winner_score=rooms_queue[self.room_group_name]['paddles'][winner_index]['score'],
                    loser_score=rooms_queue[self.room_group_name]['paddles'][loser_index]['score'],
                    room_id=self.room_group_name,
                    )

            if user1:
                user1.games_played += 1
                user1.total_score += int(rooms_queue[self.room_group_name]['paddles'][0]['score'])
                if winner_index == 0:
                    user1.wins += 1
                user1.save()
            if user2:
                user2.games_played += 1
                user2.total_score += int(rooms_queue[self.room_group_name]['paddles'][1]['score'])
                if winner_index == 1:
                    user2.wins += 1
                user2.save()

            rooms_queue[self.room_group_name]['state'] = 2
            async_to_sync(self.channel_layer.group_send) (
                    self.room_group_name,
                    {
                        'type': 'send_game_state',
                        'message': 'state update',
                        'state': rooms_queue[self.room_group_name]['state'],
                        }
                    )

        #async_to_sync(self.close) ()

    def rand(self, min_n, max_n):
        return random.randint(min_n, max_n)

    def detect_collision(self, x1, y1, w1, h1, x2, y2, w2, h2):
        if (x1 < x2 + w2) and (x1 + w1 > x2) and (y1 < y2 + h2) and (y1 + h1 > y2):
            return True
        return False
    
    async def game_loop(self):
        #print("Game::game_loop()")
        global rooms_queue
        dt = 0.7

        while True:
            if self.room_group_name in rooms_queue and rooms_queue[self.room_group_name]['state'] == 1:
                if "ball" in rooms_queue[self.room_group_name]:
                    rooms_queue[self.room_group_name]["ball"]["x"] += rooms_queue[self.room_group_name]["ball"]["vx"] * dt
                    rooms_queue[self.room_group_name]["ball"]["y"] += rooms_queue[self.room_group_name]["ball"]["vy"] * dt
                    rooms_queue[self.room_group_name]["ball"]["ax"] *= 0.1
                    rooms_queue[self.room_group_name]["ball"]["ay"] *= 0.1
                    rooms_queue[self.room_group_name]["ball"]["vx"] += rooms_queue[self.room_group_name]["ball"]["ax"] * dt
                    rooms_queue[self.room_group_name]["ball"]["vy"] += rooms_queue[self.room_group_name]["ball"]["ay"] * dt

                    if self.room_group_name in rooms_queue:
                        for cur_paddle in range(0, 2):
                            paddle_x = (100 - rooms_queue[self.room_group_name]["paddles"][cur_paddle]["w"]) if (cur_paddle == 1) else 0;
                            paddle_y = rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"]
                            paddle_w = rooms_queue[self.room_group_name]["paddles"][cur_paddle]["w"]
                            paddle_h = rooms_queue[self.room_group_name]["paddles"][cur_paddle]["h"]
                            ball_diameter = rooms_queue[self.room_group_name]["ball"]["radius"] * 2
                            ball_x = rooms_queue[self.room_group_name]["ball"]["x"] - rooms_queue[self.room_group_name]["ball"]["radius"]
                            ball_y = rooms_queue[self.room_group_name]["ball"]["y"] - rooms_queue[self.room_group_name]["ball"]["radius"]
                            if self.detect_collision(paddle_x, paddle_y, paddle_w, paddle_h, ball_x, ball_y, ball_diameter, ball_diameter):
                                rooms_queue[self.room_group_name]["ball"]["vx"] *= -1
                                rooms_queue[self.room_group_name]["ball"]["ax"] = math.copysign(1, rooms_queue[self.room_group_name]["ball"]["vx"]) * 1
                                if cur_paddle == 0:
                                    rooms_queue[self.room_group_name]["ball"]["x"] = rooms_queue[self.room_group_name]["paddles"][cur_paddle]["w"] + rooms_queue[self.room_group_name]["ball"]["radius"]
                                else:
                                    rooms_queue[self.room_group_name]["ball"]["x"] = 100 - rooms_queue[self.room_group_name]["paddles"][cur_paddle]["w"] - rooms_queue[self.room_group_name]["ball"]["radius"]
                                break

                    if (rooms_queue[self.room_group_name]["ball"]["x"] - rooms_queue[self.room_group_name]["ball"]["radius"] <= 0) or (rooms_queue[self.room_group_name]["ball"]["x"] + rooms_queue[self.room_group_name]["ball"]["radius"] >= 100):
                        rooms_queue[self.room_group_name]["ball"]["vx"] *= -1
                        rooms_queue[self.room_group_name]["ball"]["ax"] = math.copysign(1, rooms_queue[self.room_group_name]["ball"]["vx"]) * 1

                        if rooms_queue[self.room_group_name]["ball"]["x"] - rooms_queue[self.room_group_name]["ball"]["radius"] <= 0:
                            rooms_queue[self.room_group_name]["paddles"][1]["score"] += 1
                        else:
                            rooms_queue[self.room_group_name]["paddles"][0]["score"] += 1

                        score1 = rooms_queue[self.room_group_name]["paddles"][0]["score"]
                        score2 = rooms_queue[self.room_group_name]["paddles"][1]["score"]

                        if (score1 != score2 and (score1 + score2 > 5 or score1 >= 3 or score2 >= 3)):
                            loser_id = rooms_queue[self.room_group_name]["paddles"][0]["id"]
                            if score1 > score2:
                                loser_id = rooms_queue[self.room_group_name]["paddles"][1]["id"]
                            try:
                                await sync_to_async(self.end_game) (loser_id, "match end")
                            except Exception as e:
                                pass
                                #print(f"game_loop::end_game::exception::{str(e)}")
                        else:
                            rooms_queue[self.room_group_name]["ball"]["x"] = 50
                            rooms_queue[self.room_group_name]["ball"]["y"] = 50
                            rooms_queue[self.room_group_name]["ball"]["vx"] = -0.3 if self.rand(0, 1) else 0.3
                            rooms_queue[self.room_group_name]["ball"]["vy"] = -1 if self.rand(0, 1) else 1
                            rooms_queue[self.room_group_name]["ball"]["ax"] = 0
                            rooms_queue[self.room_group_name]["ball"]["ay"] = 0
                            # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            rooms_queue[self.room_group_name]['state'] = 3
                            s = Timer(0.75, self.start_game_timer, ([3]))
                            s.start()
                            # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            await self.channel_layer.group_send(
                                    self.room_group_name,
                                    {
                                        'type': 'send_game_state',
                                        'message': 'round end',
                                        'state': rooms_queue[self.room_group_name]['state']
                                        }
                                    )


                    if (rooms_queue[self.room_group_name]["ball"]["y"] - rooms_queue[self.room_group_name]["ball"]["radius"] <= 0) or (rooms_queue[self.room_group_name]["ball"]["y"] + rooms_queue[self.room_group_name]["ball"]["radius"] >= 100):
                        rooms_queue[self.room_group_name]["ball"]["vy"] *= -1
                        rooms_queue[self.room_group_name]["ball"]["ay"] = math.copysign(1, rooms_queue[self.room_group_name]["ball"]["vy"]) * 1

                if self.room_group_name in rooms_queue:
                    for cur_paddle in range(0, 2):
                        if rooms_queue[self.room_group_name]["paddles"][cur_paddle]["upState"]:
                            rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"] += -1
                        elif rooms_queue[self.room_group_name]["paddles"][cur_paddle]["downState"]:
                            rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"] += 1

                        paddle_y_end = rooms_queue[self.room_group_name]["paddles"][cur_paddle]["h"] + rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"]
                        if (rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"] <= 1) or (paddle_y_end >= 99):
                            if paddle_y_end >= 99:
                                rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"] = 99 - rooms_queue[self.room_group_name]["paddles"][cur_paddle]["h"]
                            else:
                                rooms_queue[self.room_group_name]["paddles"][cur_paddle]["y"] = 1 

                    await self.channel_layer.group_send(
                        self.room_group_name,
                            {
                                'type': 'send_game_update',
                                'message': 'obj update',
                                'obj': rooms_queue[self.room_group_name]
                                }
                        )
            await asyncio.sleep(1/120)

    async def send_game_update(self, event):
        try:
            message = event['message']
            obj = event['obj']
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'obj': obj,
                }))
        except Exception as e:
            pass
            #print(f"send_game_update::exception::{str(e)}")

    async def send_game_state(self, event):
        try:
            message = event['message']
            state = event['state']
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'state': state,
                }))
        except Exception as e:
            pass
            #print(f"send_game_state::exception::{str(e)}")

    async def send_msg(self, event):
        try:
            message = event['message']
            room_name = event['room_name']
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'message': message,
                'room_name': room_name
                }))
        except Exception as e:
            pass
            #print(f"send_msg::exception::{str(e)}")

    async def send_pair_state(self, event):
        try:
            message = event['message']
            state = event['state']
            target = event['target']
            await self.send(text_data=json.dumps({
                'msg_type': 'pair update',
                'target': target,
                'state': state,
                }))
        except Exception as e:
            pass
            #print(f"send_pair_state::exception::{str(e)}")

    async def send_pause_txt(self, event):
        try:
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'pause_txt': event['pause_txt'],
                'state': event['state'],
                }))
        except Exception as e:
            pass
            #print(f"send_pause_txt::exception::{str(e)}")

    async def send_pair_obj(self, event):
        try:
            message = event["message"]
            obj = event["obj"]
            target = event["target"]
            await self.send(text_data=json.dumps({
                'msg_type': 'pair update',
                'target': target,
                'obj': obj,
                }))
        except Exception as e:
            pass
            #print(f"send_pair_obj::exception::{str(e)}")

class GameRandom(Game):
    async def connect(self):
        #print("GameRandom::connect()")
        await self.accept()


    async def match_make(self):
        #print("GameRandom::match_make()")
        global players_queue
        global rooms_queue
        try:

            if not players_queue:
                self.room_name = f"room_{uuid.uuid4().hex}"
                self.role = "host"
                players_queue.append(self.room_name)
            else:
                self.room_name = players_queue.pop()
                self.role = "guest"

            self.room_group_name = f"game_{self.room_name}"

            await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                    )

            if self.role == "guest":
                await self.send(text_data=json.dumps({
                    'msg_type': 'server update',
                    'role': self.role,
                    }))
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'send_msg',
                            'message': 'you just got a pair',
                            'room_name': self.room_group_name,
                            }
                        )
                await self.start_match()
            else:
                await self.send(text_data=json.dumps({
                    'msg_type': 'server update',
                    'role': self.role,
                    'message': 'waiting for your pair',
                    'room_name': self.room_group_name
                    }))
                await self.init_match()

        except Exception as e:
            pass
            #print(f"GameRandom::match_make::Exception{str(e)}")
    
    async def receive(self, text_data):
        #print("GameRandom::receive()")
        global rooms_queue
        global all_players

        data = json.loads(text_data)
        message = data['message']
        target = data['target']

        if target == "server":
            if message == "self init":
                self.id = data['id']
                if self.id in all_players:
                    self.id = "mf"
                    self.send(text_data=json.dumps({
                        'msg_type': 'server update',
                        'message': 'you already playin',
                        }))
                    await self.close()
                else:
                    all_players.append(self.id)
                    ##print("-------------------------")
                    ##print("all_players::add ", all_players)
                    ##print('------------------------')
                    await self.match_make()

            elif message == "self update":
                if self.room_group_name in rooms_queue:
                    rooms_queue[self.room_group_name]["paddles"][ data['i'] ]['name'] = data['name']
                    rooms_queue[self.room_group_name]["paddles"][ data['i'] ]['id'] = data['id']
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'send_game_update',
                            'message': 'obj update',
                            'obj': rooms_queue[self.room_group_name]
                            }
                        )
            elif message == "player move":
                if self.room_group_name in rooms_queue:
                    if data['downState'] != -1:
                        rooms_queue[self.room_group_name]["paddles"][ data['i'] ]["downState"] = data['downState']
                    if data['upState'] != -1:
                        rooms_queue[self.room_group_name]["paddles"][ data['i'] ]["upState"] = data['upState']
                    await self.channel_layer.group_send(
                        self.room_group_name,
                            {
                                'type': 'send_game_update',
                                'message': 'obj update',
                                'obj': rooms_queue[self.room_group_name]
                                }
                        )
            elif message == "state update":
                if self.room_group_name in rooms_queue:
                    rooms_queue[self.room_group_name]['state'] = data['state']
        else:
            if message == "state update" and self.room_group_name in rooms_queue:
                rooms_queue[self.room_group_name]['state'] = data['state']
                if data['state'] == 3:
                    s = Timer(0.75, self.start_game_timer, ([5]))
                    s.start()
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'send_pair_state',
                            'message': message,
                            'state': data['state'],
                            'target': data['target']
                        }
                    )
            elif message == "obj update" and self.room_group_name in rooms_queue:
                rooms_queue[self.room_group_name] = data['obj']
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'send_pair_obj',
                            'message': message,
                            'obj': data['obj'],
                            'target': data['target']
                            }
                        )

class GameInvite(Game):
    async def connect(self):
        #print("GameInvite::connect()")
        await self.accept()

    async def receive(self, text_data):
        #print("GameInvite::receive()")
        global rooms_queue
        global all_players
        global predefined_players
        data = json.loads(text_data)
        message = data['message']
        target = data['target']
        if target == "server":
            if message == "self init":
                self.id = data['id']

                if self.id in all_players:
                    self.id = "mf"
                    self.send(text_data=json.dumps({
                        'msg_type': 'server update',
                        'message': 'you already playin',
                        }))
                    await self.close()
                    return
                else:
                    all_players.append(self.id)

                self.room_name = f"room_{data['room_id']}"
                self.room_group_name = f"group_{self.room_name}"
                await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name,
                        )
                if data['room_id'] not in predefined_players:
                    predefined_players.append(data['room_id'])
                    self.role = "host"
                    await self.send(text_data=json.dumps({
                        'msg_type': 'server update',
                        'role': self.role,
                        'message': 'waiting for your friend',
                        'room_name': self.room_group_name,
                        }))
                    await self.init_match()
                else:
                    self.role = "guest"
                    predefined_players.remove(data['room_id'])
                    await self.send(text_data=json.dumps({
                        'msg_type': 'server update',
                        'role': self.role,
                        }))
                    await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                'type': 'send_msg',
                                'message': 'game is ready',
                                'room_name': self.room_group_name,
                                }
                            )
                    await self.start_match()

            if message == "self update":
                if self.room_group_name in rooms_queue:
                    rooms_queue[self.room_group_name]["paddles"][ data['i'] ]['name'] = data['name']
                    rooms_queue[self.room_group_name]["paddles"][ data['i'] ]['id'] = data['id']
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'send_game_update',
                            'message': 'obj update',
                            'obj': rooms_queue[self.room_group_name]
                            }
                        )
            elif message == "player move":
                if self.room_group_name in rooms_queue:
                    if data['downState'] != -1:
                        rooms_queue[self.room_group_name]["paddles"][ data['i'] ]["downState"] = data['downState']
                    if data['upState'] != -1:
                        rooms_queue[self.room_group_name]["paddles"][ data['i'] ]["upState"] = data['upState']
                    await self.channel_layer.group_send(
                        self.room_group_name,
                            {
                                'type': 'send_game_update',
                                'message': 'obj update',
                                'obj': rooms_queue[self.room_group_name]
                                }
                        )
            elif message == "state update":
                if self.room_group_name in rooms_queue:
                    rooms_queue[self.room_group_name]['state'] = data['state']
        else:
            if message == "state update" and self.room_group_name in rooms_queue:
                rooms_queue[self.room_group_name]['state'] = data['state']
                if data['state'] == 3:
                    s = Timer(0.75, self.start_game_timer, ([5]))
                    s.start()
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'send_pair_state',
                            'message': message,
                            'state': data['state'],
                            'target': data['target']
                        }
                    )

class GameTournament(Game):
    async def connect(self):
        #print("GameTournament::connect()")
        await self.accept()

    async def disconnect(self, close_code):
        #print("GameTournament::disconnect()::", self.id if hasattr(self, "id") else "")
        global predefined_players
        global grouped_players
        global rooms_queue
        global all_players
        try:
            
            if hasattr(self, "id") and self.id in all_players:
                all_players.remove(self.id)

            if hasattr(self, "tournament"):
                if self.tournament in grouped_players:
                    grouped_players[self.tournament]['data']['attended'] -= 1
                    if hasattr(self, "id"):
                        grouped_players[self.tournament]['players'][self.id]["is_present"] = False
                    if grouped_players[self.tournament]['data']['attended'] == 0:
                        del grouped_players[self.tournament]

                await self.channel_layer.group_discard(self.tournament, self.channel_name)

            if hasattr(self, "room_group_name"):
                if self.room_group_name in predefined_players:
                    predfined_players.remove(self.room_group_name)
                if self.room_group_name in rooms_queue:
                    game_state = rooms_queue[self.room_group_name]['state']
                    rooms_queue[self.room_group_name]['state'] = 2
                    await self.channel_layer.group_send(
                            self.room_group_name, {
                                'type': 'send_game_state',
                                'message': 'game interrupt',
                                'state': rooms_queue[self.room_group_name]['state'],
                                }
                            )
                    if game_state != -1 and game_state != -2 and hasattr(self, "id"):
                        await sync_to_async(self.end_game) (self.id, "pair disconnect")

                await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        except Exception as e:
            pass
            #print( f"GameTournament::disconnect::Exception::{str(e)}")

    def end_game(self, loser_id, cause):
        #print("GameTournament::end_game()")
        global grouped_players
        global rooms_queue
        if (hasattr(self, "room_group_name") == False or hasattr(self, "tournament") == False
            or self.room_group_name not in rooms_queue or self.tournament not in grouped_players):
            async_to_sync(self.apologies) ()
            return
        try:
            rooms_queue[self.room_group_name]['state'] = 2
            async_to_sync(self.channel_layer.group_send) (
                    self.room_group_name,
                    {
                        'type': 'send_game_state',
                        'message': 'state update',
                        'state': rooms_queue[self.room_group_name]['state'],
                        }
                    )
            winner_paddle = rooms_queue[self.room_group_name]['paddles'][0]
            lost_paddle = rooms_queue[self.room_group_name]['paddles'][1]
            if loser_id == rooms_queue[self.room_group_name]['paddles'][0]['id']:
                temp_paddle = lost_paddle
                lost_paddle = winner_paddle
                winner_paddle = temp_paddle
            winner_player = grouped_players[self.tournament]['players'][winner_paddle['id']]
            lost_player = grouped_players[self.tournament]['players'][lost_paddle['id']]
            this_match = grouped_players[self.tournament]['matches'][winner_player['current_match']]
            result = {
                    'match_id': this_match['match_id'],
                    'winner_id': winner_player['id'],
                    'loser_id': lost_player['id'],
                    'winner_score': winner_paddle['score'],
                    'loser_score': lost_paddle['score'],
                    'cause': cause,
                    }
            rooms_queue[self.room_group_name]['result'] = result
            grouped_players[self.tournament]['matches'][this_match['match_id']] = rooms_queue[self.room_group_name]
            grouped_players[self.tournament]['matches'][this_match['match_id']]['result'] = result
            async_to_sync(self.channel_layer.group_send) (self.tournament, {
                'type': 'broadcast_match_result',
                'match_id': this_match['match_id'],
                'winner': winner_player['id'],
                'loser': lost_player['id'],
                'match_result': json.dumps(result),
                })
            grouped_players[self.tournament]['players'][winner_player['id']]['wins'] += 1
            grouped_players[self.tournament]['players'][winner_player['id']]['matches_played'] += 1
            grouped_players[self.tournament]['players'][lost_player['id']]['matches_played'] += 1
            grouped_players[self.tournament]['players'][winner_player['id']]['total_score'] += winner_paddle['score']
            grouped_players[self.tournament]['players'][lost_player['id']]['total_score'] += lost_paddle['score']
            grouped_players[self.tournament]['players'][lost_player['id']]['is_present'] = False
            grouped_players[self.tournament]['players'][winner_player['id']]['is_playing'] = False
            grouped_players[self.tournament]['players'][lost_player['id']]['is_playing'] = False
            async_to_sync(self.channel_layer.group_send) (self.tournament, {'type': 'broadcast_stuff'})
            self.progress_tournament(result)
        except Exception as e:
            #print(f"GameTournament::end_game::Exception::{str(e)}")
            async_to_sync(self.apologies) ()


    def progress_tournament(self, match_result):
        #print("GameTournament::progress_tournament()")
        global grouped_players
        global rooms_queue
        try:
            if hasattr(self, "tournament") == False or self.tournament not in grouped_players:
                raise Exception("no tournament whatsever")

            async_to_sync(self.channel_layer.group_send)(
                    self.tournament, {
                        'type': 'broadcast_tournament_update',
                        'message': 'you lost, and you have been eliminated from the tournament',
                        'tournament_state': "lost",
                        'target': match_result['loser_id']
                        }
                    )
            
            async_to_sync(self.channel_layer.group_send)(
                self.tournament, {
                    'type': 'broadcast_tournament_update',
                    'message': 'you won, and you are moving to the next step in tournament',
                    'tournament_state': "won",
                    'target': match_result['winner_id'],
                    }
                )

        except Exception as e:
            #print(f"GameTournament::progress_tournament::exception::{str(e)}")
            async_to_sync(self.apologies) ()
        
    def end_tournament(self, winner_id):
        #print("GameTournament::end_tournament()")
        global grouped_players
        global rooms_queue
        try:
            result = {
                    'winner': grouped_players[self.tournament]['players'][winner_id],
                    'winner_id': winner_id, 
                    }

            if hasattr(self, "group") or hasattr(self, "tid"):
                get_tournament = lambda tid: Tournament.objects.filter(id=tid).first()
                tournament = get_tournament(self.group if hasattr(self, "group") else self.tid)
                if tournament:
                    get_user = lambda id: User.objects.filter(id=id).first()
                    winner_user = get_user(winner_id)
                    if winner_user:
                        tournament.final_winner = winner_user
                    tournament.is_open = False
                    tournament.closed = "just now"
                    tournament.save()

            async_to_sync(self.channel_layer.group_send)(
                    self.tournament, {
                        'type': 'broadcast_tournament_result',
                        'result': json.dumps(result),
                        }
                    )
            async_to_sync(self.channel_layer.group_send)( self.tournament, { 'type': 'broadcast_stuff' })
            async_to_sync(self.channel_layer.group_send)(
                    self.tournament, {
                        'type': 'broadcast_msg',
                        'message': 'tournament is closed'
                        }
                    )
            raise Exception("TOURNAMENT IS ENDED")
        except Exception as e:
            #print(f"GameTournament::end_tournament::Exception::{str(e)}")
            async_to_sync(self.apologies)()

    async def winners_hall_confirmation_handler(self, request):
        #print("GameTournament::winners_hall_confirmation_handler()")
        global grouped_players
        global rooms_queue
        try:

            if request['id'] not in grouped_players[self.tournament]['winners_hall']:
                grouped_players[self.tournament]['winners_hall'].append(request['id'])

            if hasattr(self, "room_group_name"):
                if self.room_group_name in rooms_queue:
                    rooms_queue[self.room_group_name]['state'] = 2
                    try:
                        del rooms_queue[self.room_group_name]
                        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
                    except Exception as e:
                        pass
                        #print(f"GameTournament::winners_stuff::exception::{str(e)}")
                self.room_group_name = "mf"

            hall_len = len(grouped_players[self.tournament]['winners_hall'])

            if hall_len == 2:
                player1_id = grouped_players[self.tournament]['winners_hall'][0]
                player2_id = grouped_players[self.tournament]['winners_hall'][1]
                grouped_players[self.tournament]['winners_hall'].remove(player1_id)
                grouped_players[self.tournament]['winners_hall'].remove(player2_id)
                await self.init_match(player1_id, player2_id)
            elif hall_len == 1:
                on_going_matches = 0
                for i in grouped_players[self.tournament]['matches']:
                    this_match = grouped_players[self.tournament]['matches'][i]
                    if this_match['state'] != 2:
                        on_going_matches += 1

                if on_going_matches == 0:
                    await sync_to_async(self.end_tournament) (request['id'])
                    return

        except Exception as e:
            #print(f"GameTournament::winners_hall_confirmtion_handler::Exception::{str(e)}")
            return
            
    async def match_confirmation_handler(self, request):
        #print("GameTournament::match_confirmation_handler()")
        global predefined_players
        global grouped_players
        global rooms_queue
        try:
            self.role = request['role']
            self.room_group_name = request['match_id']
            await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name,
                    )
            if self.room_group_name not in predefined_players:
                predefined_players.append(self.room_group_name)
                await self.send(text_data=json.dumps({
                    'msg_type': 'server update',
                    'message': 'waiting for your pair!',
                    }))
                rooms_queue[self.room_group_name] = grouped_players[self.tournament]['matches'][self.room_group_name]
            else:
                predefined_players.remove(self.room_group_name)
                await self.channel_layer.group_send(
                        self.room_group_name, {
                            'type': 'send_msg',
                            'message': 'game is ready',
                            'room_name': self.room_group_name,
                            }
                        )
                #print("-----------    GAME IS READY!!!   --------------")
                try:
                    grouped_players[self.tournament]['players'][ rooms_queue[self.room_group_name]['paddles'][0]['id'] ]['is_playing'] = True
                    grouped_players[self.tournament]['players'][ rooms_queue[self.room_group_name]['paddles'][1]['id'] ]['is_playing'] = True
                except Exception as e:
                    pass
                    #print("GameTournament::match_confirmation_handler::Exception::WHATEVER")
                await self.start_match()

        except Exception as e:
            #print( f"GameTournament::match_confirmation_handler::Exception::{str(e)}")
            await self.apologies()
    
    def fill_players(self, tournament):
        #print("GameTournament::fill_players()")
        if not(tournament):
            #print("GameTournament::fill_players()::no_tournament")
            return
        players = tournament.players.all()
        if not(players):
            #print("GameTournament::fill_players()::no_players")
            return
        for player in players:
            if not(player):
                #print("GameTournament::fill_players()::skipping_player")
                continue
            grouped_players[self.tournament]['players'][str(player.id)] = {
                    'id': str(player.id),
                    'username': player.username,
                    'picture': str(player.picture),
                    'first_name': player.first_name,
                    'last_name': player.last_name,
                    'is_present': False,
                    'is_playing': False,
                    'total_score': 0,
                    'matches_played': 0,
                    'current_match': "",
                    'wins': 0,
                    }

    async def receive(self, text_data):
        #print("GameTournament::receive()")
        global rooms_queue
        global all_players
        global grouped_players 
        try:
            data = json.loads(text_data)
            if "message" not in data or "target" not in data:
                raise Exception("no_message/no_target")
            message = data['message']
            target = data['target']
            if target == "server":
                if message == "state update":
                    if hasattr(self, "room_group_name") and self.room_group_name in rooms_queue:
                        rooms_queue[self.room_group_name]['state'] = data['state']
                        if hasattr(self, "tournament") and self.tournament in grouped_players:
                            grouped_players[self.tournament]['matches'][self.room_group_name]['state'] = data['state']
                elif message == "match confirmation":
                    await self.match_confirmation_handler(data)
                elif message == "winners hall confirmation":
                    await self.winners_hall_confirmation_handler(data)
                elif message == "player move":
                    if hasattr(self, "room_group_name") and self.room_group_name in rooms_queue:
                        index = 0
                        if data['id'] == rooms_queue[self.room_group_name]['paddles'][1]['id']:
                            index = 1
                        if data['downState'] != -1:
                            rooms_queue[self.room_group_name]['paddles'][ index ]["downState"] = data['downState']
                        if data['upState'] != -1:
                            rooms_queue[self.room_group_name]['paddles'][ index ]['upState'] = data['upState']
                        await self.channel_layer.group_send(
                                self.room_group_name, {
                                    'type': 'send_game_update',
                                    'message': 'obj update',
                                    'obj': rooms_queue[self.room_group_name]
                                    }
                                )
                elif message == "self init":

                    if 'tid' not in data or 'id' not in data:
                        raise Exception("invalid self init syntax")

                    if data["id"] in all_players:
                        self.id = "mf"
                        self.send(text_data=json.dumps({
                            'msg_type': "server update",
                            'message': 'you already playin',
                            }))
                        await self.close()
                        return

                    get_tournament = sync_to_async(lambda tid: Tournament.objects.filter(id=tid).first(), thread_sensitive=True)
                    tournament = await get_tournament(data['tid'])

                    if not(tournament) or tournament.is_open == False:
                        raise Exception("invalid tournament id")

                    self.tid = data['tid']
                    self.id = data['id']
                    self.group = f"{str(data['tid'])}" 
                    self.tournament = f"tournament_{self.group}"

                    all_players.append(self.id)

                    await self.channel_layer.group_add(
                            self.tournament,
                            self.channel_name,
                            )

                    if self.tournament not in grouped_players:
                        grouped_players[self.tournament] = {
                                'data': {
                                    'id': str(tournament.id),
                                    'name': tournament.name,
                                    'participants': tournament.participants,
                                    'opened': str(tournament.opened),
                                    'started': tournament.started,
                                    'closed': tournament.closed,
                                    'attended': 0,
                                    'is_open': tournament.is_open,
                                    'is_full': tournament.is_full,
                                    'is_started': False,
                                    },
                                'players': {},
                                'matches': {},
                                'result': {},
                                'winners_hall': [],
                                }
                        await sync_to_async(self.fill_players)(tournament)

                    grouped_players[self.tournament]['data']['attended'] += 1
                    if self.id in grouped_players[self.tournament]['players']:
                        grouped_players[self.tournament]['players'][self.id]['is_present'] = True
                    else:
                        get_user = sync_to_async(lambda uid: User.objects.filter(id=uid).first(), thread_sensitive=True)
                        player = await get_user(self.id)
                        if not(player):
                            raise Exception("cant retrieve user")
                        grouped_players[self.tournament]['players'][self.id] = {
                                'id': str(player.id),
                                'username': player.username,
                                'picture': str(player.picture),
                                'first_name': player.first_name,
                                'last_name': player.last_name,
                                'is_present': True,
                                'is_playing': False,
                                'total_score': 0,
                                'matches_played': 0,
                                'wins': 0,
                                'current_match': "",
                                }

                    if (grouped_players[self.tournament]['data']['is_started'] == False 
                        and grouped_players[self.tournament]['data']['attended'] == grouped_players[self.tournament]['data']['participants']):
                        grouped_players[self.tournament]['data']['is_started'] = True
                        tournament.started = "just now"
                        tournament.is_open = False
                        await sync_to_async(tournament.save) ()
                        await self.channel_layer.group_send(self.tournament, {'type': 'broadcast_stuff'})
                        i = 0
                        prev_id = "" 
                        for player in grouped_players[self.tournament]['players']:
                            i = i + 1
                            if (i % 2) == 0 and len(prev_id) != 0:
                                await self.init_match(grouped_players[self.tournament]['players'][player]['id'], prev_id)
                            else:
                                prev_id = grouped_players[self.tournament]['players'][player]['id']
                    else:
                        await self.channel_layer.group_send(self.tournament, {'type': 'broadcast_stuff'})
                        await self.channel_layer.group_send(
                                self.tournament,
                                {
                                    'type': 'broadcast_msg',
                                    'message': 'waiting for all players',
                                    }
                                )
            else:
                if message == "state update" and self.room_group_name in rooms_queue:
                    rooms_queue[self.room_group_name]['state'] = data['state']
                    if data['state'] == 3:
                        s = Timer(0.75, self.start_game_timer, ([5]))
                        s.start()
                    await self.channel_layer.group_send(
                            self.room_group_name, {
                                'type': 'send_pair_state',
                                'message': message,
                                'state': data['state'],
                                'target': data['target'],
                            }
                        )

        except Exception as e:
            #print( f"GameTournament::receive::Exception::{str(e)}")
            await self.apologies()

    async def init_match(self, player1_id, player2_id):
        #print("GameTournament::init_match()::", self.id if hasattr(self, "id") else "")
        global grouped_players
        try:
            ball = {
                    'radius': 2,
                    'color': '#FFFFFF',
                    'border_touch': False,
                    'x': 50,
                    'y': 50,
                    'vx': -0.3 if self.rand(0,1) else 0.3,
                    'vy': -1 if self.rand(0,1) else 1,
                    'ax': 0,
                    'ay': 0,
                    }
            paddles = [
                    {
                        'color': '#FFFFFF',
                        'name': grouped_players[self.tournament]['players'][player1_id]['username'],
                        'id': player1_id,
                        'index': 0,
                        'score': 0,
                        'y': 10,
                        'h': 20,
                        'w': 4,
                        'upState': 0,
                        'downState': 0,
                        },
                    {
                        'color': '#FFFFFF',
                        'name': grouped_players[self.tournament]['players'][player2_id]['username'],
                        'id': player2_id,
                        'index': 1,
                        'score': 0,
                        'y': 10,
                        'h': 20,
                        'w': 4,
                        'upState': 0,
                        'downState': 0,
                        }
                    ]
            match_id = f"{uuid.uuid4().hex}"
            grouped_players[self.tournament]['players'][player1_id]['current_match'] = match_id
            grouped_players[self.tournament]['players'][player2_id]['current_match'] = match_id
            grouped_players[self.tournament]['matches'][match_id] = {
                    'match_id': match_id,
                    'ball': ball,
                    'paddles': paddles,
                    'pause_txt': "WAITING..",
                    'state': -1
                    }
            await self.channel_layer.group_send(
                    self.tournament, {
                        'type': 'broadcast_match_start',
                        'match_id': match_id,
                        'target1': player1_id,
                        'target2': player2_id,
                        'match': json.dumps(grouped_players[self.tournament]['matches'][match_id])
                        }
                    )
        except Exception as e:
            #print( f"GameTournament::init_match::Exception::{str(e)}")
            await self.apologies()
            return
    
    async def apologies(self):
        #print("GameTournament::apologies()")
        try:
            await self.send(text_data=json.dumps({
                'type': 'server update',
                'message': 'invalid tournament cridentials',
                }))
        except Exception as e:
            pass
            #print( f"GameTournament::apologies::Exception::{str(e)}")

    async def broadcast_match_start(self, event):
        #print("GameTournament::broadcast_match_start()")
        try:
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'message': 'match init',
                'match_id': event['match_id'],
                'player1': event['target1'],
                'player2': event['target2'],
                'match': event['match'],
                }))
        except Exception as e:
            pass
            #print( f"GameTournament::broadcast_match_start::Exception::{str(e)}")

    async def broadcast_tournament_result(self, event):
        #print("GameTournament::broadcast_tournament_result()")
        try:
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'message': 'tournament result',
                'tournament_result': event['result']
                }))
        except Exception as e:
            pass
            #print(f"GameTournament::broadcast_tournament_result::exception::{str(e)}")
    
    async def broadcast_match_result(self, event):
        #print("GameTournament::broadcast_match_result()")
        try:
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'message': 'match result',
                'match_id': event['match_id'],
                'winner': event['winner'],
                'loser': event['loser'],
                'match_result': event['match_result']
                }))
        except Exception as e:
            pass
            #print(f"GameTournament::broadcast_match_result::Exception::{str(e)}")

    async def broadcast_tournament_update(self, event):
        #print("GameTournament::broadcast_tournament_update()")
        try:
            await self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'message': event['message'],
                'target': event['target'],
                'tournament_state': event['tournament_state'],
                }))
        except Exception as e:
            pass
            #print(f"GameTournament::broadcast_tournament_update:exception::{str(e)}")

    async def broadcast_msg(self, event):
        await self.send(text_data=json.dumps({
            'msg_type': 'server update',
            'message': event['message'],
            }))

    async def broadcast_stuff(self, event):
        #print("GameTournament::broadcast_stuff")
        global grouped_players
        try:
            if hasattr(self, "tournament") and self.tournament in grouped_players:
                await self.send(text_data=json.dumps({
                    'msg_type': 'server update',
                    'message': 'broadcasting stuff',
                    'tournament': grouped_players[self.tournament]['data'],
                    'players': grouped_players[self.tournament]['players'],
                    'matches': grouped_players[self.tournament]['matches'],
                    }))
        except Exception as e:
            pass
            #print( f"GameTournament::broadcast_stuff::Exception::{str(e)}")
