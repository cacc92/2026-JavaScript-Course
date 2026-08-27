/**
 * ============================================================
 * ARCHIVO: js/06-this-y-pureza.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: dos ideas que marcan la diferencia entre escribir código
 *       que funciona y escribir código en el que se puede confiar.
 *
 * QUÉ SE APRENDE AQUÍ:
 *   1. Introducción a `this`: qué es y de qué depende su valor.
 *   2. `this` en una función normal vs en una función flecha.
 *   3. El problema clásico del callback que pierde el `this`,
 *      y sus dos soluciones (flecha y bind).
 *   4. Funciones PURAS vs IMPURAS.
 *   5. Efectos secundarios: qué son y cuándo son aceptables.
 *   6. Inmutabilidad: devolver datos nuevos en vez de modificar.
 *
 * Aviso para clase: `this` es el tema más resbaladizo de
 * JavaScript. Aquí solo damos la INTRODUCCIÓN necesaria para
 * entender por qué las flechas se comportan distinto.
 * ============================================================
 */

(function () {
  'use strict';

  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-06');

  // ============================================================
  // 1. ¿QUÉ ES `this`?
  // ============================================================

  /*
   * `this` es una palabra reservada que, dentro de una función,
   * apunta al objeto que está "usando" esa función en ese momento.
   *
   * La regla que hay que memorizar es esta:
   *
   *   En una función NORMAL, el valor de `this` NO depende de dónde
   *   se escribió la función, sino de CÓMO se la llama.
   *
   * Analogía: `this` es la palabra "yo". Su significado no depende de
   * la frase escrita, sino de quién la pronuncia. Si la lee Ana, "yo"
   * es Ana; si la lee Diego, "yo" es Diego.
   */

  titulo('1. this dentro de un método de objeto');

  const estudiante = {
    nombre: 'Marta',
    curso: 'Full Stack 2',
    notas: [8, 9, 10],

    // Función NORMAL como método: `this` será el objeto que hay
    // delante del punto en el momento de la llamada.
    presentarse: function () {
      return 'Hola, soy ' + this.nombre + ' y estudio ' + this.curso;
    },

    // Sintaxis abreviada de método (ES6). Equivale a la de arriba.
    calcularMedia() {
      const suma = this.notas.reduce((total, nota) => total + nota, 0);
      return suma / this.notas.length;
    }
  };

  imprimir(estudiante.presentarse());
  imprimir('Media de ' + estudiante.nombre + ' ->', estudiante.calcularMedia().toFixed(2));

  // Al llamar `estudiante.presentarse()`, lo que hay delante del punto
  // es `estudiante`, así que this === estudiante.

  // ============================================================
  // 2. LA FUNCIÓN SE "DESATA" DEL OBJETO
  // ============================================================

  /*
   * Si sacamos el método del objeto y lo guardamos en una variable,
   * al llamarlo ya no hay nada delante del punto. En modo estricto
   * `this` vale undefined, y acceder a this.nombre revienta.
   *
   * ⚠️ ERROR COMÚN: pasar un método suelto como callback y no
   * entender por qué "de repente this es undefined".
   */

  titulo('2. Cuando la función pierde su objeto');

  const funcionSuelta = estudiante.presentarse;   // ojo: SIN paréntesis

  try {
    imprimir(funcionSuelta());
  } catch (error) {
    imprimir('Error al llamarla suelta ->', error.name + ': ' + error.message);
    imprimir('Motivo: nadie hay delante del punto, así que this es undefined.');
  }

  // SOLUCIÓN 1 · bind(): crea una función NUEVA con el `this` fijado.
  const funcionAtada = estudiante.presentarse.bind(estudiante);
  imprimir('Con .bind(estudiante) ->', funcionAtada());

  // SOLUCIÓN 2 · call() y apply(): ejecutan la función indicando el this.
  // La diferencia entre ambas es solo cómo se pasan los argumentos:
  //   call(objeto, arg1, arg2)   -> argumentos sueltos
  //   apply(objeto, [arg1, arg2]) -> argumentos en un array
  const otroEstudiante = { nombre: 'Diego', curso: 'Bases de Datos' };
  imprimir('Con .call(otroEstudiante) ->', estudiante.presentarse.call(otroEstudiante));
  imprimir('Con .apply(otroEstudiante) ->', estudiante.presentarse.apply(otroEstudiante));

  // Fíjate en algo importante: la MISMA función devuelve cosas distintas
  // según el objeto con el que se la llame. Eso es exactamente lo que
  // significa "this depende de cómo se llama, no de dónde se escribe".

  // ============================================================
  // 3. `this` EN FUNCIONES FLECHA
  // ============================================================

  /*
   * Una función flecha NO TIENE `this` propio. Cuando escribes `this`
   * dentro de una flecha, JavaScript usa el `this` del ámbito donde
   * la flecha fue ESCRITA. A eso se le llama `this` léxico.
   *
   * Consecuencia práctica:
   *   - Como MÉTODO de un objeto -> mal, casi nunca es lo que quieres.
   *   - Como CALLBACK dentro de un método -> perfecto, conserva el this.
   */

  titulo('3. this en flechas: cuándo estorba y cuándo salva');

  const equipo = {
    nombre: 'Equipo Front End',
    integrantes: ['Ana', 'Diego', 'Marta'],

    // ⚠️ ERROR COMÚN: usar una flecha como método.
    // La flecha toma el `this` de donde se escribió el objeto (aquí,
    // el de la IIFE del archivo), no el objeto `equipo`.
    presentarMal: () => {
      // this.nombre no existe -> escribimos una comprobación segura.
      const nombreVisto = (typeof this === 'undefined' || this === null)
        ? 'this es undefined'
        : String(this.nombre);
      return 'Con flecha como método, this.nombre -> ' + nombreVisto;
    },

    // ✅ Función normal como método: this === equipo.
    presentarBien: function () {
      return 'Con función normal, this.nombre -> ' + this.nombre;
    },

    // EL CASO ESTRELLA: un callback dentro de un método.
    // La flecha hereda el `this` de listarIntegrantes(), que es `equipo`.
    listarIntegrantes: function () {
      return this.integrantes.map((integrante) => {
        return integrante + ' (' + this.nombre + ')';   // this sigue siendo equipo
      });
    },

    // La misma idea con función normal como callback: se rompe.
    listarIntegrantesRoto: function () {
      try {
        return this.integrantes.map(function (integrante) {
          // Aquí this ya NO es equipo: en modo estricto es undefined.
          return integrante + ' (' + this.nombre + ')';
        });
      } catch (error) {
        return 'Error dentro del callback -> ' + error.name + ' (this se perdió)';
      }
    },

    // Solución antigua, anterior a las flechas: guardar this en una
    // variable llamada por convención `self` o `that`.
    listarIntegrantesConSelf: function () {
      const self = this;   // guardamos la referencia mientras aún es correcta
      return this.integrantes.map(function (integrante) {
        return integrante + ' (' + self.nombre + ')';
      });
    }
  };

  imprimir(equipo.presentarMal());
  imprimir(equipo.presentarBien());
  imprimir('Con flecha como callback ->', equipo.listarIntegrantes().join(', '));
  imprimir('Con función normal como callback ->', equipo.listarIntegrantesRoto());
  imprimir('Con el truco de self ->', equipo.listarIntegrantesConSelf().join(', '));

  /*
   * RESUMEN PRÁCTICO DE `this`:
   *
   *   objeto.metodo()          -> this es `objeto`
   *   funcionSuelta()          -> this es undefined (modo estricto)
   *   funcion.call(obj)        -> this es `obj`
   *   funcion.bind(obj)        -> devuelve una copia con this fijado
   *   () => { ... }            -> this heredado de donde se escribió
   *
   * Regla de bolsillo: usa función normal para los MÉTODOS de un
   * objeto y flecha para los CALLBACKS que van dentro de ellos.
   */

  // ============================================================
  // 4. FUNCIONES PURAS
  // ============================================================

  /*
   * Una función es PURA cuando cumple DOS condiciones:
   *
   *   1. Con las mismas entradas devuelve SIEMPRE la misma salida.
   *   2. No provoca EFECTOS SECUNDARIOS: no toca nada fuera de ella
   *      (no modifica variables externas, no escribe en pantalla, no
   *      guarda en el navegador, no llama a un servidor).
   *
   * Analogía: una función pura es una máquina expendedora fiable.
   * Metes el mismo código y sale el mismo producto, siempre, sin
   * que se altere nada más en la sala.
   *
   * ¿Por qué nos importa? Porque una función pura es:
   *   - fácil de PROBAR (no hay que preparar nada alrededor),
   *   - fácil de ENTENDER (todo lo que necesita está en sus parámetros),
   *   - y segura de reutilizar (nunca te rompe algo a distancia).
   */

  titulo('4. Funciones puras: mismas entradas, misma salida');

  /** ✅ PURA: solo usa sus parámetros y solo devuelve un valor. */
  function calcularTotal(precio, cantidad, descuento = 0) {
    const bruto = precio * cantidad;
    return bruto - (bruto * descuento) / 100;
  }

  imprimir('calcularTotal(100, 3) ->', calcularTotal(100, 3));          // 300
  imprimir('calcularTotal(100, 3) ->', calcularTotal(100, 3));          // 300 otra vez
  imprimir('calcularTotal(100, 3, 10) ->', calcularTotal(100, 3, 10));  // 270

  /** ✅ PURA: no toca el array original, devuelve uno nuevo. */
  function aplicarSubidaDePrecios(listaProductos, porcentaje) {
    return listaProductos.map((producto) => ({
      ...producto,
      precio: Number((producto.precio * (1 + porcentaje / 100)).toFixed(2))
    }));
  }

  const catalogoOriginal = [
    { nombre: 'Teclado', precio: 50 },
    { nombre: 'Ratón', precio: 20 }
  ];

  const catalogoConSubida = aplicarSubidaDePrecios(catalogoOriginal, 10);
  imprimir('Original (intacto) ->', catalogoOriginal);
  imprimir('Resultado nuevo ->', catalogoConSubida);

  // ============================================================
  // 5. FUNCIONES IMPURAS Y EFECTOS SECUNDARIOS
  // ============================================================

  /*
   * Una función es IMPURA si depende de algo externo o si cambia algo
   * externo. Los tres motivos más habituales:
   *
   *   a) Modifica una variable de fuera.
   *   b) Modifica el objeto o array que recibe.
   *   c) Usa datos que cambian solos: Math.random(), new Date(),
   *      la hora, la red, el DOM...
   *
   * OJO, y esto es importante: IMPURA NO SIGNIFICA MALA.
   * Un programa que no produce ningún efecto secundario no sirve para
   * nada: nadie vería el resultado. La consola visual de este proyecto
   * es un efecto secundario, y menos mal.
   *
   * La estrategia profesional es SEPARAR: la lógica de cálculo, pura;
   * los efectos (pintar, guardar, enviar), concentrados y a la vista.
   */

  titulo('5. Funciones impuras y efectos secundarios');

  // --- a) Modifica una variable externa ---
  let totalAcumulado = 0;

  /** ❌ IMPURA: cambia `totalAcumulado`, que vive fuera. */
  function sumarAlTotal(cantidad) {
    totalAcumulado += cantidad;    // efecto secundario
    return totalAcumulado;
  }

  imprimir('sumarAlTotal(10) ->', sumarAlTotal(10));  // 10
  imprimir('sumarAlTotal(10) ->', sumarAlTotal(10));  // 20  ⚠️ ¡misma entrada, otra salida!
  imprimir('sumarAlTotal(10) ->', sumarAlTotal(10));  // 30

  // --- b) Modifica el array recibido ---
  const inscritos = ['Ana', 'Diego'];

  /** ❌ IMPURA: hace push sobre el array original. */
  function inscribirImpura(lista, nombre) {
    lista.push(nombre);            // efecto secundario invisible desde fuera
    return lista;
  }

  /** ✅ PURA: devuelve un array nuevo con el añadido. */
  function inscribirPura(lista, nombre) {
    return [...lista, nombre];
  }

  const resultadoImpuro = inscribirImpura(inscritos, 'Marta');
  imprimir('Tras la impura, el array original ->', inscritos);            // ya tiene Marta
  imprimir('¿Devolvió el MISMO array? ->', resultadoImpuro === inscritos); // true

  const resultadoPuro = inscribirPura(inscritos, 'Sara');
  imprimir('Tras la pura, el original ->', inscritos);                    // sin Sara
  imprimir('El array devuelto ->', resultadoPuro);                        // con Sara
  imprimir('¿Es el mismo array? ->', resultadoPuro === inscritos);        // false

  // --- c) Depende de datos cambiantes ---

  /** ❌ IMPURA: cada llamada devuelve algo distinto. */
  function generarCodigoDescuento() {
    return 'DESC-' + Math.floor(Math.random() * 10000);
  }

  imprimir('generarCodigoDescuento() ->', generarCodigoDescuento());
  imprimir('generarCodigoDescuento() ->', generarCodigoDescuento());

  /*
   * ✅ TRUCO PROFESIONAL: convertir una impura en pura moviendo la
   * parte impredecible a un PARÁMETRO. Así la función se puede probar
   * pasándole un número fijo, y quien la llame decide de dónde sale
   * el azar. Esto se llama "inyección de dependencias".
   */
  function generarCodigoPuro(numeroAleatorio) {
    return 'DESC-' + Math.floor(numeroAleatorio * 10000);
  }

  imprimir('generarCodigoPuro(0.42) ->', generarCodigoPuro(0.42));  // siempre DESC-4200
  imprimir('generarCodigoPuro(0.42) ->', generarCodigoPuro(0.42));  // idéntico
  imprimir('Con azar real ->', generarCodigoPuro(Math.random()));   // el azar entra desde fuera

  // Lo mismo con la fecha: en lugar de llamar a new Date() dentro,
  // se recibe como parámetro y así se puede probar con cualquier día.
  // Matiz honesto para clase: con el valor por defecto, llamarla SIN
  // argumento sigue siendo impuro (depende del reloj). La función se
  // vuelve pura en cuanto quien la llama le pasa la fecha, y eso es lo
  // que permite escribir pruebas repetibles.
  function describirDia(fecha = new Date()) {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return 'Ese día fue ' + dias[fecha.getDay()];
  }

  imprimir('describirDia(new Date(2026, 7, 26)) ->', describirDia(new Date(2026, 7, 26)));

  // ============================================================
  // 6. TABLA RESUMEN
  // ============================================================

  titulo('6. Resumen: ¿es pura?');

  const casos = [
    { funcion: '(a, b) => a + b', pura: 'SÍ', motivo: 'solo usa sus parámetros' },
    { funcion: 'lista => [...lista].sort()', pura: 'SÍ', motivo: 'copia antes de ordenar' },
    { funcion: 'lista => lista.sort()', pura: 'NO', motivo: 'modifica el array recibido' },
    { funcion: '() => Math.random()', pura: 'NO', motivo: 'resultado impredecible' },
    { funcion: 'texto => console.log(texto)', pura: 'NO', motivo: 'escribe fuera (efecto)' },
    { funcion: 'n => contador += n', pura: 'NO', motivo: 'modifica una variable externa' }
  ];

  casos.forEach(function (caso) {
    imprimir('   ' + caso.pura.padEnd(3) + ' | ' + caso.funcion.padEnd(28) + ' | ' + caso.motivo);
  });

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // 1) (Fácil) Crea un objeto `libro` con las propiedades titulo y
  //    autor y un método ficha() que devuelva "TÍTULO, de AUTOR"
  //    usando this. Después guarda el método en una variable suelta,
  //    llámalo y explica el error que aparece.
  //
  // 2) (Fácil) Repite el ejercicio anterior escribiendo ficha() como
  //    función flecha. Observa qué imprime this.titulo y razona por qué.
  //
  // 3) (Media) Dada la función impura
  //       let iva = 21;
  //       function conIva(precio) { return precio * (1 + iva / 100); }
  //    conviértela en pura. Pista: el iva debe entrar por parámetro.
  //
  // 4) (Media) Escribe eliminarProducto(lista, nombre) de forma PURA:
  //    debe devolver un array nuevo sin ese producto y dejar intacta
  //    la lista original. Demuéstralo imprimiendo las dos.
  //
  // 5) (Difícil) Crea un objeto `cronometro` con las propiedades
  //    segundos y activo, y los métodos iniciar() y detener().
  //    iniciar() debe usar setInterval con un callback que incremente
  //    this.segundos. Hazlo funcionar con una flecha y comprueba que
  //    con una función normal se rompe.
  //    ⚠️ No olvides clearInterval en detener().
  // ============================================================
})();
