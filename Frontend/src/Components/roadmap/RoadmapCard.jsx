import {
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function RoadmapCard({
  title = "Frontend Developer",
  description = "Learn frontend development from the basics to advanced concepts.",
  duration = "6 Months",
  milestones = 8,
  progress = 35,
  level = "Beginner to Advanced",
  onViewRoadmap,
}) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">

      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <BookOpen size={24} />
        </div>

        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          {level}
        </span>

      </div>

      {/* Title and Description */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {/* Roadmap Information */}
      <div className="mb-5 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            <span className="text-xs">Duration</span>
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {duration}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Target size={16} />
            <span className="text-xs">Milestones</span>
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {milestones} Steps
          </p>
        </div>

      </div>

      {/* Progress */}
      <div className="mb-5 mt-auto">

        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Your Progress
          </span>

          <span className="text-sm font-bold text-teal-700">
            {progress}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
            }}
          />
        </div>

      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <TrendingUp size={15} className="text-teal-600" />
          Career-focused learning
        </div>

        <button
          type="button"
          onClick={onViewRoadmap}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          View Roadmap
          <ArrowRight size={16} />
        </button>

      </div>

    </div>
  );
}

export default RoadmapCard;