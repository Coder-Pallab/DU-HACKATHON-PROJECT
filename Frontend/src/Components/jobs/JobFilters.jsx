import { Filter, RotateCcw } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function JobFilters({ filters, onFilterChange, onReset }) {
  const { t } = useLanguage();

  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const selectClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={19} className="text-teal-700" />

          <h3 className="text-base font-semibold text-gray-900">
            {t("Filters")}
          </h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-medium text-teal-700 transition hover:text-teal-900"
        >
          <RotateCcw size={15} />
          {t("Reset")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Job Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("Job Type")}
          </label>

          <select
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className={selectClass}
          >
            <option value="All">{t("All Types")}</option>
            <option value="Internship">{t("Internship")}</option>
            <option value="Full-time">{t("Full-time")}</option>
            <option value="Part-time">{t("Part-time")}</option>
          </select>
        </div>

        {/* Work Mode */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("Work Mode")}
          </label>

          <select
            value={filters.mode}
            onChange={(e) => handleChange("mode", e.target.value)}
            className={selectClass}
          >
            <option value="All">{t("All Modes")}</option>
            <option value="Remote">{t("Remote")}</option>
            <option value="On-site">{t("On-site")}</option>
            <option value="Hybrid">{t("Hybrid")}</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("Location")}
          </label>

          <select
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={selectClass}
          >
            <option value="All">{t("All Locations")}</option>
            <option value="Guwahati">{t("Guwahati")}</option>
            <option value="Assam">{t("Assam")}</option>
            <option value="India">{t("India")}</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("Experience")}
          </label>

          <select
            value={filters.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            className={selectClass}
          >
            <option value="All">{t("All Experience")}</option>
            <option value="Fresher">{t("Fresher")}</option>
            <option value="Entry-level">{t("Entry-level")}</option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default JobFilters;
