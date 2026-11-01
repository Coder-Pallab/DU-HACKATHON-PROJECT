import {
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function ResumeSuggestions() {
  const suggestions = [
    {
      id: 1,
      title: "Improve Your Experience Section",
      description:
        "Add practical projects, internships, or work experience to demonstrate your abilities.",
      priority: "High",
      type: "warning",
    },
    {
      id: 2,
      title: "Add More Technical Skills",
      description:
        "Include relevant technical skills such as Git, GitHub, APIs, and database management.",
      priority: "Medium",
      type: "info",
    },
    {
      id: 3,
      title: "Include Practical Projects",
      description:
        "Add 2–3 projects with descriptions of the technologies used and your contributions.",
      priority: "High",
      type: "warning",
    },
    {
      id: 4,
      title: "Improve Resume Formatting",
      description:
        "Keep your resume consistent, readable, and easy for recruiters to scan.",
      priority: "Low",
      type: "success",
    },
  ];

  const priorityStyles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-green-100 text-green-700",
  };

  const icons = {
    warning: AlertCircle,
    info: Lightbulb,
    success: CheckCircle2,
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Lightbulb size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Resume Improvement Suggestions
          </h2>

          <p className="text-sm text-slate-500">
            Recommendations to strengthen your resume.
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const Icon = icons[suggestion.type];

          return (
            <div
              key={suggestion.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-start"
            >
              {/* Icon */}
              <div className="w-fit rounded-lg bg-slate-50 p-2 text-teal-700">
                <Icon size={20} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-800">
                    {suggestion.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[suggestion.priority]}`}
                  >
                    {suggestion.priority} Priority
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                  {suggestion.description}
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                aria-label={`View suggestion: ${suggestion.title}`}
                className="flex w-fit shrink-0 items-center gap-1 text-sm font-medium text-teal-700 transition-colors hover:text-teal-900"
              >
                View <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 rounded-xl bg-teal-50 p-4">
        <p className="text-sm leading-relaxed text-teal-800">
          <strong>Remember:</strong> A strong resume highlights your skills,
          practical experience, projects, and achievements clearly.
        </p>
      </div>

    </section>
  );
}

export default ResumeSuggestions;