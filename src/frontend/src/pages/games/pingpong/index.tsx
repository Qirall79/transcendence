import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const PingPong = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const modes = [
    {
      id: "local",
      title: "LOCAL",
      emoji: "🎮",
      desc: "2 PLAYERS - SAME DEVICE",
      color: "#10B981",
      action: () => navigate(`/offline`),
    },
    {
      id: "online",
      title: "ONLINE",
      emoji: "🌐",
      desc: "REAL-TIME MULTIPLAYER",
      color: "#6366F1",
      action: () =>
        navigate(`/dashboard/games/ping_pong/online?id=${user?.id}&mode=random`),
    },
    {
      id: "tournament",
      title: "TOURNAMENT",
      emoji: "🏆",
      desc: "COMPETE FOR THE TROPHY",
      color: "#F59E0B",
      action: () => navigate("/dashboard/games/ping_pong/tournaments"),
    },
  ];

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translate(-70%, -50%); }
        50% { transform: translate(70%, -50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col"
      style={{ paddingBottom: "120px" }}
    >
      {/* Header */}
      <div className="p-4 flex items-center relative">
        <button
          onClick={() => navigate("/dashboard/games")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>BACK</span>
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-white">
          PING PONG
        </h1>

        <Link className="absolute right-4" to='/dashboard/games/ping_pong/leaderboard'>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white">
            <Trophy className="w-5 h-5" />            
            <span>LEADERBOARD</span>
          </button>
        </Link>
      </div>

      {/* Game selection */}
      <div className="flex-1 flex flex-col md:flex-row ">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className="flex-1 flex items-center justify-center cursor-pointer relative"
            style={{
              background: active === mode.id ? "#090909" : "black",
              flex: active === mode.id ? 1.3 : 1,
              transition: "all 0.5s ease",
            }}
            onClick={mode.action}
            onMouseEnter={() => setActive(mode.id)}
            onMouseLeave={() => setActive(null)}
          >
            {/* Border lines */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${mode.color}, transparent)`,
                opacity: active === mode.id ? 1 : 0.2,
              }}
            />
            <div
              className="absolute bottom-0 left-1/4 right-1/4 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${mode.color}, transparent)`,
                opacity: active === mode.id ? 1 : 0.2,
              }}
            />

            {/* Corner decorations */}
            <div
              className="absolute top-0 left-0 w-20 h-20 opacity-50"
              style={{
                borderTop: `2px solid ${
                  active === mode.id ? mode.color : "rgba(255,255,255,0.1)"
                }`,
                borderLeft: `2px solid ${
                  active === mode.id ? mode.color : "rgba(255,255,255,0.1)"
                }`,
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-20 h-20 opacity-50"
              style={{
                borderBottom: `2px solid ${
                  active === mode.id ? mode.color : "rgba(255,255,255,0.1)"
                }`,
                borderRight: `2px solid ${
                  active === mode.id ? mode.color : "rgba(255,255,255,0.1)"
                }`,
              }}
            />

            {/* Ping pong animation (only shown when active) */}
            {active === mode.id && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-10">
                <div className="relative w-full h-full">
                  <div className="absolute left-1/4 top-1/2 h-16 w-4 rounded-full bg-white -translate-y-1/2 -rotate-12" />
                  <div className="absolute right-1/4 top-1/2 h-16 w-4 rounded-full bg-white -translate-y-1/2 rotate-12" />
                  <div
                    className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
                    style={{ animation: "bounce 4s infinite ease-in-out" }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col items-center text-center z-10 p-8">
              <div
                className="text-6xl mb-6"
                style={{
                  transform: active === mode.id ? "scale(1.2)" : "scale(1)",
                }}
              >
                {mode.emoji}
              </div>

              <h3
                className="text-3xl font-bold mb-4"
                style={{
                  color: active === mode.id ? mode.color : "white",
                  letterSpacing: "0.2em",
                }}
              >
                {mode.title}
              </h3>

              <p
                className="text-xs mb-10"
                style={{
                  opacity: active === mode.id ? 1 : 0.6,
                  letterSpacing: "0.1em",
                }}
              >
                {mode.desc}
              </p>

              <button
                className="px-10 py-3 text-sm"
                style={{
                  backgroundColor:
                    active === mode.id ? mode.color : "transparent",
                  border: `1px solid ${mode.color}`,
                  color: active === mode.id ? "black" : mode.color,
                  letterSpacing: active === mode.id ? "0.3em" : "0.2em",
                  transition: "all 0.5s ease",
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

export { PingPong as PingPongHub };
export default PingPong;
