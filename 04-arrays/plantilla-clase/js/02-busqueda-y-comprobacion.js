/**
 * ============================================================================
 * ARCHIVO: js/02-busqueda-y-comprobacion.js
 * PROYECTO: 04 · Arrays y métodos funcionales
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Buscar valores simples: indexOf, lastIndexOf, includes.
 *   2. Buscar objetos con una condición: find, findIndex, findLast, findLastIndex.
 *   3. Responder preguntas de sí/no: some (¿alguno?) y every (¿todos?).
 *   4. Recorrer con forEach y entender por qué NO se puede cortar con break.
 *   5. Las alternativas cuando sí necesitas cortar: for...of, for clásico, some.
 *
 * CONCEPTO NUEVO E IMPORTANTE: LA FUNCIÓN CALLBACK
 *   A partir de aquí, muchos métodos reciben una FUNCIÓN como argumento.
 *   Esa función se llama "callback" ("función de vuelta") porque nosotros no
 *   la ejecutamos: se la entregamos al método y es él quien la llama por cada
 *   elemento del array. Es como darle instrucciones a un ayudante:
 *   "toma esta lista y, para cada ficha, haz ESTO".
 *   La callback recibe siempre hasta tres argumentos en este orden:
 *      (elemento, indice, arrayCompleto)
 *   y casi siempre usamos solo el primero.
 *
 * (Todo va dentro de una IIFE para que estas variables no choquen con las de
 *  los otros archivos .js que carga la misma página.)
 * ============================================================================
 */

/* ============================================================================
 * CÓMO USAR ESTA PLANTILLA (nota del docente)
 * ----------------------------------------------------------------------------
 * Versión "para escribir en vivo": la teoría y los separadores están intactos,
 * el código ejecutable se ha sustituido por bloques "TODO (en clase)".
 * Ya vienen escritos: el andamiaje de salida (formatear, imprimir, titulo) y
 * los DATOS DE TRABAJO (materias e inventario), porque teclear los datos en
 * clase es tiempo perdido.
 * Solución de referencia: ../js/02-busqueda-y-comprobacion.js
 * ============================================================================ */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (consola visual de esta sección)
  // ============================================================
  // NOTA DE LA PLANTILLA: esta sección 0 viene YA ESCRITA (andamiaje).
  var ID_SALIDA = 'salida-2';

  function formatear(valor) {
    if (typeof valor === 'string') return valor;
    if (valor === undefined) return 'undefined';
    if (valor === null) return 'null';
    if (typeof valor === 'object') {
      var compacto = JSON.stringify(valor);
      if (compacto === undefined) return String(valor);
      return compacto.length <= 90 ? compacto : JSON.stringify(valor, null, 2);
    }
    return String(valor);
  }

  /**
   * imprimir(): escribe a la vez en la consola del navegador (F12) y en el
   * bloque <pre id="salida-2"> visible en la página.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes);
    var salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    salida.textContent += mensajes.map(formatear).join(' ') + '\n';
  }

  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ============================================================
  // DATOS DE TRABAJO DE ESTA SECCIÓN
  // ============================================================
  // Trabajaremos con dos colecciones realistas:
  //  - un array de textos simples (materias)
  //  - un array de OBJETOS (inventario de una papelería escolar)
  //
  // NOTA DE LA PLANTILLA: estos datos vienen YA ESCRITOS a propósito.
  // Lo que se escribe en vivo es la LÓGICA que los recorre, no los datos.

  const materias = ['Física', 'Química', 'Física', 'Biología', 'Matemáticas'];

  const inventario = [
    { producto: 'Cuaderno A4', categoria: 'Papelería', precio: 3.5, stock: 40 },
    { producto: 'Lápiz HB', categoria: 'Escritura', precio: 0.8, stock: 0 },
    { producto: 'Calculadora', categoria: 'Tecnología', precio: 24.9, stock: 7 },
    { producto: 'Regla 30cm', categoria: 'Geometría', precio: 1.9, stock: 15 },
    { producto: 'Bolígrafo azul', categoria: 'Escritura', precio: 1.2, stock: 120 },
    { producto: 'Compás', categoria: 'Geometría', precio: 4.75, stock: 0 },
  ];

  // ============================================================
  // 1. indexOf() y lastIndexOf(): ¿en qué POSICIÓN está?
  // ============================================================
  // Devuelven el índice de la primera (o última) aparición del valor buscado.
  // Si no lo encuentran devuelven -1, que es el "no existe" clásico de JavaScript.
  // Comparan con === (comparación estricta: mismo valor y mismo tipo).
  //
  // ⚠️ ERROR COMÚN: escribir  if (materias.indexOf('Arte')) { ... }
  // -1 es un número distinto de 0, así que se considera VERDADERO y el if entra
  // aunque el elemento NO exista. La comparación correcta es contra -1.
  //
  // ⚠️ Compara por === , así que con OBJETOS compara REFERENCIAS, no contenido.
  // Dos objetos con los mismos datos son objetos distintos en memoria.

  // TODO (en clase):
  //   1. Abre la sección con titulo('1. indexOf() y lastIndexOf()').
  //   2. Imprime el array "materias" y después, con su etiqueta delante:
  //      materias.indexOf('Física'), materias.lastIndexOf('Física') y
  //      materias.indexOf('Arte').
  //   3. Muestra el segundo argumento: materias.indexOf('Física', 1).
  //   4. Escribe el if CORRECTO: if (materias.indexOf('Arte') === -1) e imprime
  //      'Correcto: "Arte" no está en la lista (indexOf devolvió -1)'.
  //   5. Demuestra la comparación por referencia imprimiendo
  //      inventario.indexOf({ producto: 'Lápiz HB' }).
  //   Resultado esperado en pantalla:
  //     indexOf("Física") -> 0          lastIndexOf("Física") -> 2
  //     indexOf("Arte") -> -1           indexOf("Física", 1) -> 2
  //     Correcto: "Arte" no está en la lista (indexOf devolvió -1)
  //     inventario.indexOf({ producto: "Lápiz HB" }) -> -1
  //   (aprox. 12 líneas)

  // ============================================================
  // 2. includes(): ¿ESTÁ o no está? (verdadero / falso)
  // ============================================================
  // Es la versión legible de "indexOf(...) !== -1". Devuelve true o false.
  //
  // ✅ BUENA PRÁCTICA: usa includes() cuando solo te importa si está o no,
  // y reserva indexOf() para cuando necesitas la posición.
  //
  // Diferencia técnica curiosa con NaN ("Not a Number", el resultado de un
  // cálculo numérico imposible). indexOf usa === y NaN !== NaN, así que falla.

  // TODO (en clase):
  //   1. Abre con titulo('2. includes()').
  //   2. Imprime materias.includes('Química') y materias.includes('Arte').
  //   3. Escribe un if (materias.includes('Biología')) que imprima
  //      'El plan de estudios incluye Biología'.
  //   4. Declara const conNaN = [1, NaN, 3] e imprime conNaN.indexOf(NaN) y
  //      conNaN.includes(NaN) para ver la diferencia.
  //   Resultado esperado en pantalla:
  //     materias.includes("Química") -> true
  //     materias.includes("Arte") -> false
  //     El plan de estudios incluye Biología
  //     [1, NaN, 3].indexOf(NaN) -> -1        (¡falla!)
  //     [1, NaN, 3].includes(NaN) -> true     (funciona)
  //   (aprox. 9 líneas)

  // ============================================================
  // 3. find() y findIndex(): buscar con una CONDICIÓN
  // ============================================================
  // indexOf e includes solo sirven para valores exactos. Cuando el array
  // contiene objetos necesitamos describir una CONDICIÓN, y ahí entran las
  // callbacks: "dame el primer elemento que cumpla esto".
  //   - find()      devuelve el ELEMENTO (o undefined si no hay ninguno).
  //   - findIndex() devuelve el ÍNDICE   (o -1 si no hay ninguno).
  // Ambos se detienen en cuanto encuentran la primera coincidencia.
  // Leemos la flecha así: "para cada artículo, devuelve si su producto es Compás".
  //
  // ⚠️ ERROR COMÚN: usar el resultado sin comprobar que existe.
  //    const p = inventario.find(...);
  //    console.log(p.precio);   <-- si p es undefined: TypeError y se rompe la página.
  // ✅ BUENA PRÁCTICA: comprobar antes, o usar el encadenamiento opcional (?.)

  // TODO (en clase):
  //   1. Abre con titulo('3. find() y findIndex()').
  //   2. const compas = inventario.find((articulo) => articulo.producto === 'Compás')
  //      e imprímelo (sale el objeto completo).
  //   3. const posicionCompas = inventario.findIndex((a) => a.producto === 'Compás')
  //      e imprímelo.
  //   4. const inexistente = inventario.find((a) => a.producto === 'Pizarra')
  //      e imprímelo; después imprime inexistente?.precio para enseñar el ?.
  //   5. const agotado = inventario.find((a) => a.stock === 0) e imprime
  //      agotado.producto.
  //   6. const gangaConStock = inventario.find((a) => a.precio < 2 && a.stock > 0)
  //      e imprime gangaConStock.producto.
  //   7. Con el índice como segundo argumento:
  //      const enPosicionPar = inventario.find((a, indice) => indice % 2 === 0 && a.stock === 0)
  //      e imprime enPosicionPar?.producto.
  //   Aclaración para clase: los dos productos agotados son "Lápiz HB" (índice 1)
  //   y "Compás" (índice 5), ambos IMPARES. Como ninguno cumple las dos
  //   condiciones a la vez, find() devuelve undefined y el ?. evita el error.
  //   Resultado esperado en pantalla:
  //     findIndex(producto === "Compás") -> 5
  //     find(producto === "Pizarra") -> undefined
  //     inexistente?.precio -> undefined
  //     Primer producto agotado -> Lápiz HB
  //     Primer producto barato y disponible -> Regla 30cm
  //     Primer agotado en índice par -> undefined
  //   (aprox. 14 líneas)

  // ------------------------------------------------------------
  // 3.b) findLast() y findLastIndex(): buscar desde el FINAL
  // ------------------------------------------------------------
  // Idénticos a los anteriores pero recorren el array de derecha a izquierda.
  // Útiles cuando los datos están ordenados por fecha y quieres "lo último que...".

  // TODO (en clase):
  //   1. const ultimoAgotado = inventario.findLast((a) => a.stock === 0)
  //      e imprime ultimoAgotado.producto.
  //   2. const indiceUltimoAgotado = inventario.findLastIndex((a) => a.stock === 0)
  //      e imprímelo.
  //   3. Imprime una sola línea que compare los dos métodos, concatenando
  //      'find -> ' + inventario.find((a) => a.stock === 0).producto +
  //      '   |   findLast -> ' + inventario.findLast((a) => a.stock === 0).producto
  //   Resultado esperado en pantalla:
  //     findLast(stock === 0) -> Compás
  //     findLastIndex(stock === 0) -> 5
  //     find -> Lápiz HB   |   findLast -> Compás
  //   (aprox. 8 líneas)

  // ============================================================
  // 4. some() y every(): PREGUNTAS DE SÍ O NO
  // ============================================================
  // some()  -> "¿ALGUNO cumple la condición?"  Basta con uno. Devuelve true/false.
  // every() -> "¿TODOS la cumplen?"            Basta con uno que falle para dar false.
  // Los dos son "perezosos": paran en cuanto conocen la respuesta.
  //
  // ⚠️ CURIOSIDAD QUE SIEMPRE CAE EN EXAMEN: con un array VACÍO,
  // every() devuelve true y some() devuelve false. Se llama "verdad vacua":
  // si no hay elementos, no hay ninguno que incumpla la condición.
  //
  // ⚠️ ERROR COMÚN: olvidar el return en una callback con llaves.
  //    inventario.every((a) => { a.stock > 0 });   <- SIEMPRE false
  // Con llaves { } hay que escribir return; sin llaves el return es implícito.

  // TODO (en clase):
  //   1. Abre con titulo('4. some() y every()').
  //   2. Imprime inventario.some((a) => a.stock === 0) y
  //      inventario.some((a) => a.precio > 100).
  //   3. Imprime inventario.every((a) => a.precio > 0) y
  //      inventario.every((a) => a.stock > 0).
  //   4. Caso de validación: const notasParciales = [7, 9, 4, 8] y
  //      const todasAprobadas = notasParciales.every((n) => n >= 6).
  //      Imprime las notas y el resultado en la misma línea.
  //   5. Verdad vacua: imprime [].every((n) => n > 100) y [].some((n) => n > 100).
  //   6. Demuestra el olvido del return: imprime
  //      inventario.every((a) => { a.stock > 0; })   <- fíjate: SIN return.
  //   Resultado esperado en pantalla:
  //     ¿Hay algún producto agotado? -> true
  //     ¿Hay algo por encima de 100? -> false
  //     ¿Todos tienen precio positivo? -> true
  //     ¿Todos tienen stock? -> false
  //     ¿Todas aprobadas? -> false
  //     [].every(n => n > 100) -> true    /   [].some(n => n > 100) -> false
  //     Con llaves y SIN return -> false
  //   (aprox. 14 líneas)

  // ============================================================
  // 5. forEach(): RECORRER Y EJECUTAR ALGO CON CADA ELEMENTO
  // ============================================================
  // forEach ejecuta la callback una vez por elemento. Es el sustituto legible
  // del bucle for cuando solo quieres "hacer algo" con cada dato: pintarlo,
  // enviarlo, sumarlo a un contador externo...
  //
  // PUNTO CLAVE: forEach SIEMPRE devuelve undefined. No produce un array nuevo.
  // Si quieres transformar la lista, el método correcto es map (archivo 03).

  // TODO (en clase):
  //   1. Abre con titulo('5. forEach() y por qué NO se puede usar break').
  //   2. Recorre "inventario" con forEach usando los TRES argumentos de la
  //      callback: (articulo, indice, arrayCompleto).
  //      Dentro, calcula const esUltimo = indice === arrayCompleto.length - 1 e
  //      imprime una línea con este formato exacto:
  //        (indice + 1) + '. ' + articulo.producto + ' — ' +
  //        articulo.precio.toFixed(2) + ' EUR — stock: ' + articulo.stock
  //      y, si es el último, añade el sufijo '   <- último de la lista'.
  //   Resultado esperado en pantalla (6 líneas, una por producto):
  //     1. Cuaderno A4 — 3.50 EUR — stock: 40
  //     ...
  //     6. Compás — 4.75 EUR — stock: 0   <- último de la lista
  //   (aprox. 9 líneas)

  // ------------------------------------------------------------
  // 5.b) POR QUÉ NO SE PUEDE HACER break DENTRO DE forEach
  // ------------------------------------------------------------
  // break y continue son instrucciones que solo entienden los BUCLES del
  // lenguaje (for, while, do...while, for...of). forEach no es un bucle:
  // es un MÉTODO que llama a nuestra función una vez por elemento.
  // Cada llamada es una función independiente, y desde dentro de una función
  // no puedes "romper" un bucle que está fuera. Escribir break ahí da:
  //     SyntaxError: Illegal break statement
  //
  // ⚠️ ERROR COMÚN: creer que un return dentro del forEach corta el recorrido.
  // El return solo termina ESA llamada (equivale a un continue) y forEach
  // sigue con el resto de elementos. Vamos a demostrarlo:

  // TODO (en clase):
  //   1. Imprime el rótulo
  //      '\nDemostración: return dentro de forEach NO corta el recorrido'.
  //   2. Declara let visitados = 0.
  //   3. Recorre "inventario" con forEach: incrementa visitados++, y si
  //      articulo.stock === 0 haz un return seco (nos saltamos los agotados).
  //      Si no, imprime '  con stock: ' + articulo.producto.
  //   4. Imprime "visitados" con la etiqueta 'Elementos visitados por forEach ->'.
  //   Resultado esperado en pantalla: 6 -> los recorrió TODOS, el return no cortó.
  //   (aprox. 9 líneas)

  // ------------------------------------------------------------
  // 5.c) LAS TRES ALTERNATIVAS CUANDO SÍ NECESITAS CORTAR
  // ------------------------------------------------------------

  // (1) for...of: el bucle moderno y legible. Admite break y continue.
  // Si además necesitas el índice, entries() te da pares [indice, valor]
  // y el destructuring los separa en dos variables (lo vemos en el archivo 04).

  // TODO (en clase):
  //   1. Imprime '\n(1) for...of con break: paramos en el primer agotado'.
  //   2. Declara let revisados = 0 y escribe
  //      for (const articulo of inventario) { ... }: incrementa revisados++ y,
  //      si articulo.stock === 0, imprime
  //      '  Encontrado agotado: ' + articulo.producto + '. Cortamos.' y haz break.
  //   3. Imprime "revisados" con la etiqueta 'Elementos revisados con for...of ->'.
  //   4. Imprime '\n(1b) for...of con entries() para tener también el índice' y
  //      escribe for (const [indice, articulo] of inventario.entries()) con un
  //      break cuando indice >= 3; dentro imprime '  [' + indice + '] ' + articulo.producto.
  //   Resultado esperado en pantalla:
  //     Encontrado agotado: Lápiz HB. Cortamos.
  //     Elementos revisados con for...of -> 2      (no 6)
  //     [0] Cuaderno A4 / [1] Lápiz HB / [2] Calculadora
  //   (aprox. 14 líneas)

  // (2) for clásico: cuando necesitas control total del índice o ir hacia atrás.

  // TODO (en clase):
  //   1. Imprime '\n(2) for clásico recorriendo al revés'.
  //   2. Escribe for (let i = inventario.length - 1; i >= 0; i--):
  //      imprime '  ' + i + ' -> ' + inventario[i].producto y haz break cuando
  //      i === inventario.length - 3 (solo los tres últimos).
  //   Resultado esperado en pantalla: los índices 5, 4 y 3 con sus productos.
  //   (aprox. 5 líneas)

  // (3) some() como "forEach que se puede cortar": devolver true detiene el recorrido.
  // Es un truco conocido, aunque muchos equipos lo evitan porque confunde
  // (some está pensado para preguntar, no para recorrer).

  // TODO (en clase):
  //   1. Imprime '\n(3) some() usado para cortar (truco avanzado)'.
  //   2. Declara let inspeccionados = 0 y llama a inventario.some(...):
  //      incrementa el contador, imprime '  inspeccionando: ' + articulo.producto
  //      y devuelve articulo.stock === 0 (ese true detiene el recorrido).
  //   3. Imprime "inspeccionados" con la etiqueta
  //      'Elementos inspeccionados con some ->'.
  //   Resultado esperado en pantalla: 2
  //   (aprox. 8 líneas)

  // ✅ RESUMEN PARA ELEGIR:
  //   - Solo "hacer algo" con todos      -> forEach
  //   - Necesito cortar a mitad          -> for...of con break
  //   - Necesito el índice y control fino -> for clásico
  //   - Quiero un array nuevo            -> map / filter (archivo 03)

  // ------------------------------------------------------------
  // 5.d) Detalle fino: forEach se SALTA los huecos
  // ------------------------------------------------------------

  // TODO (en clase):
  //   1. Declara const conHuecos = [10, , 30] (la coma doble deja un hueco en
  //      la posición 1) y let vueltas = 0.
  //   2. Llama a conHuecos.forEach(() => vueltas++).
  //   3. Imprime '\n[10, , 30] tiene length 3 pero forEach dio ' + vueltas + ' vueltas'.
  //   4. Cierra el archivo con
  //      imprimir('\nFin de la sección 2. Continúa en la sección 3.').
  //   Resultado esperado en pantalla:
  //     [10, , 30] tiene length 3 pero forEach dio 2 vueltas
  //     Fin de la sección 2. Continúa en la sección 3.
  //   (aprox. 6 líneas)

  /* ============================================================================
   * EJERCICIOS PROPUESTOS (sección 2)
   * ----------------------------------------------------------------------------
   * 1. Con el array "materias", escribe un mensaje distinto según si la materia
   *    "Química" está o no en la lista, usando includes(). Repítelo con indexOf
   *    comparando correctamente contra -1.
   *
   * 2. Sobre "inventario", encuentra e imprime:
   *    a) el primer producto de la categoría 'Escritura',
   *    b) el índice del producto más caro que puedas localizar con findIndex
   *       (pista: primero averigua el precio máximo con un bucle),
   *    c) el último producto que cueste menos de 2 euros (findLast).
   *
   * 3. Escribe una función hayStockSuficiente(inventario, minimo) que devuelva
   *    true solo si TODOS los productos tienen al menos "minimo" unidades.
   *    Pruébala con minimo = 1 y con minimo = 0.
   *
   * 4. Recorre "inventario" con forEach e imprime una línea por producto con el
   *    formato: "Cuaderno A4 (Papelería): 3.50 EUR — 40 uds.". Después reescribe
   *    el mismo recorrido con for...of y explica en un comentario cuál prefieres.
   *
   * 5. Reto: escribe una función buscarPrimero(lista, condicion) que se comporte
   *    igual que find() pero implementada a mano con un bucle for y break.
   *    Debe devolver undefined si nada cumple la condición. Compárala con find().
   * ============================================================================ */
})();
