import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/Toaster";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ToastProvider>
  );
}
