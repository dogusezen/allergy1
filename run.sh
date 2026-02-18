#!/bin/bash
echo "Starting Allergy App..."

# Backend
cd backend
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Edit backend/.env and add GEMINI_API_KEY"
fi

gnome-terminal -- bash -c "source venv/bin/activate && uvicorn main:app --port 8000; exec bash" 2>/dev/null || xterm -e "source venv/bin/activate && uvicorn main:app --port 8000" &

cd ../frontend

if [ ! -d "node_modules" ]; then
  npm install
fi

gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || xterm -e "npm run dev" &

echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
