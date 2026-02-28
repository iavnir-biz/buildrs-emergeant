import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ChevronDown, ChevronRight, Plus, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PHASE_ICONS = ['', '1', '2', '3', '4', '5', '6', '7'];

export default function PlanAction() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expandedPhases, setExpandedPhases] = useState({ 1: true });
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects').then(r => {
      setProjects(r.data);
      if (r.data.length > 0) {
        setActiveProject(r.data[0]);
        loadTasks(r.data[0].id);
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

  const loadTasks = async (projectId) => {
    setLoading(true);
    const res = await api.get(`/tasks/${projectId}`);
    setTasks(res.data);
    setLoading(false);
  };

  const toggleTask = async (task) => {
    const updated = { ...task, is_completed: !task.is_completed };
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    await api.put(`/tasks/${task.id}`, { is_completed: updated.is_completed });
    if (updated.is_completed) toast.success('+10 pts builder !', { description: 'Tâche complétée !' });
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    const res = await api.post('/projects', { name: newProjectName });
    setProjects(prev => [res.data, ...prev]);
    setActiveProject(res.data);
    loadTasks(res.data.id);
    setNewProjectName('');
    setCreating(false);
  };

  const phases = [...new Set(tasks.map(t => t.phase))].sort();
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const progress = tasks.length > 0 ? Math.round(completedTasks / tasks.length * 100) : 0;

  const currentPhase = tasks.find(t => !t.is_completed)?.phase || 7;

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Mon plan d'action</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
            <strong className="text-[rgba(255,255,255,0.8)] font-semibold">7 phases</strong> pour aller de l'idée au premier client payant.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {projects.length > 0 && (
            <select
              data-testid="project-select"
              value={activeProject?.id || ''}
              onChange={e => {
                const p = projects.find(x => x.id === e.target.value);
                setActiveProject(p);
                if (p) loadTasks(p.id);
              }}
              className="bg-[#141414] border border-[#222222] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2 outline-none"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          {!creating ? (
            <button
              data-testid="create-project-btn"
              onClick={() => setCreating(true)}
              className="btn-cream flex items-center gap-1.5"
            >
              <Plus size={14} /> Nouveau projet
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createProject()}
                placeholder="Nom du projet..."
                className="bg-[#141414] border border-[#F5F0E8]/30 text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2 outline-none w-48"
              />
              <button onClick={createProject} className="btn-cream text-[12px]">Créer</button>
              <button onClick={() => setCreating(false)} className="btn-secondary text-[12px]">Annuler</button>
            </div>
          )}
        </div>
      </div>

      {activeProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div>
            {/* Progress */}
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-[rgba(255,255,255,0.5)] text-[13px]">Progression globale</span>
                <span className="text-[#F5F0E8] font-semibold text-[13px]">Étape {currentPhase} sur 7</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="mt-2 text-[rgba(255,255,255,0.35)] text-[11px]">{completedTasks}/{tasks.length} tâches complétées</div>
            </div>

            {/* Phases accordion */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 animate-pulse">
                    <div className="h-3 bg-[#1A1A1A] rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {phases.map(phase => {
                  const phaseTasks = tasks.filter(t => t.phase === phase);
                  const phaseCompleted = phaseTasks.filter(t => t.is_completed).length;
                  const phaseName = phaseTasks[0]?.phase_name || `Phase ${phase}`;
                  const isExpanded = expandedPhases[phase];
                  const isActive = phase === currentPhase;

                  return (
                    <div
                      key={phase}
                      className={`bg-[#141414] border rounded-[10px] overflow-hidden ${isActive ? 'border-l-2 border-l-[#F5F0E8] border-t-[#222222] border-r-[#222222] border-b-[#222222]' : 'border-[#222222]'}`}
                    >
                      <button
                        data-testid={`phase-toggle-${phase}`}
                        onClick={() => setExpandedPhases(prev => ({ ...prev, [phase]: !prev[phase] }))}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#222222] text-[rgba(255,255,255,0.5)] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                            {phase}
                          </span>
                          <span className="text-[#F0F0F0] font-medium text-[14px]">{phaseName}</span>
                          <span className="text-[rgba(255,255,255,0.3)] text-[11px]">{phaseCompleted}/{phaseTasks.length}</span>
                        </div>
                        {isExpanded ? <ChevronDown size={15} className="text-[rgba(255,255,255,0.4)]" /> : <ChevronRight size={15} className="text-[rgba(255,255,255,0.4)]" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2">
                          {phaseTasks.map(task => (
                            <button
                              key={task.id}
                              data-testid={`task-${task.id}`}
                              onClick={() => toggleTask(task)}
                              className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-[6px] hover:bg-[#1A1A1A] transition-colors group"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                task.is_completed ? 'bg-[#F5F0E8] border-[#F5F0E8]' : 'border-[#333333] group-hover:border-[#F5F0E8]/50'
                              }`}>
                                {task.is_completed && <Check size={10} className="text-[#0A0A0A]" />}
                              </div>
                              <span className={`text-[13px] ${task.is_completed ? 'line-through text-[rgba(255,255,255,0.3)]' : 'text-[rgba(255,255,255,0.75)]'}`}>
                                {task.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 mb-4">
              <h3 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Projet actif</h3>
              <div className="text-[#F0F0F0] font-semibold text-[15px] mb-1">{activeProject.name}</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[12px]">{activeProject.niche || 'Niche non définie'}</div>
            </div>
            <div className="bg-[#141414] border border-l-2 border-l-[#F5F0E8] border-t-[#222222] border-r-[#222222] border-b-[#222222] rounded-[10px] p-5">
              <h3 className="text-[rgba(255,255,255,0.4)] text-[11px] uppercase tracking-wider mb-3">Prochaine action</h3>
              {tasks.find(t => !t.is_completed) ? (
                <div>
                  <p className="text-[#F0F0F0] text-[13px] font-medium mb-3">
                    {tasks.find(t => !t.is_completed)?.title}
                  </p>
                  <button className="flex items-center gap-1 text-[#F5F0E8] text-[12px] hover:opacity-80 transition-opacity">
                    Voir le module lié <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <p className="text-[#22C55E] text-[13px]">Toutes les tâches sont complétées !</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[rgba(255,255,255,0.4)] text-[14px] mb-5">Crée ton premier projet pour démarrer ton plan d'action.</p>
          <button onClick={() => setCreating(true)} className="btn-cream flex items-center gap-2 mx-auto">
            <Plus size={14} /> Créer mon projet
          </button>
        </div>
      )}
    </div>
  );
}
