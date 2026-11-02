import { lazy, Suspense, useState } from "react";
import { Target, BookOpen, Trophy, ClipboardCheck } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

import PageHeader from "../../Components/layout/PageHeader";

import ReadinessScore from "../../Components/placement/ReadinessScore";
import AssessmentCard from "../../Components/placement/AssessmentCard";
import InterviewPrep from "../../Components/placement/InterviewPrep";
import QuizCard from "../../Components/placement/QuizCard";

const ProgressChart = lazy(
  () => import("../../Components/placement/ProgressChart")
);

const assessments = [
  {
    id: 1,
    title: "Aptitude Assessment",
    description: "Test your logical reasoning and problem-solving skills.",
    category: "aptitude",
    duration: "30 minutes",
    questions: 20,
    status: "Not Started",
  },
  {
    id: 2,
    title: "Technical Assessment",
    description: "Evaluate your programming and technical knowledge.",
    category: "technical",
    duration: "45 minutes",
    questions: 30,
    status: "Not Started",
  },
  {
    id: 3,
    title: "Communication Assessment",
    description: "Evaluate your professional communication skills.",
    category: "communication",
    duration: "20 minutes",
    questions: 15,
    status: "Completed",
    score: 85,
  },
];

function PlacementReadiness() {
  const { t } = useLanguage();
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const stats = [
    {
      title: "Readiness Score",
      value: "72%",
      icon: Target,
    },
    {
      title: "Assessments",
      value: "3",
      icon: ClipboardCheck,
    },
    {
      title: "Completed Tests",
      value: "1",
      icon: Trophy,
    },
    {
      title: "Practice Areas",
      value: "3",
      icon: BookOpen,
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Placement Readiness"
        description="Track your preparation, practise assessments and get ready for your dream job."
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t(stat.title, stat.title)}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Readiness Score */}
      <ReadinessScore
        score={72}
        technical={80}
        aptitude={65}
        communication={70}
      />

      {/* Assessments */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {t("Placement Assessments")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("Evaluate your skills through practice assessments.")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              {...assessment}
              onStart={() => setSelectedAssessment(assessment)}
            />
          ))}
        </div>
      </section>

      {/* Assessment Selection Feedback */}
      {selectedAssessment && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-medium text-teal-800">
            {t(selectedAssessment.title, selectedAssessment.title)} {t("selected.")}
          </p>

          <p className="mt-1 text-xs text-teal-700">
            {t("The assessment interface will be developed in a future step.")}
          </p>

          <button
            type="button"
            onClick={() => setSelectedAssessment(null)}
            className="mt-3 text-sm font-semibold text-teal-800 hover:underline"
          >
            {t("Close")}
          </button>
        </div>
      )}

      {/* Progress Chart */}
      <Suspense
        fallback={
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-sm">
            {t("Loading progress chart...")}
          </div>
        }
      >
        <ProgressChart />
      </Suspense>

      {/* Quiz */}
      <QuizCard />

      {/* Interview Preparation */}
      <InterviewPrep />
    </div>
  );
}

export default PlacementReadiness;
