// ─── User & Auth ────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarInitials: string;
  branch: string;
}

export type UserRole =
  | "Credit Officer"
  | "Senior Credit Officer"
  | "Credit Manager"
  | "Risk Analyst"
  | "Admin";

// ─── Application ────────────────────────────────────────────────
export type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Verification"
  | "Conditional Approval"
  | "Approved"
  | "Rejected";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type LoanType =
  | "Working Capital"
  | "Term Loan"
  | "Overdraft"
  | "Letter of Credit"
  | "Bank Guarantee"
  | "Machinery Loan"
  | "Home Loan"
  | "LAP";

export type BusinessType =
  | "Private Limited"
  | "Public Limited"
  | "Partnership"
  | "Proprietorship"
  | "LLP"
  | "Society"
  | "Trust";

export interface Application {
  id: string;
  applicationNumber: string;
  applicantName: string;
  businessName: string;
  businessType: BusinessType;
  industry: string;
  pan: string;
  gstin: string;
  loanType: LoanType;
  requestedAmount: number;
  tenure: number; // months
  purpose: string;
  status: ApplicationStatus;
  riskLevel: RiskLevel;
  assignedOfficer: string;
  submittedAt: string;
  lastUpdated: string;
  location: string;
  businessVintage: number; // years
  annualTurnover: number;
}

export interface ApplicationDetails extends Application {
  applicantDetails: ApplicantDetails;
  businessDetails: BusinessDetails;
  financialSummary: FinancialSummary;
  documents: Document[];
  riskFlags: RiskFlag[];
  complianceChecks: ComplianceCheck[];
  collateral: Collateral[];
  verificationTasks: VerificationTask[];
  aiObservations: AIObservation[];
  auditLogs: AuditLog[];
}

export interface ApplicantDetails {
  name: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  pan: string;
  aadhaar: string;
  cibilScore: number;
}

export interface BusinessDetails {
  name: string;
  type: BusinessType;
  industry: string;
  pan: string;
  gstin: string;
  cin: string;
  incorporationDate: string;
  registeredAddress: string;
  operationalAddress: string;
  directors: Director[];
  employees: number;
  annualTurnover: number;
  businessVintage: number;
}

export interface Director {
  name: string;
  din: string;
  designation: string;
  pan: string;
}

// ─── Financial ──────────────────────────────────────────────────
export interface FinancialSummary {
  revenue: YearlyData[];
  ebitda: YearlyData[];
  pat: YearlyData[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  totalDebt: number;
  ratios: FinancialRatio;
  crossDocumentConsistency: CrossDocumentCheck[];
}

export interface YearlyData {
  year: string;
  value: number;
}

export interface FinancialRatio {
  currentRatio: number;
  debtToEquity: number;
  dscr: number;
  interestCoverage: number;
  profitMargin: number;
  returnOnEquity: number;
  netProfitMargin: number;
}

export interface CrossDocumentCheck {
  parameter: string;
  gstValue: number | null;
  itrValue: number | null;
  auditedValue: number | null;
  difference: number | null;
  differencePercent: number | null;
  status: "Pass" | "Review Required" | "Mismatch";
  description: string;
}

// ─── Document ───────────────────────────────────────────────────
export type DocumentCategory =
  | "KYC"
  | "GST"
  | "ITR"
  | "Bank Statements"
  | "Financial Statements"
  | "Business Documents"
  | "Collateral"
  | "Legal"
  | "Other";

export type DocumentStatus =
  | "Uploaded"
  | "Processing"
  | "Extracted"
  | "Verified"
  | "Review Required";

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  processingStatus: DocumentStatus;
  verificationStatus: DocumentStatus;
  fileSize: string;
  extractedFields: ExtractedField[];
  confidenceScore: number;
  reviewNote?: string;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  source: string;
}

// ─── Risk ────────────────────────────────────────────────────────
export type RiskCategory =
  | "Financial Risk"
  | "Document Risk"
  | "Business Risk"
  | "Compliance Risk"
  | "Collateral Risk"
  | "External Risk";

export interface RiskFlag {
  id: string;
  category: RiskCategory;
  title: string;
  severity: RiskLevel;
  description: string;
  evidence: string[];
  sourceDocuments: string[];
  recommendedAction: string;
  createdAt: string;
  status: "Open" | "Acknowledged" | "Resolved";
}

// ─── Compliance ──────────────────────────────────────────────────
export type ComplianceStatus = "Passed" | "Failed" | "Review Required" | "Not Applicable";

export interface ComplianceCheck {
  id: string;
  requirement: string;
  category: string;
  status: ComplianceStatus;
  evidence: string;
  reviewer: string;
  lastChecked: string;
  notes: string;
}

// ─── Collateral ──────────────────────────────────────────────────
export type CollateralType =
  | "Residential Property"
  | "Commercial Property"
  | "Industrial Property"
  | "Agricultural Land"
  | "Plant & Machinery"
  | "Stocks & Receivables"
  | "Fixed Deposits"
  | "Insurance Policy";

export type LegalStatus = "Clear" | "Encumbered" | "Under Review" | "Disputed";

export interface Collateral {
  id: string;
  type: CollateralType;
  description: string;
  owner: string;
  location: string;
  surveyNumber: string;
  estimatedValue: number;
  valuationValue: number;
  loanAmount: number;
  ltv: number;
  legalStatus: LegalStatus;
  valuationDate: string;
  valuedBy: string;
}

// ─── Verification ────────────────────────────────────────────────
export type VerificationType =
  | "Legal Verification"
  | "Property Valuation"
  | "Field Verification"
  | "Business Verification";

export type VerificationStatus =
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Review Required";

export interface VerificationTask {
  id: string;
  type: VerificationType;
  assignedOfficer: string;
  agency: string;
  status: VerificationStatus;
  dueDate: string;
  lastUpdated: string;
  reportAvailable: boolean;
  notes: string;
  timeline: VerificationEvent[];
}

export interface VerificationEvent {
  date: string;
  event: string;
  user: string;
}

// ─── AI Analysis ─────────────────────────────────────────────────
export interface AIObservation {
  id: string;
  category: string;
  title: string;
  observation: string;
  confidence: number;
  generatedAt: string;
  tags: string[];
}

// ─── CAM ─────────────────────────────────────────────────────────
export type CAMRecommendation =
  | "Approve"
  | "Conditional Approval"
  | "Further Review"
  | "Reject";

export interface CAM {
  id: string;
  applicationId: string;
  generatedAt: string;
  generatedBy: string;
  version: number;
  creditOfficerObservations: string;
  recommendation: CAMRecommendation | null;
  conditionsIfAny: string;
  approvedAmount: number | null;
  approvedTenure: number | null;
  approvedRate: number | null;
}

// ─── Audit ───────────────────────────────────────────────────────
export type AuditAction =
  | "Application Created"
  | "Document Uploaded"
  | "Document Extracted"
  | "Risk Flag Created"
  | "Verification Assigned"
  | "Status Changed"
  | "CAM Generated"
  | "Decision Recorded"
  | "Comment Added"
  | "Compliance Updated"
  | "AI Analysis Run";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: AuditAction;
  entity: string;
  entityId: string;
  description: string;
  status: "Success" | "Failed";
  ipAddress: string;
}

// ─── Dashboard ───────────────────────────────────────────────────
export interface DashboardMetrics {
  total: number;
  pendingReview: number;
  underVerification: number;
  approved: number;
  conditional: number;
  rejected: number;
}

export interface PipelineDataPoint {
  stage: string;
  count: number;
  amount: number;
}

export interface RiskDistribution {
  level: RiskLevel;
  count: number;
  percentage: number;
}
