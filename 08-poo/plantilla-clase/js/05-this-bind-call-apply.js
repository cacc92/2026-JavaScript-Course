/**
 * ============================================================================
 * ARCHIVO: js/05-this-bind-call-apply.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Qué es `this` y la regla de oro: depende de CÓMO se llama la función.
 *   2. Las cuatro formas de invocar una función y qué vale `this` en cada una.
 *   3. La PÉRDIDA DE CONTEXTO: el error más frecuente de la POO en JavaScript.
 *   4. Las tres soluciones clásicas: bind, arrow function y variable `self`.
 *   5. call, apply y bind explicados con ejemplos y comparados en una tabla.
 *   6. `this` en los eventos del DOM (con botones reales en la página).
 *
 * QUÉ SE APRENDE
 *   A no volver a ver nunca más el mensaje "Cannot read properties of
 *   undefined" cuando pasas un método como callback.
 *
 * (Envuelto en una IIFE para no chocar con las variables de los otros archivos.)
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y las utilidades (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/05-this-bind-call-apply.js
 *
 *   OJO: mientras no se escriban los manejadores de la sección 5, los tres
 *   botones de la página (this roto / bind / arrow) no harán nada. Es lo
 *   esperado: no dan error, simplemente no tienen nada enganchado todavía.
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia.

  var ID_SALIDA = 'salida-05';

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

  const botonLimpiar = document.getElementById('limpiar-05');
  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. LA REGLA DE ORO DE `this`
  // ==========================================================================
  // `this` NO es "el objeto donde está escrita la función".
  // `this` se decide en el MOMENTO DE LA LLAMADA, mirando qué hay a la
  // izquierda del punto.
  //
  //     objeto.metodo()   ->  this = objeto      (hay algo a la izquierda)
  //     metodo()          ->  this = undefined   (en modo estricto)
  //
  // Analogía: `this` es como decir "aquí" por teléfono. La palabra es siempre
  // la misma, pero el lugar al que se refiere depende de quién la pronuncia.

  // TODO (en clase):
  //   1. titulo('1. this DEPENDE DE CÓMO SE LLAMA').
  //   2. Declara el objeto de partida:
  //        const cafeteria = {
  //          nombre: 'Cafetería del campus',
  //          productos: ['café', 'té', 'tostada'],
  //          mostrarNombre() { return this?.nombre ?? '(this no tiene nombre)'; },
  //        };
  //      (Usamos this?.nombre para que no explote si this es undefined.)
  //   3. FORMA A: llamada como método -> this = cafeteria.
  //        imprimir('A) cafeteria.mostrarNombre():', cafeteria.mostrarNombre())
  //   4. FORMA B: extraemos la función a una variable y la llamamos suelta.
  //      Es EXACTAMENTE la misma función, pero ya no hay nada a la izquierda
  //      del punto, así que se pierde el contexto:
  //        const funcionSuelta = cafeteria.mostrarNombre;
  //        imprimir('B) funcionSuelta():', funcionSuelta())
  //      ⚠️ ERROR COMÚN: creer que la función "se lleva puesto" su objeto. No:
  //      la función y el objeto solo se juntan en el instante de la llamada.
  //   5. FORMA C: llamada con `new` -> this = el objeto recién creado.
  //        function Camarero(nombre) { this.nombre = nombre; }
  //        const camarero = new Camarero('Sofía');
  //        imprimir('C) con new, this es la nueva instancia:', camarero.nombre)
  //   6. FORMA D: llamada explícita con call/apply/bind -> nosotros decidimos this.
  //        imprimir('D) call:', cafeteria.mostrarNombre.call({ nombre: 'Bar de enfrente' }))
  //   Resultado esperado en pantalla:
  //        A) cafeteria.mostrarNombre(): Cafetería del campus
  //        B) funcionSuelta(): (this no tiene nombre)
  //        C) con new, this es la nueva instancia: Sofía
  //        D) call: Bar de enfrente
  //   (aprox. 16 lineas)

  // ==========================================================================
  // 2. LA PÉRDIDA DE CONTEXTO EN CALLBACKS
  // ==========================================================================
  // Un CALLBACK es una función que le entregamos a otra para que la ejecute
  // más tarde (setTimeout, addEventListener, map, forEach...).
  // Cuando entregamos un MÉTODO como callback, quien lo ejecuta lo llama a
  // secas -> se pierde el `this`. Es el bug número uno de este tema.

  // TODO (en clase):
  //   1. titulo('2. PÉRDIDA DE CONTEXTO').
  //   2. Declara `class Cronometro` con constructor(etiqueta) que guarde
  //      this.etiqueta y this.segundos = 0, y el método
  //        estado() -> `${this.etiqueta}: ${this.segundos} s`
  //      (método normal, para demostrar qué pasa al extraerlo del objeto).
  //   3. Método PROBLEMÁTICO tickRoto(): dentro llama a setTimeout con una
  //      `function` anónima y 0 ms. setTimeout la invocará SIN objeto delante.
  //      Dato exacto que conviene contar en clase: el navegador la llama con
  //      `this` = window (el objeto global), NO con this = undefined. Por eso
  //      muchas veces NO salta ningún error: el contador nunca sube y aparecen
  //      valores raros como NaN o undefined. Un fallo silencioso es más
  //      peligroso que uno ruidoso. Dentro imprime:
  //        imprimir('\n⚠ [tickRoto] ¿this es el cronómetro?', this === crono)  -> false
  //        imprimir('⚠ [tickRoto] ¿this es window?', this === globalThis)       -> true
  //        imprimir('⚠ [tickRoto] this.etiqueta vale:', this.etiqueta)          -> undefined
  //   (aprox. 16 lineas)

  // TODO (en clase): las TRES SOLUCIONES, como métodos de la misma clase.
  //   1. SOLUCIÓN 1 — bind. Crea una copia de la función con el `this` "pegado":
  //        tickConBind() {
  //          setTimeout(function () {
  //            this.segundos += 1;
  //            imprimir(`✅ [bind] ${this.etiqueta}: ${this.segundos} s`);
  //          }.bind(this), 0);        //  <- el bind es la clave
  //        }
  //   2. SOLUCIÓN 2 — arrow function. Las flechas NO tienen `this` propio:
  //      heredan el del lugar donde se escribieron (aquí, el método). Es la
  //      solución preferida hoy por lo corta y clara que queda:
  //        tickConArrow() {
  //          setTimeout(() => { this.segundos += 1;
  //            imprimir(`✅ [arrow] ${this.etiqueta}: ${this.segundos} s`); }, 0);
  //        }
  //   3. SOLUCIÓN 3 — guardar `this` en una variable (truco clásico anterior a
  //      ES6; verás mucho código antiguo con `var self = this;` o `var that = this;`):
  //        tickConSelf() {
  //          const self = this;      // Guardamos la referencia mientras aún es correcta
  //          setTimeout(function () { self.segundos += 1;
  //            imprimir(`✅ [self] ${self.etiqueta}: ${self.segundos} s`); }, 0);
  //        }
  //   (aprox. 20 lineas)

  // TODO (en clase): probar el cronómetro.
  //   1. const crono = new Cronometro('Sesión de POO');
  //   2. Antes de los tres arreglos, el fallo RUIDOSO: extraer un método de una
  //      clase y llamarlo suelto. Los métodos de clase son SIEMPRE estrictos,
  //      así que aquí `this` sí vale undefined y el error salta de inmediato:
  //        const metodoSuelto = crono.estado;
  //        imprimir('Llamado como método:', crono.estado());
  //        try { imprimir('Llamado suelto:', metodoSuelto()); }
  //        catch (error) { imprimir('⚠ Método extraído de la clase ->', error.message); }
  //   3. ✅ BUENA PRÁCTICA: si necesitas pasar un método por ahí, pásalo ya atado:
  //        const metodoAtado = crono.estado.bind(crono);
  //        imprimir('✅ Con bind funciona:', metodoAtado());
  //   4. Lanza los cuatro ticks en este orden: crono.tickRoto(); crono.tickConBind();
  //      crono.tickConArrow(); crono.tickConSelf();
  //   5. Y avisa de que la salida llega después:
  //        imprimir('(Los cuatro resultados aparecen justo debajo: setTimeout es asíncrono,');
  //        imprimir(' así que se ejecutan DESPUÉS de terminar todo este archivo.)');
  //   Resultado esperado en pantalla: "Sesión de POO: 0 s", el error de
  //   "Cannot read properties of undefined (reading 'etiqueta')", el bind que sí
  //   funciona y, al final del archivo, los tres ✅ con 1, 2 y 3 segundos.
  //   (aprox. 13 lineas)

  // ⚠️ CONTRAEJEMPLO IMPORTANTE: la arrow function es genial como callback,
  // pero es una PÉSIMA elección como método de un objeto literal, porque
  // entonces hereda el `this` de fuera (que no es el objeto).
  // TODO (en clase):
  //   1. const objetoConArrow = {
  //        nombre: 'Objeto de prueba',
  //        metodoNormal() { return this?.nombre ?? 'sin this'; },
  //        metodoArrow: () => this?.nombre ?? 'sin this (arrow no ve el objeto)',
  //      };
  //      (En metodoArrow, `this` es el de la IIFE que envuelve el archivo.)
  //   2. imprimir('\nMétodo normal:', objetoConArrow.metodoNormal());
  //      imprimir('Método arrow: ', objetoConArrow.metodoArrow());
  //   Resultado esperado en pantalla:
  //        Método normal: Objeto de prueba
  //        Método arrow:  sin this (arrow no ve el objeto)
  //   (aprox. 12 lineas)

  // ==========================================================================
  // 3. call, apply Y bind
  // ==========================================================================
  // Los tres sirven para DECIDIR nosotros cuál será el `this` de una función.
  // La diferencia está en los argumentos y en el momento de ejecución:
  //
  //   funcion.call(objeto, arg1, arg2)   -> ejecuta YA, argumentos sueltos
  //   funcion.apply(objeto, [arg1, arg2])-> ejecuta YA, argumentos en ARRAY
  //   funcion.bind(objeto, arg1)         -> NO ejecuta: devuelve función nueva
  //
  // Truco para memorizarlo: Call = Comas, Apply = Array, Bind = Bolsillo
  // (te la guardas para luego).

  // TODO (en clase):
  //   1. titulo('3. call, apply Y bind').
  //   2. function presentarPedido(mesa, propina) -> devuelve
  //        `${this.nombre} sirve la mesa ${mesa} (propina: ${propina} EUR).`
  //      (`this` será el objeto que le pasemos como primer argumento.)
  //   3. const bar = { nombre: 'Bar Central' };  y
  //      const terraza = { nombre: 'Terraza del parque' };
  //   4. Las tres formas:
  //        imprimir('call:  ', presentarPedido.call(bar, 4, 2));            // comas
  //        imprimir('apply: ', presentarPedido.apply(terraza, [7, 3.5]));   // array
  //        const servirEnElBar = presentarPedido.bind(bar);                 // no ejecuta
  //        imprimir('bind:  ', servirEnElBar(1, 1.5));
  //   5. bind también admite APLICACIÓN PARCIAL: fijar de antemano algunos
  //      argumentos:
  //        const servirMesaVip = presentarPedido.bind(terraza, 'VIP');
  //        imprimir('bind parcial:', servirMesaVip(10));   // La mesa ya viene fijada
  //   6. Una función "bindeada" NO se puede re-bindear: el primer bind manda.
  //        const intentoDeRebind = servirEnElBar.bind(terraza);
  //        imprimir('¿Se puede re-bindear?', intentoDeRebind(2, 1));  // Sigue siendo Bar Central
  //   Resultado esperado en pantalla:
  //        call:   Bar Central sirve la mesa 4 (propina: 2 EUR).
  //        apply:  Terraza del parque sirve la mesa 7 (propina: 3.5 EUR).
  //        bind:   Bar Central sirve la mesa 1 (propina: 1.5 EUR).
  //        bind parcial: Terraza del parque sirve la mesa VIP (propina: 10 EUR).
  //        ¿Se puede re-bindear? Bar Central sirve la mesa 2 (propina: 1 EUR).
  //   (aprox. 14 lineas)

  // TODO (en clase): USO PRÁCTICO 1 — "pedir prestado" un método a otro objeto.
  //   1. const alumnoUno = { nombre: 'Ana', notas: [8, 9],
  //        media() { return this.notas.reduce((t, n) => t + n, 0) / this.notas.length; } };
  //   2. Este objeto tiene notas pero NO tiene el método media. Se lo prestamos:
  //        const alumnoDos = { nombre: 'Luis', notas: [6, 7, 8] };
  //        imprimir('\nMétodo prestado con call:', alumnoUno.media.call(alumnoDos).toFixed(2))
  //   Resultado esperado en pantalla: Método prestado con call: 7.00
  //   (aprox. 9 lineas)

  // TODO (en clase): USO PRÁCTICO 2 — apply con funciones que reciben muchos
  // argumentos.
  //   1. const temperaturas = [17, 23, 19, 28, 15];
  //   2. Math.max no acepta arrays, acepta números sueltos; apply los "reparte":
  //        imprimir('Máxima con apply:', Math.max.apply(null, temperaturas))  -> 28
  //   3. ✅ BUENA PRÁCTICA moderna: hoy se hace con el operador spread, más legible:
  //        imprimir('Máxima con spread:', Math.max(...temperaturas))          -> 28
  //   (aprox. 4 lineas)

  // TODO (en clase): USO PRÁCTICO 3 — convertir un "array-like" en array de verdad.
  //   1. function contarArgumentos() { ... } donde `arguments` es un objeto
  //      parecido a un array pero SIN map ni filter:
  //        const comoArray = Array.prototype.slice.call(arguments);
  //        return `Recibí ${comoArray.length} argumentos: ${comoArray.join(', ')}`;
  //   2. imprimir(contarArgumentos('a', 'b', 'c'))
  //   Resultado esperado en pantalla: Recibí 3 argumentos: a, b, c
  //   ✅ BUENA PRÁCTICA moderna: usa parámetros rest (...args) o Array.from().
  //   (aprox. 6 lineas)

  // ==========================================================================
  // 4. TABLA RESUMEN
  // ==========================================================================
  // TODO (en clase):
  //   1. titulo('4. RESUMEN DE LAS SOLUCIONES').
  //   2. Imprime las cinco filas de la tabla, tal cual:
  //        imprimir('bind   -> function () {...}.bind(this)   | funciona siempre, clásico');
  //        imprimir('arrow  -> () => {...}                    | la más usada hoy');
  //        imprimir('self   -> const self = this;             | código antiguo (pre-ES6)');
  //        imprimir('call   -> f.call(obj, a, b)              | ejecuta ya, comas');
  //        imprimir('apply  -> f.apply(obj, [a, b])           | ejecuta ya, array');
  //   (aprox. 6 lineas)

  // ==========================================================================
  // 5. `this` EN LOS EVENTOS DEL DOM (BOTONES REALES)
  // ==========================================================================
  // En un manejador de eventos escrito con `function`, `this` es el ELEMENTO
  // que recibió el evento. En una arrow function, NO: hereda el `this` de fuera.
  // Por eso, dentro de una clase, casi siempre queremos arrow o bind.

  // TODO (en clase): el objeto `panel` con sus tres manejadores.
  //   1. const panel = { nombre: 'Panel de control', clics: 0, ... } con:
  //      a) manejadorRoto: function (evento) -> con `function`, `this` será el
  //         BOTÓN, no el panel:
  //           const quienEsThis = this === panel ? 'el objeto panel'
  //                 : 'el elemento <' + this.tagName.toLowerCase() + '>';
  //           imprimir(`\n[function] this es ${quienEsThis}`);
  //           imprimir('⚠ this.clics vale:', this.clics, '-> no podemos contar los clics del panel.');
  //           imprimir('   (evento.currentTarget.id =', evento.currentTarget.id + ')');
  //         (evento.currentTarget es la alternativa fiable al `this` del DOM.)
  //      b) manejadorConBind: function (evento) -> forzamos que `this` sea el panel:
  //           this.clics += 1;
  //           imprimir(`\n[bind] this es ${this.nombre}. Clics contados: ${this.clics}`);
  //           imprimir('   (el botón sigue disponible en evento.currentTarget:',
  //             evento.currentTarget.id + ')');
  //      c) manejadorConArrow: (evento) => ... -> hereda el `this` del sitio donde
  //         se DEFINIÓ. Al estar escrita dentro de un objeto literal, ese `this`
  //         NO es el panel: por eso aquí usamos `panel` por su nombre. Dentro de
  //         una CLASE, en cambio, la arrow sí capturaría la instancia:
  //           panel.clics += 1;
  //           imprimir(`\n[arrow] Clics contados: ${panel.clics} (usando el nombre del objeto)`);
  //           imprimir('   Botón pulsado:', evento.currentTarget.id);
  //   (aprox. 26 lineas)

  // TODO (en clase): enganchar cada botón, si existe en la página.
  //   1. const botonRoto  = document.getElementById('btn-this-roto');
  //      const botonBind  = document.getElementById('btn-this-bind');
  //      const botonArrow = document.getElementById('btn-this-arrow');
  //   2. if (botonRoto)  botonRoto.addEventListener('click', panel.manejadorRoto);
  //      // .bind(panel) devuelve una función NUEVA con el this fijado al panel:
  //      if (botonBind)  botonBind.addEventListener('click', panel.manejadorConBind.bind(panel));
  //      if (botonArrow) botonArrow.addEventListener('click', panel.manejadorConArrow);
  //   Resultado esperado: al pulsar los tres botones de la página, el primero
  //   dice que this es el elemento <button> y que this.clics es undefined; los
  //   otros dos van sumando el contador del panel (1, 2, 3...).
  //   (aprox. 6 lineas)

  // ⚠️ ERROR COMÚN: escribir addEventListener('click', panel.manejador()).
  // Con paréntesis EJECUTAS la función ahora y registras su resultado
  // (normalmente undefined). Se pasa la función SIN paréntesis.

  // ⚠️ OTRO ERROR COMÚN: intentar quitar con removeEventListener una función
  // que se registró con .bind(). Cada bind crea una función distinta, así que
  // hay que guardarla en una variable si luego quieres desengancharla:
  //     const manejador = panel.metodo.bind(panel);
  //     boton.addEventListener('click', manejador);
  //     boton.removeEventListener('click', manejador);

  // TODO (en clase): cierra el archivo con
  //   titulo('5. PRUEBA LOS BOTONES DE ARRIBA');
  //   imprimir('Pulsa los tres botones y compara qué imprime cada uno.');
  //   imprimir('\n(Fin del archivo 05. Continúa con el proyecto de la biblioteca.)');
  //   (aprox. 3 lineas)

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) PREDICE EL RESULTADO.
  //    Escribe un objeto `reloj` con la propiedad `hora` y el método
  //    `mostrar()`. Llámalo de tres maneras: reloj.mostrar(), guardándolo en
  //    una variable suelta y con .call({hora: '10:00'}). Antes de ejecutar,
  //    apunta en un comentario qué crees que saldrá en cada caso.
  //
  // 2) ARREGLA EL BUG.
  //    Dada esta clase, haz que funcione de tres formas distintas (bind,
  //    arrow y self), sin cambiar el setInterval:
  //        class Contador {
  //          constructor() { this.valor = 0; }
  //          empezar() { setInterval(function () { this.valor++; }, 1000); }
  //        }
  //
  // 3) MÉTODO PRESTADO.
  //    Crea un objeto `carritoA` con el array `articulos` y el método
  //    `total()`. Crea `carritoB` solo con `articulos` (sin método) y calcula
  //    su total usando call y luego usando apply.
  //
  // 4) APLICACIÓN PARCIAL CON bind.
  //    Escribe `function aplicarDescuento(porcentaje, precio)`. Usando bind,
  //    crea las funciones `descuento10` y `descuento50`, que ya lleven fijado
  //    el porcentaje y solo pidan el precio.
  //
  // 5) RETO (difícil).
  //    Implementa tu propia versión de bind, llamada `miBind(funcion, objeto,
  //    ...argumentosFijos)`, que devuelva una función nueva. Debe respetar los
  //    argumentos fijados de antemano y añadirles los que se pasen después.
  //    Pista: dentro usarás `funcion.apply(objeto, [...])`.
  // ==========================================================================
})();
