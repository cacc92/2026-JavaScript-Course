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

// La IIFE ya viene escrita. Fíjate en la ironía: el propio archivo que
// explica los ámbitos usa una IIFE para crear el suyo. En la sección 7
// se explica exactamente qué es y por qué está aquí.
(function () {
  'use strict';

  // Andamiaje ya escrito: consola visual del <pre id="salida-03">.
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

  // ⚠️ Una sola global, con nombre inconfundible. Ensuciar el ámbito
  // global es una de las peores costumbres que se pueden coger.

  // TODO (en clase):
  //   1. titulo('1. Ámbito global').
  //   2. Cuelga UNA sola global del objeto window:
  //      window.NOMBRE_DEL_CURSO = 'Full Stack 2 - Desarrollo Front End';
  //   3. Escribe function leerVariableGlobal() que devuelva
  //      'Desde dentro de la función veo: ' + window.NOMBRE_DEL_CURSO
  //      (desde dentro de una función se LEE lo global sin problema).
  //   4. Imprime esa llamada y también typeof window.NOMBRE_DEL_CURSO.
  //   Resultado esperado en pantalla:
  //      Desde dentro de la función veo: Full Stack 2 - Desarrollo Front End
  //      typeof window.NOMBRE_DEL_CURSO -> string
  //   (aprox. 7 líneas)

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

  // TODO (en clase):
  //   1. titulo('2. Ámbito de función').
  //   2. Escribe function calcularMatricula(precioBase) que declare dentro
  //      const descuento = 0.15, calcule precioBase * (1 - descuento) y lo devuelva.
  //   3. Imprime calcularMatricula(1000).toFixed(2).
  //   Resultado esperado en pantalla: Matrícula final -> 850.00
  //   (aprox. 6 líneas)

  // ⚠️ ERROR COMÚN: intentar leer una variable interna desde fuera.

  // TODO (en clase):
  //   1. Envuelve en try { imprimir(descuento); } catch (error) { ... } el
  //      intento de leer `descuento` desde FUERA de la función.
  //   2. En el catch imprime
  //      'Error al leer `descuento` desde fuera ->' + error.name + ': ' + error.message
  //   Resultado esperado en pantalla:
  //      Error al leer `descuento` desde fuera -> ReferenceError: descuento is not defined
  //   (aprox. 6 líneas)

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

  // TODO (en clase):
  //   1. titulo('3. Ámbito de bloque: let/const respetan las llaves, var no').
  //   2. Escribe function compararVarConLet(). Dentro, un if (true) { } que
  //      declare var conVar = 'declarada con var' y let conLet = 'declarada con let',
  //      e imprima las dos con la etiqueta '   Dentro del if -> '.
  //   3. FUERA del if, imprime conVar: sigue viva, se escapó del bloque.
  //   4. FUERA del if, intenta imprimir conLet dentro de try/catch e imprime
  //      error.name + ' (ya no existe)'.
  //   5. Llama a compararVarConLet().
  //   Resultado esperado en pantalla:
  //      Dentro del if -> declarada con var / declarada con let
  //      Fuera del if, conVar -> declarada con var
  //      Fuera del if, conLet -> ReferenceError (ya no existe)
  //   (aprox. 15 líneas)

  // --- El bucle que "sale mal" con var -------------------------------

  /*
   * Este es EL ejemplo clásico de entrevista de trabajo.
   * Guardamos funciones dentro de un array dentro de un bucle y luego
   * las ejecutamos. Con var, todas comparten la MISMA variable `i`,
   * que al terminar el bucle vale 3. Con let, cada vuelta del bucle
   * crea su propia `i` y cada función recuerda la suya.
   *
   * TRUCO DE CLASE: antes de ejecutarlo, pregunta a la clase qué creen
   * que va a imprimir la versión con var. Casi todos dirán 0, 1, 2.
   */

  // TODO (en clase):
  //   1. titulo('3b. El bucle clásico: var comparte, let no').
  //   2. Versión con VAR: const funcionesConVar = []; y un
  //      for (var i = 0; i < 3; i++) que haga push de una función que
  //      devuelva 'var  -> i vale ' + i.
  //      Imprime funcionesConVar[0](), [1]() y [2]().
  //   3. Versión con LET: repite lo mismo en funcionesConLet con
  //      for (let j = 0; j < 3; j++) y el texto 'let  -> j vale ' + j.
  //   Resultado esperado en pantalla:
  //      var  -> i vale 3     (tres veces: 3, 3, 3  ⚠️ no 0, 1, 2)
  //      let  -> j vale 0
  //      let  -> j vale 1
  //      let  -> j vale 2
  //   (aprox. 18 líneas)

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

  // TODO (en clase):
  //   1. titulo('4. Cadena de ámbitos: de dentro hacia fuera').
  //   2. Monta los tres niveles de la analogía, cada uno dentro del anterior:
  //        const nivelEscuela = 'ESCUELA (nivel 1)';
  //        function aula() { const nivelAula = 'AULA (nivel 2)';
  //          function pupitre() { const nivelPupitre = 'PUPITRE (nivel 3)'; ... }
  //        }
  //   3. Dentro de pupitre() imprime '   Desde el pupitre veo:' y luego las
  //      tres variables, una por línea, con el prefijo '     - '.
  //   4. Llama a pupitre() desde aula(). Después, YA EN aula(), intenta
  //      imprimir nivelPupitre dentro de try/catch: es invisible.
  //      En el catch imprime error.name + ' (invisible)'.
  //   5. Llama a aula().
  //   Resultado esperado en pantalla:
  //      Desde el pupitre veo:
  //        - PUPITRE (nivel 3)
  //        - AULA (nivel 2)
  //        - ESCUELA (nivel 1)
  //      Desde el aula, nivelPupitre -> ReferenceError (invisible)
  //   (aprox. 20 líneas)

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

  // TODO (en clase):
  //   1. titulo('5. Shadowing: la de dentro tapa a la de fuera').
  //   2. Declara const mensaje = 'Soy el mensaje EXTERIOR';
  //   3. Escribe function conSombra() que declare dentro
  //      const mensaje = 'Soy el mensaje INTERIOR' y lo devuelva.
  //   4. Escribe function sinSombra() que devuelva `mensaje` SIN declarar nada:
  //      sube por la cadena y usa el de fuera.
  //   5. Imprime las dos llamadas y, por último, `mensaje` para ver que el
  //      exterior sigue intacto.
  //   Resultado esperado en pantalla:
  //      conSombra() -> Soy el mensaje INTERIOR
  //      sinSombra() -> Soy el mensaje EXTERIOR
  //      El exterior sigue intacto -> Soy el mensaje EXTERIOR
  //   (aprox. 10 líneas)

  // TODO (en clase):
  //   1. Shadowing por bloques, nivel a nivel. Escribe function tresNiveles():
  //        let nivel = 'función';
  //        if (true) { let nivel = 'bloque if';
  //          if (true) { let nivel = 'bloque anidado'; imprimir(...); }
  //          imprimir(...); }
  //        imprimir(...);
  //      con las etiquetas '   Nivel más interno ->', '   Nivel intermedio ->'
  //      y '   Nivel de función ->'.
  //   2. Llama a tresNiveles().
  //   Resultado esperado en pantalla:
  //      Nivel más interno -> bloque anidado
  //      Nivel intermedio -> bloque if
  //      Nivel de función -> función
  //   (aprox. 13 líneas)

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
   *
   * ESTE ES EL PUNTO CLAVE DEL PROYECTO. Sin prisa.
   */

  // TODO (en clase):
  //   1. titulo('6. Closure clásico: el contador').
  //   2. Escribe function crearContador(inicio = 0):
  //        - dentro, let cuenta = inicio;   <- la variable PRIVADA
  //        - devuelve function incrementar() { cuenta += 1; return cuenta; }
  //   3. Crea const contarVisitas = crearContador(); y llámala TRES veces,
  //      imprimiendo cada resultado. La cuenta NO se reinicia entre llamadas.
  //   4. Crea const contarErrores = crearContador(100); llámala dos veces
  //      y después vuelve a llamar a contarVisitas(): son mochilas distintas.
  //   5. Cierra demostrando que la variable es inalcanzable:
  //      imprimir('¿Puedo leer contarVisitas.cuenta? ->', contarVisitas.cuenta);
  //   Resultado esperado en pantalla:
  //      contarVisitas() -> 1
  //      contarVisitas() -> 2
  //      contarVisitas() -> 3
  //      contarErrores() -> 101
  //      contarErrores() -> 102
  //      contarVisitas() sigue por su cuenta -> 4
  //      ¿Puedo leer contarVisitas.cuenta? -> undefined
  //   (aprox. 16 líneas)

  // ============================================================
  // 6b. FÁBRICA DE FUNCIONES
  // ============================================================

  /*
   * Una "fábrica" es una función que CONSTRUYE funciones a medida.
   * Cada función fabricada recuerda los datos con los que se creó.
   */

  // TODO (en clase):
  //   1. titulo('6b. Fábrica de funciones').
  //   2. Escribe function crearMultiplicador(factor) que DEVUELVA
  //      function (numero) { return numero * factor; }
  //      (`factor` viene de la mochila del closure).
  //   3. Fabrica tres: doble = crearMultiplicador(2), triple = (3)
  //      y aplicarIva = crearMultiplicador(1.21).
  //   4. Imprime doble(8), triple(8) y aplicarIva(100).toFixed(2).
  //   Resultado esperado en pantalla:
  //      doble(8) -> 16
  //      triple(8) -> 24
  //      aplicarIva(100) -> 121.00
  //   (aprox. 10 líneas)

  // TODO (en clase):
  //   1. La misma idea escrita con flechas, en una sola línea:
  //      const crearSaludo = (saludo) => (nombre) => saludo + ', ' + nombre + '!';
  //   2. Fabrica saludarFormal ('Buenos días') y saludarInformal ('Qué tal'),
  //      y llámalas con 'Marta' y 'Diego'.
  //   Resultado esperado en pantalla:
  //      Buenos días, Marta!
  //      Qué tal, Diego!
  //   (aprox. 5 líneas)

  // ============================================================
  // 6c. PARA QUÉ SIRVEN LOS CLOSURES EN LA VIDA REAL
  // ============================================================

  /*
   * USO 1 · DATOS PRIVADOS
   * Una cuenta bancaria cuyo saldo no se puede modificar a mano.
   * Solo se toca a través de las funciones que la propia función
   * devuelve, que pueden validar cada operación.
   */

  // TODO (en clase):
  //   1. titulo('6c. Closures útiles: privacidad, memoria y control').
  //   2. Escribe function crearCuenta(titular, saldoInicial = 0) con
  //      let saldo = saldoInicial (privado de verdad) y que devuelva un objeto con:
  //        - titular
  //        - ingresar(cantidad): si cantidad <= 0 -> 'La cantidad debe ser positiva';
  //          si no, suma y devuelve 'Ingresados X. Saldo: Y'
  //        - retirar(cantidad): si cantidad > saldo -> 'Saldo insuficiente';
  //          si no, resta y devuelve 'Retirados X. Saldo: Y'
  //        - consultarSaldo(): devuelve saldo
  //   3. Crea const cuentaDeAna = crearCuenta('Ana', 500); e imprime, en orden:
  //      ingresar(200), retirar(1000), retirar(150), consultarSaldo()
  //      y el intento de trampa cuentaDeAna.saldo.
  //   4. Asigna cuentaDeAna.saldo = 999999; y vuelve a imprimir consultarSaldo():
  //      no ha cambiado nada.
  //   Resultado esperado en pantalla:
  //      Ingresados 200. Saldo: 700
  //      Saldo insuficiente
  //      Retirados 150. Saldo: 550
  //      Saldo consultado -> 550
  //      Intento de trampa: cuentaDeAna.saldo -> undefined
  //      Tras cuentaDeAna.saldo = 999999, el saldo real es -> 550
  //   (aprox. 25 líneas)

  /*
   * USO 2 · MEMOIZACIÓN
   * Guardar en una "caché" resultados ya calculados para no repetir
   * trabajo. La caché vive en el closure, invisible desde fuera.
   */

  // TODO (en clase):
  //   1. Escribe function crearCalculadoraLenta() con dos variables privadas:
  //      const cache = {}; y let vecesCalculado = 0;
  //   2. Devuelve un objeto con:
  //        - cuadrado(numero): si (numero in cache) devuelve
  //          cache[numero] + ' (recuperado de la caché)'; si no, incrementa
  //          vecesCalculado, guarda cache[numero] = numero * numero y devuelve
  //          cache[numero] + ' (calculado por primera vez)'
  //        - estadisticas(): 'Cálculos reales realizados: ' + vecesCalculado
  //   3. Crea const calculadora = crearCalculadoraLenta(); y llama, en orden:
  //      cuadrado(12), cuadrado(12) otra vez, cuadrado(5) y estadisticas().
  //   Resultado esperado en pantalla:
  //      cuadrado(12) -> 144 (calculado por primera vez)
  //      cuadrado(12) -> 144 (recuperado de la caché)
  //      cuadrado(5)  -> 25 (calculado por primera vez)
  //      Cálculos reales realizados: 2
  //   (aprox. 20 líneas)

  /*
   * USO 3 · EJECUTAR UNA SOLA VEZ
   * Patrón "once": útil para no enviar dos veces un formulario
   * aunque el usuario pulse el botón cinco veces seguidas.
   */

  // TODO (en clase):
  //   1. Escribe function unaSolaVez(funcion) con dos privadas:
  //      let yaSeEjecuto = false; y let resultadoGuardado;
  //   2. Devuelve function (...args) que:
  //        - si yaSeEjecuto, devuelva
  //          'Ignorado: ya se ejecutó. Resultado anterior -> ' + resultadoGuardado
  //        - si no, ponga yaSeEjecuto = true, guarde resultadoGuardado = funcion(...args)
  //          y lo devuelva.
  //   3. Crea const enviarFormulario = unaSolaVez(function (destino) {
  //        return 'Formulario enviado a ' + destino; });
  //   4. Llámala TRES veces: dos con 'secretaria@escuela.edu' y una con
  //      'otro@escuela.edu'. Solo la primera hace algo.
  //   Resultado esperado en pantalla:
  //      Formulario enviado a secretaria@escuela.edu
  //      Ignorado: ya se ejecutó. Resultado anterior -> Formulario enviado a secretaria@escuela.edu
  //      Ignorado: ya se ejecutó. Resultado anterior -> Formulario enviado a secretaria@escuela.edu
  //   (aprox. 18 líneas)

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

  // TODO (en clase):
  //   1. titulo('7. IIFE y patrón módulo').
  //   2. Escribe una IIFE que devuelva un valor directamente:
  //      const resultadoIife = (function () { const secreto = 42; return secreto * 2; })();
  //   3. Imprímelo con la etiqueta 'Valor devuelto por la IIFE ->'.
  //   Resultado esperado en pantalla: Valor devuelto por la IIFE -> 84
  //   (aprox. 5 líneas)

  // --- Patrón módulo completo: una pequeña agenda de estudiantes ---

  // TODO (en clase):
  //   1. Escribe const ModuloEstudiantes = (function () { ... })();
  //   2. Parte PRIVADA (nadie de fuera la toca):
  //        const listaInterna = []; let siguienteId = 1;
  //        function validarNombre(nombre) -> true si es string y trim().length >= 2
  //        function formatear(estudiante) -> '#id nombre (nota)'
  //   3. Parte PÚBLICA (lo que devuelve el return):
  //        agregar(nombre, nota = 0): valida, crea { id, nombre: nombre.trim(), nota },
  //          hace push, incrementa siguienteId y devuelve 'Agregado ' + formatear(...)
  //          (si el nombre no vale -> 'Nombre no válido')
  //        listar(): 'La lista está vacía' o listaInterna.map(formatear).join(' | ')
  //        total(): listaInterna.length
  //        promedio(): 0 si está vacía, o la media con reduce redondeada
  //          a 2 decimales con Number((suma / n).toFixed(2))
  //   4. Llama a agregar('Marta', 9), agregar('Diego', 7) y agregar('A'),
  //      e imprime listar(), total() y promedio().
  //   5. Cierra demostrando que lo privado NO se ve:
  //      imprime ModuloEstudiantes.listaInterna, ModuloEstudiantes.validarNombre
  //      y Object.keys(ModuloEstudiantes).join(', ').
  //   Resultado esperado en pantalla:
  //      Agregado #1 Marta (9)
  //      Agregado #2 Diego (7)
  //      Nombre no válido
  //      Listado -> #1 Marta (9) | #2 Diego (7)
  //      Total -> 2 | Promedio -> 8
  //      ModuloEstudiantes.listaInterna -> undefined
  //      ModuloEstudiantes.validarNombre -> undefined
  //      Métodos públicos -> agregar, listar, total, promedio
  //   (aprox. 40 líneas)

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
