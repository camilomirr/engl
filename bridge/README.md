# Puente local de hardware (PC3D)

Fuentes del puente que alimenta las etiquetas con hardware real de
`pc3d.html`. Solo Windows; la página web no puede ejecutar estos
archivos, el visitante debe descargarlos y ejecutarlos en su PC.

## Archivos

- `hardware-server.ps1`: servidor local en `127.0.0.1:8765` que
  responde `GET /api/hardware` con datos WMI/CIM. Versión 1.1:
  solo acepta peticiones desde NVISION y localhost, con tiempos
  de espera y lectura por clases con advertencias parciales.
- `iniciar-servidor.bat`: lanzador (doble clic).
- `LEEME.txt`: instrucciones para el usuario; va dentro del ZIP.

## Descarga

El botón "Descargar puente" de `pc3d.html` enlaza a
`downloads/PC-Hardware-Bridge.zip`, que se genera desde estos
archivos con:

```sh
python3 tools/build_bridge_zip.py
```

El ZIP contiene una carpeta `PC-Hardware-Bridge/` con los tres
archivos de arriba. Después de editar cualquier fuente, vuelve a
generar el ZIP y comprueba que `tests/run_tests.py` sigue en
verde: la suite verifica que el contenido del ZIP coincide
byte a byte con estas fuentes.

## Límites conocidos

- Sin PowerShell en el entorno de desarrollo: los cambios del
  `.ps1` se revisan por lectura y deben probarse en un Windows
  real antes de confiar en ellos.
- La VRAM mayor de 4 GB puede salir mal por el límite de
  `Win32_VideoController.AdapterRAM` (entero de 32 bits); la
  página no muestra los GB de la GPU por eso.
- El puerto 8765 coincide con el del gateway de JARVIS: no
  pueden correr los dos a la vez.
