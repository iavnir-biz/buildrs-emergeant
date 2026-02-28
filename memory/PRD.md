# Buildrs — Le Laboratoire des Builders SaaS IA

## Original Problem Statement
Créer une application web complète appelée "Buildrs — Le Laboratoire des Builders SaaS IA", clone structurel et visuel de 8lab.fr/app avec sidebar fixe gauche, topbar, thème dark (#0A0A0A), accent crème (#F5F0E8), police Poppins uniquement.

## Tech Stack
- **Frontend**: React + Tailwind CSS + shadcn/ui + React Router v6 + Lucide React
- **Backend**: FastAPI + MongoDB (motor) — migration Supabase prévue ultérieurement
- **AI**: Claude Sonnet 4.5 via Emergent LLM Key (emergentintegrations)
- **Auth**: Google OAuth via Emergent Auth (auth.emergentagent.com)
- **State**: React Context + useState (migration TanStack Query prévue)

## Architecture
```
/app
├── backend/
│   ├── .env (MONGO_URL, DB_NAME, CORS_ORIGINS, EMERGENT_LLM_KEY)
│   └── server.py (FastAPI, 40+ routes, Claude AI integration)
└── frontend/
    ├── src/
    │   ├── App.js (routes + Toaster)
    │   ├── index.css (design system: btn-cream, btn-secondary, badges, animate-fade-in)
    │   ├── context/AuthContext.js (Google OAuth + session management)
    │   ├── utils/api.js (axios + auth interceptor)
    │   ├── components/
    │   │   ├── Layout.jsx (280px sidebar + 60px topbar)
    │   │   ├── Sidebar.jsx (navigation groupée, collapsible)
    │   │   └── Topbar.jsx (breadcrumbs + user menu)
    │   └── pages/ (16 pages + 7 outils)
```

## Pages Implemented
1. **Login.jsx** - Google OAuth, design deux colonnes, stats
2. **AuthCallback.jsx** - Exchange session_id → user token
3. **Onboarding.jsx** - 4 étapes: builder_type, tech_level, objectif, confirmation
4. **Dashboard.jsx** - Hero carousel, stats globales, modules récents
5. **Formation.jsx** - Grille de modules avec progression
6. **ModuleDetail.jsx** - Lecteur vidéo + progression + notes
7. **GenerateurIA.jsx** - Génération idées SaaS via Claude Sonnet 4.5
8. **PlanAction.jsx** - 7 phases, checkboxes, gestion projet
9. **Notes.jsx** - CRUD notes avec éditeur
10. **Favorites.jsx** - Liste des favoris
11. **Stats.jsx** - Statistiques avec recharts
12. **CoachingAlfred.jsx** - Chat IA Alfred (Claude 4.5) + système tickets
13. **CoachingAppel.jsx** - Réservation coaching
14. **Forum.jsx** - Posts communauté + likes
15. **CarteBuilders.jsx** - Carte des builders
16. **Parametres.jsx** - Paramètres avec onglets
17. **Ressources.jsx** - Ressources téléchargeables
18. **Outils.jsx** - Hub des 7 outils

## Tools (7)
1. ValidateurIdee.jsx - Score de validation avec IA (mock)
2. CalculateurMRR.jsx - Calculateur MRR interactif
3. StrategieSortie.jsx - Stratégie de sortie
4. ValorisationSaaS.jsx - Valorisation SaaS (ARR multiple)
5. GenerateurNom.jsx - Générateur de noms
6. ChecklistLancement.jsx - Checklist de lancement
7. EstimateurBuild.jsx - Estimateur de temps de build

## Backend API Routes (40+)
- POST /api/auth/session (exchange Emergent session_id)
- GET /api/auth/me
- PUT /api/profile
- GET/POST /api/modules + progress
- GET/POST/PUT/DELETE /api/notes
- GET/POST/DELETE /api/favorites
- GET/POST /api/posts + likes
- GET/POST /api/tickets
- GET/POST/DELETE /api/ideas (Claude AI generation)
- GET/POST /api/projects
- GET/PUT /api/tasks/{project_id}
- GET /api/stats
- GET /api/activity
- GET/POST /api/alfred/sessions (AI chat sessions)
- GET /api/alfred/sessions/{id}/messages
- POST /api/alfred/chat (Claude Sonnet 4.5)

## What's Been Implemented (Feb 2026)
- [2026-02-28] Complete MVP: all 16 pages + 7 tools + AI features
- [2026-02-28] Claude Sonnet 4.5 integration for ideas generation + Alfred AI chat
- [2026-02-28] Backend .env fix (CORS_ORIGINS parsing error)
- [2026-02-28] Animate-fade-in + CSS utilities added
- [2026-02-28] Toaster (sonner) integrated in App.js
- [2026-02-28] Testing: 30/30 backend tests passing, all frontend pages working

## Prioritized Backlog

### P0 (Critical - Immediate)
- None currently

### P1 (High Priority)
- ValidateurIdee: add real Claude AI scoring (currently mock)
- GenerateurNom: add Claude AI for real name suggestions
- Module seeding: add real training content (titles, descriptions, video URLs)
- Onboarding Step 4: améliorer la page de confirmation

### P2 (Medium Priority)
- TanStack Query migration for data fetching
- Supabase migration (user's future request)
- TypeScript migration (.jsx → .tsx)
- CarteBuilders: add real map (Mapbox/Leaflet)
- CoachingAppel: Calendly integration
- Framer Motion animations on page transitions

### P3 (Future/Backlog)
- Gamification: points system, badges, streak
- Notifications system
- Push notifications
- Dark/light theme toggle
- Mobile responsive improvements
- Search functionality
- Progress tracking charts (recharts)

## Known Issues
- PlanAction.jsx: Minor React hydration warning (cosmetic, non-blocking) - likely browser extension
- Module data is seeded randomly at startup, not real curriculum content
