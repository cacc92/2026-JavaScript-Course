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
 * ============================================================================
 */

(function () {
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-05');

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
  titulo('1. Primer contacto con Map');

  // Se crea con `new Map()`. Se le puede pasar un array de pares [clave, valor].
  const notasPorEstudiante = new Map([
    ['lucia', 8.5],
    ['martin', 6.75],
    ['sofia', 9.4],
  ]);

  imprimir('El Map completo ->', notasPorEstudiante);
  imprimir('Cantidad de entradas (.size) ->', notasPorEstudiante.size);

  // Problema 1 del objeto plano: TODAS las claves se convierten en texto.
  const objetoConClavesRaras = {};
  objetoConClavesRaras[1] = 'número uno';
  objetoConClavesRaras['1'] = 'texto uno'; // ⚠️ pisa a la anterior: es la MISMA clave
  objetoConClavesRaras[true] = 'booleano';
  imprimir('Objeto: 1 y "1" son la misma clave ->', objetoConClavesRaras);

  const mapConClavesRaras = new Map();
  mapConClavesRaras.set(1, 'número uno');
  mapConClavesRaras.set('1', 'texto uno'); // en un Map son claves DISTINTAS
  mapConClavesRaras.set(true, 'booleano');
  imprimir('Map: 1 y "1" conviven ->', mapConClavesRaras);

  // Problema 2 del objeto plano: hereda propiedades de su prototipo.
  const diccionarioObjeto = {};
  imprimir('¿El objeto vacío "tiene" toString? ->', 'toString' in diccionarioObjeto); // true
  const diccionarioMap = new Map();
  imprimir('¿El Map vacío tiene toString? ->', diccionarioMap.has('toString')); // false

  // ==========================================================================
  // 2. METODOS BASICOS: set / get / has / delete / size / clear
  // ==========================================================================
  titulo('2. set / get / has / delete / size / clear');

  const inventario = new Map();

  // set(clave, valor) añade o actualiza. DEVUELVE el propio Map, así que se
  // pueden encadenar llamadas.
  inventario
    .set('TEC-101', { nombre: 'Teclado mecánico', stock: 12 })
    .set('MOU-204', { nombre: 'Mouse inalámbrico', stock: 30 })
    .set('MON-330', { nombre: 'Monitor 24"', stock: 4 });

  imprimir('Inventario ->', inventario);

  // get(clave) devuelve el valor, o undefined si la clave no existe.
  imprimir('get("MOU-204") ->', inventario.get('MOU-204'));
  imprimir('get("NO-EXISTE") ->', inventario.get('NO-EXISTE'));

  // has(clave) devuelve true/false. Es la forma correcta de comprobar.
  imprimir('has("TEC-101") ->', inventario.has('TEC-101'));
  imprimir('has("TEC-999") ->', inventario.has('TEC-999'));

  // delete(clave) borra y devuelve true si existía.
  imprimir('delete("MON-330") ->', inventario.delete('MON-330'));
  imprimir('delete otra vez ->', inventario.delete('MON-330')); // false
  imprimir('Tamaño tras borrar ->', inventario.size);

  // ⚠️ ERROR COMÚN: usar la sintaxis de objeto con un Map.
  // `inventario['TEC-101']` NO lee la entrada del Map: crea una propiedad
  // suelta en el objeto Map que `.size` ni siquiera cuenta.
  inventario['TEC-101'] = 'esto está mal';
  imprimir('Acceso con corchetes (mal) ->', inventario['TEC-101']);
  imprimir('El Map real no cambió, size sigue en ->', inventario.size);
  delete inventario['TEC-101']; // limpiamos el desaguisado

  // Las claves también pueden ser OBJETOS. Esto es imposible con un objeto plano.
  const profesora = { nombre: 'Ana', id: 1 };
  const profesor = { nombre: 'Carlos', id: 2 };
  const horarios = new Map();
  horarios.set(profesora, ['Lunes 19:00', 'Miércoles 19:00']);
  horarios.set(profesor, ['Martes 20:00']);
  imprimir('Horario de Ana ->', horarios.get(profesora));

  // ⚠️ CUIDADO: la clave es la REFERENCIA exacta, no un objeto "igual".
  imprimir('Con un objeto nuevo idéntico ->', horarios.get({ nombre: 'Ana', id: 1 })); // undefined

  // clear() vacía el Map entero.
  const temporal = new Map([['a', 1]]);
  temporal.clear();
  imprimir('Tras clear(), size ->', temporal.size);

  // ==========================================================================
  // 3. RECORRER UN MAP Y CONVERTIRLO
  // ==========================================================================
  /*
   * Un Map es iterable: for...of funciona directamente y devuelve pares
   * [clave, valor], que desestructuramos al vuelo.
   */
  titulo('3. Recorrer un Map y convertirlo');

  for (const [estudiante, nota] of notasPorEstudiante) {
    imprimir(`   ${estudiante.padEnd(8)} -> ${nota}`);
  }

  // forEach: OJO al orden de los parámetros, primero el VALOR y luego la CLAVE.
  notasPorEstudiante.forEach((nota, estudiante) => {
    imprimir(`forEach: ${estudiante} sacó ${nota}`);
  });

  // keys(), values() y entries() devuelven iteradores; el spread los convierte
  // en arrays de verdad para poder usar map, filter, sort...
  imprimir('Claves ->', [...notasPorEstudiante.keys()]);
  imprimir('Valores ->', [...notasPorEstudiante.values()]);
  imprimir('Entradas ->', [...notasPorEstudiante.entries()]);

  // Cálculos: al pasar los valores a array tenemos todos los métodos de array.
  const valores = [...notasPorEstudiante.values()];
  const promedioClase = valores.reduce((a, b) => a + b, 0) / valores.length;
  imprimir('Promedio de la clase ->', promedioClase.toFixed(2));

  // De Map a objeto y de objeto a Map.
  const comoObjeto = Object.fromEntries(notasPorEstudiante);
  imprimir('Map -> objeto ->', comoObjeto);

  const deVueltaAMap = new Map(Object.entries(comoObjeto));
  imprimir('Objeto -> Map ->', deVueltaAMap);

  // ⚠️ ERROR COMÚN: intentar convertir un Map a JSON directamente.
  // JSON.stringify no sabe qué hacer con él y devuelve "{}".
  imprimir('JSON.stringify de un Map ->', JSON.stringify(notasPorEstudiante));
  // ✅ SOLUCIÓN: convertirlo antes con Object.fromEntries o con [...map].
  imprimir('Solución ->', JSON.stringify(Object.fromEntries(notasPorEstudiante)));

  // ==========================================================================
  // 4. CASOS REALES DE MAP: CONTAR Y AGRUPAR
  // ==========================================================================
  titulo('4. Casos reales: contar frecuencias y agrupar');

  const asistencias = [
    'lucia', 'martin', 'lucia', 'sofia', 'lucia', 'martin', 'diego',
  ];

  // Contar cuántas veces aparece cada valor.
  const conteo = new Map();
  asistencias.forEach((persona) => {
    // Si aún no está, arrancamos en 0 (usamos ?? porque 0 es un valor válido).
    const actual = conteo.get(persona) ?? 0;
    conteo.set(persona, actual + 1);
  });
  imprimir('Asistencias por persona ->', conteo);

  // Ordenar el resultado: pasamos a array, ordenamos y volvemos a Map.
  const ranking = new Map([...conteo.entries()].sort((a, b) => b[1] - a[1]));
  imprimir('Ranking de asistencia ->', ranking);

  // Agrupar objetos por una propiedad.
  const trabajos = [
    { titulo: 'Landing page', materia: 'HTML' },
    { titulo: 'Formulario', materia: 'HTML' },
    { titulo: 'Calculadora', materia: 'JavaScript' },
    { titulo: 'To-do list', materia: 'JavaScript' },
    { titulo: 'Grid responsive', materia: 'CSS' },
  ];

  const porMateria = new Map();
  trabajos.forEach((trabajo) => {
    if (!porMateria.has(trabajo.materia)) {
      porMateria.set(trabajo.materia, []); // primera vez: creamos el array
    }
    porMateria.get(trabajo.materia).push(trabajo.titulo);
  });
  imprimir('Trabajos agrupados por materia ->', porMateria);

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
  titulo('5. Set: colecciones de valores únicos');

  const tecnologias = new Set(['HTML', 'CSS', 'JavaScript']);

  tecnologias.add('CSS');        // ya estaba: se ignora en silencio
  tecnologias.add('TypeScript'); // nueva: entra

  imprimir('El Set ->', tecnologias);
  imprimir('size ->', tecnologias.size); // 4, no 5

  imprimir('has("CSS") ->', tecnologias.has('CSS'));
  imprimir('has("PHP") ->', tecnologias.has('PHP'));
  imprimir('delete("HTML") ->', tecnologias.delete('HTML'));
  imprimir('Tras borrar ->', tecnologias);

  // El uso más famoso: eliminar duplicados de un array en una sola línea.
  const inscripcionesConRepetidos = ['lucia', 'martin', 'lucia', 'sofia', 'martin', 'lucia'];
  const sinRepetidos = [...new Set(inscripcionesConRepetidos)];
  imprimir('Array original ->', inscripcionesConRepetidos);
  imprimir('Sin duplicados ->', sinRepetidos);

  // Recorrerlo con for...of.
  for (const tecnologia of tecnologias) {
    imprimir('   tecnología:', tecnologia);
  }

  // ⚠️ ERROR COMÚN: pensar que un Set elimina objetos "iguales". Compara por
  // REFERENCIA, así que dos objetos con el mismo contenido son distintos.
  const conObjetos = new Set([{ id: 1 }, { id: 1 }]);
  imprimir('Dos objetos de igual contenido ->', conObjetos.size); // 2

  // ✅ Truco para deduplicar objetos por una propiedad: usar un Map con esa
  // propiedad como clave.
  const registros = [
    { id: 1, nombre: 'Lucía' },
    { id: 2, nombre: 'Martín' },
    { id: 1, nombre: 'Lucía (duplicada)' },
  ];
  const unicosPorId = [...new Map(registros.map((r) => [r.id, r])).values()];
  imprimir('Deduplicado por id ->', unicosPorId);

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
  titulo('6. Unión, intersección y diferencia');

  const materiasLucia = new Set(['HTML', 'CSS', 'JavaScript', 'Git']);
  const materiasMartin = new Set(['JavaScript', 'Git', 'Bases de datos']);

  // UNIÓN: todo lo que está en A o en B (sin repetir).
  const union = new Set([...materiasLucia, ...materiasMartin]);
  imprimir('Unión (todo lo que cursan entre las dos) ->', union);

  // INTERSECCIÓN: lo que está en A y TAMBIÉN en B.
  const interseccion = new Set([...materiasLucia].filter((m) => materiasMartin.has(m)));
  imprimir('Intersección (materias en común) ->', interseccion);

  // DIFERENCIA: lo que está en A pero NO en B.
  const diferencia = new Set([...materiasLucia].filter((m) => !materiasMartin.has(m)));
  imprimir('Diferencia (solo de Lucía) ->', diferencia);

  // DIFERENCIA SIMÉTRICA: lo que está en uno u otro, pero no en ambos.
  const simetrica = new Set([
    ...[...materiasLucia].filter((m) => !materiasMartin.has(m)),
    ...[...materiasMartin].filter((m) => !materiasLucia.has(m)),
  ]);
  imprimir('Diferencia simétrica ->', simetrica);

  // ¿Es un subconjunto?
  const basicas = new Set(['HTML', 'CSS']);
  const esSubconjunto = [...basicas].every((m) => materiasLucia.has(m));
  imprimir('¿"basicas" está dentro de las de Lucía? ->', esSubconjunto);

  /*
   * NOVEDAD: los navegadores modernos (2024 en adelante) ya incluyen métodos
   * nativos: union(), intersection(), difference(), symmetricDifference(),
   * isSubsetOf()... Son más cómodos, pero conviene comprobar el soporte
   * antes de usarlos en un proyecto real.
   */
  if (typeof Set.prototype.intersection === 'function') {
    imprimir('Método nativo intersection() ->', materiasLucia.intersection(materiasMartin));
    imprimir('Método nativo union() ->', materiasLucia.union(materiasMartin));
  } else {
    imprimir('Este navegador todavía no trae los métodos nativos de Set.');
  }

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
  titulo('7. WeakMap y WeakSet (breve)');

  const metadatos = new WeakMap();
  const elementoFalso = { tipo: 'boton' }; // simula un elemento del DOM

  metadatos.set(elementoFalso, { clics: 0, creado: '2026-08-26' });
  imprimir('Metadatos guardados ->', metadatos.get(elementoFalso));
  imprimir('¿Tiene el objeto? ->', metadatos.has(elementoFalso));
  imprimir('No tiene .size ->', metadatos.size); // undefined

  // ⚠️ Con una clave que NO sea objeto lanza TypeError.
  try {
    metadatos.set('texto', 1);
  } catch (error) {
    imprimir('WeakMap con clave de texto ->', error.name);
  }

  const yaProcesados = new WeakSet();
  yaProcesados.add(elementoFalso);
  imprimir('WeakSet: ¿ya procesado? ->', yaProcesados.has(elementoFalso));

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
