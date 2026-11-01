import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  BookOpen,
  UserRound,
} from "lucide-react";

const mobileLinks = [
  {
    name: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Careers",
    path: "/dashboard/careers",
    icon: BriefcaseBusiness,
  },
  {
    name: "Roadmap",
    path: "/dashboard/roadmap",
    icon: BookOpen,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: UserRound,
  },
];

function MobileNavigation() {
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
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </div>
    </nav>
  );
}

export default MobileNavigation;
