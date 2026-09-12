# La Selva

Experiencia de estaciones que se abren con una palabra impresa en tarjetas
físicas. Medellín, 20 a 24 de septiembre de 2026.

Hoy contiene las estaciones 01 y 02, con la puerta de la clave entre ellas.

## Qué es cada archivo

| Archivo | Qué hace |
|---|---|
| `index.html` | El export de Claude Design, preparado para web |
| `support.js` | El runtime que trae Claude Design. No editar |
| `mecanica.js` | La clave y el progreso. Esto lo escribimos nosotros |
| `assets/` | Las ilustraciones de Merian, en webp |
| `export/` | El `.dc.html` original de Claude Design, sin tocar |
| `publicar.sh` | Prepara un export nuevo para publicarlo |

`export/` y `publicar.sh` no se publican: están excluidos en `.vercelignore`.

## Por qué existe mecanica.js

El exportador de Claude Design no dibuja campos de texto. Su pantalla de
clave se ve completa, pero el campo es decorativo y no hay nada detrás.

`mecanica.js` la reemplaza por una que sí funciona: valida la palabra sin
importar mayúsculas, tildes ni espacios de más, guarda el progreso en el
teléfono y, si la persona ya pasó por ahí, cruza la puerta sin volver a
preguntar. Pinta su propio fondo con las ilustraciones de la estación que
viene, para que no se sienta una pantalla aparte.

Regla que hay que respetar: **no tocar el DOM del runtime**. Él redibuja
sus pantallas cuando quiere y cualquier cambio que le hagamos desaparece o
deja restos que rompen la detección.

## Cambiar una clave

En `mecanica.js`, arriba, está `PUERTAS`. Cada puerta tiene su palabra, sus
textos y los cinco colores de su estación.

## Publicar un export nuevo de Claude Design

```bash
./publicar.sh "ruta/del/archivo.dc.html"
```

Apunta las ilustraciones a las versiones livianas, arregla el alto de
pantalla para el celular, desactiva el candado inservible del runtime y
engancha `mecanica.js`. Después, commit y push: Vercel republica solo y la
dirección no cambia.

## Las ilustraciones

Llegan de Claude Design en PNG de 3000 px — entre las cuatro pesan 58 MB, y
eso en un celular con datos no se puede. Se convierten a webp:

```bash
ffmpeg -i entrada.png -vf "scale=1400:-1:flags=lanczos" \
  -c:v libwebp -pix_fmt yuva420p -quality 82 -compression_level 6 salida.webp
```

Quedan en 2,5 MB en total y se ven igual con `mix-blend-mode: multiply`.
