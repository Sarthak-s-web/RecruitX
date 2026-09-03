import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link to="/jobs" className="btn-secondary">
            <Search className="h-4 w-4" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
