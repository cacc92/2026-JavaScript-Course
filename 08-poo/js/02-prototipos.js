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
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL (misma idea que en el archivo 01, con su propio <pre>)
  // ==========================================================================
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

  titulo('1. TODO OBJETO TIENE UN PROTOTIPO');

  const alumno = { nombre: 'Ana Torres' };

  // Nunca escribimos un método toString en `alumno`... y sin embargo existe:
  imprimir('alumno.toString():', alumno.toString()); // "[object Object]"

  // ¿De dónde salió? De Object.prototype, el prototipo de todos los objetos.
  // Object.hasOwn(obj, 'clave') responde: ¿esa propiedad es PROPIA del objeto
  // (no heredada)? Es la versión moderna del clásico obj.hasOwnProperty('clave');
  // ambas valen, pero Object.hasOwn funciona incluso con Object.create(null).
  imprimir('¿Tiene toString propio?', Object.hasOwn(alumno, 'toString')); // false
  imprimir('Con el método clásico sale lo mismo:', alumno.hasOwnProperty('toString')); // false
  imprimir('¿Existe toString (propio o heredado)?', 'toString' in alumno); // true

  // ✅ BUENA PRÁCTICA: Object.getPrototypeOf() es la forma correcta de leerlo.
  const prototipoDeAlumno = Object.getPrototypeOf(alumno);
  imprimir('¿El prototipo de alumno es Object.prototype?',
    prototipoDeAlumno === Object.prototype); // true

  // ⚠️ ERROR COMÚN: usar __proto__. Funciona en todos los navegadores, pero
  // está marcado como "obsoleto" (legacy) en el estándar. Sirve para APRENDER
  // y depurar; en código de producción usa Object.getPrototypeOf/setPrototypeOf.
  imprimir('Con __proto__ (obsoleto) sale lo mismo:',
    alumno.__proto__ === Object.prototype); // true

  // Los arrays y las funciones también tienen su propio prototipo.
  const notas = [7, 8, 9];
  imprimir('Prototipo de un array === Array.prototype:',
    Object.getPrototypeOf(notas) === Array.prototype); // true
  imprimir('Por eso el array sabe hacer .map, .filter, .reduce...');

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

  titulo('2. prototype vs __proto__');

  function Instrumento(nombre, familia) {
    this.nombre = nombre;
    this.familia = familia;
  }

  const guitarra = new Instrumento('Guitarra española', 'cuerda');

  imprimir('¿Instrumento.prototype === Object.getPrototypeOf(guitarra)?',
    Instrumento.prototype === Object.getPrototypeOf(guitarra)); // true

  // Y el prototipo trae de fábrica una propiedad `constructor` que apunta
  // de vuelta a la función. Por eso funciona objeto.constructor.name.
  imprimir('guitarra.constructor.name:', guitarra.constructor.name); // "Instrumento"
  imprimir('¿constructor es propio de guitarra?', Object.hasOwn(guitarra, 'constructor')); // false
  imprimir('...está en el prototipo, por eso lo encuentra igualmente.');

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

  titulo('3. MÉTODOS EN EL PROTOTIPO (AHORRO DE MEMORIA)');

  // --- Versión "mala": método dentro de la constructora ---
  function ProductoCopia(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
    this.conIva = function () {          // Copia nueva en CADA instancia
      return this.precio * 1.21;
    };
  }

  const p1 = new ProductoCopia('Teclado', 100);
  const p2 = new ProductoCopia('Ratón', 50);
  imprimir('MÉTODO EN LA CONSTRUCTORA -> ¿misma función?',
    p1.conIva === p2.conIva); // false: son dos funciones distintas

  // --- Versión buena: método en el prototipo ---
  function ProductoCompartido(nombre, precio) {
    this.nombre = nombre;   // Los DATOS sí son propios de cada instancia
    this.precio = precio;
  }

  // Añadimos el método al objeto prototype. Ojo: usamos `function` normal y NO
  // una arrow function, porque necesitamos que `this` sea la instancia.
  ProductoCompartido.prototype.conIva = function () {
    return this.precio * 1.21;
  };

  // Podemos añadir tantos como queramos, incluso después de crear instancias.
  ProductoCompartido.prototype.describir = function () {
    return `${this.nombre}: ${this.precio.toFixed(2)} EUR (${this.conIva().toFixed(2)} con IVA)`;
  };

  const p3 = new ProductoCompartido('Teclado', 100);
  const p4 = new ProductoCompartido('Ratón', 50);

  imprimir('MÉTODO EN EL PROTOTIPO -> ¿misma función?', p3.conIva === p4.conIva); // true
  imprimir(p3.describir());
  imprimir(p4.describir());

  // Dato curioso muy útil en clase: el prototipo es un objeto VIVO. Si le
  // añadimos un método AHORA, los objetos creados ANTES también lo tendrán.
  ProductoCompartido.prototype.esCaro = function () {
    return this.precio > 80;
  };
  imprimir('¿p3 es caro? (método añadido a posteriori):', p3.esCaro()); // true

  // ⚠️ ERROR COMÚN: usar una arrow function en el prototipo.
  //    ProductoCompartido.prototype.mal = () => this.precio;  // this NO es la instancia
  //    Las arrow no tienen `this` propio (se explica en el archivo 05).

  // ==========================================================================
  // 4. PROPIEDADES PROPIAS, HEREDADAS Y SOMBREADO
  // ==========================================================================
  // "Sombrear" (shadowing) es definir en la instancia una propiedad con el
  // mismo nombre que una del prototipo: la de la instancia TAPA a la otra.
  // Importante: el prototipo NO se modifica; solo queda oculto para ese objeto.

  titulo('4. PROPIAS vs HEREDADAS (SOMBREADO)');

  imprimir('p3.conIva viene del prototipo:', !Object.hasOwn(p3, 'conIva')); // true

  // Sombreamos el método SOLO en p3 (p4 no se entera).
  p3.conIva = function () {
    return this.precio * 1.10; // IVA reducido inventado, solo para el ejemplo
  };

  imprimir('p3 con método sombreado:', p3.conIva().toFixed(2)); // 110.00
  imprimir('p4 sigue con el del prototipo:', p4.conIva().toFixed(2)); // 60.50
  imprimir('¿Ahora conIva es propio de p3?', Object.hasOwn(p3, 'conIva')); // true

  // Si borramos la propiedad propia, vuelve a verse la del prototipo.
  delete p3.conIva;
  imprimir('Tras delete, p3 recupera el método heredado:', p3.conIva().toFixed(2)); // 121.00

  // Diferencia clave entre `in` y hasOwnProperty / Object.hasOwn:
  imprimir("'conIva' in p3            ->", 'conIva' in p3);            // true (busca en la cadena)
  imprimir('Object.hasOwn(p3, "conIva") ->', Object.hasOwn(p3, 'conIva')); // false (solo propias)

  // ✅ BUENA PRÁCTICA: para recorrer solo lo propio usa Object.keys(),
  //    que ignora las propiedades heredadas (a diferencia de for...in).
  imprimir('Object.keys(p3):', Object.keys(p3)); // ["nombre", "precio"]

  // ==========================================================================
  // 5. LA CADENA DE PROTOTIPOS, RECORRIDA A MANO
  // ==========================================================================
  // Vamos a "caminar" la cadena con un bucle while hasta llegar a null.
  // Ver esto una vez vale más que diez explicaciones teóricas.

  titulo('5. RECORRIENDO LA CADENA DE PROTOTIPOS');

  /**
   * mostrarCadena(): imprime cada eslabón del "collar" de prototipos.
   * @param {*} objeto - cualquier valor del que queramos ver la cadena.
   * @param {string} etiqueta - nombre legible para mostrar en la salida.
   */
  function mostrarCadena(objeto, etiqueta) {
    imprimir('\nCadena de ' + etiqueta + ':');

    // El primer renglón es el OBJETO en sí, que no es un prototipo de nadie.
    imprimir('[objeto] ' + etiqueta);

    // A partir de aquí saltamos de prototipo en prototipo hasta null.
    let actual = Object.getPrototypeOf(objeto);
    let nivel = 1;

    while (actual !== null) {
      // Identificamos cada eslabón por el nombre de su constructor: el
      // prototipo de un array se llama Array.prototype, y así con todos.
      const nombre = actual.constructor ? actual.constructor.name : '(sin constructor)';
      imprimir('  '.repeat(nivel) + '-> ' + nombre + '.prototype');

      actual = Object.getPrototypeOf(actual); // Siguiente eslabón
      nivel += 1;
    }

    imprimir('  '.repeat(nivel) + '-> null   (fin de la cadena)');
  }

  mostrarCadena(p3, 'p3 (ProductoCompartido)');
  mostrarCadena([1, 2, 3], 'un array');
  mostrarCadena(function () {}, 'una función');
  mostrarCadena('texto', 'un string (se envuelve en String)');

  // ==========================================================================
  // 6. Object.create(): CREAR UN OBJETO ELIGIENDO SU PROTOTIPO
  // ==========================================================================
  // Object.create(X) crea un objeto vacío cuyo prototipo es X.
  // Es la forma más directa de decir "este objeto hereda de aquel".

  titulo('6. Object.create()');

  // Un objeto que hace de "plantilla" (a veces se le llama objeto base).
  const plantillaVehiculo = {
    ruedas: 4,
    arrancar() {
      return `${this.marca} arrancando con ${this.ruedas} ruedas.`;
    },
  };

  const coche = Object.create(plantillaVehiculo); // coche hereda de la plantilla
  coche.marca = 'Seat';                           // propiedad propia

  imprimir(coche.arrancar()); // "Seat arrancando con 4 ruedas."
  imprimir('¿ruedas es propia de coche?', Object.hasOwn(coche, 'ruedas')); // false
  imprimir('Prototipo correcto:', Object.getPrototypeOf(coche) === plantillaVehiculo); // true

  // La moto sombrea `ruedas` con su propio valor.
  const moto = Object.create(plantillaVehiculo);
  moto.marca = 'Honda';
  moto.ruedas = 2;
  imprimir(moto.arrancar()); // "Honda arrancando con 2 ruedas."

  // Segundo parámetro (menos usado): descriptores de propiedad.
  const bici = Object.create(plantillaVehiculo, {
    marca: { value: 'Orbea', enumerable: true, writable: true },
    ruedas: { value: 2, enumerable: true, writable: false }, // writable:false = solo lectura
  });
  imprimir(bici.arrancar());
  // En modo estricto, escribir sobre una propiedad de solo lectura lanza error.
  try {
    bici.ruedas = 8;
  } catch (error) {
    imprimir('⚠ No se puede cambiar una propiedad writable:false ->', error.message);
  }

  // Caso especial: Object.create(null) crea un objeto SIN prototipo, un
  // "diccionario puro" sin toString ni nada heredado. Útil para mapas de datos.
  const diccionario = Object.create(null);
  diccionario.js = 'JavaScript';
  imprimir('Diccionario sin prototipo, ¿tiene toString?', typeof diccionario.toString); // "undefined"

  // ==========================================================================
  // 7. HERENCIA PROTOTÍPICA "A LA ANTIGUA" (ANTES DE ES6)
  // ==========================================================================
  // Así se hacía la herencia antes de que existieran `class` y `extends`.
  // Merece la pena verlo UNA vez: explica por qué `class` es solo azúcar.
  // Son tres pasos y ninguno se puede saltar.

  titulo('7. HERENCIA PROTOTÍPICA ANTES DE ES6');

  // --- Constructora "padre" ---
  function Empleado(nombre, salario) {
    this.nombre = nombre;
    this.salario = salario;
  }

  Empleado.prototype.presentarse = function () {
    return `Soy ${this.nombre} y cobro ${this.salario} EUR.`;
  };

  Empleado.prototype.subirSalario = function (porcentaje) {
    this.salario = Math.round(this.salario * (1 + porcentaje / 100));
    return this.salario;
  };

  // --- Constructora "hija" ---
  function Programadora(nombre, salario, lenguaje) {
    // PASO 1: llamar a la constructora padre con el `this` de la hija.
    // Es el equivalente antiguo de `super(nombre, salario)`.
    Empleado.call(this, nombre, salario);
    this.lenguaje = lenguaje; // Propiedad propia de la hija
  }

  // PASO 2: enlazar los prototipos para heredar los MÉTODOS.
  // ⚠️ ERROR COMÚN: escribir `Programadora.prototype = Empleado.prototype`.
  // Eso NO copia: comparte el mismo objeto, así que todo lo que añadas a la
  // hija aparecería también en el padre. Object.create crea un objeto NUEVO
  // que hereda del prototipo del padre. Esa es la diferencia.
  Programadora.prototype = Object.create(Empleado.prototype);

  // PASO 3: restaurar la propiedad `constructor`, que el paso 2 se llevó por
  // delante. Si no lo hacemos, programadora.constructor.name diría "Empleado".
  Programadora.prototype.constructor = Programadora;

  // Ahora sí: métodos propios de la hija.
  Programadora.prototype.programar = function () {
    return `${this.nombre} está escribiendo ${this.lenguaje}.`;
  };

  // Sobrescritura (polimorfismo): mismo nombre de método, comportamiento propio.
  Programadora.prototype.presentarse = function () {
    // Llamamos al método del padre "a mano" con call: el `super` de antaño.
    const base = Empleado.prototype.presentarse.call(this);
    return base + ` Programo en ${this.lenguaje}.`;
  };

  const marta = new Programadora('Marta Gil', 32000, 'JavaScript');

  imprimir(marta.presentarse());  // Método sobrescrito + llamada al padre
  imprimir(marta.programar());    // Método propio de la hija
  imprimir('Nuevo salario:', marta.subirSalario(10)); // Método heredado del padre

  imprimir('marta instanceof Programadora:', marta instanceof Programadora); // true
  imprimir('marta instanceof Empleado:', marta instanceof Empleado);         // true
  imprimir('marta.constructor.name:', marta.constructor.name);               // "Programadora"

  mostrarCadena(marta, 'marta (Programadora -> Empleado -> Object)');

  // ==========================================================================
  // 8. LO QUE NUNCA SE DEBE HACER
  // ==========================================================================

  titulo('8. AVISOS FINALES');

  // ⚠️ ERROR COMÚN / MALA PRÁCTICA GRAVE: modificar Object.prototype.
  //    Si escribes Object.prototype.miMetodo = ..., ese método aparece en
  //    TODOS los objetos del programa, incluidos los de las librerías, y
  //    contamina los bucles for...in. Nunca lo hagas.
  imprimir('⚠ Nunca añadas propiedades a Object.prototype: contamina TODO.');

  // ⚠️ Object.setPrototypeOf() existe, pero cambiar el prototipo de un objeto
  // ya creado degrada mucho el rendimiento. Si necesitas un prototipo distinto,
  // créalo directamente con Object.create() o con `class`.
  imprimir('⚠ Object.setPrototypeOf() funciona, pero es lento: evítalo.');

  imprimir('\n(Fin del archivo 02. Continúa en 03-clases.js)');

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
