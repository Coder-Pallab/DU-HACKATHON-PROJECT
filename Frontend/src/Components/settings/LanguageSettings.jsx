import { useState, useEffect } from "react";
import { Languages, Check, Save } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function LanguageSettings({ initialLanguage, onSave }) {
  const { language: currentLang, setLanguage: setGlobalLanguage, languages, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(initialLanguage || currentLang);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialLanguage) {
      setSelectedLang(initialLanguage);
    } else {
      setSelectedLang(currentLang);
    }
  }, [initialLanguage, currentLang]);

  const languageDescriptions = {
    en: "Continue using Disha in English.",
    as: "অসমীয়া ভাষাত দিশা ব্যৱহাৰ কৰক।",
  };

  const handleSave = () => {
    setGlobalLanguage(selectedLang);
    onSave?.(selectedLang);
    setMessage(t("Language preference saved successfully!"));
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Languages size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Language Settings")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("Choose your preferred language for Disha.")}
          </p>
        </div>
      </div>

      {/* Language Options */}
      <div className="space-y-4">
        {languages.map((item) => {
          const isSelected = selectedLang === item.code;

          return (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setSelectedLang(item.code);
                setMessage("");
              }}
              aria-pressed={isSelected}
              className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
              }`}
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {item.nativeName}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {languageDescriptions[item.code] || ""}
                </p>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-gray-300 text-transparent"
                }`}
              >
                <Check size={15} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Success Message */}
      {message && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </p>
      )}

      {/* Save Button */}
      <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          <Save size={17} />
          {t("Save Preference")}
        </button>
      </div>
    </div>
  );
}

export default LanguageSettings;
