import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import DepartmentEventsPage from "./pages/DepartmentEventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import QueueMonitoringDashboard from "./components/QueueMonitoringDashboard";
import { RegistrationForm } from "./components/RegistrationForm";
import { Navbar, FooterLanding } from "./components/landing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RegistrationForm onBack={() => navigate('/')} />
      <FooterLanding compact />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SpeedInsights />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/department/:deptId" element={<DepartmentEventsPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/department/:deptId/event/:eventId" element={<EventDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/queuedata" element={
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Queue Monitoring Dashboard</h1>
                  <p className="text-gray-600">Monitor registration queue status and processing</p>
                </div>
                <QueueMonitoringDashboard />
              </div>
            </div>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
