@echo off
title Gurukul Edu WebApp Startup
echo ========================================
echo Starting Gurukul Edu WebApp...
echo ========================================

:: Start Backend
echo Launching Backend Server...
start "Gurukul Backend" cmd /k "cd backend && npm run dev"

:: Start Frontend
echo Launching Frontend Server...
start "Gurukul Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for a few seconds for servers to initialize
echo Waiting for servers to initialize...
timeout /t 5 /nobreak > nul

:: Open Browser
echo Opening App in Browser...
start "" http://localhost:5173

echo ========================================
echo All servers launched! You can close this window.
echo ========================================
pause
