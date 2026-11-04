import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  ChevronDown,
  Globe,
  Check,
  UserRound,
  Settings as SettingsIcon,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Dropdown visibility states
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState("");
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
  // Refs for click-outside detection
  const languageRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
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

  const handleLanguageChange = async (code) => {
    setIsSavingLanguage(true);
    setLanguageError("");
    try {
      await studentService.updatePreferences({
        preferredLanguage: code === "as" ? "Assamese" : "English",
      });
      setLanguage(code);
      setIsLanguageOpen(false);
    } catch (error) {
      setLanguageError(getApiErrorMessage(error));
    } finally {
      setIsSavingLanguage(false);
    }
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    try {
      await logout();
    } catch (error) {
      window.alert(`Signed out locally, but the server logout failed: ${error.message}`);
    }
    navigate("/login", { replace: true });
  };

  const displayName = user?.name || "Student";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

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
                    disabled={isSavingLanguage}
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
          {languageError && (
            <p role="alert" className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-red-50 p-3 text-xs text-red-700 shadow-lg">
              {languageError}
            </p>
          )}
        </div>

        {/* Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsLanguageOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
            aria-label={t("User profile menu")}
            aria-expanded={isProfileOpen}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800">
              {initials}
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
                <p className="font-semibold text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
                <span className="mt-1.5 inline-block rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                  Student
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
