import {
  MapPin,
  BriefcaseBusiness,
  Clock,
  Bookmark,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function JobCard({ job, onView, onSave, isSaved = false }) {
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <BriefcaseBusiness size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-base font-semibold text-gray-900">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {job.company}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave?.(job)}
          aria-label={isSaved ? t("Remove saved job") : t("Save job")}
          className={`shrink-0 rounded-lg p-2 transition ${
            isSaved
              ? "bg-teal-50 text-teal-700"
              : "text-gray-400 hover:bg-gray-100 hover:text-teal-700"
          }`}
        >
          <Bookmark
            size={19}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Job Type */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          {t(job.type, job.type)}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {t(job.mode, job.mode)}
        </span>
      </div>

      {/* Job Information */}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{t(job.location, job.location)}</span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{job.salary}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{t(job.posted, job.posted)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-600">
        {t(job.description, job.description)}
      </p>

      {/* Skills */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t("Required Skills")}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill, index) => (
            <span
              key={index}
              className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-5 mt-6">
        <span className="text-xs text-gray-400">
          {job.deadline ? `${t("Deadline:")} ${job.deadline}` : t("Explore opportunity")}
        </span>

        <button
          type="button"
          onClick={() => onView?.(job)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          {t("View Details")}
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default JobCard;
