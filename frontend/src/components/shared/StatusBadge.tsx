import { cn } from "../../lib/utils";
import type { ApplicationStatus } from "../../types";

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  Draft: { label: "Draft", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  Submitted: { label: "Submitted", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  "Under Review": { label: "Under Review", className: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  Verification: { label: "Verification", className: "bg-violet-50 text-violet-700 border border-violet-200" },
  "Conditional Approval": { label: "Conditional", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  Approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  Rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200" },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
