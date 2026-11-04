import { useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function JobSearch({ onSearch }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100"
    >
      <Search size={20} className="shrink-0 text-gray-400" />

      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={t("Search jobs, companies or skills...")}
        className="w-full min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t("Clear search")}
          className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      )}

      <button
        type="submit"
        className="shrink-0 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
      >
        {t("Search")}
      </button>
    </form>
  );
}

export default JobSearch;
