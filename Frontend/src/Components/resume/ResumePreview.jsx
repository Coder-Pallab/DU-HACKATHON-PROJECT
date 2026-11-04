import { useState } from "react";
import { FileText, Eye, Download, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function ResumePreview({ file, fileUrl }) {
  const { t } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);

  if (!file) {
    return (
      <section className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <FileText size={35} className="mb-3 text-slate-400" />

        <h3 className="font-semibold text-slate-700">
          {t("No Resume Selected")}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {t("Upload a resume to preview it here.")}
        </p>
      </section>
    );
  }

  const isPDF = file.name.toLowerCase().endsWith(".pdf");

  return (
    <>
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <FileText size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {t("Resume Preview")}
            </h2>

            <p className="text-sm text-slate-500">
              {t("View or download your selected resume.")}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="break-all text-sm font-medium text-slate-700">
            {file.name}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {isPDF && (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
              >
                <Eye size={16} />
                {t("Preview")}
              </button>
            )}

            {fileUrl && (
              <a
                href={fileUrl}
                download={file.name}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download size={16} />
                {t("Download")}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* PDF Modal Preview */}
      {showPreview && isPDF && fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="truncate font-semibold text-slate-800">
                {file.name}
              </h3>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label={t("Close")}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-2">
              <iframe
                src={fileUrl}
                title={file.name}
                className="h-full w-full rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResumePreview;
