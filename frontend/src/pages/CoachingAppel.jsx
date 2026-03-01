import React, { useEffect } from 'react';
import { Target, TrendingUp, Zap } from 'lucide-react';

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
    slug: 'alfred',
    role: 'Fondateur Buildrs · Expert SaaS IA',
    photo: 'https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/ac1mdrek_unnamed%20%286%29.jpg',
    price: 190,
    specialties: ['SaaS IA', 'Validation', 'Monétisation', 'Growth'],
    story:
      "Fondateur de Buildrs Lab, Alfred accompagne les entrepreneurs de l'idée au premier client. Expert en SaaS IA, validation rapide et stratégie de monétisation, il a déjà aidé plus de 50 builders à lancer leur produit. Avec lui, pas de théorie : juste une méthode terrain, concrète et directement actionnée.",
  },
  {
    name: 'Damien',
    slug: 'damien',
    role: 'Automation Specialist',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=128&h=128&q=90&crop=faces',
    price: 90,
    specialties: ['Automation', 'Make', 'n8n', 'Zapier', 'Workflows'],
    story:
      "Damien est obsédé par l'automatisation. Avec plus de 7 ans à optimiser des workflows d'entreprises de toutes tailles, il transforme les tâches répétitives en systèmes intelligents. Son approche : identifier les points de friction, puis les éliminer définitivement grâce aux bons outils et à la bonne architecture.",
  },
  {
    name: 'Clara',
    slug: 'clara',
    role: 'UX-UI Specialist',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=128&h=128&q=90&crop=faces',
    price: 90,
    specialties: ['UX Research', 'UI Design', 'Figma', 'Conversion', 'Prototyping'],
    story:
      "Clara conçoit des expériences qui convertissent. Ancienne lead designer d'une scale-up parisienne, elle maîtrise l'art de transformer des interfaces complexes en parcours fluides et intuitifs. Sa philosophie : l'UX doit être invisible — si l'utilisateur ne la remarque pas, c'est qu'elle est parfaite.",
  },
  {
    name: 'Matéo',
    slug: 'mateo',
    role: 'Brand Design Expert',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=128&h=128&q=90&crop=faces',
    price: 90,
    specialties: ['Branding', 'Identité visuelle', 'Positionnement', 'Logo', 'Charte'],
    story:
      "Matéo crée des identités de marque qui marquent les esprits. Spécialisé dans le positionnement visuel des SaaS et startups tech, il sait traduire une vision en une esthétique cohérente, mémorable et différenciante. Travailler avec Matéo, c'est passer d'un simple produit à une vraie marque.",
  },
  {
    name: 'Marc',
    slug: 'marc',
    role: 'Vibe Coder Expert',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=128&h=128&q=90&crop=faces',
    price: 90,
    specialties: ['Vibe Coding', 'Cursor', 'Claude', 'Ship fast', 'IA Dev'],
    story:
      "Marc incarne la nouvelle génération de développeurs : créatif, pragmatique, et toujours dans le flow. Expert en vibe coding avec les derniers LLMs, il t'aide à shipper plus vite avec l'IA comme co-pilote. Son mantra : le meilleur code est celui qu'on n'a pas besoin d'écrire.",
  },
];

function CalEmbed({ slug }) {
  const divId = `cal-inline-${slug}`;
  const ns = `ns-${slug}`;

  useEffect(() => {
    // Initialize Cal.com embed (idempotent — safe to call multiple times)
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    window.Cal('init', ns, { origin: 'https://app.cal.com' });
    window.Cal.ns[ns]('inline', {
      elementOrSelector: `#${divId}`,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      calLink: 'team-buildrs/30min',
    });
    window.Cal.ns[ns]('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, []);

  return (
    <div
      id={divId}
      style={{ width: '100%', height: '600px', overflow: 'scroll' }}
    />
  );
}

function CoachBlock({ coach }) {
  const isPremium = coach.price === 190;
  const priceColor = isPremium ? '#F59E0B' : '#3B82F6';
  const priceBg = isPremium ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)';
  const priceBorder = isPremium ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.18)';

  return (
    <div className="flex flex-col gap-4">
      {/* Price line above block */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#222222]" />
        <span
          className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border"
          style={{ color: priceColor, backgroundColor: priceBg, borderColor: priceBorder }}
        >
          {coach.price}€ / heure
        </span>
        <div className="h-px flex-1 bg-[#222222]" />
      </div>

      {/* Coach card */}
      <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-6">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Real photo */}
          <img
            src={coach.photo}
            alt={coach.name}
            className="w-[64px] h-[64px] rounded-full object-cover flex-shrink-0 border border-[#333333]"
          />
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[#F0F0F0] font-semibold text-[17px] leading-tight">{coach.name}</h3>
                <p className="text-[rgba(255,255,255,0.4)] text-[12px] mt-0.5 mb-2.5">{coach.role}</p>
              </div>
              {/* Price badge (right) */}
              <div
                className="flex-shrink-0 rounded-[8px] px-3 py-1.5 text-center border"
                style={{ backgroundColor: priceBg, borderColor: priceBorder }}
              >
                <div className="font-bold text-[16px] leading-tight" style={{ color: priceColor }}>
                  {coach.price}€
                </div>
                <div className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  /heure
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
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

        {/* Storytelling */}
        <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-relaxed">
          {coach.story}
        </p>
      </div>

      {/* Cal.com embed */}
      <div className="bg-[#141414] border border-[#222222] rounded-[12px] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#222222]">
          <h4 className="text-[#F0F0F0] font-semibold text-[13px]">
            Réserver un appel avec {coach.name.split(' ')[0]}
          </h4>
        </div>
        <CalEmbed slug={coach.slug} />
      </div>
    </div>
  );
}

export default function CoachingAppel() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Buildrs Hotline</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Réservez un appel 1:1 avec l'un de nos experts
        </p>
      </div>

      {/* Value props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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
      <div>
        <h2 className="text-[#F0F0F0] font-semibold text-[18px] mb-6">Nos coachs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COACHES.map(coach => (
            <CoachBlock key={coach.slug} coach={coach} />
          ))}
        </div>
      </div>
    </div>
  );
}
