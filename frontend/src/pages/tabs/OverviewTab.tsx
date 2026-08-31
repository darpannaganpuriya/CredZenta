import { CheckCircle2, AlertTriangle, Clock, FileText, ShieldAlert, TrendingUp } from "lucide-react";
import type { ApplicationDetails } from "../../types";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { RiskBadge } from "../../components/shared/RiskBadge";

interface OverviewTabProps {
  app: ApplicationDetails;
}

export function OverviewTab({ app }: OverviewTabProps) {
  const healthItems = [
    {
      label: "Documents",
      value: `${app.documents.filter((d) => d.verificationStatus === "Verified").length}/${app.documents.length} Verified`,
      icon: FileText,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      label: "Financial Analysis",
      value: "Completed",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Compliance",
      value: `${app.complianceChecks.filter((c) => c.status === "Review Required").length} Items Need Review`,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Verification",
      value: `${app.verificationTasks.filter((v) => v.status === "Completed").length}/${app.verificationTasks.length} Completed`,
      icon: CheckCircle2,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Risk",
      value: app.riskLevel,
      icon: ShieldAlert,
      color: app.riskLevel === "High" ? "text-orange-600" : "text-amber-600",
      bg: app.riskLevel === "High" ? "bg-orange-50" : "bg-amber-50",
    },
    {
      label: "Open Risk Flags",
      value: `${app.riskFlags.filter((r) => r.status === "Open").length} Open`,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-5 tab-content">
      {/* Application Health */}
      <div className="section-card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Application Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Applicant Summary */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Applicant</h3>
          <dl className="space-y-2">
            {[
              ["Name", app.applicantDetails.name],
              ["Designation", app.applicantDetails.designation],
              ["Email", app.applicantDetails.email],
              ["Phone", app.applicantDetails.phone],
              ["PAN", app.applicantDetails.pan],
              ["CIBIL Score", `${app.applicantDetails.cibilScore} (Demo Data)`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-xs font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Business Summary */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Business</h3>
          <dl className="space-y-2">
            {[
              ["Type", app.businessDetails.type],
              ["Industry", app.businessDetails.industry],
              ["GSTIN", app.businessDetails.gstin],
              ["CIN", app.businessDetails.cin],
              ["Incorporated", app.businessDetails.incorporationDate],
              ["Vintage", `${app.businessDetails.businessVintage} years`],
              ["Annual Turnover", formatCurrency(app.businessDetails.annualTurnover)],
              ["Employees", String(app.businessDetails.employees)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-xs font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Loan Summary */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Loan Details</h3>
          <dl className="space-y-2">
            {[
              ["Loan Type", app.loanType],
              ["Requested Amount", formatCurrency(app.requestedAmount)],
              ["Tenure", `${app.tenure} months`],
              ["Purpose", app.purpose],
              ["Status", <StatusBadge status={app.status} />],
              ["Risk", <RiskBadge level={app.riskLevel} showIcon={false} />],
              ["Assigned Officer", app.assignedOfficer],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-xs font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Financial Snapshot */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Financial Snapshot (Demo)</h3>
          <dl className="space-y-2">
            {[
              ["Annual Revenue (FY25)", formatCurrency(app.financialSummary.revenue[2]?.value || 0)],
              ["EBITDA (FY25)", formatCurrency(app.financialSummary.ebitda[2]?.value || 0)],
              ["Net Profit (FY25)", formatCurrency(app.financialSummary.pat[2]?.value || 0)],
              ["Net Worth", formatCurrency(app.financialSummary.netWorth)],
              ["Total Debt", formatCurrency(app.financialSummary.totalDebt)],
              ["D/E Ratio", String(app.financialSummary.ratios.debtToEquity) + "x"],
              ["DSCR", String(app.financialSummary.ratios.dscr) + "x"],
              ["Current Ratio", String(app.financialSummary.ratios.currentRatio) + "x"],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-xs font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {app.auditLogs.slice(0, 5).map((log, i) => (
            <div key={log.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                </div>
                {i < 4 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
              </div>
              <div className="pb-3 min-w-0">
                <p className="text-xs text-slate-800 font-medium">{log.description}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formatDateTime(log.timestamp)} · {log.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
