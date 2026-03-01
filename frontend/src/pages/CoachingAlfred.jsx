import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Plus, MessageCircle, X, Clock, Send, Bot, User, Loader } from 'lucide-react';
import { toast } from 'sonner';

// ─── Ticket System ─────────────────────────────────────────
const CATEGORIES = ['Stratégie', 'Technique', 'Marketing', 'Financement', 'Juridique', 'Autre'];

const StatusBadge = ({ status }) => (
  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-[4px] flex items-center gap-1 ${
    status === 'open' ? 'badge-green' : 'badge-neutral'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'open' ? 'bg-[#22C55E]' : 'bg-[rgba(255,255,255,0.4)]'}`}></span>
    {status === 'open' ? 'Ouvert' : 'Fermé'}
  </span>
);

// ─── Alfred AI Chat ─────────────────────────────────────────
function AlfredChat() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get('/alfred/sessions').then(r => setSessions(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createSession = async () => {
    const res = await api.post('/alfred/sessions', { title: 'Nouvelle conversation' });
    const newSession = res.data;
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession);
    setMessages([{
      id: 'welcome', role: 'assistant',
      content: "Salut ! Je suis Alfred. Comment puis-je t'aider aujourd'hui ? Parle-moi de ton projet SaaS, de ton idée ou de l'étape où tu en es.",
      created_at: new Date().toISOString()
    }]);
  };

  const selectSession = async (session) => {
    setActiveSession(session);
    setLoadingHistory(true);
    try {
      const res = await api.get(`/alfred/sessions/${session.id}/messages`);
      const history = res.data;
      if (history.length === 0) {
        setMessages([{
          id: 'welcome', role: 'assistant',
          content: "Salut ! Je suis Alfred. Comment puis-je t'aider aujourd'hui ?",
          created_at: new Date().toISOString()
        }]);
      } else {
        setMessages(history);
      }
    } catch {}
    setLoadingHistory(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession || sending) return;
    const userText = input.trim();
    setInput('');
    const tempMsg = { id: `tmp_${Date.now()}`, role: 'user', content: userText, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);
    setSending(true);
    try {
      const res = await api.post('/alfred/chat', { session_id: activeSession.id, message: userText });
      setMessages(prev => [...prev, res.data]);
      setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, title: s.title === 'Nouvelle conversation' ? userText.slice(0, 40) : s.title } : s));
    } catch {
      toast.error("Alfred ne répond pas. Réessaie dans un instant.");
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-5" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      {/* Sessions sidebar */}
      <div className="w-[220px] flex-shrink-0 flex flex-col gap-2">
        <button
          data-testid="new-chat-btn"
          onClick={createSession}
          className="btn-cream w-full flex items-center justify-center gap-2 text-[13px] py-2.5"
        >
          <Plus size={13} /> Nouvelle conversation
        </button>
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {sessions.length === 0 && (
            <div className="text-center py-8 text-[rgba(255,255,255,0.25)] text-[12px]">
              Démarre une conversation
            </div>
          )}
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => selectSession(s)}
              className={`w-full text-left px-3 py-2.5 rounded-[8px] border transition-colors text-[12px] truncate ${
                activeSession?.id === s.id
                  ? 'border-[rgba(245,240,232,0.25)] bg-[rgba(245,240,232,0.05)] text-[#F0F0F0]'
                  : 'border-[#222222] text-[rgba(255,255,255,0.55)] hover:border-[#2A2A2A] hover:text-[rgba(255,255,255,0.8)]'
              }`}
            >
              {s.title || 'Conversation'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-[#141414] border border-[#222222] rounded-[10px] flex flex-col overflow-hidden">
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
              <img src="https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/b7t3k1fl_2d892957-2668-4eec-a808-f157749f67eb.png" alt="Buildrs AI" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-[#F0F0F0] font-semibold text-[16px] mb-2">Alfred Orsini — Coach IA</h3>
              <p className="text-[rgba(255,255,255,0.45)] text-[13px] max-w-xs">
                Ton coach personnel pour créer et lancer ton SaaS IA. Pose tes questions, débloques tes obstacles.
              </p>
            </div>
            <button onClick={createSession} className="btn-cream flex items-center gap-2">
              <MessageCircle size={14} /> Démarrer une conversation
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-[#222222] px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
                <img src="https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/b7t3k1fl_2d892957-2668-4eec-a808-f157749f67eb.png" alt="Buildrs AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[#F0F0F0] font-medium text-[13px]">Alfred Orsini</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                  <span className="text-[rgba(255,255,255,0.4)] text-[10px]">En ligne · Claude Sonnet 4.5</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader size={20} className="animate-spin text-[rgba(255,255,255,0.3)]" />
                </div>
              ) : messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 overflow-hidden ${
                    msg.role === 'assistant' ? 'border border-[#2A2A2A]' : 'bg-[#222222] flex items-center justify-center'
                  }`}>
                    {msg.role === 'assistant'
                      ? <img src="https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/b7t3k1fl_2d892957-2668-4eec-a808-f157749f67eb.png" alt="AI" className="w-full h-full object-cover" />
                      : <User size={12} className="text-[rgba(255,255,255,0.7)]" />
                    }
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-[10px] text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[rgba(245,240,232,0.08)] border border-[rgba(245,240,232,0.12)] text-[rgba(255,255,255,0.85)]'
                      : 'bg-[#1A1A1A] border border-[#222222] text-[rgba(255,255,255,0.8)]'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
                <img src="https://customer-assets.emergentagent.com/job_buildrs-app/artifacts/b7t3k1fl_2d892957-2668-4eec-a808-f157749f67eb.png" alt="Buildrs AI" className="w-full h-full object-cover" />
              </div>
                  <div className="bg-[#1A1A1A] border border-[#222222] px-4 py-3 rounded-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.4)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.4)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.4)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#222222] p-3 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  data-testid="alfred-chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pose ta question à Alfred... (Entrée pour envoyer)"
                  rows={2}
                  className="flex-1 bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.25)] text-[rgba(255,255,255,0.85)] text-[13px] rounded-[8px] px-3 py-2.5 outline-none resize-none transition-colors placeholder:text-[rgba(255,255,255,0.2)] leading-relaxed"
                />
                <button
                  data-testid="alfred-send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="btn-cream px-3 py-2.5 flex items-center gap-1.5 text-[13px] disabled:opacity-40 flex-shrink-0 self-end"
                >
                  {sending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tickets System ─────────────────────────────────────────
function TicketsSystem() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/tickets').then(r => { setTickets(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const createTicket = async () => {
    if (!form.title || !form.category || !form.description) return;
    setSubmitting(true);
    try {
      const res = await api.post('/tickets', form);
      setTickets(prev => [res.data, ...prev]);
      setForm({ title: '', category: '', description: '' });
      setShowForm(false);
      toast.success('Ticket créé avec succès');
    } catch { toast.error("Erreur lors de la création du ticket"); }
    setSubmitting(false);
  };

  const activeTickets = tickets.filter(t => t.status === 'open');
  const closedTickets = tickets.filter(t => t.status !== 'open');

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[rgba(255,255,255,0.5)] text-[14px]">Tickets d'assistance avec réponse sous 24h.</p>
        <button data-testid="new-ticket-btn" onClick={() => setShowForm(true)} className="btn-cream flex items-center gap-2 text-[13px]">
          <Plus size={14} /> Nouveau ticket
        </button>
      </div>

      {showForm && (
        <div className="bg-[#141414] border border-[rgba(245,240,232,0.2)] rounded-[10px] p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#F0F0F0] font-semibold text-[15px]">Nouveau ticket</h3>
            <button onClick={() => setShowForm(false)} className="text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)]"><X size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Titre</label>
              <input data-testid="ticket-title-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Résume ta question en une phrase..."
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Catégorie</label>
              <select data-testid="ticket-category-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#222222] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none">
                <option value="">Sélectionner...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea data-testid="ticket-description-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={4} placeholder="Décris ton problème en détail..."
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none resize-none transition-colors" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-[13px]">Annuler</button>
              <button data-testid="submit-ticket-btn" onClick={createTicket}
                disabled={submitting || !form.title || !form.category || !form.description}
                className="btn-cream disabled:opacity-40 flex items-center gap-2">
                {submitting && <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div>}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 animate-pulse h-16"></div>)}</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={32} className="mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
          <p className="text-[rgba(255,255,255,0.35)] text-[13px]">Aucun ticket. Crée ton premier ticket pour obtenir de l'aide.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...activeTickets, ...closedTickets].map(ticket => (
            <div key={ticket.id} data-testid={`ticket-${ticket.id}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 flex items-center justify-between">
              <div>
                <div className="text-[#F0F0F0] text-[13px] font-medium mb-1">{ticket.title}</div>
                <div className="flex items-center gap-2">
                  <span className="badge-neutral text-[10px] px-1.5 py-0.5 rounded-[3px]">{ticket.category}</span>
                  <StatusBadge status={ticket.status} />
                  <span className="text-[rgba(255,255,255,0.3)] text-[11px] flex items-center gap-1"><Clock size={9} /> {new Date(ticket.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button className="text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.7)] text-[12px]">Voir &gt;</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
const TABS = [
  { id: 'chat', label: 'Chat IA avec Alfred' },
  { id: 'tickets', label: 'Tickets d\'assistance' },
];

export default function CoachingAlfred() {
  const [tab, setTab] = useState('chat');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Parler à Alfred</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Ton <strong className="text-[rgba(255,255,255,0.8)] font-semibold">coach IA personnel</strong> disponible 24h/24.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#222222] rounded-[8px] p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button key={t.id} data-testid={`alfred-tab-${t.id}`} onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
              tab === t.id ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0F0F0]' : 'text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)]'
            }`}>{t.label}</button>
        ))}
      </div>

      {tab === 'chat' ? <AlfredChat /> : <TicketsSystem />}
    </div>
  );
}
