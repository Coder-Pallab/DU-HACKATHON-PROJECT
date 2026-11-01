import {
  Brain,
  Code,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const iconMap = {
  aptitude: Brain,
  technical: Code,
  communication: MessageCircle,
};

function AssessmentCard({
  title = "Aptitude Assessment",
  description = "Test your logical reasoning and problem-solving skills.",
  category = "aptitude",
  duration = "30 minutes",
  questions = 20,
  status = "Not Started",
  score = null,
  onStart,
}) {
  const Icon = iconMap[category] || Brain;

  const isCompleted = status === "Completed";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Icon size={23} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isCompleted
              ? "bg-green-50 text-green-700"
              : status === "In Progress"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>

        {/* Assessment Information */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={15} />
            <span>{duration}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Brain size={15} />
            <span>{questions} Questions</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 size={17} />
            <span>Score: {score ?? 0}%</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">
            Ready to begin?
          </span>
        )}

        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          {isCompleted ? "Retake" : "Start"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default AssessmentCard;