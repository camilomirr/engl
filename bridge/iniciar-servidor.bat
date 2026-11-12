@echo off
chcp 65001 >nul
title PC Hardware Bridge

echo ====================================
echo     SERVIDOR DE HARDWARE DEL PC
echo ====================================
echo.
echo Iniciando servidor local...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0hardware-server.ps1"

echo.
echo El servidor se ha detenido.
pause
