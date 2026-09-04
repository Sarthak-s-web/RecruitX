import { useState, useEffect } from "react";
import { User, Mail, Shield, Pencil, X, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import Input from "../components/Input";
import { getErrorMessage } from "../utils/constants";

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfile(user);
        setFormData({ name: user.name || "", email: user.email || "" });
        setLoading(false);
        return;
      }
      try {
        const data = await checkAuth();
        setProfile(data);
        if (data) setFormData({ name: data.name || "", email: data.email || "" });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, checkAuth]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await userService.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      const updatedUser = res.data.user;
      setProfile(updatedUser);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
      await checkAuth();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && !profile) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your account information
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="secondary"
            className="text-xs"
            onClick={() => {
              setFormData({ name: profile.name || "", email: profile.email || "" });
              setIsEditing(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        )}
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError("")} className="mt-4" />}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-success-50 p-3 text-sm text-success-700 border border-success-200">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}

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

        {isEditing ? (
          <form onSubmit={handleUpdate} className="mt-8 space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              minLength={2}
              maxLength={100}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
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
        )}
      </div>
    </div>
  );
}
