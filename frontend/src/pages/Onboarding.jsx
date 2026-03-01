import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle } from 'lucide-react';
import BuildrsLogo from '../components/Logo';

const STEP1_OPTIONS = [
  { id: 'salarie', label: 'Salarié', desc: 'Je travaille en entreprise et veux un revenu complémentaire' },
  { id: 'etudiant', label: 'Étudiant', desc: 'Je suis en études et veux lancer mon premier projet' },
  { id: 'entrepreneur', label: 'Entrepreneur', desc: 'J\'ai déjà une expérience business et veux scaler' },
  { id: 'reconversion', label: 'En reconversion', desc: 'Je change de cap et mise sur le SaaS IA' },
];

const STEP2_OPTIONS = [
  { id: 'debutant', label: 'Débutant', desc: 'Je ne code pas du tout, je pars de zéro' },
  { id: 'intermediaire', label: 'Intermédiaire', desc: 'Je connais les bases, j\'ai des notions de dev' },
  { id: 'avance', label: 'Avancé', desc: 'Je suis dev ou j\'ai un background technique solide' },
];

const STEP3_OPTIONS = [
  { id: 'revenu', label: 'Revenu complémentaire', desc: 'Générer 1 000 à 5 000€/mois en plus de mon activité principale' },
  { id: 'liberte', label: 'Liberté financière', desc: 'Créer un revenu passif suffisant pour quitter le salariat' },
  { id: 'revente', label: 'Revente SaaS', desc: 'Builder vite, valider, revendre à 6 chiffres' },
  { id: 'impact', label: 'Impact & audience', desc: 'Créer un outil reconnu dans ma niche, construire une audience' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ builder_type: '', tech_level: '', objective: '' });
  const [loading, setLoading] = useState(false);

  const select = (field, value) => setSelections(prev => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return !!selections.builder_type;
    if (step === 2) return !!selections.tech_level;
    if (step === 3) return !!selections.objective;
    return true;
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await api.put('/profile', {
        builder_type: selections.builder_type,
        tech_level: selections.tech_level,
        objective: selections.objective,
        onboarding_completed: true,
      });
      setUser(res.data);
      navigate('/dashboard', { replace: true });
    } catch {
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const STEPS_LABELS = ['Qui es-tu ?', 'Ton niveau tech ?', 'Ton objectif ?', 'Ton labo est prêt.'];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 py-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Logo */}
      <div className="flex items-center mb-10">
        <BuildrsLogo height={26} />
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-[3px] w-16 rounded-full transition-colors duration-300 ${s <= step ? 'bg-[#F5F0E8]' : 'bg-[#222222]'}`}></div>
        ))}
      </div>

      <div className="w-full max-w-[560px]">
        {step < 4 && (
          <p className="text-[rgba(255,255,255,0.4)] text-[12px] font-medium uppercase tracking-wider mb-2">
            Étape {step} / 3
          </p>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-[#F0F0F0] font-semibold text-[22px] mb-1">Qui es-tu ?</h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] mb-6">Pour personnaliser ton parcours dans le laboratoire.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEP1_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  data-testid={`onboarding-type-${opt.id}`}
                  onClick={() => select('builder_type', opt.id)}
                  className={`p-4 rounded-[10px] border text-left transition-colors duration-150 ${
                    selections.builder_type === opt.id
                      ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)]'
                      : 'border-[#222222] bg-[#141414] hover:border-[#2A2A2A]'
                  }`}
                >
                  <div className="text-[#F0F0F0] font-semibold text-[14px] mb-1">{opt.label}</div>
                  <div className="text-[rgba(255,255,255,0.45)] text-[12px] font-light">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-[#F0F0F0] font-semibold text-[22px] mb-1">Ton niveau technique ?</h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] mb-6">Aucun prérequis pour réussir — on s'adapte à toi.</p>
            <div className="grid grid-cols-1 gap-3">
              {STEP2_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  data-testid={`onboarding-level-${opt.id}`}
                  onClick={() => select('tech_level', opt.id)}
                  className={`p-4 rounded-[10px] border text-left transition-colors duration-150 ${
                    selections.tech_level === opt.id
                      ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)]'
                      : 'border-[#222222] bg-[#141414] hover:border-[#2A2A2A]'
                  }`}
                >
                  <div className="text-[#F0F0F0] font-semibold text-[14px] mb-1">{opt.label}</div>
                  <div className="text-[rgba(255,255,255,0.45)] text-[12px]">{opt.desc}</div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-[rgba(255,255,255,0.35)] text-[12px] font-light italic text-center">
              Peu importe ton niveau, la méthode Buildrs t'amène jusqu'au lancement.
            </p>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-[#F0F0F0] font-semibold text-[22px] mb-1">Ton objectif principal ?</h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] mb-6">Pour orienter les recommandations et le plan d'action.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEP3_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  data-testid={`onboarding-goal-${opt.id}`}
                  onClick={() => select('objective', opt.id)}
                  className={`p-4 rounded-[10px] border text-left transition-colors duration-150 ${
                    selections.objective === opt.id
                      ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.06)]'
                      : 'border-[#222222] bg-[#141414] hover:border-[#2A2A2A]'
                  }`}
                >
                  <div className="text-[#F0F0F0] font-semibold text-[14px] mb-1">{opt.label}</div>
                  <div className="text-[rgba(255,255,255,0.45)] text-[12px]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 - Summary */}
        {step === 4 && (
          <div className="animate-fade-in text-center">
            <div className="w-14 h-14 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={28} className="text-[#22C55E]" />
            </div>
            <h2 className="text-[#F0F0F0] font-semibold text-[22px] mb-2">Ton labo est prêt.</h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] mb-8">
              Profil configuré. Tu peux maintenant accéder à toutes les ressources, outils et la communauté Buildrs.
            </p>
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-8 text-left">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">Profil</div>
                  <div className="text-[#F0F0F0] text-[13px] font-medium capitalize">{selections.builder_type?.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">Niveau</div>
                  <div className="text-[#F0F0F0] text-[13px] font-medium capitalize">{selections.tech_level}</div>
                </div>
                <div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">Objectif</div>
                  <div className="text-[#F0F0F0] text-[13px] font-medium capitalize">{selections.objective?.replace('_', ' ')}</div>
                </div>
              </div>
            </div>
            <button
              data-testid="onboarding-finish-btn"
              onClick={handleFinish}
              disabled={loading}
              className="btn-cream w-full py-3 text-[14px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div>
              ) : 'Accéder à mon laboratoire →'}
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Retour
            </button>
            <button
              data-testid="onboarding-next-btn"
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="btn-cream disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuer →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
