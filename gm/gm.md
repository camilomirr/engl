# Instrucciones de Idioma y Comunicación

- Idioma principal: Comunícate, explica y responde en español.
- Documentación y mensajes: Redacta explicaciones, resúmenes, mensajes de estado y comentarios en español a menos que se indique explícitamente lo contrario.

## Normalización Universal de Saltos de Línea (Solución Definitiva a "Target not found")
- **Problema de Windows (CRLF vs LF)**: En Windows, los archivos suelen guardarse con saltos `\r\n` (CRLF), lo cual causa fallos constantes en `edit_file` con el mensaje: `Error: target content not found in the file; the Target must exactly match existing file text, including whitespace`.
- **Regla de configuración obligatoria en toda PC nueva o clonada**:
  1. Configurar Git para no convertir a CRLF:
     ```powershell
     git config --global core.autocrlf false
     git config core.autocrlf false
     ```
  2. Mantener siempre el archivo `.gitattributes` en la raíz del repositorio con:
     ```gitattributes
     * text=auto eol=lf
     *.html text eol=lf
     *.css text eol=lf
     *.js text eol=lf
     *.md text eol=lf
     ```
  3. Si un archivo presenta discrepancia de líneas, ejecutar:
     ```powershell
     git add --renormalize .
     ```


## Lectura y Edición de Archivos Estilo Editor (Regla Estricta de Lectura en Lotes)
- **Lectura directa tipo VS Code**: Prohibido usar comandos de consola para leer o inspeccionar código (nada de `Get-Content`, `Select-String`, `type` o scripts). Usa exclusivamente la herramienta nativa `read_file` para leer el archivo tal cual como en un editor.
- **Lectura en lotes de mínimo 700 líneas (Regla Estricta)**:
  - Nunca leas en bloques menores a 700 líneas si el archivo lo permite. Está estrictamente prohibido leer fragmentos pequeños de 20, 50 o 100 líneas.
  - Si el archivo tiene menos de 700 líneas (por ejemplo, 100, 300 o 400 líneas), debes leerlo **completamente de principio a fin** en una sola llamada a `read_file`.
  - Si el archivo supera las 700 líneas, lee siempre en lotes grandes de mínimo 700 líneas a la vez (por ejemplo de 700 a 800 líneas: `StartLine: 1, EndLine: 750`, `StartLine: 751, EndLine: 1500`, etc.) para obtener el contexto completo y exacto de las líneas antes de editar.
- **Edición precisa con `edit_file`**: Al editar como en un editor de código (VS Code), copia el bloque exacto obtenido de la lectura de lotes grandes en el `Target` (incluyendo su sangría y saltos de línea exactos) y proporciona el `Replacement` de forma limpia y directa.

## Autenticación de GitHub CLI (Al Iniciar Cada Chat)
- Cada vez que comience una nueva conversación o sesión de chat, la IA debe consultar y verificar el token activo de GitHub CLI ejecutando:
  ```powershell
  gh auth token
  ```
- Usa este token para cualquier operación de `git push` o autenticación con repositorios remotos y así evitar bloqueos por falta de credenciales.

## Configuración y Autenticación de GitHub CLI en Nuevas PCs
- En nuevas computadoras o entornos donde no esté configurado o instalado GitHub CLI (`gh`):
  1. **Instalación obligatoria**: Asegurarse de que esté instalado; si no lo está, ejecutar:
     ```powershell
     winget install github.cli
     ```
  2. **Inicio de sesión**: Ejecutar el comando para iniciar sesión:
     ```powershell
     gh auth login
     ```
  3. **Entrega de código y enlace**: La IA debe capturar y proporcionar directamente en la respuesta la URL (enlace) y el código de un solo uso generado por GitHub CLI para que el usuario pueda iniciar sesión en el navegador, asegurándose de que la herramienta quede correctamente instalada y autenticada.

## Repositorios y Automatización de Git
- **Sincronización Previa Obligatoria (Git Pull Siempre ANTES)**:
  - Siempre, antes de realizar cualquier cambio o modificación de código en la PC local, es **obligatorio** ejecutar un `git pull` para descargar primero los cambios de los demás colaboradores y evitar conflictos:
  ```powershell
  git pull origin main
  ```
- **Git Push Automático**:
  - Al terminar las modificaciones en el repositorio actual de trabajo (como `edunv`, `engl` o cualquier otro repositorio Git en el que se esté trabajando), realiza automáticamente `git add .`, `git commit -m "n"` y `git push origin main` (usando el token de autenticación si es necesario).
  - El mensaje del commit siempre debe ser únicamente `"n"`.
  - No le pidas al usuario confirmaciones para hacer push ni le indiques usar GitHub Desktop.
