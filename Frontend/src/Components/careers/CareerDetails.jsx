import {
  BriefcaseBusiness,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Target,
} from "lucide-react";

function CareerDetails({
  career = {
    title: "Frontend Developer",
    category: "Technology",
    description:
      "Frontend developers build the visual and interactive parts of websites and web applications. They work with designers and backend developers to create user-friendly digital experiences.",
    salary: "₹3–8 LPA",
    experience: "0–2 Years",
    growth: "High",
    qualification: "BCA, B.Tech, MCA or equivalent skills",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    responsibilities: [
      "Develop responsive websites and web applications.",
      "Convert UI designs into functional interfaces.",
      "Write clean and maintainable code.",
      "Fix bugs and improve website performance.",
      "Collaborate with designers and backend developers.",
    ],
    learningPath: [
      "Learn HTML, CSS and JavaScript.",
      "Understand React.js and component development.",
      "Learn Git and GitHub.",
      "Build practical frontend projects.",
      "Prepare for technical interviews.",
    ],
  },
}) {
  return (
    <section className="w-full min-w-0 space-y-6">

      {/* Career Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <BriefcaseBusiness size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {career.title}
            </h2>

            <p className="text-sm text-slate-500">
              {career.category}
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          {career.description}
        </p>

        {/* Career Statistics */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl bg-teal-50 p-4">
            <IndianRupee size={20} className="mb-2 text-teal-700" />
            <p className="text-xs text-slate-500">Expected Salary</p>
            <h3 className="mt-1 font-semibold text-slate-800">
              {career.salary}
            </h3>
          </div>

          <div className="rounded-xl bg-teal-50 p-4">
            <BriefcaseBusiness size={20} className="mb-2 text-teal-700" />
            <p className="text-xs text-slate-500">Experience</p>
            <h3 className="mt-1 font-semibold text-slate-800">
              {career.experience}
            </h3>
          </div>

          <div className="rounded-xl bg-teal-50 p-4">
            <TrendingUp size={20} className="mb-2 text-teal-700" />
            <p className="text-xs text-slate-500">Growth Potential</p>
            <h3 className="mt-1 font-semibold text-slate-800">
              {career.growth}
            </h3>
          </div>

          <div className="rounded-xl bg-teal-50 p-4">
            <GraduationCap size={20} className="mb-2 text-teal-700" />
            <p className="text-xs text-slate-500">Qualification</p>
            <h3 className="mt-1 text-sm font-semibold text-slate-800">
              {career.qualification}
            </h3>
          </div>

        </div>
      </div>

      {/* Required Skills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">
          <Target size={22} className="text-teal-700" />

          <h3 className="text-lg font-semibold text-slate-800">
            Required Skills
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {career.skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700"
            >
              <CheckCircle2 size={15} />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">
          <BriefcaseBusiness size={22} className="text-teal-700" />

          <h3 className="text-lg font-semibold text-slate-800">
            Key Responsibilities
          </h3>
        </div>

        <div className="space-y-4">
          {career.responsibilities.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-teal-600"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Roadmap */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">
          <BookOpen size={22} className="text-teal-700" />

          <h3 className="text-lg font-semibold text-slate-800">
            Suggested Learning Path
          </h3>
        </div>

        <div className="space-y-5">
          {career.learningPath.map((step, index) => (
            <div key={index} className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                {index + 1}
              </div>

              <p className="pt-1 text-sm leading-relaxed text-slate-600">
                {step}
              </p>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default CareerDetails;