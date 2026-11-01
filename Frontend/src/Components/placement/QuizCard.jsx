import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Trophy,
} from "lucide-react";

const questions = [
  {
    id: 1,
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    answer: "Stack",
  },
  {
    id: 2,
    question: "Which language is primarily used for frontend web development?",
    options: ["Python", "Java", "JavaScript", "C"],
    answer: "JavaScript",
  },
  {
    id: 3,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Question Language",
      "System Query Logic",
      "Standard Quick Language",
    ],
    answer: "Structured Query Language",
  },
  {
    id: 4,
    question: "Which sorting algorithm uses the divide-and-conquer approach?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Linear Search"],
    answer: "Merge Sort",
  },
  {
    id: 5,
    question: "Which of the following is an operating system?",
    options: ["React", "Linux", "HTML", "MongoDB"],
    answer: "Linux",
  },
];

function QuizCard() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];

  const handleNext = () => {
    if (!selectedAnswer) return;

    const updatedAnswers = {
      ...userAnswers,
      [question.id]: selectedAnswer,
    };

    setUserAnswers(updatedAnswers);

    if (currentQuestion === questions.length - 1) {
      setShowResult(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(
        updatedAnswers[questions[currentQuestion + 1].id] || ""
      );
    }
  };

  const score = questions.filter(
    (item) => userAnswers[item.id] === item.answer
  ).length;

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setUserAnswers({});
    setShowResult(false);
  };

  // Result screen
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          <Trophy size={32} />
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Quiz Completed!
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Here is your placement quiz result.
        </p>

        <div className="my-6">
          <p className="text-5xl font-bold text-teal-700">
            {percentage}%
          </p>

          <p className="mt-2 text-sm text-gray-500">
            You scored {score} out of {questions.length}
          </p>
        </div>

        <p className="mb-6 text-sm font-medium text-gray-700">
          {percentage >= 80
            ? "Excellent work! Keep it up."
            : percentage >= 50
            ? "Good effort! Keep practising."
            : "Keep learning and try again!"}
        </p>

        <button
          type="button"
          onClick={restartQuiz}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          <RotateCcw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Brain size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Placement Quiz
            </h2>

            <p className="text-sm text-gray-500">
              Test your technical knowledge.
            </p>
          </div>
        </div>

        <span className="text-sm font-medium text-teal-700">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-300"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="mt-6">
        <h3 className="text-base font-semibold leading-relaxed text-gray-800 sm:text-lg">
          {question.question}
        </h3>

        {/* Options */}
        <div className="mt-5 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedAnswer(option)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                  isSelected
                    ? "border-teal-500 bg-teal-50 text-teal-800"
                    : "border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                    isSelected
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>

                {isSelected && (
                  <CheckCircle2
                    size={18}
                    className="ml-auto shrink-0 text-teal-700"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}

          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default QuizCard;
