import { Clock, CheckCircle2, BookOpen, UserRound } from "lucide-react";

function RecentActivities() {

  const activities = [
    {
      id: 1,
      title: "Profile information updated",
      description: "You updated your personal details.",
      time: "2 hours ago",
      icon: UserRound,
    },
    {
      id: 2,
      title: "Learning roadmap started",
      description: "You started your frontend learning journey.",
      time: "Yesterday",
      icon: BookOpen,
    },
    {
      id: 3,
      title: "Career recommendations viewed",
      description: "You explored three career options.",
      time: "2 days ago",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="text-lg font-bold text-slate-900">
        Recent Activities
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Your latest activities on Disha.
      </p>

      <div className="mt-6 space-y-6">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.id} className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="text-sm font-semibold text-slate-800">
                  {activity.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {activity.description}
                </p>

                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  {activity.time}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default RecentActivities;