import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { TaskSection } from "../components/dashboard/TaskSection";
import { logout } from "../api/auth.api";
import { getNotifications, readNotifications } from "../api/notification.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Bell, BellDot } from "lucide-react";
import LoadingScreen from "../components/common/LoadingScreen";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { data, isLoading } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: showNotifications,
  });

  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      readNotifications().then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    }
  }, [showNotifications]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowWakeUpMessage(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowWakeUpMessage(false);
    }
  }, [isLoading]);

  if (showWakeUpMessage) return <LoadingScreen />;

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
        <div className="text-slate-500 font-medium animate-pulse">
          Loading workspace...
        </div>
      </div>
    );
  }

  const { assigned, created, overdue } = data.data;
  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between md:block">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Task Management System
                </h1>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  Welcome, <span className="text-blue-600">{user?.name}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 md:hidden">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  {unreadCount > 0 ? (
                    <BellDot className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Bell className="w-6 h-6" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute left-4 right-4 top-20 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 md:hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">
                        Notifications
                      </h3>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                        {unreadCount} New
                      </span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n: any) => (
                          <div
                            key={n._id}
                            className="p-4 border-b border-slate-50"
                          >
                            <p className="text-sm text-slate-700">
                              {n.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button onClick={handleLogout} className="...">
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:flex items-center gap-2">
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
                >
                  {unreadCount > 0 ? (
                    <BellDot className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">
                        Notifications
                      </h3>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                        {unreadCount} New
                      </span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                      {notifications.length > 0 ? (
                        notifications.map((n: any) => (
                          <div
                            key={n._id}
                            className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-2 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-slate-400">
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-center border border-slate-100"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/tasks")}
                className="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700 rounded-xl transition-all text-center"
              >
                Workspace
              </button>

              <div className="hidden md:block h-6 w-[1px] bg-slate-200 mx-1" />
              <button
                onClick={handleLogout}
                className="hidden md:block px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-16">
        <div className="space-y-12">
          <TaskSection title="Overdue Tasks" tasks={overdue} variant="danger" />
          <TaskSection title="Assigned to Me" tasks={assigned} />
          <TaskSection title="Created by Me" tasks={created} />
        </div>
      </main>
    </div>
  );
}
