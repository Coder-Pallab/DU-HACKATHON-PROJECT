import { Code2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function SkillCard({
  name = "React.js",
  level = "Intermediate",
  percentage = 75,
}) {
  const { t } = useLanguage();

  const getLevelStyle = () => {
    if (percentage >= 80) {
      return "bg-green-100 text-green-700";
    }

    if (percentage >= 60) {
      return "bg-teal-100 text-teal-700";
    }

    if (percentage >= 40) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">

      {/* Skill Header */}
      <div className="mb-4 flex items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
            <Code2 size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-800">
              {name}
            </h3>

            <p className="text-xs text-slate-500">
              {t("Skill proficiency")}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getLevelStyle()}`}
        >
          {t(level, level)}
        </span>

      </div>

      {/* Progress */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {t("Proficiency")}
        </span>

        <span className="text-sm font-semibold text-slate-800">
          {percentage}%
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={`${name} proficiency`}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}

export default SkillCard;
