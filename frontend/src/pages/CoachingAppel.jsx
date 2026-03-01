import React, { useState } from 'react';
import { Target, TrendingUp, Zap, Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Vision stratégique claire',
    desc: 'Comprends exactement quoi faire, dans quel ordre, et pourquoi — avec un regard externe expert.',
  },
  {
    icon: TrendingUp,
    title: "Plan d'action sur-mesure",
    desc: "Ressors avec des étapes concrètes, adaptées à ton contexte et tes objectifs réels.",
  },
  {
    icon: Zap,
    title: 'Décisions optimisées',
    desc: "Évite les erreurs coûteuses sur l'exécution grâce à une expertise terrain directe.",
  },
];

const COACHES = [
  {
    name: 'Alfred Orsini',
    role: 'Fondateur Buildrs · Expert SaaS IA',
    price: '120',
    duration: '1h00',
    bio: "Fondateur de Buildrs Lab, Alfred t'accompagne de l'idée au premier client. Spécialisé en SaaS IA, validation rapide et stratégie de monétisation. Plus de 50 builders accompagnés.",
    avatar: 'AO',
    specialties: ['SaaS IA', 'Validation', 'Monétisation', 'Growth'],
    calUrl: 'https://app.cal.com/alfred-orsini',
  },
];

export default function CoachingAppel() {
  const [currentCoach, setCurrentCoach] = useState(0);
  const [showCal, setShowCal] = useState(false);

  const coach = COACHES[currentCoach];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Buildrs Hotline</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Réservez un appel 1:1 avec l'un de nos experts
          </p>
        </div>
        <span className="flex items-center gap-2 text-[13px] font-semibold px-3.5 py-2 rounded-[8px] bg-[#141414] border border-[#222222] text-[#F0F0F0] flex-shrink-0">
          <Clock size={13} className="text-[rgba(255,255,255,0.4)]" />
          1h00 &middot; {coach.price}€
        </span>
      </div>

      {/* Value props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-[#141414] border border-[#222222] rounded-[12px] p-5">
              <div className="w-9 h-9 rounded-[8px] bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] flex items-center justify-center mb-3">
                <Icon size={16} className="text-[#3B82F6]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[#F0F0F0] font-semibold text-[14px] mb-1.5">{f.title}</h3>
              <p className="text-[rgba(255,255,255,0.45)] text-[12px] leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Coaches section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#F0F0F0] font-semibold text-[18px]">Nos coachs</h2>
          <span className="text-[13px] font-semibold px-3 py-1 rounded-[6px] bg-[#141414] border border-[#222222] text-[rgba(255,255,255,0.65)]">
            {coach.price}€ / session
          </span>
        </div>

        {/* Coach card */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-6">
          {/* Navigation arrows for multiple coaches */}
          {COACHES.length > 1 && (
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setCurrentCoach(prev => (prev - 1 + COACHES.length) % COACHES.length)}
                className="p-1.5 rounded-[6px] border border-[#222222] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] hover:border-[#2A2A2A] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentCoach(prev => (prev + 1) % COACHES.length)}
                className="p-1.5 rounded-[6px] border border-[#222222] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] hover:border-[#2A2A2A] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          <div className="flex items-start gap-5 mb-5">
            <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] font-bold text-[20px] flex-shrink-0">
              {coach.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[#F0F0F0] font-semibold text-[17px]">{coach.name}</h3>
                  <p className="text-[rgba(255,255,255,0.4)] text-[12px] mt-0.5">{coach.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#F0F0F0] font-bold text-[22px]">{coach.price}€</div>
                  <div className="text-[rgba(255,255,255,0.35)] text-[11px]">{coach.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {coach.specialties.map((sp, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[rgba(59,130,246,0.08)] text-[#3B82F6] border border-[rgba(59,130,246,0.18)]"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-relaxed mb-5">{coach.bio}</p>

          {/* Carousel dots */}
          {COACHES.length > 1 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              {COACHES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentCoach(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentCoach
                      ? 'w-4 h-1.5 bg-[#F0F0F0]'
                      : 'w-1.5 h-1.5 bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.4)]'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            data-testid={`book-coach-${currentCoach}`}
            onClick={() => setShowCal(true)}
            className="btn-cream w-full flex items-center justify-center gap-2 text-[13px]"
          >
            Réserver avec {coach.name.split(' ')[0]} →
          </button>
        </div>
      </div>

      {/* Booking / Cal embed */}
      <div className="bg-[#141414] border border-[#222222] rounded-[12px] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#222222] flex items-center justify-between">
          <h3 className="text-[#F0F0F0] font-semibold text-[14px] flex items-center gap-2">
            <Clock size={14} className="text-[rgba(255,255,255,0.4)]" strokeWidth={1.5} />
            Calendrier de réservation
          </h3>
          <a
            href={coach.calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12px] text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.65)] transition-colors"
          >
            Ouvrir dans Cal.com <ExternalLink size={11} />
          </a>
        </div>

        {showCal ? (
          <div style={{ height: '520px' }}>
            <iframe
              src={`${coach.calUrl}?embed=true&theme=dark`}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Réserver un appel"
              className="bg-[#141414]"
            />
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center gap-4 p-6">
            <div className="text-center">
              <p className="text-[rgba(255,255,255,0.3)] text-[13px] mb-1">
                Cliquez sur "Réserver" pour afficher les disponibilités
              </p>
              <p className="text-[rgba(255,255,255,0.18)] text-[12px]">Synchronisé avec Google Calendar</p>
            </div>
            <button onClick={() => setShowCal(true)} className="btn-secondary text-[12px]">
              Afficher le calendrier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
