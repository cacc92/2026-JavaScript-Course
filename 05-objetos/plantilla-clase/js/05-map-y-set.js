/**
 * ============================================================================
 * ARCHIVO: js/05-map-y-set.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * QUE ENSEÑA ESTE ARCHIVO:
 *   1. Map: qué es y en qué se diferencia de un objeto plano.
 *   2. set / get / has / delete / size / clear.
 *   3. Recorrer un Map e intercambiarlo con objetos y arrays.
 *   4. Casos reales de Map: contar frecuencias y agrupar.
 *   5. Set: colección de valores ÚNICOS. add / has / delete / size.
 *   6. Operaciones de conjuntos: unión, intersección y diferencia.
 *   7. WeakMap y WeakSet (mención breve).
 *
 * AL TERMINAR DEBERIAS SABER:
 *   Elegir con criterio entre un objeto, un Map y un Set según el problema.
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE: los arrays y objetos de datos ya están escritos; lo que
 * se teclea en vivo son las estructuras Map y Set y su lógica.
 * La solución completa está en ../../js/05-map-y-set.js
 * ============================================================================
 */

(function () {
  // ANDAMIAJE (ya hecho): consola visual conectada al <pre id="salida-05">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-05');

  // DATOS DE PARTIDA (ya escritos, no se teclean en clase).

  // Se usa en la sección 4: lista de asistencias con repetidos.
  const asistencias = [
    'lucia', 'martin', 'lucia', 'sofia', 'lucia', 'martin', 'diego',
  ];

  // Se usa en la sección 4: trabajos entregados, para agrupar por materia.
  const trabajos = [
    { titulo: 'Landing page', materia: 'HTML' },
    { titulo: 'Formulario', materia: 'HTML' },
    { titulo: 'Calculadora', materia: 'JavaScript' },
    { titulo: 'To-do list', materia: 'JavaScript' },
    { titulo: 'Grid responsive', materia: 'CSS' },
  ];

  // Se usa en la sección 5: registros con un id duplicado.
  const registros = [
    { id: 1, nombre: 'Lucía' },
    { id: 2, nombre: 'Martín' },
    { id: 1, nombre: 'Lucía (duplicada)' },
  ];

  // ==========================================================================
  // 1. QUE ES UN MAP Y POR QUE EXISTE
  // ==========================================================================
  /*
   * Un Map es una colección de pares clave-valor, igual que un objeto...
   * pero pensada específicamente para usarse como DICCIONARIO.
   *
   * Diferencias clave con el objeto plano:
   *   1. Las claves pueden ser DE CUALQUIER TIPO: números, objetos, funciones,
   *      booleanos... En un objeto, la clave siempre acaba siendo texto.
   *   2. Mantiene el ORDEN DE INSERCIÓN de forma garantizada.
   *   3. Sabe cuántos elementos tiene con `.size` (el objeto necesita
   *      Object.keys(obj).length).
   *   4. Es ITERABLE: funciona directamente con for...of.
   *   5. No hereda nada de Object.prototype, así que no hay choques con
   *      claves como "toString" o "constructor".
   *   6. Es más rápido cuando se añaden y quitan muchas claves.
   *
   * Regla práctica: si las claves son fijas y conocidas (un registro, una
   * ficha) -> objeto. Si es un diccionario que crece y cambia -> Map.
   */

  // TODO (en clase):
  //   1. titulo('1. Primer contacto con Map').
  //   2. Crea `const notasPorEstudiante = new Map([...]);` pasándole un array de
  //      pares: ['lucia', 8.5], ['martin', 6.75], ['sofia', 9.4].
  //      OJO: se reutiliza en la sección 3, decláralo en el ámbito de la IIFE.
  //   3. Imprímelo y muestra `notasPorEstudiante.size` -> 3.
  //   4. Problema 1 del objeto plano (todas las claves son texto):
  //        const objetoConClavesRaras = {};
  //        objetoConClavesRaras[1] = 'número uno';
  //        objetoConClavesRaras['1'] = 'texto uno';   // ⚠️ pisa a la anterior
  //        objetoConClavesRaras[true] = 'booleano';
  //      Imprímelo -> solo hay 2 claves: "1" y "true".
  //   5. Lo mismo con un Map: `const mapConClavesRaras = new Map();` y tres .set()
  //      con las claves 1, '1' y true. Imprímelo -> las 3 conviven.
  //   6. Problema 2 (herencia del prototipo): imprime
  //      `'toString' in {}` -> true  y  `new Map().has('toString')` -> false.
  //   Resultado esperado en pantalla: el Map con 3 entradas, size 3,
  //   { "1": "texto uno", "true": "booleano" }, el Map con 3 claves distintas, true y false
  //   (aprox. 16 lineas)

  // ==========================================================================
  // 2. METODOS BASICOS: set / get / has / delete / size / clear
  // ==========================================================================

  // TODO (en clase):
  //   1. titulo('2. set / get / has / delete / size / clear').
  //   2. `const inventario = new Map();` y encadena tres .set() (set devuelve el
  //      propio Map, por eso se pueden encadenar):
  //        'TEC-101' -> { nombre: 'Teclado mecánico', stock: 12 }
  //        'MOU-204' -> { nombre: 'Mouse inalámbrico', stock: 30 }
  //        'MON-330' -> { nombre: 'Monitor 24"', stock: 4 }
  //      Imprime el inventario.
  //   3. get(): imprime `inventario.get('MOU-204')` y `inventario.get('NO-EXISTE')` -> undefined.
  //   4. has(): imprime `inventario.has('TEC-101')` -> true y `has('TEC-999')` -> false.
  //   5. delete(): imprime `inventario.delete('MON-330')` -> true, repítelo -> false,
  //      y luego `inventario.size` -> 2.
  //   6. ERROR COMÚN: `inventario['TEC-101'] = 'esto está mal';` Imprime
  //      `inventario['TEC-101']` y comprueba que `inventario.size` NO cambió.
  //      Limpia el desaguisado con `delete inventario['TEC-101'];`
  //   7. Claves que son OBJETOS (imposible con un objeto plano):
  //        const profesora = { nombre: 'Ana', id: 1 };
  //        const profesor = { nombre: 'Carlos', id: 2 };
  //        const horarios = new Map();
  //        horarios.set(profesora, ['Lunes 19:00', 'Miércoles 19:00']);
  //        horarios.set(profesor, ['Martes 20:00']);
  //      Imprime `horarios.get(profesora)` y después
  //      `horarios.get({ nombre: 'Ana', id: 1 })` -> undefined: la clave es la
  //      REFERENCIA exacta, no un objeto "igual".
  //   8. clear(): `const temporal = new Map([['a', 1]]); temporal.clear();`
  //      Imprime `temporal.size` -> 0.
  //   Resultado esperado en pantalla: el inventario, el mouse, undefined, true, false,
  //   true, false, 2, el aviso del acceso con corchetes, el horario de Ana, undefined y 0
  //   (aprox. 26 lineas)

  // ⚠️ ERROR COMÚN: usar la sintaxis de objeto con un Map.
  // `inventario['TEC-101']` NO lee la entrada del Map: crea una propiedad
  // suelta en el objeto Map que `.size` ni siquiera cuenta.

  // ==========================================================================
  // 3. RECORRER UN MAP Y CONVERTIRLO
  // ==========================================================================
  /*
   * Un Map es iterable: for...of funciona directamente y devuelve pares
   * [clave, valor], que desestructuramos al vuelo.
   */

  // TODO (en clase):
  //   1. titulo('3. Recorrer un Map y convertirlo').
  //   2. `for (const [estudiante, nota] of notasPorEstudiante) { ... }` e imprime
  //      `   ${estudiante.padEnd(8)} -> ${nota}`.
  //   3. forEach: OJO al orden, primero el VALOR y luego la CLAVE:
  //      `notasPorEstudiante.forEach((nota, estudiante) => imprimir(...))`.
  //   4. Imprime `[...notasPorEstudiante.keys()]`, `[...notasPorEstudiante.values()]`
  //      y `[...notasPorEstudiante.entries()]` (el spread convierte los iteradores
  //      en arrays de verdad).
  //   5. `const valores = [...notasPorEstudiante.values()];` calcula el promedio con
  //      reduce dividido entre valores.length e imprímelo con .toFixed(2) -> 8.22
  //   6. `const comoObjeto = Object.fromEntries(notasPorEstudiante);` imprímelo.
  //      `const deVueltaAMap = new Map(Object.entries(comoObjeto));` imprímelo.
  //   7. Imprime `JSON.stringify(notasPorEstudiante)` -> "{}" (⚠️ error común) y luego
  //      la solución: `JSON.stringify(Object.fromEntries(notasPorEstudiante))`.
  //   Resultado esperado en pantalla: las 3 lineas alineadas, las 3 del forEach,
  //   los tres arrays, 8.22, el objeto, el Map, "{}" y el JSON correcto
  //   (aprox. 18 lineas)

  // ⚠️ ERROR COMÚN: intentar convertir un Map a JSON directamente.
  // JSON.stringify no sabe qué hacer con él y devuelve "{}".
  // ✅ SOLUCIÓN: convertirlo antes con Object.fromEntries o con [...map].

  // ==========================================================================
  // 4. CASOS REALES DE MAP: CONTAR Y AGRUPAR
  // ==========================================================================

  // TODO (en clase):
  //   1. titulo('4. Casos reales: contar frecuencias y agrupar').
  //   2. CONTAR FRECUENCIAS sobre el array `asistencias` (ya declarado arriba):
  //        const conteo = new Map();
  //        asistencias.forEach((persona) => {
  //          const actual = conteo.get(persona) ?? 0;   // ?? porque 0 es válido
  //          conteo.set(persona, actual + 1);
  //        });
  //      Imprime `conteo` -> lucia 3, martin 2, sofia 1, diego 1.
  //   3. ORDENAR el resultado: `const ranking = new Map([...conteo.entries()]
  //      .sort((a, b) => b[1] - a[1]));` e imprímelo.
  //   4. AGRUPAR el array `trabajos` (ya declarado arriba) por materia:
  //        const porMateria = new Map();
  //        trabajos.forEach((trabajo) => {
  //          if (!porMateria.has(trabajo.materia)) porMateria.set(trabajo.materia, []);
  //          porMateria.get(trabajo.materia).push(trabajo.titulo);
  //        });
  //      Imprímelo -> HTML: 2 titulos, JavaScript: 2, CSS: 1.
  //   Resultado esperado en pantalla: el Map de conteo, el ranking ordenado y
  //   el Map agrupado por materia
  //   (aprox. 16 lineas)

  // ==========================================================================
  // 5. SET: VALORES UNICOS
  // ==========================================================================
  /*
   * Un Set es una colección de valores SIN repetidos. No tiene claves ni
   * posiciones: solo le importa si un valor está o no está.
   *
   * Analogía: una bolsa de canicas donde no puede haber dos canicas idénticas.
   * Si intentas meter una repetida, simplemente no entra (y no da error).
   */

  // TODO (en clase):
  //   1. titulo('5. Set: colecciones de valores únicos').
  //   2. `const tecnologias = new Set(['HTML', 'CSS', 'JavaScript']);`
  //      `tecnologias.add('CSS');`        // ya estaba: se ignora en silencio
  //      `tecnologias.add('TypeScript');` // nueva: entra
  //      Imprime el Set y su `.size` -> 4, no 5.
  //   3. Imprime `tecnologias.has('CSS')` -> true, `has('PHP')` -> false,
  //      `tecnologias.delete('HTML')` -> true, y el Set tras borrar.
  //   4. El uso más famoso, quitar duplicados de un array en una línea:
  //        const inscripcionesConRepetidos = ['lucia','martin','lucia','sofia','martin','lucia'];
  //        const sinRepetidos = [...new Set(inscripcionesConRepetidos)];
  //      Imprime los dos arrays -> el segundo queda ["lucia","martin","sofia"].
  //   5. Recórrelo con `for (const tecnologia of tecnologias)` imprimiendo
  //      '   tecnología:', tecnologia.
  //   6. ERROR COMÚN con objetos: `const conObjetos = new Set([{ id: 1 }, { id: 1 }]);`
  //      Imprime su `.size` -> 2 (compara por REFERENCIA, no por contenido).
  //   7. Truco para deduplicar objetos por una propiedad, usando el array
  //      `registros` (ya declarado arriba):
  //        const unicosPorId = [...new Map(registros.map((r) => [r.id, r])).values()];
  //      Imprímelo -> 2 registros, y el id 1 se queda con "Lucía (duplicada)".
  //   Resultado esperado en pantalla: el Set de 4, true, false, true, el Set de 3,
  //   los dos arrays, las 3 tecnologías, 2 y el array deduplicado
  //   (aprox. 20 lineas)

  // ⚠️ Un Set NO tiene índices: `tecnologias[0]` es undefined. Si necesitas
  // posiciones, conviértelo a array con [...set].

  // ==========================================================================
  // 6. UNION, INTERSECCION Y DIFERENCIA
  // ==========================================================================
  /*
   * Estas son las operaciones clásicas de la teoría de conjuntos, y con Set
   * se resuelven en una línea. Ejemplo realista: comparar qué materias cursan
   * dos estudiantes.
   */

  // TODO (en clase):
  //   1. titulo('6. Unión, intersección y diferencia').
  //   2. Declara los dos conjuntos:
  //        const materiasLucia = new Set(['HTML', 'CSS', 'JavaScript', 'Git']);
  //        const materiasMartin = new Set(['JavaScript', 'Git', 'Bases de datos']);
  //   3. UNIÓN (todo lo de A o de B, sin repetir):
  //      `new Set([...materiasLucia, ...materiasMartin])` -> 5 materias. Imprímela.
  //   4. INTERSECCIÓN (lo que está en las dos):
  //      `new Set([...materiasLucia].filter((m) => materiasMartin.has(m)))`
  //      -> JavaScript y Git. Imprímela.
  //   5. DIFERENCIA (en A pero NO en B): igual que la anterior pero con `!`.
  //      -> HTML y CSS. Imprímela.
  //   6. DIFERENCIA SIMÉTRICA: junta con spread los dos filtrados cruzados
  //      -> HTML, CSS y Bases de datos. Imprímela.
  //   7. ¿Es subconjunto? `const basicas = new Set(['HTML', 'CSS']);`
  //      `[...basicas].every((m) => materiasLucia.has(m))` -> true. Imprímelo.
  //   8. Métodos nativos (2024 en adelante): dentro de
  //      `if (typeof Set.prototype.intersection === 'function') { ... } else { ... }`
  //      imprime `materiasLucia.intersection(materiasMartin)` y
  //      `materiasLucia.union(materiasMartin)`; en el else,
  //      'Este navegador todavía no trae los métodos nativos de Set.'
  //   Resultado esperado en pantalla: los cuatro conjuntos calculados, true, y
  //   los dos conjuntos nativos (o el aviso)
  //   (aprox. 22 lineas)

  // NOVEDAD: los navegadores modernos ya incluyen union(), intersection(),
  // difference(), symmetricDifference(), isSubsetOf()... Son más cómodos, pero
  // conviene comprobar el soporte antes de usarlos en un proyecto real.

  // ==========================================================================
  // 7. WeakMap Y WeakSet (MENCION BREVE)
  // ==========================================================================
  /*
   * Son primos "débiles" de Map y Set, y en el día a día se usan poco. Los
   * mencionamos para que el nombre no suene a chino:
   *
   *   - Sus claves (WeakMap) o valores (WeakSet) SOLO pueden ser objetos.
   *   - La referencia es DÉBIL: si nadie más usa ese objeto, el recolector de
   *     basura puede eliminarlo y la entrada desaparece sola.
   *   - NO son iterables ni tienen .size: no se pueden recorrer, precisamente
   *     porque su contenido puede desaparecer en cualquier momento.
   *
   * ¿Para qué sirven? Para asociar datos privados a un objeto sin impedir que
   * la memoria se libere. Por ejemplo, guardar metadatos de un elemento del
   * DOM: cuando el elemento se borra de la página, sus datos se van con él.
   */

  // TODO (en clase):
  //   1. titulo('7. WeakMap y WeakSet (breve)').
  //   2. `const metadatos = new WeakMap();`
  //      `const elementoFalso = { tipo: 'boton' };`  // simula un elemento del DOM
  //   3. `metadatos.set(elementoFalso, { clics: 0, creado: '2026-08-26' });`
  //      Imprime `metadatos.get(elementoFalso)`, `metadatos.has(elementoFalso)` -> true
  //      y `metadatos.size` -> undefined (no existe esa propiedad).
  //   4. Dentro de try/catch, `metadatos.set('texto', 1)` e imprime error.name
  //      -> "TypeError": la clave debe ser un objeto.
  //   5. `const yaProcesados = new WeakSet();` `yaProcesados.add(elementoFalso);`
  //      Imprime `yaProcesados.has(elementoFalso)` -> true.
  //   Resultado esperado en pantalla: los metadatos, true, undefined, "TypeError" y true
  //   (aprox. 10 lineas)

  // ==========================================================================
  // RESUMEN: ¿QUE USO EN CADA CASO?
  // ==========================================================================
  /*
   *   Objeto  -> una ficha con campos conocidos (un estudiante, un producto).
   *              Se convierte a JSON directamente.
   *   Map     -> un diccionario que crece, cambia y necesita claves no textuales
   *              o conservar el orden. Contar, agrupar, cachear.
   *   Set     -> una lista donde lo único que importa es "está o no está",
   *              sin repetidos: etiquetas, ids seleccionados, filtros activos.
   */

  // ==========================================================================
  // EJERCICIOS PROPUESTOS (archivo 05)
  // ==========================================================================
  /*
   * 1) Crea un Map `precios` con 4 productos y sus precios. Recórrelo con
   *    for...of e imprime "producto: $precio". Después súbelos todos un 10%
   *    y vuelve a imprimirlos.
   *
   * 2) Escribe `contarLetras(texto)` que devuelva un Map con cuántas veces
   *    aparece cada letra (ignora los espacios). Pruébala con tu nombre
   *    completo.
   *
   * 3) Escribe `agruparPor(array, propiedad)` que devuelva un Map donde cada
   *    clave sea un valor de esa propiedad y cada valor un array de objetos.
   *
   * 4) Dados dos arrays de nombres, calcula e imprime la unión, la
   *    intersección y la diferencia usando Set.
   *
   * 5) Escribe `sinDuplicadosPor(array, clave)` que elimine objetos repetidos
   *    según una propiedad (por ejemplo, el email).
   *
   * 6) (Reto) Escribe `serializarMap(map)` y `deserializarMap(texto)` que
   *    permitan guardar un Map en localStorage y recuperarlo intacto.
   */
})();
