import { useLanguage } from "../../hooks/useLanguage";

function PageHeader({
  title,
  description,
  action,
  breadcrumb,
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex min-w-0 flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center">

      <div className="min-w-0">

        {breadcrumb && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
            {t(breadcrumb, breadcrumb)}
          </p>
        )}

        <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
          {t(title, title)}
        </h1>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            {t(description, description)}
          </p>
        )}

      </div>

      {action && (
        <div className="w-full min-w-0 sm:w-auto sm:shrink-0">
          {action}
        </div>
      )}

    </div>
  );
}

export default PageHeader;
