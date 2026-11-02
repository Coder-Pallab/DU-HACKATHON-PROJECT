import { useState } from "react";
import {
  Code2,
  BrainCircuit,
  Palette,
  ShieldCheck,
  Database,
  Cloud,
  BriefcaseBusiness,
  Check,
} from "lucide-react";

import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";

function CareerInterests() {
  const { t } = useLanguage();
  const [selectedInterests, setSelectedInterests] = useState([]);

  const careerOptions = [
    {
      id: "web-development",
      name: "Web Development",
      description: "Build websites and web applications.",
      icon: Code2,
    },
    {
      id: "artificial-intelligence",
      name: "Artificial Intelligence",
      description: "Explore AI and intelligent systems.",
      icon: BrainCircuit,
    },
    {
      id: "ui-ux-design",
      name: "UI/UX Design",
      description: "Design beautiful user experiences.",
      icon: Palette,
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      description: "Protect systems and digital information.",
      icon: ShieldCheck,
    },
    {
      id: "data-science",
      name: "Data Science",
      description: "Analyze data and discover insights.",
      icon: Database,
    },
    {
      id: "cloud-computing",
      name: "Cloud Computing",
      description: "Work with cloud platforms and services.",
      icon: Cloud,
    },
    {
      id: "business-management",
      name: "Business Management",
      description: "Explore business and management careers.",
      icon: BriefcaseBusiness,
    },
  ];

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = () => {
    console.log("Selected Career Interests:", selectedInterests);
    alert(t("Career interests saved successfully!"));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          {t("Career Interests")}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {t("Select the career fields that interest you. You can choose multiple options.")}
        </p>
      </div>

      {/* Selected Count */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {t("Available Career Fields")}
        </span>

        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          {selectedInterests.length} {t("Selected")}
        </span>
      </div>

      {/* Career Options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {careerOptions.map((career) => {
          const Icon = career.icon;
          const isSelected = selectedInterests.includes(career.id);

          return (
            <button
              key={career.id}
              type="button"
              onClick={() => toggleInterest(career.id)}
              aria-pressed={isSelected}
              className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-teal-600 bg-teal-50"
                  : "border-slate-200 hover:border-teal-300"
              }`}
            >
              {/* Icon */}
              <div className="rounded-lg bg-white p-3 text-teal-700 shadow-sm">
                <Icon size={22} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  {t(career.name, career.name)}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t(career.description, career.description)}
                </p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <span className="rounded-full bg-teal-600 p-1 text-white">
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}

      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={selectedInterests.length === 0}
        >
          {t("Save Interests")}
        </Button>
      </div>

    </div>
  );
}

export default CareerInterests;
