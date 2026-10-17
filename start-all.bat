@echo off
title Ajay's Portfolio - Launcher
echo =========================================================
echo   Starting 3D Portfolio Full-Stack Application
echo =========================================================

REM Free stale ports before launch
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo [1/2] Starting Spring Boot Backend in a separate window...
start "Ajay's Portfolio - Backend" "%~dp0start-backend.bat"

REM Brief wait for backend to initialize
timeout /t 3 >nul

echo [2/2] Starting React Frontend in a separate window...
start "Ajay's Portfolio - Frontend" "%~dp0start-frontend.bat"

echo.
echo =========================================================
echo Both services are starting up!
echo - React Frontend:  http://localhost:3000
echo - Spring Boot API: http://localhost:8080/api/health
echo =========================================================
echo You can keep these terminal windows open while working.
timeout /t 5 >nul
