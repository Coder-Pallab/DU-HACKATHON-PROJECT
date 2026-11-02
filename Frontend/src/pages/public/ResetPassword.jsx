import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, GraduationCap, Lock } from "lucide-react";
import { authService } from "../../services/authService";
import { getApiErrorMessage } from "../../services/apiClient";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token.trim()) {
      setError("Enter the password reset token.");
      return;
    }
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError("Password must contain at least 8 characters, including a letter and a number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await authService.resetPassword(token.trim(), password);
      navigate("/login", {
        replace: true,
        state: { message: "Password reset successfully. Sign in with your new password." },
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
          <GraduationCap size={22} />
          Disha
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Enter the reset token and choose a new password.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Reset token
            <input
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            New password
            <span className="relative mt-2 block">
              <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </span>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-teal-700 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>
        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-teal-700">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}

export default ResetPassword;
