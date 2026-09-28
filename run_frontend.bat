@echo off
title JANEGAS Frontend Dashboard
echo ========================================================
echo   JANEGAS (Jantho Renewable Gas) - Web Dashboard
echo   Port: 5174 ^| URL: http://127.0.0.1:5174
echo ========================================================
cd /d "%~dp0FE JANEGAS"
call npm.cmd run dev
pause
