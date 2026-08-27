/**
 * ============================================================================
 * ARCHIVO: js/03-clases.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. La sintaxis `class` de ES6 y por qué se dice que es "azúcar sintáctico".
 *   2. constructor, métodos de instancia y campos de clase.
 *   3. Getters y setters con get/set, y la validación dentro del setter.
 *   4. Miembros estáticos (static): métodos, propiedades y contadores.
 *   5. Campos y métodos privados con `#`, frente a la vieja convención `_`.
 *   6. Detalles finos: toString, clases como expresión, hoisting (TDZ).
 *
 * QUÉ SE APRENDE
 *   A escribir clases modernas, seguras y legibles, entendiendo que por debajo
 *   sigue funcionando exactamente el mecanismo de prototipos del archivo 02.
 *
 * (Envuelto en una IIFE para no chocar con las variables de los otros archivos.)
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL
  // ==========================================================================
  var ID_SALIDA = 'salida-03';

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

  const botonLimpiar = document.getElementById('limpiar-03');
  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. `class` ES AZÚCAR SINTÁCTICO
  // ==========================================================================
  // "Azúcar sintáctico" significa: sintaxis más agradable para hacer algo que
  // ya se podía hacer, pero de forma más fea. Una `class` de ES6 NO introduce
  // un sistema de objetos nuevo: sigue creando una FUNCIÓN cuyo `prototype`
  // guarda los métodos, exactamente como en el archivo 02.
  //
  // Analogía: es como pasar de escribir una carta a mano a usar una plantilla
  // de Word. El resultado (la carta) es el mismo; lo que cambia es la comodidad.

  titulo('1. class ES AZÚCAR SINTÁCTICO');

  class Saludador {
    constructor(nombre) {
      this.nombre = nombre;
    }
    saludar() {
      return 'Hola, ' + this.nombre;
    }
  }

  const s1 = new Saludador('Ana');
  const s2 = new Saludador('Luis');

  // Prueba nº1: una clase ES una función.
  imprimir('typeof Saludador:', typeof Saludador); // "function"

  // Prueba nº2: los métodos viven en el prototype, igual que antes.
  imprimir('¿saludar está en Saludador.prototype?',
    typeof Saludador.prototype.saludar === 'function'); // true

  // Prueba nº3: todas las instancias comparten la MISMA función (ahorro de memoria
  // automático: con `class` ya no hay que acordarse de ponerlo en el prototype).
  imprimir('¿s1.saludar === s2.saludar?', s1.saludar === s2.saludar); // true

  imprimir(s1.saludar(), '|', s2.saludar());

  // Diferencias reales (no son solo azúcar, hay extras de seguridad):
  //   a) Una clase SIEMPRE se ejecuta en modo estricto.
  //   b) Una clase NO se puede llamar sin `new`.
  try {
    Saludador('Ana'); // sin new
  } catch (error) {
    imprimir('⚠ Llamar a una clase sin new:', error.message);
  }
  //   c) Las clases NO se "hoistean" como las funciones: no puedes usarlas
  //      antes de declararlas (están en la "zona muerta temporal" o TDZ).

  // ==========================================================================
  // 2. UNA CLASE COMPLETA: constructor, campos y métodos
  // ==========================================================================
  // Vocabulario que hay que fijar en clase:
  //   - CLASE:      el molde o plano (los planos de una casa).
  //   - INSTANCIA:  el objeto concreto fabricado con ese molde (una casa real).
  //   - CONSTRUCTOR: el método especial que se ejecuta al hacer `new`.
  //   - CAMPO DE CLASE: propiedad declarada directamente en el cuerpo de la
  //     clase, sin necesidad de escribirla dentro del constructor.

  titulo('2. CONSTRUCTOR, CAMPOS Y MÉTODOS');

  class Estudiante {
    // --- CAMPOS DE CLASE (ES2022) ---
    // Se asignan a CADA instancia justo antes de ejecutar el constructor.
    // Sirven para dar valores por defecto sin ensuciar el constructor.
    curso = 'Full Stack 2';
    notas = [];          // ⚠️ OJO: cada instancia recibe SU PROPIO array (correcto)
    activo = true;

    constructor(nombre, edad) {
      // El constructor recibe los datos que varían de un objeto a otro.
      this.nombre = nombre;
      this.edad = edad;
    }

    // --- MÉTODOS DE INSTANCIA ---
    // Van SIN la palabra `function` y SIN comas entre ellos (error típico).
    agregarNota(nota) {
      // Validación simple: solo aceptamos números entre 0 y 10.
      if (typeof nota !== 'number' || Number.isNaN(nota) || nota < 0 || nota > 10) {
        imprimir('⚠ Nota inválida, se ignora:', nota);
        return this;
      }
      this.notas.push(nota);
      return this; // Devolver `this` permite encadenar: .agregarNota(8).agregarNota(9)
    }

    promedio() {
      if (this.notas.length === 0) return 0;
      const suma = this.notas.reduce((total, nota) => total + nota, 0);
      return suma / this.notas.length;
    }

    aprobado() {
      return this.promedio() >= 5;
    }

    ficha() {
      const estado = this.aprobado() ? 'APROBADO' : 'SUSPENSO';
      return `${this.nombre} (${this.edad}) - ${this.curso} - media ${this.promedio().toFixed(2)} [${estado}]`;
    }
  }

  const ana = new Estudiante('Ana Torres', 20);
  ana.agregarNota(8).agregarNota(9.5).agregarNota(7).agregarNota(15); // el 15 se rechaza
  imprimir(ana.ficha());

  const luis = new Estudiante('Luis Ramírez', 22);
  luis.agregarNota(3).agregarNota(4.5);
  imprimir(luis.ficha());

  // Cada instancia tiene su propio array de notas (no se comparten):
  imprimir('Notas de Ana:', ana.notas);
  imprimir('Notas de Luis:', luis.notas);

  // ==========================================================================
  // 3. GETTERS Y SETTERS
  // ==========================================================================
  // Un GETTER es un método que se LEE como si fuera una propiedad.
  // Un SETTER es un método que se ejecuta al ASIGNAR una propiedad.
  // ¿Para qué sirven? Para el ENCAPSULAMIENTO: por fuera parece un dato
  // sencillo, pero por dentro podemos validar, calcular o registrar.
  //
  // Analogía: el termostato de casa. Giras la rueda (setter) y él decide si
  // el valor es razonable; miras la pantalla (getter) y él calcula qué mostrar.

  titulo('3. GETTERS Y SETTERS');

  class Temperatura {
    // Campo privado (lo explicamos en la sección 5): guarda los grados reales.
    #celsius = 0;

    constructor(celsius) {
      // ✅ BUENA PRÁCTICA: usar el SETTER también dentro del constructor, para
      // que la validación se aplique desde el primer momento.
      this.celsius = celsius;
    }

    // GETTER: se invoca al escribir objeto.celsius (SIN paréntesis).
    get celsius() {
      return this.#celsius;
    }

    // SETTER: se invoca al escribir objeto.celsius = valor.
    set celsius(valor) {
      if (typeof valor !== 'number' || Number.isNaN(valor)) {
        // Lanzar un error es correcto cuando el dato es inaceptable.
        throw new TypeError('La temperatura debe ser un número.');
      }
      if (valor < -273.15) {
        throw new RangeError('Por debajo del cero absoluto no existe temperatura.');
      }
      this.#celsius = valor;
    }

    // GETTER CALCULADO: no guarda nada, calcula al vuelo. Muy habitual.
    get fahrenheit() {
      return this.#celsius * 9 / 5 + 32;
    }

    // Y su setter correspondiente: escribimos en F, guardamos en C.
    set fahrenheit(valor) {
      this.celsius = (valor - 32) * 5 / 9; // Reutiliza la validación del setter celsius
    }

    // Getter de solo lectura: no tiene setter, así que no se puede asignar.
    get descripcion() {
      if (this.#celsius <= 0) return 'Helada';
      if (this.#celsius < 15) return 'Fría';
      if (this.#celsius < 26) return 'Agradable';
      return 'Calurosa';
    }
  }

  const hoy = new Temperatura(22);
  imprimir('Celsius:', hoy.celsius);           // 22   <- getter, sin ()
  imprimir('Fahrenheit:', hoy.fahrenheit);     // 71.6 <- getter calculado
  imprimir('Descripción:', hoy.descripcion);   // "Agradable"

  hoy.celsius = 30;                            // <- setter
  imprimir('Tras subir a 30 ->', hoy.fahrenheit.toFixed(1), 'F,', hoy.descripcion);

  hoy.fahrenheit = 50;                         // <- setter inverso
  imprimir('Tras poner 50 F ->', hoy.celsius.toFixed(1), 'C,', hoy.descripcion);

  // La validación protege el objeto de datos absurdos:
  try {
    hoy.celsius = 'mucho calor';
  } catch (error) {
    imprimir('⚠ Setter rechazó el valor:', error.message);
  }
  try {
    hoy.celsius = -400;
  } catch (error) {
    imprimir('⚠ Setter rechazó el valor:', error.message);
  }
  imprimir('El objeto sigue intacto:', hoy.celsius.toFixed(1), 'C');

  // ⚠️ ERROR COMÚN Nº1: llamar al getter con paréntesis -> hoy.celsius() falla
  //    con "is not a function", porque el getter ya devolvió un número.
  // ⚠️ ERROR COMÚN Nº2: recursión infinita. Si dentro de `set celsius` escribes
  //    `this.celsius = valor` te llamas a ti mismo sin fin ("Maximum call stack
  //    size exceeded"). Por eso el setter guarda en un campo DISTINTO (#celsius).
  // ⚠️ ERROR COMÚN Nº3: asignar a un getter sin setter. En modo estricto lanza
  //    error; en modo normal falla en silencio, que es aún peor.
  try {
    hoy.descripcion = 'Tropical'; // No hay `set descripcion`
  } catch (error) {
    imprimir('⚠ No se puede asignar a un getter sin setter:', error.message);
  }

  // ==========================================================================
  // 4. MIEMBROS ESTÁTICOS (static)
  // ==========================================================================
  // Un miembro `static` pertenece a la CLASE, no a las instancias.
  // Se llama con NombreDeClase.miembro, nunca con instancia.miembro.
  //
  // ¿Cuándo se usan?
  //   - Contadores globales (cuántos objetos se han creado).
  //   - Constantes de configuración compartidas (IVA, límites).
  //   - Funciones de utilidad relacionadas con la clase que NO necesitan
  //     un objeto concreto (validadores, comparadores, "fábricas").
  // Ejemplos que ya conoces: Math.random(), Array.isArray(), Object.keys().

  titulo('4. MIEMBROS ESTÁTICOS');

  class Matricula {
    // --- PROPIEDADES ESTÁTICAS ---
    static PRECIO_BASE = 300;      // Constante compartida por toda la clase
    static contador = 0;           // Contador de matrículas creadas
    static #registro = [];         // Estática Y privada: solo la clase la ve

    constructor(alumno, creditos) {
      this.alumno = alumno;
      this.creditos = creditos;

      // Cada vez que se crea una instancia tocamos el contador de la CLASE.
      // ✅ BUENA PRÁCTICA: referirse a la clase por su nombre (Matricula.x),
      // no con this.constructor.x, salvo que quieras contadores por subclase.
      Matricula.contador += 1;
      this.numero = Matricula.contador;
      Matricula.#registro.push(alumno);
    }

    // --- MÉTODO DE INSTANCIA: usa los datos de ESTE objeto ---
    importe() {
      return Matricula.PRECIO_BASE + this.creditos * Matricula.PRECIO_CREDITO;
    }

    // --- MÉTODOS ESTÁTICOS: utilidades que no necesitan una instancia ---
    static resumen() {
      return `Se han emitido ${Matricula.contador} matrículas.`;
    }

    static ultimoAlumno() {
      // Accede a la estática privada: imposible desde fuera de la clase.
      return Matricula.#registro[Matricula.#registro.length - 1] ?? '(ninguno)';
    }

    // Método estático "fábrica": otra forma de construir objetos con nombre
    // descriptivo. Se lee mucho mejor que un `new` con parámetros mágicos.
    static matriculaCompleta(alumno) {
      return new Matricula(alumno, 60); // 60 créditos = curso completo
    }

    // GETTER ESTÁTICO: se lee como propiedad de la clase.
    static get hayMatriculas() {
      return Matricula.contador > 0;
    }
  }

  // Las propiedades estáticas también se pueden añadir después de la clase.
  Matricula.PRECIO_CREDITO = 12;

  imprimir('¿Hay matrículas antes de crear ninguna?', Matricula.hayMatriculas); // false

  const m1 = new Matricula('Ana Torres', 30);
  const m2 = new Matricula('Luis Ramírez', 45);
  const m3 = Matricula.matriculaCompleta('Marta Gil'); // usando la fábrica estática

  imprimir(`Matrícula ${m1.numero} de ${m1.alumno}: ${m1.importe()} EUR`);
  imprimir(`Matrícula ${m2.numero} de ${m2.alumno}: ${m2.importe()} EUR`);
  imprimir(`Matrícula ${m3.numero} de ${m3.alumno}: ${m3.importe()} EUR`);
  imprimir(Matricula.resumen());                  // "Se han emitido 3 matrículas."
  imprimir('Último alumno:', Matricula.ultimoAlumno());
  imprimir('¿Hay matrículas ahora?', Matricula.hayMatriculas); // true

  // ⚠️ ERROR COMÚN: llamar a un método estático desde una instancia.
  imprimir('¿m1.resumen existe?', typeof m1.resumen); // "undefined"
  imprimir('Los métodos static NO están en las instancias, solo en la clase.');

  // ==========================================================================
  // 5. CAMPOS Y MÉTODOS PRIVADOS CON #
  // ==========================================================================
  // Un miembro que empieza por `#` SOLO es accesible desde dentro del cuerpo de
  // la clase. Es privacidad REAL, garantizada por el lenguaje: no es un acuerdo
  // entre programadores, es una barrera que el motor hace cumplir.
  //
  // Antes de ES2022 se usaba la convención del guion bajo: `this._saldo`.
  // Eso significaba "por favor, no toques esto", pero nada lo impedía.

  titulo('5. CAMPOS PRIVADOS CON # (vs. la convención _)');

  class CuentaBancaria {
    // --- CAMPOS PRIVADOS: hay que DECLARARLOS aquí arriba, obligatoriamente ---
    #saldo = 0;
    #movimientos = [];
    #pin;

    // La convención antigua, para comparar en clase:
    _titularAntiguo = 'convención con guion bajo (NO protege nada)';

    static #tipoInteres = 0.02; // Estática privada

    constructor(titular, saldoInicial, pin) {
      this.titular = titular;         // Pública: se puede leer y escribir
      this.#pin = pin;                // Privada: nadie la verá desde fuera
      if (saldoInicial > 0) this.#saldo = saldoInicial;
      this.#anotar('apertura', saldoInicial);
    }

    // --- MÉTODO PRIVADO: uso interno, no forma parte de la "interfaz pública" ---
    // ABSTRACCIÓN: quien usa la cuenta no necesita saber que existe.
    #anotar(tipo, cantidad) {
      this.#movimientos.push({
        tipo: tipo,
        cantidad: cantidad,
        // toLocaleTimeString formatea la hora según el idioma del navegador.
        hora: new Date().toLocaleTimeString('es-ES'),
      });
    }

    #validarCantidad(cantidad) {
      return typeof cantidad === 'number' && !Number.isNaN(cantidad) && cantidad > 0;
    }

    // --- INTERFAZ PÚBLICA: los "botones" que sí puede pulsar quien nos usa ---
    get saldo() {
      return this.#saldo; // Solo lectura: no hay `set saldo`
    }

    get movimientos() {
      // Devolvemos una COPIA: si devolviéramos el array real, cualquiera podría
      // hacer cuenta.movimientos.push(...) y falsear el historial.
      return this.#movimientos.map((m) => ({ ...m }));
    }

    ingresar(cantidad) {
      if (!this.#validarCantidad(cantidad)) {
        imprimir('⚠ Ingreso inválido:', cantidad);
        return this;
      }
      this.#saldo += cantidad;
      this.#anotar('ingreso', cantidad);
      return this;
    }

    retirar(cantidad, pin) {
      if (pin !== this.#pin) {
        imprimir('⚠ PIN incorrecto: operación cancelada.');
        return this;
      }
      if (!this.#validarCantidad(cantidad)) {
        imprimir('⚠ Retirada inválida:', cantidad);
        return this;
      }
      if (cantidad > this.#saldo) {
        imprimir(`⚠ Saldo insuficiente: tienes ${this.#saldo} y pides ${cantidad}.`);
        return this;
      }
      this.#saldo -= cantidad;
      this.#anotar('retirada', cantidad);
      return this;
    }

    interesAnual() {
      return this.#saldo * CuentaBancaria.#tipoInteres;
    }

    // Comprobar si un objeto tiene un campo privado nuestro: el operador `in`
    // con almohadilla. Es la manera oficial de hacer "duck typing" seguro.
    static esCuenta(objeto) {
      return #saldo in Object(objeto);
    }
  }

  const cuenta = new CuentaBancaria('Ana Torres', 1000, '1234');
  cuenta.ingresar(500).retirar(200, '1234').retirar(10000, '1234').retirar(50, '0000');

  imprimir('Saldo final:', cuenta.saldo, 'EUR');
  imprimir('Interés anual:', cuenta.interesAnual().toFixed(2), 'EUR');
  imprimir('Movimientos:', cuenta.movimientos);

  // La prueba de fuego de la privacidad:
  imprimir('¿Se ve el saldo interno?', cuenta['#saldo']);      // undefined
  imprimir('¿Se ve el pin?', cuenta.pin);                       // undefined
  imprimir('Object.keys() solo muestra lo público:', Object.keys(cuenta));
  imprimir('JSON.stringify tampoco los expone:', JSON.stringify(cuenta));

  // Intentar leer un campo privado desde fuera es un ERROR DE SINTAXIS,
  // no un simple undefined. Por eso no podemos ni escribirlo aquí: la línea
  //     cuenta.#saldo
  // impediría que TODO el archivo se ejecutara. Lo demostramos con eval()
  // dentro de un try, que compila el código en tiempo de ejecución.
  try {
    // eslint-disable-next-line no-eval
    eval('cuenta.#saldo');
  } catch (error) {
    imprimir('⚠ Acceso privado desde fuera ->', error.name + ':', error.message);
  }

  // Contraste con la convención antigua: aquí NADA nos frena.
  imprimir('Campo con guion bajo (accesible):', cuenta._titularAntiguo);
  cuenta._titularAntiguo = 'lo he cambiado sin permiso';
  imprimir('Modificado sin problema ->', cuenta._titularAntiguo);

  imprimir('¿cuenta es una CuentaBancaria?', CuentaBancaria.esCuenta(cuenta));   // true
  imprimir('¿Un objeto cualquiera lo es?', CuentaBancaria.esCuenta({ saldo: 1 })); // false

  // ==========================================================================
  // 6. DETALLES FINOS QUE CONVIENE CONOCER
  // ==========================================================================

  titulo('6. DETALLES FINOS');

  // --- 6.1 Sobrescribir toString() ---
  // toString() se llama automáticamente cuando el objeto se convierte a texto.
  class Punto {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    toString() {
      return `Punto(${this.x}, ${this.y})`;
    }
  }
  const punto = new Punto(3, 7);
  imprimir('Concatenado: ' + punto);          // Usa toString automáticamente
  imprimir(`En plantilla: ${punto}`);          // Igual

  // --- 6.2 Clases como expresión ---
  // Igual que las funciones, las clases pueden asignarse a una variable.
  const Rectangulo = class {
    constructor(ancho, alto) {
      this.ancho = ancho;
      this.alto = alto;
    }
    get area() {                 // Getter calculado: se lee sin paréntesis
      return this.ancho * this.alto;
    }
  };
  imprimir('Área del rectángulo 4x5:', new Rectangulo(4, 5).area); // 20

  // --- 6.3 Hoisting: las clases NO se pueden usar antes de declararlas ---
  try {
    // eslint-disable-next-line no-eval
    eval('new ClaseTardia(); class ClaseTardia {}');
  } catch (error) {
    imprimir('⚠ Usar una clase antes de declararla ->', error.name);
  }
  imprimir('✅ Declara siempre las clases ANTES de usarlas.');

  // --- 6.4 Nombres de método calculados ---
  const NOMBRE_METODO = 'saludarEnEspanol';
  class Robot {
    // Los corchetes permiten que el nombre del método venga de una variable.
    [NOMBRE_METODO]() {
      return 'Hola, humano.';
    }
  }
  imprimir('Método con nombre calculado:', new Robot()[NOMBRE_METODO]());

  imprimir('\n(Fin del archivo 03. Continúa en 04-herencia-y-polimorfismo.js)');

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) CLASE BÁSICA.
  //    Crea la clase `Producto` con campos `nombre`, `precio` y `stock`, un
  //    campo de clase `moneda = "EUR"` y un método `valorTotal()` que devuelva
  //    precio * stock. Crea tres productos y muestra su valor.
  //
  // 2) GETTER Y SETTER CON VALIDACIÓN.
  //    Añade a `Producto` un campo privado `#precio` con getter y setter.
  //    El setter debe rechazar valores que no sean números o que sean
  //    negativos, lanzando un error con un mensaje claro. Añade también el
  //    getter calculado `precioConIva` (21%), de solo lectura.
  //
  // 3) MIEMBROS ESTÁTICOS.
  //    Añade `static IVA = 0.21`, `static contador` (que aumente en cada
  //    `new`) y el método estático `Producto.masCaro(a, b)` que reciba dos
  //    productos y devuelva el de mayor precio.
  //
  // 4) MÉTODO PRIVADO.
  //    Añade el método privado `#registrarCambio(motivo)` que guarde en un
  //    array privado la fecha y el motivo de cada cambio de precio o de stock,
  //    y expón el historial mediante un getter que devuelva una COPIA.
  //
  // 5) RETO (difícil).
  //    Crea la clase `Carrito` con un array privado de líneas de compra y los
  //    métodos `agregar(producto, cantidad)`, `quitar(nombreProducto)`,
  //    el getter `total` (suma con IVA incluido) y el getter `unidades`.
  //    Ninguna operación debe permitir cantidades negativas ni productos
  //    repetidos: si el producto ya está, súmale la cantidad.
  // ==========================================================================
})();
