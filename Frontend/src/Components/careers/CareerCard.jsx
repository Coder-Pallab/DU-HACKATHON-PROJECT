import {
  BriefcaseBusiness,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function CareerCard({
  title = "Frontend Developer",
  description = "Build responsive and interactive websites using modern frontend technologies.",
  matchPercentage = 92,
  salary = "₹3-8 LPA",
  experience = "0-2 Years",
  skills = ["HTML", "CSS", "JavaScript", "React"],
  onViewDetails,
}) {
  const { t } = useLanguage();

  const getMatchStyle = () => {
    if (matchPercentage >= 85) {
      return "bg-green-100 text-green-700";
    }

    if (matchPercentage >= 70) {
      return "bg-teal-100 text-teal-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <article className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-teal-50 p-3 text-teal-700">
            <BriefcaseBusiness size={22} />
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold text-slate-800">
              {t(title, title)}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {t("Recommended career")}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getMatchStyle()}`}
        >
          {matchPercentage}% {t("Match")}
        </span>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-slate-600">
        {t(description, description)}
      </p>

      {/* Career Information */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <TrendingUp size={16} />
            <span className="text-xs">{t("Expected Salary")}</span>
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {salary}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            <span className="text-xs">{t("Experience")}</span>
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {experience}
          </p>
        </div>
      </div>

      {/* Required Skills */}
      <div className="mb-5">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">
          {t("Relevant Skills")}
        </h4>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onViewDetails}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          {t("View Career Details")}
          <ArrowRight size={17} />
        </button>
      </div>

    </article>
  );
}

export default CareerCard;
