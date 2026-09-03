import { Link } from "react-router-dom";
import { ShieldX, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AccessDenied() {
  const { isRecruiter } = useAuth();
  const redirectLink = isRecruiter ? "/recruiter/dashboard" : "/jobs";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
          <ShieldX className="h-8 w-8 text-error-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          You don't have permission to access this page.
        </p>
        <Link to={redirectLink} className="btn-primary mt-8">
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
