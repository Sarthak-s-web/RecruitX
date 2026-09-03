import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  ClipboardList,
  FileText,
} from "lucide-react";
import { applicationService } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { StatCardSkeleton } from "../components/Skeleton";
import { getErrorMessage } from "../utils/constants";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await applicationService.getDashboard();
      setStats(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your hiring activity
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your hiring activity
          </p>
        </div>
        <ErrorMessage message={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  const totalJobs = stats?.totalJobs ?? 0;
  const totalApplications = stats?.totalApplications ?? 0;
  const shortlisted = stats?.shortlisted ?? 0;
  const rejected = stats?.rejected ?? 0;
  const hired = stats?.hired ?? 0;

  const cards = [
    { label: "Total Jobs", value: totalJobs, icon: Briefcase, color: "bg-primary-100 text-primary-600" },
    { label: "Total Applications", value: totalApplications, icon: Users, color: "bg-accent-100 text-accent-600" },
    { label: "Shortlisted", value: shortlisted, icon: Clock, color: "bg-warning-100 text-warning-600" },
    { label: "Hired", value: hired, icon: CheckCircle2, color: "bg-success-100 text-success-600" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "bg-error-100 text-error-600" },
  ];

  const quickActions = [
    { label: "Create Job", to: "/recruiter/jobs/create", icon: Plus, color: "btn-primary" },
    { label: "Manage Jobs", to: "/recruiter/jobs", icon: ClipboardList, color: "btn-secondary" },
    { label: "View Applications", to: "/recruiter/jobs", icon: FileText, color: "btn-secondary" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your hiring activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5 animate-slide-up">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-6 card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.to} className={action.color}>
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Simple bar chart */}
      {totalApplications > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Application Status Breakdown</h2>
          <div className="mt-6 space-y-4">
            {[
              { label: "Applied", value: totalApplications - shortlisted - rejected - hired, color: "bg-slate-400" },
              { label: "Shortlisted", value: shortlisted, color: "bg-warning-400" },
              { label: "Hired", value: hired, color: "bg-success-400" },
              { label: "Rejected", value: rejected, color: "bg-error-400" },
            ].map((item) => {
              const pct = totalApplications > 0 ? (item.value / totalApplications) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium text-slate-900">{item.value}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
