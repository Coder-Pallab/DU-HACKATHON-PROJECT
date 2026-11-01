function DashboardSection({ title }) {
  return (
    <section className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          This section is not available yet.
        </p>
      </div>

      <div className="ui-card p-6 sm:p-8">
        <p className="text-slate-600">{title} content will appear here.</p>
      </div>
    </section>
  );
}

export default DashboardSection;
