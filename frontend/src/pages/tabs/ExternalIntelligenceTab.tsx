import { Building2, Users, Globe, AlertTriangle, Info } from "lucide-react";
import type { ApplicationDetails } from "../../types";

interface ExternalIntelligenceTabProps {
  app: ApplicationDetails;
}

// Mock external intelligence data — clearly labeled as demo
const mockExternalData = {
  companyOverview: {
    name: "Sharma Engineering Pvt Ltd",
    cin: "U28999MP2018PTC047832",
    registrationDate: "15 March 2018",
    status: "Active",
    type: "Private Limited Company",
    roc: "RoC — Gwalior",
    authorizedCapital: "₹25,00,000",
    paidUpCapital: "₹10,00,000",
    lastFilingDate: "30 September 2025",
  },
  directors: [
    { name: "Rajesh Sharma", din: "08123456", designation: "Managing Director", since: "March 2018", status: "Active" },
    { name: "Sunita Sharma", din: "08123457", designation: "Director", since: "March 2018", status: "Active" },
  ],
  publicRiskIndicators: [
    { indicator: "Loan Default History", status: "None found (Demo)", severity: "low" },
    { indicator: "Willful Defaulter List", status: "Not listed (Demo)", severity: "low" },
    { indicator: "CIBIL Defaulter", status: "Not found (Demo)", severity: "low" },
    { indicator: "Criminal Cases (Directors)", status: "None found (Demo)", severity: "low" },
  ],
  litigationIndicators: {
    civilCases: "0 (Demo Data)",
    criminalCases: "0 (Demo Data)",
    taxDisputes: "None found (Demo)",
    labourCases: "None found (Demo)",
  },
  gstStatus: {
    gstin: "23AABCS1234D1Z5",
    status: "Active",
    registrationDate: "April 2018",
    lastReturn: "March 2025",
    annualReturns: "Filed (Demo)",
  },
};

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="section-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function ExternalIntelligenceTab({ app }: ExternalIntelligenceTabProps) {
  const ext = mockExternalData;

  return (
    <div className="space-y-5 tab-content">
      {/* Demo banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Demo / Mock Data</p>
          <p className="text-xs text-amber-700 mt-1">
            All external intelligence data shown here is sample/mock data for demonstration purposes only.
            IntelliCredit does not claim live connectivity to MCA21, CIBIL, RBI, SEBI, or government portals.
            Real integrations will be configured per institution requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Company Overview */}
        <SectionCard title="Company Overview" icon={Building2}>
          <dl className="space-y-2">
            {Object.entries(ext.companyOverview).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <dt className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                <dd className={`text-xs font-medium ${key === "status" && val === "Active" ? "text-emerald-600" : "text-slate-800"}`}>
                  {val}
                </dd>
              </div>
            ))}
          </dl>
        </SectionCard>

        {/* GST Status */}
        <SectionCard title="GST Registration Status (Demo)" icon={Globe}>
          <dl className="space-y-2">
            {Object.entries(ext.gstStatus).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <dt className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                <dd className={`text-xs font-medium ${key === "status" && val === "Active" ? "text-emerald-600" : "text-slate-800"}`}>
                  {val}
                </dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>

      {/* Directors */}
      <SectionCard title="Director Information (Demo)" icon={Users}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Director Name</th>
                <th>DIN</th>
                <th>Designation</th>
                <th>Director Since</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ext.directors.map((d) => (
                <tr key={d.din}>
                  <td className="text-xs font-medium text-slate-900">{d.name}</td>
                  <td className="text-xs font-mono text-slate-500">{d.din}</td>
                  <td className="text-xs text-slate-600">{d.designation}</td>
                  <td className="text-xs text-slate-600">{d.since}</td>
                  <td>
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Public Risk Indicators */}
      <SectionCard title="Public Risk Indicators (Demo)" icon={AlertTriangle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ext.publicRiskIndicators.map((item) => (
            <div
              key={item.indicator}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                item.severity === "low"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                item.severity === "low" ? "bg-emerald-500" : "bg-red-500"
              }`} />
              <div>
                <p className="text-xs font-semibold text-slate-800">{item.indicator}</p>
                <p className="text-xs text-slate-600 mt-0.5">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
          <Info className="w-3 h-3" />
          Demo data — not a live government or credit bureau check
        </p>
      </SectionCard>

      {/* Litigation */}
      <SectionCard title="Litigation Indicators (Demo)" icon={AlertTriangle}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(ext.litigationIndicators).map(([key, val]) => (
            <div key={key} className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] font-medium text-slate-500 capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="text-xs font-semibold text-emerald-700">{val}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
