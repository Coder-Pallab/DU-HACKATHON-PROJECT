import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  UserRound,
  MapPin,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    state: "Assam",
    district: "",
    educationLevel: "",
    institution: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "gender",
      "district",
      "educationLevel",
      "institution",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !formData[field].trim()
    );

    if (hasEmptyField) {
      setError("Please complete all required fields.");
      return;
    }

    // Temporary frontend data handling.
    console.log("Profile information:", formData);

    navigate("/onboarding/resume-upload");
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-12">

      <div className="mx-auto max-w-4xl">

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
            Step 1 of 3
          </span>

        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
            <span className="text-teal-700">Profile Setup</span>
            <span>33% completed</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/3 rounded-full bg-teal-600" />
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <UserRound size={24} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Let's Set Up Your Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Tell us a little about yourself so Disha can provide
              relevant career guidance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Personal Information */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <UserRound size={19} className="text-teal-700" />
                <h2 className="font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="mb-2 block text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>

                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                    Gender *
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </div>

              </div>
            </section>

            {/* Location */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <MapPin size={19} className="text-teal-700" />
                <h2 className="font-semibold text-gray-800">
                  Location Details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-700">
                    State *
                  </label>

                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="Assam">Assam</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="district" className="mb-2 block text-sm font-medium text-gray-700">
                    District *
                  </label>

                  <input
                    id="district"
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter your district"
                    className={inputClass}
                    required
                  />
                </div>

              </div>
            </section>

            {/* Education */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <BookOpen size={19} className="text-teal-700" />
                <h2 className="font-semibold text-gray-800">
                  Education Details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label htmlFor="educationLevel" className="mb-2 block text-sm font-medium text-gray-700">
                    Current Education Level *
                  </label>

                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Education</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="institution" className="mb-2 block text-sm font-medium text-gray-700">
                    School / College Name *
                  </label>

                  <input
                    id="institution"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Enter institution name"
                    className={inputClass}
                    required
                  />
                </div>

              </div>
            </section>

            {/* Error */}
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">

              <Link
                to="/"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <ArrowLeft size={17} />
                Back
              </Link>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Continue
                <ArrowRight size={17} />
              </button>

            </div>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your information is used to personalise your career guidance experience.
        </p>

      </div>
    </div>
  );
}

export default ProfileSetup;