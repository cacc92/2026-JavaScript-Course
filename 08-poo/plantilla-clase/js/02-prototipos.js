/**
 * ============================================================================
 * ARCHIVO: js/02-prototipos.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Qué es el prototipo y por qué TODO objeto en JavaScript tiene uno.
 *   2. __proto__ frente a Object.getPrototypeOf() (y cuál usar).
 *   3. La propiedad `prototype` de las funciones constructoras.
 *   4. Añadir métodos al prototype y por qué AHORRA MEMORIA.
 *   5. La cadena de prototipos, recorrida paso a paso con un bucle.
 *   6. Propiedades propias vs heredadas: hasOwnProperty, `in`, sombreado.
 *   7. Object.create() y la herencia prototípica "a mano" (pre-ES6).
 *
 * QUÉ SE APRENDE
 *   El mecanismo REAL que hay debajo de las clases. Las `class` de ES6 son
 *   una fachada bonita sobre esto: quien entiende prototipos entiende clases.
 *
 * (Recuerda: envolvemos todo en una IIFE para que las variables de este
 *  archivo no choquen con las de los demás archivos cargados en el HTML.)
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y las utilidades (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/02-prototipos.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL (misma idea que en el archivo 01, con su propio <pre>)
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto.

  var ID_SALIDA = 'salida-02';

  /**
   * imprimir(): escribe en la consola del navegador Y en el bloque visual.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes);
    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    const texto = mensajes
      .map((m) => {
        if (typeof m === 'object' && m !== null) {
          try {
            return JSON.stringify(m, null, 2);
          } catch (error) {
            return String(m);
          }
        }
        return String(m);
      })
      .join(' ');
    salida.textContent += texto + '\n';
  }

  function titulo(texto) {
    imprimir('\n============================================');
    imprimir('  ' + texto);
    imprimir('============================================');
  }

  const botonLimpiar = document.getElementById('limpiar-02');
  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. TODO OBJETO TIENE UN PROTOTIPO
  // ==========================================================================
  // Analogía: imagina que cada objeto lleva colgado un post-it que dice
  // "si no encuentras algo en mí, pregúntale a ESTE otro objeto".
  // Ese "otro objeto" es su PROTOTIPO.
  //
  // Cuando escribimos objeto.algo, el motor de JavaScript:
  //   1. Busca `algo` entre las propiedades PROPIAS del objeto.
  //   2. Si no está, salta a su prototipo y busca allí.
  //   3. Y al prototipo del prototipo... hasta llegar a null.
  // Ese recorrido se llama CADENA DE PROTOTIPOS.

  // TODO (en clase):
  //   1. titulo('1. TODO OBJETO TIENE UN PROTOTIPO').
  //   2. Declara `const alumno = { nombre: 'Ana Torres' };`.
  //   3. Nunca le escribimos un toString y aun así existe. Imprímelo:
  //        imprimir('alumno.toString():', alumno.toString())  -> "[object Object]"
  //   4. Demuestra que NO es propio sino heredado de Object.prototype, con las
  //      tres comprobaciones (Object.hasOwn es la versión moderna del clásico
  //      hasOwnProperty, y funciona incluso con Object.create(null)):
  //        imprimir('¿Tiene toString propio?', Object.hasOwn(alumno, 'toString'))      -> false
  //        imprimir('Con el método clásico sale lo mismo:', alumno.hasOwnProperty('toString')) -> false
  //        imprimir('¿Existe toString (propio o heredado)?', 'toString' in alumno)     -> true
  //   Resultado esperado en pantalla: "[object Object]", después false, false y true.
  //   (aprox. 6 lineas)

  // ✅ BUENA PRÁCTICA: Object.getPrototypeOf() es la forma correcta de leerlo.
  // TODO (en clase):
  //   1. Guarda `const prototipoDeAlumno = Object.getPrototypeOf(alumno);`.
  //   2. imprimir('¿El prototipo de alumno es Object.prototype?',
  //               prototipoDeAlumno === Object.prototype)  -> true
  //   (aprox. 3 lineas)

  // ⚠️ ERROR COMÚN: usar __proto__. Funciona en todos los navegadores, pero
  // está marcado como "obsoleto" (legacy) en el estándar. Sirve para APRENDER
  // y depurar; en código de producción usa Object.getPrototypeOf/setPrototypeOf.
  // TODO (en clase):
  //   1. imprimir('Con __proto__ (obsoleto) sale lo mismo:',
  //               alumno.__proto__ === Object.prototype)  -> true
  //   (aprox. 2 lineas)

  // Los arrays y las funciones también tienen su propio prototipo.
  // TODO (en clase):
  //   1. Declara `const notas = [7, 8, 9];`.
  //   2. imprimir('Prototipo de un array === Array.prototype:',
  //               Object.getPrototypeOf(notas) === Array.prototype)  -> true
  //   3. imprimir('Por eso el array sabe hacer .map, .filter, .reduce...')
  //   Resultado esperado en pantalla: true y la frase explicativa.
  //   (aprox. 4 lineas)

  // ==========================================================================
  // 2. LA PROPIEDAD `prototype` DE LAS FUNCIONES CONSTRUCTORAS
  // ==========================================================================
  // ¡Cuidado, aquí está la confusión número uno del tema!
  //   - `prototype`  -> propiedad que SOLO tienen las FUNCIONES. Es el objeto
  //                     que se asignará como prototipo a las instancias.
  //   - `__proto__`  -> propiedad que tienen TODOS los objetos. Es el enlace
  //                     hacia su prototipo real.
  // En una frase: Perro.prototype es el prototipo QUE DA; miPerro.__proto__
  // es el prototipo QUE TIENE.

  // TODO (en clase):
  //   1. titulo('2. prototype vs __proto__').
  //   2. Escribe `function Instrumento(nombre, familia)` que asigne a `this`
  //      las dos propiedades nombre y familia.
  //   3. Crea `const guitarra = new Instrumento('Guitarra española', 'cuerda');`.
  //   4. imprimir('¿Instrumento.prototype === Object.getPrototypeOf(guitarra)?',
  //               Instrumento.prototype === Object.getPrototypeOf(guitarra))  -> true
  //   5. El prototipo trae de fábrica una propiedad `constructor` que apunta de
  //      vuelta a la función; por eso funciona objeto.constructor.name:
  //        imprimir('guitarra.constructor.name:', guitarra.constructor.name)   -> "Instrumento"
  //        imprimir('¿constructor es propio de guitarra?', Object.hasOwn(guitarra, 'constructor')) -> false
  //        imprimir('...está en el prototipo, por eso lo encuentra igualmente.')
  //   Resultado esperado en pantalla: true, "Instrumento", false y la frase final.
  //   (aprox. 12 lineas)

  // ==========================================================================
  // 3. MÉTODOS EN EL PROTOTIPO: EL AHORRO DE MEMORIA
  // ==========================================================================
  // Si definimos el método DENTRO de la constructora (this.metodo = function...)
  // cada instancia guarda su propia copia de esa función.
  // Si lo definimos en el PROTOTIPO, existe UNA sola función compartida por
  // todas las instancias. Con 10.000 objetos la diferencia es enorme.
  //
  // Analogía: no le das a cada estudiante una fotocopia del reglamento;
  // pones un único reglamento en la pared y todos lo consultan.

  // TODO (en clase):
  //   1. titulo('3. MÉTODOS EN EL PROTOTIPO (AHORRO DE MEMORIA)').
  //   2. Versión "mala": `function ProductoCopia(nombre, precio)` que asigne
  //      nombre, precio y `this.conIva = function () { return this.precio * 1.21; }`
  //      (una copia nueva de la función en CADA instancia).
  //   3. Crea `const p1 = new ProductoCopia('Teclado', 100);` y
  //      `const p2 = new ProductoCopia('Ratón', 50);` e imprime:
  //        imprimir('MÉTODO EN LA CONSTRUCTORA -> ¿misma función?', p1.conIva === p2.conIva) -> false
  //   Resultado esperado en pantalla: MÉTODO EN LA CONSTRUCTORA -> ¿misma función? false
  //   (aprox. 10 lineas)

  // TODO (en clase):
  //   1. Versión buena: `function ProductoCompartido(nombre, precio)` que SOLO
  //      asigne los DATOS (nombre y precio) a `this`.
  //   2. Añade los métodos al objeto prototype. Ojo: usa `function` normal y NO
  //      una arrow function, porque necesitamos que `this` sea la instancia:
  //        ProductoCompartido.prototype.conIva = function () { return this.precio * 1.21; };
  //        ProductoCompartido.prototype.describir = function () {
  //          return `${this.nombre}: ${this.precio.toFixed(2)} EUR (${this.conIva().toFixed(2)} con IVA)`;
  //        };
  //   3. Crea `const p3 = new ProductoCompartido('Teclado', 100);` y
  //      `const p4 = new ProductoCompartido('Ratón', 50);` e imprime:
  //        imprimir('MÉTODO EN EL PROTOTIPO -> ¿misma función?', p3.conIva === p4.conIva) -> true
  //        imprimir(p3.describir())
  //        imprimir(p4.describir())
  //   Resultado esperado en pantalla:
  //        MÉTODO EN EL PROTOTIPO -> ¿misma función? true
  //        Teclado: 100.00 EUR (121.00 con IVA)
  //        Ratón: 50.00 EUR (60.50 con IVA)
  //   (aprox. 14 lineas)

  // Dato curioso muy útil en clase: el prototipo es un objeto VIVO. Si le
  // añadimos un método AHORA, los objetos creados ANTES también lo tendrán.
  // TODO (en clase):
  //   1. Añade DESPUÉS de crear p3 y p4:
  //        ProductoCompartido.prototype.esCaro = function () { return this.precio > 80; };
  //   2. imprimir('¿p3 es caro? (método añadido a posteriori):', p3.esCaro()) -> true
  //   (aprox. 4 lineas)

  // ⚠️ ERROR COMÚN: usar una arrow function en el prototipo.
  //    ProductoCompartido.prototype.mal = () => this.precio;  // this NO es la instancia
  //    Las arrow no tienen `this` propio (se explica en el archivo 05).

  // ==========================================================================
  // 4. PROPIEDADES PROPIAS, HEREDADAS Y SOMBREADO
  // ==========================================================================
  // "Sombrear" (shadowing) es definir en la instancia una propiedad con el
  // mismo nombre que una del prototipo: la de la instancia TAPA a la otra.
  // Importante: el prototipo NO se modifica; solo queda oculto para ese objeto.

  // TODO (en clase):
  //   1. titulo('4. PROPIAS vs HEREDADAS (SOMBREADO)').
  //   2. imprimir('p3.conIva viene del prototipo:', !Object.hasOwn(p3, 'conIva')) -> true
  //   3. Sombrea el método SOLO en p3 (p4 no se entera):
  //        p3.conIva = function () { return this.precio * 1.10; };
  //   4. Imprime las tres comprobaciones:
  //        imprimir('p3 con método sombreado:', p3.conIva().toFixed(2))          -> 110.00
  //        imprimir('p4 sigue con el del prototipo:', p4.conIva().toFixed(2))    -> 60.50
  //        imprimir('¿Ahora conIva es propio de p3?', Object.hasOwn(p3, 'conIva')) -> true
  //   5. Borra la propiedad propia con `delete p3.conIva;` y comprueba que
  //      vuelve a verse la del prototipo:
  //        imprimir('Tras delete, p3 recupera el método heredado:', p3.conIva().toFixed(2)) -> 121.00
  //   Resultado esperado en pantalla: true, 110.00, 60.50, true y 121.00.
  //   (aprox. 10 lineas)

  // TODO (en clase): diferencia clave entre `in` y hasOwnProperty / Object.hasOwn.
  //   1. imprimir("'conIva' in p3            ->", 'conIva' in p3)            -> true (busca en la cadena)
  //   2. imprimir('Object.hasOwn(p3, "conIva") ->', Object.hasOwn(p3, 'conIva')) -> false (solo propias)
  //   (aprox. 2 lineas)

  // ✅ BUENA PRÁCTICA: para recorrer solo lo propio usa Object.keys(),
  //    que ignora las propiedades heredadas (a diferencia de for...in).
  // TODO (en clase):
  //   1. imprimir('Object.keys(p3):', Object.keys(p3))  -> ["nombre", "precio"]
  //   (aprox. 1 linea)

  // ==========================================================================
  // 5. LA CADENA DE PROTOTIPOS, RECORRIDA A MANO
  // ==========================================================================
  // Vamos a "caminar" la cadena con un bucle while hasta llegar a null.
  // Ver esto una vez vale más que diez explicaciones teóricas.

  // TODO (en clase):
  //   1. titulo('5. RECORRIENDO LA CADENA DE PROTOTIPOS').
  //   2. Escribe `function mostrarCadena(objeto, etiqueta)` que imprima cada
  //      eslabón del "collar" de prototipos:
  //        - Cabecera:  imprimir('\nCadena de ' + etiqueta + ':');
  //        - Primer renglón, el objeto en sí: imprimir('[objeto] ' + etiqueta);
  //        - `let actual = Object.getPrototypeOf(objeto);` y `let nivel = 1;`
  //        - while (actual !== null) { ... }: dentro, identifica el eslabón con
  //          `const nombre = actual.constructor ? actual.constructor.name : '(sin constructor)';`
  //          imprime  '  '.repeat(nivel) + '-> ' + nombre + '.prototype',
  //          avanza con actual = Object.getPrototypeOf(actual) y nivel += 1.
  //        - Al salir: imprimir('  '.repeat(nivel) + '-> null   (fin de la cadena)');
  //   3. Pruébala CUATRO veces, en este orden:
  //        mostrarCadena(p3, 'p3 (ProductoCompartido)');
  //        mostrarCadena([1, 2, 3], 'un array');
  //        mostrarCadena(function () {}, 'una función');
  //        mostrarCadena('texto', 'un string (se envuelve en String)');
  //   Resultado esperado en pantalla: cuatro bloques sangrados en escalera; por
  //   ejemplo el array muestra "-> Array.prototype", "-> Object.prototype" y
  //   "-> null   (fin de la cadena)".
  //   OJO: esta función se vuelve a usar en la sección 7, así que déjala escrita.
  //   (aprox. 18 lineas)

  // ==========================================================================
  // 6. Object.create(): CREAR UN OBJETO ELIGIENDO SU PROTOTIPO
  // ==========================================================================
  // Object.create(X) crea un objeto vacío cuyo prototipo es X.
  // Es la forma más directa de decir "este objeto hereda de aquel".

  // TODO (en clase):
  //   1. titulo('6. Object.create()').
  //   2. Declara el objeto "plantilla" (a veces llamado objeto base):
  //        const plantillaVehiculo = {
  //          ruedas: 4,
  //          arrancar() { return `${this.marca} arrancando con ${this.ruedas} ruedas.`; },
  //        };
  //   3. Crea `const coche = Object.create(plantillaVehiculo);` y dale su
  //      propiedad propia `coche.marca = 'Seat';`. Imprime:
  //        imprimir(coche.arrancar())                                        -> "Seat arrancando con 4 ruedas."
  //        imprimir('¿ruedas es propia de coche?', Object.hasOwn(coche, 'ruedas')) -> false
  //        imprimir('Prototipo correcto:', Object.getPrototypeOf(coche) === plantillaVehiculo) -> true
  //   4. La moto sombrea `ruedas` con su propio valor: crea `moto` igual,
  //      con moto.marca = 'Honda' y moto.ruedas = 2, e imprime moto.arrancar()
  //      -> "Honda arrancando con 2 ruedas."
  //   Resultado esperado en pantalla: las dos frases de arranque, false y true.
  //   (aprox. 14 lineas)

  // TODO (en clase): segundo parámetro de Object.create (menos usado):
  // descriptores de propiedad.
  //   1. const bici = Object.create(plantillaVehiculo, {
  //        marca:  { value: 'Orbea', enumerable: true, writable: true },
  //        ruedas: { value: 2, enumerable: true, writable: false },  // solo lectura
  //      });
  //   2. imprimir(bici.arrancar())  -> "Orbea arrancando con 2 ruedas."
  //   3. En modo estricto, escribir sobre una propiedad de solo lectura lanza
  //      error: mete `bici.ruedas = 8;` en un try y en el catch imprime
  //        imprimir('⚠ No se puede cambiar una propiedad writable:false ->', error.message)
  //   Resultado esperado en pantalla: la frase de arranque y un mensaje del tipo
  //   "⚠ No se puede cambiar una propiedad writable:false -> Cannot assign to
  //   read only property 'ruedas' of object".
  //   (aprox. 10 lineas)

  // TODO (en clase): caso especial Object.create(null), un objeto SIN prototipo,
  // un "diccionario puro" sin toString ni nada heredado. Útil para mapas de datos.
  //   1. const diccionario = Object.create(null);  y  diccionario.js = 'JavaScript';
  //   2. imprimir('Diccionario sin prototipo, ¿tiene toString?', typeof diccionario.toString)
  //   Resultado esperado en pantalla: ... ¿tiene toString? undefined
  //   (aprox. 3 lineas)

  // ==========================================================================
  // 7. HERENCIA PROTOTÍPICA "A LA ANTIGUA" (ANTES DE ES6)
  // ==========================================================================
  // Así se hacía la herencia antes de que existieran `class` y `extends`.
  // Merece la pena verlo UNA vez: explica por qué `class` es solo azúcar.
  // Son tres pasos y ninguno se puede saltar.

  // TODO (en clase):
  //   1. titulo('7. HERENCIA PROTOTÍPICA ANTES DE ES6').
  //   2. Constructora "padre": `function Empleado(nombre, salario)` que asigne
  //      ambas propiedades a `this`, y dos métodos en su prototipo:
  //        Empleado.prototype.presentarse = function () {
  //          return `Soy ${this.nombre} y cobro ${this.salario} EUR.`;
  //        };
  //        Empleado.prototype.subirSalario = function (porcentaje) {
  //          this.salario = Math.round(this.salario * (1 + porcentaje / 100));
  //          return this.salario;
  //        };
  //   (aprox. 10 lineas)

  // TODO (en clase): la constructora "hija", con los TRES PASOS obligatorios.
  //   1. function Programadora(nombre, salario, lenguaje) {
  //        // PASO 1: llamar a la constructora padre con el `this` de la hija.
  //        // Es el equivalente antiguo de `super(nombre, salario)`.
  //        Empleado.call(this, nombre, salario);
  //        this.lenguaje = lenguaje;   // Propiedad propia de la hija
  //      }
  //   2. PASO 2: enlazar los prototipos para heredar los MÉTODOS:
  //        Programadora.prototype = Object.create(Empleado.prototype);
  //      ⚠️ ERROR COMÚN: escribir `Programadora.prototype = Empleado.prototype`.
  //      Eso NO copia: comparte el mismo objeto, así que todo lo que añadas a la
  //      hija aparecería también en el padre. Object.create crea un objeto NUEVO
  //      que hereda del prototipo del padre. Esa es la diferencia.
  //   3. PASO 3: restaurar la propiedad `constructor`, que el paso 2 se llevó
  //      por delante. Si no, programadora.constructor.name diría "Empleado":
  //        Programadora.prototype.constructor = Programadora;
  //   (aprox. 8 lineas)

  // TODO (en clase): métodos de la hija.
  //   1. Método propio:
  //        Programadora.prototype.programar = function () {
  //          return `${this.nombre} está escribiendo ${this.lenguaje}.`;
  //        };
  //   2. Sobrescritura (polimorfismo): mismo nombre de método, comportamiento
  //      propio, reutilizando el del padre con `.call(this)` (el `super` de antaño):
  //        Programadora.prototype.presentarse = function () {
  //          const base = Empleado.prototype.presentarse.call(this);
  //          return base + ` Programo en ${this.lenguaje}.`;
  //        };
  //   (aprox. 8 lineas)

  // TODO (en clase): la prueba final.
  //   1. const marta = new Programadora('Marta Gil', 32000, 'JavaScript');
  //   2. imprimir(marta.presentarse())   -> método sobrescrito + llamada al padre
  //      imprimir(marta.programar())     -> método propio de la hija
  //      imprimir('Nuevo salario:', marta.subirSalario(10))  -> método heredado
  //   3. imprimir('marta instanceof Programadora:', marta instanceof Programadora) -> true
  //      imprimir('marta instanceof Empleado:', marta instanceof Empleado)         -> true
  //      imprimir('marta.constructor.name:', marta.constructor.name)               -> "Programadora"
  //   4. mostrarCadena(marta, 'marta (Programadora -> Empleado -> Object)');
  //   Resultado esperado en pantalla:
  //        Soy Marta Gil y cobro 32000 EUR. Programo en JavaScript.
  //        Marta Gil está escribiendo JavaScript.
  //        Nuevo salario: 35200
  //        ...los tres true/"Programadora" y la cadena de tres eslabones.
  //   (aprox. 9 lineas)

  // ==========================================================================
  // 8. LO QUE NUNCA SE DEBE HACER
  // ==========================================================================

  // ⚠️ ERROR COMÚN / MALA PRÁCTICA GRAVE: modificar Object.prototype.
  //    Si escribes Object.prototype.miMetodo = ..., ese método aparece en
  //    TODOS los objetos del programa, incluidos los de las librerías, y
  //    contamina los bucles for...in. Nunca lo hagas.
  //
  // ⚠️ Object.setPrototypeOf() existe, pero cambiar el prototipo de un objeto
  // ya creado degrada mucho el rendimiento. Si necesitas un prototipo distinto,
  // créalo directamente con Object.create() o con `class`.
  //
  // TODO (en clase):
  //   1. titulo('8. AVISOS FINALES').
  //   2. imprimir('⚠ Nunca añadas propiedades a Object.prototype: contamina TODO.')
  //   3. imprimir('⚠ Object.setPrototypeOf() funciona, pero es lento: evítalo.')
  //   4. Cierra el archivo con
  //        imprimir('\n(Fin del archivo 02. Continúa en 03-clases.js)');
  //   (aprox. 4 lineas)

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) MÉTODO EN EL PROTOTIPO.
  //    Crea la constructora `Cancion(titulo, artista, duracionSegundos)` y
  //    añade a su prototipo el método `duracionFormateada()` que devuelva el
  //    tiempo como "3:07". Comprueba con === que dos instancias comparten
  //    exactamente la misma función.
  //
  // 2) PROPIAS vs HEREDADAS.
  //    Con dos instancias de `Cancion`, sombrea el método en una de ellas,
  //    imprime el resultado en ambas y después bórralo con `delete`.
  //    Explica en un comentario qué se ve en cada paso.
  //
  // 3) Object.create.
  //    Crea un objeto `baseAnimal` con la propiedad `patas` y el método
  //    `describir()`. Deriva de él `pajaro` (2 patas) y `arana` (8 patas)
  //    usando Object.create y sin repetir el método.
  //
  // 4) CADENA DE PROTOTIPOS.
  //    Escribe tu propia función `contarEslabones(objeto)` que devuelva
  //    cuántos prototipos hay hasta llegar a null. Pruébala con un objeto
  //    literal, un array y una instancia de `Programadora`.
  //
  // 5) RETO (difícil).
  //    Repite la herencia de la sección 7 con las constructoras
  //    `Vehiculo(marca, ruedas)` y `Camion(marca, ruedas, cargaKg)`.
  //    Sobrescribe el método `describir()` en Camion de modo que reutilice el
  //    del padre con `.call(this)` y añada la carga. Verifica los tres pasos
  //    obligatorios (call, Object.create y restaurar constructor) y comprueba
  //    `instanceof` con ambas constructoras.
  // ==========================================================================
})();
