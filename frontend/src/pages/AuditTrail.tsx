import { mockApplicationDetails } from "../data/mockData";
import { AuditTrailTab } from "./tabs/AuditTrailTab";
import { Filter } from "lucide-react";

export function AuditTrailPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Audit Trail</h2>
          <p className="text-sm text-slate-500 mt-0.5">Complete chronological record of all platform actions · Demo Data</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>
      <AuditTrailTab app={mockApplicationDetails} />
    </div>
  );
}
