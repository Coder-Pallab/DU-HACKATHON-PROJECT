import { useState } from "react";
import { UserRound, Save } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function AccountSettings({ initialValues, onSave }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "Aditya Sharma",
    email: "student@example.com",
    phone: "",
    college: "",
    course: "BCA",
    ...initialValues,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.(formData);
    setMessage(t("Account information updated successfully!"));
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <UserRound size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Account Settings")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("Manage your personal account information.")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("Full Name")}
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t("Enter your full name")}
              className={inputClass}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("Email Address")}
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("Enter your email")}
              className={inputClass}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("Phone Number")}
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("Enter your phone number")}
              className={inputClass}
            />
          </div>

          {/* College */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("College / Institution")}
            </label>

            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder={t("Enter your college name")}
              className={inputClass}
            />
          </div>

          {/* Course */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("Current Course")}
            </label>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">{t("Select your course")}</option>
              <option value="BCA">BCA</option>
              <option value="BSc Computer Science">
                BSc Computer Science
              </option>
              <option value="BTech">BTech</option>
              <option value="BA">BA</option>
              <option value="BCom">BCom</option>
              <option value="MCA">MCA</option>
              <option value="Other">{t("Other")}</option>
            </select>
          </div>

        </div>

        {/* Success Message */}
        {message && (
          <p
            role="status"
            className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        {/* Save Button */}
        <div className="flex justify-end border-t border-gray-100 pt-5">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            <Save size={17} />
            {t("Save Changes")}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AccountSettings;
