import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { getNotifications } from "@/actions/notificationActions";
import { useRequests } from "@/hooks/useRequests";
import { useFriends } from "@/hooks/useFriends";
import { useConversations } from "@/hooks/useConversations";
import { Skeleton } from "@/components/ui/skeleton";

export const NotificationContext = createContext<any>({});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, isLoading } = useUser();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { revalidateRequests } = useRequests();
  const { setFriends } = useFriends();
  const { revalidateConversations } = useConversations();

  const fetchData = async () => {
    const response = await getNotifications(() => setUser(null));
    setNotifications(response?.notifications);
    setIsNotificationLoading(false);
  };

  const updateOnline = (id: string, status: string) => {
    revalidateConversations();

    setFriends((oldFriends: any[]) => {
      const newFriends = oldFriends.map((f) => {
        if (f.id === id)
          return {
            ...f,
            is_online: status === "online",
          };
        return f;
      });

      return newFriends;
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user?.id || socketRef.current || isNotificationLoading || isLoading) {
      return;
    }

    socketRef.current = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/notifications/${user.id}/`
    );

    socketRef.current.onopen = (e: Event) => {
      setIsConnected(true);
    };

    socketRef.current.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);

      if (data.body?.message) {
        const { message, type } = data.body;

        if (message.includes("sent you a friend request")) {
          revalidateRequests();
        } else if (type === "online" || type === "offline") {
          updateOnline(message, type);
        } else if (type == "message") {
          revalidateConversations();
        } else {
          toast.success(message);
          setUser((oldUser) => ({
            ...oldUser,
            unseen_notifications_count: oldUser.unseen_notifications_count + 1,
          }));

          setNotifications((oldValues) => {
            return [data.body, ...oldValues];
          });
        }
      }
    };

    socketRef.current.onclose = (e: CloseEvent) => {
      setIsConnected(false);
      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isLoading, isNotificationLoading]);

  if (isLoading || (user?.id && isNotificationLoading)) {
    return (
      <div className="w-screen h-screen flex flex-col space-y-6 overflow-hidden">
        <Skeleton className="w-full h-20" />
        <div className="w-full flex h-[90%] space-x-4">
          <Skeleton className="w-1/5 h-full" />
          <Skeleton className="flex-1 h-full" />
        </div>
      </div>
    );
  }

  return (
    <NotificationContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        setNotifications,
        notifications,
        isLoading: isNotificationLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
