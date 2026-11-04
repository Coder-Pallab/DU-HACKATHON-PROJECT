import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, ExternalLink, LoaderCircle, RefreshCw } from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";
import { careerService } from "../../services/careerService";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";
import { useLanguage } from "../../hooks/useLanguage";
import { getLearningResource } from "../../utils/learningResources";

function LearningRoadmap() {
  const { language, t } = useLanguage();
  const [careers, setCareers] = useState([]);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [careerId, setCareerId] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [busyPhase, setBusyPhase] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const currentContentLanguage = language === "as" ? "Assamese" : "English";
  const languageMismatch =
    roadmap && roadmap.contentLanguage !== currentContentLanguage;

  useEffect(() => {
    let active = true;
    Promise.all([
      careerService.list({ limit: 100 }),
      aiService.listRoadmaps(),
    ])
      .then(([careerResult, roadmapResult]) => {
        const availableCareers = careerResult.items || [];
        const careersById = new Map(availableCareers.map((career) => [career._id, career]));
        const roadmaps = (roadmapResult || [])
          .map((savedRoadmap) => ({
            career:
              careersById.get(savedRoadmap.career?._id || savedRoadmap.career) ||
              (typeof savedRoadmap.career === "object" ? savedRoadmap.career : null),
            roadmap: savedRoadmap,
          }))
          .filter((item) => item.career);
        if (!active) return;

        setCareers(availableCareers);
        setSavedRoadmaps(roadmaps);
        if (roadmaps.length > 0) {
          setCareerId(roadmaps[0].career._id);
          setRoadmap(roadmaps[0].roadmap);
        }
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const loadRoadmap = async () => {
    if (!careerId) return;
    setError("");
    setNotice("");
    setIsLoadingRoadmap(true);
    try {
      const loadedRoadmap = await aiService.getRoadmap(careerId);
      setRoadmap(loadedRoadmap);
      setSavedRoadmaps((current) => {
        const matchingCareer = careers.find((career) => career._id === careerId);
        if (!matchingCareer) return current;
        const existingIndex = current.findIndex((item) => item.career._id === careerId);
        if (existingIndex < 0) return [...current, { career: matchingCareer, roadmap: loadedRoadmap }];
        return current.map((item, index) =>
          index === existingIndex ? { ...item, roadmap: loadedRoadmap } : item
        );
      });
    } catch (requestError) {
      setRoadmap(null);
      if (requestError.response?.status === 404) {
        setNotice(t("No saved roadmap exists for this career yet. Generate one to get started."));
      } else {
        setError(getApiErrorMessage(requestError));
      }
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const generateRoadmap = async () => {
    if (!careerId) return;
    setIsGenerating(true);
    setError("");
    setNotice("");
    try {
      const generatedRoadmap = await aiService.generateRoadmap(careerId);
      setRoadmap(generatedRoadmap);
      const matchingCareer = careers.find((career) => career._id === careerId);
      if (matchingCareer) {
        setSavedRoadmaps((current) => {
          const existingIndex = current.findIndex((item) => item.career._id === careerId);
          if (existingIndex < 0) return [{ career: matchingCareer, roadmap: generatedRoadmap }, ...current];
          return current.map((item, index) =>
            index === existingIndex ? { ...item, roadmap: generatedRoadmap } : item
          );
        });
      }
      setNotice(t("Your personalized roadmap has been generated and saved."));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePhase = async (phase, status) => {
    if (!roadmap?._id) return;
    setBusyPhase(phase._id);
    setError("");
    setNotice("");
    try {
      const updated = await aiService.updateRoadmapPhase(roadmap._id, phase._id, status);
      setRoadmap(updated);
      setSavedRoadmaps((current) =>
        current.map((item) =>
          item.roadmap._id === updated._id ? { ...item, roadmap: updated } : item
        )
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyPhase("");
    }
  };

  const selectedCareer = careers.find((career) => career._id === careerId);

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Learning Roadmap"
        description="Generate and track a personalized learning plan based on your saved skill-gap analysis."
      />

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">{notice}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800">{t("Choose a career goal")}</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <select
            value={careerId}
            onChange={(event) => {
              const nextCareerId = event.target.value;
              setCareerId(nextCareerId);
              setRoadmap(null);
              setNotice("");
              setError("");
            }}
            disabled={isLoading || isLoadingRoadmap || isGenerating}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
            aria-label="Career goal for roadmap"
          >
            <option value="">{t("Select a career")}</option>
            {careers.map((career) => <option key={career._id} value={career._id}>{career.title} · {career.sector}</option>)}
          </select>
          <button type="button" disabled={!careerId || isLoading || isLoadingRoadmap || isGenerating} onClick={loadRoadmap} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">
            {isLoadingRoadmap ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {isLoadingRoadmap ? t("Loading...") : t("Load saved roadmap")}
          </button>
          <button type="button" disabled={!careerId || isGenerating || isLoadingRoadmap} onClick={generateRoadmap} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
            {isGenerating ? <LoaderCircle size={16} className="animate-spin" /> : <BookOpen size={16} />}
            {isGenerating ? t("Generating...") : t("Generate roadmap")}
          </button>
        </div>
        {selectedCareer && !roadmap && language !== "as" && (
          <p className="mt-3 text-xs text-slate-500">{selectedCareer.description}</p>
        )}
        {selectedCareer && language === "as" && roadmap?.contentLanguage === currentContentLanguage && roadmap.careerDescription && (
          <p className="mt-3 text-xs text-slate-500">{roadmap.careerDescription}</p>
        )}
        {!isLoading && careers.length === 0 && <p className="mt-4 text-sm text-slate-500">{t("The career catalog did not return any available careers.")}</p>}
        {!isLoading && careers.length > 0 && savedRoadmaps.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {t("No saved roadmaps were found. Select a career and generate a roadmap to see it here.")}
          </p>
        )}
      </section>

      {savedRoadmaps.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-800">{t("Your saved roadmaps")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("Choose a saved roadmap to view its phases and progress.")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedRoadmaps.map(({ career, roadmap: savedRoadmap }) => (
              <button
                key={savedRoadmap._id}
                type="button"
                disabled={isLoadingRoadmap || isGenerating || Boolean(busyPhase)}
                onClick={() => {
                  setCareerId(career._id);
                  setRoadmap(savedRoadmap);
                  setError("");
                  setNotice("");
                }}
                className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  roadmap?._id === savedRoadmap._id
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                }`}
              >
                <span className="block font-semibold text-slate-800">{career.title}</span>
                <span className="mt-1 block text-sm text-slate-500">
                  {savedRoadmap.progressPercent || 0}% · {savedRoadmap.phases?.length || 0} {t("phases")} · {t(savedRoadmap.contentLanguage || "Language unknown")}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {isLoading && <p role="status" className="text-sm text-slate-500">{t("Loading careers and checking saved roadmaps...")}</p>}

      {roadmap && (
        <section className="space-y-5">
          {languageMismatch && (
            <div role="status" className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-amber-900">
                {roadmap.contentLanguage
                  ? t("This roadmap was generated in {language}. Regenerate it to create content in your current language; completed phases will be retained when they match.")
                      .replace("{language}", t(roadmap.contentLanguage))
                  : t("This saved roadmap predates language tracking. Regenerate it to create content in your current language; matching phase progress will be retained.")}
              </p>
              <button
                type="button"
                disabled={isGenerating || isLoadingRoadmap || Boolean(busyPhase)}
                onClick={generateRoadmap}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isGenerating && <LoaderCircle size={15} className="animate-spin" />}
                {t("Regenerate in {language}").replace("{language}", t(currentContentLanguage))}
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">{roadmap.careerTitle || selectedCareer?.title}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-800">{t("Personalized learning plan")}</h2>
                {roadmap.careerDescription && roadmap.contentLanguage === currentContentLanguage && language === "en" && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">{roadmap.careerDescription}</p>
                )}
                <p className="mt-2 text-sm leading-6 text-slate-600">{roadmap.summary}</p>
              </div>
              <div className="shrink-0 rounded-xl bg-teal-50 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-teal-900">{roadmap.progressPercent || 0}%</p>
                <p className="text-xs text-teal-800">{t(roadmap.status?.replace("_", " ") || "not started")}</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${roadmap.progressPercent || 0}%` }} />
            </div>
          </div>

          {(roadmap.phases || []).map((phase) => {
            const learningResource = getLearningResource(phase.focusSkill);
            return (
            <article key={phase._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{t("Phase")} {phase.sequence}</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{t(`${phase.priority} priority`)}</span>
                    <span className="text-xs text-slate-500">{t("Weeks")} {phase.weekStart}–{phase.weekEnd}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-800">{phase.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{phase.objective}</p>
                  {learningResource && (
                    <a
                      href={learningResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900"
                    >
                      {learningResource.isSearch
                        ? t("Find official learning resources for")
                        : t("Learn this skill from the official documentation")}{" "}
                      <span>{phase.focusSkill}</span>
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  )}
                </div>
                <select
                  aria-label={`Progress for ${phase.title}`}
                  value={phase.status}
                  disabled={busyPhase === phase._id}
                  onChange={(event) => updatePhase(phase, event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm capitalize"
                >
                  <option value="not_started">{t("Not started")}</option>
                  <option value="in_progress">{t("In progress")}</option>
                  <option value="completed">{t("Completed")}</option>
                </select>
              </div>
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-slate-700">{t("Activities")}</h4>
                <ul className="mt-2 space-y-2">
                  {(phase.activities || []).map((activity, index) => (
                    <li key={`${phase._id}-activity-${index}`} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              {busyPhase === phase._id && <p className="mt-3 text-xs text-slate-500">{t("Saving progress...")}</p>}
            </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default LearningRoadmap;
