/**
 * ============================================================================
 * ARCHIVO: js/02-propagacion-y-delegacion.js
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
 * ============================================================================
 */

// IIFE: aísla todas las variables de este archivo para que no choquen con las
// de los otros cinco archivos JS que carga la misma página.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================

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

  const abuelo = document.getElementById('abuelo');
  const padre = document.getElementById('padre');
  const hijo = document.getElementById('hijo');
  const chkStop = document.getElementById('chk-stop');

  // --- Manejadores en la fase de CAPTURA (tercer parámetro: true) ----------
  abuelo.addEventListener('click', function () {
    imprimir('1) CAPTURA  · abuelo  (bajando)');
  }, true);

  padre.addEventListener('click', function () {
    imprimir('2) CAPTURA  · padre   (bajando)');
  }, true);

  hijo.addEventListener('click', function () {
    imprimir('3) CAPTURA  · hijo    (bajando)');
  }, true);

  // --- Manejadores en la fase de BURBUJEO (por defecto, sin tercer parámetro)
  hijo.addEventListener('click', function (evento) {
    // eventPhase es un número: 1 = captura, 2 = objetivo, 3 = burbujeo.
    imprimir('4) OBJETIVO · hijo    (eventPhase = ' + evento.eventPhase + ')');
  });

  padre.addEventListener('click', function (evento) {
    imprimir('5) BURBUJEO · padre   (subiendo)');

    // Si el checkbox está marcado, el padre CORTA el viaje aquí.
    if (chkStop.checked) {
      evento.stopPropagation();
      imprimir('   >> stopPropagation(): el abuelo NO se va a enterar.');
    }
  });

  abuelo.addEventListener('click', function () {
    imprimir('6) BURBUJEO · abuelo  (subiendo)');
  });

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

  // Dos manejadores sobre el mismo hijo, para verlo en directo:
  hijo.addEventListener('click', function () {
    imprimir('   (extra) Otro manejador del hijo: yo también me ejecuto.');
  });

  // ⚠️ ERROR COMÚN: abusar de stopPropagation() "por si acaso". Rompe la
  //    delegación de otros equipos y crea fallos dificilísimos de encontrar.
  // ✅ BUENA PRÁCTICA: úsalo solo cuando de verdad necesites aislar un clic
  //    (por ejemplo, dentro de un menú desplegable que no debe cerrarse).

  document.getElementById('limpiar-02').addEventListener('click', function () {
    document.getElementById(ID_SALIDA).textContent = '';
  });

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

  const listaProductos = document.getElementById('lista-productos');
  const formProducto = document.getElementById('form-producto');
  const inputProducto = document.getElementById('nuevo-producto');

  // Contador para dar un id distinto a cada producto nuevo.
  let siguienteId = 4;

  // --- UN SOLO MANEJADOR PARA TODA LA LISTA -------------------------------
  listaProductos.addEventListener('click', function (evento) {
    // 1) Buscamos el botón de acción más cercano al punto pulsado.
    const boton = evento.target.closest('[data-accion]');

    // 2) Si el clic no fue sobre un botón de acción (por ejemplo, sobre el
    //    nombre del producto), no hacemos nada. Esta "puerta de salida"
    //    temprana es un patrón muy habitual y muy legible.
    if (!boton) {
      imprimir('Clic dentro de la lista, pero no sobre un botón de acción.');
      return;
    }

    // 3) Localizamos la fila completa a la que pertenece ese botón.
    const fila = boton.closest('.producto');

    // 4) Leemos los datos guardados en atributos data-*.
    //    En el HTML: data-accion="eliminar"  ->  en JS: dataset.accion
    const accion = boton.dataset.accion;
    const id = fila.dataset.id;
    const nombre = fila.querySelector('.producto__nombre').textContent;

    titulo('3. Delegación de eventos');
    imprimir('Acción: "' + accion + '" sobre el producto #' + id + ' (' + nombre + ')');
    imprimir('target        =', evento.target.tagName.toLowerCase());
    imprimir('currentTarget =', evento.currentTarget.tagName.toLowerCase() + ' (siempre el UL: ahí está el único listener)');

    // 5) Decidimos qué hacer según la acción.
    if (accion === 'eliminar') {
      fila.remove(); // remove() borra el elemento del DOM
      imprimir('Producto eliminado. No hizo falta ningún listener propio.');
    } else if (accion === 'favorito') {
      // classList.toggle añade la clase si no está y la quita si está.
      // Devuelve true si ha quedado puesta.
      const esFavorito = fila.classList.toggle('producto--favorito');
      boton.textContent = esFavorito ? '★ Favorito' : '☆ Favorito';
      imprimir('Favorito: ' + (esFavorito ? 'activado' : 'desactivado'));
    }
  });

  // --- ALTA DE PRODUCTOS NUEVOS -------------------------------------------
  formProducto.addEventListener('submit', function (evento) {
    // Sin preventDefault, el formulario recarga la página y perderíamos todo.
    evento.preventDefault();

    // .trim() quita los espacios sobrantes del principio y del final.
    const nombre = inputProducto.value.trim();

    if (nombre === '') {
      imprimir('Escribe un nombre de producto antes de añadirlo.');
      inputProducto.focus(); // devolvemos el foco al campo: buena usabilidad
      return;
    }

    // Creamos la fila nueva. Se usa un id incremental sencillo.
    const li = document.createElement('li');
    li.className = 'producto';
    li.dataset.id = siguienteId;
    siguienteId = siguienteId + 1;

    // ⚠️ ERROR COMÚN: meter texto escrito por el usuario con innerHTML sin
    //    pensarlo. Si el texto trae etiquetas HTML, se insertan de verdad.
    //    Aquí lo hacemos seguro: creamos el <span> aparte y usamos
    //    textContent, que trata el texto SIEMPRE como texto plano.
    const span = document.createElement('span');
    span.className = 'producto__nombre';
    span.textContent = nombre; // ✅ seguro

    const acciones = document.createElement('span');
    acciones.className = 'producto__acciones';
    acciones.innerHTML =
      '<button type="button" class="btn btn--mini" data-accion="favorito">☆ Favorito</button>' +
      '<button type="button" class="btn btn--mini btn--peligro" data-accion="eliminar">Eliminar</button>';

    li.appendChild(span);
    li.appendChild(acciones);
    listaProductos.appendChild(li);

    titulo('3.b Producto añadido dinámicamente');
    imprimir('Añadido: "' + nombre + '".');
    imprimir('Fíjate: sus botones YA FUNCIONAN sin registrar ningún listener.');
    imprimir('Eso es exactamente lo que nos regala la delegación.');

    inputProducto.value = ''; // vaciamos el campo para el siguiente producto
    inputProducto.focus();
  });

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

  // --- once: se ejecuta una vez y se elimina automáticamente ---------------
  const btnUnaVez = document.getElementById('btn-una-vez');

  btnUnaVez.addEventListener('click', function () {
    titulo('4. Opción once');
    imprimir('Este mensaje solo aparece la PRIMERA vez que pulsas el botón.');
    imprimir('El navegador ya ha retirado el manejador por su cuenta.');
    btnUnaVez.textContent = 'Ya me gasté (once)';
    btnUnaVez.disabled = true;
  }, { once: true });

  // ✅ BUENA PRÁCTICA: once es ideal para avisos de bienvenida, aceptar
  //    condiciones o inicializaciones que solo deben ocurrir una vez. Evita
  //    tener que llamar tú a removeEventListener.

  // --- passive: mejora el rendimiento del scroll --------------------------
  /*
    Cuando escuchas 'wheel' o 'touchstart', el navegador NO sabe si vas a
    llamar a preventDefault() para bloquear el scroll, así que espera a que tu
    función termine antes de desplazar. Resultado: scroll con tirones.

    Con { passive: true } le prometes que NO lo harás, y el navegador puede
    desplazar inmediatamente sin esperarte.
  */
  const zonaScroll = document.getElementById('zona-scroll');
  let contadorRueda = 0;

  zonaScroll.addEventListener('wheel', function () {
    contadorRueda = contadorRueda + 1;

    // Imprimimos solo de vez en cuando: 'wheel' se dispara muchísimo y
    // llenaría la consola en un segundo.
    if (contadorRueda % 5 === 0) {
      imprimir('Eventos wheel detectados: ' + contadorRueda + ' (listener passive)');
    }

    // ⚠️ ERROR COMÚN: llamar a preventDefault() dentro de un listener passive.
    //    El navegador lo IGNORA y muestra un aviso en la consola.
  }, { passive: true });

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
