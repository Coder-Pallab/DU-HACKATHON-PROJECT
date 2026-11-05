import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  Compass,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Route,
  ScanSearch,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/apiClient";

/* -------------------------------------------------------------------------- */
/*  Styles (same visual language as the landing page)                         */
/* -------------------------------------------------------------------------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400..700&family=Noto+Sans+Bengali:wght@400..700&display=swap');

.dz-root { font-family: 'Figtree', 'Noto Sans Bengali', system-ui, sans-serif; }
.dz-display { font-family: 'Bricolage Grotesque', 'Noto Sans Bengali', system-ui, sans-serif; letter-spacing: -0.025em; }

@keyframes dz-rise { from { opacity: 0; transform: translate3d(0, 24px, 0); } to { opacity: 1; transform: none; } }
.dz-rise { opacity: 0; animation: dz-rise .9s cubic-bezier(.22,1,.36,1) var(--d, 0s) forwards; }

@keyframes dz-fade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
.dz-pop { animation: dz-fade .35s ease both; }

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

@keyframes dz-bar { from { transform: scaleX(0); } }
.dz-bar { transform-origin: left; animation: dz-bar 1.5s cubic-bezier(.22,1,.36,1) var(--d, .8s) both; }

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

function Field({ id, label, icon: Icon, action, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {action}
      </div>
      <div className="group relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-600"
        />
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Login                                                                     */
/* -------------------------------------------------------------------------- */

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

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white/70 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100";

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

          {/* floating objects */}
          <div className="relative my-6 h-[250px]" aria-hidden="true">
            <Float className="absolute left-0 top-2" depth={14} dur={5.5} fy={-14} r0={-2} r1={1}>
              <div className="dz-glass-dark flex items-center gap-3 rounded-2xl p-3 pr-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-teal-800">
                  <Target size={19} />
                </span>
                <div>
                  <p className="dz-display text-lg font-bold leading-none">92%</p>
                  <p className="mt-1 text-[11px] text-teal-100">Career match</p>
                </div>
              </div>
            </Float>

            <Float className="absolute right-0 top-14" depth={24} dur={6.5} delay={0.8} fy={-18} r0={2} r1={-1}>
              <div className="dz-glass-dark flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-amber-900">
                  <ScanSearch size={17} />
                </span>
                <div>
                  <p className="text-xs font-semibold">Resume insights</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-teal-100">
                    <Check size={11} /> Skills extracted
                  </p>
                </div>
              </div>
            </Float>

            <Float className="absolute bottom-6 left-6" depth={-18} dur={7} delay={0.4} fy={-16} r0={1} r1={-1.5}>
              <div className="dz-glass-dark w-[190px] rounded-2xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Route size={14} className="text-amber-300" /> Learning roadmap
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="dz-bar h-full w-[64%] rounded-full bg-gradient-to-r from-teal-200 to-amber-300" />
                </div>
                <p className="mt-2 text-[11px] text-teal-100">2 of 4 milestones done</p>
              </div>
            </Float>

            <Float className="absolute bottom-0 right-4" depth={-28} dur={5} delay={1.4} fy={-12}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-xl shadow-amber-500/30">
                <Compass size={22} />
              </span>
            </Float>

            <Float className="absolute left-[46%] top-0" depth={32} dur={4.5} delay={0.2} fy={-12}>
              <Sparkles size={22} className="text-amber-200" />
            </Float>

            <Float className="absolute left-[40%] top-[44%]" depth={10} dur={6} delay={1} fy={-10}>
              <span className="dz-glass-dark flex h-11 w-11 items-center justify-center rounded-full">
                <Bot size={19} />
              </span>
            </Float>
          </div>

          <div className="relative">
            <span
              className="dz-rise inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-teal-50 ring-1 ring-white/15"
              style={{ "--d": ".2s" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="dz-ping absolute inset-0 rounded-full bg-amber-300" />
                <span className="relative h-2 w-2 rounded-full bg-amber-300" />
              </span>
              Your Career. Your Direction.
            </span>

            <h1
              className="dz-rise dz-display mt-5 text-4xl font-bold leading-[1.1]"
              style={{ "--d": ".3s" }}
            >
              Welcome back!
              <br />
              <span className="dz-grad-text">Your future awaits.</span>
            </h1>

            <p className="dz-rise mt-4 max-w-sm leading-7 text-teal-100" style={{ "--d": ".4s" }}>
              Continue your journey with Disha. Explore career opportunities, improve your skills and move
              closer to your professional goals.
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
              className="dz-rise mb-8 inline-flex items-center gap-2.5 lg:hidden"
              style={{ "--d": ".1s" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-lg shadow-teal-700/25">
                <GraduationCap size={22} />
              </span>
              <span className="dz-display text-2xl font-bold text-slate-900">
                Disha<span className="text-amber-500">.</span>
              </span>
            </Link>

            <div className="dz-rise mb-8" style={{ "--d": ".15s" }}>
              <h2 className="dz-display text-4xl font-bold text-slate-950">Sign in</h2>
              <p className="mt-2 text-sm text-slate-500">Welcome back! Please enter your details.</p>
            </div>

            {initialSessionError && (
              <p role="alert" className="dz-pop mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {initialSessionError}
              </p>
            )}
            {notice && (
              <p role="status" className="dz-pop mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {notice}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="dz-rise" style={{ "--d": ".25s" }}>
                <Field id="email" label="Email address" icon={Mail}>
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
                </Field>
              </div>

              {/* Password */}
              <div className="dz-rise" style={{ "--d": ".35s" }}>
                <Field
                  id="password"
                  label="Password"
                  icon={Lock}
                  action={
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-teal-700 transition-colors hover:text-teal-900"
                    >
                      Forgot password?
                    </Link>
                  }
                >
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
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-teal-50 hover:text-teal-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </Field>
              </div>

              {/* Remember me */}
              <div className="dz-rise flex items-center gap-2" style={{ "--d": ".42s" }}>
                <input
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 cursor-pointer rounded accent-teal-700"
                />
                <label htmlFor="rememberMe" className="cursor-pointer text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              {/* Error message (key replays the shake for each new error) */}
              {error && (
                <p
                  key={error}
                  role="alert"
                  className="dz-shake rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <div className="dz-rise" style={{ "--d": ".5s" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="dz-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 py-3.5 font-semibold text-white shadow-xl shadow-teal-700/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-700/30 focus-visible:outline-teal-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Signing in...
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Signup link */}
            <p className="dz-rise mt-8 text-center text-sm text-slate-500" style={{ "--d": ".6s" }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-teal-700 underline-offset-4 transition-colors hover:text-teal-900 hover:underline"
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