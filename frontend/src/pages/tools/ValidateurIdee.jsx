import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const CRITERIA = [
  { key: 'market_size', label: 'Taille du marché', weight: 25 },
  { key: 'competition', label: 'Concurrence', weight: 20 },
  { key: 'monetization', label: 'Facilité de monétisation', weight: 20 },
  { key: 'urgency', label: "Urgence du problème", weight: 20 },
  { key: 'scalability', label: 'Scalabilité', weight: 15 },
];

export default function ValidateurIdee() {
  const [form, setForm] = useState({ name: '', niche: '', problem: '', target: 'B2B' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name || !form.problem) return;
    setLoading(true);
    setTimeout(() => {
      const scores = {
        market_size: Math.floor(Math.random() * 40) + 55,
        competition: Math.floor(Math.random() * 50) + 40,
        monetization: Math.floor(Math.random() * 35) + 60,
        urgency: Math.floor(Math.random() * 40) + 50,
        scalability: Math.floor(Math.random() * 45) + 50,
      };
      const total = CRITERIA.reduce((acc, c) => acc + (scores[c.key] * c.weight / 100), 0);
      setResult({ scores, total: Math.round(total) });
      setLoading(false);
    }, 1200);
  };

  const getVerdict = (score) => {
    if (score >= 70) return { label: 'Idée viable', icon: CheckCircle, color: '#22C55E', class: 'badge-green' };
    if (score >= 50) return { label: 'À affiner', icon: AlertTriangle, color: '#F59E0B', class: '' };
    return { label: 'Risqué', icon: XCircle, color: '#EF4444', class: 'badge-red' };
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Validateur d'idée</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Analyse si ton <strong className="text-[rgba(255,255,255,0.8)] font-semibold">idée de SaaS a un vrai marché</strong> avant d'investir du temps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 space-y-4">
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Nom ou description</label>
            <input
              data-testid="validator-name-input"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: InvoiceFlow – automatisation de facturation"
              className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Niche / Secteur</label>
            <input
              value={form.niche}
              onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
              placeholder="Ex: Finance, Marketing, RH..."
              className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Problème résolu</label>
            <textarea
              data-testid="validator-problem-input"
              value={form.problem}
              onChange={e => setForm(p => ({ ...p, problem: e.target.value }))}
              rows={3}
              placeholder="Décris le problème que ton SaaS résout..."
              className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none resize-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Cible</label>
            <div className="flex gap-2">
              {['B2B', 'B2C', 'Les deux'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm(p => ({ ...p, target: t }))}
                  className={`flex-1 py-2 rounded-[6px] text-[12px] font-medium border transition-colors ${
                    form.target === t ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)] text-[#F5F0E8]' : 'border-[#222222] text-[rgba(255,255,255,0.5)] hover:border-[#2A2A2A]'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
          <button
            data-testid="validate-idea-btn"
            onClick={validate}
            disabled={!form.name || !form.problem || loading}
            className="btn-cream w-full py-3 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading ? <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div> : null}
            {loading ? 'Analyse en cours...' : 'Valider mon idée →'}
          </button>
        </div>

        {result && (
          <div className="animate-fade-in space-y-4">
            {/* Score + verdict */}
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[rgba(255,255,255,0.5)] text-[13px]">Score de viabilité</span>
                {(() => {
                  const v = getVerdict(result.total);
                  const Icon = v.icon;
                  return (
                    <span className={`flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-[4px] ${v.class || 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]'}`}>
                      <Icon size={13} /> {v.label}
                    </span>
                  );
                })()}
              </div>
              <div className="text-[#F0F0F0] font-bold text-[36px] mb-2">{result.total}<span className="text-[rgba(255,255,255,0.3)] text-[18px] font-normal">/100</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${result.total}%` }}></div></div>
            </div>

            {/* Criteria scores */}
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <h3 className="text-[rgba(255,255,255,0.5)] text-[12px] uppercase tracking-wider mb-4">Détail par critère</h3>
              <div className="space-y-3">
                {CRITERIA.map(c => (
                  <div key={c.key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[rgba(255,255,255,0.65)] text-[12px]">{c.label}</span>
                      <span className="text-[#F0F0F0] font-medium text-[12px]">{result.scores[c.key]}/100</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${result.scores[c.key]}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <h3 className="text-[rgba(255,255,255,0.5)] text-[12px] uppercase tracking-wider mb-3">Recommandations</h3>
              <div className="space-y-2">
                {['Valide l\'idée avec 10 interviews prospects avant de coder', 'Commence par un prix premium pour valider la valeur perçue', 'Identifie 3 concurrents et positionne-toi différemment'].map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-[rgba(255,255,255,0.6)] text-[13px]">
                    <span className="text-[#F5F0E8] font-bold flex-shrink-0">{i + 1}.</span> {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
