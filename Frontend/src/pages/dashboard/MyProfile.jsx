import { useEffect, useState } from "react";
import PageHeader from "../../Components/layout/PageHeader";

import ProfileStepper from "../../Components/profile/ProfileStepper";
import PersonalDetails from "../../Components/profile/PersonalDetails";
import EducationDetails from "../../Components/profile/EducationDetails";
import LanguageSelector from "../../Components/profile/LanguageSelector";
import CareerInterests from "../../Components/profile/CareerInterests";
import { studentService } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/apiClient";
import { useLanguage } from "../../hooks/useLanguage";

function MyProfile() {
  const { setLanguage } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    studentService.getProfile()
      .then((result) => {
        if (!active) return;
        setProfile(result);
        if (result.preferredLanguage) {
          setLanguage(result.preferredLanguage === "Assamese" ? "as" : "en");
        }
      })
      .catch((error) => {
        if (active) setLoadError(getApiErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setLanguage]);

  const updateProfile = (updatedProfile) => setProfile(updatedProfile);
  const changeField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  if (isLoading) {
    return <p className="rounded-xl bg-white p-6 text-sm text-slate-600">Loading your profile...</p>;
  }

  if (loadError || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700" role="alert">
        {loadError || "Your student profile could not be loaded."}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <PageHeader
        title="My Profile"
        description="Manage your personal information, education and career preferences."
      />

      {/* Profile Progress */}
      <ProfileStepper profile={profile} />

      {/* Personal Information */}
      <PersonalDetails profile={profile} onChange={changeField} onSaved={updateProfile} />

      {/* Education Information */}
      <EducationDetails profile={profile} onChange={changeField} onSaved={updateProfile} />

      {/* Language Preference */}
      <LanguageSelector profile={profile} onSaved={updateProfile} />

      {/* Career Interests */}
      <CareerInterests profile={profile} onSaved={updateProfile} />

    </div>
  );
}

export default MyProfile;