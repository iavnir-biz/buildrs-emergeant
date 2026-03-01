import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Beaker, Rocket, CheckCircle2 } from 'lucide-react';
import BuildrsLogo from '../components/Logo';

// Stripe payment link — remplacer par le vrai lien Stripe
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_ME';

/* ─────────────── UTILS ─────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function FadeSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
      style={{ background: '#1A1A1A', border: '1px solid #3B82F6', color: '#3B82F6' }}>
      {children}
    </span>
  );
}

function CTAButton({ children, className = '' }) {
  const handleClick = () => window.open(STRIPE_PAYMENT_LINK, '_blank', 'noopener noreferrer');
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer ${className}`}
      style={{ background: '#FFFFFF', color: '#000000' }}
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
        background: '#0D0D0D',
        border: '1px solid #222222',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px #222',
      }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* Inner card */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <Rocket size={18} className="text-blue-500" />
        </div>
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      </div>
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
        background: scrolled ? 'rgba(0,0,0,0.92)' : '#000000',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1A1A1A' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <BuildrsLogo height={32} />
        <CTAButton className="px-5 py-2.5 text-sm">
          Accéder maintenant — 37€ →
        </CTAButton>
      </div>
    </nav>
  );
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 text-center" style={{ background: '#000000' }}>
      <div className="max-w-3xl mx-auto">
        <FadeSection>
          <div className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: '#1A1A1A', border: '1px solid #3B82F6', color: '#3B82F6' }}>
              <Zap size={14} className="text-blue-500" />
              Accès Bêta Ouvert — Places Limitées
            </span>
          </div>
        </FadeSection>

        <FadeSection delay={0.1}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Trouve ton idée de SaaS.<br />
            Valide-la. Lance-la.<br />
            <span style={{ color: '#FFFFFF' }}>Sans coder. Sans budget.</span><br />
            <span style={{ color: '#3B82F6' }}>En 30 jours.</span>
          </h1>
        </FadeSection>

        <FadeSection delay={0.2}>
          <p className="text-base sm:text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Buildrs est le premier écosystème IA qui t'accompagne de l'idée au premier euro —
            grâce au vibe coding, aux agents IA, et à une méthode testée sur 24+ projets réels.
          </p>
        </FadeSection>

        <FadeSection delay={0.3}>
          <div className="flex flex-col items-center gap-3">
            <CTAButton className="px-8 py-4 text-base">
              Accéder à Buildrs pour 37€ →
            </CTAButton>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              ✓ Accès immédiat &nbsp;·&nbsp; ✓ Sans abonnement &nbsp;·&nbsp; ✓ 1 SaaS complet inclus
            </p>
          </div>
        </FadeSection>

        <FadeSection delay={0.45} className="mt-14">
          <DashboardMockup label="Aperçu du Dashboard Buildrs" height="380px" />
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 3 — OPPORTUNITÉ ─────────────── */
function Opportunite() {
  return (
    <section className="py-24 px-6" style={{ background: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge>Pourquoi maintenant</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>
            Les micro-SaaS IA sont l'opportunité<br />la plus accessible de l'histoire.
          </h2>
        </FadeSection>

        {/* Stats */}
        <FadeSection delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-14">
            {[
              { value: '0€', label: 'Budget technique requis' },
              { value: '30 jours', label: 'Pour lancer un MVP' },
              { value: '1 personne', label: 'Suffit pour tout gérer' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl p-6 text-center" style={{ background: '#111111', border: '1px solid #222222' }}>
                <div className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: '#3B82F6' }}>{value}</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        </FadeSection>

        <FadeSection delay={0.15}>
          <div className="text-base leading-[1.9] mb-10 space-y-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <p>
              Pendant des années, créer un logiciel demandait des développeurs, des mois de travail,
              des dizaines de milliers d'euros. C'était réservé aux startups financées.
            </p>
            <p>
              Aujourd'hui, le vibe coding et les agents IA ont tout changé.
              Tu décris ce que tu veux construire. L'IA le construit.
              Tu valides. Tu lances. Tu monétises.
            </p>
            <p>
              Jensen Huang, le fondateur de Nvidia, l'a dit clairement :
              les prochains millionnaires seront souvent des équipes d'une seule personne,
              avec des agents, des logiciels, des systèmes.
            </p>
          </div>
        </FadeSection>

        {/* Citation */}
        <FadeSection delay={0.2}>
          <blockquote className="rounded-xl p-7 relative"
            style={{ background: '#111111', borderLeft: '4px solid #3B82F6', border: '1px solid #222222', borderLeftColor: '#3B82F6', borderLeftWidth: '4px' }}>
            <p className="text-lg font-medium italic leading-relaxed" style={{ color: '#FFFFFF' }}>
              "Un gamin de 15 ans peut le faire.
              Une personne de 60 ans qui vient de perdre son emploi peut le faire.
              La fenêtre est ouverte. Elle ne restera pas ouverte indéfiniment."
            </p>
          </blockquote>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 4 — PROBLÈME ─────────────── */
function Probleme() {
  const problems = [
    {
      icon: '🌊',
      title: 'Noyé sous l\'information',
      desc: 'YouTube, LinkedIn, Twitter — tout le monde parle d\'IA. Mais personne ne te donne une stratégie claire et actionnable.',
    },
    {
      icon: '🔧',
      title: 'Bloqué par la technique',
      desc: 'Tu penses qu\'il faut savoir coder. Qu\'il faut un développeur. Qu\'un SaaS c\'est pour les ingénieurs de la Silicon Valley.',
    },
    {
      icon: '💸',
      title: 'Freiné par le budget',
      desc: 'Tu crois qu\'il faut lever des fonds, avoir une équipe, investir des mois avant de voir le moindre résultat.',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge>Le Problème</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>
            Tu vois l'opportunité.<br />Mais tu ne sais pas par où commencer.
          </h2>
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {problems.map(({ icon, title, desc }, i) => (
            <FadeSection key={title} delay={i * 0.1}>
              <div className="rounded-xl p-6 h-full" style={{ background: '#111111', border: '1px solid #222222' }}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-base mb-3" style={{ color: '#FFFFFF' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>

        <FadeSection delay={0.3}>
          <p className="text-center font-bold text-base" style={{ color: '#FFFFFF' }}>
            Ces barrières n'existent plus. Et c'est exactement ce qu'on va te prouver.
          </p>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 5 — SOLUTION ─────────────── */
function Solution() {
  const pillars = [
    {
      Icon: Beaker,
      title: 'Le Laboratoire',
      desc: 'Alfred crée ses propres SaaS en temps réel et documente tout. Tu vois les décisions, les chiffres, les succès et les échecs.',
    },
    {
      icon: '🤖',
      title: 'Les Agents IA',
      desc: 'Des outils IA intégrés qui scannent Reddit, Product Hunt et les tendances pour trouver des opportunités réelles avant tout le monde.',
    },
    {
      Icon: Rocket,
      title: 'La Méthode',
      desc: 'De l\'idée au MVP en 30 jours. Un plan étape par étape, des outils sélectionnés, une communauté de builders qui avancent.',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-10">
          <Badge>La Solution</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>
            Buildrs — L'académie des builders SaaS IA.
          </h2>
        </FadeSection>

        <FadeSection delay={0.1}>
          <p className="text-base leading-relaxed text-center mb-14" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '660px', margin: '0 auto 3.5rem' }}>
            Buildrs n'est pas une formation de plus. C'est un laboratoire vivant.
            Un écosystème complet dans lequel des entrepreneurs comme toi
            utilisent l'IA pour créer des actifs logiciels réels —
            des micro-SaaS qui génèrent des revenus récurrents, se scalent,
            et se revendent à des multiples élevés.<br /><br />
            Notre méthode a été forgée sur 24+ projets SaaS réels.
            70% issus de commandes privées d'entreprises.
            Pas de la théorie. Du terrain.
          </p>
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-5">
          {pillars.map(({ Icon, icon, title, desc }, i) => (
            <FadeSection key={title} delay={i * 0.1}>
              <div className="rounded-xl p-6 h-full" style={{ background: '#111111', border: '1px solid #222222' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  {Icon ? <Icon size={18} className="text-blue-500" /> : <span className="text-xl">{icon}</span>}
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: '#FFFFFF' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </div>
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
    {
      num: '①',
      title: 'Trouve ton idée',
      desc: 'Notre IA scanne Reddit, Product Hunt et les marketplaces pour identifier les problèmes non résolus dans ta niche. Tu reçois une liste d\'opportunités validées par les données du marché.',
      mockup: 'Interface Générateur d\'idées',
    },
    {
      num: '②',
      title: 'Valide en 10 minutes',
      desc: 'Avant de construire quoi que ce soit, tu valides. Taille du marché, concurrents, potentiel MRR, stratégie de sortie. Notre outil fait l\'analyse. Tu prends la décision.',
      mockup: 'Interface Validation',
    },
    {
      num: '③',
      title: 'Génère ton identité',
      desc: 'Nom, positionnement, univers visuel. L\'IA génère plusieurs options basées sur ton marché cible. Tu choisis. Tu brandises.',
      mockup: 'Interface Générateur de nom',
    },
    {
      num: '④',
      title: 'Construis avec le vibe coding',
      desc: 'Ton plan d\'action détaillé étape par étape. Les outils exacts à utiliser. Les prompts qui fonctionnent. Tu construis sans écrire une ligne de code.',
      mockup: 'Plan d\'action',
    },
    {
      num: '⑤',
      title: 'Lance et monétise',
      desc: 'Stripe intégré. Premier abonné. Premier euro. Et si tu veux aller plus loin — scale, revente à multiple, ou duplique dans une autre niche.',
      mockup: 'Dashboard',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-16">
          <Badge>Comment ça marche</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>
            De l'idée au SaaS lancé.<br />Étape par étape.
          </h2>
        </FadeSection>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px hidden sm:block" style={{ background: '#222222' }} />

          <div className="space-y-12">
            {steps.map(({ num, title, desc, mockup }, i) => (
              <FadeSection key={title} delay={i * 0.05}>
                <div className="sm:flex gap-8 items-start">
                  {/* Number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl relative z-10 mb-4 sm:mb-0"
                    style={{ background: '#111111', border: '1px solid #3B82F6', color: '#3B82F6' }}>
                    {num}
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#FFFFFF' }}>{title}</h3>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
                    <DashboardMockup label={mockup} height="200px" />
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
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
    'Générateur de nom + identité',
    'Plan d\'action complet étape par étape (1 SaaS)',
    'Sélection des meilleurs outils vibe coding',
    'Accès Buildrs IA (chat pour guider ton projet)',
    'Accès bêta à la plateforme Buildrs',
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#0A0A0A' }}>
      <div className="max-w-5xl mx-auto">
        <FadeSection className="text-center mb-14">
          <Badge>L'Offre Bêta</Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>
            Tout ce qu'il te faut pour<br />lancer ton premier SaaS.
          </h2>
        </FadeSection>

        <div className="grid sm:grid-cols-2 gap-8 items-start">
          {/* Left — included */}
          <FadeSection>
            <div className="space-y-3.5">
              {included.map(item => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeSection>

          {/* Right — price card */}
          <FadeSection delay={0.1}>
            <div className="rounded-2xl p-8 text-center"
              style={{ background: '#111111', border: '1px solid #3B82F6' }}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#3B82F6' }}>Accès Buildrs Starter</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-xl line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>97€</span>
                <span className="text-5xl font-extrabold" style={{ color: '#FFFFFF' }}>37€</span>
              </div>
              <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Prix bêta — offre limitée</p>
              <CTAButton className="w-full py-4 text-base">
                Accéder maintenant →
              </CTAButton>
              <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Paiement unique · Accès immédiat · Sans abonnement
              </p>
            </div>
          </FadeSection>
        </div>

        <FadeSection delay={0.2}>
          <p className="mt-10 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)', borderTop: '1px solid #1A1A1A', paddingTop: '2rem' }}>
            Tu veux aller plus loin ? Formation complète, coaching individuel,
            accès communauté et tous les outils débloqués disponibles
            après ton accès Starter.
          </p>
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

        <div className="sm:flex gap-12 items-start">
          {/* Photo placeholder */}
          <FadeSection className="sm:w-56 flex-shrink-0 mb-8 sm:mb-0">
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center"
              style={{ background: '#111111', border: '1px solid #222222', maxWidth: '224px', margin: '0 auto' }}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Photo Alfred</span>
              </div>
            </div>
          </FadeSection>

          {/* Text */}
          <FadeSection delay={0.1} className="flex-1">
            <h3 className="text-2xl font-extrabold mb-1" style={{ color: '#FFFFFF' }}>Alfred Orsini</h3>
            <p className="text-sm mb-6" style={{ color: '#3B82F6' }}>Builder SaaS IA · Fondateur Buildrs</p>

            <div className="space-y-4 text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <p>Je ne viens pas du monde des gourous ou des formations en ligne. Je viens du terrain.</p>
              <p>
                En 2025, j'ai créé et géré plus de 24 projets SaaS.
                70% issus de commandes privées d'entreprises.
                Des plugins revendus. Des SaaS en MRR. Des outils personnels.
              </p>
              <p>
                Tout ça, sans équipe de développeurs.
                Avec le vibe coding, les agents IA, et une méthode que j'ai
                forgée projet après projet.
              </p>
              <p>Buildrs, c'est cette méthode — documentée, structurée, et mise entre tes mains.</p>
            </div>

            <blockquote className="rounded-xl p-5" style={{ background: '#111111', borderLeft: '3px solid #3B82F6' }}>
              <p className="text-sm font-medium italic" style={{ color: '#FFFFFF' }}>
                "Je ne t'apprends pas à utiliser l'IA. Je te montre comment construire des actifs tangibles avec elle."
              </p>
            </blockquote>
          </FadeSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 9 — FAQ ─────────────── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #1A1A1A' }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-sm sm:text-base transition-colors" style={{ color: open ? '#FFFFFF' : 'rgba(255,255,255,0.8)' }}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className="flex-shrink-0 transition-transform duration-200"
          style={{ color: '#3B82F6', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
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
            <p className="pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'Est-ce que j\'ai besoin de savoir coder ?',
      answer: 'Non. Le vibe coding, c\'est exactement conçu pour les non-techniciens. Tu décris ce que tu veux, l\'IA construit. Notre méthode a été pensée pour des personnes sans aucune compétence technique.',
    },
    {
      question: 'C\'est quoi la différence avec une formation classique ?',
      answer: 'Tu n\'achètes pas des vidéos. Tu accèdes à des outils IA réels qui travaillent avec toi sur ton projet. C\'est opérationnel, pas pédagogique.',
    },
    {
      question: 'Est-ce que je peux créer plusieurs SaaS avec cet accès ?',
      answer: 'L\'accès Starter inclut un SaaS complet. Pour créer plusieurs projets et accéder à tous les modules de formation, coaching et communauté, tu peux upgrader vers l\'accès complet à tout moment.',
    },
    {
      question: 'En combien de temps je peux lancer ?',
      answer: 'Notre méthode est conçue pour un MVP en 30 jours. Certains membres lancent en moins de 2 semaines.',
    },
    {
      question: 'Et si ça ne me convient pas ?',
      answer: 'Accès bêta — on construit ce produit avec nos premiers membres. Ton feedback est précieux et intégré directement dans les évolutions.',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#0A0A0A' }}>
      <div className="max-w-2xl mx-auto">
        <FadeSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#FFFFFF' }}>Questions fréquentes</h2>
        </FadeSection>

        <FadeSection delay={0.1}>
          <div style={{ borderTop: '1px solid #1A1A1A' }}>
            {faqs.map(faq => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 10 — CTA FINAL ─────────────── */
function CTAFinal() {
  return (
    <section className="py-28 px-6 text-center" style={{ background: '#0A0A0A', borderTop: '1px solid #111111' }}>
      <div className="max-w-2xl mx-auto">
        <FadeSection>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ color: '#FFFFFF' }}>
            La fenêtre est ouverte.<br />Elle ne restera pas ouverte indéfiniment.
          </h2>
        </FadeSection>

        <FadeSection delay={0.1}>
          <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Rejoins les builders qui construisent leurs actifs pendant que les autres regardent.
          </p>
        </FadeSection>

        <FadeSection delay={0.2}>
          <div className="flex flex-col items-center gap-6">
            <CTAButton className="px-10 py-4 text-base">
              Accéder à Buildrs pour 37€ →
            </CTAButton>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span>200+ Builders actifs</span>
              <span style={{ color: '#222222' }}>·</span>
              <span>85% lancent en moins de 30 jours</span>
              <span style={{ color: '#222222' }}>·</span>
              <span>25 000€+ générés</span>
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
    <footer className="py-8 px-6" style={{ background: '#000000', borderTop: '1px solid #111111' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <BuildrsLogo height={24} />
        <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
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
