import { useState } from "react";
import PageHeader from "../../Components/layout/PageHeader";
import { useLanguage } from "../../hooks/useLanguage";

import AccountSettings from "../../Components/settings/AccountSettings";
import LanguageSettings from "../../Components/settings/LanguageSettings";
import AccessibilitySettings from "../../Components/settings/AccessibilitySettings";

function Settings() {
  const [accountData, setAccountData] = useState({
    fullName: "Aditya Sharma",
    email: "student@example.com",
    phone: "",
    college: "",
    course: "BCA",
  });

  const { language, setLanguage } = useLanguage();

  const [accessibility, setAccessibility] = useState({
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Manage your account, language and accessibility preferences."
      />

      {/* Account Settings */}
      <AccountSettings
        initialValues={accountData}
        onSave={setAccountData}
      />

      {/* Language Settings */}
      <LanguageSettings
        initialLanguage={language}
        onSave={setLanguage}
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