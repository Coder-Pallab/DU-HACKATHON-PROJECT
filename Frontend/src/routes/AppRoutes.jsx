import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../Components/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import MyProfile from "../pages/dashboard/MyProfile";
import DashboardSection from "../pages/dashboard/DashboardSection";
import CareerMatches from "../pages/dashboard/CareerMatches";
import ResumeSkills from "../pages/dashboard/ResumeSkills";
import LearningRoadmap from "../pages/dashboard/LearningRoadmap";
import PlacementReadiness from "../pages/dashboard/Placementreadiness";
import AICounsellor from "../pages/dashboard/AICounsellor";
import JobsInternships from "../pages/dashboard/JobsInternships";
import Settings from "../pages/dashboard/Settings";
import HelpSupport from "../pages/dashboard/HelpSupport";
import Notifications from "../pages/dashboard/Notifications";
import SavedItems from "../pages/dashboard/SavedItems";
import ProfileSetup from "../pages/onbording/ProfileSetup";
import ResumeUpload from "../pages/onbording/ResumeUpload";
import CareerRecommendations from "../pages/onbording/CareerRecommendations";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/onboarding/profile" element={<ProfileSetup />} />
            <Route path="/onboarding/resume-upload" element={<ResumeUpload />} />
            <Route path="/onboarding/career-recommendations" element={<CareerRecommendations />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="resume" element={<ResumeSkills />} />
                <Route path="careers" element={<CareerMatches />} />
                <Route path="roadmap" element={<LearningRoadmap />} />
                <Route path="counsellor" element={<AICounsellor />} />
                <Route path="placement" element={<PlacementReadiness />} />
                <Route path="jobs" element={<JobsInternships />} />
                <Route path="jobs-internships" element={<JobsInternships />} />
                <Route path="saved" element={<SavedItems />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<HelpSupport />} />
                <Route path="*" element={<DashboardSection title="Page not found" />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default AppRoutes;
