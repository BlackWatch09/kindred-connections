import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundLogo from "@/components/BackgroundLogo";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import PlacementTest from "./pages/PlacementTest";
import CoursePage from "./pages/CoursePage";
import StoryWorld from "./pages/StoryWorld";
import StoryWorldScene from "./pages/StoryWorldScene";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Admin from "./pages/Admin";
import AIHub from "./pages/AIHub";
import SirajCompanion from "@/components/SirajCompanion";

const queryClient = new QueryClient();

const Chrome = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const immersive = /^\/story\/[^/]+/.test(pathname);
  return (
    <>
      <Toaster />
      <Sonner />
      {!immersive && <BackgroundLogo />}
      {!immersive && <Navbar />}
      <main className={immersive ? "" : "relative z-10 min-h-screen"}>
        {children}
      </main>
      {!immersive && <Footer />}
      <SirajCompanion />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Chrome>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/support" element={<Support />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/admin" element={<Admin />} />

                {/* Protected — must be signed in */}
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/course/:slug"
                  element={
                    <ProtectedRoute>
                      <CoursePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn"
                  element={
                    <ProtectedRoute>
                      <Learn />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai"
                  element={
                    <ProtectedRoute>
                      <AIHub />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/placement-test"
                  element={
                    <ProtectedRoute>
                      <PlacementTest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/story"
                  element={
                    <ProtectedRoute>
                      <StoryWorld />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/story/:worldId"
                  element={
                    <ProtectedRoute>
                      <StoryWorldScene />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Chrome>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
