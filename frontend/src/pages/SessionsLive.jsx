import React from 'react';
import { Video, Calendar, Users, Clock, Bell } from 'lucide-react';

const UPCOMING_SESSIONS = [
  {
    title: 'Office Hours — Questions SaaS IA',
    date: 'Vendredi 7 mars 2025',
    time: '18h00 – 19h30',
    host: 'Alfred Orsini',
    attendees: 12,
    spots: 20,
    tag: 'À venir',
  },
  {
    title: 'Review de projets — Session collective',
    date: 'Mardi 11 mars 2025',
    time: '19h00 – 20h30',
    host: 'Alfred Orsini',
    attendees: 7,
    spots: 15,
    tag: 'À venir',
  },
];

const PAST_SESSIONS = [
  {
    title: 'Bootcamp — Valider son idée en 48h',
    date: '21 février 2025',
    duration: '1h45',
    attendees: 34,
    hasReplay: true,
  },
  {
    title: 'Office Hours — Pricing & Monétisation',
    date: '14 février 2025',
    duration: '1h20',
    attendees: 28,
    hasReplay: true,
  },
];

export default function SessionsLive() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Sessions Live</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Office hours, reviews de projets et bootcamps en direct avec Alfred
          </p>
        </div>
        <button className="flex items-center gap-2 text-[13px] px-3.5 py-2 rounded-[8px] border border-[#222222] bg-[#141414] text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.9)] hover:border-[#2A2A2A] transition-colors">
          <Bell size={13} /> M'avertir
        </button>
      </div>

      {/* Upcoming */}
      <div className="mb-8">
        <h2 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Sessions à venir</h2>
        <div className="space-y-3">
          {UPCOMING_SESSIONS.map((s, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-[#222222] hover:border-[#2A2A2A] rounded-[12px] p-5 flex items-center justify-between gap-4 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[8px] bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center flex-shrink-0">
                  <Video size={16} className="text-[#3B82F6]" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#F0F0F0] font-medium text-[14px]">{s.title}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[rgba(34,197,94,0.08)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]">
                      {s.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-[rgba(255,255,255,0.4)]">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {s.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {s.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {s.attendees}/{s.spots} inscrits
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn-cream text-[13px] flex-shrink-0">S'inscrire</button>
            </div>
          ))}
        </div>
      </div>

      {/* Past sessions / Replays */}
      <div>
        <h2 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Replays disponibles</h2>
        <div className="space-y-3">
          {PAST_SESSIONS.map((s, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-[#222222] hover:border-[#2A2A2A] rounded-[12px] p-5 flex items-center justify-between gap-4 transition-colors duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[8px] bg-[#1A1A1A] border border-[#222222] flex items-center justify-center flex-shrink-0">
                  <Video size={16} className="text-[rgba(255,255,255,0.3)]" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[#F0F0F0] font-medium text-[14px] mb-1">{s.title}</div>
                  <div className="flex items-center gap-3 text-[12px] text-[rgba(255,255,255,0.35)]">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {s.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {s.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {s.attendees} participants
                    </span>
                  </div>
                </div>
              </div>
              {s.hasReplay && (
                <button className="btn-secondary text-[12px] flex-shrink-0 group-hover:border-[#2A2A2A] transition-colors">
                  Voir le replay →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
