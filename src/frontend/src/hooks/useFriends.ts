import { getNotifications } from "@/actions/notificationActions";
import { FriendsContext } from "@/contexts/FriendsContext";
import { NotificationContext } from "@/contexts/NotificationContext";
import { RequestsContext } from "@/contexts/RequestsContext";
import { useContext, useEffect, useState } from "react";

export const useFriends = (): {
  isLoading: boolean;
  friends: any;
  setFriends: any;
  revalidateFriends: any;
} => {
  const { friends, setFriends, isLoading, revalidateFriends } =
    useContext(FriendsContext);

  return {
    friends,
    setFriends,
    isLoading,
    revalidateFriends,
  };
};
