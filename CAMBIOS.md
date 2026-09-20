# Cambios de esta tanda

## Qué es el sitio ahora

Seis estaciones repartidas en cinco páginas:

    index.html         carátula → estación 01 → clave SELVA → MEDIO
    estacion-03.html   clave MIRADA
    estacion-04.html   clave NATURALEZA
    estacion-05.html   clave SER
    estacion-06.html   clave SENTIDO

Cada estación es una sola columna con scroll. Al final de cada una hay un
botón que lleva a la siguiente y la tira de "Tus huellas", que muestra
solo las estaciones ya descubiertas.

## mecanica.js ya no existe

Ese script existía porque la versión vieja no dibujaba el campo de la
clave: la puerta la ponía él por encima. Ahora cada página trae su propia
puerta, así que el script pintaba una segunda. Lo borré del repo.

Lo que sí hacía falta conservar era su memoria. Ahora cada página guarda
su puerta al abrirse:

    localStorage['selva-puerta-3'] = '1'

y al cargar, si ya está marcada, entra directo sin pedir la clave. Así
volver desde la 06 a la 03 no vuelve a pedir MIRADA.

Para MEDIO, que vive dentro de index.html, las huellas usan anclas:

    index.html#selva   entra en la estación 01
    index.html#medio   entra en MEDIO (si ya se abrió esa puerta)

## Imágenes

Las ilustraciones nuevas ya están convertidas en assets/:

    merian-5, merian-6     estación 03
    merian-7, merian-8     estación 04
    merian-9, merian-10    estación 05
    merian-11, merian-12   estación 06
    cuadro-rothko          el cuadro dentro de la estación 03

Vienen de PNG de 12-14 MB cada uno; quedaron en webp de 1400 px y
440-650 KB. merian-1 a merian-4 son las que ya estaban.

## Qué subir

Todo el contenido de esta carpeta a la raíz del repo. Borrar del repo el
mecanica.js que quedó de la tanda anterior.

## Claves

    02 → SELVA
    03 → MIRADA
    04 → NATURALEZA
    05 → SER
    06 → SENTIDO

Se validan en el navegador: son un candado narrativo, no seguridad.

## Canciones

Cada estación enlaza a su track en Spotify:

    01  Guitarra — Madredeus
    02  Such a Woman (Live) — Neil Young
    03  Perfect Day — Lou Reed
    04  Harvest Moon — Neil Young
    05  Contigo — Fito Páez (con Joaquín Sabina)
    06  Feels Like Rain — John Hiatt
