import { useState } from "react";
import { UserRound } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useLanguage } from "../../hooks/useLanguage";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";

function PersonalDetails({ profile, onChange, onSaved }) {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await studentService.updateProfile({
        fullName: profile.fullName,
        ...(profile.phoneNumber ? { phoneNumber: profile.phoneNumber } : {}),
        bio: profile.bio,
        socialLinks: profile.socialLinks,
      });
      onSaved(updated);
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
          <UserRound size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Personal Details")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Tell us a little about yourself.")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <Input
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            value={profile.fullName || ""}
            onChange={(event) => onChange("fullName", event.target.value)}
            required
          />

          <Input
            label="Email Address"
            name="profileEmail"
            type="email"
            value={profile.user?.email || ""}
            readOnly
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            value={profile.phoneNumber || ""}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
          />

          <Input
            label="About You"
            name="bio"
            placeholder="Write a short profile summary"
            value={profile.bio || ""}
            onChange={(event) => onChange("bio", event.target.value)}
            maxLength={500}
          />

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {["github", "linkedin", "portfolio"].map((key) => (
            <Input
              key={key}
              label={key === "linkedin" ? "LinkedIn URL" : `${key[0].toUpperCase()}${key.slice(1)} URL`}
              name={`social-${key}`}
              type="url"
              value={profile.socialLinks?.[key] || ""}
              onChange={(event) => onChange("socialLinks", {
                ...profile.socialLinks,
                [key]: event.target.value,
              })}
            />
          ))}
        </div>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {saved && <p role="status" className="text-sm text-green-700">{t("Personal details saved successfully!")}</p>}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <Button type="submit" loading={isSaving}>
            {t("Save Details")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
