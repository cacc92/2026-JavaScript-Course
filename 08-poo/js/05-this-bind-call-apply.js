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
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 0. CONSOLA VISUAL
  // ==========================================================================
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

  titulo('1. this DEPENDE DE CÓMO SE LLAMA');

  const cafeteria = {
    nombre: 'Cafetería del campus',
    productos: ['café', 'té', 'tostada'],

    mostrarNombre() {
      // Usamos this?.nombre para que no explote si this es undefined.
      return this?.nombre ?? '(this no tiene nombre)';
    },
  };

  // FORMA A: llamada como método -> this = cafeteria
  imprimir('A) cafeteria.mostrarNombre():', cafeteria.mostrarNombre());

  // FORMA B: extraemos la función a una variable y la llamamos suelta.
  // Es EXACTAMENTE la misma función, pero ya no hay nada a la izquierda del
  // punto, así que se pierde el contexto.
  const funcionSuelta = cafeteria.mostrarNombre;
  imprimir('B) funcionSuelta():', funcionSuelta());

  // ⚠️ ERROR COMÚN: creer que la función "se lleva puesto" su objeto.
  // No: la función y el objeto solo se juntan en el instante de la llamada.

  // FORMA C: llamada con `new` -> this = el objeto recién creado.
  function Camarero(nombre) {
    this.nombre = nombre;
  }
  const camarero = new Camarero('Sofía');
  imprimir('C) con new, this es la nueva instancia:', camarero.nombre);

  // FORMA D: llamada explícita con call/apply/bind -> nosotros decidimos this.
  imprimir('D) call:', cafeteria.mostrarNombre.call({ nombre: 'Bar de enfrente' }));

  // ==========================================================================
  // 2. LA PÉRDIDA DE CONTEXTO EN CALLBACKS
  // ==========================================================================
  // Un CALLBACK es una función que le entregamos a otra para que la ejecute
  // más tarde (setTimeout, addEventListener, map, forEach...).
  // Cuando entregamos un MÉTODO como callback, quien lo ejecuta lo llama a
  // secas -> se pierde el `this`. Es el bug número uno de este tema.

  titulo('2. PÉRDIDA DE CONTEXTO');

  class Cronometro {
    constructor(etiqueta) {
      this.etiqueta = etiqueta;
      this.segundos = 0;
    }

    // Método normal, para demostrar qué pasa al extraerlo del objeto.
    estado() {
      return `${this.etiqueta}: ${this.segundos} s`;
    }

    // Versión problemática: usa `this` dentro de un callback normal.
    tickRoto() {
      // setTimeout llamará a esta función anónima SIN objeto delante.
      // Dato exacto que conviene contar en clase: el navegador la invoca con
      // `this` = window (el objeto global), NO con this = undefined.
      // Por eso muchas veces NO salta ningún error: simplemente el contador
      // nunca sube y aparecen valores raros como NaN o undefined. Un fallo
      // silencioso es más peligroso que uno ruidoso.
      setTimeout(function () {
        imprimir('\n⚠ [tickRoto] ¿this es el cronómetro?', this === crono); // false
        imprimir('⚠ [tickRoto] ¿this es window?', this === globalThis);      // true
        imprimir('⚠ [tickRoto] this.etiqueta vale:', this.etiqueta);         // undefined
        // Si aquí escribiéramos this.segundos += 1 no daría error: crearía
        // una variable global basura llamada window.segundos con valor NaN.
      }, 0); // 0 ms: se ejecuta en cuanto el navegador esté libre
    }

    // SOLUCIÓN 1: bind. Crea una copia de la función con el `this` "pegado".
    tickConBind() {
      setTimeout(function () {
        this.segundos += 1;
        imprimir(`✅ [bind] ${this.etiqueta}: ${this.segundos} s`);
      }.bind(this), 0); //   <- el bind es la clave
    }

    // SOLUCIÓN 2: arrow function. Las funciones flecha NO tienen `this` propio:
    // heredan el del lugar donde se escribieron (aquí, el método). Es la
    // solución preferida hoy en día por lo corta y clara que queda.
    tickConArrow() {
      setTimeout(() => {
        this.segundos += 1;
        imprimir(`✅ [arrow] ${this.etiqueta}: ${this.segundos} s`);
      }, 0);
    }

    // SOLUCIÓN 3: guardar `this` en una variable (el truco clásico anterior a
    // ES6). Verás mucho código antiguo con `var self = this;` o `var that = this;`.
    tickConSelf() {
      const self = this; // Guardamos la referencia mientras aún es correcta
      setTimeout(function () {
        self.segundos += 1; // Usamos `self`, no `this`
        imprimir(`✅ [self] ${self.etiqueta}: ${self.segundos} s`);
      }, 0);
    }
  }

  const crono = new Cronometro('Sesión de POO');

  // Antes de los tres arreglos, veamos el fallo RUIDOSO: extraer un método de
  // una clase y llamarlo suelto. Los métodos de clase son siempre estrictos,
  // así que aquí `this` sí vale undefined y el error salta de inmediato.
  const metodoSuelto = crono.estado;
  imprimir('Llamado como método:', crono.estado());
  try {
    imprimir('Llamado suelto:', metodoSuelto());
  } catch (error) {
    imprimir('⚠ Método extraído de la clase ->', error.message);
  }
  // ✅ BUENA PRÁCTICA: si necesitas pasar un método por ahí, pásalo ya atado:
  const metodoAtado = crono.estado.bind(crono);
  imprimir('✅ Con bind funciona:', metodoAtado());

  crono.tickRoto();
  crono.tickConBind();
  crono.tickConArrow();
  crono.tickConSelf();
  imprimir('(Los cuatro resultados aparecen justo debajo: setTimeout es asíncrono,');
  imprimir(' así que se ejecutan DESPUÉS de terminar todo este archivo.)');

  // ⚠️ CONTRAEJEMPLO IMPORTANTE: la arrow function es genial como callback,
  // pero es una PÉSIMA elección como método de un objeto literal, porque
  // entonces hereda el `this` de fuera (que no es el objeto).
  const objetoConArrow = {
    nombre: 'Objeto de prueba',
    metodoNormal() {
      return this?.nombre ?? 'sin this';
    },
    metodoArrow: () => {
      // Aquí `this` es el de la IIFE que envuelve el archivo, no el objeto.
      return this?.nombre ?? 'sin this (arrow no ve el objeto)';
    },
  };
  imprimir('\nMétodo normal:', objetoConArrow.metodoNormal());
  imprimir('Método arrow: ', objetoConArrow.metodoArrow());

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

  titulo('3. call, apply Y bind');

  function presentarPedido(mesa, propina) {
    // `this` será el objeto que le pasemos como primer argumento.
    return `${this.nombre} sirve la mesa ${mesa} (propina: ${propina} EUR).`;
  }

  const bar = { nombre: 'Bar Central' };
  const terraza = { nombre: 'Terraza del parque' };

  // call: argumentos separados por comas.
  imprimir('call:  ', presentarPedido.call(bar, 4, 2));

  // apply: los mismos argumentos, pero dentro de un array.
  imprimir('apply: ', presentarPedido.apply(terraza, [7, 3.5]));

  // bind: NO ejecuta nada; nos devuelve una función nueva con el `this` fijado.
  const servirEnElBar = presentarPedido.bind(bar);
  imprimir('bind:  ', servirEnElBar(1, 1.5));

  // bind también admite APLICACIÓN PARCIAL: fijar de antemano algunos argumentos.
  const servirMesaVip = presentarPedido.bind(terraza, 'VIP');
  imprimir('bind parcial:', servirMesaVip(10)); // La mesa ya viene fijada

  // Una función "bindeada" no se puede re-bindear: el primer bind manda.
  const intentoDeRebind = servirEnElBar.bind(terraza);
  imprimir('¿Se puede re-bindear?', intentoDeRebind(2, 1)); // Sigue siendo Bar Central

  // --- USO PRÁCTICO 1: "pedir prestado" un método a otro objeto ---
  const alumnoUno = {
    nombre: 'Ana',
    notas: [8, 9],
    media() {
      return this.notas.reduce((t, n) => t + n, 0) / this.notas.length;
    },
  };
  // Este objeto tiene notas pero NO tiene el método media. Se lo prestamos.
  const alumnoDos = { nombre: 'Luis', notas: [6, 7, 8] };
  imprimir('\nMétodo prestado con call:', alumnoUno.media.call(alumnoDos).toFixed(2)); // 7.00

  // --- USO PRÁCTICO 2: apply con funciones que reciben muchos argumentos ---
  const temperaturas = [17, 23, 19, 28, 15];
  // Math.max no acepta arrays, acepta números sueltos. apply los "reparte".
  imprimir('Máxima con apply:', Math.max.apply(null, temperaturas)); // 28
  // ✅ BUENA PRÁCTICA moderna: hoy se hace con el operador spread, más legible.
  imprimir('Máxima con spread:', Math.max(...temperaturas));         // 28

  // --- USO PRÁCTICO 3: convertir "array-like" en array de verdad ---
  function contarArgumentos() {
    // `arguments` es un objeto parecido a un array, pero SIN map ni filter.
    const comoArray = Array.prototype.slice.call(arguments);
    return `Recibí ${comoArray.length} argumentos: ${comoArray.join(', ')}`;
  }
  imprimir(contarArgumentos('a', 'b', 'c'));
  // ✅ BUENA PRÁCTICA moderna: usa parámetros rest (...args) o Array.from().

  // ==========================================================================
  // 4. TABLA RESUMEN
  // ==========================================================================
  titulo('4. RESUMEN DE LAS SOLUCIONES');
  imprimir('bind   -> function () {...}.bind(this)   | funciona siempre, clásico');
  imprimir('arrow  -> () => {...}                    | la más usada hoy');
  imprimir('self   -> const self = this;             | código antiguo (pre-ES6)');
  imprimir('call   -> f.call(obj, a, b)              | ejecuta ya, comas');
  imprimir('apply  -> f.apply(obj, [a, b])           | ejecuta ya, array');

  // ==========================================================================
  // 5. `this` EN LOS EVENTOS DEL DOM (BOTONES REALES)
  // ==========================================================================
  // En un manejador de eventos escrito con `function`, `this` es el ELEMENTO
  // que recibió el evento. En una arrow function, NO: hereda el `this` de fuera.
  // Por eso, dentro de una clase, casi siempre queremos arrow o bind.

  const panel = {
    nombre: 'Panel de control',
    clics: 0,

    // Manejador con function: `this` será el BOTÓN, no el panel.
    manejadorRoto: function (evento) {
      // Mostramos this.tagName / this.id para ver que es el elemento del DOM.
      const quienEsThis = this === panel ? 'el objeto panel' : 'el elemento <' + this.tagName.toLowerCase() + '>';
      imprimir(`\n[function] this es ${quienEsThis}`);
      imprimir('⚠ this.clics vale:', this.clics, '-> no podemos contar los clics del panel.');
      // evento.currentTarget es la alternativa fiable al `this` del DOM.
      imprimir('   (evento.currentTarget.id =', evento.currentTarget.id + ')');
    },

    // Manejador con bind: forzamos que `this` sea el panel.
    manejadorConBind: function (evento) {
      this.clics += 1;
      imprimir(`\n[bind] this es ${this.nombre}. Clics contados: ${this.clics}`);
      imprimir('   (el botón sigue disponible en evento.currentTarget:',
        evento.currentTarget.id + ')');
    },

    // Manejador con arrow: hereda el `this` del sitio donde se DEFINIÓ.
    // Al estar escrita dentro de un objeto literal, ese `this` NO es el panel:
    // por eso aquí usamos `panel` por su nombre. Dentro de una CLASE, en
    // cambio, la arrow sí capturaría la instancia correctamente.
    manejadorConArrow: (evento) => {
      panel.clics += 1;
      imprimir(`\n[arrow] Clics contados: ${panel.clics} (usando el nombre del objeto)`);
      imprimir('   Botón pulsado:', evento.currentTarget.id);
    },
  };

  // Enganchamos cada botón, si existe en la página.
  const botonRoto = document.getElementById('btn-this-roto');
  const botonBind = document.getElementById('btn-this-bind');
  const botonArrow = document.getElementById('btn-this-arrow');

  if (botonRoto) botonRoto.addEventListener('click', panel.manejadorRoto);
  // .bind(panel) devuelve una función NUEVA con el this fijado al panel.
  if (botonBind) botonBind.addEventListener('click', panel.manejadorConBind.bind(panel));
  if (botonArrow) botonArrow.addEventListener('click', panel.manejadorConArrow);

  // ⚠️ ERROR COMÚN: escribir addEventListener('click', panel.manejador()).
  // Con paréntesis EJECUTAS la función ahora y registras su resultado
  // (normalmente undefined). Se pasa la función SIN paréntesis.

  // ⚠️ OTRO ERROR COMÚN: intentar quitar con removeEventListener una función
  // que se registró con .bind(). Cada bind crea una función distinta, así que
  // hay que guardarla en una variable si luego quieres desengancharla:
  //     const manejador = panel.metodo.bind(panel);
  //     boton.addEventListener('click', manejador);
  //     boton.removeEventListener('click', manejador);

  titulo('5. PRUEBA LOS BOTONES DE ARRIBA');
  imprimir('Pulsa los tres botones y compara qué imprime cada uno.');

  imprimir('\n(Fin del archivo 05. Continúa con el proyecto de la biblioteca.)');

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
