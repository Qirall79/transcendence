import { getLeaderBoard } from "@/actions/userActions";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";

export const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {setUser} = useUser()

  const fetchLeaderBoard = async () => {
    const res = await getLeaderBoard(() => setUser(null));
    if (res?.leaderboard) setLeaderBoard(res.leaderboard);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium">LeaderBoard</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center">
            <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-3"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16 rounded bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center">
        <button
          onClick={() => history.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <h1 className="mx-auto text-lg font-medium">
          LeaderBoard
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {leaderBoard.map((user, i) => {
          return (
            <div
              className="border border-gray-800 rounded p-3 flex justify-between items-center"
              key={i}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {i < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border border-gray-800 flex items-center justify-center text-xs">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </div>
                  )}
                  <div className="w-10 h-10 bg-gray-800 rounded-full overflow-hidden">
                    {user.picture ? (
                      <img src={user.picture} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
                    )}
                  </div>
                </div>
                <p className="font-medium">{user.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Score:</span>
                <span className="font-bold text-white">{user.total_score}</span>
              </div>
            </div>
          );
        })}

        {leaderBoard.length === 0 && (
          <div className="text-center p-6 border border-gray-800 rounded">
            <p className="text-gray-400">No leaderboard data available</p>
          </div>
        )}
      </div>
    </div>
  );
};