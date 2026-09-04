export const JOB_TYPES = ["FULL_TIME", "PART_TIME", "INTERNSHIP"];

export const APPLICATION_STATUSES = [
  "APPLIED",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];

export const ROLES = {
  JOB_SEEKER: "JOB_SEEKER",
  RECRUITER: "RECRUITER",
};

export const STATUS_COLORS = {
  APPLIED: "bg-slate-100 text-slate-700",
  SHORTLISTED: "bg-warning-100 text-warning-700",
  REJECTED: "bg-error-100 text-error-700",
  HIRED: "bg-success-100 text-success-700",
};

export const JOB_TYPE_COLORS = {
  FULL_TIME: "bg-primary-100 text-primary-700",
  PART_TIME: "bg-accent-100 text-accent-700",
  INTERNSHIP: "bg-purple-100 text-purple-700",
};

export const formatJobType = (type) => {
  if (!type) return "";
  return type
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSalary = (salary) => {
  if (salary === null || salary === undefined || salary === "" || isNaN(Number(salary))) {
    return "Not disclosed";
  }
  return `$${Number(salary).toLocaleString()}`;
};

export const getErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred.";
  if (error.response) {
    const status = error.response.status;
    const msg =
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.data?.msg;

    switch (status) {
      case 400:
        return msg || "Invalid request. Please check your input.";
      case 401:
        return msg || "Please login to continue.";
      case 403:
        return msg || "You don't have permission to access this page.";
      case 404:
        return msg || "Resource not found.";
      case 409:
        return msg || "This resource already exists.";
      case 500:
        return msg || "Server error. Please try again later.";
      default:
        return msg || `Request failed with status ${status}.`;
    }
  }
  if (error.request) {
    return "Unable to connect to the server. Please check your connection.";
  }
  return error.message || "An unexpected error occurred.";
};
