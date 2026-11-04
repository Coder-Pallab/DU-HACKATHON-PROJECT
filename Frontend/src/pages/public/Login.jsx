import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/apiClient";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");
  const initialSessionError = location.state?.sessionError;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await login(
        { email: formData.email.trim(), password: formData.password },
        formData.rememberMe
      );
      const destination = location.state?.from?.pathname;
      navigate(destination?.startsWith("/") ? destination : "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

        {/* Left Section */}
        <div className="hidden flex-col justify-between bg-teal-800 p-10 text-white lg:flex">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-800">
              <GraduationCap size={26} />
            </div>

            <span className="text-2xl font-bold">
              Disha<span className="text-teal-300">.</span>
            </span>
          </Link>

          <div className="my-12">
            <span className="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-teal-100">
              Your Career. Your Direction.
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight">
              Welcome Back!
              <br />
              Your Future Awaits.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-teal-100">
              Continue your journey with Disha. Explore career
              opportunities, improve your skills and move closer
              to your professional goals.
            </p>
          </div>

          <p className="text-sm text-teal-200">
            © {new Date().getFullYear()} Disha. All rights reserved.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
                <GraduationCap size={23} />
              </div>

              <span className="text-2xl font-bold text-teal-800">
                Disha.
              </span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Sign In
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Welcome back! Please enter your details.
              </p>
            </div>

            {initialSessionError && (
              <p role="alert" className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                {initialSessionError}
              </p>
            )}
            {notice && (
              <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {notice}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-12`}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 accent-teal-700"
                />

                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>

            </form>

            {/* Signup Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-teal-700 hover:text-teal-900"
              >
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;