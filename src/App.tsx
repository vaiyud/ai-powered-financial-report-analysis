import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import DashboardPage from "@/app/(app)/dashboard/page";
import FinancialInsightsPage from "@/app/(app)/financial-insights/page";
import RiskAnalysisPage from "@/app/(app)/risk-analysis/page";
import AIRecommendationsPage from "@/app/(app)/ai-recommendations/page";
import PrivacyCenterPage from "@/app/(app)/privacy-center/page";
import SettingsPage from "@/app/(app)/settings/page";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/financial-insights" element={<FinancialInsightsPage />} />
        <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
        <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
        <Route path="/privacy-center" element={<PrivacyCenterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
