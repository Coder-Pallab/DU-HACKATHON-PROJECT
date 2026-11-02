import {
  CheckCircle2,
  Clock,
  Lock,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const defaultMilestones = [
  {
    id: 1,
    title: "HTML Fundamentals",
    description: "Learn HTML elements, forms, semantic tags and page structure.",
    duration: "2 Weeks",
    status: "completed",
  },
  {
    id: 2,
    title: "CSS & Responsive Design",
    description: "Understand styling, Flexbox, Grid and responsive layouts.",
    duration: "3 Weeks",
    status: "completed",
  },
  {
    id: 3,
    title: "JavaScript Fundamentals",
    description: "Learn variables, functions, arrays, objects and DOM manipulation.",
    duration: "4 Weeks",
    status: "current",
  },
  {
    id: 4,
    title: "React.js Development",
    description: "Understand components, props, hooks and React Router.",
    duration: "4 Weeks",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Build Real-world Projects",
    description: "Create practical projects and develop a strong portfolio.",
    duration: "3 Weeks",
    status: "upcoming",
  },
];

function RoadmapTimeline({
  milestones = defaultMilestones,
}) {
  const { t } = useLanguage();

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle2 size={21} />;
    }

    if (status === "current") {
      return <Clock size={21} />;
    }

    return <Lock size={19} />;
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "border-green-500 bg-green-50 text-green-600";
    }

    if (status === "current") {
      return "border-teal-600 bg-teal-50 text-teal-700";
    }

    return "border-slate-300 bg-slate-50 text-slate-400";
  };

  const getStatusLabel = (status) => {
    if (status === "completed") return t("Completed");
    if (status === "current") return t("In Progress");
    return t("Upcoming");
  };

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Heading */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <BookOpen size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {t("Learning Timeline")}
            </h2>

            <p className="text-sm text-slate-500">
              {t("Follow your learning journey step by step.")}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">

        {milestones.map((milestone, index) => (
          <div
            key={milestone.id ?? index}
            className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5"
          >

            {/* Icon and connecting line */}
            <div className="relative flex shrink-0 flex-col items-center">

              <div
                className={`z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 ${getStatusStyle(
                  milestone.status
                )}`}
              >
                {getStatusIcon(milestone.status)}
              </div>

              {index !== milestones.length - 1 && (
                <div
                  className={`absolute top-11 h-full w-0.5 ${
                    milestone.status === "completed"
                      ? "bg-green-400"
                      : "bg-slate-200"
                  }`}
                />
              )}

            </div>

            {/* Milestone Details */}
            <div
              className={`min-w-0 flex-1 rounded-xl border p-4 ${
                milestone.status === "current"
                  ? "border-teal-200 bg-teal-50/50"
                  : "border-slate-100 bg-white"
              }`}
            >

              <div className="flex flex-wrap items-start justify-between gap-3">

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800">
                    {t(milestone.title, milestone.title)}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {t(milestone.description, milestone.description)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    milestone.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : milestone.status === "current"
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getStatusLabel(milestone.status)}
                </span>

              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                {t("Estimated duration:")} {t(milestone.duration, milestone.duration)}
              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default RoadmapTimeline;
