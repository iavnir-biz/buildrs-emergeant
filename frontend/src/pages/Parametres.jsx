import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { User, Lock, Bell, CreditCard, Hash, Share2 } from 'lucide-react';

const TABS = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'securite', label: 'Sécurité', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
  { id: 'discord', label: 'Discord', icon: Hash },
  { id: 'affiliation', label: 'Affiliation', icon: Share2 },
];

export default function Parametres() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    builder_type: user?.builder_type || '',
    tech_level: user?.tech_level || '',
  });
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/profile', form);
      await refreshUser();
      toast.success('Profil mis à jour !');
    } catch { toast.error("Erreur lors de la sauvegarde"); }
    setSaving(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Paramètres</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Tous les <strong className="text-[rgba(255,255,255,0.8)] font-semibold">réglages</strong> de ton compte <strong className="text-[rgba(255,255,255,0.8)] font-semibold">centralisés en un seul endroit</strong>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#222222] rounded-[8px] p-1 mb-7 w-fit flex-wrap">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-testid={`settings-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0F0F0]'
                  : 'text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)]'
              }`}
            >
              <Icon size={13} strokeWidth={1.5} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profil */}
      {activeTab === 'profil' && (
        <div className="max-w-[520px] animate-fade-in">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#0A0A0A] text-[20px] font-bold">
                  {(user?.full_name || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-[#F0F0F0] font-medium text-[14px]">{user?.name}</div>
                <div className="text-[rgba(255,255,255,0.4)] text-[12px]">{user?.email}</div>
              </div>
            </div>
            <div className="h-px bg-[#222222]"></div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Nom complet</label>
              <input
                data-testid="settings-name-input"
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Bio</label>
              <textarea
                data-testid="settings-bio-input"
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                placeholder="Décris ton parcours en quelques mots..."
                className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[rgba(245,240,232,0.3)] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none resize-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-wider mb-1.5 block">Type de builder</label>
              <select
                value={form.builder_type || ''}
                onChange={e => setForm(p => ({ ...p, builder_type: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#222222] text-[#F0F0F0] text-[13px] rounded-[6px] px-3 py-2.5 outline-none"
              >
                <option value="">Sélectionner...</option>
                <option value="salarie">Salarié</option>
                <option value="etudiant">Étudiant</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="reconversion">En reconversion</option>
              </select>
            </div>
            <button
              data-testid="save-profile-btn"
              onClick={saveProfile}
              disabled={saving}
              className="btn-cream flex items-center gap-2 text-[13px]"
            >
              {saving ? <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div> : null}
              Sauvegarder les modifications
            </button>
          </div>
        </div>
      )}

      {/* Sécurité */}
      {activeTab === 'securite' && (
        <div className="max-w-[520px] animate-fade-in">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
            <h3 className="text-[#F0F0F0] font-semibold text-[15px] mb-4">Sécurité du compte</h3>
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-[8px] mb-4">
              <div>
                <div className="text-[#F0F0F0] text-[13px] font-medium">Authentification Google</div>
                <div className="text-[rgba(255,255,255,0.4)] text-[12px]">{user?.email}</div>
              </div>
              <span className="badge-green text-[11px] px-2 py-0.5 rounded-[4px]">Connecté</span>
            </div>
            <div>
              <h4 className="text-[rgba(255,255,255,0.5)] text-[12px] uppercase tracking-wider mb-3">Sessions actives</h4>
              <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-[8px]">
                <div>
                  <div className="text-[rgba(255,255,255,0.7)] text-[13px]">Session actuelle</div>
                  <div className="text-[rgba(255,255,255,0.3)] text-[11px]">Expire dans 7 jours</div>
                </div>
                <span className="badge-green text-[10px] px-1.5 py-0.5 rounded-[3px]">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-[520px] animate-fade-in">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
            <h3 className="text-[#F0F0F0] font-semibold text-[15px] mb-5">Préférences de notifications</h3>
            <div className="space-y-4">
              {[
                { label: 'Nouveaux modules publiés', sub: 'Reçois une notification quand un module est disponible', key: 'email_modules' },
                { label: 'Activité communauté', sub: 'Réponses à tes posts et mentions', key: 'email_community' },
                { label: 'Messages coaching', sub: 'Réponses de tes coachs', key: 'email_coaching' },
              ].map(notif => (
                <div key={notif.key} className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0">
                  <div>
                    <div className="text-[#F0F0F0] text-[13px] font-medium">{notif.label}</div>
                    <div className="text-[rgba(255,255,255,0.35)] text-[11px]">{notif.sub}</div>
                  </div>
                  <button
                    data-testid={`notif-toggle-${notif.key}`}
                    className="w-10 h-5 rounded-full bg-[#F5F0E8] relative transition-colors flex-shrink-0"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#0A0A0A] absolute top-0.5 right-0.5 transition-all"></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Abonnement */}
      {activeTab === 'abonnement' && (
        <div className="max-w-[520px] animate-fade-in">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-[#F0F0F0] font-semibold text-[15px] mb-1">Plan actuel</h3>
                <div className="flex items-center gap-2">
                  <span className="badge-cream text-[12px] px-2.5 py-1 rounded-[4px] font-semibold">{user?.plan || 'Starter'}</span>
                </div>
              </div>
              <button className="btn-secondary text-[13px]">Gérer →</button>
            </div>
            <div className="bg-[#1A1A1A] rounded-[8px] p-4">
              <div className="text-[rgba(255,255,255,0.5)] text-[12px] mb-2">Inclus dans ton plan :</div>
              <ul className="space-y-1.5">
                {['Accès à tous les modules', 'Outils & Services', 'Communauté Builders', 'Support par ticket'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[rgba(255,255,255,0.65)] text-[12px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Discord */}
      {activeTab === 'discord' && (
        <div className="max-w-[520px] animate-fade-in">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-4">
              <Hash size={24} className="text-[#5865F2]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[#F0F0F0] font-semibold text-[16px] mb-2">Serveur Discord Buildrs</h3>
            <p className="text-[rgba(255,255,255,0.45)] text-[13px] mb-5">Rejoins 1 200+ builders actifs sur notre serveur Discord. Entraide, partages de victoires, ressources exclusives.</p>
            <button data-testid="join-discord-btn" className="btn-cream w-full flex items-center justify-center gap-2">
              <Hash size={14} /> Rejoindre le Discord
            </button>
          </div>
        </div>
      )}

      {/* Affiliation */}
      {activeTab === 'affiliation' && (
        <div className="max-w-[520px] animate-fade-in">
          <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-6">
            <h3 className="text-[#F0F0F0] font-semibold text-[15px] mb-4">Programme d'affiliation</h3>
            <div className="bg-[#1A1A1A] rounded-[8px] p-4 mb-5">
              <div className="text-[rgba(255,255,255,0.45)] text-[11px] uppercase tracking-wider mb-2">Ton lien de parrainage</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#0A0A0A] border border-[#222222] rounded-[6px] px-3 py-2 text-[rgba(255,255,255,0.5)] text-[12px] truncate">
                  https://buildrs.io/ref/{user?.user_id?.slice(-6) || 'xxxxxx'}
                </div>
                <button className="btn-secondary text-[12px]">Copier</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: 'Filleuls', value: '0' }, { label: 'Conversions', value: '0' }, { label: 'Gains générés', value: '0€' }].map(s => (
                <div key={s.label} className="bg-[#1A1A1A] rounded-[8px] p-3 text-center">
                  <div className="text-[#F0F0F0] font-bold text-[18px]">{s.value}</div>
                  <div className="text-[rgba(255,255,255,0.4)] text-[11px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
