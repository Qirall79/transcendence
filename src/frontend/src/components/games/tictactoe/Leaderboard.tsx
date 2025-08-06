import React, { useState, useEffect } from "react";
import { Fetcher } from "@/utils/Fetcher";
import { useUser } from "@/hooks/useUser";
import Loader from "@/components/ui/Loader";

const TicTacToeLeaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await Fetcher.get("/api/tictactoe/leaderboard/", () => setUser(null));
        const data = await response.json();

        if (data.results) {
          setPlayers(data.results);
        } else {
          setPlayers(data);
        }
      } catch (err) {
        setError("Could not load leaderboard ⚠️");
      } finally {
        setLoading(false);
      }
    };

    getLeaderboard();
  }, []);

  const getMedalEmoji = (position) => {
    if (position === 0) return "🥇";
    if (position === 1) return "🥈";
    if (position === 2) return "🥉";
    return null;
  };

  if (!user) return <></>;

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4 text-white">Top Players 🏆</h2>
        <div className="flex justify-center items-center py-8">
          <Loader size={24} text="Loading ..." color="text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4 text-white">Top Players 🏆</h2>
        <div className="text-center text-red-400 p-4">{error}</div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4 text-white">Top Players 🏆</h2>
        <div className="text-center text-gray-400 p-4">No players found</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4 text-white">Top Players 🏆</h2>

      <div className="space-y-3">
        {players.map((player, index) => {
          if (!player || !player.user) return null;

          const isMe = player.user?.id === user?.id;
          const medalEmoji = getMedalEmoji(index);

          return (
            <div
              key={player.id}
              className={`flex items-center p-3 rounded-lg ${
                isMe
                  ? "bg-black border border-gray-700"
                  : "bg-black border border-gray-800"
              }`}
            >
              {medalEmoji && (
                <div className="flex-shrink-0 text-xl mr-2">{medalEmoji}</div>
              )}

              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-black border border-gray-800 rounded-lg flex items-center justify-center overflow-hidden mr-3">
                {player.user.picture ? (
                  <img
                    src={player.user.picture}
                    alt={player.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-white">
                  {player.user.username}
                  {isMe && (
                    <span className="ml-1 text-xs text-gray-400">(Me)</span>
                  )}
                </p>
                <div className="text-xs text-gray-400 flex items-center">
                  <span className="whitespace-nowrap truncate">
                    🎮 {player.games_played} games
                  </span>
                  <span className="mx-1">|</span>
                  <span className="whitespace-nowrap truncate">
                    🏅 {player.wins} wins
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 text-right ml-2">
                <p className="font-bold text-lg">{player.win_rate}%</p>
                <p className="text-xs text-gray-400">Win Rate</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicTacToeLeaderboard;
