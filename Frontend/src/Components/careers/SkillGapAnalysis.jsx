import { useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Target } from "lucide-react";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";
import { useLanguage } from "../../hooks/useLanguage";

const careerIdFor = (recommendation) =>
  typeof recommendation.career === "object"
    ? recommendation.career?._id
    : recommendation.career;

function SkillGapAnalysis({ recommendations = [] }) {
  const { language, t } = useLanguage();
  const [careerId, setCareerId] = useState(() => recommendations[0] ? careerIdFor(recommendations[0]) : "");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const currentContentLanguage = language === "as" ? "Assamese" : "English";
  const languageMismatch =
    analysis && analysis.contentLanguage !== currentContentLanguage;

  const loadAnalysis = async (generate) => {
    if (!careerId) return;
    setIsLoading(true);
    setError("");
    try {
      setAnalysis(generate ? await aiService.analyzeSkillGap(careerId) : await aiService.getSkillGap(careerId));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700"><Target size={22} /></div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{t("Skill Gap Analysis")}</h2>
          <p className="text-sm text-slate-500">{t("Generate a report using your saved profile skills and a real career.")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={careerId}
          onChange={(event) => {
            setCareerId(event.target.value);
            setAnalysis(null);
          }}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
          aria-label="Career for skill gap analysis"
        >
          {recommendations.map((item) => {
            const id = careerIdFor(item);
            return <option key={id} value={id}>{item.careerTitle}</option>;
          })}
        </select>
        <button type="button" disabled={!careerId || isLoading} onClick={() => loadAnalysis(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
          {t("Load latest")}
        </button>
        <button type="button" disabled={!careerId || isLoading} onClick={() => loadAnalysis(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
          {isLoading && <LoaderCircle size={16} className="animate-spin" />}
          {t("Analyze skill gap")}
        </button>
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {analysis && (
        <div className="mt-6">
          {languageMismatch && (
            <div role="status" className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-amber-900">
                {analysis.contentLanguage
                  ? t("This report was generated in {language}. Regenerate it to create content in your current language.")
                      .replace("{language}", t(analysis.contentLanguage))
                  : t("This saved report predates language tracking. Regenerate it to create content in your current language.")}
              </p>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => loadAnalysis(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isLoading && <LoaderCircle size={15} className="animate-spin" />}
                {t("Regenerate in {language}").replace("{language}", t(currentContentLanguage))}
              </button>
            </div>
          )}
          <div className="rounded-xl bg-teal-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-teal-900">{analysis.careerTitle} {t("readiness")}</p>
              <strong className="text-xl text-teal-900">{analysis.matchPercentage}%</strong>
            </div>
            <p className="mt-2 text-sm text-teal-800">{analysis.summary}</p>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800"><CheckCircle2 size={18} className="text-green-600" />{t("Matching skills")}</h3>
              {analysis.matchingSkills?.length ? (
                <ul className="flex flex-wrap gap-2">{analysis.matchingSkills.map((skill) => <li key={skill} className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-800">{skill}</li>)}</ul>
              ) : <p className="text-sm text-slate-500">{t("No matching skills are recorded yet.")}</p>}
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800"><AlertCircle size={18} className="text-amber-600" />{t("Skills to develop")}</h3>
              {analysis.missingSkills?.length ? (
                <div className="space-y-3">
                  {analysis.missingSkills.map((skill) => (
                    <article key={`${skill.name}-${skill.category}`} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-slate-800">{skill.name}</strong>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-800">{t(`${skill.priority} priority`)} · {t(skill.category)}</span>
                      </div>
                      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                        {(skill.learningSteps || []).map((step, index) => <li key={`${skill.name}-step-${index}`}>{step}</li>)}
                      </ul>
                    </article>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">{t("No skill gaps were reported for this career.")}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SkillGapAnalysis;
