import { Link } from "react-router-dom";

import {
  UserRound,
  FileText,
  BriefcaseBusiness,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Complete Profile",
    description: "Update your personal details.",
    path: "/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "Upload Resume",
    description: "Manage your resume and skills.",
    path: "/dashboard/resume",
    icon: FileText,
  },
  {
    title: "Explore Careers",
    description: "Discover career opportunities.",
    path: "/dashboard/careers",
    icon: BriefcaseBusiness,
  },
  {
    title: "Learning Roadmap",
    description: "Plan your learning journey.",
    path: "/dashboard/roadmap",
    icon: BookOpen,
  },
];

function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="text-lg font-bold text-slate-900">
        Quick Actions
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Access your important features quickly.
      </p>

      <div className="mt-5 space-y-3">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.path}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-teal-200 hover:bg-teal-50"
            >

              <div className="rounded-lg bg-teal-50 p-2.5 text-teal-700">
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="text-sm font-semibold text-slate-800">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>

              </div>

              <ArrowRight size={17} className="text-slate-400" />

            </Link>
          );
        })}

      </div>

    </div>
  );
}

export default QuickActions;