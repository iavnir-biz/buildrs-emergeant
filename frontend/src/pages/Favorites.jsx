import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Heart, ArrowRight, Trash2, BookOpen, Wrench, FileText } from 'lucide-react';

const TYPE_ICONS = { module: BookOpen, tool: Wrench, resource: FileText };
const TYPE_LABELS = { module: 'Module', tool: 'Outil', resource: 'Ressource' };

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/favorites').then(r => { setFavorites(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const removeFavorite = async (id) => {
    await api.delete(`/favorites/${id}`);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Mes favoris</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Les <strong className="text-[rgba(255,255,255,0.8)] font-semibold">contenus et outils</strong> que tu as mis de côté.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 animate-pulse">
              <div className="h-3 bg-[#1A1A1A] rounded mb-3 w-1/3"></div>
              <div className="h-4 bg-[#1A1A1A] rounded mb-2"></div>
              <div className="h-3 bg-[#1A1A1A] rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="text-center py-20">
          <Heart size={40} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
          <p className="text-[rgba(255,255,255,0.4)] text-[14px] mb-2">Aucun favori pour l'instant.</p>
          <p className="text-[rgba(255,255,255,0.25)] text-[12px]">Ajoute des modules, ressources ou outils à tes favoris.</p>
          <button onClick={() => navigate('/formation')} className="btn-cream mt-5">Explorer la formation</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(fav => {
          const Icon = TYPE_ICONS[fav.item_type] || FileText;
          return (
            <div key={fav.id} data-testid={`favorite-${fav.id}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 card-hover group">
              <div className="flex items-start justify-between mb-3">
                <span className="badge-neutral text-[10px] font-medium px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                  <Icon size={10} /> {TYPE_LABELS[fav.item_type] || 'Item'}
                </span>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="opacity-0 group-hover:opacity-100 text-[rgba(255,255,255,0.3)] hover:text-[#EF4444] transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <h3 className="text-[#F0F0F0] font-semibold text-[14px] mb-1">{fav.item_title}</h3>
              {fav.item_description && (
                <p className="text-[rgba(255,255,255,0.45)] text-[12px] mb-4 line-clamp-2">{fav.item_description}</p>
              )}
              <button
                onClick={() => fav.item_url && navigate(fav.item_url)}
                className="flex items-center gap-1 text-[rgba(255,255,255,0.5)] hover:text-[#F5F0E8] text-[12px] transition-colors"
              >
                Accéder <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
