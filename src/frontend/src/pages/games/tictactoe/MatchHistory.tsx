import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Fetcher } from "@/utils/Fetcher";
import TicTacToeLeaderboard from "@/components/games/tictactoe/Leaderboard";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/ui/Loader";

// Simple stat card component
const StatCard = ({ emoji, value, label }) => (
  <div className="border border-gray-800 rounded p-4 bg-black">
    <div className="text-2xl mb-2">{emoji}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);

const MatchHistory = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load match history
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get match history
        const matchResponse = await Fetcher.get("/api/tictactoe/matches/", () => setUser(null));
        const matchData = await matchResponse.json();

        if (matchData.results) {
          setMatches(matchData.results);
        } else {
          setMatches(matchData);
        }

        // Get player stats
        const statsResponse = await Fetcher.get("/api/tictactoe/stats/", () => setUser(null));
        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load match history:", err);
        setError("Could not load your match history ⚠️");
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Format date to be more readable
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      " · " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Check if the current user won the match
  const getMatchResult = (match) => {
    if (!match) return "unknown";
    if (match.is_draw) return "draw";
    if (!match.winner) return "unknown";
    return match.winner.id === user?.id ? "win" : "loss";
  };

  // Get opponent for a match
  const getOpponent = (match) => {
    if (!match?.player1 || !match?.player2) {
      return { username: "Unknown Player" };
    }

    return match.player1.id === user?.id ? match.player2 : match.player1;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center">
        <button
          onClick={() => navigate("/dashboard/games/tictactoe")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="mx-auto text-lg font-medium">Match History</h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size={32} text="Loading matches..." color="text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard emoji="🏆" value={stats.wins} label="WINS" />
                <StatCard emoji="❌" value={stats.losses} label="LOSSES" />
                <StatCard emoji="🤝" value={stats.draws} label="DRAWS" />
                <StatCard
                  emoji="📊"
                  value={`${stats.win_rate}%`}
                  label="WIN RATE"
                />
              </div>
            )}

            {/* Match history and leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Match History */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-medium mb-4">Recent Matches</h2>

                {!matches || matches.length === 0 ? (
                  <div className="text-center p-6 border border-gray-800 rounded">
                    <p className="text-gray-400 mb-4">No matches found</p>
                    <button
                      onClick={() => navigate("/dashboard/games/tictactoe")}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded"
                    >
                      Play Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match) => {
                      if (!match) return null;

                      const result = getMatchResult(match);
                      const opponent = getOpponent(match);

                      // Set display based on result
                      let resultEmoji, resultColor, resultText;

                      if (result === "win") {
                        resultEmoji = "🏆";
                        resultColor = "text-green-400";
                        resultText = "Victory";
                      } else if (result === "loss") {
                        resultEmoji = "❌";
                        resultColor = "text-red-400";
                        resultText = "Defeat";
                      } else if (result === "draw") {
                        resultEmoji = "🤝";
                        resultColor = "text-yellow-400";
                        resultText = "Draw";
                      } else {
                        resultEmoji = "❓";
                        resultColor = "text-gray-400";
                        resultText = "Unknown";
                      }

                      return (
                        <div
                          key={match.id}
                          className="border border-gray-800 rounded p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                              {opponent.picture ? (
                                <img
                                  src={opponent.picture}
                                  alt={opponent.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>👤</span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {opponent.username}
                                </p>
                                <span className={`text-xs ${resultColor}`}>
                                  {resultEmoji} {resultText}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatDate(match.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-1">
                <TicTacToeLeaderboard />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;
