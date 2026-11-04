import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleHelp,
  LoaderCircle,
  MessageSquareText,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";

const careerIdFor = (interview) =>
  typeof interview.career === "object" ? interview.career?._id : interview.career;

function InterviewPrep({ careerId, careerTitle }) {
  const { t } = useLanguage();
  const [interviews, setInterviews] = useState([]);
  const [activeInterviewId, setActiveInterviewId] = useState("");
  const [loadedCareerId, setLoadedCareerId] = useState("");
  const [answer, setAnswer] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!careerId) return undefined;

    let active = true;
    aiService
      .listMockInterviews()
      .then((result) => {
        if (!active) return;
        const matchingInterviews = (result || []).filter(
          (interview) => careerIdFor(interview) === careerId
        );
        setInterviews(matchingInterviews);
        setActiveInterviewId(matchingInterviews[0]?._id || "");
        setLoadedCareerId(careerId);
        setError("");
      })
      .catch((requestError) => {
        if (active) {
          setLoadedCareerId(careerId);
          setError(getApiErrorMessage(requestError));
        }
      });

    return () => {
      active = false;
    };
  }, [careerId]);

  const activeInterview =
    interviews.find((interview) => interview._id === activeInterviewId) || null;
  const isLoading = Boolean(careerId) && loadedCareerId !== careerId;
  const unansweredQuestions = useMemo(
    () => (activeInterview?.questions || []).filter((question) => !question.answer),
    [activeInterview]
  );
  const currentQuestion = unansweredQuestions[0];
  const answeredCount = (activeInterview?.questions || []).length - unansweredQuestions.length;

  const updateInterview = (updated) => {
    setInterviews((current) =>
      current.map((interview) => (interview._id === updated._id ? updated : interview))
    );
    setActiveInterviewId(updated._id);
    setAnswer("");
  };

  const startInterview = async () => {
    if (!careerId) return;
    setIsStarting(true);
    setError("");
    try {
      const created = await aiService.createMockInterview(careerId);
      setInterviews((current) => [created, ...current]);
      setActiveInterviewId(created._id);
      setAnswer("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsStarting(false);
    }
  };

  const submitAnswer = async (event) => {
    event.preventDefault();
    if (!activeInterview || !currentQuestion || answer.trim().length < 5) return;
    setIsSubmitting(true);
    setError("");
    try {
      const updated = await aiService.submitMockInterviewAnswer(
        activeInterview._id,
        currentQuestion._id || currentQuestion.id,
        answer.trim()
      );
      updateInterview(updated);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteInterview = async (interview) => {
    if (!window.confirm(t("Delete this saved mock interview?"))) return;
    setError("");
    try {
      await aiService.deleteMockInterview(interview._id);
      const remaining = interviews.filter((item) => item._id !== interview._id);
      setInterviews(remaining);
      if (activeInterview?._id === interview._id) {
        setActiveInterviewId(remaining[0]?._id || "");
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <MessageSquareText size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{t("AI Mock Interview")}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {careerTitle
                ? `${t("Practice role-specific questions for")} ${careerTitle}.`
                : t("Choose a career goal above to start an interview.")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={startInterview}
          disabled={!careerId || isStarting || isLoading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStarting ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {isStarting ? t("Generating questions...") : t("Start a mock interview")}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="flex items-center gap-2 text-sm text-slate-500">
          <LoaderCircle size={16} className="animate-spin" />
          {t("Loading saved interviews...")}
        </p>
      ) : (
        <>
          {interviews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interviews.map((interview) => (
                <button
                  key={interview._id}
                  type="button"
                  onClick={() => {
                    setActiveInterviewId(interview._id);
                    setAnswer("");
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                    activeInterview?._id === interview._id
                      ? "border-teal-500 bg-teal-50 text-teal-800"
                      : "border-slate-200 text-slate-600 hover:border-teal-300"
                  }`}
                >
                  {new Date(interview.createdAt).toLocaleDateString()} ·{" "}
                  {interview.status === "completed" ? t("Completed") : t("In progress")}
                </button>
              ))}
            </div>
          )}

          {!activeInterview ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
              <CircleHelp size={24} className="mx-auto text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">
                {careerId
                  ? t("No interview sessions saved for this career.")
                  : t("Choose a career goal above to view mock interviews.")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{activeInterview.careerTitle}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t(activeInterview.contentLanguage)} · {answeredCount}{" "}
                    {t("of")} {activeInterview.questions.length} {t("answers evaluated")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {activeInterview.status === "completed" && (
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
                      {t("Overall score")}: {activeInterview.overallScore}%
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteInterview(activeInterview)}
                    aria-label={t("Delete this saved mock interview?")}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {currentQuestion ? (
                <form onSubmit={submitAnswer} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                      {answeredCount + 1}
                    </span>
                    <h3 className="pt-1 font-semibold leading-6 text-slate-800">
                      {currentQuestion.prompt}
                    </h3>
                  </div>
                  <label className="mt-4 block text-sm font-medium text-slate-700">
                    {t("Your answer")}
                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      rows={5}
                      maxLength={6000}
                      required
                      minLength={5}
                      disabled={isSubmitting}
                      placeholder={t("Write your answer in the interview language...")}
                      className="mt-2 block w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">
                      {answer.length}/6000
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting || answer.trim().length < 5}
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Play size={16} />
                      )}
                      {isSubmitting ? t("Evaluating answer...") : t("Submit for feedback")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 size={18} />
                    {t("Interview completed")}
                  </div>
                  <p className="mt-1">
                    {t("Your overall score is")} {activeInterview.overallScore}%.
                  </p>
                </div>
              )}

              {(activeInterview.questions || [])
                .filter((question) => question.answer)
                .map((question, index) => (
                  <article
                    key={question._id || index}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-medium leading-6 text-slate-800">
                        {question.prompt}
                      </h4>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {t("Score")}: {question.score}%
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {question.answer}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{question.feedback}</p>
                    {question.strengths?.length > 0 && (
                      <p className="mt-2 text-sm leading-6 text-teal-800">
                        <strong>{t("Strengths")}:</strong> {question.strengths.join(" · ")}
                      </p>
                    )}
                    {question.improvements?.length > 0 && (
                      <p className="mt-2 text-sm leading-6 text-amber-800">
                        <strong>{t("Suggestions")}:</strong> {question.improvements.join(" · ")}
                      </p>
                    )}
                  </article>
                ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default InterviewPrep;
