import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Lock, CheckCircle, Play, Clock, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  locked: { label: 'Verrouillé', icon: Lock, class: 'badge-neutral' },
  available: { label: 'Disponible', icon: Play, class: 'badge-neutral' },
  in_progress: { label: 'En cours', icon: Play, class: 'badge-cream' },
  completed: { label: 'Complété', icon: CheckCircle, class: 'badge-green' },
};

const ZONES = ['Fondations', 'Validation', 'Construction', 'Lancement', 'Croissance'];
const ZONE_COLORS = {
  'Fondations': '#F5F0E8', 'Validation': '#22C55E',
  'Construction': '#3B82F6', 'Lancement': '#F59E0B', 'Croissance': '#EC4899',
};

export default function Formation() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/modules').then(r => { setModules(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const completed = modules.filter(m => m.user_progress?.status === 'completed').length;
  const progress = modules.length > 0 ? Math.round(completed / modules.length * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Formation</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          La <strong className="text-[rgba(255,255,255,0.8)] font-semibold">méthode complète</strong> pour créer, lancer et monétiser ton SaaS IA.
        </p>
      </div>

      {/* Overall progress */}
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

      {/* Modules by zone */}
      {ZONES.map(zone => {
        const zoneModules = modules.filter(m => m.zone === zone);
        if (zoneModules.length === 0 && !loading) return null;
        return (
          <div key={zone} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ZONE_COLORS[zone] }}></div>
              <h2 className="text-[#F0F0F0] font-semibold text-[14px]">{zone}</h2>
              <div className="flex-1 h-px bg-[#1A1A1A]"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? [1,2,3].map(i => (
                <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] overflow-hidden animate-pulse">
                  <div className="h-[140px] bg-[#1A1A1A]"></div>
                  <div className="p-4"><div className="h-3 bg-[#1A1A1A] rounded mb-2"></div><div className="h-2 bg-[#1A1A1A] rounded w-2/3"></div></div>
                </div>
              )) : zoneModules.map(mod => {
                const status = mod.user_progress?.status || 'locked';
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.locked;
                const StatusIcon = cfg.icon;
                const isLocked = status === 'locked';
                return (
                  <div
                    key={mod.id}
                    data-testid={`module-card-${mod.id}`}
                    onClick={() => !isLocked && navigate(`/formation/${mod.id}`)}
                    className={`bg-[#141414] border border-[#222222] rounded-[10px] overflow-hidden transition-colors duration-150 ${!isLocked ? 'cursor-pointer hover:border-[#2A2A2A]' : 'opacity-60'}`}
                  >
                    {/* Thumbnail */}
                    <div
                      className="h-[130px] bg-[#1A1A1A] bg-cover bg-center relative"
                      style={{ backgroundImage: mod.thumbnail ? `url(${mod.thumbnail})` : 'none' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3 text-[rgba(255,255,255,0.2)] text-[24px] font-bold">
                        {String(mod.order_index).padStart(2, '0')}
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={20} className="text-[rgba(255,255,255,0.3)]" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`${cfg.class} text-[10px] font-medium px-2 py-0.5 rounded-[4px] flex items-center gap-1`}>
                          <StatusIcon size={10} /> {cfg.label}
                        </span>
                        <div className="flex items-center gap-1 text-[rgba(255,255,255,0.3)] text-[11px]">
                          <Clock size={10} /> {mod.duration_minutes} min
                        </div>
                      </div>
                      <h3 className="text-[#F0F0F0] font-semibold text-[13px] mb-1">{mod.title}</h3>
                      <p className="text-[rgba(255,255,255,0.4)] text-[11px] line-clamp-2">{mod.description}</p>
                      {status === 'in_progress' && (
                        <div className="progress-bar mt-3">
                          <div className="progress-fill" style={{ width: `${mod.user_progress?.progress_percent || 0}%` }}></div>
                        </div>
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
