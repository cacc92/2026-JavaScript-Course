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
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y las utilidades (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/03-clases.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia.

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

  // TODO (en clase):
  //   1. titulo('1. class ES AZÚCAR SINTÁCTICO').
  //   2. Declara `class Saludador` con constructor(nombre) que guarde
  //      this.nombre, y el método saludar() que devuelva 'Hola, ' + this.nombre.
  //   3. Crea `const s1 = new Saludador('Ana');` y `const s2 = new Saludador('Luis');`.
  //   4. Las tres pruebas de que por debajo NO hay nada nuevo:
  //        imprimir('typeof Saludador:', typeof Saludador)                       -> "function"
  //        imprimir('¿saludar está en Saludador.prototype?',
  //                 typeof Saludador.prototype.saludar === 'function')           -> true
  //        imprimir('¿s1.saludar === s2.saludar?', s1.saludar === s2.saludar)    -> true
  //      (la tercera es el ahorro de memoria automático: con `class` ya no hay
  //       que acordarse de poner los métodos en el prototype.)
  //   5. imprimir(s1.saludar(), '|', s2.saludar())
  //   Resultado esperado en pantalla:
  //        typeof Saludador: function
  //        ¿saludar está en Saludador.prototype? true
  //        ¿s1.saludar === s2.saludar? true
  //        Hola, Ana | Hola, Luis
  //   (aprox. 14 lineas)

  // Diferencias reales (no son solo azúcar, hay extras de seguridad):
  //   a) Una clase SIEMPRE se ejecuta en modo estricto.
  //   b) Una clase NO se puede llamar sin `new`.
  //   c) Las clases NO se "hoistean" como las funciones: no puedes usarlas
  //      antes de declararlas (están en la "zona muerta temporal" o TDZ).
  // TODO (en clase):
  //   1. Dentro de un try llama a `Saludador('Ana');` (sin new).
  //   2. En el catch imprime:
  //        imprimir('⚠ Llamar a una clase sin new:', error.message)
  //   Resultado esperado en pantalla: "⚠ Llamar a una clase sin new: Class
  //   constructor Saludador cannot be invoked without 'new'".
  //   (aprox. 5 lineas)

  // ==========================================================================
  // 2. UNA CLASE COMPLETA: constructor, campos y métodos
  // ==========================================================================
  // Vocabulario que hay que fijar en clase:
  //   - CLASE:      el molde o plano (los planos de una casa).
  //   - INSTANCIA:  el objeto concreto fabricado con ese molde (una casa real).
  //   - CONSTRUCTOR: el método especial que se ejecuta al hacer `new`.
  //   - CAMPO DE CLASE: propiedad declarada directamente en el cuerpo de la
  //     clase, sin necesidad de escribirla dentro del constructor.

  // TODO (en clase):
  //   1. titulo('2. CONSTRUCTOR, CAMPOS Y MÉTODOS').
  //   2. Declara `class Estudiante` con estos CAMPOS DE CLASE (ES2022), que se
  //      asignan a CADA instancia justo antes de ejecutar el constructor:
  //        curso = 'Full Stack 2';
  //        notas = [];     // ⚠️ OJO: cada instancia recibe SU PROPIO array (correcto)
  //        activo = true;
  //   3. constructor(nombre, edad) -> guarda this.nombre y this.edad (lo que
  //      varía de un objeto a otro).
  //   4. MÉTODOS DE INSTANCIA (van SIN la palabra `function` y SIN comas entre
  //      ellos, error típico):
  //        agregarNota(nota)  -> si no es number, es NaN, es < 0 o es > 10,
  //             imprime '⚠ Nota inválida, se ignora:' con la nota y devuelve
  //             this; si es válida hace this.notas.push(nota) y devuelve this
  //             (devolver `this` permite encadenar .agregarNota(8).agregarNota(9)).
  //        promedio()  -> 0 si el array está vacío; si no, reduce y divide.
  //        aprobado()  -> this.promedio() >= 5
  //        ficha()     -> const estado = this.aprobado() ? 'APROBADO' : 'SUSPENSO';
  //             devuelve `${this.nombre} (${this.edad}) - ${this.curso} - media
  //             ${this.promedio().toFixed(2)} [${estado}]`
  //   (aprox. 30 lineas)

  // TODO (en clase): probar la clase Estudiante.
  //   1. const ana = new Estudiante('Ana Torres', 20);
  //      ana.agregarNota(8).agregarNota(9.5).agregarNota(7).agregarNota(15);
  //      (el 15 se rechaza: sirve para ver el aviso de validación.)
  //      imprimir(ana.ficha());
  //   2. const luis = new Estudiante('Luis Ramírez', 22);
  //      luis.agregarNota(3).agregarNota(4.5);
  //      imprimir(luis.ficha());
  //   3. Cada instancia tiene su propio array de notas (no se comparten):
  //        imprimir('Notas de Ana:', ana.notas);
  //        imprimir('Notas de Luis:', luis.notas);
  //   Resultado esperado en pantalla:
  //        ⚠ Nota inválida, se ignora: 15
  //        Ana Torres (20) - Full Stack 2 - media 8.17 [APROBADO]
  //        Luis Ramírez (22) - Full Stack 2 - media 3.75 [SUSPENSO]
  //        Notas de Ana: [8, 9.5, 7]  y  Notas de Luis: [3, 4.5]
  //   (aprox. 8 lineas)

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

  // TODO (en clase):
  //   1. titulo('3. GETTERS Y SETTERS').
  //   2. Declara `class Temperatura` con el campo privado `#celsius = 0;`
  //      (los privados se explican en la sección 5; aquí solo guarda los grados).
  //   3. constructor(celsius) -> escribe `this.celsius = celsius;`.
  //      ✅ BUENA PRÁCTICA: usar el SETTER también dentro del constructor, para
  //      que la validación se aplique desde el primer momento.
  //   4. get celsius()  -> devuelve this.#celsius. Se invoca al escribir
  //      objeto.celsius (SIN paréntesis).
  //   5. set celsius(valor) -> se invoca al escribir objeto.celsius = valor:
  //        - si no es number o es NaN: throw new TypeError('La temperatura debe ser un número.')
  //        - si valor < -273.15: throw new RangeError('Por debajo del cero absoluto no existe temperatura.')
  //        - si pasa los filtros: this.#celsius = valor;
  //   6. get fahrenheit() -> GETTER CALCULADO, no guarda nada:
  //        return this.#celsius * 9 / 5 + 32;
  //   7. set fahrenheit(valor) -> escribimos en F y guardamos en C reutilizando
  //      la validación del otro setter: this.celsius = (valor - 32) * 5 / 9;
  //   8. get descripcion() -> getter de SOLO LECTURA (no tiene setter):
  //        <= 0 'Helada'; < 15 'Fría'; < 26 'Agradable'; si no 'Calurosa'.
  //   (aprox. 34 lineas)

  // TODO (en clase): probar Temperatura.
  //   1. const hoy = new Temperatura(22);
  //        imprimir('Celsius:', hoy.celsius)          -> 22   (getter, sin paréntesis)
  //        imprimir('Fahrenheit:', hoy.fahrenheit)    -> 71.6 (getter calculado)
  //        imprimir('Descripción:', hoy.descripcion)  -> "Agradable"
  //   2. hoy.celsius = 30;   // <- setter
  //        imprimir('Tras subir a 30 ->', hoy.fahrenheit.toFixed(1), 'F,', hoy.descripcion)
  //   3. hoy.fahrenheit = 50;  // <- setter inverso
  //        imprimir('Tras poner 50 F ->', hoy.celsius.toFixed(1), 'C,', hoy.descripcion)
  //   Resultado esperado en pantalla:
  //        Celsius: 22 / Fahrenheit: 71.6 / Descripción: Agradable
  //        Tras subir a 30 -> 86.0 F, Calurosa
  //        Tras poner 50 F -> 10.0 C, Fría
  //   (aprox. 8 lineas)

  // TODO (en clase): la validación protege el objeto de datos absurdos.
  //   1. Dentro de un try asigna `hoy.celsius = 'mucho calor';` y en el catch
  //      imprime  imprimir('⚠ Setter rechazó el valor:', error.message)
  //   2. Repite con `hoy.celsius = -400;` en otro try/catch idéntico.
  //   3. imprimir('El objeto sigue intacto:', hoy.celsius.toFixed(1), 'C')
  //   Resultado esperado en pantalla: los dos mensajes de rechazo (uno de
  //   TypeError y otro de RangeError) y "El objeto sigue intacto: 10.0 C".
  //   (aprox. 10 lineas)

  // ⚠️ ERROR COMÚN Nº1: llamar al getter con paréntesis -> hoy.celsius() falla
  //    con "is not a function", porque el getter ya devolvió un número.
  // ⚠️ ERROR COMÚN Nº2: recursión infinita. Si dentro de `set celsius` escribes
  //    `this.celsius = valor` te llamas a ti mismo sin fin ("Maximum call stack
  //    size exceeded"). Por eso el setter guarda en un campo DISTINTO (#celsius).
  // ⚠️ ERROR COMÚN Nº3: asignar a un getter sin setter. En modo estricto lanza
  //    error; en modo normal falla en silencio, que es aún peor.
  // TODO (en clase):
  //   1. Dentro de un try escribe `hoy.descripcion = 'Tropical';` (no hay
  //      `set descripcion`) y en el catch imprime
  //        imprimir('⚠ No se puede asignar a un getter sin setter:', error.message)
  //   Resultado esperado en pantalla: un mensaje del tipo "Cannot set property
  //   descripcion of #<Temperatura> which has only a getter".
  //   (aprox. 5 lineas)

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

  // TODO (en clase):
  //   1. titulo('4. MIEMBROS ESTÁTICOS').
  //   2. Declara `class Matricula` con estas PROPIEDADES ESTÁTICAS:
  //        static PRECIO_BASE = 300;   // Constante compartida por toda la clase
  //        static contador = 0;        // Contador de matrículas creadas
  //        static #registro = [];      // Estática Y privada: solo la clase la ve
  //   3. constructor(alumno, creditos) -> guarda this.alumno y this.creditos y,
  //      además, toca el contador de la CLASE:
  //        Matricula.contador += 1;
  //        this.numero = Matricula.contador;
  //        Matricula.#registro.push(alumno);
  //      ✅ BUENA PRÁCTICA: referirse a la clase por su nombre (Matricula.x),
  //      no con this.constructor.x, salvo que quieras contadores por subclase.
  //   4. MÉTODO DE INSTANCIA (usa los datos de ESTE objeto):
  //        importe() -> Matricula.PRECIO_BASE + this.creditos * Matricula.PRECIO_CREDITO
  //   5. MÉTODOS ESTÁTICOS (utilidades que no necesitan una instancia):
  //        static resumen()      -> `Se han emitido ${Matricula.contador} matrículas.`
  //        static ultimoAlumno() -> el último de Matricula.#registro, o '(ninguno)'
  //                                 usando el operador ?? (nullish).
  //        static matriculaCompleta(alumno) -> método "fábrica": devuelve
  //                                 new Matricula(alumno, 60)  // curso completo
  //        static get hayMatriculas() -> GETTER ESTÁTICO: Matricula.contador > 0
  //   (aprox. 30 lineas)

  // TODO (en clase): probar Matricula.
  //   1. Las propiedades estáticas también se pueden añadir DESPUÉS de la clase:
  //        Matricula.PRECIO_CREDITO = 12;
  //   2. imprimir('¿Hay matrículas antes de crear ninguna?', Matricula.hayMatriculas) -> false
  //   3. Crea las tres matrículas:
  //        const m1 = new Matricula('Ana Torres', 30);
  //        const m2 = new Matricula('Luis Ramírez', 45);
  //        const m3 = Matricula.matriculaCompleta('Marta Gil');  // fábrica estática
  //   4. Imprime las tres fichas con este formato exacto:
  //        imprimir(`Matrícula ${m1.numero} de ${m1.alumno}: ${m1.importe()} EUR`);
  //      (y lo mismo con m2 y m3.)
  //   5. imprimir(Matricula.resumen());
  //      imprimir('Último alumno:', Matricula.ultimoAlumno());
  //      imprimir('¿Hay matrículas ahora?', Matricula.hayMatriculas);
  //   Resultado esperado en pantalla:
  //        ¿Hay matrículas antes de crear ninguna? false
  //        Matrícula 1 de Ana Torres: 660 EUR
  //        Matrícula 2 de Luis Ramírez: 840 EUR
  //        Matrícula 3 de Marta Gil: 1020 EUR
  //        Se han emitido 3 matrículas. / Último alumno: Marta Gil / true
  //   (aprox. 11 lineas)

  // ⚠️ ERROR COMÚN: llamar a un método estático desde una instancia.
  // TODO (en clase):
  //   1. imprimir('¿m1.resumen existe?', typeof m1.resumen)  -> "undefined"
  //   2. imprimir('Los métodos static NO están en las instancias, solo en la clase.')
  //   (aprox. 2 lineas)

  // ==========================================================================
  // 5. CAMPOS Y MÉTODOS PRIVADOS CON #
  // ==========================================================================
  // Un miembro que empieza por `#` SOLO es accesible desde dentro del cuerpo de
  // la clase. Es privacidad REAL, garantizada por el lenguaje: no es un acuerdo
  // entre programadores, es una barrera que el motor hace cumplir.
  //
  // Antes de ES2022 se usaba la convención del guion bajo: `this._saldo`.
  // Eso significaba "por favor, no toques esto", pero nada lo impedía.

  // TODO (en clase):
  //   1. titulo('5. CAMPOS PRIVADOS CON # (vs. la convención _)').
  //   2. Declara `class CuentaBancaria`. Los CAMPOS PRIVADOS hay que DECLARARLOS
  //      arriba, obligatoriamente:
  //        #saldo = 0;
  //        #movimientos = [];
  //        #pin;
  //        _titularAntiguo = 'convención con guion bajo (NO protege nada)';
  //        static #tipoInteres = 0.02;   // Estática privada
  //   3. constructor(titular, saldoInicial, pin):
  //        this.titular = titular;    // Pública: se puede leer y escribir
  //        this.#pin = pin;           // Privada: nadie la verá desde fuera
  //        if (saldoInicial > 0) this.#saldo = saldoInicial;
  //        this.#anotar('apertura', saldoInicial);
  //   4. MÉTODOS PRIVADOS (uso interno, no forman parte de la interfaz pública;
  //      esto es ABSTRACCIÓN: quien usa la cuenta no necesita saber que existen):
  //        #anotar(tipo, cantidad) -> hace push a #movimientos de un objeto
  //             { tipo, cantidad, hora: new Date().toLocaleTimeString('es-ES') }
  //        #validarCantidad(cantidad) -> true si es number, no NaN y > 0.
  //   (aprox. 22 lineas)

  // TODO (en clase): la INTERFAZ PÚBLICA de CuentaBancaria (los "botones" que
  // sí puede pulsar quien nos usa). Dentro de la misma clase:
  //   1. get saldo()        -> devuelve this.#saldo (solo lectura, no hay setter).
  //   2. get movimientos()  -> devuelve una COPIA:
  //        return this.#movimientos.map((m) => ({ ...m }));
  //      Si devolviéramos el array real, cualquiera podría hacer push y falsear
  //      el historial.
  //   3. ingresar(cantidad) -> si no pasa #validarCantidad, imprime
  //        '⚠ Ingreso inválido:' con la cantidad y devuelve this; si es válida
  //        suma a #saldo, llama a #anotar('ingreso', cantidad) y devuelve this.
  //   4. retirar(cantidad, pin) -> tres filtros, en este orden:
  //        - pin distinto de #pin  -> '⚠ PIN incorrecto: operación cancelada.'
  //        - cantidad inválida      -> '⚠ Retirada inválida:' con la cantidad
  //        - cantidad > #saldo      -> `⚠ Saldo insuficiente: tienes ${this.#saldo} y pides ${cantidad}.`
  //        y si pasa todo: resta, #anotar('retirada', cantidad) y devuelve this.
  //   5. interesAnual() -> this.#saldo * CuentaBancaria.#tipoInteres
  //   6. static esCuenta(objeto) -> comprueba si un objeto tiene un campo privado
  //      nuestro con el operador `in` con almohadilla (la manera oficial de hacer
  //      "duck typing" seguro):   return #saldo in Object(objeto);
  //   (aprox. 34 lineas)

  // TODO (en clase): probar la cuenta.
  //   1. const cuenta = new CuentaBancaria('Ana Torres', 1000, '1234');
  //      cuenta.ingresar(500).retirar(200, '1234').retirar(10000, '1234').retirar(50, '0000');
  //   2. imprimir('Saldo final:', cuenta.saldo, 'EUR');
  //      imprimir('Interés anual:', cuenta.interesAnual().toFixed(2), 'EUR');
  //      imprimir('Movimientos:', cuenta.movimientos);
  //   Resultado esperado en pantalla: el aviso de saldo insuficiente, el aviso
  //   de PIN incorrecto, "Saldo final: 1300 EUR", "Interés anual: 26.00 EUR" y
  //   el listado de tres movimientos (apertura, ingreso, retirada).
  //   (aprox. 5 lineas)

  // TODO (en clase): la prueba de fuego de la privacidad.
  //   1. imprimir('¿Se ve el saldo interno?', cuenta['#saldo'])   -> undefined
  //      imprimir('¿Se ve el pin?', cuenta.pin)                    -> undefined
  //      imprimir('Object.keys() solo muestra lo público:', Object.keys(cuenta));
  //      imprimir('JSON.stringify tampoco los expone:', JSON.stringify(cuenta));
  //   2. Intentar leer un campo privado desde fuera es un ERROR DE SINTAXIS, no
  //      un simple undefined. Por eso no podemos ni escribir la línea
  //          cuenta.#saldo
  //      tal cual: impediría que TODO el archivo se ejecutara. Se demuestra con
  //      eval() dentro de un try, que compila el código en tiempo de ejecución:
  //        try { eval('cuenta.#saldo'); }
  //        catch (error) { imprimir('⚠ Acceso privado desde fuera ->', error.name + ':', error.message); }
  //   Resultado esperado en pantalla: undefined, undefined, ["titular",
  //   "_titularAntiguo"], el JSON con esos dos campos, y un SyntaxError.
  //   (aprox. 9 lineas)

  // TODO (en clase): contraste con la convención antigua: aquí NADA nos frena.
  //   1. imprimir('Campo con guion bajo (accesible):', cuenta._titularAntiguo);
  //   2. cuenta._titularAntiguo = 'lo he cambiado sin permiso';
  //      imprimir('Modificado sin problema ->', cuenta._titularAntiguo);
  //   3. imprimir('¿cuenta es una CuentaBancaria?', CuentaBancaria.esCuenta(cuenta));     -> true
  //      imprimir('¿Un objeto cualquiera lo es?', CuentaBancaria.esCuenta({ saldo: 1 })); -> false
  //   (aprox. 5 lineas)

  // ==========================================================================
  // 6. DETALLES FINOS QUE CONVIENE CONOCER
  // ==========================================================================

  // TODO (en clase):
  //   1. titulo('6. DETALLES FINOS').
  //   2. 6.1 Sobrescribir toString(), que se llama automáticamente cuando el
  //      objeto se convierte a texto. Declara `class Punto` con constructor(x, y)
  //      y  toString() { return `Punto(${this.x}, ${this.y})`; }
  //        const punto = new Punto(3, 7);
  //        imprimir('Concatenado: ' + punto);   // Usa toString automáticamente
  //        imprimir(`En plantilla: ${punto}`);  // Igual
  //   Resultado esperado en pantalla:
  //        Concatenado: Punto(3, 7)
  //        En plantilla: Punto(3, 7)
  //   (aprox. 11 lineas)

  // TODO (en clase): 6.2 Clases como EXPRESIÓN. Igual que las funciones, las
  // clases pueden asignarse a una variable.
  //   1. const Rectangulo = class { constructor(ancho, alto) {...}
  //        get area() { return this.ancho * this.alto; } };   // getter calculado
  //   2. imprimir('Área del rectángulo 4x5:', new Rectangulo(4, 5).area)  -> 20
  //   (aprox. 10 lineas)

  // TODO (en clase): 6.3 Hoisting: las clases NO se pueden usar antes de
  // declararlas (zona muerta temporal). Lo demostramos con eval() para que el
  // error no rompa el archivo entero:
  //   1. try { eval('new ClaseTardia(); class ClaseTardia {}'); }
  //      catch (error) { imprimir('⚠ Usar una clase antes de declararla ->', error.name); }
  //   2. imprimir('✅ Declara siempre las clases ANTES de usarlas.')
  //   Resultado esperado en pantalla: "⚠ Usar una clase antes de declararla ->
  //   ReferenceError" y la frase de buena práctica.
  //   (aprox. 6 lineas)

  // TODO (en clase): 6.4 Nombres de método CALCULADOS. Los corchetes permiten
  // que el nombre del método venga de una variable.
  //   1. const NOMBRE_METODO = 'saludarEnEspanol';
  //   2. class Robot { [NOMBRE_METODO]() { return 'Hola, humano.'; } }
  //   3. imprimir('Método con nombre calculado:', new Robot()[NOMBRE_METODO]())
  //   Resultado esperado en pantalla: Método con nombre calculado: Hola, humano.
  //   (aprox. 7 lineas)

  // TODO (en clase): cierra el archivo con
  //   imprimir('\n(Fin del archivo 03. Continúa en 04-herencia-y-polimorfismo.js)');
  //   (aprox. 1 linea)

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
