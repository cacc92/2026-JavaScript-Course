/**
 * ============================================================
 * ARCHIVO: js/01-declaracion-y-tipos.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: qué es una función, para qué sirve y de cuántas formas
 *       distintas se puede escribir en JavaScript.
 *
 * QUÉ SE APRENDE AQUÍ:
 *   1. Qué es una función y por qué evita repetir código (DRY).
 *   2. Declaración de función vs expresión de función.
 *   3. Hoisting: por qué una se puede llamar antes de escribirla
 *      y la otra provoca un error.
 *   4. return, y qué devuelve una función que no tiene return.
 *   5. Funciones flecha: sintaxis completa, retorno implícito,
 *      paréntesis con un solo parámetro y sus 2 diferencias clave.
 *   6. Las funciones son VALORES: viven en variables, arrays y objetos.
 * ============================================================
 */

/*
 * Recuerda: envolvemos TODO el archivo en una IIFE
 * (función que se define y se ejecuta al instante) para que sus
 * variables no choquen con las de los otros archivos .js que
 * carga el mismo index.html. Sin esto, declarar `const notas`
 * aquí y también en 02-parametros.js rompería la página con
 * "Identifier 'notas' has already been declared".
 */
(function () {
  'use strict';

  // Pedimos a las utilidades una consola conectada al <pre id="salida-01">.
  // La sintaxis { imprimir, titulo } se llama DESESTRUCTURACIÓN: saca esas
  // dos propiedades del objeto devuelto y las guarda en constantes.
  //
  // ESTA LÍNEA YA VIENE ESCRITA: es el andamiaje que permite mostrar
  // cualquier cosa en pantalla desde el primer minuto de clase.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-01');

  // ============================================================
  // 1. ¿QUÉ ES UNA FUNCIÓN? EL PRINCIPIO DRY
  // ============================================================

  /*
   * Una función es una RECETA con nombre: un bloque de instrucciones
   * que guardamos una vez y ejecutamos tantas veces como queramos.
   *
   * Analogía: una cafetera. No vuelves a inventar el proceso del café
   * cada mañana; pulsas el botón (llamas a la función), metes agua y
   * café (los argumentos) y sale una taza (el valor devuelto).
   *
   * DRY = "Don't Repeat Yourself" (no te repitas). Si el mismo cálculo
   * aparece copiado en tres sitios y mañana cambia la fórmula, tendrás
   * que corregirlo en tres sitios... y seguro que olvidas uno.
   */

  // DATOS DE PARTIDA (ya escritos: teclearlos en clase es tiempo perdido).
  // Las notas de tres estudiantes del curso.
  const notasAna = [7, 8.5, 9];
  const notasLuis = [5, 6.5, 4];
  const notasMarta = [10, 9.5, 8];

  // TODO (en clase):
  //   1. Abre el bloque con titulo('1. Sin funciones: código repetido (mal)').
  //   2. Escribe TRES veces el mismo cálculo, una por estudiante, SIN funciones:
  //      declara con let sumaAna = 0, recórrela con
  //      for (let i = 0; i < notasAna.length; i++) sumaAna += notasAna[i];
  //      y muéstrala con
  //      imprimir('Promedio de Ana:', (sumaAna / notasAna.length).toFixed(2));
  //   3. Repite el mismo bloque para sumaLuis (notasLuis) y sumaMarta (notasMarta).
  //   4. Insiste en voz alta: es el MISMO código tres veces.
  //   Resultado esperado en pantalla:
  //      Promedio de Ana: 8.17
  //      Promedio de Luis: 5.17
  //      Promedio de Marta: 9.17
  //   (aprox. 10 líneas)

  // ⚠️ ERROR COMÚN: pensar que copiar y pegar es "más rápido".
  // Lo es hoy; mañana, cuando el promedio deba descartar la nota más
  // baja, habrá que tocar tres bloques distintos sin olvidar ninguno.

  // TODO (en clase):
  //   1. Abre el bloque con titulo('1b. Con función: la lógica vive en un solo sitio (bien)').
  //   2. Escribe la DECLARACIÓN function calcularPromedio(notas):
  //        - guarda de seguridad: if (notas.length === 0) return 0;  (evita el NaN)
  //        - acumula con let suma = 0 y un bucle for clásico
  //        - devuelve suma / notas.length
  //   3. Llámala una vez por estudiante con .toFixed(2) e imprime cada resultado.
  //   4. Llámala también con un array vacío: imprimir('Array vacío ->', calcularPromedio([]));
  //   Resultado esperado en pantalla:
  //      Promedio de Ana: 8.17
  //      Promedio de Luis: 5.17
  //      Promedio de Marta: 9.17
  //      Array vacío -> 0
  //   (aprox. 14 líneas)

  // ✅ BUENA PRÁCTICA: el nombre de una función debe empezar por VERBO y
  // describir lo que hace: calcularPromedio, mostrarAlumno, validarCorreo.
  // Nombres como datos(), cosa() o hacer() no dicen nada a quien lee.

  // ============================================================
  // 2. DECLARACIÓN DE FUNCIÓN (function declaration)
  // ============================================================

  /*
   * Es la forma "clásica". Empieza literalmente por la palabra
   * reservada `function` seguida del nombre:
   *
   *     function nombre(parametros) { ... }
   *
   * Característica estrella: el navegador la conoce ANTES de llegar a
   * la línea donde está escrita. A ese comportamiento se le llama
   * HOISTING (izado): es como si JavaScript "subiera" la función
   * entera al principio de su ámbito antes de ejecutar nada.
   */

  // TODO (en clase):
  //   1. titulo('2. Declaración de función y hoisting').
  //   2. ANTES de escribir la función, llámala ya:
  //      imprimir('Llamada antes de declararla:', describirCurso('Full Stack 2'));
  //   3. AHORA declara function describirCurso(nombreCurso) que devuelva
  //      'Bienvenidos al curso ' + nombreCurso + '.'
  //   4. Vuelve a llamarla después:
  //      imprimir('Llamada después de declararla:', describirCurso('Desarrollo Front End'));
  //   5. Recarga y demuestra que las DOS llamadas funcionan: eso es el hoisting.
  //   Resultado esperado en pantalla:
  //      Llamada antes de declararla: Bienvenidos al curso Full Stack 2.
  //      Llamada después de declararla: Bienvenidos al curso Desarrollo Front End.
  //   (aprox. 8 líneas)

  // ============================================================
  // 3. EXPRESIÓN DE FUNCIÓN (function expression)
  // ============================================================

  /*
   * Aquí la función se trata como cualquier otro VALOR y se guarda
   * dentro de una variable:
   *
   *     const nombre = function (parametros) { ... };
   *
   * Ojo al punto y coma final: estamos cerrando una ASIGNACIÓN,
   * igual que en `const edad = 20;`.
   *
   * Estas NO se pueden usar antes de la línea donde se declaran.
   * Con const y let, la variable existe pero está en la "zona muerta
   * temporal" (TDZ) y el navegador lanza un ReferenceError.
   */

  // ⚠️ ERROR COMÚN: llamar a una expresión de función antes de tiempo.
  // Lo demostramos dentro de try/catch para que el error no rompa la página.

  // TODO (en clase):
  //   1. titulo('3. Expresión de función: el hoisting NO te salva').
  //   2. Escribe un try { ... } catch (error) { ... } que llame a
  //      convertirANotaLetra(9) ANTES de existir. En el catch imprime:
  //        imprimir('Error capturado ->', error.name + ': ' + error.message);
  //        imprimir('Traducción: la constante existe, pero todavía no tiene valor.');
  //   3. Debajo escribe la EXPRESIÓN:
  //      const convertirANotaLetra = function (nota) { ... };
  //      con estos cortes, en este orden: >= 9 'A (excelente)',
  //      >= 7 'B (notable)', >= 6 'C (aprobado justo)', >= 5 'D (suficiente)',
  //      y por defecto 'F (suspenso)'. No olvides el punto y coma final.
  //   4. Llámala ya con 9, con 6.2 y con 3 e imprime cada resultado.
  //   Resultado esperado en pantalla:
  //      Error capturado -> ReferenceError: Cannot access 'convertirANotaLetra' before initialization
  //      Traducción: la constante existe, pero todavía no tiene valor.
  //      Nota 9  -> A (excelente)
  //      Nota 6.2 -> C (aprobado justo)
  //      Nota 3  -> F (suspenso)
  //   (aprox. 18 líneas)

  // ✅ BUENA PRÁCTICA: declara siempre las funciones ANTES de usarlas,
  // aunque el hoisting te permita lo contrario. El código se lee de
  // arriba abajo y así no dependes de una regla del lenguaje que
  // muchos compañeros de equipo no tienen presente.

  // ============================================================
  // 4. return Y FUNCIONES SIN return (undefined)
  // ============================================================

  /*
   * `return` hace dos cosas a la vez:
   *   1. Termina la ejecución de la función inmediatamente.
   *   2. Entrega un valor a quien la llamó.
   *
   * Si una función no tiene return, JavaScript devuelve `undefined`
   * automáticamente. No es un error: es el valor "no hay nada aquí".
   */

  // TODO (en clase):
  //   1. titulo('4. return, y qué pasa cuando no lo hay').
  //   2. Escribe function duplicar(numero) que DEVUELVA numero * 2.
  //   3. Escribe function mostrarEnPantalla(texto) que SOLO haga
  //      imprimir('   >> ' + texto);  y no tenga return.
  //   4. Guarda los dos resultados:
  //        const resultadoDuplicar = duplicar(21);
  //        const resultadoMostrar = mostrarEnPantalla('Hola clase');
  //   5. Imprímelos y haz ver la diferencia entre mostrar y devolver.
  //   Resultado esperado en pantalla:
  //      >> Hola clase
  //      duplicar(21) devuelve: 42
  //      mostrarEnPantalla() devuelve: undefined
  //   (aprox. 10 líneas)

  // ⚠️ ERROR COMÚN: confundir "mostrar" con "devolver".
  // Una función que hace console.log() NO devuelve ese texto:
  // devuelve undefined. Si necesitas el dato para seguir trabajando
  // con él, usa return.

  // TODO (en clase):
  //   1. Escribe function comprobarAprobado(nota): si nota >= 5 devuelve
  //      'Aprobado' dentro del if (salida temprana), y después, ya fuera
  //      del if, devuelve 'Suspenso'.
  //   2. Deja comentada una línea detrás del segundo return para enseñar
  //      que es código inalcanzable (dead code).
  //   3. Imprime comprobarAprobado(8) y comprobarAprobado(2).
  //   Resultado esperado en pantalla:
  //      comprobarAprobado(8) -> Aprobado
  //      comprobarAprobado(2) -> Suspenso
  //   (aprox. 8 líneas)

  // ⚠️ ERROR COMÚN (y muy difícil de ver): dejar el valor en la línea
  // siguiente al return. JavaScript inserta un punto y coma automático
  // después de `return` y la función acaba devolviendo undefined:
  //
  //     return
  //       'Aprobado';   // <- inalcanzable, la función devuelve undefined
  //
  // Escribe siempre el valor EN LA MISMA LÍNEA que el return.

  // ============================================================
  // 5. FUNCIONES FLECHA (arrow functions)
  // ============================================================

  /*
   * Llegaron con ES6 (2015) y son una forma más corta de escribir
   * expresiones de función. La flecha `=>` separa los parámetros
   * del cuerpo:
   *
   *     const f = (a, b) => { return a + b; };
   *
   * Piensa en `=>` como en "produce": (a, b) produce a + b.
   */

  // TODO (en clase):
  //   1. titulo('5. Funciones flecha: de la forma larga a la corta').
  //   2. Escribe la MISMA suma en tres pasos, uno debajo del otro:
  //        - Paso 0: const sumarTradicional = function (a, b) { return a + b; };
  //        - Paso 1: const sumarFlechaLarga = (a, b) => { return a + b; };
  //        - Paso 2: const sumarFlechaCorta = (a, b) => a + b;   (retorno implícito)
  //   3. Imprime las tres llamadas con (2, 3) para ver que dan lo mismo.
  //   Resultado esperado en pantalla:
  //      sumarTradicional(2, 3) -> 5
  //      sumarFlechaLarga(2, 3) -> 5
  //      sumarFlechaCorta(2, 3) -> 5
  //   (aprox. 10 líneas)

  // ⚠️ ERROR COMÚN: poner llaves Y esperar retorno implícito.
  // `(a, b) => { a + b }` calcula la suma y la tira a la basura:
  // devuelve undefined porque falta el return.

  // TODO (en clase):
  //   1. Declara const sumaRota = (a, b) => { a + b; };  (con llaves y sin return).
  //   2. imprimir('Con llaves pero sin return ->', sumaRota(2, 3));
  //   Resultado esperado en pantalla: Con llaves pero sin return -> undefined
  //   (aprox. 2 líneas)

  // --- Paréntesis en los parámetros ---------------------------------

  // TODO (en clase):
  //   1. Con UN solo parámetro los paréntesis son opcionales. Escribe las dos:
  //        const alCuadrado = numero => numero * numero;
  //        const alCubo = (numero) => numero * numero * numero;
  //   2. Imprime alCuadrado(7) y alCubo(3).
  //   Resultado esperado en pantalla:
  //      alCuadrado(7) -> 49
  //      alCubo(3) -> 27
  //   (aprox. 4 líneas)

  // ✅ BUENA PRÁCTICA: escribe siempre los paréntesis. Son obligatorios
  // con cero o con dos o más parámetros, así que mantenerlos hace el
  // código uniforme y evita reescribir la línea al añadir un parámetro.

  // TODO (en clase):
  //   1. Sin parámetros los paréntesis vacíos son OBLIGATORIOS:
  //      const saludar = () => 'Hola, clase de Full Stack 2';
  //      (guárdala: se vuelve a usar en la sección 6).
  //   2. imprimir('saludar() ->', saludar());
  //   Resultado esperado en pantalla: saludar() -> Hola, clase de Full Stack 2
  //   (aprox. 2 líneas)

  // ⚠️ ERROR COMÚN: devolver un objeto con retorno implícito.
  // JavaScript confunde la llave { del objeto con la llave del cuerpo.
  // La solución es envolver el objeto entre paréntesis: ({ ... })

  // TODO (en clase):
  //   1. Escribe las dos versiones, una debajo de la otra:
  //        const crearEstudianteMal = (nombre) => { nombre: nombre };
  //        const crearEstudianteBien = (nombre) => ({ nombre: nombre });
  //   2. Imprime las dos llamadas con 'Ana'.
  //   Resultado esperado en pantalla:
  //      Sin paréntesis -> undefined
  //      Con paréntesis -> { "nombre": "Ana" }
  //   (aprox. 4 líneas)

  // --- Las 2 diferencias importantes de las flechas ------------------

  /*
   * Una función flecha NO es solo "una function más corta".
   * Hay dos diferencias de comportamiento que debes conocer:
   *
   *   1. NO tienen `this` propio. Heredan el `this` del lugar donde
   *      fueron escritas. Lo veremos en js/06-this-y-pureza.js.
   *   2. NO tienen el objeto `arguments`. Si necesitas recoger todos
   *      los argumentos, usa el parámetro rest (...args), que además
   *      es la forma moderna y recomendada. Lo veremos en 02-parametros.js.
   *
   * (Extra para quien quiera saber más: tampoco se pueden usar con
   *  `new` para crear objetos, y no tienen hoisting propio porque
   *  son siempre expresiones.)
   */

  // TODO (en clase):
  //   1. titulo('5b. Las flechas NO tienen el objeto arguments').
  //   2. Escribe function contarConArguments() que devuelva
  //      'Recibí ' + arguments.length + ' argumentos'.
  //   3. Escribe la versión flecha equivalente con rest:
  //      const contarConFlecha = (...args) => 'Recibí ' + args.length + ' argumentos';
  //   4. Llama a la primera con (1, 2, 3) y a la segunda con (1, 2, 3, 4).
  //   Resultado esperado en pantalla:
  //      Recibí 3 argumentos
  //      Recibí 4 argumentos
  //   (aprox. 8 líneas)

  // ============================================================
  // 6. LAS FUNCIONES SON VALORES (ciudadanos de primera clase)
  // ============================================================

  /*
   * Este es EL concepto que abre la puerta a todo lo demás del
   * proyecto (callbacks, closures, orden superior).
   *
   * En JavaScript una función es un dato como un número o un texto:
   *   - se guarda en una variable,
   *   - se mete dentro de un array o de un objeto,
   *   - se pasa como argumento a otra función,
   *   - y se devuelve como resultado de otra función.
   *
   * ⚠️ ERROR COMÚN: confundir `saludar` con `saludar()`.
   *   saludar   -> la función EN SÍ (la receta)
   *   saludar() -> el RESULTADO de ejecutarla (el plato servido)
   */

  // TODO (en clase):
  //   1. titulo('6. Una función es un valor más').
  //   2. Imprime `saludar` SIN paréntesis y `saludar()` CON paréntesis,
  //      una línea cada uno. Es el momento clave de la sección.
  //   3. Imprime typeof saludar, saludar.name y alCuadrado.length.
  //   Resultado esperado en pantalla:
  //      Sin paréntesis (la función): f saludar()
  //      Con paréntesis (su resultado): Hola, clase de Full Stack 2
  //      typeof saludar -> function
  //      saludar.name -> saludar
  //      alCuadrado.length -> 1
  //   (aprox. 6 líneas)

  // TODO (en clase):
  //   1. Guarda funciones dentro de un ARRAY:
  //      const transformaciones = [duplicar, alCuadrado, alCubo];
  //   2. Recórrelo con for (const transformacion of transformaciones) e imprime
  //      imprimir('   ' + transformacion.name + '(4) ->', transformacion(4));
  //   Resultado esperado en pantalla:
  //      duplicar(4) -> 8
  //      alCuadrado(4) -> 16
  //      alCubo(4) -> 64
  //   (aprox. 5 líneas)

  // TODO (en clase):
  //   1. Guarda funciones dentro de un OBJETO llamado `conversores`, con
  //      tres flechas: aMayusculas, aMinusculas y capitalizar
  //      (capitalizar: primera letra en mayúscula con charAt(0).toUpperCase()
  //       y el resto en minúscula con slice(1).toLowerCase()).
  //   2. Imprime las tres, usando 'desarrollo front end', 'DESARROLLO FRONT END'
  //      y 'dESARROLLO front end'.
  //   3. Este patrón es EXACTAMENTE el de la calculadora de la sección 7
  //      de la página: dilo en voz alta.
  //   Resultado esperado en pantalla:
  //      aMayusculas -> DESARROLLO FRONT END
  //      aMinusculas -> desarrollo front end
  //      capitalizar -> Desarrollo front end
  //   (aprox. 10 líneas)

  // TODO (en clase):
  //   1. Elegir la función con una variable de texto, por corchetes:
  //        const elegida = 'capitalizar';
  //        imprimir('Elegida por nombre (' + elegida + ') ->', conversores[elegida]('hola MUNDO'));
  //   2. Explica que así es como se elige la operación desde un <select>.
  //   Resultado esperado en pantalla:
  //      Elegida por nombre (capitalizar) -> Hola mundo
  //   (aprox. 2 líneas)

  // ============================================================
  // 7. RESUMEN COMPARATIVO
  // ============================================================

  // TODO (en clase):
  //   1. titulo('7. Resumen de las tres formas').
  //   2. Imprime tres líneas de texto plano, una por forma:
  //      'DECLARACIÓN   function f(a) { return a; }   -> sí tiene hoisting'
  //      'EXPRESIÓN     const f = function (a) {...}; -> no se puede llamar antes'
  //      'FLECHA        const f = (a) => a;           -> corta, sin this ni arguments'
  //   Resultado esperado en pantalla: esas mismas tres líneas.
  //   (aprox. 4 líneas)

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // Resuélvelos en este mismo archivo, debajo de esta línea, y
  // comprueba el resultado con imprimir(...).
  //
  // 1) (Fácil) Escribe una DECLARACIÓN de función llamada
  //    calcularAreaRectangulo(base, altura) que devuelva el área.
  //    Llámala con 5 y 3 y muestra el resultado. Después vuelve a
  //    llamarla ANTES de escribirla y comprueba que también funciona.
  //
  // 2) (Fácil) Reescribe calcularAreaRectangulo como EXPRESIÓN de
  //    función y luego como FUNCIÓN FLECHA con retorno implícito.
  //    Las tres versiones deben dar el mismo resultado.
  //
  // 3) (Media) Crea la función precioConIva(precio) que devuelva el
  //    precio con un 21% de IVA, redondeado a 2 decimales con
  //    .toFixed(2). Muéstrala funcionando con 100, 19.99 y 0.
  //
  // 4) (Media) Añade al objeto `conversores` una función
  //    invertir(texto) que devuelva el texto al revés.
  //    Pista: texto.split('').reverse().join('').
  //
  // 5) (Difícil) Crea un array llamado `validadores` con tres
  //    funciones flecha: esMayorDeEdad(edad), esNotaValida(nota)
  //    (entre 0 y 10) y esTextoNoVacio(texto). Recórrelo con un
  //    bucle for...of e imprime el nombre de cada función junto al
  //    resultado de aplicarla a un valor de prueba.
  //    Pista: recuerda que una flecha guardada en una constante
  //    hereda el nombre de esa constante en la propiedad .name.
  // ============================================================
})();
