// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import Layout from './components/Layout';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Notes from './pages/Notes';
import Stats from './pages/Stats';
import Formation from './pages/Formation';
import ModuleDetail from './pages/ModuleDetail';
import GenerateurIA from './pages/GenerateurIA';
import PlanAction from './pages/PlanAction';
import Ressources from './pages/Ressources';
import CoachingAppel from './pages/CoachingAppel';
import CoachingAlfred from './pages/CoachingAlfred';
import Forum from './pages/Forum';
import CarteBuilders from './pages/CarteBuilders';
import Outils from './pages/Outils';
import Parametres from './pages/Parametres';
import ValidateurIdee from './pages/tools/ValidateurIdee';
import CalculateurMRR from './pages/tools/CalculateurMRR';
import StrategieSortie from './pages/tools/StrategieSortie';
import ValorisationSaaS from './pages/tools/ValorisationSaaS';
import GenerateurNom from './pages/tools/GenerateurNom';
import ChecklistLancement from './pages/tools/ChecklistLancement';
import EstimateurBuild from './pages/tools/EstimateurBuild';
import './App.css';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-7 h-7 border-2 border-[#F5F0E8] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[rgba(255,255,255,0.4)] text-sm">Chargement...</span>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  if (user.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRouter = () => {
  const location = useLocation();

  // Detect session_id in URL fragment synchronously - prevents race conditions
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/formation" element={<Formation />} />
                <Route path="/formation/:moduleId" element={<ModuleDetail />} />
                <Route path="/generateur-ia" element={<GenerateurIA />} />
                <Route path="/plan-action" element={<PlanAction />} />
                <Route path="/ressources" element={<Ressources />} />
                <Route path="/coaching/appel" element={<CoachingAppel />} />
                <Route path="/coaching/alfred" element={<CoachingAlfred />} />
                <Route path="/communaute/forum" element={<Forum />} />
                <Route path="/communaute/carte" element={<CarteBuilders />} />
                <Route path="/outils" element={<Outils />} />
                <Route path="/outils/generateur" element={<GenerateurIA />} />
                <Route path="/outils/validateur" element={<ValidateurIdee />} />
                <Route path="/outils/mrr" element={<CalculateurMRR />} />
                <Route path="/outils/strategie-sortie" element={<StrategieSortie />} />
                <Route path="/outils/valorisation" element={<ValorisationSaaS />} />
                <Route path="/outils/generateur-nom" element={<GenerateurNom />} />
                <Route path="/outils/checklist" element={<ChecklistLancement />} />
                <Route path="/outils/estimateur" element={<EstimateurBuild />} />
                <Route path="/parametres" element={<Parametres />} />
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
