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

/* ============================================================================
 * CÓMO USAR ESTA PLANTILLA (nota del docente)
 * ----------------------------------------------------------------------------
 * Este archivo es la versión "para escribir en vivo". Conserva la teoría, los
 * separadores de sección y los ejercicios, pero el código ejecutable se ha
 * sustituido por bloques "TODO (en clase)".
 * Ya viene escrito y funcionando el andamiaje de salida: formatear(), imprimir()
 * y titulo(). Con eso se puede mostrar algo en pantalla desde el primer minuto.
 * La versión resuelta está en la carpeta padre: ../js/01-basicos-y-mutadores.js
 * ============================================================================ */

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
  //
  // NOTA DE LA PLANTILLA: esta sección 0 viene YA ESCRITA. Es andamiaje, no
  // materia de la clase: sin ella no se podría demostrar nada en pantalla.

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

  // ⚠️ ERROR COMÚN: creer que existe un "tipo array" en JavaScript.
  // typeof devuelve "object" para los arrays, porque internamente son objetos
  // con claves numéricas. Para saber si algo es un array hay un método exacto.

  // ✅ BUENA PRÁCTICA: usar SIEMPRE Array.isArray() para comprobarlo.

  // TODO (en clase):
  //   1. Abre la sección con titulo('1. QUÉ ES UN ARRAY Y CÓMO SE CREA').
  //   2. Declara la constante "cursos" con el LITERAL de corchetes:
  //      ['Matemáticas', 'Historia', 'Programación', 'Biología'].
  //   3. Imprime imprimir('cursos ->', cursos) y luego
  //      imprimir('Cantidad de cursos ->', cursos.length).
  //   4. Declara la constante "mezclado" con tipos distintos a propósito:
  //      ['Ana Ruiz', 19, true, null, ['Física', 'Química']] e imprímela con
  //      la etiqueta 'Array con tipos mezclados ->'.
  //   5. Demuestra el error común imprimiendo, en tres líneas:
  //      typeof cursos, Array.isArray(cursos) y Array.isArray('hola').
  //   Resultado esperado en pantalla:
  //     cursos -> ["Matemáticas","Historia","Programación","Biología"]
  //     Cantidad de cursos -> 4
  //     typeof cursos -> object
  //     Array.isArray(cursos) -> true
  //     Array.isArray("hola") -> false
  //   (aprox. 9 líneas)

  // ------------------------------------------------------------
  // 1.b) El constructor new Array(): la trampa clásica
  // ------------------------------------------------------------
  // new Array() acepta dos comportamientos MUY distintos según los argumentos:
  //   - Con UN número: crea un array VACÍO de esa longitud (lleno de "huecos").
  //   - Con varios valores: crea un array con esos valores.
  // Esa ambigüedad es la razón por la que casi nadie lo usa.

  // ⚠️ ERROR COMÚN: esperar [3] al escribir new Array(3). Lo que sale es un
  // array de longitud 3 SIN valores. Al convertirlo a JSON los huecos aparecen
  // como null; en la consola de DevTools se ven como "empty x 3".
  // No es lo mismo un hueco que un undefined.

  // ✅ BUENA PRÁCTICA: si necesitas un array de N posiciones con un valor
  // inicial, encadena .fill(valor) justo detrás del constructor.

  // TODO (en clase):
  //   1. Declara const conValores = new Array('Lunes', 'Martes', 'Miércoles')
  //      e imprímelo con la etiqueta 'new Array("Lunes","Martes","Miércoles") ->'.
  //   2. Declara const treshuecos = new Array(3) e imprímelo junto con
  //      '| length:' y treshuecos.length.
  //   3. Imprime 0 in treshuecos con la etiqueta '¿Existe la posición 0? ->'
  //      para demostrar que es un HUECO real, no un undefined.
  //   4. Declara const cincoCeros = new Array(5).fill(0) e imprímelo.
  //   Resultado esperado en pantalla:
  //     new Array("Lunes","Martes","Miércoles") -> ["Lunes","Martes","Miércoles"]
  //     new Array(3) -> [null,null,null] | length: 3
  //     ¿Existe la posición 0? -> false
  //     new Array(5).fill(0) -> [0,0,0,0,0]
  //   (aprox. 8 líneas)

  // ============================================================
  // 2. ÍNDICES (EMPIEZAN EN 0), length, ACCESO Y MODIFICACIÓN
  // ============================================================
  // El índice es el número del casillero. El primero es el 0, NO el 1.
  // Regla de oro: el último índice siempre es length - 1.
  // Si un array tiene 5 notas, sus índices son 0, 1, 2, 3 y 4.
  //
  // at() (moderno) permite índices NEGATIVOS que cuentan desde el final.
  // Es mucho más legible que la fórmula notas[notas.length - 1].

  // ⚠️ ERROR COMÚN: usar notas[-1] pensando que da la última.
  // En un array, [-1] NO es una posición: devuelve undefined.

  // ⚠️ ERROR COMÚN: leer una posición que no existe. No lanza error: da undefined.
  // Ese undefined suele explotar más adelante ("cannot read properties of undefined").

  // TODO (en clase):
  //   1. Abre con titulo('2. ÍNDICES, LENGTH, ACCESO Y MODIFICACIÓN').
  //   2. Declara const notas = [7, 9, 5, 10, 6].
  //   3. Imprime, una línea por cada uno: notas, notas.length, notas[0]
  //      ('Primera nota  notas[0] ->') y notas[2] ('Tercera nota  notas[2] ->').
  //   4. Imprime la última con la fórmula clásica notas[notas.length - 1].
  //   5. Imprime notas.at(-1) y notas.at(-2) para comparar legibilidad.
  //   6. Demuestra los dos errores comunes imprimiendo notas[-1] y notas[99].
  //   7. Asigna notas[2] = 8 e imprime el array completo con la etiqueta
  //      'Tras notas[2] = 8 ->'.
  //   Resultado esperado en pantalla:
  //     notas.length -> 5
  //     Última nota  notas[notas.length - 1] -> 6
  //     notas.at(-1) -> 6   /   notas.at(-2) -> 10
  //     notas[-1] -> undefined   /   notas[99] -> undefined
  //     Tras notas[2] = 8 -> [7,9,8,10,6]
  //   (aprox. 12 líneas)

  // ------------------------------------------------------------
  // 2.b) length se puede ESCRIBIR (y eso corta el array)
  // ------------------------------------------------------------
  // length no es solo informativo: si le asignas un número menor, JavaScript
  // BORRA los elementos sobrantes. Es un truco raro pero conviene conocerlo.
  // Y si asignas a una posición muy lejana, el array crece con huecos en medio.

  // ⚠️ ERROR COMÚN: pensar que conHueco[5] = 99 se añadió "al lado".
  // Se crearon huecos en las posiciones 2, 3 y 4.

  // ✅ BUENA PRÁCTICA: no crear huecos nunca. Para añadir al final se usa push().

  // TODO (en clase):
  //   1. Declara const copiaNotas = [7, 9, 8, 10, 6], asígnale
  //      copiaNotas.length = 3 e imprímelo con la etiqueta 'copiaNotas.length = 3 ->'.
  //   2. Declara const conHueco = [1, 2], haz conHueco[5] = 99 e imprímelo
  //      junto con '| length:' y conHueco.length.
  //   Resultado esperado en pantalla:
  //     copiaNotas.length = 3 -> [7,9,8]
  //     conHueco -> [1,2,null,null,null,99] | length: 6
  //   (aprox. 6 líneas)

  // ============================================================
  // 3. ARRAYS MULTIDIMENSIONALES (MATRICES) Y BUCLES ANIDADOS
  // ============================================================
  // Un array puede contener otros arrays. Cuando todos los elementos son
  // arrays de la misma longitud tenemos una MATRIZ: una tabla de filas y
  // columnas. Ejemplo real: las notas de tres parciales de varios estudiantes.
  //   - La primera dimensión (fila) es el estudiante.
  //   - La segunda dimensión (columna) es el parcial.
  // Para llegar a un valor concreto se encadenan dos índices: [fila][columna].

  // TODO (en clase):
  //   1. Abre con titulo('3. MATRICES (ARRAYS DE ARRAYS) Y BUCLES ANIDADOS').
  //   2. Declara const nombresFila = ['Ana Ruiz', 'Luis Paz', 'Sara Gil'].
  //   3. Declara la matriz const calificaciones con tres filas (P1, P2, P3):
  //      [7, 8, 9] para Ana, [5, 6, 4] para Luis y [10, 9, 8] para Sara.
  //   4. Imprime calificaciones[0] (fila completa), calificaciones[1][2]
  //      (Luis, parcial 3), calificaciones.length ('Filas ->') y
  //      calificaciones[0].length ('Columnas ->').
  //   Resultado esperado en pantalla:
  //     calificaciones[0] -> [7,8,9]
  //     calificaciones[1][2] -> 4
  //     Filas -> 3   /   Columnas -> 3
  //   (aprox. 10 líneas)

  // ------------------------------------------------------------
  // Recorrer una matriz: BUCLE DENTRO DE BUCLE
  // ------------------------------------------------------------
  // El bucle exterior avanza por las filas (índice i).
  // Por CADA fila, el bucle interior recorre entera esa fila (índice j).
  // Si hay 3 filas y 3 columnas, el interior se ejecuta 3 x 3 = 9 veces.
  // ✅ BUENA PRÁCTICA: nombrar i y j por lo que significan (fila/columna)
  // en cuanto el código crece; aquí los dejamos para que veas la forma clásica.

  // TODO (en clase):
  //   1. Escribe un for exterior con "i" sobre calificaciones.length.
  //      Dentro, crea let linea = nombresFila[i] + ': ' y un for interior con
  //      "j" que vaya concatenando 'P' + (j + 1) + '=' + calificaciones[i][j] + '  '.
  //      Al salir del bucle interior, imprime la línea con imprimir(linea).
  //   2. Repite la estructura anidada para calcular el promedio de cada fila:
  //      acumula let suma = 0, divide entre calificaciones[i].length e imprime
  //      'Promedio de ' + nombresFila[i] + ' -> ' + promedio.toFixed(2).
  //      Recuerda: toFixed(2) devuelve un TEXTO, ya no un número.
  //   Resultado esperado en pantalla:
  //     Ana Ruiz: P1=7  P2=8  P3=9
  //     Luis Paz: P1=5  P2=6  P3=4
  //     Sara Gil: P1=10  P2=9  P3=8
  //     Promedio de Ana Ruiz -> 8.00
  //     Promedio de Luis Paz -> 5.00
  //     Promedio de Sara Gil -> 9.00
  //   (aprox. 17 líneas)

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

  // TODO (en clase):
  //   1. Abre con titulo('4. MÉTODOS QUE MUTAN EL ARRAY ORIGINAL').
  //   (aprox. 1 línea)

  // ------------------------------------------------------------
  // 4.1) push() y pop(): trabajan al FINAL del array
  // ------------------------------------------------------------
  // Imagina una pila de bandejas: pones y quitas siempre por arriba.
  // push() añade al final y DEVUELVE la nueva longitud (no el array).
  // pop() quita el último y DEVUELVE ese elemento.

  // TODO (en clase):
  //   1. Declara const tareas = ['Leer el capítulo 3', 'Resolver la guía'].
  //   2. Guarda const nuevaLongitud = tareas.push('Preparar la exposición') e
  //      imprime el array y después nuevaLongitud con la etiqueta
  //      'push() DEVUELVE la nueva longitud ->'.
  //   3. Añade DOS de golpe: tareas.push('Entregar el informe', 'Repasar para el examen')
  //      e imprime el array (5 tareas).
  //   4. Guarda const quitada = tareas.pop(), imprímela y luego el array.
  //   Resultado esperado en pantalla:
  //     push() DEVUELVE la nueva longitud -> 3
  //     push() con varios -> 5 tareas en el array
  //     pop() devuelve -> Repasar para el examen
  //   (aprox. 7 líneas)

  // ------------------------------------------------------------
  // 4.2) unshift() y shift(): trabajan al PRINCIPIO del array
  // ------------------------------------------------------------
  // Como una fila de personas: unshift mete a alguien al inicio de la fila,
  // shift atiende (y saca) al primero.
  //
  // ⚠️ Nota de rendimiento: shift() y unshift() obligan a RENUMERAR todas las
  // posiciones, así que con arrays enormes son más lentos que push()/pop().

  // TODO (en clase):
  //   1. Sobre el mismo array "tareas", llama a
  //      tareas.unshift('Revisar el correo del curso') e imprime el array.
  //   2. Guarda const primera = tareas.shift(), imprímela con la etiqueta
  //      'shift() devuelve ->' y vuelve a imprimir el array.
  //   Resultado esperado en pantalla:
  //     shift() devuelve -> Revisar el correo del curso
  //     tareas tras shift() -> las 4 tareas de antes, sin cambios
  //   (aprox. 4 líneas)

  // ------------------------------------------------------------
  // 4.3) splice(): la navaja suiza (borra, inserta y reemplaza)
  // ------------------------------------------------------------
  // Firma: array.splice(desde, cuántosBorrar, ...elementosAInsertar)
  // Devuelve un array con los elementos BORRADOS.
  //
  // ⚠️ ERROR COMÚN: confundir splice() (MUTA, recorta de verdad) con
  // slice() (NO muta, saca una copia de un trozo). Se parecen en el nombre
  // y hacen cosas opuestas respecto al original. Recuerda: splice tiene "p" de "parte y pega".

  // TODO (en clase):
  //   1. Declara const plan = ['Leer', 'Resumir', 'Exponer', 'Evaluar'].
  //   2. (a) BORRAR: const borrados = plan.splice(1, 2). Imprime "borrados" y
  //      después cómo queda "plan".
  //   3. (b) INSERTAR sin borrar: plan.splice(1, 0, 'Investigar', 'Redactar')
  //      e imprime el array.
  //   4. (c) REEMPLAZAR: plan.splice(2, 1, 'Corregir') e imprime el array.
  //   Resultado esperado en pantalla:
  //     splice(1, 2) borra -> ["Resumir","Exponer"]
  //     plan queda -> ["Leer","Evaluar"]
  //     splice(1, 0, ...) inserta -> ["Leer","Investigar","Redactar","Evaluar"]
  //     splice(2, 1, "Corregir") -> ["Leer","Investigar","Corregir","Evaluar"]
  //   (aprox. 8 líneas)

  // ------------------------------------------------------------
  // 4.4) reverse(): da la vuelta al array (mutando)
  // ------------------------------------------------------------

  // TODO (en clase):
  //   1. Declara const posiciones = ['Oro', 'Plata', 'Bronce'].
  //   2. Llama a posiciones.reverse() e imprime el array con la etiqueta
  //      'reverse() ->'.
  //   Resultado esperado en pantalla: reverse() -> ["Bronce","Plata","Oro"]
  //   (aprox. 3 líneas)

  // ------------------------------------------------------------
  // 4.5) fill(): rellena posiciones con un valor
  // ------------------------------------------------------------
  // Firma: fill(valor, desde, hasta) — "hasta" NO se incluye.

  // TODO (en clase):
  //   1. Declara const asistencia = new Array(5).fill(false) e imprímela con
  //      la etiqueta 'new Array(5).fill(false) ->'.
  //   2. Declara const numeros = [1, 2, 3, 4, 5], llama a numeros.fill(0, 1, 3)
  //      e imprime el array. Ojo: rellena las posiciones 1 y 2; la 3 queda fuera.
  //   Resultado esperado en pantalla:
  //     new Array(5).fill(false) -> [false,false,false,false,false]
  //     numeros.fill(0, 1, 3) -> [1,0,0,4,5]
  //   (aprox. 5 líneas)

  // ------------------------------------------------------------
  // 4.6) sort(): TAMBIÉN muta (lo estudiamos a fondo en el archivo 04)
  // ------------------------------------------------------------
  // Lista completa de mutadores para memorizar:
  //   push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin

  // TODO (en clase):
  //   1. Declara const letras = ['c', 'a', 'b'], llama a letras.sort() e
  //      imprime el array: comprueba que "letras" cambió.
  //   2. Imprime la lista completa de mutadores como recordatorio:
  //      'MUTADORES: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin'
  //   Resultado esperado en pantalla:
  //     letras.sort() -> ["a","b","c"]
  //     MUTADORES: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin
  //   (aprox. 6 líneas)

  // ============================================================
  // 5. MÉTODOS QUE **NO** MUTAN: DEVUELVEN UN ARRAY NUEVO
  // ============================================================
  // Estos métodos dejan el original INTACTO y devuelven un resultado nuevo.
  // Analogía: en vez de tachar la hoja, la fotocopias y escribes en la copia.
  //
  // ⚠️ ERROR COMÚN: llamar al método y no guardar el resultado.
  //     nombres.slice(0, 2);           <- no hace nada útil, el resultado se pierde
  //     const dos = nombres.slice(0, 2); <- así sí

  // TODO (en clase):
  //   1. Abre con titulo('5. MÉTODOS QUE NO MUTAN (DEVUELVEN UNO NUEVO)').
  //   2. Declara const meses = ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
  //      que es el array de trabajo de toda la sección 5.1.
  //   (aprox. 2 líneas)

  // ------------------------------------------------------------
  // 5.1) slice(desde, hasta): copia un trozo. "hasta" NO se incluye.
  // ------------------------------------------------------------
  // ✅ BUENA PRÁCTICA: slice() sin argumentos es la forma clásica de copiar un
  // array antes de aplicarle un mutador (por ejemplo, ordenar sin destruir el original).

  // TODO (en clase):
  //   1. Imprime, una línea por cada llamada y con su etiqueta delante:
  //      meses.slice(1, 3), meses.slice(2), meses.slice(-2) y meses.slice().
  //   2. Imprime "meses" al final para demostrar que NO cambió.
  //   Resultado esperado en pantalla:
  //     meses.slice(1, 3) -> ["Abril","Mayo"]
  //     meses.slice(2) -> ["Mayo","Junio","Julio"]
  //     meses.slice(-2) -> ["Junio","Julio"]
  //     El original NO cambió -> los 5 meses
  //   (aprox. 5 líneas)

  // ------------------------------------------------------------
  // 5.2) concat(): une arrays (y valores sueltos) en uno nuevo
  // ------------------------------------------------------------

  // TODO (en clase):
  //   1. Declara const grupoA = ['Ana Ruiz', 'Luis Paz'] y
  //      const grupoB = ['Sara Gil', 'Iván Mora'].
  //   2. Declara const claseCompleta = grupoA.concat(grupoB, 'Docente invitado')
  //      e imprímelo (5 elementos).
  //   3. Imprime grupoA para demostrar que sigue teniendo 2 elementos.
  //   Resultado esperado en pantalla:
  //     grupoA.concat(grupoB, "...") -> ["Ana Ruiz","Luis Paz","Sara Gil","Iván Mora","Docente invitado"]
  //     grupoA sigue intacto -> ["Ana Ruiz","Luis Paz"]
  //   (aprox. 5 líneas)

  // ------------------------------------------------------------
  // 5.3) join() y toString(): de array a TEXTO
  // ------------------------------------------------------------
  // join(separador) pega todos los elementos con el separador que elijas.
  // Es imprescindible para construir HTML, como veremos en el proyecto final.
  //
  // ⚠️ ERROR COMÚN: olvidar que null y undefined se convierten en CADENA VACÍA.
  //
  // toString() es equivalente a join(',') y es lo que usa el navegador cuando
  // un array acaba dentro de un texto sin querer.

  // TODO (en clase):
  //   1. Imprime grupoA.join(', '), grupoA.join(' | ') y grupoA.join('')
  //      (una línea cada uno, con su etiqueta).
  //   2. Demuestra el error común imprimiendo [1, null, undefined, 2].join('-').
  //   3. Imprime [1, [2, 3]].toString() y la concatenación 'Notas: ' + [7, 9].
  //   Resultado esperado en pantalla:
  //     grupoA.join(", ") -> Ana Ruiz, Luis Paz
  //     [1, null, undefined, 2].join("-") -> 1---2
  //     [1, [2, 3]].toString() -> 1,2,3
  //     "Notas: " + [7, 9] -> Notas: 7,9
  //   (aprox. 6 líneas)

  // ------------------------------------------------------------
  // 5.4) flat(): aplana arrays anidados
  // ------------------------------------------------------------
  // Recibe la PROFUNDIDAD a aplanar (por defecto 1).
  // Efecto secundario muy útil: flat() elimina los huecos.

  // TODO (en clase):
  //   1. Declara const anidado = [1, [2, [3, [4]]]] e imprime, en tres líneas,
  //      anidado.flat(), anidado.flat(2) y anidado.flat(Infinity).
  //   2. Declara const conHuecos = [1, , 3] (la coma doble deja un hueco en la
  //      posición 1) e imprime conHuecos.flat().
  //   3. Caso real: declara const gruposDelCurso con tres subarrays
  //      (['Ana Ruiz','Luis Paz'], ['Sara Gil'], ['Iván Mora','Nadia Soto'])
  //      e imprime gruposDelCurso.flat().
  //   Resultado esperado en pantalla:
  //     anidado.flat() -> [1,2,[3,[4]]]
  //     anidado.flat(2) -> [1,2,3,[4]]
  //     anidado.flat(Infinity) -> [1,2,3,4]
  //     [1, , 3].flat() -> [1,3]
  //     gruposDelCurso.flat() -> los 5 nombres seguidos
  //   (aprox. 10 líneas)

  // ------------------------------------------------------------
  // 5.5) flatMap(): transformar y aplanar en un solo paso
  // ------------------------------------------------------------
  // Equivale a  .map(...).flat()  pero en una sola pasada.
  // Truco: si devuelves [] descartas el elemento; si devuelves [a, b] añades dos.
  // Así flatMap sirve a la vez de filtro y de multiplicador.

  // TODO (en clase):
  //   1. Declara const nombresCompletos = ['Ana Ruiz', 'Luis Paz', 'Sara Gil']
  //      e imprime nombresCompletos.flatMap((nombre) => nombre.split(' ')).
  //   2. Declara const numerosPares usando flatMap sobre [1,2,3,4,5,6] con la
  //      callback (n) => (n % 2 === 0 ? [n] : []) e imprímelo.
  //   3. Cierra la sección imprimiendo la lista de no mutadores:
  //      'NO MUTADORES: slice, concat, join, toString, flat, flatMap, map, filter, reduce'
  //   Resultado esperado en pantalla:
  //     flatMap(n => n.split(" ")) -> ["Ana","Ruiz","Luis","Paz","Sara","Gil"]
  //     flatMap como filtro (solo pares) -> [2,4,6]
  //   (aprox. 10 líneas)

  // ------------------------------------------------------------
  // 5.6) Las versiones modernas "sin mutar" de los mutadores
  // ------------------------------------------------------------
  // JavaScript añadió gemelos NO mutadores: toSorted(), toReversed(),
  // toSpliced() y with(). Comprobamos que existan antes de usarlos, porque
  // son recientes y algún navegador antiguo podría no tenerlos.

  // TODO (en clase):
  //   1. Escribe un if que compruebe
  //      typeof Array.prototype.toReversed === 'function'.
  //   2. Dentro del if: declara const originalOrden = ['Oro','Plata','Bronce'],
  //      imprime originalOrden.toReversed() y después originalOrden para ver
  //      que el original sigue igual.
  //   3. En el else, imprime:
  //      'Este navegador no soporta toReversed(); usa [...arr].reverse()'
  //   4. Cierra el archivo con
  //      imprimir('\nFin de la sección 1. Continúa en la sección 2.').
  //   Resultado esperado en pantalla:
  //     originalOrden.toReversed() -> ["Bronce","Plata","Oro"]
  //     ...y el original sigue igual -> ["Oro","Plata","Bronce"]
  //     Fin de la sección 1. Continúa en la sección 2.
  //   (aprox. 9 líneas)

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
