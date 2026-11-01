import { useState } from "react";
import { ArrowLeftRight, Trophy, CheckCircle2 } from "lucide-react";

function CareerComparison() {
  const careers = [
    {
      id: 1,
      title: "Frontend Developer",
      category: "Technology",
      salary: "₹3–8 LPA",
      experience: "0–2 Years",
      growth: "High",
      match: 92,
      skills: ["HTML", "CSS", "JavaScript", "React"],
    },
    {
      id: 2,
      title: "UI/UX Designer",
      category: "Design",
      salary: "₹3–7 LPA",
      experience: "0–2 Years",
      growth: "High",
      match: 85,
      skills: ["Figma", "Wireframing", "Prototyping", "Design"],
    },
    {
      id: 3,
      title: "Data Analyst",
      category: "Data Science",
      salary: "₹4–9 LPA",
      experience: "0–2 Years",
      growth: "High",
      match: 78,
      skills: ["Python", "SQL", "Excel", "Power BI"],
    },
  ];

  const [firstCareer, setFirstCareer] = useState("1");
  const [secondCareer, setSecondCareer] = useState("2");

  const careerA = careers.find(
    (career) => career.id === Number(firstCareer)
  );

  const careerB = careers.find(
    (career) => career.id === Number(secondCareer)
  );

  const comparisonRows = [
    {
      label: "Category",
      key: "category",
    },
    {
      label: "Expected Salary",
      key: "salary",
    },
    {
      label: "Experience",
      key: "experience",
    },
    {
      label: "Growth Potential",
      key: "growth",
    },
    {
      label: "Your Match",
      key: "match",
      suffix: "%",
    },
  ];

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <ArrowLeftRight size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Career Comparison
          </h2>

          <p className="text-sm text-slate-500">
            Compare career opportunities before making a decision.
          </p>
        </div>
      </div>

      {/* Career Selection */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

        <div>
          <label
            htmlFor="careerA"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            First Career
          </label>

          <select
            id="careerA"
            value={firstCareer}
            onChange={(event) => setFirstCareer(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            {careers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="careerB"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Second Career
          </label>

          <select
            id="careerB"
            value={secondCareer}
            onChange={(event) => setSecondCareer(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            {careers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.title}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Prevent comparing the same career */}
      {firstCareer === secondCareer ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Please select two different careers to compare.
        </div>
      ) : (
        <>
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {[careerA, careerB].map((career) => (
              <div
                key={career.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-800">
                    {career.title}
                  </h3>

                  {career.match >= 90 && (
                    <Trophy size={19} className="shrink-0 text-amber-500" />
                  )}
                </div>

                <p className="mb-2 text-sm text-slate-500">
                  Career Match
                </p>

                <p className="mb-4 text-3xl font-bold text-teal-700">
                  {career.match}%
                </p>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${career.match}%` }}
                  />
                </div>

                <div className="mt-5">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">
                    Required Skills
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {career.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Comparison Table */}
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-teal-50">
                <tr>
                  <th className="p-4 font-semibold text-slate-700">
                    Comparison
                  </th>

                  <th className="p-4 font-semibold text-teal-800">
                    {careerA.title}
                  </th>

                  <th className="p-4 font-semibold text-teal-800">
                    {careerB.title}
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.key}
                    className="border-t border-slate-100"
                  >
                    <td className="p-4 font-medium text-slate-600">
                      {row.label}
                    </td>

                    <td className="p-4 text-slate-700">
                      {careerA[row.key]}{row.suffix || ""}
                    </td>

                    <td className="p-4 text-slate-700">
                      {careerB[row.key]}{row.suffix || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommendation */}
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-teal-50 p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-teal-700"
            />

            <div>
              <h4 className="font-semibold text-teal-800">
                Higher Profile Match
              </h4>

              <p className="mt-1 text-sm text-teal-700">
                {careerA.match > careerB.match
                  ? careerA.title
                  : careerB.title}{" "}
                has a higher sample match percentage based on the displayed
                data.
              </p>
            </div>
          </div>
        </>
      )}

    </section>
  );
}

export default CareerComparison;