import { useState } from "react";
import { GraduationCap } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useLanguage } from "../../hooks/useLanguage";

function EducationDetails() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    educationLevel: "",
    institution: "",
    course: "",
    specialization: "",
    graduationYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Education Details:", formData);
    alert(t("Education details saved successfully!"));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <GraduationCap size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Education Details")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Tell us about your academic background.")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Education Level */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="educationLevel"
              className="text-sm font-medium text-slate-700"
            >
              {t("Education Level")}
            </label>

            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">{t("Select education level")}</option>
              <option value="10th">{t("10th Standard")}</option>
              <option value="12th">{t("12th Standard")}</option>
              <option value="diploma">{t("Diploma")}</option>
              <option value="undergraduate">{t("Undergraduate")}</option>
              <option value="postgraduate">{t("Postgraduate")}</option>
              <option value="other">{t("Other")}</option>
            </select>
          </div>

          <Input
            label="Institution Name"
            name="institution"
            placeholder="Enter school or college name"
            value={formData.institution}
            onChange={handleChange}
            required
          />

          <Input
            label="Course / Degree"
            name="course"
            placeholder="e.g. BCA, B.Tech, B.Sc"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <Input
            label="Specialization"
            name="specialization"
            placeholder="e.g. Computer Science"
            value={formData.specialization}
            onChange={handleChange}
          />

          <Input
            label="Graduation Year"
            name="graduationYear"
            type="number"
            placeholder="e.g. 2027"
            value={formData.graduationYear}
            onChange={handleChange}
          />

        </div>

        {/* Submit Button */}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <Button type="submit">
            {t("Save Education")}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default EducationDetails;
