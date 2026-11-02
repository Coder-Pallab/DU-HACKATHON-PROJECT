import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  ScanText,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";
import ResumeUploader from "../../Components/resume/ResumeUploader";
import { resumeService } from "../../services/resumeService";
import { studentService } from "../../services/studentService";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";

const initialSkills = { technicalSkills: [], softSkills: [] };

function ResumeSkills() {
  const [resumes, setResumes] = useState([]);
  const [skills, setSkills] = useState(initialSkills);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [parseResult, setParseResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [extraction, setExtraction] = useState(null);
  const [classification, setClassification] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Technical");
  const [newSkillProficiency, setNewSkillProficiency] = useState("Beginner");
  const [newSkillIsSoft, setNewSkillIsSoft] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState("");
  const [editingSkillName, setEditingSkillName] = useState("");

  const loadData = async () => {
    setError("");
    try {
      const [resumeList, studentSkills] = await Promise.all([
        resumeService.list(),
        studentService.getSkills(),
      ]);
      setResumes(resumeList);
      setSkills(studentSkills || initialSkills);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([resumeService.list(), studentService.getSkills()])
      .then(([resumeList, studentSkills]) => {
        if (!active) return;
        setResumes(resumeList);
        setSkills(studentSkills || initialSkills);
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

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");
    setNotice("");
    try {
      const uploaded = await resumeService.upload(selectedFile);
      setResumes((current) => [uploaded, ...current]);
      setSelectedFile(null);
      setNotice("Resume uploaded successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsUploading(false);
    }
  };

  const handleParse = async (resume) => {
    setBusyAction(`parse-${resume._id}`);
    setError("");
    setNotice("");
    try {
      const result = await resumeService.parse(resume._id);
      setParseResult(result);
      setNotice(`Text extracted from ${result.fileName}.`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleAnalyze = async (resume) => {
    setBusyAction(`analyze-${resume._id}`);
    setError("");
    setNotice("");
    try {
      const result = await resumeService.analyze(resume._id);
      setAnalysis(result);
      await loadData();
      setNotice(`Resume analysis completed for ${result.fileName}.`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleExtractSkills = async (resume) => {
    setBusyAction(`extract-${resume._id}`);
    setError("");
    setNotice("");
    try {
      setExtraction(await aiService.extractSkills({ resumeId: resume._id }));
      setNotice("AI skill extraction completed.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleDownload = async (resume) => {
    setBusyAction(`download-${resume._id}`);
    setError("");
    try {
      const blob = await resumeService.download(resume._id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = resume.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleDeleteResume = async (resume) => {
    if (!window.confirm(`Delete ${resume.fileName}?`)) return;
    setBusyAction(`delete-${resume._id}`);
    setError("");
    try {
      await resumeService.remove(resume._id);
      setResumes((current) => current.filter((item) => item._id !== resume._id));
      if (parseResult?.resumeId === resume._id) setParseResult(null);
      if (analysis?.resumeId === resume._id) setAnalysis(null);
      setNotice("Resume deleted.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (!newSkill.trim()) return;
    setBusyAction("add-skill");
    setError("");
    try {
      await studentService.addSkill({
        name: newSkill.trim(),
        proficiency: newSkillIsSoft ? undefined : newSkillProficiency,
        category: newSkillIsSoft ? undefined : newSkillCategory,
        isSoftSkill: newSkillIsSoft,
      });
      setNewSkill("");
      setSkills(await studentService.getSkills());
      setNotice("Skill added to your profile.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleSaveSkillName = async (skillId) => {
    if (!editingSkillName.trim()) return;
    setBusyAction(`update-skill-${skillId}`);
    setError("");
    try {
      await studentService.updateSkill(skillId, { name: editingSkillName.trim() });
      setSkills(await studentService.getSkills());
      setEditingSkillId("");
      setNotice("Skill updated.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleChangeProficiency = async (skill, proficiency) => {
    setBusyAction(`update-skill-${skill._id}`);
    setError("");
    try {
      await studentService.updateSkill(skill._id, { proficiency });
      setSkills(await studentService.getSkills());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    setBusyAction(`delete-skill-${skillId}`);
    setError("");
    try {
      await studentService.deleteSkill(skillId);
      setSkills(await studentService.getSkills());
      setNotice("Skill removed from your profile.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  const handleClassify = async () => {
    const extractedSkills = [...new Set([
      ...(extraction?.technicalSkills || []),
      ...(extraction?.programmingLanguages || []),
      ...(extraction?.frameworks || []),
      ...(extraction?.databases || []),
      ...(extraction?.softSkills || []),
    ])];
    if (!extractedSkills.length) return;
    setBusyAction("classify");
    setError("");
    try {
      setClassification(await aiService.classifySkills(extractedSkills));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Resume & Skills"
        description="Upload resumes, analyze their contents, and manage the skills in your student profile."
      />

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{notice}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <ResumeUploader file={selectedFile} onFileChange={setSelectedFile} />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? <LoaderCircle className="animate-spin" size={17} /> : <Upload size={17} />}
            {isUploading ? "Uploading..." : "Upload resume"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Your resumes</h2>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No resumes uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <article key={resume._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="shrink-0 text-teal-700" size={22} />
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-slate-800">{resume.fileName}</h3>
                    <p className="text-xs text-slate-500">
                      {(resume.fileType || "").toUpperCase()} · {Math.ceil((resume.fileSize || 0) / 1024)} KB · {resume.parsingStatus || "pending"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busyAction !== ""} onClick={() => handleDownload(resume)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    <Download size={15} /> Download
                  </button>
                  <button type="button" disabled={busyAction !== ""} onClick={() => handleParse(resume)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    <ScanText size={15} /> Parse
                  </button>
                  <button type="button" disabled={busyAction !== ""} onClick={() => handleAnalyze(resume)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    <Sparkles size={15} /> Analyze
                  </button>
                  <button type="button" disabled={busyAction !== ""} onClick={() => handleExtractSkills(resume)} className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800 hover:bg-teal-100 disabled:opacity-50">
                    Extract skills
                  </button>
                  <button type="button" disabled={busyAction !== ""} onClick={() => handleDeleteResume(resume)} aria-label={`Delete ${resume.fileName}`} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">
                    {busyAction === `delete-${resume._id}` ? <LoaderCircle className="animate-spin" size={15} /> : <Trash2 size={15} />}
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {parseResult && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800">Extracted resume text</h2>
          <p className="mb-3 text-xs text-slate-500">{parseResult.charCount} characters from {parseResult.fileName}</p>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{parseResult.extractedText}</pre>
        </section>
      )}

      {analysis?.parsedData && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Resume analysis: {analysis.fileName}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {["technicalSkills", "programmingLanguages", "frameworks", "databases", "softSkills", "certifications", "education", "workExperience", "projects"].map((section) => (
              <div key={section}>
                <h3 className="mb-2 text-sm font-semibold capitalize text-slate-700">{section.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                  {(analysis.parsedData[section] || []).map((item, index) => (
                    <li key={`${section}-${index}`}>{typeof item === "string" ? item : item.name || item.title || item.degree || JSON.stringify(item)}</li>
                  ))}
                  {!analysis.parsedData[section]?.length && <li className="list-none text-slate-400">No extracted items</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {extraction && (
        <section className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-teal-900">AI-extracted skills</h2>
              <p className="text-sm text-teal-800">Review the extracted skills, then add the ones you want using the skill form below.</p>
            </div>
            <button type="button" disabled={busyAction !== "" || !(extraction.technicalSkills?.length || extraction.softSkills?.length)} onClick={handleClassify} className="rounded-lg border border-teal-300 px-3 py-2 text-sm font-medium text-teal-800 disabled:opacity-50">
              {busyAction === "classify" ? "Classifying..." : "Classify extracted skills"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...new Set([
              ...(extraction.technicalSkills || []),
              ...(extraction.programmingLanguages || []),
              ...(extraction.frameworks || []),
              ...(extraction.databases || []),
              ...(extraction.softSkills || []),
            ])].map((skill) => (
              <span key={skill} className="rounded-full bg-white px-3 py-1 text-sm text-teal-800">{skill}</span>
            ))}
            {!extraction.technicalSkills?.length && !extraction.softSkills?.length && <p className="text-sm text-slate-600">No skills were extracted.</p>}
          </div>
          {classification.length > 0 && (
            <ul className="mt-4 space-y-2">
              {classification.map((item) => (
                <li key={item.name} className="rounded-lg bg-white p-3 text-sm text-slate-700">
                  <strong>{item.name}</strong> · {item.category} · {item.demandLevel} demand
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Your skills</h2>
          <p className="text-sm text-slate-500">Manage the student skills used by career recommendations and skill-gap analysis.</p>
        </div>
        <form onSubmit={handleAddSkill} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-5">
          <input required value={newSkill} onChange={(event) => setNewSkill(event.target.value)} placeholder="Skill name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={newSkillIsSoft ? "soft" : "technical"} onChange={(event) => setNewSkillIsSoft(event.target.value === "soft")} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="technical">Technical skill</option>
            <option value="soft">Soft skill</option>
          </select>
          {!newSkillIsSoft && (
            <>
              <select value={newSkillCategory} onChange={(event) => setNewSkillCategory(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {["Technical", "Programming Language", "Framework/Library", "Database", "Cloud & DevOps", "Tool", "Core CS", "Other"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={newSkillProficiency} onChange={(event) => setNewSkillProficiency(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </>
          )}
          <button type="submit" disabled={busyAction !== ""} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
            <Plus size={16} /> Add skill
          </button>
        </form>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Technical skills</h3>
            <div className="space-y-2">
              {(skills.technicalSkills || []).map((skill) => (
                <div key={skill._id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-3">
                  {editingSkillId === skill._id ? (
                    <>
                      <input value={editingSkillName} onChange={(event) => setEditingSkillName(event.target.value)} className="min-w-0 flex-1 rounded border px-2 py-1 text-sm" aria-label="Edit skill name" />
                      <button type="button" onClick={() => handleSaveSkillName(skill._id)} className="text-xs font-semibold text-teal-700">Save</button>
                      <button type="button" onClick={() => setEditingSkillId("")} className="text-xs text-slate-500">Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="min-w-0 flex-1 font-medium text-slate-800">{skill.name}</span>
                      <span className="text-xs text-slate-500">{skill.category}</span>
                      <select value={skill.proficiency} onChange={(event) => handleChangeProficiency(skill, event.target.value)} className="rounded border border-slate-200 px-2 py-1 text-xs" aria-label={`Proficiency for ${skill.name}`}>
                        {["Beginner", "Intermediate", "Advanced", "Expert"].map((item) => <option key={item}>{item}</option>)}
                      </select>
                      <button type="button" onClick={() => { setEditingSkillId(skill._id); setEditingSkillName(skill.name); }} aria-label={`Edit ${skill.name}`} className="rounded p-1 text-slate-500 hover:bg-slate-100"><Pencil size={15} /></button>
                      <button type="button" onClick={() => handleDeleteSkill(skill._id)} aria-label={`Delete ${skill.name}`} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                    </>
                  )}
                </div>
              ))}
              {skills.technicalSkills?.length === 0 && <p className="text-sm text-slate-500">No technical skills added.</p>}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Soft skills</h3>
            <div className="flex flex-wrap gap-2">
              {(skills.softSkills || []).map((skill) => (
                <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-sm text-teal-800">
                  {skill}
                  <button type="button" onClick={() => handleDeleteSkill(skill)} aria-label={`Delete ${skill}`} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
                </span>
              ))}
              {skills.softSkills?.length === 0 && <p className="text-sm text-slate-500">No soft skills added.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResumeSkills;
