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
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL
  // ==========================================================================
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

  titulo('1. HERENCIA CON extends Y super()');

  // ---------- CLASE PADRE (también llamada base o superclase) ----------
  class Persona {
    #dni; // Campo privado: solo accesible dentro de ESTA clase

    constructor(nombre, edad, dni) {
      this.nombre = nombre;
      this.edad = edad;
      this.#dni = dni;
    }

    get dniOculto() {
      // Mostramos solo los últimos 3 caracteres: abstracción + privacidad.
      return '*****' + String(this.#dni).slice(-3);
    }

    presentarse() {
      return `Hola, soy ${this.nombre} y tengo ${this.edad} años.`;
    }

    cumplirAnios() {
      this.edad += 1;
      return this.edad;
    }
  }

  // ---------- CLASE HIJA (también llamada derivada o subclase) ----------
  class Profesor extends Persona {
    #asignaturas = [];

    constructor(nombre, edad, dni, departamento) {
      // ⚠️ ERROR COMÚN: usar `this` antes de llamar a super().
      // El motor lanza "Must call super constructor ... before accessing 'this'".
      super(nombre, edad, dni); // Ejecuta el constructor de Persona

      // A partir de aquí `this` ya existe y podemos añadir lo nuestro.
      this.departamento = departamento;
    }

    asignar(...materias) {
      // El parámetro rest permite pasar tantas materias como queramos.
      this.#asignaturas.push(...materias);
      return this;
    }

    get asignaturas() {
      return [...this.#asignaturas]; // Copia, para proteger el array interno
    }

    // ---- SOBRESCRITURA + LLAMADA AL PADRE ----
    // Mismo nombre que en Persona: la versión de la hija "gana".
    presentarse() {
      // super.presentarse() ejecuta la versión del PADRE. Así reutilizamos su
      // trabajo en lugar de copiar y pegar su texto.
      const base = super.presentarse();
      return `${base} Doy clase en ${this.departamento}.`;
    }

    corregir(cantidad) {
      return `${this.nombre} ha corregido ${cantidad} exámenes.`;
    }
  }

  const carla = new Profesor('Carla Ruiz', 41, '12345678Z', 'Informática');
  carla.asignar('JavaScript', 'Bases de datos');

  imprimir(carla.presentarse());       // Método sobrescrito (hija + padre)
  imprimir(carla.corregir(24));        // Método propio de la hija
  imprimir('Nueva edad:', carla.cumplirAnios()); // Método HEREDADO del padre
  imprimir('DNI protegido:', carla.dniOculto);   // Getter heredado con campo privado
  imprimir('Asignaturas:', carla.asignaturas);

  // ⚠️ IMPORTANTE: los campos privados NO se heredan como "accesibles".
  // Profesor no puede escribir this.#dni: solo Persona puede tocarlo.
  // La hija accede a él a través de los getters públicos que el padre expone.

  // ---------- OTRA HIJA DEL MISMO PADRE ----------
  class Alumno extends Persona {
    #notas = [];

    constructor(nombre, edad, dni, curso) {
      super(nombre, edad, dni);
      this.curso = curso;
    }

    calificar(...notas) {
      // filter deja pasar solo las notas válidas: encapsulamiento con validación.
      const validas = notas.filter((n) => typeof n === 'number' && n >= 0 && n <= 10);
      this.#notas.push(...validas);
      return this;
    }

    get media() {
      if (this.#notas.length === 0) return 0;
      return this.#notas.reduce((t, n) => t + n, 0) / this.#notas.length;
    }

    presentarse() {
      return `${super.presentarse()} Estudio ${this.curso} y llevo una media de ${this.media.toFixed(2)}.`;
    }
  }

  const dani = new Alumno('Dani Pérez', 19, '87654321X', 'Full Stack 2');
  dani.calificar(7, 8.5, 9, 45); // el 45 se descarta
  imprimir(dani.presentarse());

  // ==========================================================================
  // 2. POLIMORFISMO: LA MISMA ORDEN, DISTINTAS RESPUESTAS
  // ==========================================================================
  // "Polimorfismo" significa literalmente "muchas formas". En la práctica:
  // podemos meter objetos de clases distintas en un mismo array y llamar al
  // mismo método en todos, sin preguntar de qué clase es cada uno.
  // Cada objeto responde a su manera. Ese `if` que NO escribimos es la ganancia.

  titulo('2. POLIMORFISMO EN ACCIÓN');

  // Un array con tres tipos distintos... que se tratan igual.
  const personas = [
    new Persona('Rosa Marín', 55, '11111111A'),
    carla,
    dani,
  ];

  personas.forEach(function (persona) {
    // Ni un solo `if (persona es Profesor)`. Cada clase sabe cómo presentarse.
    imprimir('- ' + persona.presentarse());
  });

  imprimir('\nCon un if gigante habríamos escrito 3 ramas y habría que tocar');
  imprimir('el código cada vez que añadiéramos un tipo nuevo de persona.');

  // Demostración de que el método elegido depende del objeto, no de la variable:
  const cualquiera = personas[1]; // Es un Profesor
  imprimir('\nMétodo ejecutado:', cualquiera.constructor.name);

  // ==========================================================================
  // 3. instanceof Y LA COMPROBACIÓN DE TIPOS
  // ==========================================================================
  // `objeto instanceof Clase` pregunta: ¿está Clase.prototype en algún punto de
  // la cadena de prototipos del objeto? Por eso un Profesor es Profesor Y Persona.

  titulo('3. instanceof Y COMPROBACIÓN DE TIPOS');

  imprimir('carla instanceof Profesor:', carla instanceof Profesor); // true
  imprimir('carla instanceof Persona: ', carla instanceof Persona);  // true
  imprimir('carla instanceof Alumno:  ', carla instanceof Alumno);   // false
  imprimir('carla instanceof Object:  ', carla instanceof Object);   // true (todo hereda de Object)

  // typeof es mucho más pobre con los objetos: para él, todos son "object".
  imprimir('\ntypeof carla:', typeof carla);        // "object"
  imprimir('typeof [1,2]:', typeof [1, 2]);          // "object" (¡un array también!)
  imprimir('typeof null:', typeof null);             // "object" (bug histórico del lenguaje)
  imprimir('Array.isArray([1,2]):', Array.isArray([1, 2])); // true <- la forma correcta

  // constructor.name da el nombre exacto de la clase (útil para depurar y para
  // pintar etiquetas en la interfaz, como haremos en el proyecto).
  imprimir('\nNombre de clase de cada elemento del array:');
  personas.forEach((p) => imprimir(' -', p.nombre, '->', p.constructor.name));

  // ⚠️ ERROR COMÚN: abusar de instanceof.
  //    if (a instanceof Profesor) { ... } else if (a instanceof Alumno) { ... }
  //    Si te ves escribiendo esa escalera, probablemente lo correcto sea
  //    POLIMORFISMO: añade un método a cada clase y llámalo sin preguntar.

  // ✅ BUENA PRÁCTICA alternativa (duck typing): "si nada como un pato y grazna
  //    como un pato, es un pato". Comprobamos si SABE HACER algo, no qué es.
  function intentarPresentar(objeto) {
    if (typeof objeto?.presentarse === 'function') {
      return objeto.presentarse();
    }
    return '(este objeto no sabe presentarse)';
  }
  imprimir('\nDuck typing con un objeto suelto:',
    intentarPresentar({ presentarse: () => 'Soy un objeto literal impostor.' }));
  imprimir('Duck typing con un número:', intentarPresentar(42));

  // ==========================================================================
  // 4. CLASES ABSTRACTAS SIMULADAS
  // ==========================================================================
  // Una clase ABSTRACTA es un molde incompleto: define qué deben saber hacer
  // sus hijas, pero no se puede instanciar directamente.
  // JavaScript NO tiene la palabra clave `abstract`, así que la simulamos con
  // dos trucos:
  //   a) `new.target` en el constructor -> si vale la clase base, lanzamos error.
  //   b) Métodos que lanzan error si la hija no los ha sobrescrito.

  titulo('4. CLASES ABSTRACTAS SIMULADAS');

  class FiguraGeometrica {
    constructor(nombre) {
      // new.target contiene la clase con la que se hizo `new`.
      // Si alguien hace `new FiguraGeometrica()`, new.target === FiguraGeometrica.
      // Si hace `new Circulo()`, new.target === Circulo (y dejamos pasar).
      if (new.target === FiguraGeometrica) {
        throw new Error(
          'FiguraGeometrica es abstracta: instancia Circulo o Rectangulo, no la base.'
        );
      }
      this.nombre = nombre;
    }

    // MÉTODO ABSTRACTO: obliga a las hijas a implementarlo.
    area() {
      throw new Error(
        `La clase ${this.constructor.name} debe implementar el método area().`
      );
    }

    perimetro() {
      throw new Error(
        `La clase ${this.constructor.name} debe implementar el método perimetro().`
      );
    }

    // MÉTODO CONCRETO: este sí está implementado y lo heredan todas.
    // Fíjate en que usa area() y perimetro() sin saber cómo los calculará
    // cada hija. Eso es abstracción pura.
    describir() {
      return `${this.nombre}: área ${this.area().toFixed(2)}, perímetro ${this.perimetro().toFixed(2)}`;
    }
  }

  class Circulo extends FiguraGeometrica {
    constructor(radio) {
      super('Círculo');
      this.radio = radio;
    }
    area() {
      return Math.PI * this.radio ** 2; // ** es la potencia
    }
    perimetro() {
      return 2 * Math.PI * this.radio;
    }
  }

  class RectanguloGeom extends FiguraGeometrica {
    constructor(ancho, alto) {
      super('Rectángulo');
      this.ancho = ancho;
      this.alto = alto;
    }
    area() {
      return this.ancho * this.alto;
    }
    perimetro() {
      return 2 * (this.ancho + this.alto);
    }
  }

  // Esta hija se "olvida" a propósito de implementar perimetro().
  class TrianguloIncompleto extends FiguraGeometrica {
    constructor(base, altura) {
      super('Triángulo');
      this.base = base;
      this.altura = altura;
    }
    area() {
      return (this.base * this.altura) / 2;
    }
    // Falta perimetro() -> heredará el del padre, que lanza error.
  }

  // Polimorfismo otra vez: mismo bucle, tres comportamientos.
  const figuras = [new Circulo(3), new RectanguloGeom(4, 6), new TrianguloIncompleto(5, 4)];

  figuras.forEach(function (figura) {
    try {
      imprimir('- ' + figura.describir());
    } catch (error) {
      imprimir('⚠ ' + error.message);
    }
  });

  // Y la clase base sigue siendo ininstanciable:
  try {
    const imposible = new FiguraGeometrica('Genérica');
    imprimir('Esto nunca se imprime', imposible);
  } catch (error) {
    imprimir('⚠ ' + error.message);
  }

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

  titulo('5. COMPOSICIÓN Y MIXINS');

  // --- MIXINS: objetos con habilidades sueltas, listos para "mezclar" ---
  // Un mixin es un objeto normal lleno de métodos. Con Object.assign los
  // copiamos al prototipo de la clase que queramos.

  const puedeConducir = {
    conducir() {
      return `${this.nombre} está conduciendo la furgoneta de reparto.`;
    },
  };

  const puedeFacturar = {
    facturar(importe) {
      // toFixed(2) formatea con dos decimales.
      return `${this.nombre} emite una factura de ${importe.toFixed(2)} EUR.`;
    },
  };

  const puedeProgramar = {
    programar(lenguaje) {
      return `${this.nombre} programa en ${lenguaje}.`;
    },
  };

  class Trabajador {
    constructor(nombre) {
      this.nombre = nombre;
    }
    fichar() {
      return `${this.nombre} ha fichado.`;
    }
  }

  class Repartidor extends Trabajador {}
  class Freelance extends Trabajador {}

  // "Mezclamos" habilidades en cada clase. Object.assign(destino, ...origenes)
  // copia las propiedades de los objetos origen dentro del destino.
  Object.assign(Repartidor.prototype, puedeConducir);
  Object.assign(Freelance.prototype, puedeFacturar, puedeProgramar); // ¡dos a la vez!

  const nerea = new Repartidor('Nerea Soto');
  const ivan = new Freelance('Iván Ledesma');

  imprimir(nerea.fichar());           // Heredado por extends
  imprimir(nerea.conducir());         // Añadido por mixin
  imprimir(ivan.facturar(450.5));     // Mixin 1
  imprimir(ivan.programar('JavaScript')); // Mixin 2

  imprimir('\n¿El repartidor sabe facturar?', typeof nerea.facturar); // "undefined"
  imprimir('Cada clase recibe SOLO las habilidades que necesita.');

  // --- COMPOSICIÓN "TIENE UN": un objeto dentro de otro ---
  // Alternativa aún más limpia que los mixins en muchos casos.
  class Motor {
    constructor(caballos) {
      this.caballos = caballos;
      this.encendido = false;
    }
    encender() {
      this.encendido = true;
      return `Motor de ${this.caballos} CV en marcha.`;
    }
  }

  class Coche {
    // El coche TIENE un motor: no hereda de él (un coche NO es un motor).
    constructor(marca, caballos) {
      this.marca = marca;
      this.motor = new Motor(caballos); // Composición
    }
    arrancar() {
      // Delegamos el trabajo en el objeto que sabe hacerlo.
      return `${this.marca}: ` + this.motor.encender();
    }
  }

  const seat = new Coche('Seat León', 150);
  imprimir('\n' + seat.arrancar());
  imprimir('¿El coche es un Motor?', seat instanceof Motor); // false, y está bien

  // Tabla mental para la clase:
  //   ¿"X ES UN Y"?      -> extends
  //   ¿"X TIENE UN Y"?   -> propiedad (composición)
  //   ¿"X SABE HACER Y"? -> mixin

  imprimir('\n(Fin del archivo 04. Continúa en 05-this-bind-call-apply.js)');

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
