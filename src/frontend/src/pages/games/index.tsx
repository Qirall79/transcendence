import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function GameCenter() {
  const navigate = useNavigate();
  const [hoveredGame, setHoveredGame] = useState(null);
  
  // Game data
  const pingPongGame = {
    id: "pingpong",
    title: "PING PONG",
    emoji: "🏓",
    desc: "Test your reflexes in this classic table tennis game with single and multiplayer modes",
    color: "#6366F1",
    status: "PLAY NOW"
  };
  
  const otherGames = [
    {
      id: "tictactoe",
      title: "TIC TAC TOE",
      emoji: "⭕",
      desc: "The classic game of X's and O's with AI opponents or multiplayer",
      color: "#F59E0B",
      status: "PLAY NOW",
      route: "/dashboard/games/tictactoe",
      isPlayable: true,
      isNew: true
    },
    {
      id: "snake",
      title: "SNAKE",
      emoji: "🐍",
      desc: "Navigate a growing snake to collect food without hitting walls or yourself",
      color: "#10B981",
      status: "IN DEVELOPMENT",
      isPlayable: false
    },
    {
      id: "rock_paper_scissors",
      title: "ROCK PAPER SCISSORS",
      emoji: "✋",
      desc: "Classic hand game of chance against AI or a friend",
      color: "#EC4899",
      status: "IN DEVELOPMENT",
      isPlayable: false
    },
    {
      id: "future",
      title: "MORE GAMES",
      emoji: "🎲",
      desc: "New games coming soon",
      color: "#4B5563",
      status: "COMING SOON",
      isPlayable: false
    }
  ];
  

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">
          GAMES
        </h1>
      </div>
      
      {/* Main content */}
      <div className="px-0 w-full">
        {/* Featured Game */}
        <div 
          className="relative mb-14 h-160 w-full cursor-pointer"
          style={{
            background: hoveredGame === "pingpong" ? "#090909" : "black",
          }}
          onMouseEnter={() => setHoveredGame("pingpong")}
          onMouseLeave={() => setHoveredGame(null)}
          onClick={() => navigate('/dashboard/games/ping_pong')}
        >
          {/* Borders with neon effect */}
          <div className="absolute top-0 left-0 right-0 h-px" 
            style={{
              background: `linear-gradient(to right, transparent, ${pingPongGame.color}, transparent)`,
              opacity: hoveredGame === "pingpong" ? 1 : 0.2,
              boxShadow: hoveredGame === "pingpong" ? `0 0 10px ${pingPongGame.color}` : "none"
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px" 
            style={{
              background: `linear-gradient(to right, transparent, ${pingPongGame.color}, transparent)`,
              opacity: hoveredGame === "pingpong" ? 1 : 0.2,
              boxShadow: hoveredGame === "pingpong" ? `0 0 10px ${pingPongGame.color}` : "none"
            }}
          />
          
          {/* Content */}
          <div className="h-full w-full p-10 md:p-20 flex flex-col md:flex-row items-center">
            {/* Emoji */}
            <div className="text-10xl mb-10 md:mb-0 md:mr-24"
              style={{
                fontSize: "180px",
                transform: hoveredGame === "pingpong" ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.3s"
              }}
            >
              {pingPongGame.emoji}
            </div>
            
            {/* Game info */}
            <div className="text-center md:text-left max-w-full">
              <div className="inline-flex px-5 py-2 mb-8 border text-sm rounded-full"
                style={{
                  borderColor: hoveredGame === "pingpong" ? pingPongGame.color : "rgba(255,255,255,0.2)"
                }}
              >
                FEATURED GAME
              </div>
              
              <h2 className="text-6xl font-bold mb-8"
                style={{
                  color: hoveredGame === "pingpong" ? pingPongGame.color : "white",
                  letterSpacing: "0.1em"
                }}
              >
                {pingPongGame.title}
              </h2>
              
              <p className="text-gray-400 mb-12 max-w-4xl text-2xl">
                {pingPongGame.desc}
              </p>
              
              <button className="px-16 py-5 flex items-center gap-4 text-2xl"
                style={{
                  backgroundColor: hoveredGame === "pingpong" ? pingPongGame.color : "transparent",
                  border: `2px solid ${pingPongGame.color}`,
                  color: hoveredGame === "pingpong" ? "black" : pingPongGame.color
                }}
              >
                PLAY NOW
                <ExternalLink className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
        
        {/* More Games */}
        <h3 className="text-xl font-bold mb-6 text-white/80 px-6">MORE GAMES</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {otherGames.map(game => (
            <div 
              key={game.id}
              className="relative p-6 cursor-pointer h-64"
              style={{
                background: hoveredGame === game.id ? "#090909" : "black",
                transition: "background 0.3s",
                opacity: game.isPlayable ? 1 : 0.7
              }}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => game.route && navigate(game.route)}
            >
              {/* Borders */}
              <div className="absolute top-0 left-0 right-0 h-px" 
                style={{
                  background: `linear-gradient(to right, transparent, ${game.color}, transparent)`,
                  opacity: hoveredGame === game.id ? 1 : 0.2
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-px" 
                style={{
                  background: `linear-gradient(to right, transparent, ${game.color}, transparent)`,
                  opacity: hoveredGame === game.id ? 1 : 0.2
                }}
              />
              
              {/* NEW Badge */}
              {game.isNew && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
              
              {/* Content */}
              <div className="flex flex-col items-center text-center h-full">
                <div className="text-5xl mb-4">
                  {game.emoji}
                </div>
                
                <h3 className="text-xl font-medium mb-2" 
                  style={{
                    color: hoveredGame === game.id ? game.color : "white"
                  }}
                >
                  {game.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-auto">
                  {game.desc}
                </p>
                
                {game.isPlayable ? (
                  <button 
                    className="px-6 py-2 mt-2 flex items-center gap-2 text-sm rounded"
                    style={{
                      backgroundColor: hoveredGame === game.id ? game.color : "transparent",
                      border: `2px solid ${game.color}`,
                      color: hoveredGame === game.id ? "black" : game.color
                    }}
                  >
                    {game.status}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="px-4 py-1 border rounded-full text-xs mt-2"
                    style={{
                      borderColor: game.id === "future" ? game.color : "#4B5563",
                      color: game.id === "future" ? game.color : "#4B5563"
                    }}
                  >
                    {game.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}