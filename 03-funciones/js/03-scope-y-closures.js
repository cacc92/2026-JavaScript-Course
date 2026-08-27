/**
 * ============================================================
 * ARCHIVO: js/03-scope-y-closures.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: dónde vive cada variable y por qué las funciones tienen
 *       memoria.
 *
 * QUÉ SE APRENDE AQUÍ:
 *   1. Ámbito (scope) global, de función y de bloque.
 *   2. La cadena de ámbitos: cómo busca JavaScript una variable.
 *   3. Shadowing: una variable que tapa a otra del mismo nombre.
 *   4. var vs let/const y el bucle que "sale mal".
 *   5. CLOSURES: el contador y la fábrica de funciones.
 *   6. Para qué sirven los closures en la vida real
 *      (datos privados, memoización, ejecutar una sola vez).
 *   7. IIFE y el patrón módulo.
 *
 * Esta es la sección más importante del proyecto: casi todo lo
 * "raro" de JavaScript se explica entendiendo el ámbito.
 * ============================================================
 */

(function () {
  'use strict';

  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-03');

  // ============================================================
  // 1. ÁMBITO GLOBAL
  // ============================================================

  /*
   * El ÁMBITO (scope) es la zona del código donde una variable
   * existe y se puede usar. Hay tres:
   *
   *   - GLOBAL   -> fuera de toda función y de todo bloque.
   *                 Visible desde cualquier punto del programa.
   *   - FUNCIÓN  -> lo declarado dentro de una función.
   *   - BLOQUE   -> lo declarado con let/const dentro de { }.
   *
   * Analogía: el ámbito global es el tablón de anuncios del centro
   * (lo ve todo el mundo); el ámbito de función es una carpeta de
   * un aula; el de bloque, una nota dentro de esa carpeta.
   *
   * Como todo este archivo está dentro de una IIFE, aquí NADA es
   * realmente global. Para crear una variable global de verdad la
   * colgamos a propósito del objeto `window`.
   */

  titulo('1. Ámbito global');

  // ⚠️ Una sola global, con nombre inconfundible. Ensuciar el ámbito
  // global es una de las peores costumbres que se pueden coger.
  window.NOMBRE_DEL_CURSO = 'Full Stack 2 - Desarrollo Front End';

  function leerVariableGlobal() {
    // Desde dentro de una función se puede LEER lo global sin problema.
    return 'Desde dentro de la función veo: ' + window.NOMBRE_DEL_CURSO;
  }

  imprimir(leerVariableGlobal());
  imprimir('typeof window.NOMBRE_DEL_CURSO ->', typeof window.NOMBRE_DEL_CURSO);

  // ✅ BUENA PRÁCTICA: cuantas menos variables globales, mejor.
  // Si dos archivos usan el mismo nombre global, uno pisa al otro y
  // aparecen errores imposibles de rastrear.

  // ============================================================
  // 2. ÁMBITO DE FUNCIÓN
  // ============================================================

  /*
   * Todo lo declarado dentro de una función nace y muere con ella.
   * Cada llamada crea un juego de variables nuevo y limpio.
   */

  titulo('2. Ámbito de función');

  function calcularMatricula(precioBase) {
    const descuento = 0.15;                    // solo existe aquí dentro
    const precioFinal = precioBase * (1 - descuento);
    return precioFinal;
  }

  imprimir('Matrícula final ->', calcularMatricula(1000).toFixed(2)); // 850.00

  // ⚠️ ERROR COMÚN: intentar leer una variable interna desde fuera.
  try {
    // `descuento` no existe en este ámbito: ReferenceError.
    imprimir(descuento);
  } catch (error) {
    imprimir('Error al leer `descuento` desde fuera ->', error.name + ': ' + error.message);
  }

  // ============================================================
  // 3. ÁMBITO DE BLOQUE (let / const vs var)
  // ============================================================

  /*
   * Un BLOQUE es cualquier par de llaves { }: un if, un for, un while
   * o unas llaves sueltas.
   *
   *   - let y const respetan el bloque: mueren al cerrar la llave.
   *   - var lo IGNORA: se escapa del bloque y vive en toda la función.
   *
   * Esta diferencia es la razón principal por la que hoy usamos
   * const y let, y ya casi nunca var.
   */

  titulo('3. Ámbito de bloque: let/const respetan las llaves, var no');

  function compararVarConLet() {
    if (true) {
      var conVar = 'declarada con var';
      let conLet = 'declarada con let';
      imprimir('   Dentro del if -> ' + conVar + ' / ' + conLet);
    }

    // Fuera del if, conVar sigue viva (se "escapó" del bloque).
    imprimir('   Fuera del if, conVar ->', conVar);

    // conLet, en cambio, ya no existe.
    try {
      imprimir(conLet);
    } catch (error) {
      imprimir('   Fuera del if, conLet ->', error.name + ' (ya no existe)');
    }
  }

  compararVarConLet();

  // --- El bucle que "sale mal" con var -------------------------------

  /*
   * Este es EL ejemplo clásico de entrevista de trabajo.
   * Guardamos funciones dentro de un array dentro de un bucle y luego
   * las ejecutamos. Con var, todas comparten la MISMA variable `i`,
   * que al terminar el bucle vale 3. Con let, cada vuelta del bucle
   * crea su propia `i` y cada función recuerda la suya.
   */

  titulo('3b. El bucle clásico: var comparte, let no');

  const funcionesConVar = [];
  for (var i = 0; i < 3; i++) {
    funcionesConVar.push(function () {
      return 'var  -> i vale ' + i;
    });
  }
  imprimir(funcionesConVar[0]()); // i vale 3  ⚠️ ¡no 0!
  imprimir(funcionesConVar[1]()); // i vale 3
  imprimir(funcionesConVar[2]()); // i vale 3

  const funcionesConLet = [];
  for (let j = 0; j < 3; j++) {
    funcionesConLet.push(function () {
      return 'let  -> j vale ' + j;
    });
  }
  imprimir(funcionesConLet[0]()); // j vale 0  ✅ correcto
  imprimir(funcionesConLet[1]()); // j vale 1
  imprimir(funcionesConLet[2]()); // j vale 2

  // ✅ BUENA PRÁCTICA: usa `const` por defecto; `let` solo cuando el
  // valor deba cambiar; `var` prácticamente nunca en código nuevo.

  // ============================================================
  // 4. LA CADENA DE ÁMBITOS (scope chain)
  // ============================================================

  /*
   * Cuando JavaScript encuentra un nombre de variable, lo busca:
   *   1. en el ámbito actual;
   *   2. si no está, en el ámbito de fuera;
   *   3. y así hacia arriba hasta el ámbito global;
   *   4. si tampoco está allí -> ReferenceError.
   *
   * Analogía: buscas las tijeras en tu mesa; si no están, en el aula;
   * si tampoco, en conserjería. Nunca al revés: desde conserjería no
   * se ve lo que hay en tu mesa.
   *
   * La búsqueda va SIEMPRE de dentro hacia fuera. Nunca de fuera hacia
   * dentro. Por eso una función puede leer las variables de quien la
   * contiene, pero no al revés.
   */

  titulo('4. Cadena de ámbitos: de dentro hacia fuera');

  const nivelEscuela = 'ESCUELA (nivel 1)';

  function aula() {
    const nivelAula = 'AULA (nivel 2)';

    function pupitre() {
      const nivelPupitre = 'PUPITRE (nivel 3)';

      // Desde el nivel más interno se ve TODO lo de arriba.
      imprimir('   Desde el pupitre veo:');
      imprimir('     - ' + nivelPupitre);   // propio
      imprimir('     - ' + nivelAula);      // del ámbito de fuera
      imprimir('     - ' + nivelEscuela);   // del ámbito más externo
    }

    pupitre();

    // Pero desde el aula NO se ve lo que hay dentro del pupitre.
    try {
      imprimir(nivelPupitre);
    } catch (error) {
      imprimir('   Desde el aula, nivelPupitre ->', error.name + ' (invisible)');
    }
  }

  aula();

  // ============================================================
  // 5. SHADOWING (una variable que tapa a otra)
  // ============================================================

  /*
   * Si declaras una variable con el mismo nombre que otra de un
   * ámbito superior, la de dentro TAPA a la de fuera mientras dure
   * ese ámbito. Se llama shadowing ("hacer sombra").
   *
   * No es un error del lenguaje: es la cadena de ámbitos funcionando.
   * Encuentra el nombre en el primer nivel y deja de buscar.
   */

  titulo('5. Shadowing: la de dentro tapa a la de fuera');

  const mensaje = 'Soy el mensaje EXTERIOR';

  function conSombra() {
    const mensaje = 'Soy el mensaje INTERIOR';   // tapa al de fuera
    return mensaje;
  }

  function sinSombra() {
    return mensaje;   // no declara nada: sube por la cadena y usa el de fuera
  }

  imprimir('conSombra() ->', conSombra());   // Soy el mensaje INTERIOR
  imprimir('sinSombra() ->', sinSombra());   // Soy el mensaje EXTERIOR
  imprimir('El exterior sigue intacto ->', mensaje);

  // Shadowing por bloques, nivel a nivel.
  function tresNiveles() {
    let nivel = 'función';
    if (true) {
      let nivel = 'bloque if';       // otra variable distinta
      if (true) {
        let nivel = 'bloque anidado';
        imprimir('   Nivel más interno ->', nivel);
      }
      imprimir('   Nivel intermedio ->', nivel);
    }
    imprimir('   Nivel de función ->', nivel);
  }

  tresNiveles();

  // ⚠️ ERROR COMÚN: hacer shadowing sin querer y luego no entender
  // por qué "la variable no se actualiza". Si tu intención era MODIFICAR
  // la de fuera, no vuelvas a declararla: asígnale un valor sin let/const.

  // ============================================================
  // 6. CLOSURES (clausuras)
  // ============================================================

  /*
   * DEFINICIÓN: un closure es una función que RECUERDA el ámbito en
   * el que fue creada, aunque ese ámbito ya haya terminado.
   *
   * Normalmente, cuando una función acaba, sus variables se borran.
   * Pero si al terminar devuelve otra función que usa esas variables,
   * JavaScript las mantiene vivas: la función interior se lleva
   * consigo su "mochila" de variables.
   *
   * Analogía: crearContador() es una taquilla. Te da una llave (la
   * función devuelta). La taquilla sigue existiendo aunque el
   * empleado que te la asignó se haya ido a casa, y solo se abre con
   * esa llave: nadie más puede mirar dentro.
   */

  titulo('6. Closure clásico: el contador');

  /**
   * crearContador(): devuelve una función que cuenta hacia arriba.
   * @param {number} [inicio=0]
   * @returns {Function}
   */
  function crearContador(inicio = 0) {
    let cuenta = inicio;    // <- variable PRIVADA, atrapada en el closure

    // Esta función interior es el closure: usa `cuenta`, que pertenece
    // al ámbito de crearContador().
    return function incrementar() {
      cuenta += 1;
      return cuenta;
    };
  }

  const contarVisitas = crearContador();

  imprimir('contarVisitas() ->', contarVisitas());  // 1
  imprimir('contarVisitas() ->', contarVisitas());  // 2
  imprimir('contarVisitas() ->', contarVisitas());  // 3
  // La variable `cuenta` NO se reinicia entre llamadas: sigue viva.

  // Cada llamada a crearContador() fabrica una mochila NUEVA e independiente.
  const contarErrores = crearContador(100);
  imprimir('contarErrores() ->', contarErrores());  // 101
  imprimir('contarErrores() ->', contarErrores());  // 102
  imprimir('contarVisitas() sigue por su cuenta ->', contarVisitas()); // 4

  // La variable interna es INACCESIBLE desde fuera: no hay forma de
  // llegar a ella salvo a través de la función devuelta.
  imprimir('¿Puedo leer contarVisitas.cuenta? ->', contarVisitas.cuenta); // undefined

  // ============================================================
  // 6b. FÁBRICA DE FUNCIONES
  // ============================================================

  /*
   * Una "fábrica" es una función que CONSTRUYE funciones a medida.
   * Cada función fabricada recuerda los datos con los que se creó.
   */

  titulo('6b. Fábrica de funciones');

  /**
   * crearMultiplicador(): devuelve una función que multiplica por
   * el factor indicado. El factor queda guardado en el closure.
   */
  function crearMultiplicador(factor) {
    return function (numero) {
      return numero * factor;    // `factor` viene de la mochila
    };
  }

  const doble = crearMultiplicador(2);
  const triple = crearMultiplicador(3);
  const aplicarIva = crearMultiplicador(1.21);

  imprimir('doble(8) ->', doble(8));            // 16
  imprimir('triple(8) ->', triple(8));          // 24
  imprimir('aplicarIva(100) ->', aplicarIva(100).toFixed(2)); // 121.00

  // Fábrica escrita con flechas: la misma idea en una línea.
  const crearSaludo = (saludo) => (nombre) => saludo + ', ' + nombre + '!';
  const saludarFormal = crearSaludo('Buenos días');
  const saludarInformal = crearSaludo('Qué tal');

  imprimir(saludarFormal('Marta'));    // Buenos días, Marta!
  imprimir(saludarInformal('Diego'));  // Qué tal, Diego!

  // ============================================================
  // 6c. PARA QUÉ SIRVEN LOS CLOSURES EN LA VIDA REAL
  // ============================================================

  titulo('6c. Closures útiles: privacidad, memoria y control');

  /*
   * USO 1 · DATOS PRIVADOS
   * Una cuenta bancaria cuyo saldo no se puede modificar a mano.
   * Solo se toca a través de las funciones que la propia función
   * devuelve, que pueden validar cada operación.
   */
  function crearCuenta(titular, saldoInicial = 0) {
    let saldo = saldoInicial;   // privado de verdad

    return {
      titular: titular,
      ingresar: function (cantidad) {
        if (cantidad <= 0) return 'La cantidad debe ser positiva';
        saldo += cantidad;
        return 'Ingresados ' + cantidad + '. Saldo: ' + saldo;
      },
      retirar: function (cantidad) {
        if (cantidad > saldo) return 'Saldo insuficiente';
        saldo -= cantidad;
        return 'Retirados ' + cantidad + '. Saldo: ' + saldo;
      },
      consultarSaldo: function () {
        return saldo;
      }
    };
  }

  const cuentaDeAna = crearCuenta('Ana', 500);
  imprimir(cuentaDeAna.ingresar(200));    // Saldo: 700
  imprimir(cuentaDeAna.retirar(1000));    // Saldo insuficiente
  imprimir(cuentaDeAna.retirar(150));     // Saldo: 550
  imprimir('Saldo consultado ->', cuentaDeAna.consultarSaldo()); // 550
  imprimir('Intento de trampa: cuentaDeAna.saldo ->', cuentaDeAna.saldo); // undefined

  // Aunque asignemos algo, no afecta al saldo real del closure.
  cuentaDeAna.saldo = 999999;
  imprimir('Tras cuentaDeAna.saldo = 999999, el saldo real es ->', cuentaDeAna.consultarSaldo()); // 550

  /*
   * USO 2 · MEMOIZACIÓN
   * Guardar en una "caché" resultados ya calculados para no repetir
   * trabajo. La caché vive en el closure, invisible desde fuera.
   */
  function crearCalculadoraLenta() {
    const cache = {};   // memoria privada
    let vecesCalculado = 0;

    return {
      cuadrado: function (numero) {
        if (numero in cache) {
          return cache[numero] + ' (recuperado de la caché)';
        }
        vecesCalculado += 1;
        cache[numero] = numero * numero;
        return cache[numero] + ' (calculado por primera vez)';
      },
      estadisticas: function () {
        return 'Cálculos reales realizados: ' + vecesCalculado;
      }
    };
  }

  const calculadora = crearCalculadoraLenta();
  imprimir('cuadrado(12) ->', calculadora.cuadrado(12));
  imprimir('cuadrado(12) ->', calculadora.cuadrado(12));  // ya no recalcula
  imprimir('cuadrado(5)  ->', calculadora.cuadrado(5));
  imprimir(calculadora.estadisticas());                   // 2 cálculos reales

  /*
   * USO 3 · EJECUTAR UNA SOLA VEZ
   * Patrón "once": útil para no enviar dos veces un formulario
   * aunque el usuario pulse el botón cinco veces seguidas.
   */
  function unaSolaVez(funcion) {
    let yaSeEjecuto = false;
    let resultadoGuardado;

    return function (...args) {
      if (yaSeEjecuto) {
        return 'Ignorado: ya se ejecutó. Resultado anterior -> ' + resultadoGuardado;
      }
      yaSeEjecuto = true;
      resultadoGuardado = funcion(...args);
      return resultadoGuardado;
    };
  }

  const enviarFormulario = unaSolaVez(function (destino) {
    return 'Formulario enviado a ' + destino;
  });

  imprimir(enviarFormulario('secretaria@escuela.edu'));
  imprimir(enviarFormulario('secretaria@escuela.edu'));
  imprimir(enviarFormulario('otro@escuela.edu'));

  // ============================================================
  // 7. IIFE Y PATRÓN MÓDULO
  // ============================================================

  /*
   * IIFE = Immediately Invoked Function Expression.
   * Una función que se define y se ejecuta al momento:
   *
   *     (function () { ... })();
   *
   * Los paréntesis exteriores convierten la declaración en una
   * EXPRESIÓN (un valor), y el `()` final la ejecuta.
   *
   * ¿Para qué? Para crear un ámbito privado. Todo lo de dentro queda
   * aislado del resto de la página. Es justo lo que hace este archivo.
   *
   * El PATRÓN MÓDULO combina IIFE + closure: la IIFE devuelve un
   * objeto con las funciones públicas, y todo lo demás queda oculto.
   * Antes de que existieran los módulos ES (import/export), así se
   * organizaba TODO el JavaScript profesional.
   */

  titulo('7. IIFE y patrón módulo');

  // Una IIFE que devuelve un valor directamente.
  const resultadoIife = (function () {
    const secreto = 42;
    return secreto * 2;
  })();

  imprimir('Valor devuelto por la IIFE ->', resultadoIife); // 84

  // --- Patrón módulo completo: una pequeña agenda de estudiantes ---
  const ModuloEstudiantes = (function () {
    // ----- Parte PRIVADA: nadie de fuera puede tocar esto -----
    const listaInterna = [];
    let siguienteId = 1;

    function validarNombre(nombre) {
      return typeof nombre === 'string' && nombre.trim().length >= 2;
    }

    function formatear(estudiante) {
      return '#' + estudiante.id + ' ' + estudiante.nombre + ' (' + estudiante.nota + ')';
    }

    // ----- Parte PÚBLICA: lo único que se expone al exterior -----
    return {
      agregar: function (nombre, nota = 0) {
        if (!validarNombre(nombre)) return 'Nombre no válido';
        const estudiante = { id: siguienteId, nombre: nombre.trim(), nota: nota };
        listaInterna.push(estudiante);
        siguienteId += 1;
        return 'Agregado ' + formatear(estudiante);
      },
      listar: function () {
        if (listaInterna.length === 0) return 'La lista está vacía';
        return listaInterna.map(formatear).join(' | ');
      },
      total: function () {
        return listaInterna.length;
      },
      promedio: function () {
        if (listaInterna.length === 0) return 0;
        const suma = listaInterna.reduce((acumulado, e) => acumulado + e.nota, 0);
        return Number((suma / listaInterna.length).toFixed(2));
      }
    };
  })();

  imprimir(ModuloEstudiantes.agregar('Marta', 9));
  imprimir(ModuloEstudiantes.agregar('Diego', 7));
  imprimir(ModuloEstudiantes.agregar('A'));           // nombre no válido
  imprimir('Listado ->', ModuloEstudiantes.listar());
  imprimir('Total ->', ModuloEstudiantes.total(), '| Promedio ->', ModuloEstudiantes.promedio());

  // Lo privado sigue siendo inaccesible desde fuera.
  imprimir('ModuloEstudiantes.listaInterna ->', ModuloEstudiantes.listaInterna);   // undefined
  imprimir('ModuloEstudiantes.validarNombre ->', ModuloEstudiantes.validarNombre); // undefined
  imprimir('Métodos públicos ->', Object.keys(ModuloEstudiantes).join(', '));

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // 1) (Fácil) Declara una variable `etiqueta` dentro de una función y
  //    otra con el mismo nombre dentro de un if anidado. Imprime las
  //    dos y explica con tus palabras cuál tapa a cuál.
  //    (No uses el nombre `titulo`: en este archivo ya está ocupado
  //     por la función que pinta los separadores de la consola.)
  //
  // 2) (Fácil) Escribe crearContadorRegresivo(inicio) que devuelva una
  //    función que RESTA 1 en cada llamada y que, al llegar a 0,
  //    devuelva siempre el texto "Tiempo agotado".
  //
  // 3) (Media) Crea crearAcumulador() que devuelva un objeto con los
  //    métodos sumar(n), restar(n) y total(). El total interno no debe
  //    poder modificarse desde fuera.
  //
  // 4) (Media) Reescribe el bucle de la sección 3b usando var, pero
  //    consiguiendo el resultado correcto (0, 1, 2) con la ayuda de una
  //    IIFE dentro del bucle. Es como se hacía antes de que existiera let.
  //
  // 5) (Difícil) Escribe limitarLlamadas(funcion, maximo) que devuelva
  //    una función que solo deje ejecutar la original `maximo` veces.
  //    A partir de ahí debe devolver "Límite alcanzado".
  //    Pista: es una variación del patrón unaSolaVez().
  // ============================================================
})();
