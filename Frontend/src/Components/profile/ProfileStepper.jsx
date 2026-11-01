import {
  UserRound,
  GraduationCap,
  Languages,
  BriefcaseBusiness,
  Check,
} from "lucide-react";

function ProfileStepper({ currentStep = 1 }) {
  const steps = [
    {
      id: 1,
      title: "Personal Details",
      icon: UserRound,
    },
    {
      id: 2,
      title: "Education",
      icon: GraduationCap,
    },
    {
      id: 3,
      title: "Language",
      icon: Languages,
    },
    {
      id: 4,
      title: "Career Interests",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-semibold text-slate-800">
        Profile Setup Progress
      </h2>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative flex flex-1 items-center gap-3 sm:flex-col sm:gap-3"
            >
              {/* Step Icon */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  isCompleted
                    ? "border-teal-600 bg-teal-600 text-white"
                    : isActive
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              {/* Step Title */}
              <div className="sm:text-center">
                <p
                  className={`text-sm font-semibold ${
                    isActive || isCompleted
                      ? "text-teal-700"
                      : "text-slate-400"
                  }`}
                >
                  Step {step.id}
                </p>

                <p className="text-sm text-slate-600">
                  {step.title}
                </p>
              </div>

              {/* Connector */}
              {index !== steps.length - 1 && (
                <div
                  className={`hidden h-0.5 flex-1 sm:block ${
                    isCompleted ? "bg-teal-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-7">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-600">
            Overall Progress
          </span>

          <span className="font-semibold text-teal-700">
            {Math.round(((currentStep - 1) / steps.length) * 100)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

    </div>
  );
}

export default ProfileStepper;