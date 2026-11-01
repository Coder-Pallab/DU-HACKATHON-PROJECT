function PageHeader({
  title,
  description,
  action,
  breadcrumb,
}) {
  return (
    <div className="mb-8 flex min-w-0 flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center">

      <div className="min-w-0">

        {breadcrumb && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
            {breadcrumb}
          </p>
        )}

        <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            {description}
          </p>
        )}

      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}

    </div>
  );
}

export default PageHeader;
