import { useRef, useState } from "react";
import { Upload, X, FileCheck2 } from "lucide-react";

function ResumeUploader({ file, onFileChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedExtensions = /\.(pdf|doc|docx)$/i;

    if (!allowedExtensions.test(selectedFile.name)) {
      setError("Please select a PDF, DOC or DOCX file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
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
            Upload Your Resume
          </h2>

          <p className="text-sm text-slate-500">
            Upload your resume to get started.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
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
            Click to upload your resume
          </span>

          <span className="mt-2 text-xs text-slate-500">
            PDF, DOC or DOCX · Maximum 5 MB
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
            aria-label="Remove resume"
            className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default ResumeUploader;
