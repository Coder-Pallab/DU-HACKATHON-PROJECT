import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import ProtectedRoute from "./ProtectedRoute";

const DashboardLayout = lazy(() => import("../Components/layout/DashboardLayout"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const MyProfile = lazy(() => import("../pages/dashboard/MyProfile"));
const DashboardSection = lazy(() => import("../pages/dashboard/DashboardSection"));
const CareerMatches = lazy(() => import("../pages/dashboard/CareerMatches"));
const ResumeSkills = lazy(() => import("../pages/dashboard/ResumeSkills"));
const ResumeIntelligence = lazy(() => import("../pages/dashboard/ResumeIntelligence"));
const LearningRoadmap = lazy(() => import("../pages/dashboard/LearningRoadmap"));
const PlacementReadiness = lazy(() => import("../pages/dashboard/Placementreadiness"));
const AICounsellor = lazy(() => import("../pages/dashboard/AICounsellor"));
const Settings = lazy(() => import("../pages/dashboard/Settings"));
const HelpSupport = lazy(() => import("../pages/dashboard/HelpSupport"));
const FeatureUnavailable = lazy(() => import("../pages/dashboard/FeatureUnavailable"));
const Login = lazy(() => import("../pages/public/Login"));
const Signup = lazy(() => import("../pages/public/Signup"));
const ForgotPassword = lazy(() => import("../pages/public/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/public/ResetPassword"));
const LandingPage = lazy(() => import("../pages/public/LandingPage"));

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
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
                Loading page...
            </div>
        }>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
            <Route path="/signup" element={<Navigate to="/register" replace />} />
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

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        </Suspense>
    );
}

export default AppRoutes;
