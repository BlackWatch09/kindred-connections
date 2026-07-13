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
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import PlacementTest from "./pages/PlacementTest";
import CoursePage from "./pages/CoursePage";
import StoryWorld from "./pages/StoryWorld";
import StoryWorldScene from "./pages/StoryWorldScene";
import NotFound from "./pages/NotFound";

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
                <Route path="/courses" element={<Courses />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/support" element={<Support />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/placement-test" element={<PlacementTest />} />
                <Route path="/course/:slug" element={<CoursePage />} />
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
