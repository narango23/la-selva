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

El diseño ahora expone dos cosas:

    window.PUERTA_ACTUAL   // qué puerta le toca a esta página
    window.abrirPuerta(n)  // cruzarla, sin tocar el DOM del runtime

`mecanica.js` las usa si están disponibles y, si no, cae a la flecha de
siempre. `PUERTA_ACTUAL` es lo que evita que una página ofrezca la clave
de otra estación cuando la suya ya quedó abierta en el teléfono.

`publicar.sh`: se quitó el `sed` que borraba el candado interno
(`if (n > 5 && !s.unlocked)`). Esa línea ya no está en el export, así
que el paso 3 quedaba sin efecto. Los otros tres pasos siguen igual.

## Archivos de esta carpeta

    index.html                              ya pasado por publicar.sh — reemplaza el actual
    mecanica.js                             reemplaza el actual
    publicar.sh                             reemplaza el actual
    export/Estaciones 01-02 paginada.dc.html

## Claves

    Estación 02 → SELVA

La estación 03 existe en Claude Design pero todavía no está en el sitio.
Se agrega cuando su contenido esté listo: su puerta, su página y sus dos
ilustraciones en webp entran en esa misma tanda.
