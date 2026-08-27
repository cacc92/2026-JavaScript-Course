/**
 * ============================================================
 * ARCHIVO: js/00-utilidades.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: la "consola visual" del proyecto.
 *
 * ¿POR QUÉ EXISTE ESTE ARCHIVO?
 * En clase no siempre tenemos abiertas las herramientas de
 * desarrollo del navegador (tecla F12). Para que todo el mundo
 * vea los resultados directamente en la página, creamos aquí un
 * par de funciones que escriben el mismo mensaje en DOS sitios:
 *   1. La consola real del navegador  ->  console.log()
 *   2. Un bloque <pre> de la página   ->  textContent
 *
 * QUÉ SE APRENDE AQUÍ (aunque lo veremos a fondo más adelante):
 *  - Que una función puede recibir un número indefinido de
 *    argumentos usando el parámetro rest (...mensajes).
 *  - Que una función puede DEVOLVER un objeto lleno de funciones:
 *    eso es una "fábrica de funciones" y usa closures.
 *  - Cómo se protege el código dentro de una IIFE.
 * ============================================================
 */

/*
 * ¿QUÉ ES ESTO QUE ENVUELVE TODO EL ARCHIVO?
 *
 *     (function () { ... })();
 *
 * Se llama IIFE (Immediately Invoked Function Expression):
 * "expresión de función invocada inmediatamente".
 * Es una función que se define y se ejecuta en el acto.
 *
 * La usamos porque el index.html carga VARIOS archivos .js.
 * Si dos archivos distintos declararan una variable global con el
 * mismo nombre, el navegador lanzaría el error:
 *     "Identifier 'x' has already been declared"
 * Al meter cada archivo dentro de su propia función, sus variables
 * viven en el ámbito de esa función y no se pisan entre archivos.
 *
 * Lo estudiaremos con calma en js/03-scope-y-closures.js.
 */
(function () {
  // 'use strict' activa el "modo estricto": el navegador es más
  // severo y avisa de errores que en modo normal pasarían callados.
  // BUENA PRÁCTICA: ponerlo siempre al principio del código.
  'use strict';

  // ============================================================
  // 1. FORMATEAR UN VALOR PARA MOSTRARLO COMO TEXTO
  // ============================================================

  /**
   * formatear(): convierte CUALQUIER valor de JavaScript en un texto
   * legible para pintarlo en la consola visual.
   *
   * Un <pre> solo entiende texto. Si le pasamos un objeto sin
   * convertirlo, veríamos el inútil "[object Object]". Por eso
   * tratamos cada tipo de dato por separado.
   *
   * @param {*} valor - cualquier dato: número, texto, objeto, función...
   * @returns {string} representación en texto de ese valor
   */
  function formatear(valor) {
    // Si ya es texto, no hay nada que hacer.
    if (typeof valor === 'string') return valor;

    // Las funciones también son valores y tienen la propiedad .name.
    // Aquí se ve por primera vez algo clave del proyecto:
    // en JavaScript una función ES un dato que se puede inspeccionar.
    if (typeof valor === 'function') {
      return valor.name ? 'f ' + valor.name + '()' : 'f anonima()';
    }

    // undefined y null son casos especiales: String(undefined) funciona,
    // pero los tratamos aparte para dejarlo explícito en clase.
    if (valor === undefined) return 'undefined';
    if (valor === null) return 'null';

    // Objetos y arrays: JSON.stringify con 2 espacios de indentación
    // los muestra "bonitos", en varias líneas.
    if (typeof valor === 'object') {
      try {
        return JSON.stringify(valor, null, 2);
      } catch (error) {
        // ⚠️ ERROR COMÚN: JSON.stringify falla con referencias circulares
        // (un objeto que se contiene a sí mismo). Lo capturamos por seguridad.
        return String(valor);
      }
    }

    // Para el resto (números, booleanos, BigInt, Symbol) String() basta.
    return String(valor);
  }

  // ============================================================
  // 2. LOCALIZAR EL BLOQUE <pre> DONDE ESCRIBIR
  // ============================================================

  /**
   * obtenerSalida(): busca en la página el elemento con ese id.
   * Devuelve null si no existe, y quien la llame decidirá qué hacer.
   *
   * @param {string} idElemento - por ejemplo 'salida-01'
   * @returns {HTMLElement|null}
   */
  function obtenerSalida(idElemento) {
    return document.getElementById(idElemento);
  }

  // ============================================================
  // 3. IMPRIMIR UN MENSAJE
  // ============================================================

  /**
   * imprimirEn(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la página, para que se vea en clase sin
   * abrir las herramientas de desarrollo.
   *
   * Fíjate en `...mensajes`: es un PARÁMETRO REST. Recoge en un array
   * todos los argumentos que lleguen a partir de esa posición, así que
   * podemos llamar a la función con uno, tres o diez valores.
   *
   * @param {string} idElemento - id del <pre> de destino
   * @param {...*} mensajes - uno o varios valores a mostrar
   */
  function imprimirEn(idElemento, ...mensajes) {
    // 1) Salida clásica: la consola de las herramientas de desarrollo.
    //    El spread (...) vuelve a "desempaquetar" el array en argumentos
    //    sueltos, para que console.log los muestre uno al lado del otro.
    console.log('[' + idElemento + ']', ...mensajes);

    // 2) Salida visual dentro de la página.
    const salida = obtenerSalida(idElemento);
    if (!salida) return;              // si esa consola no existe, no hacemos nada

    // .map() aplica formatear() a cada elemento y devuelve un array nuevo.
    // .join(' ') une ese array en un único texto separado por espacios.
    const texto = mensajes.map(formatear).join(' ');

    // += añade al final; '\n' es el carácter de salto de línea.
    // Usamos textContent (y no innerHTML) para que nada de lo que
    // imprimamos se interprete como HTML. ✅ BUENA PRÁCTICA de seguridad.
    salida.textContent += texto + '\n';
  }

  // ============================================================
  // 4. IMPRIMIR UN SEPARADOR DE SECCIÓN
  // ============================================================

  /**
   * tituloEn(): pinta un separador visible antes de cada bloque de
   * ejemplos, para que la consola no sea un muro de texto plano.
   *
   * @param {string} idElemento - id del <pre> de destino
   * @param {string} texto - título del bloque
   */
  function tituloEn(idElemento, texto) {
    console.log('%c' + texto, 'color:#38bdf8;font-weight:bold');

    const salida = obtenerSalida(idElemento);
    if (!salida) return;

    // '-'.repeat(n) crea una cadena con n guiones. Calculamos el largo
    // en función del título, con un mínimo de 34 para que quede parejo.
    const ancho = Math.max(texto.length + 6, 34);
    const linea = '-'.repeat(ancho);

    // Si ya había texto, dejamos una línea en blanco antes del separador.
    const espacioPrevio = salida.textContent ? '\n' : '';

    salida.textContent += espacioPrevio + linea + '\n   ' + texto + '\n' + linea + '\n';
  }

  // ============================================================
  // 5. FÁBRICA DE CONSOLAS (adelanto de closures)
  // ============================================================

  /**
   * crearConsola(): recibe el id de un <pre> y DEVUELVE UN OBJETO con
   * funciones ya "atadas" a ese id. Así, en cada archivo temático
   * escribimos simplemente imprimir('hola') sin repetir el id 50 veces.
   *
   * Esto es una FÁBRICA DE FUNCIONES y funciona gracias a los CLOSURES:
   * las funciones devueltas siguen recordando el valor de `idElemento`
   * mucho después de que crearConsola() haya terminado de ejecutarse.
   * Es exactamente el mecanismo que estudiaremos en la sección 3.
   *
   * @param {string} idElemento - id del <pre> de destino
   * @returns {{imprimir: Function, titulo: Function, limpiar: Function}}
   */
  function crearConsola(idElemento) {
    return {
      imprimir: function (...mensajes) {
        imprimirEn(idElemento, ...mensajes);
      },
      titulo: function (texto) {
        tituloEn(idElemento, texto);
      },
      limpiar: function () {
        const salida = obtenerSalida(idElemento);
        if (salida) salida.textContent = '';
      }
    };
  }

  // ============================================================
  // 6. PUBLICAR LAS UTILIDADES PARA LOS DEMÁS ARCHIVOS
  // ------------------------------------------------------------
  // Todo lo de arriba vive encerrado dentro de esta IIFE, así que
  // ningún otro archivo podría usarlo... salvo que lo publiquemos.
  // `window` es el objeto global del navegador: lo que colgamos de él
  // queda accesible desde cualquier script de la página.
  //
  // ✅ BUENA PRÁCTICA: exponer UN SOLO objeto (Utilidades) en lugar de
  // cinco variables globales sueltas. Menos riesgo de colisión de nombres.
  // ============================================================
  window.Utilidades = {
    formatear: formatear,
    imprimirEn: imprimirEn,
    tituloEn: tituloEn,
    crearConsola: crearConsola
  };
})();
