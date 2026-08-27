/**
 * ARCHIVO: js/01-seleccion.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Qué es exactamente el DOM y qué diferencia hay entre
 *     window, document y Element.
 *   - Los cinco métodos de selección: getElementById,
 *     getElementsByClassName, getElementsByTagName,
 *     querySelector y querySelectorAll.
 *   - La diferencia CRÍTICA entre una colección VIVA (HTMLCollection)
 *     y una lista ESTÁTICA (NodeList).
 *   - Cómo convertir esas colecciones en arrays de verdad.
 *
 * QUÉ APRENDERÁS
 *   - A elegir el método de selección adecuado en cada situación.
 *   - A no confundir "no lo encuentro" (null) con "hay cero elementos".
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Pedimos a la fábrica de 00-utilidades.js dos consolas visuales:
  // una para la sección 1 (teoría) y otra para la sección 2 (selección).
  const teoria = window.Consola.crear('salida-dom');
  const consola = window.Consola.crear('salida-seleccion');

  // ============================================================
  // 1. QUÉ ES EL DOM: EL ÁRBOL DE NODOS
  // ============================================================

  /*
    Cuando el navegador recibe el archivo HTML lo lee de arriba abajo y va
    construyendo en memoria un árbol de objetos. Ese árbol es el DOM.

    Analogía: el HTML es la receta escrita en papel; el DOM es el plato ya
    cocinado que está sobre la mesa. JavaScript no reescribe la receta:
    cambia el plato. Por eso, si recargas la página, todos los cambios
    hechos con JavaScript desaparecen (vuelve a cocinarse desde la receta).
  */

  teoria.titulo('EL DOCUMENTO Y SUS PARTES PRINCIPALES');

  // document es el punto de entrada al árbol. Siempre existe.
  teoria.imprimir('document.title            =', document.title);

  // documentElement es la etiqueta <html>, la raíz del árbol.
  teoria.imprimir('document.documentElement  =', document.documentElement);

  // document.head y document.body son accesos directos muy usados.
  teoria.imprimir('document.head             =', document.head);
  teoria.imprimir('document.body             =', document.body);

  // El idioma que pusimos en <html lang="es"> se lee como una propiedad.
  teoria.imprimir('Idioma declarado          =', document.documentElement.lang);

  /*
    ¿CUÁNTOS NODOS TIENE LA PÁGINA?
    El selector universal '*' significa "cualquier elemento".
    Cuidado: cuenta ELEMENTOS (etiquetas), no nodos de texto.
  */
  const totalElementos = document.querySelectorAll('*').length;
  teoria.imprimir('Elementos totales en la página =', totalElementos);

  // ============================================================
  // 2. WINDOW vs DOCUMENT vs ELEMENT
  // ============================================================

  /*
    - window   : la ventana del navegador. Es el objeto GLOBAL: todo lo que
                 declaras con var o sin declarar acaba colgando de él.
    - document : el documento cargado dentro de esa ventana.
    - Element  : el "molde" (la clase) del que salen todas las etiquetas.

    De hecho, document vive dentro de window: window.document === document.
  */

  teoria.titulo('WINDOW vs DOCUMENT vs ELEMENT');

  // === compara valor Y tipo, sin conversiones. Aquí da true.
  teoria.imprimir('window.document === document ->', window.document === document);

  // Medidas de la ventana: son propiedades de window, no del documento.
  teoria.imprimir('Ancho visible de la ventana  ->', window.innerWidth + 'px');
  teoria.imprimir('Alto visible de la ventana   ->', window.innerHeight + 'px');

  // instanceof pregunta "¿este objeto salió de este molde?".
  const cabecera = document.querySelector('h1');
  teoria.imprimir('El <h1> es instancia de Element ->', cabecera instanceof Element);
  teoria.imprimir('El <h1> es instancia de Node    ->', cabecera instanceof Node);

  // ⚠️ ERROR COMÚN: creer que document es un elemento. No lo es.
  teoria.imprimir('document es instancia de Element ->', document instanceof Element);
  teoria.imprimir('(document es un Document, el CONTENEDOR del árbol)');

  // nodeType es un número que identifica el tipo de nodo:
  // 1 = elemento, 3 = texto, 8 = comentario, 9 = documento.
  teoria.imprimir('nodeType del <h1> ->', cabecera.nodeType, '(1 = elemento)');
  teoria.imprimir('nodeType de document ->', document.nodeType, '(9 = documento)');

  // ============================================================
  // 3. getElementById: EL MÁS RÁPIDO Y DIRECTO
  // ============================================================

  /*
    Busca por el atributo id. Como el id debe ser ÚNICO en toda la página,
    devuelve UN elemento o null si no lo encuentra.

    Fíjate: se escribe SIN almohadilla. El '#' es cosa de CSS.
  */

  consola.titulo('getElementById');

  const cajaSeleccion = document.getElementById('caja-seleccion'); // sin '#'
  consola.imprimir('getElementById("caja-seleccion") ->', cajaSeleccion);

  // ⚠️ ERROR COMÚN: escribir la almohadilla, como en CSS. Devuelve null.
  const fallo = document.getElementById('#caja-seleccion');
  consola.imprimir('getElementById("#caja-seleccion") ->', fallo, '<- ¡null! sobra la #');

  /*
    ⚠️ ERROR COMÚN NÚMERO UNO DEL DOM:
    usar un elemento que vale null. Si el id está mal escrito, la variable
    es null y en cuanto toques una propiedad suya el programa se rompe con
    "Cannot read properties of null". Por eso conviene comprobarlo.
  */
  if (fallo === null) {
    consola.imprimir('Comprobado: no existe. Si intentáramos fallo.textContent, error.');
  }

  // ============================================================
  // 4. getElementsByClassName: COLECCIÓN VIVA
  // ============================================================

  /*
    Devuelve TODOS los elementos que tengan esa clase, dentro de una
    HTMLCollection. La palabra clave es VIVA (live): la colección no es una
    foto fija, es una ventana al documento. Si añades un elemento con esa
    clase, la colección crece SOLA, sin volver a buscar.

    Analogía: es como la lista de asistentes de una sala mirada por una
    ventana. Si entra alguien más, lo ves al instante.
  */

  consola.titulo('getElementsByClassName: colección VIVA');

  const productosVivos = document.getElementsByClassName('producto');
  consola.imprimir('Tipo de dato        ->', productosVivos.constructor.name);
  consola.imprimir('Elementos ahora     ->', productosVivos.length);

  // Se accede por índice, como en un array
  consola.imprimir('Primero (índice 0)  ->', productosVivos[0]);
  consola.imprimir('Texto del primero   ->', productosVivos[0].textContent);

  // ============================================================
  // 5. querySelectorAll: LISTA ESTÁTICA
  // ============================================================

  /*
    querySelectorAll acepta CUALQUIER selector CSS y devuelve una NodeList
    ESTÁTICA: una foto del momento. Si después añades elementos que encajan
    con el selector, la NodeList NO cambia.
  */

  consola.titulo('querySelectorAll: lista ESTÁTICA');

  const productosEstaticos = document.querySelectorAll('#caja-seleccion .producto');
  consola.imprimir('Tipo de dato    ->', productosEstaticos.constructor.name);
  consola.imprimir('Elementos ahora ->', productosEstaticos.length);

  // ============================================================
  // 6. LA PRUEBA DEFINITIVA: VIVA vs ESTÁTICA
  // ============================================================

  /*
    Vamos a añadir un cuarto producto al documento y a mirar otra vez los
    dos contadores. Este experimento es el corazón de la sección:
    la colección viva sube a 4, la lista estática se queda en 3.
  */

  consola.titulo('EXPERIMENTO: añadimos un producto nuevo');

  const productoNuevo = document.createElement('p');   // creamos un <p> en memoria
  productoNuevo.className = 'producto';                // le ponemos la clase
  productoNuevo.textContent = 'Auriculares con cancelación de ruido';
  cajaSeleccion.appendChild(productoNuevo);            // ahora sí entra en el árbol

  consola.imprimir('Colección VIVA     ->', productosVivos.length, '<- ha subido sola');
  consola.imprimir('Lista ESTÁTICA     ->', productosEstaticos.length, '<- sigue igual');

  // Y ahora lo quitamos, para dejar la zona de pruebas como estaba.
  productoNuevo.remove();

  consola.imprimir('Tras eliminarlo:');
  consola.imprimir('Colección VIVA     ->', productosVivos.length, '<- ha bajado sola');
  consola.imprimir('Lista ESTÁTICA     ->', productosEstaticos.length, '<- imperturbable');

  /*
    ⚠️ ERROR COMÚN Y PELIGROSO: recorrer una colección VIVA mientras borras
    elementos de ella. Al eliminar el elemento 0, el que era 1 pasa a ser 0
    y el bucle se salta la mitad de los elementos. Con NodeList estática o
    convirtiendo a array esto no ocurre.
  */

  // ============================================================
  // 7. getElementsByTagName
  // ============================================================

  /*
    Busca por nombre de etiqueta. También devuelve una HTMLCollection viva.
    Hoy se usa poco porque querySelectorAll es más flexible, pero aparece
    en mucho código antiguo y hay que saber leerlo.
  */

  consola.titulo('getElementsByTagName');

  // Podemos buscar en TODO el documento...
  const todosLosParrafos = document.getElementsByTagName('p');
  consola.imprimir('Párrafos en toda la página ->', todosLosParrafos.length);

  // ...o solo DENTRO de un elemento concreto. Esto es clave:
  // los métodos de búsqueda existen también en cualquier Element.
  const parrafosDeLaCaja = cajaSeleccion.getElementsByTagName('p');
  consola.imprimir('Párrafos dentro de la caja ->', parrafosDeLaCaja.length);

  // ============================================================
  // 8. querySelector: EL PRIMERO QUE ENCAJE
  // ============================================================

  /*
    querySelector devuelve SOLO el primer elemento que cumpla el selector,
    o null si no hay ninguno. Al aceptar selectores CSS completos puede
    hacer cosas que los métodos antiguos no pueden.
  */

  consola.titulo('querySelector con selectores CSS');

  consola.imprimir('Por id          ->', document.querySelector('#titulo-catalogo'));
  consola.imprimir('Por clase       ->', document.querySelector('.producto'));
  consola.imprimir('Por etiqueta    ->', cajaSeleccion.querySelector('span'));

  // Selector descendente: un .producto que esté dentro de #caja-seleccion
  consola.imprimir('Descendente     ->', document.querySelector('#caja-seleccion .producto'));

  // Dos clases a la vez (sin espacio entre ellas = el MISMO elemento)
  consola.imprimir('Dos clases      ->', document.querySelector('.producto.destacado'));

  // Selector de atributo
  consola.imprimir('Por atributo    ->', document.querySelector('[data-tipo="interno"]'));

  // Pseudoclases: el último hijo de su tipo
  consola.imprimir('Pseudoclase     ->', cajaSeleccion.querySelector('p:last-of-type'));

  // Selector que no encuentra nada -> null (no error, no lista vacía)
  consola.imprimir('Sin resultado   ->', document.querySelector('.no-existe-esta-clase'));

  // ============================================================
  // 9. CONVERTIR COLECCIONES EN ARRAYS DE VERDAD
  // ============================================================

  /*
    Las HTMLCollection y las NodeList se PARECEN a un array (tienen length y
    se accede con [i]) pero no lo son: les faltan métodos como map, filter
    o reduce. La NodeList sí tiene forEach; la HTMLCollection ni eso.

    Dos formas de convertirlas:
      Array.from(coleccion)   -> explícito y muy legible
      [...coleccion]          -> operador spread, más corto
  */

  consola.titulo('DE COLECCIÓN A ARRAY');

  // ⚠️ ERROR COMÚN: intentar productosVivos.map(...) directamente.
  consola.imprimir('¿La HTMLCollection tiene map()? ->', typeof productosVivos.map);
  consola.imprimir('¿La NodeList tiene forEach()?   ->', typeof productosEstaticos.forEach);

  // Forma 1: Array.from
  const arrayProductos = Array.from(productosVivos);
  consola.imprimir('Array.from -> ¿es array? ->', Array.isArray(arrayProductos));

  // Forma 2: spread (los tres puntos "esparcen" los elementos dentro del array)
  const arrayProductos2 = [...productosVivos];
  consola.imprimir('Spread     -> ¿es array? ->', Array.isArray(arrayProductos2));

  // Ahora sí podemos usar toda la artillería de los arrays:
  const nombres = arrayProductos.map((p) => p.textContent);
  consola.imprimir('map() sobre los productos ->', nombres);

  // Array.from admite un segundo parámetro: una función de transformación.
  // Así convertimos y transformamos en un solo paso.
  const enMayusculas = Array.from(productosVivos, (p) => p.textContent.toUpperCase());
  consola.imprimir('Array.from con transformación ->', enMayusculas);

  // filter() para quedarnos solo con los destacados
  const destacados = arrayProductos.filter((p) => p.classList.contains('destacado'));
  consola.imprimir('Productos destacados ->', destacados);

  // ============================================================
  // 10. TABLA RESUMEN
  // ============================================================

  consola.titulo('RESUMEN: QUÉ DEVUELVE CADA MÉTODO');
  consola.imprimir('getElementById         -> Element o null');
  consola.imprimir('getElementsByClassName -> HTMLCollection VIVA');
  consola.imprimir('getElementsByTagName   -> HTMLCollection VIVA');
  consola.imprimir('querySelector          -> Element o null');
  consola.imprimir('querySelectorAll       -> NodeList ESTÁTICA');
  consola.imprimir('');
  consola.imprimir('✅ BUENA PRÁCTICA: usa querySelector/querySelectorAll por defecto.');
  consola.imprimir('   Son los más flexibles y los que verás en el código moderno.');
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Selecciona el <h2> de la sección "Selección de elementos" y muestra su
   textContent en la consola visual usando dos métodos distintos.

2) Cuenta cuántos botones hay en TODA la página y cuántos hay solo dentro
   del panel del laboratorio (#laboratorio). Imprime ambos números.
   Pista: document.querySelectorAll('button') y luego busca dentro del panel.

3) Usando querySelectorAll y filter, obtén un array con el texto de todos
   los productos de la caja de pruebas cuyo nombre tenga más de 15 letras.

4) Repite el experimento de la sección 6 pero al revés: guarda una colección
   viva y una estática, ELIMINA el primer producto y compara los length.
   Recuerda volver a añadirlo o recarga la página al terminar.

5) RETO: escribe una función  buscarEn(contenedor, selector)  que reciba un
   elemento y un selector CSS, y devuelva siempre un ARRAY (nunca una
   colección), aunque no encuentre nada (en ese caso, un array vacío).
================================================================
*/
