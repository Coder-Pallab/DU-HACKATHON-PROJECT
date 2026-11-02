import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import {
  LayoutDashboard,
  UserRound,
  FileText,
  BriefcaseBusiness,
  BookOpen,
  MessageCircle,
  Target,
  Building2,
  Bookmark,
  Bell,
  Settings,
  CircleHelp,
  X,
} from "lucide-react";

const navigation = [
  {
    title: "MAIN MENU",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        end: true,
      },
      {
        name: "My Profile",
        path: "/dashboard/profile",
        icon: UserRound,
      },
      {
        name: "Resume & Skills",
        path: "/dashboard/resume",
        icon: FileText,
      },
      {
        name: "Career Matches",
        path: "/dashboard/careers",
        icon: BriefcaseBusiness,
      },
      {
        name: "Learning Roadmap",
        path: "/dashboard/roadmap",
        icon: BookOpen,
      },
      {
        name: "AI Counsellor",
        path: "/dashboard/counsellor",
        icon: MessageCircle,
      },
      {
        name: "Placement Readiness",
        path: "/dashboard/placement",
        icon: Target,
      },
      {
        name: "Jobs & Internships",
        path: "/dashboard/jobs",
        icon: Building2,
      },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      {
        name: "Saved Items",
        path: "/dashboard/saved",
        icon: Bookmark,
      },
      {
        name: "Notifications",
        path: "/dashboard/notifications",
        icon: Bell,
      },
      {
        name: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
      },
      {
        name: "Help & Support",
        path: "/dashboard/help",
        icon: CircleHelp,
      },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-[72px] z-50 w-[260px] overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform duration-300 lg:sticky lg:top-[72px] lg:z-30 lg:block lg:h-[calc(100vh-72px)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <h2 className="font-semibold text-slate-800">
            {t("sidebar.navigation", "Navigation")}
          </h2>

          <button onClick={onClose} aria-label="Close menu">
            <X size={21} />
          </button>
        </div>

        {navigation.map((section) => (
          <div key={section.title} className="mb-7">

            <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-slate-400">
              {t(section.title, section.title)}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl border-l-2 px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "border-teal-700 bg-teal-50 text-teal-800"
                          : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                      }`
                    }
                  >
                    <Icon size={19} />
                    {t(item.name, item.name)}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sidebar Bottom Card */}
        <div className="rounded-xl bg-teal-50 p-4">
          <h3 className="font-semibold text-teal-900">
            {t("sidebar.needGuidance", "Need Guidance?")}
          </h3>

          <p className="mt-2 text-xs leading-5 text-teal-800">
            {t("sidebar.needGuidanceDesc", "Explore career opportunities and plan your future with Disha.")}
          </p>

          <button className="mt-3 text-sm font-semibold text-teal-700 hover:underline">
            {t("sidebar.exploreCareers", "Explore Careers →")}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
