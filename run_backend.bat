@echo off
title JANEGAS Backend API
echo ========================================================
echo   JANEGAS (Jantho Renewable Gas) - Backend API
echo   Port: 8000 ^| URL: http://127.0.0.1:8000
echo   API Docs (Swagger): http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0BE JANEGAS"
call .venv\Scripts\activate.bat
python -m uvicorn main:app --reload --port 8000
pause
