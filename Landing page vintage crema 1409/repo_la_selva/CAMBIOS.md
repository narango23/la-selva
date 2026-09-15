# Cambios de esta tanda

Generado desde Claude Design el 2026-09-15.

## Qué cambió en el diseño

La pieza dejó de avanzar por páginas con flechas. Ahora es:

  carátula "La Selva" → estación 01 en scroll → puerta de la clave → MEDIO en scroll

Los botones "Explora ahora" y "Sigue explorando" hacen la navegación.
Ya no existen los botones ← → ni los puntos de progreso.

Además: textos nuevos en las dos estaciones, canciones de Madredeus y
Neil Young con su enlace, bloque Dónde/Cuándo con la dirección real,
y pastillas de "estaciones descubiertas" al pie de cada una.

## Qué hubo que tocar en la mecánica

`mecanica.js` cruzaba la puerta haciendo clic en la flecha "→". Esa
flecha ya no existe, así que el salto se quedaba sin efecto.

El diseño ahora expone un puente:

    window.abrirPuerta(2)   // abre MEDIO en index.html
    window.abrirPuerta(3)   // abre la estación 03 en su página

`mecanica.js` lo usa si está disponible y, si no, cae a la flecha de
siempre. No toca el DOM del runtime, igual que antes.

`publicar.sh`: se quitó el `sed` que borraba el candado interno
(`if (n > 5 && !s.unlocked)`). Esa línea ya no está en el export, así
que el paso 3 quedaba sin efecto. Los otros tres pasos siguen igual.

## Archivos de esta carpeta

    index.html                              ya pasado por publicar.sh — reemplaza el actual
    mecanica.js                             reemplaza el actual
    publicar.sh                             reemplaza el actual
    export/Estaciones 01-02 paginada.dc.html
    export/Estacion 03.dc.html              nueva página, con su propia puerta

## Pendiente antes de publicar la estación 03

Faltan sus dos ilustraciones en webp. Desde los PNG originales:

    ffmpeg -i "HTC_Heritage Library_Nature by Merian 03Element 1.png" \
      -vf "scale=1400:-1:flags=lanczos" -c:v libwebp -pix_fmt yuva420p \
      -quality 82 -compression_level 6 assets/merian-5.webp

    ffmpeg -i "HTC_Heritage Library_Nature by Merian 03Element 2.png" \
      -vf "scale=1400:-1:flags=lanczos" -c:v libwebp -pix_fmt yuva420p \
      -quality 82 -compression_level 6 assets/merian-6.webp

Después hay que correr publicar.sh sobre el export de la 03 (agregándole
al script el mapeo de esos dos nombres) y subirla como `estacion-03.html`.
La puerta 3 ya está declarada en `mecanica.js` con la clave MIRADA.

## Claves

    Estación 02 → SELVA
    Estación 03 → MIRADA
