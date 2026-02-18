# Allergy App (Render Deploy)

## What this repo contains
- `backend/` FastAPI + SQLite + Gemini proxy (`POST /api/gemini`)
- `frontend/` React (Vite) UI (your interface)
- `render.yaml` Render Blueprint to deploy BOTH backend + frontend

## Deploy on Render (no terminal)
1. Push / upload this repo to GitHub (you already created the repo).
2. In Render: **New** → **Blueprint**
3. Select your repo and deploy.
4. In Render → `allergy-backend` → **Environment** → add:
   - `GEMINI_API_KEY` = your key
5. After deploy finishes, open the **allergy-frontend** URL.

## Useful URLs
- Backend docs: `https://<backend>.onrender.com/docs`
- Frontend: `https://<frontend>.onrender.com`
