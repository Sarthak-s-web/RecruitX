import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  Users,
  ArrowRight,
  FileText,
  CheckCircle2,
  Target,
  Zap,
  ShieldCheck,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated, isRecruiter, isJobSeeker } = useAuth();

  const primaryCta = isAuthenticated
    ? isRecruiter
      ? { label: "Post a Job", to: "/recruiter/jobs/create" }
      : { label: "Find Jobs", to: "/jobs" }
    : { label: "Find Jobs", to: "/jobs" };

  const secondaryCta = isAuthenticated
    ? isRecruiter
      ? { label: "View Dashboard", to: "/recruiter/dashboard" }
      : { label: "My Applications", to: "/my-applications" }
    : isRecruiter
      ? { label: "Post a Job", to: "/recruiter/jobs/create" }
      : { label: "Post a Job", to: "/register" };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the right opportunity.
              <span className="block text-primary-400">Build your future.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              RecruitX is a modern recruitment platform that connects job seekers
              with top recruiters. Browse jobs, apply with a single click, and
              track your applications — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={primaryCta.to}
                className="btn-primary px-6 py-3 text-base"
              >
                {primaryCta.label}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to={secondaryCta.to}
                className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 px-6 py-3 text-base"
              >
                {secondaryCta.label}
              </Link>
            </div>
            {!isAuthenticated && (
              <p className="mt-6 text-sm text-slate-400">
                No account needed to browse jobs. Sign up to apply or post.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why RecruitX */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Why RecruitX
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            A streamlined hiring platform built for both job seekers and recruiters
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
              <Target className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Targeted Job Search
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Filter by location, job type, and skills to find exactly the roles
              that match your profile and career goals.
            </p>
          </div>
          <div className="card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <Zap className="h-6 w-6 text-accent-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Quick Applications
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Apply with your resume and cover letter in seconds. Track your
              application status from submission to offer.
            </p>
          </div>
          <div className="card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100">
              <ShieldCheck className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Secure & Trusted
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Role-based access ensures job seekers and recruiters each get the
              right tools. Your data stays protected.
            </p>
          </div>
        </div>
      </section>

      {/* For Job Seekers / For Recruiters */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                For Job Seekers
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                  Browse and search jobs by title, location, type, and skills
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                  Apply with your resume and a personalized cover letter
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                  Track application status from Applied to Hired
                </li>
              </ul>
              {!isAuthenticated && (
                <Link to="/register" className="btn-primary mt-6 w-full">
                  Sign Up as Job Seeker
                </Link>
              )}
            </div>
            <div className="card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                For Recruiters
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                  Post job openings with full details and required skills
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                  Review applications, resumes, and cover letters in one place
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                  Shortlist, reject, or hire candidates with a simple dropdown
                </li>
              </ul>
              {!isAuthenticated && (
                <Link to="/register" className="btn-primary mt-6 w-full">
                  Sign Up as Recruiter
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3-step process */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Get Started in 3 Simple Steps
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              num: 1,
              title: "Create Your Account",
              desc: "Sign up as a job seeker or recruiter in seconds. It's free to get started.",
            },
            {
              num: 2,
              title: "Find or Post Jobs",
              desc: "Browse openings that match your skills, or post a job to attract qualified candidates.",
            },
            {
              num: 3,
              title: "Apply or Hire",
              desc: "Submit applications with your resume, or review candidates and update their status.",
            },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                {step.num}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary-600 px-6 py-12 text-center sm:px-12">
          <TrendingUp className="mx-auto h-10 w-10 text-white/80" />
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            Ready to take the next step?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-100">
            Join RecruitX today. Whether you're looking for your next role or
            your next great hire, we've got you covered.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="btn bg-white text-primary-700 hover:bg-slate-100 px-6 py-3 text-base"
                >
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="btn bg-primary-500 text-white border border-primary-400 hover:bg-primary-400 px-6 py-3 text-base"
                >
                  Browse Jobs
                </Link>
              </>
            ) : isRecruiter ? (
              <>
                <Link
                  to="/recruiter/jobs/create"
                  className="btn bg-white text-primary-700 hover:bg-slate-100 px-6 py-3 text-base"
                >
                  <Plus className="h-5 w-5" />
                  Post a Job
                </Link>
                <Link
                  to="/recruiter/dashboard"
                  className="btn bg-primary-500 text-white border border-primary-400 hover:bg-primary-400 px-6 py-3 text-base"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="btn bg-white text-primary-700 hover:bg-slate-100 px-6 py-3 text-base"
                >
                  Find Jobs
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/my-applications"
                  className="btn bg-primary-500 text-white border border-primary-400 hover:bg-primary-400 px-6 py-3 text-base"
                >
                  My Applications
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
