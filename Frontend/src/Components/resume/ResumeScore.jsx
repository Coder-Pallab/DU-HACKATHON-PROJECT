import { Award, TrendingUp, AlertCircle } from "lucide-react";
import ProgressBar from "../common/ProgressBar";
import { useLanguage } from "../../hooks/useLanguage";

function ResumeScore({ score = 78 }) {
  const { t } = useLanguage();

  const categories = [
    {
      name: "Formatting",
      score: 90,
    },
    {
      name: "Skills",
      score: 75,
    },
    {
      name: "Education",
      score: 85,
    },
    {
      name: "Experience",
      score: 60,
    },
  ];

  const getScoreLabel = (value) => {
    if (value >= 85) return "Excellent";
    if (value >= 70) return "Good";
    if (value >= 50) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Award size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Resume Score")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Your resume performance overview.")}
          </p>
        </div>
      </div>

      {/* Main Score */}
      <div className="mb-7 flex flex-col items-center rounded-xl bg-teal-50 p-6">

        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[8px] border-teal-600 bg-white">
          <span className="text-3xl font-bold text-slate-800">
            {score}
          </span>

          <span className="text-xs text-slate-500">
            {t("Out of 100")}
          </span>
        </div>

        <span className="mt-4 rounded-full bg-white px-4 py-1 text-sm font-semibold text-teal-700">
          {t(getScoreLabel(score))}
        </span>

        <p className="mt-2 text-center text-sm text-slate-600">
          {t("Keep improving your resume to increase your career opportunities.")}
        </p>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="mb-5 font-semibold text-slate-800">
          {t("Score Breakdown")}
        </h3>

        <div className="space-y-5">
          {categories.map((category) => (
            <div key={category.name}>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {t(category.name, category.name)}
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {category.score}%
                </span>
              </div>

              <ProgressBar value={category.score} showLabel={false} />

            </div>
          ))}
        </div>
      </div>

      {/* Improvement Message */}
      <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

        <AlertCircle size={20} className="shrink-0 text-amber-600" />

        <div>
          <h4 className="text-sm font-semibold text-amber-800">
            {t("Room for Improvement")}
          </h4>

          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            {t("Focus on improving your experience section to strengthen your resume.")}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <TrendingUp size={15} className="text-teal-600" />
        {t("Resume improvement insights")}
      </div>

    </div>
  );
}

export default ResumeScore;
