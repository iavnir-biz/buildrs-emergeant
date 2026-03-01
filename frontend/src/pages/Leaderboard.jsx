import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, ChevronDown, Info } from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { rank: 1,  name: 'Alfred Orsini',    initials: 'AO', points: 4200, modules: 15, streak: 45, months: 18, level: 'Diamond' },
  { rank: 2,  name: 'Sarah Chen',       initials: 'SC', points: 3850, modules: 14, streak: 38, months: 15, level: 'Elite'   },
  { rank: 3,  name: 'Maxime Lebrun',    initials: 'ML', points: 3420, modules: 13, streak: 30, months: 12, level: 'Elite'   },
  { rank: 4,  name: 'Priya Sharma',     initials: 'PS', points: 2980, modules: 12, streak: 22, months: 10, level: 'Pro'     },
  { rank: 5,  name: 'Thomas Müller',    initials: 'TM', points: 2650, modules: 11, streak: 18, months:  9, level: 'Pro'     },
  { rank: 6,  name: 'Camille Rousseau', initials: 'CR', points: 2310, modules: 10, streak: 15, months:  8, level: 'Pro'     },
  { rank: 7,  name: 'Marc Dupont',      initials: 'MD', points: 1950, modules:  9, streak: 12, months:  7, level: 'Builder', isCurrentUser: true },
  { rank: 8,  name: 'Yuki Tanaka',      initials: 'YT', points: 1720, modules:  8, streak: 10, months:  6, level: 'Builder' },
  { rank: 9,  name: 'Antoine Girard',   initials: 'AG', points: 1480, modules:  7, streak:  7, months:  5, level: 'Builder' },
  { rank: 10, name: 'Léa Martinez',     initials: 'LM', points: 1250, modules:  6, streak:  5, months:  5, level: 'Builder' },
  { rank: 11, name: 'Diego Fernandez',  initials: 'DF', points:  980, modules:  5, streak:  3, months:  4, level: 'Builder' },
  { rank: 12, name: 'Emma Wilson',      initials: 'EW', points:  750, modules:  4, streak:  2, months:  3, level: 'Starter' },
  { rank: 13, name: 'Nicolas Bernard',  initials: 'NB', points:  520, modules:  3, streak:  1, months:  2, level: 'Starter' },
  { rank: 14, name: 'Fatima Al-Hassan', initials: 'FA', points:  280, modules:  2, streak:  0, months:  2, level: 'Starter' },
  { rank: 15, name: 'Julien Moreau',    initials: 'JM', points:   50, modules:  1, streak:  0, months:  1, level: 'Starter' },
];

// ─── Level config ─────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  Diamond: { label: 'Diamant',  color: '#00D4FF', bg: 'rgba(0,212,255,0.12)',    animated: true  },
  Elite:   { label: 'Elite',    color: '#FFD700', bg: 'rgba(255,215,0,0.12)',    animated: false },
  Pro:     { label: 'Pro',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',   animated: false },
  Builder: { label: 'Builder',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',   animated: false },
  Starter: { label: 'Starter',  color: '#6B7280', bg: 'rgba(107,114,128,0.12)', animated: false },
};

// ─── Medal config ─────────────────────────────────────────────────────────────
const MEDAL = {
  1: { color: '#FFD700', dropShadow: 'drop-shadow(0 0 12px rgba(255,215,0,0.9)) drop-shadow(0 0 24px rgba(255,215,0,0.4))', label: '🥇' },
  2: { color: '#C0C0C0', dropShadow: 'drop-shadow(0 0 8px rgba(192,192,192,0.7))',                                          label: '🥈' },
  3: { color: '#CD7F32', dropShadow: 'drop-shadow(0 0 8px rgba(205,127,50,0.7))',                                           label: '🥉' },
};

// Column template shared between header and body rows
const COL_TEMPLATE = '52px 1fr 112px 96px 72px 80px 110px 82px 72px 84px';

function getRankColor(rank) {
  if (rank <= 3)  return MEDAL[rank].color;
  if (rank <= 10) return '#A8A8B3';
  if (rank <= 20) return '#CD7F32';
  return 'rgba(255,255,255,0.65)';
}

// ─── LevelBadge ───────────────────────────────────────────────────────────────
function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.Starter;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap"
      style={{
        color:           cfg.color,
        backgroundColor: cfg.bg,
        boxShadow:       cfg.animated ? `0 0 10px ${cfg.color}70, 0 0 20px ${cfg.color}30` : undefined,
      }}
    >
      {cfg.animated && (
        <span className="animate-pulse inline-block">💎</span>
      )}
      {cfg.label}
    </span>
  );
}

// ─── MemberAvatar ─────────────────────────────────────────────────────────────
function MemberAvatar({ member, size = 'md' }) {
  const cls = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-[13px]',
    lg: 'w-[56px] h-[56px] text-[18px]',
  }[size];
  return (
    <div
      className={`${cls} rounded-full bg-[#1C1C1C] border border-[#2C2C2C] flex items-center justify-center font-bold text-[#F0F0F0] flex-shrink-0 select-none`}
    >
      {member.initials}
    </div>
  );
}

// ─── PodiumCard ───────────────────────────────────────────────────────────────
function PodiumCard({ member, rank, delay = 0 }) {
  const medal   = MEDAL[rank];
  const isFirst = rank === 1;
  // Staircase: push cards down with margin-top (items-end alignment)
  const topOffset = { 1: 0, 2: 52, 3: 84 }[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.82 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{ delay, type: 'spring', stiffness: 160, damping: 18 }}
      className="flex flex-col items-center flex-shrink-0"
      style={{ marginTop: topOffset }}
    >
      {/* Medal with glow filter */}
      <div
        className="relative text-4xl mb-3 select-none leading-none"
        style={{ filter: medal.dropShadow }}
      >
        {medal.label}
        {/* Pulsing ambient ring behind #1 */}
        {isFirst && (
          <div
            className="absolute inset-0 -m-6 rounded-full pointer-events-none animate-ping"
            style={{
              background: `radial-gradient(circle, ${medal.color}1A 0%, transparent 70%)`,
              animationDuration: '2.5s',
            }}
          />
        )}
      </div>

      {/* Avatar with optional golden glow */}
      <div
        className="mb-3"
        style={isFirst ? { filter: `drop-shadow(0 0 10px ${medal.color}55)` } : undefined}
      >
        <MemberAvatar member={member} size={isFirst ? 'lg' : 'md'} />
      </div>

      {/* Card */}
      <div
        className={`flex flex-col items-center gap-2 rounded-[12px] border p-4 text-center ${isFirst ? 'w-[184px]' : 'w-[152px]'}`}
        style={{
          backgroundColor: '#111111',
          borderColor: rank === 1
            ? 'rgba(255,215,0,0.3)'
            : rank === 2
            ? 'rgba(192,192,192,0.18)'
            : 'rgba(205,127,50,0.18)',
          boxShadow: isFirst
            ? `0 0 40px rgba(255,215,0,0.07) inset, 0 8px 32px rgba(0,0,0,0.6)`
            : `0 4px 20px rgba(0,0,0,0.4)`,
        }}
      >
        <span className="text-[#F0F0F0] font-semibold text-[13px] w-full truncate leading-tight">
          {member.name}
        </span>
        <LevelBadge level={member.level} />
        <span
          className={`font-black leading-none ${isFirst ? 'text-[32px]' : 'text-[26px]'}`}
          style={{ color: medal.color }}
        >
          {member.points.toLocaleString('fr-FR')}
          <span className="text-[11px] ml-1 font-normal text-[rgba(255,255,255,0.4)]">pts</span>
        </span>
        <div className="flex flex-col gap-0.5 text-[11px] text-[rgba(255,255,255,0.45)]">
          <span>{member.modules}/15 modules</span>
          <span>🔥 {member.streak} j streak</span>
        </div>
      </div>

      {/* Rank number below card */}
      <span
        className={`mt-2 font-black select-none ${isFirst ? 'text-[28px]' : 'text-[22px]'}`}
        style={{ color: medal.color, textShadow: `0 0 14px ${medal.color}80` }}
      >
        #{rank}
      </span>
    </motion.div>
  );
}

// ─── ComingSoonTooltip ────────────────────────────────────────────────────────
function ComingSoonTooltip({ children }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1A1A1A] border border-[#333333] rounded-[6px] text-[11px] text-[rgba(255,255,255,0.6)] whitespace-nowrap z-20 pointer-events-none shadow-xl">
          Bientôt disponible
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#333333]" />
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [filter, setFilter] = useState('mois');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const top3 = MOCK_MEMBERS.slice(0, 3);

  return (
    <div className="animate-fade-in pb-12">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Les builders qui avancent. En temps réel.
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#111111] border border-[#222222] text-[#F0F0F0] text-[13px] font-medium hover:border-[#333333] transition-colors duration-150"
          >
            {filter === 'mois' ? 'Ce mois-ci' : 'Tout le temps'}
            <ChevronDown
              size={13}
              className="text-[rgba(255,255,255,0.4)] transition-transform duration-150"
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#111111] border border-[#222222] rounded-[8px] overflow-hidden z-20 min-w-[152px] shadow-xl">
              {[['mois', 'Ce mois-ci'], ['tout', 'Tout le temps']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => { setFilter(val); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 ${
                    filter === val
                      ? 'text-[#3B82F6] bg-[rgba(59,130,246,0.08)]'
                      : 'text-[rgba(255,255,255,0.7)] hover:bg-[#1A1A1A]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Podium (top 3) ──────────────────────────────────────────────────── */}
      <div className="relative mb-12">
        {/* Ambient golden glow behind the entire podium */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 500px 180px at 50% 85%, rgba(255,215,0,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="flex items-end justify-center gap-4 lg:gap-8 px-4 relative">
          <PodiumCard member={top3[1]} rank={2} delay={0.14} />
          <PodiumCard member={top3[0]} rank={1} delay={0}    />
          <PodiumCard member={top3[2]} rank={3} delay={0.26} />
        </div>
      </div>

      {/* ── Leaderboard table ────────────────────────────────────────────────── */}
      <div className="rounded-[12px] border border-[#222222] overflow-hidden">
        <div className="overflow-x-auto">

          {/* Table header */}
          <div
            className="bg-[#0C0C0C] border-b border-[#222222] px-5 py-3"
            style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, minWidth: 'max-content', width: '100%' }}
          >
            {['Rang', 'Membre', 'Niveau', 'Points', 'Modules', 'Streak', 'Ancienneté'].map((h) => (
              <span
                key={h}
                className="text-[11px] font-medium uppercase tracking-wider text-[rgba(255,255,255,0.35)]"
              >
                {h}
              </span>
            ))}
            {['SaaS lancés', 'MRR', 'Revendus'].map((h) => (
              <ComingSoonTooltip key={h}>
                <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-[rgba(255,255,255,0.2)] cursor-help">
                  {h}
                  <Info size={10} className="flex-shrink-0" />
                </span>
              </ComingSoonTooltip>
            ))}
          </div>

          {/* Data rows */}
          {MOCK_MEMBERS.map((m, idx) => (
            <motion.div
              key={m.rank}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.03 * idx }}
              className={`relative px-5 py-3 border-b border-[#111111] last:border-b-0 cursor-pointer transition-colors duration-150 ${
                m.isCurrentUser
                  ? 'bg-[#1A1A2E]'
                  : 'hover:bg-[#141414]'
              }`}
              style={{
                display: 'grid',
                gridTemplateColumns: COL_TEMPLATE,
                alignItems: 'center',
                minWidth: 'max-content',
                width: '100%',
              }}
            >
              {/* Left border accent for current user */}
              {m.isCurrentUser && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#3B82F6] rounded-r-sm" />
              )}

              {/* Rang */}
              <span
                className="font-bold text-[14px]"
                style={{ color: getRankColor(m.rank) }}
              >
                #{m.rank}
              </span>

              {/* Membre */}
              <div className="flex items-center gap-2.5 min-w-0">
                <MemberAvatar member={m} size="sm" />
                <span className="text-[#F0F0F0] text-[13px] font-medium truncate">
                  {m.name}
                </span>
                {m.isCurrentUser && (
                  <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(59,130,246,0.18)] text-[#3B82F6] uppercase tracking-wide">
                    C'est vous
                  </span>
                )}
              </div>

              {/* Niveau */}
              <div>
                <LevelBadge level={m.level} />
              </div>

              {/* Points */}
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#F0F0F0]">
                <Zap size={12} className="text-[#FFD700] flex-shrink-0" strokeWidth={1.5} />
                {m.points.toLocaleString('fr-FR')}
              </div>

              {/* Modules */}
              <span className="text-[13px] text-[rgba(255,255,255,0.55)]">
                {m.modules}/15
              </span>

              {/* Streak */}
              <div className="flex items-center gap-1 text-[13px] text-[rgba(255,255,255,0.55)]">
                <Flame
                  size={12}
                  strokeWidth={1.5}
                  className={m.streak > 0 ? 'text-orange-400' : 'text-[rgba(255,255,255,0.2)]'}
                />
                {m.streak}j
              </div>

              {/* Ancienneté */}
              <span className="text-[12px] text-[rgba(255,255,255,0.4)]">
                {m.months} mois
              </span>

              {/* Coming soon — 3 columns */}
              <span className="text-[12px] text-[rgba(255,255,255,0.15)]">—</span>
              <span className="text-[12px] text-[rgba(255,255,255,0.15)]">—</span>
              <span className="text-[12px] text-[rgba(255,255,255,0.15)]">—</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
