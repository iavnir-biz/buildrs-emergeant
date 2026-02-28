import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Zap, Target, TrendingUp } from 'lucide-react';

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
  { logo: 'BL', name: 'Buildrs Lab', desc: "Rejoins 1 200+ builders qui construisent leur SaaS avec l'IA.", cta: 'En savoir plus >' },
  { logo: 'AF', name: 'Alfred Orsini', desc: "Réserve ton appel stratégique individuel — disponibilités limitées.", cta: 'Réserver >' },
  { logo: 'DC', name: 'Discord Buildrs', desc: "Rejoins la communauté et partage tes victoires en temps réel.", cta: 'Rejoindre >' },
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

      {/* Hero Carousel */}
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

      {/* Banner slider */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 flex items-center justify-between mb-7">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-[6px] bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[11px] font-bold flex-shrink-0">
            {BANNER_SLIDES[bannerIdx].logo}
          </div>
          <div className="h-6 w-px bg-[#222222]"></div>
          <p className="text-[rgba(255,255,255,0.65)] text-[13px]">{BANNER_SLIDES[bannerIdx].desc}</p>
        </div>
        <button className="btn-secondary text-[12px] flex-shrink-0 ml-4">{BANNER_SLIDES[bannerIdx].cta}</button>
      </div>

      {/* Stats grid */}
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

      {/* Continue where you left off */}
      {currentModule && (
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
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
    </div>
  );
}
