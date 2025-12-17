import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth.schema";
import type { RegisterFormData } from "../schemas/auth.schema";
import { registerUser } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-500 mt-2">
            Join us to start managing your tasks
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Full Name
            </label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 
                ${
                  errors.name
                    ? "border-red-200 focus:ring-red-50 focus:border-red-400"
                    : "border-slate-200 focus:ring-blue-50 focus:border-blue-500"
                }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

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
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Password
            </label>
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
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Get Started"
            )}
          </button>

          {/* Login Link */}
          <p className="text-sm text-center text-slate-500 pt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* Footer text */}
      <p className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
        &copy; 2025 Task Manager
      </p>
    </div>
  );
}
