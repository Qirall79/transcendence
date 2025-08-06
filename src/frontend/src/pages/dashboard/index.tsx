import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getStats } from "@/actions/userActions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const StatCard = ({ title, value, emoji, color }) => (
  <div
    className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 ${color}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>

    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
      <div
        className={`absolute rotate-45 bg-white/5 w-24 h-4 -translate-y-4 translate-x-4 group-hover:translate-x-2 transition-all duration-500`}
      ></div>
    </div>

    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center animate-pulse-slow">
      <span className="text-3xl translate-y-0.5">{emoji}</span>
    </div>

    <div className="relative z-10">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
        {title}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {value}
        </span>
      </div>

      <div className="mt-3 h-px w-16 bg-gradient-to-r from-white/10 to-transparent"></div>
    </div>
  </div>
);

export default function Dashboard() {
  const [performanceHistory, setPerformanceHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rank, setRank] = useState(0);
  const { user, setUser } = useUser();

  const fetchStats = async () => {
    const res = await getStats(() => setUser(null));
    if (res) {
      setRank(res.rank);

      if (res.matches && Array.isArray(res.matches)) {
        // Calculate total wins/losses from the matches
        const totalWins = user?.wins || 0;
        const totalLosses = (user?.games_played || 0) - (user?.wins || 0);

        if (res.matches.length === 1) {
          res.matches[0].wins = totalWins;
          res.matches[0].losses = totalLosses;
        }
      }


      setPerformanceHistory(res.matches);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const userInfo = {
    rating: user?.total_score || 0,
    totalMatches: user?.games_played || 0,
    wins: user?.wins || 0,
    losses: (user?.games_played || 0) - (user?.wins || 0),
    winRate:
      !user || user?.games_played === 0
        ? "0%"
        : Math.round((user?.wins / user?.games_played) * 100) + "%",
    rank: rank || "N/A",
  };

  const customTooltipStyle = {
    borderRadius: "8px",
    padding: "8px 12px",
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 h-24"
              />
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Performance History</h3>
            </div>
            <div className="h-72">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Current Rating"
            value={userInfo.rating}
            emoji="📊"
            color="bg-gradient-to-br from-black to-indigo-950/30 border border-indigo-900/30"
          />
          <StatCard
            title="Global Rank"
            value={`#${userInfo.rank}`}
            emoji="🏆"
            color="bg-gradient-to-br from-black to-amber-950/30 border border-amber-900/30"
          />
          <StatCard
            title="Total Matches"
            value={userInfo.totalMatches}
            emoji="🎮"
            color="bg-gradient-to-br from-black to-blue-950/30 border border-blue-900/30"
          />
          <StatCard
            title="Win Rate"
            value={userInfo.winRate}
            emoji="✨"
            color="bg-gradient-to-br from-black to-emerald-950/30 border border-emerald-900/30"
          />
        </div>

        <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-white">
              Performance History 📈
            </h3>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-gray-300">Wins 🏆</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">Losses 😬</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-black/40 rounded-lg p-4 text-center border border-white/5">
              <div className="text-5xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-green-400">
                {userInfo.wins}
              </div>
              <div className="text-sm text-gray-400">Total Wins</div>
            </div>

            <div className="bg-black/40 rounded-lg p-4 text-center border border-white/5">
              <div className="text-5xl mb-2">😬</div>
              <div className="text-3xl font-bold text-red-500">
                {userInfo.losses}
              </div>
              <div className="text-sm text-gray-400">Total Losses</div>
            </div>

            <div className="bg-black/40 rounded-lg p-4 text-center border border-white/5">
              <div className="text-5xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-indigo-400">
                {userInfo.rating}
              </div>
              <div className="text-sm text-gray-400">Power Score</div>
            </div>
          </div>

          {/* Bar Chart - Performance History */}
          <div className="h-80 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceHistory} barGap={8} barSize={24}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.5)"
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  formatter={(value, name) => {
                    if (name === "wins") {
                      return [`${value} 🏆`, "Wins"];
                    } else if (name === "losses") {
                      return [`${value} 😬`, "Losses"];
                    }
                    return [value, name];
                  }}
                />
                <Bar
                  dataKey="wins"
                  name="Wins"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="losses"
                  name="Losses"
                  fill="#F93C57"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full h-px bg-white/10 my-6"></div>

          <div className="mt-6">
            <h3 className="font-medium text-lg text-white text-center mb-6">
              Win/Loss Ratio 📊
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie

                    data={[
                      { name: "Wins 🏆", value: userInfo.wins },
                      { name: "Losses 😬", value: userInfo.losses },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#F93C57" />
                  </Pie>
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    formatter={(value, name) => [`${value} matches`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
