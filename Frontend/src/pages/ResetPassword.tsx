import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resetPassword } from "../api/auth.api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await resetPassword(token!, data.password);
      navigate("/login", {
        state: { message: "Password updated successfully!" },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-full mb-4">
            <span className="text-xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Reset Password
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Please choose a strong new password to secure your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
              New Password
            </label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
