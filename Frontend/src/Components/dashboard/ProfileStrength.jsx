import { UserRound, ArrowRight } from "lucide-react";

import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";
import { useNavigate } from "react-router-dom";

function ProfileStrength({ profile }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const missingItems = [];
  if (!profile?.phoneNumber) missingItems.push("Add your phone number");
  if (!profile?.college || !profile?.degree || !profile?.department || !profile?.graduationYear) {
    missingItems.push("Complete your academic details");
  }
  if (!(profile?.technicalSkills?.length || profile?.softSkills?.length)) {
    missingItems.push("Add your skills");
  }
  if (!profile?.careerInterests?.length) missingItems.push("Select your career interests");
  const percentage = profile
    ? Math.round(((4 - missingItems.length) / 4) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t("Profile Strength")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("Complete your profile for better recommendations.")}
          </p>
        </div>

        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <UserRound size={23} />
        </div>

      </div>

      <div className="my-6">
        <div className="mb-2 flex justify-between">

          <span className="text-sm font-medium text-slate-600">
            {t("Profile Completion")}
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
        {t("Recommended Actions")}
      </h3>

      <div className="space-y-3">

        {(missingItems.length ? missingItems : ["Your profile has the required details."]).map((suggestion) => (
        <div key={suggestion} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            {t(suggestion, suggestion)}
          </div>
        ))}

      </div>

      <Button variant="outline" className="mt-6 w-full" onClick={() => navigate("/dashboard/profile")}>
        {t("Complete Profile")}
        <ArrowRight size={16} className="ml-2 inline" />
      </Button>

    </div>
  );
}

export default ProfileStrength;
