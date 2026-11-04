import { Award, Target, TrendingUp } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function ReadinessScore({ assessment }) {
  const { t } = useLanguage();
  const score = assessment?.overallScore;
  const hasScore = Number.isFinite(score);
  const categories = assessment?.categoryScores || [];
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = hasScore ? (score / 100) * circumference : 0;

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Target size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Placement Readiness")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("Your overall preparation score")}
          </p>
        </div>
      </div>

      {hasScore ? (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
          <div
            className="relative flex h-40 w-40 shrink-0 items-center justify-center"
            role="img"
            aria-label={`${score}% ${t("Readiness")}`}
          >
            <svg className="-rotate-90" width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#0f766e"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-3xl font-bold text-slate-800">{score}%</p>
              <p className="text-xs text-slate-500">{t("Readiness")}</p>
            </div>
          </div>

          <div className="w-full flex-1 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
              <Award size={18} />
              <span>
                {score >= 80
                  ? t("Excellent preparation!")
                  : score >= 60
                    ? t("Good progress!")
                    : t("Keep improving!")}
              </span>
            </div>
            {categories.map((category) => (
              <div key={category.key}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="text-slate-600">{category.label}</span>
                  <span className="shrink-0 font-semibold text-slate-800">
                    {category.score}%
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuenow={category.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={category.label}
                >
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-700"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                {category.evidence?.map((evidence) => (
                  <p key={evidence} className="mt-1 text-xs leading-5 text-slate-500">
                    {evidence}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-semibold">{t("Not enough data for a readiness score yet.")}</p>
          {assessment?.explanation && <p className="mt-1">{assessment.explanation}</p>}
        </div>
      )}

      {assessment?.explanation && hasScore && (
        <p className="mt-5 text-sm leading-6 text-slate-600">{assessment.explanation}</p>
      )}
      {assessment?.disclaimer && (
        <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          <TrendingUp size={16} className="mt-0.5 shrink-0 text-teal-600" />
          <p>{assessment.disclaimer}</p>
        </div>
      )}
    </section>
  );
}

export default ReadinessScore;
