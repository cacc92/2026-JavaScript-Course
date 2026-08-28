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

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Los DATOS DE EJEMPLO ya vienen escritos: son notas y estudiantes,
   no hay nada que aprender copiandolos. Lo que se escribe en vivo son
   las nueve funciones de demostracion.

   main.js llama a estas funciones EN ESTE ORDEN, agrupadas en dos botones:
     boton "metodos-array": demoAt, demoFindLast, demoFlat, demoObjetos,
                            demoGroupBy, demoNoDestructivos
     boton "metodos-texto": demoStrings, demoNumeros, demoStructuredClone
   Ademas hay que exportar el ayudante `agruparPor`.

   Tiempo estimado: 35 minutos (se puede partir por los dos botones).
   ============================================================ */

// TODO (en clase):
//   Marca de evaluacion, fuera de toda funcion:
//     console.log('[metodos-modernos.js] Modulo evaluado.');
//   (aprox. 1 linea)

// ============================================================
// DATOS DE EJEMPLO (realistas, compartidos por las demos)
// ------------------------------------------------------------
// NOTA DE LA PLANTILLA: esta seccion son DATOS y viene escrita.
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

// TODO (en clase) — export function demoAt(consola)
//   consola.titulo('Array.at(): indices negativos')
//   1. Compara la forma antigua NOTAS_CURSO[NOTAS_CURSO.length - 1] con la
//      moderna NOTAS_CURSO.at(-1). Imprime tambien at(-2) y at(0).
//   2. Fuera de rango devuelve undefined, no lanza error: imprime at(99).
//   3. ⚠️ ERROR COMUN: creer que notas[-1] funciona. En JavaScript los
//      corchetes con -1 buscan una PROPIEDAD llamada "-1", no la ultima
//      posicion. Devuelve undefined siempre. Imprimelo para demostrarlo.
//   4. at() tambien existe en los strings: con `const titulo = 'JavaScript';`
//      imprime titulo.at(-1) y titulo.at(0).
//   Resultado esperado: at(-1) -> 6.1 | at(-2) -> 2.9 | at(0) -> 5.8 |
//                       at(99) -> undefined | 'JavaScript'.at(-1) -> "t"
//   (aprox. 12 lineas)

// ============================================================
// 2. findLast() y findLastIndex()
// ============================================================

// TODO (en clase) — export function demoFindLast(consola)
//   find() recorre desde el PRINCIPIO y devuelve el primero que cumple.
//   findLast() recorre desde el FINAL: util cuando lo que interesa es
//   "lo mas reciente" (historiales, registros, movimientos).
//   1. Sobre NOTAS_CURSO, imprime find(n => n >= 4.0) y findLast(n => n >= 4.0),
//      y tambien findIndex y findLastIndex con la misma condicion.
//   2. Si nada cumple, find/findLast devuelven undefined y los index -1:
//      demuestralo con la condicion n > 7.5.
//   3. Caso realista: `ESTUDIANTES.findLast((e) => e.jornada === 'vespertina')`
//      e imprime su .nombre.
//   Resultado esperado: find -> 5.8 | findLast -> 6.1 | findIndex -> 0 |
//                       findLastIndex -> 6 | ultimo vespertino -> "Diego Soto"
//   (aprox. 12 lineas)

// ============================================================
// 3. flat() y flatMap()
// ============================================================

// TODO (en clase) — export function demoFlat(consola)
//   1. consola.titulo('flat(): aplanar arrays anidados')
//      Datos locales (escribelos, son 6 lineas):
//        const porSemana = [[5.8, 3.4], [6.7, 4.0, 7.0], [2.9], [[6.1, 5.5], [4.4]]];
//      Imprime el original, .flat(), .flat(2) y .flat(Infinity), que aplana
//      TODO sin importar cuantos niveles haya.
//   2. flat() tambien elimina los huecos de los arrays dispersos:
//      `const conHuecos = [1, , 3, , 5];` -> imprime su .length (5) y su .flat()
//      ([1, 3, 5]).
//   3. consola.titulo('flatMap(): map + flat(1) en una pasada')
//      Saca las asignaturas de todos los estudiantes con map (da un array de
//      arrays) y con flatMap (ya viene aplanado). Imprime tambien las unicas
//      con [...new Set(conFlatMap)].
//   4. Truco: si el callback devuelve [] se ELIMINA el elemento, y si devuelve
//      varios se AGREGAN varios. flatMap sirve como filter+map:
//        ESTUDIANTES.flatMap((e) => e.promedio >= 4.0 ? [e.nombre] : [])
//   5. Otro caso: `['modulos ES', 'destructuring avanzado', 'generadores']`
//      partido en palabras con flatMap((frase) => frase.split(' ')).
//   Resultado esperado de 4: ['Ana Perez', 'Luis Rojas', 'Diego Soto', 'Sofia Munoz']
//   (aprox. 22 lineas)

// ============================================================
// 4. Object.entries / values / fromEntries
// ============================================================

// TODO (en clase) — export function demoObjetos(consola)
//   Datos locales (6 lineas): `const precios = { 'Teclado mecanico': 45_990,
//   'Monitor 27 pulgadas': 189_990, 'Mouse inalambrico': 19_990, 'Audifonos': 34_990 };`
//   1. consola.titulo('Object.keys / values / entries') e imprime los tres.
//   2. consola.titulo('Object.fromEntries: el camino de vuelta')
//      Patron muy potente: objeto -> entries -> transformar -> objeto.
//      a) Aplica un 19 % de IVA a cada precio con entries + map + fromEntries.
//      b) Filtra un objeto por su valor (los objetos no tienen .filter):
//         quedate con los que superan 30_000, desestructurando `([, precio])`.
//      c) Invierte claves y valores de { es: 'Espanol', en: 'Ingles', pt: 'Portugues' }.
//      d) fromEntries acepta cualquier iterable de pares: pasale un
//         `new Map([['activo', true], ['intentos', 3]])`.
//      e) Y el caso mas util del mundo real: los parametros de una URL con
//         `new URLSearchParams('curso=fullstack2&modulo=10&nivel=avanzado')`.
//   3. consola.titulo('Object.hasOwn(): el sustituto de hasOwnProperty')
//      ⚠️ ERROR COMUN: usar `'clave' in objeto`, que tambien mira la cadena
//      de prototipos y da true para 'toString'. Imprime los tres casos:
//      'toString' in precios (true), Object.hasOwn(precios, 'toString') (false)
//      y Object.hasOwn(precios, 'Audifonos') (true).
//   (aprox. 26 lineas)

// ============================================================
// 5. Object.groupBy() (ES2024) y su plan B
// ============================================================

// TODO (en clase) — export function demoGroupBy(consola)
//   SOPORTE: Object.groupBy llego en 2024. Funciona en Chrome 117+,
//   Edge 117+, Firefox 119+ y Safari 17.4+. En navegadores mas
//   antiguos NO existe, asi que SIEMPRE hay que comprobarlo antes.
//   1. `const soportado = typeof Object.groupBy === 'function';` e imprimelo.
//   2. Si esta soportado: agrupa ESTUDIANTES por `jornada`, imprime las claves
//      y recorre con for...of sobre Object.entries mostrando
//      `  ${jornada}: ${lista.map((e) => e.nombre).join(', ')}`.
//      Agrupa tambien por una condicion calculada (promedio >= 4.0 ->
//      'aprobados' / 'reprobados') e imprime cuantos hay de cada uno usando
//      `(porSituacion.aprobados ?? []).length`.
//      Si NO esta soportado, avisa de que se usa el plan B.
//   3. consola.titulo('Plan B: agruparPor con reduce (funciona en todas partes)')
//      Llama a agruparPor(ESTUDIANTES, (e) => e.jornada) e imprime las claves
//      y los nombres de la jornada diurna.
//   ✅ BUENA PRACTICA: escribir el plan B como funcion propia y usarla
//   siempre. El codigo queda igual de legible y funciona en cualquier
//   navegador. Cuando el soporte sea universal, se borra el plan B.
//   Resultado esperado: diurna -> Ana Perez, Camila Diaz, Sofia Munoz
//                       aprobados 4, reprobados 1
//   (aprox. 24 lineas)

// TODO (en clase) — export function agruparPor(lista, obtenerClave)
//   Version propia de Object.groupBy usando reduce y el operador ??=.
//   Devuelve un objeto { clave: [elementos...] }.
//     return lista.reduce((grupos, elemento) => {
//       const clave = obtenerClave(elemento);
//       grupos[clave] ??= [];        // si el grupo no existe, lo creamos vacio
//       grupos[clave].push(elemento);
//       return grupos;
//     }, {});
//   OJO: tiene que ir EXPORTADA, la usa demoGroupBy y los ejercicios.
//   (aprox. 8 lineas)

// ============================================================
// 6. METODOS MODERNOS DE STRING
// ============================================================

// TODO (en clase) — export function demoStrings(consola)
//   1. consola.titulo('replaceAll()') con `const ruta = 'js/modulos/formato.js';`
//      Compara ruta.replace('/', ' > ') (solo la primera) con
//      ruta.replaceAll('/', ' > ') (todas).
//      "-> ERROR COMUN: usar replace creyendo que cambia todas las coincidencias."
//      Con expresion regular, replaceAll EXIGE la bandera global /g:
//      imprime 'a1b2c3'.replaceAll(/\d/g, '#') y provoca el TypeError sin /g
//      dentro de un try/catch.
//   2. consola.titulo('trim, trimStart y trimEnd') con `const sucio = '   Ana Perez   ';`
//      Imprime las cuatro versiones ENTRE CORCHETES para ver donde quedan los
//      espacios. "-> trimStart/trimEnd sirven para conservar la sangria de un lado."
//   3. consola.titulo('padStart y padEnd')
//      padStart rellena por la IZQUIERDA: String(42).padStart(6, '0') -> "000042";
//      una hora con `${String(9).padStart(2, '0')}:${String(5).padStart(2, '0')}`;
//      y '4321'.padStart(16, '*').
//      padEnd rellena por la DERECHA, perfecto para alinear tablas: imprime un
//      "MENU DE LA CAFETERIA" recorriendo
//      [['Cafe', 1_500], ['Sandwich', 3_900], ['Jugo natural', 2_200]] con
//      `${producto.padEnd(18, '.')}${String(precio).padStart(7, ' ')}`.
//      Si el texto ya es mas largo que el objetivo, no se recorta:
//      'JavaScript'.padStart(5, '*') -> "JavaScript".
//   4. consola.titulo('Otros metodos utiles de String') con
//      `const frase = 'Modulos ES en JavaScript moderno';`: includes('ES'),
//      startsWith('Mod'), endsWith('no'), '-=-'.repeat(3) y frase.at(-1).
//   (aprox. 30 lineas)

// ============================================================
// 7. NUMBER: comprobaciones sin sorpresas
// ============================================================

// TODO (en clase) — export function demoNumeros(consola)
//   OJO: esta funcion se llama igual que una de sintaxis-moderna.js. No hay
//   choque porque main.js las importa con `import * as`.
//   1. consola.titulo('Number.isInteger y compania')
//      `const entradas = [7, 7.0, 7.5, '7', '', null, undefined, NaN, Infinity, true];`
//      Recorre con for...of y en cada vuelta imprime una fila alineada con la
//      etiqueta del valor (entre comillas si es string), isInteger, isFinite y
//      Number(valor), usando padEnd(11) y padEnd(5).
//      "-> Number.isInteger NO convierte tipos: isInteger('7') es false."
//      "-> Fijate en que 7 y 7.0 son EL MISMO numero para JavaScript."
//   2. consola.titulo('parseInt y parseFloat frente a Number()')
//      parseInt lee mientras haya digitos y para al primer caracter raro.
//      Number() exige que TODA la cadena sea un numero valido.
//      Imprime: parseInt('45kg', 10) -> 45 | Number('45kg') -> NaN |
//      parseFloat('3.9km') -> 3.9 | Number('') -> 0 (¡sorpresa!) |
//      parseInt('', 10) -> NaN | parseInt('08', 10) -> 8.
//      ✅ BUENA PRACTICA: pasar SIEMPRE la base 10 a parseInt. Sin la base,
//      las versiones antiguas interpretaban el 0 inicial como octal.
//   (aprox. 22 lineas)

// ============================================================
// 8. structuredClone(): la copia profunda que faltaba
// ============================================================

// TODO (en clase) — export function demoStructuredClone(consola)
//   Datos locales (8 lineas): `const matricula = { estudiante: 'Camila Diaz',
//   inscrita: new Date(2026, 2, 15), asignaturas: ['HTML', 'CSS'],
//   apoderado: { nombre: 'Rosa Diaz', telefono: '+56 9 1111 2222' },
//   etiquetas: new Set(['beca', 'diurna']), notas: new Map([['CSS', 6.2]]) };`
//   1. Copia superficial con spread: cambia superficial.apoderado.nombre y
//      comprueba que el ORIGINAL tambien cambio. Devuelvelo a 'Rosa Diaz'
//      para seguir la demostracion.
//   2. El viejo truco del JSON: `JSON.parse(JSON.stringify(matricula))`.
//      Funciona, pero pierde informacion: imprime que la fecha se convirtio en
//      texto (typeof 'string'), y que el Set y el Map se quedan en {}.
//   3. structuredClone: copia profunda de verdad, conservando los tipos.
//      Comprueba antes `typeof structuredClone !== 'function'` y sal con un
//      aviso si no esta. Clona, cambia apoderado.nombre, haz push a
//      asignaturas y add a etiquetas, e imprime original y copia lado a lado,
//      mas las tres comprobaciones `instanceof Date / Set / Map` (todas true).
//   4. LIMITACION IMPORTANTE: structuredClone NO puede clonar funciones,
//      nodos del DOM ni simbolos. Si el objeto contiene alguno, lanza
//      un DataCloneError. Provocalo con `structuredClone({ accion: () => 'hola' })`
//      dentro de try/catch e imprime error.name.
//   (aprox. 35 lineas)

// ============================================================
// 9. METODOS NO DESTRUCTIVOS (ES2023)
// ============================================================

// TODO (en clase) — export function demoNoDestructivos(consola)
//   1. consola.titulo('toSorted, toReversed, with y toSpliced')
//      `const notas = [5.8, 3.4, 6.7, 4.0];`
//      sort() y reverse() MUTAN el array original. Eso rompe cosas cuando
//      el array viene de un estado compartido o de una prop: demuestralo
//      ordenando una copia `[...notas]`.
//      Comprueba `typeof notas.toSorted === 'function'` y, si existe, imprime
//      toSorted((a, b) => a - b), toReversed(), with(0, 7.0) y el original
//      intacto. Si no existe, imprime el equivalente clasico con [...notas].sort().
//   2. consola.titulo('Array.from(): crear arrays a partir de casi cualquier cosa')
//      Desde un iterable: Array.from('nota').
//      Desde un objeto con length (un "array-like"):
//        Array.from({ length: 4 }, (_, i) => i + 1)
//      Con funcion de mapeo, la tabla del 7:
//        Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}`)
//      e imprime solo los cuatro primeros con slice(0, 4).join(' | ') y '...'.
//   Resultado esperado: original intacto [5.8, 3.4, 6.7, 4] tras toSorted.
//   (aprox. 20 lineas)

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
