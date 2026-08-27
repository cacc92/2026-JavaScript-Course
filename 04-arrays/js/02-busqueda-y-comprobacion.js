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

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (consola visual de esta sección)
  // ============================================================
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

  titulo('1. indexOf() y lastIndexOf()');

  imprimir('materias ->', materias);
  imprimir('indexOf("Física") ->', materias.indexOf('Física')); // 0 (la primera)
  imprimir('lastIndexOf("Física") ->', materias.lastIndexOf('Física')); // 2 (la última)
  imprimir('indexOf("Arte") ->', materias.indexOf('Arte')); // -1 -> no está

  // Segundo argumento: desde qué posición empezar a buscar.
  imprimir('indexOf("Física", 1) ->', materias.indexOf('Física', 1)); // 2

  // ⚠️ ERROR COMÚN: escribir  if (materias.indexOf('Arte')) { ... }
  // -1 es un número distinto de 0, así que se considera VERDADERO y el if entra
  // aunque el elemento NO exista. La comparación correcta es contra -1:
  if (materias.indexOf('Arte') === -1) {
    imprimir('Correcto: "Arte" no está en la lista (indexOf devolvió -1)');
  }

  // ⚠️ Compara por === , así que con OBJETOS compara REFERENCIAS, no contenido.
  // Dos objetos con los mismos datos son objetos distintos en memoria.
  imprimir(
    'inventario.indexOf({ producto: "Lápiz HB" }) ->',
    inventario.indexOf({ producto: 'Lápiz HB' })
  ); // -1 SIEMPRE, aunque "exista": es otro objeto

  // ============================================================
  // 2. includes(): ¿ESTÁ o no está? (verdadero / falso)
  // ============================================================
  // Es la versión legible de "indexOf(...) !== -1". Devuelve true o false.

  titulo('2. includes()');

  imprimir('materias.includes("Química") ->', materias.includes('Química')); // true
  imprimir('materias.includes("Arte") ->', materias.includes('Arte')); // false

  // ✅ BUENA PRÁCTICA: usa includes() cuando solo te importa si está o no,
  // y reserva indexOf() para cuando necesitas la posición.
  if (materias.includes('Biología')) {
    imprimir('El plan de estudios incluye Biología');
  }

  // Diferencia técnica curiosa con NaN ("Not a Number", el resultado de un
  // cálculo numérico imposible). indexOf usa === y NaN !== NaN, así que falla.
  const conNaN = [1, NaN, 3];
  imprimir('[1, NaN, 3].indexOf(NaN) ->', conNaN.indexOf(NaN)); // -1  (¡falla!)
  imprimir('[1, NaN, 3].includes(NaN) ->', conNaN.includes(NaN)); // true (funciona)

  // ============================================================
  // 3. find() y findIndex(): buscar con una CONDICIÓN
  // ============================================================
  // indexOf e includes solo sirven para valores exactos. Cuando el array
  // contiene objetos necesitamos describir una CONDICIÓN, y ahí entran las
  // callbacks: "dame el primer elemento que cumpla esto".
  //   - find()      devuelve el ELEMENTO (o undefined si no hay ninguno).
  //   - findIndex() devuelve el ÍNDICE   (o -1 si no hay ninguno).
  // Ambos se detienen en cuanto encuentran la primera coincidencia.

  titulo('3. find() y findIndex()');

  // Leemos la flecha así: "para cada artículo, devuelve si su producto es Compás".
  const compas = inventario.find((articulo) => articulo.producto === 'Compás');
  imprimir('find(producto === "Compás") ->', compas); // el objeto completo

  const posicionCompas = inventario.findIndex((a) => a.producto === 'Compás');
  imprimir('findIndex(producto === "Compás") ->', posicionCompas); // 5

  // Cuando no hay coincidencia:
  const inexistente = inventario.find((a) => a.producto === 'Pizarra');
  imprimir('find(producto === "Pizarra") ->', inexistente); // undefined

  // ⚠️ ERROR COMÚN: usar el resultado sin comprobar que existe.
  //    const p = inventario.find(...);
  //    console.log(p.precio);   <-- si p es undefined: TypeError y se rompe la página.
  // ✅ BUENA PRÁCTICA: comprobar antes, o usar el encadenamiento opcional (?.)
  imprimir('inexistente?.precio ->', inexistente?.precio); // undefined, sin romperse

  // Condiciones más ricas: el primer producto agotado.
  const agotado = inventario.find((a) => a.stock === 0);
  imprimir('Primer producto agotado ->', agotado.producto); // "Lápiz HB"

  // Condiciones combinadas con && (y) y || (o):
  const gangaConStock = inventario.find((a) => a.precio < 2 && a.stock > 0);
  imprimir('Primer producto barato y disponible ->', gangaConStock.producto); // "Regla 30cm"

  // La callback también recibe el índice como segundo argumento:
  const enPosicionPar = inventario.find((a, indice) => indice % 2 === 0 && a.stock === 0);
  imprimir('Primer agotado en índice par ->', enPosicionPar?.producto); // undefined
  // Aclaración para clase: los dos productos agotados son "Lápiz HB" (índice 1)
  // y "Compás" (índice 5), ambos IMPARES. Como ninguno cumple las dos
  // condiciones a la vez, find() devuelve undefined y el ?. evita el error.

  // ------------------------------------------------------------
  // 3.b) findLast() y findLastIndex(): buscar desde el FINAL
  // ------------------------------------------------------------
  // Idénticos a los anteriores pero recorren el array de derecha a izquierda.
  // Útiles cuando los datos están ordenados por fecha y quieres "lo último que...".
  const ultimoAgotado = inventario.findLast((a) => a.stock === 0);
  imprimir('findLast(stock === 0) ->', ultimoAgotado.producto); // "Compás"

  const indiceUltimoAgotado = inventario.findLastIndex((a) => a.stock === 0);
  imprimir('findLastIndex(stock === 0) ->', indiceUltimoAgotado); // 5

  // Comparación directa para que se vea la diferencia:
  imprimir(
    'find -> ' + inventario.find((a) => a.stock === 0).producto +
      '   |   findLast -> ' + inventario.findLast((a) => a.stock === 0).producto
  );

  // ============================================================
  // 4. some() y every(): PREGUNTAS DE SÍ O NO
  // ============================================================
  // some()  -> "¿ALGUNO cumple la condición?"  Basta con uno. Devuelve true/false.
  // every() -> "¿TODOS la cumplen?"            Basta con uno que falle para dar false.
  // Los dos son "perezosos": paran en cuanto conocen la respuesta.

  titulo('4. some() y every()');

  imprimir('¿Hay algún producto agotado? ->', inventario.some((a) => a.stock === 0)); // true
  imprimir('¿Hay algo por encima de 100? ->', inventario.some((a) => a.precio > 100)); // false

  imprimir('¿Todos tienen precio positivo? ->', inventario.every((a) => a.precio > 0)); // true
  imprimir('¿Todos tienen stock? ->', inventario.every((a) => a.stock > 0)); // false

  // Un uso muy habitual: validar formularios o reglas de negocio.
  const notasParciales = [7, 9, 4, 8];
  const todasAprobadas = notasParciales.every((n) => n >= 6);
  imprimir('Notas ->', notasParciales, '| ¿Todas aprobadas? ->', todasAprobadas); // false

  // ⚠️ CURIOSIDAD QUE SIEMPRE CAE EN EXAMEN: con un array VACÍO,
  // every() devuelve true y some() devuelve false. Se llama "verdad vacua":
  // si no hay elementos, no hay ninguno que incumpla la condición.
  imprimir('[].every(n => n > 100) ->', [].every((n) => n > 100)); // true
  imprimir('[].some(n => n > 100) ->', [].some((n) => n > 100)); // false

  // ⚠️ ERROR COMÚN: olvidar el return en una callback con llaves.
  //    inventario.every((a) => { a.stock > 0 });   <- SIEMPRE false
  // Con llaves { } hay que escribir return; sin llaves el return es implícito.
  imprimir(
    'Con llaves y SIN return ->',
    inventario.every((a) => {
      a.stock > 0; // El resultado se calcula... y se tira a la basura.
    })
  ); // false, porque la callback devuelve undefined (valor falso)

  // ============================================================
  // 5. forEach(): RECORRER Y EJECUTAR ALGO CON CADA ELEMENTO
  // ============================================================
  // forEach ejecuta la callback una vez por elemento. Es el sustituto legible
  // del bucle for cuando solo quieres "hacer algo" con cada dato: pintarlo,
  // enviarlo, sumarlo a un contador externo...
  //
  // PUNTO CLAVE: forEach SIEMPRE devuelve undefined. No produce un array nuevo.
  // Si quieres transformar la lista, el método correcto es map (archivo 03).

  titulo('5. forEach() y por qué NO se puede usar break');

  // Recorrido con los tres argumentos de la callback:
  inventario.forEach((articulo, indice, arrayCompleto) => {
    const esUltimo = indice === arrayCompleto.length - 1;
    imprimir(
      (indice + 1) + '. ' + articulo.producto +
        ' — ' + articulo.precio.toFixed(2) + ' EUR' +
        ' — stock: ' + articulo.stock +
        (esUltimo ? '   <- último de la lista' : '')
    );
  });

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

  imprimir('\nDemostración: return dentro de forEach NO corta el recorrido');
  let visitados = 0;
  inventario.forEach((articulo) => {
    visitados++;
    if (articulo.stock === 0) {
      return; // Nos saltamos los agotados... pero el recorrido continúa.
    }
    imprimir('  con stock: ' + articulo.producto);
  });
  imprimir('Elementos visitados por forEach ->', visitados); // 6: los recorrió TODOS

  // ------------------------------------------------------------
  // 5.c) LAS TRES ALTERNATIVAS CUANDO SÍ NECESITAS CORTAR
  // ------------------------------------------------------------

  // (1) for...of: el bucle moderno y legible. Admite break y continue.
  imprimir('\n(1) for...of con break: paramos en el primer agotado');
  let revisados = 0;
  for (const articulo of inventario) {
    revisados++;
    if (articulo.stock === 0) {
      imprimir('  Encontrado agotado: ' + articulo.producto + '. Cortamos.');
      break; // Aquí SÍ funciona: for...of es un bucle de verdad.
    }
  }
  imprimir('Elementos revisados con for...of ->', revisados); // 2, no 6

  // Si además necesitas el índice, entries() te da pares [indice, valor]
  // y el destructuring los separa en dos variables (lo vemos en el archivo 04).
  imprimir('\n(1b) for...of con entries() para tener también el índice');
  for (const [indice, articulo] of inventario.entries()) {
    if (indice >= 3) break; // Solo los tres primeros.
    imprimir('  [' + indice + '] ' + articulo.producto);
  }

  // (2) for clásico: cuando necesitas control total del índice o ir hacia atrás.
  imprimir('\n(2) for clásico recorriendo al revés');
  for (let i = inventario.length - 1; i >= 0; i--) {
    imprimir('  ' + i + ' -> ' + inventario[i].producto);
    if (i === inventario.length - 3) break; // Solo los tres últimos.
  }

  // (3) some() como "forEach que se puede cortar": devolver true detiene el recorrido.
  // Es un truco conocido, aunque muchos equipos lo evitan porque confunde
  // (some está pensado para preguntar, no para recorrer).
  imprimir('\n(3) some() usado para cortar (truco avanzado)');
  let inspeccionados = 0;
  inventario.some((articulo) => {
    inspeccionados++;
    imprimir('  inspeccionando: ' + articulo.producto);
    return articulo.stock === 0; // true -> some deja de recorrer
  });
  imprimir('Elementos inspeccionados con some ->', inspeccionados); // 2

  // ✅ RESUMEN PARA ELEGIR:
  //   - Solo "hacer algo" con todos      -> forEach
  //   - Necesito cortar a mitad          -> for...of con break
  //   - Necesito el índice y control fino -> for clásico
  //   - Quiero un array nuevo            -> map / filter (archivo 03)

  // ------------------------------------------------------------
  // 5.d) Detalle fino: forEach se SALTA los huecos
  // ------------------------------------------------------------
  const conHuecos = [10, , 30]; // La coma doble deja un hueco en la posición 1.
  let vueltas = 0;
  conHuecos.forEach(() => vueltas++);
  imprimir('\n[10, , 30] tiene length 3 pero forEach dio ' + vueltas + ' vueltas'); // 2

  imprimir('\nFin de la sección 2. Continúa en la sección 3.');

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
