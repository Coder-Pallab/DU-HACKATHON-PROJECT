import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "../common/Badges";
import { useLanguage } from "../../hooks/useLanguage";
import { careers } from "../../data/careers";

function CareerOverview() {
  const { t } = useLanguage();

  return (
    <section>

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {t("Recommended Careers")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("Explore career paths that match your interests.")}
          </p>
        </div>

        <Link
          to="/dashboard/careers"
          className="flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          {t("View All")}
          <ArrowUpRight size={17} />
        </Link>

      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

        {careers.map((career) => (

          <div
            key={career.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <BriefcaseBusiness size={22} />
              </div>

              <Badge variant="success">
                {career.match}% {t("Match")}
              </Badge>

            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {t(career.title, career.title)}
            </h3>

            <p className="mt-1 text-xs font-medium text-teal-700">
              {t(career.category, career.category)}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {t(career.description, career.description)}
            </p>

            <div className="mt-4">

              <p className="text-xs font-semibold text-slate-500">
                {t("REQUIRED SKILLS")}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">

                {career.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">

              <p className="text-xs text-slate-500">
                {t("Estimated Salary")}
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {career.salary}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default CareerOverview;
