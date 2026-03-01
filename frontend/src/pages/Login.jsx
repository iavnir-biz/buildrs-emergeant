// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import BuildrsLogo from '../components/Logo';

export default function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#F5F0E8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.onboarding_completed ? '/dashboard' : '/onboarding'} replace />;
  }

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Left column */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] bg-[#111111] p-12 relative overflow-hidden">
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0"></div>
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center mb-16">
            <BuildrsLogo height={36} />
          </div>
          {/* Quote */}
          <div className="max-w-md">
            <blockquote className="text-[rgba(255,255,255,0.65)] text-[18px] font-light italic leading-relaxed mb-4">
              "Je ne t'apprends pas à utiliser l'IA. Je te montre comment <span className="text-white font-medium not-italic">construire avec elle.</span>"
            </blockquote>
            <cite className="text-[#F5F0E8] text-[12px] font-medium not-italic">— Alfred Orsini</cite>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10">
          <div>
            <div className="text-white font-bold text-[24px]">1,200+</div>
            <div className="text-[rgba(255,255,255,0.45)] text-[12px] font-light">Builders actifs</div>
          </div>
          <div>
            <div className="text-white font-bold text-[24px]">180h</div>
            <div className="text-[rgba(255,255,255,0.45)] text-[12px] font-light">De contenu</div>
          </div>
          <div>
            <div className="text-white font-bold text-[24px]">85%</div>
            <div className="text-[rgba(255,255,255,0.45)] text-[12px] font-light">Lancent en &lt; 90 jours</div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0A] p-8">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center mb-10">
          <BuildrsLogo height={26} />
        </div>

        <div className="w-full max-w-[360px]">
          <h1 className="text-[#F0F0F0] font-semibold text-[26px] mb-2">Bienvenue dans le Lab</h1>
          <p className="text-[rgba(255,255,255,0.45)] text-[14px] mb-10">
            Connecte-toi pour accéder à ton espace builder.
          </p>

          <button
            data-testid="google-login-btn"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-[#0A0A0A] font-semibold text-[14px] py-3 px-4 rounded-[6px] hover:bg-[#F0F0F0] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#222222]"></div>
            <span className="text-[rgba(255,255,255,0.25)] text-[12px]">Buildrs Lab</span>
            <div className="flex-1 h-px bg-[#222222]"></div>
          </div>

          <p className="mt-6 text-center text-[rgba(255,255,255,0.35)] text-[12px]">
            En continuant, tu acceptes nos conditions d'utilisation et politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}
