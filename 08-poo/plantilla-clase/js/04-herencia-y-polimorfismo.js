/**
 * ============================================================================
 * ARCHIVO: js/04-herencia-y-polimorfismo.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Herencia con `extends` y `super()` en el constructor.
 *   2. `super.metodo()` para reutilizar el comportamiento del padre.
 *   3. Sobrescritura de métodos = POLIMORFISMO en acción.
 *   4. `instanceof` y otras formas de comprobar tipos en JavaScript.
 *   5. Clases abstractas SIMULADAS (JavaScript no las trae de serie).
 *   6. Composición frente a herencia, con mixins.
 *
 * QUÉ SE APRENDE
 *   A construir jerarquías de clases sin repetir código, a saber cuándo NO
 *   conviene heredar, y a escribir código que trata a objetos distintos
 *   exactamente igual (que es la magia del polimorfismo).
 *
 * (Envuelto en una IIFE para no chocar con las variables de los otros archivos.)
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y las utilidades (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/04-herencia-y-polimorfismo.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia.

  var ID_SALIDA = 'salida-04';

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

  const botonLimpiar = document.getElementById('limpiar-04');
  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. HERENCIA: extends Y super()
  // ==========================================================================
  // HERENCIA es el pilar que evita repetir código: una clase HIJA recibe todos
  // los campos y métodos de la clase PADRE, y encima añade los suyos.
  //
  // La prueba para saber si debes heredar es la frase "ES UN":
  //   Un Profesor ES UNA Persona  -> herencia correcta.
  //   Un Coche ES UN Motor        -> FALSO: un coche TIENE un motor -> composición.
  //
  // Palabras clave:
  //   extends -> "hereda de"
  //   super() -> llama al constructor del padre. Es OBLIGATORIO antes de usar
  //              `this` en el constructor de la hija.

  // TODO (en clase): la CLASE PADRE (también llamada base o superclase).
  //   1. titulo('1. HERENCIA CON extends Y super()').
  //   2. Declara `class Persona` con el campo privado `#dni;` (solo accesible
  //      dentro de ESTA clase) y:
  //        constructor(nombre, edad, dni) -> this.nombre, this.edad, this.#dni
  //        get dniOculto() -> devuelve '*****' + String(this.#dni).slice(-3)
  //             (mostramos solo los últimos 3: abstracción + privacidad).
  //        presentarse()   -> `Hola, soy ${this.nombre} y tengo ${this.edad} años.`
  //        cumplirAnios()  -> suma 1 a this.edad y devuelve this.edad
  //   (aprox. 18 lineas)

  // TODO (en clase): la CLASE HIJA (también llamada derivada o subclase).
  //   1. Declara `class Profesor extends Persona` con el campo privado
  //      `#asignaturas = [];` y:
  //        constructor(nombre, edad, dni, departamento):
  //           - primero  super(nombre, edad, dni);   // ejecuta el constructor de Persona
  //           - después  this.departamento = departamento;
  //          ⚠️ ERROR COMÚN: usar `this` ANTES de llamar a super(). El motor
  //          lanza "Must call super constructor ... before accessing 'this'".
  //        asignar(...materias) -> push con spread al array privado y devuelve
  //           this (el parámetro rest permite pasar tantas materias como queramos).
  //        get asignaturas() -> devuelve [...this.#asignaturas] (copia, para
  //           proteger el array interno).
  //        presentarse() -> SOBRESCRITURA + LLAMADA AL PADRE. Mismo nombre que
  //           en Persona: la versión de la hija "gana".
  //             const base = super.presentarse();   // ejecuta la versión del PADRE
  //             return `${base} Doy clase en ${this.departamento}.`;
  //        corregir(cantidad) -> `${this.nombre} ha corregido ${cantidad} exámenes.`
  //   (aprox. 24 lineas)

  // TODO (en clase): probar Profesor.
  //   1. const carla = new Profesor('Carla Ruiz', 41, '12345678Z', 'Informática');
  //      carla.asignar('JavaScript', 'Bases de datos');
  //   2. imprimir(carla.presentarse());              // sobrescrito (hija + padre)
  //      imprimir(carla.corregir(24));               // propio de la hija
  //      imprimir('Nueva edad:', carla.cumplirAnios());  // HEREDADO del padre
  //      imprimir('DNI protegido:', carla.dniOculto);    // getter heredado + privado
  //      imprimir('Asignaturas:', carla.asignaturas);
  //   Resultado esperado en pantalla:
  //        Hola, soy Carla Ruiz y tengo 41 años. Doy clase en Informática.
  //        Carla Ruiz ha corregido 24 exámenes.
  //        Nueva edad: 42 / DNI protegido: *****78Z / Asignaturas: ["JavaScript","Bases de datos"]
  //   (aprox. 7 lineas)

  // ⚠️ IMPORTANTE: los campos privados NO se heredan como "accesibles".
  // Profesor no puede escribir this.#dni: solo Persona puede tocarlo.
  // La hija accede a él a través de los getters públicos que el padre expone.

  // TODO (en clase): OTRA HIJA DEL MISMO PADRE.
  //   1. Declara `class Alumno extends Persona` con el campo privado `#notas = [];` y:
  //        constructor(nombre, edad, dni, curso) -> super(...) y this.curso.
  //        calificar(...notas) -> filtra con
  //             const validas = notas.filter((n) => typeof n === 'number' && n >= 0 && n <= 10);
  //           (encapsulamiento con validación), hace push con spread y devuelve this.
  //        get media() -> 0 si no hay notas; si no, reduce dividido entre length.
  //        presentarse() -> `${super.presentarse()} Estudio ${this.curso} y llevo
  //             una media de ${this.media.toFixed(2)}.`
  //   2. Pruébalo:
  //        const dani = new Alumno('Dani Pérez', 19, '87654321X', 'Full Stack 2');
  //        dani.calificar(7, 8.5, 9, 45);   // el 45 se descarta
  //        imprimir(dani.presentarse());
  //   Resultado esperado en pantalla: "Hola, soy Dani Pérez y tengo 19 años.
  //   Estudio Full Stack 2 y llevo una media de 8.17."
  //   (aprox. 22 lineas)

  // ==========================================================================
  // 2. POLIMORFISMO: LA MISMA ORDEN, DISTINTAS RESPUESTAS
  // ==========================================================================
  // "Polimorfismo" significa literalmente "muchas formas". En la práctica:
  // podemos meter objetos de clases distintas en un mismo array y llamar al
  // mismo método en todos, sin preguntar de qué clase es cada uno.
  // Cada objeto responde a su manera. Ese `if` que NO escribimos es la ganancia.

  // TODO (en clase):
  //   1. titulo('2. POLIMORFISMO EN ACCIÓN').
  //   2. Un array con tres tipos distintos... que se tratan igual:
  //        const personas = [
  //          new Persona('Rosa Marín', 55, '11111111A'),
  //          carla,
  //          dani,
  //        ];
  //   3. Recórrelo SIN un solo `if (persona es Profesor)`. Cada clase sabe cómo
  //      presentarse:
  //        personas.forEach(function (persona) { imprimir('- ' + persona.presentarse()); });
  //   4. Remata la idea con dos líneas de texto:
  //        imprimir('\nCon un if gigante habríamos escrito 3 ramas y habría que tocar');
  //        imprimir('el código cada vez que añadiéramos un tipo nuevo de persona.');
  //   5. El método elegido depende del OBJETO, no de la variable:
  //        const cualquiera = personas[1];   // Es un Profesor
  //        imprimir('\nMétodo ejecutado:', cualquiera.constructor.name)  -> "Profesor"
  //   Resultado esperado en pantalla: las tres presentaciones distintas (Rosa
  //   la básica, Carla con departamento y Dani con su media) y "Profesor".
  //   OJO: el array `personas` se reutiliza en la sección 3, déjalo declarado.
  //   (aprox. 12 lineas)

  // ==========================================================================
  // 3. instanceof Y LA COMPROBACIÓN DE TIPOS
  // ==========================================================================
  // `objeto instanceof Clase` pregunta: ¿está Clase.prototype en algún punto de
  // la cadena de prototipos del objeto? Por eso un Profesor es Profesor Y Persona.

  // TODO (en clase):
  //   1. titulo('3. instanceof Y COMPROBACIÓN DE TIPOS').
  //   2. Las cuatro comprobaciones sobre carla:
  //        imprimir('carla instanceof Profesor:', carla instanceof Profesor)  -> true
  //        imprimir('carla instanceof Persona: ', carla instanceof Persona)   -> true
  //        imprimir('carla instanceof Alumno:  ', carla instanceof Alumno)    -> false
  //        imprimir('carla instanceof Object:  ', carla instanceof Object)    -> true
  //   (aprox. 5 lineas)

  // TODO (en clase): typeof es mucho más pobre con los objetos: para él, todos
  // son "object".
  //   1. imprimir('\ntypeof carla:', typeof carla)                 -> "object"
  //      imprimir('typeof [1,2]:', typeof [1, 2])                   -> "object" (¡un array también!)
  //      imprimir('typeof null:', typeof null)                      -> "object" (bug histórico)
  //      imprimir('Array.isArray([1,2]):', Array.isArray([1, 2]))    -> true (la forma correcta)
  //   2. constructor.name da el nombre exacto de la clase (útil para depurar y
  //      para pintar etiquetas en la interfaz, como haremos en el proyecto):
  //        imprimir('\nNombre de clase de cada elemento del array:');
  //        personas.forEach((p) => imprimir(' -', p.nombre, '->', p.constructor.name));
  //   Resultado esperado en pantalla: los cuatro typeof y después
  //   "- Rosa Marín -> Persona", "- Carla Ruiz -> Profesor", "- Dani Pérez -> Alumno".
  //   (aprox. 7 lineas)

  // ⚠️ ERROR COMÚN: abusar de instanceof.
  //    if (a instanceof Profesor) { ... } else if (a instanceof Alumno) { ... }
  //    Si te ves escribiendo esa escalera, probablemente lo correcto sea
  //    POLIMORFISMO: añade un método a cada clase y llámalo sin preguntar.

  // ✅ BUENA PRÁCTICA alternativa (duck typing): "si nada como un pato y grazna
  //    como un pato, es un pato". Comprobamos si SABE HACER algo, no qué es.
  // TODO (en clase):
  //   1. Escribe `function intentarPresentar(objeto)` que devuelva
  //      objeto.presentarse() si `typeof objeto?.presentarse === 'function'`
  //      (el ?. evita reventar con null/undefined) y, si no,
  //      '(este objeto no sabe presentarse)'.
  //   2. Pruébala dos veces:
  //        imprimir('\nDuck typing con un objeto suelto:',
  //          intentarPresentar({ presentarse: () => 'Soy un objeto literal impostor.' }));
  //        imprimir('Duck typing con un número:', intentarPresentar(42));
  //   Resultado esperado en pantalla: "Soy un objeto literal impostor." y
  //   "(este objeto no sabe presentarse)".
  //   (aprox. 9 lineas)

  // ==========================================================================
  // 4. CLASES ABSTRACTAS SIMULADAS
  // ==========================================================================
  // Una clase ABSTRACTA es un molde incompleto: define qué deben saber hacer
  // sus hijas, pero no se puede instanciar directamente.
  // JavaScript NO tiene la palabra clave `abstract`, así que la simulamos con
  // dos trucos:
  //   a) `new.target` en el constructor -> si vale la clase base, lanzamos error.
  //   b) Métodos que lanzan error si la hija no los ha sobrescrito.

  // TODO (en clase):
  //   1. titulo('4. CLASES ABSTRACTAS SIMULADAS').
  //   2. Declara `class FiguraGeometrica`:
  //        constructor(nombre) -> new.target contiene la clase con la que se
  //          hizo `new`. Si alguien hace `new FiguraGeometrica()`, new.target
  //          === FiguraGeometrica; si hace `new Circulo()`, vale Circulo (y
  //          dejamos pasar). Por tanto:
  //            if (new.target === FiguraGeometrica) {
  //              throw new Error('FiguraGeometrica es abstracta: instancia Circulo o Rectangulo, no la base.');
  //            }
  //            this.nombre = nombre;
  //        area()      -> MÉTODO ABSTRACTO: obliga a las hijas a implementarlo.
  //            throw new Error(`La clase ${this.constructor.name} debe implementar el método area().`)
  //        perimetro() -> igual que area(), cambiando el nombre del método en el mensaje.
  //        describir() -> MÉTODO CONCRETO, este sí implementado y heredado por
  //            todas. Usa area() y perimetro() sin saber cómo los calcula cada
  //            hija (abstracción pura):
  //              `${this.nombre}: área ${this.area().toFixed(2)}, perímetro ${this.perimetro().toFixed(2)}`
  //   (aprox. 24 lineas)

  // TODO (en clase): las clases hijas.
  //   1. class Circulo extends FiguraGeometrica -> constructor(radio) llama a
  //      super('Círculo') y guarda this.radio; area() devuelve
  //      Math.PI * this.radio ** 2 (** es la potencia) y perimetro()
  //      2 * Math.PI * this.radio.
  //   2. class RectanguloGeom extends FiguraGeometrica -> constructor(ancho, alto)
  //      llama a super('Rectángulo'); area() ancho * alto; perimetro()
  //      2 * (ancho + alto).
  //   3. class TrianguloIncompleto extends FiguraGeometrica -> constructor(base,
  //      altura) llama a super('Triángulo'); area() (base * altura) / 2.
  //      Esta hija se "olvida" A PROPÓSITO de implementar perimetro(): heredará
  //      el del padre, que lanza error.
  //   (aprox. 30 lineas)

  // TODO (en clase): polimorfismo otra vez, mismo bucle y tres comportamientos.
  //   1. const figuras = [new Circulo(3), new RectanguloGeom(4, 6), new TrianguloIncompleto(5, 4)];
  //   2. Recórrelo con forEach envolviendo cada describir() en try/catch:
  //        try { imprimir('- ' + figura.describir()); }
  //        catch (error) { imprimir('⚠ ' + error.message); }
  //   3. Y comprueba que la clase base sigue siendo ininstanciable: dentro de
  //      otro try haz `new FiguraGeometrica('Genérica')` y captura el error con
  //        imprimir('⚠ ' + error.message)
  //   Resultado esperado en pantalla:
  //        - Círculo: área 28.27, perímetro 18.85
  //        - Rectángulo: área 24.00, perímetro 20.00
  //        ⚠ La clase TrianguloIncompleto debe implementar el método perimetro().
  //        ⚠ FiguraGeometrica es abstracta: instancia Circulo o Rectangulo, no la base.
  //   (aprox. 14 lineas)

  // ==========================================================================
  // 5. COMPOSICIÓN FRENTE A HERENCIA
  // ==========================================================================
  // La herencia es rígida: cada clase solo puede tener UN padre y arrastra
  // todo lo suyo, quiera o no. Cuando la jerarquía crece aparecen problemas:
  //
  //   Empleado -> EmpleadoRemoto -> EmpleadoRemotoConCoche -> ...
  //
  // ¿Y si un empleado de oficina también conduce? ¿Y si un cliente también?
  // La regla práctica del sector es:
  //   "Prefiere la COMPOSICIÓN a la herencia."
  //   Herencia  = "ES UN"  (un Profesor ES UNA Persona)
  //   Composición = "TIENE UN" o "SABE HACER" (un Empleado SABE conducir)

  // TODO (en clase): los MIXINS, objetos con habilidades sueltas listos para
  // "mezclar". Un mixin es un objeto normal lleno de métodos; con Object.assign
  // los copiamos al prototipo de la clase que queramos.
  //   1. titulo('5. COMPOSICIÓN Y MIXINS').
  //   2. Declara tres mixins como objetos literales:
  //        const puedeConducir  = { conducir() { return `${this.nombre} está conduciendo la furgoneta de reparto.`; } };
  //        const puedeFacturar  = { facturar(importe) { return `${this.nombre} emite una factura de ${importe.toFixed(2)} EUR.`; } };
  //        const puedeProgramar = { programar(lenguaje) { return `${this.nombre} programa en ${lenguaje}.`; } };
  //   3. Declara `class Trabajador` con constructor(nombre) y el método
  //      fichar() -> `${this.nombre} ha fichado.`
  //   4. Y dos hijas VACÍAS: `class Repartidor extends Trabajador {}` y
  //      `class Freelance extends Trabajador {}`.
  //   (aprox. 22 lineas)

  // TODO (en clase): mezclar las habilidades y probarlas.
  //   1. Object.assign(destino, ...origenes) copia las propiedades de los
  //      objetos origen dentro del destino:
  //        Object.assign(Repartidor.prototype, puedeConducir);
  //        Object.assign(Freelance.prototype, puedeFacturar, puedeProgramar);  // ¡dos a la vez!
  //   2. const nerea = new Repartidor('Nerea Soto');
  //      const ivan  = new Freelance('Iván Ledesma');
  //   3. imprimir(nerea.fichar());              // heredado por extends
  //      imprimir(nerea.conducir());            // añadido por mixin
  //      imprimir(ivan.facturar(450.5));        // mixin 1
  //      imprimir(ivan.programar('JavaScript')); // mixin 2
  //   4. imprimir('\n¿El repartidor sabe facturar?', typeof nerea.facturar)  -> "undefined"
  //      imprimir('Cada clase recibe SOLO las habilidades que necesita.')
  //   Resultado esperado en pantalla:
  //        Nerea Soto ha fichado. / Nerea Soto está conduciendo la furgoneta de reparto.
  //        Iván Ledesma emite una factura de 450.50 EUR. / Iván Ledesma programa en JavaScript.
  //        ¿El repartidor sabe facturar? undefined
  //   (aprox. 10 lineas)

  // TODO (en clase): COMPOSICIÓN "TIENE UN", un objeto dentro de otro.
  // Alternativa aún más limpia que los mixins en muchos casos.
  //   1. class Motor -> constructor(caballos) guarda this.caballos y
  //      this.encendido = false; encender() pone encendido en true y devuelve
  //      `Motor de ${this.caballos} CV en marcha.`
  //   2. class Coche -> el coche TIENE un motor: NO hereda de él (un coche no
  //      ES un motor). constructor(marca, caballos) guarda this.marca y
  //      this.motor = new Motor(caballos);  arrancar() DELEGA el trabajo en el
  //      objeto que sabe hacerlo: `${this.marca}: ` + this.motor.encender()
  //   3. const seat = new Coche('Seat León', 150);
  //      imprimir('\n' + seat.arrancar());
  //      imprimir('¿El coche es un Motor?', seat instanceof Motor)  -> false, y está bien
  //   Resultado esperado en pantalla: "Seat León: Motor de 150 CV en marcha."
  //   y "¿El coche es un Motor? false".
  //   (aprox. 22 lineas)

  // Tabla mental para la clase:
  //   ¿"X ES UN Y"?      -> extends
  //   ¿"X TIENE UN Y"?   -> propiedad (composición)
  //   ¿"X SABE HACER Y"? -> mixin

  // TODO (en clase): cierra el archivo con
  //   imprimir('\n(Fin del archivo 04. Continúa en 05-this-bind-call-apply.js)');
  //   (aprox. 1 linea)

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) HERENCIA BÁSICA.
  //    Crea la clase `Vehiculo` (marca, modelo, ruedas) con el método
  //    `describir()`. Deriva `Motocicleta` (2 ruedas, con cilindrada) y
  //    `Camion` (6 ruedas, con cargaMaxima). Ambas deben llamar a super() y
  //    sobrescribir `describir()` reutilizando el del padre con super.
  //
  // 2) POLIMORFISMO.
  //    Mete cinco vehículos mezclados en un array y recórrelo con forEach
  //    llamando a `describir()`. No puedes usar ningún `if` ni `instanceof`.
  //
  // 3) CLASE ABSTRACTA.
  //    Escribe la clase abstracta `MetodoDePago` que impida instanciarse y que
  //    obligue a implementar `pagar(importe)`. Crea `TarjetaCredito` (añade una
  //    comisión del 2%) y `Efectivo` (sin comisión). Prueba también a crear una
  //    clase hija que NO implemente pagar() y captura el error con try/catch.
  //
  // 4) MIXIN.
  //    Crea los mixins `puedeNadar`, `puedeVolar` y `puedeCorrer`. Aplícalos a
  //    las clases `Pato` (los tres), `Aguila` (volar y correr) y `Tiburon`
  //    (solo nadar), todas hijas de `Animal`. Muestra qué sabe hacer cada una.
  //
  // 5) RETO (difícil).
  //    Refactoriza esta jerarquía forzada usando composición:
  //       Empleado -> EmpleadoConCoche -> EmpleadoConCocheYPortatil
  //    Diseña una clase `Empleado` que reciba en el constructor un array de
  //    "equipamientos" (objetos con un método `usar()`) y un método
  //    `usarTodo()` que los recorra. Explica en un comentario por qué esta
  //    versión es más flexible que la cadena de herencia original.
  // ==========================================================================
})();
