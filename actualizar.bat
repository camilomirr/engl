@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
REM ============================================================
REM  NVISION - Actualizar la copia local desde GitHub
REM  Doble clic en este archivo y la carpeta del proyecto en
REM  tu XAMPP queda con la ultima version del repositorio:
REM  https://github.com/camilomirr/engl
REM  No necesita permisos de administrador ni tener Git.
REM ============================================================

REM La direccion del ZIP con el repo completo, rama main.
set "REPO=https://github.com/camilomirr/engl/archive/refs/heads/main.zip"

REM Carpeta destino: la del proyecto dentro del htdocs de XAMPP.
set "DEST=C:\xampp\htdocs\nvision"
set "AVISO="

REM Se crea la carpeta y se prueba si Windows deja escribir en ella.
mkdir "%DEST%" 2>nul
echo prueba > "%DEST%\.escribible" 2>nul
if exist "%DEST%\.escribible" (
  del "%DEST%\.escribible"
) else (
  REM Sin permiso en htdocs: se usa la carpeta del usuario y se avisa al final.
  set "DEST=%USERPROFILE%\nvision"
  set "AVISO=1"
  mkdir "%DEST%" 2>nul
)

echo.
echo Actualizando NVISION desde GitHub...
echo Carpeta local: %DEST%
echo.

REM Paso 1: descargar el ZIP del repo a la carpeta temporal.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%REPO%' -OutFile (Join-Path $env:TEMP 'nvision-repo.zip') -UseBasicParsing"
if errorlevel 1 (
  echo.
  echo ERROR: no se pudo descargar. Revisa tu conexion a internet.
  pause
  exit /b 1
)

REM Paso 2: descomprimir el ZIP; adentro queda la carpeta engl-main.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d = Join-Path $env:TEMP 'nvision-repo'; if (Test-Path $d) { Remove-Item $d -Recurse -Force }; Expand-Archive -Path (Join-Path $env:TEMP 'nvision-repo.zip') -DestinationPath $d -Force"
if errorlevel 1 (
  echo.
  echo ERROR: no se pudo descomprimir el ZIP descargado.
  pause
  exit /b 1
)

REM Paso 3: copiar SOLO los archivos del proyecto PHP a la carpeta
REM local: las paginas .php, includes, frontend y la base de datos;
REM del backend unicamente los .php, porque los .js del repo son
REM del sitio viejo en HTML y en local no se usan.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$src = Join-Path $env:TEMP 'nvision-repo\engl-main'; $dst = $env:DEST; 'includes','frontend','base-de-datos','backend' | ForEach-Object { New-Item -ItemType Directory -Force -Path (Join-Path $dst $_) | Out-Null }; Copy-Item (Join-Path $src '*.php') $dst -Force; Copy-Item (Join-Path $src 'includes\*') (Join-Path $dst 'includes') -Recurse -Force; Copy-Item (Join-Path $src 'frontend\*') (Join-Path $dst 'frontend') -Recurse -Force; Copy-Item (Join-Path $src 'base-de-datos\*') (Join-Path $dst 'base-de-datos') -Recurse -Force; Get-ChildItem (Join-Path $src 'backend\*.php') | Copy-Item -Destination (Join-Path $dst 'backend') -Force"
if errorlevel 1 (
  echo.
  echo ERROR: algo fallo copiando los archivos.
  pause
  exit /b 1
)

REM Paso 4, solo si hace falta: si XAMPP esta en la ruta normal y
REM MySQL esta encendido, se crea la base de datos nvision y se
REM importa el SQL. Si la tabla productos ya existe, no se toca.
if exist "C:\xampp\mysql\bin\mysql.exe" (
  "C:\xampp\mysql\bin\mysql.exe" -u root -N -s -e "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='nvision' AND TABLE_NAME='productos';" > "%TEMP%\nvision-bd.txt" 2>nul
  if errorlevel 1 (
    echo MySQL no respondio: enciende MySQL en el panel de XAMPP e importa
    echo a mano el archivo base-de-datos\nvision_mysql.sql desde phpMyAdmin.
  ) else (
    set "TABLAS="
    set /p TABLAS=<"%TEMP%\nvision-bd.txt"
    if "!TABLAS!"=="0" (
      "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS nvision CHARACTER SET utf8mb4;"
      "C:\xampp\mysql\bin\mysql.exe" -u root nvision < "%DEST%\base-de-datos\nvision_mysql.sql"
      echo Base de datos nvision creada e importada.
    ) else (
      echo La base de datos nvision ya estaba creada: no se toco.
    )
  )
)

echo.
echo ============================================
echo  NVISION actualizado en: %DEST%
if defined AVISO (
  echo  OJO: no hubo permiso para escribir en C:\xampp\htdocs,
  echo  por eso quedo en tu carpeta de usuario. Copia la carpeta
  echo  nvision dentro del htdocs de tu XAMPP para poder abrirla.
) else (
  echo  Abrelo en: http://localhost/nvision/tienda.php
  echo  Con Apache y MySQL encendidos en el panel de XAMPP.
)
echo ============================================
pause
