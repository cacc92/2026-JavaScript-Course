/**
 * ============================================================================
 * ARCHIVO: js/02-propagacion-y-delegacion.js
 * PROYECTO: 07 · Eventos, formularios y almacenamiento
 * TEMA:    El viaje del evento y la delegación
 * ----------------------------------------------------------------------------
 * QUÉ APRENDERÁS AQUÍ:
 *   - Que un evento no ocurre en un solo elemento: VIAJA por el árbol del DOM.
 *   - Las tres fases: captura (baja), objetivo (llega) y burbujeo (sube).
 *   - El tercer parámetro de addEventListener y la opción capture.
 *   - stopPropagation() y stopImmediatePropagation().
 *   - Delegación de eventos: un solo manejador para muchos elementos,
 *     incluso para los que todavía no existen. Se implementa con closest().
 *   - Las opciones once y passive.
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y el andamiaje (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/02-propagacion-y-delegacion.js
 * ============================================================================
 */

// IIFE: aísla todas las variables de este archivo para que no choquen con las
// de los otros cinco archivos JS que carga la misma página.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto de clase.

  const ID_SALIDA = 'salida-02';

  /** imprimir(): escribe en la consola de DevTools y en la consola visual. */
  function imprimir(...mensajes) {
    console.log(...mensajes);
    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    salida.textContent += texto + '\n';
    salida.scrollTop = salida.scrollHeight;
  }

  function titulo(texto) {
    imprimir('\n===== ' + texto + ' =====');
  }

  // Botón "Limpiar" de esta consola (también andamiaje ya resuelto).
  const botonLimpiar02 = document.getElementById('limpiar-02');
  if (botonLimpiar02) {
    botonLimpiar02.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. LAS TRES FASES DE UN EVENTO
  // ==========================================================================

  /*
    Cuando pulsas un elemento, el evento hace un VIAJE DE IDA Y VUELTA:

      FASE 1 · CAPTURA (capturing)
        El evento parte de window y BAJA por el árbol:
        html > body > abuelo > padre > ... hasta llegar al elemento pulsado.

      FASE 2 · OBJETIVO (target)
        El evento llega al elemento concreto sobre el que se hizo clic.

      FASE 3 · BURBUJEO (bubbling)
        El evento SUBE de vuelta: hijo > padre > abuelo > body > html > window.
        Se llama burbujeo porque recuerda a una burbuja que asciende en un vaso.

    Analogía: es como un ascensor que baja hasta la planta pulsada y luego
    vuelve a subir, parando en cada planta a la ida y a la vuelta.

    Por defecto, addEventListener escucha en la fase de BURBUJEO (la de subida).
    Para escuchar en la de captura hay dos formas equivalentes:

        elemento.addEventListener('click', fn, true);
        elemento.addEventListener('click', fn, { capture: true });

    Consecuencia práctica: los manejadores de captura de los ANCESTROS se
    ejecutan ANTES que el del elemento pulsado.
  */

  // TODO (en clase):
  //   1. Guarda las cuatro referencias del DOM (los ids ya están en el HTML):
  //        const abuelo  = document.getElementById('abuelo');
  //        const padre   = document.getElementById('padre');
  //        const hijo    = document.getElementById('hijo');
  //        const chkStop = document.getElementById('chk-stop');
  //   2. Registra TRES manejadores de 'click' en fase de CAPTURA (tercer
  //      parámetro true) que impriman, en este orden:
  //        abuelo -> '1) CAPTURA  · abuelo  (bajando)'
  //        padre  -> '2) CAPTURA  · padre   (bajando)'
  //        hijo   -> '3) CAPTURA  · hijo    (bajando)'
  //   3. Registra los manejadores de BURBUJEO (SIN tercer parámetro):
  //        hijo   -> '4) OBJETIVO · hijo    (eventPhase = ' + evento.eventPhase + ')'
  //                  (eventPhase es un número: 1 captura, 2 objetivo, 3 burbujeo)
  //        padre  -> '5) BURBUJEO · padre   (subiendo)'  y, si chkStop.checked,
  //                  llamar a evento.stopPropagation() e imprimir
  //                  '   >> stopPropagation(): el abuelo NO se va a enterar.'
  //        abuelo -> '6) BURBUJEO · abuelo  (subiendo)'
  //   Resultado esperado al pulsar el cuadro HIJO (el morado): salen las seis
  //   líneas numeradas de la 1 a la 6, en ese orden exacto. Con el checkbox
  //   #chk-stop marcado, la línea 6 desaparece pero las de captura siguen.
  //   (aprox. 30 lineas)

  // ⚠️ ERROR COMÚN: pensar que el manejador del padre solo se ejecuta al pulsar
  //    el padre. Si pulsas un hijo, el evento SUBE y también lo dispara.
  //    Esto no es un fallo: es el comportamiento normal y es lo que hace
  //    posible la delegación de eventos.

  // ==========================================================================
  // 2. stopPropagation() vs stopImmediatePropagation()
  // ==========================================================================

  /*
    - preventDefault():          cancela la acción de fábrica del navegador.
    - stopPropagation():         detiene el VIAJE del evento hacia otros
                                 elementos, pero deja terminar a los demás
                                 manejadores del MISMO elemento.
    - stopImmediatePropagation(): además, impide que se ejecuten los otros
                                 manejadores del mismo elemento.

    Son cosas distintas: parar el ascensor no es lo mismo que anular lo que
    ibas a hacer al llegar.
  */

  // TODO (en clase):
  //   1. Añade un SEGUNDO manejador de 'click' sobre el MISMO #hijo (además
  //      del de burbujeo que ya escribiste en el apartado 1) que imprima:
  //        '   (extra) Otro manejador del hijo: yo también me ejecuto.'
  //   2. Demuestra en directo la diferencia: cambia momentáneamente el
  //      stopPropagation() del padre por stopImmediatePropagation() en el
  //      propio hijo y observa que esta línea "(extra)" deja de aparecer.
  //      Después vuelve a dejarlo como estaba.
  //   Resultado esperado: al pulsar el hijo, tras la línea '4) OBJETIVO'
  //   aparece la línea '   (extra) ...', porque los dos manejadores del mismo
  //   elemento conviven sin pisarse.
  //   (aprox. 3 lineas)

  // ⚠️ ERROR COMÚN: abusar de stopPropagation() "por si acaso". Rompe la
  //    delegación de otros equipos y crea fallos dificilísimos de encontrar.
  // ✅ BUENA PRÁCTICA: úsalo solo cuando de verdad necesites aislar un clic
  //    (por ejemplo, dentro de un menú desplegable que no debe cerrarse).

  // ==========================================================================
  // 3. DELEGACIÓN DE EVENTOS
  // ==========================================================================

  /*
    EL PROBLEMA
    Tenemos una lista con 3 productos, y cada uno tiene 2 botones.
    Lo intuitivo sería recorrer todos los botones y ponerle un listener a cada
    uno. Eso tiene dos pegas gordas:
      a) Si la lista tiene 500 filas, creas 1000 manejadores. Gasto de memoria.
      b) Los productos que añadas DESPUÉS no tendrán manejador: los botones
         nuevos no harán nada, porque el bucle ya pasó.

    LA SOLUCIÓN: DELEGAR
    Como los eventos BURBUJEAN, ponemos UN ÚNICO manejador en el contenedor
    (el <ul>). Todos los clics de sus hijos acaban pasando por él.
    Luego preguntamos: "¿quién ha sido?" mirando event.target.

    Analogía: en lugar de poner un portero en la puerta de cada aula, pones uno
    solo en la entrada del edificio y él pregunta a dónde va cada persona.

    LA PIEZA CLAVE: element.closest('selector')
    Sube desde el elemento hacia sus padres y devuelve el PRIMER antepasado
    (incluido él mismo) que encaje con el selector; si no hay ninguno, null.
    Es imprescindible porque el usuario puede pulsar un icono o un texto DENTRO
    del botón: target sería ese hijo, no el botón.
  */

  // TODO (en clase) · 3.a UN SOLO MANEJADOR PARA TODA LA LISTA:
  //   1. Referencias y estado inicial:
  //        const listaProductos = document.getElementById('lista-productos');
  //        const formProducto   = document.getElementById('form-producto');
  //        const inputProducto  = document.getElementById('nuevo-producto');
  //        let   siguienteId    = 4;   // los tres productos del HTML son 1, 2 y 3
  //   2. listaProductos.addEventListener('click', function (evento) { ... }) que:
  //        a) const boton = evento.target.closest('[data-accion]');
  //        b) SALIDA TEMPRANA: si no hay botón, imprimir
  //           'Clic dentro de la lista, pero no sobre un botón de acción.' y return;
  //        c) const fila   = boton.closest('.producto');
  //           const accion = boton.dataset.accion;        // "favorito" | "eliminar"
  //           const id     = fila.dataset.id;
  //           const nombre = fila.querySelector('.producto__nombre').textContent;
  //        d) titulo('3. Delegación de eventos') y luego imprimir:
  //             'Acción: "' + accion + '" sobre el producto #' + id + ' (' + nombre + ')'
  //             'target        =', evento.target.tagName.toLowerCase()
  //             'currentTarget =', evento.currentTarget.tagName.toLowerCase() +
  //                                ' (siempre el UL: ahí está el único listener)'
  //        e) Si accion === 'eliminar':  fila.remove() e imprimir
  //             'Producto eliminado. No hizo falta ningún listener propio.'
  //           Si accion === 'favorito':  const esFavorito = fila.classList.toggle('producto--favorito');
  //             boton.textContent = esFavorito ? '★ Favorito' : '☆ Favorito';
  //             imprimir('Favorito: ' + (esFavorito ? 'activado' : 'desactivado'));
  //   Resultado esperado: currentTarget imprime SIEMPRE "ul", pulses el botón
  //   que pulses, porque el único listener vive en el <ul>.
  //   (aprox. 30 lineas)

  // TODO (en clase) · 3.b ALTA DE PRODUCTOS NUEVOS:
  //   1. formProducto.addEventListener('submit', function (evento) { ... }) con
  //      evento.preventDefault() en la PRIMERA línea (sin él la página recarga).
  //   2. const nombre = inputProducto.value.trim();
  //      Si nombre === '': imprimir('Escribe un nombre de producto antes de añadirlo.'),
  //      inputProducto.focus() y return.
  //   3. Crea la fila con createElement (NUNCA con innerHTML para el texto del
  //      usuario):
  //        const li = document.createElement('li');
  //        li.className = 'producto';
  //        li.dataset.id = siguienteId;  y luego siguienteId = siguienteId + 1;
  //        const span = document.createElement('span');
  //        span.className = 'producto__nombre';
  //        span.textContent = nombre;      // ✅ seguro: trata el texto como texto
  //        const acciones = document.createElement('span');
  //        acciones.className = 'producto__acciones';
  //        acciones.innerHTML = los dos <button> con data-accion="favorito" y
  //                             data-accion="eliminar" (mismas clases que en el HTML)
  //        li.appendChild(span); li.appendChild(acciones); listaProductos.appendChild(li);
  //   4. titulo('3.b Producto añadido dinámicamente') y luego imprimir:
  //        'Añadido: "' + nombre + '".'
  //        'Fíjate: sus botones YA FUNCIONAN sin registrar ningún listener.'
  //        'Eso es exactamente lo que nos regala la delegación.'
  //   5. Vacía el campo (inputProducto.value = '') y devuélvele el foco.
  //   Resultado esperado: el producto nuevo aparece al final de la lista y sus
  //   botones Favorito/Eliminar funcionan a la primera.
  //   (aprox. 30 lineas)

  // ⚠️ ERROR COMÚN: meter texto escrito por el usuario con innerHTML sin
  //    pensarlo. Si el texto trae etiquetas HTML, se insertan de verdad.
  //    Por eso el nombre se pone con textContent, que trata el texto SIEMPRE
  //    como texto plano.
  // ✅ BUENA PRÁCTICA: delega siempre que tengas listas, tablas o cualquier
  //    conjunto de elementos repetidos, sobre todo si cambian con el tiempo.

  // ==========================================================================
  // 4. OPCIONES DEL TERCER PARÁMETRO: capture, once y passive
  // ==========================================================================

  /*
    El tercer parámetro de addEventListener puede ser un objeto de opciones:

      elemento.addEventListener('click', fn, {
        capture: false,  // escuchar en la fase de captura en vez de burbujeo
        once:    false,  // ejecutar UNA sola vez y darse de baja solo
        passive: false   // prometer que NO se llamará a preventDefault()
      });
  */

  // TODO (en clase) · 4.a once:
  //   1. const btnUnaVez = document.getElementById('btn-una-vez');
  //   2. Regístrale un 'click' con TERCER parámetro { once: true } que:
  //        titulo('4. Opción once');
  //        imprimir('Este mensaje solo aparece la PRIMERA vez que pulsas el botón.');
  //        imprimir('El navegador ya ha retirado el manejador por su cuenta.');
  //        btnUnaVez.textContent = 'Ya me gasté (once)';
  //        btnUnaVez.disabled = true;
  //   Resultado esperado: el botón cambia de texto, queda deshabilitado y el
  //   mensaje NO vuelve a salir aunque se rehabilite desde DevTools.
  //   (aprox. 8 lineas)

  // ✅ BUENA PRÁCTICA: once es ideal para avisos de bienvenida, aceptar
  //    condiciones o inicializaciones que solo deben ocurrir una vez. Evita
  //    tener que llamar tú a removeEventListener.

  /*
    passive: mejora el rendimiento del scroll.

    Cuando escuchas 'wheel' o 'touchstart', el navegador NO sabe si vas a
    llamar a preventDefault() para bloquear el scroll, así que espera a que tu
    función termine antes de desplazar. Resultado: scroll con tirones.

    Con { passive: true } le prometes que NO lo harás, y el navegador puede
    desplazar inmediatamente sin esperarte.
  */

  // TODO (en clase) · 4.b passive:
  //   1. const zonaScroll = document.getElementById('zona-scroll');
  //      let contadorRueda = 0;
  //   2. zonaScroll.addEventListener('wheel', function () { ... }, { passive: true })
  //      que incremente contadorRueda y, SOLO cuando contadorRueda % 5 === 0,
  //      imprima:
  //        'Eventos wheel detectados: ' + contadorRueda + ' (listener passive)'
  //      (imprimir en cada disparo llenaría la consola en un segundo).
  //   Resultado esperado: al hacer scroll con la rueda dentro de la caja, sale
  //   una línea cada cinco eventos: 5, 10, 15...
  //   (aprox. 10 lineas)

  // ⚠️ ERROR COMÚN: llamar a preventDefault() dentro de un listener passive.
  //    El navegador lo IGNORA y muestra un aviso en la consola.

  /* ==========================================================================
   * EJERCICIOS PROPUESTOS · archivo 02
   * --------------------------------------------------------------------------
   * 1) Añade un manejador de clic al <body> que imprima un mensaje. Comprueba
   *    que se dispara al pulsar CUALQUIER parte de la página y explica por qué.
   *
   * 2) Marca el checkbox de stopPropagation y anota en tu cuaderno qué números
   *    de la secuencia (1 a 6) desaparecen y cuáles no. ¿Por qué siguen
   *    apareciendo los de captura?
   *
   * 3) Añade a cada producto un tercer botón "Duplicar" con
   *    data-accion="duplicar" que cree una copia de la fila justo debajo.
   *    No debes registrar ningún listener nuevo: solo ampliar el if de la
   *    delegación. Pista: fila.cloneNode(true) y fila.after(copia).
   *
   * 4) Haz que al pulsar el NOMBRE de un producto (no los botones) se muestre
   *    en la consola visual cuántas letras tiene ese nombre.
   *
   * 5) (Reto) Convierte la demo de captura/burbujeo en un semáforo visual:
   *    que cada caja se ilumine durante 400 ms cuando el evento pasa por ella,
   *    de forma que se VEA el recorrido del evento. Pista: classList.add,
   *    setTimeout y classList.remove.
   * ========================================================================== */
})();
