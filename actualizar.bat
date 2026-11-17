@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
REM ============================================================
REM  NVISION - Actualizar la copia local desde GitHub
REM  Version 2: actualizacion INCREMENTAL. Solo se baja y se
REM  escribe lo que cambio desde la ultima vez; lo demas no
REM  se toca. Doble clic y la carpeta del proyecto en tu
REM  XAMPP queda al dia con el repositorio:
REM  https://github.com/camilomirr/engl
REM  No necesita permisos de administrador.
REM ============================================================

REM Direccion del repo y de su ZIP completo (respaldo sin Git).
set "REPO=https://github.com/camilomirr/engl"
set "REPOZIP=https://github.com/camilomirr/engl/archive/refs/heads/main.zip"

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

REM Carpeta espejo: aqui queda guardado el repo en este PC.
REM La primera vez se baja completo; despues solo los cambios.
set "ESPEJO=%USERPROFILE%\nvision-repo"

echo.
echo Actualizando NVISION desde GitHub...
echo Carpeta local: %DEST%
echo.

REM ------------------------------------------------------------
REM  Obtener los cambios: con Git si el PC lo tiene (solo baja
REM  lo que cambio); si no, con el ZIP completo de siempre.
REM ------------------------------------------------------------
where git >nul 2>nul
if errorlevel 1 goto ModoZip

REM Modo Git: si el espejo ya es un clon, pull; si no, se clona.
set "MODO=Git"
if exist "%ESPEJO%\.git" (
  git -C "%ESPEJO%" pull --quiet
) else (
  if exist "%ESPEJO%" rmdir /s /q "%ESPEJO%"
  git clone --depth 1 --quiet %REPO% "%ESPEJO%"
)
if errorlevel 1 (
  echo.
  echo ERROR: Git no pudo actualizar. Borra la carpeta
  echo %ESPEJO% y vuelve a correr este archivo.
  pause
  exit /b 1
)
goto Copiar

:ModoZip
REM Modo ZIP: se baja el repo completo y se extrae con tar,
REM que es mucho mas rapido que el descompresor anterior.
set "MODO=ZIP"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%REPOZIP%' -OutFile (Join-Path $env:TEMP 'nvision-repo.zip') -UseBasicParsing"
if errorlevel 1 (
  echo.
  echo ERROR: no se pudo descargar. Revisa tu conexion a internet.
  pause
  exit /b 1
)
if exist "%ESPEJO%" rmdir /s /q "%ESPEJO%"
mkdir "%ESPEJO%"
tar -xf "%TEMP%\nvision-repo.zip" -C "%ESPEJO%" --strip-components 1
if errorlevel 1 (
  echo.
  echo ERROR: no se pudo descomprimir el ZIP descargado.
  pause
  exit /b 1
)

:Copiar
REM ------------------------------------------------------------
REM  Copia incremental con robocopy (viene con Windows): solo
REM  escribe los archivos nuevos o cambiados; los que estan
REM  iguales ni se tocan. Se copia solo el proyecto PHP: las
REM  paginas, includes, frontend, assets, la base de datos y
REM  del backend unicamente los .php.
REM ------------------------------------------------------------
robocopy "%ESPEJO%" "%DEST%" *.php /NJH /NJS /NDL /NFL /NC /NS /NP /R:1 /W:1 >nul
robocopy "%ESPEJO%\includes" "%DEST%\includes" /E /NJH /NJS /NDL /NFL /NC /NS /NP /R:1 /W:1 >nul
robocopy "%ESPEJO%\frontend" "%DEST%\frontend" /E /NJH /NJS /NDL /NFL /NC /NS /NP /R:1 /W:1 >nul
robocopy "%ESPEJO%\base-de-datos" "%DEST%\base-de-datos" /E /NJH /NJS /NDL /NFL /NC /NS /NP /R:1 /W:1 >nul
robocopy "%ESPEJO%\assets" "%DEST%\assets" /E /NJH /NJS /NDL /NFL /NC /NS /NP /R:1 /W:1 >nul
robocopy "%ESPEJO%\backend" "%DEST%\backend" *.php /NJH /NJS /NDL /NFL /NC /NS /NP /R:1 /W:1 >nul
if errorlevel 8 (
  echo.
  echo ERROR: algo fallo copiando los archivos.
  pause
  exit /b 1
)

REM Paso final, solo si hace falta: si XAMPP esta en la ruta
REM normal y MySQL esta encendido, se crea la base de datos
REM nvision y se importa el SQL. Si la tabla productos ya
REM existe, no se toca.
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
echo  Modo usado: %MODO%
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
