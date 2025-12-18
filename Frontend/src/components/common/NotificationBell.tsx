import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/notification.api";
export const NotificationBell = () => {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const notifications = data?.data ?? [];

  return (
    <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full transition-colors group">
      {notifications.length > 0 && (
        <div>
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white text-[8px] flex items-center justify-center font-bold text-white">
              {notifications.length}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
