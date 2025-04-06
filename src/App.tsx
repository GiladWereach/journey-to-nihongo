
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { DarkModeProvider } from './contexts/DarkModeContext';
import RequireAuth from './components/auth/RequireAuth';

// Pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Progress from './pages/Progress';
import EditProfile from './pages/EditProfile';
import Assessment from './pages/Assessment';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Achievements from './pages/Achievements';
import KanaLearning from './pages/KanaLearning';
import QuickQuiz from './pages/QuickQuiz';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Learning routes (protected, but accessible for demo) */}
            <Route path="/kana-learning" element={<KanaLearning />} />
            <Route path="/quick-quiz" element={<QuickQuiz />} />
            
            {/* Protected routes */}
            <Route path="/" element={<RequireAuth />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="learn" element={<Learn />} />
              <Route path="practice" element={<Practice />} />
              <Route path="progress" element={<Progress />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="courses" element={<div>Courses Page</div>} />
              <Route path="resources" element={<div>Resources Page</div>} />
            </Route>
            
            {/* Fallback routes */}
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
