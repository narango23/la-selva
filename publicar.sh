#!/usr/bin/env bash
# ============================================================
# LA SELVA — preparar un export de Claude Design para publicar
# ------------------------------------------------------------
# Uso:   ./publicar.sh "ruta/del/Estaciones 01-02 paginada.dc.html"
#
# Toma el archivo tal como sale de Claude Design y le hace los
# cuatro ajustes que necesita para funcionar en la web:
#
#   1. Apunta las ilustraciones a las versiones livianas (webp).
#   2. Cambia 100vh por 100dvh, o la barra del navegador del
#      celular tapa los botones de abajo.
#   3. Quita el candado interno del runtime, que no sirve porque
#      su campo de texto no se dibuja. La cerradura de verdad la
#      pone mecanica.js.
#   4. Engancha mecanica.js al final de la página.
#
# Cada vez que exportes de nuevo desde Claude Design, corre esto
# y vuelve a subir. La dirección del sitio no cambia.
# ============================================================
set -euo pipefail

ORIGEN="${1:-}"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESTINO="$AQUI/index.html"

if [ -z "$ORIGEN" ] || [ ! -f "$ORIGEN" ]; then
  echo "Falta el archivo .dc.html exportado de Claude Design."
  echo "Uso: ./publicar.sh \"ruta/del/archivo.dc.html\""
  exit 1
fi

sed \
  -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2006Element%202\.png|assets/merian-2.webp|g' \
  -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2006Element%201\.png|assets/merian-1.webp|g' \
  -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2004Element%201\.png|assets/merian-3.webp|g' \
  -e 's|uploads/HTC_Heritage%20Library_Nature%20by%20Merian%2004Element%203\.png|assets/merian-4.webp|g' \
  -e 's|100vh|100dvh|g' \
  -e '/if (n > 5 \&\& !s.unlocked) n = 5;/d' \
  -e 's|</body>|<script src="mecanica.js"></script>\n</body>|' \
  "$ORIGEN" > "$DESTINO"

echo "index.html generado."
echo "  imágenes pesadas sin convertir: $(grep -c 'uploads/' "$DESTINO" || true)  (debe decir 0)"
echo "  mecanica.js enganchada:         $(grep -c 'mecanica.js' "$DESTINO" || true)  (debe decir 1)"
echo "  candado interno del runtime:    $(grep -c '!s.unlocked' "$DESTINO" || true)  (debe decir 0)"
