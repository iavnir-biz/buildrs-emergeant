import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Plus, X, Lock, Send, ChevronRight, Bold, Italic, Underline, List, Smile, Paperclip, Image, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  "Validation d'idée SaaS",
  'Choix des outils',
  'Blocage technique',
  'Review de projet',
  'Stratégie de sortie',
  'Autre',
];

const MOCK_COACH = { name: 'Alfred Orsini', role: 'Fondateur Buildrs', avatar: 'AO' };

const MOCK_TICKETS = [
  {
    id: 'TK-001',
    title: 'Comment valider mon idée SaaS rapidement ?',
    category: "Validation d'idée SaaS",
    status: 'open',
    coach: MOCK_COACH,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    messages_count: 4,
    last_message: 'Commence par interviewer 10 prospects dans ta niche...',
  },
  {
    id: 'TK-002',
    title: 'Choix entre Supabase et Firebase pour mon projet',
    category: 'Choix des outils',
    status: 'closed',
    coach: MOCK_COACH,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    messages_count: 6,
    last_message: 'Pour ton cas, Supabase est clairement le meilleur choix...',
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    role: 'coach',
    author: 'Alfred Orsini',
    content:
      "Bonjour ! J'ai bien reçu ton ticket. Pour valider ton idée SaaS rapidement, commençons par identifier ta niche cible. Qui est ton client idéal ?",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    role: 'user',
    content:
      'Je cible les agences marketing de 5 à 20 personnes qui gèrent plusieurs clients. Elles perdent beaucoup de temps sur les rapports.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
  },
  {
    id: 3,
    role: 'coach',
    author: 'Alfred Orsini',
    content:
      "Excellent angle ! Les agences marketing sont une cible solide avec un vrai pain point sur les reportings. Commence par interviewer 10 prospects dans ta niche. Pose leur ces questions : Comment génèrent-ils leurs rapports actuellement ? Combien de temps ça prend ? Combien seraient-ils prêts à payer pour automatiser ça ?",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const StatusBadge = ({ status }) => (
  <span
    className={`text-[11px] font-medium px-2 py-0.5 rounded-[4px] flex items-center gap-1.5 ${
      status === 'open'
        ? 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]'
        : 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.35)] border border-[#222222]'
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${status === 'open' ? 'bg-[#22C55E]' : 'bg-[rgba(255,255,255,0.25)]'}`}
    ></span>
    {status === 'open' ? 'Ouvert' : 'Fermé'}
  </span>
);

const CategoryBadge = ({ category }) => (
  <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-[rgba(59,130,246,0.08)] text-[#3B82F6] border border-[rgba(59,130,246,0.18)]">
    {category}
  </span>
);

function ConversationView({ ticket, onBack }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'user', content: message.trim(), created_at: new Date().toISOString() },
    ]);
    setMessage('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Breadcrumb header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-2 text-[13px]">
          <button
            onClick={onBack}
            className="text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] transition-colors"
          >
            Support
          </button>
          <ChevronRight size={13} className="text-[rgba(255,255,255,0.2)]" />
          <span className="text-[#F0F0F0] font-medium">Ticket #{ticket.id}</span>
          <StatusBadge status={ticket.status} />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[rgba(255,255,255,0.4)]">
          <span>Assigné à</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[8px] font-bold">
              {ticket.coach.avatar}
            </div>
            <span className="text-[rgba(255,255,255,0.7)]">{ticket.coach.name}</span>
          </div>
        </div>
      </div>

      {/* Messages + editor */}
      <div className="flex-1 bg-[#141414] border border-[#222222] rounded-[12px] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-center mb-4">
            <span className="text-[11px] text-[rgba(255,255,255,0.25)] bg-[#1A1A1A] border border-[#222222] px-3 py-1 rounded-full">
              {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'coach' && (
                <div className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {ticket.coach.avatar}
                </div>
              )}
              <div className={`max-w-[72%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                {msg.role === 'coach' && (
                  <span className="text-[11px] text-[rgba(255,255,255,0.4)] px-1">{msg.author}</span>
                )}
                <div
                  className={`px-4 py-3 rounded-[10px] text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white text-[#0A0A0A] rounded-tr-[4px]'
                      : 'bg-[#1A1A1A] border border-[#222222] text-[rgba(255,255,255,0.85)] rounded-tl-[4px]'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-[rgba(255,255,255,0.25)] px-1">
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Rich text editor bar */}
        <div className="border-t border-[#222222] p-3 flex-shrink-0">
          <div className="flex items-center gap-0.5 mb-2 pb-2 border-b border-[#222222]">
            {[
              { Icon: Bold, title: 'Gras' },
              { Icon: Italic, title: 'Italique' },
              { Icon: Underline, title: 'Souligné' },
              { Icon: List, title: 'Liste' },
              null,
              { Icon: Smile, title: 'Emoji' },
              { Icon: Paperclip, title: 'Fichier' },
              { Icon: Image, title: 'Image' },
            ].map((item, i) =>
              item === null ? (
                <div key={i} className="w-px h-4 bg-[#222222] mx-1" />
              ) : (
                <button
                  key={i}
                  title={item.title}
                  className="p-1.5 rounded-[4px] text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <item.Icon size={13} />
                </button>
              )
            )}
          </div>
          <div className="flex gap-2 items-end">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message... (Ctrl+Entrée pour envoyer)"
              rows={3}
              className="flex-1 bg-transparent text-[rgba(255,255,255,0.85)] text-[13px] outline-none resize-none placeholder:text-[rgba(255,255,255,0.2)] leading-relaxed"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="btn-cream px-3 py-2 flex items-center gap-1.5 text-[13px] disabled:opacity-40 flex-shrink-0 self-end"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, onClick }) {
  return (
    <div
      data-testid={`ticket-${ticket.id}`}
      onClick={onClick}
      className="bg-[#141414] border border-[#222222] hover:border-[#2A2A2A] rounded-[12px] p-4 cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[#F0F0F0] font-medium text-[14px] mb-2">{ticket.title}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={ticket.category} />
            <StatusBadge status={ticket.status} />
            <span className="text-[rgba(255,255,255,0.3)] text-[11px]">
              {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[rgba(255,255,255,0.2)] text-[11px]">·</span>
            <span className="text-[rgba(255,255,255,0.3)] text-[11px]">{ticket.messages_count} messages</span>
          </div>
          {ticket.last_message && (
            <p className="text-[rgba(255,255,255,0.3)] text-[12px] mt-2 truncate">{ticket.last_message}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[7px] font-bold">
              {ticket.coach.avatar}
            </div>
            <span className="text-[rgba(255,255,255,0.35)] text-[11px]">{ticket.coach.name}</span>
          </div>
          <span className="text-[rgba(255,255,255,0.3)] text-[11px] group-hover:text-[rgba(255,255,255,0.6)] transition-colors">
            Voir la conversation →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CoachingTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [showModal, setShowModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [form, setForm] = useState({ title: '', category: '' });
  const [submitting, setSubmitting] = useState(false);

  const isLocked = user?.plan === 'Starter';

  const handleCreate = async () => {
    if (!form.title || !form.category) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    const newTicket = {
      id: `TK-00${tickets.length + 1}`,
      title: form.title,
      category: form.category,
      status: 'open',
      coach: MOCK_COACH,
      created_at: new Date().toISOString(),
      messages_count: 0,
      last_message: null,
    };
    setTickets(prev => [newTicket, ...prev]);
    setForm({ title: '', category: '' });
    setShowModal(false);
    setSubmitting(false);
    toast.success('Ticket créé avec succès');
  };

  const openTickets = tickets.filter(t => t.status === 'open');
  const closedTickets = tickets.filter(t => t.status !== 'open');

  if (activeTicket) {
    return <ConversationView ticket={activeTicket} onBack={() => setActiveTicket(null)} />;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Parlez à un coach</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Échangez avec nos coachs pour obtenir une aide personnalisée
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.08)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
          Réponse sous 24h
        </span>
      </div>

      {isLocked ? (
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-[rgba(255,255,255,0.25)]" />
          </div>
          <h3 className="text-[#F0F0F0] font-semibold text-[17px] mb-2">Accès Niveau 3 requis</h3>
          <p className="text-[rgba(255,255,255,0.45)] text-[13px] max-w-sm mx-auto mb-6">
            Cette fonctionnalité est disponible à partir du niveau Pro. Upgradez votre plan pour accéder au coaching
            personnalisé.
          </p>
          <button className="btn-cream flex items-center gap-2 mx-auto">Upgrader mon plan →</button>
        </div>
      ) : (
        <>
          {/* Action bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-[rgba(255,255,255,0.4)] text-[13px]">
              {openTickets.length} ticket{openTickets.length !== 1 ? 's' : ''} ouvert
              {openTickets.length !== 1 ? 's' : ''}
            </p>
            <button
              data-testid="new-ticket-btn"
              onClick={() => setShowModal(true)}
              className="btn-cream flex items-center gap-2 text-[13px]"
            >
              <Plus size={14} /> Ouvrir un ticket
            </button>
          </div>

          {/* Empty state */}
          {tickets.length === 0 && (
            <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={18} className="text-[rgba(255,255,255,0.2)]" />
              </div>
              <p className="text-[rgba(255,255,255,0.35)] text-[14px] mb-1">Aucun ticket ouvert</p>
              <p className="text-[rgba(255,255,255,0.2)] text-[12px] mb-5">
                Crée ton premier ticket pour obtenir une aide personnalisée
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-cream flex items-center gap-2 mx-auto text-[13px]"
              >
                <Plus size={14} /> Ouvrir un ticket
              </button>
            </div>
          )}

          {/* Tickets list */}
          {tickets.length > 0 && (
            <div className="space-y-6">
              {openTickets.length > 0 && (
                <div>
                  <h2 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">
                    Tickets ouverts
                  </h2>
                  <div className="space-y-3">
                    {openTickets.map(ticket => (
                      <TicketCard key={ticket.id} ticket={ticket} onClick={() => setActiveTicket(ticket)} />
                    ))}
                  </div>
                </div>
              )}

              {closedTickets.length > 0 && (
                <div>
                  <h2 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Historique</h2>
                  <div className="space-y-3">
                    {closedTickets.map(ticket => (
                      <TicketCard key={ticket.id} ticket={ticket} onClick={() => setActiveTicket(ticket)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create ticket modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#111111] border border-[#2A2A2A] rounded-[12px] w-full max-w-md p-6 animate-fade-in shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#F0F0F0] font-semibold text-[16px]">Créer un nouveau ticket</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.8)] transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-1.5 block">
                  Sujet
                </label>
                <input
                  data-testid="ticket-title-input"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Résume ta question en une phrase..."
                  className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[8px] px-3 py-2.5 outline-none transition-colors placeholder:text-[rgba(255,255,255,0.18)]"
                />
              </div>
              <div>
                <label className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-1.5 block">
                  Catégorie
                </label>
                <select
                  data-testid="ticket-category-select"
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[8px] px-3 py-2.5 outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Sélectionner une catégorie...</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setShowModal(false)} className="btn-secondary text-[13px]">
                  Annuler
                </button>
                <button
                  data-testid="submit-ticket-btn"
                  onClick={handleCreate}
                  disabled={submitting || !form.title || !form.category}
                  className="btn-cream disabled:opacity-40 flex items-center gap-2 text-[13px]"
                >
                  {submitting && (
                    <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                  )}
                  Créer le ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
