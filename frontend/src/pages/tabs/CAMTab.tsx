import { useState } from "react";
import { Download, Printer, FileText, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { ApplicationDetails } from "../../types";
import { formatCurrency, formatDateTime, cn } from "../../lib/utils";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { RiskBadge } from "../../components/shared/RiskBadge";
import { generateCAMReport } from "../../lib/generateCAMReport";

interface CAMTabProps {
  app: ApplicationDetails;
}

type Recommendation = "Approve" | "Conditional Approval" | "Further Review" | "Reject";

const REC_CONFIG: Record<Recommendation, { className: string }> = {
  Approve: { className: "bg-emerald-50 border-emerald-300 text-emerald-800" },
  "Conditional Approval": { className: "bg-amber-50 border-amber-300 text-amber-800" },
  "Further Review": { className: "bg-blue-50 border-blue-300 text-blue-800" },
  Reject: { className: "bg-red-50 border-red-300 text-red-800" },
};

function Section({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 bg-brand-600 text-white text-xs font-bold rounded-md flex items-center justify-center">
            {number}
          </span>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-5 animate-fade-in">{children}</div>}
    </div>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
          <p className="text-xs font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function CAMTab({ app }: CAMTabProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [observations, setObservations] = useState("");
  const [conditions, setConditions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerating(false);
    setGenerated(true);
  };

  const handleDownload = () => {
    const html = generateCAMReport(app, recommendation, observations, conditions);
    const printWin = window.open("", "_blank", "width=900,height=700");
    if (!printWin) {
      alert("Please allow pop-ups for this site to download the PDF.");
      return;
    }
    printWin.document.write(html);
    printWin.document.close();
  };

  return (
    <div className="space-y-4 tab-content">
      {/* CAM Header */}
      <div className="section-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Credit Appraisal Memorandum</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {app.applicationNumber} · {generated ? "Draft Generated" : "Draft"} · Demo Document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              {generating ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Generate CAM
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* CAM Sections */}
      <Section title="Applicant Details" number={1}>
        <InfoGrid items={[
          ["Name", app.applicantDetails.name],
          ["Designation", app.applicantDetails.designation],
          ["Email", app.applicantDetails.email],
          ["Phone", app.applicantDetails.phone],
          ["PAN", app.applicantDetails.pan],
          ["CIBIL Score", `${app.applicantDetails.cibilScore} (Demo)`],
        ]} />
      </Section>

      <Section title="Business Details" number={2}>
        <InfoGrid items={[
          ["Business Name", app.businessDetails.name],
          ["Type", app.businessDetails.type],
          ["Industry", app.businessDetails.industry],
          ["GSTIN", app.businessDetails.gstin],
          ["CIN", app.businessDetails.cin],
          ["Incorporated", app.businessDetails.incorporationDate],
          ["Vintage", `${app.businessDetails.businessVintage} years`],
          ["Employees", String(app.businessDetails.employees)],
          ["Annual Turnover", formatCurrency(app.businessDetails.annualTurnover)],
        ]} />
      </Section>

      <Section title="Loan Details" number={3}>
        <InfoGrid items={[
          ["Loan Type", app.loanType],
          ["Requested Amount", formatCurrency(app.requestedAmount)],
          ["Tenure", `${app.tenure} months`],
          ["Purpose", app.purpose],
          ["Status", app.status],
          ["Assigned Officer", app.assignedOfficer],
        ]} />
      </Section>

      <Section title="Financial Summary (Demo)" number={4}>
        <InfoGrid items={[
          ["Revenue FY23", formatCurrency(app.financialSummary.revenue[0]?.value || 0)],
          ["Revenue FY24", formatCurrency(app.financialSummary.revenue[1]?.value || 0)],
          ["Revenue FY25", formatCurrency(app.financialSummary.revenue[2]?.value || 0)],
          ["PAT FY25", formatCurrency(app.financialSummary.pat[2]?.value || 0)],
          ["Net Worth", formatCurrency(app.financialSummary.netWorth)],
          ["Total Debt", formatCurrency(app.financialSummary.totalDebt)],
        ]} />
      </Section>

      <Section title="Financial Ratios (Demo)" number={5}>
        <InfoGrid items={[
          ["Current Ratio", `${app.financialSummary.ratios.currentRatio}x`],
          ["Debt/Equity", `${app.financialSummary.ratios.debtToEquity}x`],
          ["DSCR", `${app.financialSummary.ratios.dscr}x`],
          ["Interest Coverage", `${app.financialSummary.ratios.interestCoverage}x`],
          ["Profit Margin", `${app.financialSummary.ratios.profitMargin}%`],
          ["Return on Equity", `${app.financialSummary.ratios.returnOnEquity}%`],
        ]} />
      </Section>

      <Section title="Document Verification" number={6}>
        <div className="space-y-2">
          {app.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <p className="text-xs text-slate-700">{doc.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{doc.category}</span>
                <span className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded",
                  doc.verificationStatus === "Verified" ? "bg-emerald-50 text-emerald-700" :
                  doc.verificationStatus === "Review Required" ? "bg-amber-50 text-amber-700" :
                  "bg-slate-50 text-slate-600"
                )}>
                  {doc.verificationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Compliance" number={7}>
        <div className="space-y-2">
          {app.complianceChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <p className="text-xs text-slate-700">{check.requirement}</p>
              <span className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                check.status === "Passed" ? "bg-emerald-50 text-emerald-700" :
                check.status === "Review Required" ? "bg-amber-50 text-amber-700" :
                check.status === "Failed" ? "bg-red-50 text-red-700" :
                "bg-slate-50 text-slate-600"
              )}>
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Risk Analysis" number={8}>
        <div className="space-y-3">
          {app.riskFlags.map((flag) => (
            <div key={flag.id} className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-slate-900">{flag.title}</p>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  flag.severity === "Low" ? "bg-emerald-100 text-emerald-700" :
                  flag.severity === "Medium" ? "bg-amber-100 text-amber-700" :
                  flag.severity === "High" ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {flag.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600">{flag.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Collateral" number={9}>
        {app.collateral.map((col) => (
          <InfoGrid key={col.id} items={[
            ["Type", col.type],
            ["Location", col.location],
            ["Estimated Value", formatCurrency(col.estimatedValue)],
            ["Valuation Value", formatCurrency(col.valuationValue)],
            ["LTV", `${col.ltv}%`],
            ["Legal Status", col.legalStatus],
          ]} />
        ))}
      </Section>

      <Section title="Verification Status" number={10}>
        <div className="space-y-2">
          {app.verificationTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <p className="text-xs text-slate-700">{task.type}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{task.assignedOfficer}</span>
                <span className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded",
                  task.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                  task.status === "In Progress" ? "bg-amber-50 text-amber-700" :
                  "bg-blue-50 text-blue-700"
                )}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AI-Assisted Observations" number={11}>
        <div className="space-y-3">
          {app.aiObservations.map((obs) => (
            <div key={obs.id} className="bg-slate-50 rounded-lg p-3 border-l-3 border-brand-400">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <p className="text-xs font-semibold text-slate-800">{obs.title}</p>
                <span className="ml-auto text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded">AI-Generated</span>
              </div>
              <p className="text-xs text-slate-600">{obs.observation}</p>
            </div>
          ))}
          <p className="text-[10px] text-slate-400">AI observations are for decision support only and do not constitute a lending decision.</p>
        </div>
      </Section>

      {/* Credit Officer Section */}
      <Section title="Credit Officer Observations" number={12}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Credit Officer's Observations & Comments
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
              placeholder="Enter your observations, analysis, and comments on this application..."
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-400 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Conditions (if Conditional Approval)
            </label>
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              rows={2}
              placeholder="List any conditions attached to the approval..."
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-400 transition-colors resize-none"
            />
          </div>
        </div>
      </Section>

      {/* Recommendation */}
      <div className="section-card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Credit Recommendation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["Approve", "Conditional Approval", "Further Review", "Reject"] as Recommendation[]).map((rec) => (
            <button
              key={rec}
              onClick={() => setRecommendation(rec)}
              className={cn(
                "border-2 rounded-xl p-4 text-xs font-semibold transition-all",
                recommendation === rec
                  ? REC_CONFIG[rec].className + " scale-[1.02] shadow-md"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {recommendation === rec && (
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1.5" />
              )}
              {rec}
            </button>
          ))}
        </div>

        {recommendation && (
          <div className={cn("mt-4 p-4 rounded-lg border-2 animate-fade-in", REC_CONFIG[recommendation].className)}>
            <p className="text-sm font-bold">Recommendation: {recommendation}</p>
            <p className="text-xs mt-1 opacity-80">
              Recorded by: Priya Mehta (Senior Credit Officer) · {formatDateTime(new Date().toISOString())}
            </p>
          </div>
        )}

        <p className="mt-4 text-[10px] text-slate-400">
          This recommendation is subject to approval by authorized credit authority as per delegation matrix. 
          All credit decisions require human authorization.
        </p>
      </div>

    </div>
  );
}
