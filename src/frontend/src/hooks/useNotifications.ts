import { getNotifications } from "@/actions/notificationActions";
import { NotificationContext } from "@/contexts/NotificationContext";
import { useContext, useEffect, useState } from "react";
import { INotification } from "types";

export const useNotifications = (): {
  isLoading: boolean;
  notifications: INotification[];
  setNotifications: any;
} => {
  const { notifications, setNotifications, isLoading } =
    useContext(NotificationContext);

  return {
    notifications,
    setNotifications,
    isLoading,
  };
};
