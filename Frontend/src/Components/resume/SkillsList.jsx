import { Code2 } from "lucide-react";
import SkillCard from "./SkillCard";
import { useLanguage } from "../../hooks/useLanguage";

function SkillsList() {
  const { t } = useLanguage();

  const skills = [
    {
      id: 1,
      name: "HTML & CSS",
      level: "Advanced",
      percentage: 90,
    },
    {
      id: 2,
      name: "JavaScript",
      level: "Intermediate",
      percentage: 75,
    },
    {
      id: 3,
      name: "React.js",
      level: "Intermediate",
      percentage: 70,
    },
    {
      id: 4,
      name: "Node.js",
      level: "Beginner",
      percentage: 40,
    },
    {
      id: 5,
      name: "Express.js",
      level: "Intermediate",
      percentage: 65,
    },
    {
      id: 6,
      name: "MongoDB",
      level: "Beginner",
      percentage: 45,
    },
  ];

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Code2 size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Extracted Skills")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Overview of your technical skills and proficiency.")}
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            name={skill.name}
            level={skill.level}
            percentage={skill.percentage}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 rounded-xl bg-teal-50 p-4">
        <p className="text-sm leading-relaxed text-teal-800">
          <strong>{t("Tip:")}</strong>{" "}
          {t("Keep developing your skills through practical projects and consistent learning.")}
        </p>
      </div>

    </section>
  );
}

export default SkillsList;
