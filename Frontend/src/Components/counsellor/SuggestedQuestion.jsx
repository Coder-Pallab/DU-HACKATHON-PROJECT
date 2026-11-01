import {
  Compass,
  GraduationCap,
  BriefcaseBusiness,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const questions = [
  {
    icon: Compass,
    title: "Explore career options",
    question: "What career options are available for me?",
  },
  {
    icon: GraduationCap,
    title: "Higher education",
    question: "Which higher education options should I consider?",
  },
  {
    icon: BriefcaseBusiness,
    title: "Find internships",
    question: "How can I find internships as a student?",
  },
  {
    icon: BookOpen,
    title: "Improve my skills",
    question: "Which skills should I learn to improve my career?",
  },
  {
    icon: TrendingUp,
    title: "Career growth",
    question: "How can I prepare for a successful career?",
  },
];

function SuggestedQuestions({ onSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">
        Suggested questions
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {questions.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect?.(item.question)}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-teal-300 hover:bg-teal-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {item.question}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
