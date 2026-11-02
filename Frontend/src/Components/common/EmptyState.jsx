import { useLanguage } from "../../hooks/useLanguage";

function EmptyState({
  title = "Nothing here yet",
  description = "Your content will appear here.",
  action
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-3xl">
        📂
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {t(title, title)}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {t(description, description)}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}

    </div>
  );
}

export default EmptyState;
