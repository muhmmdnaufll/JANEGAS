@echo off
title Launcher JANEGAS
echo ========================================================
echo   Memulai Sistem Monitoring JANEGAS...
echo ========================================================
start "JANEGAS Backend (FastAPI)" cmd /c "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "JANEGAS Frontend (Vite)" cmd /c "%~dp0run_frontend.bat"
echo.
echo   Kedua service telah dijalankan di jendela terpisah!
echo   - Backend:  http://127.0.0.1:8000
echo   - Frontend: http://127.0.0.1:5174
echo ========================================================
timeout /t 5
