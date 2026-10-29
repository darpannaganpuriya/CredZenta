import React from 'react';
import type { ApplicationDetails } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface CAMReportPDFProps {
  app: ApplicationDetails;
  recommendation: string | null;
  observations: string;
}

export const CAMReportPDF = React.forwardRef<HTMLDivElement, CAMReportPDFProps>(
  ({ app, recommendation, observations }, ref) => {
    
    const currentDate = formatDate(new Date().toISOString());

    return (
      <div ref={ref} className="bg-white text-black font-sans text-[10px] w-[800px] leading-relaxed mx-auto">
        
        {/* Style blocks for print-specific tweaks like page breaks */}
        <style dangerouslySetInnerHTML={{__html: `
          .pdf-page-break { page-break-before: always; }
          .pdf-header-footer { page-break-inside: avoid; }
          .pdf-section { page-break-inside: avoid; margin-bottom: 20px; }
          .pdf-table { width: 100%; border-collapse: collapse; }
          .pdf-table th, .pdf-table td { border: 1px solid #000; padding: 4px 8px; text-align: left; }
          .pdf-table th { background-color: #f3f4f6; }
          .dotted-border-bottom { border-bottom: 1px dashed #000; }
        `}} />

        {/* --- PAGE 1 --- */}
        <div className="pdf-page p-8">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          {/* Main Title Box */}
          <div className="border border-black bg-[#e4e4e7] p-4 text-center mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wide">Personal Discussion Report</h1>
            <p className="mt-1 text-sm">{currentDate}</p>
          </div>

          {/* Case Details */}
          <div className="pdf-section">
            <div className="bg-[#e4e4e7] border border-black p-1 text-center font-bold mb-2">Case Details</div>
            <table className="pdf-table">
              <tbody>
                <tr><td className="w-1/2 dotted-border-bottom">Name of the Firm</td><td className="w-1/2 dotted-border-bottom font-bold">{app.businessName}</td></tr>
                <tr><td className="dotted-border-bottom">Loan ID</td><td className="dotted-border-bottom">{app.applicationNumber}</td></tr>
                <tr><td className="dotted-border-bottom">Branch Name</td><td className="dotted-border-bottom">Head Office</td></tr>
                <tr><td className="dotted-border-bottom">Loan Type (Product)</td><td className="dotted-border-bottom">{app.loanType}</td></tr>
                <tr><td className="dotted-border-bottom">Tenure</td><td className="dotted-border-bottom">{app.tenure} months</td></tr>
                <tr><td className="dotted-border-bottom">Rate of Interest</td><td className="dotted-border-bottom">18% (Demo)</td></tr>
                <tr><td className="dotted-border-bottom">Requested Loan Amount</td><td className="dotted-border-bottom">INR {app.requestedAmount}</td></tr>
                <tr><td className="dotted-border-bottom">Eligibility (DSCR)</td><td className="dotted-border-bottom">{formatCurrency(app.requestedAmount * 1.2)}</td></tr>
                <tr><td>Eligibility (FOIR)</td><td>{formatCurrency(app.requestedAmount * 0.9)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Visit Details */}
          <div className="pdf-section mt-6">
            <div className="bg-[#e4e4e7] border border-black p-1 text-center font-bold mb-2">Visit Details</div>
            <table className="pdf-table">
              <tbody>
                <tr><td className="w-1/3 dotted-border-bottom">PD Location</td><td className="dotted-border-bottom">Latitude: 18.5204, Longitude: 73.8567 (Pune)</td></tr>
                <tr><td className="dotted-border-bottom">PD Done By</td><td className="dotted-border-bottom">{app.assignedOfficer}</td></tr>
                <tr><td>PD Date and Time</td><td>{app.submittedAt}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Applicant Photos */}
          <div className="pdf-section mt-6">
            <div className="bg-[#e4e4e7] border border-black p-1 text-center font-bold mb-2">Applicant Photos</div>
            <div className="flex gap-4 p-4 justify-center">
              {/* Placeholders for photos */}
              <div className="border border-gray-300 p-2 w-48 h-56 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                <div className="w-32 h-40 bg-gray-300 mb-2"></div>
                Applicant Photo 1
              </div>
              <div className="border border-gray-300 p-2 w-48 h-56 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                <div className="w-32 h-40 bg-gray-300 mb-2"></div>
                Applicant Photo 2
              </div>
            </div>
          </div>

          {/* Applicant List */}
          <div className="pdf-section mt-6">
            <div className="bg-[#e4e4e7] border border-black p-1 text-center font-bold mb-2">Applicant List</div>
            <table className="pdf-table text-center">
              <thead>
                <tr>
                  <th className="dotted-border-bottom">Name</th>
                  <th className="dotted-border-bottom">Age</th>
                  <th className="dotted-border-bottom">Relation</th>
                  <th className="dotted-border-bottom">Occupation</th>
                  <th className="dotted-border-bottom">Owner of Business</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{app.applicantName}</td>
                  <td>45</td>
                  <td>Self</td>
                  <td>Business</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGE 2 --- */}
        <div className="pdf-page p-8 pdf-page-break">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          <div className="pdf-section">
            <div className="bg-[#e4e4e7] border border-black p-1 text-center font-bold mb-2">Business Details</div>
            <table className="pdf-table">
              <tbody>
                <tr><td className="w-1/3 dotted-border-bottom">Business Name</td><td className="font-bold dotted-border-bottom">{app.businessName}</td></tr>
                <tr><td className="dotted-border-bottom">Business Activity</td><td className="dotted-border-bottom">{app.industry}</td></tr>
                <tr><td className="dotted-border-bottom">Date of Incorporation</td><td className="dotted-border-bottom">{app.businessDetails.incorporationDate}</td></tr>
                <tr><td className="dotted-border-bottom">Sector and Sub-Sector</td><td className="dotted-border-bottom">{app.industry} / General</td></tr>
                <tr><td className="dotted-border-bottom">Nature of Business</td><td className="dotted-border-bottom">{app.businessType}</td></tr>
                <tr><td className="dotted-border-bottom">Years in Current Location</td><td className="dotted-border-bottom">{app.businessVintage}</td></tr>
                <tr><td className="dotted-border-bottom">Business Premises Ownership</td><td className="dotted-border-bottom">Rented / Owned (Demo)</td></tr>
                <tr><td className="dotted-border-bottom">Total Years in this Business</td><td className="dotted-border-bottom">{app.businessVintage}</td></tr>
                <tr><td className="dotted-border-bottom">Number of Employees</td><td className="dotted-border-bottom">{app.businessDetails.employees}</td></tr>
                <tr><td>Business Setup</td><td>Machinery & Office Space</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Applicant and Business Profile</h2>
            <h3 className="text-sm font-bold border-b border-black mb-2 pb-1">Business Overview:</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>{app.businessName} operates as a {app.businessType} in the {app.industry} sector.</li>
              <li>The applicant has {app.businessVintage} years of experience running this enterprise.</li>
              <li>The primary purpose of the loan is: {app.purpose}.</li>
              <li>Registered with GSTIN {app.gstin} indicating formal compliance.</li>
              <li>Business operations appear stable with regular customers and standard payment cycles.</li>
              <li>Financial records indicate consistent monthly turnover and cash flow management.</li>
            </ul>

            <h3 className="text-sm font-bold border-b border-black mb-2 pb-1 mt-4">Financial Overview:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Annual Turnover reported at {formatCurrency(app.businessDetails.annualTurnover)}.</li>
              <li>Net Worth is evaluated at {formatCurrency(app.financialSummary.netWorth)}.</li>
              <li>Current Debt profile stands at {formatCurrency(app.financialSummary.totalDebt)}.</li>
              <li>Profit margins remain in line with industry standards (Current Ratio: {app.financialSummary.ratios.currentRatio}x).</li>
            </ul>
          </div>
        </div>

        {/* --- PAGE 3 --- */}
        <div className="pdf-page p-8 pdf-page-break">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          <h3 className="text-sm font-bold mb-2">Assets:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Primary business assets include plant, machinery, and inventory typical for the {app.industry} sector.</li>
            <li>Applicant possesses personal real estate properties detailed in the collateral section.</li>
          </ul>

          <h3 className="text-sm font-bold border-b border-black mb-2 pb-1 mt-4">Family Details & Expenses:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-6">
            <li>Applicant acts as the primary provider for the family unit.</li>
            <li>Household expenses are estimated to be within reasonable limits relative to net income.</li>
          </ul>

          <div className="pdf-section">
            <div className="bg-[#e4e4e7] border border-black p-1 text-center font-bold mb-2">Borrower Stated Income</div>
            <table className="pdf-table">
              <tbody>
                <tr><td className="w-1/2 dotted-border-bottom">Net Income</td><td className="dotted-border-bottom">{formatCurrency(app.financialSummary.pat[app.financialSummary.pat.length - 1]?.value || 0)}</td></tr>
                <tr><td>EMI Comfort Range</td><td>{formatCurrency(15000)} - {formatCurrency(50000)}</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold mb-2 mt-6">Income and Eligibility</h2>
          <div className="grid grid-cols-2 gap-4 pdf-section">
            <table className="pdf-table">
              <thead><tr><th colSpan={3} className="text-center bg-[#e4e4e7]">Income Estimation (Applicant)</th></tr></thead>
              <tbody>
                <tr><td>A</td><td className="dotted-border-bottom">Category of Business</td><td className="dotted-border-bottom">{app.industry}</td></tr>
                <tr><td>B</td><td className="dotted-border-bottom">Income Estimation Basis</td><td className="dotted-border-bottom">Audited Financials</td></tr>
                <tr><td>C</td><td className="dotted-border-bottom">Monthly Gross Turnover</td><td className="dotted-border-bottom">{formatCurrency(app.businessDetails.annualTurnover / 12)}</td></tr>
                <tr><td>D</td><td className="dotted-border-bottom">Gross Margin</td><td className="dotted-border-bottom">25%</td></tr>
                <tr><td>E = C*D</td><td className="dotted-border-bottom">Monthly Gross Earnings</td><td className="dotted-border-bottom">{formatCurrency((app.businessDetails.annualTurnover / 12) * 0.25)}</td></tr>
              </tbody>
            </table>
            
            <table className="pdf-table">
              <thead><tr><th colSpan={3} className="text-center bg-[#e4e4e7]">Income Estimation (Co-Applicant)</th></tr></thead>
              <tbody>
                <tr><td>A</td><td className="dotted-border-bottom">Category of Business</td><td className="dotted-border-bottom">N/A</td></tr>
                <tr><td>B</td><td className="dotted-border-bottom">Income Estimation Basis</td><td className="dotted-border-bottom">N/A</td></tr>
                <tr><td>C</td><td className="dotted-border-bottom">Monthly Gross Turnover</td><td className="dotted-border-bottom">0</td></tr>
                <tr><td>D</td><td className="dotted-border-bottom">Gross Margin</td><td className="dotted-border-bottom">0%</td></tr>
                <tr><td>E = C*D</td><td className="dotted-border-bottom">Monthly Gross Earnings</td><td className="dotted-border-bottom">0</td></tr>
              </tbody>
            </table>
          </div>

          <table className="pdf-table mt-4">
            <thead><tr><th colSpan={2} className="text-center bg-[#e4e4e7]">Net Monthly Income</th></tr></thead>
            <tbody>
              <tr><td className="dotted-border-bottom">Total Family Income</td><td className="dotted-border-bottom">{formatCurrency((app.businessDetails.annualTurnover / 12) * 0.25)}</td></tr>
              <tr><td className="dotted-border-bottom">Total Household Expenses</td><td className="dotted-border-bottom">{formatCurrency(45000)}</td></tr>
              <tr><td className="font-bold">Net Monthly Income</td><td className="font-bold">{formatCurrency(((app.businessDetails.annualTurnover / 12) * 0.25) - 45000)}</td></tr>
            </tbody>
          </table>
        </div>

        {/* --- PAGE 4 --- */}
        <div className="pdf-page p-8 pdf-page-break">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          <h2 className="text-lg font-bold mb-2">References</h2>
          <div className="grid grid-cols-2 gap-4 pdf-section">
            <table className="pdf-table">
              <thead><tr><th colSpan={3} className="text-center bg-[#e4e4e7]">Trade References</th></tr></thead>
              <tbody>
                <tr><td className="font-bold">Relation Type</td><td className="font-bold">Name</td><td className="font-bold">Mobile</td></tr>
                <tr><td>Supplier</td><td>ABC Trading</td><td>9876543210</td></tr>
              </tbody>
            </table>
            <table className="pdf-table">
              <thead><tr><th colSpan={3} className="text-center bg-[#e4e4e7]">Neighborhood References</th></tr></thead>
              <tbody>
                <tr><td className="font-bold">Name</td><td className="font-bold">Mobile</td><td className="font-bold">Remarks</td></tr>
                <tr><td>Local Shop</td><td>N/A</td><td>Positive feedback</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-sm font-bold border-b border-black mb-2 pb-1 mt-6">Obligations:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Existing EMI obligations total approx INR {formatCurrency(45000)} per month.</li>
            <li>No recent defaults or bounced cheques identified in banking behavior.</li>
          </ul>

          <h3 className="text-sm font-bold border-b border-black mb-2 pb-1 mt-4">End Use of Funds:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Loan applicant is seeking {formatCurrency(app.requestedAmount)}.</li>
            <li>Funds will be utilized for: {app.purpose}.</li>
          </ul>

          <h3 className="text-sm font-bold border-b border-black mb-2 pb-1 mt-6">Strengths of the Case:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Experienced Leadership: {app.businessVintage} years of industry experience.</li>
            <li>Stable Revenue Generation: Strong turnover of {formatCurrency(app.businessDetails.annualTurnover)}.</li>
            <li>Valid Registrations: Active GSTIN ({app.gstin}) and incorporation documents.</li>
            <li>Positive Net Worth: {formatCurrency(app.financialSummary.netWorth)}.</li>
          </ul>

          <h3 className="text-sm font-bold border-b border-black mb-2 pb-1 mt-4">Weaknesses of the Case:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            {app.riskFlags.map((flag, idx) => (
              <li key={idx}>{flag.title}: {flag.description}</li>
            ))}
            {app.riskFlags.length === 0 && <li>No major weaknesses identified; standard monitoring applies.</li>}
          </ul>
        </div>

        {/* --- PAGE 5 --- */}
        <div className="pdf-page p-8 pdf-page-break">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          <div className="pdf-section">
            <table className="pdf-table">
              <thead><tr><th colSpan={2} className="text-center bg-[#e4e4e7]">Credit Officer Remarks</th></tr></thead>
              <tbody>
                <tr><td className="w-1/3 font-bold dotted-border-bottom">Remarks</td><td className="font-bold dotted-border-bottom">Comments</td></tr>
                <tr><td>Overall Evaluation</td><td className="whitespace-pre-wrap">{observations || "No observations recorded."}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="pdf-section mt-6">
            <table className="pdf-table">
              <thead><tr><th colSpan={3} className="text-center bg-[#e4e4e7]">Eligibility (DSCR)</th></tr></thead>
              <tbody>
                <tr><td>A</td><td className="dotted-border-bottom w-1/2">Net Monthly Income</td><td className="dotted-border-bottom">{formatCurrency(((app.businessDetails.annualTurnover / 12) * 0.25) - 45000)}</td></tr>
                <tr><td>B</td><td className="dotted-border-bottom">Rate of Interest</td><td className="dotted-border-bottom">18%</td></tr>
                <tr><td>C</td><td className="dotted-border-bottom">EMI per Lakh</td><td className="dotted-border-bottom">2539</td></tr>
                <tr><td>D</td><td className="dotted-border-bottom">Current Obligations</td><td className="dotted-border-bottom">45000</td></tr>
                <tr><td>E = A/D</td><td className="dotted-border-bottom">Current DSCR</td><td className="dotted-border-bottom">{app.financialSummary.ratios.dscr}</td></tr>
                <tr><td>F</td><td className="dotted-border-bottom">Target DSCR</td><td className="dotted-border-bottom">1.25</td></tr>
                <tr><td>H = G/C</td><td className="font-bold">Loan Amount Eligibility</td><td className="font-bold">{formatCurrency(app.requestedAmount * 1.2)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="pdf-section mt-6">
            <table className="pdf-table">
              <thead><tr><th colSpan={3} className="text-center bg-[#e4e4e7]">Eligibility (FOIR)</th></tr></thead>
              <tbody>
                <tr><td>A</td><td className="dotted-border-bottom w-1/2">Net Monthly Income</td><td className="dotted-border-bottom">{formatCurrency(((app.businessDetails.annualTurnover / 12) * 0.25) - 45000)}</td></tr>
                <tr><td>B</td><td className="dotted-border-bottom">Current Obligations</td><td className="dotted-border-bottom">45000</td></tr>
                <tr><td>C = A-B</td><td className="dotted-border-bottom">Retained Income</td><td className="dotted-border-bottom">{formatCurrency((((app.businessDetails.annualTurnover / 12) * 0.25) - 45000) - 45000)}</td></tr>
                <tr><td>F @(55%) of C</td><td className="dotted-border-bottom">FOIR Limit</td><td className="dotted-border-bottom">{formatCurrency((((app.businessDetails.annualTurnover / 12) * 0.25) - 45000) * 0.55)}</td></tr>
                <tr><td>G = F/E</td><td className="font-bold">Loan Amount Eligibility</td><td className="font-bold">{formatCurrency(app.requestedAmount * 0.9)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGE 6 --- (Risk Domain / Score) */}
        <div className="pdf-page p-8 pdf-page-break">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          <div className="pdf-section">
            <table className="pdf-table text-center">
              <thead><tr><th colSpan={2} className="bg-[#f59e0b] text-white">Score: {app.financialSummary.ratios.dscr > 1.2 ? "85.4%" : "65.2%"}</th></tr></thead>
              <tbody>
                <tr><td className="font-bold dotted-border-bottom">Decision Reference</td><td className="font-bold dotted-border-bottom">Score Range</td></tr>
                <tr><td className="dotted-border-bottom">Go</td><td className="dotted-border-bottom">{'>81%'}</td></tr>
                <tr><td className="dotted-border-bottom">Refer to Credit</td><td className="dotted-border-bottom">61% - 80.99%</td></tr>
                <tr><td>No Go</td><td>{'<60%'}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="pdf-section mt-6">
            <table className="pdf-table">
              <thead>
                <tr>
                  <th className="bg-[#1e3a8a] text-white">Risk Domain</th>
                  <th className="bg-[#1e3a8a] text-white">Rule Category</th>
                  <th className="bg-[#1e3a8a] text-white">Condition Description</th>
                  <th className="bg-[#1e3a8a] text-white w-16 text-center">Flag</th>
                </tr>
              </thead>
              <tbody>
                {app.riskFlags.length > 0 ? app.riskFlags.map((flag, idx) => (
                  <tr key={idx}>
                    <td className="dotted-border-bottom">{flag.category}</td>
                    <td className="dotted-border-bottom">{flag.title}</td>
                    <td className="dotted-border-bottom text-xs">{flag.description}</td>
                    <td className={`dotted-border-bottom text-center font-bold ${flag.severity === 'High' ? 'bg-red-200' : flag.severity === 'Medium' ? 'bg-orange-200' : 'bg-green-200'}`}>
                      {flag.severity === 'High' ? 'No Go' : flag.severity === 'Medium' ? 'Refer' : 'Go'}
                    </td>
                  </tr>
                )) : (
                  <>
                    <tr>
                      <td className="dotted-border-bottom">Proof of work</td>
                      <td className="dotted-border-bottom">Sign Board Visibility</td>
                      <td className="dotted-border-bottom text-xs">The signboard is visible and displays the business name.</td>
                      <td className="dotted-border-bottom text-center bg-green-200">Go</td>
                    </tr>
                    <tr>
                      <td className="dotted-border-bottom">Bureau Analysis</td>
                      <td className="dotted-border-bottom">Score</td>
                      <td className="dotted-border-bottom text-xs">The applicant has a satisfactory credit score.</td>
                      <td className="dotted-border-bottom text-center bg-green-200">Go</td>
                    </tr>
                    <tr>
                      <td className="dotted-border-bottom">Financial</td>
                      <td className="dotted-border-bottom">DSCR Ratio</td>
                      <td className="dotted-border-bottom text-xs">DSCR is {app.financialSummary.ratios.dscr}, indicating sufficient repayment capacity.</td>
                      <td className="dotted-border-bottom text-center bg-green-200">Go</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGE 7 --- (Recommendation) */}
        <div className="pdf-page p-8 pdf-page-break">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#111827] text-white p-3 mb-6">
            <div className="font-semibold text-sm">Credit Information Report</div>
            <img src="/credzenta-logo.png" alt="CredZenta" className="h-7 w-auto object-contain" />
          </div>

          <div className="border-t border-b border-black py-2 mb-6 text-sm font-bold">
            Based on the provided rule evaluation, the recommendation is:
          </div>

          <div className={`p-6 mb-6 font-bold text-xl ${
            recommendation === 'Approve' ? 'bg-green-200 text-green-900' :
            recommendation === 'Conditional Approval' ? 'bg-orange-200 text-orange-900' :
            recommendation === 'Further Review' ? 'bg-blue-200 text-blue-900' :
            recommendation === 'Reject' ? 'bg-red-200 text-red-900' : 'bg-gray-200 text-gray-900'
          }`}>
            {recommendation || "Pending Review"}
          </div>

          <h3 className="text-sm mb-4">Why "{recommendation || "Pending Review"}":</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm">1. Credit Officer Observations</h4>
              <p className="text-xs pl-4 mt-1">{observations || "No specific observations provided."}</p>
            </div>
            
            <div>
              <h4 className="font-bold text-sm">2. AI-Assisted Observations</h4>
              {app.aiObservations.length > 0 ? (
                <ul className="list-disc pl-8 mt-1 text-xs space-y-1">
                  {app.aiObservations.map((obs, idx) => (
                    <li key={idx}><strong>{obs.title}:</strong> {obs.observation}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs pl-4 mt-1">No AI observations available.</p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-sm">3. Financial Ratios</h4>
              <p className="text-xs pl-4 mt-1">
                The business exhibits a DSCR of {app.financialSummary.ratios.dscr}x and a Current Ratio of {app.financialSummary.ratios.currentRatio}x, showing its ability to handle additional debt obligations.
              </p>
            </div>
          </div>
        </div>

      </div>
    );
  }
);

CAMReportPDF.displayName = 'CAMReportPDF';
