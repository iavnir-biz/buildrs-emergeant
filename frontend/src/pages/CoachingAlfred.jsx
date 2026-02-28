import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, MessageCircle, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Stratégie', 'Technique', 'Marketing', 'Financement', 'Juridique', 'Autre'];

const StatusBadge = ({ status }) => (
  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-[4px] flex items-center gap-1 ${
    status === 'open' ? 'badge-green' : 'badge-neutral'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'open' ? 'bg-[#22C55E]' : 'bg-[rgba(255,255,255,0.4)]'}`}></span>
    {status === 'open' ? 'Ouvert' : 'Fermé'}
  </span>
);

export default function CoachingAlfred() {
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
    } catch {
      toast.error("Erreur lors de la création du ticket");
    }
    setSubmitting(false);
  };

  const activeTickets = tickets.filter(t => t.status === 'open');
  const closedTickets = tickets.filter(t => t.status !== 'open');

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Parler à Alfred</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Échange en direct pour <strong className="text-[rgba(255,255,255,0.8)] font-semibold">obtenir une aide personnalisée</strong>.
          </p>
        </div>
        <button
          data-testid="new-ticket-btn"
          onClick={() => setShowForm(true)}
          className="btn-cream flex items-center gap-2"
        >
          <Plus size={14} /> Nouveau ticket
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <div className="bg-[#141414] border border-[rgba(245,240,232,0.2)] rounded-[10px] p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#F0F0F0] font-semibold text-[15px]">Nouveau ticket</h3>
            <button onClick={() => setShowForm(false)} className="text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Titre</label>
              <input
                data-testid="ticket-title-input"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Résume ta question en une phrase..."
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Catégorie</label>
              <select
                data-testid="ticket-category-select"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#222222] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none"
              >
                <option value="">Sélectionner une catégorie...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea
                data-testid="ticket-description-input"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Décris ton problème ou ta question en détail..."
                rows={4}
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none resize-none transition-colors"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-[13px]">Annuler</button>
              <button
                data-testid="submit-ticket-btn"
                onClick={createTicket}
                disabled={submitting || !form.title || !form.category || !form.description}
                className="btn-cream disabled:opacity-40 flex items-center gap-2"
              >
                {submitting ? <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div> : null}
                Envoyer le ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active tickets */}
      {activeTickets.length > 0 && (
        <div className="mb-7">
          {activeTickets.map(ticket => (
            <div key={ticket.id} data-testid={`ticket-${ticket.id}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-4">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[#F0F0F0] font-semibold text-[16px]">{ticket.title}</h3>
                <button className="btn-secondary text-[12px] flex items-center gap-1 flex-shrink-0 ml-4">
                  Voir la conversation &gt;
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-neutral text-[11px] px-2 py-0.5 rounded-[4px]">{ticket.category}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h4 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Informations</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[13px]">
                      <div className="w-7 h-7 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[10px] font-bold flex-shrink-0">
                        AO
                      </div>
                      <div>
                        <div className="text-[rgba(255,255,255,0.7)]">{ticket.assigned_coach}</div>
                        <div className="text-[rgba(255,255,255,0.35)] text-[11px]">Coach assigné</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-[12px]">
                      <Clock size={12} strokeWidth={1.5} />
                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-[12px]">
                      <MessageCircle size={12} strokeWidth={1.5} />
                      {ticket.messages_count} message{ticket.messages_count !== 1 ? 's' : ''} échangé{ticket.messages_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Résumé</h4>
                  <div className="bg-[#1A1A1A] rounded-[8px] p-3 space-y-2">
                    <div className="flex items-start gap-2 text-[12px] text-[rgba(255,255,255,0.5)]">
                      <MessageCircle size={12} strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                      <span>Sujet: {ticket.title}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[12px] text-[rgba(255,255,255,0.5)]">
                      <Clock size={12} strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                      <span>Catégorie: {ticket.category}</span>
                    </div>
                    <button className="w-full text-center text-[12px] text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.8)] transition-colors mt-2 pt-2 border-t border-[#222222]">
                      Voir la conversation complète &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket history */}
      <div>
        <h2 className="text-[#F0F0F0] font-semibold text-[16px] mb-4">Historique des tickets</h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 animate-pulse h-16"></div>)}
          </div>
        ) : closedTickets.length === 0 && activeTickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={32} className="mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
            <p className="text-[rgba(255,255,255,0.35)] text-[13px]">Aucun ticket pour l'instant. Crée ton premier ticket pour obtenir de l'aide.</p>
          </div>
        ) : closedTickets.length === 0 ? (
          <p className="text-[rgba(255,255,255,0.3)] text-[13px]">Aucun ticket fermé.</p>
        ) : (
          <div className="space-y-3">
            {closedTickets.map(ticket => (
              <div key={ticket.id} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[#F0F0F0] text-[13px] font-medium mb-1">{ticket.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-[rgba(255,255,255,0.35)]">
                    <span className="badge-neutral px-1.5 py-0.5 rounded-[3px]">{ticket.category}</span>
                    <StatusBadge status={ticket.status} />
                    <span>{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>· {ticket.messages_count} messages</span>
                  </div>
                </div>
                <button className="text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.7)] text-[12px] transition-colors">
                  Voir &gt;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
