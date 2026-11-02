import { useState } from "react";
import {
  Code,
  Users,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const interviewCategories = [
  {
    id: 1,
    title: "Technical Interview",
    description: "Prepare for programming, DSA and technical concepts.",
    icon: Code,
    questions: [
      {
        question: "What is the difference between let, const and var in JavaScript?",
        answer:
          "var is function-scoped, while let and const are block-scoped. const cannot be reassigned after declaration.",
      },
      {
        question: "What is Object-Oriented Programming?",
        answer:
          "OOP is a programming approach based on objects and classes. Its four main principles are encapsulation, inheritance, polymorphism and abstraction.",
      },
      {
        question: "What is the difference between SQL and NoSQL?",
        answer:
          "SQL databases generally use structured tables and relational schemas. NoSQL databases support flexible data models such as documents, key-value pairs and graphs.",
      },
    ],
  },
  {
    id: 2,
    title: "HR Interview",
    description: "Improve your confidence and communication skills.",
    icon: Users,
    questions: [
      {
        question: "Tell me about yourself.",
        answer:
          "Introduce your educational background, technical skills, projects and career goals in a clear and structured way.",
      },
      {
        question: "What are your strengths and weaknesses?",
        answer:
          "Mention genuine strengths with examples. For weaknesses, explain what you are actively doing to improve.",
      },
      {
        question: "Why should we hire you?",
        answer:
          "Connect your skills, willingness to learn and relevant project experience with the requirements of the role.",
      },
    ],
  },
  {
    id: 3,
    title: "Communication Skills",
    description: "Practise professional communication and presentation.",
    icon: MessageSquare,
    questions: [
      {
        question: "How do you explain a technical project to a non-technical person?",
        answer:
          "Focus on the problem, your solution and its benefits. Avoid unnecessary technical terminology.",
      },
      {
        question: "How do you handle disagreements in a team?",
        answer:
          "Listen carefully, understand different perspectives and work towards a solution that supports the team's goal.",
      },
      {
        question: "How do you handle pressure?",
        answer:
          "Prioritise tasks, break complex work into smaller steps and communicate early when you need support.",
      },
    ],
  },
];

function InterviewPrep() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(1);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const selectedCategory = interviewCategories.find(
    (category) => category.id === activeCategory
  );

  const toggleQuestion = (index) => {
    setExpandedQuestion(
      expandedQuestion === index ? null : index
    );
  };

  return (
    <div className="w-full space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {t("Interview Preparation")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t("Practise common interview questions and improve your confidence.")}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-teal-700">
          <Clock size={17} />
          <span>{t("Practice at your own pace")}</span>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {interviewCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setActiveCategory(category.id);
                setExpandedQuestion(null);
              }}
              className={`rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 bg-white hover:border-teal-300"
              }`}
            >
              <Icon
                size={22}
                className={
                  isActive ? "text-teal-700" : "text-gray-500"
                }
              />

              <h3 className="mt-3 text-sm font-semibold text-gray-800">
                {t(category.title, category.title)}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {t(category.description, category.description)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800">
          {t(selectedCategory.title, selectedCategory.title)} {t("Questions")}
        </h3>

        {selectedCategory.questions.map((item, index) => {
          const isExpanded = expandedQuestion === index;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <button
                type="button"
                onClick={() => toggleQuestion(index)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-gray-50"
              >
                <span className="text-sm font-medium leading-relaxed text-gray-700">
                  {index + 1}. {t(item.question, item.question)}
                </span>

                {isExpanded ? (
                  <ChevronUp size={18} className="shrink-0 text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="shrink-0 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                  <p className="font-medium text-teal-800">{t("Sample Answer:")}</p>
                  <p className="mt-1">{t(item.answer, item.answer)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InterviewPrep;
