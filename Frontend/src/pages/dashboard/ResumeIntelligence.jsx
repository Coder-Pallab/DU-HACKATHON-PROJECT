import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  FileText,
  LoaderCircle,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";
import ResumeUploader from "../../Components/resume/ResumeUploader";
import { useLanguage } from "../../hooks/useLanguage";
import { careerService } from "../../services/careerService";
import { getApiErrorMessage } from "../../services/apiClient";
import { resumeService } from "../../services/resumeService";

const IMPROVEMENT_KINDS = [
  "professionalSummary",
  "projectDescription",
  "resumeBullet",
  "experienceDescription",
  "skillSuggestions",
  "missingSections",
  "readability",
];

function ResumeIntelligence() {
  const { t } = useLanguage();
  const text = (key) => t(`resumeIntelligence.${key}`);
  const [resumes, setResumes] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedCareerId, setSelectedCareerId] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [compatibilityMode, setCompatibilityMode] = useState("career");
  const [jobDescription, setJobDescription] = useState("");
  const [improvementKind, setImprovementKind] = useState("professionalSummary");
  const [improvementSource, setImprovementSource] = useState("");
  const [draft, setDraft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const historyRequestId = useRef(0);

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume._id === selectedResumeId) || null,
    [resumes, selectedResumeId]
  );
  const selectedCareer = useMemo(
    () => careers.find((career) => career._id === selectedCareerId) || null,
    [careers, selectedCareerId]
  );
  const improvementNeedsSource = ["resumeBullet", "readability"].includes(improvementKind);

  useEffect(() => {
    let active = true;
    Promise.all([resumeService.list(), careerService.list({ limit: 100 })])
      .then(([resumeItems, careerResult]) => {
        if (!active) return;
        const careerItems = careerResult.items || [];
        setResumes(resumeItems);
        setCareers(careerItems);
        setSelectedResumeId(resumeItems[0]?._id || "");
        if (resumeItems[0]) {
          const requestId = ++historyRequestId.current;
          return resumeService.listIntelligenceAnalyses(resumeItems[0]._id)
            .then((items) => {
              if (!active || requestId !== historyRequestId.current) return;
              setAnalyses(items);
              setAnalysis(items[0] || null);
              setSelectedAnalysisId(items[0]?._id || "");
            });
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

  const handleResumeChange = async (resumeId) => {
    setSelectedResumeId(resumeId);
    setAnalyses([]);
    setAnalysis(null);
    setSelectedAnalysisId("");
    setDraft(null);
    const requestId = ++historyRequestId.current;
    if (!resumeId) return;
    setBusyAction("history");
    setError("");
    try {
      const items = await resumeService.listIntelligenceAnalyses(resumeId);
      if (requestId === historyRequestId.current) {
        setAnalyses(items);
        setAnalysis(items[0] || null);
        setSelectedAnalysisId(items[0]?._id || "");
      }
    } catch (requestError) {
      if (requestId === historyRequestId.current) setError(getApiErrorMessage(requestError));
    } finally {
      if (requestId === historyRequestId.current) setBusyAction("");
    }
  };

  const runAnalysis = async () => {
    if (!selectedResume) return;
    setBusyAction("analyze");
    setError("");
    setNotice("");
    try {
      const result = await resumeService.analyzeIntelligence(
        selectedResume._id,
        selectedCareerId || undefined
      );
      setAnalysis(result);
      setSelectedAnalysisId(result._id);
      setAnalyses((current) => [result, ...current.filter((item) => item._id !== result._id)]);
      setDraft(null);
      setNotice(text("analysisComplete"));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const uploadResume = async () => {
    if (!uploadFile) return;
    setBusyAction("upload");
    setError("");
    setNotice("");
    try {
      const uploaded = await resumeService.upload(uploadFile);
      setResumes((current) => [uploaded, ...current]);
      historyRequestId.current += 1;
      setSelectedResumeId(uploaded._id);
      setAnalyses([]);
      setAnalysis(null);
      setSelectedAnalysisId("");
      setUploadFile(null);
      setNotice(text("uploadComplete"));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const runCompatibility = async (event) => {
    event.preventDefault();
    if (!selectedResume) return;
    setBusyAction("compatibility");
    setError("");
    setNotice("");
    try {
      const result = await resumeService.compareCompatibility(
        selectedResume._id,
        compatibilityMode === "career"
          ? { careerId: selectedCareerId }
          : { jobDescription: jobDescription.trim() }
      );
      setAnalysis(result);
      setAnalyses((current) => [result, ...current.filter((item) => item._id !== result._id)]);
      setSelectedAnalysisId(result._id);
      setNotice(text("compatibilitySaved"));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const runImprovement = async () => {
    if (!selectedResume || !analysis) return;
    if (improvementNeedsSource && !improvementSource.trim()) return;
    setBusyAction("improvement");
    setError("");
    setNotice("");
    try {
      const result = await resumeService.createImprovementDraft(
        selectedResume._id,
        analysis._id,
        {
          kind: improvementKind,
          ...(improvementSource.trim() ? { sourceText: improvementSource.trim() } : {}),
          ...(selectedCareerId ? { careerId: selectedCareerId } : {}),
        }
      );
      setDraft(result);
      setNotice(text("draftGenerated"));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const updateDraft = async (payload) => {
    if (!selectedResume || !analysis || !draft) return;
    setBusyAction("save-draft");
    setError("");
    try {
      const updated = await resumeService.updateImprovementDraft(
        selectedResume._id,
        analysis._id,
        draft._id,
        payload
      );
      setDraft(updated);
      setAnalysis((current) => ({
        ...current,
        improvementDrafts: (current.improvementDrafts || []).map((item) =>
          item._id === updated._id ? updated : item
        ),
      }));
      setNotice(text("draftUpdated"));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const selectAnalysis = (analysisId) => {
    const selected = analyses.find((item) => item._id === analysisId) || null;
    setSelectedAnalysisId(analysisId);
    setAnalysis(selected);
    setDraft(selected?.improvementDrafts?.at(-1) || null);
  };

  const scoreColor = (score) =>
    score >= 75 ? "text-emerald-700" : score >= 50 ? "text-amber-700" : "text-rose-700";

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title={text("title")}
        description={text("description")}
      />

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            {text("chooseResume")}
            <select
              value={selectedResumeId}
              onChange={(event) => handleResumeChange(event.target.value)}
              disabled={isLoading || resumes.length === 0}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            >
              <option value="">{text("selectUploadedResume")}</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>{resume.fileName}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            {text("targetCareerOptional")}
            <select
              value={selectedCareerId}
              onChange={(event) => setSelectedCareerId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            >
              <option value="">{text("noTargetCareer")}</option>
              {careers.map((career) => (
                <option key={career._id} value={career._id}>{career.title}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={!selectedResume || busyAction !== ""}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === "analyze" ? <LoaderCircle size={17} className="animate-spin" /> : <ScanSearch size={17} />}
          {busyAction === "analyze" ? text("analyzing") : text("analyze")}
        </button>
      </section>

      {!isLoading && resumes.length === 0 && (
        <section className="grid gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-800">{text("uploadResume")}</h2>
            <ResumeUploader key={uploadFile?.name || "empty-upload"} file={uploadFile} onFileChange={setUploadFile} />
          </div>
          <button
            type="button"
            onClick={uploadResume}
            disabled={!uploadFile || busyAction !== ""}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busyAction === "upload" ? <LoaderCircle size={17} className="animate-spin" /> : <FileText size={17} />}
            {text("uploadButton")}
          </button>
        </section>
      )}

      {resumes.length > 0 && (
        <details className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">{text("uploadAnother")}</summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <ResumeUploader key={uploadFile?.name || "empty-upload"} file={uploadFile} onFileChange={setUploadFile} />
            <button type="button" onClick={uploadResume} disabled={!uploadFile || busyAction !== ""} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {busyAction === "upload" ? <LoaderCircle size={17} className="animate-spin" /> : <FileText size={17} />}
              {text("uploadButton")}
            </button>
          </div>
        </details>
      )}

      {isLoading && <p className="rounded-xl bg-white p-5 text-sm text-slate-600">{text("loading")}</p>}

      {selectedResume && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard label={text("resumeScore")} value={analysis?.overallScore == null ? "—" : `${analysis.overallScore}/100`} hint={analysis?.analysisType === "compatibility" ? text("compatibilityOnly") : analysis?.analysisStatus === "insufficient_data" ? text("insufficientScore") : text("scoreDisclaimer")} />
            <OverviewCard label={text("targetCareer")} value={analysis?.careerTitle || selectedCareer?.title || text("notSelected")} hint={analysis?.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : text("chooseCareerHint")} />
            <OverviewCard label={text("strengthsFound")} value={analysis?.analysisType === "resume_review" ? analysis.strengths?.length ?? 0 : "—"} hint={text("latestSavedReview")} />
            <OverviewCard label={text("improvementSuggestions")} value={analysis?.analysisType === "resume_review" ? analysis.recommendations?.length ?? 0 : "—"} hint={text("evidenceBased")} />
          </section>

          {analyses.length > 0 && (
            <label className="block max-w-xl text-sm font-medium text-slate-700">
              {text("history")}
              <select value={selectedAnalysisId} onChange={(event) => selectAnalysis(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                {analyses.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.analysisType === "compatibility" ? text("compatibility") : text("resumeReview")} · {new Date(item.createdAt).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
          )}

          {analysis?.categoryScores?.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{text("categoryScores")}</h2>
                  <p className="mt-1 text-sm text-slate-500">{analysis.rubric}</p>
                </div>
                {analysis.careerTitle && <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{analysis.careerTitle}</span>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.categoryScores.map((category) => (
                  <div key={category.key} className="rounded-xl border border-slate-100 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-800">{category.label}</h3>
                      <span className={`text-sm font-bold ${category.score == null ? "text-slate-400" : scoreColor(category.score)}`}>
                        {category.score == null ? text("unknown") : `${category.score}/100`}
                      </span>
                    </div>
                    {category.score != null && (
                      <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${category.score}%` }} />
                      </div>
                    )}
                    <p className="text-sm leading-6 text-slate-600">{category.rationale}</p>
                    {category.evidence?.length > 0 && (
                      <p className="mt-2 border-l-2 border-teal-300 pl-3 text-xs italic text-slate-500">{category.evidence.join(" · ")}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">{analysis.disclaimer}</p>
            </section>
          )}

          {analysis && (
            <section className="grid gap-4 lg:grid-cols-2">
              <TextList title={text("strengths")} items={analysis.strengths} empty={text("noStrengths")} />
              <TextList title={text("weaknesses")} items={analysis.weaknesses} empty={text("noWeaknesses")} />
              <TextList title={text("missingSections")} items={analysis.missingSections} empty={text("noMissingSections")} />
              <TextList title={text("recommendations")} items={analysis.recommendations} empty={text("noRecommendations")} />
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">{text("careerCompatibility")}</h2>
            <p className="mb-4 mt-1 text-sm text-slate-600">{text("compatibilityDisclaimer")}</p>
            <form onSubmit={runCompatibility} className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={compatibilityMode === "career"} onChange={() => setCompatibilityMode("career")} />
                  {text("storedCareer")}
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={compatibilityMode === "jobDescription"} onChange={() => setCompatibilityMode("jobDescription")} />
                  {text("pasteJobDescription")}
                </label>
              </div>
              {compatibilityMode === "career" ? (
                <select required value={selectedCareerId} onChange={(event) => setSelectedCareerId(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 sm:max-w-xl">
                  <option value="">{text("selectCareer")}</option>
                  {careers.map((career) => <option key={career._id} value={career._id}>{career.title}</option>)}
                </select>
              ) : (
                <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} minLength={50} maxLength={20000} rows={5} placeholder={text("jobDescriptionPlaceholder")} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
              )}
              <button type="submit" disabled={busyAction !== "" || (compatibilityMode === "jobDescription" && jobDescription.trim().length < 50)} className="inline-flex items-center gap-2 rounded-lg border border-teal-700 px-4 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50 disabled:opacity-50">
                {busyAction === "compatibility" ? <LoaderCircle size={16} className="animate-spin" /> : <ScanSearch size={16} />}
                {text("compare")}
              </button>
            </form>

            {analysis?.compatibility && (
              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-2">
                <OverviewCard label={text("keywordMatch")} value={analysis.compatibility.keywordMatchScore == null ? "—" : `${analysis.compatibility.keywordMatchScore}%`} hint={analysis.compatibility.targetTitle} />
                <OverviewCard label={text("profileCareerMatch")} value={analysis.compatibility.careerSuitabilityScore == null ? "—" : `${analysis.compatibility.careerSuitabilityScore}%`} hint={analysis.compatibility.type === "job_description" ? text("notForJobDescription") : text("existingMatchLogic")} />
                <TextList title={text("matchingSkills")} items={analysis.compatibility.matchingSkills} empty={text("noMatchingSkills")} />
                <TextList title={text("missingWeakSkills")} items={analysis.compatibility.missingSkills} empty={text("noMissingSkills")} />
                <TextList title={text("relevantProjects")} items={analysis.compatibility.relevantProjects} empty={text("noRelevantProjects")} />
                <TextList title={text("missingKeywords")} items={analysis.compatibility.missingKeywords} empty={text("noMissingKeywords")} />
                <div className="md:col-span-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <p>{analysis.compatibility.disclaimer}</p>
                  <p className="mt-2 text-xs">{analysis.compatibility.matchingMethod}</p>
                </div>
              </div>
            )}
          </section>

          {analysis && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-teal-700" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{text("improvementAssistant")}</h2>
                  <p className="text-sm text-slate-600">{text("improvementNotice")}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                <label className="text-sm font-medium text-slate-700">
                  {text("improvementType")}
                  <select value={improvementKind} onChange={(event) => setImprovementKind(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                    {IMPROVEMENT_KINDS.map((kind) => <option key={kind} value={kind}>{text(`kind.${kind}`)}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {improvementNeedsSource ? text("currentTextRequired") : text("currentText")}
                  <input required={improvementNeedsSource} value={improvementSource} onChange={(event) => setImprovementSource(event.target.value)} maxLength={3000} placeholder={text("sourcePlaceholder")} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
                </label>
                <button type="button" onClick={runImprovement} disabled={busyAction !== "" || (improvementNeedsSource && !improvementSource.trim())} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                  {busyAction === "improvement" ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {text("generateDraft")}
                </button>
              </div>
              {draft && (
                <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-teal-950">{text("reviewableDraft")}</h3>
                    <span className="text-xs capitalize text-slate-500">{text(`status.${draft.status}`)}</span>
                  </div>
                  {draft.sourceText && <p className="mb-3 rounded-lg bg-white p-3 text-sm text-slate-600"><strong>{text("source")}:</strong> {draft.sourceText}</p>}
                  <textarea value={draft.editedContent || draft.generatedContent} onChange={(event) => setDraft((current) => ({ ...current, editedContent: event.target.value }))} maxLength={4000} rows={5} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-800" />
                  {draft.evidence?.length > 0 && <p className="mt-2 text-xs text-slate-600"><strong>{text("supportingFacts")}:</strong> {draft.evidence.join(" · ")}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busyAction !== ""} onClick={() => updateDraft({ editedContent: draft.editedContent || draft.generatedContent })} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">
                      {busyAction === "save-draft" ? <LoaderCircle size={15} className="animate-spin" /> : <FileText size={15} />}
                      {text("saveEdits")}
                    </button>
                    <button type="button" disabled={busyAction !== ""} onClick={() => updateDraft({ editedContent: draft.editedContent || draft.generatedContent, status: "accepted" })} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      <Check size={15} /> {text("acceptDraft")}
                    </button>
                    <button type="button" disabled={busyAction !== ""} onClick={() => updateDraft({ status: "dismissed" })} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 disabled:opacity-50">
                      <X size={15} /> {text("dismiss")}
                    </button>
                  </div>
                </div>
              )}
              <p className="mt-4 text-xs leading-5 text-slate-500">{text("exportUnavailable")}</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function OverviewCard({ label, value, hint }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 break-words text-xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );
}

function TextList({ title, items = [], empty }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 font-semibold text-slate-900">{title}</h2>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const text = typeof item === "string" ? item : item.text;
            return (
              <li key={`${text}-${index}`} className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <p>{text}</p>
                {item.evidence && <p className="mt-2 border-l-2 border-slate-300 pl-3 text-xs italic text-slate-500">{item.evidence}</p>}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">{empty}</p>
      )}
    </section>
  );
}

export default ResumeIntelligence;
