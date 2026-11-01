import { useState } from "react";
import { Languages, Check } from "lucide-react";
import Button from "../common/Button";

function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      description: "Continue using Disha in English.",
    },
    {
      code: "as",
      name: "Assamese",
      nativeName: "অসমীয়া",
      description: "Disha ব্যৱহাৰ কৰক অসমীয়া ভাষাত।",
    },
  ];

  const handleSubmit = () => {
    console.log("Selected Language:", selectedLanguage);
    alert("Language preference saved successfully!");
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
            Language Preference
          </h2>

          <p className="text-sm text-slate-500">
            Choose your preferred language.
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
              {language.description}
            </p>
          </button>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <Button type="button" onClick={handleSubmit}>
          Save Language
        </Button>
      </div>
    </div>
  );
}

export default LanguageSelector;