@echo off
title Tour Virtual - Casa Tipo 1

:: ── Matar cualquier proceso Node en puerto 3333 ─────────────────────────────
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3333 "') do (
    taskkill /f /pid %%a >nul 2>&1
)

:: ── Iniciar servidor en segundo plano ────────────────────────────────────────
cd /d "%~dp0"
start "" /b node server.js

:: ── Esperar a que el servidor arranque ───────────────────────────────────────
timeout /t 2 /nobreak >nul

:: ── Abrir en el navegador predeterminado ─────────────────────────────────────
start "" "http://localhost:3333/tour360.html"

echo.
echo  Tour Virtual iniciado en http://localhost:3333/tour360.html
echo  (Cierra esta ventana para detener el servidor)
echo.

:: Mantener vivo el servidor mientras la ventana esté abierta
:loop
timeout /t 60 /nobreak >nul
goto loop
