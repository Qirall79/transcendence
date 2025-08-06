import { Link } from "react-router-dom";
import { INotification } from "types";
import moment from "moment";

export const NotificationItem = ({
  Icon,
  notification,
}: {
  Icon: any;
  notification: INotification;
}) => {
  const timeAgo = moment(notification.created_at).fromNow();

  return (
    <Link
      to={notification.link}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors block"
    >
      <div className="w-10 h-10 rounded-lg bg-black border border-gray-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white capitalize truncate">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400">{timeAgo}</p>
      </div>
    </Link>
  );
};