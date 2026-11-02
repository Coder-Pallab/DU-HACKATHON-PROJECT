import {
  BriefcaseBusiness,
  CalendarDays,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700",
  "Under Review": "bg-amber-50 text-amber-700",
  Shortlisted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

function ApplicationTracker({ applications = [], onView }) {
  const { t } = useLanguage();

  return (
    <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Application Tracker")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("Keep track of your job applications.")}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <BriefcaseBusiness size={20} />
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <BriefcaseBusiness size={22} />
          </div>

          <h3 className="font-medium text-gray-800">
            {t("No applications yet")}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            {t("Your applied jobs will appear here so you can track their progress.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-teal-200 sm:p-5"
            >
              {/* Job Information */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-gray-900">
                    {application.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={15} />
                      {application.company}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      {application.appliedDate}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                    statusStyles[application.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t(application.status, application.status)}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">
                  {t("Application #")}{application.id}
                </span>

                <button
                  type="button"
                  onClick={() => onView?.(application)}
                  className="flex items-center gap-1.5 text-sm font-medium text-teal-700 transition hover:text-teal-900"
                >
                  {t("View Details")}
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicationTracker;
