import { useRef, useState } from "react";
import { Upload, X, FileCheck2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function ResumeUploader({ file, onFileChange }) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedExtensions = /\.(pdf|docx)$/i;

    if (!allowedExtensions.test(selectedFile.name)) {
      setError(t("Please select a PDF or DOCX file."));
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(t("File size must be less than 10 MB."));
      event.target.value = "";
      return;
    }

    setError("");
    onFileChange(selectedFile);
  };

  const removeFile = () => {
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setError("");
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Upload size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Upload Your Resume")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Upload your resume to get started.")}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center transition hover:border-teal-500 hover:bg-teal-50"
        >
          <Upload size={32} className="mb-3 text-teal-600" />

          <span className="font-semibold text-slate-700">
            {t("Click to upload your resume")}
          </span>

          <span className="mt-2 text-xs text-slate-500">
            {t("PDF or DOCX · Maximum 10 MB")}
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileCheck2 size={25} className="shrink-0 text-teal-700" />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {file.name}
              </p>

              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-teal-100 hover:text-slate-700"
            aria-label={t("Remove file")}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

    </section>
  );
}

export default ResumeUploader;
