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

// La IIFE ya viene escrita: aísla las variables de este archivo.
(function () {
  'use strict';

  // Andamiaje ya escrito: consola visual del <pre id="salida-06">.
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

  // TODO (en clase):
  //   1. titulo('1. this dentro de un método de objeto').
  //   2. Crea const estudiante = { ... } con tres datos y dos métodos
  //      (se reutiliza en la sección 2, no lo borres):
  //        nombre: 'Marta', curso: 'Full Stack 2', notas: [8, 9, 10]
  //        presentarse: function () { return 'Hola, soy ' + this.nombre +
  //                                   ' y estudio ' + this.curso; }
  //        calcularMedia() { ... }   <- sintaxis abreviada de método (ES6),
  //          suma this.notas con reduce y divide entre this.notas.length
  //   3. Imprime estudiante.presentarse() y
  //      'Media de ' + estudiante.nombre + ' ->' junto a
  //      estudiante.calcularMedia().toFixed(2).
  //   4. Señálalo en la pizarra: lo que hay DELANTE DEL PUNTO al llamar
  //      es `estudiante`, así que this === estudiante.
  //   Resultado esperado en pantalla:
  //      Hola, soy Marta y estudio Full Stack 2
  //      Media de Marta -> 9.00
  //   (aprox. 16 líneas)

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

  // TODO (en clase):
  //   1. titulo('2. Cuando la función pierde su objeto').
  //   2. const funcionSuelta = estudiante.presentarse;   <- ojo: SIN paréntesis
  //   3. Llámala dentro de try { imprimir(funcionSuelta()); } catch (error) {...}
  //      y en el catch imprime dos líneas:
  //        'Error al llamarla suelta ->' + error.name + ': ' + error.message
  //        'Motivo: nadie hay delante del punto, así que this es undefined.'
  //   Resultado esperado en pantalla:
  //      Error al llamarla suelta -> TypeError: Cannot read properties of undefined (reading 'nombre')
  //      Motivo: nadie hay delante del punto, así que this es undefined.
  //   (aprox. 7 líneas)

  // TODO (en clase):
  //   1. SOLUCIÓN 1 · bind(): crea una función NUEVA con el `this` fijado.
  //      const funcionAtada = estudiante.presentarse.bind(estudiante);
  //      e imprímela con la etiqueta 'Con .bind(estudiante) ->'.
  //   2. SOLUCIÓN 2 · call() y apply(): ejecutan la función indicando el this.
  //      La única diferencia entre ambas es cómo se pasan los argumentos:
  //        call(objeto, arg1, arg2)     -> argumentos sueltos
  //        apply(objeto, [arg1, arg2])  -> argumentos en un array
  //      Declara const otroEstudiante = { nombre: 'Diego', curso: 'Bases de Datos' };
  //      e imprime estudiante.presentarse.call(otroEstudiante) y .apply(otroEstudiante).
  //   3. Remátalo en voz alta: la MISMA función devuelve cosas distintas según
  //      el objeto con el que se la llame. Eso es "this depende de cómo se llama".
  //   Resultado esperado en pantalla:
  //      Con .bind(estudiante) -> Hola, soy Marta y estudio Full Stack 2
  //      Con .call(otroEstudiante) -> Hola, soy Diego y estudio Bases de Datos
  //      Con .apply(otroEstudiante) -> Hola, soy Diego y estudio Bases de Datos
  //   (aprox. 6 líneas)

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

  // ⚠️ ERROR COMÚN: usar una flecha como método. La flecha toma el `this`
  // de donde se escribió el objeto (aquí, el de la IIFE del archivo), no
  // el objeto `equipo`.

  // TODO (en clase):
  //   1. titulo('3. this en flechas: cuándo estorba y cuándo salva').
  //   2. Crea const equipo = { ... } con
  //      nombre: 'Equipo Front End', integrantes: ['Ana', 'Diego', 'Marta']
  //      y CINCO métodos que se comparan entre sí:
  //        a) presentarMal: () => { ... }   ⚠️ flecha como método.
  //           Comprueba de forma segura si this es undefined/null y devuelve
  //           'Con flecha como método, this.nombre -> ' + nombreVisto
  //        b) presentarBien: function () { return 'Con función normal, this.nombre -> '
  //           + this.nombre; }   ✅ this === equipo
  //        c) listarIntegrantes: function () { return this.integrantes.map(
  //             (integrante) => integrante + ' (' + this.nombre + ')'); }
  //           EL CASO ESTRELLA: la flecha hereda el this del método.
  //        d) listarIntegrantesRoto: igual que el anterior pero con
  //           function (integrante) { ... } como callback, envuelto en try/catch;
  //           en el catch devuelve 'Error dentro del callback -> ' + error.name
  //           + ' (this se perdió)'
  //        e) listarIntegrantesConSelf: la solución ANTERIOR a las flechas:
  //           const self = this; y usar self.nombre dentro del callback normal.
  //   3. Imprime, en este orden: presentarMal(), presentarBien(),
  //      listarIntegrantes().join(', '), listarIntegrantesRoto() y
  //      listarIntegrantesConSelf().join(', ').
  //   Resultado esperado en pantalla:
  //      Con flecha como método, this.nombre -> this es undefined
  //      Con función normal, this.nombre -> Equipo Front End
  //      Con flecha como callback -> Ana (Equipo Front End), Diego (Equipo Front End), Marta (Equipo Front End)
  //      Con función normal como callback -> Error dentro del callback -> TypeError (this se perdió)
  //      Con el truco de self -> Ana (Equipo Front End), Diego (Equipo Front End), Marta (Equipo Front End)
  //   (aprox. 40 líneas)

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

  // DATOS DE PARTIDA (ya escritos).
  const catalogoOriginal = [
    { nombre: 'Teclado', precio: 50 },
    { nombre: 'Ratón', precio: 20 }
  ];

  // TODO (en clase):
  //   1. titulo('4. Funciones puras: mismas entradas, misma salida').
  //   2. ✅ PURA: function calcularTotal(precio, cantidad, descuento = 0) que
  //      calcule const bruto = precio * cantidad y devuelva
  //      bruto - (bruto * descuento) / 100. Solo usa sus parámetros.
  //   3. Imprime calcularTotal(100, 3) DOS veces seguidas (para ver que da lo
  //      mismo) y calcularTotal(100, 3, 10).
  //   Resultado esperado en pantalla:
  //      calcularTotal(100, 3) -> 300
  //      calcularTotal(100, 3) -> 300
  //      calcularTotal(100, 3, 10) -> 270
  //   (aprox. 8 líneas)

  // TODO (en clase):
  //   1. ✅ PURA sobre datos: function aplicarSubidaDePrecios(listaProductos, porcentaje)
  //      que devuelva listaProductos.map((producto) => ({ ...producto,
  //      precio: Number((producto.precio * (1 + porcentaje / 100)).toFixed(2)) }));
  //      No toca el array original: devuelve uno nuevo.
  //   2. Guarda const catalogoConSubida = aplicarSubidaDePrecios(catalogoOriginal, 10);
  //      e imprime PRIMERO catalogoOriginal ('Original (intacto) ->') y después
  //      catalogoConSubida ('Resultado nuevo ->').
  //   Resultado esperado en pantalla: el original con precios 50 y 20, y el
  //   nuevo con 55 y 22.
  //   (aprox. 8 líneas)

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

  // --- a) Modifica una variable externa ---

  // TODO (en clase):
  //   1. titulo('5. Funciones impuras y efectos secundarios').
  //   2. Declara let totalAcumulado = 0; y escribe
  //      ❌ function sumarAlTotal(cantidad) { totalAcumulado += cantidad;
  //         return totalAcumulado; }
  //   3. Llámala TRES veces seguidas con el MISMO argumento (10) e imprime
  //      cada resultado. La misma entrada da salidas distintas: ahí está la trampa.
  //   Resultado esperado en pantalla:
  //      sumarAlTotal(10) -> 10
  //      sumarAlTotal(10) -> 20
  //      sumarAlTotal(10) -> 30
  //   (aprox. 8 líneas)

  // --- b) Modifica el array recibido ---

  // TODO (en clase):
  //   1. Declara const inscritos = ['Ana', 'Diego'];
  //   2. ❌ function inscribirImpura(lista, nombre) que haga lista.push(nombre)
  //      y devuelva lista.
  //   3. ✅ function inscribirPura(lista, nombre) que devuelva [...lista, nombre].
  //   4. Llama a la IMPURA con 'Marta' y demuestra el daño: imprime `inscritos`
  //      (ya tiene Marta) y la comparación resultadoImpuro === inscritos (true).
  //   5. Llama a la PURA con 'Sara' y demuestra lo contrario: imprime `inscritos`
  //      (sin Sara), el array devuelto (con Sara) y la comparación === (false).
  //   Resultado esperado en pantalla:
  //      Tras la impura, el array original -> ["Ana", "Diego", "Marta"]
  //      ¿Devolvió el MISMO array? -> true
  //      Tras la pura, el original -> ["Ana", "Diego", "Marta"]
  //      El array devuelto -> ["Ana", "Diego", "Marta", "Sara"]
  //      ¿Es el mismo array? -> false
  //   (aprox. 12 líneas)

  // --- c) Depende de datos cambiantes ---

  // TODO (en clase):
  //   1. ❌ function generarCodigoDescuento() que devuelva
  //      'DESC-' + Math.floor(Math.random() * 10000).
  //   2. Llámala DOS veces e imprime las dos: salen distintas.
  //   Resultado esperado en pantalla: dos códigos DESC-XXXX diferentes
  //   (los números cambian en cada recarga: eso es justo lo que se quiere ver).
  //   (aprox. 5 líneas)

  /*
   * ✅ TRUCO PROFESIONAL: convertir una impura en pura moviendo la
   * parte impredecible a un PARÁMETRO. Así la función se puede probar
   * pasándole un número fijo, y quien la llame decide de dónde sale
   * el azar. Esto se llama "inyección de dependencias".
   */

  // TODO (en clase):
  //   1. function generarCodigoPuro(numeroAleatorio) que devuelva
  //      'DESC-' + Math.floor(numeroAleatorio * 10000).
  //   2. Llámala DOS veces con el MISMO 0.42: siempre da lo mismo.
  //   3. Llámala una tercera vez con Math.random(): el azar entra desde fuera.
  //   Resultado esperado en pantalla:
  //      generarCodigoPuro(0.42) -> DESC-4200
  //      generarCodigoPuro(0.42) -> DESC-4200
  //      Con azar real -> DESC-XXXX (cambia en cada recarga)
  //   (aprox. 5 líneas)

  // TODO (en clase):
  //   1. Lo mismo con la fecha: function describirDia(fecha = new Date()) que
  //      tenga dentro el array ['domingo', 'lunes', 'martes', 'miércoles',
  //      'jueves', 'viernes', 'sábado'] y devuelva
  //      'Ese día fue ' + dias[fecha.getDay()].
  //   2. Matiz honesto para clase: con el valor por defecto, llamarla SIN
  //      argumento sigue siendo impuro (depende del reloj). Se vuelve pura en
  //      cuanto quien la llama le pasa la fecha, y eso permite escribir pruebas
  //      repetibles.
  //   3. Llámala con new Date(2026, 7, 26) e imprime el resultado.
  //   Resultado esperado en pantalla:
  //      describirDia(new Date(2026, 7, 26)) -> Ese día fue miércoles
  //   (aprox. 6 líneas)

  // ============================================================
  // 6. TABLA RESUMEN
  // ============================================================

  // TODO (en clase):
  //   1. titulo('6. Resumen: ¿es pura?').
  //   2. Declara const casos = [ ... ], un array de seis objetos con las
  //      propiedades funcion, pura y motivo:
  //        '(a, b) => a + b'                SÍ  solo usa sus parámetros
  //        'lista => [...lista].sort()'     SÍ  copia antes de ordenar
  //        'lista => lista.sort()'          NO  modifica el array recibido
  //        '() => Math.random()'            NO  resultado impredecible
  //        'texto => console.log(texto)'    NO  escribe fuera (efecto)
  //        'n => contador += n'             NO  modifica una variable externa
  //   3. Recórrelo con casos.forEach(...) e imprime cada fila alineada:
  //      '   ' + caso.pura.padEnd(3) + ' | ' + caso.funcion.padEnd(28) + ' | ' + caso.motivo
  //   Resultado esperado en pantalla: una tabla de seis filas en columnas.
  //   (aprox. 12 líneas)

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
