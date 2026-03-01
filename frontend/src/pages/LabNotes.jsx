import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';

// SaaS avec des couleurs de gradient pour simuler les screenshots
const SAAS_OF_THE_WEEK = [
  {
    name: 'Notion',
    description: "L'outil de productivité qui a redéfini la gestion de connaissances en équipe.",
    category: 'Productivité',
    gradient: 'from-[#F5F0E8] to-[#E8E0D0]',
    textColor: '#0A0A0A',
    dot: '#0A0A0A',
  },
  {
    name: 'Linear',
    description: "Le tracker d'issues le plus rapide et élégant pour les équipes produit modernes.",
    category: 'Dev Tools',
    gradient: 'from-[#5E6AD2] to-[#3B41A8]',
    textColor: '#ffffff',
    dot: '#8B93E8',
  },
  {
    name: 'Loom',
    description: 'Messages vidéo asynchrones qui remplacent les réunions et accélèrent les décisions.',
    category: 'Communication',
    gradient: 'from-[#625DF5] to-[#4035D1]',
    textColor: '#ffffff',
    dot: '#A09DF8',
  },
  {
    name: 'Resend',
    description: "L'API email que les développeurs adorent — simple, puissante, bien documentée.",
    category: 'Infrastructure',
    gradient: 'from-[#1A1A1A] to-[#2A2A2A]',
    textColor: '#ffffff',
    dot: '#F0F0F0',
  },
];

const getDaysUntilNextMonday = () => {
  const day = new Date().getDay();
  return day === 1 ? 7 : (8 - day) % 7 || 7;
};

// Mini UI mockup rendered in SVG to simulate a screenshot
function SaasCard({ saas }) {
  return (
    <div className="bg-[#141414] border border-[#222222] hover:border-[#2A2A2A] rounded-[12px] overflow-hidden transition-all duration-200 cursor-pointer group">
      {/* Fake screenshot area */}
      <div className={`relative h-[110px] bg-gradient-to-br ${saas.gradient} overflow-hidden`}>
        {/* Simulated UI elements */}
        <div className="absolute inset-0 p-3 flex flex-col gap-2 opacity-60">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-current opacity-80" style={{ color: saas.dot }}></div>
            <div className="h-1.5 rounded-full opacity-50 bg-current w-12" style={{ color: saas.textColor }}></div>
          </div>
          <div className="flex gap-1.5 flex-1">
            <div className="w-[35%] flex flex-col gap-1">
              {[60, 80, 45, 70].map((w, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full opacity-30 bg-current"
                  style={{ width: `${w}%`, color: saas.textColor }}
                ></div>
              ))}
            </div>
            <div className="flex-1 rounded-[4px] opacity-20 bg-current" style={{ color: saas.textColor }}></div>
          </div>
        </div>
        {/* Saas name overlay */}
        <div
          className="absolute bottom-2 right-3 text-[10px] font-bold opacity-70"
          style={{ color: saas.textColor }}
        >
          {saas.name}
        </div>
      </div>

      {/* Card info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-[#F0F0F0] font-semibold text-[13px]">{saas.name}</h3>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.35)] border border-[#222222] flex-shrink-0">
            {saas.category}
          </span>
        </div>
        <p className="text-[rgba(255,255,255,0.38)] text-[11px] leading-relaxed">{saas.description}</p>
      </div>
    </div>
  );
}

export default function LabNotes() {
  const daysUntilUpdate = getDaysUntilNextMonday();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-2">Buildrs Lab</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[14px] max-w-xl leading-relaxed">
          Accédez aux{' '}
          <strong className="text-[rgba(255,255,255,0.8)] font-semibold">contenus exclusifs</strong> partagés
          directement depuis le laboratoire — les coulisses réelles, les décisions, les chiffres.
          Des{' '}
          <strong className="text-[rgba(255,255,255,0.8)] font-semibold">insights stratégiques</strong> sur le{' '}
          <strong className="text-[rgba(255,255,255,0.8)] font-semibold">business</strong> pour avancer
          avec <strong className="text-[rgba(255,255,255,0.8)] font-semibold">clarté, vision et méthode</strong>.
        </p>
      </div>

      {/* Alfred card */}
      <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-6 mb-7">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex-shrink-0 border-2 border-[#2A2A2A] shadow-sm">
              <img src="https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/ac1mdrek_unnamed%20%286%29.jpg" alt="Alfred Orsini" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[#F0F0F0] font-semibold text-[18px] leading-tight">Alfred Orsini</h2>
            <p className="text-[rgba(255,255,255,0.38)] text-[12px] mt-0.5 mb-3">
              Fondateur Buildrs · Builder SaaS IA
            </p>
            <p className="text-[rgba(255,255,255,0.58)] text-[13px] leading-relaxed mb-4">
              Je partage ici les coulisses de Buildrs — les vraies décisions, les chiffres, les erreurs et les
              succès. Pas de storytelling poli, juste la réalité du terrain pour construire des SaaS IA.
            </p>
            <button className="flex items-center gap-1.5 text-[#F0F0F0] text-[13px] font-medium hover:text-[rgba(255,255,255,0.6)] transition-colors group">
              Accéder aux notes
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </div>

      {/* SaaS de la semaine */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h2 className="text-[#F0F0F0] font-semibold text-[17px] mb-1">SaaS de la semaine</h2>
            <p className="text-[rgba(255,255,255,0.35)] text-[12px]">
              {SAAS_OF_THE_WEEK.length} SaaS inspirants sélectionnés par Alfred pour booster ta créativité.
            </p>
          </div>
          <span className="flex-shrink-0 flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.32)] bg-[#141414] border border-[#222222] px-2.5 py-1.5 rounded-full">
            <RefreshCw size={10} />
            Dans {daysUntilUpdate} jour{daysUntilUpdate > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {SAAS_OF_THE_WEEK.map((saas, i) => (
            <SaasCard key={i} saas={saas} />
          ))}
        </div>
      </div>
    </div>
  );
}
