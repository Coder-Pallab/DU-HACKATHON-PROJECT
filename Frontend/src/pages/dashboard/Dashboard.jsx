import WelcomeCard from "../../Components/dashboard/WelcomeCard";
import ProfileStrength from "../../Components/dashboard/ProfileStrength";
import CareerOverview from "../../Components/dashboard/CareerOverview";
import RecentActivities from "../../Components/dashboard/RecentActivities";
import QuickActions from "../../Components/dashboard/QuickActions";

function Dashboard() {
  return (
    <div className="animate-fade-in space-y-7 sm:space-y-8">

      {/* Welcome Section */}
      <WelcomeCard name="Student" />

      {/* Profile and Actions */}
      <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <ProfileStrength percentage={70} />
        <QuickActions />
      </section>

      {/* Career Recommendations */}
      <CareerOverview />

      {/* Recent Activities */}
      <RecentActivities />

    </div>
  );
}

export default Dashboard;
