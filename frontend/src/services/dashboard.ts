import { mockDelay } from "./api";
import {
  mockMetrics,
  mockPipelineData,
  mockRiskDistribution,
  mockApplications,
  mockRecentActivity,
} from "../data/mockData";
import type { DashboardMetrics, PipelineDataPoint, RiskDistribution, Application, AuditLog } from "../types";

export interface DashboardData {
  metrics: DashboardMetrics;
  pipeline: PipelineDataPoint[];
  riskDistribution: RiskDistribution[];
  recentApplications: Application[];
  recentActivity: AuditLog[];
}

export async function getDashboardData(): Promise<DashboardData> {
  await mockDelay(400);
  return {
    metrics: mockMetrics,
    pipeline: mockPipelineData,
    riskDistribution: mockRiskDistribution,
    recentApplications: mockApplications.slice(0, 5),
    recentActivity: mockRecentActivity,
  };
}
