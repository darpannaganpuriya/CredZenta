import { CheckCircle2, XCircle, AlertTriangle, Minus, Info } from "lucide-react";
import type { ApplicationDetails, ComplianceStatus } from "../../types";
import { formatDateTime, cn } from "../../lib/utils";

interface ComplianceTabProps {
  app: ApplicationDetails;
}

const STATUS_CONFIG: Record<ComplianceStatus, { icon: React.ElementType; className: string; dot: string }> = {
  Passed: { icon: CheckCircle2, className: "text-emerald-600", dot: "bg-emerald-500" },
  Failed: { icon: XCircle, className: "text-red-600", dot: "bg-red-500" },
  "Review Required": { icon: AlertTriangle, className: "text-amber-600", dot: "bg-amber-400" },
  "Not Applicable": { icon: Minus, className: "text-slate-400", dot: "bg-slate-300" },
};

export function ComplianceTab({ app }: ComplianceTabProps) {
  const counts = {
    Passed: app.complianceChecks.filter((c) => c.status === "Passed").length,
    Failed: app.complianceChecks.filter((c) => c.status === "Failed").length,
    "Review Required": app.complianceChecks.filter((c) => c.status === "Review Required").length,
    "Not Applicable": app.complianceChecks.filter((c) => c.status === "Not Applicable").length,
  };

  return (
    <div className="space-y-5 tab-content">
      {/* Notice */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          <strong>Demo / Configurable Checks</strong> — These compliance checks are for demonstration purposes and are not based on actual regulatory requirements. Real checks will be configured per institution policy.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {(["Passed", "Review Required", "Failed", "Not Applicable"] as ComplianceStatus[]).map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <div key={status} className="section-card p-4 text-center">
              <Icon className={cn("w-6 h-6 mx-auto mb-2", config.className)} />
              <p className="text-2xl font-bold text-slate-900">{counts[status]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="section-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-700">Overall Compliance Progress</p>
          <p className="text-xs text-slate-500">
            {counts.Passed}/{app.complianceChecks.length} checks passed
          </p>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${(counts.Passed / app.complianceChecks.length) * 100}%` }}
          />
          <div
            className="h-full bg-amber-400 transition-all"
            style={{ width: `${(counts["Review Required"] / app.complianceChecks.length) * 100}%` }}
          />
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${(counts.Failed / app.complianceChecks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist table */}
      <div className="section-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Compliance Checklist</h3>
          <span className="text-xs text-slate-400">{app.complianceChecks.length} items · Demo Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Category</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Reviewer</th>
                <th>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {app.complianceChecks.map((check) => {
                const config = STATUS_CONFIG[check.status];
                const Icon = config.icon;
                return (
                  <tr key={check.id}>
                    <td>
                      <p className="text-xs font-medium text-slate-900">{check.requirement}</p>
                      {check.notes && (
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{check.notes}</p>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">{check.category}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
                        <span className={cn("text-xs font-medium", config.className)}>
                          {check.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <p className="text-xs text-slate-600 max-w-[200px] truncate">{check.evidence}</p>
                    </td>
                    <td className="text-xs text-slate-600">{check.reviewer}</td>
                    <td className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDateTime(check.lastChecked)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
