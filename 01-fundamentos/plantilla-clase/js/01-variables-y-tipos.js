/**
 * ============================================================
 * ARCHIVO: js/01-variables-y-tipos.js   ·   PLANTILLA DE CLASE
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
 * ------------------------------------------------------------
 * COMO USAR ESTA PLANTILLA:
 *   Todo lo que hay escrito son COMENTARIOS y andamiaje. El codigo
 *   real se escribe en vivo siguiendo los bloques "TODO (en clase)".
 *   La pagina abre sin errores y con la consola visual vacia: eso es
 *   exactamente lo esperado antes de escribir la primera linea.
 *   La version resuelta esta en ../../js/01-variables-y-tipos.js
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

  La IIFE ya viene escrita en la plantilla: no hay que teclearla.
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

  // NOTA DE LA PLANTILLA: esta seccion 1 YA VIENE ESCRITA a proposito.
  // Es andamiaje, no materia: sin imprimir() no se puede demostrar nada
  // en pantalla desde el primer minuto. Explicala, pero no la teclees.

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

  // TODO (en clase):
  //   1. Llama a titulo('1. COMENTARIOS Y METODOS DE CONSOLE') para abrir
  //      el primer separador de la consola visual.
  //   2. Llama a imprimir('Los comentarios no se ejecutan: son notas para las personas.')
  //   Resultado esperado en pantalla: una franja de "=" con el texto
  //   "1. COMENTARIOS Y METODOS DE CONSOLE" y debajo la frase.
  //   (aprox. 2 lineas)

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

  // TODO (en clase):
  //   1. Lanza los cuatro metodos, uno por linea, con estos textos exactos:
  //        console.log('console.log: mensaje normal.');
  //        console.info('console.info: informacion adicional.');
  //        console.warn('console.warn: advertencia (amarillo).');
  //        console.error('console.error: error (rojo).');
  //      Subraya que console.error NO detiene la ejecucion, solo avisa.
  //   2. Abre F12 y ensena los colores (en la consola visual salen en gris).
  //   3. Imprime en pantalla:
  //      imprimir('Se enviaron log, info, warn y error a DevTools. Abre F12 para ver los colores.')
  //   Resultado esperado en pantalla: esa unica frase (los console.* solo se ven en DevTools).
  //   (aprox. 5 lineas)

  /*
    console.table es la joya escondida: recibe un arreglo de objetos
    y dibuja una tabla de verdad en DevTools. Perfecto para revisar datos.
  */

  // DATOS DE PARTIDA (ya escritos: teclearlos en clase seria tiempo perdido).
  const estudiantes = [
    { nombre: 'Ana Rojas', nota: 9.5, aprobado: true },
    { nombre: 'Bruno Diaz', nota: 4.2, aprobado: false },
    { nombre: 'Carla Mena', nota: 7.0, aprobado: true }
  ];

  // TODO (en clase):
  //   1. Llama a console.table(estudiantes) y ensena la tabla real en DevTools.
  //   2. Llama a imprimir('console.table(estudiantes) ->')
  //   3. Llama a imprimir(estudiantes) y explica que imprimir() convierte los
  //      objetos con JSON.stringify, por eso en pantalla sale como JSON.
  //   Resultado esperado en pantalla: la etiqueta y debajo los tres objetos en JSON.
  //   (aprox. 3 lineas)

  // ✅ BUENA PRACTICA: usar console.table para revisar listas de objetos
  // en lugar de imprimir 20 console.log seguidos.

  // ============================================================
  // 4. VARIABLES: var, let y const
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('2. VARIABLES: var, let y const').
  //   (aprox. 1 linea)

  /*
    Una variable es una caja con etiqueta donde guardamos un valor
    para poder usarlo mas adelante. Declarar es "crear la caja";
    asignar es "meter algo dentro".
  */

  // --- const: la opcion por defecto -------------------------------
  // Se usa cuando el valor NO se va a reasignar. Obliga a dar valor inicial.

  // TODO (en clase):
  //   1. Declara const nombreDelCurso = 'Full Stack 2 - Front End';
  //   2. Imprimelo con imprimir('const nombreDelCurso =', nombreDelCurso)
  //   Resultado esperado en pantalla: const nombreDelCurso = Full Stack 2 - Front End
  //   (aprox. 2 lineas)

  // ⚠️ ERROR COMUN: intentar reasignar una constante.
  // nombreDelCurso = 'Otro curso';  // TypeError: Assignment to constant variable.
  // (esta linea esta comentada a proposito: si la descomentas, la pagina se rompe)

  // --- let: para valores que cambian ------------------------------

  // TODO (en clase):
  //   1. Declara let cantidadDeEstudiantes = 24; e imprimelo con
  //      imprimir('let cantidadDeEstudiantes =', cantidadDeEstudiantes)
  //   2. Reasignalo a 26 e imprime imprimir('Tras la reasignacion ->', cantidadDeEstudiantes)
  //   Resultado esperado en pantalla: primero 24 y despues 26.
  //   (aprox. 4 lineas)

  // --- var: la forma antigua --------------------------------------
  // Funciona, pero tiene comportamientos que confunden. Se muestra
  // para poder LEER codigo viejo, no para escribir codigo nuevo.

  // TODO (en clase):
  //   1. Declara var mensajeAntiguo = 'Declarado con var';
  //   2. Imprimelo con imprimir('var mensajeAntiguo =', mensajeAntiguo)
  //   Resultado esperado en pantalla: var mensajeAntiguo = Declarado con var
  //   (aprox. 2 lineas)

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

  // TODO (en clase):
  //   1. Declara la funcion demostrarAmbito() (sin parametros).
  //   2. Dentro, abre un if (true) { ... } y declara ahi:
  //        var conVar = 'soy var';   y   let conLet = 'soy let';
  //      Imprime dentro del if:
  //        imprimir('Dentro del if -> conVar:', conVar, '| conLet:', conLet)
  //   3. Fuera del if (pero dentro de la funcion) imprime:
  //        imprimir('Fuera del if  -> conVar:', conVar)
  //      y comenta en voz alta que funciona, y que por eso var confunde.
  //   4. Cierra con:
  //        imprimir('Fuera del if  -> conLet: no existe (ReferenceError si se usa)')
  //   5. Llama a demostrarAmbito().
  //   Resultado esperado en pantalla:
  //      Dentro del if -> conVar: soy var | conLet: soy let
  //      Fuera del if  -> conVar: soy var
  //      Fuera del if  -> conLet: no existe (ReferenceError si se usa)
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMUN: creer que conLet sigue viva fuera del bloque.
  // imprimir(conLet);  // ReferenceError: conLet is not defined

  /*
    El caso clasico del bucle. Con var, las tres iteraciones comparten
    LA MISMA variable; con let, cada vuelta crea una copia nueva.
    Esto se nota muchisimo cuando trabajemos con eventos y temporizadores.
  */

  // TODO (en clase):
  //   1. Crea const contadoresVar = []; y un for (var i = 0; i < 3; i++)
  //      que haga contadoresVar.push(function () { return i; });
  //   2. Repite lo mismo en const contadoresLet = []; pero con
  //      for (let j = 0; j < 3; j++) y return j;
  //   3. Imprime las dos listas ejecutando cada funcion:
  //        imprimir('Con var, las 3 funciones devuelven:', contadoresVar.map((f) => f()).join(', '))
  //        imprimir('Con let, las 3 funciones devuelven:', contadoresLet.map((f) => f()).join(', '))
  //   Resultado esperado en pantalla:
  //      Con var, las 3 funciones devuelven: 3, 3, 3
  //      Con let, las 3 funciones devuelven: 0, 1, 2
  //   (aprox. 12 lineas)

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

  // TODO (en clase):
  //   1. ANTES de declararla, imprime:
  //        imprimir('typeof antesDeVar (antes de declararla):', typeof antesDeVar)
  //      Sale "undefined" y NO da error: eso es el hoisting de var.
  //   2. Debajo declara var antesDeVar = 'ya tengo valor';
  //   3. Imprime imprimir('antesDeVar despues de declararla:', antesDeVar)
  //   4. Cierra con imprimir('Con let/const NO se puede leer antes de declarar: eso es la TDZ.')
  //   Resultado esperado en pantalla:
  //      typeof antesDeVar (antes de declararla): undefined
  //      antesDeVar despues de declararla: ya tengo valor
  //      Con let/const NO se puede leer antes de declarar: eso es la TDZ.
  //   (aprox. 4 lineas)

  // ⚠️ ERROR COMUN: hacer lo mismo con let.
  // imprimir(antesDeLet);            // ReferenceError: Cannot access 'antesDeLet' before initialization
  // let antesDeLet = 'hola';

  // ============================================================
  // 7. const CON OBJETOS: LO QUE const NO PROTEGE
  // ============================================================

  /*
    const bloquea la CAJA, no el contenido. Si la caja guarda un objeto,
    el objeto puede cambiar por dentro; lo que no se puede es apuntar la
    misma etiqueta a otra caja distinta.
  */

  // TODO (en clase):
  //   1. Declara const configuracion = { tema: 'oscuro', idioma: 'es' };
  //   2. Cambia configuracion.tema = 'claro';  (permitido: se muta el contenido)
  //   3. Imprime imprimir('Objeto const mutado ->', configuracion)
  //   Resultado esperado en pantalla: el objeto JSON con tema "claro" e idioma "es".
  //   (aprox. 3 lineas)

  // configuracion = {};   // ⚠️ TypeError: Assignment to constant variable.

  // Si de verdad queremos congelar el contenido, existe Object.freeze:

  // TODO (en clase):
  //   1. Declara const limites = Object.freeze({ maximoIntentos: 3 });
  //   2. Envuelve en try { ... } catch (error) { ... } el intento
  //      limites.maximoIntentos = 99;
  //      y en el catch imprime:
  //        imprimir('Object.freeze + modo estricto ->', error.name + ': ' + error.message)
  //   3. Fuera del try, imprime imprimir('El valor congelado sigue siendo ->', limites.maximoIntentos)
  //   Resultado esperado en pantalla:
  //      Object.freeze + modo estricto -> TypeError: Cannot assign to read only property...
  //      El valor congelado sigue siendo -> 3
  //   (aprox. 7 lineas)

  /*
    ⚠️ ERROR COMUN: pensar que tocar un objeto congelado "no hace nada".
    En modo normal el cambio se ignora en silencio, pero como este archivo
    usa 'use strict', JavaScript lanza un TypeError. Lo capturamos con
    try/catch para poder ensenarlo sin romper la pagina.
  */

  // ============================================================
  // 8. REGLAS Y CONVENCIONES DE NOMBRES
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('3. NOMBRES DE VARIABLES').
  //   (aprox. 1 linea)

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

  // TODO (en clase):
  //   1. Declara las tres constantes de ejemplo:
  //        const notaFinalDelCurso = 8.75;      // camelCase, descriptivo
  //        const IVA_GENERAL = 0.21;            // constante de configuracion
  //        const $formularioPrincipal = null;   // $ suele indicar "elemento del DOM"
  //   2. Imprime cada una:
  //        imprimir('camelCase  ->', 'notaFinalDelCurso =', notaFinalDelCurso)
  //        imprimir('CONSTANTE  ->', 'IVA_GENERAL =', IVA_GENERAL)
  //        imprimir('Prefijo $  ->', '$formularioPrincipal =', String($formularioPrincipal))
  //      (el String() del ultimo evita que imprimir() trate el null como objeto)
  //   Resultado esperado en pantalla: las tres lineas con 8.75, 0.21 y null.
  //   (aprox. 6 lineas)

  // ⚠️ ERROR COMUN: nombres sin significado (a, x, dato1, cosa).
  // Dentro de dos semanas nadie recuerda que guardaban.

  // ============================================================
  // 9. LOS 7 TIPOS PRIMITIVOS
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('4. TIPOS PRIMITIVOS Y typeof').
  //   (aprox. 1 linea)

  /*
    Un tipo primitivo es un valor simple e inmutable: no tiene partes
    internas que modificar. Son siete.
  */

  // TODO (en clase):
  //   1. Declara los siete primitivos, uno por linea y en este orden:
  //        const textoNombre = 'Ana Rojas';            // 1. string
  //        const numeroNota = 9.5;                     // 2. number
  //        const estaMatriculado = true;               // 3. boolean
  //        let   telefonoDeContacto;                   // 4. undefined (sin valor)
  //        const segundoApellido = null;               // 5. null
  //        const idUnico = Symbol('id-estudiante');    // 6. symbol
  //        const numeroEnorme = 9007199254740993n;     // 7. bigint (la n final lo marca)
  //   2. Imprime los siete con estas etiquetas alineadas:
  //        'string    ->' / 'number    ->' / 'boolean   ->' / 'undefined ->' /
  //        'null      ->' / 'symbol    ->' / 'bigint    ->'
  //      Ojo: undefined y null van envueltos en String(...), el symbol con
  //      idUnico.toString() y el bigint con numeroEnorme.toString() + 'n'.
  //   Resultado esperado en pantalla:
  //      string    -> Ana Rojas
  //      number    -> 9.5
  //      boolean   -> true
  //      undefined -> undefined
  //      null      -> null
  //      symbol    -> Symbol(id-estudiante)
  //      bigint    -> 9007199254740993n
  //   (aprox. 14 lineas)

  /*
    Diferencia clave entre undefined y null:
      undefined -> "todavia nadie puso nada aqui" (lo pone JavaScript)
      null      -> "aqui no hay nada, y es intencionado" (lo ponemos nosotros)
  */

  // TODO (en clase):
  //   1. Dos symbols nunca son iguales aunque compartan descripcion:
  //        imprimir('Symbol("a") === Symbol("a") ->', Symbol('a') === Symbol('a'))
  //   2. number tiene limite de precision para enteros; bigint no:
  //        imprimir('Number.MAX_SAFE_INTEGER ->', Number.MAX_SAFE_INTEGER)
  //        imprimir('9007199254740991 + 2 (number) ->', 9007199254740991 + 2)
  //        imprimir('9007199254740991n + 2n (bigint) ->', (9007199254740991n + 2n).toString())
  //   Resultado esperado en pantalla:
  //      Symbol("a") === Symbol("a") -> false
  //      Number.MAX_SAFE_INTEGER -> 9007199254740991
  //      9007199254740991 + 2 (number) -> 9007199254740992   <- mal, se pierde precision
  //      9007199254740991n + 2n (bigint) -> 9007199254740993 <- correcto
  //   (aprox. 4 lineas)

  // ⚠️ ERROR COMUN: mezclar bigint y number en una operacion.
  // imprimir(1n + 1);  // TypeError: Cannot mix BigInt and other types

  // ============================================================
  // 10. typeof Y LA RAREZA DE null
  // ============================================================

  /*
    typeof es un operador (no una funcion, aunque se suela escribir con
    parentesis) que devuelve, en forma de TEXTO, el tipo de un valor.
  */

  // TODO (en clase):
  //   Imprime estas diez lineas, en este orden exacto, con imprimir():
  //        'typeof "Ana"        ->', typeof 'Ana'           -> "string"
  //        'typeof 42           ->', typeof 42              -> "number"
  //        'typeof true         ->', typeof true            -> "boolean"
  //        'typeof undefined    ->', typeof undefined       -> "undefined"
  //        'typeof Symbol()     ->', typeof Symbol()        -> "symbol"
  //        'typeof 10n          ->', typeof 10n             -> "bigint"
  //        'typeof {}           ->', typeof {}              -> "object"
  //        'typeof []           ->', typeof []              -> "object"   <- ojo
  //        'typeof function(){} ->', typeof function () {}  -> "function"
  //        'typeof null         ->', typeof null            -> "object"   <- LA RAREZA
  //   Para el ultimo, para la clase y explica el bug historico.
  //   (aprox. 10 lineas)

  /*
    LA RAREZA MAS FAMOSA DEL LENGUAJE
    ---------------------------------
    typeof null devuelve "object". Es un fallo de la primera version de
    JavaScript (1995): internamente null se representaba con la etiqueta
    de los objetos. Se propuso arreglarlo, pero habria roto millones de
    paginas web, asi que se quedo asi para siempre.

    ✅ BUENA PRACTICA: para saber si algo es null, comparalo directamente.
  */

  // TODO (en clase):
  //   1. Declara const valorVacio = null;
  //   2. Imprime imprimir('valorVacio === null ->', valorVacio === null)   -> true
  //   3. Para distinguir arreglo de objeto, imprime:
  //        imprimir('Array.isArray([]) ->', Array.isArray([]))   -> true
  //        imprimir('Array.isArray({}) ->', Array.isArray({}))   -> false
  //   Resultado esperado en pantalla: true, true, false.
  //   (aprox. 4 lineas)

  // ============================================================
  // 11. VALOR FRENTE A REFERENCIA
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('5. VALOR FRENTE A REFERENCIA').
  //   (aprox. 1 linea)

  /*
    LOS PRIMITIVOS SE COPIAN POR VALOR
    Imagina que fotocopias una hoja: si pintas la fotocopia, el original
    no se entera. Cada variable guarda su propia copia del valor.
  */

  // TODO (en clase):
  //   1. let notaOriginal = 7;
  //   2. let notaCopia = notaOriginal;   // se copia el VALOR 7
  //   3. notaCopia = 10;                 // cambiar la copia no toca al original
  //   4. imprimir('notaOriginal:', notaOriginal, '| notaCopia:', notaCopia)
  //   Resultado esperado en pantalla: notaOriginal: 7 | notaCopia: 10
  //   (aprox. 4 lineas)

  /*
    LOS OBJETOS Y ARREGLOS SE COPIAN POR REFERENCIA
    Aqui no fotocopias la hoja: compartes la DIRECCION de la casa donde
    esta la hoja. Si tu invitado pinta la pared, tu tambien la ves pintada,
    porque es la misma casa.
  */

  // TODO (en clase):
  //   1. const estudianteOriginal = { nombre: 'Ana', nota: 7 };
  //   2. const estudianteCopia = estudianteOriginal;   // copia la DIRECCION, no el objeto
  //   3. estudianteCopia.nota = 10;                    // modificamos "la copia"...
  //   4. Imprime los dos objetos y la comparacion:
  //        imprimir('estudianteOriginal ->', estudianteOriginal)
  //        imprimir('estudianteCopia    ->', estudianteCopia)
  //        imprimir('Son el mismo objeto? ->', estudianteOriginal === estudianteCopia)
  //   Resultado esperado en pantalla: los DOS objetos con nota 10, y true.
  //   (aprox. 6 lineas)

  // ⚠️ ERROR COMUN: creer que "const objeto2 = objeto1" crea una copia
  // independiente. No: crea un segundo nombre para el MISMO objeto.

  /*
    COMO COPIAR DE VERDAD (copia superficial)
    El operador de propagacion ... crea un objeto nuevo con las mismas
    propiedades. Para arreglos sirve tanto [...arreglo] como arreglo.slice().
  */

  // TODO (en clase):
  //   1. const estudianteBase = { nombre: 'Bruno', nota: 5 };
  //   2. const copiaReal = { ...estudianteBase };   // objeto NUEVO
  //   3. copiaReal.nota = 9;
  //   4. Imprime imprimir('estudianteBase ->', estudianteBase)   -> nota sigue en 5
  //             imprimir('copiaReal      ->', copiaReal)         -> nota 9
  //             imprimir('Son el mismo objeto? ->', estudianteBase === copiaReal)  -> false
  //   5. Repite la idea con arreglos:
  //        const notasBase = [6, 7, 8];
  //        const notasCopia = [...notasBase];
  //        notasCopia.push(10);
  //        imprimir('notasBase :', notasBase.join(', '))    -> 6, 7, 8
  //        imprimir('notasCopia:', notasCopia.join(', '))   -> 6, 7, 8, 10
  //   (aprox. 11 lineas)

  /*
    ⚠️ ERROR COMUN: creer que ... copia TODO. Es una copia SUPERFICIAL:
    los objetos anidados se siguen compartiendo.
  */

  // TODO (en clase):
  //   1. const cursoOriginal = { titulo: 'JS', docente: { nombre: 'Marta' } };
  //   2. const cursoCopia = { ...cursoOriginal };
  //   3. cursoCopia.docente.nombre = 'Pedro';   // toca el objeto interno COMPARTIDO
  //   4. imprimir('cursoOriginal.docente.nombre ->', cursoOriginal.docente.nombre)
  //   5. imprimir('Para copia profunda: structuredClone(objeto)')
  //   Resultado esperado en pantalla:
  //      cursoOriginal.docente.nombre -> Pedro   <- el original tambien cambio
  //   (aprox. 5 lineas)

  // ✅ BUENA PRACTICA: para una copia profunda usa structuredClone(objeto),
  // disponible en todos los navegadores modernos.
  // El typeof previo evita un error si el navegador es muy antiguo.

  // TODO (en clase):
  //   1. Escribe un if (typeof structuredClone === 'function') { ... } else { ... }
  //   2. En el if: const cursoProfundo = structuredClone(cursoOriginal);
  //                cursoProfundo.docente.nombre = 'Lucia';
  //                imprimir('Tras structuredClone, el original sigue con ->', cursoOriginal.docente.nombre)
  //   3. En el else: imprimir('Este navegador no tiene structuredClone (es muy antiguo).')
  //   4. Cierra el archivo con:
  //        imprimir('{a:1} === {a:1} ->', { a: 1 } === { a: 1 })   -> false
  //      Dos objetos con el mismo contenido NO son iguales: son casas distintas.
  //   Resultado esperado en pantalla:
  //      Tras structuredClone, el original sigue con -> Pedro
  //      {a:1} === {a:1} -> false
  //   (aprox. 8 lineas)

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
