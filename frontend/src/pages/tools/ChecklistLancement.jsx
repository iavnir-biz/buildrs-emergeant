import React, { useState } from 'react';
import { Check, Download } from 'lucide-react';

const GROUPS = [
  {
    id: 1, title: 'Produit', items: [
      'Toutes les fonctionnalités core sont développées',
      'Onboarding utilisateur fluide (< 5 min)',
      'Mobile responsive',
      'Tests unitaires sur les fonctions critiques',
      'Gestion des erreurs et états vides',
      'Performance < 2s de chargement',
      'Backup des données configuré',
      'Monitoring (Sentry ou équivalent)',
    ]
  },
  {
    id: 2, title: 'Technique', items: [
      'Déploiement en production stable',
      'Domaine personnalisé + SSL',
      'Variables d\'environnement sécurisées',
      'Base de données en production',
      'Authentification testée',
      'Emails transactionnels configurés',
      'CORS configuré correctement',
    ]
  },
  {
    id: 3, title: 'Paiement', items: [
      'Stripe ou équivalent intégré',
      'Webhooks de paiement configurés',
      'Factures automatiques',
      'Gestion des abonnements (upgrade/downgrade)',
      'Page de tarification claire',
    ]
  },
  {
    id: 4, title: 'Marketing & Acquisition', items: [
      'Landing page avec proposition de valeur claire',
      'SEO basique (title, meta, OG)',
      'Analytics configuré (GA4 ou Plausible)',
      'Profil ProductHunt créé',
      'Annonces dans 3 communautés ciblées',
      'Email de lancement préparé',
    ]
  },
  {
    id: 5, title: 'Legal & Conformité', items: [
      'Mentions légales publiées',
      'CGV / CGU en ligne',
      'Politique de confidentialité RGPD',
      'Cookies banner si nécessaire',
    ]
  },
];

export default function ChecklistLancement() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const totalItems = GROUPS.reduce((a, g) => a + g.items.length, 0);
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const percent = Math.round(totalChecked / totalItems * 100);
  const ready = percent >= 80;

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Checklist de lancement</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Tous les <strong className="text-[rgba(255,255,255,0.8)] font-semibold">éléments à valider</strong> avant de lancer ton SaaS au public.
        </p>
      </div>

      {/* Score */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[rgba(255,255,255,0.5)] text-[13px]">Score de préparation </span>
            <span className="text-[#F0F0F0] font-bold text-[13px]">{totalChecked}/{totalItems}</span>
          </div>
          <div className="flex items-center gap-2">
            {ready ? (
              <span className="badge-green text-[12px] px-2.5 py-1 rounded-[4px] flex items-center gap-1">
                <Check size={12} /> Prêt à lancer !
              </span>
            ) : (
              <span className="text-[12px] font-medium px-2.5 py-1 rounded-[4px] bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]">
                Encore {totalItems - totalChecked} éléments
              </span>
            )}
            <button className="btn-secondary text-[12px] flex items-center gap-1.5">
              <Download size={13} /> Exporter PDF
            </button>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-5">
        {GROUPS.map(group => {
          const groupChecked = group.items.filter((_, i) => checked[`${group.id}-${i}`]).length;
          return (
            <div key={group.id} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#F0F0F0] font-semibold text-[14px]">{group.id}. {group.title}</h3>
                <span className="text-[rgba(255,255,255,0.4)] text-[12px]">{groupChecked}/{group.items.length}</span>
              </div>
              <div className="space-y-2">
                {group.items.map((item, i) => {
                  const key = `${group.id}-${i}`;
                  const isChecked = !!checked[key];
                  return (
                    <button
                      key={key}
                      data-testid={`checklist-item-${key}`}
                      onClick={() => toggle(key)}
                      className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-[6px] hover:bg-[#1A1A1A] transition-colors group"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-[#F5F0E8] border-[#F5F0E8]' : 'border-[#333333] group-hover:border-[rgba(245,240,232,0.4)]'}`}>
                        {isChecked && <Check size={10} className="text-[#0A0A0A]" />}
                      </div>
                      <span className={`text-[13px] ${isChecked ? 'line-through text-[rgba(255,255,255,0.3)]' : 'text-[rgba(255,255,255,0.7)]'}`}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
