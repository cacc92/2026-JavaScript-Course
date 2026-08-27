/**
 * ============================================================================
 * ARCHIVO: js/05-almacenamiento.js
 * TEMA:    DOMContentLoaded vs load, localStorage y sessionStorage
 * ----------------------------------------------------------------------------
 * QUÉ APRENDERÁS AQUÍ:
 *   - La diferencia entre DOMContentLoaded y load, y por qué casi siempre
 *     quieres el primero.
 *   - localStorage: setItem, getItem, removeItem, clear, length y key().
 *   - sessionStorage y en qué se diferencia de localStorage.
 *   - Por qué TODO se guarda como texto y hay que usar JSON.stringify /
 *     JSON.parse.
 *   - Cómo protegerse con try/catch (modo privado, cuota llena).
 *   - El evento 'storage', que avisa a las OTRAS pestañas.
 * ============================================================================
 */

// IIFE: aísla las variables de este archivo.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================

  const ID_SALIDA = 'salida-05';

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

  document.getElementById('limpiar-05').addEventListener('click', function () {
    document.getElementById(ID_SALIDA).textContent = '';
  });

  // ==========================================================================
  // 1. DOMContentLoaded vs load
  // ==========================================================================

  /*
    Una página no se carga de golpe. Hay dos momentos que nos interesan:

      DOMContentLoaded
        El HTML ya está leído y el árbol del DOM completo. Todos los elementos
        existen y se pueden buscar y modificar.
        PERO las imágenes, tipografías y otros recursos pueden seguir bajando.
        -> Es el momento en el que arranca casi todo el JavaScript.

      load
        Absolutamente todo ha terminado de descargarse: imágenes incluidas.
        -> Solo lo necesitas si dependes del TAMAÑO real de una imagen o de
           recursos externos ya pintados.

    Analogía: DOMContentLoaded es "la mesa está puesta"; load es "los platos
    ya están servidos y humeando".

    ¿Y por qué este archivo puede usar document.getElementById en la primera
    línea sin esperar a nada? Porque en el HTML los scripts llevan el atributo
    defer: eso los ejecuta cuando el HTML ya está completo y ANTES de que se
    dispare DOMContentLoaded. defer es la solución moderna a este problema.
  */
  titulo('1. DOMContentLoaded vs load');
  imprimir('Momento 0 · el script con defer ya se ejecuta: el DOM existe.');
  imprimir('   Elementos <button> encontrados ahora mismo: ' + document.querySelectorAll('button').length);

  document.addEventListener('DOMContentLoaded', function (evento) {
    imprimir('Momento 1 · DOMContentLoaded a los ' + Math.round(evento.timeStamp) + ' ms.');
    imprimir('   El HTML está completo. Aquí arranca normalmente una aplicación.');
  });

  // OJO: 'load' se escucha en window, no en document.
  window.addEventListener('load', function (evento) {
    imprimir('Momento 2 · load a los ' + Math.round(evento.timeStamp) + ' ms.');
    imprimir('   Ya ha terminado de cargar TODO (imágenes y demás recursos).');
  });

  // ⚠️ ERROR COMÚN: poner <script> en el <head> SIN defer y sin esperar a
  //    DOMContentLoaded. getElementById devuelve null porque el elemento aún
  //    no existe, y aparece el clásico:
  //    "Cannot read properties of null (reading 'addEventListener')".

  // ==========================================================================
  // 2. localStorage: LO BÁSICO
  // ==========================================================================

  /*
    El navegador reserva un pequeño almacén de TEXTO para cada sitio web
    (unos 5 MB). Funciona como un objeto de parejas clave-valor.

      localStorage.setItem('clave', 'valor');   guardar
      localStorage.getItem('clave');            leer (null si no existe)
      localStorage.removeItem('clave');         borrar UNA clave
      localStorage.clear();                     borrar TODAS las claves del sitio
      localStorage.length                       cuántas claves hay
      localStorage.key(0)                       nombre de la clave en la posición 0

    DIFERENCIAS CLAVE
      localStorage   -> permanece aunque cierres el navegador. Sin caducidad.
      sessionStorage -> se borra al cerrar la PESTAÑA. Cada pestaña, el suyo.

    ⚠️ NUNCA guardes ahí contraseñas, tokens sensibles ni datos personales:
    cualquier script de la página puede leerlos.

    ✅ BUENA PRÁCTICA: usa claves con prefijo de proyecto ("fs2-07-...") para
    no pisarte con otras aplicaciones del mismo dominio.
  */

  const CLAVE_PREFERENCIAS = 'fs2-07-preferencias';

  // Referencias a los controles del formulario de preferencias.
  const inputNombre = document.getElementById('pref-nombre');
  const selectColor = document.getElementById('pref-color');
  const rangoTamano = document.getElementById('pref-tamano');
  const textoTamano = document.getElementById('pref-tamano-valor');
  const saludo = document.getElementById('saludo-guardado');

  // ==========================================================================
  // 3. TODO SE GUARDA COMO TEXTO: JSON.stringify y JSON.parse
  // ==========================================================================

  /*
    localStorage SOLO entiende strings. Si le pasas un objeto, lo convierte a
    texto con toString() y obtienes la inútil cadena "[object Object]".

    Por eso el par que hay que memorizar es:
      JSON.stringify(objeto) -> convierte un objeto/array en texto para guardar.
      JSON.parse(texto)      -> reconstruye el objeto/array a partir del texto.

    ⚠️ Los números también salen como texto:
       localStorage.setItem('edad', 30);
       localStorage.getItem('edad') + 1;  // "301", no 31
       Number(localStorage.getItem('edad')) + 1;  // 31 correcto

    ⚠️ JSON.parse LANZA UN ERROR si el texto está corrupto o es null mal
    tratado. Por eso lo envolvemos en try/catch: una clave estropeada no debe
    tumbar toda la aplicación.
  */

  /** Guarda un objeto en localStorage de forma segura. Devuelve true/false. */
  function guardarPreferencias(preferencias) {
    try {
      localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(preferencias));
      return true;
    } catch (error) {
      // Puede fallar en modo incógnito o si el almacén está lleno (QuotaExceeded).
      imprimir('No se pudo guardar: ' + error.name);
      return false;
    }
  }

  /** Lee las preferencias. Si no hay o están corruptas, devuelve null. */
  function leerPreferencias() {
    try {
      const texto = localStorage.getItem(CLAVE_PREFERENCIAS);

      // getItem devuelve null cuando la clave no existe.
      if (texto === null) return null;

      return JSON.parse(texto);
    } catch (error) {
      imprimir('Datos corruptos en localStorage, se descartan: ' + error.message);
      localStorage.removeItem(CLAVE_PREFERENCIAS);
      return null;
    }
  }

  /** Aplica las preferencias a la interfaz (colores, tamaño y saludo). */
  function aplicarPreferencias(preferencias) {
    // documentElement es <html>: ahí viven las variables CSS de :root.
    // setProperty permite cambiarlas desde JavaScript en caliente.
    document.documentElement.style.setProperty('--primario', preferencias.color);
    document.documentElement.style.setProperty('--tamano-consola', preferencias.tamano + 'px');

    inputNombre.value = preferencias.nombre;
    selectColor.value = preferencias.color;
    rangoTamano.value = preferencias.tamano;
    textoTamano.textContent = preferencias.tamano;

    saludo.textContent = preferencias.nombre
      ? 'Hola de nuevo, ' + preferencias.nombre + '. Tus preferencias se han restaurado.'
      : 'Preferencias restauradas desde localStorage.';
  }

  // --- Al cargar la página, restauramos lo guardado -----------------------
  const guardadas = leerPreferencias();

  if (guardadas) {
    aplicarPreferencias(guardadas);
    imprimir('\nPreferencias recuperadas de localStorage:', guardadas);
  } else {
    imprimir('\nNo hay preferencias guardadas todavía (getItem devolvió null).');
  }

  // --- Botón GUARDAR -------------------------------------------------------
  document.getElementById('btn-guardar-pref').addEventListener('click', function () {
    titulo('3. setItem + JSON.stringify');

    const preferencias = {
      nombre: inputNombre.value.trim(),
      color: selectColor.value,
      tamano: Number(rangoTamano.value), // Number() para guardarlo como número
      guardadoEl: new Date().toLocaleString('es-ES')
    };

    if (guardarPreferencias(preferencias)) {
      aplicarPreferencias(preferencias);
      imprimir('Guardado bajo la clave "' + CLAVE_PREFERENCIAS + '".');
      imprimir('Texto realmente almacenado:', JSON.stringify(preferencias));
      imprimir('Recarga la página con F5: seguirá aquí.');
    }
  });

  // --- Botón LEER ----------------------------------------------------------
  document.getElementById('btn-leer-pref').addEventListener('click', function () {
    titulo('3.b getItem + JSON.parse');

    const crudo = localStorage.getItem(CLAVE_PREFERENCIAS);
    imprimir('Lo que devuelve getItem (typeof ' + typeof crudo + '):', crudo);

    const objeto = leerPreferencias();
    if (objeto === null) {
      imprimir('No hay nada guardado con esa clave.');
      return;
    }

    imprimir('Tras JSON.parse ya es un objeto de verdad (typeof ' + typeof objeto + '):', objeto);
    imprimir('Y ahora sí podemos acceder a sus propiedades: nombre =', objeto.nombre);
  });

  // --- Botón LISTAR CLAVES -------------------------------------------------
  document.getElementById('btn-listar-claves').addEventListener('click', function () {
    titulo('3.c Recorrer el almacén: length y key()');
    imprimir('Claves guardadas por este sitio: ' + localStorage.length);

    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      const valor = localStorage.getItem(clave);

      // Recortamos los valores largos para que la consola siga legible.
      const resumen = valor.length > 70 ? valor.slice(0, 70) + '...' : valor;
      imprimir('  [' + i + '] ' + clave + ' = ' + resumen);
    }

    if (localStorage.length === 0) {
      imprimir('  (vacío)');
    }
  });

  // --- Botón BORRAR --------------------------------------------------------
  document.getElementById('btn-borrar-pref').addEventListener('click', function () {
    titulo('3.d removeItem');

    localStorage.removeItem(CLAVE_PREFERENCIAS);

    imprimir('Clave "' + CLAVE_PREFERENCIAS + '" eliminada.');
    imprimir('removeItem no da error aunque la clave no existiera.');
    imprimir('Comprobación con getItem:', localStorage.getItem(CLAVE_PREFERENCIAS)); // null

    saludo.textContent = 'Preferencias borradas. Recarga para comprobarlo.';
  });

  // --- El deslizador actualiza el número en vivo (evento input) ------------
  rangoTamano.addEventListener('input', function () {
    textoTamano.textContent = rangoTamano.value;
    document.documentElement.style.setProperty('--tamano-consola', rangoTamano.value + 'px');
  });

  // ==========================================================================
  // 4. sessionStorage
  // ==========================================================================

  /*
    Misma API exactamente (setItem, getItem...), pero:
      - Vive solo mientras la pestaña esté abierta.
      - Cada pestaña tiene el SUYO propio, aunque sea la misma página.

    Pruébalo: pulsa varias veces el botón, recarga (el número sigue), y luego
    abre la página en una pestaña NUEVA: allí empieza otra vez en 1.

    Se usa para cosas temporales: el paso actual de un asistente, el borrador
    de un formulario largo, la posición del scroll...
  */
  const CLAVE_VISITAS = 'fs2-07-visitas-pestana';

  document.getElementById('btn-visitas').addEventListener('click', function () {
    titulo('4. sessionStorage');

    // getItem devuelve texto o null. El operador || pone 0 cuando es null.
    // Number() convierte ese texto a número para poder sumar.
    const anterior = Number(sessionStorage.getItem(CLAVE_VISITAS) || 0);
    const actual = anterior + 1;

    sessionStorage.setItem(CLAVE_VISITAS, actual);

    imprimir('Pulsaciones en ESTA pestaña: ' + actual);
    imprimir('Recarga (F5): el número se mantiene.');
    imprimir('Abre la página en otra pestaña: allí empezará de cero.');
    imprimir('Cierra la pestaña y vuelve a abrirla: también empezará de cero.');
  });

  // ==========================================================================
  // 5. clear(): EL BOTÓN PELIGROSO
  // ==========================================================================

  /*
    clear() borra TODAS las claves del sitio, no solo las tuyas. Si tu página
    comparte dominio con otras aplicaciones, te las llevas por delante.

    ✅ BUENA PRÁCTICA: en un proyecto real, borra tus claves una a una (o
    filtrando por prefijo) en lugar de usar clear().

    Aquí usamos confirm() DENTRO de un manejador de clic. Nunca lo pongas en
    la carga de la página: bloquearía el navegador antes de mostrar nada.
  */
  document.getElementById('btn-clear').addEventListener('click', function () {
    titulo('5. clear()');

    const seguro = window.confirm(
      'Esto borrará TODAS las claves de este sitio, incluidas las tareas del proyecto. ¿Continuar?'
    );

    if (!seguro) {
      imprimir('Operación cancelada por el usuario. No se ha borrado nada.');
      return;
    }

    imprimir('Claves antes de clear(): ' + localStorage.length);
    localStorage.clear();
    imprimir('Claves después de clear(): ' + localStorage.length);
    imprimir('Recarga la página: verás que las tareas también han desaparecido.');

    // Alternativa segura, comentada para explicarla en clase:
    //   Object.keys(localStorage)
    //     .filter((clave) => clave.startsWith('fs2-07-'))
    //     .forEach((clave) => localStorage.removeItem(clave));
  });

  // ==========================================================================
  // 6. EL EVENTO 'storage': COMUNICACIÓN ENTRE PESTAÑAS
  // ==========================================================================

  /*
    Cuando una pestaña cambia el localStorage, TODAS LAS DEMÁS pestañas del
    mismo sitio reciben un evento 'storage' en window.
    La pestaña que hace el cambio NO lo recibe (ella ya lo sabe).

    Para verlo: abre esta página en dos pestañas, ponlas una al lado de la
    otra y guarda preferencias en una de ellas.
  */
  window.addEventListener('storage', function (evento) {
    titulo('6. Evento storage (cambio en otra pestaña)');
    imprimir('Clave modificada : ' + evento.key);
    imprimir('Valor anterior   : ' + evento.oldValue);
    imprimir('Valor nuevo      : ' + evento.newValue);
  });

  /* ==========================================================================
   * EJERCICIOS PROPUESTOS · archivo 05
   * --------------------------------------------------------------------------
   * 1) Guarda también en las preferencias si el usuario prefiere ver las
   *    consolas expandidas, con un checkbox nuevo, y restáuralo al cargar.
   *
   * 2) Añade un botón "Exportar preferencias" que muestre en la consola visual
   *    el JSON con formato bonito. Pista: JSON.stringify(obj, null, 2).
   *
   * 3) Cambia el botón de clear() por otro que borre SOLO las claves que
   *    empiecen por "fs2-07-". Pista: Object.keys(localStorage), filter y
   *    startsWith.
   *
   * 4) Guarda en sessionStorage la posición del scroll cada vez que el usuario
   *    se desplaza, y restáurala al recargar. Pista: window.scrollY y
   *    window.scrollTo(0, valor).
   *
   * 5) (Reto) Escribe dos funciones genéricas, guardar(clave, valor) y
   *    leer(clave, valorPorDefecto), que hagan el stringify/parse y el
   *    try/catch por ti, y reescribe esta sección usándolas. Es exactamente lo
   *    que hace cualquier librería real de almacenamiento.
   * ========================================================================== */
})();
