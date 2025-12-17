import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/notification.api";

export const NotificationBell = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  if (isLoading) return <span className="p-2 opacity-50">🔔</span>;

  const notifications = data?.data ?? [];

  return (
    <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full transition-colors group">
      <span className="text-xl group-hover:scale-110 transition-transform inline-block">
        🔔
      </span>
      {notifications.length > 0 && (
        <>
          {/* Animated Ring */}
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white text-[8px] flex items-center justify-center font-bold text-white">
              {/* Optional: Only show number if it's small */}
              {notifications.length}
            </span>
          </span>
        </>
      )}
    </div>
  );
};
