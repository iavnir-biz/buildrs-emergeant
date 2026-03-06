import React, { useState } from 'react';
import {
  Video, Wand2, FileText, Mic, Image, Clapperboard,
  Play, Loader2, CheckCircle, ChevronRight, Sparkles,
  Clock, Download, RefreshCw, AlertCircle
} from 'lucide-react';

const VIDEO_AGENTS = [
  {
    id: 'script',
    icon: FileText,
    title: 'Agent Script',
    description: 'Génère un script vidéo structuré à partir de ton sujet. Introduction, développement, conclusion et call-to-action optimisés.',
    inputLabel: 'Sujet de ta vidéo',
    inputPlaceholder: 'Ex: Comment valider une idée SaaS en 48h',
    outputLabel: 'Script généré',
    color: '#F5F0E8',
  },
  {
    id: 'voiceover',
    icon: Mic,
    title: 'Agent Voix-off',
    description: "Transforme ton script en voix-off naturelle avec l'IA. Plusieurs styles et tonalités disponibles.",
    inputLabel: 'Script à convertir',
    inputPlaceholder: 'Colle ici le script à convertir en voix-off…',
    outputLabel: 'Voix-off générée',
    color: '#22C55E',
  },
  {
    id: 'thumbnail',
    icon: Image,
    title: 'Agent Miniature',
    description: 'Crée des miniatures YouTube percutantes avec un titre accrocheur et un design pro.',
    inputLabel: 'Titre et style souhaité',
    inputPlaceholder: 'Ex: Miniature style tech sombre avec texte "Lance ton SaaS"',
    outputLabel: 'Miniature générée',
    color: '#3B82F6',
  },
  {
    id: 'montage',
    icon: Clapperboard,
    title: 'Agent Montage',
    description: 'Génère un plan de montage détaillé avec les timecodes, transitions et effets recommandés.',
    inputLabel: 'Décris ta vidéo',
    inputPlaceholder: 'Ex: Vidéo tutoriel de 10 min sur le no-code avec démo écran',
    outputLabel: 'Plan de montage',
    color: '#F59E0B',
  },
];

const FAKE_OUTPUTS = {
  script: `# Script Vidéo — Comment valider une idée SaaS en 48h

## INTRO (0:00 - 0:45)
**Hook:** "90% des SaaS échouent parce qu'ils n'ont jamais validé leur idée. En 48h, je vais te montrer comment ne PAS faire cette erreur."

**Contexte:** Présentation du problème — trop de builders passent des mois à coder sans avoir un seul client potentiel.

## PARTIE 1 — La méthode de pré-validation (0:45 - 3:30)
- Étape 1 : Identifier 3 communautés cibles (Reddit, Discord, LinkedIn)
- Étape 2 : Poster un sondage / MVP de landing page
- Étape 3 : Collecter les emails et mesurer l'intérêt

## PARTIE 2 — Le test de monétisation (3:30 - 6:00)
- Créer une page Stripe avec un tarif early-adopter
- Proposer un pré-achat avec garantie de remboursement
- Objectif : 10 pré-commandes = idée validée

## CONCLUSION + CTA (6:00 - 7:00)
"Si tu veux la checklist complète + les templates, rejoins Buildrs Academy — le lien est dans la description."`,

  voiceover: `✅ Voix-off générée avec succès

🎙️ Style : Narratif professionnel
⏱️ Durée estimée : 6 min 45 sec
📁 Format : MP3 320kbps

Aperçu du texte lu :
"Quatre-vingt-dix pour cent des SaaS échouent parce qu'ils n'ont jamais validé leur idée. En quarante-huit heures, je vais te montrer comment ne PAS faire cette erreur..."

[Le fichier audio serait disponible au téléchargement dans la version complète]`,

  thumbnail: `✅ Miniature générée avec succès

📐 Dimensions : 1280 × 720px
🎨 Style : Dark tech moderne
📝 Texte principal : "LANCE TON SAAS"
📝 Sous-texte : "La méthode en 48h"

Éléments visuels :
- Fond dégradé sombre (#0A0A0A → #1A1A1A)
- Icône rocket stylisée à droite
- Badge "MÉTHODE PROUVÉE" en haut à gauche
- Visage du créateur (à remplacer) côté gauche

[La miniature serait disponible au téléchargement dans la version complète]`,

  montage: `# Plan de Montage — Tutoriel No-Code (10 min)

## Séquence 1 — Hook + Intro (0:00 → 0:40)
- **Plan :** Face caméra, cadrage buste
- **Transition :** Cut rapide
- **Effets :** Texte animé en bas "🔥 Le no-code change tout"
- **Musique :** Lo-fi beat en fond, volume 15%

## Séquence 2 — Démonstration écran (0:40 → 5:30)
- **Plan :** Screencast plein écran
- **Transitions :** Zoom progressif sur les zones cliquées
- **Effets :** Highlights jaunes sur les clics, annotations
- **Audio :** Voix-off + sons de clic subtils

## Séquence 3 — Résultats (5:30 → 8:00)
- **Plan :** Split screen — écran + face caméra
- **Transition :** Slide latéral
- **Effets :** Graphiques animés des métriques

## Séquence 4 — CTA + Outro (8:00 → 10:00)
- **Plan :** Face caméra, zoom léger
- **Overlay :** Bouton "S'abonner" animé + lien Buildrs
- **Musique :** Crescendo final`,
};

function AgentCard({ agent, isSelected, onClick }) {
  const Icon = agent.icon;
  return (
    <button
      data-testid={`agent-card-${agent.id}`}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-[10px] border transition-all duration-150 ${
        isSelected
          ? 'bg-[#1A1A1A] border-[#333333]'
          : 'bg-[#141414] border-[#222222] hover:border-[#2A2A2A] hover:bg-[#181818]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${agent.color}15` }}
        >
          <Icon size={16} style={{ color: agent.color }} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[#F0F0F0] font-semibold text-[13px]">{agent.title}</h3>
            {isSelected && <ChevronRight size={12} className="text-[rgba(255,255,255,0.3)]" />}
          </div>
          <p className="text-[rgba(255,255,255,0.4)] text-[11px] leading-relaxed line-clamp-2">
            {agent.description}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function AcademieVideo() {
  const [selectedAgent, setSelectedAgent] = useState(VIDEO_AGENTS[0]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setOutput('');
    setHasGenerated(false);

    // Simulate AI agent processing
    setTimeout(() => {
      setOutput(FAKE_OUTPUTS[selectedAgent.id]);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2200);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setHasGenerated(false);
  };

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent);
    setOutput('');
    setHasGenerated(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[#F0F0F0] font-semibold text-[28px]">Agents Vidéo</h1>
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] flex-shrink-0"
              style={{ background: 'rgba(134,239,172,0.12)', color: '#86efac', letterSpacing: '0.04em' }}
            >
              BETA
            </span>
          </div>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Des <strong className="text-[rgba(255,255,255,0.8)] font-semibold">agents IA spécialisés</strong> pour créer du contenu vidéo pour ton SaaS — scripts, voix-off, miniatures et montage.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 mb-7 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#F5F0E8] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[rgba(255,255,255,0.6)] text-[12px] leading-relaxed">
            Les agents vidéo utilisent l'IA pour t'aider à chaque étape de la création de contenu.
            Sélectionne un agent, décris ton besoin, et laisse l'IA générer le résultat.
            Tu peux ensuite ajuster et exporter.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent selector — Left panel */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-[#F5F0E8]" />
            <span className="text-[rgba(255,255,255,0.5)] text-[12px] font-medium tracking-wider">AGENTS DISPONIBLES</span>
          </div>
          <div className="space-y-2">
            {VIDEO_AGENTS.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent.id === agent.id}
                onClick={() => handleAgentChange(agent)}
              />
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-6 bg-[#141414] border border-[#222222] rounded-[10px] p-4">
            <span className="text-[rgba(255,255,255,0.4)] text-[11px] font-medium tracking-wider mb-3 block">STATISTIQUES</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[#F0F0F0] font-semibold text-[18px]">24</div>
                <div className="text-[rgba(255,255,255,0.35)] text-[10px]">Générations ce mois</div>
              </div>
              <div>
                <div className="text-[#22C55E] font-semibold text-[18px]">3h12</div>
                <div className="text-[rgba(255,255,255,0.35)] text-[10px]">Temps économisé</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main workspace — Right panel */}
        <div className="lg:col-span-8">
          {/* Selected agent header */}
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: `${selectedAgent.color}15` }}
              >
                <selectedAgent.icon size={18} style={{ color: selectedAgent.color }} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[#F0F0F0] font-semibold text-[15px]">{selectedAgent.title}</h2>
                <p className="text-[rgba(255,255,255,0.4)] text-[11px]">{selectedAgent.description}</p>
              </div>
            </div>

            {/* Input area */}
            <div className="mb-4">
              <label className="text-[rgba(255,255,255,0.5)] text-[12px] font-medium mb-2 block">
                {selectedAgent.inputLabel}
              </label>
              <textarea
                data-testid="agent-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={selectedAgent.inputPlaceholder}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-[8px] px-4 py-3 text-[13px] text-[rgba(255,255,255,0.7)] placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[#333333] transition-colors resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                data-testid="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                className="flex items-center gap-2 bg-[#F5F0E8] text-[#0A0A0A] text-[12px] font-semibold py-[9px] px-5 rounded-[8px] hover:bg-[#E0DBD3] active:bg-[#D5D0C8] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Génération en cours…
                  </>
                ) : (
                  <>
                    <Wand2 size={14} />
                    Générer
                  </>
                )}
              </button>

              {hasGenerated && (
                <button
                  data-testid="reset-btn"
                  onClick={handleReset}
                  className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-[12px] font-medium py-[9px] px-4 rounded-[8px] hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150"
                >
                  <RefreshCw size={13} />
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Output area */}
          {(isGenerating || hasGenerated) && (
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <Loader2 size={14} className="text-[#F5F0E8] animate-spin" />
                  ) : (
                    <CheckCircle size={14} className="text-[#22C55E]" />
                  )}
                  <span className="text-[rgba(255,255,255,0.5)] text-[12px] font-medium">
                    {isGenerating ? 'Génération en cours…' : selectedAgent.outputLabel}
                  </span>
                </div>

                {hasGenerated && (
                  <button
                    data-testid="download-btn"
                    className="flex items-center gap-1.5 text-[rgba(255,255,255,0.4)] text-[11px] hover:text-[rgba(255,255,255,0.7)] transition-colors"
                  >
                    <Download size={12} />
                    Exporter
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="space-y-3">
                  <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-full" />
                  <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-4/5" />
                  <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-3/5" />
                  <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-full" />
                  <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-2/3" />
                </div>
              ) : (
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[8px] p-4 max-h-[500px] overflow-y-auto">
                  <pre className="text-[rgba(255,255,255,0.65)] text-[12px] leading-relaxed whitespace-pre-wrap font-[Poppins,sans-serif]">
                    {output}
                  </pre>
                </div>
              )}

              {/* Usage info */}
              {hasGenerated && (
                <div className="mt-4 flex items-center gap-4 text-[rgba(255,255,255,0.3)] text-[10px]">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    Généré en 2.2s
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={10} />
                    Crédits utilisés : 1
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isGenerating && !hasGenerated && (
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-[rgba(245,240,232,0.06)] flex items-center justify-center mb-4">
                <Video size={22} className="text-[rgba(255,255,255,0.2)]" />
              </div>
              <h3 className="text-[rgba(255,255,255,0.5)] text-[14px] font-medium mb-1">Résultat</h3>
              <p className="text-[rgba(255,255,255,0.3)] text-[12px] max-w-[280px]">
                Sélectionne un agent, entre ton brief et clique sur "Générer" pour voir le résultat ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
