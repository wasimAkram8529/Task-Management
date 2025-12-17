import { Navigate, Outlet } from "react-router-dom"; // Import Outlet
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: any) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Use Outlet if no children are passed (standard for nested routes)
  return children ? children : <Outlet />;
};
