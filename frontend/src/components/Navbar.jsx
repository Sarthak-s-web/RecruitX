import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Briefcase,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Plus,
  Home,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isJobSeeker, isRecruiter, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setMobileOpen(false);
    setUserMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors rounded-md ${
      isActive
        ? "text-primary-600"
        : "text-slate-600 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-50 text-primary-600"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  const closeMobile = () => setMobileOpen(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">RecruitX</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              <span className="px-2 py-1.5">Home</span>
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              <span className="px-2 py-1.5">Browse Jobs</span>
            </NavLink>

            {isAuthenticated && isJobSeeker && (
              <NavLink to="/my-applications" className={navLinkClass}>
                <span className="px-2 py-1.5">My Applications</span>
              </NavLink>
            )}

            {isAuthenticated && isRecruiter && (
              <>
                <NavLink to="/recruiter/dashboard" className={navLinkClass}>
                  <span className="px-2 py-1.5">Dashboard</span>
                </NavLink>
                <NavLink to="/recruiter/jobs" className={navLinkClass}>
                  <span className="px-2 py-1.5">My Jobs</span>
                </NavLink>
                <NavLink to="/recruiter/jobs/create" className={navLinkClass}>
                  <span className="px-2 py-1.5">Create Job</span>
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 text-sm hover:bg-slate-50 transition-colors"
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {initials || <User className="h-4 w-4" />}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg animate-scale-in">
                      <div className="border-b border-slate-100 px-4 py-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors disabled:opacity-60"
                      >
                        <LogOut className="h-4 w-4" />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-0.5 animate-fade-in">
            <NavLink to="/" onClick={closeMobile} className={mobileNavLinkClass} end>
              <Home className="h-4 w-4" /> Home
            </NavLink>
            <NavLink to="/jobs" onClick={closeMobile} className={mobileNavLinkClass}>
              <Briefcase className="h-4 w-4" /> Browse Jobs
            </NavLink>

            {isAuthenticated && isJobSeeker && (
              <NavLink to="/my-applications" onClick={closeMobile} className={mobileNavLinkClass}>
                <FileText className="h-4 w-4" /> My Applications
              </NavLink>
            )}

            {isAuthenticated && isRecruiter && (
              <>
                <NavLink to="/recruiter/dashboard" onClick={closeMobile} className={mobileNavLinkClass}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </NavLink>
                <NavLink to="/recruiter/jobs" onClick={closeMobile} className={mobileNavLinkClass}>
                  <ClipboardList className="h-4 w-4" /> My Jobs
                </NavLink>
                <NavLink to="/recruiter/jobs/create" onClick={closeMobile} className={mobileNavLinkClass}>
                  <Plus className="h-4 w-4" /> Create Job
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={closeMobile} className={mobileNavLinkClass}>
                  <User className="h-4 w-4" /> Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-colors disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" /> {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2 px-3">
                <Link to="/login" onClick={closeMobile} className="btn-secondary flex-1 text-sm">
                  Login
                </Link>
                <Link to="/register" onClick={closeMobile} className="btn-primary flex-1 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
