import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
import { ApplicationsPage } from "./pages/Applications";
import { ApplicationDetailsPage } from "./pages/ApplicationDetails";
import { CreateApplicationPage } from "./pages/CreateApplication";
import { DocumentsPage } from "./pages/Documents";
import { RiskPage } from "./pages/Risk";
import { VerificationPage } from "./pages/Verification";
import { ReportsPage } from "./pages/Reports";
import { AuditTrailPage } from "./pages/AuditTrail";
import { SettingsPage } from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="applications/create" element={<CreateApplicationPage />} />
            <Route path="applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="risk" element={<RiskPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit" element={<AuditTrailPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
