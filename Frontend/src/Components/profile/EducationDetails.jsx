import { useState } from "react";
import { GraduationCap } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useLanguage } from "../../hooks/useLanguage";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";

function EducationDetails({ profile, onChange, onSaved }) {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSaved(false);
    const payload = {
      ...(profile.college ? { college: profile.college } : {}),
      ...(profile.university ? { university: profile.university } : {}),
      ...(profile.degree ? { degree: profile.degree } : {}),
      ...(profile.department ? { department: profile.department } : {}),
      ...(profile.semester ? { semester: Number(profile.semester) } : {}),
      ...(profile.graduationYear ? { graduationYear: Number(profile.graduationYear) } : {}),
      ...(profile.cgpa !== "" && profile.cgpa !== null && profile.cgpa !== undefined
        ? { cgpa: Number(profile.cgpa) }
        : {}),
    };
    try {
      const updated = await studentService.updateAcademicDetails(payload);
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
          <GraduationCap size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Education Details")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Tell us about your academic background.")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <Input
          label="College / Institution"
          name="college"
          value={profile.college || ""}
          onChange={(event) => onChange("college", event.target.value)}
          />

          <Input
          label="University"
          name="university"
          value={profile.university || ""}
          onChange={(event) => onChange("university", event.target.value)}
          />

          <Input
          label="Course / Degree"
          name="degree"
          placeholder="e.g. BCA, B.Tech, B.Sc"
          value={profile.degree || ""}
          onChange={(event) => onChange("degree", event.target.value)}
          />

          <Input
          label="Department"
          name="department"
          placeholder="e.g. Computer Science"
          value={profile.department || ""}
          onChange={(event) => onChange("department", event.target.value)}
          />

          <Input
          label="Semester"
          name="semester"
          type="number"
          min="1"
          max="12"
          value={profile.semester || ""}
          onChange={(event) => onChange("semester", event.target.value)}
          />

          <Input
          label="Graduation Year"
          name="graduationYear"
          type="number"
          placeholder="e.g. 2027"
          min="2000"
          max="2100"
          value={profile.graduationYear || ""}
          onChange={(event) => onChange("graduationYear", event.target.value)}
          />

          <Input
          label="CGPA (out of 10)"
          name="cgpa"
          type="number"
          min="0"
          max="10"
          step="0.01"
          value={profile.cgpa ?? ""}
          onChange={(event) => onChange("cgpa", event.target.value)}
          />

        </div>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {saved && <p role="status" className="text-sm text-green-700">{t("Education details saved successfully!")}</p>}
        {/* Submit Button */}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <Button type="submit" loading={isSaving}>
            {t("Save Education")}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default EducationDetails;
