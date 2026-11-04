import { useState } from "react";
import { Languages, Check } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";

function LanguageSelector({ profile, onSaved }) {
  const { language: currentGlobalLang, setLanguage, languages, t } = useLanguage();
  const savedLanguage = profile.preferredLanguage === "Assamese" ? "as" : "en";
  const [selectedLanguage, setSelectedLanguage] = useState(profile.preferredLanguage ? savedLanguage : currentGlobalLang);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const descriptions = {
    en: "Continue using Disha in English.",
    as: "Disha ব্যৱহাৰ কৰক অসমীয়া ভাষাত।",
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError("");
    setSaved(false);
    const preferredLanguage = selectedLanguage === "as" ? "Assamese" : "English";
    try {
      const updated = await studentService.updatePreferences({ preferredLanguage });
      onSaved(updated);
      setLanguage(selectedLanguage);
      setSaved(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Languages size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Language Preference")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Choose your preferred language.")}
          </p>
        </div>
      </div>

      {/* Language Options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {languages.map((language) => (
          <button
            key={language.code}
            type="button"
            onClick={() => setSelectedLanguage(language.code)}
            aria-pressed={selectedLanguage === language.code}
            className={`relative rounded-xl border p-5 text-left transition ${
              selectedLanguage === language.code
                ? "border-teal-600 bg-teal-50"
                : "border-slate-200 hover:border-teal-300"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {language.nativeName}
              </h3>

              {selectedLanguage === language.code && (
                <span className="rounded-full bg-teal-600 p-1 text-white">
                  <Check size={14} />
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500">
              {language.name}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {descriptions[language.code] || ""}
            </p>
          </button>
        ))}
      </div>

      {/* Save Button */}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="mt-4 text-sm text-green-700">{t("Language preference saved successfully!")}</p>}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <Button type="button" onClick={handleSubmit} loading={isSaving}>
          {t("Save Language")}
        </Button>
      </div>
    </div>
  );
}

export default LanguageSelector;
