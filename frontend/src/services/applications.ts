import { mockDelay } from "./api";
import { mockApplications, mockApplicationDetails } from "../data/mockData";
import type { Application, ApplicationDetails } from "../types";

export async function getApplications(): Promise<Application[]> {
  await mockDelay(350);
  return mockApplications;
}

export async function getApplicationById(id: string): Promise<ApplicationDetails> {
  await mockDelay(400);
  // For demo: always return the detailed mock for app-001
  // In production: fetch by id from FastAPI
  if (id === "app-001") return mockApplicationDetails;
  // Return a version of details with updated basic info for other apps
  const app = mockApplications.find((a) => a.id === id);
  if (!app) throw new Error("Application not found");
  return {
    ...mockApplicationDetails,
    ...app,
  };
}

export async function createApplication(data: Partial<Application>): Promise<Application> {
  await mockDelay(600);
  const newApp: Application = {
    id: `app-${Date.now()}`,
    applicationNumber: `IC-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`,
    applicantName: data.applicantName || "",
    businessName: data.businessName || "",
    businessType: data.businessType || "Private Limited",
    industry: data.industry || "",
    pan: data.pan || "",
    gstin: data.gstin || "",
    loanType: data.loanType || "Working Capital",
    requestedAmount: data.requestedAmount || 0,
    tenure: data.tenure || 12,
    purpose: data.purpose || "",
    status: "Draft",
    riskLevel: "Medium",
    assignedOfficer: "Priya Mehta",
    submittedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    location: data.location || "",
    businessVintage: data.businessVintage || 0,
    annualTurnover: data.annualTurnover || 0,
  };
  return newApp;
}
