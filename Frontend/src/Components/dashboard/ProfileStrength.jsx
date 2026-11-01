import { UserRound, ArrowRight } from "lucide-react";

import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";

function ProfileStrength({ percentage = 70 }) {
  const suggestions = [
    "Add your educational details",
    "Update your skills",
    "Select your career interests",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Profile Strength
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete your profile for better recommendations.
          </p>
        </div>

        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <UserRound size={23} />
        </div>

      </div>

      <div className="my-6">
        <div className="mb-2 flex justify-between">

          <span className="text-sm font-medium text-slate-600">
            Profile Completion
          </span>

          <span className="text-sm font-bold text-teal-700">
            {percentage}%
          </span>

        </div>

        <ProgressBar
          value={percentage}
          color="bg-teal-600"
          showLabel={false}
        />
      </div>

      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        Recommended Actions
      </h3>

      <div className="space-y-3">

        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            {suggestion}
          </div>
        ))}

      </div>

      <Button variant="outline" className="mt-6 w-full">
        Complete Profile
        <ArrowRight size={16} className="ml-2 inline" />
      </Button>

    </div>
  );
}

export default ProfileStrength;