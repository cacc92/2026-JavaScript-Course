/**
 * ============================================================================
 * ARCHIVO: js/01-objetos-y-constructores.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Qué es la POO y cuáles son sus 4 pilares, en lenguaje sencillo.
 *   2. Los objetos literales: el punto de partida... y su gran limitación.
 *   3. Las funciones fábrica (factory functions) como primer arreglo.
 *   4. Las funciones constructoras y el operador `new`.
 *   5. Qué hace `new` PASO A PASO (lo simulamos a mano para verlo).
 *   6. Encapsulamiento "clásico" con closures (variables privadas).
 *
 * QUÉ SE APRENDE
 *   A pensar en "moldes" (plantillas) en lugar de copiar y pegar objetos,
 *   y a entender qué ocurre realmente cuando escribimos `new Algo()`.
 *
 * NOTA IMPORTANTE SOBRE LA IIFE
 *   Todo el archivo está envuelto en una IIFE:  (function () { ... })();
 *   IIFE = Immediately Invoked Function Expression = función que se define
 *   y se ejecuta al instante. ¿Por qué la usamos?
 *   Porque el index.html carga VARIOS archivos .js y todos comparten el
 *   mismo ámbito global. Si dos archivos declararan `const imprimir = ...`
 *   el navegador lanzaría el error:
 *       "SyntaxError: Identifier 'imprimir' has already been declared".
 *   Al envolver cada archivo en su propia función, sus variables quedan
 *   ENCERRADAS dentro y no chocan con las de los demás archivos.
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y las utilidades (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/01-objetos-y-constructores.js
 * ============================================================================
 */

(function () {
  // 'use strict' activa el "modo estricto": JavaScript se vuelve más severo y
  // avisa de errores que en modo normal pasaría por alto en silencio.
  // Lo necesitamos en la sección 6 para demostrar qué ocurre si olvidamos `new`.
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA "CONSOLA VISUAL"
  // ==========================================================================
  // Los estudiantes no siempre tienen abierto DevTools (F12). Por eso todo lo
  // que imprimimos se escribe DOS veces: en la consola real del navegador y
  // en un bloque <pre> visible dentro de la página.
  //
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto.

  // Identificador del <pre> de ESTA sección dentro del index.html.
  var ID_SALIDA = 'salida-01';

  /**
   * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la página, para que se vea en clase sin
   * abrir las herramientas de desarrollo.
   * Los "..." de (...mensajes) son el parámetro REST: agrupan todos los
   * argumentos recibidos dentro de un array llamado `mensajes`.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes); // Salida clásica de DevTools (el spread "reparte")

    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return; // Si la página no tiene consola visual, no hace nada

    const texto = mensajes
      .map((m) => {
        // Si el valor es un objeto lo convertimos a texto legible con sangría.
        if (typeof m === 'object' && m !== null) {
          try {
            return JSON.stringify(m, null, 2);
          } catch (error) {
            // JSON.stringify falla con referencias circulares (a -> b -> a).
            return String(m);
          }
        }
        return String(m); // Números, textos, booleanos... se convierten a texto
      })
      .join(' ');

    salida.textContent += texto + '\n';
  }

  /**
   * titulo(): imprime un separador visual muy marcado antes de cada apartado.
   * Sirve para que, proyectando en clase, se distinga dónde empieza cada tema.
   */
  function titulo(texto) {
    imprimir('\n============================================');
    imprimir('  ' + texto);
    imprimir('============================================');
  }

  // Botón "Limpiar" de esta consola: vacía el <pre> sin recargar la página.
  const botonLimpiar = document.getElementById('limpiar-01');
  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. ¿QUÉ ES LA PROGRAMACIÓN ORIENTADA A OBJETOS?
  // ==========================================================================
  // La POO es una forma de ORGANIZAR el código. En lugar de tener datos por un
  // lado (variables sueltas) y funciones por otro, los juntamos en "objetos"
  // que representan cosas del mundo real: un estudiante, un producto, un libro.
  //
  // Un objeto tiene:
  //   - PROPIEDADES: lo que el objeto SABE de sí mismo (nombre, edad, notas).
  //   - MÉTODOS:     lo que el objeto SABE HACER (calcular su promedio).
  //
  // Analogía: un microondas. Por fuera tiene botones (métodos públicos) y una
  // pantalla (propiedades). Por dentro hay electrónica que nadie toca. Sabemos
  // usarlo sin saber cómo funciona: eso es exactamente la idea de la POO.

  // DATOS DE PARTIDA (ya escritos: se explican en voz alta, no se teclean).
  // Los 4 pilares, explicados en una frase cada uno. Los guardamos en un array
  // de objetos porque... bueno, porque un objeto es justo lo que estamos
  // estudiando: datos agrupados con nombre.
  const pilares = [
    {
      nombre: 'ABSTRACCIÓN',
      idea: 'Mostrar solo lo necesario y esconder los detalles complicados.',
      analogia: 'Conduces un coche con volante y pedales; no tocas el motor.',
    },
    {
      nombre: 'ENCAPSULAMIENTO',
      idea: 'Proteger los datos internos: solo se cambian por vías controladas.',
      analogia: 'El saldo del banco no se edita a mano: se ingresa o se retira.',
    },
    {
      nombre: 'HERENCIA',
      idea: 'Una clase hija reutiliza y amplía lo que ya hace la clase padre.',
      analogia: 'Un perro ES un animal: hereda respirar y añade ladrar.',
    },
    {
      nombre: 'POLIMORFISMO',
      idea: 'La misma orden produce comportamientos distintos según el objeto.',
      analogia: 'Dices "haz ruido": el perro ladra y el gato maúlla.',
    },
  ];

  // TODO (en clase):
  //   1. Abre el apartado con titulo('1. LOS 4 PILARES DE LA POO').
  //   2. Recorre el array `pilares` con forEach recibiendo dos parámetros:
  //      pilares.forEach(function (pilar, indice) { ... }).
  //   3. Dentro del bucle imprime tres líneas por cada pilar:
  //        imprimir(`\n${indice + 1}) ${pilar.nombre}`)   <- indice empieza en 0
  //        imprimir('   Idea:     ' + pilar.idea)
  //        imprimir('   Analogía: ' + pilar.analogia)
  //   Resultado esperado en pantalla: el título del apartado y, debajo,
  //   "1) ABSTRACCIÓN", "2) ENCAPSULAMIENTO", "3) HERENCIA" y "4) POLIMORFISMO",
  //   cada uno con sus líneas "Idea:" y "Analogía:".
  //   (aprox. 6 lineas)

  // ==========================================================================
  // 2. PUNTO DE PARTIDA: EL OBJETO LITERAL
  // ==========================================================================
  // Un "objeto literal" es un objeto escrito directamente con llaves { }.
  // Es la forma más simple y rápida de agrupar datos relacionados.

  // TODO (en clase):
  //   1. titulo('2. OBJETOS LITERALES').
  //   2. Declara `const estudianteAna = { ... }` con estas propiedades:
  //        nombre: 'Ana Torres', edad: 20, curso: 'Full Stack 2',
  //        notas: [8, 9.5, 7]      <- una propiedad puede contener un array.
  //   3. Añádele DOS MÉTODOS con la sintaxis corta de ES6 (sin la palabra
  //      `function` y sin dos puntos):
  //        promedio()    -> suma this.notas con reduce y divide entre
  //                         this.notas.length. Dentro de un método, `this`
  //                         apunta al objeto que lo llamó.
  //        presentarse() -> devuelve `Hola, soy ${this.nombre} y curso ${this.curso}.`
  //   4. Imprime las dos cosas:
  //        imprimir(estudianteAna.presentarse())
  //        imprimir('Promedio de Ana:', estudianteAna.promedio().toFixed(2))
  //   5. Muestra las DOS notaciones de acceso a una propiedad:
  //        imprimir('Con punto:      ', estudianteAna.edad)
  //        imprimir('Con corchetes:  ', estudianteAna['edad'])
  //   6. Guarda `const propiedadElegida = 'curso'` e imprime
  //        imprimir('Propiedad dinámica:', estudianteAna[propiedadElegida])
  //   Resultado esperado en pantalla:
  //        Hola, soy Ana Torres y curso Full Stack 2.
  //        Promedio de Ana: 8.17
  //        Con punto:       20
  //        Con corchetes:   20
  //        Propiedad dinámica: Full Stack 2
  //   (aprox. 24 lineas)

  // ✅ BUENA PRÁCTICA: usa el punto siempre que puedas (se lee mejor).
  // Los corchetes son para cuando el nombre de la propiedad está en una
  // variable o tiene caracteres raros.

  // ⚠️ ERROR COMÚN: `estudianteAna[curso]` (sin comillas) busca una VARIABLE
  // llamada curso que no existe -> ReferenceError.

  // ==========================================================================
  // 3. LA LIMITACIÓN DE LOS OBJETOS LITERALES
  // ==========================================================================
  // ¿Y si necesitamos 300 estudiantes? Copiar y pegar el objeto 300 veces es
  // inviable: mucho código repetido y, si mañana cambiamos `promedio()`, hay
  // que corregirlo en los 300 sitios. Ese dolor es el que resuelve la POO.

  // TODO (en clase):
  //   1. titulo('3. LA LIMITACIÓN DEL LITERAL: REPETICIÓN').
  //   2. Copia MANUALMENTE el objeto anterior en `const estudianteLuis` con
  //      nombre: 'Luis Ramírez', edad: 22, curso: 'Full Stack 2',
  //      notas: [6, 7, 8.5], y los mismos dos métodos copiados y pegados.
  //      (Esto es justo lo que NO queremos hacer: enséñalo como el problema.)
  //   3. Imprime su presentación y su promedio con toFixed(2)  -> 7.17
  //   4. Demuestra el problema de memoria:
  //        imprimir('¿Comparten el método promedio?',
  //                 estudianteAna.promedio === estudianteLuis.promedio)  -> false
  //   Resultado esperado en pantalla:
  //        Hola, soy Luis Ramírez y curso Full Stack 2.
  //        Promedio de Luis: 7.17
  //        ¿Comparten el método promedio? false
  //   (aprox. 18 lineas)

  // ⚠️ ERROR COMÚN: pensar que copiar objetos con `=` crea uno nuevo.
  // TODO (en clase):
  //   1. Declara `const alias = estudianteLuis` (NO es una copia: es OTRO
  //      nombre para el MISMO objeto).
  //   2. Escribe alias.edad = 99 e imprime
  //        imprimir('Edad de Luis tras tocar el alias:', estudianteLuis.edad) -> 99
  //   3. Vuelve a dejar alias.edad = 22 para no liar el resto del archivo.
  //   (aprox. 4 lineas)

  // ✅ BUENA PRÁCTICA: para copiar (de forma superficial) usa el spread.
  // TODO (en clase):
  //   1. Crea `const copiaDeLuis = { ...estudianteLuis, nombre: 'Luis (copia)' }`.
  //   2. Cambia copiaDeLuis.edad = 40 e imprime
  //        imprimir('Edad del original tras copiar:', estudianteLuis.edad)
  //   Resultado esperado en pantalla: Edad del original tras copiar: 22 (intacto)
  //   (aprox. 3 lineas)

  // ==========================================================================
  // 4. PRIMERA SOLUCIÓN: LA FUNCIÓN FÁBRICA (FACTORY)
  // ==========================================================================
  // Una "fábrica" es simplemente una función normal que CONSTRUYE y DEVUELVE
  // un objeto. No hace falta `new`. Es sencilla y muy legible.

  // TODO (en clase):
  //   1. titulo('4. FUNCIÓN FÁBRICA').
  //   2. Escribe `function crearEstudiante(nombre, edad, notas)` que DEVUELVA
  //      un objeto literal con: nombre, edad, curso: 'Full Stack 2', notas y el
  //      método promedio() (que debe devolver 0 si el array está vacío, para no
  //      dividir entre cero).
  //   3. Crea dos estudiantes:
  //        const marta = crearEstudiante('Marta Gil', 21, [9, 9.5, 10]);
  //        const pedro = crearEstudiante('Pedro Sanz', 24, [5, 6.5, 7]);
  //   4. Imprime cada uno con este formato exacto:
  //        imprimir('Marta:', marta.nombre, '- promedio', marta.promedio().toFixed(2))
  //        imprimir('Pedro:', pedro.nombre, '- promedio', pedro.promedio().toFixed(2))
  //   5. Señala que el problema SIGUE ahí:
  //        imprimir('¿Comparten método?', marta.promedio === pedro.promedio) -> false
  //   Resultado esperado en pantalla:
  //        Marta: Marta Gil - promedio 9.50
  //        Pedro: Pedro Sanz - promedio 6.17
  //        ¿Comparten método? false
  //   (aprox. 18 lineas)

  // ==========================================================================
  // 5. LA FUNCIÓN CONSTRUCTORA Y EL OPERADOR new
  // ==========================================================================
  // Una función constructora es una función normal pensada para usarse con
  // `new`. Por CONVENIO su nombre empieza en MAYÚSCULA: así quien lea el
  // código sabe que debe invocarla con `new`.
  // Dentro NO devolvemos nada: solo rellenamos `this`, que `new` prepara
  // por nosotros como un objeto vacío.

  // TODO (en clase):
  //   1. titulo('5. FUNCIÓN CONSTRUCTORA + new').
  //   2. Escribe `function Producto(nombre, precio, stock)` (¡en mayúscula!)
  //      que asigne a `this`: nombre, precio, stock y enOferta = false.
  //      Añádele también this.valorInventario = function () { return
  //      this.precio * this.stock; } SOLO para demostrar el problema de memoria
  //      (en el archivo 02 lo moveremos al prototipo).
  //   3. Crea dos instancias:
  //        const teclado = new Producto('Teclado mecánico', 89.9, 12);
  //        const monitor = new Producto('Monitor 27"', 219.0, 5);
  //   4. Imprime el valor de inventario de cada uno con toFixed(2) y 'EUR':
  //        imprimir('Producto 1:', teclado.nombre, '->', teclado.valorInventario().toFixed(2), 'EUR')
  //   5. Demuestra que las instancias son independientes: pon teclado.enOferta
  //      = true e imprime la propiedad de los dos objetos.
  //   6. Cierra comprobando el molde del que salieron:
  //        imprimir('teclado instanceof Producto:', teclado instanceof Producto) -> true
  //        imprimir('Nombre del constructor:', teclado.constructor.name)        -> "Producto"
  //   Resultado esperado en pantalla:
  //        Producto 1: Teclado mecánico -> 1078.80 EUR
  //        Producto 2: Monitor 27" -> 1095.00 EUR
  //        Teclado en oferta: true
  //        Monitor en oferta: false
  //        teclado instanceof Producto: true
  //        Nombre del constructor: Producto
  //   (aprox. 20 lineas)

  // ==========================================================================
  // 6. ¿QUÉ HACE `new` EXACTAMENTE? LOS 4 PASOS
  // ==========================================================================
  // `new Producto('X', 1, 2)` hace, por debajo, estas cuatro cosas:
  //   1. Crea un objeto vacío: {}
  //   2. Enlaza ese objeto con Producto.prototype (su "padre", ver archivo 02).
  //   3. Ejecuta Producto con `this` apuntando a ese objeto nuevo.
  //   4. Devuelve el objeto automáticamente (salvo que la función devuelva
  //      explícitamente OTRO objeto).
  // Vamos a escribirlo nosotros mismos para verlo con nuestros propios ojos.

  // TODO (en clase):
  //   1. titulo('6. SIMULACIÓN DE new PASO A PASO').
  //   2. Escribe `function simularNew(Constructora, ...argumentos)` con los
  //      cuatro pasos, imprimiendo un aviso en cada uno:
  //        PASO 1+2: const objeto = Object.create(Constructora.prototype);
  //                  imprimir('Paso 1+2 -> objeto vacío enlazado a', Constructora.name + '.prototype')
  //        PASO 3:   const resultado = Constructora.apply(objeto, argumentos);
  //                  imprimir('Paso 3   -> constructora ejecutada con this = objeto nuevo')
  //        PASO 4:   si `resultado` es un objeto no nulo, se devuelve ese; si no,
  //                  el nuestro. imprimir('Paso 4   -> devolvemos el objeto')
  //   3. Pruébala con la constructora Producto de la sección 5:
  //        const raton = simularNew(Producto, 'Ratón inalámbrico', 25.5, 30);
  //        imprimir('Resultado de la simulación:', raton.nombre, raton.precio)
  //        imprimir('¿Es instancia de Producto?', raton instanceof Producto) -> true
  //   Resultado esperado en pantalla: los tres avisos de los pasos, después
  //   "Resultado de la simulación: Ratón inalámbrico 25.5" y "¿Es instancia
  //   de Producto? true".
  //   (aprox. 16 lineas)

  // ==========================================================================
  // 7. ERRORES CLÁSICOS CON LAS FUNCIONES CONSTRUCTORAS
  // ==========================================================================

  // ⚠️ ERROR COMÚN Nº1: olvidar `new`.
  // Sin `new` no se crea ningún objeto: en modo estricto `this` vale undefined
  // y asignar una propiedad a undefined revienta.
  // TODO (en clase):
  //   1. titulo('7. ERRORES CLÁSICOS').
  //   2. Dentro de un try, llama a Producto('Sin new', 10, 1) SIN new y guarda
  //      el resultado en `const productoRoto`.
  //   3. En el catch imprime:
  //        imprimir('⚠ Error capturado al olvidar new:', error.message)
  //   Resultado esperado en pantalla: un mensaje del tipo
  //   "⚠ Error capturado al olvidar new: Cannot set properties of undefined
  //   (setting 'nombre')".
  //   (aprox. 7 lineas)

  // ✅ BUENA PRÁCTICA: blindar la constructora con `new.target`.
  // `new.target` vale undefined si la función NO se llamó con `new`.
  // OJO: al parámetro lo llamamos `nombreCurso` y no `titulo` para no tapar
  // (shadowing) a nuestra función auxiliar titulo() dentro de este bloque.
  // TODO (en clase):
  //   1. Escribe `function Curso(nombreCurso, horas)` que empiece con
  //        if (!new.target) { return new Curso(nombreCurso, horas); }
  //      y después asigne this.titulo = nombreCurso y this.horas = horas.
  //   2. Créalo de las dos formas y comprueba que funcionan igual:
  //        const cursoConNew = new Curso('JavaScript desde cero', 60);
  //        const cursoSinNew = Curso('CSS moderno', 40);
  //        imprimir('Con new:', cursoConNew.titulo, '| Sin new:', cursoSinNew.titulo)
  //        imprimir('Ambos son instancias de Curso:',
  //                 cursoConNew instanceof Curso && cursoSinNew instanceof Curso)
  //   Resultado esperado en pantalla:
  //        Con new: JavaScript desde cero | Sin new: CSS moderno
  //        Ambos son instancias de Curso: true
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMÚN Nº2: nombrar la constructora en minúscula. No da error,
  // pero engaña a quien lee el código. El convenio (PascalCase) importa.

  // ==========================================================================
  // 8. ABSTRACCIÓN Y ENCAPSULAMIENTO CON CLOSURES
  // ==========================================================================
  // Antes de que existieran los campos privados con `#` (que veremos en el
  // archivo 03), la única forma REAL de ocultar datos era el closure:
  // una variable declarada dentro de la función solo es visible ahí dentro,
  // pero las funciones internas siguen "recordándola" aunque la fábrica
  // ya haya terminado. A eso se le llama CLOSURE (cierre).

  // TODO (en clase):
  //   1. titulo('8. ENCAPSULAMIENTO CON CLOSURES').
  //   2. Escribe `function crearCuentaDeAlumno(nombreAlumno)` con DOS variables
  //      privadas dentro: `let creditos = 0` y `const historial = []`.
  //   3. Devuelve solo la "interfaz pública" (los botones del microondas):
  //        nombre: nombreAlumno,
  //        sumarCreditos(cantidad) -> si no es un número positivo, imprime
  //             '⚠ Cantidad inválida, se ignora:' y devuelve this; si es válida,
  //             suma a `creditos`, empuja `+${cantidad} créditos` a historial y
  //             devuelve this (para poder encadenar llamadas).
  //        verCreditos()  -> devuelve creditos.
  //        verHistorial() -> devuelve una COPIA con [...historial].
  //   4. Pruébalo encadenando:
  //        const cuentaAna = crearCuentaDeAlumno('Ana Torres');
  //        cuentaAna.sumarCreditos(6).sumarCreditos(4).sumarCreditos(-3);
  //        imprimir('Créditos de Ana:', cuentaAna.verCreditos())  -> 10
  //        imprimir('Historial:', cuentaAna.verHistorial())
  //   5. La prueba del encapsulamiento:
  //        imprimir('¿Se puede leer cuentaAna.creditos?', cuentaAna.creditos) -> undefined
  //        cuentaAna.creditos = 9999;
  //        imprimir('Tras intentar falsear creditos, el real sigue siendo:',
  //                 cuentaAna.verCreditos())  -> 10
  //   Resultado esperado en pantalla: el aviso de la cantidad inválida (-3),
  //   "Créditos de Ana: 10", el historial con dos entradas, "undefined" y el 10
  //   final intacto.
  //   (aprox. 30 lineas)

  // ✅ BUENA PRÁCTICA: exponer métodos (verCreditos) en lugar de datos crudos.
  //    Así podemos cambiar la implementación interna sin romper a quien nos usa.

  // TODO (en clase): cierra el archivo con
  //   imprimir('\n(Fin del archivo 01. Continúa en 02-prototipos.js)');
  //   (aprox. 1 linea)

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) OBJETO LITERAL.
  //    Crea un objeto literal `tarea` con las propiedades: titulo, prioridad
  //    ("alta"/"media"/"baja"), completada (booleano) y un método
  //    `resumen()` que devuelva por ejemplo:
  //    "[PENDIENTE] Estudiar prototipos (prioridad: alta)".
  //
  // 2) FUNCIÓN FÁBRICA.
  //    Escribe `crearTarea(titulo, prioridad)` que devuelva un objeto como el
  //    del ejercicio 1 con `completada` en false y un método `completar()`
  //    que la marque como hecha y devuelva el propio objeto (para encadenar).
  //
  // 3) FUNCIÓN CONSTRUCTORA.
  //    Convierte el ejercicio 2 en una función constructora `Tarea(titulo,
  //    prioridad)` que se use con `new`. Blíndala con `new.target` para que
  //    también funcione si alguien olvida el `new`.
  //
  // 4) ENCAPSULAMIENTO CON CLOSURE.
  //    Crea `crearMonedero(saldoInicial)` con una variable privada `saldo` y
  //    los métodos `ingresar(cantidad)`, `retirar(cantidad)` y `verSaldo()`.
  //    Reglas: no se puede ingresar un valor que no sea número positivo y no
  //    se puede retirar más de lo que hay (muestra un aviso con imprimir()).
  //
  // 5) RETO (difícil).
  //    Escribe tu propia versión de `simularNew` llamada `miNew(Constructora,
  //    argumentos)` que reciba los argumentos en un ARRAY en lugar de usar
  //    parámetros rest. Después, comprueba con `instanceof` que el objeto
  //    creado es realmente una instancia de la constructora.
  // ==========================================================================
})();
