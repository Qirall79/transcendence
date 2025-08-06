import { GamingButton } from "@/components/ui/gaming/button";
import {
  addFriend,
  deleteFriend,
  deleteInvite,
  acceptFriend,
} from "@/actions/userActions";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { UserPlus, UserMinus, UserX, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRequests } from "@/hooks/useRequests";
import { useFriends } from "@/hooks/useFriends";
import { useConversations } from "@/hooks/useConversations";

export const FriendshipButton = ({ profile, setProfile }) => {
  const { setUser } = useUser();
  const { revalidateRequests } = useRequests();
  const { revalidateFriends } = useFriends();
  const { revalidateConversations } = useConversations();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    const action = e.currentTarget.getAttribute("data-action");
    setIsLoading(true);
    let res;

    try {
      if (action === "invite") {
        res = await addFriend(profile.id, () => setUser(null));
        setProfile({
          ...profile,
          invite: 2,
        });
      } else if (action === "delete" || action === "decline") {
        res = await deleteInvite(profile.id, () => setUser(null));
        setProfile({
          ...profile,
          invite: 0,
        });
      } else if (action === "accept") {
        res = await acceptFriend(profile.id, () => setUser(null));
        setProfile({
          ...profile,
          invite: 0,
          is_friend: true,
        });
      } else if (action === "remove") {
        res = await deleteFriend(profile.id, () => setUser(null));
        setProfile({
          ...profile,
          invite: 0,
          is_friend: false,
        });
      }

      revalidateRequests();
      revalidateFriends();
      revalidateConversations();

      if (!res?.status) {
        throw new Error("Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (profile.is_blocked) return null;

  const LoadingSpinner = () => <Loader2 className="w-4 h-4 animate-spin" />;

  if (profile.is_friend) {
    return (
      <GamingButton
        onClick={handleClick}
        data-action="remove"
        variant="outline"
        className="gap-2 text-sm md:text-base px-2 md:px-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <UserMinus className="w-4 h-4" />
            <span className="hidden sm:inline">Remove Friend</span>
            <span className="sm:hidden">Remove</span>
          </>
        )}
      </GamingButton>
    );
  }

  if (!profile.invite) {
    return (
      <GamingButton
        onClick={handleClick}
        data-action="invite"
        className="gap-2 text-sm md:text-base px-2 md:px-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Send Friend Request</span>
            <span className="sm:hidden">Add</span>
          </>
        )}
      </GamingButton>
    );
  }

  if (profile.invite === 1) {
    return (
      <div className="flex gap-2">
        <GamingButton
          onClick={handleClick}
          data-action="accept"
          className="gap-1 text-sm px-2 md:px-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Accept
            </>
          )}
        </GamingButton>
        <GamingButton
          onClick={handleClick}
          data-action="decline"
          variant="outline"
          className="gap-1 text-sm px-2 md:px-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner />
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

  return (
    <GamingButton
      onClick={handleClick}
      data-action="delete"
      variant="outline"
      className="gap-2 text-sm md:text-base px-2 md:px-4"
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserX className="w-4 h-4" />
          <span className="hidden sm:inline">Cancel Request</span>
          <span className="sm:hidden">Cancel</span>
        </>
      )}
    </GamingButton>
  );
};
