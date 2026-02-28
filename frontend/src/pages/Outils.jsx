import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb, CheckCircle, DollarSign, TrendingUp,
  Calculator, Tag, ClipboardList, Clock, ArrowRight
} from 'lucide-react';

const TOOLS = [
  { icon: Lightbulb, title: "Générateur d'idées SaaS", desc: "Décris un problème, l'IA génère ton concept SaaS validé.", path: '/outils/generateur', badge: 'IA' },
  { icon: CheckCircle, title: "Validateur d'idée", desc: "Analyse si ton idée a un vrai marché avant d'investir.", path: '/outils/validateur', badge: 'IA' },
  { icon: DollarSign, title: "Calculateur MRR", desc: "Projette tes revenus récurrents selon ta stratégie de pricing.", path: '/outils/mrr', badge: null },
  { icon: TrendingUp, title: "Stratégie de sortie", desc: "Détermine la meilleure façon de monétiser ou céder ton SaaS.", path: '/outils/strategie-sortie', badge: null },
  { icon: Calculator, title: "Valorisation SaaS", desc: "Estime la valeur de revente de ton SaaS selon le marché.", path: '/outils/valorisation', badge: null },
  { icon: Tag, title: "Générateur de nom", desc: "Trouve un nom percutant et disponible pour ton SaaS.", path: '/outils/generateur-nom', badge: null },
  { icon: ClipboardList, title: "Checklist de lancement", desc: "Tous les éléments à valider avant de lancer au public.", path: '/outils/checklist', badge: null },
  { icon: Clock, title: "Estimateur de build", desc: "Combien de temps pour créer ton SaaS avec la méthode Buildrs ?", path: '/outils/estimateur', badge: null },
];

export default function Outils() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Outils & Services</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Des <strong className="text-[rgba(255,255,255,0.8)] font-semibold">outils propriétaires</strong> conçus pour maximiser tes chances de succès.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={i}
              data-testid={`tool-card-${i}`}
              onClick={() => navigate(tool.path)}
              className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 cursor-pointer card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-[8px] bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[rgba(255,255,255,0.6)]" strokeWidth={1.5} />
                </div>
                {tool.badge && (
                  <span className="badge-cream text-[10px] font-medium px-2 py-0.5 rounded-[4px]">{tool.badge}</span>
                )}
              </div>
              <h3 className="text-[#F0F0F0] font-semibold text-[14px] mb-2">{tool.title}</h3>
              <p className="text-[rgba(255,255,255,0.45)] text-[12px] leading-relaxed mb-4">{tool.desc}</p>
              <div className="flex items-center gap-1 text-[rgba(255,255,255,0.4)] group-hover:text-[#F5F0E8] text-[12px] transition-colors">
                Accéder <ArrowRight size={12} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
