import { AlertCircle } from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";

function FeatureUnavailable({ title }) {
  return (
    <div className="space-y-5">
      <PageHeader title={title} description="This feature cannot display live data yet." />
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
        <p className="text-sm leading-6">
          The current backend does not provide an API for this feature. No sample records are shown, and no new endpoint has been assumed.
        </p>
      </div>
    </div>
  );
}

export default FeatureUnavailable;
