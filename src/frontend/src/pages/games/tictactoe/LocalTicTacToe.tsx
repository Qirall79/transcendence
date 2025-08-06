import React, { useState } from 'react';
import Status from '@/components/games/tictactoe/Status';
import Board from '@/components/games/tictactoe/Board';
import Actions from '@/components/games/tictactoe/Actions';

const LocalTicTacToe = ({ onBackToMenu }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [gameNumber, setGameNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    
    return null;
  };
  
  const isBoardFull = (squares) => squares.every(square => square !== null);
  
  const handleClick = (i) => {
    if (gameOver) return;
    
    const winner = calculateWinner(squares);
    if (winner || squares[i]) return;
    
    const newSquares = [...squares];
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    
    const newWinner = calculateWinner(newSquares);
    if (newWinner) {
      const newScore = {...score};
      newScore[newWinner]++;
      setScore(newScore);
      setGameOver(true);
    } else if (isBoardFull(newSquares)) {
      setGameOver(true);
    }
    
    setIsXNext(!isXNext);
  };
  
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setGameNumber(gameNumber + 1);
    setGameOver(false);
  };
  
  const getStatus = () => {
    const winner = calculateWinner(squares);
    
    if (winner) return `${winner} Wins!`;
    if (isBoardFull(squares)) return 'Game ended in a draw!';
    return `${isXNext ? 'X' : 'O'}'s Turn`;
  };
  
  const disabledSquares = squares.map((value, index) => {
    return gameOver || value !== null;
  });
  
  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <Status 
        scoreX={score.X}
        scoreO={score.O}
        isGameOver={gameOver}
        statusText={getStatus()}
        currentTurn={isXNext ? 'X' : 'O'}
      />
      
      <Board 
        board={squares}
        onSquareClick={handleClick}
        disabledSquares={disabledSquares}
      />
      
      <Actions 
        actions={[
          {
            label: gameOver ? 'Play Again' : 'Reset Game',
            onClick: resetGame,
            primary: true
          },
          {
            label: 'Back to Menu',
            onClick: onBackToMenu,
            color: 'gray'
          }
        ]}
      />
    </div>
  );
};

export default LocalTicTacToe;