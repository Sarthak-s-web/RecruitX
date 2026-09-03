import { useState, useEffect } from "react";
import { User, Mail, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/constants";

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfile(user);
        setLoading(false);
        return;
      }
      try {
        const data = await checkAuth();
        setProfile(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, checkAuth]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-500">Unable to load profile.</p>
      </div>
    );
  }

  const roleLabel = profile.role === "RECRUITER" ? "Recruiter" : "Job Seeker";
  const roleColor =
    profile.role === "RECRUITER"
      ? "bg-accent-100 text-accent-700"
      : "bg-primary-100 text-primary-700";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        View your account information
      </p>

      <div className="card mt-6 p-6 sm:p-8 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <span className={`badge mt-1 ${roleColor}`}>{roleLabel}</span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="text-sm font-medium text-slate-900">{profile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-slate-900">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Shield className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-sm font-medium text-slate-900">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
