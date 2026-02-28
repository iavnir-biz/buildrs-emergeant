import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    text: 'Quel est ton objectif principal ?',
    options: [
      { id: 'liberte', label: 'Liberté financière', desc: "Remplacer mon salaire par des revenus passifs" },
      { id: 'cashout', label: 'Cash-out rapide', desc: "Vendre le SaaS le plus vite possible" },
      { id: 'passif', label: 'Revenu passif', desc: "Générer des revenus sans gestion active" },
      { id: 'interne', label: 'Usage interne', desc: "Outil pour mon propre business" },
    ]
  },
  {
    id: 2,
    text: 'Ton horizon temporel ?',
    options: [
      { id: '6m', label: '< 6 mois' }, { id: '18m', label: '6-18 mois' }, { id: '18p', label: '18 mois+' }
    ]
  },
  {
    id: 3,
    text: "Ton appétit pour la gestion opérationnelle ?",
    options: [
      { id: 'faible', label: 'Faible', desc: "Je veux une sortie clean sans m'embêter" },
      { id: 'moyen', label: 'Moyen', desc: "Je peux gérer quelques mois avant de passer la main" },
      { id: 'eleve', label: 'Élevé', desc: "Je suis prêt à scaler avant de vendre" },
    ]
  },
  {
    id: 4,
    text: 'Ton MRR cible avant sortie ?',
    options: [
      { id: '2k', label: '< 2 000€/mois' }, { id: '5k', label: '2 000 – 5 000€/mois' },
      { id: '10k', label: '5 000 – 10 000€/mois' }, { id: '10k+', label: '> 10 000€/mois' },
    ]
  },
  {
    id: 5,
    text: 'Tu veux garder des parts ou sortie totale ?',
    options: [
      { id: 'total', label: 'Sortie totale', desc: "Je revends 100% et je passe à autre chose" },
      { id: 'partiel', label: 'Partiel', desc: "Je garde une participation et des royalties" },
    ]
  },
];

const STRATEGIES = {
  liberte_passif: "MRR long terme — Développe un SaaS stable avec faible churn, puis revends quand le multiple est optimal.",
  cashout_6m: "Revente rapide — Lance un MVP, atteins 2 000€+ MRR rapidement et propose-le sur MicroAcquire ou Acquire.com.",
  default: "MRR + Revente partielle — Construis un SaaS scalable, conserve 20-30% et revends la majorité pour du cash.",
};

export default function StrategieSortie() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const currentQ = QUESTIONS[step];

  const selectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
    else {
      const objective = answers[1];
      const horizon = answers[2];
      let stratKey = 'default';
      if (objective === 'liberte' || objective === 'passif') stratKey = 'liberte_passif';
      if (objective === 'cashout' && horizon === '6m') stratKey = 'cashout_6m';
      setResult(STRATEGIES[stratKey]);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Stratégie de sortie</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Détermine <strong className="text-[rgba(255,255,255,0.8)] font-semibold">la meilleure façon de monétiser ou céder</strong> ton SaaS.
        </p>
      </div>

      {!result ? (
        <div className="max-w-[600px]">
          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#F5F0E8]' : 'bg-[#222222]'}`}></div>
            ))}
          </div>

          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
            <p className="text-[rgba(255,255,255,0.45)] text-[12px] mb-2">Question {step + 1}/{QUESTIONS.length}</p>
            <h2 className="text-[#F0F0F0] font-semibold text-[18px] mb-5">{currentQ.text}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map(opt => (
                <button
                  key={opt.id}
                  data-testid={`exit-option-${opt.id}`}
                  onClick={() => selectAnswer(currentQ.id, opt.id)}
                  className={`p-3 rounded-[8px] border text-left transition-colors ${
                    answers[currentQ.id] === opt.id
                      ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)]'
                      : 'border-[#222222] hover:border-[#2A2A2A]'
                  }`}
                >
                  <div className="text-[#F0F0F0] font-medium text-[13px]">{opt.label}</div>
                  {opt.desc && <div className="text-[rgba(255,255,255,0.4)] text-[11px] mt-0.5">{opt.desc}</div>}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              {step > 0 && <button onClick={() => setStep(s => s - 1)} className="btn-secondary">Retour</button>}
              <button
                data-testid="exit-next-btn"
                onClick={next}
                disabled={!answers[currentQ.id]}
                className="btn-cream ml-auto flex items-center gap-1.5 disabled:opacity-40"
              >
                {step === QUESTIONS.length - 1 ? 'Voir ma stratégie' : 'Suivant'} <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[600px] animate-fade-in">
          <div className="bg-[#141414] border border-[rgba(245,240,232,0.2)] rounded-[10px] p-6 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-[#22C55E]" />
              <span className="text-[#F5F0E8] font-semibold text-[14px]">Stratégie recommandée</span>
            </div>
            <p className="text-[rgba(255,255,255,0.7)] text-[14px] leading-relaxed mb-5">{result}</p>
            <h3 className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-3">Prochaines étapes</h3>
            <div className="space-y-2">
              {['Valide ton MRR cible et ton timeline', 'Identifie 3 plateformes de revente (Acquire.com, MicroAcquire, Flippa)', 'Prépare ta documentation financière dès maintenant', 'Optimise le churn et le LTV avant la sortie'].map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[rgba(255,255,255,0.6)] text-[13px]">
                  <span className="text-[#F5F0E8] font-bold flex-shrink-0">{i + 1}.</span> {s}
                </div>
              ))}
            </div>
          </div>
          <button onClick={reset} className="btn-secondary">Recommencer</button>
        </div>
      )}
    </div>
  );
}
