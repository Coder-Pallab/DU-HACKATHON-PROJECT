import PageHeader from "../../Components/layout/PageHeader";

import ProfileStepper from "../../Components/profile/ProfileStepper";
import PersonalDetails from "../../Components/profile/PersonalDetails";
import EducationDetails from "../../Components/profile/EducationDetails";
import LanguageSelector from "../../Components/profile/LanguageSelector";
import CareerInterests from "../../Components/profile/CareerInterests";

function MyProfile() {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <PageHeader
        title="My Profile"
        description="Manage your personal information, education and career preferences."
      />

      {/* Profile Progress */}
      <ProfileStepper currentStep={1} />

      {/* Personal Information */}
      <PersonalDetails />

      {/* Education Information */}
      <EducationDetails />

      {/* Language Preference */}
      <LanguageSelector />

      {/* Career Interests */}
      <CareerInterests />

    </div>
  );
}

export default MyProfile;