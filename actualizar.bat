@echo off
title Actualizar repositorio engl (Git Pull)
cd /d "%~dp0"
echo ======================================================
echo   Actualizando repositorio engl desde GitHub...
echo ======================================================
echo.

git fetch origin main
git pull origin main

if errorlevel 1 (
    echo.
    echo [AVISO] Fallo el pull normal. Sincronizando con el repositorio remoto...
    git reset --hard origin/main
)

start "" "index.html"
exit
