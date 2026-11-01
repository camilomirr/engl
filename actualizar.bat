@echo off
title Actualizar repositorio engl (Git Pull)
cd /d "%~dp0"
echo ======================================================
echo   Actualizando repositorio engl desde GitHub...
echo ======================================================
echo.

git pull origin main

echo.
echo ======================================================
echo   Abriendo la pagina en el navegador...
echo ======================================================

start "" "index.html"

echo.
echo Repositorio actualizado y pagina abierta correctamente.
timeout /t 3 >nul
