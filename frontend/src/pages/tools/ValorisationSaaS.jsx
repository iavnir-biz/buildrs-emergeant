import React, { useState } from 'react';

export default function ValorisationSaaS() {
  const [inputs, setInputs] = useState({
    mrr: 5000, growth: 10, age: 12, churn: 5, type: 'B2B', niche: 'verticale'
  });

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));

  const calcValuation = () => {
    const arr = inputs.mrr * 12;
    let baseMultiple = 3.0;
    if (inputs.type === 'B2B') baseMultiple += 0.8;
    if (inputs.growth >= 15) baseMultiple += 0.5;
    if (inputs.growth >= 25) baseMultiple += 0.5;
    if (inputs.age >= 12) baseMultiple += 0.3;
    if (inputs.churn <= 3) baseMultiple += 0.5;
    if (inputs.churn >= 10) baseMultiple -= 0.8;
    if (inputs.niche === 'verticale') baseMultiple += 0.4;
    const low = Math.round(arr * (baseMultiple - 0.5));
    const mid = Math.round(arr * baseMultiple);
    const high = Math.round(arr * (baseMultiple + 0.8));
    return { low, mid, high, multiple: baseMultiple.toFixed(1) };
  };

  const v = calcValuation();

  const BOOSTS = ['Churn < 3%', 'Croissance > 15%/mois', 'Niche verticale', 'B2B', 'Ancienneté > 18 mois'];
  const RISKS = ['Churn > 10%', 'Croissance < 5%/mois', 'Marché généraliste', 'MRR < 1 000€'];

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Valorisation SaaS</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Estime la <strong className="text-[rgba(255,255,255,0.8)] font-semibold">valeur de revente de ton SaaS</strong> selon les standards du marché.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 space-y-4">
          {[
            { label: 'MRR actuel (€)', field: 'mrr', type: 'number', min: 100, max: 100000 },
            { label: 'Croissance mensuelle (%)', field: 'growth', type: 'number', min: 0, max: 100 },
            { label: 'Ancienneté du SaaS (mois)', field: 'age', type: 'number', min: 1, max: 120 },
            { label: 'Taux de churn (%)', field: 'churn', type: 'number', min: 0, max: 50 },
          ].map(f => (
            <div key={f.field}>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input
                type="number" min={f.min} max={f.max}
                value={inputs[f.field]}
                onChange={e => set(f.field, Number(e.target.value))}
                data-testid={`valuation-${f.field}`}
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {['B2B', 'B2C'].map(t => (
                <button key={t} onClick={() => set('type', t)}
                  className={`flex-1 py-2 rounded-[6px] text-[12px] font-medium border transition-colors ${inputs.type === t ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)] text-[#F5F0E8]' : 'border-[#222222] text-[rgba(255,255,255,0.5)]'}`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Niche</label>
            <div className="flex gap-2">
              {['généraliste', 'verticale'].map(t => (
                <button key={t} onClick={() => set('niche', t)}
                  className={`flex-1 py-2 rounded-[6px] text-[12px] font-medium border capitalize transition-colors ${inputs.niche === t ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)] text-[#F5F0E8]' : 'border-[#222222] text-[rgba(255,255,255,0.5)]'}`}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
            <div className="text-[rgba(255,255,255,0.5)] text-[12px] mb-1">Multiple appliqué</div>
            <div className="text-[#F5F0E8] font-bold text-[20px] mb-4">{v.multiple}× ARR</div>
            <div className="grid grid-cols-3 gap-3">
              {[['Basse', v.low], ['Médiane', v.mid], ['Haute', v.high]].map(([label, val]) => (
                <div key={label} className="text-center">
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] mb-1">{label}</div>
                  <div className="text-[#F0F0F0] font-bold text-[20px]">{(val / 1000).toFixed(0)}k€</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4">
              <h3 className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Booste la valeur
              </h3>
              <div className="space-y-1.5">
                {BOOSTS.map(b => <div key={b} className="text-[rgba(255,255,255,0.55)] text-[11px]">+ {b}</div>)}
              </div>
            </div>
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4">
              <h3 className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span> Réduit la valeur
              </h3>
              <div className="space-y-1.5">
                {RISKS.map(r => <div key={r} className="text-[rgba(255,255,255,0.55)] text-[11px]">- {r}</div>)}
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4">
            <h3 className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-3">Pour maximiser ta valorisation :</h3>
            <div className="space-y-2">
              {['Réduis ton churn sous 3%', 'Atteins 15%+ de croissance mensuelle', 'Documente tes finances et metrics'].map((s, i) => (
                <div key={i} className="flex gap-2 text-[rgba(255,255,255,0.6)] text-[12px]">
                  <span className="text-[#F5F0E8] font-bold">{i + 1}.</span> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
