import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Plus, Send, ThumbsUp, Loader, Clock, X, User } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "À l'instant";
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-60"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]"></span>
    </span>
  );
}

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
    api.get('/alfred/sessions').then(r => setSessions(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            "Bonjour ! Je suis Assistant Buildrs AI, ton assistant pour créer et lancer ton SaaS avec l'IA.\n\nComment puis-je t'aider aujourd'hui ?",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      toast.error('Impossible de créer une nouvelle conversation.');
    }
  };

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
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
                content: "Bonjour ! Je suis Assistant Buildrs AI. Comment puis-je t'aider ?",
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    const tempMsg = {
      id: `tmp_${Date.now()}`,
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);
    setSending(true);
    try {
      const res = await api.post('/alfred/chat', {
        session_id: activeSession.id,
        message: userText,
      });
      setMessages(prev => [...prev, res.data]);
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSession.id
            ? {
                ...s,
                title:
                  s.title === 'Nouvelle conversation'
                    ? userText.slice(0, 45)
                    : s.title,
              }
            : s
        )
      );
    } catch {
      toast.error('Assistant Buildrs AI ne répond pas. Réessaie dans un instant.');
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

  // Format message content (convert \n to line breaks)
  const renderContent = content =>
    content.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div className="mb-5 flex-shrink-0">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Discuter avec Buildrs AI</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Ton assistant IA pour créer et lancer ton SaaS
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* ── Left sidebar ── */}
        <div className="w-[260px] flex-shrink-0 flex flex-col bg-[#141414] border border-[#222222] rounded-[12px] overflow-hidden">
          {/* Sidebar header */}
          <div className="px-4 py-3 border-b border-[#222222] flex items-center justify-between flex-shrink-0">
            <span className="text-[#F0F0F0] font-semibold text-[13px]">Conversations</span>
            <button
              data-testid="new-chat-btn"
              onClick={createSession}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-[6px] bg-[rgba(255,255,255,0.06)] border border-[#2A2A2A] text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.09)] transition-colors"
            >
              <Plus size={11} /> Nouveau
            </button>
          </div>

          {/* Sessions list */}
          <div className="flex-1 overflow-y-auto py-2">
            {sessions.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-[rgba(255,255,255,0.2)] text-[12px]">Aucune conversation</p>
                <button
                  onClick={createSession}
                  className="mt-3 text-[11px] text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.7)] transition-colors"
                >
                  Démarrer →
                </button>
              </div>
            ) : (
              sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => selectSession(s)}
                  className={`w-full text-left px-3 py-2.5 group flex items-start gap-2 transition-colors ${
                    activeSession?.id === s.id
                      ? 'bg-[#1A1A1A]'
                      : 'hover:bg-[rgba(255,255,255,0.03)]'
                  }`}
                >
                  <Clock
                    size={11}
                    className="text-[rgba(255,255,255,0.2)] flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`truncate text-[12px] font-medium ${
                        activeSession?.id === s.id
                          ? 'text-[#F0F0F0]'
                          : 'text-[rgba(255,255,255,0.55)]'
                      }`}
                    >
                      {s.title || 'Conversation'}
                    </div>
                    <div className="text-[rgba(255,255,255,0.22)] text-[10px] mt-0.5">
                      {formatDate(s.created_at || new Date().toISOString())}
                    </div>
                  </div>
                  <button
                    onClick={e => deleteSession(e, s.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] transition-all p-0.5 rounded"
                  >
                    <X size={11} />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 bg-[#141414] border border-[#222222] rounded-[12px] flex flex-col overflow-hidden">
          {!activeSession ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-[18px] shadow-lg">
                IA
              </div>
              <div className="text-center">
                <h3 className="text-[#F0F0F0] font-semibold text-[16px] mb-2">Assistant Buildrs AI</h3>
                <p className="text-[rgba(255,255,255,0.4)] text-[13px] max-w-xs leading-relaxed">
                  Pose tes questions sur ton SaaS, débloques tes obstacles, avance plus vite.
                </p>
              </div>
              <button
                onClick={createSession}
                className="btn-cream flex items-center gap-2 text-[13px]"
              >
                <Plus size={14} /> Démarrer une conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat header — current session title */}
              <div className="border-b border-[#222222] px-4 py-3 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                    IA
                  </div>
                  <span className="text-[#F0F0F0] text-[13px] font-medium truncate max-w-[280px]">
                    {activeSession.title || 'Nouvelle conversation'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                  <span className="text-[rgba(255,255,255,0.3)] text-[10px]">En ligne</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                {loadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader size={18} className="animate-spin text-[rgba(255,255,255,0.25)]" />
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id}>
                      {msg.role === 'user' ? (
                        /* User message — right aligned */
                        <div className="flex items-start justify-end gap-2.5">
                          <div className="flex flex-col items-end gap-1 max-w-[72%]">
                            <span className="text-[11px] text-[rgba(255,255,255,0.35)] pr-1">
                              Vous
                            </span>
                            <div className="bg-white text-[#0A0A0A] px-4 py-3 rounded-[10px] rounded-tr-[4px] text-[13px] leading-relaxed">
                              {renderContent(msg.content)}
                            </div>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-[#2A2A2A] border border-[#333] flex items-center justify-center flex-shrink-0 mt-5">
                            <User size={13} className="text-[rgba(255,255,255,0.5)]" />
                          </div>
                        </div>
                      ) : (
                        /* AI message — left aligned */
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 mt-5">
                            IA
                          </div>
                          <div className="flex flex-col gap-1 max-w-[76%]">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.6)] pl-1">
                                Assistant Buildrs AI
                              </span>
                              <button className="flex items-center gap-1 text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.6)] transition-colors text-[10px]">
                                <ThumbsUp size={10} /> Évaluer
                              </button>
                            </div>
                            <div className="bg-[#1A1A1A] border border-[#252525] text-[rgba(255,255,255,0.82)] px-4 py-3 rounded-[10px] rounded-tl-[4px] text-[13px] leading-relaxed">
                              {renderContent(msg.content)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Typing indicator */}
                {sending && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 mt-5">
                      IA
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.6)] pl-1">
                        Assistant Buildrs AI
                      </span>
                      <div className="bg-[#1A1A1A] border border-[#252525] px-4 py-3.5 rounded-[10px] rounded-tl-[4px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.35)] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.35)] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.35)] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="border-t border-[#222222] p-3 flex-shrink-0">
                <div className="flex items-center gap-3 bg-[#0D0D0D] border border-[#252525] focus-within:border-[rgba(59,130,246,0.3)] rounded-[10px] px-3 py-2.5 transition-colors duration-200">
                  <PulsingDot />
                  <textarea
                    ref={textareaRef}
                    data-testid="ia-chat-input"
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Tapez votre message..."
                    rows={1}
                    className="flex-1 bg-transparent text-[rgba(255,255,255,0.82)] text-[13px] outline-none resize-none placeholder:text-[rgba(255,255,255,0.22)] leading-relaxed"
                    style={{ minHeight: '20px', maxHeight: '120px' }}
                  />
                  <button
                    data-testid="ia-send-btn"
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="text-[rgba(255,255,255,0.35)] hover:text-[#3B82F6] disabled:opacity-25 transition-colors flex-shrink-0"
                  >
                    {sending ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
