import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Frontend demo only. No reset email is actually sent.
    console.log("Password reset requested for:", email);

    setError("");
    setSubmitted(true);
  };

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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700">
              <KeyRound size={32} />
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-tight">
              Don't Worry.
              <br />
              We've Got You.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-teal-100">
              Forgot your password? Recover access to your Disha account
              and continue working towards your career goals.
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
            <Link to="/" className="mb-9 flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
                <GraduationCap size={23} />
              </div>

              <span className="text-2xl font-bold text-teal-800">
                Disha.
              </span>
            </Link>

            {!submitted ? (
              <>
                <div className="mb-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <KeyRound size={27} />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900">
                    Forgot Password?
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    No worries! Enter your registered email address
                    and we'll help you reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

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
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter your registered email"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 font-semibold text-white transition hover:bg-teal-800"
                  >
                    Send Reset Link
                    <ArrowRight size={18} />
                  </button>

                </form>
              </>
            ) : (
              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Request Submitted!
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Your password reset request has been recorded for:
                </p>

                <p className="mt-2 break-all font-semibold text-teal-700">
                  {email}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  This is a frontend demonstration. No reset email
                  has actually been sent.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-teal-700 hover:text-teal-900"
                >
                  Try another email
                </button>

              </div>
            )}

            {/* Back to Login */}
            <Link
              to="/login"
              className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-teal-700"
            >
              <ArrowLeft size={17} />
              Back to Login
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;