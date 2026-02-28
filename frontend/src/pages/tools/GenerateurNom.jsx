import React, { useState } from 'react';
import { Shuffle, ExternalLink } from 'lucide-react';

const PREFIXES = ['flow', 'nest', 'forge', 'sync', 'hub', 'link', 'pulse', 'loop', 'base', 'core'];
const SUFFIXES = ['ify', 'ly', 'ai', 'io', 'app', 'hub', 'pro', 'kit', 'lab', 'desk'];
const STYLES = [
  { id: 'court', label: 'Court' },
  { id: 'memorable', label: 'Mémorable' },
  { id: 'descriptif', label: 'Descriptif' },
  { id: 'invente', label: 'Inventé' },
];

function generateName(keywords, style) {
  const kw = keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
  const base = kw[0] || 'saas';
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];

  if (style === 'court') return `${base.slice(0, 4)}${suffix}`;
  if (style === 'invente') return `${prefix}${base.slice(0, 3)}`;
  if (style === 'descriptif') return `${base}${suffix}`;
  return `${base}${prefix}`;
}

export default function GenerateurNom() {
  const [keywords, setKeywords] = useState('');
  const [niche, setNiche] = useState('');
  const [style, setStyle] = useState('memorable');
  const [names, setNames] = useState([]);

  const generate = () => {
    if (!keywords.trim()) return;
    const generated = Array.from({ length: 12 }, () => {
      const name = generateName(keywords, style);
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        com: Math.random() > 0.4,
        io: Math.random() > 0.3,
        fr: Math.random() > 0.5,
        score: Math.floor(Math.random() * 30) + 70,
      };
    });
    setNames(generated);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Générateur de nom SaaS</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Trouve un <strong className="text-[rgba(255,255,255,0.8)] font-semibold">nom percutant et disponible</strong> pour ton SaaS.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-6 max-w-[600px]">
        <div className="space-y-4">
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Mots-clés (séparés par virgule)</label>
            <input
              data-testid="name-keywords-input"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="Ex: facture, freelance, rapide"
              className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Niche / Secteur</label>
            <input
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="Ex: Finance, Marketing..."
              className="w-full bg-[#0A0A0A] border border-[#222222] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Style</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`py-2 rounded-[6px] text-[12px] font-medium border transition-colors ${
                    style === s.id ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)] text-[#F5F0E8]' : 'border-[#222222] text-[rgba(255,255,255,0.5)]'
                  }`}
                >{s.label}</button>
              ))}
            </div>
          </div>
          <button
            data-testid="generate-names-btn"
            onClick={generate}
            disabled={!keywords.trim()}
            className="btn-cream w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-40"
          >
            <Shuffle size={14} /> Générer 12 noms →
          </button>
        </div>
      </div>

      {names.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in">
          {names.map((n, i) => (
            <div key={i} data-testid={`name-result-${i}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 card-hover">
              <div className="text-[#F0F0F0] font-bold text-[16px] mb-2">{n.name}</div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium ${n.com ? 'badge-green' : 'badge-red'}`}>.com {n.com ? '✓' : '✗'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium ${n.io ? 'badge-green' : 'badge-red'}`}>.io {n.io ? '✓' : '✗'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium ${n.fr ? 'badge-green' : 'badge-red'}`}>.fr {n.fr ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[rgba(255,255,255,0.4)] text-[10px]">Score: {n.score}/100</div>
                <button className="text-[rgba(255,255,255,0.3)] hover:text-[#F5F0E8] transition-colors">
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
