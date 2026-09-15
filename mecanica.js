/* ============================================================
   LA SELVA — capa de mecánica
   ------------------------------------------------------------
   Esto es lo que Claude Design no puede entregar: la cerradura
   de verdad y el progreso que se recuerda.

   El exportador de Claude Design no dibuja campos de texto, así
   que su pantalla de clave se ve pero no funciona. Esta capa la
   tapa con una propia que sí funciona, copiando el fondo de la
   estación para que se sienta la misma pieza.

   Regla de oro: no tocamos el DOM del runtime de Claude Design.
   Él redibuja sus pantallas cuando quiere, y cualquier cambio
   que le hagamos desaparece o deja restos que confunden.

   Para cambiar una clave o agregar una puerta, edita PUERTAS.
   ============================================================ */

(function () {
  "use strict";

  var LLAVE = "laselva.progreso.v1";

  var PUERTAS = [
    {
      estacion: 2,
      clave: "SELVA",
      rotulo: "Estación 02",
      titulo: 'Escriba la <em>clave</em>',
      ayuda: "La palabra que encontró en la estación anterior abre esta parada.",
      crema: "#E8E6D0",
      tinta: "#23281A",
      cuerpo: "#3A4029",
      acento: "#55601F",
      error: "#8A3B22",

      // Las mismas ilustraciones y el mismo velo que Claude Design le
      // puso a esta estación, con sus valores del panel. Se pintan aquí
      // en vez de copiarlos del runtime, que los cruza con una
      // transición y a veces entrega el lado apagado.
      fondo: [
        { src: "assets/merian-3.webp", css: "top:-8vh;left:-9vw;width:42vw;max-width:900px;opacity:.8;transform:rotate(12deg)" },
        { src: "assets/merian-4.webp", css: "bottom:-12vh;right:-8vw;width:36vw;max-width:560px;opacity:.85;transform:rotate(-14deg)" }
      ],
      velo: "radial-gradient(ellipse 95% 85% at 50% 45%, rgba(232,230,208,.9) 0%, rgba(232,230,208,.9) 45%, rgba(232,230,208,.15) 100%)"
    }
  ];

  /* ---------- progreso ---------- */

  function abiertas() {
    try { return JSON.parse(localStorage.getItem(LLAVE)) || []; } catch (e) { return []; }
  }
  function guardar(a) {
    try { localStorage.setItem(LLAVE, JSON.stringify(a)); } catch (e) {}
  }
  function estaAbierta(n) { return abiertas().indexOf(n) !== -1; }
  function abrir(n) {
    var a = abiertas();
    if (a.indexOf(n) === -1) { a.push(n); guardar(a); }
  }

  function norm(s) {
    return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  /* ---------- puentes con el runtime ---------- */

  function flecha(dir) {
    var bs = document.querySelectorAll("button");
    for (var i = 0; i < bs.length; i++) {
      if (bs[i].textContent.trim() === dir) return bs[i];
    }
    return null;
  }

  // Mientras el runtime cambia de pantalla dejamos de vigilar: si no,
  // alcanzamos a ver la puerta que todavía no se ha ido y saltamos de más.
  var bloqueadoHasta = 0;

  // Hacia dónde iba la persona. Una puerta ya abierta se cruza en la
  // dirección en que venía: si se está devolviendo, la cruza hacia atrás.
  var ultimaDireccion = 1;

  function saltar(dir, pausa) {
    bloqueadoHasta = Date.now() + (pausa || 900);
    var f = flecha(dir > 0 ? "→" : "←");
    if (f) f.click();
  }

  // La versión de scroll continuo ya no navega con flechas: el diseño
  // expone window.abrirPuerta(n) para cruzar sin tocar su DOM. Si existe,
  // ese es el camino; si no, caemos a la flecha de la versión paginada.
  function cruzar(p, dir) {
    if (typeof window.abrirPuerta === "function") {
      bloqueadoHasta = Date.now() + 900;
      window.abrirPuerta(p.estacion);
      return;
    }
    saltar(dir);
  }

  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("button") : null;
    if (!b) return;
    var t = b.textContent.trim();
    if (t === "→") ultimaDireccion = 1;
    else if (t === "←") ultimaDireccion = -1;
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") ultimaDireccion = 1;
    else if (e.key === "ArrowLeft") ultimaDireccion = -1;
  }, true);

  // Estamos en la puerta si el botón "Desbloquear" de Claude Design está
  // dibujado y visible. Ojo: no sirve buscar su texto, porque el runtime
  // deja el texto de la pantalla anterior colgado un rato después de
  // cambiar de pantalla, y eso nos hacía saltar de más. El botón, en
  // cambio, sí desaparece en el momento justo.
  function visible(el) {
    if (typeof el.checkVisibility === "function") {
      return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
    }
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function enPuerta() {
    var bs = document.querySelectorAll("button");
    for (var i = 0; i < bs.length; i++) {
      if (bs[i].id === "puerta-abrir") continue;
      if (norm(bs[i].textContent).indexOf("DESBLOQUEAR") !== 0) continue;
      if (visible(bs[i])) return true;
    }
    return false;
  }

  // Las ilustraciones de la estación que viene, para que la puerta se
  // sienta parte de la pieza y no una pantalla aparte.
  function capaDeFondo(p) {
    var capa = document.createElement("div");
    capa.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0";

    for (var i = 0; i < (p.fondo || []).length; i++) {
      var img = document.createElement("img");
      img.src = p.fondo[i].src;
      img.alt = "";
      img.style.cssText = "position:absolute;mix-blend-mode:multiply;" + p.fondo[i].css;
      capa.appendChild(img);
    }

    if (p.velo) {
      var velo = document.createElement("div");
      velo.style.cssText = "position:absolute;inset:0;background:" + p.velo;
      capa.appendChild(velo);
    }
    return capa;
  }

  /* ---------- la puerta ---------- */

  var estilosPuestos = false;

  function ponerEstilos() {
    if (estilosPuestos) return;
    estilosPuestos = true;
    var s = document.createElement("style");
    s.textContent = [
      '#puerta{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;',
      'align-items:center;justify-content:center;gap:24px;padding:32px 24px;text-align:center;',
      "font-family:'Cormorant Garamond',Georgia,serif;animation:puertaEntra .5s ease both}",
      '@keyframes puertaEntra{from{opacity:0}to{opacity:1}}',
      '#puerta .rot{display:flex;align-items:center;gap:14px;position:relative;z-index:1;',
      "font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase}",
      '#puerta .rot span.linea{display:block;width:34px;height:1px;opacity:.5}',
      '#puerta .caja{display:flex;flex-direction:column;align-items:center;gap:24px;',
      'width:100%;max-width:420px;position:relative;z-index:1}',
      '#puerta h2{margin:0;font-size:clamp(32px,5.5vw,52px);font-weight:300;line-height:1.05;letter-spacing:-.02em}',
      '#puerta h2 em{font-weight:300}',
      '#puerta p.ayuda{margin:0;max-width:30ch;font-size:17px;line-height:1.6}',
      '#puerta input{width:100%;box-sizing:border-box;padding:16px 18px;border-radius:4px;',
      "font-family:'IBM Plex Mono',monospace;font-size:16px;letter-spacing:.28em;text-transform:uppercase;",
      'text-align:center;outline:none;transition:border-color .2s ease}',
      '#puerta button{display:inline-flex;align-items:center;gap:12px;padding:14px 26px;border-radius:999px;',
      "font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.26em;text-transform:uppercase;",
      'cursor:pointer;transition:background .18s ease,color .18s ease}',
      "#puerta .err{min-height:16px;font-family:'IBM Plex Mono',monospace;font-size:10px;",
      'letter-spacing:.22em;text-transform:uppercase;opacity:0;transition:opacity .2s ease}',
      '#puerta.mal .err{opacity:1}',
      '#puerta.mal .caja{animation:sacude .38s ease}',
      '@keyframes sacude{10%,90%{transform:translateX(-2px)}30%,70%{transform:translateX(4px)}50%{transform:translateX(-4px)}}',
      '@media(prefers-reduced-motion:reduce){#puerta,#puerta .caja{animation:none}}'
    ].join("");
    document.head.appendChild(s);
  }

  function mostrarPuerta(p) {
    if (document.getElementById("puerta")) return;
    ponerEstilos();

    var d = document.createElement("div");
    d.id = "puerta";
    d.style.background = p.crema;
    d.style.color = p.tinta;

    d.appendChild(capaDeFondo(p));

    var contenido = document.createElement("div");
    contenido.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:24px;width:100%;position:relative;z-index:1";
    contenido.innerHTML =
      '<div class="rot" style="color:' + p.acento + '">' +
        '<span class="linea" style="background:' + p.acento + '"></span>' +
        '<span>' + p.rotulo + '</span>' +
        '<span class="linea" style="background:' + p.acento + '"></span>' +
      '</div>' +
      '<form id="puerta-form" class="caja" novalidate>' +
        '<h2>' + p.titulo + '</h2>' +
        '<p class="ayuda" style="color:' + p.cuerpo + '">' + p.ayuda + '</p>' +
        '<input id="puerta-campo" type="text" placeholder="CLAVE" autocomplete="off" ' +
          'autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="go" ' +
          'style="border:1px solid ' + p.acento + '59;background:#ffffff59;color:' + p.tinta + '">' +
        '<button id="puerta-abrir" type="submit" style="border:1px solid ' + p.acento + ';color:' + p.acento + ';background:#ffffff4d">' +
          '<span>Desbloquear</span><span style="font-family:\'Cormorant Garamond\',serif;font-size:15px;letter-spacing:0">→</span>' +
        '</button>' +
        '<div class="err" style="color:' + p.error + '">Clave incorrecta</div>' +
      '</form>';

    d.appendChild(contenido);
    document.body.appendChild(d);

    var campo = document.getElementById("puerta-campo");
    var boton = document.getElementById("puerta-abrir");

    boton.addEventListener("mouseenter", function () {
      boton.style.background = p.acento; boton.style.color = p.crema;
    });
    boton.addEventListener("mouseleave", function () {
      boton.style.background = "#ffffff4d"; boton.style.color = p.acento;
    });

    function intentar() {
      if (norm(campo.value) === norm(p.clave)) {
        abrir(p.estacion);
        quitarPuerta();
        cruzar(p, 1);
      } else {
        d.classList.remove("mal");
        void d.offsetWidth;
        d.classList.add("mal");
        campo.select();
      }
    }

    // Cubre las tres formas de confirmar: el botón, la tecla Enter y
    // el "Ir" del teclado del celular.
    document.getElementById("puerta-form").addEventListener("submit", function (e) {
      e.preventDefault();
      intentar();
    });
    campo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) { e.preventDefault(); intentar(); }
    });
    campo.addEventListener("input", function () { d.classList.remove("mal"); });
    setTimeout(function () { campo.focus(); }, 120);
  }

  function quitarPuerta() {
    var d = document.getElementById("puerta");
    if (d) d.remove();
  }

  /* ---------- vigilancia ---------- */

  var saltosSeguidos = 0;

  // Cada página tiene UNA puerta, y el diseño dice cuál con
  // window.PUERTA_ACTUAL. Sin esto, index.html ofrecía la clave de la
  // estación 03 en cuanto la 02 quedaba abierta en el teléfono.
  function puertaDeEstaPagina() {
    var n = window.PUERTA_ACTUAL;
    for (var i = 0; i < PUERTAS.length; i++) {
      if (PUERTAS[i].estacion === n) return PUERTAS[i];
    }
    for (var j = 0; j < PUERTAS.length; j++) {
      if (!estaAbierta(PUERTAS[j].estacion)) return PUERTAS[j];
    }
    return null;
  }

  function revisar() {
    if (Date.now() < bloqueadoHasta) return;

    if (!enPuerta()) {
      quitarPuerta();
      saltosSeguidos = 0;
      return;
    }

    var puerta = puertaDeEstaPagina();
    if (!puerta) { quitarPuerta(); return; }
    var p = estaAbierta(puerta.estacion) ? null : puerta;

    // Ya la abrió antes: la cruza sin volver a pedir la palabra, en la
    // dirección en la que venía.
    if (!p) {
      quitarPuerta();
      if (saltosSeguidos < 2) { saltosSeguidos++; cruzar(puerta, ultimaDireccion); }
      return;
    }

    mostrarPuerta(p);
  }

  function arrancar() {
    setInterval(revisar, 200);
    revisar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
