/**
 * ============================================================
 * ARCHIVO: js/01-variables-y-tipos.js
 * PROYECTO: 01 - Fundamentos de JavaScript
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO:
 *   1. Como se escriben comentarios en JavaScript.
 *   2. Los metodos del objeto console (log, info, warn, error, table).
 *   3. Las tres formas de declarar variables: var, let y const.
 *   4. Las reglas y convenciones para nombrar variables (camelCase).
 *   5. Los 7 tipos primitivos del lenguaje.
 *   6. El operador typeof y su famosa rareza con null.
 *   7. La diferencia entre tipos por VALOR y tipos por REFERENCIA.
 *
 * QUE SE APRENDE AL TERMINAR:
 *   A declarar variables con criterio, a saber que tipo de dato
 *   tiene cada una y a entender por que copiar un objeto no
 *   funciona como copiar un numero.
 * ============================================================
 */

/*
  POR QUE TODO EL ARCHIVO VA DENTRO DE UNA IIFE
  ---------------------------------------------
  IIFE = Immediately Invoked Function Expression
  (funcion que se declara y se ejecuta en el acto).

  Esta pagina carga CUATRO archivos .js distintos. Si en dos de ellos
  declaramos una constante con el mismo nombre, el navegador lanza:
      "SyntaxError: Identifier 'x' has already been declared"
  y la pagina deja de funcionar.

  Al envolver todo en (function () { ... })(); creamos una "burbuja":
  las variables de dentro no existen fuera. Cada archivo tiene su
  propia burbuja y ya no pueden chocar entre ellos.
*/
(function () {
  // 'use strict' activa el modo estricto: JavaScript avisa de errores
  // que de otro modo pasarian en silencio (por ejemplo, usar una
  // variable sin declararla).
  'use strict';

  // ============================================================
  // 1. LA FUNCION AUXILIAR imprimir()
  // ============================================================

  /*
    Los estudiantes no siempre tienen abierto DevTools, y en clase se
    proyecta la pagina, no la consola. Por eso creamos una funcion que
    escribe el mensaje en LOS DOS SITIOS a la vez.

    Los tres puntos (...mensajes) se llaman "parametro rest": recogen
    todos los argumentos recibidos dentro de un arreglo, de forma que
    imprimir('a', 'b', 'c') funcione igual que console.log('a','b','c').
  */

  /**
   * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la pagina, para que se vea en clase sin
   * abrir DevTools.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes);                       // salida clasica de DevTools

    const salida = document.getElementById('salida');
    if (!salida) return;                            // si la pagina no tiene consola visual, no hace nada

    // Un objeto convertido a texto se veria como "[object Object]".
    // Por eso, si el mensaje es un objeto, usamos JSON.stringify para
    // mostrarlo legible y con sangria de 2 espacios.
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');

    salida.textContent += texto + '\n';             // \n = salto de linea
  }

  /**
   * titulo(): imprime un separador visual antes de cada seccion,
   * para que en la consola visual se distingan los bloques de un vistazo.
   */
  function titulo(texto) {
    imprimir('');
    imprimir('============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  /*
    Exponemos las dos funciones en el objeto global window para que los
    demas archivos (02, 03 y 04) puedan reutilizarlas sin copiarlas.

    Es una excepcion consciente: normalmente NO se ensucia el ambito
    global, pero aqui nos ahorra repetir el mismo codigo cuatro veces.
  */
  window.imprimir = imprimir;
  window.titulo = titulo;

  // ============================================================
  // 2. COMENTARIOS: DE UNA LINEA Y DE BLOQUE
  // ============================================================

  /*
    Un comentario es texto que el motor de JavaScript IGNORA por completo.
    Sirve para explicar por que hacemos algo, no que hacemos (eso ya lo
    dice el codigo). Piensa en ellos como las notas al margen de un libro.
  */

  // Esto es un comentario de UNA sola linea: empieza con // y llega hasta el final de la linea.

  /* Esto es un comentario
     de BLOQUE: puede ocupar
     varias lineas seguidas. */

  titulo('1. COMENTARIOS Y METODOS DE CONSOLE');
  imprimir('Los comentarios no se ejecutan: son notas para las personas.');

  // ⚠️ ERROR COMUN: comentar el "que" en vez del "por que".
  // Malo:  let edad = 20; // asigna 20 a edad   <- no aporta nada
  // Bueno: let edad = 20; // edad minima para el curso avanzado

  // ============================================================
  // 3. LOS METODOS DEL OBJETO console
  // ============================================================

  /*
    console no es "la consola": es un OBJETO que el navegador nos regala,
    con varias funciones dentro. La mas usada es log, pero hay mas y cada
    una se pinta distinto en DevTools.
  */

  console.log('console.log: mensaje normal.');          // texto plano
  console.info('console.info: informacion adicional.'); // igual que log en casi todos los navegadores
  console.warn('console.warn: advertencia (amarillo).');// llama la atencion
  console.error('console.error: error (rojo).');        // NO detiene la ejecucion, solo avisa

  imprimir('Se enviaron log, info, warn y error a DevTools. Abre F12 para ver los colores.');

  /*
    console.table es la joya escondida: recibe un arreglo de objetos
    y dibuja una tabla de verdad en DevTools. Perfecto para revisar datos.
  */
  const estudiantes = [
    { nombre: 'Ana Rojas', nota: 9.5, aprobado: true },
    { nombre: 'Bruno Diaz', nota: 4.2, aprobado: false },
    { nombre: 'Carla Mena', nota: 7.0, aprobado: true }
  ];

  console.table(estudiantes);                            // tabla bonita en DevTools
  imprimir('console.table(estudiantes) ->');
  imprimir(estudiantes);                                 // en la consola visual sale como JSON

  // ✅ BUENA PRACTICA: usar console.table para revisar listas de objetos
  // en lugar de imprimir 20 console.log seguidos.

  // ============================================================
  // 4. VARIABLES: var, let y const
  // ============================================================

  titulo('2. VARIABLES: var, let y const');

  /*
    Una variable es una caja con etiqueta donde guardamos un valor
    para poder usarlo mas adelante. Declarar es "crear la caja";
    asignar es "meter algo dentro".
  */

  // --- const: la opcion por defecto -------------------------------
  // Se usa cuando el valor NO se va a reasignar. Obliga a dar valor inicial.
  const nombreDelCurso = 'Full Stack 2 - Front End';
  imprimir('const nombreDelCurso =', nombreDelCurso);

  // ⚠️ ERROR COMUN: intentar reasignar una constante.
  // nombreDelCurso = 'Otro curso';  // TypeError: Assignment to constant variable.
  // (esta linea esta comentada a proposito: si la descomentas, la pagina se rompe)

  // --- let: para valores que cambian ------------------------------
  let cantidadDeEstudiantes = 24;
  imprimir('let cantidadDeEstudiantes =', cantidadDeEstudiantes);

  cantidadDeEstudiantes = 26;               // reasignar SI se puede
  imprimir('Tras la reasignacion ->', cantidadDeEstudiantes);

  // --- var: la forma antigua --------------------------------------
  // Funciona, pero tiene comportamientos que confunden. Se muestra
  // para poder LEER codigo viejo, no para escribir codigo nuevo.
  var mensajeAntiguo = 'Declarado con var';
  imprimir('var mensajeAntiguo =', mensajeAntiguo);

  // ============================================================
  // 5. AMBITO (SCOPE): LA DIFERENCIA REAL ENTRE var Y let
  // ============================================================

  /*
    El ambito es "hasta donde se ve" una variable.
    - var vive en toda la FUNCION donde se declaro.
    - let y const viven solo dentro del BLOQUE { } donde se declararon.

    Analogia: var es una carpeta compartida de toda la oficina;
    let es un cajon con llave dentro de un despacho concreto.
  */

  function demostrarAmbito() {
    if (true) {
      var conVar = 'soy var';        // se escapa del bloque if
      let conLet = 'soy let';        // vive solo aqui dentro
      imprimir('Dentro del if -> conVar:', conVar, '| conLet:', conLet);
    }

    imprimir('Fuera del if  -> conVar:', conVar);  // funciona (y por eso confunde)

    // ⚠️ ERROR COMUN: creer que conLet sigue viva aqui.
    // imprimir(conLet);  // ReferenceError: conLet is not defined
    imprimir('Fuera del if  -> conLet: no existe (ReferenceError si se usa)');
  }

  demostrarAmbito();

  /*
    El caso clasico del bucle. Con var, las tres iteraciones comparten
    LA MISMA variable; con let, cada vuelta crea una copia nueva.
    Esto se nota muchisimo cuando trabajemos con eventos y temporizadores.
  */
  const contadoresVar = [];
  for (var i = 0; i < 3; i++) {
    contadoresVar.push(function () { return i; });
  }

  const contadoresLet = [];
  for (let j = 0; j < 3; j++) {
    contadoresLet.push(function () { return j; });
  }

  imprimir('Con var, las 3 funciones devuelven:', contadoresVar.map((f) => f()).join(', '));  // 3, 3, 3
  imprimir('Con let, las 3 funciones devuelven:', contadoresLet.map((f) => f()).join(', '));  // 0, 1, 2

  // ✅ BUENA PRACTICA: const por defecto; let solo si hace falta reasignar;
  // var, nunca en codigo nuevo.

  // ============================================================
  // 6. HOISTING Y ZONA MUERTA TEMPORAL (TDZ)
  // ============================================================

  /*
    "Hoisting" (elevacion) es que JavaScript reserva el nombre de todas
    las variables al empezar a leer el bloque, ANTES de ejecutar nada.
    - Con var, ese nombre ya existe y vale undefined -> no da error.
    - Con let y const, el nombre existe pero esta "congelado" hasta la
      linea donde se declara: es la Zona Muerta Temporal (TDZ).
  */

  imprimir('typeof antesDeVar (antes de declararla):', typeof antesDeVar); // "undefined", no da error
  var antesDeVar = 'ya tengo valor';
  imprimir('antesDeVar despues de declararla:', antesDeVar);

  // ⚠️ ERROR COMUN: hacer lo mismo con let.
  // imprimir(antesDeLet);            // ReferenceError: Cannot access 'antesDeLet' before initialization
  // let antesDeLet = 'hola';

  imprimir('Con let/const NO se puede leer antes de declarar: eso es la TDZ.');

  // ============================================================
  // 7. const CON OBJETOS: LO QUE const NO PROTEGE
  // ============================================================

  /*
    const bloquea la CAJA, no el contenido. Si la caja guarda un objeto,
    el objeto puede cambiar por dentro; lo que no se puede es apuntar la
    misma etiqueta a otra caja distinta.
  */
  const configuracion = { tema: 'oscuro', idioma: 'es' };
  configuracion.tema = 'claro';                       // permitido: mutar el contenido
  imprimir('Objeto const mutado ->', configuracion);  // { tema: "claro", idioma: "es" }

  // configuracion = {};   // ⚠️ TypeError: Assignment to constant variable.

  // Si de verdad queremos congelar el contenido, existe Object.freeze:
  const limites = Object.freeze({ maximoIntentos: 3 });

  /*
    ⚠️ ERROR COMUN: pensar que tocar un objeto congelado "no hace nada".
    En modo normal el cambio se ignora en silencio, pero como este archivo
    usa 'use strict', JavaScript lanza un TypeError. Lo capturamos con
    try/catch para poder ensenarlo sin romper la pagina.
  */
  try {
    limites.maximoIntentos = 99;                      // intento de modificar lo congelado
  } catch (error) {
    imprimir('Object.freeze + modo estricto ->', error.name + ': ' + error.message);
  }

  imprimir('El valor congelado sigue siendo ->', limites.maximoIntentos);  // 3

  // ============================================================
  // 8. REGLAS Y CONVENCIONES DE NOMBRES
  // ============================================================

  titulo('3. NOMBRES DE VARIABLES');

  /*
    REGLAS (obligatorias, si no el codigo no compila):
      - Pueden llevar letras, numeros, guion bajo _ y el simbolo $.
      - NO pueden EMPEZAR por un numero:  1nota  -> error.
      - NO pueden llevar espacios ni guiones:  mi nota / mi-nota -> error.
      - Distinguen mayusculas de minusculas: nota y Nota son distintas.
      - No se pueden usar palabras reservadas: let, class, return, new...

    CONVENCIONES (acuerdos de la comunidad, no obligan pero se esperan):
      - camelCase para variables y funciones:      notaFinalDelCurso
      - PascalCase para clases:                    EstudianteMatriculado
      - MAYUSCULAS_CON_GUION_BAJO para constantes globales: IVA_GENERAL
      - Nombres descriptivos y en un solo idioma.
  */

  const notaFinalDelCurso = 8.75;      // ✅ camelCase, descriptivo
  const IVA_GENERAL = 0.21;            // ✅ constante de configuracion
  const $formularioPrincipal = null;   // $ suele indicar "elemento del DOM"

  imprimir('camelCase  ->', 'notaFinalDelCurso =', notaFinalDelCurso);
  imprimir('CONSTANTE  ->', 'IVA_GENERAL =', IVA_GENERAL);
  imprimir('Prefijo $  ->', '$formularioPrincipal =', String($formularioPrincipal));

  // ⚠️ ERROR COMUN: nombres sin significado (a, x, dato1, cosa).
  // Dentro de dos semanas nadie recuerda que guardaban.

  // ============================================================
  // 9. LOS 7 TIPOS PRIMITIVOS
  // ============================================================

  titulo('4. TIPOS PRIMITIVOS Y typeof');

  /*
    Un tipo primitivo es un valor simple e inmutable: no tiene partes
    internas que modificar. Son siete.
  */

  const textoNombre = 'Ana Rojas';                 // 1. string  -> texto
  const numeroNota = 9.5;                          // 2. number  -> enteros y decimales, todo junto
  const estaMatriculado = true;                    // 3. boolean -> true o false
  let telefonoDeContacto;                          // 4. undefined -> declarada pero sin valor
  const segundoApellido = null;                    // 5. null -> vacio A PROPOSITO
  const idUnico = Symbol('id-estudiante');         // 6. symbol -> identificador irrepetible
  const numeroEnorme = 9007199254740993n;          // 7. bigint -> la n final lo marca

  imprimir('string    ->', textoNombre);
  imprimir('number    ->', numeroNota);
  imprimir('boolean   ->', estaMatriculado);
  imprimir('undefined ->', String(telefonoDeContacto));
  imprimir('null      ->', String(segundoApellido));
  imprimir('symbol    ->', idUnico.toString());
  imprimir('bigint    ->', numeroEnorme.toString() + 'n');

  /*
    Diferencia clave entre undefined y null:
      undefined -> "todavia nadie puso nada aqui" (lo pone JavaScript)
      null      -> "aqui no hay nada, y es intencionado" (lo ponemos nosotros)
  */

  // Dos symbols nunca son iguales, aunque tengan la misma descripcion.
  imprimir('Symbol("a") === Symbol("a") ->', Symbol('a') === Symbol('a'));  // false

  // number tiene un limite de precision para enteros; bigint no.
  imprimir('Number.MAX_SAFE_INTEGER ->', Number.MAX_SAFE_INTEGER);          // 9007199254740991
  imprimir('9007199254740991 + 2 (number) ->', 9007199254740991 + 2);       // 9007199254740992 (mal)
  imprimir('9007199254740991n + 2n (bigint) ->', (9007199254740991n + 2n).toString());

  // ⚠️ ERROR COMUN: mezclar bigint y number en una operacion.
  // imprimir(1n + 1);  // TypeError: Cannot mix BigInt and other types

  // ============================================================
  // 10. typeof Y LA RAREZA DE null
  // ============================================================

  /*
    typeof es un operador (no una funcion, aunque se suela escribir con
    parentesis) que devuelve, en forma de TEXTO, el tipo de un valor.
  */

  imprimir('typeof "Ana"        ->', typeof 'Ana');          // "string"
  imprimir('typeof 42           ->', typeof 42);             // "number"
  imprimir('typeof true         ->', typeof true);           // "boolean"
  imprimir('typeof undefined    ->', typeof undefined);      // "undefined"
  imprimir('typeof Symbol()     ->', typeof Symbol());       // "symbol"
  imprimir('typeof 10n          ->', typeof 10n);            // "bigint"
  imprimir('typeof {}           ->', typeof {});             // "object"
  imprimir('typeof []           ->', typeof []);             // "object"  <- ojo
  imprimir('typeof function(){} ->', typeof function () {}); // "function"
  imprimir('typeof null         ->', typeof null);           // "object"  <- LA RAREZA

  /*
    LA RAREZA MAS FAMOSA DEL LENGUAJE
    ---------------------------------
    typeof null devuelve "object". Es un fallo de la primera version de
    JavaScript (1995): internamente null se representaba con la etiqueta
    de los objetos. Se propuso arreglarlo, pero habria roto millones de
    paginas web, asi que se quedo asi para siempre.

    ✅ BUENA PRACTICA: para saber si algo es null, comparalo directamente:
  */
  const valorVacio = null;
  imprimir('valorVacio === null ->', valorVacio === null);   // true, esta es la forma correcta

  // Para distinguir un arreglo de un objeto existe Array.isArray:
  imprimir('Array.isArray([]) ->', Array.isArray([]));       // true
  imprimir('Array.isArray({}) ->', Array.isArray({}));       // false

  // ============================================================
  // 11. VALOR FRENTE A REFERENCIA
  // ============================================================

  titulo('5. VALOR FRENTE A REFERENCIA');

  /*
    LOS PRIMITIVOS SE COPIAN POR VALOR
    Imagina que fotocopias una hoja: si pintas la fotocopia, el original
    no se entera. Cada variable guarda su propia copia del valor.
  */
  let notaOriginal = 7;
  let notaCopia = notaOriginal;   // se copia el VALOR 7
  notaCopia = 10;                 // cambiar la copia no toca al original

  imprimir('notaOriginal:', notaOriginal, '| notaCopia:', notaCopia);   // 7 | 10

  /*
    LOS OBJETOS Y ARREGLOS SE COPIAN POR REFERENCIA
    Aqui no fotocopias la hoja: compartes la DIRECCION de la casa donde
    esta la hoja. Si tu invitado pinta la pared, tu tambien la ves pintada,
    porque es la misma casa.
  */
  const estudianteOriginal = { nombre: 'Ana', nota: 7 };
  const estudianteCopia = estudianteOriginal;   // se copia la DIRECCION, no el objeto

  estudianteCopia.nota = 10;                    // modificamos "la copia"...

  imprimir('estudianteOriginal ->', estudianteOriginal);  // { nombre: "Ana", nota: 10 }  <- tambien cambio
  imprimir('estudianteCopia    ->', estudianteCopia);
  imprimir('Son el mismo objeto? ->', estudianteOriginal === estudianteCopia);  // true

  // ⚠️ ERROR COMUN: creer que "const objeto2 = objeto1" crea una copia
  // independiente. No: crea un segundo nombre para el MISMO objeto.

  /*
    COMO COPIAR DE VERDAD (copia superficial)
    El operador de propagacion ... crea un objeto nuevo con las mismas
    propiedades. Para arreglos sirve tanto [...arreglo] como arreglo.slice().
  */
  const estudianteBase = { nombre: 'Bruno', nota: 5 };
  const copiaReal = { ...estudianteBase };      // objeto NUEVO
  copiaReal.nota = 9;

  imprimir('estudianteBase ->', estudianteBase);   // nota sigue en 5
  imprimir('copiaReal      ->', copiaReal);        // nota 9
  imprimir('Son el mismo objeto? ->', estudianteBase === copiaReal);  // false

  const notasBase = [6, 7, 8];
  const notasCopia = [...notasBase];
  notasCopia.push(10);
  imprimir('notasBase :', notasBase.join(', '));   // 6, 7, 8
  imprimir('notasCopia:', notasCopia.join(', '));  // 6, 7, 8, 10

  /*
    ⚠️ ERROR COMUN: creer que ... copia TODO. Es una copia SUPERFICIAL:
    los objetos anidados se siguen compartiendo.
  */
  const cursoOriginal = { titulo: 'JS', docente: { nombre: 'Marta' } };
  const cursoCopia = { ...cursoOriginal };
  cursoCopia.docente.nombre = 'Pedro';          // toca el objeto interno compartido

  imprimir('cursoOriginal.docente.nombre ->', cursoOriginal.docente.nombre);  // "Pedro"
  imprimir('Para copia profunda: structuredClone(objeto)');

  // ✅ BUENA PRACTICA: para una copia profunda usa structuredClone(objeto),
  // disponible en todos los navegadores modernos.
  // El typeof previo evita un error si el navegador es muy antiguo.
  if (typeof structuredClone === 'function') {
    const cursoProfundo = structuredClone(cursoOriginal);
    cursoProfundo.docente.nombre = 'Lucia';
    imprimir('Tras structuredClone, el original sigue con ->', cursoOriginal.docente.nombre); // "Pedro"
  } else {
    imprimir('Este navegador no tiene structuredClone (es muy antiguo).');
  }

  // Dos objetos con el mismo contenido NO son iguales: son casas distintas.
  imprimir('{a:1} === {a:1} ->', { a: 1 } === { a: 1 });   // false

  /*
    ============================================================
    EJERCICIOS PROPUESTOS
    ============================================================
    1) Declara tres constantes con tus datos (nombre, edad y si estudias
       o no) usando el tipo correcto en cada una, e imprimelas con
       imprimir() indicando su typeof.

    2) Crea una variable con var dentro de un bloque if y otra con let en
       el mismo bloque. Intenta leerlas fuera del bloque y explica en un
       comentario que ocurre con cada una.

    3) Escribe una lista de 4 productos (objetos con nombre, precio y
       stock) y muestrala con console.table(). Despues imprime solo los
       nombres separados por comas.

    4) Crea un objeto tarea = { titulo: 'Estudiar', hecha: false }.
       Haz una copia con el operador ..., cambia hecha a true en la copia
       y demuestra con imprimir() que el original no se modifico.

    5) RETO: escribe una funcion sonIguales(a, b) que devuelva true solo
       si a y b son del mismo tipo Y tienen el mismo valor. Debe funcionar
       correctamente con null (recuerda la rareza de typeof) y con NaN.
    ============================================================
  */
})();
