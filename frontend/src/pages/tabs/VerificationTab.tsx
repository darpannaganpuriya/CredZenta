import { CheckCircle2, Clock, AlertTriangle, User, Calendar, FileText, ChevronRight } from "lucide-react";
import type { ApplicationDetails, VerificationStatus, VerificationType } from "../../types";
import { formatDate, formatDateTime, cn } from "../../lib/utils";

interface VerificationTabProps {
  app: ApplicationDetails;
}

const STATUS_CONFIG: Record<VerificationStatus, { label: string; className: string; dot: string }> = {
  Pending: { label: "Pending", className: "text-slate-500", dot: "bg-slate-300" },
  Assigned: { label: "Assigned", className: "text-blue-600", dot: "bg-blue-400" },
  "In Progress": { label: "In Progress", className: "text-amber-600", dot: "bg-amber-400" },
  Completed: { label: "Completed", className: "text-emerald-600", dot: "bg-emerald-500" },
  "Review Required": { label: "Review Required", className: "text-orange-600", dot: "bg-orange-400" },
};

const TYPE_COLORS: Record<VerificationType, string> = {
  "Legal Verification": "bg-violet-100 text-violet-700 border-violet-200",
  "Property Valuation": "bg-blue-100 text-blue-700 border-blue-200",
  "Field Verification": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Business Verification": "bg-amber-100 text-amber-700 border-amber-200",
};

export function VerificationTab({ app }: VerificationTabProps) {
  const completed = app.verificationTasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="space-y-5 tab-content">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Tasks", value: app.verificationTasks.length, color: "text-slate-900" },
          { label: "Completed", value: completed, color: "text-emerald-600" },
          { label: "In Progress", value: app.verificationTasks.filter((t) => t.status === "In Progress").length, color: "text-amber-600" },
          { label: "Pending", value: app.verificationTasks.filter((t) => t.status === "Pending" || t.status === "Assigned").length, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="section-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="section-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-700">Verification Progress</p>
          <p className="text-xs text-slate-500">{completed}/{app.verificationTasks.length} completed</p>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${(completed / app.verificationTasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      {app.verificationTasks.map((task) => {
        const statusConfig = STATUS_CONFIG[task.status];
        return (
          <div key={task.id} className="section-card overflow-hidden">
            {/* Task header */}
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4.5 h-4.5 w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{task.type}</h3>
                    <p className="text-xs text-slate-500">{task.agency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={cn(
                    "text-xs font-medium border px-2.5 py-1 rounded-lg",
                    TYPE_COLORS[task.type]
                  )}>
                    {task.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", statusConfig.dot)} />
                    <span className={cn("text-xs font-medium", statusConfig.className)}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  {task.assignedOfficer}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {formatDate(task.dueDate)}
                </div>
                {task.reportAvailable && (
                  <button className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    Download Report
                  </button>
                )}
              </div>

              {task.notes && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-600">{task.notes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity Timeline</p>
              <div className="space-y-3">
                {task.timeline.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                        i === task.timeline.length - 1 ? "bg-brand-100" : "bg-slate-100"
                      )}>
                        {i === task.timeline.length - 1 ? (
                          <div className="w-2 h-2 rounded-full bg-brand-600" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                      {i < task.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-slate-100 mt-1" />
                      )}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-xs font-medium text-slate-800">{event.event}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDateTime(event.date)} · {event.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
