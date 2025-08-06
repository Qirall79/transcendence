import { getNotifications } from "@/actions/notificationActions";
import { NotificationContext } from "@/contexts/NotificationContext";
import { RequestsContext } from "@/contexts/RequestsContext";
import { useContext, useEffect, useState } from "react";

export const useRequests = (): {
  isLoading: boolean;
  requests: any;
  setRequests: any;
  revalidateRequests: any;
} => {
  const { requests, setRequests, isLoading, revalidateRequests } =
    useContext(RequestsContext);

  return {
    requests,
    setRequests,
    isLoading,
    revalidateRequests,
  };
};
