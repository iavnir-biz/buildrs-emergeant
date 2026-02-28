import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ChevronLeft, CheckCircle, FileText, Bookmark, Clock, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api.get(`/modules/${moduleId}`).then(r => { setModule(r.data); setLoading(false); }).catch(() => setLoading(false));
    api.get('/notes').then(r => setNotes(r.data.filter(n => n.module_id === moduleId)));
  }, [moduleId]);

  const markCompleted = async () => {
    setCompleting(true);
    try {
      await api.post(`/modules/${moduleId}/progress`, { status: 'completed', progress_percent: 100 });
      setModule(prev => prev ? { ...prev, user_progress: { status: 'completed', progress_percent: 100 } } : prev);
      toast.success('+100 pts builder !', {
        description: 'Module complété. Continue comme ça !',
        className: 'toast-buildrs',
      });
    } catch {}
    setCompleting(false);
  };

  const saveNote = async () => {
    if (!noteContent.trim()) return;
    const res = await api.post('/notes', { title: `Note - ${module?.title}`, content: noteContent, module_id: moduleId });
    setNotes(prev => [res.data, ...prev]);
    setNoteContent('');
    toast.success('Note sauvegardée');
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] h-[400px] animate-pulse mb-5"></div>
        <div className="h-5 bg-[#141414] rounded mb-3 w-1/3"></div>
        <div className="h-3 bg-[#141414] rounded w-2/3"></div>
      </div>
    );
  }

  if (!module) return <div className="text-[rgba(255,255,255,0.5)]">Module introuvable.</div>;

  const isCompleted = module.user_progress?.status === 'completed';
  const TABS = [
    { id: 'content', label: 'Contenu' },
    { id: 'resources', label: 'Ressources' },
    { id: 'notes', label: 'Mes notes' },
  ];

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate('/formation')}
        className="flex items-center gap-2 text-[rgba(255,255,255,0.45)] hover:text-[#F0F0F0] text-[13px] mb-5 transition-colors"
      >
        <ChevronLeft size={15} /> Retour à la formation
      </button>

      {/* Video player placeholder */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] overflow-hidden mb-6" style={{ aspectRatio: '16/9', maxHeight: '450px' }}>
        <div
          className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
          style={{ backgroundImage: module.thumbnail ? `url(${module.thumbnail})` : 'none', background: module.thumbnail ? undefined : '#141414' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center">
            {module.video_url ? (
              <a href={module.video_url} target="_blank" rel="noreferrer">
                <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto hover:scale-105 transition-transform cursor-pointer">
                  <Play size={24} className="text-[#0A0A0A] ml-1" fill="#0A0A0A" />
                </div>
              </a>
            ) : (
              <div>
                <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center mx-auto mb-3">
                  <Play size={24} className="text-[rgba(255,255,255,0.4)] ml-1" />
                </div>
                <p className="text-[rgba(255,255,255,0.5)] text-[13px]">Vidéo à venir</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module info */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-neutral text-[10px] px-2 py-0.5 rounded-[4px]">{module.zone}</span>
            <span className="text-[rgba(255,255,255,0.3)] text-[11px] flex items-center gap-1"><Clock size={10} /> {module.duration_minutes} min</span>
          </div>
          <h1 className="text-[#F0F0F0] font-semibold text-[22px] mb-1">{module.title}</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[14px]">{module.description}</p>
        </div>
        {!isCompleted ? (
          <button
            data-testid="complete-module-btn"
            onClick={markCompleted}
            disabled={completing}
            className="btn-cream flex items-center gap-2 flex-shrink-0 ml-4"
          >
            {completing ? <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={14} />}
            Marquer comme complété
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[#22C55E] text-[13px] font-medium flex-shrink-0 ml-4">
            <CheckCircle size={15} /> Complété
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#222222] rounded-[8px] p-1 mb-5 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            data-testid={`module-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
              activeTab === tab.id ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0F0F0]' : 'text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'content' && (
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
          <h3 className="text-[#F0F0F0] font-semibold text-[15px] mb-3">À propos de ce module</h3>
          <p className="text-[rgba(255,255,255,0.65)] text-[14px] leading-relaxed">{module.description}</p>
          <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
            <p className="text-[rgba(255,255,255,0.4)] text-[13px]">Ce module fait partie de la zone <strong className="text-[rgba(255,255,255,0.7)]">{module.zone}</strong>. Durée estimée : <strong className="text-[rgba(255,255,255,0.7)]">{module.duration_minutes} minutes</strong>.</p>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
          <div className="text-center py-8">
            <FileText size={28} className="mx-auto mb-3 text-[rgba(255,255,255,0.2)]" />
            <p className="text-[rgba(255,255,255,0.4)] text-[13px]">Les ressources de ce module seront disponibles prochainement.</p>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
            <textarea
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Prends tes notes ici..."
              rows={4}
              className="w-full bg-transparent text-[rgba(255,255,255,0.8)] text-[14px] resize-none outline-none placeholder:text-[rgba(255,255,255,0.2)] leading-relaxed"
            />
            <div className="flex justify-end mt-3">
              <button onClick={saveNote} disabled={!noteContent.trim()} className="btn-cream text-[12px] disabled:opacity-40">
                Sauvegarder la note
              </button>
            </div>
          </div>
          {notes.map(n => (
            <div key={n.id} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4">
              <div className="text-[#F0F0F0] font-medium text-[13px] mb-1">{n.title}</div>
              <p className="text-[rgba(255,255,255,0.6)] text-[13px] leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
