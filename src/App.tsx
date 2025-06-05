
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Progress from '@/pages/Progress';
import RevampedProgress from '@/pages/RevampedProgress';
import EnhancedProgress from '@/pages/EnhancedProgress';
import Learn from '@/pages/Learn';
import Practice from '@/pages/Practice';
import Quiz from '@/pages/Quiz';
import QuickQuiz from '@/pages/QuickQuiz';
import TimedChallenge from '@/pages/TimedChallenge';
import WritingPractice from '@/pages/WritingPractice';
import Assessment from '@/pages/Assessment';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import ResetPassword from '@/pages/ResetPassword';
import Achievements from '@/pages/Achievements';
import KanaLearning from '@/pages/KanaLearning';
import NotFound from '@/pages/NotFound';
import RequireAuth from '@/components/auth/RequireAuth';
import './App.css';

const queryClient = new QueryClient();

// Component to conditionally render navbar and layout
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Pages that should not have the navbar and legacy layout (all TraditionalBackground pages)
  const noNavbarPages = ['/progress', '/', '/quiz', '/profile'];
  const shouldHideNavbar = noNavbarPages.includes(location.pathname);
  
  if (shouldHideNavbar) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                <Route path="/progress" element={
                  <RequireAuth>
                    <RevampedProgress />
                  </RequireAuth>
                } />
                <Route path="/progress/legacy" element={
                  <RequireAuth>
                    <Progress />
                  </RequireAuth>
                } />
                <Route path="/progress/enhanced" element={
                  <RequireAuth>
                    <EnhancedProgress />
                  </RequireAuth>
                } />
                <Route path="/learn" element={<Learn />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quick-quiz" element={<QuickQuiz />} />
                <Route path="/timed-challenge" element={<TimedChallenge />} />
                <Route path="/writing-practice" element={<WritingPractice />} />
                <Route path="/assessment" element={
                  <RequireAuth>
                    <Assessment />
                  </RequireAuth>
                } />
                <Route path="/profile" element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } />
                <Route path="/edit-profile" element={
                  <RequireAuth>
                    <EditProfile />
                  </RequireAuth>
                } />
                <Route path="/achievements" element={
                  <RequireAuth>
                    <Achievements />
                  </RequireAuth>
                } />
                <Route path="/kana-learning" element={<KanaLearning />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
            <Toaster />
          </Router>
        </DarkModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
