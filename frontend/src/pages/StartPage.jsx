import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Beaker, Rocket, CheckCircle2, ArrowRight, Users, TrendingUp } from 'lucide-react';
import BuildrsLogo from '../components/Logo';

// Stripe payment link — remplacer par le vrai lien Stripe
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_ME';

/* ─────────────── DESIGN TOKENS (inspiré 8lab) ─────────────── */
const C = {
  bg: '#000000',
  bgAlt: '#080808',
  card: 'rgba(255,255,255,0.035)',
  cardBorder: 'rgba(255,255,255,0.08)',
  cardHover: 'rgba(255,255,255,0.06)',
  blue: '#3B82F6',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  gold: '#F59E0B',
  goldLight: '#FCD34D',
  white: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)',
  textFaint: 'rgba(255,255,255,0.25)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.12)',
};

/* Glow radial backgrounds */
const HERO_GLOW = `
  radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%),
  radial-gradient(ellipse 50% 30% at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 60%),
  radial-gradient(ellipse 40% 25% at 20% 15%, rgba(59,130,246,0.08) 0%, transparent 60%),
  #000000
`;

const SECTION_GLOW_LEFT = `
  radial-gradient(ellipse 60% 60% at -10% 50%, rgba(99,102,241,0.12) 0%, transparent 70%),
  #080808
`;

const SECTION_GLOW_RIGHT = `
  radial-gradient(ellipse 60% 60% at 110% 50%, rgba(245,158,11,0.07) 0%, transparent 70%),
  #000000
`;

const CTA_GLOW = `
  radial-gradient(ellipse 70% 60% at 50% 100%, rgba(99,102,241,0.20) 0%, transparent 70%),
  radial-gradient(ellipse 40% 30% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 60%),
  #060606
`;

/* ─────────────── FADE SECTION ─────────────── */
function FadeSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── BADGE ─────────────── */
function Badge({ children, gold = false }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
      style={gold
        ? { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)', color: C.goldLight }
        : { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.35)', color: '#A5B4FC' }
      }
    >
      {children}
    </span>
  );
}

/* ─────────────── GLASS CARD ─────────────── */
function GlassCard({ children, className = '', style = {}, glow = false }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        ...(glow ? { boxShadow: '0 0 0 1px rgba(99,102,241,0.15), 0 4px 40px rgba(99,102,241,0.08)' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────── CTA BUTTON ─────────────── */
function CTAButton({ children, className = '', large = false }) {
  const handleClick = () => window.open(STRIPE_PAYMENT_LINK, '_blank', 'noopener noreferrer');
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer ${className}`}
      style={{
        background: '#FFFFFF',
        color: '#000000',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.3), 0 8px 40px rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {children}
    </button>
  );
}

/* ─────────────── MOCKUP PLACEHOLDER ─────────────── */
function DashboardMockup({ label = 'Dashboard Buildrs', height = '360px' }) {
  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center relative overflow-hidden"
      style={{
        height,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(99,102,241,0.06) inset',
      }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
      {/* Top bar mockup */}
      <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-5 gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="ml-4 h-4 w-40 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-3 mt-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
          <Rocket size={20} style={{ color: '#A5B4FC' }} />
        </div>
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
      </div>
    </div>
  );
}

/* ─────────────── SOCIAL PROOF AVATARS ─────────────── */
function AvatarStack({ count = 5, label }) {
  const initials = ['A', 'M', 'T', 'S', 'J'];
  const colors = ['#6366F1', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {initials.slice(0, count).map((init, i) => (
          <div key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2"
            style={{ background: colors[i], ringColor: '#000' }}>
            {init}
          </div>
        ))}
      </div>
      {label && <span className="text-sm" style={{ color: C.textMuted }}>{label}</span>}
    </div>
  );
}

/* ─────────────── NAVBAR ─────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <BuildrsLogo height={32} />
        <CTAButton className="px-5 py-2.5 text-sm gap-2">
          Accéder maintenant — 37€ <ArrowRight size={14} />
        </CTAButton>
      </div>
    </nav>
  );
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden" style={{ background: HERO_GLOW }}>
      {/* Animated orb */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

      <div className="relative max-w-3xl mx-auto">
        {/* Urgency badge */}
        <FadeSection>
          <div className="flex flex-col items-center gap-3 mb-8">
            <Badge gold>
              <Zap size={12} />
              Accès Bêta Ouvert — Places Limitées
            </Badge>
            {/* Social proof */}
            <div className="flex items-center gap-2 mt-1">
              <AvatarStack count={5} />
              <span className="text-xs" style={{ color: C.textFaint }}>200+ builders ont déjà rejoint</span>
            </div>
          </div>
        </FadeSection>

        {/* H1 */}
        <FadeSection delay={0.1}>
          <h1
            className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.08] mb-6"
            style={{ color: C.white, letterSpacing: '-0.03em' }}
          >
            Trouve ton idée de SaaS.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #A5B4FC 0%, #6366F1 50%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Valide-la. Lance-la.
            </span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Sans coder. Sans budget.</span>
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              En 30 jours.
            </span>
          </h1>
        </FadeSection>

        {/* Subtitle */}
        <FadeSection delay={0.2}>
          <p className="text-base sm:text-lg leading-relaxed mb-10 mx-auto"
            style={{ color: C.textMuted, maxWidth: '580px' }}>
            Buildrs est le premier écosystème IA qui t'accompagne de l'idée au premier euro —
            grâce au vibe coding, aux agents IA, et à une méthode testée sur{' '}
            <span style={{ color: C.white, fontWeight: 600 }}>24+ projets réels.</span>
          </p>
        </FadeSection>

        {/* CTA */}
        <FadeSection delay={0.3}>
          <div className="flex flex-col items-center gap-4">
            <CTAButton className="px-9 py-4 text-[15px] gap-2">
              Accéder à Buildrs pour 37€ <ArrowRight size={15} />
            </CTAButton>
            <p className="text-xs flex items-center gap-3 flex-wrap justify-center" style={{ color: C.textFaint }}>
              <span>✓ Accès immédiat</span>
              <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
              <span>✓ Sans abonnement</span>
              <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
              <span>✓ 1 SaaS complet inclus</span>
            </p>
          </div>
        </FadeSection>

        {/* Mockup */}
        <FadeSection delay={0.45} className="mt-16">
          <div className="relative">
            {/* Glow under mockup */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }} />
            <DashboardMockup label="Aperçu du Dashboard Buildrs" height="400px" />
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 3 — OPPORTUNITÉ ─────────────── */
function Opportunite() {
  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: SECTION_GLOW_LEFT }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge>Pourquoi maintenant</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: C.white }}>
            Les micro-SaaS IA sont l'opportunité<br />la plus accessible de l'histoire.
          </h2>
        </FadeSection>

        {/* Stats */}
        <FadeSection delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-14">
            {[
              { value: '0€', label: 'Budget technique requis', glow: true },
              { value: '30 jours', label: 'Pour lancer un MVP', glow: false },
              { value: '1 personne', label: 'Suffit pour tout gérer', glow: false },
            ].map(({ value, label, glow }) => (
              <GlassCard key={label} className="p-6 text-center" glow={glow}>
                <div className="text-3xl sm:text-4xl font-extrabold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #A5B4FC, #6366F1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{value}</div>
                <div className="text-sm" style={{ color: C.textMuted }}>{label}</div>
              </GlassCard>
            ))}
          </div>
        </FadeSection>

        <FadeSection delay={0.15}>
          <div className="text-base leading-[1.9] mb-10 space-y-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <p>Pendant des années, créer un logiciel demandait des développeurs, des mois de travail, des dizaines de milliers d'euros. C'était réservé aux startups financées.</p>
            <p>Aujourd'hui, le vibe coding et les agents IA ont tout changé. Tu décris ce que tu veux construire. L'IA le construit. Tu valides. Tu lances. Tu monétises.</p>
            <p>Jensen Huang, le fondateur de Nvidia, l'a dit clairement : les prochains millionnaires seront souvent des équipes d'une seule personne, avec des agents, des logiciels, des systèmes.</p>
          </div>
        </FadeSection>

        {/* Citation */}
        <FadeSection delay={0.2}>
          <div className="rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
            {/* Left glow bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5"
              style={{ background: 'linear-gradient(180deg, transparent, #6366F1, transparent)' }} />
            <p className="text-lg font-medium italic leading-relaxed" style={{ color: C.white }}>
              "Un gamin de 15 ans peut le faire.
              Une personne de 60 ans qui vient de perdre son emploi peut le faire.
              La fenêtre est ouverte. Elle ne restera pas ouverte indéfiniment."
            </p>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 4 — PROBLÈME ─────────────── */
function Probleme() {
  const problems = [
    { icon: '🌊', title: 'Noyé sous l\'information', desc: 'YouTube, LinkedIn, Twitter — tout le monde parle d\'IA. Mais personne ne te donne une stratégie claire et actionnable.' },
    { icon: '🔧', title: 'Bloqué par la technique', desc: 'Tu penses qu\'il faut savoir coder. Qu\'il faut un développeur. Qu\'un SaaS c\'est pour les ingénieurs de la Silicon Valley.' },
    { icon: '💸', title: 'Freiné par le budget', desc: 'Tu crois qu\'il faut lever des fonds, avoir une équipe, investir des mois avant de voir le moindre résultat.' },
  ];

  return (
    <section className="py-24 px-6" style={{ background: SECTION_GLOW_RIGHT }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge>Le Problème</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: C.white }}>
            Tu vois l'opportunité.<br />Mais tu ne sais pas par où commencer.
          </h2>
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {problems.map(({ icon, title, desc }, i) => (
            <FadeSection key={title} delay={i * 0.1}>
              <GlassCard className="p-6 h-full group" style={{ transition: 'border-color 0.2s' }}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-base mb-3" style={{ color: C.white }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{desc}</p>
              </GlassCard>
            </FadeSection>
          ))}
        </div>

        <FadeSection delay={0.35}>
          <div className="text-center">
            <p className="inline-block font-bold text-base px-6 py-3 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: C.white }}>
              Ces barrières n'existent plus. Et c'est exactement ce qu'on va te prouver.
            </p>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 5 — SOLUTION ─────────────── */
function Solution() {
  const pillars = [
    { Icon: Beaker, title: 'Le Laboratoire', desc: 'Alfred crée ses propres SaaS en temps réel et documente tout. Tu vois les décisions, les chiffres, les succès et les échecs.', color: '#6366F1' },
    { icon: '🤖', title: 'Les Agents IA', desc: 'Des outils IA intégrés qui scannent Reddit, Product Hunt et les tendances pour trouver des opportunités réelles avant tout le monde.', color: '#3B82F6' },
    { Icon: Rocket, title: 'La Méthode', desc: 'De l\'idée au MVP en 30 jours. Un plan étape par étape, des outils sélectionnés, une communauté de builders qui avancent.', color: '#F59E0B' },
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: SECTION_GLOW_LEFT }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-10">
          <Badge>La Solution</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: C.white }}>
            Buildrs — L'académie des builders SaaS IA.
          </h2>
        </FadeSection>

        <FadeSection delay={0.1}>
          <p className="text-base leading-relaxed text-center mb-14"
            style={{ color: C.textMuted, maxWidth: '660px', margin: '0 auto 3.5rem' }}>
            Buildrs n'est pas une formation de plus. C'est un <strong style={{ color: C.white }}>laboratoire vivant</strong> dans lequel des entrepreneurs comme toi utilisent l'IA pour créer des actifs logiciels réels — des micro-SaaS qui génèrent des revenus récurrents, se scalent, et se revendent à des multiples élevés.
            <br /><br />
            Notre méthode a été forgée sur <strong style={{ color: C.white }}>24+ projets SaaS réels</strong>. 70% issus de commandes privées d'entreprises. Pas de la théorie. Du terrain.
          </p>
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-5">
          {pillars.map(({ Icon, icon, title, desc, color }, i) => (
            <FadeSection key={title} delay={i * 0.1}>
              <GlassCard className="p-6 h-full" style={{
                boxShadow: `0 0 0 1px ${color}18, 0 4px 40px ${color}06`,
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  {Icon ? <Icon size={18} style={{ color }} /> : <span className="text-xl">{icon}</span>}
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: C.white }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{desc}</p>
              </GlassCard>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 6 — COMMENT ÇA MARCHE ─────────────── */
function CommentCaMarche() {
  const steps = [
    { num: '01', title: 'Trouve ton idée', desc: 'Notre IA scanne Reddit, Product Hunt et les marketplaces pour identifier les problèmes non résolus dans ta niche. Tu reçois une liste d\'opportunités validées par les données du marché.', mockup: 'Interface Générateur d\'idées' },
    { num: '02', title: 'Valide en 10 minutes', desc: 'Avant de construire quoi que ce soit, tu valides. Taille du marché, concurrents, potentiel MRR, stratégie de sortie. Notre outil fait l\'analyse. Tu prends la décision.', mockup: 'Interface Validation' },
    { num: '03', title: 'Génère ton identité', desc: 'Nom, positionnement, univers visuel. L\'IA génère plusieurs options basées sur ton marché cible. Tu choisis. Tu brandises.', mockup: 'Interface Générateur de nom' },
    { num: '04', title: 'Construis avec le vibe coding', desc: 'Ton plan d\'action détaillé étape par étape. Les outils exacts à utiliser. Les prompts qui fonctionnent. Tu construis sans écrire une ligne de code.', mockup: 'Plan d\'action' },
    { num: '05', title: 'Lance et monétise', desc: 'Stripe intégré. Premier abonné. Premier euro. Et si tu veux aller plus loin — scale, revente à multiple, ou duplique dans une autre niche.', mockup: 'Dashboard' },
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-16">
          <Badge>Comment ça marche</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: C.white }}>
            De l'idée au SaaS lancé.<br />Étape par étape.
          </h2>
        </FadeSection>

        <div className="space-y-10">
          {steps.map(({ num, title, desc, mockup }, i) => (
            <FadeSection key={title} delay={i * 0.05}>
              <GlassCard className="p-6 sm:p-8">
                <div className="sm:flex gap-8 items-start">
                  {/* Number */}
                  <div className="flex-shrink-0 mb-5 sm:mb-0">
                    <span
                      className="text-5xl font-extrabold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.1))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.03em',
                      }}
                    >{num}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: C.white }}>{title}</h3>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: C.textMuted }}>{desc}</p>
                    <DashboardMockup label={mockup} height="180px" />
                  </div>
                </div>
              </GlassCard>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 7 — OFFRE ─────────────── */
function Offre() {
  const included = [
    'Accès au Générateur d\'idées SaaS IA',
    'Outil de validation marché (Reddit + Product Hunt)',
    'Générateur de nom + identité de marque',
    'Plan d\'action complet étape par étape (1 SaaS)',
    'Sélection des meilleurs outils vibe coding',
    'Accès Buildrs IA — chat pour guider ton projet',
    'Accès bêta à la plateforme Buildrs',
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: SECTION_GLOW_LEFT }}>
      <div className="max-w-5xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge gold>L'Offre Bêta</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: C.white }}>
            Tout ce qu'il te faut pour<br />lancer ton premier SaaS.
          </h2>
        </FadeSection>

        <div className="grid sm:grid-cols-2 gap-8 items-center">
          {/* Left — included */}
          <FadeSection>
            <div className="space-y-4">
              {included.map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <CheckCircle2 size={12} style={{ color: '#A5B4FC' }} />
                  </div>
                  <span className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeSection>

          {/* Right — price card with edge glow like 8lab box */}
          <FadeSection delay={0.1}>
            <div className="rounded-2xl p-px relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(245,158,11,0.3) 50%, rgba(99,102,241,0.2) 100%)',
              }}>
              <div className="rounded-[15px] p-8 text-center relative overflow-hidden"
                style={{ background: '#0A0A0A' }}>
                {/* Inner top glow */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(245,158,11,0.4), transparent)' }} />
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(10px)' }} />

                <p className="relative text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#A5B4FC' }}>
                  Accès Buildrs Starter
                </p>
                <div className="relative flex items-center justify-center gap-3 mb-1">
                  <span className="text-xl line-through" style={{ color: 'rgba(255,255,255,0.25)' }}>97€</span>
                  <span className="text-6xl font-extrabold" style={{ color: C.white, letterSpacing: '-0.03em' }}>37€</span>
                </div>
                <p className="relative text-xs mb-8 font-medium" style={{ color: C.gold }}>
                  Prix bêta — offre limitée
                </p>
                <CTAButton className="relative w-full py-4 text-base gap-2">
                  Accéder maintenant <ArrowRight size={15} />
                </CTAButton>
                <p className="relative mt-4 text-xs" style={{ color: C.textFaint }}>
                  Paiement unique · Accès immédiat · Sans abonnement
                </p>
              </div>
            </div>
          </FadeSection>
        </div>

        <FadeSection delay={0.2}>
          <div className="mt-10 pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: C.textFaint }}>
              Tu veux aller plus loin ? Formation complète, coaching individuel, accès communauté
              et tous les outils débloqués disponibles après ton accès Starter.
            </p>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 8 — ALFRED ─────────────── */
function Alfred() {
  return (
    <section className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge>Qui est derrière Buildrs</Badge>
        </FadeSection>

        <GlassCard className="p-8 sm:p-12">
          <div className="sm:flex gap-12 items-start">
            {/* Photo placeholder */}
            <FadeSection className="sm:w-52 flex-shrink-0 mb-8 sm:mb-0">
              <div className="relative mx-auto" style={{ maxWidth: '208px' }}>
                {/* Gradient border */}
                <div className="rounded-2xl p-px"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(245,158,11,0.3))' }}>
                  <div className="rounded-[15px] aspect-square flex items-center justify-center"
                    style={{ background: '#0D0D0D' }}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <span className="text-2xl">👤</span>
                      </div>
                      <span className="text-xs" style={{ color: C.textFaint }}>Photo Alfred</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* Text */}
            <FadeSection delay={0.1} className="flex-1">
              <h3 className="text-2xl font-extrabold mb-1" style={{ color: C.white }}>Alfred Orsini</h3>
              <p className="text-sm mb-6 font-medium" style={{ color: '#A5B4FC' }}>Builder SaaS IA · Fondateur Buildrs</p>

              <div className="space-y-4 text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <p>Je ne viens pas du monde des gourous ou des formations en ligne. Je viens du terrain.</p>
                <p>En 2025, j'ai créé et géré plus de <strong style={{ color: C.white }}>24 projets SaaS</strong>. 70% issus de commandes privées d'entreprises. Des plugins revendus. Des SaaS en MRR. Des outils personnels.</p>
                <p>Tout ça, sans équipe de développeurs. Avec le vibe coding, les agents IA, et une méthode que j'ai forgée projet après projet.</p>
                <p>Buildrs, c'est cette méthode — documentée, structurée, et mise entre tes mains.</p>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { value: '24+', label: 'Projets SaaS créés' },
                  { value: '70%', label: 'Commandes privées' },
                  { value: '2025', label: 'Méthode forgée' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-xl font-extrabold" style={{
                      background: 'linear-gradient(135deg, #A5B4FC, #6366F1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.textFaint }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="rounded-xl p-5 relative overflow-hidden"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: 'linear-gradient(180deg, transparent, #6366F1, transparent)' }} />
                <p className="text-sm font-medium italic" style={{ color: C.white }}>
                  "Je ne t'apprends pas à utiliser l'IA. Je te montre comment construire des actifs tangibles avec elle."
                </p>
              </div>
            </FadeSection>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 9 — FAQ ─────────────── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-sm sm:text-base transition-colors"
          style={{ color: open ? C.white : 'rgba(255,255,255,0.75)' }}>
          {question}
        </span>
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: open ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${open ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <ChevronDown
            size={14}
            style={{ color: open ? '#A5B4FC' : C.textMuted, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed pr-10" style={{ color: C.textMuted }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { question: 'Est-ce que j\'ai besoin de savoir coder ?', answer: 'Non. Le vibe coding, c\'est exactement conçu pour les non-techniciens. Tu décris ce que tu veux, l\'IA construit. Notre méthode a été pensée pour des personnes sans aucune compétence technique.' },
    { question: 'C\'est quoi la différence avec une formation classique ?', answer: 'Tu n\'achètes pas des vidéos. Tu accèdes à des outils IA réels qui travaillent avec toi sur ton projet. C\'est opérationnel, pas pédagogique.' },
    { question: 'Est-ce que je peux créer plusieurs SaaS avec cet accès ?', answer: 'L\'accès Starter inclut un SaaS complet. Pour créer plusieurs projets et accéder à tous les modules de formation, coaching et communauté, tu peux upgrader vers l\'accès complet à tout moment.' },
    { question: 'En combien de temps je peux lancer ?', answer: 'Notre méthode est conçue pour un MVP en 30 jours. Certains membres lancent en moins de 2 semaines.' },
    { question: 'Et si ça ne me convient pas ?', answer: 'Accès bêta — on construit ce produit avec nos premiers membres. Ton feedback est précieux et intégré directement dans les évolutions.' },
  ];
  return (
    <section className="py-24 px-6" style={{ background: SECTION_GLOW_LEFT }}>
      <div className="max-w-2xl mx-auto">
        <FadeSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: C.white }}>Questions fréquentes</h2>
        </FadeSection>
        <FadeSection delay={0.1}>
          <GlassCard className="px-6 sm:px-8">
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {faqs.map(faq => <FAQItem key={faq.question} {...faq} />)}
            </div>
          </GlassCard>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 10 — CTA FINAL ─────────────── */
function CTAFinal() {
  return (
    <section className="relative py-32 px-6 text-center overflow-hidden" style={{ background: CTA_GLOW }}>
      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

      <div className="relative max-w-2xl mx-auto">
        <FadeSection>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ color: C.white, letterSpacing: '-0.02em' }}>
            La fenêtre est ouverte.<br />
            <span style={{
              background: 'linear-gradient(135deg, #A5B4FC 0%, #6366F1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Elle ne restera pas ouverte indéfiniment.</span>
          </h2>
        </FadeSection>

        <FadeSection delay={0.1}>
          <p className="text-base mb-10" style={{ color: C.textMuted }}>
            Rejoins les builders qui construisent leurs actifs pendant que les autres regardent.
          </p>
        </FadeSection>

        <FadeSection delay={0.2}>
          <div className="flex flex-col items-center gap-6">
            <CTAButton className="px-10 py-4 text-base gap-2">
              Accéder à Buildrs pour 37€ <ArrowRight size={15} />
            </CTAButton>

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
              {[
                { icon: <Users size={13} />, text: '200+ Builders actifs' },
                { icon: <TrendingUp size={13} />, text: '85% lancent en moins de 30 jours' },
                { icon: <span style={{ fontSize: '13px' }}>💶</span>, text: '25 000€+ générés' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm" style={{ color: C.textMuted }}>
                  <span style={{ color: C.textFaint }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── FOOTER ─────────────── */
function Footer() {
  return (
    <footer className="py-8 px-6" style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <BuildrsLogo height={24} />
        <div className="flex items-center gap-6 text-xs" style={{ color: C.textFaint }}>
          <a href="#" className="hover:text-white transition-colors">CGU</a>
          <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          <span>© 2026 Buildrs</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── PAGE ─────────────── */
export default function StartPage() {
  return (
    <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: '#000000', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Opportunite />
      <Probleme />
      <Solution />
      <CommentCaMarche />
      <Offre />
      <Alfred />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  );
}
