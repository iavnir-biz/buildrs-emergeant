"""
Backend tests for Buildrs app - covering auth, modules, notes, posts, ideas, projects, stats, alfred
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://buildrs-app.preview.emergentagent.com').rstrip('/')
SESSION_TOKEN = "test_session_1772281738231"


@pytest.fixture(scope="module")
def auth_headers():
    return {"Authorization": f"Bearer {SESSION_TOKEN}"}


# ============ AUTH TESTS ============
class TestAuth:
    def test_auth_me_valid_token(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "user_id" in data
        assert "email" in data

    def test_auth_me_invalid_token(self):
        resp = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": "Bearer invalid_token"})
        assert resp.status_code == 401

    def test_auth_session_invalid(self):
        resp = requests.post(f"{BASE_URL}/api/auth/session", json={"session_id": "bad_session_id"})
        assert resp.status_code == 400


# ============ MODULES TESTS ============
class TestModules:
    def test_get_modules(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/modules", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Check structure
        assert "id" in data[0]
        assert "title" in data[0]
        assert "user_progress" in data[0]

    def test_get_module_by_id(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/modules/mod_001", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == "mod_001"

    def test_get_module_not_found(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/modules/nonexistent", headers=auth_headers)
        assert resp.status_code == 404

    def test_update_module_progress(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/modules/mod_001/progress",
            headers=auth_headers,
            json={"status": "in_progress", "progress_percent": 50}
        )
        assert resp.status_code == 200


# ============ NOTES TESTS ============
class TestNotes:
    note_id = None

    def test_create_note(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/notes",
            headers=auth_headers,
            json={"title": "TEST_Note", "content": "Test content for note"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "TEST_Note"
        assert "id" in data
        TestNotes.note_id = data["id"]

    def test_get_notes(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/notes", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_update_note(self, auth_headers):
        if not TestNotes.note_id:
            pytest.skip("No note created")
        resp = requests.put(
            f"{BASE_URL}/api/notes/{TestNotes.note_id}",
            headers=auth_headers,
            json={"title": "TEST_Note Updated"}
        )
        assert resp.status_code == 200
        assert resp.json()["title"] == "TEST_Note Updated"

    def test_delete_note(self, auth_headers):
        if not TestNotes.note_id:
            pytest.skip("No note created")
        resp = requests.delete(f"{BASE_URL}/api/notes/{TestNotes.note_id}", headers=auth_headers)
        assert resp.status_code == 200


# ============ POSTS (FORUM) TESTS ============
class TestPosts:
    post_id = None

    def test_get_posts_public(self):
        resp = requests.get(f"{BASE_URL}/api/posts")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_create_post(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/posts",
            headers=auth_headers,
            json={"content": "TEST_Post content", "category": "general"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        TestPosts.post_id = data["id"]

    def test_like_post(self, auth_headers):
        if not TestPosts.post_id:
            pytest.skip("No post created")
        resp = requests.post(f"{BASE_URL}/api/posts/{TestPosts.post_id}/like", headers=auth_headers)
        assert resp.status_code == 200


# ============ IDEAS TESTS ============
class TestIdeas:
    idea_id = None

    def test_get_ideas(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/ideas", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_create_idea(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/ideas",
            headers=auth_headers,
            json={"prompt": "Outil de gestion de projet pour freelances", "niche": "B2B"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        assert "name" in data
        TestIdeas.idea_id = data["id"]

    def test_delete_idea(self, auth_headers):
        if not TestIdeas.idea_id:
            pytest.skip("No idea created")
        resp = requests.delete(f"{BASE_URL}/api/ideas/{TestIdeas.idea_id}", headers=auth_headers)
        assert resp.status_code == 200


# ============ PROJECTS TESTS ============
class TestProjects:
    project_id = None

    def test_create_project(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/projects",
            headers=auth_headers,
            json={"name": "TEST_Project", "description": "Test project", "niche": "B2B"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        TestProjects.project_id = data["id"]

    def test_get_projects(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/projects", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_get_tasks(self, auth_headers):
        if not TestProjects.project_id:
            pytest.skip("No project created")
        resp = requests.get(f"{BASE_URL}/api/tasks/{TestProjects.project_id}", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0


# ============ STATS TESTS ============
class TestStats:
    def test_get_stats(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/stats", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "points" in data
        assert "modules_completed" in data
        assert "weekly_activity" in data

    def test_get_activity(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/activity", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ============ ALFRED TESTS ============
class TestAlfred:
    alfred_session_id = None

    def test_create_alfred_session(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/alfred/sessions",
            headers=auth_headers,
            json={"title": "TEST_Session"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        TestAlfred.alfred_session_id = data["id"]

    def test_get_alfred_sessions(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/alfred/sessions", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_get_alfred_messages(self, auth_headers):
        if not TestAlfred.alfred_session_id:
            pytest.skip("No alfred session created")
        resp = requests.get(
            f"{BASE_URL}/api/alfred/sessions/{TestAlfred.alfred_session_id}/messages",
            headers=auth_headers
        )
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ============ TICKETS TESTS ============
class TestTickets:
    ticket_id = None

    def test_create_ticket(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/tickets",
            headers=auth_headers,
            json={"title": "TEST_Ticket", "category": "technique", "description": "Test ticket"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        TestTickets.ticket_id = data["id"]

    def test_get_tickets(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/tickets", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ============ FAVORITES TESTS ============
class TestFavorites:
    fav_id = None

    def test_add_favorite(self, auth_headers):
        resp = requests.post(
            f"{BASE_URL}/api/favorites",
            headers=auth_headers,
            json={"item_type": "module", "item_id": "mod_001", "item_title": "Introduction à Buildrs"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        TestFavorites.fav_id = data["id"]

    def test_get_favorites(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/favorites", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_remove_favorite(self, auth_headers):
        if not TestFavorites.fav_id:
            pytest.skip("No favorite created")
        resp = requests.delete(f"{BASE_URL}/api/favorites/{TestFavorites.fav_id}", headers=auth_headers)
        assert resp.status_code == 200
