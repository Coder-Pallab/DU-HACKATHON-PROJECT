import { useEffect, useState } from "react";
import PageHeader from "../../Components/layout/PageHeader";
import { useLanguage } from "../../hooks/useLanguage";

import AccountSettings from "../../Components/settings/AccountSettings";
import LanguageSettings from "../../Components/settings/LanguageSettings";
import AccessibilitySettings from "../../Components/settings/AccessibilitySettings";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";

function Settings() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { language, setLanguage } = useLanguage();

  const [accessibility, setAccessibility] = useState({
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
  });

  useEffect(() => {
    let active = true;
    studentService.getProfile()
      .then((result) => {
        if (!active) return;
        setProfile(result);
        if (result.preferredLanguage) {
          setLanguage(result.preferredLanguage === "Assamese" ? "as" : "en");
        }
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setLanguage]);

  const saveLanguage = async (code) => {
    const updated = await studentService.updatePreferences({
      preferredLanguage: code === "as" ? "Assamese" : "English",
    });
    setProfile(updated);
  };

  if (isLoading) return <p className="rounded-xl bg-white p-6 text-sm text-slate-600">Loading settings...</p>;
  if (error || !profile) return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error || "Settings could not be loaded."}</p>;

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Manage your account, language and accessibility preferences."
      />

      {/* Account Settings */}
      <AccountSettings profile={profile} />

      {/* Language Settings */}
      <LanguageSettings
        initialLanguage={profile.preferredLanguage === "Assamese" ? "as" : profile.preferredLanguage === "English" ? "en" : language}
        onSave={saveLanguage}
      />

      {/* Accessibility Settings */}
      <AccessibilitySettings
        initialSettings={accessibility}
        onSave={setAccessibility}
      />
    </div>
  );
}

export default Settings;