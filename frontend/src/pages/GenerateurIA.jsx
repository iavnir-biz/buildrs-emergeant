import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sparkles, RefreshCw, Bookmark, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const NICHES = ['Finance', 'Marketing', 'RH', 'E-commerce', 'Santé', 'Productivité', 'Éducation', 'Juridique'];

export default function GenerateurIA() {
  const [prompt, setPrompt] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/ideas').then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/ideas', { prompt, niche: selectedNiche });
      setResult(res.data);
      setHistory(prev => [res.data, ...prev.slice(0, 4)]);
    } catch {
      toast.error("Erreur lors de la génération");
    }
    setLoading(false);
  };

  const saveIdea = async () => {
    if (!result) return;
    try {
      await api.post('/favorites', {
        item_type: 'idea',
        item_id: result.id,
        item_title: result.name,
        item_description: result.problem,
        item_url: '/generateur-ia',
      });
      toast.success('Idée sauvegardée en favoris');
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Générateur d'idées SaaS</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Décris un <strong className="text-[rgba(255,255,255,0.8)] font-semibold">problème ou une niche</strong>. L'IA génère ton concept SaaS validé.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div>
          {/* Input area */}
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-5">
            <textarea
              data-testid="idea-prompt-input"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Les freelances perdent trop de temps à relancer leurs clients pour les paiements..."
              rows={5}
              className="w-full bg-transparent text-[rgba(255,255,255,0.8)] text-[14px] resize-none outline-none placeholder:text-[rgba(255,255,255,0.25)] leading-relaxed mb-4 border-b border-[#222222] pb-4"
            />
            {/* Niche pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {NICHES.map(n => (
                <button
                  key={n}
                  data-testid={`niche-${n}`}
                  onClick={() => setSelectedNiche(selectedNiche === n ? '' : n)}
                  className={`text-[12px] font-medium px-3 py-1 rounded-full border transition-colors ${
                    selectedNiche === n
                      ? 'border-[#F5F0E8] bg-[rgba(245,240,232,0.08)] text-[#F5F0E8]'
                      : 'border-[#2A2A2A] text-[rgba(255,255,255,0.5)] hover:border-[#333]'
                  }`}
                >{n}</button>
              ))}
            </div>
            <button
              data-testid="generate-idea-btn"
              onClick={generate}
              disabled={!prompt.trim() || loading}
              className="btn-cream w-full py-3 flex items-center justify-center gap-2 text-[14px] disabled:opacity-40"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div> Génération en cours...</>
              ) : (
                <><Sparkles size={16} /> Générer mon idée SaaS →</>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div data-testid="idea-result" className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-[#F0F0F0] font-bold text-[20px]">{result.name}</h2>
                <div className="flex gap-2">
                  <button onClick={generate} className="btn-secondary text-[12px] flex items-center gap-1">
                    <RefreshCw size={12} /> Régénérer
                  </button>
                  <button onClick={saveIdea} className="btn-secondary text-[12px] flex items-center gap-1">
                    <Bookmark size={12} /> Sauvegarder
                  </button>
                </div>
              </div>
              <div className="h-px bg-[#222222] mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  ['Problème', result.problem],
                  ['Solution', result.solution],
                  ['Cible', result.target],
                  ['MRR estimé', `${result.mrr_estimate_low}€ – ${result.mrr_estimate_high}€/mois`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">{k}</div>
                    <div className="text-[rgba(255,255,255,0.8)] text-[13px]">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-[#1A1A1A] rounded-[8px] p-3">
                <div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">Score opportunité</div>
                  <div className="text-[#F0F0F0] font-bold text-[18px]">{result.opportunity_score}<span className="text-[rgba(255,255,255,0.4)] text-[13px] font-normal">/100</span></div>
                </div>
                <div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">Complexité</div>
                  <span className="badge-neutral text-[11px] px-2 py-0.5 rounded-[4px]">{result.complexity}</span>
                </div>
                <div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-1">Stratégie de sortie</div>
                  <div className="text-[rgba(255,255,255,0.7)] text-[12px]">{result.exit_strategy}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn-cream flex items-center gap-1.5 text-[13px]">
                  Créer mon plan d'action <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <h3 className="text-[rgba(255,255,255,0.4)] text-[12px] font-medium uppercase tracking-wider mb-3">Historique</h3>
          {history.length === 0 ? (
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 text-center">
              <p className="text-[rgba(255,255,255,0.3)] text-[12px]">Aucune idée générée</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 5).map(idea => (
                <div
                  key={idea.id}
                  onClick={() => setResult(idea)}
                  className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 cursor-pointer hover:border-[#2A2A2A] transition-colors"
                >
                  <div className="text-[#F0F0F0] font-semibold text-[13px] mb-1">{idea.name}</div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px] truncate">{idea.niche} · Score {idea.opportunity_score}/100</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
