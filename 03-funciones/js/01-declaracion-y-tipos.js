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

  titulo('1. Sin funciones: código repetido (mal)');

  // Datos de partida: las notas de tres estudiantes del curso.
  const notasAna = [7, 8.5, 9];
  const notasLuis = [5, 6.5, 4];
  const notasMarta = [10, 9.5, 8];

  // Versión SIN función: el mismo cálculo copiado tres veces.
  let sumaAna = 0;
  for (let i = 0; i < notasAna.length; i++) sumaAna += notasAna[i];
  imprimir('Promedio de Ana:', (sumaAna / notasAna.length).toFixed(2));

  let sumaLuis = 0;
  for (let i = 0; i < notasLuis.length; i++) sumaLuis += notasLuis[i];
  imprimir('Promedio de Luis:', (sumaLuis / notasLuis.length).toFixed(2));

  let sumaMarta = 0;
  for (let i = 0; i < notasMarta.length; i++) sumaMarta += notasMarta[i];
  imprimir('Promedio de Marta:', (sumaMarta / notasMarta.length).toFixed(2));

  // ⚠️ ERROR COMÚN: pensar que copiar y pegar es "más rápido".
  // Lo es hoy; mañana, cuando el promedio deba descartar la nota más
  // baja, habrá que tocar tres bloques distintos sin olvidar ninguno.

  titulo('1b. Con función: la lógica vive en un solo sitio (bien)');

  /**
   * calcularPromedio(): suma todas las notas y las divide entre cuántas hay.
   * @param {number[]} notas - array de notas numéricas
   * @returns {number} el promedio, o 0 si el array está vacío
   */
  function calcularPromedio(notas) {
    // Guarda de seguridad: dividir entre 0 daría NaN ("Not a Number").
    if (notas.length === 0) return 0;

    let suma = 0;
    for (let i = 0; i < notas.length; i++) {
      suma += notas[i];
    }
    return suma / notas.length;
  }

  // Ahora la misma idea se lee en una línea por estudiante.
  imprimir('Promedio de Ana:', calcularPromedio(notasAna).toFixed(2));    // 8.17
  imprimir('Promedio de Luis:', calcularPromedio(notasLuis).toFixed(2));  // 5.17
  imprimir('Promedio de Marta:', calcularPromedio(notasMarta).toFixed(2)); // 9.17
  imprimir('Array vacío ->', calcularPromedio([]));                        // 0

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

  titulo('2. Declaración de función y hoisting');

  // Fíjate: la LLAMAMOS aquí arriba y la ESCRIBIMOS abajo. Y funciona.
  imprimir('Llamada antes de declararla:', describirCurso('Full Stack 2'));

  /**
   * describirCurso(): construye una frase de presentación del curso.
   * @param {string} nombreCurso
   * @returns {string}
   */
  function describirCurso(nombreCurso) {
    return 'Bienvenidos al curso ' + nombreCurso + '.';
  }

  imprimir('Llamada después de declararla:', describirCurso('Desarrollo Front End'));

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

  titulo('3. Expresión de función: el hoisting NO te salva');

  // ⚠️ ERROR COMÚN: llamar a una expresión de función antes de tiempo.
  // Lo demostramos dentro de try/catch para que el error no rompa la página.
  try {
    imprimir(convertirANotaLetra(9));
  } catch (error) {
    imprimir('Error capturado ->', error.name + ': ' + error.message);
    imprimir('Traducción: la constante existe, pero todavía no tiene valor.');
  }

  /**
   * convertirANotaLetra(): traduce una nota numérica a su letra.
   * Escrita como EXPRESIÓN de función y guardada en una constante.
   * @param {number} nota - de 0 a 10
   * @returns {string} A, B, C, D o F
   */
  const convertirANotaLetra = function (nota) {
    if (nota >= 9) return 'A (excelente)';
    if (nota >= 7) return 'B (notable)';
    if (nota >= 6) return 'C (aprobado justo)';
    if (nota >= 5) return 'D (suficiente)';
    return 'F (suspenso)';
  };

  // A partir de esta línea sí está disponible.
  imprimir('Nota 9  ->', convertirANotaLetra(9));   // A (excelente)
  imprimir('Nota 6.2 ->', convertirANotaLetra(6.2)); // C (aprobado justo)
  imprimir('Nota 3  ->', convertirANotaLetra(3));   // F (suspenso)

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

  titulo('4. return, y qué pasa cuando no lo hay');

  /** duplicar(): DEVUELVE un valor nuevo. */
  function duplicar(numero) {
    return numero * 2;
  }

  /** mostrarEnPantalla(): solo MUESTRA algo; no devuelve nada. */
  function mostrarEnPantalla(texto) {
    imprimir('   >> ' + texto);
    // No hay return: JavaScript añade un `return undefined;` invisible.
  }

  const resultadoDuplicar = duplicar(21);
  const resultadoMostrar = mostrarEnPantalla('Hola clase');

  imprimir('duplicar(21) devuelve:', resultadoDuplicar);          // 42
  imprimir('mostrarEnPantalla() devuelve:', resultadoMostrar);    // undefined

  // ⚠️ ERROR COMÚN: confundir "mostrar" con "devolver".
  // Una función que hace console.log() NO devuelve ese texto:
  // devuelve undefined. Si necesitas el dato para seguir trabajando
  // con él, usa return.

  /** Todo lo que hay después de un return NUNCA se ejecuta. */
  function comprobarAprobado(nota) {
    if (nota >= 5) {
      return 'Aprobado';   // sale de la función aquí mismo
    }
    return 'Suspenso';
    // imprimir('nunca me verás'); // <- código inalcanzable (dead code)
  }

  imprimir('comprobarAprobado(8) ->', comprobarAprobado(8)); // Aprobado
  imprimir('comprobarAprobado(2) ->', comprobarAprobado(2)); // Suspenso

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

  titulo('5. Funciones flecha: de la forma larga a la corta');

  // Paso 0 · Expresión de función tradicional
  const sumarTradicional = function (a, b) {
    return a + b;
  };

  // Paso 1 · Flecha con cuerpo de bloque { } y return explícito
  const sumarFlechaLarga = (a, b) => {
    return a + b;
  };

  // Paso 2 · RETORNO IMPLÍCITO: si el cuerpo es UNA sola expresión,
  // se quitan las llaves y el return. El valor se devuelve solo.
  const sumarFlechaCorta = (a, b) => a + b;

  imprimir('sumarTradicional(2, 3) ->', sumarTradicional(2, 3)); // 5
  imprimir('sumarFlechaLarga(2, 3) ->', sumarFlechaLarga(2, 3)); // 5
  imprimir('sumarFlechaCorta(2, 3) ->', sumarFlechaCorta(2, 3)); // 5

  // ⚠️ ERROR COMÚN: poner llaves Y esperar retorno implícito.
  // `(a, b) => { a + b }` calcula la suma y la tira a la basura:
  // devuelve undefined porque falta el return.
  const sumaRota = (a, b) => { a + b; };
  imprimir('Con llaves pero sin return ->', sumaRota(2, 3)); // undefined

  // --- Paréntesis en los parámetros ---------------------------------

  // Con UN solo parámetro los paréntesis son opcionales.
  const alCuadrado = numero => numero * numero;      // válido
  const alCubo = (numero) => numero * numero * numero; // también válido

  imprimir('alCuadrado(7) ->', alCuadrado(7)); // 49
  imprimir('alCubo(3) ->', alCubo(3));         // 27

  // ✅ BUENA PRÁCTICA: escribe siempre los paréntesis. Son obligatorios
  // con cero o con dos o más parámetros, así que mantenerlos hace el
  // código uniforme y evita reescribir la línea al añadir un parámetro.

  // Sin parámetros: los paréntesis vacíos son OBLIGATORIOS.
  const saludar = () => 'Hola, clase de Full Stack 2';
  imprimir('saludar() ->', saludar());

  // ⚠️ ERROR COMÚN: devolver un objeto con retorno implícito.
  // JavaScript confunde la llave { del objeto con la llave del cuerpo.
  // La solución es envolver el objeto entre paréntesis: ({ ... })
  const crearEstudianteMal = (nombre) => { nombre: nombre };   // devuelve undefined
  const crearEstudianteBien = (nombre) => ({ nombre: nombre }); // devuelve el objeto

  imprimir('Sin paréntesis ->', crearEstudianteMal('Ana'));   // undefined
  imprimir('Con paréntesis ->', crearEstudianteBien('Ana'));  // { "nombre": "Ana" }

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

  titulo('5b. Las flechas NO tienen el objeto arguments');

  function contarConArguments() {
    // `arguments` existe automáticamente dentro de toda función normal.
    return 'Recibí ' + arguments.length + ' argumentos';
  }

  const contarConFlecha = (...args) => 'Recibí ' + args.length + ' argumentos';

  imprimir(contarConArguments(1, 2, 3));  // Recibí 3 argumentos
  imprimir(contarConFlecha(1, 2, 3, 4));  // Recibí 4 argumentos

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

  titulo('6. Una función es un valor más');

  imprimir('Sin paréntesis (la función):', saludar);    // f saludar()
  imprimir('Con paréntesis (su resultado):', saludar()); // Hola, clase...

  imprimir('typeof saludar ->', typeof saludar);        // "function"
  imprimir('saludar.name ->', saludar.name);            // "saludar"
  imprimir('alCuadrado.length ->', alCuadrado.length);  // 1 -> nº de parámetros declarados

  // Guardar funciones dentro de un ARRAY y ejecutarlas en fila.
  const transformaciones = [duplicar, alCuadrado, alCubo];
  for (const transformacion of transformaciones) {
    imprimir('   ' + transformacion.name + '(4) ->', transformacion(4));
  }
  // duplicar(4) -> 8 | alCuadrado(4) -> 16 | alCubo(4) -> 64

  // Guardar funciones dentro de un OBJETO. Este patrón es exactamente
  // el que usa la calculadora de la sección 7 de la página.
  const conversores = {
    aMayusculas: (texto) => texto.toUpperCase(),
    aMinusculas: (texto) => texto.toLowerCase(),
    capitalizar: (texto) => texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
  };

  imprimir('aMayusculas ->', conversores.aMayusculas('desarrollo front end'));
  imprimir('aMinusculas ->', conversores.aMinusculas('DESARROLLO FRONT END'));
  imprimir('capitalizar ->', conversores.capitalizar('dESARROLLO front end'));

  // Elegir la función a ejecutar con una variable de texto: acceso por
  // corchetes. Muy útil cuando el usuario elige la operación en un <select>.
  const elegida = 'capitalizar';
  imprimir('Elegida por nombre (' + elegida + ') ->', conversores[elegida]('hola MUNDO'));

  // ============================================================
  // 7. RESUMEN COMPARATIVO
  // ============================================================

  titulo('7. Resumen de las tres formas');

  imprimir('DECLARACIÓN   function f(a) { return a; }   -> sí tiene hoisting');
  imprimir('EXPRESIÓN     const f = function (a) {...}; -> no se puede llamar antes');
  imprimir('FLECHA        const f = (a) => a;           -> corta, sin this ni arguments');

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
