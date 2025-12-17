import { useForm } from "react-hook-form";
import { forgotPassword } from "../api/auth.api";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await forgotPassword(data.email);
      setIsSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Forgot Password?
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Enter your email and we'll send you a secure reset link.
          </p>
        </div>

        {isSent ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="text-emerald-600 font-bold mb-2">
              Check your inbox!
            </div>
            <p className="text-emerald-700 text-sm">
              If an account exists for that email, you will receive a reset link
              shortly.
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 text-sm font-bold text-emerald-700 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                Email Address
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
