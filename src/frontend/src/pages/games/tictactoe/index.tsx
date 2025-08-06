import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LocalTicTacToe from './LocalTicTacToe';
import OnlineTicTacToe from './OnlineTicTacToe';
import Header from '@/components/games/tictactoe/Header';

const TicTacToePage = () => {
  const [gameMode, setGameMode] = useState('none');
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(null);
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('room');
  
  const modes = [
    {
      id: 'offline',
      title: "LOCAL",
      emoji: "❌",
      desc: "2 PLAYERS - SAME DEVICE",
      color: "#F87171", 
      action: () => setGameMode('offline')
    },
    {
      id: 'online',
      title: "ONLINE",
      emoji: "⭕",
      desc: "REAL-TIME MULTIPLAYER",
      color: "#60A5FA", 
      action: () => {
        if (roomIdParam) {
          navigate('/dashboard/games/tictactoe', { replace: true });
        }
        setGameMode('online');
      }
    }
  ];
  
  useEffect(() => {
    if (roomIdParam) {
      setGameMode('online');
    }
  }, [roomIdParam]);
  
  const handleBackToMenu = () => {
    if (roomIdParam) {
      navigate('/dashboard/games/tictactoe', { replace: true });
    }
    setGameMode('none');
  };

  const handleViewHistory = () => {
    navigate('/dashboard/games/tictactoe/history');
  };

  const handleBackToGames = () => {
    navigate('/dashboard/games');
  };
  
  if (gameMode !== 'none') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header 
          title={`TIC TAC TOE ${gameMode === 'online' ? '- ONLINE' : '- LOCAL'}`}
          onBack={handleBackToMenu}
          onViewHistory={handleViewHistory}
        />
        
        <div className="flex-1 flex justify-center items-center p-4">
          {gameMode === 'offline' ? (
            <LocalTicTacToe onBackToMenu={handleBackToMenu} />
          ) : (
            <OnlineTicTacToe onBackToMenu={handleBackToMenu} />
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">      
      <Header 
        title="TIC TAC TOE"
        onBack={handleBackToGames}
        onViewHistory={handleViewHistory}
      />
      
      <div className="flex-1 flex flex-col md:flex-row">
        {modes.map(mode => (
          <div 
            key={mode.id}
            className="flex-1 flex items-center justify-center cursor-pointer relative"
            style={{
              background: activeMode === mode.id ? '#090909' : 'black',
              transition: 'all 0.5s ease'
            }}
            onClick={mode.action}
            onMouseEnter={() => setActiveMode(mode.id)}
            onMouseLeave={() => setActiveMode(null)}
          >
            <div className="absolute top-0 left-1/4 right-1/4 h-px" 
              style={{ 
                background: `linear-gradient(to right, transparent, ${mode.color}, transparent)`,
                opacity: activeMode === mode.id ? 1 : 0.2 
              }}
            />
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px" 
              style={{ 
                background: `linear-gradient(to right, transparent, ${mode.color}, transparent)`,
                opacity: activeMode === mode.id ? 1 : 0.2 
              }}
            />
            
            <div className="flex flex-col items-center text-center z-10 p-8">
              <div className="text-6xl mb-6">
                {mode.emoji}
              </div>
              
              <h3 className="text-3xl font-bold mb-4" 
                style={{
                  color: activeMode === mode.id ? mode.color : 'white',
                }}
              >
                {mode.title}
              </h3>
              
              <p className="text-xs mb-10 text-gray-400"> 
                {mode.desc}
              </p>
              
              <button 
                className="px-10 py-3 text-sm"
                style={{
                  backgroundColor: activeMode === mode.id ? mode.color : 'transparent',
                  border: `1px solid ${mode.color}`,
                  color: activeMode === mode.id ? 'black' : mode.color,
                }}
              >
                PLAY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToePage;