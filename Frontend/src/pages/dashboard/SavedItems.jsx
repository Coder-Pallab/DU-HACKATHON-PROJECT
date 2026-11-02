import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../Components/layout/PageHeader";
import {
  Bookmark,
  BriefcaseBusiness,
  BookOpen,
  Code,
  Database,
  Palette,
  MapPin,
  Clock,
  IndianRupee,
  Trash2,
  ExternalLink,
} from "lucide-react";

const initialSavedItems = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Careers",
    description:
      "Build responsive websites and interactive web applications using modern frontend technologies.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    icon: Code,
    location: "India",
  },
  {
    id: 2,
    title: "Data Analyst",
    category: "Careers",
    description:
      "Analyse datasets and generate meaningful insights to support business decisions.",
    skills: ["Python", "SQL", "Excel", "Power BI"],
    icon: Database,
    location: "India",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    category: "Careers",
    description:
      "Create user-friendly interfaces and improve digital product experiences.",
    skills: ["Figma", "Wireframing", "Prototyping"],
    icon: Palette,
    location: "India",
  },
  {
    id: 4,
    title: "Frontend Developer Intern",
    category: "Jobs",
    company: "Tech Solutions",
    description:
      "Work with a development team to build and maintain modern web applications.",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    location: "Remote",
    salary: "₹8,000/month",
    type: "Internship",
  },
  {
    id: 5,
    title: "MERN Stack Development",
    category: "Courses",
    company: "Learning Platform",
    description:
      "Learn full-stack development using MongoDB, Express, React and Node.js.",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    duration: "12 Weeks",
    type: "Online Course",
  },
];

const categories = ["All", "Careers", "Jobs", "Courses"];

function SavedItems() {
  const { t } = useLanguage();
  const [savedItems, setSavedItems] = useState(initialSavedItems);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? savedItems
      : savedItems.filter(
          (item) => item.category === activeCategory
        );

  const handleRemove = (id) => {
    setSavedItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const getCategoryIcon = (category) => {
    if (category === "Careers") return BriefcaseBusiness;
    if (category === "Jobs") return BriefcaseBusiness;
    return BookOpen;
  };

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Page Header */}
      <PageHeader
        title="Saved Items"
        description="Access your saved careers, job opportunities and learning resources."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {categories.slice(1).map((category) => {
          const Icon = getCategoryIcon(category);

          const count = savedItems.filter(
            (item) => item.category === category
          ).length;

          return (
            <div
              key={category}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    {t("Saved")} {t(category, category)}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    {count}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon size={23} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Saved Items Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

        {/* Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("Your Bookmarks")}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {savedItems.length} {t("items saved in total")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-teal-700">
            <Bookmark size={18} />
            {t("Saved Collection")}
          </div>

        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              {t(category, category)}
            </button>
          ))}

        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

            {filteredItems.map((item) => {
              const Icon = item.icon || BookOpen;

              return (
                <div
                  key={item.id}
                  className="min-w-0 rounded-xl border border-gray-200 p-5 transition hover:border-teal-300 hover:shadow-sm"
                >

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-medium text-teal-700">
                          {t(item.category, item.category)}
                        </span>

                        <h3 className="mt-1 break-words font-semibold text-gray-900">
                          {t(item.title, item.title)}
                        </h3>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`${t("Remove")} ${t(item.title, item.title)}`}
                      title={t("Remove saved item")}
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    {t(item.description, item.description)}
                  </p>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-2">

                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                  {/* Additional Details */}
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">

                    {item.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {t(item.location, item.location)}
                      </span>
                    )}

                    {item.salary && (
                      <span className="flex items-center gap-1.5">
                        <IndianRupee size={14} />
                        {item.salary}
                      </span>
                    )}

                    {item.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {t(item.duration, item.duration)}
                      </span>
                    )}

                    {item.type && (
                      <span>{t(item.type, item.type)}</span>
                    )}

                    {item.company && (
                      <span>{item.company}</span>
                    )}

                  </div>

                  {/* Action */}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() =>
                        console.log("Selected saved item:", item)
                      }
                      className="flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                    >
                      {t("View Details")}
                      <ExternalLink size={15} />
                    </button>
                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Bookmark size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-800">
              {t("No saved items found")}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {t("You haven't saved anything in this category yet. Explore careers, jobs and courses to build your collection.")}
            </p>

            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              {t("View All Items")}
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default SavedItems;
