import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { GamingButton } from "@/components/ui/gaming/button";
import {
  Trophy,
  Swords,
  Medal,
  Settings as SettingsIcon,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMatches } from "@/actions/userActions";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

// Stat card for showing user stats
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-black border border-gray-800 rounded-lg p-3">
    <div className="flex items-center gap-2">
      <div className="bg-black p-2 rounded-md">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

// Match result card
export const RecentMatch = (match) => {
  const user = match.user;
  const userTag = match?.player1?.id == user?.id ? "player1" : "player2";
  const opponentTag = userTag == "player1" ? "player2" : "player1";
  const isWon = match?.winner?.id == user?.id;

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-3">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div
            className={`w-1 rounded-full ${
              isWon ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isWon ? "text-green-400" : "text-red-400"}`}>
                {isWon ? "Win 🏆" : "Loss ❌"}
              </span>
            </div>
            <p className="text-white capitalize">
              vs{" "}
              {match[opponentTag]
                ? match[opponentTag].username
                : "Deleted user"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white">
            {JSON.stringify(match.winner_score)} :{" "}
            {JSON.stringify(match.loser_score)}
          </p>
          <p className="text-sm text-gray-400">
            {moment(match?.played_at).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Sample data
  const stats = [
    { icon: Trophy, label: "Total Wins", value: user ? user?.wins : "" },
  ];

  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    const res = await getMatches(() => setUser(null));
    setMatches(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="relative">
        <div className="h-40 rounded-lg bg-black border border-gray-800 overflow-hidden">
        </div>

        <div className="relative -mt-16 px-4 pb-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-24 h-24 rounded-lg bg-black border border-gray-800 p-1">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <img
                    src={user?.picture}
                    alt={user?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {user?.username}
                </h1>
                <p className="text-gray-400">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>

            <Link to={"/dashboard/settings"}>
              <GamingButton variant="outline" className="gap-1">
                <SettingsIcon className="w-4 h-4" />
                Settings
              </GamingButton>
            </Link>
          </div>

          <div className="flex gap-4 mt-4 overflow-x-auto pb-1 border-b border-gray-800">
            {["overview", "matches"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {activeTab === "overview" ? (
          <>
            <div className="mb-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">
                Recent Matches
              </h2>
              {isLoading ? (
                <div className="flex flex-col space-y-4">
                  <Skeleton className="w-full h-20 rounded-md" />
                  <Skeleton className="w-full h-20 rounded-md" />
                  <Skeleton className="w-full h-20 rounded-md" />
                  <Skeleton className="w-full h-20 rounded-md" />
                </div>
              ) : matches?.length == 0 ? (
                <div className="text-center p-6 border border-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">
                    You have no matches yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.slice(0, 3).map((match, index) => (
                    <RecentMatch key={index} {...match} user={user} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-white mb-2">All Matches 🎮</h2>
            {isLoading ? (
              <div className="flex flex-col space-y-4">
                <Skeleton className="w-full h-20 rounded-md" />
                <Skeleton className="w-full h-20 rounded-md" />
                <Skeleton className="w-full h-20 rounded-md" />
                <Skeleton className="w-full h-20 rounded-md" />
              </div>
            ) : matches?.length == 0 ? (
              <div className="text-center p-6 border border-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">You have no matches yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <RecentMatch key={index} {...match} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}