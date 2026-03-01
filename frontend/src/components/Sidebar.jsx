import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BuildrsLogo from './Logo';
import {
  Home, Heart, FileText, BarChart2, BookOpen, Sparkles,
  CheckSquare, Bookmark, Phone, Video, MessageCircle, MapPin,
  Users, Lightbulb, CheckCircle, DollarSign, TrendingUp,
  Calculator, Tag, ClipboardList, Clock, MessageSquare,
  ExternalLink, ChevronUp, Minus, Plus, LogOut, Bot, FlaskConical
} from 'lucide-react';

const SIDEBAR_GROUPS = [
  {
    id: 'overview', label: 'Overview',
    items: [
      { icon: Home, label: 'Accueil', path: '/dashboard' },
      { icon: Heart, label: 'Mes favoris', path: '/favorites' },
      { icon: FileText, label: 'Mes notes', path: '/notes' },
      { icon: BarChart2, label: 'Statistiques', path: '/stats' },
    ]
  },
  {
    id: 'classroom', label: 'Classroom',
    items: [
      { icon: BookOpen, label: 'Formation', path: '/formation' },
      { icon: Sparkles, label: 'Générateur IA', path: '/generateur-ia' },
      { icon: CheckSquare, label: "Plan d'action", path: '/plan-action' },
      { icon: Bookmark, label: 'Ressources', path: '/ressources' },
    ]
  },
  {
    id: 'coaching', label: 'Coaching',
    items: [
      { icon: MessageCircle, label: 'Parler à un coach', path: '/coaching/tickets' },
      { icon: Phone, label: 'Réserver un appel', path: '/coaching/appel' },
      { icon: Bot, label: 'Buildrs IA', path: '/coaching/ia' },
      { icon: FlaskConical, label: 'Lab Notes', path: '/coaching/lab' },
      { icon: Video, label: 'Sessions Live', path: '/coaching/session' },
    ]
  },
  {
    id: 'communaute', label: 'Communauté',
    items: [
      { icon: MapPin, label: 'Carte des builders', path: '/communaute/carte' },
      { icon: Users, label: 'Forum', path: '/communaute/forum' },
    ]
  },
  {
    id: 'outils', label: 'Outils & Services',
    items: [
      { icon: Lightbulb, label: "Générateur d'idées", path: '/outils/generateur' },
      { icon: CheckCircle, label: "Validateur d'idée", path: '/outils/validateur' },
      { icon: DollarSign, label: 'Calculateur MRR', path: '/outils/mrr' },
      { icon: TrendingUp, label: 'Stratégie de sortie', path: '/outils/strategie-sortie' },
      { icon: Calculator, label: 'Valorisation SaaS', path: '/outils/valorisation' },
      { icon: Tag, label: 'Générateur de nom', path: '/outils/generateur-nom' },
      { icon: ClipboardList, label: 'Checklist de lancement', path: '/outils/checklist' },
      { icon: Clock, label: 'Estimateur de build', path: '/outils/estimateur' },
    ]
  },
];

export function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [expanded, setExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_groups');
      return saved ? JSON.parse(saved) : { overview: true, classroom: true, coaching: false, communaute: false, outils: false };
    } catch {
      return { overview: true, classroom: true, coaching: false, communaute: false, outils: false };
    }
  });

  useEffect(() => {
    localStorage.setItem('sidebar_groups', JSON.stringify(expanded));
  }, [expanded]);

  const toggleGroup = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (collapsed) return null;

  const initials = (user?.full_name || user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div
      data-testid="sidebar"
      className="w-[280px] fixed left-0 top-0 h-screen bg-[#0A0A0A] border-r border-[#222222] flex flex-col z-40"
    >
      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center border-b border-[#222222] flex-shrink-0">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
          <BuildrsLogo contentHeight={22} />
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.id} className="mb-1">
            <button
              data-testid={`sidebar-group-${group.id}`}
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between px-2 py-2 mb-0.5 hover:bg-transparent group"
            >
              <span className="text-[#F0F0F0] font-medium text-[12px] uppercase tracking-wider">
                {group.label}
              </span>
              {expanded[group.id]
                ? <Minus size={13} className="text-[rgba(255,255,255,0.4)]" />
                : <Plus size={13} className="text-[rgba(255,255,255,0.4)]" />
              }
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${expanded[group.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-0.5 ml-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      data-testid={`nav-${item.path.replace(/\//g, '-')}`}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[6px] text-left transition-colors duration-150 ${
                        active
                          ? 'bg-[#1A1A1A] text-[#F0F0F0]'
                          : 'text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[rgba(255,255,255,0.8)]'
                      }`}
                    >
                      <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Utility links */}
      <div className="border-t border-[#222222] px-2 pt-2 pb-1 flex-shrink-0">
        <button className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[6px] text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150">
          <MessageSquare size={14} strokeWidth={1.5} />
          <span className="text-[13px]">Contacter le support</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[6px] text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150">
          <ExternalLink size={14} strokeWidth={1.5} />
          <span className="text-[13px]">Rejoindre le Discord</span>
        </button>
      </div>

      {/* User profile */}
      <div className="border-t border-[#222222] px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <img src={user.picture} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[11px] font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[#F0F0F0] text-[13px] font-medium truncate">
                {user?.full_name || user?.name || 'Utilisateur'}
              </span>
              <span className="badge-cream text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0">
                {user?.plan || 'Starter'}
              </span>
            </div>
            <div className="text-[rgba(255,255,255,0.35)] text-[11px]">{user?.points || 0} pts builder</div>
          </div>
          <button
            data-testid="logout-btn"
            onClick={logout}
            className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] transition-colors p-1"
            title="Se déconnecter"
          >
            <LogOut size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
