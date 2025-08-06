import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useRequests } from "@/hooks/useRequests";
import { useFriends } from "@/hooks/useFriends";
import {
  Users,
  Search,
  MessageSquare,
  UserPlus,
  Check,
  X,
  UserMinus,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  acceptFriend,
  deleteInvite,
  deleteFriend,
} from "@/actions/userActions";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";

const FriendCard = ({ friend, onAction }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-800">
            <img
              src={friend.picture}
              alt={friend.username}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => navigate(`/dashboard/users/${friend.id}`)}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black border border-gray-800 p-[2px]">
            <div
              className={`w-full h-full rounded-full ${
                friend.is_online ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{friend.username}</p>
          <div className="flex items-center gap-1.5">
            {friend.status === "in_game" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <p className="text-xs text-gray-400 truncate">Playing Game</p>
              </>
            ) : friend.is_online ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-xs text-gray-400">Online</p>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <p className="text-xs text-gray-400">Offline</p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => navigate(`/dashboard/chat/${friend.id}`)}
            className="p-1.5 rounded-lg bg-black border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAction("remove", friend.id)}
            className="p-1.5 rounded-lg bg-black border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-900"
          >
            <UserMinus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestCard = ({ request, onAction }) => (
  <div className="bg-black border border-gray-800 rounded-lg p-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-800">
        <img
          src={request.picture}
          alt={request.username}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{request.username}</p>
        <p className="text-xs text-gray-400">Friend request</p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onAction("accept", request.id)}
          className="px-3 py-1.5 rounded-lg bg-black border border-green-900 text-green-500 text-sm hover:bg-green-900/20"
        >
          <span className="flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Accept
          </span>
        </button>
        <button
          onClick={() => onAction("decline", request.id)}
          className="px-3 py-1.5 rounded-lg bg-black border border-gray-800 text-gray-400 text-sm hover:border-red-900 hover:text-red-400"
        >
          <span className="flex items-center">
            <X className="w-3 h-3 mr-1" />
            Decline
          </span>
        </button>
      </div>
    </div>
  </div>
);

export default function FriendsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();
  const { requests, setRequests } = useRequests();
  const { friends, setFriends, revalidateFriends } = useFriends();
  const { revalidateConversations } = useConversations();

  useEffect(() => {
    revalidateFriends();
  }, []);

  const handleAction = async (action, id) => {
    setLoading(true);

    try {
      if (action === "accept") {
        const res = await acceptFriend(id, () => setUser(null));
        if (res.status === "success") {
          toast.success("Request accepted");
          setRequests((prev) => prev.filter((req) => req.id !== id));
          revalidateFriends();
          revalidateConversations();
        }
      }

      if (action === "decline") {
        const res = await deleteInvite(id, () => setUser(null));
        if (res.status === "success") {
          toast.success("Request declined");
          setRequests((prev) => prev.filter((req) => req.id !== id));
        }
      }

      if (action === "remove") {
        const res = await deleteFriend(id, () => setUser(null));
        if (res.status === "success") {
          toast.success("Friend removed");
          setFriends((prev) => prev.filter((friend) => friend.id !== id));
        }
      }
    } catch (error) {
      toast.error("Error");
    }

    setLoading(false);
  };

  const filtered = friends.filter((friend) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="p-4 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Friends</h1>
      </div>

      <div className="p-4 space-y-4 pt-0">
        <div className="relative w-full ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 px-9 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
          />
        </div>
        <div className="flex border-b border-gray-800">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "friends"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends ({friends.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "requests"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Requests ({requests.length})
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
          </div>
        )}

        <div className="space-y-3">
          {activeTab === "friends" && !loading && (
            <>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 border border-gray-800 rounded-lg bg-black">
                  <Users className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-gray-400">No friends found</p>
                </div>
              )}
            </>
          )}
          {activeTab === "requests" && !loading && (
            <>
              {requests.length > 0 ? (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 border border-gray-800 rounded-lg bg-black">
                  <UserPlus className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-gray-400">No friend requests</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
