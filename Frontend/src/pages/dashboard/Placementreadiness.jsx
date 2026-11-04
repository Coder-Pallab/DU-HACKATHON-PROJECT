import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, RefreshCw, Target } from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";
import ReadinessScore from "../../Components/placement/ReadinessScore";
import InterviewPrep from "../../Components/placement/InterviewPrep";
import { useLanguage } from "../../hooks/useLanguage";
import { careerService } from "../../services/careerService";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";

function PlacementReadiness() {
  const { t } = useLanguage();
  const [careers, setCareers] = useState([]);
  const [careerId, setCareerId] = useState("");
  const [assessmentState, setAssessmentState] = useState({ careerId: "", data: null });
  const [isLoadingCareers, setIsLoadingCareers] = useState(true);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);
  const [isAssessing, setIsAssessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    careerService
      .list({ limit: 100 })
      .then((result) => {
        if (!active) return;
        const availableCareers = result.items || [];
        setCareers(availableCareers);
        setCareerId(availableCareers[0]?._id || "");
        if (availableCareers.length === 0) setIsLoadingAssessment(false);
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
          setIsLoadingAssessment(false);
        }
      })
      .finally(() => {
        if (active) setIsLoadingCareers(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!careerId) return undefined;

    let active = true;
    studentService
      .getPlacementReadinessAssessment(careerId)
      .then((result) => {
        if (active) setAssessmentState({ careerId, data: result });
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.response?.status !== 404) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setIsLoadingAssessment(false);
      });

    return () => {
      active = false;
    };
  }, [careerId]);

  const createAssessment = async () => {
    if (!careerId) return;
    setIsAssessing(true);
    setError("");
    try {
      const data = await studentService.createPlacementReadinessAssessment(careerId);
      setAssessmentState({ careerId, data });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsAssessing(false);
    }
  };

  const assessment =
    assessmentState.careerId === careerId ? assessmentState.data : null;
  const selectedCareer = careers.find((career) => career._id === careerId);
  const recommendationGroups = [
    { title: t("Strengths"), items: assessment?.strengths || [], tone: "teal" },
    { title: t("Areas to improve"), items: assessment?.areasToImprove || [], tone: "amber" },
    { title: t("Recommended next steps"), items: assessment?.recommendations || [], tone: "blue" },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Placement Readiness"
        description="Measure your preparation using your saved skills, analyzed resume, learning progress, and completed mock interviews."
      />

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-sm font-medium text-slate-700">
            {t("Career goal")}
            <select
              value={careerId}
              onChange={(event) => {
                setCareerId(event.target.value);
                setIsLoadingAssessment(Boolean(event.target.value));
                setError("");
              }}
              disabled={isLoadingCareers || isLoadingAssessment || isAssessing}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
            >
              <option value="">{t("Select a career")}</option>
              {careers.map((career) => (
                <option key={career._id} value={career._id}>
                  {career.title} · {career.sector}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={createAssessment}
            disabled={!careerId || isLoadingCareers || isLoadingAssessment || isAssessing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAssessing || isLoadingAssessment ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : assessment ? (
              <RefreshCw size={17} />
            ) : (
              <Target size={17} />
            )}
            {isAssessing
              ? t("Calculating...")
              : assessment
                ? t("Refresh readiness assessment")
                : t("Calculate readiness")}
          </button>
        </div>
        {selectedCareer && (
          <p className="mt-3 text-sm leading-6 text-slate-500">{selectedCareer.description}</p>
        )}
        {careers.length === 0 && !isLoadingCareers && (
          <p className="mt-4 text-sm text-slate-500">{t("No careers are available yet.")}</p>
        )}
      </section>

      {isLoadingCareers || isLoadingAssessment ? (
        <p role="status" className="flex items-center gap-2 text-sm text-slate-500">
          <LoaderCircle size={16} className="animate-spin" />
          {t("Loading your readiness data...")}
        </p>
      ) : careerId && !assessment ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <Target size={28} className="mx-auto text-teal-700" />
          <h2 className="mt-3 font-semibold text-slate-800">{t("No readiness assessment yet")}</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-slate-500">
            {t("Create an assessment to see evidence-based scores and recommendations for this career.")}
          </p>
        </div>
      ) : assessment ? (
        <>
          <ReadinessScore assessment={assessment} />
          <section className="grid gap-4 md:grid-cols-3">
            {recommendationGroups.map(({ title, items, tone }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="font-semibold text-slate-800">{title}</h2>
                {items.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {items.map((item, index) => (
                      <li key={`${title}-${index}`} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                        <CheckCircle2
                          size={16}
                          className={`mt-1 shrink-0 ${
                            tone === "amber" ? "text-amber-600" : "text-teal-600"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">{t("No items recorded in this section.")}</p>
                )}
              </article>
            ))}
          </section>
        </>
      ) : null}

      <InterviewPrep careerId={careerId} careerTitle={selectedCareer?.title || ""} />
    </div>
  );
}

export default PlacementReadiness;
