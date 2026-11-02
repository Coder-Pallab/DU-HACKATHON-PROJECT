import { Target, TrendingUp, Award } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function ReadinessScore({
  score = 72,
  technical = 80,
  aptitude = 65,
  communication = 70,
}) {
  const { t } = useLanguage();

  const categories = [
    { name: "Technical Skills", value: technical },
    { name: "Aptitude", value: aptitude },
    { name: "Communication", value: communication },
  ];

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Target size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {t("Placement Readiness")}
          </h2>
          <p className="text-sm text-gray-500">
            {t("Your overall preparation score")}
          </p>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
          <svg
            className="-rotate-90"
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
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
            <p className="text-3xl font-bold text-gray-800">
              {score}%
            </p>
            <p className="text-xs text-gray-500">{t("Readiness")}</p>
          </div>
        </div>

        {/* Score Summary */}
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
            <div key={category.name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  {t(category.name, category.name)}
                </span>
                <span className="font-semibold text-gray-800">
                  {category.value}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-700"
                  style={{ width: `${category.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
        <TrendingUp size={17} className="text-teal-600" />
        <span>{t("Keep practising to improve your placement readiness.")}</span>
      </div>
    </div>
  );
}

export default ReadinessScore;
