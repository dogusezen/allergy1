@echo off
title Allergy App One-Click Launcher

echo Starting Allergy App...

REM Start Backend
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

pip install -r requirements.txt

if not exist .env (
    copy .env.example .env
    echo Please edit backend\.env and add your GEMINI_API_KEY
)

start cmd /k "venv\Scripts\activate && uvicorn main:app --port 8000"

cd ..

REM Start Frontend
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

start cmd /k "npm run dev"

cd ..

echo.
echo =======================================
echo Allergy App is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo =======================================
pause
