import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getApplications } from "../services/applications";
import { StatusBadge } from "../components/shared/StatusBadge";
import { RiskBadge } from "../components/shared/RiskBadge";
import { formatCurrency, formatDate } from "../lib/utils";
import type { Application, ApplicationStatus, RiskLevel, LoanType } from "../types";

const STATUSES: ApplicationStatus[] = [
  "Draft", "Submitted", "Under Review", "Verification",
  "Conditional Approval", "Approved", "Rejected",
];
const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High", "Critical"];
const LOAN_TYPES: LoanType[] = [
  "Working Capital", "Term Loan", "Overdraft", "Letter of Credit",
  "Bank Guarantee", "Machinery Loan", "Home Loan", "LAP",
];

const PAGE_SIZE = 8;

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRisk, setFilterRisk] = useState<string>("");
  const [filterLoanType, setFilterLoanType] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const filtered = applications.filter((app: Application) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      app.businessName.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.applicationNumber.toLowerCase().includes(q);
    const matchStatus = !filterStatus || app.status === filterStatus;
    const matchRisk = !filterRisk || app.riskLevel === filterRisk;
    const matchLoan = !filterLoanType || app.loanType === filterLoanType;
    return matchSearch && matchStatus && matchRisk && matchLoan;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterRisk("");
    setFilterLoanType("");
    setPage(1);
  };

  const activeFilterCount = [filterStatus, filterRisk, filterLoanType].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Applications</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} of {applications.length} applications · Demo Data
          </p>
        </div>
        <button
          onClick={() => navigate("/applications/create")}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Toolbar */}
      <div className="section-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-brand-400 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by applicant, business, or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors relative"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Clear filters
            </button>
          )}

          <div className="sm:ml-auto flex items-center gap-2 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Last updated
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-brand-400"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Risk Level</label>
              <select
                value={filterRisk}
                onChange={(e) => { setFilterRisk(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-brand-400"
              >
                <option value="">All Risk Levels</option>
                {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Loan Type</label>
              <select
                value={filterLoanType}
                onChange={(e) => { setFilterLoanType(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-brand-400"
              >
                <option value="">All Loan Types</option>
                {LOAN_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="section-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <Search className="w-8 h-8 mb-2" />
            <p className="text-sm">No applications match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant / Business</th>
                  <th>Loan Type</th>
                  <th>Requested Amount</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Assigned Officer</th>
                  <th>Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <td>
                      <span className="font-mono text-xs text-slate-500">{app.applicationNumber}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">{app.businessName}</p>
                        <p className="text-[11px] text-slate-400">{app.applicantName} · {app.location}</p>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600 whitespace-nowrap">{app.loanType}</td>
                    <td className="text-xs font-semibold text-slate-900 whitespace-nowrap">
                      {formatCurrency(app.requestedAmount)}
                    </td>
                    <td><RiskBadge level={app.riskLevel} showIcon={false} /></td>
                    <td><StatusBadge status={app.status} /></td>
                    <td className="text-xs text-slate-600 whitespace-nowrap">{app.assignedOfficer}</td>
                    <td className="text-xs text-slate-400 whitespace-nowrap">{formatDate(app.lastUpdated)}</td>
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/applications/${app.id}`); }}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium ${
                    p === page ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
