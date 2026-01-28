import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AgreementPage from './pages/AgreementPage';
import Dashboard from './pages/Dashboard';
import SearchEngine from './pages/SearchEngine';
import BriefBuilder from './pages/BriefBuilder';
import Pipeline from './pages/Pipeline';
import LiveSession from './pages/LiveSession';
import Login from './pages/Login';
import Teams from './pages/Teams';
import Studio from './pages/Studio';
import ChemistryRoom from './pages/ChemistryRoom';
import VibeQuiz from './pages/VibeQuiz';
import ProfilePage from './pages/ProfilePage';
import Scheduling from './pages/Scheduling';
import EquityCalculator from './pages/EquityCalculator';
import UpgradePage from './pages/UpgradePage';
import AccountSettings from './pages/AccountSettings';
import Billing from './pages/Billing';
import AlignmentAudit from './pages/AlignmentAudit';
import AuditResults from './pages/AuditResults';
import LandingPage from './pages/LandingPage';
import Messages from './pages/Messages';
import FullReport from './pages/FullReport';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/schedule" element={<Scheduling />} />
              <Route path="/agreement/:id" element={<AgreementPage />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/search" element={<SearchEngine />} />
                      <Route path="/find-candidates" element={<SearchEngine />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/:id" element={<ProfilePage />} />
                      <Route path="/briefs" element={<BriefBuilder />} />
                      <Route path="/pipeline" element={<Pipeline />} />
                      <Route path="/session/:teamId" element={<LiveSession />} />
                      <Route path="/teams" element={<Teams />} />
                      <Route path="/studio/:teamId" element={<Studio />} />
                      <Route path="/chemistry/:sessionId" element={<ChemistryRoom />} />
                      <Route path="/quiz" element={<VibeQuiz />} />
                      <Route path="/equity" element={<EquityCalculator />} />
                      <Route path="/upgrade" element={<UpgradePage />} />
                      <Route path="/messages/:conversationId" element={<Messages />} />
                      <Route path="/settings" element={<AccountSettings />} />
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/audit" element={<AlignmentAudit />} />
                      <Route path="/audit-results" element={<AuditResults />} />
                      <Route path="/report" element={<FullReport />} />
                    </Routes>
                  </SidebarLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function Placeholder({ title }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
      <h2 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>{title}</h2>
      <p>Module under construction.</p>
    </div>
  )
}

export default App;
