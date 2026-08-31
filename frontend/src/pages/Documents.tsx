import { useNavigate } from "react-router-dom";
import { mockApplications } from "../data/mockData";
import { formatCurrency, formatDate } from "../lib/utils";
import { StatusBadge } from "../components/shared/StatusBadge";
import { FolderOpen, Upload } from "lucide-react";

export function DocumentsPage() {
  const navigate = useNavigate();

  // Collect all documents across all applications (demo)
  const allDocs = [
    { appName: "Sharma Engineering Pvt Ltd", appId: "app-001", docs: 8, verified: 6, pending: 2 },
    { appName: "Verma Agro Industries", appId: "app-002", docs: 7, verified: 7, pending: 0 },
    { appName: "Patel Foods & Beverages", appId: "app-003", docs: 5, verified: 2, pending: 3 },
    { appName: "Indore Auto Components", appId: "app-004", docs: 9, verified: 9, pending: 0 },
    { appName: "Maheshwari Textiles", appId: "app-005", docs: 4, verified: 1, pending: 3 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Document Repository</h2>
          <p className="text-sm text-slate-500 mt-0.5">All uploaded documents across applications · Demo Data</p>
        </div>
        <label className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          Upload Document
          <input type="file" className="hidden" />
        </label>
      </div>
      <div className="section-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Documents by Application</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Total Docs</th>
              <th>Verified</th>
              <th>Pending Review</th>
              <th>Completion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allDocs.map((item) => (
              <tr key={item.appId} onClick={() => navigate(`/applications/${item.appId}`)}>
                <td className="text-xs font-semibold text-slate-900">{item.appName}</td>
                <td className="text-xs text-slate-600">{item.docs}</td>
                <td className="text-xs text-emerald-600 font-medium">{item.verified}</td>
                <td className="text-xs text-amber-600 font-medium">{item.pending}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-20">
                      <div
                        className="h-1.5 bg-emerald-500 rounded-full"
                        style={{ width: `${(item.verified / item.docs) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{Math.round((item.verified / item.docs) * 100)}%</span>
                  </div>
                </td>
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
