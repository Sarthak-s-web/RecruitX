import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import PublicRoute from "./components/PublicRoute";
import { ROLES } from "./utils/constants";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import JobApplications from "./pages/JobApplications";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Authenticated routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Job seeker routes */}
            <Route
              path="/my-applications"
              element={
                <RoleRoute roles={[ROLES.JOB_SEEKER]}>
                  <MyApplications />
                </RoleRoute>
              }
            />
            <Route
              path="/jobs/:id/apply"
              element={
                <RoleRoute roles={[ROLES.JOB_SEEKER]}>
                  <ApplyJob />
                </RoleRoute>
              }
            />

            {/* Recruiter routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <RoleRoute roles={[ROLES.RECRUITER]}>
                  <RecruiterDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <RoleRoute roles={[ROLES.RECRUITER]}>
                  <RecruiterJobs />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs/create"
              element={
                <RoleRoute roles={[ROLES.RECRUITER]}>
                  <CreateJob />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/edit"
              element={
                <RoleRoute roles={[ROLES.RECRUITER]}>
                  <EditJob />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:jobId/applications"
              element={
                <RoleRoute roles={[ROLES.RECRUITER]}>
                  <JobApplications />
                </RoleRoute>
              }
            />

            {/* Fallback */}
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
