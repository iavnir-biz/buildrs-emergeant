import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Plus, Send, ThumbsUp, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function BuildrsIA() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    api
      .get('/alfred/sessions')
      .then(r => setSessions(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = dateStr => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "À l'instant";
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000)
      return `Aujourd'hui ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const createSession = async () => {
    try {
      const res = await api.post('/alfred/sessions', { title: 'Nouvelle conversation' });
      const s = res.data;
      setSessions(prev => [s, ...prev]);
      setActiveSession(s);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            "Bonjour ! Je suis Buildrs IA, ton assistant pour créer et lancer ton SaaS avec l'IA. Comment puis-je t'aider aujourd'hui ?",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      toast.error('Impossible de créer une nouvelle conversation.');
    }
  };

  const selectSession = async session => {
    setActiveSession(session);
    setLoadingHistory(true);
    try {
      const res = await api.get(`/alfred/sessions/${session.id}/messages`);
      const history = res.data;
      setMessages(
        history.length === 0
          ? [
              {
                id: 'welcome',
                role: 'assistant',
                content: "Bonjour ! Je suis Buildrs IA. Comment puis-je t'aider ?",
                created_at: new Date().toISOString(),
              },
            ]
          : history
      );
    } catch {}
    setLoadingHistory(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession || sending) return;
    const userText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const tempMsg = { id: `tmp_${Date.now()}`, role: 'user', content: userText, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);
    setSending(true);
    try {
      const res = await api.post('/alfred/chat', { session_id: activeSession.id, message: userText });
      setMessages(prev => [...prev, res.data]);
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSession.id
            ? { ...s, title: s.title === 'Nouvelle conversation' ? userText.slice(0, 40) : s.title }
            : s
        )
      );
    } catch {
      toast.error('Buildrs IA ne répond pas. Réessaie dans un instant.');
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
    setSending(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = e => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div className="mb-5 flex-shrink-0">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Buildrs IA</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Ton assistant IA pour créer et lancer ton SaaS
        </p>
      </div>

      {/* 3-column layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: conversations list */}
        <div className="w-[260px] flex-shrink-0 flex flex-col gap-3 bg-[#141414] border border-[#222222] rounded-[12px] p-3">
          <div className="px-1 pt-1">
            <span className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider font-medium">
              Conversations
            </span>
          </div>
          <button
            data-testid="new-chat-btn"
            onClick={createSession}
            className="w-full flex items-center gap-2 text-[13px] px-3 py-2 rounded-[8px] border border-dashed border-[#2A2A2A] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] hover:border-[#333] transition-colors"
          >
            <Plus size={13} /> Nouvelle conversation
          </button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {sessions.length === 0 && (
              <div className="text-center py-8 text-[rgba(255,255,255,0.2)] text-[12px]">
                Démarre une conversation
              </div>
            )}
            {sessions.map(s => (
              <button
                key={s.id}
                onClick={() => selectSession(s)}
                className={`w-full text-left px-3 py-2.5 rounded-[8px] transition-colors ${
                  activeSession?.id === s.id
                    ? 'bg-[#1A1A1A] text-[#F0F0F0]'
                    : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[rgba(255,255,255,0.8)]'
                }`}
              >
                <div className="truncate text-[12px] font-medium">{s.title || 'Conversation'}</div>
                <div className="text-[rgba(255,255,255,0.25)] text-[10px] mt-0.5">
                  {formatDate(s.created_at || new Date().toISOString())}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: chat area */}
        <div className="flex-1 bg-[#141414] border border-[#222222] rounded-[12px] flex flex-col overflow-hidden">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-[18px] shadow-lg">
                IA
              </div>
              <div className="text-center">
                <h3 className="text-[#F0F0F0] font-semibold text-[16px] mb-2">Buildrs IA</h3>
                <p className="text-[rgba(255,255,255,0.45)] text-[13px] max-w-xs leading-relaxed">
                  Ton assistant IA personnel pour créer, lancer et scaler ton SaaS. Pose tes questions, débloques tes
                  obstacles.
                </p>
              </div>
              <button onClick={createSession} className="btn-cream flex items-center gap-2 text-[13px]">
                <Plus size={14} /> Démarrer une conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="border-b border-[#222222] px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                  IA
                </div>
                <div>
                  <div className="text-[#F0F0F0] font-medium text-[13px]">Buildrs IA</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                    <span className="text-[rgba(255,255,255,0.35)] text-[10px]">En ligne · Claude Sonnet 4.5</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {loadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader size={20} className="animate-spin text-[rgba(255,255,255,0.3)]" />
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5">
                          IA
                        </div>
                      )}
                      <div className={`flex flex-col gap-1.5 max-w-[75%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                        <div
                          className={`px-4 py-3 rounded-[10px] text-[13px] leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-white text-[#0A0A0A] rounded-tr-[4px]'
                              : 'bg-[#1A1A1A] border border-[#222222] text-[rgba(255,255,255,0.85)] rounded-tl-[4px]'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.role === 'assistant' && (
                          <button className="flex items-center gap-1 text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.55)] transition-colors text-[11px] w-fit ml-1">
                            <ThumbsUp size={10} /> Utile
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                      IA
                    </div>
                    <div className="bg-[#1A1A1A] border border-[#222222] px-4 py-3 rounded-[10px] flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.4)] animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.4)] animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.4)] animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="border-t border-[#222222] p-3 flex-shrink-0">
                <div className="flex gap-2 items-end bg-[#0A0A0A] border border-[#222222] focus-within:border-[rgba(59,130,246,0.35)] rounded-[10px] px-3 py-2.5 transition-colors duration-200">
                  <textarea
                    ref={textareaRef}
                    data-testid="ia-chat-input"
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Tu connais..."
                    rows={1}
                    className="flex-1 bg-transparent text-[rgba(255,255,255,0.85)] text-[13px] outline-none resize-none placeholder:text-[rgba(255,255,255,0.2)] leading-relaxed"
                    style={{ minHeight: '20px', maxHeight: '120px' }}
                  />
                  <button
                    data-testid="ia-send-btn"
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="text-[rgba(255,255,255,0.4)] hover:text-[#3B82F6] disabled:opacity-30 transition-colors flex-shrink-0 self-end pb-0.5"
                  >
                    {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                <p className="text-[rgba(255,255,255,0.18)] text-[10px] mt-1.5 px-1">
                  Entrée pour envoyer · Shift+Entrée pour saut de ligne
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
