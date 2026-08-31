import { Home, MapPin, User, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import type { ApplicationDetails, LegalStatus } from "../../types";
import { formatCurrency, formatDate, cn } from "../../lib/utils";

interface CollateralTabProps {
  app: ApplicationDetails;
}

const LEGAL_STATUS_CONFIG: Record<LegalStatus, { className: string }> = {
  Clear: { className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  "Under Review": { className: "bg-amber-50 text-amber-700 border border-amber-200" },
  Encumbered: { className: "bg-orange-50 text-orange-700 border border-orange-200" },
  Disputed: { className: "bg-red-50 text-red-700 border border-red-200" },
};

export function CollateralTab({ app }: CollateralTabProps) {
  return (
    <div className="space-y-5 tab-content">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Estimated Value",
            value: formatCurrency(app.collateral.reduce((s, c) => s + c.estimatedValue, 0)),
            icon: Home,
            color: "text-brand-600 bg-brand-50",
          },
          {
            label: "Total Valuation Value",
            value: formatCurrency(app.collateral.reduce((s, c) => s + c.valuationValue, 0)),
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Average LTV",
            value: `${(app.collateral.reduce((s, c) => s + c.ltv, 0) / app.collateral.length).toFixed(1)}%`,
            icon: AlertCircle,
            color: "text-amber-600 bg-amber-50",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="section-card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collateral cards */}
      {app.collateral.map((col) => (
        <div key={col.id} className="section-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">{col.type}</h3>
              </div>
              <p className="text-xs text-slate-500">{col.description}</p>
            </div>
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg", LEGAL_STATUS_CONFIG[col.legalStatus].className)}>
              Legal: {col.legalStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: "Estimated Value", value: formatCurrency(col.estimatedValue), highlight: false },
              { label: "Valuation Value", value: formatCurrency(col.valuationValue), highlight: false },
              { label: "Loan Amount", value: formatCurrency(col.loanAmount), highlight: false },
              { label: "LTV Ratio", value: `${col.ltv}%`, highlight: col.ltv > 75 },
            ].map((item) => (
              <div key={item.label} className={cn(
                "bg-slate-50 rounded-lg p-3",
                item.highlight ? "bg-amber-50 border border-amber-100" : ""
              )}>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
                <p className={cn("text-base font-bold", item.highlight ? "text-amber-700" : "text-slate-900")}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* LTV Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">Loan-to-Value (LTV)</span>
              <span className={cn("text-xs font-semibold", col.ltv <= 60 ? "text-emerald-600" : col.ltv <= 75 ? "text-amber-600" : "text-red-600")}>
                {col.ltv}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  col.ltv <= 60 ? "bg-emerald-500" : col.ltv <= 75 ? "bg-amber-400" : "bg-red-500"
                )}
                style={{ width: `${Math.min(col.ltv, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0%</span>
              <span className="text-emerald-600">60% (Ideal)</span>
              <span className="text-amber-600">75% (Max)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Owner:</span> {col.owner}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Location:</span> {col.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Survey No:</span> {col.surveyNumber}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Valuation Date:</span> {formatDate(col.valuationDate)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Valued By:</span> {col.valuedBy}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
