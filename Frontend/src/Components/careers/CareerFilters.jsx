import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function CareerFilters({ onFilterChange }) {
  const { t } = useLanguage();

  const initialFilters = {
    category: "All Categories",
    salary: "Any Salary",
    experience: "Any Experience",
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange?.(initialFilters);
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <SlidersHorizontal size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              {t("Filter Careers")}
            </h2>

            <p className="text-sm text-slate-500">
              {t("Find careers that match your preferences.")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          <RotateCcw size={15} />
          {t("Reset Filters")}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("Career Category")}
          </label>

          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="All Categories">{t("All Categories")}</option>
            <option value="Technology">{t("Technology")}</option>
            <option value="Design">{t("Design")}</option>
            <option value="Data Science">{t("Data Science")}</option>
            <option value="Business">{t("Business")}</option>
            <option value="Marketing">{t("Marketing")}</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label
            htmlFor="salary"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("Expected Salary")}
          </label>

          <select
            id="salary"
            name="salary"
            value={filters.salary}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="Any Salary">{t("Any Salary")}</option>
            <option value="Below ₹3 LPA">{t("Below ₹3 LPA")}</option>
            <option value="₹3–5 LPA">{t("₹3–5 LPA")}</option>
            <option value="₹5–10 LPA">{t("₹5–10 LPA")}</option>
            <option value="Above ₹10 LPA">{t("Above ₹10 LPA")}</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("Experience Level")}
          </label>

          <select
            id="experience"
            name="experience"
            value={filters.experience}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="Any Experience">{t("Any Experience")}</option>
            <option value="Fresher">{t("Fresher")}</option>
            <option value="0–2 Years">{t("0–2 Years")}</option>
            <option value="2–5 Years">{t("2–5 Years")}</option>
            <option value="5+ Years">{t("5+ Years")}</option>
          </select>
        </div>

      </div>
    </section>
  );
}

export default CareerFilters;
