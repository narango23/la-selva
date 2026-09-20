#!/usr/bin/env bash
# Publica La Selva: convierte los .dc.html del proyecto de diseño en las
# páginas del sitio. Tres pasos por archivo:
#
#   1. Cambia las rutas de las ilustraciones (PNG pesados) por los webp
#      de assets/.
#   2. Cambia los nombres de archivo de diseño por los del sitio.
#   3. Cambia 100vh por 100dvh, para que la barra del navegador móvil
#      no corte la primera pantalla.
#
# Uso:  ./publicar.sh /ruta/a/la/carpeta/de/diseño
set -euo pipefail

ORIGEN="${1:?Pasá la carpeta con los .dc.html}"

publicar() {
  local entrada="$ORIGEN/$1"
  local salida="$2"

  sed \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2006Element%202\.png|assets/merian-2.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2006Element%201\.png|assets/merian-1.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2004Element%201\.png|assets/merian-3.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2004Element%203\.png|assets/merian-4.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2003Element%201\.png|assets/merian-5.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2003Element%202\.png|assets/merian-6.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20MerianElement%201\.png|assets/merian-7.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20MerianElement%203\.png|assets/merian-8.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2002Element%202\.png|assets/merian-9.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2002Element%203\.png|assets/merian-10.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2005Element%202\.png|assets/merian-11.webp|g' \
    -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2005Element%203\.png|assets/merian-12.webp|g' \
    -e 's|uploads/pasted-1789529252715-0\.png|assets/cuadro-rothko.webp|g' \
    -e 's|Estaciones 01-02 paginada\.dc\.html|index.html|g' \
    -e 's|Estacion 03\.dc\.html|estacion-03.html|g' \
    -e 's|Estacion 04\.dc\.html|estacion-04.html|g' \
    -e 's|Estacion 05\.dc\.html|estacion-05.html|g' \
    -e 's|Estacion 06\.dc\.html|estacion-06.html|g' \
    -e 's|100vh|100dvh|g' \
    "$entrada" > "$salida"

  local sobran
  sobran=$(grep -c 'uploads/' "$salida" || true)
  echo "  $salida — imágenes sin convertir: $sobran (debe decir 0)"
}

publicar "Estaciones 01-02 paginada.dc.html" index.html
publicar "Estacion 03.dc.html"               estacion-03.html
publicar "Estacion 04.dc.html"               estacion-04.html
publicar "Estacion 05.dc.html"               estacion-05.html
publicar "Estacion 06.dc.html"               estacion-06.html

cp "$ORIGEN/support.js" support.js
echo "Listo."
