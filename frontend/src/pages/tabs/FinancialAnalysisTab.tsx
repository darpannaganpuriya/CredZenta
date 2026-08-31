import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ApplicationDetails } from "../../types";
import { formatCurrency, cn } from "../../lib/utils";

interface FinancialAnalysisTabProps {
  app: ApplicationDetails;
}

const CHART_COLORS = {
  revenue: "#3b82f6",
  ebitda: "#10b981",
  pat: "#8b5cf6",
};

export function FinancialAnalysisTab({ app }: FinancialAnalysisTabProps) {
  const { financialSummary: fs } = app;

  // Merge chart data
  const chartData = fs.revenue.map((r, i) => ({
    year: r.year,
    Revenue: r.value,
    EBITDA: fs.ebitda[i]?.value || 0,
    PAT: fs.pat[i]?.value || 0,
  }));

  const ratioItems = [
    { label: "Current Ratio", value: fs.ratios.currentRatio, unit: "x", threshold: 1.33, higher: true },
    { label: "Debt to Equity", value: fs.ratios.debtToEquity, unit: "x", threshold: 2.0, higher: false },
    { label: "DSCR", value: fs.ratios.dscr, unit: "x", threshold: 1.5, higher: true },
    { label: "Interest Coverage", value: fs.ratios.interestCoverage, unit: "x", threshold: 3.0, higher: true },
    { label: "Profit Margin", value: fs.ratios.profitMargin, unit: "%", threshold: 8, higher: true },
    { label: "Return on Equity", value: fs.ratios.returnOnEquity, unit: "%", threshold: 12, higher: true },
  ];

  const bsCells = [
    { label: "Total Assets", value: fs.totalAssets },
    { label: "Total Liabilities", value: fs.totalLiabilities },
    { label: "Net Worth", value: fs.netWorth },
    { label: "Total Debt", value: fs.totalDebt },
  ];

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "8px",
      fontSize: "11px",
      color: "#f8fafc",
    },
    cursor: { fill: "rgba(241,245,249,0.5)" },
  };

  return (
    <div className="space-y-5 tab-content">
      {/* Demo banner */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>Demo Data</strong> — Financial figures are sample data extracted from mock documents. Not actual financial data.
        </p>
      </div>

      {/* Revenue / EBITDA / PAT chart */}
      <div className="section-card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue & Profitability Trend (₹ Lakhs)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              {Object.entries(CHART_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              width={50}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(v, name) => [formatCurrency(Number(v ?? 0)), String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Area type="monotone" dataKey="Revenue" stroke={CHART_COLORS.revenue} fill={`url(#grad-revenue)`} strokeWidth={2} />
            <Area type="monotone" dataKey="EBITDA" stroke={CHART_COLORS.ebitda} fill={`url(#grad-ebitda)`} strokeWidth={2} />
            <Area type="monotone" dataKey="PAT" stroke={CHART_COLORS.pat} fill={`url(#grad-pat)`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Balance Sheet Snapshot */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Balance Sheet Snapshot (FY25)</h3>
          <div className="grid grid-cols-2 gap-3">
            {bsCells.map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{formatCurrency(item.value)}</p>
              </div>
            ))}
          </div>

          {/* Bar chart for assets vs liabilities */}
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={[{ name: "FY25", Assets: fs.totalAssets, Liabilities: fs.totalLiabilities, NetWorth: fs.netWorth }]} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 10000000).toFixed(1)}Cr`} width={36} />
                <Tooltip {...tooltipStyle} formatter={(v) => [formatCurrency(Number(v ?? 0))]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Assets" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Liabilities" fill="#f87171" radius={[3, 3, 0, 0]} />
                <Bar dataKey="NetWorth" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Ratios */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Key Financial Ratios</h3>
          <div className="space-y-3">
            {ratioItems.map((ratio) => {
              const ok = ratio.higher
                ? ratio.value >= ratio.threshold
                : ratio.value <= ratio.threshold;
              return (
                <div key={ratio.label} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">{ratio.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {ratio.value}{ratio.unit}
                        </span>
                        {ok ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          ok ? "bg-emerald-500" : "bg-amber-400"
                        )}
                        style={{
                          width: `${Math.min((ratio.value / (ratio.threshold * 2)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Benchmark: {ratio.threshold}{ratio.unit} · {ok ? "✓ Within range" : "⚠ Review"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cross-Document Consistency */}
      <div className="section-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Cross-Document Consistency Check</h3>
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Demo Analysis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>GST / GSTR</th>
                <th>ITR</th>
                <th>Audited</th>
                <th>Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fs.crossDocumentConsistency.map((row) => (
                <tr key={row.parameter} className="hover:bg-slate-50">
                  <td className="font-medium text-xs text-slate-900">{row.parameter}</td>
                  <td className="text-xs">{row.gstValue ? formatCurrency(row.gstValue) : "—"}</td>
                  <td className="text-xs">{row.itrValue ? formatCurrency(row.itrValue) : "—"}</td>
                  <td className="text-xs">{row.auditedValue ? formatCurrency(row.auditedValue) : "—"}</td>
                  <td className="text-xs">
                    {row.differencePercent !== null ? (
                      <span className={row.differencePercent > 5 ? "text-amber-700 font-medium" : "text-slate-600"}>
                        {row.differencePercent.toFixed(2)}%
                      </span>
                    ) : "—"}
                  </td>
                  <td>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded",
                        row.status === "Pass"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.status === "Review Required"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {row.status === "Pass" && <CheckCircle2 className="w-3 h-3" />}
                      {row.status !== "Pass" && <AlertTriangle className="w-3 h-3" />}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {fs.crossDocumentConsistency.some((r) => r.status === "Review Required") && (
          <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              One or more parameters show variance beyond the 5% threshold. Credit officer review and borrower clarification is recommended.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
