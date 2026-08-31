import { ShieldAlert, ShieldCheck, AlertTriangle, ShieldX, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ApplicationDetails, RiskFlag, RiskLevel, RiskCategory } from "../../types";
import { formatDateTime, cn } from "../../lib/utils";

interface RiskTabProps {
  app: ApplicationDetails;
}

const SEVERITY_CONFIG: Record<RiskLevel, { icon: React.ElementType; className: string; barColor: string }> = {
  Low: { icon: ShieldCheck, className: "border-emerald-200 bg-emerald-50", barColor: "bg-emerald-500" },
  Medium: { icon: AlertTriangle, className: "border-amber-200 bg-amber-50", barColor: "bg-amber-400" },
  High: { icon: ShieldAlert, className: "border-orange-200 bg-orange-50", barColor: "bg-orange-500" },
  Critical: { icon: ShieldX, className: "border-red-200 bg-red-50", barColor: "bg-red-500" },
};

const RISK_CATEGORIES: RiskCategory[] = [
  "Financial Risk", "Document Risk", "Business Risk",
  "Compliance Risk", "Collateral Risk", "External Risk",
];

function RiskFlagCard({ flag }: { flag: RiskFlag }) {
  const [expanded, setExpanded] = useState(false);
  const config = SEVERITY_CONFIG[flag.severity];
  const Icon = config.icon;

  return (
    <div className={cn("border rounded-xl overflow-hidden transition-shadow hover:shadow-sm", config.className)}>
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn(
            "w-5 h-5",
            flag.severity === "Low" ? "text-emerald-600" :
            flag.severity === "Medium" ? "text-amber-600" :
            flag.severity === "High" ? "text-orange-600" : "text-red-600"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{flag.title}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn(
                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                flag.severity === "Low" ? "text-emerald-700 bg-emerald-100" :
                flag.severity === "Medium" ? "text-amber-700 bg-amber-100" :
                flag.severity === "High" ? "text-orange-700 bg-orange-100" :
                "text-red-700 bg-red-100"
              )}>
                {flag.severity}
              </span>
              {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-1">{flag.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-slate-400">{flag.category}</span>
            <span className="text-[10px] text-slate-300">·</span>
            <span className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded",
              flag.status === "Open" ? "bg-red-100 text-red-700" :
              flag.status === "Acknowledged" ? "bg-blue-100 text-blue-700" :
              "bg-emerald-100 text-emerald-700"
            )}>
              {flag.status}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/50 space-y-3 animate-fade-in">
          {flag.evidence.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Evidence</p>
              <ul className="space-y-1">
                {flag.evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="text-slate-400 mt-0.5">•</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {flag.sourceDocuments.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Source Documents</p>
              <div className="flex flex-wrap gap-1.5">
                {flag.sourceDocuments.map((doc) => (
                  <span key={doc} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Recommended Action</p>
            <p className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-3">
              {flag.recommendedAction}
            </p>
          </div>
          <p className="text-[10px] text-slate-400">Detected: {formatDateTime(flag.createdAt)}</p>
        </div>
      )}
    </div>
  );
}

export function RiskTab({ app }: RiskTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categoryCounts = RISK_CATEGORIES.reduce(
    (acc, cat) => ({
      ...acc,
      [cat]: app.riskFlags.filter((f) => f.category === cat).length,
    }),
    {} as Record<string, number>
  );

  const severityCounts = (["Low", "Medium", "High", "Critical"] as RiskLevel[]).reduce(
    (acc, s) => ({
      ...acc,
      [s]: app.riskFlags.filter((f) => f.severity === s).length,
    }),
    {} as Record<RiskLevel, number>
  );

  const filtered =
    selectedCategory === "All"
      ? app.riskFlags
      : app.riskFlags.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-5 tab-content">
      {/* Risk summary */}
      <div className="grid grid-cols-4 gap-3">
        {(["Critical", "High", "Medium", "Low"] as RiskLevel[]).map((level) => {
          const config = SEVERITY_CONFIG[level];
          const Icon = config.icon;
          return (
            <div key={level} className={cn("border rounded-xl p-4", config.className)}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn(
                  "w-5 h-5",
                  level === "Low" ? "text-emerald-600" :
                  level === "Medium" ? "text-amber-600" :
                  level === "High" ? "text-orange-600" : "text-red-600"
                )} />
                <span className="text-2xl font-bold text-slate-900">{severityCounts[level] || 0}</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{level} Risk</p>
              <div className={cn("mt-2 h-1 rounded-full", config.barColor, "opacity-40")} style={{ width: "100%" }} />
            </div>
          );
        })}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("All")}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-all",
            selectedCategory === "All"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
          )}
        >
          All ({app.riskFlags.length})
        </button>
        {RISK_CATEGORIES.filter((c) => categoryCounts[c] > 0).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              selectedCategory === cat
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* Risk flags */}
      {filtered.length === 0 ? (
        <div className="section-card p-10 text-center text-slate-400">
          <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-300" />
          <p className="text-sm">No risk flags in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((flag) => (
            <RiskFlagCard key={flag.id} flag={flag} />
          ))}
        </div>
      )}
    </div>
  );
}
