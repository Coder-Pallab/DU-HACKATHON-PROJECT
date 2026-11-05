import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { authService } from "../../services/authService";
import { getApiErrorMessage } from "../../services/apiClient";

/* -------------------------------------------------------------------------- */
/*  Styles (same visual language as the landing page, login and signup)       */
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

@keyframes dz-ping { 0% { transform: scale(.8); opacity: .55; } 100% { transform: scale(2); opacity: 0; } }
.dz-ping { animation: dz-ping 2.4s cubic-bezier(0,0,.2,1) infinite; }

.dz-grid-bg {
  background-image: radial-gradient(rgba(15,118,110,.2) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 25%, transparent 72%);
  mask-image: radial-gradient(ellipse at 50% 40%, #000 25%, transparent 72%);
}

.dz-glass {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(255,255,255,.8);
  box-shadow: 0 40px 100px -30px rgba(13,148,136,.45), 0 2px 6px rgba(15,23,42,.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
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

function Field({ id, label, icon: Icon, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
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

function VisibilityToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-teal-50 hover:text-teal-700"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

/** Visual feedback for the same rules handleSubmit enforces. */
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "A letter", met: /[a-zA-Z]/.test(password) },
    { label: "A number", met: /\d/.test(password) },
  ];
  const score = checks.filter((check) => check.met).length;
  const barColor = ["bg-slate-200", "bg-rose-400", "bg-amber-400", "bg-emerald-500"][score];

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((segment) => (
          <span
            key={segment}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              password && score >= segment ? barColor : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {checks.map(({ label, met }) => (
          <li
            key={label}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${
              met ? "text-teal-700" : "text-slate-400"
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors duration-300 ${
                met ? "bg-teal-600 text-white" : "border border-slate-300"
              }`}
            >
              {met && <Check size={9} strokeWidth={4} />}
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reset password                                                            */
/* -------------------------------------------------------------------------- */

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  /* pointer parallax for the floating objects */
  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    e.currentTarget.style.setProperty("--px", x.toFixed(3));
    e.currentTarget.style.setProperty("--py", y.toFixed(3));
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white/70 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100";

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <main
      onMouseMove={handlePointerMove}
      className="dz-root relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f8f6] px-4 py-10"
    >
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
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2">
          <div className="dz-spin h-full w-full rounded-full border border-dashed border-teal-300/50" style={{ "--dur": "70s" }}>
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,.9)]" />
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        {/* floating objects around the card */}
        <div aria-hidden="true" className="hidden sm:block">
          <Float className="absolute -left-16 top-10 z-10" depth={18} dur={5.5} fy={-14} r0={-4} r1={-1}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-xl shadow-teal-700/30">
              <Lock size={24} />
            </span>
          </Float>
          <Float className="absolute -right-14 top-1/2 z-10" depth={-24} dur={6.5} delay={0.8} fy={-16} r0={3} r1={0}>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-xl shadow-amber-500/30">
              <ShieldCheck size={22} />
            </span>
          </Float>
          <Float className="absolute -bottom-8 -left-8 z-10" depth={-14} dur={6} delay={0.4} fy={-12}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-700 shadow-lg ring-1 ring-teal-100">
              <KeyRound size={18} />
            </span>
          </Float>
          <Float className="absolute -top-8 right-10 z-10" depth={26} dur={4.5} delay={0.2} fy={-12}>
            <Sparkles size={24} className="text-amber-400" />
          </Float>
        </div>

        <section
          className="dz-glass dz-rise relative rounded-[2rem] p-6 sm:p-10"
          style={{ "--d": "0s" }}
        >
          <Link
            to="/login"
            aria-label="Disha, back to sign in"
            className="dz-rise group mb-8 inline-flex items-center gap-2.5"
            style={{ "--d": ".1s" }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-lg shadow-teal-700/25 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
              <GraduationCap size={22} />
            </span>
            <span className="dz-display text-xl font-bold text-slate-900">
              Disha<span className="text-amber-500">.</span>
            </span>
          </Link>

          <div className="dz-rise flex items-start gap-4" style={{ "--d": ".15s" }}>
            <span className="relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center">
              <span className="dz-ping absolute inset-0 rounded-2xl bg-teal-400/40" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <KeyRound size={22} />
              </span>
            </span>
            <div>
              <h1 className="dz-display text-3xl font-bold leading-tight text-slate-950">Reset your password</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the reset token and choose a new password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* Reset token */}
            <div className="dz-rise" style={{ "--d": ".25s" }}>
              <Field id="token" label="Reset token" icon={KeyRound}>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Paste your reset token"
                  autoComplete="off"
                  spellCheck={false}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            {/* New password */}
            <div className="dz-rise" style={{ "--d": ".32s" }}>
              <Field id="password" label="New password" icon={Lock}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-12`}
                />
                <VisibilityToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </Field>
              <PasswordStrength password={password} />
            </div>

            {/* Confirm new password */}
            <div className="dz-rise" style={{ "--d": ".39s" }}>
              <Field id="confirmPassword" label="Confirm new password" icon={Lock}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-12`}
                />
                <VisibilityToggle
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </Field>
              {passwordsMatch && (
                <p className="dz-pop mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-700" role="status">
                  <Check size={13} strokeWidth={3} /> Passwords match
                </p>
              )}
            </div>

            {/* Error (key replays the shake for each new error) */}
            {error && (
              <p
                key={error}
                role="alert"
                className="dz-shake rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="dz-rise" style={{ "--d": ".46s" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="dz-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 py-3.5 font-semibold text-white shadow-xl shadow-teal-700/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-700/30 focus-visible:outline-teal-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Updating password...
                  </>
                ) : (
                  <>
                    Update password <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <Link
            to="/login"
            className="dz-rise group mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-teal-700"
            style={{ "--d": ".55s" }}
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to sign in
          </Link>
        </section>
      </div>
    </main>
  );
}

export default ResetPassword;