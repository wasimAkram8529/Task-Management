import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schema";
import type { LoginFormData } from "../schemas/auth.schema";
import { loginUser } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth();

  if (user) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    if (user && !loading) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginUser(data);
      setUser(res.data);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Invalid credentials");
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 mt-2">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@company.com"
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 
                ${
                  errors.email
                    ? "border-red-200 focus:ring-red-50 focus:border-red-400"
                    : "border-slate-200 focus:ring-blue-50 focus:border-blue-500"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 
                ${
                  errors.password
                    ? "border-red-200 focus:ring-red-50 focus:border-red-400"
                    : "border-slate-200 focus:ring-blue-50 focus:border-blue-500"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer Link */}
          <p className="text-sm text-center text-slate-500 pt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>

      {/* Subtle Copyright/Footer text outside card */}
      <p className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
        &copy; 2025 Task Manager
      </p>
    </div>
  );
}
