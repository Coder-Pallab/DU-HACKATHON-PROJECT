import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function LearningMilestone({
  title = "JavaScript Fundamentals",
  description = "Understand the core concepts of JavaScript.",
  duration = "4 Weeks",
  topics = [
    "Variables and Data Types",
    "Functions and Scope",
    "Arrays and Objects",
    "DOM Manipulation",
    "ES6+ Features",
  ],
  initialCompletedTopics = [],
}) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const [completedTopics, setCompletedTopics] = useState(
    initialCompletedTopics
  );

  const progress =
    topics.length === 0
      ? 0
      : Math.round((completedTopics.length / topics.length) * 100);

  const toggleTopic = (topic) => {
    setCompletedTopics((previous) =>
      previous.includes(topic)
        ? previous.filter((item) => item !== topic)
        : [...previous, topic]
    );
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div className="flex min-w-0 items-start gap-3">

          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <BookOpen size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
              {t(title, title)}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {t(description, description)}
            </p>
          </div>

        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          <Clock size={14} />
          {t(duration, duration)}
        </span>

      </div>

      {/* Progress */}
      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Target size={16} />
            {t("Learning Progress")}
          </div>

          <span className="text-sm font-bold text-teal-700">
            {progress}%
          </span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress`}
        >
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {completedTopics.length} {t("of")} {topics.length} {t("topics completed")}
        </p>

      </div>

      {/* Expand Button */}
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
      >
        {isExpanded ? t("Hide Learning Topics") : t("View Learning Topics")}

        {isExpanded ? (
          <ChevronUp size={19} />
        ) : (
          <ChevronDown size={19} />
        )}
      </button>

      {/* Learning Topics */}
      {isExpanded && (
        <div className="mt-4 space-y-3 animate-fade-in">

          {topics.map((topic, index) => {
            const isCompleted = completedTopics.includes(topic);

            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:bg-slate-50"
              >

                {isCompleted ? (
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-green-600"
                  />
                ) : (
                  <Circle
                    size={20}
                    className="shrink-0 text-slate-400"
                  />
                )}

                <span
                  className={`min-w-0 flex-1 text-sm ${
                    isCompleted
                      ? "text-slate-400 line-through"
                      : "text-slate-700"
                  }`}
                >
                  {index + 1}. {t(topic, topic)}
                </span>

                <span className="shrink-0 text-xs text-slate-400">
                  {isCompleted ? t("Completed") : t("Pending")}
                </span>

              </button>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default LearningMilestone;
