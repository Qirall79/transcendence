import React from 'react';
import { User } from 'lucide-react';

type GameStatusProps = {
  scoreX: number;
  scoreO: number;
  playerXName?: string;
  playerOName?: string;
  isGameOver: boolean;
  statusText: string;
  currentTurn?: 'X' | 'O' | null;
  isXReady?: boolean;
  isOReady?: boolean;
  isXCurrentUser?: boolean;
  isOCurrentUser?: boolean;
};

const Status = ({
  scoreX, 
  scoreO, 
  playerXName = 'Player 1',
  playerOName = 'Player 2',
  isGameOver,
  statusText,
  currentTurn,
  isXReady = false,
  isOReady = false,
  isXCurrentUser = false,
  isOCurrentUser = false
}: GameStatusProps) => {
  
  const renderPlayerAvatar = (symbol: 'X' | 'O') => {
    const isCurrentPlayer = (symbol === 'X' && isXCurrentUser) || (symbol === 'O' && isOCurrentUser);
    const borderColor = symbol === 'X' ? 'border-red-500' : 'border-blue-500';
    const iconColor = symbol === 'X' ? 'text-red-400' : 'text-blue-400';
    const isReady = symbol === 'X' ? isXReady : isOReady;
    
    return (
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full bg-gray-800 border-2 ${borderColor} flex items-center justify-center mb-1 ${isReady ? 'ring-2 ring-green-500' : ''}`}>
          <User className={`w-8 h-8 ${iconColor}`} />
        </div>
        <div className="text-sm font-medium">
          {symbol === 'X' ? playerXName : playerOName}
          {isCurrentPlayer && <span className="ml-1">(You)</span>}
          {isReady && <span className="ml-1 text-green-500">✓</span>}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-4xl font-bold mb-2">
            X: {scoreX}
          </div>
          {renderPlayerAvatar('X')}
        </div>
        
        <div className="text-center text-2xl uppercase tracking-wider">
          {isGameOver ? 'GAME OVER' : (currentTurn ? `${currentTurn}'S TURN` : 'GAME IN PROGRESS')}
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-blue-500 text-4xl font-bold mb-2">
            O: {scoreO}
          </div>
          {renderPlayerAvatar('O')}
        </div>
      </div>
      
      <div className="text-xl font-bold text-white mb-6 text-center">
        {statusText}
      </div>
    </>
  );
};

export default Status;