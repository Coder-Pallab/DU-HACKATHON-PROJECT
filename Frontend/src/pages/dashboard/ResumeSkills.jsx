import { useEffect, useState } from "react";

import PageHeader from "../../Components/layout/PageHeader";

import ResumeUploader from "../../Components/resume/ResumeUploader";
import ResumePreview from "../../Components/resume/ResumePreview";
import ResumeScore from "../../Components/resume/ResumeScore";
import SkillsList from "../../Components/resume/SkillsList";
import ResumeSuggestions from "../../Components/resume/ResumeSuggestions";

function ResumeSkills() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

  const handleFileChange = (file) => {
    setResumeFile(file);
    setResumeUrl(file ? URL.createObjectURL(file) : "");
  };

  useEffect(() => {
    if (!resumeUrl) return;

    return () => URL.revokeObjectURL(resumeUrl);
  }, [resumeUrl]);

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Page Header */}
      <PageHeader
        title="Resume & Skills"
        description="Manage your resume, explore your skills and discover ways to improve your career profile."
      />

      {/* Upload and Score */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">

        <div className="min-w-0 space-y-6">
          <ResumeUploader
            file={resumeFile}
            onFileChange={handleFileChange}
          />

          <ResumePreview file={resumeFile} fileUrl={resumeUrl} />
        </div>

        <div className="min-w-0">
          <ResumeScore score={78} />
        </div>

      </div>

      {/* Skills */}
      <SkillsList />

      {/* Suggestions */}
      <ResumeSuggestions />

    </div>
  );
}

export default ResumeSkills;
