import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { TaskSection } from "../components/dashboard/TaskSection";
import { logout } from "../api/auth.api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { data, isLoading } = useDashboard();

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

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Main Container: Stack on mobile, row on tablet+ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Branding & User Welcome */}
            <div className="flex items-center justify-between md:block">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Project Hub
                </h1>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  Welcome, <span className="text-blue-600">{user?.name}</span>
                </p>
              </div>

              {/* Mobile-only Logout (Optional: small icon or text link) */}
              <button
                onClick={handleLogout}
                className="md:hidden text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
            </div>

            {/* Action Buttons: 2-column grid on mobile, row on tablet+ */}
            <div className="grid grid-cols-2 md:flex items-center gap-2">
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

              {/* Desktop-only Logout (Hidden on mobile via 'hidden md:block') */}
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

      {/* CONTENT */}
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
