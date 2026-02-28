import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CalculateurMRR() {
  const [inputs, setInputs] = useState({
    monthly_price: 29, annual_price: 290,
    target_m1: 10, target_m6: 50, target_m12: 150,
    churn_rate: 5, b2b_ratio: 60,
  });

  const set = (k, v) => setInputs(p => ({ ...p, [k]: Number(v) }));

  const calcMRR = (targetClients, churn) => {
    const retainedFraction = (1 - churn / 100);
    const avgMRR = inputs.monthly_price * 0.7 + (inputs.annual_price / 12) * 0.3;
    return Math.round(targetClients * retainedFraction * avgMRR);
  };

  const mrr1 = calcMRR(inputs.target_m1, 0);
  const mrr6 = calcMRR(inputs.target_m6, inputs.churn_rate);
  const mrr12 = calcMRR(inputs.target_m12, inputs.churn_rate);
  const arr = mrr12 * 12;
  const cumulative = Math.round((mrr1 + mrr6 + mrr12) / 3 * 12 * 0.8);

  const chartData = [
    { month: 'M1', mrr: mrr1 }, { month: 'M3', mrr: Math.round((mrr1 + mrr6) / 2) },
    { month: 'M6', mrr: mrr6 }, { month: 'M9', mrr: Math.round((mrr6 + mrr12) / 2) },
    { month: 'M12', mrr: mrr12 },
  ];

  const InputSlider = ({ label, field, min, max, step = 1, unit = '' }) => (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-[rgba(255,255,255,0.55)] text-[12px]">{label}</label>
        <span className="text-[#F5F0E8] font-semibold text-[12px]">{inputs[field]}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={inputs[field]}
        onChange={e => set(field, e.target.value)}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #F5F0E8 ${((inputs[field] - min) / (max - min)) * 100}%, #222222 ${((inputs[field] - min) / (max - min)) * 100}%)` }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[rgba(255,255,255,0.2)] text-[10px]">{min}{unit}</span>
        <span className="text-[rgba(255,255,255,0.2)] text-[10px]">{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Calculateur MRR</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Projette tes <strong className="text-[rgba(255,255,255,0.8)] font-semibold">revenus récurrents mensuels</strong> selon ta stratégie de pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Inputs */}
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 space-y-5">
          <h3 className="text-[rgba(255,255,255,0.5)] text-[12px] uppercase tracking-wider">Configuration</h3>
          <InputSlider label="Prix mensuel abonnement" field="monthly_price" min={5} max={500} unit="€" />
          <InputSlider label="Prix annuel abonnement" field="annual_price" min={50} max={5000} step={10} unit="€" />
          <div className="h-px bg-[#1A1A1A]"></div>
          <InputSlider label="Objectif clients — Mois 1" field="target_m1" min={1} max={100} unit=" clients" />
          <InputSlider label="Objectif clients — Mois 6" field="target_m6" min={5} max={500} unit=" clients" />
          <InputSlider label="Objectif clients — Mois 12" field="target_m12" min={10} max={2000} step={10} unit=" clients" />
          <div className="h-px bg-[#1A1A1A]"></div>
          <InputSlider label="Taux de churn estimé" field="churn_rate" min={0} max={30} unit="%" />
          <InputSlider label="Part B2B" field="b2b_ratio" min={0} max={100} unit="%" />
        </div>

        {/* Results */}
        <div className="space-y-5">
          {/* MRR cards */}
          <div className="grid grid-cols-3 gap-4">
            {[['MRR Mois 1', mrr1], ['MRR Mois 6', mrr6], ['MRR Mois 12', mrr12]].map(([label, value]) => (
              <div key={label} data-testid={`mrr-${label}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 text-center">
                <div className="text-[rgba(255,255,255,0.45)] text-[11px] mb-2">{label}</div>
                <div className="text-[#F0F0F0] font-bold text-[22px]">{value.toLocaleString('fr-FR')}€</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 text-center">
              <div className="text-[rgba(255,255,255,0.45)] text-[11px] mb-2">ARR projeté</div>
              <div className="text-[#F5F0E8] font-bold text-[22px]">{arr.toLocaleString('fr-FR')}€</div>
            </div>
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 text-center">
              <div className="text-[rgba(255,255,255,0.45)] text-[11px] mb-2">Revenu cumulé 12 mois</div>
              <div className="text-[#F0F0F0] font-bold text-[22px]">{cumulative.toLocaleString('fr-FR')}€</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
            <h3 className="text-[rgba(255,255,255,0.5)] text-[12px] uppercase tracking-wider mb-4">Projection MRR</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#141414', border: '1px solid #222222', borderRadius: '8px', color: '#F0F0F0', fontSize: 12 }} />
                <Line type="monotone" dataKey="mrr" stroke="#F5F0E8" strokeWidth={2} dot={{ fill: '#F5F0E8', r: 4 }} name="MRR (€)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
