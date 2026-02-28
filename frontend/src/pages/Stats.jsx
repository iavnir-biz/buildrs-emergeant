import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BookOpen, FileText, Zap, Target, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#141414] border border-[#222222] rounded-[8px] px-3 py-2">
      <p className="text-[rgba(255,255,255,0.5)] text-[11px] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[#F0F0F0] text-[12px] font-medium">{p.name}: <span style={{ color: p.color }}>{p.value}</span></p>
      ))}
    </div>
  );
};

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/stats'), api.get('/activity')]).then(([s, a]) => {
      setStats(s.data);
      setActivity(a.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: Target, label: 'Points builder', value: stats.points, sub: 'Total accumulé' },
    { icon: Zap, label: 'Streak actuel', value: `${stats.streak} j`, sub: 'Jours consécutifs' },
    { icon: BookOpen, label: 'Modules complétés', value: `${stats.modules_completed}/${stats.modules_total}`, sub: `${stats.progress_percent}% du programme` },
    { icon: FileText, label: 'Notes créées', value: stats.notes_count, sub: 'Notes personnelles' },
  ] : [];

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Statistiques</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Ton <strong className="text-[rgba(255,255,255,0.8)] font-semibold">avancement détaillé</strong> dans le programme.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {loading ? [1,2,3,4].map(i => (
          <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 animate-pulse">
            <div className="h-2 bg-[#1A1A1A] rounded mb-4 w-1/2"></div>
            <div className="h-7 bg-[#1A1A1A] rounded mb-2 w-2/3"></div>
          </div>
        )) : statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} data-testid={`stats-card-${i}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} className="text-[rgba(255,255,255,0.4)]" strokeWidth={1.5} />
                <span className="text-[rgba(255,255,255,0.4)] text-[12px]">{s.label}</span>
              </div>
              <div className="text-[#F0F0F0] font-bold text-[28px]">{s.value}</div>
              <div className="text-[rgba(255,255,255,0.3)] text-[11px] mt-1">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6 mb-6">
        <h2 className="text-[#F0F0F0] font-semibold text-[16px] mb-5 flex items-center gap-2">
          <Activity size={16} strokeWidth={1.5} /> Activité hebdomadaire
        </h2>
        {stats?.weekly_activity && (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.weekly_activity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="modules" stroke="#F5F0E8" strokeWidth={2} dot={{ fill: '#F5F0E8', r: 3 }} name="Modules" />
              <Line type="monotone" dataKey="minutes" stroke="rgba(245,240,232,0.35)" strokeWidth={1.5} dot={false} name="Minutes" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
        <h2 className="text-[#F0F0F0] font-semibold text-[16px] mb-4">Dernières activités</h2>
        {activity.length === 0 ? (
          <p className="text-[rgba(255,255,255,0.35)] text-[13px]">Aucune activité récente.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.type === 'module_completed' ? 'bg-[#22C55E]' : 'bg-[#F5F0E8]'}`}></div>
                  <span className="text-[rgba(255,255,255,0.7)] text-[13px]">{a.title}</span>
                </div>
                <span className="text-[rgba(255,255,255,0.3)] text-[11px]">
                  {a.timestamp ? new Date(a.timestamp).toLocaleDateString('fr-FR') : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
