from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, asyncio, requests as req_sync, json
from datetime import datetime, timezone, timedelta
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

# ============ MODELS ============

class AuthSession(BaseModel):
    session_id: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    builder_type: Optional[str] = None
    tech_level: Optional[str] = None
    objective: Optional[str] = None
    onboarding_completed: Optional[bool] = None

class NoteCreate(BaseModel):
    title: str
    content: str
    module_id: Optional[str] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class PostCreate(BaseModel):
    content: str
    category: str = "general"

class TicketCreate(BaseModel):
    title: str
    category: str
    description: str

class IdeaCreate(BaseModel):
    prompt: str
    niche: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    niche: Optional[str] = None

class TaskUpdate(BaseModel):
    is_completed: bool

class FavoriteCreate(BaseModel):
    item_type: str
    item_id: str
    item_title: str
    item_description: Optional[str] = None
    item_url: Optional[str] = None

class ModuleProgressUpdate(BaseModel):
    status: str
    progress_percent: int = 0

class AlfredChatMessage(BaseModel):
    session_id: str
    message: str

class AlfredSessionCreate(BaseModel):
    title: Optional[str] = None

class NotifSettings(BaseModel):
    email_modules: Optional[bool] = None
    email_community: Optional[bool] = None
    email_coaching: Optional[bool] = None
    push_enabled: Optional[bool] = None

# ============ AUTH HELPER ============

async def get_current_user(request: Request) -> dict:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    if not session_token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Session invalide")
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expirée")
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

# ============ AUTH ROUTES ============

@api_router.post("/auth/session")
async def process_session(body: AuthSession, response: Response):
    def _fetch():
        return req_sync.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": body.session_id}
        )
    resp = await asyncio.to_thread(_fetch)
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Session invalide")
    data = resp.json()
    email = data["email"]
    name = data.get("name", email.split("@")[0])
    picture = data.get("picture", "")
    session_token = data["session_token"]

    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    if not existing_user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": name, "full_name": name,
            "picture": picture, "plan": "Starter", "points": 0, "streak": 0,
            "builder_type": None, "tech_level": None, "objective": None, "bio": None,
            "onboarding_completed": False,
            "notif_settings": {"email_modules": True, "email_community": True, "email_coaching": True, "push_enabled": False},
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    else:
        user_id = existing_user["user_id"]
        await db.users.update_one({"email": email}, {"$set": {"picture": picture, "name": name}})

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    response.set_cookie(
        key="session_token", value=session_token,
        httponly=True, secure=True, samesite="none", path="/", max_age=7*24*60*60
    )
    return {"user": user}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    response.delete_cookie(key="session_token", path="/", samesite="none", secure=True)
    return {"message": "Déconnecté"}

# ============ PROFILE ROUTES ============

@api_router.put("/profile")
async def update_profile(data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    update = data.model_dump(exclude_none=True)
    if update:
        await db.users.update_one({"user_id": current_user["user_id"]}, {"$set": update})
    user = await db.users.find_one({"user_id": current_user["user_id"]}, {"_id": 0})
    return user

@api_router.put("/profile/notifications")
async def update_notifications(data: NotifSettings, current_user: dict = Depends(get_current_user)):
    update = {"notif_settings": data.model_dump(exclude_none=True)}
    await db.users.update_one({"user_id": current_user["user_id"]}, {"$set": update})
    return {"message": "Notifications mises à jour"}

# ============ MODULES ROUTES ============

@api_router.get("/modules")
async def get_modules(current_user: dict = Depends(get_current_user)):
    modules = await db.modules.find({}, {"_id": 0}).sort("order_index", 1).to_list(1000)
    progresses = await db.user_module_progress.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).to_list(1000)
    progress_map = {p["module_id"]: p for p in progresses}
    for i, m in enumerate(modules):
        prog = progress_map.get(m["id"])
        if prog:
            m["user_progress"] = prog
        elif i == 0:
            m["user_progress"] = {"status": "available", "progress_percent": 0}
        else:
            prev_done = all(
                progress_map.get(modules[j]["id"], {}).get("status") == "completed"
                for j in range(i)
            )
            m["user_progress"] = {"status": "available" if prev_done else "locked", "progress_percent": 0}
    return modules

@api_router.get("/modules/{module_id}")
async def get_module(module_id: str, current_user: dict = Depends(get_current_user)):
    module = await db.modules.find_one({"id": module_id}, {"_id": 0})
    if not module:
        raise HTTPException(status_code=404, detail="Module non trouvé")
    progress = await db.user_module_progress.find_one(
        {"user_id": current_user["user_id"], "module_id": module_id}, {"_id": 0}
    )
    module["user_progress"] = progress or {"status": "available", "progress_percent": 0}
    return module

@api_router.post("/modules/{module_id}/progress")
async def update_module_progress(
    module_id: str, data: ModuleProgressUpdate,
    current_user: dict = Depends(get_current_user)
):
    existing = await db.user_module_progress.find_one(
        {"user_id": current_user["user_id"], "module_id": module_id}
    )
    now = datetime.now(timezone.utc).isoformat()
    if existing:
        update = {"status": data.status, "progress_percent": data.progress_percent}
        if data.status == "completed" and existing.get("status") != "completed":
            update["completed_at"] = now
            await db.users.update_one(
                {"user_id": current_user["user_id"]}, {"$inc": {"points": 100}}
            )
        await db.user_module_progress.update_one(
            {"user_id": current_user["user_id"], "module_id": module_id}, {"$set": update}
        )
    else:
        progress_doc = {
            "id": f"prog_{uuid.uuid4().hex[:8]}",
            "user_id": current_user["user_id"],
            "module_id": module_id, "status": data.status,
            "progress_percent": data.progress_percent, "created_at": now
        }
        if data.status == "completed":
            progress_doc["completed_at"] = now
            await db.users.update_one(
                {"user_id": current_user["user_id"]}, {"$inc": {"points": 100}}
            )
        await db.user_module_progress.insert_one(progress_doc)
    return {"message": "Progression mise à jour"}

# ============ NOTES ROUTES ============

@api_router.get("/notes")
async def get_notes(current_user: dict = Depends(get_current_user)):
    notes = await db.user_notes.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("updated_at", -1).to_list(1000)
    return notes

@api_router.post("/notes")
async def create_note(data: NoteCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    note = {
        "id": f"note_{uuid.uuid4().hex[:8]}", "user_id": current_user["user_id"],
        "title": data.title, "content": data.content, "module_id": data.module_id,
        "created_at": now, "updated_at": now
    }
    await db.user_notes.insert_one(note)
    return {k: v for k, v in note.items() if k != "_id"}

@api_router.put("/notes/{note_id}")
async def update_note(note_id: str, data: NoteUpdate, current_user: dict = Depends(get_current_user)):
    update = data.model_dump(exclude_none=True)
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.user_notes.update_one(
        {"id": note_id, "user_id": current_user["user_id"]}, {"$set": update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note non trouvée")
    note = await db.user_notes.find_one({"id": note_id}, {"_id": 0})
    return note

@api_router.delete("/notes/{note_id}")
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    await db.user_notes.delete_one({"id": note_id, "user_id": current_user["user_id"]})
    return {"message": "Note supprimée"}

# ============ FAVORITES ROUTES ============

@api_router.get("/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    favs = await db.user_favorites.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return favs

@api_router.post("/favorites")
async def add_favorite(data: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.user_favorites.find_one(
        {"user_id": current_user["user_id"], "item_id": data.item_id}
    )
    if existing:
        return {k: v for k, v in existing.items() if k != "_id"}
    now = datetime.now(timezone.utc).isoformat()
    fav = {
        "id": f"fav_{uuid.uuid4().hex[:8]}", "user_id": current_user["user_id"],
        "item_type": data.item_type, "item_id": data.item_id,
        "item_title": data.item_title, "item_description": data.item_description,
        "item_url": data.item_url, "created_at": now
    }
    await db.user_favorites.insert_one(fav)
    return {k: v for k, v in fav.items() if k != "_id"}

@api_router.delete("/favorites/{fav_id}")
async def remove_favorite(fav_id: str, current_user: dict = Depends(get_current_user)):
    await db.user_favorites.delete_one({"id": fav_id, "user_id": current_user["user_id"]})
    return {"message": "Favori retiré"}

# ============ POSTS (FORUM) ROUTES ============

@api_router.get("/posts")
async def get_posts(category: str = "all"):
    query = {} if category == "all" else {"category": category}
    posts = await db.posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return posts

@api_router.post("/posts")
async def create_post(data: PostCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    post = {
        "id": f"post_{uuid.uuid4().hex[:8]}", "user_id": current_user["user_id"],
        "author_name": current_user.get("full_name") or current_user.get("name", "Anonyme"),
        "author_picture": current_user.get("picture", ""),
        "author_plan": current_user.get("plan", "Starter"),
        "content": data.content, "category": data.category,
        "likes_count": 0, "comments_count": 0, "created_at": now
    }
    await db.posts.insert_one(post)
    return {k: v for k, v in post.items() if k != "_id"}

@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, current_user: dict = Depends(get_current_user)):
    await db.posts.update_one({"id": post_id}, {"$inc": {"likes_count": 1}})
    return {"message": "Post liké"}

# ============ TICKETS (COACHING) ROUTES ============

@api_router.get("/tickets")
async def get_tickets(current_user: dict = Depends(get_current_user)):
    tickets = await db.support_tickets.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return tickets

@api_router.post("/tickets")
async def create_ticket(data: TicketCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    ticket = {
        "id": f"ticket_{uuid.uuid4().hex[:8]}", "user_id": current_user["user_id"],
        "title": data.title, "category": data.category, "description": data.description,
        "status": "open", "messages_count": 0, "assigned_coach": "Alfred Orsini",
        "created_at": now, "updated_at": now
    }
    await db.support_tickets.insert_one(ticket)
    return {k: v for k, v in ticket.items() if k != "_id"}

@api_router.get("/tickets/{ticket_id}")
async def get_ticket(ticket_id: str, current_user: dict = Depends(get_current_user)):
    ticket = await db.support_tickets.find_one(
        {"id": ticket_id, "user_id": current_user["user_id"]}, {"_id": 0}
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")
    return ticket

# ============ SAAS IDEAS ROUTES ============

@api_router.get("/ideas")
async def get_ideas(current_user: dict = Depends(get_current_user)):
    ideas = await db.saas_ideas.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(20)
    return ideas

@api_router.post("/ideas")
async def create_idea(data: IdeaCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    emergent_key = os.environ.get('EMERGENT_LLM_KEY', '')
    idea_data = {}
    if emergent_key:
        try:
            chat = LlmChat(
                api_key=emergent_key,
                session_id=f"idea_{uuid.uuid4().hex[:8]}",
                system_message="""Tu es un expert SaaS B2B IA. Génère des concepts innovants et viables.
Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans code fences) avec exactement ces champs:
{"name": "NomDuSaaS", "problem": "problème en 1-2 phrases", "solution": "solution en 1-2 phrases", "target": "cible principale", "mrr_estimate_low": 1000, "mrr_estimate_high": 8000, "complexity": "Moyen", "opportunity_score": 78, "exit_strategy": "MRR long terme puis revente"}"""
            ).with_model("anthropic", "claude-sonnet-4-5-20250929")
            niche_text = f" dans la niche {data.niche}" if data.niche else ""
            prompt = f"Génère un concept SaaS IA pour ce problème/contexte{niche_text}: {data.prompt}"
            response = await chat.send_message(UserMessage(text=prompt))
            clean = response.strip()
            if clean.startswith('```'):
                clean = clean.split('```')[1].strip()
                if clean.startswith('json'):
                    clean = clean[4:].strip()
            idea_data = json.loads(clean)
        except Exception as e:
            logger.error(f"Claude idea generation error: {e}")
            import random
            idea_data = {
                "name": "IdeaFlow", "problem": f"Problème identifié: {data.prompt[:80]}",
                "solution": "Solution IA automatisée", "target": "PME B2B",
                "mrr_estimate_low": random.randint(500, 2000),
                "mrr_estimate_high": random.randint(3000, 10000),
                "complexity": "Moyen", "opportunity_score": random.randint(60, 90),
                "exit_strategy": "MRR long terme"
            }
    else:
        import random
        idea_data = {
            "name": "SaaSFlow", "problem": f"Problème: {data.prompt[:80]}",
            "solution": "Automatisation IA", "target": "B2B PME",
            "mrr_estimate_low": random.randint(500, 2000), "mrr_estimate_high": random.randint(3000, 10000),
            "complexity": "Moyen", "opportunity_score": random.randint(60, 90),
            "exit_strategy": "MRR long terme"
        }
    idea = {
        "id": f"idea_{uuid.uuid4().hex[:8]}", "user_id": current_user["user_id"],
        "prompt": data.prompt, "niche": data.niche or idea_data.get("target", "Tech"),
        **idea_data, "created_at": now
    }
    await db.saas_ideas.insert_one(idea)
    return {k: v for k, v in idea.items() if k != "_id"}

@api_router.delete("/ideas/{idea_id}")
async def delete_idea(idea_id: str, current_user: dict = Depends(get_current_user)):
    await db.saas_ideas.delete_one({"id": idea_id, "user_id": current_user["user_id"]})
    return {"message": "Idée supprimée"}

# ============ PROJECTS ROUTES ============

@api_router.get("/projects")
async def get_projects(current_user: dict = Depends(get_current_user)):
    projects = await db.projects.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    return projects

@api_router.post("/projects")
async def create_project(data: ProjectCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    project = {
        "id": project_id, "user_id": current_user["user_id"],
        "name": data.name, "description": data.description,
        "niche": data.niche, "status": "active", "mrr": 0, "created_at": now
    }
    await db.projects.insert_one(project)
    phases_tasks = [
        (1, "Validation de l'idée", ["Définir le problème cible", "Interviewer 10 prospects", "Analyser la concurrence", "Valider la niche"]),
        (2, "Design & Maquette", ["Créer les wireframes", "Définir l'UX flow", "Choisir le stack technique", "Maquetter l'interface"]),
        (3, "Construction MVP", ["Setup environnement de dev", "Développer les fonctionnalités core", "Intégrer l'authentification", "Tester le MVP"]),
        (4, "Paiement Stripe", ["Créer compte Stripe", "Intégrer les paiements", "Tester les webhooks", "Configurer les abonnements"]),
        (5, "Lancement & premiers clients", ["Préparer la landing page", "Lancer sur ProductHunt", "Contacter les prospects", "Onboarder les premiers clients"]),
        (6, "Croissance & MRR", ["Analyser les métriques", "Optimiser le funnel", "Lancer des campagnes", "Améliorer la rétention"]),
        (7, "Stratégie de sortie", ["Évaluer les options de sortie", "Maximiser la valorisation", "Préparer la documentation", "Planifier la cession"]),
    ]
    tasks_to_insert = []
    idx = 0
    for phase, phase_name, tasks in phases_tasks:
        for task in tasks:
            tasks_to_insert.append({
                "id": f"task_{uuid.uuid4().hex[:8]}", "project_id": project_id,
                "phase": phase, "phase_name": phase_name, "title": task,
                "is_completed": False, "order_index": idx, "created_at": now
            })
            idx += 1
    await db.action_tasks.insert_many(tasks_to_insert)
    return {k: v for k, v in project.items() if k != "_id"}

# ============ TASKS ROUTES ============

@api_router.get("/tasks/{project_id}")
async def get_tasks(project_id: str, current_user: dict = Depends(get_current_user)):
    tasks = await db.action_tasks.find(
        {"project_id": project_id}, {"_id": 0}
    ).sort("order_index", 1).to_list(1000)
    return tasks

@api_router.put("/tasks/{task_id}")
async def update_task(task_id: str, data: TaskUpdate, current_user: dict = Depends(get_current_user)):
    update = {"is_completed": data.is_completed}
    if data.is_completed:
        update["completed_at"] = datetime.now(timezone.utc).isoformat()
        await db.users.update_one({"user_id": current_user["user_id"]}, {"$inc": {"points": 10}})
    else:
        update["completed_at"] = None
    await db.action_tasks.update_one({"id": task_id}, {"$set": update})
    return {"message": "Tâche mise à jour"}

# ============ STATS ROUTES ============

@api_router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    modules_count = await db.modules.count_documents({})
    completed = await db.user_module_progress.count_documents({"user_id": user_id, "status": "completed"})
    in_progress = await db.user_module_progress.count_documents({"user_id": user_id, "status": "in_progress"})
    notes_count = await db.user_notes.count_documents({"user_id": user_id})
    ideas_count = await db.saas_ideas.count_documents({"user_id": user_id})

    from datetime import date, timedelta as td
    weekly = []
    for i in range(7):
        d = date.today() - td(days=6 - i)
        weekly.append({"day": d.strftime("%a"), "modules": min(i % 3, 2), "minutes": (i + 1) * 12})

    return {
        "points": current_user.get("points", 0),
        "streak": current_user.get("streak", 0),
        "modules_completed": completed,
        "modules_total": modules_count,
        "modules_in_progress": in_progress,
        "notes_count": notes_count,
        "ideas_count": ideas_count,
        "progress_percent": round(completed / max(modules_count, 1) * 100),
        "weekly_activity": weekly
    }

# ============ RECENT ACTIVITY ============

@api_router.get("/activity")
async def get_activity(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    activities = []
    progs = await db.user_module_progress.find(
        {"user_id": user_id, "status": "completed"}, {"_id": 0}
    ).sort("completed_at", -1).limit(5).to_list(5)
    for p in progs:
        mod = await db.modules.find_one({"id": p["module_id"]}, {"_id": 0})
        if mod:
            activities.append({
                "type": "module_completed",
                "title": f"Module complété : {mod['title']}",
                "timestamp": p.get("completed_at", p.get("created_at", ""))
            })
    notes = await db.user_notes.find(
        {"user_id": user_id}, {"_id": 0}
    ).sort("created_at", -1).limit(3).to_list(3)
    for n in notes:
        activities.append({
            "type": "note_created",
            "title": f"Note créée : {n['title']}",
            "timestamp": n.get("created_at", "")
        })
    activities.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return activities[:8]

# ============ ALFRED AI CHAT ROUTES ============

@api_router.get("/alfred/sessions")
async def get_alfred_sessions(current_user: dict = Depends(get_current_user)):
    sessions = await db.alfred_sessions.find(
        {"user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(20)
    return sessions

@api_router.post("/alfred/sessions")
async def create_alfred_session(data: AlfredSessionCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    session = {
        "id": f"sess_{uuid.uuid4().hex[:10]}",
        "user_id": current_user["user_id"],
        "title": data.title or "Nouvelle conversation",
        "created_at": now, "updated_at": now
    }
    await db.alfred_sessions.insert_one(session)
    return {k: v for k, v in session.items() if k != "_id"}

@api_router.get("/alfred/sessions/{session_id}/messages")
async def get_alfred_messages(session_id: str, current_user: dict = Depends(get_current_user)):
    messages = await db.alfred_chat_messages.find(
        {"session_id": session_id, "user_id": current_user["user_id"]}, {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    return messages

@api_router.post("/alfred/chat")
async def alfred_chat(data: AlfredChatMessage, current_user: dict = Depends(get_current_user)):
    emergent_key = os.environ.get('EMERGENT_LLM_KEY', '')
    if not emergent_key:
        raise HTTPException(status_code=500, detail="Clé IA non configurée")
    now = datetime.now(timezone.utc).isoformat()
    user_name = current_user.get("full_name") or current_user.get("name", "builder")
    builder_type = current_user.get("builder_type", "")
    objective = current_user.get("objective", "")
    profile_context = ""
    if builder_type:
        profile_context += f" L'utilisateur est un {builder_type}."
    if objective:
        profile_context += f" Son objectif: {objective}."
    # Save user message
    user_msg_doc = {
        "id": f"msg_{uuid.uuid4().hex[:8]}", "session_id": data.session_id,
        "user_id": current_user["user_id"], "role": "user",
        "content": data.message, "created_at": now
    }
    await db.alfred_chat_messages.insert_one(user_msg_doc)
    # Build conversation history for context
    history = await db.alfred_chat_messages.find(
        {"session_id": data.session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(20)
    history_text = ""
    for h in history[:-1]:  # Exclude the message just added
        role_label = "Builder" if h["role"] == "user" else "Alfred"
        history_text += f"{role_label}: {h['content']}\n"
    system_message = f"""Tu es Alfred Orsini, fondateur de Buildrs Lab — une plateforme qui aide les entrepreneurs à créer, lancer et monétiser des SaaS IA en 30 jours.

Ton style: direct, bienveillant, expert. Tu parles en français, tu tutoies. Tu donnes des conseils actionnables et concrets. Tu es enthousiaste mais pas commercial.
{profile_context}

Contexte Buildrs: méthode en 7 phases (Validation → Design → Build → Paiement → Lancement → Croissance → Sortie), focus SaaS IA B2B, outils IA, MRR.

Réponds de manière concise (max 200 mots). Pose une question de suivi si pertinent."""
    chat = LlmChat(
        api_key=emergent_key,
        session_id=data.session_id,
        system_message=system_message
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")
    # Include history in the prompt for context
    full_prompt = data.message
    if history_text:
        full_prompt = f"[Historique de la conversation]\n{history_text}\n[Message actuel]\n{data.message}"
    try:
        response = await chat.send_message(UserMessage(text=full_prompt))
    except Exception as e:
        logger.error(f"Alfred chat error: {e}")
        raise HTTPException(status_code=500, detail="Erreur IA, réessaie dans un instant")
    # Save assistant response
    ai_msg_doc = {
        "id": f"msg_{uuid.uuid4().hex[:8]}", "session_id": data.session_id,
        "user_id": current_user["user_id"], "role": "assistant",
        "content": response, "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.alfred_chat_messages.insert_one(ai_msg_doc)
    # Update session title if it's the first message
    if len(history) <= 1:
        title = data.message[:50] + ("..." if len(data.message) > 50 else "")
        await db.alfred_sessions.update_one(
            {"id": data.session_id},
            {"$set": {"title": title, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {k: v for k, v in ai_msg_doc.items() if k != "_id"}

# ============ INCLUDE ROUTER ============

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware, allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"], allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# ============ SEED DATA ============

MODULES_DATA = [
    {"id": "mod_001", "title": "Introduction à Buildrs", "description": "Découvre la méthode et le mindset du builder SaaS IA.", "zone": "Fondations", "order_index": 1, "duration_minutes": 25, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_002", "title": "Le mindset du builder", "description": "Développe le bon état d'esprit pour construire rapidement.", "zone": "Fondations", "order_index": 2, "duration_minutes": 30, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_003", "title": "Stack technique IA 2024", "description": "Les outils indispensables pour builder avec l'IA.", "zone": "Fondations", "order_index": 3, "duration_minutes": 45, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_004", "title": "Trouver ton idée de SaaS", "description": "La méthode pour identifier des opportunités de marché réelles.", "zone": "Validation", "order_index": 4, "duration_minutes": 40, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_005", "title": "Valider sans coder", "description": "Comment valider ton idée avant d'écrire une ligne de code.", "zone": "Validation", "order_index": 5, "duration_minutes": 35, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_006", "title": "Analyser la concurrence", "description": "Comprendre le marché et trouver ton angle différenciateur.", "zone": "Validation", "order_index": 6, "duration_minutes": 30, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_007", "title": "Design avec l'IA", "description": "Créer des maquettes et interfaces avec les outils IA.", "zone": "Construction", "order_index": 7, "duration_minutes": 50, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_008", "title": "Backend en 48h", "description": "Construire ton backend rapidement avec les outils no-code et IA.", "zone": "Construction", "order_index": 8, "duration_minutes": 60, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_009", "title": "Authentification et paiements", "description": "Intégrer Stripe et l'auth en quelques heures seulement.", "zone": "Construction", "order_index": 9, "duration_minutes": 45, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_010", "title": "Landing page qui convertit", "description": "Créer une page de vente efficace avec l'IA.", "zone": "Lancement", "order_index": 10, "duration_minutes": 40, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_011", "title": "Stratégie de lancement", "description": "Comment obtenir tes 10 premiers clients payants.", "zone": "Lancement", "order_index": 11, "duration_minutes": 35, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_012", "title": "ProductHunt et communautés", "description": "Lancer sur ProductHunt et les bonnes communautés.", "zone": "Lancement", "order_index": 12, "duration_minutes": 30, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_013", "title": "Acquisition client B2B", "description": "Les stratégies pour trouver des clients B2B rapidement.", "zone": "Croissance", "order_index": 13, "duration_minutes": 45, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
    {"id": "mod_014", "title": "Réduire le churn", "description": "Garder tes clients et améliorer la rétention.", "zone": "Croissance", "order_index": 14, "duration_minutes": 40, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1694654834978-3f5011c590ec?w=400&q=60"},
    {"id": "mod_015", "title": "Revendre ton SaaS", "description": "Préparer et maximiser la revente de ton SaaS.", "zone": "Croissance", "order_index": 15, "duration_minutes": 50, "video_url": "", "is_published": True, "thumbnail": "https://images.unsplash.com/photo-1767642833959-0cac90824996?w=400&q=60"},
]

@app.on_event("startup")
async def seed_data():
    count = await db.modules.count_documents({})
    if count == 0:
        await db.modules.insert_many(MODULES_DATA)
        logger.info("Modules seedés")
    posts_count = await db.posts.count_documents({})
    if posts_count == 0:
        now = datetime.now(timezone.utc).isoformat()
        sample_posts = [
            {"id": "post_001", "user_id": "system", "author_name": "Alfred Orsini", "author_picture": "", "author_plan": "Elite", "content": "Bienvenue dans le forum Buildrs ! Partagez vos victoires, posez vos questions et avancez ensemble. C'est ici que naissent les meilleurs SaaS.", "category": "general", "likes_count": 18, "comments_count": 5, "created_at": now},
            {"id": "post_002", "user_id": "system", "author_name": "Sarah M.", "author_picture": "", "author_plan": "Pro", "content": "Je viens de valider mon idée SaaS auprès de 20 prospects. 15 ont dit qu'ils paieraient pour ce produit. La validation c'est tout — ne skipez pas cette étape !", "category": "victoires", "likes_count": 31, "comments_count": 12, "created_at": now},
            {"id": "post_003", "user_id": "system", "author_name": "Marc D.", "author_picture": "", "author_plan": "Starter", "content": "Question : comment vous choisissez votre niche ? Je suis entre B2B RH et B2C finance personnelle. Des avis ?", "category": "questions", "likes_count": 9, "comments_count": 14, "created_at": now},
            {"id": "post_004", "user_id": "system", "author_name": "Julie T.", "author_picture": "", "author_plan": "Pro", "content": "J'ai partagé mon template de validation en ressources ! 3h de travail condensées en 1 feuille. Profitez-en.", "category": "ressources", "likes_count": 45, "comments_count": 8, "created_at": now},
        ]
        await db.posts.insert_many(sample_posts)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
