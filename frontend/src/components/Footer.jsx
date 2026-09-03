import { Link } from "react-router-dom";
import { Briefcase, FileText, Users, TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">RecruitX</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} RecruitX. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link to="/jobs" className="hover:text-primary-600 transition-colors">
              Jobs
            </Link>
            <Link to="/login" className="hover:text-primary-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-primary-600 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
