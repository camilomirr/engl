#!/usr/bin/env python3
"""Genera downloads/PC-Hardware-Bridge.zip desde bridge/.

El ZIP contiene una carpeta PC-Hardware-Bridge/ con:
  hardware-server.ps1, iniciar-servidor.bat y LEEME.txt
con los bytes exactos de las fuentes. Volver a correr este
script después de editar cualquier fuente del puente.
"""

import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRIDGE_DIR = os.path.join(ROOT, "bridge")
OUT = os.path.join(ROOT, "downloads", "PC-Hardware-Bridge.zip")
FILES = ["hardware-server.ps1", "iniciar-servidor.bat", "LEEME.txt"]


def main():
    for name in FILES:
        path = os.path.join(BRIDGE_DIR, name)
        if not os.path.isfile(path):
            raise SystemExit("falta la fuente: " + path)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in FILES:
            zf.write(os.path.join(BRIDGE_DIR, name),
                     "PC-Hardware-Bridge/" + name)
    print("ZIP generado: %s (%d bytes)" % (OUT, os.path.getsize(OUT)))


if __name__ == "__main__":
    main()
