import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Globe,
  Check,
  UserRound,
  Settings as SettingsIcon,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const initialNotifications = [
  {
    id: 1,
    title: "New Internship Opportunity",
    message: "A new Frontend Developer internship has been added to your recommendations.",
    time: "10m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Learning Roadmap Updated",
    message: "Your Frontend Development roadmap has new learning milestones.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Profile Completion Reminder",
    message: "Complete your career interests to improve recommendations.",
    time: "1d ago",
    unread: true,
  },
];

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  // Dropdown visibility states
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Global Language context
  const {
    language: selectedLanguage,
    setLanguage,
    currentLanguage: currentLangObj,
    languages,
    t,
  } = useLanguage();

  // Notifications state
  const [notifications, setNotifications] = useState(initialNotifications);

  // Refs for click-outside detection
  const languageRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsLanguageOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false }))
    );
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
    setIsNotificationsOpen(false);
    navigate("/dashboard/notifications");
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    navigate("/onboarding/profile");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-[72px] min-w-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:px-4 md:px-6">
      {/* Left Section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label={t("Open menu")}
        >
          <Menu size={22} />
        </button>

        <Link to="/dashboard" className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-xl font-bold text-white">
            দ
          </div>

          <div>
            <h1 className="text-lg font-bold text-teal-800 sm:text-xl">
              {t("nav.appName", "Disha")}
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              {t("nav.appTagline", "Your Career Companion")}
            </p>
          </div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mx-3 hidden min-w-0 max-w-md flex-1 md:flex lg:mx-6">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder={t("nav.searchPlaceholder", "Search careers, skills, courses...")}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Language Selector */}
        <div ref={languageRef} className="relative">
          <button
            onClick={() => {
              setIsLanguageOpen((prev) => !prev);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-100 sm:px-3"
            aria-expanded={isLanguageOpen}
            aria-label={t("Change language")}
          >
            <Globe size={18} />
            <span className="hidden sm:inline">{currentLangObj.nativeName || currentLangObj.name}</span>
            <ChevronDown
              size={15}
              className={`text-slate-500 transition-transform duration-200 ${
                isLanguageOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {t("nav.language", "Language")}
              </div>
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "bg-teal-50 font-medium text-teal-800"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{lang.name}</p>
                      <p className="text-xs text-slate-500">{lang.nativeName}</p>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-teal-700" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsLanguageOpen(false);
              setIsProfileOpen(false);
            }}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label={t("Notifications")}
            aria-expanded={isNotificationsOpen}
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">
                    {t("nav.notifications", "Notifications")}
                  </h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                      {unreadCount} {t("new")}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-medium text-teal-700 hover:underline"
                  >
                    {t("nav.markAllRead", "Mark all read")}
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    {t("nav.noNotifications", "No notifications")}
                  </div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item.id)}
                      className={`flex w-full items-start gap-3 p-3.5 text-left transition hover:bg-slate-50 ${
                        item.unread ? "bg-teal-50/40" : ""
                      }`}
                    >
                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          item.unread ? "bg-teal-600" : "bg-transparent"
                        }`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p
                            className={`truncate text-sm ${
                              item.unread
                                ? "font-semibold text-slate-900"
                                : "font-medium text-slate-700"
                            }`}
                          >
                            {t(item.title, item.title)}
                          </p>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {t(item.time, item.time)}
                          </span>
                        </div>

                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {t(item.message, item.message)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 bg-slate-50/60 p-2.5 text-center">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  {t("nav.viewAllNotifications", "View all notifications →")}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsLanguageOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
            aria-label={t("User profile menu")}
            aria-expanded={isProfileOpen}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800">
              U
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-slate-500 transition-transform duration-200 sm:block ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
              {/* User summary */}
              <div className="border-b border-slate-100 px-3.5 py-2.5">
                <p className="font-semibold text-slate-900">{t("Aditya Sharma", "Aditya Sharma")}</p>
                <p className="truncate text-xs text-slate-500">
                  student@example.com
                </p>
                <span className="mt-1.5 inline-block rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                  {t("Student • BCA")}
                </span>
              </div>

              {/* Navigation links */}
              <div className="py-1">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
                >
                  <UserRound size={17} className="text-slate-400" />
                  {t("nav.myProfile", "My Profile")}
                </Link>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
                >
                  <SettingsIcon size={17} className="text-slate-400" />
                  {t("nav.settings", "Settings")}
                </Link>

                <Link
                  to="/dashboard/help"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
                >
                  <CircleHelp size={17} className="text-slate-400" />
                  {t("nav.helpSupport", "Help & Support")}
                </Link>
              </div>

              {/* Sign out */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} className="text-red-500" />
                  {t("nav.signOut", "Sign Out")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
