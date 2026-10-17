@echo off
title Ajay's Portfolio - Spring Boot Backend
echo =========================================================
echo   Starting Spring Boot + Spring AI Backend (Port 8080)
echo =========================================================

cd /d "%~dp0"

REM Free port 8080 if an old java process is still holding it
echo [INFO] Checking if port 8080 is already in use...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 " ^| findstr "LISTENING"') do (
    echo [INFO] Freeing stale process (PID: %%a) on port 8080...
    taskkill /f /pid %%a >nul 2>&1
)

REM If Java is not in PATH, fallback to Temurin JDK 21 default path
where java >nul 2>&1
if %ERRORLEVEL% neq 0 (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
        set "PATH=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot\bin;%PATH%"
    )
)

if exist "%~dp0backend\target\portfolio-backend-0.0.1-SNAPSHOT.jar" (
    echo [INFO] Running packaged Spring Boot JAR...
    java -jar "%~dp0backend\target\portfolio-backend-0.0.1-SNAPSHOT.jar"
) else (
    echo [INFO] Packaged JAR not found. Starting with Maven...
    cd backend
    if exist "C:\Users\DELL\.m2\wrapper\apache-maven-3.9.9\bin\mvn.cmd" (
        "C:\Users\DELL\.m2\wrapper\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
    ) else (
        mvn spring-boot:run
    )
)

pause
