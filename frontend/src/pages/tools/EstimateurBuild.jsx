import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export default function EstimateurBuild() {
  const [form, setForm] = useState({
    saas_type: 'standard', level: 'debutant',
    hours_per_week: 10, has_mockup: false, has_validated: false
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const BASE_DAYS = { simple: 14, standard: 30, complexe: 60 };
    const LEVEL_MULTIPLIER = { debutant: 1.8, intermediaire: 1.2, avance: 0.8 };
    let days = BASE_DAYS[form.saas_type] * LEVEL_MULTIPLIER[form.level];
    if (!form.has_mockup) days += 5;
    if (!form.has_validated) days += 7;
    const hoursAvailable = form.hours_per_week;
    const weeksNeeded = Math.ceil((days * 8) / hoursAvailable);
    const phases = [
      { label: 'Validation', days: Math.round(days * 0.15) },
      { label: 'Design', days: Math.round(days * 0.15) },
      { label: 'Build', days: Math.round(days * 0.45) },
      { label: 'Test', days: Math.round(days * 0.15) },
      { label: 'Lancement', days: Math.round(days * 0.10) },
    ];
    setResult({ totalDays: Math.round(days), weeksNeeded, phases });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Estimateur de build</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Combien de temps pour <strong className="text-[rgba(255,255,255,0.8)] font-semibold">créer ton SaaS</strong> avec la méthode Buildrs ?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 space-y-5">
          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-2 block">Type de SaaS</label>
            <div className="space-y-2">
              {[
                { id: 'simple', label: 'Simple — 1 fonctionnalité' },
                { id: 'standard', label: 'Standard — 3-5 fonctionnalités' },
                { id: 'complexe', label: 'Complexe — 10+ fonctionnalités' },
              ].map(opt => (
                <button
                  key={opt.id}
                  data-testid={`build-type-${opt.id}`}
                  onClick={() => setForm(p => ({ ...p, saas_type: opt.id }))}
                  className={`w-full p-3 rounded-[8px] border text-left text-[13px] transition-colors ${
                    form.saas_type === opt.id ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)] text-[#F5F0E8]' : 'border-[#222222] text-[rgba(255,255,255,0.6)] hover:border-[#2A2A2A]'
                  }`}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-2 block">Niveau technique</label>
            <div className="grid grid-cols-3 gap-2">
              {['debutant', 'intermediaire', 'avance'].map(l => (
                <button
                  key={l}
                  onClick={() => setForm(p => ({ ...p, level: l }))}
                  className={`py-2 rounded-[6px] text-[12px] font-medium border capitalize transition-colors ${
                    form.level === l ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)] text-[#F5F0E8]' : 'border-[#222222] text-[rgba(255,255,255,0.5)]'
                  }`}
                >{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-2 block">
              Heures disponibles par semaine : <span className="text-[#F5F0E8]">{form.hours_per_week}h</span>
            </label>
            <input
              type="range" min={5} max={60} step={5}
              value={form.hours_per_week}
              onChange={e => setForm(p => ({ ...p, hours_per_week: Number(e.target.value) }))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #F5F0E8 ${((form.hours_per_week - 5) / 55) * 100}%, #222222 ${((form.hours_per_week - 5) / 55) * 100}%)` }}
            />
          </div>

          <div className="space-y-3">
            {[
              { key: 'has_mockup', label: 'Tu as déjà une maquette ?' },
              { key: 'has_validated', label: 'Tu as déjà validé l\'idée ?' },
            ].map(opt => (
              <div key={opt.key} className="flex items-center justify-between">
                <span className="text-[rgba(255,255,255,0.6)] text-[13px]">{opt.label}</span>
                <div className="flex gap-2">
                  {['Oui', 'Non'].map(v => (
                    <button
                      key={v}
                      onClick={() => setForm(p => ({ ...p, [opt.key]: v === 'Oui' }))}
                      className={`px-3 py-1 rounded-[4px] text-[11px] font-medium border transition-colors ${
                        (v === 'Oui') === form[opt.key] ? 'border-[#F5F0E8] text-[#F5F0E8] bg-[rgba(245,240,232,0.06)]' : 'border-[#222222] text-[rgba(255,255,255,0.4)]'
                      }`}
                    >{v}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            data-testid="estimate-btn"
            onClick={calculate}
            className="btn-cream w-full py-3 flex items-center justify-center gap-2"
          >
            <Clock size={15} /> Estimer mon temps de build →
          </button>
        </div>

        {result && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6 text-center">
              <div className="text-[rgba(255,255,255,0.45)] text-[13px] mb-2">Temps estimé total</div>
              <div className="text-[#F0F0F0] font-bold text-[40px] mb-1">{result.totalDays} jours</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[13px]">soit environ {result.weeksNeeded} semaines à {form.hours_per_week}h/semaine</div>
            </div>

            {/* Phase breakdown */}
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <h3 className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-4">Découpage par phase</h3>
              <div className="space-y-3">
                {result.phases.map((phase, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[rgba(255,255,255,0.7)] text-[12px]">{phase.label}</span>
                      <span className="text-[rgba(255,255,255,0.5)] text-[12px]">{phase.days} jours</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(phase.days / result.totalDays) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] border-l-2 border-l-[#F5F0E8] border-t-[#222222] border-r-[#222222] border-b-[#222222] border rounded-[10px] p-4">
              <p className="text-[rgba(255,255,255,0.55)] text-[13px] font-light italic leading-relaxed">
                "Avec {form.hours_per_week}h/jour et la méthode Buildrs, tu peux avoir ton premier client en <strong className="text-[rgba(255,255,255,0.8)] not-italic">{result.weeksNeeded} semaines</strong>."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
