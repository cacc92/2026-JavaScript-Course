/**
 * ============================================================================
 * ARCHIVO: js/01-basicos-y-mutadores.js
 * PROYECTO: 04 · Arrays y métodos funcionales
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Qué es un array y para qué sirve en el día a día.
 *   2. Cómo se crea: con literal [] y con el constructor new Array().
 *   3. Índices que empiezan en 0, la propiedad length y el método at().
 *   4. Cómo leer y modificar posiciones (y qué pasa si te sales del rango).
 *   5. Arrays multidimensionales (matrices) y bucles anidados.
 *   6. Métodos que MUTAN el array original.
 *   7. Métodos que NO mutan: devuelven un array nuevo.
 *
 * POR QUÉ TODO ESTÁ ENVUELTO EN UNA IIFE
 *   IIFE = Immediately Invoked Function Expression: una función que se declara
 *   y se ejecuta en el mismo instante, con la forma (function () { ... })();
 *   Esta página carga CINCO archivos .js distintos. Si dos de ellos declararan
 *   en el ámbito global "const notas = [...]", el navegador detendría todo con
 *   el error: "Uncaught SyntaxError: Identifier 'notas' has already been declared".
 *   Al meter cada archivo dentro de una función, sus variables viven SOLO ahí
 *   dentro y no se pisan con las de los demás archivos. Es el mismo motivo por
 *   el que cada aula tiene su propia pizarra: nadie borra lo del vecino.
 * ============================================================================
 */

(function () {
  // 'use strict' activa el "modo estricto": el navegador es más severo y avisa
  // de errores que, de otro modo, pasarían en silencio (por ejemplo, usar una
  // variable sin declararla). Buena costumbre en todo archivo profesional.
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (la "consola visual")
  // ============================================================
  // Los estudiantes no siempre tienen abierto DevTools (F12), y en clase la
  // pantalla se proyecta. Por eso todo lo que imprimimos va a DOS sitios:
  // la consola clásica del navegador y un bloque <pre> visible en la página.

  // Id del <pre> de ESTA sección. Cada archivo escribe en su propio bloque.
  var ID_SALIDA = 'salida-1';

  /**
   * formatear(): convierte cualquier valor en un texto legible.
   * Los objetos y arrays se muestran como JSON; si el JSON es corto lo dejamos
   * en una sola línea y, si es largo, lo "embellecemos" con saltos e indentación.
   */
  function formatear(valor) {
    if (typeof valor === 'string') return valor; // Los textos van tal cual.
    if (valor === undefined) return 'undefined'; // JSON.stringify no sabe mostrarlo.
    if (valor === null) return 'null';
    if (typeof valor === 'object') {
      var compacto = JSON.stringify(valor);
      if (compacto === undefined) return String(valor);
      return compacto.length <= 90 ? compacto : JSON.stringify(valor, null, 2);
    }
    return String(valor); // números, booleanos, funciones...
  }

  /**
   * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la página, para que se vea en clase sin
   * abrir las herramientas de desarrollo.
   * Los tres puntos (...mensajes) son el "parámetro rest": recogen todos los
   * argumentos que reciba la función dentro de un array llamado "mensajes".
   */
  function imprimir(...mensajes) {
    console.log(...mensajes); // Salida clásica de DevTools.
    var salida = document.getElementById(ID_SALIDA);
    if (!salida) return; // Si la página no tiene consola visual, no hacemos nada.
    var texto = mensajes.map(formatear).join(' ');
    salida.textContent += texto + '\n';
  }

  /**
   * titulo(): imprime un separador visual antes de cada sección,
   * para que la salida no sea un muro de texto indistinguible.
   */
  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ============================================================
  // 1. ¿QUÉ ES UN ARRAY?
  // ============================================================
  // Una variable normal guarda UN dato: const nota = 7;
  // Un array guarda una LISTA ORDENADA de datos bajo un solo nombre.
  // Piensa en una fila de casilleros numerados: el array es la fila entera,
  // cada casillero es una posición y dentro de cada uno hay un valor.
  // Se usa siempre que la cantidad de datos puede crecer o no se conoce de
  // antemano: los estudiantes de un curso, los productos de un carrito...

  titulo('1. QUÉ ES UN ARRAY Y CÓMO SE CREA');

  // Forma 1 (la que usarás el 99% de las veces): LITERAL con corchetes.
  const cursos = ['Matemáticas', 'Historia', 'Programación', 'Biología'];

  imprimir('cursos ->', cursos);
  imprimir('Cantidad de cursos ->', cursos.length); // 4

  // Un array puede contener CUALQUIER tipo de dato, incluso mezclados.
  // En la práctica se evita mezclar: un array suele guardar "cosas del mismo tipo".
  const mezclado = ['Ana Ruiz', 19, true, null, ['Física', 'Química']];
  imprimir('Array con tipos mezclados ->', mezclado);

  // ⚠️ ERROR COMÚN: creer que existe un "tipo array" en JavaScript.
  // typeof devuelve "object" para los arrays, porque internamente son objetos
  // con claves numéricas. Para saber si algo es un array hay un método exacto.
  imprimir('typeof cursos ->', typeof cursos); // "object"  <-- ¡no dice "array"!
  imprimir('Array.isArray(cursos) ->', Array.isArray(cursos)); // true
  imprimir('Array.isArray("hola") ->', Array.isArray('hola')); // false

  // ✅ BUENA PRÁCTICA: usar SIEMPRE Array.isArray() para comprobarlo.

  // ------------------------------------------------------------
  // 1.b) El constructor new Array(): la trampa clásica
  // ------------------------------------------------------------
  // new Array() acepta dos comportamientos MUY distintos según los argumentos:
  //   - Con UN número: crea un array VACÍO de esa longitud (lleno de "huecos").
  //   - Con varios valores: crea un array con esos valores.
  // Esa ambigüedad es la razón por la que casi nadie lo usa.

  const conValores = new Array('Lunes', 'Martes', 'Miércoles');
  imprimir('new Array("Lunes","Martes","Miércoles") ->', conValores); // 3 elementos

  const treshuecos = new Array(3);
  // ⚠️ ERROR COMÚN: esperar [3]. Lo que sale es un array de longitud 3 SIN valores.
  // Al convertirlo a JSON los huecos aparecen como null; en la consola de
  // DevTools se ven como "empty x 3". No es lo mismo un hueco que un undefined.
  imprimir('new Array(3) ->', treshuecos, '| length:', treshuecos.length); // length: 3
  imprimir('¿Existe la posición 0? ->', 0 in treshuecos); // false: es un HUECO real

  // ✅ BUENA PRÁCTICA: si necesitas un array de N posiciones con un valor inicial:
  const cincoCeros = new Array(5).fill(0);
  imprimir('new Array(5).fill(0) ->', cincoCeros); // [0,0,0,0,0]

  // ============================================================
  // 2. ÍNDICES (EMPIEZAN EN 0), length, ACCESO Y MODIFICACIÓN
  // ============================================================
  // El índice es el número del casillero. El primero es el 0, NO el 1.
  // Regla de oro: el último índice siempre es length - 1.
  // Si un array tiene 5 notas, sus índices son 0, 1, 2, 3 y 4.

  titulo('2. ÍNDICES, LENGTH, ACCESO Y MODIFICACIÓN');

  const notas = [7, 9, 5, 10, 6];

  imprimir('notas ->', notas);
  imprimir('notas.length ->', notas.length); // 5
  imprimir('Primera nota  notas[0] ->', notas[0]); // 7
  imprimir('Tercera nota  notas[2] ->', notas[2]); // 5

  // Fórmula clásica para la última posición:
  imprimir('Última nota  notas[notas.length - 1] ->', notas[notas.length - 1]); // 6

  // at() (moderno) permite índices NEGATIVOS que cuentan desde el final.
  // Es mucho más legible que la fórmula anterior.
  imprimir('notas.at(-1) ->', notas.at(-1)); // 6  (la última)
  imprimir('notas.at(-2) ->', notas.at(-2)); // 10 (la penúltima)

  // ⚠️ ERROR COMÚN: usar notas[-1] pensando que da la última.
  // En un array, [-1] NO es una posición: devuelve undefined.
  imprimir('notas[-1] ->', notas[-1]); // undefined

  // ⚠️ ERROR COMÚN: leer una posición que no existe. No lanza error: da undefined.
  // Ese undefined suele explotar más adelante ("cannot read properties of undefined").
  imprimir('notas[99] ->', notas[99]); // undefined

  // Modificar una posición existente: se asigna igual que una variable.
  notas[2] = 8; // La tercera nota sube de 5 a 8.
  imprimir('Tras notas[2] = 8 ->', notas); // [7,9,8,10,6]

  // ------------------------------------------------------------
  // 2.b) length se puede ESCRIBIR (y eso corta el array)
  // ------------------------------------------------------------
  // length no es solo informativo: si le asignas un número menor, JavaScript
  // BORRA los elementos sobrantes. Es un truco raro pero conviene conocerlo.
  const copiaNotas = [7, 9, 8, 10, 6];
  copiaNotas.length = 3;
  imprimir('copiaNotas.length = 3 ->', copiaNotas); // [7,9,8]

  // Y si asignas a una posición muy lejana, el array crece con huecos en medio.
  const conHueco = [1, 2];
  conHueco[5] = 99;
  // ⚠️ ERROR COMÚN: pensar que se añadió "al lado". Se crearon huecos 2, 3 y 4.
  imprimir('conHueco ->', conHueco, '| length:', conHueco.length); // length: 6

  // ✅ BUENA PRÁCTICA: no crear huecos nunca. Para añadir al final se usa push().

  // ============================================================
  // 3. ARRAYS MULTIDIMENSIONALES (MATRICES) Y BUCLES ANIDADOS
  // ============================================================
  // Un array puede contener otros arrays. Cuando todos los elementos son
  // arrays de la misma longitud tenemos una MATRIZ: una tabla de filas y
  // columnas. Ejemplo real: las notas de tres parciales de varios estudiantes.
  //   - La primera dimensión (fila) es el estudiante.
  //   - La segunda dimensión (columna) es el parcial.

  titulo('3. MATRICES (ARRAYS DE ARRAYS) Y BUCLES ANIDADOS');

  const nombresFila = ['Ana Ruiz', 'Luis Paz', 'Sara Gil'];

  const calificaciones = [
    // Parcial 1, Parcial 2, Parcial 3
    [7, 8, 9], // Ana Ruiz
    [5, 6, 4], // Luis Paz
    [10, 9, 8], // Sara Gil
  ];

  // Para llegar a un valor concreto se encadenan dos índices: [fila][columna].
  imprimir('calificaciones[0] ->', calificaciones[0]); // fila completa de Ana
  imprimir('calificaciones[1][2] ->', calificaciones[1][2]); // 4 -> Luis, parcial 3
  imprimir('Filas ->', calificaciones.length); // 3
  imprimir('Columnas ->', calificaciones[0].length); // 3

  // ------------------------------------------------------------
  // Recorrer una matriz: BUCLE DENTRO DE BUCLE
  // ------------------------------------------------------------
  // El bucle exterior avanza por las filas (índice i).
  // Por CADA fila, el bucle interior recorre entera esa fila (índice j).
  // Si hay 3 filas y 3 columnas, el interior se ejecuta 3 x 3 = 9 veces.
  // ✅ BUENA PRÁCTICA: nombrar i y j por lo que significan (fila/columna)
  // en cuanto el código crece; aquí los dejamos para que veas la forma clásica.
  for (let i = 0; i < calificaciones.length; i++) {
    let linea = nombresFila[i] + ': ';
    for (let j = 0; j < calificaciones[i].length; j++) {
      linea += 'P' + (j + 1) + '=' + calificaciones[i][j] + '  ';
    }
    imprimir(linea);
  }

  // Y un cálculo típico: el promedio de cada fila con bucles anidados.
  for (let i = 0; i < calificaciones.length; i++) {
    let suma = 0;
    for (let j = 0; j < calificaciones[i].length; j++) {
      suma += calificaciones[i][j];
    }
    const promedio = suma / calificaciones[i].length;
    // toFixed(2) devuelve un TEXTO con dos decimales (ojo: ya no es un número).
    imprimir('Promedio de ' + nombresFila[i] + ' -> ' + promedio.toFixed(2));
  }

  // ============================================================
  // 4. MÉTODOS QUE **MUTAN** EL ARRAY ORIGINAL
  // ============================================================
  // "Mutar" significa modificar el array sobre el que se llama al método:
  // el array de siempre cambia por dentro, no se crea uno nuevo.
  // Analogía: es como tachar y reescribir en la misma hoja de papel.
  //
  // ⚠️ ERROR COMÚN: escribir  notas = notas.push(5);  Los mutadores NO devuelven
  // el array; devuelven otra cosa (la nueva longitud, el elemento quitado...).
  //
  // ✅ Detalle importante: un array declarado con const SÍ se puede mutar.
  // const impide REASIGNAR la variable (notas = otroArray), no cambiar su contenido.

  titulo('4. MÉTODOS QUE MUTAN EL ARRAY ORIGINAL');

  // ------------------------------------------------------------
  // 4.1) push() y pop(): trabajan al FINAL del array
  // ------------------------------------------------------------
  // Imagina una pila de bandejas: pones y quitas siempre por arriba.
  const tareas = ['Leer el capítulo 3', 'Resolver la guía'];

  const nuevaLongitud = tareas.push('Preparar la exposición');
  imprimir('push() ->', tareas);
  imprimir('push() DEVUELVE la nueva longitud ->', nuevaLongitud); // 3

  // push admite varios elementos de una sola vez.
  tareas.push('Entregar el informe', 'Repasar para el examen');
  imprimir('push() con varios ->', tareas); // 5 tareas

  const quitada = tareas.pop(); // Quita el ÚLTIMO y lo devuelve.
  imprimir('pop() devuelve ->', quitada); // "Repasar para el examen"
  imprimir('tareas tras pop() ->', tareas); // 4 tareas

  // ------------------------------------------------------------
  // 4.2) unshift() y shift(): trabajan al PRINCIPIO del array
  // ------------------------------------------------------------
  // Como una fila de personas: unshift mete a alguien al inicio de la fila,
  // shift atiende (y saca) al primero.
  tareas.unshift('Revisar el correo del curso'); // Añade al principio.
  imprimir('unshift() ->', tareas);

  const primera = tareas.shift(); // Quita el PRIMERO y lo devuelve.
  imprimir('shift() devuelve ->', primera); // "Revisar el correo del curso"
  imprimir('tareas tras shift() ->', tareas);

  // ⚠️ Nota de rendimiento: shift() y unshift() obligan a RENUMERAR todas las
  // posiciones, así que con arrays enormes son más lentos que push()/pop().

  // ------------------------------------------------------------
  // 4.3) splice(): la navaja suiza (borra, inserta y reemplaza)
  // ------------------------------------------------------------
  // Firma: array.splice(desde, cuántosBorrar, ...elementosAInsertar)
  // Devuelve un array con los elementos BORRADOS.
  const plan = ['Leer', 'Resumir', 'Exponer', 'Evaluar'];

  // (a) BORRAR: desde la posición 1, borra 2 elementos.
  const borrados = plan.splice(1, 2);
  imprimir('splice(1, 2) borra ->', borrados); // ["Resumir","Exponer"]
  imprimir('plan queda ->', plan); // ["Leer","Evaluar"]

  // (b) INSERTAR sin borrar nada: el segundo argumento es 0.
  plan.splice(1, 0, 'Investigar', 'Redactar');
  imprimir('splice(1, 0, ...) inserta ->', plan); // ["Leer","Investigar","Redactar","Evaluar"]

  // (c) REEMPLAZAR: borra 1 e inserta 1 en el mismo sitio.
  plan.splice(2, 1, 'Corregir');
  imprimir('splice(2, 1, "Corregir") ->', plan); // ["Leer","Investigar","Corregir","Evaluar"]

  // ⚠️ ERROR COMÚN: confundir splice() (MUTA, recorta de verdad) con
  // slice() (NO muta, saca una copia de un trozo). Se parecen en el nombre
  // y hacen cosas opuestas respecto al original. Recuerda: splice tiene "p" de "parte y pega".

  // ------------------------------------------------------------
  // 4.4) reverse(): da la vuelta al array (mutando)
  // ------------------------------------------------------------
  const posiciones = ['Oro', 'Plata', 'Bronce'];
  posiciones.reverse();
  imprimir('reverse() ->', posiciones); // ["Bronce","Plata","Oro"]

  // ------------------------------------------------------------
  // 4.5) fill(): rellena posiciones con un valor
  // ------------------------------------------------------------
  // Firma: fill(valor, desde, hasta) — "hasta" NO se incluye.
  const asistencia = new Array(5).fill(false);
  imprimir('new Array(5).fill(false) ->', asistencia); // [false x5]

  const numeros = [1, 2, 3, 4, 5];
  numeros.fill(0, 1, 3); // Rellena con 0 las posiciones 1 y 2 (la 3 queda fuera).
  imprimir('numeros.fill(0, 1, 3) ->', numeros); // [1,0,0,4,5]

  // ------------------------------------------------------------
  // 4.6) sort(): TAMBIÉN muta (lo estudiamos a fondo en el archivo 04)
  // ------------------------------------------------------------
  const letras = ['c', 'a', 'b'];
  letras.sort();
  imprimir('letras.sort() ->', letras); // ["a","b","c"] (y "letras" cambió)

  // Lista completa de mutadores para memorizar:
  //   push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin
  imprimir(
    'MUTADORES: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin'
  );

  // ============================================================
  // 5. MÉTODOS QUE **NO** MUTAN: DEVUELVEN UN ARRAY NUEVO
  // ============================================================
  // Estos métodos dejan el original INTACTO y devuelven un resultado nuevo.
  // Analogía: en vez de tachar la hoja, la fotocopias y escribes en la copia.
  //
  // ⚠️ ERROR COMÚN: llamar al método y no guardar el resultado.
  //     nombres.slice(0, 2);           <- no hace nada útil, el resultado se pierde
  //     const dos = nombres.slice(0, 2); <- así sí

  titulo('5. MÉTODOS QUE NO MUTAN (DEVUELVEN UNO NUEVO)');

  const meses = ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];

  // ------------------------------------------------------------
  // 5.1) slice(desde, hasta): copia un trozo. "hasta" NO se incluye.
  // ------------------------------------------------------------
  imprimir('meses.slice(1, 3) ->', meses.slice(1, 3)); // ["Abril","Mayo"]
  imprimir('meses.slice(2) ->', meses.slice(2)); // desde la 2 hasta el final
  imprimir('meses.slice(-2) ->', meses.slice(-2)); // los 2 últimos
  imprimir('meses.slice() ->', meses.slice()); // COPIA completa
  imprimir('El original NO cambió ->', meses); // sigue con 5 meses

  // ✅ BUENA PRÁCTICA: slice() sin argumentos es la forma clásica de copiar un
  // array antes de aplicarle un mutador (por ejemplo, ordenar sin destruir el original).

  // ------------------------------------------------------------
  // 5.2) concat(): une arrays (y valores sueltos) en uno nuevo
  // ------------------------------------------------------------
  const grupoA = ['Ana Ruiz', 'Luis Paz'];
  const grupoB = ['Sara Gil', 'Iván Mora'];
  const claseCompleta = grupoA.concat(grupoB, 'Docente invitado');
  imprimir('grupoA.concat(grupoB, "...") ->', claseCompleta); // 5 elementos
  imprimir('grupoA sigue intacto ->', grupoA); // 2 elementos

  // ------------------------------------------------------------
  // 5.3) join() y toString(): de array a TEXTO
  // ------------------------------------------------------------
  // join(separador) pega todos los elementos con el separador que elijas.
  // Es imprescindible para construir HTML, como veremos en el proyecto final.
  imprimir('grupoA.join(", ") ->', grupoA.join(', ')); // "Ana Ruiz, Luis Paz"
  imprimir('grupoA.join(" | ") ->', grupoA.join(' | '));
  imprimir('grupoA.join("") ->', grupoA.join('')); // sin separador

  // ⚠️ ERROR COMÚN: olvidar que null y undefined se convierten en CADENA VACÍA.
  imprimir('[1, null, undefined, 2].join("-") ->', [1, null, undefined, 2].join('-')); // "1---2"

  // toString() es equivalente a join(',') y es lo que usa el navegador cuando
  // un array acaba dentro de un texto sin querer.
  imprimir('[1, [2, 3]].toString() ->', [1, [2, 3]].toString()); // "1,2,3"
  imprimir('"Notas: " + [7, 9] ->', 'Notas: ' + [7, 9]); // "Notas: 7,9"

  // ------------------------------------------------------------
  // 5.4) flat(): aplana arrays anidados
  // ------------------------------------------------------------
  // Recibe la PROFUNDIDAD a aplanar (por defecto 1).
  const anidado = [1, [2, [3, [4]]]];
  imprimir('anidado.flat() ->', anidado.flat()); // [1,2,[3,[4]]]
  imprimir('anidado.flat(2) ->', anidado.flat(2)); // [1,2,3,[4]]
  imprimir('anidado.flat(Infinity) ->', anidado.flat(Infinity)); // [1,2,3,4]

  // Efecto secundario muy útil: flat() elimina los huecos.
  const conHuecos = [1, , 3]; // La coma doble deja un hueco en la posición 1.
  imprimir('[1, , 3].flat() ->', conHuecos.flat()); // [1,3]

  // Caso real: juntar los grupos de un curso en una sola lista.
  const gruposDelCurso = [
    ['Ana Ruiz', 'Luis Paz'],
    ['Sara Gil'],
    ['Iván Mora', 'Nadia Soto'],
  ];
  imprimir('gruposDelCurso.flat() ->', gruposDelCurso.flat()); // 5 nombres seguidos

  // ------------------------------------------------------------
  // 5.5) flatMap(): transformar y aplanar en un solo paso
  // ------------------------------------------------------------
  // Equivale a  .map(...).flat()  pero en una sola pasada.
  const nombresCompletos = ['Ana Ruiz', 'Luis Paz', 'Sara Gil'];
  imprimir(
    'flatMap(n => n.split(" ")) ->',
    nombresCompletos.flatMap((nombre) => nombre.split(' '))
  ); // ["Ana","Ruiz","Luis","Paz","Sara","Gil"]

  // Truco: si devuelves [] descartas el elemento; si devuelves [a, b] añades dos.
  // Así flatMap sirve a la vez de filtro y de multiplicador.
  const numerosPares = [1, 2, 3, 4, 5, 6].flatMap((n) => (n % 2 === 0 ? [n] : []));
  imprimir('flatMap como filtro (solo pares) ->', numerosPares); // [2,4,6]

  imprimir(
    'NO MUTADORES: slice, concat, join, toString, flat, flatMap, map, filter, reduce'
  );

  // ------------------------------------------------------------
  // 5.6) Las versiones modernas "sin mutar" de los mutadores
  // ------------------------------------------------------------
  // JavaScript añadió gemelos NO mutadores: toSorted(), toReversed(),
  // toSpliced() y with(). Comprobamos que existan antes de usarlos, porque
  // son recientes y algún navegador antiguo podría no tenerlos.
  if (typeof Array.prototype.toReversed === 'function') {
    const originalOrden = ['Oro', 'Plata', 'Bronce'];
    imprimir('originalOrden.toReversed() ->', originalOrden.toReversed());
    imprimir('...y el original sigue igual ->', originalOrden);
  } else {
    imprimir('Este navegador no soporta toReversed(); usa [...arr].reverse()');
  }

  imprimir('\nFin de la sección 1. Continúa en la sección 2.');

  /* ============================================================================
   * EJERCICIOS PROPUESTOS (sección 1)
   * ----------------------------------------------------------------------------
   * 1. Crea un array llamado "materias" con cinco materias de tu carrera.
   *    Imprime la primera, la última (usando at) y la cantidad total.
   *
   * 2. Partiendo de const inventario = ['Cuadernos', 'Lápices', 'Reglas']:
   *    a) Añade 'Borradores' al final y 'Mochilas' al principio.
   *    b) Quita el elemento que quedó en el medio usando splice.
   *    c) Imprime el inventario final unido por " > " con join.
   *
   * 3. Escribe una matriz de 3 filas x 4 columnas con las ventas de una
   *    papelería (3 productos, 4 semanas). Con bucles anidados calcula e
   *    imprime el total vendido por producto y el total general.
   *
   * 4. Dado const camino = [[1, 2], [3, [4, 5]], [[6]]]:
   *    consigue [1, 2, 3, 4, 5, 6] con flat y explica en un comentario qué
   *    profundidad hizo falta y por qué.
   *
   * 5. Escribe una función quitarPorNombre(lista, nombre) que elimine del array
   *    el elemento indicado SIN mutar el original (pista: indexOf + slice, o
   *    copia con slice() y luego splice). Devuelve el array nuevo y demuestra
   *    con un console.log que el original no cambió.
   * ============================================================================ */
})();
