import React from 'react';
import { ArrowRight, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SAAS_OF_THE_WEEK = [
  {
    name: 'Notion',
    description: "L'outil de productivité qui a redéfini la gestion de connaissances en entreprise.",
    category: 'Productivité',
    initials: 'No',
    accent: '#000000',
  },
  {
    name: 'Linear',
    description: "Le tracker d'issues le plus rapide et élégant pour les équipes produit modernes.",
    category: 'Dev Tools',
    initials: 'Li',
    accent: '#5E6AD2',
  },
  {
    name: 'Loom',
    description: 'Messages vidéo asynchrones qui remplacent les réunions inutiles.',
    category: 'Communication',
    initials: 'Lo',
    accent: '#625DF5',
  },
  {
    name: 'Resend',
    description: "L'API email que les développeurs adorent — simple, puissante, bien documentée.",
    category: 'Infrastructure',
    initials: 'Re',
    accent: '#F5F0E8',
  },
];

const getDaysUntilNextMonday = () => {
  const day = new Date().getDay();
  return day === 1 ? 7 : (8 - day) % 7 || 7;
};

export default function LabNotes() {
  const { user } = useAuth();
  const isLocked = user?.plan === 'Starter';
  const daysUntilUpdate = getDaysUntilNextMonday();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[#F0F0F0] font-semibold text-[28px]">Lab Notes</h1>
            {isLocked && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px] bg-[rgba(245,240,232,0.08)] text-[#F5F0E8] border border-[rgba(245,240,232,0.15)]">
                Pro
              </span>
            )}
          </div>
          <p className="text-[rgba(255,255,255,0.5)] text-[14px] max-w-xl leading-relaxed">
            Accédez aux contenus exclusifs partagés directement depuis le laboratoire. Les coulisses réelles, les
            décisions, les chiffres.
          </p>
        </div>
      </div>

      {/* Alfred card — locked or unlocked */}
      {isLocked ? (
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-10 text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-[rgba(255,255,255,0.25)]" />
          </div>
          <h3 className="text-[#F0F0F0] font-semibold text-[17px] mb-2">Contenu Pro</h3>
          <p className="text-[rgba(255,255,255,0.45)] text-[13px] max-w-sm mx-auto mb-6 leading-relaxed">
            Les Lab Notes sont réservées aux membres Pro. Accédez aux coulisses, décisions et chiffres réels de
            Buildrs.
          </p>
          <button className="btn-cream flex items-center gap-2 mx-auto text-[13px]">Passer au plan Pro →</button>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-6 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] font-bold text-[16px] flex-shrink-0">
              AO
            </div>
            <div className="flex-1">
              <h2 className="text-[#F0F0F0] font-semibold text-[17px]">Alfred Orsini</h2>
              <p className="text-[rgba(255,255,255,0.4)] text-[12px] mt-0.5">Fondateur Buildrs · Builder SaaS IA</p>
              <p className="text-[rgba(255,255,255,0.6)] text-[13px] leading-relaxed mt-3 mb-4">
                Je partage ici les coulisses de Buildrs — les vraies décisions, les chiffres, les erreurs et les
                succès. Pas de storytelling poli, juste la réalité du terrain pour construire des SaaS IA en 2025.
              </p>
              <button className="flex items-center gap-1.5 text-[#F0F0F0] text-[13px] font-medium hover:text-[rgba(255,255,255,0.65)] transition-colors group">
                Accéder aux notes
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SaaS de la semaine */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#F0F0F0] font-semibold text-[17px]">SaaS de la semaine</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.35)] bg-[#141414] border border-[#222222] px-2.5 py-1 rounded-full">
            <RefreshCw size={10} />
            Prochaine mise à jour : dans {daysUntilUpdate} jour{daysUntilUpdate > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SAAS_OF_THE_WEEK.map((saas, i) => (
            <div
              key={i}
              className={`bg-[#141414] border border-[#222222] hover:border-[#2A2A2A] rounded-[12px] p-4 transition-all duration-200 cursor-pointer group ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <div
                className="w-10 h-10 rounded-[8px] mb-3 flex items-center justify-center text-[12px] font-bold"
                style={{
                  backgroundColor:
                    saas.accent === '#F5F0E8'
                      ? '#F5F0E8'
                      : saas.accent === '#000000'
                      ? '#2A2A2A'
                      : saas.accent + '22',
                  color:
                    saas.accent === '#F5F0E8' ? '#0A0A0A' : saas.accent === '#000000' ? '#F0F0F0' : saas.accent,
                }}
              >
                {saas.initials}
              </div>
              <h3 className="text-[#F0F0F0] font-semibold text-[13px] mb-1">{saas.name}</h3>
              <p className="text-[rgba(255,255,255,0.4)] text-[11px] leading-relaxed mb-3">{saas.description}</p>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.35)] border border-[#222222]">
                {saas.category}
              </span>
            </div>
          ))}
        </div>

        {isLocked && (
          <p className="text-center text-[rgba(255,255,255,0.25)] text-[12px] mt-4">
            Passez au plan Pro pour accéder à la sélection complète
          </p>
        )}
      </div>
    </div>
  );
}
