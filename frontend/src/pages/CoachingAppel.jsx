import React from 'react';
import { Calendar, Clock, Target, TrendingUp, ExternalLink } from 'lucide-react';

const FEATURES = [
  { icon: Target, title: 'Vision stratégique claire', desc: 'Comprends exactement quoi faire, dans quel ordre, et pourquoi.' },
  { icon: TrendingUp, title: "Plan d'action sur-mesure", desc: "Ressors avec des étapes concrètes, adaptées à tes objectifs." },
  { icon: Clock, title: 'Décisions optimisées', desc: "Évite les erreurs coûteuses sur l'exécution." },
];

const COACHES = [
  {
    name: 'Alfred Orsini',
    role: 'Fondateur Buildrs',
    price: '120€',
    duration: '1 heure',
    bio: "Fondateur de Buildrs Lab, Alfred t'accompagne de l'idée au premier client. Spécialisé en SaaS IA, validation rapide et stratégie de monétisation.",
    avatar: 'AO',
  },
  {
    name: 'Sarah M.',
    role: 'Coach Growth',
    price: '90€',
    duration: '1 heure',
    bio: "Experte en acquisition B2B SaaS. Sarah t'aide à trouver tes premiers clients, optimiser ton pricing et structurer ta stratégie de croissance.",
    avatar: 'SM',
  },
];

export default function CoachingAppel() {
  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Appel stratégique</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Réserve un <strong className="text-[rgba(255,255,255,0.8)] font-semibold">appel individuel</strong> avec Alfred pour débloquer ton projet.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <Icon size={18} className="text-[rgba(255,255,255,0.5)] mb-3" strokeWidth={1.5} />
              <h3 className="text-[#F0F0F0] font-semibold text-[14px] mb-2">{f.title}</h3>
              <p className="text-[rgba(255,255,255,0.45)] text-[12px] leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Coaches */}
      <div className="mb-7">
        <h2 className="text-[#F0F0F0] font-semibold text-[18px] mb-4">Nos coachs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COACHES.map((coach, i) => (
            <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] font-bold text-[14px] flex-shrink-0">
                    {coach.avatar}
                  </div>
                  <div>
                    <div className="text-[#F0F0F0] font-semibold text-[14px]">{coach.name}</div>
                    <div className="text-[rgba(255,255,255,0.4)] text-[12px]">{coach.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#F0F0F0] font-bold text-[16px]">{coach.price}</div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px]">{coach.duration}</div>
                </div>
              </div>
              <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-relaxed mb-4">{coach.bio}</p>
              <button
                data-testid={`book-coach-${i}`}
                className="btn-cream w-full flex items-center justify-center gap-2 text-[13px]"
              >
                <Calendar size={14} /> Réserver un appel
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Calendly placeholder */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
        <h3 className="text-[#F0F0F0] font-semibold text-[15px] mb-4 flex items-center gap-2">
          <Calendar size={16} strokeWidth={1.5} /> Calendrier de réservation
        </h3>
        <div className="h-[200px] bg-[#1A1A1A] rounded-[8px] flex flex-col items-center justify-center gap-3">
          <ExternalLink size={24} className="text-[rgba(255,255,255,0.2)]" />
          <p className="text-[rgba(255,255,255,0.35)] text-[13px]">Intégration Calendly disponible prochainement.</p>
          <button className="btn-secondary text-[12px]">Réserver via email →</button>
        </div>
      </div>
    </div>
  );
}
