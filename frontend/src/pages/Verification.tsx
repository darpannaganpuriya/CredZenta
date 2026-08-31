import { useNavigate } from "react-router-dom";
import { mockApplications } from "../data/mockData";
import { formatCurrency, formatDate } from "../lib/utils";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ClipboardCheck } from "lucide-react";

export function VerificationPage() {
  const navigate = useNavigate();
  const verificationApps = mockApplications.filter(
    (a) => a.status === "Verification" || a.status === "Under Review"
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Verification Queue</h2>
        <p className="text-sm text-slate-500 mt-0.5">Applications pending legal, field, and valuation verification · Demo Data</p>
      </div>
      <div className="section-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Applications Requiring Verification</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Assigned Officer</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {verificationApps.map((app) => (
              <tr key={app.id} onClick={() => navigate(`/applications/${app.id}`)}>
                <td>
                  <p className="text-xs font-semibold text-slate-900">{app.businessName}</p>
                  <p className="text-[11px] text-slate-400">{app.applicationNumber}</p>
                </td>
                <td className="text-xs text-slate-600">{app.loanType}</td>
                <td className="text-xs font-semibold text-slate-900">{formatCurrency(app.requestedAmount)}</td>
                <td><StatusBadge status={app.status} /></td>
                <td className="text-xs text-slate-600">{app.assignedOfficer}</td>
                <td className="text-xs text-slate-400">{formatDate(app.lastUpdated)}</td>
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
