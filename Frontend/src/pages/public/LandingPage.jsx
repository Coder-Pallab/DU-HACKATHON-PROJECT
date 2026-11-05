import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Check,
  Compass,
  GraduationCap,
  Languages,
  Menu,
  MessageCircle,
  Rocket,
  Route,
  ScanSearch,
  Send,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const features = [
  {
    id: "match",
    icon: BriefcaseBusiness,
    title: "Career matches",
    description:
      "Explore career recommendations informed by your profile, interests, and skills.",
    span: "lg:col-span-4",
    wide: true,
    dark: true,
  },
  {
    id: "resume",
    icon: ScanSearch,
    title: "Resume intelligence",
    description:
      "Extract resume details, review your skills, and get AI-powered guidance to strengthen your profile.",
    span: "lg:col-span-2",
  },
  {
    id: "roadmap",
    icon: BookOpen,
    title: "Learning roadmaps",
    description:
      "Turn your career goals into a personalized roadmap with learning milestones.",
    span: "lg:col-span-2",
  },
  {
    id: "placement",
    icon: Target,
    title: "Placement readiness",
    description:
      "Review your readiness and focus your preparation with placement-focused assessments.",
    span: "lg:col-span-2",
  },
  {
    id: "counselling",
    icon: MessageCircle,
    title: "AI career counselling",
    description:
      "Talk through career questions and get guidance tailored to your next steps.",
    span: "lg:col-span-2",
  },
  {
    id: "language",
    icon: GraduationCap,
    title: "English & Assamese",
    description:
      "Use the platform in English or Assamese and choose your preferred language in settings.",
    span: "lg:col-span-6",
    wide: true,
    warm: true,
  },
];

const steps = [
  {
    number: "01",
    title: "Build your profile",
    description: "Share your interests, education, and skills to get started.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Explore your direction",
    description: "Review career matches and understand the skills they call for.",
    icon: Compass,
  },
  {
    number: "03",
    title: "Make a plan",
    description: "Use your roadmap, resume insights, and counselling to move forward.",
    icon: Route,
  },
];

const benefits = [
  "Build on your profile and existing skills",
  "Explore career recommendations and skill gaps",
  "Keep learning plans close to your goals",
  "Get guidance in English or Assamese",
];

const paths = [
  "Software engineering",
  "Data science",
  "UI/UX design",
  "Digital marketing",
  "Healthcare",
  "Finance & banking",
  "Teaching",
  "Civil services",
  "Entrepreneurship",
  "Cyber security",
];

const chatCopy = {
  en: {
    label: "English",
    question: "Which skills should I learn next?",
    answer:
      "With your React and Node.js skills, Full-Stack Developer is a strong match. Next: learn system design and publish two deployed projects.",
    chips: ["Build my roadmap", "Review my resume"],
    placeholder: "Ask about your career…",
  },
  as: {
    label: "অসমীয়া",
    question: "মই পৰৱৰ্তীলৈ কোনবোৰ দক্ষতা শিকিব লাগে?",
    answer:
      "আপোনাৰ React আৰু Node.js দক্ষতাৰ ভিত্তিত ফুল-স্টেক ডেভেলপাৰ এটা ভাল বিকল্প। পৰৱৰ্তী পদক্ষেপ: ছিষ্টেম ডিজাইন শিকক আৰু দুটা প্ৰকল্প প্ৰকাশ কৰক।",
    chips: ["মোৰ ৰোডমেপ বনাওক", "মোৰ ৰিজিউম পৰীক্ষা কৰক"],
    placeholder: "আপোনাৰ কেৰিয়াৰৰ বিষয়ে সুধিক…",
  },
};

/* -------------------------------------------------------------------------- */
/*  Styles (keyframes + helpers that Tailwind utilities can't express)        */
/* -------------------------------------------------------------------------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400..700&family=Noto+Sans+Bengali:wght@400..700&display=swap');

html { scroll-behavior: smooth; }

.dz-root { font-family: 'Figtree', 'Noto Sans Bengali', system-ui, sans-serif; }
.dz-display { font-family: 'Bricolage Grotesque', 'Noto Sans Bengali', system-ui, sans-serif; letter-spacing: -0.025em; }

/* ---------- scroll reveal ---------- */
.dz-root [data-reveal] {
  opacity: 0;
  transform: translate3d(0, 32px, 0) scale(0.98);
  transition: opacity .9s cubic-bezier(.22,1,.36,1) var(--d, 0s),
              transform .9s cubic-bezier(.22,1,.36,1) var(--d, 0s);
  will-change: opacity, transform;
}
.dz-root [data-reveal="left"]  { transform: translate3d(-48px, 0, 0); }
.dz-root [data-reveal="right"] { transform: translate3d(48px, 0, 0); }
.dz-root [data-reveal="zoom"]  { transform: scale(0.9); }
.dz-root [data-reveal].is-visible { opacity: 1; transform: none; }
.dz-root [data-reveal="draw"] {
  opacity: 1;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.8s cubic-bezier(.22,1,.36,1) .3s;
}
.dz-root [data-reveal="draw"].is-visible { transform: scaleX(1); }

/* things that fill / draw once their parent is revealed */
.dz-fill {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.3s cubic-bezier(.22,1,.36,1) calc(var(--d, 0s) + .35s);
}
.is-visible .dz-fill { transform: scaleX(1); }

.dz-ring-fg {
  stroke-dasharray: 264;
  stroke-dashoffset: 264;
  transition: stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1) .5s;
}
.is-visible .dz-ring-fg { stroke-dashoffset: var(--off, 40); }

.dz-msg {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .7s ease var(--d, 0s), transform .7s cubic-bezier(.22,1,.36,1) var(--d, 0s);
}
.is-visible .dz-msg { opacity: 1; transform: none; }

/* ---------- page-load entrance ---------- */
@keyframes dz-rise { from { opacity: 0; transform: translate3d(0, 26px, 0); } to { opacity: 1; transform: none; } }
.dz-rise { opacity: 0; animation: dz-rise 1s cubic-bezier(.22,1,.36,1) var(--d, 0s) forwards; }

@keyframes dz-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.dz-swap { animation: dz-fade .5s ease both; }

/* ---------- floating objects ---------- */
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
  background: linear-gradient(100deg, #0f766e 0%, #14b8a6 30%, #f59e0b 60%, #0f766e 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: dz-shift 7s linear infinite;
}

@keyframes dz-marquee { to { transform: translateX(-50%); } }
.dz-marquee { display: flex; width: max-content; animation: dz-marquee 45s linear infinite; }
.dz-marquee-wrap:hover .dz-marquee { animation-play-state: paused; }

@keyframes dz-scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(78px); } }
.dz-scan { animation: dz-scan 3s ease-in-out infinite; }

@keyframes dz-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .45; } 40% { transform: translateY(-4px); opacity: 1; } }
.dz-dot { animation: dz-bounce 1.2s ease-in-out infinite; }

/* ---------- surfaces ---------- */
.dz-glass {
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(255,255,255,.75);
  box-shadow: 0 24px 60px -24px rgba(13,148,136,.38), 0 2px 6px rgba(15,23,42,.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.dz-grid-bg {
  background-image: radial-gradient(rgba(15,118,110,.2) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 25%, #000 25%, transparent 72%);
  mask-image: radial-gradient(ellipse at 50% 25%, #000 25%, transparent 72%);
}

.dz-spot { position: relative; overflow: hidden; }
.dz-spot::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(20,184,166,.16), transparent 60%);
  opacity: 0;
  transition: opacity .3s ease;
  pointer-events: none;
}
.dz-spot:hover::before { opacity: 1; }
.dz-spot > * { position: relative; }

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

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .dz-root *, .dz-root *::before, .dz-root *::after {
    animation: none !important;
    transition: none !important;
  }
  .dz-root [data-reveal], .dz-rise { opacity: 1 !important; transform: none !important; }
  .dz-root [data-reveal="draw"] { transform: scaleX(1) !important; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function Brand({ inverse = false }) {
  return (
    <Link
      to="/"
      aria-label="Disha home"
      className={`group inline-flex items-center gap-2.5 font-bold tracking-tight ${
        inverse ? "text-white" : "text-slate-900"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-lg shadow-teal-700/25 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
        <GraduationCap size={22} strokeWidth={2.2} />
      </span>
      <span className="dz-display text-xl">
        Disha<span className={inverse ? "text-teal-300" : "text-amber-500"}>.</span>
      </span>
    </Link>
  );
}

/** Outer div = scroll parallax, inner div = endless float (kept separate so transforms don't clash). */
function Float({ children, className = "", speed = 0, dur = 6, delay = 0, fy = -14, r0 = 0, r1 = 1.5 }) {
  return (
    <div
      className={className}
      style={{ transform: `translate3d(0, calc(var(--sy, 0) * ${speed}px), 0)` }}
    >
      <div
        className="dz-float"
        style={{
          "--dur": `${dur}s`,
          "--delay": `${delay}s`,
          "--fy": `${fy}px`,
          "--r0": `${r0}deg`,
          "--r1": `${r1}deg`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Ring({ value = 92, size = 112, stroke = 9, label, sub, offset }) {
  const off = offset ?? Math.round(264 * (1 - value / 100));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth={stroke} />
        <circle
          className="dz-ring-fg"
          style={{ "--off": off }}
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#dz-ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="dz-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="dz-display text-2xl font-bold leading-none text-slate-900">{label}</span>
        {sub && <span className="mt-1 text-[10px] font-medium text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}

function SkillBar({ name, width, delay = 0 }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
        <span>{name}</span>
        <span className="text-slate-400">{width}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="dz-fill h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300"
          style={{ width: `${width}%`, "--d": `${delay}s` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero visual                                                               */
/* -------------------------------------------------------------------------- */

function HeroVisual() {
  return (
    <div
      aria-label="Illustration of the Disha career guidance workspace"
      role="img"
      data-reveal="zoom"
      style={{ "--d": ".25s" }}
      className="relative mx-auto h-[520px] w-full max-w-[580px] sm:h-[580px]"
    >
      {/* orbit rings */}
      <div className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 sm:h-[96%] sm:w-[96%]">
        <div className="dz-spin h-full w-full rounded-full border border-dashed border-teal-300/70" style={{ "--dur": "60s" }}>
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,.9)]" />
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2">
        <div className="dz-spin-rev h-full w-full rounded-full border border-teal-200/80" style={{ "--dur": "45s" }}>
          <span className="absolute -right-1.5 top-1/2 h-3 w-3 rounded-full bg-teal-500 shadow-[0_0_16px_rgba(20,184,166,.9)]" />
        </div>
      </div>

      {/* central workspace card */}
      <Float
        className="absolute left-1/2 top-1/2 z-10 w-[78%] max-w-[330px] -translate-x-1/2 -translate-y-1/2"
        speed={-0.03}
        dur={7}
        fy={-10}
        r1={0.6}
      >
        <div className="dz-glass rounded-3xl p-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Compass size={20} />
              <span className="dz-ping absolute inset-0 rounded-xl border border-teal-400" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Your career workspace</p>
              <p className="text-xs text-slate-500">A plan shaped around you</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Ring value={92} label="92%" sub="match" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500">Top career match</p>
              <p className="dz-display mt-0.5 text-base font-semibold leading-tight text-slate-900">
                Full-Stack Developer
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <Sparkles size={10} /> AI recommended
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <SkillBar name="React" width={88} delay={0.1} />
            <SkillBar name="Node.js" width={72} delay={0.25} />
            <SkillBar name="System design" width={46} delay={0.4} />
          </div>
        </div>
      </Float>

      {/* floating satellites */}
      <Float className="absolute left-0 top-2 z-20 sm:-left-4 sm:top-6" speed={-0.08} dur={5.5} delay={0.4} fy={-16} r0={-2} r1={1}>
        <div className="dz-glass flex max-w-[210px] items-start gap-2.5 rounded-2xl p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Bot size={16} />
          </span>
          <div>
            <p className="text-[10px] font-semibold text-teal-700">AI counsellor</p>
            <p className="mt-0.5 text-xs leading-4 text-slate-700">Which skills should I build next?</p>
          </div>
        </div>
      </Float>

      <Float className="absolute right-0 top-14 z-20 sm:-right-4 sm:top-20" speed={-0.13} dur={6.5} delay={1} fy={-18} r0={2} r1={-1}>
        <div className="dz-glass flex items-center gap-2.5 rounded-2xl px-3.5 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <ScanSearch size={16} />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-900">Resume insights</p>
            <p className="flex items-center gap-1 text-[10px] text-slate-500">
              <Check size={11} className="text-emerald-600" /> 12 skills found
            </p>
          </div>
        </div>
      </Float>

      <Float className="absolute bottom-16 left-0 z-20 sm:-left-6 sm:bottom-24" speed={-0.05} dur={7.5} delay={0.7} fy={-14} r0={1} r1={-1.5}>
        <div className="dz-glass w-[170px] rounded-2xl p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Route size={14} className="text-teal-700" /> Learning roadmap
          </div>
          <div className="mt-3 flex items-center">
            {[true, true, false, false].map((done, i) => (
              <div key={i} className="flex flex-1 items-center last:flex-none">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${
                    done ? "bg-teal-600" : i === 2 ? "border-2 border-teal-500 bg-white" : "border-2 border-slate-200 bg-white"
                  }`}
                >
                  {done && <Check size={11} strokeWidth={3} />}
                </span>
                {i < 3 && <span className={`h-0.5 flex-1 ${done ? "bg-teal-500" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </Float>

      <Float className="absolute bottom-2 right-2 z-20 sm:-right-2 sm:bottom-10" speed={-0.1} dur={5} delay={1.6} fy={-15} r0={-1.5} r1={1.5}>
        <div className="dz-glass flex items-center gap-2.5 rounded-2xl px-3.5 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <Target size={16} />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-900">Placement readiness</p>
            <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
              <div className="dz-fill h-full w-[68%] rounded-full bg-gradient-to-r from-amber-400 to-rose-400" style={{ "--d": ".6s" }} />
            </div>
          </div>
        </div>
      </Float>

      {/* decorative orbs */}
      <Float className="absolute left-[14%] top-[44%] hidden sm:block" speed={-0.16} dur={4.5} fy={-20}>
        <span className="block h-5 w-5 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg shadow-amber-400/40" />
      </Float>
      <Float className="absolute right-[10%] top-[58%] hidden sm:block" speed={-0.06} dur={5.5} delay={0.8} fy={-18}>
        <span className="block h-3.5 w-3.5 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 shadow-lg shadow-teal-500/40" />
      </Float>
      <Float className="absolute right-[26%] top-[2%]" speed={-0.18} dur={6} delay={0.3} fy={-12}>
        <Sparkles size={22} className="text-amber-400" />
      </Float>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature card visuals                                                      */
/* -------------------------------------------------------------------------- */

function FeatureVisual({ id }) {
  switch (id) {
    case "match":
      return (
        <div className="w-full space-y-3 md:max-w-[300px]">
          {[
            ["Full-Stack Developer", 92],
            ["Data Analyst", 84],
            ["Product Designer", 71],
          ].map(([name, pct], i) => (
            <div key={name} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10 backdrop-blur">
              <div className="flex items-center justify-between text-xs font-medium text-teal-50">
                <span>{name}</span>
                <span className="text-amber-300">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="dz-fill h-full rounded-full bg-gradient-to-r from-teal-300 to-amber-300"
                  style={{ width: `${pct}%`, "--d": `${i * 0.15}s` }}
                />
              </div>
            </div>
          ))}
        </div>
      );

    case "resume":
      return (
        <div className="relative mt-5 h-[104px] overflow-hidden rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="space-y-2">
            {["w-1/2", "w-full", "w-5/6", "w-2/3", "w-3/4"].map((w, i) => (
              <div key={i} className={`h-1.5 rounded-full bg-slate-200 ${w}`} />
            ))}
          </div>
          <div className="dz-scan absolute inset-x-0 top-2 h-0.5 bg-teal-500 shadow-[0_0_14px_3px_rgba(20,184,166,.55)]" />
          <span className="absolute bottom-2 right-2 rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-semibold text-white">
            React
          </span>
        </div>
      );

    case "roadmap":
      return (
        <div className="mt-5 flex items-center rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
          {["Basics", "Projects", "Interview", "Offer"].map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full text-white ${
                    i < 2 ? "bg-teal-600" : "border-2 border-slate-300 bg-white"
                  }`}
                >
                  {i < 2 && <Check size={12} strokeWidth={3} />}
                  {i === 2 && <span className="dz-ping absolute inset-0 rounded-full border border-teal-500" />}
                </span>
                <span className="text-[9px] font-medium text-slate-500">{label}</span>
              </div>
              {i < 3 && <span className={`mb-4 h-0.5 flex-1 ${i < 1 ? "bg-teal-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      );

    case "placement":
      return (
        <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <Ring value={78} size={76} stroke={10} label="78%" />
          <div className="space-y-1.5 text-[11px] font-medium text-slate-600">
            <p className="flex items-center gap-1.5"><Check size={12} className="text-teal-600" /> Aptitude</p>
            <p className="flex items-center gap-1.5"><Check size={12} className="text-teal-600" /> Technical</p>
            <p className="flex items-center gap-1.5 text-slate-400"><span className="h-3 w-3 rounded-full border border-slate-300" /> Interview</p>
          </div>
        </div>
      );

    case "counselling":
      return (
        <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-teal-700 px-3 py-1.5 text-[11px] text-white">
            Is data science right for me?
          </div>
          <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100">
            {[0, 0.15, 0.3].map((d) => (
              <span key={d} className="dz-dot h-1.5 w-1.5 rounded-full bg-teal-600" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        </div>
      );

    case "language":
      return (
        <div className="relative flex w-full items-center justify-center gap-3 py-2 md:w-auto md:min-w-[300px]">
          <Float dur={5} fy={-10} r0={-3} r1={-1}>
            <span className="block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-lg shadow-amber-900/10 ring-1 ring-amber-100">
              English
            </span>
          </Float>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-white shadow-md">
            <Languages size={17} />
          </span>
          <Float dur={6} delay={0.6} fy={-12} r0={3} r1={1}>
            <span className="block rounded-2xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20">
              অসমীয়া
            </span>
          </Float>
        </div>
      );

    default:
      return null;
  }
}

function FeatureCard({ feature, index }) {
  const { id, icon: Icon, title, description, span, wide, dark, warm } = feature;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const surface = dark
    ? "border-teal-800 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white"
    : warm
    ? "border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-teal-50"
    : "border-slate-200/80 bg-white";

  return (
    <article
      data-reveal
      style={{ "--d": `${(index % 3) * 0.1}s` }}
      onMouseMove={onMove}
      className={`dz-spot rounded-3xl border p-6 shadow-sm transition-[box-shadow,border-color] duration-300 hover:shadow-xl hover:shadow-teal-900/10 sm:p-7 ${span} ${surface} ${
        wide ? "flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10" : ""
      }`}
    >
      <div className={wide ? "max-w-md" : ""}>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            dark ? "bg-white/15 text-amber-300" : warm ? "bg-amber-100 text-amber-700" : "bg-teal-50 text-teal-700"
          }`}
        >
          <Icon size={22} />
        </span>
        <h3 className={`dz-display mt-5 text-xl font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
        <p className={`mt-2 text-sm leading-6 ${dark ? "text-teal-100" : "text-slate-600"}`}>{description}</p>
      </div>
      <FeatureVisual id={id} />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function LandingPage() {
  const rootRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("en");

  const closeMenu = () => setIsMenuOpen(false);
  const chat = chatCopy[lang];

  /* scroll reveal + parallax + progress bar */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const targets = root.querySelectorAll("[data-reveal]");
    let observer;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      targets.forEach((el) => observer.observe(el));
    } else {
      targets.forEach((el) => el.classList.add("is-visible"));
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--sy", y.toFixed(0));
      root.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
      setScrolled(y > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main
      ref={rootRef}
      className="dz-root relative min-h-screen overflow-x-clip bg-[#f5faf9] text-slate-900"
    >
      <style>{css}</style>

      {/* scroll progress */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400"
        style={{ transform: "scaleX(var(--p, 0))" }}
      />

      {/* ------------------------------ header ------------------------------ */}
      <header className="sticky top-3 z-50 px-3 sm:px-6">
        <div
          className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "border-slate-200/80 bg-white/85 shadow-lg shadow-teal-900/5 backdrop-blur-xl"
              : "border-white/60 bg-white/55 backdrop-blur-md"
          }`}
        >
          <div className="flex h-[64px] items-center justify-between gap-4 px-4 sm:px-5">
            <Brand />

            <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium text-slate-600 transition-colors hover:text-teal-800 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-teal-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="dz-shine inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/25 transition hover:shadow-lg hover:shadow-teal-700/30 focus-visible:outline-teal-700"
              >
                Get started <ArrowRight size={16} />
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/70 text-slate-700 md:hidden"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="landing-mobile-navigation"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            >
              {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {isMenuOpen && (
            <nav
              id="landing-mobile-navigation"
              aria-label="Mobile navigation"
              className="dz-swap border-t border-slate-200/70 px-4 py-4 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-teal-50"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* ------------------------------- hero ------------------------------- */}
      <section id="home" className="relative isolate -mt-[76px] scroll-mt-20 pt-[76px]">
        {/* dawn background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#e6f7f3_0%,#f5faf9_70%)]" />
          <div className="dz-grid-bg absolute inset-0" />
          <div
            className="dz-drift absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-teal-300/40 blur-3xl"
            style={{ "--dur": "20s" }}
          />
          <div
            className="dz-drift absolute -left-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-amber-200/60 blur-3xl"
            style={{ "--dur": "24s", "--delay": "-6s" }}
          />
          <div
            className="dz-drift absolute bottom-[-8rem] right-1/4 h-[22rem] w-[22rem] rounded-full bg-sky-200/50 blur-3xl"
            style={{ "--dur": "28s", "--delay": "-12s" }}
          />
        </div>

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p
              className="dz-rise inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur sm:text-sm"
              style={{ "--d": ".05s" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="dz-ping absolute inset-0 rounded-full bg-teal-500" />
                <span className="relative h-2 w-2 rounded-full bg-teal-600" />
              </span>
              AI-powered career guidance
            </p>

            <h1
              className="dz-rise dz-display mt-6 text-balance text-[2.75rem] font-bold leading-[1.04] text-slate-950 sm:text-6xl lg:text-7xl"
              style={{ "--d": ".15s" }}
            >
              Your next career move, <span className="dz-grad-text">with direction.</span>
            </h1>

            <p
              className="dz-rise mt-6 max-w-xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
              style={{ "--d": ".3s" }}
            >
              Bring your skills, career goals, and preparation together in one place. Disha helps students
              explore possibilities and take practical steps toward a future that fits.
            </p>

            <div className="dz-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--d": ".45s" }}>
              <Link
                to="/register"
                className="dz-shine inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-700/30 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-700/35"
              >
                Get started <ArrowRight size={17} />
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-slate-300/80 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white"
              >
                Explore features
              </a>
            </div>

            <ul
              className="dz-rise mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600"
              style={{ "--d": ".6s" }}
            >
              {["Resume insights", "Learning roadmap", "English & Assamese"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ------------------------------ marquee ----------------------------- */}
      <section aria-label="Career paths you can explore" className="border-y border-teal-900/5 bg-white/70 py-5 backdrop-blur">
        <div
          className="dz-marquee-wrap overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          }}
        >
          <div className="dz-marquee">
            {[...paths, ...paths].map((path, i) => (
              <span
                key={`${path}-${i}`}
                aria-hidden={i >= paths.length}
                className="mx-2 inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-teal-500 to-amber-400" />
                {path}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ features ---------------------------- */}
      <section id="features" className="relative scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-3 py-1 text-xs font-semibold text-teal-800">
              <Sparkles size={13} /> What you can do
            </p>
            <h2 className="dz-display mt-4 text-balance text-4xl font-bold text-slate-950 sm:text-5xl">
              Practical guidance for every step
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Explore the tools already available in Disha to understand your options, strengthen your profile,
              and prepare with purpose.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-5">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- how it works -------------------------- */}
      <section
        id="how-it-works"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-white via-teal-50/60 to-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <Float className="absolute -left-10 top-16 hidden lg:block" speed={0.05} dur={9} fy={-24}>
          <span className="block h-40 w-40 rounded-full bg-amber-200/40 blur-2xl" />
        </Float>
        <Float className="absolute -right-10 bottom-10 hidden lg:block" speed={0.08} dur={11} delay={1} fy={-28}>
          <span className="block h-52 w-52 rounded-full bg-teal-200/40 blur-2xl" />
        </Float>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800">
              <Route size={13} /> How it works
            </p>
            <h2 className="dz-display mt-4 text-balance text-4xl font-bold text-slate-950 sm:text-5xl">
              From self-discovery to your next step
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Start with what you know about yourself. Disha brings the tools together to help you decide what
              to explore next.
            </p>
          </div>

          <div className="relative mt-14">
            {/* connecting line */}
            <div
              aria-hidden="true"
              className="absolute left-[16.6%] right-[16.6%] top-[52px] hidden h-0.5 md:block"
            >
              <div className="h-full w-full rounded-full bg-slate-200" />
              <div
                data-reveal="draw"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3 md:gap-8">
              {steps.map(({ number, title, description, icon: Icon }, i) => (
                <article
                  key={number}
                  data-reveal
                  style={{ "--d": `${i * 0.18}s` }}
                  className="relative rounded-3xl border border-slate-200/80 bg-white p-6 pt-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-teal-900/10 sm:p-8"
                >
                  <div className="relative mx-auto flex h-[52px] w-[52px] items-center justify-center">
                    <span className="dz-ping absolute inset-0 rounded-2xl bg-teal-400/40" style={{ animationDelay: `${i * 0.6}s` }} />
                    <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-lg shadow-teal-700/30">
                      <Icon size={22} />
                    </span>
                  </div>
                  <p className="dz-display mt-5 text-sm font-bold tracking-widest text-amber-500">{number}</p>
                  <h3 className="dz-display mt-1 text-xl font-semibold text-slate-900">{title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------- about ----------------------------- */}
      <section id="about" className="relative scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <div data-reveal="left">
              <p className="inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-3 py-1 text-xs font-semibold text-teal-800">
                <Compass size={13} /> Why Disha
              </p>
              <h2 className="dz-display mt-4 text-balance text-4xl font-bold text-slate-950 sm:text-5xl">
                Your career journey, connected in one place
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Disha brings career exploration, resume insights, learning planning, and placement preparation
                into one student-focused experience.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {benefits.map((benefit, i) => (
                <li
                  key={benefit}
                  data-reveal="left"
                  style={{ "--d": `${0.1 + i * 0.1}s` }}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-700 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* interactive chat demo */}
          <div className="relative mx-auto w-full max-w-[520px]" data-reveal="right">
            <Float className="absolute -right-3 -top-6 z-10 hidden sm:block" speed={-0.06} dur={5} fy={-14}>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-xl shadow-amber-400/40">
                <Rocket size={24} />
              </span>
            </Float>
            <Float className="absolute -bottom-6 -left-4 z-10 hidden sm:block" speed={-0.1} dur={6.5} delay={0.5} fy={-16}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-xl shadow-teal-800/30">
                <Sparkles size={20} />
              </span>
            </Float>

            <div className="dz-glass relative overflow-hidden rounded-[1.75rem]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white/60 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 text-white">
                    <Bot size={19} />
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                      <span className="dz-ping absolute inset-0 rounded-full bg-emerald-400" />
                      <span className="relative h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    </span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Disha counsellor</p>
                    <p className="text-xs text-slate-500">Ready to help</p>
                  </div>
                </div>

                {/* language switch */}
                <div
                  role="group"
                  aria-label="Chat language"
                  className="relative grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow transition-transform duration-300 ease-out"
                    style={{ transform: lang === "en" ? "translateX(0)" : "translateX(100%)" }}
                  />
                  {Object.entries(chatCopy).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={lang === key}
                      onClick={() => setLang(key)}
                      className={`relative z-10 rounded-lg px-3 py-1.5 transition-colors ${
                        lang === key ? "text-teal-800" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 px-5 py-6" aria-live="polite">
                <div className="dz-msg flex justify-end" style={{ "--d": ".3s" }}>
                  <p
                    key={`q-${lang}`}
                    className="dz-swap max-w-[82%] rounded-2xl rounded-br-md bg-gradient-to-br from-teal-700 to-teal-600 px-4 py-3 text-sm leading-6 text-white shadow-md shadow-teal-700/20"
                  >
                    {chat.question}
                  </p>
                </div>

                <div className="dz-msg flex items-start gap-2.5" style={{ "--d": ".8s" }}>
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                    <Sparkles size={14} />
                  </span>
                  <p
                    key={`a-${lang}`}
                    className="dz-swap max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-100"
                  >
                    {chat.answer}
                  </p>
                </div>

                <div className="dz-msg flex flex-wrap gap-2 pl-10" style={{ "--d": "1.3s" }}>
                  {chat.chips.map((chip) => (
                    <span
                      key={`${lang}-${chip}`}
                      className="dz-swap rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 bg-white/60 px-5 py-3">
                <span key={`p-${lang}`} className="dz-swap flex-1 truncate text-sm text-slate-400">
                  {chat.placeholder}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">
                  <Send size={15} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ contact CTA ------------------------- */}
      <section id="contact" className="scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div
          data-reveal="zoom"
          className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#0b3b3c_0%,#0f766e_55%,#14b8a6_100%)] px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16"
        >
          <div aria-hidden="true" className="dz-grid-bg absolute inset-0 -z-10 opacity-30 [filter:invert(1)]" />
          <div
            aria-hidden="true"
            className="dz-drift absolute -bottom-24 -right-16 -z-10 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl"
            style={{ "--dur": "16s" }}
          />
          <div
            aria-hidden="true"
            className="dz-spin absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full border border-dashed border-white/20"
            style={{ "--dur": "50s" }}
          />

          <Float className="absolute right-[14%] top-8 hidden md:block" dur={5} fy={-14}>
            <Sparkles size={26} className="text-amber-300" />
          </Float>
          <Float className="absolute bottom-10 right-[32%] hidden md:block" dur={6.5} delay={0.8} fy={-12}>
            <Compass size={30} className="text-white/40" />
          </Float>

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal-200">Your next chapter starts here</p>
              <h2 className="dz-display mt-3 text-balance text-4xl font-bold sm:text-5xl">
                Ready to find your direction?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-teal-50 sm:text-base">
                Create your account and start building a career plan that moves with you.
              </p>
            </div>
            <Link
              to="/register"
              className="dz-shine inline-flex min-h-[54px] shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-teal-900 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-teal-50"
            >
              Create your account <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------- footer ---------------------------- */}
      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Brand />
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              A student-focused platform for career guidance and preparation.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            {navigation.slice(0, 4).map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-teal-800">
                {item.label}
              </a>
            ))}
            <Link to="/login" className="transition-colors hover:text-teal-800">Login</Link>
            <Link to="/register" className="transition-colors hover:text-teal-800">Get started</Link>
          </nav>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 pt-5 text-xs text-slate-500">
          © {new Date().getFullYear()} Disha. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;