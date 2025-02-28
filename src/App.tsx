
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { DarkModeProvider } from './contexts/DarkModeContext';
import RequireAuth from './components/auth/RequireAuth';

// Pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Assessment from './pages/Assessment';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Achievements from './pages/Achievements';
import KanaLearning from './pages/KanaLearning';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/kana-learning" element={<KanaLearning />} />
            
            {/* Protected routes */}
            <Route path="/" element={<RequireAuth />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="achievements" element={<Achievements />} />
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
