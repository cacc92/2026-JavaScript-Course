/**
 * ============================================================
 * ARCHIVO: js/extras/metodos-modernos.js
 * TEMA: Metodos modernos de Array, Object, String y Number
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Array.prototype.at()          (ES2022) indices negativos
 *  - Array.prototype.findLast()    (ES2023) buscar desde el final
 *  - Array.prototype.flat()        (ES2019) aplanar arrays anidados
 *  - Array.prototype.flatMap()     (ES2019) map + flat en un paso
 *  - Object.entries / values / fromEntries  (ES2017 / ES2019)
 *  - Object.groupBy()              (ES2024) agrupar, con plan B
 *  - Object.hasOwn()               (ES2022) sustituto de hasOwnProperty
 *  - String replaceAll, trimStart, trimEnd, padStart, padEnd, at
 *  - Number.isInteger / isFinite / isNaN / parseFloat / parseInt
 *  - structuredClone()             copia PROFUNDA nativa
 *  - Metodos "no destructivos" de ES2023: toSorted, toReversed, with
 *
 * IDEA CENTRAL
 * Muchos de estos metodos existen para EVITAR MUTAR el original.
 * Mutar datos compartidos es la fuente numero uno de bugs raros en
 * front end. Los metodos nuevos devuelven copias.
 * ============================================================
 */

console.log('[metodos-modernos.js] Modulo evaluado.');

// ============================================================
// DATOS DE EJEMPLO (realistas, compartidos por las demos)
// ============================================================

/** Notas de un curso, en escala 1,0 - 7,0. */
const NOTAS_CURSO = [5.8, 3.4, 6.7, 4.0, 7.0, 2.9, 6.1];

/** Estudiantes con sus asignaturas. Fijate en el array dentro del objeto. */
const ESTUDIANTES = [
  { id: 1, nombre: 'Ana Perez', jornada: 'diurna', promedio: 6.4, asignaturas: ['HTML', 'CSS', 'JS'] },
  { id: 2, nombre: 'Luis Rojas', jornada: 'vespertina', promedio: 4.1, asignaturas: ['JS', 'Git'] },
  { id: 3, nombre: 'Camila Diaz', jornada: 'diurna', promedio: 3.5, asignaturas: ['CSS'] },
  { id: 4, nombre: 'Diego Soto', jornada: 'vespertina', promedio: 5.9, asignaturas: ['HTML', 'JS', 'React', 'Git'] },
  { id: 5, nombre: 'Sofia Munoz', jornada: 'diurna', promedio: 6.9, asignaturas: [] },
];

// ============================================================
// 1. Array.prototype.at()
// ============================================================

export function demoAt(consola) {
  consola.titulo('Array.at(): indices negativos');

  // Antes, para leer el ultimo elemento habia que escribir esto:
  consola.imprimir('Forma antigua  : notas[notas.length - 1] =', NOTAS_CURSO[NOTAS_CURSO.length - 1]);
  // Ahora basta con un indice negativo:
  consola.imprimir('Forma moderna  : notas.at(-1) =', NOTAS_CURSO.at(-1));
  consola.imprimir('Penultimo      : notas.at(-2) =', NOTAS_CURSO.at(-2));
  consola.imprimir('Primero        : notas.at(0)  =', NOTAS_CURSO.at(0));

  // Fuera de rango devuelve undefined, no lanza error.
  consola.imprimir('Fuera de rango : notas.at(99) =', NOTAS_CURSO.at(99));

  // ERROR COMUN: creer que notas[-1] funciona. En JavaScript los
  // corchetes con -1 buscan una PROPIEDAD llamada "-1", no la ultima
  // posicion. Devuelve undefined siempre.
  consola.imprimir('notas[-1] (no funciona) =', NOTAS_CURSO[-1]);

  // at() tambien existe en los strings.
  const titulo = 'JavaScript';
  consola.imprimir('Ultima letra de "JavaScript":', titulo.at(-1));
  consola.imprimir('Primera letra:', titulo.at(0));
}

// ============================================================
// 2. findLast() y findLastIndex()
// ============================================================

export function demoFindLast(consola) {
  consola.titulo('findLast() y findLastIndex()');

  // find() recorre desde el PRINCIPIO y devuelve el primero que cumple.
  // findLast() recorre desde el FINAL: util cuando lo que interesa es
  // "lo mas reciente" (historiales, registros, movimientos).
  const primeraAprobada = NOTAS_CURSO.find((nota) => nota >= 4.0);
  const ultimaAprobada = NOTAS_CURSO.findLast((nota) => nota >= 4.0);

  consola.imprimir('Notas          :', NOTAS_CURSO);
  consola.imprimir('find(>= 4.0)     ->', primeraAprobada);
  consola.imprimir('findLast(>= 4.0) ->', ultimaAprobada);

  consola.imprimir('findIndex(>= 4.0)     ->', NOTAS_CURSO.findIndex((n) => n >= 4.0));
  consola.imprimir('findLastIndex(>= 4.0) ->', NOTAS_CURSO.findLastIndex((n) => n >= 4.0));

  // Si nada cumple, find/findLast devuelven undefined y los index -1.
  consola.imprimir('findLast(> 7.5) ->', NOTAS_CURSO.findLast((n) => n > 7.5));
  consola.imprimir('findLastIndex(> 7.5) ->', NOTAS_CURSO.findLastIndex((n) => n > 7.5));

  // Caso realista: el ultimo estudiante vespertino de la lista.
  const ultimoVespertino = ESTUDIANTES.findLast((e) => e.jornada === 'vespertina');
  consola.imprimir('Ultimo estudiante vespertino:', ultimoVespertino.nombre);
}

// ============================================================
// 3. flat() y flatMap()
// ============================================================

export function demoFlat(consola) {
  consola.titulo('flat(): aplanar arrays anidados');

  const porSemana = [
    [5.8, 3.4],
    [6.7, 4.0, 7.0],
    [2.9],
    [[6.1, 5.5], [4.4]],   // un nivel mas de anidamiento
  ];

  consola.imprimir('Original (anidado):', porSemana);
  consola.imprimir('flat()  -> un nivel  :', porSemana.flat());
  consola.imprimir('flat(2) -> dos niveles:', porSemana.flat(2));
  // Infinity aplana TODO, sin importar cuantos niveles haya.
  consola.imprimir('flat(Infinity)        :', porSemana.flat(Infinity));

  // flat() tambien elimina los huecos de los arrays dispersos.
  const conHuecos = [1, , 3, , 5];
  consola.imprimir('Array con huecos:', conHuecos.length, 'elementos');
  consola.imprimir('Tras flat():', conHuecos.flat());

  consola.titulo('flatMap(): map + flat(1) en una pasada');

  // Sacar TODAS las asignaturas de TODOS los estudiantes.
  // Con map obtendriamos un array de arrays; flatMap lo aplana solo.
  const conMap = ESTUDIANTES.map((e) => e.asignaturas);
  const conFlatMap = ESTUDIANTES.flatMap((e) => e.asignaturas);

  consola.imprimir('Con map      :', conMap);
  consola.imprimir('Con flatMap  :', conFlatMap);
  consola.imprimir('Sin repetidas:', [...new Set(conFlatMap)]);

  // Truco: si el callback devuelve [] se ELIMINA el elemento, y si
  // devuelve varios se AGREGAN varios. flatMap sirve como filter+map.
  const soloAprobados = ESTUDIANTES.flatMap((e) =>
    e.promedio >= 4.0 ? [e.nombre] : []
  );
  consola.imprimir('flatMap como filter+map (aprobados):', soloAprobados);

  // Otro caso: partir frases en palabras.
  const frases = ['modulos ES', 'destructuring avanzado', 'generadores'];
  consola.imprimir('Palabras:', frases.flatMap((frase) => frase.split(' ')));
}

// ============================================================
// 4. Object.entries / values / fromEntries
// ============================================================

export function demoObjetos(consola) {
  const precios = {
    'Teclado mecanico': 45_990,
    'Monitor 27 pulgadas': 189_990,
    'Mouse inalambrico': 19_990,
    'Audifonos': 34_990,
  };

  consola.titulo('Object.keys / values / entries');

  consola.imprimir('keys   ->', Object.keys(precios));
  consola.imprimir('values ->', Object.values(precios));
  consola.imprimir('entries->', Object.entries(precios));

  consola.titulo('Object.fromEntries: el camino de vuelta');

  // Patron muy potente: objeto -> entries -> transformar -> objeto.
  // Aqui aplicamos un 19% de IVA a cada precio.
  const conIva = Object.fromEntries(
    Object.entries(precios).map(([nombre, precio]) => [nombre, Math.round(precio * 1.19)])
  );
  consola.imprimir('Precios con IVA:', conIva);

  // Filtrar un objeto por su valor (los objetos no tienen .filter).
  const caros = Object.fromEntries(
    Object.entries(precios).filter(([, precio]) => precio > 30_000)
  );
  consola.imprimir('Solo los que superan 30.000:', caros);

  // Invertir claves y valores.
  const invertido = Object.fromEntries(
    Object.entries({ es: 'Espanol', en: 'Ingles', pt: 'Portugues' }).map(([k, v]) => [v, k])
  );
  consola.imprimir('Objeto invertido:', invertido);

  // fromEntries acepta cualquier iterable de pares: tambien un Map.
  const mapa = new Map([['activo', true], ['intentos', 3]]);
  consola.imprimir('Desde un Map:', Object.fromEntries(mapa));

  // Y el caso mas util del mundo real: los parametros de una URL.
  const parametros = new URLSearchParams('curso=fullstack2&modulo=10&nivel=avanzado');
  consola.imprimir('Desde URLSearchParams:', Object.fromEntries(parametros));

  consola.titulo('Object.hasOwn(): el sustituto de hasOwnProperty');

  // ERROR COMUN: usar `'clave' in objeto`, que tambien mira la cadena
  // de prototipos y da true para 'toString'.
  consola.imprimir("'toString' in precios      ->", 'toString' in precios);
  consola.imprimir('Object.hasOwn(precios, "toString") ->', Object.hasOwn(precios, 'toString'));
  consola.imprimir('Object.hasOwn(precios, "Audifonos") ->', Object.hasOwn(precios, 'Audifonos'));
}

// ============================================================
// 5. Object.groupBy() (ES2024) y su plan B
// ============================================================

export function demoGroupBy(consola) {
  consola.titulo('Object.groupBy(): agrupar en una linea');

  // SOPORTE: Object.groupBy llego en 2024. Funciona en Chrome 117+,
  // Edge 117+, Firefox 119+ y Safari 17.4+. En navegadores mas
  // antiguos NO existe, asi que SIEMPRE hay que comprobarlo antes.
  const soportado = typeof Object.groupBy === 'function';
  consola.imprimir('Este navegador soporta Object.groupBy?', soportado);

  if (soportado) {
    // Agrupamos por jornada. La funcion devuelve la CLAVE del grupo.
    const porJornada = Object.groupBy(ESTUDIANTES, (estudiante) => estudiante.jornada);
    consola.imprimir('Agrupados por jornada:', Object.keys(porJornada));
    for (const [jornada, lista] of Object.entries(porJornada)) {
      consola.imprimir(`  ${jornada}: ${lista.map((e) => e.nombre).join(', ')}`);
    }

    // Agrupar por una condicion calculada.
    const porSituacion = Object.groupBy(ESTUDIANTES, (e) =>
      e.promedio >= 4.0 ? 'aprobados' : 'reprobados'
    );
    consola.imprimir('Aprobados :', (porSituacion.aprobados ?? []).length);
    consola.imprimir('Reprobados:', (porSituacion.reprobados ?? []).length);
  } else {
    consola.imprimir('Usamos el plan B con reduce (ver funcion agruparPor).');
  }

  consola.titulo('Plan B: agruparPor con reduce (funciona en todas partes)');

  const porJornadaManual = agruparPor(ESTUDIANTES, (e) => e.jornada);
  consola.imprimir('Resultado manual:', Object.keys(porJornadaManual));
  consola.imprimir('Diurna:', porJornadaManual.diurna.map((e) => e.nombre));

  // BUENA PRACTICA: escribir el plan B como funcion propia y usarla
  // siempre. El codigo queda igual de legible y funciona en cualquier
  // navegador. Cuando el soporte sea universal, se borra el plan B.
}

/**
 * Version propia de Object.groupBy usando reduce y el operador ??=.
 * Devuelve un objeto { clave: [elementos...] }.
 */
export function agruparPor(lista, obtenerClave) {
  return lista.reduce((grupos, elemento) => {
    const clave = obtenerClave(elemento);
    grupos[clave] ??= [];        // si el grupo no existe, lo creamos vacio
    grupos[clave].push(elemento);
    return grupos;
  }, {});
}

// ============================================================
// 6. METODOS MODERNOS DE STRING
// ============================================================

export function demoStrings(consola) {
  consola.titulo('replaceAll()');

  const ruta = 'js/modulos/formato.js';
  consola.imprimir('Original:', ruta);
  consola.imprimir("replace('/', ' > ')    ->", ruta.replace('/', ' > '));      // solo la primera
  consola.imprimir("replaceAll('/', ' > ') ->", ruta.replaceAll('/', ' > '));   // todas
  consola.imprimir('-> ERROR COMUN: usar replace creyendo que cambia todas las coincidencias.');

  // Con expresion regular, replaceAll EXIGE la bandera global /g.
  consola.imprimir("Con regex /g:", 'a1b2c3'.replaceAll(/\d/g, '#'));
  try {
    // Sin la /g lanza TypeError. Lo comprobamos en vivo.
    'a1b2c3'.replaceAll(/\d/, '#');
  } catch (error) {
    consola.imprimir(`replaceAll con regex sin /g -> ${error.constructor.name}`);
  }

  consola.titulo('trim, trimStart y trimEnd');

  const sucio = '   Ana Perez   ';
  // Usamos corchetes en la salida para VER donde quedan los espacios.
  consola.imprimir(`original  : [${sucio}]`);
  consola.imprimir(`trim()    : [${sucio.trim()}]`);
  consola.imprimir(`trimStart(): [${sucio.trimStart()}]`);
  consola.imprimir(`trimEnd()  : [${sucio.trimEnd()}]`);
  consola.imprimir('-> trimStart/trimEnd sirven para conservar la sangria de un lado.');

  consola.titulo('padStart y padEnd');

  // padStart: rellena por la IZQUIERDA hasta llegar al largo pedido.
  consola.imprimir('Folio  :', String(42).padStart(6, '0'));            // 000042
  consola.imprimir('Hora   :', `${String(9).padStart(2, '0')}:${String(5).padStart(2, '0')}`);
  consola.imprimir('Tarjeta:', '4321'.padStart(16, '*'));

  // padEnd: rellena por la DERECHA. Perfecto para alinear tablas.
  consola.imprimir('');
  consola.imprimir('MENU DE LA CAFETERIA');
  const menu = [['Cafe', 1_500], ['Sandwich', 3_900], ['Jugo natural', 2_200]];
  for (const [producto, precio] of menu) {
    consola.imprimir(`${producto.padEnd(18, '.')}${String(precio).padStart(7, ' ')}`);
  }

  // Si el texto ya es mas largo que el objetivo, no se recorta.
  consola.imprimir('');
  consola.imprimir("'JavaScript'.padStart(5, '*') ->", 'JavaScript'.padStart(5, '*'));

  consola.titulo('Otros metodos utiles de String');

  const frase = 'Modulos ES en JavaScript moderno';
  consola.imprimir('includes("ES")   ->', frase.includes('ES'));
  consola.imprimir('startsWith("Mod")->', frase.startsWith('Mod'));
  consola.imprimir('endsWith("no")   ->', frase.endsWith('no'));
  consola.imprimir('repeat(3)        ->', '-=-'.repeat(3));
  consola.imprimir('at(-1)           ->', frase.at(-1));
}

// ============================================================
// 7. NUMBER: comprobaciones sin sorpresas
// ============================================================

export function demoNumeros(consola) {
  consola.titulo('Number.isInteger y compania');

  const entradas = [7, 7.0, 7.5, '7', '', null, undefined, NaN, Infinity, true];

  // Recorremos y comparamos las respuestas de cada comprobacion.
  // Ponemos comillas a los textos para distinguir el numero 7 del texto "7".
  for (const valor of entradas) {
    const etiqueta = typeof valor === 'string' ? `"${valor}"` : String(valor);
    consola.imprimir(
      `${etiqueta.padEnd(11)} | isInteger: ${String(Number.isInteger(valor)).padEnd(5)} | ` +
      `isFinite: ${String(Number.isFinite(valor)).padEnd(5)} | Number(): ${Number(valor)}`
    );
  }

  consola.imprimir('');
  consola.imprimir('-> Number.isInteger NO convierte tipos: isInteger("7") es false.');
  consola.imprimir('-> Fijate en que 7 y 7.0 son EL MISMO numero para JavaScript.');

  consola.titulo('parseInt y parseFloat frente a Number()');

  // parseInt lee mientras haya digitos y para al primer caracter raro.
  // Number() exige que TODA la cadena sea un numero valido.
  consola.imprimir("parseInt('45kg')    ->", parseInt('45kg', 10));   // 45
  consola.imprimir("Number('45kg')      ->", Number('45kg'));         // NaN
  consola.imprimir("parseFloat('3.9km') ->", parseFloat('3.9km'));    // 3.9
  consola.imprimir("Number('')          ->", Number(''));             // 0  (sorpresa!)
  consola.imprimir("parseInt('')        ->", parseInt('', 10));       // NaN

  // BUENA PRACTICA: pasar SIEMPRE la base 10 a parseInt.
  consola.imprimir("parseInt('08')      ->", parseInt('08', 10));
  consola.imprimir('-> Sin la base, las versiones antiguas interpretaban el 0 inicial como octal.');
}

// ============================================================
// 8. structuredClone(): la copia profunda que faltaba
// ============================================================

export function demoStructuredClone(consola) {
  consola.titulo('structuredClone(): copia profunda nativa');

  const matricula = {
    estudiante: 'Camila Diaz',
    inscrita: new Date(2026, 2, 15),
    asignaturas: ['HTML', 'CSS'],
    apoderado: { nombre: 'Rosa Diaz', telefono: '+56 9 1111 2222' },
    etiquetas: new Set(['beca', 'diurna']),
    notas: new Map([['CSS', 6.2]]),
  };

  // 1) Copia superficial con spread: los objetos anidados se COMPARTEN.
  const superficial = { ...matricula };
  superficial.apoderado.nombre = 'CAMBIADO POR LA COPIA';
  consola.imprimir('Tras tocar la copia superficial, el original dice:', matricula.apoderado.nombre);

  // Lo devolvemos a su valor para seguir la demostracion.
  matricula.apoderado.nombre = 'Rosa Diaz';

  // 2) El viejo truco del JSON: funciona, pero pierde informacion.
  const conJson = JSON.parse(JSON.stringify(matricula));
  consola.imprimir('');
  consola.imprimir('Con JSON, la fecha se convierte en texto:', typeof conJson.inscrita);
  consola.imprimir('Con JSON, el Set se pierde:', conJson.etiquetas);
  consola.imprimir('Con JSON, el Map se pierde:', conJson.notas);

  // 3) structuredClone: copia profunda de verdad, conservando los tipos.
  if (typeof structuredClone !== 'function') {
    consola.imprimir('Este navegador no soporta structuredClone.');
    return;
  }

  const profunda = structuredClone(matricula);
  profunda.apoderado.nombre = 'CAMBIADO POR LA COPIA PROFUNDA';
  profunda.asignaturas.push('JS');
  profunda.etiquetas.add('destacada');

  consola.imprimir('');
  consola.imprimir('Original apoderado :', matricula.apoderado.nombre);
  consola.imprimir('Copia    apoderado :', profunda.apoderado.nombre);
  consola.imprimir('Original asignaturas:', matricula.asignaturas);
  consola.imprimir('Copia    asignaturas:', profunda.asignaturas);
  consola.imprimir('La fecha sigue siendo un Date?', profunda.inscrita instanceof Date);
  consola.imprimir('El Set sigue siendo un Set?', profunda.etiquetas instanceof Set);
  consola.imprimir('El Map sigue siendo un Map?', profunda.notas instanceof Map);

  // LIMITACION IMPORTANTE: structuredClone NO puede clonar funciones,
  // nodos del DOM ni simbolos. Si el objeto contiene alguno, lanza
  // un DataCloneError.
  consola.imprimir('');
  try {
    structuredClone({ accion: () => 'hola' });
  } catch (error) {
    consola.imprimir(`Clonar un objeto con funciones -> ${error.name}`);
    consola.imprimir('-> structuredClone no clona funciones, nodos del DOM ni simbolos.');
  }
}

// ============================================================
// 9. METODOS NO DESTRUCTIVOS (ES2023)
// ============================================================

export function demoNoDestructivos(consola) {
  consola.titulo('toSorted, toReversed, with y toSpliced');

  const notas = [5.8, 3.4, 6.7, 4.0];

  // sort() y reverse() MUTAN el array original. Eso rompe cosas cuando
  // el array viene de un estado compartido o de una prop.
  const copiaParaMutar = [...notas];
  copiaParaMutar.sort((a, b) => a - b);
  consola.imprimir('sort() muta: por eso siempre copiamos antes ->', copiaParaMutar);

  // Los metodos nuevos devuelven un array NUEVO y dejan el original intacto.
  if (typeof notas.toSorted === 'function') {
    consola.imprimir('toSorted()  ->', notas.toSorted((a, b) => a - b));
    consola.imprimir('toReversed()->', notas.toReversed());
    consola.imprimir('with(0, 7)  ->', notas.with(0, 7.0));  // cambia una posicion
    consola.imprimir('Original intacto:', notas);
  } else {
    consola.imprimir('Este navegador aun no soporta toSorted/toReversed/with.');
    consola.imprimir('Equivalente clasico:', [...notas].sort((a, b) => a - b));
  }

  consola.titulo('Array.from(): crear arrays a partir de casi cualquier cosa');

  // Desde un iterable.
  consola.imprimir("Array.from('nota') ->", Array.from('nota'));

  // Desde un objeto con length (un "array-like").
  consola.imprimir('Desde {length: 4}  ->', Array.from({ length: 4 }, (_, i) => i + 1));

  // Con funcion de mapeo: tabla del 7.
  const tablaDel7 = Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}`);
  consola.imprimir('Tabla del 7:', tablaDel7.slice(0, 4).join(' | '), '...');
}

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Usa flatMap sobre ESTUDIANTES para obtener un array de pares
 *    [nombreEstudiante, asignatura] con una fila por asignatura, y
 *    conviertelo en objeto agrupado por asignatura con agruparPor().
 *
 * 2) Escribe `resumenDeInventario(objeto)` que reciba { producto: stock },
 *    filtre los que tengan stock 0 con Object.entries + filter, y devuelva
 *    de nuevo un objeto con Object.fromEntries.
 *
 * 3) Crea `formatearRecibo(lineas)` que devuelva un texto alineado usando
 *    padEnd para el producto y padStart para el importe, con una linea de
 *    total al final. Practica repeat() para el separador.
 *
 * 4) Compara en la consola del navegador el tiempo de structuredClone frente
 *    a JSON.parse(JSON.stringify(...)) con un objeto de 10_000 elementos.
 *    Usa performance.now() y explica el resultado.
 *
 * 5) AVANZADO: implementa `aplanarProfundo(array)` de forma recursiva sin usar
 *    flat(), y comprueba que da el mismo resultado que flat(Infinity) con el
 *    array de la seccion 3.
 * ============================================================
 */
