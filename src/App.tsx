
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Progress from '@/pages/Progress';
import Quiz from '@/pages/Quiz';
import Learn from '@/pages/Learn';
import '@/lib/analytics';
import KanaLearning from '@/pages/KanaLearning';
import Achievements from '@/pages/Achievements';
import { pageViewed } from '@/lib/analytics-generated';
import { pageViewed } from '@/lib/analytics-generated';

// Track page_viewed
pageViewed();
// Track page_viewed
pageViewed();
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:kanaType" element={<KanaLearning />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
