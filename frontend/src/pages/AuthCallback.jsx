import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use useRef to prevent double-processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash;
    const sessionIdMatch = hash.match(/session_id=([^&]+)/);
    if (!sessionIdMatch) {
      navigate('/login', { replace: true });
      return;
    }

    const sessionId = sessionIdMatch[1];

    const exchange = async () => {
      try {
        const res = await api.post('/auth/session', { session_id: sessionId });
        const user = res.data.user;
        setUser(user);
        if (!user.onboarding_completed) {
          navigate('/onboarding', { replace: true, state: { user } });
        } else {
          navigate('/dashboard', { replace: true, state: { user } });
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login', { replace: true });
      }
    };

    exchange();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-8 h-8 border-2 border-[#F5F0E8] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-[#F0F0F0] text-[14px] font-medium">Connexion en cours...</p>
          <p className="text-[rgba(255,255,255,0.4)] text-[12px] mt-1">Préparation de ton labo</p>
        </div>
      </div>
    </div>
  );
}
