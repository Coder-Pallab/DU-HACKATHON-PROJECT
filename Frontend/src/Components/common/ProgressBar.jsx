import { useLanguage } from "../../hooks/useLanguage";

function ProgressBar({
  value = 0,
  color = "bg-teal-600",
  showLabel = true,
  label,
  className = ""
}) {
  const { t } = useLanguage();
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {t(label || "Progress", label || "Progress")}
          </span>

          {showLabel && (
            <span className="text-sm font-semibold text-teal-700">
              {progress}%
            </span>
          )}
        </div>
      )}

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
