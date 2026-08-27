/**
 * ============================================================================
 * ARCHIVO: js/00-utilidades.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * QUE ENSEÑA ESTE ARCHIVO:
 *  - Cómo crear una "consola visual": un bloque <pre> de la página donde
 *    escribimos lo mismo que mostramos en la consola del navegador (F12).
 *  - El patrón IIFE (función que se ejecuta a sí misma) para no ensuciar
 *    el ámbito global.
 *  - Cómo exponer, de forma controlada, utilidades para el resto de archivos.
 *
 * POR QUE EXISTE ESTE ARCHIVO:
 *  En clase proyectamos la pantalla y no siempre está abierto DevTools.
 *  Si todo lo que enseñamos se ve también en la propia página, la explicación
 *  es mucho más cómoda de seguir.
 *
 * IMPORTANTE: este archivo se carga PRIMERO en el index.html, porque los
 * demás archivos necesitan que window.Utilidades ya exista.
 * ============================================================================
 */

/*
 * ¿Qué es esta envoltura `(function () { ... })();`?
 * Es una IIFE (Immediately Invoked Function Expression): una función que se
 * declara y se ejecuta en el mismo instante.
 * Todo lo que declaremos dentro queda ENCERRADO en ella y no se mezcla con
 * las variables de los demás archivos .js de la página.
 * Sin esto, si dos archivos declaran `const estudiante`, el navegador lanza:
 *   "SyntaxError: Identifier 'estudiante' has already been declared".
 */
(function () {
  // 'use strict' activa el "modo estricto": el navegador es más severo y avisa
  // de errores que, de otro modo, pasarían en silencio. Aquí lo usamos porque
  // este archivo es infraestructura y queremos máxima seguridad.
  'use strict';

  // ==========================================================================
  // 1. FORMATEAR CUALQUIER VALOR COMO TEXTO LEGIBLE
  // ==========================================================================

  /**
   * formatear(): convierte cualquier valor de JavaScript en un texto que se
   * pueda leer cómodamente dentro de un <pre>.
   *
   * ¿Por qué no basta con String(valor)?
   * Porque String({a: 1}) devuelve el inútil "[object Object]".
   * Aquí tratamos objetos, arrays, Map, Set, funciones, null y undefined
   * de forma que en clase se vea EXACTAMENTE qué contiene cada cosa.
   *
   * @param {*} valor cualquier dato de JavaScript
   * @returns {string} representación legible del valor
   */
  function formatear(valor) {
    // Las cadenas se muestran tal cual (sin comillas), para que los mensajes
    // de texto se lean como frases normales.
    if (typeof valor === 'string') return valor;

    // typeof null devuelve "object" (un error histórico de JavaScript),
    // así que hay que comprobarlo aparte y ANTES.
    if (valor === null) return 'null';
    if (valor === undefined) return 'undefined';

    // Las funciones no se pueden convertir a JSON: las describimos.
    if (typeof valor === 'function') {
      return '[funcion ' + (valor.name || 'anonima') + ']';
    }

    // Map y Set tampoco tienen representación JSON (darían "{}"),
    // así que los recorremos a mano.
    if (valor instanceof Map) {
      const pares = [];
      valor.forEach(function (v, k) {
        pares.push('  ' + formatear(k) + ' => ' + formatear(v));
      });
      return 'Map(' + valor.size + ') {\n' + pares.join(',\n') + '\n}';
    }

    if (valor instanceof Set) {
      const items = [];
      valor.forEach(function (v) {
        items.push(formatear(v));
      });
      return 'Set(' + valor.size + ') { ' + items.join(', ') + ' }';
    }

    // WeakMap y WeakSet no son recorribles por diseño (lo veremos en 05).
    if (typeof WeakMap !== 'undefined' && valor instanceof WeakMap) return '[WeakMap]';
    if (typeof WeakSet !== 'undefined' && valor instanceof WeakSet) return '[WeakSet]';

    // Para objetos y arrays usamos JSON.stringify con indentación de 2 espacios.
    // El segundo parámetro (el "replacer") nos permite mostrar cosas que JSON
    // normalmente descarta, como funciones o undefined.
    try {
      return JSON.stringify(
        valor,
        function (clave, val) {
          if (typeof val === 'function') return '[metodo ' + (val.name || 'anonimo') + ']';
          if (val === undefined) return '[undefined]';
          if (val instanceof Map) return '[Map con ' + val.size + ' entradas]';
          if (val instanceof Set) return '[Set con ' + val.size + ' valores]';
          return val;
        },
        2
      );
    } catch (error) {
      // JSON.stringify lanza error si el objeto se referencia a sí mismo
      // (referencia circular). Lo capturamos para que la página no se rompa.
      return '[no se puede mostrar: ' + error.message + ']';
    }
  }

  // ==========================================================================
  // 2. FABRICA DE CONSOLAS VISUALES
  // ==========================================================================

  /**
   * crearConsola(): devuelve un pequeño "kit" de funciones (imprimir, titulo,
   * limpiar) asociado a UN elemento concreto de la página.
   *
   * Analogía: es como repartir un cuaderno distinto a cada sección de la
   * clase; cada una escribe en el suyo y no se pisan entre ellas.
   *
   * @param {string} idElemento id del <pre> donde se escribirá la salida
   * @returns {{imprimir: Function, titulo: Function, limpiar: Function}}
   */
  function crearConsola(idElemento) {
    // Buscamos el elemento UNA vez y lo guardamos. Como los <script> llevan
    // el atributo `defer`, el HTML ya está construido cuando esto se ejecuta.
    const salida = document.getElementById(idElemento);

    /**
     * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
     * COMO en el bloque visual de la página, para que se vea en clase sin
     * abrir DevTools.
     *
     * Acepta cualquier cantidad de argumentos gracias al parámetro REST (...).
     */
    function imprimir(...mensajes) {
      console.log(...mensajes); // salida clásica de DevTools

      if (!salida) return; // si la página no tiene esa consola visual, no hace nada

      const texto = mensajes.map(formatear).join(' ');
      salida.textContent += texto + '\n';
    }

    /**
     * titulo(): imprime un separador visual antes de cada sección para que,
     * al proyectar, se distinga dónde empieza cada tema.
     */
    function titulo(texto) {
      const linea = '─'.repeat(56); // repeat() repite una cadena N veces
      imprimir('\n' + linea);
      imprimir('▶ ' + texto);
      imprimir(linea);
    }

    /**
     * limpiar(): vacía la consola visual (útil para repetir una demo en vivo).
     */
    function limpiar() {
      if (salida) salida.textContent = '';
    }

    // Devolvemos un objeto con las tres funciones.
    // ✅ BUENA PRÁCTICA: shorthand de propiedades. `{ imprimir }` es exactamente
    // lo mismo que `{ imprimir: imprimir }`, pero más corto y legible.
    return { imprimir, titulo, limpiar };
  }

  // ==========================================================================
  // 3. ESCAPAR HTML (seguridad basica)
  // ==========================================================================

  /**
   * escaparHTML(): convierte los caracteres peligrosos (< > & " ') en sus
   * entidades HTML para que un texto NUNCA se interprete como etiquetas.
   *
   * ✅ BUENA PRÁCTICA: siempre que insertemos datos en la página con innerHTML,
   * hay que escaparlos. Si no, un dato como "<img onerror=...>" podría ejecutar
   * código. Esto se conoce como ataque XSS.
   */
  function escaparHTML(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================================================
  // 4. BOTONES "LIMPIAR" AUTOMATICOS
  // ==========================================================================

  /*
   * En el HTML hay botones con el atributo data-limpiar="salida-01".
   * En lugar de añadir un listener a cada botón, escuchamos UN solo clic en
   * todo el documento y comprobamos quién lo originó.
   * Esto se llama DELEGACION DE EVENTOS y lo veremos en profundidad en el
   * proyecto de DOM; aquí lo dejamos hecho para no distraernos del tema.
   */
  document.addEventListener('click', function (evento) {
    // closest() sube por los ancestros buscando el primero que encaje.
    const boton = evento.target.closest('[data-limpiar]');
    if (!boton) return; // el clic fue en otro sitio: no hacemos nada

    const destino = document.getElementById(boton.dataset.limpiar);
    if (destino) destino.textContent = '';
  });

  // ==========================================================================
  // 5. EXPONER LAS UTILIDADES AL RESTO DE ARCHIVOS
  // ==========================================================================

  /*
   * `window` es el objeto global del navegador. Todo lo que le colguemos queda
   * disponible para los demás archivos .js de la página.
   *
   * ✅ BUENA PRÁCTICA: exponer UN solo objeto (un "espacio de nombres") en vez
   * de muchas variables sueltas. Así reducimos al mínimo el riesgo de colisión
   * de nombres con otro código.
   */
  window.Utilidades = { crearConsola, formatear, escaparHTML };
})();
