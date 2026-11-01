import { useState } from "react";
import {
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react";

function SkillGapAnalysis() {
  const careerSkills = [
    {
      id: 1,
      name: "HTML",
      level: "Beginner",
      required: "Intermediate",
      completed: true,
    },
    {
      id: 2,
      name: "CSS",
      level: "Intermediate",
      required: "Advanced",
      completed: true,
    },
    {
      id: 3,
      name: "JavaScript",
      level: "Intermediate",
      required: "Advanced",
      completed: true,
    },
    {
      id: 4,
      name: "React.js",
      level: "Intermediate",
      required: "Advanced",
      completed: true,
    },
    {
      id: 5,
      name: "TypeScript",
      level: "Not Learned",
      required: "Intermediate",
      completed: false,
    },
    {
      id: 6,
      name: "Git & GitHub",
      level: "Beginner",
      required: "Intermediate",
      completed: false,
    },
  ];

  const [selectedCareer, setSelectedCareer] = useState("Frontend Developer");

  const completedSkills = careerSkills.filter(
    (skill) => skill.completed
  );

  const missingSkills = careerSkills.filter(
    (skill) => !skill.completed
  );

  const progress = Math.round(
    (completedSkills.length / careerSkills.length) * 100
  );

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <Target size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Skill Gap Analysis
            </h2>

            <p className="text-sm text-slate-500">
              Identify the skills you need for your career.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          Sample Analysis
        </span>
      </div>

      {/* Career Selection */}
      <div className="mb-6">
        <label
          htmlFor="selectedCareer"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Select Your Target Career
        </label>

        <select
          id="selectedCareer"
          value={selectedCareer}
          onChange={(event) => setSelectedCareer(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:max-w-md"
        >
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Data Analyst</option>
          <option>UI/UX Designer</option>
        </select>
      </div>

      {/* Progress Overview */}
      <div className="mb-6 rounded-xl bg-teal-50 p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-teal-800">
              Your skill readiness
            </p>

            <h3 className="mt-1 text-2xl font-bold text-teal-900">
              {progress}%
            </h3>
          </div>

          <div className="rounded-full bg-white p-3 text-teal-700">
            <TrendingUp size={24} />
          </div>
        </div>

        <div
          className="h-3 w-full overflow-hidden rounded-full bg-white"
          role="progressbar"
          aria-label="Skill readiness"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-teal-800">
          You currently have {completedSkills.length} out of{" "}
          {careerSkills.length} listed skills marked as completed.
        </p>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Existing Skills */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 size={19} className="text-green-600" />

            <h3 className="font-semibold text-slate-800">
              Your Existing Skills
            </h3>
          </div>

          <div className="space-y-3">
            {completedSkills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-green-100 bg-green-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-800">
                    {skill.name}
                  </span>

                  <span className="text-xs font-semibold text-green-700">
                    {skill.level}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Required level: {skill.required}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle size={19} className="text-amber-600" />

            <h3 className="font-semibold text-slate-800">
              Skills to Develop
            </h3>
          </div>

          <div className="space-y-3">
            {missingSkills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-amber-100 bg-amber-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-800">
                    {skill.name}
                  </span>

                  <span className="text-xs font-semibold text-amber-700">
                    {skill.level}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Target level: {skill.required}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Learning Recommendation */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <BookOpen size={21} className="mt-0.5 shrink-0 text-teal-700" />

        <div>
          <h4 className="font-semibold text-slate-800">
            Learning Recommendation
          </h4>

          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Focus on learning TypeScript and improving your Git and GitHub
            knowledge to strengthen your {selectedCareer} profile.
          </p>
        </div>
      </div>

    </section>
  );
}

export default SkillGapAnalysis;