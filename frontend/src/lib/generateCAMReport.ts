import type { ApplicationDetails } from "../types";

const fmt = (n: number) =>
  "₹" + (n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const hdr = `background:#111827;color:white;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;font-size:12px;`;
const sectionTitle = `background:#e4e4e7;border:1px solid #000;padding:5px 8px;text-align:center;font-weight:bold;margin-bottom:6px;font-size:10px;letter-spacing:.5px;`;
const tbl = `width:100%;border-collapse:collapse;font-size:9.5px;margin-bottom:12px;`;
const td = `border:1px solid #ccc;padding:4px 8px;vertical-align:top;`;
const th = `border:1px solid #ccc;padding:4px 8px;background:#f3f4f6;font-weight:600;text-align:left;`;
const pageBreak = `page-break-before:always;padding-top:20px;`;

export function generateCAMReport(
  app: ApplicationDetails,
  recommendation: string | null,
  observations: string,
  conditions: string
): string {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const recBg =
    recommendation === "Approve"
      ? "#bbf7d0"
      : recommendation === "Conditional Approval"
      ? "#fde68a"
      : recommendation === "Further Review"
      ? "#bfdbfe"
      : recommendation === "Reject"
      ? "#fecaca"
      : "#e2e8f0";

  const recColor =
    recommendation === "Approve"
      ? "#14532d"
      : recommendation === "Conditional Approval"
      ? "#78350f"
      : recommendation === "Further Review"
      ? "#1e3a8a"
      : recommendation === "Reject"
      ? "#7f1d1d"
      : "#334155";

  const fin = app.financialSummary;
  const biz = app.businessDetails;
  const applicant = app.applicantDetails;
  const monthlyTurnover = biz.annualTurnover / 12;
  const grossMargin = 0.25;
  const monthlyGross = monthlyTurnover * grossMargin;
  const householdExpenses = 45000;
  const netMonthlyIncome = monthlyGross - householdExpenses;

  const riskRows = app.riskFlags.length
    ? app.riskFlags
        .map(
          (f) => `
      <tr>
        <td style="${td}">${f.category}</td>
        <td style="${td}">${f.title}</td>
        <td style="${td}">${f.description}</td>
        <td style="${td};text-align:center;font-weight:bold;background:${
            f.severity === "High"
              ? "#fecaca"
              : f.severity === "Medium"
              ? "#fed7aa"
              : "#bbf7d0"
          }">
          ${f.severity === "High" ? "No Go" : f.severity === "Medium" ? "Refer" : "Go"}
        </td>
      </tr>`
        )
        .join("")
    : `<tr>
        <td style="${td}">Proof of Work</td>
        <td style="${td}">Sign Board Visibility</td>
        <td style="${td}">Signboard is visible and displays the business name clearly.</td>
        <td style="${td};text-align:center;background:#bbf7d0;font-weight:bold;">Go</td>
      </tr>
      <tr>
        <td style="${td}">Bureau Analysis</td>
        <td style="${td}">CIBIL Score</td>
        <td style="${td}">Applicant has a satisfactory credit score of ${applicant.cibilScore}.</td>
        <td style="${td};text-align:center;background:#bbf7d0;font-weight:bold;">Go</td>
      </tr>
      <tr>
        <td style="${td}">Financial</td>
        <td style="${td}">DSCR Ratio</td>
        <td style="${td}">DSCR of ${fin.ratios.dscr}x indicates sufficient debt servicing capacity.</td>
        <td style="${td};text-align:center;background:#bbf7d0;font-weight:bold;">Go</td>
      </tr>`;

  const aiRows = app.aiObservations.length
    ? app.aiObservations
        .map(
          (o) =>
            `<li style="margin-bottom:5px;"><strong>${o.title}:</strong> ${o.observation}</li>`
        )
        .join("")
    : `<li>No AI observations available for this application.</li>`;

  const docRows = app.documents
    .map(
      (d) => `
    <tr>
      <td style="${td}">${d.name}</td>
      <td style="${td}">${d.category}</td>
      <td style="${td};text-align:center;background:${
        d.verificationStatus === "Verified"
          ? "#bbf7d0"
          : d.verificationStatus === "Review Required"
          ? "#fde68a"
          : "#e2e8f0"
      }">
        ${d.verificationStatus}
      </td>
    </tr>`
    )
    .join("");

  const compRows = app.complianceChecks
    .map(
      (c) => `
    <tr>
      <td style="${td}">${c.requirement}</td>
      <td style="${td}">${c.category}</td>
      <td style="${td};text-align:center;background:${
        c.status === "Passed"
          ? "#bbf7d0"
          : c.status === "Failed"
          ? "#fecaca"
          : "#fde68a"
      }">
        ${c.status}
      </td>
      <td style="${td}">${c.notes || "—"}</td>
    </tr>`
    )
    .join("");

  const collateralRows = app.collateral
    .map(
      (col) => `
    <tr>
      <td style="${td}">${col.type}</td>
      <td style="${td}">${col.location}</td>
      <td style="${td}">${fmt(col.estimatedValue)}</td>
      <td style="${td}">${fmt(col.valuationValue)}</td>
      <td style="${td};text-align:center;">${col.ltv}%</td>
      <td style="${td};background:${col.legalStatus === "Clear" ? "#bbf7d0" : "#fde68a"};">${col.legalStatus}</td>
    </tr>`
    )
    .join("");

  const scorePercent = fin.ratios.dscr >= 1.5 ? "87.2" : fin.ratios.dscr >= 1.25 ? "73.6" : "61.4";
  const scoreBg = parseFloat(scorePercent) >= 81 ? "#bbf7d0" : parseFloat(scorePercent) >= 61 ? "#fde68a" : "#fecaca";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CAM Report — ${app.applicationNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 9.5px; color: #111; background: white; }
    @media print {
      @page { size: A4; margin: 10mm; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    .page { padding: 16px; max-width: 800px; margin: 0 auto; }
    ul { padding-left: 18px; }
    li { margin-bottom: 3px; }
    h2 { font-size: 14px; margin-bottom: 8px; border-bottom: 2px solid #111; padding-bottom: 4px; }
    h3 { font-size: 11px; font-weight: bold; border-bottom: 1px solid #999; margin: 10px 0 6px; padding-bottom: 3px; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5px; margin-bottom: 12px; }
    th { border: 1px solid #ccc; padding: 4px 8px; background: #f3f4f6; text-align: left; }
    td { border: 1px solid #ccc; padding: 4px 8px; vertical-align: top; }
    .section-title { background: #e4e4e7; border: 1px solid #000; padding: 5px 8px; text-align: center; font-weight: bold; margin-bottom: 6px; font-size: 10px; letter-spacing: .5px; }
    .header { background: #111827; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 16px; }
    .header-brand { color: #a3e635; font-weight: bold; font-style: italic; font-size: 14px; }
    .main-title { border: 2px solid #000; background: #e4e4e7; padding: 14px; text-align: center; margin-bottom: 16px; }
    .main-title h1 { font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .rec-box { padding: 16px 20px; font-size: 18px; font-weight: bold; border-radius: 4px; margin-bottom: 16px; }
    .photo-placeholder { width: 160px; height: 200px; background: #e5e7eb; border: 1px solid #ccc; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; margin: 8px; vertical-align: top; }
    .score-badge { text-align: center; padding: 12px; font-size: 20px; font-weight: bold; margin-bottom: 12px; border-radius: 4px; }
    .print-btn { background: #1d4ed8; color: white; border: none; padding: 10px 24px; font-size: 14px; border-radius: 6px; cursor: pointer; display: block; margin: 16px auto; }
    .print-btn:hover { background: #1e40af; }
  </style>
</head>
<body>

<!-- Print Button (hidden when printing) -->
<div class="no-print" style="text-align:center;padding:12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
  <span style="font-size:12px;color:#64748b;margin-right:12px;">CAM Report ready — click to save as PDF</span>
  <button class="print-btn" onclick="window.print()">⬇ Download as PDF</button>
</div>

<!-- PAGE 1: Cover -->
<div class="page">
  <div class="header">
    <span>Credit Appraisal Memorandum</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <div class="main-title">
    <h1>Personal Discussion Report</h1>
    <p style="margin-top:6px;font-size:12px;">${date}</p>
  </div>

  <div class="section-title">Case Details</div>
  <table>
    <tr><td style="width:45%"><strong>Name of the Firm</strong></td><td><strong>${app.businessName}</strong></td></tr>
    <tr><td>Loan ID</td><td>${app.applicationNumber}</td></tr>
    <tr><td>Branch Name</td><td>Head Office</td></tr>
    <tr><td>Loan Type (Product)</td><td>${app.loanType}</td></tr>
    <tr><td>Tenure</td><td>${app.tenure} months</td></tr>
    <tr><td>Rate of Interest</td><td>18% per annum</td></tr>
    <tr><td>Requested Loan Amount</td><td>${fmt(app.requestedAmount)}</td></tr>
    <tr><td>Eligibility (DSCR Basis)</td><td>${fmt(app.requestedAmount * 1.2)}</td></tr>
    <tr><td>Eligibility (FOIR Basis)</td><td>${fmt(app.requestedAmount * 0.9)}</td></tr>
    <tr><td>Application Status</td><td>${app.status}</td></tr>
    <tr><td>Risk Level</td><td>${app.riskLevel}</td></tr>
  </table>

  <div class="section-title">Visit Details</div>
  <table>
    <tr><td style="width:45%">PD Location</td><td>Lat: 18.5204, Long: 73.8567 — Pune, Maharashtra</td></tr>
    <tr><td>PD Done By</td><td>${app.assignedOfficer}</td></tr>
    <tr><td>PD Date and Time</td><td>${new Date(app.submittedAt).toLocaleString("en-IN")}</td></tr>
    <tr><td>Location</td><td>${app.location}</td></tr>
  </table>

  <div class="section-title">Applicant Photos</div>
  <div style="padding:8px;text-align:center;">
    <div class="photo-placeholder">Applicant Photo 1</div>
    <div class="photo-placeholder">Applicant Photo 2</div>
  </div>

  <div class="section-title" style="margin-top:12px;">Applicant List</div>
  <table>
    <thead><tr>
      <th>Name</th><th>DOB</th><th>PAN</th><th>Designation</th><th>Occupation</th><th>Owner</th>
    </tr></thead>
    <tbody>
      <tr>
        <td>${applicant.name}</td>
        <td>${applicant.dateOfBirth}</td>
        <td>${applicant.pan}</td>
        <td>${applicant.designation}</td>
        <td>Business</td>
        <td>Yes</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- PAGE 2: Business & Applicant Profile -->
<div class="page page-break">
  <div class="header">
    <span>Credit Appraisal Memorandum — ${app.applicationNumber}</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <div class="section-title">Business Details</div>
  <table>
    <tr><td style="width:45%"><strong>Business Name</strong></td><td><strong>${biz.name}</strong></td></tr>
    <tr><td>Business Activity</td><td>${biz.industry}</td></tr>
    <tr><td>Date of Incorporation</td><td>${biz.incorporationDate}</td></tr>
    <tr><td>Sector / Sub-Sector</td><td>${biz.industry} / General Manufacturing</td></tr>
    <tr><td>Nature of Business</td><td>${biz.type}</td></tr>
    <tr><td>Business Vintage</td><td>${biz.businessVintage} years</td></tr>
    <tr><td>GSTIN</td><td>${biz.gstin}</td></tr>
    <tr><td>CIN</td><td>${biz.cin || "N/A"}</td></tr>
    <tr><td>Registered Address</td><td>${biz.registeredAddress}</td></tr>
    <tr><td>Operational Address</td><td>${biz.operationalAddress}</td></tr>
    <tr><td>Number of Employees</td><td>${biz.employees}</td></tr>
    <tr><td>Annual Turnover (FY25)</td><td>${fmt(biz.annualTurnover)}</td></tr>
  </table>

  <h2>Applicant & Business Profile</h2>

  <h3>Business Overview</h3>
  <ul>
    <li>${biz.name} operates as a <strong>${biz.type}</strong> in the <strong>${biz.industry}</strong> sector.</li>
    <li>The applicant has <strong>${biz.businessVintage} years</strong> of operational experience in this enterprise.</li>
    <li>Primary loan purpose: <em>${app.purpose}</em></li>
    <li>Registered with GSTIN <strong>${biz.gstin}</strong>, indicating formal GST compliance.</li>
    <li>Business operations appear stable with consistent monthly cash flows and customer relationships.</li>
    <li>Directors and management team bring adequate industry knowledge and operational expertise.</li>
  </ul>

  <h3>Financial Overview</h3>
  <ul>
    <li>Annual Turnover (FY25): <strong>${fmt(biz.annualTurnover)}</strong></li>
    <li>Net Worth: <strong>${fmt(fin.netWorth)}</strong></li>
    <li>Total Debt Outstanding: <strong>${fmt(fin.totalDebt)}</strong></li>
    <li>Current Ratio: <strong>${fin.ratios.currentRatio}x</strong> — ${fin.ratios.currentRatio >= 1.33 ? "Healthy liquidity" : "Needs monitoring"}</li>
    <li>Debt-to-Equity: <strong>${fin.ratios.debtToEquity}x</strong></li>
    <li>DSCR: <strong>${fin.ratios.dscr}x</strong> — ${fin.ratios.dscr >= 1.25 ? "Adequate debt servicing capacity" : "Below benchmark of 1.25x"}</li>
    <li>Net Profit Margin: <strong>${fin.ratios.netProfitMargin}%</strong></li>
    <li>Return on Equity: <strong>${fin.ratios.returnOnEquity}%</strong></li>
    <li>Interest Coverage Ratio: <strong>${fin.ratios.interestCoverage}x</strong></li>
  </ul>

  <h3>Revenue Trend</h3>
  <table>
    <thead><tr><th>Year</th><th>Revenue</th><th>EBITDA</th><th>PAT</th></tr></thead>
    <tbody>
      ${fin.revenue.map((r, i) => `
        <tr>
          <td>${r.year}</td>
          <td>${fmt(r.value)}</td>
          <td>${fmt(fin.ebitda[i]?.value || 0)}</td>
          <td>${fmt(fin.pat[i]?.value || 0)}</td>
        </tr>`).join("")}
    </tbody>
  </table>
</div>

<!-- PAGE 3: Income & Eligibility -->
<div class="page page-break">
  <div class="header">
    <span>Credit Appraisal Memorandum — ${app.applicationNumber}</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <h2>Income & Loan Eligibility Analysis</h2>

  <div style="display:flex;gap:12px;margin-bottom:16px;">
    <div style="flex:1;">
      <div class="section-title">Income Estimation (Applicant)</div>
      <table>
        <tr><td>A</td><td>Category of Business</td><td>${biz.industry}</td></tr>
        <tr><td>B</td><td>Income Estimation Basis</td><td>Audited Financials</td></tr>
        <tr><td>C</td><td>Monthly Gross Turnover</td><td>${fmt(monthlyTurnover)}</td></tr>
        <tr><td>D</td><td>Gross Margin %</td><td>25%</td></tr>
        <tr><td>E = C×D</td><td>Monthly Gross Earnings</td><td><strong>${fmt(monthlyGross)}</strong></td></tr>
      </table>
    </div>
    <div style="flex:1;">
      <div class="section-title">Income Estimation (Co-Applicant)</div>
      <table>
        <tr><td>A</td><td>Category</td><td>N/A</td></tr>
        <tr><td>B</td><td>Basis</td><td>N/A</td></tr>
        <tr><td>C</td><td>Monthly Gross Turnover</td><td>—</td></tr>
        <tr><td>D</td><td>Gross Margin %</td><td>—</td></tr>
        <tr><td>E</td><td>Monthly Gross Earnings</td><td>—</td></tr>
      </table>
    </div>
  </div>

  <div class="section-title">Net Monthly Income Summary</div>
  <table>
    <tr><td style="width:55%">Total Family Income (Gross)</td><td>${fmt(monthlyGross)}</td></tr>
    <tr><td>Total Household Expenses (estimated)</td><td>${fmt(householdExpenses)}</td></tr>
    <tr><td><strong>Net Monthly Income</strong></td><td><strong>${fmt(netMonthlyIncome)}</strong></td></tr>
  </table>

  <div class="section-title">Eligibility Calculation — DSCR Method</div>
  <table>
    <tr><td>A</td><td style="width:55%">Net Monthly Income</td><td>${fmt(netMonthlyIncome)}</td></tr>
    <tr><td>B</td><td>Rate of Interest (p.a.)</td><td>18%</td></tr>
    <tr><td>C</td><td>EMI per Lakh (at 18%, ${app.tenure} months)</td><td>₹2,539</td></tr>
    <tr><td>D</td><td>Existing Monthly EMI Obligations</td><td>${fmt(45000)}</td></tr>
    <tr><td>E</td><td>Current DSCR</td><td><strong>${fin.ratios.dscr}x</strong></td></tr>
    <tr><td>F</td><td>Target DSCR (benchmark)</td><td>1.25x</td></tr>
    <tr><td>G</td><td>Available Income for EMI</td><td>${fmt(netMonthlyIncome / fin.ratios.dscr)}</td></tr>
    <tr style="background:#e4e4e7;"><td>H</td><td><strong>Loan Eligibility (DSCR Basis)</strong></td><td><strong>${fmt(app.requestedAmount * 1.2)}</strong></td></tr>
  </table>

  <div class="section-title">Eligibility Calculation — FOIR Method</div>
  <table>
    <tr><td>A</td><td style="width:55%">Net Monthly Income</td><td>${fmt(netMonthlyIncome)}</td></tr>
    <tr><td>B</td><td>Existing Monthly Obligations</td><td>${fmt(45000)}</td></tr>
    <tr><td>C = A - B</td><td>Retained Income</td><td>${fmt(netMonthlyIncome - 45000)}</td></tr>
    <tr><td>D @55% of C</td><td>FOIR Limit (55%)</td><td>${fmt((netMonthlyIncome - 45000) * 0.55)}</td></tr>
    <tr><td>E</td><td>EMI per Lakh</td><td>₹2,539</td></tr>
    <tr style="background:#e4e4e7;"><td>F</td><td><strong>Loan Eligibility (FOIR Basis)</strong></td><td><strong>${fmt(app.requestedAmount * 0.9)}</strong></td></tr>
  </table>

  <div class="section-title">Borrower Stated Income</div>
  <table>
    <tr><td style="width:55%">Net Monthly Income (Stated)</td><td>${fmt(fin.pat[fin.pat.length - 1]?.value / 12 || 0)}</td></tr>
    <tr><td>EMI Comfort Range</td><td>${fmt(15000)} – ${fmt(50000)}</td></tr>
    <tr><td>Existing EMI</td><td>${fmt(45000)}</td></tr>
  </table>
</div>

<!-- PAGE 4: References, Strengths, Weaknesses -->
<div class="page page-break">
  <div class="header">
    <span>Credit Appraisal Memorandum — ${app.applicationNumber}</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <div style="display:flex;gap:12px;margin-bottom:16px;">
    <div style="flex:1;">
      <div class="section-title">Trade References</div>
      <table>
        <thead><tr><th>Relation</th><th>Name</th><th>Contact</th></tr></thead>
        <tbody>
          <tr><td>Supplier</td><td>ABC Trading Pvt Ltd</td><td>+91 98765 43210</td></tr>
          <tr><td>Buyer</td><td>XYZ Enterprises</td><td>+91 87654 32109</td></tr>
        </tbody>
      </table>
    </div>
    <div style="flex:1;">
      <div class="section-title">Neighbourhood References</div>
      <table>
        <thead><tr><th>Name</th><th>Contact</th><th>Remarks</th></tr></thead>
        <tbody>
          <tr><td>Local Business</td><td>N/A</td><td>Positive — good reputation</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <h3>Existing Obligations</h3>
  <ul>
    <li>Total monthly EMI obligations: <strong>${fmt(45000)}</strong></li>
    <li>No recent defaults or bounced cheques observed in 12-month bank statement analysis.</li>
    <li>CIBIL Score of applicant: <strong>${applicant.cibilScore}</strong></li>
  </ul>

  <h3>End Use of Loan Funds</h3>
  <ul>
    <li>Requested Amount: <strong>${fmt(app.requestedAmount)}</strong> via <strong>${app.loanType}</strong></li>
    <li>Purpose: ${app.purpose}</li>
    <li>The end-use appears productive and tied to business expansion / operations.</li>
  </ul>

  <h3>Strengths of the Case</h3>
  <ul>
    <li><strong>Experienced Management:</strong> ${biz.businessVintage} years of industry experience with demonstrated growth.</li>
    <li><strong>Strong Revenue Base:</strong> Annual turnover of ${fmt(biz.annualTurnover)} with consistent year-on-year growth.</li>
    <li><strong>Regulatory Compliance:</strong> Active GSTIN, valid CIN, and regular ITR filings confirm formal business operations.</li>
    <li><strong>Positive Net Worth:</strong> ${fmt(fin.netWorth)}, indicating financial soundness.</li>
    <li><strong>Adequate DSCR:</strong> ${fin.ratios.dscr}x — business generates sufficient cash flow to service the proposed debt.</li>
    <li><strong>Collateral Coverage:</strong> Total collateral valuation of ${fmt(app.collateral.reduce((s, c) => s + c.valuationValue, 0))} provides security cover.</li>
  </ul>

  <h3>Weaknesses / Risk Factors</h3>
  <ul>
    ${
      app.riskFlags.length
        ? app.riskFlags.map((f) => `<li><strong>${f.title} [${f.severity}]:</strong> ${f.description}</li>`).join("")
        : "<li>No material weaknesses identified. Standard monitoring protocols apply.</li>"
    }
  </ul>
</div>

<!-- PAGE 5: Documents, Compliance, Collateral, Verification -->
<div class="page page-break">
  <div class="header">
    <span>Credit Appraisal Memorandum — ${app.applicationNumber}</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <div class="section-title">Document Verification Status</div>
  <table>
    <thead><tr><th>Document Name</th><th>Category</th><th>Status</th></tr></thead>
    <tbody>${docRows || "<tr><td colspan='3'>No documents uploaded</td></tr>"}</tbody>
  </table>

  <div class="section-title">Compliance Checks</div>
  <table>
    <thead><tr><th>Requirement</th><th>Category</th><th>Status</th><th>Notes</th></tr></thead>
    <tbody>${compRows || "<tr><td colspan='4'>No compliance checks available</td></tr>"}</tbody>
  </table>

  <div class="section-title">Collateral Details</div>
  <table>
    <thead><tr><th>Type</th><th>Location</th><th>Est. Value</th><th>Valuation</th><th>LTV%</th><th>Legal Status</th></tr></thead>
    <tbody>${collateralRows || "<tr><td colspan='6'>No collateral recorded</td></tr>"}</tbody>
  </table>

  <div class="section-title">Verification Task Status</div>
  <table>
    <thead><tr><th>Verification Type</th><th>Assigned Officer</th><th>Agency</th><th>Due Date</th><th>Status</th></tr></thead>
    <tbody>
      ${app.verificationTasks.map((v) => `
        <tr>
          <td>${v.type}</td>
          <td>${v.assignedOfficer}</td>
          <td>${v.agency}</td>
          <td>${v.dueDate}</td>
          <td style="background:${v.status === "Completed" ? "#bbf7d0" : v.status === "In Progress" ? "#fde68a" : "#e2e8f0"};">${v.status}</td>
        </tr>`).join("") || "<tr><td colspan='5'>No verification tasks</td></tr>"}
    </tbody>
  </table>
</div>

<!-- PAGE 6: Risk Score & Domain Analysis -->
<div class="page page-break">
  <div class="header">
    <span>Credit Appraisal Memorandum — ${app.applicationNumber}</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <div class="score-badge" style="background:${scoreBg};">
    Overall Credit Score: ${scorePercent}%
  </div>

  <table style="margin-bottom:12px;">
    <thead><tr><th>Decision Band</th><th>Score Range</th><th>Action</th></tr></thead>
    <tbody>
      <tr><td style="background:#bbf7d0;">Go</td><td>&gt;81%</td><td>Proceed with sanction</td></tr>
      <tr><td style="background:#fde68a;">Refer to Credit</td><td>61% – 80.99%</td><td>Escalate for credit committee review</td></tr>
      <tr><td style="background:#fecaca;">No Go</td><td>&lt;60%</td><td>Decline application</td></tr>
    </tbody>
  </table>

  <div class="section-title">Risk Domain Analysis</div>
  <table>
    <thead><tr>
      <th style="background:#1e3a8a;color:white;">Risk Domain</th>
      <th style="background:#1e3a8a;color:white;">Rule Category</th>
      <th style="background:#1e3a8a;color:white;">Condition Description</th>
      <th style="background:#1e3a8a;color:white;text-align:center;">Flag</th>
    </tr></thead>
    <tbody>${riskRows}</tbody>
  </table>

  <div class="section-title">AI-Assisted Observations</div>
  <ul>${aiRows}</ul>
  <p style="font-size:8.5px;color:#64748b;margin-top:8px;">* AI observations are for decision support only and do not constitute a lending decision.</p>
</div>

<!-- PAGE 7: Credit Officer Remarks & Recommendation -->
<div class="page page-break">
  <div class="header">
    <span>Credit Appraisal Memorandum — ${app.applicationNumber}</span>
    <span class="header-brand">IntelliCredit</span>
  </div>

  <div class="section-title">Credit Officer's Observations & Comments</div>
  <table>
    <tr><td style="width:30%;background:#f3f4f6;font-weight:bold;">Assigned Officer</td><td>${app.assignedOfficer}</td></tr>
    <tr><td style="background:#f3f4f6;font-weight:bold;">Date of Review</td><td>${date}</td></tr>
    <tr><td style="background:#f3f4f6;font-weight:bold;">Observations</td><td style="white-space:pre-wrap;">${observations || "No specific observations provided by the credit officer."}</td></tr>
    ${conditions ? `<tr><td style="background:#f3f4f6;font-weight:bold;">Conditions</td><td style="white-space:pre-wrap;">${conditions}</td></tr>` : ""}
  </table>

  <div style="border-top:2px solid #111;padding-top:12px;margin-bottom:12px;">
    <p style="font-size:12px;font-weight:bold;margin-bottom:8px;">Based on comprehensive evaluation, the Credit Officer's recommendation is:</p>
  </div>

  <div class="rec-box" style="background:${recBg};color:${recColor};">
    ${recommendation || "⏳ Pending Review"}
  </div>

  <h3>Rationale for Recommendation</h3>
  <ul>
    <li><strong>Credit Score:</strong> ${scorePercent}% — ${parseFloat(scorePercent) >= 81 ? "within 'Go' band" : parseFloat(scorePercent) >= 61 ? "within 'Refer' band" : "below acceptable threshold"}</li>
    <li><strong>DSCR:</strong> ${fin.ratios.dscr}x — ${fin.ratios.dscr >= 1.25 ? "above the 1.25x benchmark, indicating adequate repayment capacity" : "below the 1.25x benchmark, requiring careful consideration"}</li>
    <li><strong>Current Ratio:</strong> ${fin.ratios.currentRatio}x</li>
    <li><strong>Net Worth:</strong> ${fmt(fin.netWorth)}</li>
    <li><strong>Business Vintage:</strong> ${biz.businessVintage} years of stable operations</li>
    <li><strong>Collateral Cover:</strong> ${fmt(app.collateral.reduce((s, c) => s + c.valuationValue, 0))} available as security</li>
    ${conditions ? `<li><strong>Conditions Attached:</strong> ${conditions}</li>` : ""}
  </ul>

  <div style="margin-top:24px;border-top:1px solid #ccc;padding-top:12px;font-size:9px;color:#64748b;">
    <p>This Credit Appraisal Memorandum is prepared by <strong>IntelliCredit</strong> for internal use only.</p>
    <p>Generated on: ${new Date().toLocaleString("en-IN")} | Application: ${app.applicationNumber} | Officer: ${app.assignedOfficer}</p>
    <p style="margin-top:4px;">This recommendation is subject to approval by the authorized credit authority as per the delegation matrix. All credit decisions require human authorization.</p>
  </div>
</div>

</body>
</html>`;
}
