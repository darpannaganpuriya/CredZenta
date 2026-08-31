import {
  FileText, Upload, CheckCircle2, AlertTriangle,
  RotateCcw, Settings, Activity,
} from "lucide-react";
import type { ApplicationDetails, AuditAction } from "../../types";
import { formatDateTime, cn } from "../../lib/utils";

interface AuditTrailTabProps {
  app: ApplicationDetails;
}

const ACTION_CONFIG: Partial<Record<AuditAction, { icon: React.ElementType; color: string; bg: string }>> = {
  "Application Created": { icon: FileText, color: "text-brand-600", bg: "bg-brand-50" },
  "Document Uploaded": { icon: Upload, color: "text-violet-600", bg: "bg-violet-50" },
  "Document Extracted": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  "Risk Flag Created": { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  "Verification Assigned": { icon: Settings, color: "text-blue-600", bg: "bg-blue-50" },
  "Status Changed": { icon: RotateCcw, color: "text-slate-600", bg: "bg-slate-100" },
  "AI Analysis Run": { icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
};

export function AuditTrailTab({ app }: AuditTrailTabProps) {
  return (
    <div className="space-y-4 tab-content">
      <div className="section-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-900">Audit Trail</h3>
          <span className="text-xs text-slate-400">{app.auditLogs.length} events · All times in IST</span>
        </div>

        <div className="space-y-0">
          {app.auditLogs.map((log, i) => {
            const config = ACTION_CONFIG[log.action] || { icon: Activity, color: "text-slate-600", bg: "bg-slate-100" };
            const Icon = config.icon;
            return (
              <div key={log.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
                    <Icon className={cn("w-4 h-4", config.color)} />
                  </div>
                  {i < app.auditLogs.length - 1 && (
                    <div className="w-px flex-1 bg-slate-100 my-1" style={{ minHeight: "20px" }} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-5 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{log.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{log.user}</span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-500">{log.role}</span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className={cn(
                          "text-[10px] font-medium px-1 py-0.5 rounded",
                          log.status === "Success" ? "text-emerald-600" : "text-red-600"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{log.ipAddress}</p>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                      {log.action}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
