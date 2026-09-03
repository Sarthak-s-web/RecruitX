import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, User, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage, ROLES } from "../utils/constants";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.JOB_SEEKER,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else {
        navigate("/jobs", { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Join RecruitX to find or post jobs
          </p>
        </div>

        <div className="card mt-8 p-6 sm:p-8">
          {error && <ErrorMessage message={error} onClose={() => setError("")} className="mb-4" />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <Select
              label="I am a..."
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value={ROLES.JOB_SEEKER}>Job Seeker - looking for opportunities</option>
              <option value={ROLES.RECRUITER}>Recruiter - hiring for my company</option>
            </Select>
            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
