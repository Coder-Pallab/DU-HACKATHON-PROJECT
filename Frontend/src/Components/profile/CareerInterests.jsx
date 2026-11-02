import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";
import { studentService } from "../../services/studentService";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";

const toList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

function CareerInterests({ profile, onSaved }) {
  const { t } = useLanguage();
  const [interests, setInterests] = useState((profile.careerInterests || []).join(", "));
  const [softSkills, setSoftSkills] = useState((profile.softSkills || []).join(", "));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setRecommendationError("");
    setSaved(false);
    try {
      const updated = await studentService.updateInterests({
        careerInterests: toList(interests),
        softSkills: toList(softSkills),
      });
      onSaved(updated);
      setSaved(true);
      try {
        await aiService.refreshRecommendations();
      } catch (refreshError) {
        setRecommendationError(
          `Your interests were saved, but recommendations could not be refreshed: ${getApiErrorMessage(refreshError)}`
        );
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <BriefcaseBusiness size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{t("Career Interests")}</h2>
          <p className="text-sm text-slate-500">
            Add interests and soft skills to personalize career recommendations.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Career interests (comma-separated)
          <textarea
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
            rows={4}
            maxLength={1000}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Web Development, Data Analytics"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Soft skills (comma-separated)
          <textarea
            value={softSkills}
            onChange={(event) => setSoftSkills(event.target.value)}
            rows={4}
            maxLength={1000}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Communication, Teamwork"
          />
        </label>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {recommendationError && <p role="alert" className="mt-4 text-sm text-amber-800">{recommendationError}</p>}
      {saved && <p role="status" className="mt-4 text-sm text-green-700">Career interests saved.</p>}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <Button type="submit" loading={isSaving}>{t("Save Interests")}</Button>
      </div>
    </form>
  );
}

export default CareerInterests;
