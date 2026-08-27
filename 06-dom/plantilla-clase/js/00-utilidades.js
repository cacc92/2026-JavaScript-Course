/**
 * ARCHIVO: js/00-utilidades.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Cómo fabricar una "consola visual" dentro de la propia página,
 *     para que en clase se vea la salida sin abrir DevTools (F12).
 *   - Cómo publicar utilidades compartidas sin ensuciar el espacio global.
 *
 * QUÉ APRENDERÁS
 *   - Qué es una IIFE y por qué la usamos en TODOS los archivos del proyecto.
 *   - Cómo describir un elemento del DOM de forma legible para un humano.
 *   - Cómo una función puede devolver un objeto con varias funciones dentro
 *     (patrón "fábrica", muy usado en JavaScript real).
 *
 * ------------------------------------------------------------------
 * NOTA DE LA PLANTILLA DE CLASE
 *   Este archivo VIENE COMPLETO a propósito. Es ANDAMIAJE, no materia:
 *   sin él no existe imprimir() ni titulo() y no se podría enseñar nada
 *   en pantalla desde el primer minuto de clase.
 *
 *   Los archivos 01 a 07 sí están vacíos y se escriben en vivo. Todos
 *   ellos empiezan pidiéndole a este archivo su consola visual con:
 *
 *       const consola = window.Consola.crear('id-del-pre');
 *
 *   Esa línea también viene ya escrita en cada archivo.
 *
 *   Si quieres, este archivo se puede leer en voz alta en dos minutos
 *   al empezar la clase (IIFE + fábrica + window.Consola) y pasar
 *   directamente al 01.
 * ------------------------------------------------------------------
 */

/*
  ¿POR QUÉ ENVOLVEMOS TODO EN UNA IIFE?
  Una IIFE (Immediately Invoked Function Expression, "función que se invoca a sí
  misma") es una función que se escribe y se ejecuta en el acto:

      (function () { ... })();

  Como esta página carga OCHO archivos .js distintos, si en dos de ellos
  escribiéramos "const caja = ..." el navegador lanzaría el error
  "Identifier 'caja' has already been declared" y la página dejaría de funcionar.
  Al meter cada archivo dentro de una IIFE, sus variables viven encerradas
  dentro de esa función y no chocan con las de los demás archivos.
  Piensa en cada IIFE como una habitación con la puerta cerrada.
*/
(function () {
  // 'use strict' activa el modo estricto: JavaScript avisa de errores que
  // en modo normal pasaría por alto (por ejemplo, usar una variable sin declarar).
  'use strict';

  // ============================================================
  // 1. DESCRIBIR UN ELEMENTO DE FORMA LEGIBLE
  // ============================================================

  /**
   * describir(): convierte un elemento del DOM en un texto corto tipo
   * "<p#persona-objetivo.persona>", parecido a como lo escribiríamos en CSS.
   *
   * Si imprimiéramos el elemento tal cual con JSON.stringify saldría "{}",
   * porque los elementos del DOM no son objetos de datos normales.
   *
   * @param {Element} elemento - cualquier etiqueta del documento
   * @returns {string} descripción corta y legible
   */
  function describir(elemento) {
    // Si no nos pasan un elemento devolvemos un aviso claro en vez de romper.
    if (!elemento || !elemento.tagName) return String(elemento);

    const etiqueta = elemento.tagName.toLowerCase(); // "DIV" -> "div"
    const id = elemento.id ? '#' + elemento.id : ''; // el id, si lo tiene

    // classList es una lista de clases; la convertimos en ".clase1.clase2"
    const clases = elemento.classList.length
      ? '.' + Array.from(elemento.classList).join('.')
      : '';

    return '<' + etiqueta + id + clases + '>';
  }

  // ============================================================
  // 2. FORMATEAR CUALQUIER VALOR PARA LA CONSOLA VISUAL
  // ============================================================

  /**
   * formatear(): traduce cualquier valor a un texto presentable.
   * Trata de forma especial los elementos y las colecciones del DOM,
   * porque son justo lo que más vamos a imprimir en este proyecto.
   *
   * @param {*} valor - lo que sea que queramos mostrar
   * @returns {string}
   */
  function formatear(valor) {
    // 1) ¿Es un elemento del DOM? -> lo describimos
    if (valor instanceof Element) {
      return describir(valor);
    }

    // 2) ¿Es una colección del DOM (NodeList o HTMLCollection) o un array?
    //    Array.from() convierte cualquiera de las tres en un array de verdad.
    const esColeccion =
      valor instanceof NodeList ||
      valor instanceof HTMLCollection ||
      Array.isArray(valor);

    if (esColeccion) {
      const elementos = Array.from(valor).map(formatear); // recursivo
      return '[ ' + elementos.join(', ') + ' ]  (total: ' + elementos.length + ')';
    }

    // 3) ¿Es un objeto normal? -> JSON con sangrado de 2 espacios
    if (typeof valor === 'object' && valor !== null) {
      return JSON.stringify(valor, null, 2);
    }

    // 4) Cualquier otra cosa (número, texto, booleano, undefined...)
    //    ⚠️ ERROR COMÚN: olvidar que String(undefined) es "undefined" (texto),
    //    y no un valor vacío. Aquí nos interesa verlo escrito, así que está bien.
    return String(valor);
  }

  // ============================================================
  // 3. FÁBRICA DE CONSOLAS VISUALES
  // ============================================================

  /*
    Cada sección de la página tiene su propio <pre class="consola">.
    En lugar de escribir la misma función imprimir() ocho veces, hacemos una
    FÁBRICA: le pasas el id del <pre> y te devuelve un objeto con las
    herramientas ya "apuntando" a ese destino.

    Analogía: es como pedir un mando a distancia ya emparejado con un televisor
    concreto. Tú solo pulsas los botones; el mando ya sabe a qué tele hablar.
  */

  /**
   * crear(): devuelve las herramientas de impresión para una consola concreta.
   *
   * @param {string} idDestino - id del <pre> donde se escribirá la salida
   * @returns {{imprimir: Function, titulo: Function, limpiar: Function}}
   */
  function crear(idDestino) {
    // Buscamos el <pre> UNA sola vez y lo guardamos. Buscar el mismo elemento
    // en cada llamada sería trabajo repetido e inútil.
    const salida = document.getElementById(idDestino);

    // ✅ BUENA PRÁCTICA: avisar en la consola real si el HTML no tiene ese id.
    // Así el error se detecta al instante en vez de "no pasa nada y no sé por qué".
    if (!salida) {
      console.warn('No existe ningún elemento con id "' + idDestino + '".');
    }

    /**
     * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
     * COMO en el bloque visual de la página, para que se vea en clase sin
     * abrir DevTools.
     *
     * Los tres puntos (...mensajes) son PARÁMETROS REST: recogen todos los
     * argumentos en un array, así podemos llamar a imprimir('a', 'b', 123).
     */
    function imprimir(...mensajes) {
      console.log(...mensajes); // salida clásica de DevTools

      if (!salida) return; // si la página no tiene consola visual, no hace nada

      const texto = mensajes.map(formatear).join(' ');

      // += añade al final; usamos textContent (nunca innerHTML) porque el texto
      // podría contener < o > y queremos que se vean como texto, no como HTML.
      salida.textContent += texto + '\n';
    }

    /**
     * titulo(): imprime un separador visual antes de cada bloque.
     * Sirve para que la consola no sea un muro de texto ilegible.
     */
    function titulo(texto) {
      if (salida && salida.textContent !== '') {
        salida.textContent += '\n';
      }
      const linea = '─'.repeat(58); // repeat() repite un texto N veces
      imprimir(linea);
      imprimir('▸ ' + texto);
      imprimir(linea);
    }

    /**
     * limpiar(): vacía la consola visual.
     * Poner textContent = '' es la forma más rápida de borrar el contenido.
     */
    function limpiar() {
      if (salida) salida.textContent = '';
    }

    // Devolvemos un objeto con las tres funciones dentro.
    return { imprimir, titulo, limpiar };
  }

  // ============================================================
  // 4. PUBLICAR LAS UTILIDADES PARA LOS DEMÁS ARCHIVOS
  // ============================================================

  /*
    Como cada archivo vive dentro de su IIFE, necesitamos un "buzón" común
    donde dejar lo que queremos compartir. Ese buzón es el objeto global window.

    ✅ BUENA PRÁCTICA: publicar UNA sola variable global (window.Consola) que
    contenga todo, en lugar de diez variables globales sueltas.
    En proyectos con módulos ES esto se resolvería con export/import, pero los
    módulos exigen un servidor local y aquí queremos abrir el HTML con doble clic.
  */
  window.Consola = {
    crear: crear,
    describir: describir,
    formatear: formatear
  };
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Añade a la fábrica una función  aviso(texto)  que imprima el mensaje
   precedido de la marca "[!] ". Úsala desde cualquier otro archivo.

2) Modifica imprimir() para que cada línea empiece por la hora actual en
   formato HH:MM:SS. Pista: new Date().toLocaleTimeString().

3) Crea una función  contarNodos(elemento)  que recorra el elemento recibido
   y devuelva cuántos elementos hay dentro de él (incluyendo los nietos).
   Pista: elemento.querySelectorAll('*').length.

4) Haz que limpiar() se ejecute automáticamente cuando la consola supere las
   500 líneas, para que no crezca sin control.
   Pista: contar cuántos '\n' hay en salida.textContent.

5) RETO: añade un botón flotante en la página que, al pulsarlo, copie el
   contenido de todas las consolas visuales al portapapeles.
   Pista: navigator.clipboard.writeText(texto).
================================================================
*/
