// =========================================================
// NVISION PC WORKSHOP - Datos: carga del catalogo (JSON)
// Fuente principal: ../data/components.json (editable sin
// tocar codigo). Si el JSON no se puede leer (p. ej. abrir
// el archivo con file://), se usa la copia de respaldo que
// va incrustada aqui, generada desde ese mismo JSON.
// =========================================================

export const FALLBACK_COMPONENTS = {
 "version": 2,
 "phase": 2,
 "note": "Catálogo ampliado de la Fase 2. Marcas y modelos reales solo como datos descriptivos (nombre y especificaciones), sin logos oficiales. threads/boost/valores de ranuras son valores descriptivos aproximados de cada modelo.",
 "components": [
  {
   "id": "h610m",
   "name": "H610M Básica",
   "brand": "Genérica",
   "category": "board",
   "price": 80,
   "watts": 12,
   "unlockLevel": 1,
   "blurb": {
    "es": "LGA1700 · DDR4 · Micro-ATX · lo justo para oficina",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "H610M",
    "socket": "LGA1700",
    "ramType": "DDR4",
    "form": "mATX",
    "ramSlots": 4,
    "ramMaxGb": 128,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "LGA1700",
    "ramType": "DDR4"
   },
   "perf": {
    "features": 22
   }
  },
  {
   "id": "b660m",
   "name": "B660M DS3H",
   "brand": "Genérica",
   "category": "board",
   "price": 110,
   "watts": 14,
   "unlockLevel": 1,
   "blurb": {
    "es": "LGA1700 · DDR4 · Micro-ATX · sólida y económica",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B660",
    "socket": "LGA1700",
    "ramType": "DDR4",
    "form": "mATX",
    "ramSlots": 4,
    "ramMaxGb": 128,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "LGA1700",
    "ramType": "DDR4"
   },
   "perf": {
    "features": 31
   }
  },
  {
   "id": "a620m",
   "name": "A620M Económica",
   "brand": "Genérica",
   "category": "board",
   "price": 110,
   "watts": 12,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · Micro-ATX · entrada barata a Zen 4/5",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "A620",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "mATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 31
   }
  },
  {
   "id": "b550m",
   "name": "B550M Aorus Elite",
   "brand": "Genérica",
   "category": "board",
   "price": 115,
   "watts": 14,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM4 · DDR4 · Micro-ATX · clásica para Ryzen 5000",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B550",
    "socket": "AM4",
    "ramType": "DDR4",
    "form": "mATX",
    "ramSlots": 4,
    "ramMaxGb": 128,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "AM4",
    "ramType": "DDR4"
   },
   "perf": {
    "features": 32
   }
  },
  {
   "id": "b650m",
   "name": "B650M Gaming DDR5",
   "brand": "Genérica",
   "category": "board",
   "price": 170,
   "watts": 14,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · Micro-ATX · compacta y completa",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B650",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "mATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 47
   }
  },
  {
   "id": "b760",
   "name": "B760 Tomahawk WiFi",
   "brand": "Genérica",
   "category": "board",
   "price": 190,
   "watts": 16,
   "unlockLevel": 1,
   "blurb": {
    "es": "LGA1700 · DDR5 · ATX · WiFi 6E y buen VRM",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B760",
    "socket": "LGA1700",
    "ramType": "DDR5",
    "form": "ATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": true,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "LGA1700",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 53
   }
  },
  {
   "id": "b860m",
   "name": "B860M Ultra",
   "brand": "Genérica",
   "category": "board",
   "price": 200,
   "watts": 14,
   "unlockLevel": 1,
   "blurb": {
    "es": "LGA1851 · DDR5 · Micro-ATX · para Core Ultra",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B860",
    "socket": "LGA1851",
    "ramType": "DDR5",
    "form": "mATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "LGA1851",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 56
   }
  },
  {
   "id": "board-b650-atx",
   "name": "B650 Gaming Plus",
   "brand": "Genérica",
   "category": "board",
   "price": 210,
   "watts": 16,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · ATX · PCIe 5.0 lista para futuro",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B650",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "ATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": false,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 58
   }
  },
  {
   "id": "b850",
   "name": "B850 Aorus Elite",
   "brand": "Genérica",
   "category": "board",
   "price": 230,
   "watts": 16,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · ATX · pensada para Ryzen 9000",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B850",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "ATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": true,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 64
   }
  },
  {
   "id": "b650i",
   "name": "B650I Mini-ITX",
   "brand": "Genérica",
   "category": "board",
   "price": 260,
   "watts": 13,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · Mini-ITX · para gabinetes mini",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "B650",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "ITX",
    "ramSlots": 2,
    "ramMaxGb": 192,
    "m2Slots": 2,
    "sataPorts": 4,
    "wifi": true,
    "pcieGen": 4,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 72
   }
  },
  {
   "id": "z890",
   "name": "Z890 Maximus",
   "brand": "Genérica",
   "category": "board",
   "price": 320,
   "watts": 18,
   "unlockLevel": 1,
   "blurb": {
    "es": "LGA1851 · DDR5 · ATX · overclock y gama alta Intel",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "Z890",
    "socket": "LGA1851",
    "ramType": "DDR5",
    "form": "ATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": true,
    "pcieGen": 5,
    "tpm": true
   },
   "compat": {
    "socket": "LGA1851",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 89
   }
  },
  {
   "id": "x670e",
   "name": "X670E Master",
   "brand": "Genérica",
   "category": "board",
   "price": 330,
   "watts": 20,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · ATX · gama alta, puertos de sobra",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "X670E",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "ATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": true,
    "pcieGen": 5,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 92
   }
  },
  {
   "id": "x870e",
   "name": "X870E Hero",
   "brand": "Genérica",
   "category": "board",
   "price": 360,
   "watts": 20,
   "unlockLevel": 1,
   "blurb": {
    "es": "AM5 · DDR5 · ATX · USB4 y lo último de lo último",
    "en": "Motherboard: check socket and RAM type."
   },
   "specs": {
    "chipset": "X870E",
    "socket": "AM5",
    "ramType": "DDR5",
    "form": "ATX",
    "ramSlots": 4,
    "ramMaxGb": 192,
    "m2Slots": 3,
    "sataPorts": 4,
    "wifi": true,
    "pcieGen": 5,
    "tpm": true
   },
   "compat": {
    "socket": "AM5",
    "ramType": "DDR5"
   },
   "perf": {
    "features": 100
   }
  },
  {
   "id": "case-office",
   "name": "Gabinete Oficina Compacto",
   "brand": "Genérica",
   "category": "case",
   "price": 45,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Micro-ATX · sobrio · GPU máx 240 mm",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "mATX",
    "gpuMaxMm": 240,
    "coolerMaxMm": 150,
    "radiatorMaxMm": 240,
    "glassPanel": false,
    "airflow": 40,
    "rgb": false
   },
   "compat": {},
   "perf": {
    "cooling": 40
   }
  },
  {
   "id": "case-retro",
   "name": "Gabinete Retro Beige",
   "brand": "Genérica",
   "category": "case",
   "price": 60,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Estética años 90 · por dentro, respeto",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "mATX",
    "gpuMaxMm": 280,
    "coolerMaxMm": 150,
    "radiatorMaxMm": 240,
    "glassPanel": false,
    "airflow": 35,
    "rgb": false
   },
   "compat": {},
   "perf": {
    "cooling": 35
   }
  },
  {
   "id": "case-airflow-atx",
   "name": "Torre ATX Flujo de Aire",
   "brand": "Genérica",
   "category": "case",
   "price": 75,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Frente de malla · fresca y silenciosa",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ATX",
    "gpuMaxMm": 320,
    "coolerMaxMm": 175,
    "radiatorMaxMm": 360,
    "glassPanel": false,
    "airflow": 85,
    "rgb": false
   },
   "compat": {},
   "perf": {
    "cooling": 85
   }
  },
  {
   "id": "case-mini",
   "name": "Gabinete Mini-ITX Cube",
   "brand": "Genérica",
   "category": "case",
   "price": 85,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Mini-ITX · escritorio pequeño · GPU máx 200 mm",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ITX",
    "gpuMaxMm": 200,
    "coolerMaxMm": 130,
    "radiatorMaxMm": 240,
    "glassPanel": false,
    "airflow": 45,
    "rgb": false
   },
   "compat": {},
   "perf": {
    "cooling": 45
   }
  },
  {
   "id": "case-rgb",
   "name": "Torre Cristal RGB",
   "brand": "Genérica",
   "category": "case",
   "price": 110,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Cristal templado · 4 ventiladores RGB",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ATX",
    "gpuMaxMm": 340,
    "coolerMaxMm": 175,
    "radiatorMaxMm": 360,
    "glassPanel": true,
    "airflow": 60,
    "rgb": true
   },
   "compat": {},
   "perf": {
    "cooling": 60
   }
  },
  {
   "id": "case-bench",
   "name": "Banco de pruebas abierto",
   "brand": "Genérica",
   "category": "case",
   "price": 130,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Sin paredes: todo cabe y todo se enfría · el favorito del taller",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ATX",
    "gpuMaxMm": 999,
    "coolerMaxMm": 999,
    "radiatorMaxMm": 420,
    "glassPanel": false,
    "airflow": 100,
    "rgb": false
   },
   "compat": {},
   "perf": {
    "cooling": 100
   }
  },
  {
   "id": "case-ws",
   "name": "Torre Workstation XL",
   "brand": "Genérica",
   "category": "case",
   "price": 150,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Espacio de sobra y cero ruido",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ATX",
    "gpuMaxMm": 380,
    "coolerMaxMm": 175,
    "radiatorMaxMm": 360,
    "glassPanel": false,
    "airflow": 70,
    "rgb": false
   },
   "compat": {},
   "perf": {
    "cooling": 70
   }
  },
  {
   "id": "case-pano",
   "name": "Torre Panorámica Premium",
   "brand": "Genérica",
   "category": "case",
   "price": 170,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Cristal doble · cabe cualquier gráfica",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ATX",
    "gpuMaxMm": 400,
    "coolerMaxMm": 175,
    "radiatorMaxMm": 420,
    "glassPanel": true,
    "airflow": 75,
    "rgb": true
   },
   "compat": {},
   "perf": {
    "cooling": 75
   }
  },
  {
   "id": "case-420",
   "name": "Torre Cristal 420 XL",
   "brand": "Genérica",
   "category": "case",
   "price": 210,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Enorme y panorámica · radiadores de 420 mm y RTX 5090 sin sufrir",
    "en": "PC case for your build."
   },
   "specs": {
    "formMax": "ATX",
    "gpuMaxMm": 430,
    "coolerMaxMm": 175,
    "radiatorMaxMm": 420,
    "glassPanel": true,
    "airflow": 80,
    "rgb": true
   },
   "compat": {},
   "perf": {
    "cooling": 80
   }
  },
  {
   "id": "cool-stock",
   "name": "Disipador de serie",
   "brand": "Genérica",
   "category": "cooler",
   "price": 0,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "El que viene en la caja · cumple en CPUs frescos",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "air",
    "cooling": 45,
    "heightMm": 55,
    "radiatorMm": 0
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "AM4",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 45
   }
  },
  {
   "id": "cool-low",
   "name": "Perfil bajo para ITX",
   "brand": "Genérica",
   "category": "cooler",
   "price": 30,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "47 mm de alto · para gabinetes mini",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "air",
    "cooling": 55,
    "heightMm": 47,
    "radiatorMm": 0
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM4",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 55
   }
  },
  {
   "id": "cool-tower",
   "name": "Torre de aire 120 mm",
   "brand": "Genérica",
   "category": "cooler",
   "price": 35,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "El clásico confiable para 65-125W",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "air",
    "cooling": 75,
    "heightMm": 155,
    "radiatorMm": 0
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM4",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 75
   }
  },
  {
   "id": "cool-dual",
   "name": "Torre doble premium",
   "brand": "Genérica",
   "category": "cooler",
   "price": 55,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Doble ventilador · casi nivel líquida",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "air",
    "cooling": 90,
    "heightMm": 162,
    "radiatorMm": 0
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM4",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 90
   }
  },
  {
   "id": "cool-xl",
   "name": "Torre de aire doble XL",
   "brand": "Genérica",
   "category": "cooler",
   "price": 90,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "El rey del aire · rivaliza con líquidas de 360",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "air",
    "cooling": 97,
    "heightMm": 168,
    "radiatorMm": 0
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM4",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 97
   }
  },
  {
   "id": "cooler-aio240",
   "name": "Líquida AIO 240 mm",
   "brand": "Genérica",
   "category": "cooler",
   "price": 95,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Radiador 240 · silencio y temperaturas bajas",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "liquid",
    "cooling": 95,
    "heightMm": 55,
    "radiatorMm": 240
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM4",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 95
   }
  },
  {
   "id": "cool-360",
   "name": "Líquida AIO 360 RGB",
   "brand": "Genérica",
   "category": "cooler",
   "price": 140,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Radiador 360 RGB · ojo: no trae kit AM4",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "liquid",
    "cooling": 100,
    "heightMm": 55,
    "radiatorMm": 360
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 100
   }
  },
  {
   "id": "cool-420",
   "name": "Líquida AIO 420 RGB",
   "brand": "Genérica",
   "category": "cooler",
   "price": 180,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Radiador 420 · silencio absoluto para 170 W+",
    "en": "Cooling: keeps clocks and silence."
   },
   "specs": {
    "type": "liquid",
    "cooling": 100,
    "heightMm": 55,
    "radiatorMm": 420
   },
   "compat": {
    "sockets": [
     "LGA1700",
     "LGA1851",
     "AM5"
    ]
   },
   "perf": {
    "cooling": 100
   }
  },
  {
   "id": "i3-12100f",
   "name": "Intel Core i3-12100F",
   "brand": "Intel",
   "category": "cpu",
   "price": 95,
   "watts": 58,
   "unlockLevel": 1,
   "blurb": {
    "es": "4 núcleos · 4.3 GHz · ideal oficina y eSports ligeros",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1700",
    "cores": 4,
    "threads": 8,
    "boostGHz": 4.3,
    "tdp": 58,
    "igpu": false
   },
   "compat": {
    "socket": "LGA1700"
   },
   "perf": {
    "gaming": 48,
    "work": 42
   }
  },
  {
   "id": "r5-5600",
   "name": "AMD Ryzen 5 5600",
   "brand": "AMD",
   "category": "cpu",
   "price": 120,
   "watts": 65,
   "unlockLevel": 1,
   "blurb": {
    "es": "6 núcleos · 4.4 GHz · rey del presupuesto AM4",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM4",
    "cores": 6,
    "threads": 12,
    "boostGHz": 4.4,
    "tdp": 65,
    "igpu": false
   },
   "compat": {
    "socket": "AM4"
   },
   "perf": {
    "gaming": 60,
    "work": 55
   }
  },
  {
   "id": "cpu-12400f",
   "name": "Intel Core i5-12400F",
   "brand": "Intel",
   "category": "cpu",
   "price": 150,
   "watts": 65,
   "unlockLevel": 1,
   "blurb": {
    "es": "6 núcleos · 4.4 GHz · el equilibrio clásico",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1700",
    "cores": 6,
    "threads": 12,
    "boostGHz": 4.4,
    "tdp": 65,
    "igpu": false
   },
   "compat": {
    "socket": "LGA1700"
   },
   "perf": {
    "gaming": 62,
    "work": 58
   }
  },
  {
   "id": "r7-5700x3d",
   "name": "AMD Ryzen 7 5700X3D",
   "brand": "AMD",
   "category": "cpu",
   "price": 200,
   "watts": 105,
   "unlockLevel": 1,
   "blurb": {
    "es": "8 núcleos + 3D V-Cache · la gran despedida de AM4",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM4",
    "cores": 8,
    "threads": 16,
    "boostGHz": 4.1,
    "tdp": 105,
    "igpu": false
   },
   "compat": {
    "socket": "AM4"
   },
   "perf": {
    "gaming": 78,
    "work": 62
   }
  },
  {
   "id": "r5-7600",
   "name": "AMD Ryzen 5 7600",
   "brand": "AMD",
   "category": "cpu",
   "price": 210,
   "watts": 105,
   "unlockLevel": 1,
   "blurb": {
    "es": "6 núcleos Zen 4 · 5.1 GHz · plataforma AM5",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 6,
    "threads": 12,
    "boostGHz": 5.1,
    "tdp": 105,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 74,
    "work": 68
   }
  },
  {
   "id": "r5-9600x",
   "name": "AMD Ryzen 5 9600X",
   "brand": "AMD",
   "category": "cpu",
   "price": 260,
   "watts": 65,
   "unlockLevel": 1,
   "blurb": {
    "es": "6 núcleos Zen 5 · fresco y rapidísimo en juegos",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 6,
    "threads": 12,
    "boostGHz": 5.4,
    "tdp": 65,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 82,
    "work": 78
   }
  },
  {
   "id": "i5-13600k",
   "name": "Intel Core i5-13600K",
   "brand": "Intel",
   "category": "cpu",
   "price": 290,
   "watts": 125,
   "unlockLevel": 1,
   "blurb": {
    "es": "14 núcleos (6P+8E) · 5.1 GHz · gamer y creador",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1700",
    "cores": 14,
    "threads": 20,
    "boostGHz": 5.1,
    "tdp": 125,
    "igpu": true
   },
   "compat": {
    "socket": "LGA1700"
   },
   "perf": {
    "gaming": 80,
    "work": 78
   }
  },
  {
   "id": "u5-245k",
   "name": "Intel Core Ultra 5 245K",
   "brand": "Intel",
   "category": "cpu",
   "price": 310,
   "watts": 125,
   "unlockLevel": 1,
   "blurb": {
    "es": "14 núcleos Arrow Lake · nuevo socket LGA1851",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1851",
    "cores": 14,
    "threads": 14,
    "boostGHz": 5.2,
    "tdp": 125,
    "igpu": true
   },
   "compat": {
    "socket": "LGA1851"
   },
   "perf": {
    "gaming": 78,
    "work": 80
   }
  },
  {
   "id": "r7-9700x",
   "name": "AMD Ryzen 7 9700X",
   "brand": "AMD",
   "category": "cpu",
   "price": 330,
   "watts": 65,
   "unlockLevel": 1,
   "blurb": {
    "es": "8 núcleos Zen 5 · eficiencia de otro nivel",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 8,
    "threads": 16,
    "boostGHz": 5.5,
    "tdp": 65,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 86,
    "work": 84
   }
  },
  {
   "id": "cpu-7800x3d",
   "name": "AMD Ryzen 7 7800X3D",
   "brand": "AMD",
   "category": "cpu",
   "price": 380,
   "watts": 120,
   "unlockLevel": 1,
   "blurb": {
    "es": "8 núcleos + 3D V-Cache · el favorito para jugar",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 8,
    "threads": 16,
    "boostGHz": 5,
    "tdp": 120,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 97,
    "work": 76
   }
  },
  {
   "id": "u7-265k",
   "name": "Intel Core Ultra 7 265K",
   "brand": "Intel",
   "category": "cpu",
   "price": 390,
   "watts": 125,
   "unlockLevel": 1,
   "blurb": {
    "es": "20 núcleos · gran salto en multitarea",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1851",
    "cores": 20,
    "threads": 20,
    "boostGHz": 5.5,
    "tdp": 125,
    "igpu": true
   },
   "compat": {
    "socket": "LGA1851"
   },
   "perf": {
    "gaming": 85,
    "work": 90
   }
  },
  {
   "id": "i7-14700k",
   "name": "Intel Core i7-14700K",
   "brand": "Intel",
   "category": "cpu",
   "price": 410,
   "watts": 125,
   "unlockLevel": 2,
   "blurb": {
    "es": "20 núcleos (8P+12E) · 5.6 GHz · tope Intel",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1700",
    "cores": 20,
    "threads": 28,
    "boostGHz": 5.6,
    "tdp": 125,
    "igpu": true
   },
   "compat": {
    "socket": "LGA1700"
   },
   "perf": {
    "gaming": 88,
    "work": 92
   }
  },
  {
   "id": "r7-9800x3d",
   "name": "AMD Ryzen 7 9800X3D",
   "brand": "AMD",
   "category": "cpu",
   "price": 480,
   "watts": 120,
   "unlockLevel": 2,
   "blurb": {
    "es": "El rey actual del gaming · 3D V-Cache de 2ª gen",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 8,
    "threads": 16,
    "boostGHz": 5.2,
    "tdp": 120,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 100,
    "work": 82
   }
  },
  {
   "id": "r9-7950x",
   "name": "AMD Ryzen 9 7950X",
   "brand": "AMD",
   "category": "cpu",
   "price": 520,
   "watts": 170,
   "unlockLevel": 2,
   "blurb": {
    "es": "16 núcleos Zen 4 · render y compilación extrema",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 16,
    "threads": 32,
    "boostGHz": 5.7,
    "tdp": 170,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 90,
    "work": 99
   }
  },
  {
   "id": "r9-9950x",
   "name": "AMD Ryzen 9 9950X",
   "brand": "AMD",
   "category": "cpu",
   "price": 550,
   "watts": 170,
   "unlockLevel": 2,
   "blurb": {
    "es": "16 núcleos Zen 5 · lo máximo de AMD en escritorio",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "AM5",
    "cores": 16,
    "threads": 32,
    "boostGHz": 5.7,
    "tdp": 170,
    "igpu": true
   },
   "compat": {
    "socket": "AM5"
   },
   "perf": {
    "gaming": 94,
    "work": 100
   }
  },
  {
   "id": "u9-285k",
   "name": "Intel Core Ultra 9 285K",
   "brand": "Intel",
   "category": "cpu",
   "price": 590,
   "watts": 125,
   "unlockLevel": 2,
   "blurb": {
    "es": "24 núcleos · el tope de Intel hoy",
    "en": "Processor: the socket rules everything."
   },
   "specs": {
    "socket": "LGA1851",
    "cores": 24,
    "threads": 24,
    "boostGHz": 5.7,
    "tdp": 125,
    "igpu": true
   },
   "compat": {
    "socket": "LGA1851"
   },
   "perf": {
    "gaming": 90,
    "work": 98
   }
  },
  {
   "id": "gpu-none",
   "name": "Sin gráfica dedicada (integrada)",
   "brand": "Genérica",
   "category": "gpu",
   "price": 0,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Usa la gráfica integrada del procesador (si tiene)",
    "en": "Use the CPU integrated graphics, if it has any."
   },
   "specs": {
    "vramGb": 0,
    "lenMm": 0,
    "slots": 2,
    "powerNeed": "none",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 8,
    "work": 10,
    "fps": 8
   }
  },
  {
   "id": "gtx1650",
   "name": "GTX 1650 4 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 150,
   "watts": 75,
   "unlockLevel": 1,
   "blurb": {
    "es": "1080p en juegos ligeros · no pide conector extra",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 4,
    "lenMm": 229,
    "slots": 2,
    "powerNeed": "none",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 35,
    "work": 30,
    "fps": 35
   }
  },
  {
   "id": "arc-b580",
   "name": "Intel Arc B580 12 GB",
   "brand": "Intel",
   "category": "gpu",
   "price": 250,
   "watts": 190,
   "unlockLevel": 1,
   "blurb": {
    "es": "La sorpresa de Intel · 1440p a precio de 1080p",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 12,
    "lenMm": 272,
    "slots": 2,
    "powerNeed": "8pin",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 58,
    "work": 50,
    "fps": 58
   }
  },
  {
   "id": "gpu-rtx4060",
   "name": "RTX 4060 8 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 300,
   "watts": 115,
   "unlockLevel": 1,
   "blurb": {
    "es": "1080p alto / 1440p medio · DLSS 3 · muy eficiente",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 8,
    "lenMm": 240,
    "slots": 2,
    "powerNeed": "8pin",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 66,
    "work": 55,
    "fps": 66
   }
  },
  {
   "id": "rtx4060ti",
   "name": "RTX 4060 Ti 16 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 450,
   "watts": 165,
   "unlockLevel": 2,
   "blurb": {
    "es": "1440p cómodo · 16 GB para texturas y creación",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 16,
    "lenMm": 245,
    "slots": 2,
    "powerNeed": "8pin",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 74,
    "work": 66,
    "fps": 74
   }
  },
  {
   "id": "rx7800xt",
   "name": "RX 7800 XT 16 GB",
   "brand": "AMD",
   "category": "gpu",
   "price": 500,
   "watts": 263,
   "unlockLevel": 2,
   "blurb": {
    "es": "1440p ultra · mucha VRAM por el precio",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 16,
    "lenMm": 287,
    "slots": 2,
    "powerNeed": "8pin2",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 82,
    "work": 68,
    "fps": 82
   }
  },
  {
   "id": "rx9070",
   "name": "RX 9070 16 GB",
   "brand": "AMD",
   "category": "gpu",
   "price": 550,
   "watts": 220,
   "unlockLevel": 2,
   "blurb": {
    "es": "RDNA 4 · 1440p ultra con FSR 4",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 16,
    "lenMm": 240,
    "slots": 2,
    "powerNeed": "8pin2",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 86,
    "work": 70,
    "fps": 88
   }
  },
  {
   "id": "rtx5070",
   "name": "RTX 5070 12 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 550,
   "watts": 250,
   "unlockLevel": 2,
   "blurb": {
    "es": "Blackwell · DLSS 4 con Multi Frame Generation",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 12,
    "lenMm": 251,
    "slots": 2,
    "powerNeed": "12v",
    "pcieGen": 5
   },
   "compat": {},
   "perf": {
    "gaming": 88,
    "work": 84,
    "fps": 92
   }
  },
  {
   "id": "rtx4070s",
   "name": "RTX 4070 Super 12 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 590,
   "watts": 220,
   "unlockLevel": 2,
   "blurb": {
    "es": "1440p ultra / 4K medio · DLSS 3.5",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 12,
    "lenMm": 267,
    "slots": 2,
    "powerNeed": "12v",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 86,
    "work": 80,
    "fps": 86
   }
  },
  {
   "id": "rx9070xt",
   "name": "RX 9070 XT 16 GB",
   "brand": "AMD",
   "category": "gpu",
   "price": 600,
   "watts": 304,
   "unlockLevel": 2,
   "blurb": {
    "es": "RDNA 4 · pelea con gráficas que cuestan el doble",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 16,
    "lenMm": 267,
    "slots": 2,
    "powerNeed": "8pin2",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 91,
    "work": 74,
    "fps": 96
   }
  },
  {
   "id": "rtx5070ti",
   "name": "RTX 5070 Ti 16 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 750,
   "watts": 300,
   "unlockLevel": 2,
   "blurb": {
    "es": "1440p ultra / 4K con DLSS 4 · 16 GB",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 16,
    "lenMm": 306,
    "slots": 2.5,
    "powerNeed": "12v",
    "pcieGen": 5
   },
   "compat": {},
   "perf": {
    "gaming": 93,
    "work": 90,
    "fps": 101
   }
  },
  {
   "id": "rtx5080",
   "name": "RTX 5080 16 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 1000,
   "watts": 360,
   "unlockLevel": 3,
   "blurb": {
    "es": "4K alto sin despeinarse · Blackwell gama alta",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 16,
    "lenMm": 304,
    "slots": 2.5,
    "powerNeed": "12v",
    "pcieGen": 5
   },
   "compat": {},
   "perf": {
    "gaming": 97,
    "work": 95,
    "fps": 109
   }
  },
  {
   "id": "gpu-rtx4090",
   "name": "RTX 4090 24 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 1600,
   "watts": 450,
   "unlockLevel": 3,
   "blurb": {
    "es": "4K ultra sin discusión · enorme: mide tu gabinete",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 24,
    "lenMm": 336,
    "slots": 3.5,
    "powerNeed": "12v",
    "pcieGen": 4
   },
   "compat": {},
   "perf": {
    "gaming": 100,
    "work": 100,
    "fps": 100
   }
  },
  {
   "id": "rtx5090",
   "name": "RTX 5090 32 GB",
   "brand": "NVIDIA",
   "category": "gpu",
   "price": 2000,
   "watts": 575,
   "unlockLevel": 3,
   "blurb": {
    "es": "La gráfica más potente del planeta · 32 GB GDDR7 · traga 575 W",
    "en": "Graphics card: mind length and power."
   },
   "specs": {
    "vramGb": 32,
    "lenMm": 357,
    "slots": 3.5,
    "powerNeed": "12v",
    "pcieGen": 5
   },
   "compat": {},
   "perf": {
    "gaming": 100,
    "work": 100,
    "fps": 120
   }
  },
  {
   "id": "psu-350-bronze",
   "name": "Fuente 350 W 80+ Bronze",
   "brand": "Genérica",
   "category": "psu",
   "price": 35,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "De oficina antigua: se queda corta con una gráfica dedicada.",
    "en": "An old office unit: not enough with a dedicated GPU."
   },
   "specs": {
    "wattsOut": 350,
    "cert": "80+ Bronze",
    "standard": "ATX 2.x",
    "pcie8": 1,
    "has12v": false
   },
   "compat": {},
   "perf": {
    "score": 29
   }
  },
  {
   "id": "psu450",
   "name": "Fuente 450W Bronze",
   "brand": "Genérica",
   "category": "psu",
   "price": 45,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Equipos de oficina y gama de entrada",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 450,
    "cert": "80+ Bronze",
    "standard": "ATX 2.x",
    "pcie8": 1,
    "has12v": false
   },
   "compat": {},
   "perf": {
    "score": 38
   }
  },
  {
   "id": "psu550",
   "name": "Fuente 550W Bronze",
   "brand": "Genérica",
   "category": "psu",
   "price": 60,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Para gráficas de consumo moderado",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 550,
    "cert": "80+ Bronze",
    "standard": "ATX 2.x",
    "pcie8": 2,
    "has12v": false
   },
   "compat": {},
   "perf": {
    "score": 46
   }
  },
  {
   "id": "psu650",
   "name": "Fuente 650W Gold",
   "brand": "Genérica",
   "category": "psu",
   "price": 85,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "El punto dulce gamer",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 650,
    "cert": "80+ Gold",
    "standard": "ATX 2.x",
    "pcie8": 2,
    "has12v": false
   },
   "compat": {},
   "perf": {
    "score": 54
   }
  },
  {
   "id": "psu-750-gold",
   "name": "Fuente 750W Gold",
   "brand": "Genérica",
   "category": "psu",
   "price": 105,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Gama alta con margen de sobra",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 750,
    "cert": "80+ Gold",
    "standard": "ATX 3.0",
    "pcie8": 3,
    "has12v": true
   },
   "compat": {},
   "perf": {
    "score": 63
   }
  },
  {
   "id": "psu850g",
   "name": "Fuente 850W Gold ATX 3.1",
   "brand": "Genérica",
   "category": "psu",
   "price": 115,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Conector 12V-2x6 listo para RTX serie 50",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 850,
    "cert": "80+ Gold",
    "standard": "ATX 3.1",
    "pcie8": 3,
    "has12v": true
   },
   "compat": {},
   "perf": {
    "score": 71
   }
  },
  {
   "id": "psu850",
   "name": "Fuente 850W Platinum",
   "brand": "Genérica",
   "category": "psu",
   "price": 140,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "Silenciosa y eficiente para builds serios",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 850,
    "cert": "80+ Platinum",
    "standard": "ATX 2.x",
    "pcie8": 3,
    "has12v": false
   },
   "compat": {},
   "perf": {
    "score": 71
   }
  },
  {
   "id": "psu1000",
   "name": "Fuente 1000W Platinum",
   "brand": "Genérica",
   "category": "psu",
   "price": 180,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "RTX 4090 y workstations sin pestañear",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 1000,
    "cert": "80+ Platinum",
    "standard": "ATX 3.1",
    "pcie8": 4,
    "has12v": true
   },
   "compat": {},
   "perf": {
    "score": 83
   }
  },
  {
   "id": "psu1200",
   "name": "Fuente 1200W Platinum ATX 3.1",
   "brand": "Genérica",
   "category": "psu",
   "price": 220,
   "watts": 0,
   "unlockLevel": 1,
   "blurb": {
    "es": "RTX 5090 y builds extremos · sobra por todos lados",
    "en": "Power supply: never cheap out here."
   },
   "specs": {
    "wattsOut": 1200,
    "cert": "80+ Platinum",
    "standard": "ATX 3.1",
    "pcie8": 4,
    "has12v": true
   },
   "compat": {},
   "perf": {
    "score": 100
   }
  },
  {
   "id": "ram8d4",
   "name": "8 GB DDR4 3200",
   "brand": "Genérica",
   "category": "ram",
   "price": 25,
   "watts": 3,
   "unlockLevel": 1,
   "blurb": {
    "es": "1 módulo · oficina y tareas básicas",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR4",
    "gb": 8,
    "modules": 2,
    "speed": 3200,
    "cl": 16,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR4"
   },
   "perf": {
    "score": 30
   }
  },
  {
   "id": "ram8d5",
   "name": "8 GB DDR5 5200",
   "brand": "Genérica",
   "category": "ram",
   "price": 30,
   "watts": 3,
   "unlockLevel": 1,
   "blurb": {
    "es": "1 módulo DDR5 · solo si el presupuesto grita",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 8,
    "modules": 2,
    "speed": 5200,
    "cl": 36,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 45
   }
  },
  {
   "id": "ram-16-ddr4",
   "name": "16 GB DDR4 3600",
   "brand": "Genérica",
   "category": "ram",
   "price": 45,
   "watts": 4,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×8 GB · el mínimo cómodo para jugar",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR4",
    "gb": 16,
    "modules": 2,
    "speed": 3600,
    "cl": 16,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR4"
   },
   "perf": {
    "score": 55
   }
  },
  {
   "id": "ram16d5",
   "name": "16 GB DDR5 5600",
   "brand": "Genérica",
   "category": "ram",
   "price": 55,
   "watts": 4,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×8 GB DDR5 · entrada a la nueva generación",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 16,
    "modules": 2,
    "speed": 5600,
    "cl": 36,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 62
   }
  },
  {
   "id": "ram16d5r",
   "name": "16 GB DDR5 6000 RGB",
   "brand": "Genérica",
   "category": "ram",
   "price": 70,
   "watts": 5,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×8 GB DDR5 RGB · bonita y rápida",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 16,
    "modules": 2,
    "speed": 6000,
    "cl": 30,
    "rgb": true
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 70
   }
  },
  {
   "id": "ram32d4",
   "name": "32 GB DDR4 3600",
   "brand": "Genérica",
   "category": "ram",
   "price": 85,
   "watts": 5,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×16 GB · multitarea y edición sin ahogos",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR4",
    "gb": 32,
    "modules": 2,
    "speed": 3600,
    "cl": 16,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR4"
   },
   "perf": {
    "score": 72
   }
  },
  {
   "id": "ram-32-ddr5",
   "name": "32 GB DDR5 6000 RGB",
   "brand": "Genérica",
   "category": "ram",
   "price": 115,
   "watts": 6,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×16 GB DDR5 · RGB · dulce para AM5 y gaming",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 32,
    "modules": 2,
    "speed": 6000,
    "cl": 30,
    "rgb": true
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 84
   }
  },
  {
   "id": "ram48d5",
   "name": "48 GB DDR5 6400 RGB",
   "brand": "Genérica",
   "category": "ram",
   "price": 160,
   "watts": 7,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×24 GB · el punto raro y dulce de los creadores",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 48,
    "modules": 2,
    "speed": 6400,
    "cl": 30,
    "rgb": true
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 90
   }
  },
  {
   "id": "ram64d5",
   "name": "64 GB DDR5 6000",
   "brand": "Genérica",
   "category": "ram",
   "price": 210,
   "watts": 8,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×32 GB · workstations, máquinas virtuales, IA local",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 64,
    "modules": 2,
    "speed": 6000,
    "cl": 30,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 96
   }
  },
  {
   "id": "ram96d5",
   "name": "96 GB DDR5 5600",
   "brand": "Genérica",
   "category": "ram",
   "price": 320,
   "watts": 9,
   "unlockLevel": 1,
   "blurb": {
    "es": "2×48 GB · IA local y datasets sin tocar el disco",
    "en": "Memory kit: type and speed matter."
   },
   "specs": {
    "type": "DDR5",
    "gb": 96,
    "modules": 2,
    "speed": 5600,
    "cl": 36,
    "rgb": false
   },
   "compat": {
    "ramType": "DDR5"
   },
   "perf": {
    "score": 100
   }
  },
  {
   "id": "hdd1",
   "name": "Disco duro 1 TB",
   "brand": "Genérica",
   "category": "storage",
   "price": 40,
   "watts": 8,
   "unlockLevel": 1,
   "blurb": {
    "es": "Mecánico · barato por TB, lento para arrancar",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "HDD",
    "gb": 1000,
    "interface": "SATA (mecánico)",
    "mount": "Bahía 3.5/2.5\"",
    "readMBs": 160
   },
   "compat": {},
   "perf": {
    "score": 15
   }
  },
  {
   "id": "sata500",
   "name": "SSD SATA 500 GB",
   "brand": "Genérica",
   "category": "storage",
   "price": 45,
   "watts": 3,
   "unlockLevel": 1,
   "blurb": {
    "es": "Un salto enorme frente al disco duro",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "SATA",
    "gb": 500,
    "interface": "SATA III",
    "mount": "Bahía 3.5/2.5\"",
    "readMBs": 550
   },
   "compat": {},
   "perf": {
    "score": 40
   }
  },
  {
   "id": "nvme500",
   "name": "NVMe 500 GB Gen3",
   "brand": "Genérica",
   "category": "storage",
   "price": 50,
   "watts": 4,
   "unlockLevel": 1,
   "blurb": {
    "es": "3.500 MB/s · Windows vuela al encender",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "NVMe",
    "gb": 500,
    "interface": "NVMe PCIe 3.0",
    "mount": "M.2",
    "readMBs": 3500
   },
   "compat": {},
   "perf": {
    "score": 58
   }
  },
  {
   "id": "storage-nvme-1tb",
   "name": "NVMe 1 TB Gen4",
   "brand": "Genérica",
   "category": "storage",
   "price": 85,
   "watts": 5,
   "unlockLevel": 1,
   "blurb": {
    "es": "7.000 MB/s · el favorito gamer",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "NVMe",
    "gb": 1000,
    "interface": "NVMe PCIe 4.0",
    "mount": "M.2",
    "readMBs": 7000
   },
   "compat": {},
   "perf": {
    "score": 78
   }
  },
  {
   "id": "sata2",
   "name": "SSD SATA 2 TB",
   "brand": "Genérica",
   "category": "storage",
   "price": 110,
   "watts": 3,
   "unlockLevel": 1,
   "blurb": {
    "es": "Barato por TB para la biblioteca completa",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "SATA",
    "gb": 2000,
    "interface": "SATA III",
    "mount": "Bahía 3.5/2.5\"",
    "readMBs": 550
   },
   "compat": {},
   "perf": {
    "score": 48
   }
  },
  {
   "id": "nvme2",
   "name": "NVMe 2 TB Gen4",
   "brand": "Genérica",
   "category": "storage",
   "price": 150,
   "watts": 5,
   "unlockLevel": 1,
   "blurb": {
    "es": "Espacio para toda la biblioteca de juegos",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "NVMe",
    "gb": 2000,
    "interface": "NVMe PCIe 4.0",
    "mount": "M.2",
    "readMBs": 7400
   },
   "compat": {},
   "perf": {
    "score": 88
   }
  },
  {
   "id": "nvme2g5",
   "name": "NVMe 2 TB Gen5",
   "brand": "Genérica",
   "category": "storage",
   "price": 230,
   "watts": 8,
   "unlockLevel": 1,
   "blurb": {
    "es": "12.000 MB/s · lo más rápido del catálogo",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "NVMe",
    "gb": 2000,
    "interface": "NVMe PCIe 5.0",
    "mount": "M.2",
    "readMBs": 14000
   },
   "compat": {},
   "perf": {
    "score": 100
   }
  },
  {
   "id": "nvme4",
   "name": "NVMe 4 TB Gen4",
   "brand": "Genérica",
   "category": "storage",
   "price": 260,
   "watts": 6,
   "unlockLevel": 1,
   "blurb": {
    "es": "4 TB veloces · juegos + proyectos sin borrar nada",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "NVMe",
    "gb": 4000,
    "interface": "NVMe PCIe 4.0",
    "mount": "M.2",
    "readMBs": 7400
   },
   "compat": {},
   "perf": {
    "score": 92
   }
  },
  {
   "id": "nvme4g5",
   "name": "NVMe 4 TB Gen5",
   "brand": "Genérica",
   "category": "storage",
   "price": 380,
   "watts": 9,
   "unlockLevel": 1,
   "blurb": {
    "es": "14.000 MB/s · el techo actual del almacenamiento",
    "en": "Storage drive for the system and games."
   },
   "specs": {
    "kind": "NVMe",
    "gb": 4000,
    "interface": "NVMe PCIe 5.0",
    "mount": "M.2",
    "readMBs": 14000
   },
   "compat": {},
   "perf": {
    "score": 100
   }
  }
 ]
}
;

export async function loadComponents() {
  try {
    const r = await fetch(new URL('../data/components.json', import.meta.url), { cache: 'no-cache' });
    if (!r.ok) throw new Error('http ' + r.status);
    const j = await r.json();
    if (Array.isArray(j.components) && j.components.length) return j.components;
    throw new Error('json vacio');
  } catch (e) {
    return FALLBACK_COMPONENTS;
  }
}
