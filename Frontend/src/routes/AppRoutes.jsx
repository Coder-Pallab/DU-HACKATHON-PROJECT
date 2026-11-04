import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import DashboardLayout from "../Components/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import MyProfile from "../pages/dashboard/MyProfile";
import DashboardSection from "../pages/dashboard/DashboardSection";
import CareerMatches from "../pages/dashboard/CareerMatches";
import ResumeSkills from "../pages/dashboard/ResumeSkills";
import ResumeIntelligence from "../pages/dashboard/ResumeIntelligence";
import LearningRoadmap from "../pages/dashboard/LearningRoadmap";
import PlacementReadiness from "../pages/dashboard/Placementreadiness";
import AICounsellor from "../pages/dashboard/AICounsellor";
import Settings from "../pages/dashboard/Settings";
import HelpSupport from "../pages/dashboard/HelpSupport";
import FeatureUnavailable from "../pages/dashboard/FeatureUnavailable";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
                Loading...
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding/profile" element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="/onboarding/resume-upload" element={<Navigate to="/dashboard/resume" replace />} />
            <Route path="/onboarding/career-recommendations" element={<Navigate to="/dashboard/careers" replace />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="resume" element={<ResumeSkills />} />
                <Route path="resume-intelligence" element={<ResumeIntelligence />} />
                <Route path="careers" element={<CareerMatches />} />
                <Route path="roadmap" element={<LearningRoadmap />} />
                <Route path="counsellor" element={<AICounsellor />} />
                <Route path="placement" element={<PlacementReadiness />} />
                <Route path="jobs" element={<FeatureUnavailable title="Jobs & Internships" />} />
                <Route path="jobs-internships" element={<FeatureUnavailable title="Jobs & Internships" />} />
                <Route path="saved" element={<FeatureUnavailable title="Saved Items" />} />
                <Route path="notifications" element={<FeatureUnavailable title="Notifications" />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<HelpSupport />} />
                <Route path="*" element={<DashboardSection title="Page not found" />} />
            </Route>

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
}

export default AppRoutes;
