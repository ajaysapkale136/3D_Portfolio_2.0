@echo off
title Ajay's Portfolio - React Frontend
echo =========================================================
echo   Starting React 3D Portfolio Frontend (Port 3000)
echo =========================================================

cd /d "%~dp0"

REM Free port 3000 if a previous orphaned node process is still holding it
echo [INFO] Checking if port 3000 is already in use...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo [INFO] Freeing stale process (PID: %%a) on port 3000...
    taskkill /f /pid %%a >nul 2>&1
)

echo [INFO] Launching React Development Server...
npm start

pause
