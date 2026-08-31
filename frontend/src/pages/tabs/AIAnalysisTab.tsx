import { Sparkles, AlertTriangle, TrendingUp, Eye, Clock } from "lucide-react";
import type { ApplicationDetails } from "../../types";
import { formatDateTime, cn } from "../../lib/utils";

interface AIAnalysisTabProps {
  app: ApplicationDetails;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Financial Summary": "bg-brand-50 text-brand-700 border-brand-200",
  "Risk Summary": "bg-amber-50 text-amber-700 border-amber-200",
  "Key Observations": "bg-violet-50 text-violet-700 border-violet-200",
  "Recommended Review Areas": "bg-orange-50 text-orange-700 border-orange-200",
};

function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            value >= 90 ? "bg-emerald-500" : value >= 75 ? "bg-brand-500" : "bg-amber-400"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{value}%</span>
    </div>
  );
}

export function AIAnalysisTab({ app }: AIAnalysisTabProps) {
  return (
    <div className="space-y-5 tab-content">
      {/* AI Disclaimer */}
      <div className="bg-slate-900 rounded-xl p-5 flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-white">AI-Assisted Credit Analysis</p>
            <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full font-medium">
              AI-Generated
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-generated observations are for credit officer review and do not constitute an automated lending decision.
            The final credit decision remains with the authorized credit officer. All observations require human review and validation.
          </p>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last generated: {formatDateTime(app.aiObservations[0]?.generatedAt || new Date().toISOString())}
          </p>
        </div>
      </div>

      {/* Observation cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {app.aiObservations.map((obs) => (
          <div key={obs.id} className="section-card p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span
                  className={cn(
                    "text-[10px] font-medium border px-2 py-0.5 rounded-full",
                    CATEGORY_COLORS[obs.category] || "bg-slate-100 text-slate-600 border-slate-200"
                  )}
                >
                  {obs.category}
                </span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                AI-Generated
              </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-900">{obs.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed flex-1">{obs.observation}</p>

            <div>
              <p className="text-[10px] font-medium text-slate-500 mb-1.5">Confidence</p>
              <ConfidenceMeter value={obs.confidence} />
            </div>

            {obs.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {obs.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div className="section-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">AI Summary</h3>
          <span className="ml-auto text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
            Requires Human Review
          </span>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-brand-500">
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "The application shows stable revenue growth over the last three financial periods.
            A moderate mismatch between GST and ITR turnover (8.65%) requires verification before final decision.
            The debt service coverage ratio is adequate but leaves limited headroom under stress scenarios.
            Legal verification of collateral must be completed before processing further.
            Two compliance items require credit officer review."
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-[10px] text-slate-400">AI-generated · Not a lending recommendation</span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700">
            This analysis is AI-assisted and for decision-support only. Credit officers must independently verify all facts
            before making any credit decision. IntelliCredit does not make automated lending decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
