import { useEffect, useState } from "react";
import { IProfile } from "types";
import { ProfileButtons } from "./ProfileButtons";
import { Trophy } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { getUserMatches } from "@/actions/userActions";
import { useUser } from "@/hooks/useUser";
import { RecentMatch } from "@/pages/Profile";

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

export const UserProfile = ({
  profile,
  setProfile,
}: {
  profile: IProfile;
  setProfile: any;
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUser();

  const stats = [{ icon: Trophy, label: "Wins", value: "128" }];

  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    const res = await getUserMatches(profile.id, () => setUser(null));
    setMatches(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="h-40 rounded-lg bg-black border border-gray-800 overflow-hidden"></div>

        <div className="relative flex flex-col items-center -mt-16 px-4 pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center md:flex-row md:items-end gap-4">
            <div className="w-28 h-28 rounded-lg bg-black border border-gray-800 p-1">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img
                  src={profile?.picture}
                  alt={profile?.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">
                {profile?.username}
              </h1>
              <p className="text-gray-400">
                {profile?.first_name} {profile?.last_name}
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <ProfileButtons profile={profile} setProfile={setProfile} />
          </div>
        </div>

        {!profile.is_blocked && (
          <div className="flex gap-4 px-4 overflow-x-auto border-b border-gray-800">
            {["overview", "matches"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {!profile.is_blocked && (
        <div className="px-4">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
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
                      <RecentMatch key={index} {...match} user={profile} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "matches" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-2">
                All Matches 🎮
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-3"></div>
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : matches?.length == 0 ? (
                <div className="text-center p-6 border border-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">
                    User has no matches yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <RecentMatch key={index} {...match} user={profile} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
