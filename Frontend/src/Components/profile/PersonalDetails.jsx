import { useState } from "react";
import { UserRound } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useLanguage } from "../../hooks/useLanguage";

function PersonalDetails() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
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

    console.log("Personal Details:", formData);
    alert(t("Personal details saved successfully!"));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <UserRound size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {t("Personal Details")}
          </h2>

          <p className="text-sm text-slate-500">
            {t("Tell us a little about yourself.")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <Input
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <Input
            label="Location"
            name="location"
            placeholder="e.g. Sivasagar, Assam"
            value={formData.location}
            onChange={handleChange}
          />

        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <Button type="submit">
            {t("Save Details")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
