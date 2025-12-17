import { NotificationBell } from "../common/NotificationBell";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../api/auth.api";

export const AppLayout = ({ children }: any) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between">
        <h1 className="font-bold">Task Manager</h1>
        <NotificationBell />
        <div className="flex gap-4 items-center">
          <span className="text-sm">{user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-600">
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </>
  );
};
