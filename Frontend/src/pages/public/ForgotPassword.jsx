import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { authService } from "../../services/authService";
import { getApiErrorMessage } from "../../services/apiClient";

/* -------------------------------------------------------------------------- */
/*  Styles (same visual language as the landing page and other auth pages)    */
/* -------------------------------------------------------------------------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400..700&family=Noto+Sans+Bengali:wght@400..700&display=swap');

.dz-root { font-family: 'Figtree', 'Noto Sans Bengali', system-ui, sans-serif; }
.dz-display { font-family: 'Bricolage Grotesque', 'Noto Sans Bengali', system-ui, sans-serif; letter-spacing: -0.025em; }

@keyframes dz-rise { from { opacity: 0; transform: translate3d(0, 24px, 0); } to { opacity: 1; transform: none; } }
.dz-rise { opacity: 0; animation: dz-rise .9s cubic-bezier(.22,1,.36,1) var(--d, 0s) forwards; }

@keyframes dz-fade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
.dz-pop { animation: dz-fade .35s ease both; }

@keyframes dz-check { 0% { opacity: 0; transform: scale(.4) rotate(-12deg); } 60% { opacity: 1; transform: scale(1.12) rotate(2deg); } 100% { opacity: 1; transform: none; } }
.dz-check { animation: dz-check .8s cubic-bezier(.22,1,.36,1) .1s both; }

@keyframes dz-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}
.dz-shake { animation: dz-shake .45s ease both; }

@keyframes dz-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r0, 0deg)); }
  50%      { transform: translate3d(0, var(--fy, -14px), 0) rotate(var(--r1, 1.5deg)); }
}
.dz-float { animation: dz-float var(--dur, 6s) ease-in-out var(--delay, 0s) infinite; }

@keyframes dz-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33%      { transform: translate3d(36px, -26px, 0) scale(1.1); }
  66%      { transform: translate3d(-26px, 30px, 0) scale(0.94); }
}
.dz-drift { animation: dz-drift var(--dur, 18s) ease-in-out var(--delay, 0s) infinite; }

@keyframes dz-spin { to { transform: rotate(360deg); } }
.dz-spin { animation: dz-spin var(--dur, 40s) linear infinite; }
.dz-spin-rev { animation: dz-spin var(--dur, 55s) linear infinite reverse; }

@keyframes dz-ping { 0% { transform: scale(.8); opacity: .55; } 100% { transform: scale(2); opacity: 0; } }
.dz-ping { animation: dz-ping 2.4s cubic-bezier(0,0,.2,1) infinite; }

@keyframes dz-shift { to { background-position: 200% center; } }
.dz-grad-text {
  background: linear-gradient(100deg, #5eead4 0%, #99f6e4 30%, #fcd34d 60%, #5eead4 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: dz-shift 7s linear infinite;
}

.dz-grid-bg {
  background-image: radial-gradient(rgba(15,118,110,.2) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 30%, #000 25%, transparent 72%);
  mask-image: radial-gradient(ellipse at 50% 30%, #000 25%, transparent 72%);
}

.dz-glass-dark {
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.2);
  box-shadow: 0 20px 50px -20px rgba(0,0,0,.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.dz-shine { position: relative; overflow: hidden; }
.dz-shine::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.4) 50%, transparent 70%);
  transform: translateX(-120%);
  transition: transform .8s ease;
  pointer-events: none;
}
.dz-shine:hover::after { transform: translateX(120%); }

@media (prefers-reduced-motion: reduce) {
  .dz-root *, .dz-root *::before, .dz-root *::after {
    animation: none !important;
    transition: none !important;
  }
  .dz-rise { opacity: 1 !important; transform: none !important; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

/** Outer = pointer parallax, inner = endless float. */
function Float({ children, className = "", depth = 0, dur = 6, delay = 0, fy = -14, r0 = 0, r1 = 1.5 }) {
  return (
    <div
      className={className}
      style={{
        transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
        transition: "transform .5s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div
        className="dz-float"
        style={{ "--dur": `${dur}s`, "--delay": `${delay}s`, "--fy": `${fy}px`, "--r0": `${r0}deg`, "--r1": `${r1}deg` }}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Forgot password                                                           */
/* -------------------------------------------------------------------------- */

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const response = await authService.forgotPassword(email.trim());
      setMessage(response.message || response.data?.message || "If an account with this email exists, a password reset token has been issued.");
      setResetToken(response.data?.resetToken || "");
      setSubmitted(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* pointer parallax for the floating objects on the brand panel */
  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    e.currentTarget.style.setProperty("--px", x.toFixed(3));
    e.currentTarget.style.setProperty("--py", y.toFixed(3));
  };
  const handlePointerLeave = (e) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <div className="dz-root relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f8f6] px-4 py-10 sm:px-6">
      <style>{css}</style>

      {/* dawn background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="dz-grid-bg absolute inset-0" />
        <div
          className="dz-drift absolute -right-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-teal-300/40 blur-3xl"
          style={{ "--dur": "20s" }}
        />
        <div
          className="dz-drift absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-amber-200/60 blur-3xl"
          style={{ "--dur": "24s", "--delay": "-8s" }}
        />
      </div>

      <div
        className="dz-rise relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_40px_100px_-30px_rgba(13,148,136,0.45)] backdrop-blur-xl lg:grid-cols-[1.02fr_1fr]"
        style={{ "--d": "0s" }}
      >
        {/* ------------------------- brand panel ------------------------- */}
        <div
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(150deg,#0b3b3c_0%,#0f766e_60%,#14b8a6_115%)] p-10 text-white lg:flex"
        >
          {/* glow + rings */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="dz-drift absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-amber-300/35 blur-3xl"
              style={{ "--dur": "16s" }}
            />
            <div className="absolute left-1/2 top-[46%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
              <div className="dz-spin h-full w-full rounded-full border border-dashed border-white/20" style={{ "--dur": "60s" }}>
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,.9)]" />
              </div>
            </div>
            <div className="absolute left-1/2 top-[46%] h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2">
              <div className="dz-spin-rev h-full w-full rounded-full border border-white/15" style={{ "--dur": "42s" }}>
                <span className="absolute -right-1.5 top-1/2 h-3 w-3 rounded-full bg-teal-200 shadow-[0_0_16px_rgba(153,246,228,.9)]" />
              </div>
            </div>
          </div>

          <Link
            to="/"
            aria-label="Disha home"
            className="dz-rise group relative inline-flex w-fit items-center gap-3"
            style={{ "--d": ".1s" }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-800 shadow-lg transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
              <GraduationCap size={26} />
            </span>
            <span className="dz-display text-2xl font-bold">
              Disha<span className="text-amber-300">.</span>
            </span>
          </Link>

          {/* floating objects: recovery */}
          <div className="relative my-6 h-[250px]" aria-hidden="true">
            <Float className="absolute left-[34%] top-[26%]" depth={12} dur={6} fy={-12} r0={-3} r1={2}>
              <span className="relative flex h-20 w-20 items-center justify-center">
                <span className="dz-ping absolute inset-0 rounded-3xl bg-white/20" />
                <span className="dz-glass-dark relative flex h-20 w-20 items-center justify-center rounded-3xl">
                  <KeyRound size={34} />
                </span>
              </span>
            </Float>

            <Float className="absolute left-0 top-2" depth={20} dur={5.5} delay={0.3} fy={-14} r0={-2} r1={1}>
              <div className="dz-glass-dark flex items-center gap-3 rounded-2xl p-3 pr-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-teal-800">
                  <Mail size={19} />
                </span>
                <div>
                  <p className="text-xs font-semibold">Check your email</p>
                  <p className="mt-0.5 text-[11px] text-teal-100">A reset link is on its way</p>
                </div>
              </div>
            </Float>

            <Float className="absolute right-0 top-16" depth={26} dur={6.5} delay={0.8} fy={-18} r0={2} r1={-1}>
              <div className="dz-glass-dark flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-amber-900">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <p className="text-xs font-semibold">Secure reset</p>
                  <p className="mt-0.5 text-[11px] text-teal-100">Choose a new password</p>
                </div>
              </div>
            </Float>

            <Float className="absolute bottom-4 left-4" depth={-20} dur={7} delay={0.4} fy={-14}>
              <span className="dz-glass-dark flex h-12 w-12 items-center justify-center rounded-2xl">
                <Lock size={21} />
              </span>
            </Float>

            <Float className="absolute bottom-0 right-6" depth={-28} dur={5} delay={1.4} fy={-12}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-xl shadow-amber-500/30">
                <Check size={21} strokeWidth={3} />
              </span>
            </Float>

            <Float className="absolute left-[56%] top-0" depth={32} dur={4.5} delay={0.2} fy={-12}>
              <Sparkles size={22} className="text-amber-200" />
            </Float>
          </div>

          <div className="relative">
            <h1
              className="dz-rise dz-display text-4xl font-bold leading-[1.1]"
              style={{ "--d": ".2s" }}
            >
              Don&apos;t worry.
              <br />
              <span className="dz-grad-text">We&apos;ve got you.</span>
            </h1>

            <p className="dz-rise mt-4 max-w-sm leading-7 text-teal-100" style={{ "--d": ".3s" }}>
              Forgot your password? Recover access to your Disha account and continue working towards your
              career goals.
            </p>
          </div>

          <p className="relative mt-8 text-sm text-teal-200">
            © {new Date().getFullYear()} Disha. All rights reserved.
          </p>
        </div>

        {/* --------------------------- form panel ------------------------- */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link
              to="/"
              aria-label="Disha home"
              className="dz-rise mb-9 inline-flex items-center gap-2.5 lg:hidden"
              style={{ "--d": ".1s" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-lg shadow-teal-700/25">
                <GraduationCap size={22} />
              </span>
              <span className="dz-display text-2xl font-bold text-slate-900">
                Disha<span className="text-amber-500">.</span>
              </span>
            </Link>

            {!submitted ? (
              <>
                <div className="mb-8">
                  <span
                    className="dz-rise relative mb-6 flex h-14 w-14 items-center justify-center"
                    style={{ "--d": ".12s" }}
                  >
                    <span className="dz-ping absolute inset-0 rounded-2xl bg-teal-400/40" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <KeyRound size={27} />
                    </span>
                  </span>

                  <h2 className="dz-rise dz-display text-4xl font-bold text-slate-950" style={{ "--d": ".18s" }}>
                    Forgot password?
                  </h2>

                  <p className="dz-rise mt-3 text-sm leading-7 text-slate-500" style={{ "--d": ".24s" }}>
                    No worries! Enter your registered email address and we&apos;ll help you reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="dz-rise" style={{ "--d": ".3s" }}>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>

                    <div className="group relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-600"
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
                        className="w-full rounded-xl border border-slate-200 bg-white/70 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
                      />
                    </div>
                  </div>

                  {/* Error (key replays the shake for each new error) */}
                  {error && (
                    <p
                      key={error}
                      role="alert"
                      className="dz-shake rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                    >
                      {error}
                    </p>
                  )}

                  <div className="dz-rise" style={{ "--d": ".38s" }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="dz-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 py-3.5 font-semibold text-white shadow-xl shadow-teal-700/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-700/30 focus-visible:outline-teal-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          Request password reset <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center" role="status">
                <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
                  <span className="dz-ping absolute inset-0 rounded-full bg-emerald-400/40" />
                  <span className="dz-check relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                    <CheckCircle2 size={40} />
                  </span>
                </span>

                <h2 className="dz-rise dz-display mt-6 text-3xl font-bold text-slate-950" style={{ "--d": ".2s" }}>
                  Request submitted!
                </h2>

                <p className="dz-rise mt-3 text-sm leading-7 text-slate-500" style={{ "--d": ".3s" }}>
                  {message}
                </p>

                {resetToken && (
                  <div
                    className="dz-rise mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"
                    style={{ "--d": ".4s" }}
                  >
                    <p className="text-xs leading-5 text-amber-800">
                      The development API returned a reset token. Use it to set a new password:
                    </p>
                    <Link
                      to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                      className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900"
                    >
                      Continue to reset password
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="dz-rise mt-6 text-sm font-semibold text-teal-700 underline-offset-4 transition-colors hover:text-teal-900 hover:underline"
                  style={{ "--d": ".5s" }}
                >
                  Try another email
                </button>
              </div>
            )}

            {/* Back to login */}
            <Link
              to="/login"
              className="dz-rise group mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-teal-700"
              style={{ "--d": ".55s" }}
            >
              <ArrowLeft size={17} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;