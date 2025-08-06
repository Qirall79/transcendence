import {
  blockUser,
  unblockUser,
  addFriend,
  deleteFriend,
  deleteInvite,
  acceptFriend,
} from "@/actions/userActions";
import {
  send_game_invite,
  delete_game_invite,
  accept_game_invite,
} from "@/actions/gameActions";
import { GamingButton } from "@/components/ui/gaming/button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import {
  Shield,
  ShieldOff,
  Loader2,
  MoreVertical,
  UserPlus,
  UserMinus,
  UserX,
  Check,
  X,
  Flag,
  Sword,
  Swords,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import { useRequests } from "@/hooks/useRequests";
import { useFriends } from "@/hooks/useFriends";
import { useConversations } from "@/hooks/useConversations";

export const ProfileButtons = ({
  profile,
  setProfile,
}: {
  profile: any;
  setProfile: any;
}) => {
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { revalidateRequests } = useRequests();
  const { revalidateFriends } = useFriends();

  const handleAction = async (action: string) => {
    setIsLoading(true);
    setShowActions(false);

    try {
      let res;
      switch (action) {
        case "block":
          res = await blockUser(profile.id, () => setUser(null));
          setProfile({
            ...profile,
            is_blocked: true,
            is_friend: false,
            game_invite: 0,
            invite: 0,
          });
          break;
        case "unblock":
          res = await unblockUser(profile.id, () => setUser(null));
          setProfile({ ...profile, is_blocked: false, game_invite: 0 });
          break;
        case "add_friend":
          res = await addFriend(profile.id, () => setUser(null));
          setProfile({ ...profile, invite: 2 });
          break;
        case "remove_friend":
          res = await deleteFriend(profile.id, () => setUser(null));
          setProfile({ ...profile, is_friend: false, invite: 0 });
          break;
        case "cancel_request":
          res = await deleteInvite(profile.id, () => setUser(null));
          setProfile({ ...profile, invite: 0 });
          break;
        case "accept_request":
          res = await acceptFriend(profile.id, () => setUser(null));
          setProfile({ ...profile, is_friend: true, invite: 0 });
          break;
        case "decline_request":
          res = await deleteInvite(profile.id, () => setUser(null));
          setProfile({ ...profile, invite: 0 });
          break;
        case "game_invite":
          res = await send_game_invite(profile.id, () => setUser(null));
          setProfile({ ...profile, game_invite: 2 });
          break;
        case "cancel_game_invite":
          res = await delete_game_invite(profile.id, () => setUser(null));
          setProfile({ ...profile, game_invite: 0 });
          break;
        case "decline_game_invite":
          res = await delete_game_invite(profile.id, () => setUser(null));
          setProfile({ ...profile, game_invite: 0 });
          break;
        case "accept_game_invite":
          res = await accept_game_invite(profile.id, () => setUser(null));
          setProfile({ ...profile, game_invite: 0 });
          break;
      }

      revalidateRequests();
      revalidateFriends();

      if (!res?.status) {
        throw new Error("Action failed");
      }

      const messages = {
        block: "User blocked",
        unblock: "User unblocked",
        add_friend: "Friend request sent",
        remove_friend: "Friend removed",
        cancel_request: "Request cancelled",
        accept_request: "Request accepted",
        decline_request: "Request declined",
        game_invite: "Game request sent",
        cancel_game_invite: "Game request canceled",
        decline_game_invite: "Game request declined",
        accept_game_invite: "Game request accepted, hang in there",
      };
      toast.success(messages[action]);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const getGameButton = () => {
    if (profile.game_invite === 0) {
      return (
        <GamingButton
          onClick={() => handleAction("game_invite")}
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sword className="w-4 h-4" />
              Challenge
            </>
          )}
        </GamingButton>
      );
    } else if (profile.game_invite === 2) {
      return (
        <GamingButton
          onClick={() => handleAction("cancel_game_invite")}
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <X className="w-4 h-4" />
              Cancel challenge
            </>
          )}
        </GamingButton>
      );
    } else if (profile.game_invite === 1) {
      return (
        <div className="flex flex-col lg:flex-row gap-2">
          <GamingButton
            onClick={() => handleAction("accept_game_invite")}
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Swords className="w-4 h-4" />
                Accept Challenge
              </>
            )}
          </GamingButton>
          <GamingButton
            onClick={() => handleAction("decline_game_invite")}
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <X className="w-4 h-4" />
                Decline Challenge
              </>
            )}
          </GamingButton>
        </div>
      );
    }
    return null;
  };

  const getFriendButton = () => {
    if (profile.is_friend) {
      return (
        <GamingButton
          onClick={() => handleAction("remove_friend")}
          className="gap-2"
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserMinus className="w-4 h-4" />
              Friends
            </>
          )}
        </GamingButton>
      );
    }

    if (profile.invite === 1) {
      return (
        <div className="flex gap-2">
          <GamingButton
            onClick={() => handleAction("accept_request")}
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Accept
              </>
            )}
          </GamingButton>
          <GamingButton
            onClick={() => handleAction("decline_request")}
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <X className="w-4 h-4" />
                Decline
              </>
            )}
          </GamingButton>
        </div>
      );
    }

    if (profile.invite === 2) {
      return (
        <GamingButton
          onClick={() => handleAction("cancel_request")}
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserX className="w-4 h-4" />
              Pending
            </>
          )}
        </GamingButton>
      );
    }

    return (
      <GamingButton
        onClick={() => handleAction("add_friend")}
        className="gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Add Friend
          </>
        )}
      </GamingButton>
    );
  };

  if (profile.is_blocked) {
    return (
      <GamingButton
        onClick={() => handleAction("unblock")}
        className="gap-2"
        variant="outline"
        disabled={isLoading}
      >
        Unblock
      </GamingButton>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {getFriendButton()}
      {getGameButton()}

      <div className="relative">
        <GamingButton
          variant="outline"
          size="icon"
          onClick={() => setShowActions(!showActions)}
          className="relative z-10"
        >
          <MoreVertical className="w-4 h-4" />
        </GamingButton>

        {showActions && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowActions(false)}
            />

            <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden backdrop-blur-xl bg-black/50 border border-white/10 shadow-xl z-20">
              <div className="p-1 space-y-1">
                <button
                  className="w-full px-3 py-2 text-sm hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
                  onClick={() =>
                    handleAction(profile.is_blocked ? "unblock" : "block")
                  }
                >
                  {profile.is_blocked ? (
                    <>
                      <ShieldOff className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Unblock</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">Block</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
