import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Check,
  X,
  MessageSquare,
  Trophy,
  Gamepad2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRequests } from "@/hooks/useRequests";
import { acceptFriend, deleteInvite } from "@/actions/userActions";
import { useUser } from "@/hooks/useUser";
import { useFriends } from "@/hooks/useFriends";
import { useConversations } from "@/hooks/useConversations";

export const FriendsList = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [friendsTab, setFriendsTab] = useState("all");
  const {
    friends,
    setFriends,
    isLoading: isFriendsLoading,
    revalidateFriends,
  } = useFriends();
  const { requests, setRequests, isLoading: isRequestsLoading } = useRequests();
  const { revalidateConversations } = useConversations();

  const handleAcceptFriend = async (requestId) => {
    try {
      const res = await acceptFriend(requestId, () => setUser(null));
      if (res.status === "success") {
        toast.success("Friend request accepted!");
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        revalidateFriends();
        revalidateConversations();
      }
    } catch (error) {
      toast.error("Failed to accept friend request");
    }
  };

  const handleDeclineFriend = async (requestId) => {
    try {
      const res = await deleteInvite(requestId, () => setUser(null));
      if (res.status === "success") {
        toast.success("Friend request declined");
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
      }
    } catch (error) {
      toast.error("Failed to decline friend request");
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/dashboard/users/${userId}`);
  };

  if (isFriendsLoading || isRequestsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex gap-2">
        <button
          onClick={() => setFriendsTab("all")}
          className={`flex-1 py-2 rounded-lg ${
            friendsTab === "all"
              ? "bg-black border border-gray-700 text-white"
              : "bg-black border border-gray-800 text-gray-400 hover:border-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFriendsTab("online")}
          className={`flex-1 py-2 rounded-lg ${
            friendsTab === "online"
              ? "bg-black border border-gray-700 text-white"
              : "bg-black border border-gray-800 text-gray-400 hover:border-gray-700"
          }`}
        >
          Online
        </button>
        <button
          onClick={() => setFriendsTab("requests")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
            friendsTab === "requests"
              ? "bg-black border border-gray-700 text-white"
              : "bg-black border border-gray-800 text-gray-400 hover:border-gray-700"
          }`}
        >
          Requests
          {requests.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-red-500 text-xs">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {friendsTab === "requests" && requests.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              PENDING REQUESTS — {requests.length}
            </h3>
            {requests.map((request, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg bg-black border border-gray-800"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src={request.picture}
                    alt={request.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {request.username}
                  </p>
                  <p className="text-sm text-gray-400">{"2 min ago"}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleAcceptFriend(request.id)}
                    className="p-1.5 rounded-lg bg-black border border-green-900 text-green-500"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeclineFriend(request.id)}
                    className="p-1.5 rounded-lg bg-black border border-red-900 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(friendsTab === "all" || friendsTab === "online") && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              ONLINE — {friends.filter((f) => f.is_online).length}
            </h3>
            {friends
              .filter((f) => (friendsTab === "online" ? f.is_online : true))
              .map((friend, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-black/40 border border-transparent hover:border-gray-800"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-800">
                      <img
                        src={friend.picture}
                        alt={friend.username}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleViewProfile(friend.id)}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black border border-gray-800 p-[2px]">
                      <div
                        className={`w-full h-full rounded-full ${
                          friend.is_online
                            ? "bg-green-500"
                            : friend.status === "in_game"
                            ? "bg-gray-400"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate group-hover:text-gray-300">
                      {friend.username}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {friend.status === "in_game" && (
                        <>
                          <Gamepad2 className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-400 truncate">
                            {friend.currentGame}
                          </span>
                        </>
                      )}
                      {friend.status === "online" && (
                        <span className="text-sm text-gray-400">Online</span>
                      )}
                      {friend.status === "offline" && friend.lastSeen && (
                        <span className="text-sm text-gray-400">
                          Last seen {friend.lastSeen}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <button className="p-1.5 rounded-lg bg-black border border-gray-800 text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    {friend.status === "online" && (
                      <button
                        onClick={() => toast.success("Invite sent!")}
                        className="p-1.5 rounded-lg bg-black border border-gray-800 text-gray-400"
                      >
                        <Trophy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {friendsTab === "requests" && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <UserPlus className="w-10 h-10 mb-3" />
            <p>No pending friend requests</p>
          </div>
        )}

        {friendsTab === "online" &&
          friends.filter((f) => f.is_online).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="w-10 h-10 mb-3" />
              <p>No friends online</p>
            </div>
          )}
      </div>
    </div>
  );
};
