import { ShieldAlert, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockApplications } from "../data/mockData";
import { RiskBadge } from "../components/shared/RiskBadge";
import { StatusBadge } from "../components/shared/StatusBadge";
import { formatCurrency } from "../lib/utils";

export function RiskPage() {
  const navigate = useNavigate();
  const highRisk = mockApplications.filter((a) => a.riskLevel === "High" || a.riskLevel === "Critical");
  const allRisk = [...mockApplications].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Risk Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Portfolio risk summary across all applications · Demo Data</p>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Risk assessments shown are based on mock data. Open an individual application to view detailed risk analysis.
        </p>
      </div>

      <div className="section-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Applications by Risk Level</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allRisk.map((app) => (
              <tr key={app.id} onClick={() => navigate(`/applications/${app.id}`)}>
                <td>
                  <p className="text-xs font-semibold text-slate-900">{app.businessName}</p>
                  <p className="text-[11px] text-slate-400">{app.applicationNumber}</p>
                </td>
                <td className="text-xs text-slate-600">{app.loanType}</td>
                <td className="text-xs font-semibold text-slate-900">{formatCurrency(app.requestedAmount)}</td>
                <td><RiskBadge level={app.riskLevel} /></td>
                <td><StatusBadge status={app.status} /></td>
                <td>
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
