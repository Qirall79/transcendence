import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { useSearchParams, useNavigate } from "react-router-dom";
import Status from "@/components/games/tictactoe/Status";
import Board from "@/components/games/tictactoe/Board";
import Actions from "@/components/games/tictactoe/Actions";
import MatchmakingUI from "@/components/games/tictactoe/MatchmakingUI";

const OnlineTicTacToe = ({ onBackToMenu }) => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomIdParam = searchParams.get("room");

  const [gameState, setGameState] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [status, setStatus] = useState("Connecting to game server...");
  const [roomId, setRoomId] = useState(roomIdParam || "");
  const [inMatchmaking, setInMatchmaking] = useState(false);
  const [readyForNewGame, setReadyForNewGame] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    const wsUrl = roomId
      ? `${import.meta.env.VITE_WS_URL}/tictactoe/${user?.id}/?room=${roomId}`
      : `${import.meta.env.VITE_WS_URL}/tictactoe/${
          user?.id
        }/?mode=matchmaking`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      if (!roomId) {
        ws.send(JSON.stringify({ action: "find_match" }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleSocketMessage(data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      setStatus("Connection to game server lost. Please try again.");
    };

    ws.onerror = (error) => {
      setStatus("Connection error");
    };

    return () => {
      if (socketRef.current && socketRef.current.readyState === 1) {
        socketRef.current.close();
      }
    };
  }, [user?.id, roomId, roomIdParam, navigate]);

  const handleSocketMessage = (data) => {
    switch (data.action) {
      case "connection_established":
        setStatus("Connected to server");
        break;

      case "matchmaking_queued":
        setInMatchmaking(true);
        setStatus("Finding an opponent...");
        break;

      case "matchmaking_cancelled":
        setInMatchmaking(false);
        setStatus("Matchmaking cancelled");
        break;

      case "waiting_for_opponent":
        setPlayerSymbol(data.your_symbol);
        setGameState(data.game_state);
        setStatus("Waiting for opponent to join...");
        break;

      case "game_started":
        setRoomId(data.room_id || roomId);
        setPlayerSymbol(data.your_symbol);
        setGameState(data.game_state);
        setIsMyTurn(data.is_your_turn);
        setInMatchmaking(false);
        setReadyForNewGame(false);
        setOpponentDisconnected(false);

        if (data.room_id && !roomIdParam) {
          navigate(`/dashboard/games/tictactoe?room=${data.room_id}`, {
            replace: true,
          });
        }

        setStatus(data.is_your_turn ? "Your turn" : "Opponent's turn");
        break;

      case "move_made":
        setGameState(data.game_state);
        setIsMyTurn(data.is_your_turn);

        if (data.game_state.state === "playing") {
          setStatus(data.is_your_turn ? "Your turn" : "Opponent's turn");
        } else if (data.game_state.state === "ended") {
          if (data.game_state.winner === "draw") {
            setStatus("Game ended in a draw!");
          } else if (data.game_state.winner === data.your_symbol) {
            setStatus("You won!");
          } else {
            setStatus("You lost!");
          }
        }
        break;

      case "player_disconnected":
        setGameState(data.game_state);
        setOpponentDisconnected(true);
        setStatus("Opponent disconnected.");
        break;

      case "player_ready":
        updatePlayerReadyState(data);
        break;

      case "error":
        setStatus(`Error: ${data.message}`);
        break;
    }
  };

  const updatePlayerReadyState = (data) => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const newState = { ...prevState };
      if (!newState.ready_for_new_game) {
        newState.ready_for_new_game = { X: false, O: false };
      }

      newState.ready_for_new_game[data.symbol] = true;

      if (newState.ready_for_new_game.X && newState.ready_for_new_game.O) {
        setStatus("Both players ready! Starting new game...");
      } else if (data.symbol !== playerSymbol) {
        setStatus("Opponent is ready for a new game. Waiting for you...");
      } else {
        setStatus("Waiting for opponent to be ready...");
      }

      return newState;
    });
  };

  const handleClick = (index) => {
    if (
      !gameState ||
      gameState.state !== "playing" ||
      !isMyTurn ||
      gameState.board[index] !== null ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        action: "make_move",
        position: index,
      })
    );
  };

  const cancelMatchmaking = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(JSON.stringify({ action: "cancel_matchmaking" }));
  };

  const playAgain = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      window.location.reload();
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        action: "player_ready",
        symbol: playerSymbol,
      })
    );

    setReadyForNewGame(true);

    const opponentSymbol = playerSymbol === "X" ? "O" : "X";
    const isOpponentReady = gameState?.ready_for_new_game?.[opponentSymbol];

    if (isOpponentReady) {
      setStatus("Both players ready! Starting new game...");
    } else {
      setStatus("Waiting for opponent to be ready...");
    }

    setGameState((prevState) => {
      if (!prevState) return null;

      const newState = { ...prevState };
      if (!newState.ready_for_new_game) {
        newState.ready_for_new_game = { X: false, O: false };
      }
      newState.ready_for_new_game[playerSymbol] = true;
      return newState;
    });
  };

  const findNewOpponent = () => {
    navigate("/dashboard/games/tictactoe", { replace: true });
    window.location.reload();
  };

  const createDisabledSquares = () => {
    if (!gameState || !gameState.board) return [];

    return gameState.board.map((value, index) => {
      return gameState.state !== "playing" || !isMyTurn || value !== null;
    });
  };

  const getGameActions = () => {
    if (opponentDisconnected) {
      return [
        {
          label: "Find New Opponent",
          onClick: findNewOpponent,
          color: "blue",
          primary: true,
        },
        {
          label: "Back to Menu",
          onClick: onBackToMenu,
          color: "gray",
        },
      ];
    }

    if (gameState?.state === "ended") {
      const opponentSymbol = playerSymbol === "X" ? "O" : "X";
      const isOpponentReady = gameState?.ready_for_new_game?.[opponentSymbol];

      const actions = [];

      if (!readyForNewGame && isOpponentReady) {
        actions.push({
          label: "Play Again (Opponent is Ready)",
          onClick: playAgain,
          color: "green",
          primary: true,
        });
      } else if (readyForNewGame) {
        actions.push({
          label: "Ready ✓",
          onClick: () => {},
          disabled: true,
          color: "blue",
        });
      } else {
        actions.push({
          label: "Play Again (Same Opponent)",
          onClick: playAgain,
          color: "blue",
          primary: true,
        });
      }

      actions.push({
        label: "Find New Opponent",
        onClick: findNewOpponent,
        color: "purple",
      });

      return actions;
    }

    return [
      {
        label: "Back to Menu",
        onClick: onBackToMenu,
        color: "gray",
      },
    ];
  };

  if (opponentDisconnected) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-6 p-6 bg-gray-900 rounded-lg shadow-lg">
        <span className="text-6xl">😕</span>
        <h2 className="text-2xl font-bold text-center">
          Opponent Disconnected
        </h2>
        <p className="text-center text-gray-300">
          {gameState?.state === "ended" && gameState?.winner === playerSymbol
            ? "You won by forfeit!"
            : "Your opponent left the game."}
        </p>

        <Actions actions={getGameActions()} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {gameState && (
        <Status
          scoreX={gameState.score?.X || 0}
          scoreO={gameState.score?.O || 0}
          playerXName={gameState.players.X?.username || "Player X"}
          playerOName={gameState.players.O?.username || "Player O"}
          isGameOver={gameState.state === "ended"}
          statusText={status}
          currentTurn={
            isMyTurn ? playerSymbol : playerSymbol === "X" ? "O" : "X"
          }
          isXReady={gameState.ready_for_new_game?.X || false}
          isOReady={gameState.ready_for_new_game?.O || false}
          isXCurrentUser={playerSymbol === "X"}
          isOCurrentUser={playerSymbol === "O"}
        />
      )}

      {!gameState && !inMatchmaking && (
        <div className="text-xl font-bold text-white mb-6 text-center">
          {status}
        </div>
      )}

      {inMatchmaking && <MatchmakingUI onCancel={cancelMatchmaking} />}

      {gameState && !inMatchmaking && (
        <Board
          board={gameState.board}
          onSquareClick={handleClick}
          disabledSquares={createDisabledSquares()}
        />
      )}

      <Actions actions={getGameActions()} />
    </div>
  );
};

export default OnlineTicTacToe;
