@echo off
REM Canonical Life OS Launcher — M4 Convergence
REM Runtime identity: ASpace_Worlds\Life_OS_2026
REM Ports: 4444 (UI), 4445 (Blackboard), 3001 (Terra API Runtime)

setlocal enabledelayedexpansion

set "CANONICAL_ROOT=C:\Users\amado\ASpace_Worlds\Life_OS_2026"
set "PORT_UI=4444"
set "PORT_BLACKBOARD=4445"
set "PORT_API=3001"
set "LOG_DIR=%CANONICAL_ROOT%\logs"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo [LAUNCHER] Canonical runtime: %CANONICAL_ROOT%
echo [LAUNCHER] Ports: UI=%PORT_UI% Blackboard=%PORT_BLACKBOARD% API=%PORT_API%

REM Phase 1: Port cleanup
for %%P in (%PORT_UI% %PORT_BLACKBOARD% %PORT_API%) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P" ^| findstr "LISTENING"') do (
        echo [LAUNCHER] Killing PID %%A on port %%P
        taskkill /PID %%A /F >nul 2>&1
    )
)

REM Phase 2: Vite cache purge
echo [LAUNCHER] Purging Vite cache...
if exist "%CANONICAL_ROOT%\node_modules\.vite" rmdir /s /q "%CANONICAL_ROOT%\node_modules\.vite" >nul 2>&1

REM Phase 3: Start services
cd /d "%CANONICAL_ROOT%"

REM Start Blackboard (port 4445)
echo [LAUNCHER] Starting Blackboard on %PORT_BLACKBOARD%...
start "Blackboard" /min cmd /c "npm run server > %LOG_DIR%\blackboard.log 2>&1"

REM Wait for Blackboard health
timeout /t 3 /nobreak >nul
for /l %%i in (1,1,10) do (
    curl -s "http://localhost:%PORT_BLACKBOARD%/health" >nul 2>&1 && (
        echo [LAUNCHER] Blackboard healthy
        goto :BB_DONE
    )
    timeout /t 1 /nobreak >nul
)
:BB_DONE

REM Start Terra API Runtime (port 3001)
echo [LAUNCHER] Starting Terra API Runtime on %PORT_API%...
start "API-Runtime" /min cmd /c "npx tsx server/api/harness.ts > %LOG_DIR%\api-runtime.log 2>&1"

REM Start UI (port 4444)
echo [LAUNCHER] Starting UI on %PORT_UI%...
start "Life-OS-UI" /min cmd /c "npm run dev -- --port %PORT_UI% --host 0.0.0.0 > %LOG_DIR%\ui.log 2>&1"

REM Wait for UI
timeout /t 5 /nobreak >nul
for /l %%i in (1,1,15) do (
    curl -s "http://localhost:%PORT_UI%" >nul 2>&1 && (
        echo [LAUNCHER] UI healthy
        goto :UI_DONE
    )
    timeout /t 1 /nobreak >nul
)
:UI_DONE

echo [LAUNCHER] All services started
echo   UI:           http://localhost:%PORT_UI%
echo   Blackboard:   http://localhost:%PORT_BLACKBOARD%
echo   API Runtime:  http://localhost:%PORT_API%
echo   Logs:         %LOG_DIR%