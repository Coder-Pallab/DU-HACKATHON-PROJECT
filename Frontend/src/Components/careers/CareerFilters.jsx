import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

function CareerFilters({ onFilterChange }) {
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

    // Send selected filters to the parent component.
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
              Filter Careers
            </h2>

            <p className="text-sm text-slate-500">
              Find careers that match your preferences.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          <RotateCcw size={15} />
          Reset Filters
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
            Career Category
          </label>

          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option>All Categories</option>
            <option>Technology</option>
            <option>Design</option>
            <option>Data Science</option>
            <option>Business</option>
            <option>Marketing</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label
            htmlFor="salary"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Expected Salary
          </label>

          <select
            id="salary"
            name="salary"
            value={filters.salary}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option>Any Salary</option>
            <option>Below ₹3 LPA</option>
            <option>₹3–5 LPA</option>
            <option>₹5–10 LPA</option>
            <option>Above ₹10 LPA</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Experience Level
          </label>

          <select
            id="experience"
            name="experience"
            value={filters.experience}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option>Any Experience</option>
            <option>Fresher</option>
            <option>0–2 Years</option>
            <option>2–5 Years</option>
            <option>5+ Years</option>
          </select>
        </div>

      </div>
    </section>
  );
}

export default CareerFilters;