import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import {
  BookOpen,
  BriefcaseBusiness,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Menu,
  MessageCircle,
  ScanSearch,
  Settings,
  Target,
  UserRound,
  X,
} from "lucide-react";

const primaryLinks = [
  {
    nameKey: "sidebar.dashboard",
    name: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    nameKey: "sidebar.careerMatches",
    name: "Careers",
    path: "/dashboard/careers",
    icon: BriefcaseBusiness,
  },
  {
    nameKey: "sidebar.resumeSkills",
    name: "Resume",
    path: "/dashboard/resume",
    icon: FileText,
  },
  {
    nameKey: "sidebar.learningRoadmap",
    name: "Roadmap",
    path: "/dashboard/roadmap",
    icon: BookOpen,
  },
];

const moreLinks = [
  {
    nameKey: "sidebar.resumeIntelligence",
    name: "Resume Intelligence",
    path: "/dashboard/resume-intelligence",
    icon: ScanSearch,
  },
  {
    nameKey: "sidebar.placementReadiness",
    name: "Placement Readiness",
    path: "/dashboard/placement",
    icon: Target,
  },
  {
    nameKey: "sidebar.aiCounsellor",
    name: "AI Counsellor",
    path: "/dashboard/counsellor",
    icon: MessageCircle,
  },
  {
    nameKey: "sidebar.myProfile",
    name: "My Profile",
    path: "/dashboard/profile",
    icon: UserRound,
  },
  {
    nameKey: "sidebar.settings",
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
  {
    nameKey: "sidebar.helpSupport",
    name: "Help & Support",
    path: "/dashboard/help",
    icon: CircleHelp,
  },
  {
    nameKey: "Jobs & Internships",
    name: "Jobs & Internships",
    path: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    nameKey: "Saved Items",
    name: "Saved Items",
    path: "/dashboard/saved",
    icon: FileText,
  },
  {
    nameKey: "Notifications",
    name: "Notifications",
    path: "/dashboard/notifications",
    icon: MessageCircle,
  },
];

function MobileNavigation() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreIsActive = moreLinks.some(({ path }) => pathname === path);

  return (
    <>
      {isMoreOpen && (
        <button
          type="button"
          aria-label={t("Close more navigation")}
          className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      <nav
        aria-label={t("Mobile navigation")}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur-lg lg:hidden"
      >
        <div
          id="mobile-more-menu"
          className={`absolute inset-x-3 bottom-[calc(100%+0.5rem)] max-h-[min(60vh,28rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ${
            isMoreOpen ? "" : "hidden"
          }`}
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("More destinations")}
          </p>
          <div className="grid gap-1">
            {moreLinks.map(({ nameKey, name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsMoreOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-900"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{t(nameKey, name)}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-xl grid-cols-5 items-stretch">
          {primaryLinks.map(({ nameKey, name, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-medium leading-tight transition-colors sm:text-[11px] ${
                  isActive
                    ? "bg-teal-50 text-teal-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`
              }
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span className="max-w-full truncate">{t(nameKey, name)}</span>
            </NavLink>
          ))}
          <button
            type="button"
            aria-expanded={isMoreOpen}
            aria-controls="mobile-more-menu"
            onClick={() => setIsMoreOpen((open) => !open)}
            className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-medium leading-tight transition-colors sm:text-[11px] ${
              isMoreOpen || moreIsActive
                ? "bg-teal-50 text-teal-900"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {isMoreOpen ? (
              <X size={20} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={2} aria-hidden="true" />
            )}
            <span>{t("More")}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileNavigation;
