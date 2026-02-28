import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Bell, ChevronRight } from 'lucide-react';

const BREADCRUMBS = {
  '/dashboard': ['Overview', 'Accueil'],
  '/favorites': ['Overview', 'Mes favoris'],
  '/notes': ['Overview', 'Mes notes'],
  '/stats': ['Overview', 'Statistiques'],
  '/formation': ['Classroom', 'Formation'],
  '/generateur-ia': ['Classroom', 'Générateur IA'],
  '/plan-action': ['Classroom', "Plan d'action"],
  '/ressources': ['Classroom', 'Ressources'],
  '/coaching/appel': ['Coaching', 'Appel stratégique'],
  '/coaching/session': ['Coaching', 'Session live'],
  '/coaching/alfred': ['Coaching', 'Parler à Alfred'],
  '/communaute/forum': ['Communauté', 'Forum'],
  '/communaute/carte': ['Communauté', 'Carte des builders'],
  '/outils': ['Outils & Services', 'Index'],
  '/outils/generateur': ['Outils & Services', "Générateur d'idées"],
  '/outils/validateur': ['Outils & Services', "Validateur d'idée"],
  '/outils/mrr': ['Outils & Services', 'Calculateur MRR'],
  '/outils/strategie-sortie': ['Outils & Services', 'Stratégie de sortie'],
  '/outils/valorisation': ['Outils & Services', 'Valorisation SaaS'],
  '/outils/generateur-nom': ['Outils & Services', 'Générateur de nom'],
  '/outils/checklist': ['Outils & Services', 'Checklist de lancement'],
  '/outils/estimateur': ['Outils & Services', 'Estimateur de build'],
  '/parametres': ['Paramètres', 'Paramètres'],
  '/onboarding': ['Onboarding', 'Configuration'],
};

export function Topbar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumb = () => {
    const exact = BREADCRUMBS[location.pathname];
    if (exact) return exact;
    // Check for dynamic routes like /formation/:id
    for (const [path, crumb] of Object.entries(BREADCRUMBS)) {
      if (location.pathname.startsWith(path + '/')) return [crumb[0], crumb[1]];
    }
    return ['Buildrs', 'Page'];
  };

  const [group, page] = getBreadcrumb();

  return (
    <div
      data-testid="topbar"
      className="h-[60px] sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222222] flex items-center justify-between px-6"
    >
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          data-testid="sidebar-toggle"
          onClick={onToggle}
          className="text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.9)] transition-colors p-1.5 rounded-[6px] hover:bg-[rgba(255,255,255,0.06)]"
        >
          <LayoutGrid size={17} strokeWidth={1.5} />
        </button>
        <nav className="flex items-center gap-1.5 text-[14px]">
          <span className="text-[rgba(255,255,255,0.4)] font-normal">{group}</span>
          <ChevronRight size={13} className="text-[rgba(255,255,255,0.25)]" />
          <span className="text-[#F0F0F0] font-medium">{page}</span>
        </nav>
      </div>

      {/* Right: CTA + bell */}
      <div className="flex items-center gap-3">
        <button
          data-testid="referral-cta"
          className="btn-cream text-[12px] px-3 py-1.5 hidden sm:flex items-center gap-1"
          onClick={() => navigate('/parametres')}
        >
          Parraine un builder <span className="ml-0.5">→</span>
        </button>
        <button
          data-testid="notifications-bell"
          className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#222222] text-[rgba(255,255,255,0.5)] hover:text-[#F0F0F0] hover:border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors"
        >
          <Bell size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default Topbar;
