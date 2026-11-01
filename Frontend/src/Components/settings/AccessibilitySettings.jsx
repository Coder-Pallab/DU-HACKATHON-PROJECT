import { useState } from "react";
import {
  Accessibility,
  Type,
  Eye,
  Zap,
  Save,
} from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-teal-700" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function AccessibilitySettings({ initialSettings, onSave }) {
  const [settings, setSettings] = useState({
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
    ...initialSettings,
  });

  const [message, setMessage] = useState("");

  const updateSetting = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSave = () => {
    onSave?.(settings);
    setMessage("Accessibility preferences saved successfully!");
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Accessibility size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Accessibility Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Customize Disha to make your experience more comfortable.
          </p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Font Size */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Type size={19} className="text-teal-700" />
            <h3 className="font-semibold text-gray-800">
              Font Size
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["small", "medium", "large"].map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={settings.fontSize === size}
                onClick={() => updateSetting("fontSize", size)}
                className={`rounded-lg border px-3 py-3 text-sm font-medium capitalize transition ${
                  settings.fontSize === size
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <div className="flex min-w-0 items-start gap-3">
            <Zap size={20} className="mt-1 shrink-0 text-teal-700" />

            <div>
              <h3 className="font-semibold text-gray-800">
                Reduced Motion
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Minimize animations and visual transitions.
              </p>
            </div>
          </div>

          <Toggle
            checked={settings.reducedMotion}
            onChange={(value) =>
              updateSetting("reducedMotion", value)
            }
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <div className="flex min-w-0 items-start gap-3">
            <Eye size={20} className="mt-1 shrink-0 text-teal-700" />

            <div>
              <h3 className="font-semibold text-gray-800">
                High Contrast
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Improve visual contrast between text and backgrounds.
              </p>
            </div>
          </div>

          <Toggle
            checked={settings.highContrast}
            onChange={(value) =>
              updateSetting("highContrast", value)
            }
          />
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
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
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default AccessibilitySettings;
