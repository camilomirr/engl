#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NVISION · Pruebas automáticas del sitio (sin dependencias).

Se ejecutan local con:  python3 tests/run_tests.py
y en cada push con GitHub Actions (flujo en tests/ci-para-github.yml).

Qué comprueban:
  1. Todas las páginas tienen CSP, meta description y Open Graph.
  2. Los enlaces internos .html apuntan a archivos que existen.
  3. El manifiesto PWA es JSON válido y sus iconos/capturas existen.
  4. El sitemap y la lista SHELL del service worker cuadran con los archivos.
  5. Todas las imágenes <img> llevan atributo alt.
  6. Los 5 exámenes tienen 15 preguntas, con opciones ES/EN parejas y la
     respuesta correcta dentro de rango.
  7. El banco de la pregunta del día tiene 32 preguntas válidas.
  8. Hay 25 logros con ids únicos.
  9. La capa js/validation.js expone las funciones esperadas.
 10. El catálogo del Workshop es JSON válido con 88 componentes.
 11. No hay ninguna clave service_role de Supabase en el repo.
 12. Sintaxis de todos los .js (si hay Node.js disponible).
"""
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAILS = []
WARNS = []


def check(ok, msg):
    if ok:
        print("  ok  " + msg)
    else:
        FAILS.append(msg)
        print("FAIL  " + msg)


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8", errors="ignore") as f:
        return f.read()


def exists(rel):
    return os.path.exists(os.path.join(ROOT, rel.lstrip("/")))


PAGES = sorted(glob.glob("*.html", root_dir=ROOT)) + [
    "workshop/index.html",
    "redes_challenge/index.html",
]

print("== Paginas: CSP, descripcion y Open Graph ==")
for page in PAGES:
    t = read(page)
    check("Content-Security-Policy" in t, page + ": tiene CSP")
    check('name="description"' in t, page + ": tiene meta description")
    check('property="og:' in t, page + ": tiene Open Graph")

print("== Enlaces internos ==")
for page in PAGES:
    t = read(page)
    base = os.path.dirname(page)
    for href in re.findall(r'href="([^"#]+)"', t):
        if href.startswith(("http", "mailto:", "tel:", "data:", "javascript:")):
            continue
        target = href.split("?")[0]
        if not (target.endswith(".html") or target.endswith("/")):
            continue
        full = os.path.normpath(os.path.join(base, target))
        if target.endswith("/"):
            full = os.path.join(full, "index.html")
        check(exists(full), page + ": enlace a " + href)

print("== PWA ==")
manifest = json.loads(read("manifest.webmanifest"))
check(True, "manifest.webmanifest es JSON valido")
for icon in manifest.get("icons", []):
    check(exists(icon["src"]), "icono PWA existe: " + icon["src"])
for shot in manifest.get("screenshots", []):
    check(exists(shot["src"]), "captura PWA existe: " + shot["src"])

print("== Sitemap y service worker ==")
sitemap = read("sitemap.xml")
for loc in re.findall(r"<loc>https://nvision\.social(/[^<]*)", sitemap):
    path = loc if loc != "/" else "/index.html"
    if path.endswith("/"):
        path += "index.html"
    check(exists(path), "sitemap: " + loc)
sw = read("sw.js")
shell = re.search(r"var SHELL = \[(.*?)\];", sw, re.S).group(1)
for entry in re.findall(r"'(/[^']*)'", shell):
    path = entry + "index.html" if entry.endswith("/") else entry
    check(exists(path), "SW SHELL: " + entry)

print("== Accesibilidad basica ==")
total_img = sin_alt = 0
for page in PAGES:
    for img in re.findall(r"<img[^>]*>", read(page)):
        total_img += 1
        if "alt=" not in img:
            sin_alt += 1
check(sin_alt == 0, "todas las <img> (%d) llevan alt" % total_img)


def split_args(call):
    """Divide los argumentos de primer nivel de una llamada Q(...)."""
    args, depth, cur, i, in_str = [], 0, "", 0, False
    body = call[2:-1]  # sin 'Q(' ni ')'
    while i < len(body):
        c = body[i]
        if in_str:
            cur += c
            if c == "\\":
                cur += body[i + 1]
                i += 1
            elif c == "'":
                in_str = False
        elif c == "'":
            in_str = True
            cur += c
        elif c in "([":
            depth += 1
            cur += c
        elif c in ")]":
            depth -= 1
            cur += c
        elif c == "," and depth == 0:
            args.append(cur.strip())
            cur = ""
        else:
            cur += c
        i += 1
    if cur.strip():
        args.append(cur.strip())
    return args


def q_calls(text):
    out = []
    for m in re.finditer(r"(?<![\w.])Q\('", text):
        i = m.start()
        depth, in_str, j = 0, False, i + 1
        while j < len(text):
            c = text[j]
            if in_str:
                if c == "\\":
                    j += 1
                elif c == "'":
                    in_str = False
            elif c == "'":
                in_str = True
            elif c == "(":
                depth += 1
            elif c == ")":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        out.append(text[i:j + 1])
    return out


def opt_count(array_text):
    inner = array_text.strip()[1:-1].strip()
    if not inner:
        return 0
    n, in_str, i = 1, False, 0
    while i < len(inner):
        c = inner[i]
        if in_str:
            if c == "\\":
                i += 1
            elif c == "'":
                in_str = False
        elif c == "'":
            in_str = True
        elif c == ",":
            n += 1
        i += 1
    return n


print("== Examenes ==")
examenes = read("js/examenes.js")
segments = re.split(r"\{\s*\n\s*id: '", examenes)[1:]
check(len(segments) == 5, "hay 5 examenes")
for seg in segments:
    eid = seg.split("'", 1)[0]
    body = seg.split("questions: [", 1)[1].split("\n      ]")[0]
    calls = q_calls(body)
    check(len(calls) == 15, "examen %s: 15 preguntas (tiene %d)" % (eid, len(calls)))
    for call in calls:
        args = split_args(call)
        n_es, n_en, a = opt_count(args[2]), opt_count(args[3]), int(args[4])
        check(n_es == n_en == 4 and 0 <= a < n_es,
              "examen %s: pregunta valida (opciones ES/EN y respuesta en rango)" % eid)

print("== Pregunta del dia ==")
pool = q_calls(read("js/pregunta.js"))
check(len(pool) == 32, "banco de la pregunta del dia: 32 (tiene %d)" % len(pool))
for call in pool:
    args = split_args(call)
    n_es, n_en, a = opt_count(args[3]), opt_count(args[4]), int(args[5])
    check(n_es == n_en == 4 and 0 <= a < n_es, "pregunta del dia valida")

print("== Logros ==")
logros = read("js/logros.js")
ids = re.findall(r"\{ id: '([a-z0-9-]+)'", logros)
check(len(ids) == 25, "hay 25 logros (hay %d)" % len(ids))
check(len(ids) == len(set(ids)), "ids de logros unicos")

print("== Capa de validacion ==")
val = read("js/validation.js")
for fn in ["escapeHtml", "cleanName", "cleanText", "isEmail", "isUuid",
           "safePoints", "safeScore", "validAvatarImg", "isCertCode", "safeNext"]:
    check(fn in val, "validation.js expone " + fn)
for user in ["js/cuenta.js", "js/ranking.js", "js/verificar.js",
             "js/examenes.js", "redes_challenge/juego.js"]:
    check("NVISION_validate" in read(user), user + " usa la capa de validacion")

print("== Workshop ==")
catalog = json.loads(read("workshop/data/components.json"))
check(len(catalog.get("components", [])) == 88,
      "catalogo del Workshop: 88 componentes (tiene %d)" % len(catalog.get("components", [])))

print("== Secretos ==")
bad = []
for path in glob.glob("**/*", root_dir=ROOT, recursive=True):
    if path.startswith(".git") or os.path.isdir(os.path.join(ROOT, path)):
        continue
    if path == "tests/run_tests.py":
        continue  # este archivo nombra el patron que busca
    try:
        t = read(path)
    except Exception:
        continue
    if '"role":"service_role"' in t or "service_role_key" in t:
        bad.append(path)
check(not bad, "ninguna clave service_role en el repo " + str(bad))

print("== Etiquetas hardware PC3D ==")
pc3d = read("pc3d.html")
check("http://127.0.0.1:8765" in pc3d and "http://localhost:8765" in pc3d,
      "pc3d.html: CSP permite el puente local (127.0.0.1/localhost:8765)")
check("js/pc-hardware.js" in pc3d, "pc3d.html carga js/pc-hardware.js")
for hid in ("pc-hw-detect", "pc-hw-demo", "pc-hw-clear", "pc-hw-status", "pc-hw-help"):
    check('id="%s"' % hid in pc3d, "pc3d.html tiene #%s" % hid)
hw = read("js/pc-hardware.js")
check("nvision:hardware-labels" in hw, "pc-hardware.js emite nvision:hardware-labels")
check("innerHTML" not in hw, "pc-hardware.js no usa innerHTML (datos del puente solo como texto)")
check("Ver ejemplo" in hw or "demo" in hw.lower(), "pc-hardware.js trae modo ejemplo")
viewer = read("js/pc3d-viewer.js")
check("nvision:hardware-labels" in viewer and "is-real" in viewer,
      "visor 3D aplica etiquetas reales sin tocar el modelo")
model = read("js/pc3d-model.js")
check("hardware-labels" not in model and "pc-hardware" not in model,
      "pc3d-model.js intacto: sin referencias al puente")
explorer_css = read("css/modules/pc-explorer.css")
check(".pc-label.is-real" in explorer_css and ".pc-hw-block" in explorer_css,
      "pc-explorer.css tiene estilos de etiquetas reales y del bloque del puente")

# Descarga del puente (ZIP) y fuentes del puente
check('id="pc-hw-download"' in pc3d and 'href="downloads/PC-Hardware-Bridge.zip"' in pc3d,
      "pc3d.html tiene el botón Descargar puente enlazado al ZIP")
zip_path = os.path.join(ROOT, "downloads", "PC-Hardware-Bridge.zip")
zip_ok = os.path.isfile(zip_path) and os.path.getsize(zip_path) < 100 * 1024
zip_contents_ok = False
if zip_ok:
    try:
        with zipfile.ZipFile(zip_path) as zf:
            expected = ["PC-Hardware-Bridge/hardware-server.ps1",
                        "PC-Hardware-Bridge/iniciar-servidor.bat",
                        "PC-Hardware-Bridge/LEEME.txt"]
            zip_contents_ok = zf.namelist() == expected and all(
                zf.read(name) == open(os.path.join(ROOT, "bridge", os.path.basename(name)), "rb").read()
                for name in expected)
    except zipfile.BadZipFile:
        zip_contents_ok = False
check(zip_ok and zip_contents_ok,
      "El ZIP del puente existe y su contenido coincide byte a byte con bridge/")
ps1 = open(os.path.join(ROOT, "bridge", "hardware-server.ps1"), encoding="utf-8-sig").read()
check("Test-AllowedOrigin" in ps1 and "nvision.social" in ps1
      and "Access-Control-Allow-Origin: *" not in ps1,
      "El .ps1 limita el origen a NVISION/localhost (sin CORS *)")
check("1.1" in ps1 and "ReceiveTimeout" in ps1 and "Get-CimSafe" in ps1,
      "El .ps1 es la versión 1.1 con tiempos de espera y lectura segura")
bat = open(os.path.join(ROOT, "bridge", "iniciar-servidor.bat"), encoding="utf-8").read()
check("hardware-server.ps1" in bat and "ExecutionPolicy Bypass" in bat,
      "El .bat lanza el .ps1")
leeme = open(os.path.join(ROOT, "bridge", "LEEME.txt"), encoding="utf-8-sig").read()
check("iniciar-servidor.bat" in leeme and "8765" in leeme and "Detectar mi PC" in leeme,
      "LEEME.txt explica cómo usar el puente")
check(os.path.isfile(os.path.join(ROOT, "tools", "build_bridge_zip.py")),
      "Existe el generador del ZIP del puente")

print("== Sintaxis JS ==")
node = shutil.which("node")
if node:
    for js in sorted(glob.glob("js/*.js", root_dir=ROOT)) + \
            ["redes_challenge/juego.js"] + \
            sorted(glob.glob("workshop/js/**/*.js", root_dir=ROOT, recursive=True)):
        r = subprocess.run([node, "--check", os.path.join(ROOT, js)],
                           capture_output=True, text=True)
        check(r.returncode == 0, "node --check " + js)
else:
    WARNS.append("Node.js no disponible: se omite la sintaxis JS")
    print("  --  Node.js no disponible, se omite")

print()
for w in WARNS:
    print("AVISO: " + w)
if FAILS:
    print("RESULTADO: %d pruebas FALLARON" % len(FAILS))
    sys.exit(1)
print("RESULTADO: todas las pruebas pasaron")
