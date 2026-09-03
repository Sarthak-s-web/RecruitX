import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { jobService } from "../services";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import ErrorMessage from "../components/ErrorMessage";
import { JOB_TYPES, formatJobType, getErrorMessage } from "../utils/constants";

export default function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "FULL_TIME",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.title.trim()) {
      e.title = "Job title is required";
    }

    if (!form.company.trim()) {
      e.company = "Company name is required";
    }

    if (!form.description.trim()) {
      e.description = "Job description is required";
    }

    if (!form.salary) {
      e.salary = "Salary is required";
    } else if (
      isNaN(Number(form.salary)) ||
      Number(form.salary) < 0
    ) {
      e.salary = "Salary must be a positive number";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        salary: Number(form.salary),
        jobType: form.jobType,
        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      await jobService.create(payload);

      navigate("/recruiter/jobs", { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <Link
        to="/recruiter/jobs"
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Jobs
      </Link>

      <div className="card p-6 sm:p-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900">
          Post a New Job
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to create a new job posting
        </p>

        {apiError && (
          <ErrorMessage
            message={apiError}
            onClose={() => setApiError("")}
            className="mt-4"
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
          noValidate
        >
          <Input
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
            error={errors.title}
            required
          />

          <Input
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="e.g. Acme Inc."
            error={errors.company}
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and requirements..."
            error={errors.description}
            rows={6}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
            />

            <Input
              label="Salary (USD)"
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 80000"
              error={errors.salary}
              min="0"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Job Type"
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              required
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatJobType(type)}
                </option>
              ))}
            </Select>

            <Input
              label="Skills (comma separated)"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, CSS"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Create Job Posting
          </Button>
        </form>
      </div>
    </div>
  );
}

