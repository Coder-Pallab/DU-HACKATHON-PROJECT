import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Code,
  Database,
  Palette,
  ShieldCheck,
  BriefcaseBusiness,
  BrainCircuit,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const careerOptions = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Technology",
    description: "Build modern and interactive websites and web applications.",
    icon: Code,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    title: "Backend Developer",
    category: "Technology",
    description: "Develop server-side applications, APIs and databases.",
    icon: Database,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 3,
    title: "Data Scientist",
    category: "Data & AI",
    description: "Analyse data and build intelligent machine learning models.",
    icon: BrainCircuit,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    category: "Design",
    description: "Design useful, attractive and user-friendly digital experiences.",
    icon: Palette,
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: 5,
    title: "Cybersecurity Analyst",
    category: "Technology",
    description: "Protect systems, networks and digital information.",
    icon: ShieldCheck,
    color: "bg-green-50 text-green-600",
  },
  {
    id: 6,
    title: "Business Analyst",
    category: "Business",
    description: "Use data and business insights to improve decision-making.",
    icon: BriefcaseBusiness,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: 7,
    title: "Digital Marketer",
    category: "Marketing",
    description: "Promote products and services through digital platforms.",
    icon: TrendingUp,
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    id: 8,
    title: "Software Engineer",
    category: "Technology",
    description: "Design, develop and maintain software applications.",
    icon: Code,
    color: "bg-teal-50 text-teal-700",
  },
];

function CareerRecommendations() {
  const navigate = useNavigate();

  const [selectedCareers, setSelectedCareers] = useState([]);
  const [error, setError] = useState("");

  const toggleCareer = (careerId) => {
    setSelectedCareers((previous) => {
      if (previous.includes(careerId)) {
        return previous.filter((id) => id !== careerId);
      }

      return [...previous, careerId];
    });

    setError("");
  };

  const handleContinue = () => {
    if (selectedCareers.length === 0) {
      setError("Please select at least one career interest.");
      return;
    }

    const selectedCareerDetails = careerOptions.filter((career) =>
      selectedCareers.includes(career.id)
    );

    // Temporary frontend data handling.
    console.log("Selected career interests:", selectedCareerDetails);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
              <GraduationCap size={23} />
            </div>

            <span className="text-2xl font-bold text-teal-800">
              Disha.
            </span>
          </Link>

          <span className="text-sm font-medium text-gray-500">
            Step 3 of 3
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
            <span className="text-teal-700">Career Interests</span>
            <span>100% completed</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-full rounded-full bg-teal-600" />
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Sparkles size={25} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Discover Your Career Interests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Select the careers that interest you. You can choose
              multiple options to explore different career paths.
            </p>
          </div>

          {/* Selection Counter */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50 p-4">

            <div>
              <p className="text-sm font-semibold text-teal-900">
                Your Career Interests
              </p>

              <p className="mt-1 text-xs text-teal-700">
                Choose at least one career path.
              </p>
            </div>

            <span className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
              {selectedCareers.length} Selected
            </span>

          </div>

          {/* Career Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {careerOptions.map((career) => {
              const Icon = career.icon;
              const isSelected = selectedCareers.includes(career.id);

              return (
                <button
                  key={career.id}
                  type="button"
                  onClick={() => toggleCareer(career.id)}
                  aria-pressed={isSelected}
                  className={`relative rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                    isSelected
                      ? "border-teal-600 bg-teal-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-teal-300"
                  }`}
                >

                  {/* Selected Icon */}
                  {isSelected && (
                    <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-white">
                      <Check size={15} />
                    </div>
                  )}

                  {/* Career Icon */}
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${career.color}`}>
                    <Icon size={24} />
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {career.category}
                  </span>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    {career.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {career.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      isSelected ? "text-teal-700" : "text-gray-400"
                    }`}>
                      {isSelected ? "Selected" : "Select Career"}
                    </span>

                    <div className={`h-5 w-5 rounded-md border ${
                      isSelected
                        ? "border-teal-700 bg-teal-700"
                        : "border-gray-300"
                    }`}>
                      {isSelected && (
                        <Check size={17} className="text-white" />
                      )}
                    </div>
                  </div>

                </button>
              );
            })}

          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/onboarding/resume-upload")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Complete Setup
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          You can update your career interests later from your profile.
        </p>

      </div>
    </div>
  );
}

export default CareerRecommendations;