import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  FileUp,
} from "lucide-react";

function ResumeUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const hasValidExtension = allowedExtensions.some((extension) =>
      file.name.toLowerCase().endsWith(extension)
    );

    if (!allowedTypes.includes(file.type) || !hasValidExtension) {
      setError("Please upload a PDF, DOC or DOCX file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5 MB.");
      return;
    }

    setResume(file);
    setError("");
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);

    // Allows selecting the same file again.
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeResume = () => {
    setResume(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinue = () => {
    if (!resume) {
      setError("Please upload your resume or skip this step.");
      return;
    }

    // Frontend demonstration only.
    console.log("Selected resume:", resume);

    navigate("/onboarding/career-recommendations");
  };

  const handleSkip = () => {
    navigate("/onboarding/career-recommendations");
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
              <GraduationCap size={23} />
            </div>

            <span className="text-2xl font-bold text-teal-800">
              Disha.
            </span>
          </Link>

          <span className="text-sm font-medium text-gray-500">
            Step 2 of 3
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
            <span className="text-teal-700">Resume Upload</span>
            <span>66% completed</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-2/3 rounded-full bg-teal-600" />
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FileUp size={25} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Upload Your Resume
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload your existing resume so you can explore your
              skills and discover career opportunities that match
              your profile.
            </p>
          </div>

          {/* Upload Area */}
          {!resume ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-12 ${
                isDragging
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-300 bg-gray-50 hover:border-teal-500 hover:bg-teal-50/50"
              }`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <UploadCloud size={32} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-800">
                Drag and drop your resume here
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                or click below to browse files
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Choose File
              </button>

              <p className="mt-5 text-xs text-gray-400">
                Supported formats: PDF, DOC, DOCX
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Maximum file size: 5 MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Selected File */
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <FileText size={25} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-all font-semibold text-gray-800">
                      {resume.name}
                    </h3>

                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-green-600"
                    />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatFileSize(resume.size)}
                  </p>

                  <p className="mt-2 text-xs font-medium text-green-700">
                    File selected successfully
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeResume}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove resume"
                >
                  <X size={20} />
                </button>

              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                Replace File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="hidden"
              />

            </div>
          )}

          {/* Error */}
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Information */}
          <div className="mt-7 rounded-xl bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-800">
              Why upload your resume?
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>• Understand your existing skills.</li>
              <li>• Identify potential career opportunities.</li>
              <li>• Discover areas where you can improve.</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/onboarding/profile")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleSkip}
                className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                Skip for Now
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Continue
                <ArrowRight size={17} />
              </button>

            </div>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your resume stays in this browser session. Actual resume
          processing will be implemented during backend integration.
        </p>

      </div>
    </div>
  );
}

export default ResumeUpload;