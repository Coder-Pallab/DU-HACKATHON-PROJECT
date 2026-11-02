import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, RefreshCw, TrendingUp } from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";
import SkillGapAnalysis from "../../Components/careers/SkillGapAnalysis";
import { aiService } from "../../services/aiService";
import { careerService } from "../../services/careerService";
import { getApiErrorMessage } from "../../services/apiClient";
import { useLanguage } from "../../hooks/useLanguage";

const careerIdFor = (recommendation) =>
  typeof recommendation.career === "object"
    ? recommendation.career?._id
    : recommendation.career;
const careerSectorFor = (recommendation) =>
  recommendation.sector || recommendation.career?.sector;
const EMPTY_RECOMMENDATIONS = [];

const formatSalary = (range) => {
  if (!range?.min && !range?.max) return "Not provided";
  const currency = range.currency === "INR" ? "₹" : `${range.currency || ""} `;
  const min = Math.round((range.min || 0) / 100000);
  const max = Math.round((range.max || 0) / 100000);
  return `${currency}${min}–${max} LPA`;
};

function CareerMatches() {
  const { language, t } = useLanguage();
  const contentLanguage = language === "as" ? "Assamese" : "English";
  const [recommendationData, setRecommendationData] = useState(null);
  const [loadedLanguage, setLoadedLanguage] = useState("");
  const [selectedSector, setSelectedSector] = useState("All sectors");
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [careerDetails, setCareerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    aiService.getRecommendations()
      .then((result) => {
        if (active) {
          setRecommendationData(result);
          setLoadedLanguage(contentLanguage);
          setSelectedRecommendation(null);
          setCareerDetails(null);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setRecommendationData(null);
          setLoadedLanguage(contentLanguage);
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [contentLanguage]);

  const isRecommendationsLoading = isLoading || loadedLanguage !== contentLanguage;
  const recommendations = recommendationData?.recommendations || EMPTY_RECOMMENDATIONS;
  const localizedText = (item, key, fallback) => item[key] || fallback;
  const sectors = useMemo(
    () => [...new Set(recommendations.map(careerSectorFor).filter(Boolean))],
    [recommendations]
  );
  const filteredRecommendations = recommendations.filter(
    (item) => selectedSector === "All sectors" || careerSectorFor(item) === selectedSector
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError("");
    try {
      setRecommendationData(await aiService.refreshRecommendations());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = async (recommendation) => {
    setSelectedRecommendation(recommendation);
    setCareerDetails(null);
    setError("");
    try {
      setCareerDetails(await careerService.get(careerIdFor(recommendation)));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return (
    <div className="w-full min-w-0 space-y-8">
      <PageHeader
        title={t("Career Matches")}
        description={t("Recommendations are calculated from your student profile, skills, interests, and academic details.")}
      />

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t("Recommended careers")}</h2>
            {recommendationData && loadedLanguage === contentLanguage && (
              <p className="mt-1 text-sm text-slate-500">
                {recommendationData.totalEvaluated} {t("careers evaluated")}
                {recommendationData.lastAnalyzedAt && ` · ${t("Updated")} ${new Date(recommendationData.lastAnalyzedAt).toLocaleString()}`}
                {recommendationData.isAIEnriched ? ` · ${t("AI-enriched")}` : ""}
              </p>
            )}
          </div>
          <button type="button" disabled={isRefreshing || isRecommendationsLoading} onClick={handleRefresh} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? t("Refreshing...") : t("Refresh recommendations")}
          </button>
        </div>

        <div className="mt-5">
          <label htmlFor="sector-filter" className="mr-3 text-sm font-medium text-slate-700">{t("Filter by sector")}</label>
          <select id="sector-filter" value={selectedSector} onChange={(event) => setSelectedSector(event.target.value)} className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:mt-0">
            <option value="All sectors">{t("All sectors")}</option>
            {sectors.map((sector) => {
              const sectorRecommendation = recommendations.find((item) => careerSectorFor(item) === sector);
              return (
                <option key={sector} value={sector}>
                  {sectorRecommendation
                    ? localizedText(sectorRecommendation, "localizedSector", sector)
                    : sector}
                </option>
              );
            })}
          </select>
        </div>

        {isRecommendationsLoading ? (
          <p className="mt-6 text-sm text-slate-500">{t("Loading your recommendations...")}</p>
        ) : filteredRecommendations.length === 0 ? (
          <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">{t("No recommendations are available for this filter.")}</p>
        ) : (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {filteredRecommendations.map((item) => (
              <article key={item._id || careerIdFor(item)} className="rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-teal-50 p-3 text-teal-700"><BriefcaseBusiness size={21} /></div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{localizedText(item, "localizedCareerTitle", item.careerTitle)}</h3>
                      <p className="text-xs text-slate-500">{localizedText(item, "localizedSector", careerSectorFor(item) || t("Career"))}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-800">{item.matchPercentage}% {t("match")}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{localizedText(item, "localizedCareerFitSummary", item.careerFitSummary || item.careerDescription)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(item.matchingSkills || []).slice(0, 5).map((skill) => <span key={skill} className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-800">✓ {skill}</span>)}
                  {(item.missingSkills || []).slice(0, 5).map((skill) => <span key={skill} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">{t("Learn:")} {skill}</span>)}
                </div>
                {(item.localizedSuggestedNextSteps || item.suggestedNextSteps)?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-slate-700">{t("Suggested next steps")}</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                      {(item.localizedSuggestedNextSteps || item.suggestedNextSteps).slice(0, 3).map((step, index) => <li key={`${item.careerTitle}-step-${index}`}>{step}</li>)}
                    </ul>
                  </div>
                )}
                <button type="button" onClick={() => handleViewDetails(item)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900">
                  {t("Career details")} <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedRecommendation && loadedLanguage === contentLanguage && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-slate-800">{localizedText(selectedRecommendation, "localizedCareerTitle", selectedRecommendation.careerTitle)}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {localizedText(selectedRecommendation, "localizedCareerDescription", careerDetails?.description || selectedRecommendation.careerDescription)}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500"><TrendingUp size={16} /> {t("Expected salary")}</div>
              <p className="mt-2 font-semibold text-slate-800">{formatSalary(careerDetails?.averageSalaryRange || careerDetails?.career?.averageSalaryRange)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{t("Demand")} · {t("Experience")}</p>
              <p className="mt-2 font-semibold text-slate-800">
                {careerDetails?.industryDemand || t("Not provided")} · {careerDetails?.experienceLevel || t("Not provided")}
              </p>
            </div>
          </div>
          {careerDetails?.requiredTechnicalSkills?.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold text-slate-800">{t("Required technical skills")}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {careerDetails.requiredTechnicalSkills.map((skill) => <span key={skill.name} className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800">{skill.name} · {skill.importance}</span>)}
              </div>
            </div>
          )}
          {(selectedRecommendation.localizedRequiredQualifications || selectedRecommendation.requiredQualifications)?.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold text-slate-800">{t("Qualifications")}</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                {(selectedRecommendation.localizedRequiredQualifications || selectedRecommendation.requiredQualifications).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
          {selectedRecommendation.scoreBreakdown && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {Object.entries(selectedRecommendation.scoreBreakdown).map(([label, score]) => (
                <div key={label} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs capitalize text-slate-500">{label.replace(/([A-Z])/g, " $1")}</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{score}%</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!isLoading && recommendations.length > 0 && <SkillGapAnalysis recommendations={recommendations} />}
    </div>
  );
}

export default CareerMatches;
