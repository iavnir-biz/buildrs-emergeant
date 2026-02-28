import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, FileText, Clock } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notes').then(r => { setNotes(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const createNote = async () => {
    const res = await api.post('/notes', { title: 'Nouvelle note', content: '' });
    const newNote = res.data;
    setNotes(prev => [newNote, ...prev]);
    setSelected(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const selectNote = (note) => {
    setSelected(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveNote = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await api.put(`/notes/${selected.id}`, { title: editTitle, content: editContent });
      setNotes(prev => prev.map(n => n.id === selected.id ? res.data : n));
      setSelected(res.data);
    } catch {}
    setSaving(false);
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selected?.id === id) { setSelected(null); setEditTitle(''); setEditContent(''); }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Mes notes</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            Tes <strong className="text-[rgba(255,255,255,0.8)] font-semibold">notes personnelles</strong> prises pendant ta formation.
          </p>
        </div>
        <button data-testid="create-note-btn" onClick={createNote} className="btn-cream flex items-center gap-2">
          <Plus size={14} /> Nouvelle note
        </button>
      </div>

      <div className="flex gap-5" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Notes list */}
        <div className="w-[280px] flex-shrink-0 overflow-y-auto space-y-2">
          {loading && (
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 animate-pulse">
              <div className="h-3 bg-[#1A1A1A] rounded mb-2 w-3/4"></div>
              <div className="h-2 bg-[#1A1A1A] rounded w-1/2"></div>
            </div>
          )}
          {notes.length === 0 && !loading && (
            <div className="text-center py-12 text-[rgba(255,255,255,0.3)] text-[13px]">
              <FileText size={28} className="mx-auto mb-3 opacity-30" />
              Aucune note. Crée ta première note.
            </div>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              data-testid={`note-item-${note.id}`}
              onClick={() => selectNote(note)}
              className={`bg-[#141414] border rounded-[10px] p-4 cursor-pointer transition-colors duration-150 group ${
                selected?.id === note.id ? 'border-[rgba(245,240,232,0.3)]' : 'border-[#222222] hover:border-[#2A2A2A]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[#F0F0F0] font-medium text-[13px] truncate">{note.title || 'Sans titre'}</div>
                  <div className="text-[rgba(255,255,255,0.35)] text-[11px] mt-0.5 truncate">{note.content?.slice(0, 50) || 'Vide...'}</div>
                  <div className="flex items-center gap-1 mt-2 text-[rgba(255,255,255,0.25)] text-[10px]">
                    <Clock size={9} />
                    {formatDate(note.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="opacity-0 group-hover:opacity-100 text-[rgba(255,255,255,0.3)] hover:text-[#EF4444] transition-all flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-[#141414] border border-[#222222] rounded-[10px] flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="border-b border-[#222222] px-5 py-3 flex items-center justify-between">
                <input
                  data-testid="note-title-input"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={saveNote}
                  className="bg-transparent text-[#F0F0F0] font-semibold text-[15px] border-none outline-none flex-1 min-w-0"
                  placeholder="Titre de la note..."
                />
                <button
                  data-testid="save-note-btn"
                  onClick={saveNote}
                  disabled={saving}
                  className="btn-cream text-[12px] ml-3"
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
              <textarea
                data-testid="note-content-input"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                onBlur={saveNote}
                placeholder="Commence à écrire tes notes ici..."
                className="flex-1 bg-transparent text-[rgba(255,255,255,0.8)] text-[14px] leading-relaxed p-5 resize-none outline-none placeholder:text-[rgba(255,255,255,0.2)]"
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <FileText size={36} className="text-[rgba(255,255,255,0.15)] mb-4" />
              <p className="text-[rgba(255,255,255,0.35)] text-[14px]">Sélectionne une note ou crée-en une nouvelle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
