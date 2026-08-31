import { BarChart3, Download, TrendingUp, Users, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatCurrency } from "../lib/utils";

const monthlyData = [
  { month: "Mar", applications: 12, approved: 8, rejected: 1 },
  { month: "Apr", applications: 15, approved: 10, rejected: 2 },
  { month: "May", applications: 18, approved: 12, rejected: 2 },
  { month: "Jun", applications: 14, approved: 9, rejected: 1 },
  { month: "Jul", applications: 20, approved: 14, rejected: 3 },
  { month: "Aug", applications: 22, approved: 16, rejected: 2 },
];

const loanTypeData = [
  { name: "Working Capital", value: 45, amount: 185000000 },
  { name: "Term Loan", value: 28, amount: 320000000 },
  { name: "Machinery Loan", value: 15, amount: 98000000 },
  { name: "Overdraft", value: 12, amount: 52000000 },
  { name: "Others", value: 8, amount: 34000000 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#94a3b8"];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    fontSize: "11px",
    color: "#f8fafc",
  },
};

export function ReportsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">Credit operations analytics · Demo Data</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sanction Rate", value: "71.8%", sub: "Last 6 months", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
          { label: "Avg. Processing Time", value: "4.2 days", sub: "Application to decision", icon: FileText, color: "text-brand-600 bg-brand-50" },
          { label: "Total Portfolio (Demo)", value: "₹68.9 Cr", sub: "Active sanctions", icon: BarChart3, color: "text-violet-600 bg-violet-50" },
          { label: "Active Officers", value: "12", sub: "Processing applications", icon: Users, color: "text-amber-600 bg-amber-50" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="section-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-[10px] text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly trend */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Application Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={25} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Applications" />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Approved" />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loan type distribution */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Portfolio by Loan Type</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={loanTypeData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {loanTypeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {loanTypeData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-slate-600 truncate max-w-[110px]">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Approval by officer */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Applications by Officer (Demo)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { officer: "Priya M.", assigned: 38, completed: 32 },
              { officer: "Amit K.", assigned: 29, completed: 24 },
              { officer: "Neha S.", assigned: 34, completed: 28 },
              { officer: "Vikram R.", assigned: 27, completed: 20 },
            ]} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="officer" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={25} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="assigned" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Assigned" />
              <Bar dataKey="completed" fill="#10b981" radius={[3, 3, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan type amount table */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Portfolio Value by Loan Type (Demo)</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan Type</th>
                <th>Count</th>
                <th>Portfolio Amount</th>
              </tr>
            </thead>
            <tbody>
              {loanTypeData.map((item, i) => (
                <tr key={item.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-xs">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-xs text-slate-600">{item.value}</td>
                  <td className="text-xs font-semibold text-slate-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
