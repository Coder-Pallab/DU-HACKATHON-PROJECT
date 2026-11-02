import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../Components/layout/PageHeader";
import {
  Bell,
  BriefcaseBusiness,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Trash2,
  Check,
  Clock,
  FileText,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Internship Opportunity",
    message:
      "A new Frontend Developer internship opportunity has been added to your job recommendations.",
    category: "Jobs",
    time: "10 minutes ago",
    date: "Today",
    unread: true,
    icon: BriefcaseBusiness,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    title: "Learning Roadmap Updated",
    message:
      "Your Frontend Development learning roadmap has new learning milestones.",
    category: "Learning",
    time: "2 hours ago",
    date: "Today",
    unread: true,
    icon: BookOpen,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 3,
    title: "Profile Completion Reminder",
    message:
      "Complete your career interests to improve your career recommendations.",
    category: "Profile",
    time: "Yesterday",
    date: "Yesterday",
    unread: true,
    icon: GraduationCap,
    color: "bg-teal-50 text-teal-700",
  },
  {
    id: 4,
    title: "Resume Uploaded Successfully",
    message:
      "Your resume has been selected in the Disha resume upload section.",
    category: "Resume",
    time: "2 days ago",
    date: "Earlier",
    unread: false,
    icon: FileText,
    color: "bg-green-50 text-green-600",
  },
  {
    id: 5,
    title: "Placement Preparation",
    message:
      "You have new interview preparation questions available in Placement Readiness.",
    category: "Placement",
    time: "3 days ago",
    date: "Earlier",
    unread: false,
    icon: CheckCircle2,
    color: "bg-orange-50 text-orange-600",
  },
];

const filters = ["All", "Unread"];

function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications =
    activeFilter === "Unread"
      ? notifications.filter((notification) => notification.unread)
      : notifications;

  const handleMarkAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleDelete = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Page Header */}
      <PageHeader
        title="Notifications"
        description="Stay updated with your latest career activities, opportunities and learning progress."
      />

      {/* Summary Card */}
      <div className="rounded-2xl bg-teal-800 p-6 text-white shadow-sm sm:p-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700">
                <Bell size={25} />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  {t("Your Notifications")}
                </h2>

                <p className="mt-1 text-sm text-teal-100">
                  {t("Stay informed about your career journey.")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-4xl font-bold">
              {unreadCount}
            </p>

            <p className="mt-1 text-sm text-teal-100">
              {t("Unread Notifications")}
            </p>
          </div>

        </div>
      </div>

      {/* Notification Container */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("Recent Activity")}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {t("You have")} {notifications.length} {t("notifications.")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={15} />
              {t("Mark All Read")}
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} />
              {t("Clear All")}
            </button>

          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 py-5">

          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              {t(filter, filter)}

              {filter === "Unread" && (
                <span className="ml-2">
                  ({unreadCount})
                </span>
              )}
            </button>
          ))}

        </div>

        {/* Notifications List */}
        <div className="space-y-3">

          {filteredNotifications.length > 0 ? (

            filteredNotifications.map((notification) => {
              const Icon = notification.icon;

              return (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-4 transition sm:p-5 ${
                    notification.unread
                      ? "border-teal-100 bg-teal-50/40"
                      : "border-gray-100 bg-white"
                  }`}
                >

                  <div className="flex items-start gap-3 sm:gap-4">

                    {/* Icon */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${notification.color}`}>
                      <Icon size={21} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-sm font-semibold text-gray-900">
                          {t(notification.title, notification.title)}
                        </h3>

                        {notification.unread && (
                          <span className="h-2 w-2 rounded-full bg-teal-600" />
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {t(notification.message, notification.message)}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">

                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {t(notification.time, notification.time)}
                        </span>

                        <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-500">
                          {t(notification.category, notification.category)}
                        </span>

                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-4">

                        {notification.unread && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                          >
                            {t("Mark as read")}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(notification.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={13} />
                          {t("Delete")}
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })

          ) : (

            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Bell size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-800">
                {t("No notifications found")}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {activeFilter === "Unread"
                  ? t("You're all caught up! You have no unread notifications.")
                  : t("There are currently no notifications to display.")}
              </p>

              {activeFilter === "Unread" && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("All")}
                  className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  {t("View All Notifications")}
                </button>
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Notifications;
