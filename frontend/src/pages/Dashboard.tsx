import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FileText,
  Clock,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { getDashboardData } from "../services/dashboard";
import { MetricCard } from "../components/shared/MetricCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { RiskBadge } from "../components/shared/RiskBadge";
import { formatCurrency, formatDateTime } from "../lib/utils";

const RISK_COLORS = {
  Low: "#10b981",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const PIPELINE_COLOR = "#3b82f6";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { metrics, pipeline, riskDistribution, recentApplications, recentActivity } = data;

  const metricCards = [
    {
      title: "Total Applications",
      value: metrics.total,
      icon: FileText,
      iconColor: "text-brand-600",
      trend: "up" as const,
      trendValue: "+12 this month",
    },
    {
      title: "Pending Review",
      value: metrics.pendingReview,
      icon: Clock,
      iconColor: "text-amber-600",
      trend: "up" as const,
      trendValue: "+3 since yesterday",
    },
    {
      title: "Under Verification",
      value: metrics.underVerification,
      icon: ClipboardCheck,
      iconColor: "text-violet-600",
    },
    {
      title: "Approved",
      value: metrics.approved,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      trend: "up" as const,
      trendValue: "+8 this month",
    },
    {
      title: "Conditional Approval",
      value: metrics.conditional,
      icon: AlertTriangle,
      iconColor: "text-orange-500",
    },
    {
      title: "Rejected",
      value: metrics.rejected,
      icon: XCircle,
      iconColor: "text-red-500",
    },
  ];

  const highRiskApps = recentApplications.filter(
    (a) => a.riskLevel === "High" || a.riskLevel === "Critical"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Credit Operations Dashboard</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Overview as of {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            &nbsp;·&nbsp;
            <span className="text-amber-600 font-medium">Demo Data</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/applications/create")}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricCards.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            icon={m.icon}
            iconColor={m.iconColor}
            trend={m.trend}
            trendValue={m.trendValue}
            onClick={() => navigate("/applications")}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pipeline chart */}
        <div className="section-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Application Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">Applications by stage · Demo Data</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pipeline} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="count" fill={PIPELINE_COLOR} radius={[4, 4, 0, 0]} name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk distribution */}
        <div className="section-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Risk Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">All active applications · Demo</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
              >
                {riskDistribution.map((entry) => (
                  <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                ))}
              </Pie>
              <Legend
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {riskDistribution.map((r) => (
              <div key={r.level} className="flex items-center justify-between bg-slate-50 rounded-md px-2 py-1.5">
                <span className="text-xs text-slate-600">{r.level}</span>
                <span className="text-xs font-semibold text-slate-900">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Applications */}
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Recent Applications</h3>
            <button
              onClick={() => navigate("/applications")}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <td>
                      <div>
                        <p className="font-medium text-slate-900 text-xs">{app.businessName}</p>
                        <p className="text-[11px] text-slate-400">{app.applicationNumber}</p>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600">{app.loanType}</td>
                    <td className="text-xs font-medium text-slate-900">
                      {formatCurrency(app.requestedAmount)}
                    </td>
                    <td>
                      <RiskBadge level={app.riskLevel} showIcon={false} />
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((log, i) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  {i < recentActivity.slice(0, 5).length - 1 && (
                    <div className="w-px h-full bg-slate-100 mt-1" />
                  )}
                </div>
                <div className="pb-3 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{log.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatDateTime(log.timestamp)} · {log.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Applications */}
      {highRiskApps.length > 0 && (
        <div className="section-card border-orange-100">
          <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-orange-100">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-900">High Risk Applications</h3>
            <span className="ml-auto text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
              Requires Attention
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {highRiskApps.map((app) => (
              <div
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="flex items-start justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg cursor-pointer hover:border-orange-200 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{app.businessName}</p>
                  <p className="text-xs text-slate-500">{app.applicationNumber} · {app.loanType}</p>
                  <p className="text-xs font-medium text-slate-700 mt-1">{formatCurrency(app.requestedAmount)}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <RiskBadge level={app.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
