import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  BookOpen,
  UserRound,
  Target,
  FileText,
} from "lucide-react";

const mobileLinks = [
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
    nameKey: "sidebar.learningRoadmap",
    name: "Roadmap",
    path: "/dashboard/roadmap",
    icon: BookOpen,
  },
  {
    nameKey: "sidebar.placementReadiness",
    name: "Readiness",
    path: "/dashboard/placement",
    icon: Target,
  },
  {
    nameKey: "resumeIntelligence.mobile",
    name: "Resume AI",
    path: "/dashboard/resume-intelligence",
    icon: FileText,
  },
  {
    nameKey: "sidebar.myProfile",
    name: "Profile",
    path: "/dashboard/profile",
    icon: UserRound,
  },
];

function MobileNavigation() {
  const { t } = useLanguage();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">

      <div className="flex items-center justify-around">

        {mobileLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] transition-colors sm:px-4 sm:text-xs ${
                  isActive
                    ? "bg-teal-50 font-semibold text-teal-800"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={21} />
              <span>{t(item.nameKey, item.name)}</span>
            </NavLink>
          );
        })}

      </div>
    </nav>
  );
}

export default MobileNavigation;
