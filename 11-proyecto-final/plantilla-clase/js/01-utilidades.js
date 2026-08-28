/**
 * ============================================================================
 * ARCHIVO: js/01-utilidades.js
 * PROYECTO: 11 · Proyecto final integrador: tienda con carrito (TechStore)
 * ----------------------------------------------------------------------------
 * TEMAS DEL CURSO QUE SE APLICAN AQUÍ
 *   · Proyecto 01 (Fundamentos)  -> tipos, conversión de números, operadores,
 *                                   plantillas de texto con backticks.
 *   · Proyecto 03 (Funciones)    -> funciones puras, parámetros por defecto,
 *                                   parámetros rest (...), funciones flecha.
 *   · Proyecto 06 (DOM)          -> document.getElementById, textContent.
 *   · Proyecto 09 (Asincronía)   -> una promesa envuelta en una función
 *                                   (`esperar`) para simular retardos.
 *   · Proyecto 10 (JS moderno)   -> patrón "namespace", encadenamiento
 *                                   opcional (?.) y fusión nula (??).
 *
 * QUÉ ES ESTE ARCHIVO
 * La caja de herramientas de la aplicación. Aquí no hay nada específico de
 * una tienda: son funciones genéricas que cualquier proyecto podría usar
 * (formatear un precio, escapar texto, esperar, escribir en la bitácora).
 *
 * EL PATRÓN "NAMESPACE" (ESPACIO DE NOMBRES)
 * En este proyecto los cinco archivos JS necesitan compartir cosas. Como no
 * podemos usar módulos ES (import/export) sin un servidor local, usamos la
 * técnica clásica anterior: UN ÚNICO objeto global llamado TIENDA al que cada
 * archivo le cuelga su parte.
 *
 *   window.TIENDA.utiles    <- lo pone este archivo
 *   window.TIENDA.datos     <- lo pone 02-datos.js
 *   window.TIENDA.Carrito   <- lo pone 03-clases.js
 *   window.TIENDA.ui        <- lo pone 04-ui.js
 *
 * Ventaja: solo "ensuciamos" el ámbito global con UNA variable en lugar de
 * cincuenta. Todo lo demás vive dentro de la IIFE y es invisible desde fuera.
 *
 * QUÉ ES UNA IIFE
 * Immediately Invoked Function Expression: una función que se define y se
 * ejecuta en el acto, (function () { ... })(). Todo lo que se declara dentro
 * es privado. Sin ella, dos archivos que declaren `const contenedor` en el
 * ámbito global provocarían el error "Identifier 'contenedor' has already
 * been declared" y la página entera dejaría de funcionar.
 *
 * ÍNDICE DEL ARCHIVO
 *   1. Creación del espacio de nombres TIENDA.
 *   2. Consola visual: imprimir, titulo y limpiar.
 *   3. Formato de números y precios con Intl.NumberFormat.
 *   4. Texto: escapar HTML, normalizar para buscar, recortar.
 *   5. Números: limitar un valor a un rango.
 *   6. Asincronía: la función esperar().
 *   7. Identificadores: número de pedido.
 *   8. Publicación de las utilidades en TIENDA.utiles.
 *   9. Ejercicios propuestos.
 * ----------------------------------------------------------------------------
 * ▶ PLANTILLA DE CLASE
 * Este archivo es la versión POR COMPLETAR. La explicación está entera; lo que
 * falta es el código, que se escribe en vivo siguiendo los bloques
 * "TODO (en clase)". La solución está en ../../js/01-utilidades.js
 *
 * Lo único que ya viene escrito es la SECCIÓN 2 (la consola visual). Es
 * andamiaje, no materia: sin imprimir() no se puede demostrar nada en pantalla
 * desde el primer minuto.
 * ============================================================================
 */

/*
  Esta línea se repite al principio de los cinco archivos. Se lee así:
  "TIENDA es lo que ya valga TIENDA; y si todavía no existe, un objeto vacío".
  El operador || devuelve el primer valor "verdadero" que encuentra, así que
  el objeto vacío solo se crea la primera vez. De este modo el orden de carga
  de los archivos no puede romper nada.
*/
window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';
  // 'use strict' activa el modo estricto: convierte en error varios descuidos
  // que en modo normal pasan silenciosamente (como escribir una variable sin
  // declararla). ✅ BUENA PRÁCTICA: ponerlo siempre al inicio de la IIFE.

  // ==========================================================================
  // 2. CONSOLA VISUAL
  // ==========================================================================
  /*
    En clase no siempre está abierto DevTools, y el proyector no llega a leerse.
    Por eso la aplicación escribe sus mensajes en DOS sitios a la vez: la
    consola real del navegador y un bloque <pre> visible dentro de la página.
    El id de ese bloque se guarda en una constante: si mañana cambia el HTML,
    se toca un solo sitio.
  */
  const ID_SALIDA = 'salida';

  /**
   * imprimir(): muestra un mensaje en la consola del navegador (F12) y también
   * en el bloque visual de la página.
   *
   * Usa PARÁMETROS REST (...mensajes): recoge todos los argumentos que reciba,
   * sean uno o siete, dentro de un array llamado `mensajes`.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes);                       // Salida clásica de DevTools

    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return;                            // Si no hay consola visual, no hacemos nada

    const texto = mensajes
      .map((m) => {
        // Los objetos y arrays se ven fatal como "[object Object]".
        // JSON.stringify con 2 espacios de indentación los deja legibles.
        if (typeof m === 'object' && m !== null) {
          try {
            return JSON.stringify(m, null, 2);
          } catch (error) {
            // JSON.stringify falla si el objeto tiene referencias circulares.
            // Nunca dejamos que un log rompa la aplicación.
            return String(m);
          }
        }
        return String(m);
      })
      .join(' ');

    salida.textContent += texto + '\n';
    // Autoscroll: la bitácora siempre muestra la última línea escrita.
    salida.scrollTop = salida.scrollHeight;
  }

  /**
   * titulo(): imprime un separador visual antes de cada bloque.
   * Facilita muchísimo seguir la bitácora cuando hay muchos mensajes.
   */
  function titulo(texto) {
    imprimir('\n' + '='.repeat(60));   // repeat(60) dibuja 60 signos igual
    imprimir(texto.toUpperCase());
    imprimir('='.repeat(60));
  }

  /** limpiarConsola(): vacía el bloque visual (no toca la consola real). */
  function limpiarConsola() {
    const salida = document.getElementById(ID_SALIDA);
    if (salida) salida.textContent = '';
  }

  // ==========================================================================
  // 3. FORMATO DE NÚMEROS Y PRECIOS CON Intl.NumberFormat
  // ==========================================================================
  /*
    NUNCA se muestran precios con concatenación manual del tipo
    '$' + precio. Cada país escribe los números de forma distinta:

        España      1.299,00 €
        México      $1,299.00
        Argentina   $ 1.299,00

    Intl.NumberFormat es un objeto del propio navegador que conoce todas esas
    reglas. Se crea UNA VEZ (crearlo es costoso) y se reutiliza siempre.

    Para adaptarlo a otro país basta cambiar estas dos constantes:
      'es-ES' -> 'es-MX', 'es-AR', 'es-CO', 'es-CL'...
      'EUR'   -> 'MXN', 'ARS', 'COP', 'CLP'...
  */
  // TODO (en clase):
  //   1. Declara const IDIOMA = 'es-ES'; y const MONEDA = 'EUR';
  //   2. Crea const formateadorPrecio = new Intl.NumberFormat(IDIOMA, { ... })
  //      con las opciones: style: 'currency', currency: MONEDA,
  //      minimumFractionDigits: 2 y maximumFractionDigits: 2.
  //   3. Crea const formateadorNumero = new Intl.NumberFormat(IDIOMA);
  //      (sin opciones: solo separadores de miles).
  //   Comprueba en la consola del navegador: formateadorPrecio.format(1299.5)
  //   Resultado esperado: "1.299,50 €"
  //   (aprox. 10 líneas)

  /**
   * formatearPrecio(): convierte 1299.5 en "1.299,50 €".
   * Es una FUNCIÓN PURA: con la misma entrada devuelve siempre la misma
   * salida y no modifica nada de fuera. Las funciones puras son las más
   * fáciles de probar y las que menos sorpresas dan.
   */
  // TODO (en clase):
  //   1. function formatearPrecio(numero) { ... }
  //   2. Dentro: const valor = Number(numero);  // protege si llega un texto
  //   3. Si !Number.isFinite(valor) devuelve formateadorPrecio.format(0).
  //      ⚠️ ERROR COMÚN: dar por hecho que el dato siempre es un número válido.
  //      Number.isFinite descarta NaN, Infinity y -Infinity de una sola vez.
  //   4. Si no, devuelve formateadorPrecio.format(valor).
  //   Prueba: imprimir(formatearPrecio(89.9), formatearPrecio('hola'));
  //   Resultado esperado en pantalla: 89,90 € 0,00 €
  //   (aprox. 5 líneas)

  /** formatearNumero(): separadores de miles sin símbolo de moneda. */
  // TODO (en clase):
  //   1. function formatearNumero(numero) y devuelve
  //      formateadorNumero.format(Number(numero) || 0);
  //   Resultado esperado: formatearNumero(16000) -> "16.000"
  //   (aprox. 3 líneas)

  /**
   * porcentaje(): 0.21 -> "21 %". Se usa para la etiqueta del IVA.
   * Math.round evita que salga "21.000000000000004 %" por la precisión
   * de los números decimales (tema del proyecto 01).
   */
  // TODO (en clase):
  //   1. function porcentaje(fraccion) y devuelve
  //      Math.round(fraccion * 100) + ' %';
  //   Prueba: imprimir(porcentaje(0.21));
  //   Resultado esperado en pantalla: 21 %
  //   (aprox. 3 líneas)

  // ==========================================================================
  // 4. UTILIDADES DE TEXTO
  // ==========================================================================
  /**
   * escaparHTML(): convierte los caracteres peligrosos en entidades.
   *
   * POR QUÉ ES IMPORTANTE
   * Vamos a construir tarjetas con innerHTML y plantillas de texto. Si el
   * nombre de un producto (o lo que escriba un usuario) contiene
   * "<img onerror=...>", el navegador lo interpretaría como HTML de verdad.
   * Eso se llama XSS y es la vulnerabilidad web más común.
   *
   * ✅ BUENA PRÁCTICA: escapar SIEMPRE cualquier dato que no controlemos
   * antes de meterlo en innerHTML. La alternativa es usar textContent, que
   * nunca interpreta HTML, pero entonces no podríamos usar plantillas.
   */
  // TODO (en clase):
  //   1. function escaparHTML(texto) que devuelva String(texto) encadenando
  //      cinco .replace() con expresiones regulares globales (/x/g):
  //        &  -> &amp;      ¡EL & VA PRIMERO! Si no, se escaparía dos veces.
  //        <  -> &lt;
  //        >  -> &gt;
  //        "  -> &quot;
  //        '  -> &#39;
  //   Prueba: imprimir(escaparHTML('<b>hola</b>'));
  //   Resultado esperado en pantalla: &lt;b&gt;hola&lt;/b&gt;
  //   (aprox. 8 líneas)

  /**
   * normalizarTexto(): prepara un texto para poder buscar en él.
   *
   * Pasa todo a minúsculas y QUITA LAS TILDES. Así, escribir "raton" en el
   * buscador encuentra "Ratón inalámbrico", que es lo que espera cualquiera.
   *
   * Cómo funciona el truco:
   *   normalize('NFD') separa cada letra acentuada en dos piezas: la letra
   *   base y la tilde suelta. Después borramos esas tildes sueltas, que en
   *   Unicode ocupan el rango \u0300 a \u036f (los llamados 'diacríticos').
   */
  // TODO (en clase):
  //   1. function normalizarTexto(texto) que devuelva, encadenado:
  //        String(texto ?? '')   // ?? protege contra null y undefined
  //        .toLowerCase()
  //        .normalize('NFD')
  //        .replace(/[\u0300-\u036f]/g, '')   // borra las tildes ya separadas
  //        .trim()
  //   Prueba: imprimir(normalizarTexto('  Ratón Inalámbrico '));
  //   Resultado esperado en pantalla: raton inalambrico
  //   (aprox. 7 líneas)

  /**
   * recortar(): corta un texto largo y añade puntos suspensivos.
   * `maximo = 90` es un PARÁMETRO POR DEFECTO: si no se pasa, vale 90.
   */
  // TODO (en clase):
  //   1. function recortar(texto, maximo = 90).
  //   2. const limpio = String(texto ?? '');
  //   3. Si limpio.length <= maximo, devuélvelo tal cual (salida temprana).
  //   4. Si no, devuelve limpio.slice(0, maximo - 1).trimEnd() + '…';
  //   Prueba: imprimir(recortar('Teclado mecánico Aurora TKL', 10));
  //   Resultado esperado en pantalla: Teclado m…
  //   (aprox. 5 líneas)

  /**
   * estrellas(): convierte 4.6 en "★★★★★ 4.6" (cinco estrellas rellenas
   * hasta la valoración y huecas el resto).
   */
  // TODO (en clase):
  //   1. function estrellas(valoracion).
  //   2. const nota = limitar(Number(valoracion) || 0, 0, 5);
  //      (limitar() se escribe en la sección 5; se puede llamar antes porque
  //      las declaraciones `function` se elevan — hoisting del proyecto 03.)
  //   3. const llenas = Math.round(nota);
  //   4. Devuelve '★'.repeat(llenas) + '☆'.repeat(5 - llenas) + ' ' + nota.toFixed(1);
  //   Prueba: imprimir(estrellas(4.6));
  //   Resultado esperado en pantalla: ★★★★★ 4.6
  //   (aprox. 5 líneas)

  // ==========================================================================
  // 5. UTILIDADES NUMÉRICAS
  // ==========================================================================
  /**
   * limitar(): obliga a un número a quedarse dentro de un rango.
   * limitar(9, 1, 5) -> 5      limitar(-2, 1, 5) -> 1      limitar(3, 1, 5) -> 3
   *
   * Se lee de dentro hacia fuera:
   *   Math.max(minimo, valor) sube el valor si se quedó corto.
   *   Math.min(..., maximo)   lo baja si se pasó.
   *
   * Es la función que impide que el carrito acepte cantidades imposibles.
   */
  // TODO (en clase):
  //   1. function limitar(valor, minimo, maximo) que devuelva
  //      Math.min(Math.max(valor, minimo), maximo);
  //   Prueba: imprimir(limitar(9, 1, 5), limitar(-2, 1, 5), limitar(3, 1, 5));
  //   Resultado esperado en pantalla: 5 1 3
  //   (aprox. 3 líneas)

  /**
   * redondearDinero(): deja un número con dos decimales exactos.
   *
   * ⚠️ ERROR COMÚN con los decimales (visto en el proyecto 01):
   *   0.1 + 0.2  ->  0.30000000000000004
   * Los números decimales se guardan en binario y algunos no son exactos.
   * En dinero eso se nota, así que redondeamos a dos decimales al final de
   * cada cálculo. El truco *100 / 100 es el clásico.
   */
  // TODO (en clase):
  //   1. function redondearDinero(numero) que devuelva
  //      Math.round((Number(numero) + Number.EPSILON) * 100) / 100;
  //   Demostración recomendada en el proyector:
  //      imprimir(0.1 + 0.2);                    -> 0.30000000000000004
  //      imprimir(redondearDinero(0.1 + 0.2));   -> 0.3
  //   (aprox. 3 líneas)

  // ==========================================================================
  // 6. ASINCRONÍA: LA FUNCIÓN esperar()
  // ==========================================================================
  /**
   * esperar(): devuelve una promesa que se resuelve pasados X milisegundos.
   *
   * Es la pieza que convierte el viejo setTimeout (basado en callbacks) en
   * algo que se puede usar con await:
   *
   *    await esperar(800);   // "quédate aquí 800 ms y sigue"
   *
   * Repasa el proyecto 09: `new Promise(resolve => ...)` crea una promesa que
   * queda PENDIENTE hasta que alguien llama a resolve().
   */
  // TODO (en clase):
  //   1. function esperar(milisegundos = 500).
  //   2. Devuelve new Promise((resolve) => { setTimeout(resolve, milisegundos); });
  //   Prueba: esperar(1000).then(() => imprimir('Han pasado 1000 ms'));
  //   Resultado esperado en pantalla (un segundo después): Han pasado 1000 ms
  //   (aprox. 5 líneas)

  // ==========================================================================
  // 7. IDENTIFICADORES
  // ==========================================================================
  /**
   * generarNumeroPedido(): crea algo como "TS-2026-4831".
   *
   * Math.random() devuelve un decimal entre 0 (incluido) y 1 (excluido).
   * Multiplicando y redondeando hacia abajo con Math.floor conseguimos un
   * entero dentro del rango que queramos. padStart rellena con ceros para
   * que el número siempre tenga cuatro cifras.
   */
  // TODO (en clase):
  //   1. function generarNumeroPedido().
  //   2. const anio = new Date().getFullYear();
  //   3. const azar = Math.floor(Math.random() * 10000);
  //   4. Devuelve la plantilla `TS-${anio}-${String(azar).padStart(4, '0')}`
  //   Resultado esperado en pantalla: algo como TS-2026-0473
  //   (aprox. 5 líneas)

  /**
   * fechaLegible(): "26 de agosto de 2026". Intl.DateTimeFormat es el
   * hermano de Intl.NumberFormat, pero para fechas.
   */
  // TODO (en clase):
  //   1. function fechaLegible(fecha = new Date()).
  //   2. Devuelve new Intl.DateTimeFormat(IDIOMA, {
  //        day: 'numeric', month: 'long', year: 'numeric'
  //      }).format(fecha);
  //   Resultado esperado en pantalla: 27 de agosto de 2026
  //   (aprox. 7 líneas)

  /** hora(): "14:05:32". Se usa para poner marca de tiempo en la bitácora. */
  // TODO (en clase):
  //   1. function hora() que devuelva new Date().toLocaleTimeString(IDIOMA);
  //   Resultado esperado en pantalla: 14:05:32
  //   (aprox. 3 líneas)

  // ==========================================================================
  // 8. PUBLICACIÓN EN EL ESPACIO DE NOMBRES
  // ==========================================================================
  /*
    Todo lo anterior es privado dentro de esta IIFE. Solo lo que colguemos de
    TIENDA será visible para los demás archivos. Es exactamente la misma idea
    que `export` en los módulos ES del proyecto 10, hecha a mano.

    Aquí usamos la SINTAXIS ABREVIADA de objetos: escribir `imprimir` equivale
    a escribir `imprimir: imprimir`.
  */
  // La plantilla publica ya lo único que existe de partida: la consola visual.
  // Sin esta publicación, los archivos 02 a 05 no encontrarían TIENDA.utiles y
  // la página arrancaría con un error, así que se deja escrita.
  TIENDA.utiles = {
    imprimir,
    titulo,
    limpiarConsola
  };

  // TODO (en clase):
  //   Según vayas escribiendo las secciones 3 a 7, añade cada nombre a este
  //   objeto TIENDA.utiles. Al terminar debe contener EXACTAMENTE estas 18
  //   claves, en este orden:
  //     imprimir, titulo, limpiarConsola, formatearPrecio, formatearNumero,
  //     porcentaje, escaparHTML, normalizarTexto, recortar, estrellas,
  //     limitar, redondearDinero, esperar, generarNumeroPedido, fechaLegible,
  //     hora, IDIOMA, MONEDA
  //   Comprobación en la consola del navegador:
  //     Object.keys(TIENDA.utiles).length   ->   18
  //   (aprox. 20 líneas en total con el objeto ya completo)

  // Primer mensaje de la bitácora. Se ejecuta en cuanto carga el archivo.
  // En la solución esta línea lleva la marca de tiempo: `[${hora()}] ...`.
  // Aquí va sin ella porque hora() todavía no existe.
  imprimir('01-utilidades.js cargado (PLANTILLA). TIENDA.utiles tiene por ahora imprimir, titulo y limpiarConsola.');
})(window.TIENDA);


/**
 * ============================================================================
 * EJERCICIOS PROPUESTOS (archivo 01-utilidades.js)
 * ----------------------------------------------------------------------------
 * 1. FÁCIL. Cambia IDIOMA y MONEDA a los de tu país y comprueba que todos los
 *    precios de la tienda cambian de formato a la vez. ¿Por qué basta con
 *    tocar dos constantes?
 *
 * 2. FÁCIL. Añade una utilidad `mayusculaInicial(texto)` que convierta
 *    "teclado mecánico" en "Teclado mecánico" y úsala en los botones de
 *    categoría.
 *
 * 3. MEDIO. Escribe `formatearPrecioSinDecimales(numero)` usando otra
 *    instancia de Intl.NumberFormat con maximumFractionDigits: 0. Úsala para
 *    mostrar el precio en la miniatura del carrito.
 *
 * 4. MEDIO. Amplía `estrellas()` para que acepte medias estrellas: si la
 *    valoración es 4.5 debería devolver "★★★★⯨" (o el carácter que prefieras).
 *
 * 5. DIFÍCIL. Crea `debounce(funcion, ms)`: devuelve una nueva función que
 *    solo ejecuta `funcion` cuando han pasado `ms` milisegundos sin que se la
 *    vuelva a llamar. Aplícala al buscador para no filtrar en cada tecla.
 *    Pista: necesitarás un closure y setTimeout/clearTimeout.
 * ============================================================================
 */
