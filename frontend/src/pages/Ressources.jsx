import React, { useState } from 'react';
import { Download, FileText, Video, Wrench, Star, ExternalLink } from 'lucide-react';

const RESOURCES = [
  { id: 1, type: 'template', title: 'Template de validation d\'idée', desc: 'Feuille de route pour valider ton SaaS en 48h', icon: FileText, action: 'Télécharger' },
  { id: 2, type: 'guide', title: 'Guide de pricing SaaS', desc: 'Comment fixer le bon prix pour maximiser la conversion', icon: FileText, action: 'Télécharger' },
  { id: 3, type: 'tool', title: 'Notion - Workspace Builder', desc: 'Ton espace de travail tout-en-un pour le projet', icon: Wrench, action: 'Accéder' },
  { id: 4, type: 'template', title: 'Roadmap produit 90 jours', desc: 'Planifie tes sprints et jalons clés', icon: FileText, action: 'Télécharger' },
  { id: 5, type: 'bonus', title: 'Black Book des niches SaaS', desc: '200 niches validées avec leur potentiel de marché', icon: Star, action: 'Accéder' },
  { id: 6, type: 'guide', title: 'Guide SEO pour SaaS', desc: 'Acquisition organique dès le lancement', icon: FileText, action: 'Télécharger' },
  { id: 7, type: 'tool', title: 'Stack IA recommandée', desc: 'Les 20 outils IA les plus utilisés par les builders', icon: Wrench, action: 'Accéder' },
  { id: 8, type: 'bonus', title: 'Scripts de cold outreach', desc: 'Templates email et LinkedIn pour tes premiers clients', icon: Download, action: 'Télécharger' },
];

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'template', label: 'Templates' },
  { id: 'guide', label: 'Guides' },
  { id: 'tool', label: 'Outils' },
  { id: 'bonus', label: 'Bonus' },
];

const TYPE_BADGES = {
  template: { label: 'Template', class: 'badge-neutral' },
  guide: { label: 'Guide', class: 'badge-neutral' },
  tool: { label: 'Outil', class: 'badge-cream' },
  bonus: { label: 'Bonus', class: 'badge-green' },
};

export default function Ressources() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? RESOURCES : RESOURCES.filter(r => r.type === filter);

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Ressources</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Tous les <strong className="text-[rgba(255,255,255,0.8)] font-semibold">templates, guides et outils</strong> du programme.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-6">
        {FILTERS.map(f => (
          <button
            key={f.id}
            data-testid={`filter-${f.id}`}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              filter === f.id
                ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#F0F0F0]'
                : 'bg-transparent border-[#222222] text-[rgba(255,255,255,0.45)] hover:border-[#2A2A2A]'
            }`}
          >{f.label}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(res => {
          const Icon = res.icon;
          const badge = TYPE_BADGES[res.type];
          return (
            <div key={res.id} data-testid={`resource-${res.id}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 card-hover group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-[8px] bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${badge.class} text-[10px] font-medium px-2 py-0.5 rounded-[4px]`}>{badge.label}</span>
                  </div>
                  <h3 className="text-[#F0F0F0] font-semibold text-[13px]">{res.title}</h3>
                </div>
              </div>
              <p className="text-[rgba(255,255,255,0.45)] text-[12px] mb-4 leading-relaxed">{res.desc}</p>
              <button className="flex items-center gap-1 text-[rgba(255,255,255,0.45)] hover:text-[#F5F0E8] text-[12px] transition-colors group-hover:text-[rgba(255,255,255,0.7)]">
                {res.action === 'Télécharger' ? <Download size={12} /> : <ExternalLink size={12} />}
                {res.action} &gt;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
