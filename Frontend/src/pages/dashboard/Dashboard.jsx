import { useEffect, useState } from "react";
import WelcomeCard from "../../Components/dashboard/WelcomeCard";
import ProfileStrength from "../../Components/dashboard/ProfileStrength";
import CareerOverview from "../../Components/dashboard/CareerOverview";
import QuickActions from "../../Components/dashboard/QuickActions";
import { studentService } from "../../services/studentService";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([studentService.getProfile(), aiService.getRecommendations()])
      .then(([studentProfile, careerData]) => {
        if (!active) return;
        setProfile(studentProfile);
        setRecommendations(careerData.recommendations || []);
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-7 sm:space-y-8">
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {isLoading && <p className="text-sm text-slate-500">Loading your dashboard...</p>}
      <WelcomeCard name={profile?.fullName || profile?.user?.name || "there"} />

      <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <ProfileStrength profile={profile} />
        <QuickActions />
      </section>

      <CareerOverview recommendations={recommendations} />
    </div>
  );
}

export default Dashboard;
