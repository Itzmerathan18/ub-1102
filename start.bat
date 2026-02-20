@echo off
echo Starting AyuRaksha LifeVault...

echo.
echo [1/2] Starting Backend (port 4000)...
start "AyuRaksha Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo.
echo [2/2] Starting Frontend (port 3000)...
timeout /t 3 /nobreak >nul
start "AyuRaksha Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo  AyuRaksha LifeVault is starting up!
echo  Backend:  http://localhost:4000/health
echo  Frontend: http://localhost:3000
echo ========================================
timeout /t 5 /nobreak >nul
start http://localhost:3000
