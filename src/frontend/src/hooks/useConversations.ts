import { getNotifications } from "@/actions/notificationActions";
import { ConversationsContext } from "@/contexts/ConversationsContext";
import { FriendsContext } from "@/contexts/FriendsContext";
import { NotificationContext } from "@/contexts/NotificationContext";
import { RequestsContext } from "@/contexts/RequestsContext";
import { useContext, useEffect, useState } from "react";

export const useConversations = (): {
  isLoading: boolean;
  conversations: any;
  setConversations: any;
  revalidateConversations: any;
} => {
  const {
    conversations,
    setConversations,
    isLoading,
    revalidateConversations,
  } = useContext(ConversationsContext);

  return {
    conversations,
    setConversations,
    isLoading,
    revalidateConversations,
  };
};
