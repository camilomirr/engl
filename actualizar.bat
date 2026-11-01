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
echo   Proceso finalizado.
echo ======================================================
pause
