import { updateNotifications } from "@/actions/notificationActions";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useUser";
import { Trophy } from "lucide-react";
import { useEffect } from "react";
import { NotificationItem } from "./NotificationItem";
import { Skeleton } from "../ui/skeleton";
import Loader from "../ui/Loader";

export const NotificationDropDown = ({ isVisible }: { isVisible: boolean }) => {
  const { setUser } = useUser();
  const { notifications, isLoading } = useNotifications();

  const markNotificationAsSeen = async () => {
    await updateNotifications(() => setUser(null));
  };

  useEffect(() => {
    if (isVisible) {
      setUser((oldUser) => ({ ...oldUser, unseen_notifications_count: 0 }));
      markNotificationAsSeen();
    }
  }, [isVisible]);

  if (!notifications) return <></>;

  return (
    isVisible && (
      <div className="bg-black border border-gray-800 rounded-lg shadow-lg">
        <div className="p-3 border-b border-gray-800">
          <h3 className="text-sm font-medium text-white">Notifications</h3>
        </div>

        {isLoading ? (
          <div className="flex flex-col space-y-2 p-3">
         <div className="border border-gray-800 rounded-lg p-6">
          <Loader size={32} text="Loading section..." color="text-purple-500" />
        </div>
          </div>
        ) : (
          <div className="max-h-[350px] overflow-y-auto p-1">
            {notifications?.length === 0 ? (
              <div className="text-center py-6 px-4">
                <p className="text-gray-400">No notifications</p>
              </div>
            ) : (
              notifications?.map((n, index) => (
                <NotificationItem key={index} Icon={Trophy} notification={n} />
              ))
            )}
          </div>
        )}
      </div>
    )
  );
};
