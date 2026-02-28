import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'questions', label: 'Questions' },
  { id: 'victoires', label: 'Victoires' },
  { id: 'ressources', label: 'Ressources' },
  { id: 'projets', label: 'Projets' },
  { id: 'general', label: 'Général' },
];

const PLAN_COLORS = { Starter: '#rgba(255,255,255,0.5)', Pro: '#F5F0E8', Elite: '#22C55E' };

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return `il y a ${Math.floor(hrs / 24)} j`;
}

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get(`/posts?category=${filter}`).then(r => { setPosts(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [filter]);

  const createPost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const res = await api.post('/posts', { content, category });
      setPosts(prev => [res.data, ...prev]);
      setContent('');
      toast.success('Post publié !');
    } catch { toast.error("Erreur"); }
    setPosting(false);
  };

  const likePost = async (postId) => {
    await api.post(`/posts/${postId}/like`);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Forum</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Pose tes questions, partage tes <strong className="text-[rgba(255,255,255,0.8)] font-semibold">victoires</strong>, avance avec les autres.
        </p>
      </div>

      {/* Composer */}
      <div className="bg-[#141414] border border-[#222222] rounded-[10px] p-4 mb-5">
        <textarea
          data-testid="post-composer"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Partage quelque chose avec la communauté..."
          rows={3}
          className="w-full bg-transparent text-[rgba(255,255,255,0.8)] text-[14px] resize-none outline-none placeholder:text-[rgba(255,255,255,0.25)] leading-relaxed"
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#222222]">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-[#1A1A1A] border border-[#222222] text-[rgba(255,255,255,0.6)] text-[12px] rounded-[6px] px-3 py-1.5 outline-none"
          >
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <button
            data-testid="post-submit-btn"
            onClick={createPost}
            disabled={!content.trim() || posting}
            className="btn-cream flex items-center gap-1.5 text-[13px] disabled:opacity-40"
          >
            {posting ? <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div> : <Send size={13} />}
            Publier
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            data-testid={`forum-filter-${c.id}`}
            onClick={() => setFilter(c.id)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap flex-shrink-0 transition-colors ${
              filter === c.id
                ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#F0F0F0]'
                : 'bg-transparent border-[#222222] text-[rgba(255,255,255,0.45)] hover:border-[#2A2A2A]'
            }`}
          >{c.label}</button>
        ))}
      </div>

      {/* Posts feed */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5 animate-pulse h-24"></div>)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle size={36} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
          <p className="text-[rgba(255,255,255,0.35)] text-[14px]">Aucun post dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} data-testid={`post-${post.id}`} className="bg-[#141414] border border-[#222222] rounded-[10px] p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center text-[#F0F0F0] text-[12px] font-bold flex-shrink-0">
                  {post.author_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#F0F0F0] font-medium text-[13px]">{post.author_name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[3px] ${
                      post.author_plan === 'Elite' ? 'badge-green' :
                      post.author_plan === 'Pro' ? 'badge-cream' : 'badge-neutral'
                    }`}>{post.author_plan}</span>
                    <span className="badge-neutral text-[10px] px-1.5 py-0.5 rounded-[3px] capitalize">{post.category}</span>
                  </div>
                  <p className="text-[rgba(255,255,255,0.75)] text-[14px] leading-relaxed">{post.content}</p>
                </div>
                <span className="text-[rgba(255,255,255,0.3)] text-[11px] flex-shrink-0">{timeAgo(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-[#1A1A1A]">
                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-[#EF4444] transition-colors text-[12px]"
                >
                  <Heart size={13} strokeWidth={1.5} /> {post.likes_count}
                </button>
                <button className="flex items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] transition-colors text-[12px]">
                  <MessageCircle size={13} strokeWidth={1.5} /> {post.comments_count} réponses
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
