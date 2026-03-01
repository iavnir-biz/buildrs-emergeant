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
    avatar: 'AO',
    avatarBg: 'from-[#F5F0E8] to-[#D8CFC4]',
    avatarText: '#0A0A0A',
    specialties: ['SaaS IA', 'Validation', 'Monétisation', 'Growth'],
    story:
      "Fondateur de Buildrs Lab, Alfred accompagne les entrepreneurs de l'idée au premier client. Expert en SaaS IA, validation rapide et stratégie de monétisation, il a déjà aidé plus de 50 builders à lancer leur produit. Avec lui, pas de théorie : juste une méthode terrain, concrète et directement actionnée.",
  },
  {
    name: 'Damien',
    slug: 'damien',
    role: 'Automation Specialist',
    avatar: 'DA',
    avatarBg: 'from-[#6366F1] to-[#4338CA]',
    avatarText: '#ffffff',
    specialties: ['Automation', 'Make', 'n8n', 'Zapier', 'Workflows'],
    story:
      "Damien est obsédé par l'automatisation. Avec plus de 7 ans à optimiser des workflows d'entreprises de toutes tailles, il transforme les tâches répétitives en systèmes intelligents. Son approche : identifier les points de friction, puis les éliminer définitivement grâce aux bons outils et à la bonne architecture.",
  },
  {
    name: 'Clara',
    slug: 'clara',
    role: 'UX-UI Specialist',
    avatar: 'CL',
    avatarBg: 'from-[#EC4899] to-[#BE185D]',
    avatarText: '#ffffff',
    specialties: ['UX Research', 'UI Design', 'Figma', 'Conversion', 'Prototyping'],
    story:
      "Clara conçoit des expériences qui convertissent. Ancienne lead designer d'une scale-up parisienne, elle maîtrise l'art de transformer des interfaces complexes en parcours fluides et intuitifs. Sa philosophie : l'UX doit être invisible — si l'utilisateur ne la remarque pas, c'est qu'elle est parfaite.",
  },
  {
    name: 'Matéo',
    slug: 'mateo',
    role: 'Brand Design Expert',
    avatar: 'MT',
    avatarBg: 'from-[#F59E0B] to-[#D97706]',
    avatarText: '#ffffff',
    specialties: ['Branding', 'Identité visuelle', 'Positionnement', 'Logo', 'Charte'],
    story:
      "Matéo crée des identités de marque qui marquent les esprits. Spécialisé dans le positionnement visuel des SaaS et startups tech, il sait traduire une vision en une esthétique cohérente, mémorable et différenciante. Travailler avec Matéo, c'est passer d'un simple produit à une vraie marque.",
  },
  {
    name: 'Marc',
    slug: 'marc',
    role: 'Vibe Coder Expert',
    avatar: 'MC',
    avatarBg: 'from-[#10B981] to-[#059669]',
    avatarText: '#ffffff',
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
  return (
    <div className="flex flex-col gap-4">
      {/* Coach card */}
      <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-6">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-[64px] h-[64px] rounded-full bg-gradient-to-br ${coach.avatarBg} flex items-center justify-center font-bold text-[18px] flex-shrink-0`}
            style={{ color: coach.avatarText }}
          >
            {coach.avatar}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-[#F0F0F0] font-semibold text-[17px] leading-tight">{coach.name}</h3>
            <p className="text-[rgba(255,255,255,0.4)] text-[12px] mt-0.5 mb-2.5">{coach.role}</p>
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
