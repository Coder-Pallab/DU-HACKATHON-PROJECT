import { useMemo, useState } from "react";

import PageHeader from "../../Components/layout/PageHeader";

import CareerCard from "../../Components/careers/CareerCard";
import CareerFilters from "../../Components/careers/CareerFilters";
import CareerComparison from "../../Components/careers/CareerComparison";
import SkillGapAnalysis from "../../Components/careers/SkillGapAnalysis";
import CareerDetails from "../../Components/careers/CareerDetails";

const careers = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Technology",
    description:
      "Build responsive and interactive websites using modern frontend technologies.",
    matchPercentage: 92,
    salary: "₹3–8 LPA",
    experience: "0–2 Years",
    growth: "High",
    qualification: "BCA, B.Tech, MCA or equivalent skills",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    responsibilities: [
      "Develop responsive websites.",
      "Convert UI designs into functional interfaces.",
      "Write clean and maintainable code.",
      "Fix bugs and improve performance.",
    ],
    learningPath: [
      "Learn HTML, CSS and JavaScript.",
      "Understand React.js.",
      "Learn Git and GitHub.",
      "Build practical projects.",
      "Prepare for technical interviews.",
    ],
  },
  {
    id: 2,
    title: "Data Analyst",
    category: "Data Science",
    description:
      "Analyze data, identify patterns and help organizations make better decisions.",
    matchPercentage: 85,
    salary: "₹4–9 LPA",
    experience: "0–2 Years",
    growth: "High",
    qualification: "BCA, B.Tech or equivalent",
    skills: ["Python", "SQL", "Excel", "Power BI"],
    responsibilities: [
      "Analyze structured datasets.",
      "Prepare reports and dashboards.",
      "Identify trends and patterns.",
      "Present data-driven insights.",
    ],
    learningPath: [
      "Learn Excel.",
      "Learn SQL.",
      "Learn Python.",
      "Practice data visualization.",
      "Build data analysis projects.",
    ],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    category: "Design",
    description:
      "Design user-friendly digital experiences through research, wireframes and prototypes.",
    matchPercentage: 78,
    salary: "₹3–7 LPA",
    experience: "0–2 Years",
    growth: "High",
    qualification: "Any relevant degree with design skills",
    skills: ["Figma", "Wireframing", "Prototyping", "Design Thinking"],
    responsibilities: [
      "Create wireframes and prototypes.",
      "Design user interfaces.",
      "Conduct user research.",
      "Improve user experience.",
    ],
    learningPath: [
      "Learn design fundamentals.",
      "Learn Figma.",
      "Practice wireframing.",
      "Create interactive prototypes.",
      "Build a design portfolio.",
    ],
  },
];

function CareerMatches() {
  const [selectedCareer, setSelectedCareer] = useState(null);

  const [filters, setFilters] = useState({
    category: "All",
    salary: "All",
    experience: "All",
  });

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const categoryMatch =
        filters.category === "All" ||
        career.category === filters.category;

      const experienceMatch =
        filters.experience === "All" ||
        career.experience === filters.experience;

      return categoryMatch && experienceMatch;
    });
  }, [filters]);

  return (
    <div className="w-full min-w-0 space-y-8">

      {/* Page Header */}
      <PageHeader
        title="Career Matches"
        description="Explore career opportunities based on your interests, skills and qualifications."
      />

      {/* Career Filters */}
      <section className="min-w-0">
        <CareerFilters onFilterChange={setFilters} />
      </section>

      {/* Career Recommendations */}
      <section className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recommended Careers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explore career paths that match your profile.
          </p>
        </div>

        {filteredCareers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {filteredCareers.map((career) => (
              <CareerCard
                key={career.id}
                title={career.title}
                description={career.description}
                matchPercentage={career.matchPercentage}
                salary={career.salary}
                experience={career.experience}
                skills={career.skills}
                onViewDetails={() => setSelectedCareer(career)}
              />
            ))}

          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-700">
              No careers found.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your filters.
            </p>
          </div>
        )}

      </section>

      {/* Selected Career Details */}
      {selectedCareer && (
        <section className="space-y-4">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800">
              Career Details
            </h2>

            <button
              onClick={() => setSelectedCareer(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Close Details
            </button>
          </div>

          <CareerDetails career={selectedCareer} />

        </section>
      )}

      {/* Career Comparison */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Compare Careers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Compare different career paths to make a better decision.
          </p>
        </div>

        <CareerComparison />
      </section>

      {/* Skill Gap Analysis */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Skill Gap Analysis
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Understand which skills you need to develop for your target career.
          </p>
        </div>

        <SkillGapAnalysis />
      </section>

    </div>
  );
}

export default CareerMatches;