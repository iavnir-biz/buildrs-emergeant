import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Zap, Target, TrendingUp, FlaskConical, Users } from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    title: 'BIENVENUE DANS BUILDRS LAB',
    subtitle: 'La méthode complète pour créer, lancer et monétiser ton SaaS IA en 30 jours.',
    badge: "Nouveau",
    image: 'https://images.unsplash.com/photo-1767642833959-0cac90824996?w=1200&q=70',
  },
  {
    title: "MODULE 7 : DESIGN AVEC L'IA",
    subtitle: "Crée des interfaces professionnelles en quelques heures avec les outils IA.",
    badge: "Nouveau",
    image: 'https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=1200&q=70',
  },
  {
    title: 'SESSION LIVE CE JEUDI',
    subtitle: "Rejoins Alfred et 50 builders pour une masterclass exclusive sur le lancement.",
    badge: "Événement",
    image: 'https://images.unsplash.com/photo-1767642833959-0cac90824996?w=1200&q=70',
  },
];

const BANNER_SLIDES = [
  {
    label: 'Buildrs Infinite',
    text: "Vous avez une idée et souhaitez la mettre en place rapidement ? On la crée pour vous en 30 jours.",
    cta: 'Nous contacter →',
  },
  {
    label: 'Buildrs Scale',
    text: "Vous avez déjà un micro-SaaS et souhaitez le passer au niveau supérieur ? Parlons-en.",
    cta: 'Nous contacter →',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const onSelect = () => setSelectedIdx(emblaApi?.selectedScrollSnap() ?? 0);
    emblaApi?.on('select', onSelect);
    return () => emblaApi?.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/modules').then(r => setModules(r.data)).catch(() => {});
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNER_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const currentModule = modules.find(m => m.user_progress?.status === 'in_progress') || modules[0];
  const firstName = (user?.full_name || user?.name || 'Builder').split(' ')[0];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Bonjour {firstName}</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Bienvenue dans le laboratoire. Chaque connexion te <strong className="text-[rgba(255,255,255,0.8)] font-semibold">rapproche du prochain palier</strong>.
        </p>
      </div>

      {/* BLOC 1 — Hero Carousel */}
      <div className="relative mb-4 rounded-[10px] overflow-hidden" style={{ height: '300px' }}>
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {CAROUSEL_SLIDES.map((slide, i) => (
              <div key={i} className="embla__slide relative h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                {/* Badge */}
                <span className="absolute top-4 right-4 bg-white text-[#0A0A0A] text-[12px] font-semibold px-3 py-1 rounded-[4px]">
                  {slide.badge}
                </span>
                {/* Content */}
                <div className="absolute bottom-6 left-6 right-20">
                  <h2 className="text-white font-bold text-[20px] uppercase tracking-wide mb-2">{slide.title}</h2>
                  <p className="text-[rgba(255,255,255,0.7)] text-[13px]">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Controls */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[rgba(0,0,0,0.5)] rounded-full flex items-center justify-center text-white hover:bg-[rgba(0,0,0,0.75)] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[rgba(0,0,0,0.5)] rounded-full flex items-center justify-center text-white hover:bg-[rgba(0,0,0,0.75)] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-200 ${selectedIdx === i ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* BLOC 2 — Bandeau scrollable carousel */}
      <div className="mb-7">
        <div className="bg-[#111111] border border-[#222222] rounded-[10px] px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-white font-bold text-[14px] whitespace-nowrap flex-shrink-0">
              {BANNER_SLIDES[bannerIdx].label}
            </span>
            <div className="h-5 w-px bg-[#444444] flex-shrink-0"></div>
            <p className="text-[rgba(255,255,255,0.65)] text-[13px] leading-snug line-clamp-2">
              {BANNER_SLIDES[bannerIdx].text}
            </p>
          </div>
          <button className="flex-shrink-0 bg-white text-[#0A0A0A] text-[12px] font-semibold px-4 py-2 rounded-[6px] hover:bg-[#F0F0F0] transition-colors duration-200">
            {BANNER_SLIDES[bannerIdx].cta}
          </button>
        </div>
        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-2.5">
          {BANNER_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`rounded-full transition-all duration-200 ${bannerIdx === i ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-[rgba(255,255,255,0.25)]'}`}
            />
          ))}
        </div>
      </div>

      {/* BLOC 3 — Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { icon: TrendingUp, label: 'Progression', value: `${stats?.progress_percent || 0}%`, sub: 'du programme' },
          { icon: BookOpen, label: 'Modules complétés', value: `${stats?.modules_completed || 0}/${stats?.modules_total || 15}`, sub: 'modules' },
          { icon: Zap, label: 'Streak', value: `${stats?.streak || 0} jours`, sub: 'consécutifs' },
          { icon: Target, label: 'Points builder', value: `${stats?.points || 0}`, sub: 'points' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} data-testid={`stat-card-${i}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={15} className="text-[rgba(255,255,255,0.4)]" strokeWidth={1.5} />
                <span className="text-[rgba(255,255,255,0.45)] text-[12px]">{s.label}</span>
              </div>
              <div className="text-[#F0F0F0] font-bold text-[26px]">{s.value}</div>
              <div className="text-[rgba(255,255,255,0.35)] text-[11px] mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* BLOC 4 — Continue là où tu en es */}
      {currentModule && (
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-7">
          <h3 className="text-[rgba(255,255,255,0.5)] text-[12px] font-medium uppercase tracking-wider mb-4">
            Continue là où tu en es
          </h3>
          <div className="flex items-center gap-4">
            <div
              className="w-[100px] h-[60px] rounded-[6px] bg-[#1A1A1A] bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${currentModule.thumbnail || ''})` }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-cream text-[10px] px-1.5 py-0.5 rounded font-medium">{currentModule.zone}</span>
              </div>
              <div className="text-[#F0F0F0] font-semibold text-[14px] truncate">{currentModule.title}</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[12px]">{currentModule.duration_minutes} min</div>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${currentModule.user_progress?.progress_percent || 0}%` }}></div>
              </div>
            </div>
            <button
              data-testid="continue-module-btn"
              onClick={() => navigate(`/formation/${currentModule.id}`)}
              className="btn-cream flex items-center gap-1.5 flex-shrink-0"
            >
              Continuer <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* BLOC 5 — Explorer l'écosystème */}
      <div className="mb-7">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-[#F0F0F0] font-semibold text-[20px] whitespace-nowrap">Explorer l'écosystème</h2>
          <div className="flex-1 h-px bg-[#222222]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1 — Formation */}
          <div className="bg-[#111111] border border-[#222222] rounded-[12px] overflow-hidden flex flex-col">
            <div
              className="relative h-[140px] bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=70)` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-[22px] uppercase tracking-widest">FORMATION</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-[rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                <span className="text-[#F0F0F0] font-semibold text-[15px]">Formation</span>
              </div>
              <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-relaxed mb-3 flex-1">
                Un programme conçu pour créer, lancer et monétiser ton SaaS avec l'IA.
              </p>
              <p className="text-[rgba(255,255,255,0.3)] text-[12px] mb-4">15 Modules · 30 Vidéos · 12h de contenu</p>
              <button
                onClick={() => navigate('/formation')}
                className="w-full bg-white text-[#0A0A0A] text-[13px] font-semibold py-2.5 rounded-[8px] hover:bg-[#F0F0F0] transition-colors duration-200"
              >
                Découvrir la Formation →
              </button>
            </div>
          </div>

          {/* Card 2 — Le Lab */}
          <div className="bg-[#111111] border border-[#222222] rounded-[12px] overflow-hidden flex flex-col">
            <div
              className="relative h-[140px] bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=70)` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-[22px] uppercase tracking-widest">LE LAB</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical size={16} className="text-[rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                <span className="text-[#F0F0F0] font-semibold text-[15px]">Le Lab</span>
              </div>
              <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-relaxed mb-3 flex-1">
                Accès aux dernières nouveautés, SaaS en cours, lancements en live et contenus exclusifs.
              </p>
              <p className="text-[rgba(255,255,255,0.3)] text-[12px] mb-4">Mis à jour chaque semaine</p>
              <button
                onClick={() => navigate('/lab')}
                className="w-full bg-white text-[#0A0A0A] text-[13px] font-semibold py-2.5 rounded-[8px] hover:bg-[#F0F0F0] transition-colors duration-200"
              >
                Accéder au Lab →
              </button>
            </div>
          </div>

          {/* Card 3 — Communauté */}
          <div className="bg-[#111111] border border-[#222222] rounded-[12px] overflow-hidden flex flex-col">
            <div
              className="relative h-[140px] bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=70)` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-1.5">
                <span className="text-white text-[11px] font-semibold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">REJOINDRE</span>
                <span className="text-white font-bold text-[22px] uppercase tracking-widest">COMMUNAUTÉ</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-[rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                <span className="text-[#F0F0F0] font-semibold text-[15px]">Communauté</span>
              </div>
              <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-relaxed mb-3 flex-1">
                Un espace d'entraide, de partages et de connexion avec des builders partageant les mêmes ambitions.
              </p>
              <p className="text-[rgba(255,255,255,0.3)] text-[12px] mb-4">Membres · Coachs · 24h/7j</p>
              <button
                onClick={() => navigate('/forum')}
                className="w-full bg-white text-[#0A0A0A] text-[13px] font-semibold py-2.5 rounded-[8px] hover:bg-[#F0F0F0] transition-colors duration-200"
              >
                Rejoindre la Communauté →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
