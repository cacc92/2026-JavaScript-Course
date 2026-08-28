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
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Este archivo está VACÍO a propósito. Toda la prosa y todos los
 *   separadores de sección están en su sitio; lo que falta es el código,
 *   que se escribe en vivo siguiendo los bloques "TODO (en clase)".
 *   La versión resuelta está en ../../js/01-seleccion.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Pedimos a la fábrica de 00-utilidades.js dos consolas visuales:
  // una para la sección 1 (teoría) y otra para la sección 2 (selección).
  // ESTAS DOS LÍNEAS VIENEN YA ESCRITAS: son andamiaje, no materia.
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

  // TODO (en clase):
  //   1. Abre el bloque con  teoria.titulo('EL DOCUMENTO Y SUS PARTES PRINCIPALES');
  //   2. Imprime con teoria.imprimir(), una línea por cada uno, alineando el '=' :
  //        'document.title            =' , document.title
  //        'document.documentElement  =' , document.documentElement
  //        'document.head             =' , document.head
  //        'document.body             =' , document.body
  //        'Idioma declarado          =' , document.documentElement.lang
  //   3. Declara  const totalElementos = document.querySelectorAll('*').length;
  //      y imprímelo con la etiqueta 'Elementos totales en la página ='.
  //      Explica que '*' significa "cualquier elemento" y que cuenta ETIQUETAS,
  //      no nodos de texto.
  //   Resultado esperado en pantalla (consola de la sección 1): el título del
  //   documento, <html>, <head>, <body>, el idioma "es" y un número de tres
  //   cifras con el total de elementos.
  //   (aprox. 8 líneas)

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

  // TODO (en clase):
  //   1. teoria.titulo('WINDOW vs DOCUMENT vs ELEMENT');
  //   2. Imprime  window.document === document  con la etiqueta
  //      'window.document === document ->'. Da true. Recuerda que === compara
  //      valor Y tipo, sin conversiones.
  //   3. Imprime  window.innerWidth + 'px'  y  window.innerHeight + 'px'  con las
  //      etiquetas 'Ancho visible de la ventana  ->' y 'Alto visible de la ventana   ->'.
  //      Son propiedades de window, no del documento.
  //   4. Declara  const cabecera = document.querySelector('h1');
  //      e imprime  cabecera instanceof Element  y  cabecera instanceof Node.
  //      instanceof pregunta "¿este objeto salió de este molde?".
  //   5. ⚠️ ERROR COMÚN: creer que document es un elemento. No lo es.
  //      Imprime  document instanceof Element  (da false) y a continuación la
  //      aclaración '(document es un Document, el CONTENEDOR del árbol)'.
  //   6. Imprime  cabecera.nodeType  con el comentario '(1 = elemento)' y
  //      document.nodeType  con '(9 = documento)'. nodeType es un número:
  //      1 = elemento, 3 = texto, 8 = comentario, 9 = documento.
  //   (aprox. 10 líneas)

  // ============================================================
  // 3. getElementById: EL MÁS RÁPIDO Y DIRECTO
  // ============================================================

  /*
    Busca por el atributo id. Como el id debe ser ÚNICO en toda la página,
    devuelve UN elemento o null si no lo encuentra.

    Fíjate: se escribe SIN almohadilla. El '#' es cosa de CSS.
  */

  // TODO (en clase):
  //   1. consola.titulo('getElementById');
  //   2. Declara  const cajaSeleccion = document.getElementById('caja-seleccion');
  //      (SIN almohadilla) e imprímela. Esta constante se usa en casi todas las
  //      secciones siguientes, así que no la borres.
  //   3. ⚠️ ERROR COMÚN: escribir la almohadilla como en CSS.
  //      Declara  const fallo = document.getElementById('#caja-seleccion');
  //      e imprímelo con la coletilla '<- ¡null! sobra la #'.
  //   4. ⚠️ ERROR COMÚN NÚMERO UNO DEL DOM: usar un elemento que vale null.
  //      Escribe un  if (fallo === null) { ... }  que imprima
  //      'Comprobado: no existe. Si intentáramos fallo.textContent, error.'
  //   Resultado esperado en pantalla: <div#caja-seleccion.caja-demo> y, debajo,
  //   null con el aviso de la almohadilla.
  //   (aprox. 8 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('getElementsByClassName: colección VIVA');
  //   2. Declara  const productosVivos = document.getElementsByClassName('producto');
  //      (se reutiliza en las secciones 6 y 9: no la borres).
  //   3. Imprime, una línea cada uno:
  //        'Tipo de dato        ->' , productosVivos.constructor.name   -> HTMLCollection
  //        'Elementos ahora     ->' , productosVivos.length             -> 3
  //        'Primero (índice 0)  ->' , productosVivos[0]
  //        'Texto del primero   ->' , productosVivos[0].textContent     -> Teclado mecánico
  //      Señala que se accede por índice, igual que en un array.
  //   (aprox. 5 líneas)

  // ============================================================
  // 5. querySelectorAll: LISTA ESTÁTICA
  // ============================================================

  /*
    querySelectorAll acepta CUALQUIER selector CSS y devuelve una NodeList
    ESTÁTICA: una foto del momento. Si después añades elementos que encajan
    con el selector, la NodeList NO cambia.
  */

  // TODO (en clase):
  //   1. consola.titulo('querySelectorAll: lista ESTÁTICA');
  //   2. Declara
  //        const productosEstaticos = document.querySelectorAll('#caja-seleccion .producto');
  //      (también se reutiliza en las secciones 6 y 9).
  //   3. Imprime  productosEstaticos.constructor.name  con la etiqueta
  //      'Tipo de dato    ->'  (da NodeList) y  productosEstaticos.length  con
  //      'Elementos ahora ->'  (da 3).
  //   (aprox. 4 líneas)

  // ============================================================
  // 6. LA PRUEBA DEFINITIVA: VIVA vs ESTÁTICA
  // ============================================================

  /*
    Vamos a añadir un cuarto producto al documento y a mirar otra vez los
    dos contadores. Este experimento es el corazón de la sección:
    la colección viva sube a 4, la lista estática se queda en 3.
  */

  // TODO (en clase):
  //   1. consola.titulo('EXPERIMENTO: añadimos un producto nuevo');
  //   2. Crea el producto en tres pasos, comentando cada uno:
  //        const productoNuevo = document.createElement('p');
  //        productoNuevo.className = 'producto';
  //        productoNuevo.textContent = 'Auriculares con cancelación de ruido';
  //        cajaSeleccion.appendChild(productoNuevo);   // ahora sí entra en el árbol
  //   3. Imprime otra vez los dos length:
  //        'Colección VIVA     ->' , productosVivos.length      -> 4  '<- ha subido sola'
  //        'Lista ESTÁTICA     ->' , productosEstaticos.length  -> 3  '<- sigue igual'
  //   4. Quita el producto con  productoNuevo.remove();  para dejar la zona de
  //      pruebas como estaba, imprime 'Tras eliminarlo:' y repite los dos length
  //      (vuelven a 3 y 3) con las coletillas '<- ha bajado sola' e '<- imperturbable'.
  //   Resultado esperado en pantalla: 4 / 3 primero, 3 / 3 después.
  //   (aprox. 12 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('getElementsByTagName');
  //   2. Busca en TODO el documento:
  //        const todosLosParrafos = document.getElementsByTagName('p');
  //      e imprime su length con la etiqueta 'Párrafos en toda la página ->'.
  //   3. Busca solo DENTRO de un elemento concreto:
  //        const parrafosDeLaCaja = cajaSeleccion.getElementsByTagName('p');
  //      e imprime su length con 'Párrafos dentro de la caja ->'  (da 3).
  //      Idea clave que hay que decir en voz alta: los métodos de búsqueda
  //      existen también en cualquier Element, no solo en document.
  //   (aprox. 5 líneas)

  // ============================================================
  // 8. querySelector: EL PRIMERO QUE ENCAJE
  // ============================================================

  /*
    querySelector devuelve SOLO el primer elemento que cumpla el selector,
    o null si no hay ninguno. Al aceptar selectores CSS completos puede
    hacer cosas que los métodos antiguos no pueden.
  */

  // TODO (en clase):
  //   1. consola.titulo('querySelector con selectores CSS');
  //   2. Imprime una línea por cada tipo de selector, con estas etiquetas
  //      exactas y estos selectores:
  //        'Por id          ->' , document.querySelector('#titulo-catalogo')
  //        'Por clase       ->' , document.querySelector('.producto')
  //        'Por etiqueta    ->' , cajaSeleccion.querySelector('span')
  //        'Descendente     ->' , document.querySelector('#caja-seleccion .producto')
  //        'Dos clases      ->' , document.querySelector('.producto.destacado')
  //        'Por atributo    ->' , document.querySelector('[data-tipo="interno"]')
  //        'Pseudoclase     ->' , cajaSeleccion.querySelector('p:last-of-type')
  //        'Sin resultado   ->' , document.querySelector('.no-existe-esta-clase')
  //      Comenta al pasar: dos clases sin espacio = el MISMO elemento; el último
  //      caso devuelve null, no error y no lista vacía.
  //   (aprox. 9 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('DE COLECCIÓN A ARRAY');
  //   2. ⚠️ ERROR COMÚN: intentar productosVivos.map(...) directamente.
  //      Imprime  typeof productosVivos.map     -> 'undefined'
  //      Imprime  typeof productosEstaticos.forEach -> 'function'
  //   3. Forma 1:  const arrayProductos = Array.from(productosVivos);
  //      Imprime  Array.isArray(arrayProductos)  -> true
  //   4. Forma 2:  const arrayProductos2 = [...productosVivos];
  //      Imprime  Array.isArray(arrayProductos2) -> true
  //   5. Ahora sí, artillería de arrays:
  //        const nombres = arrayProductos.map((p) => p.textContent);
  //        imprímelo con la etiqueta 'map() sobre los productos ->'
  //   6. Array.from admite un segundo parámetro de transformación:
  //        const enMayusculas = Array.from(productosVivos, (p) => p.textContent.toUpperCase());
  //        imprímelo con 'Array.from con transformación ->'
  //   7. Filtra los destacados:
  //        const destacados = arrayProductos.filter((p) => p.classList.contains('destacado'));
  //        imprímelo con 'Productos destacados ->'  (sale solo la silla ergonómica)
  //   (aprox. 12 líneas)

  // ============================================================
  // 10. TABLA RESUMEN
  // ============================================================

  // TODO (en clase):
  //   1. consola.titulo('RESUMEN: QUÉ DEVUELVE CADA MÉTODO');
  //   2. Imprime estas siete líneas literales, una por consola.imprimir():
  //        'getElementById         -> Element o null'
  //        'getElementsByClassName -> HTMLCollection VIVA'
  //        'getElementsByTagName   -> HTMLCollection VIVA'
  //        'querySelector          -> Element o null'
  //        'querySelectorAll       -> NodeList ESTÁTICA'
  //        ''
  //        '✅ BUENA PRÁCTICA: usa querySelector/querySelectorAll por defecto.'
  //        '   Son los más flexibles y los que verás en el código moderno.'
  //   (aprox. 9 líneas)
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
