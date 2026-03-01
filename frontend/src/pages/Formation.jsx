import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Lock, CheckCircle, Play, Clock, Video, ChevronRight, Search, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  locked:      { label: 'Verrouillé',  icon: Lock,        class: 'badge-neutral' },
  available:   { label: 'Disponible',  icon: Play,        class: 'badge-neutral' },
  in_progress: { label: 'En cours',    icon: Play,        class: 'badge-cream'   },
  completed:   { label: 'Complété',    icon: CheckCircle, class: 'badge-green'   },
};

const ZONES = ['Fondations', 'Validation', 'Construction', 'Lancement', 'Croissance'];
const ZONE_COLORS = {
  'Fondations':   '#F5F0E8',
  'Validation':   '#22C55E',
  'Construction': '#3B82F6',
  'Lancement':    '#F59E0B',
  'Croissance':   '#EC4899',
};

// Fake data for structure — will be replaced by real API data
const FAKE_VIDEO_COUNTS = [5, 8, 6, 12, 7, 9, 4, 10, 6, 8, 5, 7];
const FAKE_DURATIONS    = ['1h37', '2h12', '0h48', '3h05', '1h20', '2h44', '0h55', '1h15', '2h30', '1h50', '0h42', '2h08'];
const FAKE_PROGRESS     = [100, 75, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function getCTALabel(status) {
  if (status === 'completed')   return 'Revoir le module';
  if (status === 'in_progress') return 'Continuer';
  if (status === 'available')   return 'Commencer';
  return null;
}

export default function Formation() {
  const [modules,  setModules]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/modules')
      .then(r => { setModules(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const completed = modules.filter(m => m.user_progress?.status === 'completed').length;
  const progress  = modules.length > 0 ? Math.round(completed / modules.length * 100) : 0;

  const filteredModules = (zone) =>
    modules.filter(m =>
      m.zone === zone &&
      (!search || m.title?.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Formation</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            La <strong className="text-[rgba(255,255,255,0.8)] font-semibold">méthode complète</strong> pour créer, lancer et monétiser ton SaaS IA.
          </p>
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0 w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
          <input
            type="text"
            placeholder="Rechercher un cours…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-[#222222] rounded-[8px] pl-9 pr-3 py-[9px] text-[13px] text-[rgba(255,255,255,0.7)] placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[#333333] transition-colors"
          />
        </div>
      </div>

      {/* ── Overall progress ── */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-7">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[rgba(255,255,255,0.5)] text-[13px]">Progression globale du programme</span>
          <span className="text-[#F5F0E8] font-semibold text-[13px]">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="mt-2 text-[rgba(255,255,255,0.35)] text-[11px]">{completed} / {modules.length} modules complétés</div>
      </div>

      {/* ── Modules by zone ── */}
      {ZONES.map(zone => {
        const zoneModules = filteredModules(zone);
        if (zoneModules.length === 0 && !loading) return null;

        return (
          <div key={zone} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ZONE_COLORS[zone] }} />
              <h2 className="text-[#F0F0F0] font-semibold text-[14px]">{zone}</h2>
              <div className="flex-1 h-px bg-[#1A1A1A]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? [1, 2, 3].map(i => (
                    <div key={i} className="bg-[#141414] border border-[#222222] rounded-[12px] overflow-hidden animate-pulse">
                      <div className="h-[150px] bg-[#1A1A1A]" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-[#1A1A1A] rounded w-1/3" />
                        <div className="h-4 bg-[#1A1A1A] rounded" />
                        <div className="h-3 bg-[#1A1A1A] rounded w-2/3" />
                        <div className="h-9 bg-[#1A1A1A] rounded-[8px] mt-4" />
                      </div>
                    </div>
                  ))
                : zoneModules.map((mod, i) => {
                    const status    = mod.user_progress?.status || 'locked';
                    const cfg       = STATUS_CONFIG[status] || STATUS_CONFIG.locked;
                    const StatusIcon = cfg.icon;
                    const isLocked  = status === 'locked';
                    const ctaLabel  = getCTALabel(status);

                    // Fake data (index-based, will be replaced by real values)
                    const idx       = mod.order_index ? mod.order_index - 1 : i;
                    const videoCount = FAKE_VIDEO_COUNTS[idx % FAKE_VIDEO_COUNTS.length];
                    const duration   = mod.duration_minutes
                      ? `${Math.floor(mod.duration_minutes / 60)}h${String(mod.duration_minutes % 60).padStart(2, '0')}`
                      : FAKE_DURATIONS[idx % FAKE_DURATIONS.length];
                    const progressPct = mod.user_progress?.progress_percent ?? FAKE_PROGRESS[idx % FAKE_PROGRESS.length];

                    return (
                      <div
                        key={mod.id}
                        data-testid={`module-card-${mod.id}`}
                        className={`bg-[#141414] border border-[#222222] rounded-[12px] overflow-hidden flex flex-col transition-all duration-150 ${
                          !isLocked ? 'hover:border-[#2A2A2A]' : 'opacity-55'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div
                          className="h-[150px] bg-[#1A1A1A] bg-cover bg-center relative flex-shrink-0"
                          style={{ backgroundImage: mod.thumbnail ? `url(${mod.thumbnail})` : 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Module number */}
                          <div className="absolute top-3 left-4 text-[rgba(255,255,255,0.18)] text-[28px] font-bold leading-none select-none">
                            {String(mod.order_index || i + 1).padStart(2, '0')}
                          </div>

                          {/* Lock overlay */}
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Lock size={22} className="text-[rgba(255,255,255,0.25)]" />
                            </div>
                          )}

                          {/* Duration + videos — bottom of thumbnail in white */}
                          {!isLocked && (
                            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-white text-[12px] font-medium">
                                <Clock size={12} className="text-white/70" />
                                {duration}
                              </div>
                              <div className="flex items-center gap-1.5 text-white text-[12px] font-medium">
                                <Video size={12} className="text-white/70" />
                                {videoCount} vidéos
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card body */}
                        <div className="p-4 flex flex-col flex-1 gap-3">
                          {/* Status badge */}
                          <div className="flex items-center gap-2">
                            <span className={`${cfg.class} text-[10px] font-medium px-2 py-0.5 rounded-[4px] flex items-center gap-1`}>
                              <StatusIcon size={10} /> {cfg.label}
                            </span>
                          </div>

                          {/* Title + description */}
                          <div className="flex-1">
                            <h3 className="text-[#F0F0F0] font-semibold text-[13px] mb-1 line-clamp-1">{mod.title}</h3>
                            <p className="text-[rgba(255,255,255,0.38)] text-[11px] leading-relaxed line-clamp-2">{mod.description}</p>
                          </div>

                          {/* Progress bar (always visible if not locked) */}
                          {!isLocked && (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[rgba(255,255,255,0.3)] text-[10px]">Progression</span>
                                <span className="text-white text-[11px] font-semibold">{progressPct}%</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                              </div>
                            </div>
                          )}

                          {/* CTA button */}
                          {ctaLabel && (
                            <button
                              onClick={() => navigate(`/formation/${mod.id}`)}
                              className="w-full flex items-center justify-center gap-2 bg-white text-[#0A0A0A] text-[12px] font-semibold py-[9px] px-4 rounded-[8px] hover:bg-[#F0F0F0] active:bg-[#E0E0E0] transition-colors duration-150 cursor-pointer mt-1"
                            >
                              {ctaLabel}
                              <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
