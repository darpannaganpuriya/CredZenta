import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, MapPin, User, Calendar } from "lucide-react";
import { getApplicationById } from "../services/applications";
import { StatusBadge } from "../components/shared/StatusBadge";
import { RiskBadge } from "../components/shared/RiskBadge";
import { formatCurrency, formatDate, cn } from "../lib/utils";

import { OverviewTab } from "./tabs/OverviewTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { FinancialAnalysisTab } from "./tabs/FinancialAnalysisTab";
import { RiskTab } from "./tabs/RiskTab";
import { ComplianceTab } from "./tabs/ComplianceTab";
import { ExternalIntelligenceTab } from "./tabs/ExternalIntelligenceTab";
import { CollateralTab } from "./tabs/CollateralTab";
import { VerificationTab } from "./tabs/VerificationTab";
import { AIAnalysisTab } from "./tabs/AIAnalysisTab";
import { CAMTab } from "./tabs/CAMTab";
import { AuditTrailTab } from "./tabs/AuditTrailTab";
import { useState } from "react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "financial", label: "Financial Analysis" },
  { id: "risk", label: "Risk" },
  { id: "compliance", label: "Compliance" },
  { id: "external", label: "External Intel" },
  { id: "collateral", label: "Collateral" },
  { id: "verification", label: "Verification" },
  { id: "ai", label: "AI Analysis" },
  { id: "cam", label: "CAM" },
  { id: "audit", label: "Audit Trail" },
];

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: app, isLoading, error } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-sm">Application not found</p>
        <button
          onClick={() => navigate("/applications")}
          className="mt-3 text-sm text-brand-600 hover:underline"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const riskCounts = {
    open: app.riskFlags.filter((r) => r.status === "Open").length,
  };

  const badgeCounts: Record<string, number> = {
    documents: app.documents.filter((d) => d.verificationStatus === "Review Required").length,
    risk: riskCounts.open,
    compliance: app.complianceChecks.filter((c) => c.status === "Review Required").length,
  };

  return (
    <div className="space-y-4">
      {/* Back nav */}
      <button
        onClick={() => navigate("/applications")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </button>

      {/* Application Header */}
      <div className="section-card p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400">{app.applicationNumber}</span>
                <StatusBadge status={app.status} />
                <RiskBadge level={app.riskLevel} showIcon={false} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{app.businessName}</h2>
              <p className="text-sm text-slate-500">{app.businessType} · {app.industry}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  {app.applicantName}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {app.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Submitted {formatDate(app.submittedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "Loan Amount", value: formatCurrency(app.requestedAmount), highlight: true },
              { label: "Loan Type", value: app.loanType },
              { label: "Tenure", value: `${app.tenure}M` },
              { label: "Officer", value: app.assignedOfficer },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={cn("text-base font-bold", item.highlight ? "text-brand-700" : "text-slate-900")}>
                  {item.value}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="section-card overflow-hidden">
        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 no-print">
          {TABS.map((tab) => {
            const badge = badgeCounts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-brand-600 text-brand-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white"
                )}
              >
                {tab.label}
                {badge > 0 && (
                  <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === "overview" && <OverviewTab app={app} />}
          {activeTab === "documents" && <DocumentsTab app={app} />}
          {activeTab === "financial" && <FinancialAnalysisTab app={app} />}
          {activeTab === "risk" && <RiskTab app={app} />}
          {activeTab === "compliance" && <ComplianceTab app={app} />}
          {activeTab === "external" && <ExternalIntelligenceTab app={app} />}
          {activeTab === "collateral" && <CollateralTab app={app} />}
          {activeTab === "verification" && <VerificationTab app={app} />}
          {activeTab === "ai" && <AIAnalysisTab app={app} />}
          {activeTab === "cam" && <CAMTab app={app} />}
          {activeTab === "audit" && <AuditTrailTab app={app} />}
        </div>
      </div>
    </div>
  );
}
