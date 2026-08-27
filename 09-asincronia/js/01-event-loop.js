/**
 * ============================================================================
 * ARCHIVO: js/01-event-loop.js
 * TEMA:    Sincrono vs asincrono. El hilo unico, la pila de llamadas,
 *          las Web APIs, la cola de tareas y el EVENT LOOP.
 *          Temporizadores: setTimeout, clearTimeout, setInterval, clearInterval.
 *
 * QUE VAS A APRENDER
 *  1. Por que se dice que JavaScript "tiene un solo hilo".
 *  2. Que es la pila de llamadas (call stack) y como se vacia.
 *  3. Quien ejecuta realmente los temporizadores (spoiler: no es JavaScript).
 *  4. La diferencia entre MICROTAREAS (promesas) y MACROTAREAS (setTimeout),
 *     y por que eso decide el orden de los mensajes en pantalla.
 *  5. A programar, repetir y CANCELAR tareas en el tiempo.
 *
 * POR QUE ESTA TODO DENTRO DE UNA IIFE
 * IIFE = Immediately Invoked Function Expression = funcion que se define y se
 * ejecuta en el acto:   (function () { ... })();
 * Como el index.html carga CINCO archivos .js en la misma pagina, todos
 * comparten el mismo ambito global. Si dos archivos declararan
 * "const imprimir = ..." el navegador reventaria con el error
 * "Identifier 'imprimir' has already been declared".
 * Al meter cada archivo dentro de su propia funcion, sus variables viven
 * encerradas ahi dentro y nunca chocan con las de los demas.
 * ============================================================================
 */

(function () {
  // 'use strict' activa el modo estricto: el navegador avisa de errores que
  // normalmente se tragaria en silencio (por ejemplo, usar una variable sin
  // declarar). Es una red de seguridad gratuita.
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE LA CONSOLA VISUAL
  // ============================================================
  // Los estudiantes no siempre tienen abierto DevTools (F12). Estas dos
  // funciones escriben el mensaje en LOS DOS SITIOS: la consola real del
  // navegador y el bloque <pre> oscuro de la pagina.

  // Guardamos las referencias a los elementos UNA sola vez.
  // Buscar en el DOM en cada llamada seria trabajo repetido e innecesario.
  const consolaGeneral = document.getElementById('salida');
  const consola = document.getElementById('salida-eventloop');

  /**
   * imprimir(): muestra un mensaje en la consola del navegador Y en la
   * consola visual de esta seccion.
   * Los "..." de (...mensajes) se llaman parametros REST: recogen todos los
   * argumentos que reciba la funcion dentro de un array llamado mensajes.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes); // salida clasica de DevTools (el "..." aqui reparte el array)
    if (!consola) return;     // si la pagina no tiene esta consola, no hacemos nada

    const texto = mensajes
      // Un objeto impreso con String() daria "[object Object]", que no sirve
      // de nada. Por eso los objetos los convertimos a JSON con sangria.
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');

    consola.textContent += texto + '\n';
    consola.scrollTop = consola.scrollHeight; // auto-scroll: siempre se ve lo ultimo
  }

  /**
   * titulo(): imprime un separador visual antes de cada demo, para que la
   * consola no se convierta en una sopa de lineas sueltas.
   */
  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  /** limpiar(): vacia la consola visual (el docente la usa entre ejemplo y ejemplo). */
  function limpiar() {
    if (consola) consola.textContent = '';
  }

  // ============================================================
  // 1. MENSAJE DE BIENVENIDA EN LA CONSOLA GENERAL
  // ============================================================
  // Este es el unico codigo que se ejecuta solo al cargar la pagina.
  // Todo lo demas espera a que alguien pulse un boton: asi el docente
  // controla el ritmo de la clase.
  if (consolaGeneral) {
    consolaGeneral.textContent =
      'Proyecto 09 - Asincronia en JavaScript\n' +
      '------------------------------------------------------------\n' +
      'Cada seccion tiene su propia consola visual.\n' +
      'Abre tambien DevTools con F12: veras exactamente lo mismo.\n' +
      'Nada se ejecuta solo: pulsa los botones para lanzar cada demo.\n';
  }

  // ============================================================
  // 2. SINCRONO: UNA COSA CADA VEZ
  // ============================================================
  // JavaScript en el navegador tiene UN SOLO HILO de ejecucion.
  // Un hilo es como un unico cajero de banco: puede atender a mucha gente,
  // pero solo a una persona a la vez.
  //
  // La PILA DE LLAMADAS (call stack) es la lista de funciones que estan
  // ejecutandose ahora mismo. Funciona como una pila de platos:
  // lo ultimo que se apila es lo primero que se retira.
  //
  //   function a() { b(); }     Pila:  [a]
  //   function b() { c(); }     Pila:  [a, b]
  //   function c() { ... }      Pila:  [a, b, c]  -> c termina, se retira, luego b, luego a
  //
  // Mientras haya algo en la pila, el navegador NO PUEDE hacer nada mas:
  // ni repintar, ni responder a un clic. A eso se le llama "bloquear el hilo".

  /**
   * bloquearHilo(): ocupa el unico hilo durante los milisegundos indicados
   * con un bucle que no hace nada util, solo mirar el reloj.
   * Sirve para DEMOSTRAR en clase que la pagina se congela de verdad.
   *
   * ⚠️ ERROR COMUN: escribir bucles pesados (ordenar 500.000 elementos,
   * recorrer el DOM miles de veces) en el hilo principal. La pagina se queda
   * "colgada" y el usuario cree que el navegador se ha roto.
   */
  function bloquearHilo(milisegundos) {
    const inicio = Date.now();             // marca de tiempo en milisegundos
    while (Date.now() - inicio < milisegundos) {
      // Bucle vacio a proposito: mantiene la pila ocupada sin soltar el hilo.
    }
    return Date.now() - inicio;            // cuanto duro realmente el bloqueo
  }

  // ============================================================
  // 3. ASINCRONO: LA SALA DE ESPERA Y EL EVENT LOOP
  // ============================================================
  // Cuando escribimos setTimeout(fn, 1000), JavaScript NO cuenta el tiempo.
  // Le pasa el encargo al navegador (a lo que se llaman las WEB APIs) y sigue
  // ejecutando la linea siguiente inmediatamente.
  //
  // El recorrido completo de una tarea asincrona es:
  //
  //   1) La pila ejecuta setTimeout(...) y se lo entrega a las Web APIs.
  //   2) Las Web APIs (fuera del hilo de JavaScript) cuentan el tiempo.
  //   3) Cuando el tiempo se cumple, el callback NO se ejecuta de golpe:
  //      se pone a hacer cola en la COLA DE TAREAS (task queue).
  //   4) El EVENT LOOP es un vigilante que repite sin parar una pregunta:
  //      "¿esta VACIA la pila de llamadas?".
  //      Solo cuando la pila esta vacia, coge el primero de la cola y lo apila.
  //
  // Por eso setTimeout(fn, 0) NO significa "ya mismo": significa
  // "en cuanto la pila quede libre, y despues de todas las microtareas".
  //
  // DOS COLAS, NO UNA (esto es lo que sorprende a todo el mundo):
  //
  //   MICROTAREAS  -> las de las PROMESAS (.then, .catch, .finally, await)
  //                   y queueMicrotask(). Tienen PRIORIDAD: el event loop
  //                   vacia TODA esta cola antes de tocar la otra.
  //   MACROTAREAS  -> setTimeout, setInterval y los eventos del DOM.
  //                   Se atiende UNA por vuelta del bucle, y despues se
  //                   vuelven a vaciar las microtareas.
  //
  // ⚠️ MATIZ SOBRE fetch: la LLEGADA de la respuesta desde la red es una
  // macrotarea (la programa el navegador), pero el callback que escribimos
  // nosotros -el .then() o la linea siguiente al await- es una MICROTAREA,
  // porque lo que fetch devuelve es una promesa. Dicho de otro modo:
  // fetch espera como una macrotarea y continua como una microtarea.
  //
  // Regla de oro para el examen:
  //   codigo sincrono  ->  microtareas (promesas)  ->  macrotareas (timeouts)

  /**
   * demoOrdenDeEjecucion(): el ejemplo clasico de entrevista de trabajo.
   * Pide a la clase que prediga el orden ANTES de pulsar el boton.
   */
  function demoOrdenDeEjecucion() {
    titulo('1.1 - Orden real de ejecucion');
    imprimir('Prediccion: ¿en que orden crees que van a salir los 4 mensajes?');
    imprimir('------------------------------------------------------------');

    // (A) Codigo sincrono: se ejecuta AHORA, en esta misma pasada.
    imprimir('1) SINCRONO  - primera linea del script');

    // (B) Macrotarea: aunque pongamos 0 ms, se va a la cola de tareas.
    setTimeout(function () {
      imprimir('4) MACROTAREA - callback de setTimeout(..., 0)');
      imprimir('   -> el ultimo, porque las macrotareas van despues de las microtareas');
    }, 0);

    // (C) Microtarea: Promise.resolve() crea una promesa YA cumplida,
    //     asi que su .then se encola de inmediato... pero en la cola rapida.
    Promise.resolve().then(function () {
      imprimir('3) MICROTAREA - callback de Promise.resolve().then()');
      imprimir('   -> se ejecuta antes que el setTimeout aunque se escribio despues');
    });

    // (D) Mas codigo sincrono: sigue siendo AHORA.
    imprimir('2) SINCRONO  - ultima linea del script');

    imprimir('------------------------------------------------------------');
    imprimir('(la funcion ya termino; la pila esta vacia: entra el event loop)');
  }

  /**
   * explicarOrden(): el razonamiento paso a paso, para proyectarlo justo
   * despues de la demo anterior.
   */
  function explicarOrden() {
    titulo('1.1 bis - Por que ese orden, paso a paso');
    imprimir('PASO 1  La pila ejecuta imprimir("1) SINCRONO...") -> sale al instante.');
    imprimir('PASO 2  La pila ve setTimeout(fn, 0). NO espera: entrega fn a las Web APIs');
    imprimir('        y sigue. Las Web APIs esperan 0 ms y ponen fn en la COLA DE MACROTAREAS.');
    imprimir('PASO 3  La pila ve Promise.resolve().then(fn2). La promesa YA esta cumplida,');
    imprimir('        asi que fn2 va directa a la COLA DE MICROTAREAS.');
    imprimir('PASO 4  La pila ejecuta imprimir("2) SINCRONO...") -> sale al instante.');
    imprimir('PASO 5  La funcion termina. LA PILA QUEDA VACIA.');
    imprimir('PASO 6  El event loop mira primero las MICROTAREAS y las vacia TODAS: sale 3).');
    imprimir('PASO 7  Solo entonces coge UNA macrotarea de la otra cola: sale 4).');
    imprimir('');
    imprimir('RESUMEN:  sincrono  >  microtareas (promesas)  >  macrotareas (timeouts)');
    imprimir('');
    imprimir('[!] ERROR COMUN: creer que setTimeout(fn, 0) ejecuta fn "ahora mismo".');
    imprimir('   El 0 es un MINIMO de espera, no una promesa de inmediatez.');
  }

  /**
   * demoBloqueo(): demuestra que el hilo es uno solo.
   * Programamos un setTimeout de 0 ms y JUSTO DESPUES bloqueamos el hilo
   * dos segundos. El callback no puede colarse: tiene que esperar.
   */
  function demoBloqueo() {
    titulo('1.1 ter - Un solo hilo: bloquear la pagina');
    imprimir('Voy a programar un setTimeout de 0 ms y despues bloquear el hilo 2 segundos.');
    imprimir('Intenta pulsar cualquier boton mientras tanto: no respondera.');

    const marcaInicio = Date.now();

    setTimeout(function () {
      const retraso = Date.now() - marcaInicio;
      imprimir('El callback pedia 0 ms de espera y ha tardado ' + retraso + ' ms.');
      imprimir('Motivo: la pila estaba ocupada. El event loop no puede interrumpir nada.');
    }, 0);

    const duracion = bloquearHilo(2000);
    imprimir('Hilo bloqueado durante ' + duracion + ' ms (bucle while sin salida).');
    imprimir('[!] ERROR COMUN: hacer calculos pesados en el hilo principal congela la interfaz.');
    imprimir('[OK] BUENA PRACTICA: trocear el trabajo, o moverlo a un Web Worker.');
  }

  // ============================================================
  // 4. setTimeout Y clearTimeout
  // ============================================================
  // setTimeout(callback, ms) devuelve un IDENTIFICADOR (un numero en el
  // navegador). Ese identificador es el "ticket" que nos permite cancelar
  // la tarea antes de que ocurra, usando clearTimeout(identificador).
  //
  // ✅ BUENA PRACTICA: guarda SIEMPRE el identificador en una variable si
  // existe la mas minima posibilidad de tener que cancelar.

  // La variable vive en el ambito de la IIFE: la comparten las dos funciones
  // de abajo, pero es invisible para el resto de archivos del proyecto.
  let idAviso = null;

  function programarAviso() {
    titulo('1.2 - setTimeout y clearTimeout');

    // ⚠️ ERROR COMUN: pulsar el boton dos veces y crear dos temporizadores.
    // Cancelamos el anterior antes de crear uno nuevo.
    if (idAviso !== null) {
      clearTimeout(idAviso);
      imprimir('Habia un aviso pendiente: lo cancelo antes de programar el nuevo.');
    }

    imprimir('Programando un aviso para dentro de 3 segundos...');

    // ⚠️ ERROR COMUN: escribir setTimeout(miFuncion(), 3000) CON parentesis.
    // Con parentesis la funcion se ejecuta YA y a setTimeout le llega su
    // resultado (normalmente undefined). Hay que pasar la funcion SIN llamarla.
    idAviso = setTimeout(function () {
      imprimir('¡Han pasado 3 segundos! Aqui esta el aviso.');
      idAviso = null; // el temporizador ya se consumio: limpiamos la referencia
    }, 3000);

    imprimir('Identificador del temporizador: ' + idAviso);
    imprimir('Esta linea sale ANTES que el aviso: setTimeout no detiene el programa.');
  }

  function cancelarAviso() {
    titulo('1.2 bis - Cancelar un setTimeout');

    if (idAviso === null) {
      imprimir('No hay ningun aviso pendiente que cancelar.');
      return; // salida temprana: mas legible que envolver todo en un else
    }

    clearTimeout(idAviso);
    imprimir('Aviso ' + idAviso + ' cancelado. El callback NUNCA se ejecutara.');
    idAviso = null;
  }

  // ============================================================
  // 5. setInterval Y clearInterval
  // ============================================================
  // setInterval(callback, ms) repite el callback cada ms milisegundos
  // HASTA QUE ALGUIEN LO PARE. No se detiene solo. Nunca.
  //
  // ⚠️ ERROR COMUN (y grave): olvidar el clearInterval. El intervalo sigue
  // corriendo aunque el elemento haya desaparecido de la pantalla. Es una de
  // las fugas de memoria mas frecuentes en aplicaciones reales.

  let idCuenta = null;                 // identificador del intervalo activo
  let segundosRestantes = 10;          // estado de la cuenta atras
  const marcador = document.getElementById('marcador-cuenta');

  /** pintarMarcador(): actualiza la insignia de la pagina y su color. */
  function pintarMarcador(texto, clase) {
    if (!marcador) return;
    marcador.textContent = texto;
    // className se reescribe entero: asi quitamos la clase de color anterior.
    marcador.className = 'insignia' + (clase ? ' ' + clase : '');
  }

  function iniciarCuentaAtras() {
    titulo('1.3 - setInterval y clearInterval');

    if (idCuenta !== null) {
      imprimir('La cuenta atras ya esta en marcha. Detenla antes de reiniciarla.');
      return;
    }

    segundosRestantes = 10;
    imprimir('Arranco una cuenta atras de 10 segundos, un tick por segundo.');
    pintarMarcador('quedan ' + segundosRestantes + ' s', 'real');

    idCuenta = setInterval(function () {
      segundosRestantes = segundosRestantes - 1;
      imprimir('tick -> quedan ' + segundosRestantes + ' segundos');
      pintarMarcador('quedan ' + segundosRestantes + ' s', 'real');

      // ✅ BUENA PRACTICA: TODO setInterval debe tener escrita, desde el
      // primer momento, la condicion que lo detiene.
      if (segundosRestantes <= 0) {
        clearInterval(idCuenta);
        idCuenta = null;
        imprimir('Cuenta atras terminada. clearInterval ejecutado.');
        pintarMarcador('cuenta atras terminada', 'simulado');
      }
    }, 1000);

    imprimir('Identificador del intervalo: ' + idCuenta);
  }

  function detenerCuentaAtras() {
    if (idCuenta === null) {
      imprimir('No hay ninguna cuenta atras en marcha.');
      return;
    }
    clearInterval(idCuenta);
    imprimir('Cuenta atras detenida a mano en ' + segundosRestantes + ' segundos.');
    idCuenta = null;
    pintarMarcador('cuenta atras detenida', 'fallo');
  }

  // ============================================================
  // 6. CONECTAR LOS BOTONES (event listeners)
  // ============================================================
  // Un pequeno ayudante para no repetir el mismo if en cada boton.
  // Si el id no existe, avisamos por consola en vez de romper la pagina con
  // "Cannot read properties of null".

  /**
   * alPulsar(id, manejador): busca el boton por id y le engancha el clic.
   * ✅ BUENA PRACTICA: comprobar siempre que el elemento existe.
   */
  function alPulsar(id, manejador) {
    const boton = document.getElementById(id);
    if (!boton) {
      console.warn('[01-event-loop] No encuentro el boton con id "' + id + '".');
      return;
    }
    boton.addEventListener('click', manejador);
  }

  alPulsar('btn-orden-ejecucion', demoOrdenDeEjecucion);
  alPulsar('btn-explicar-orden', explicarOrden);
  alPulsar('btn-bloquear-hilo', demoBloqueo);
  alPulsar('btn-programar-timeout', programarAviso);
  alPulsar('btn-cancelar-timeout', cancelarAviso);
  alPulsar('btn-iniciar-cuenta', iniciarCuentaAtras);
  alPulsar('btn-detener-cuenta', detenerCuentaAtras);
  alPulsar('btn-limpiar-1', limpiar);

  // ============================================================
  // 7. EJERCICIOS PROPUESTOS
  // ============================================================
  /*
    EJERCICIO 1 (facil) - Predecir sin ejecutar
    Escribe en un papel el orden en que saldran estos cinco mensajes y
    despues comprueba tu respuesta en la consola del navegador:

        console.log('A');
        setTimeout(() => console.log('B'), 0);
        Promise.resolve().then(() => console.log('C'));
        setTimeout(() => console.log('D'), 0);
        console.log('E');

    Explica con tus palabras por que 'C' sale antes que 'B'.

    EJERCICIO 2 (facil) - Cronometro visible
    Anade a la pagina un boton "Iniciar cronometro" y otro "Parar cronometro".
    El cronometro debe contar hacia ARRIBA (0, 1, 2, 3...) cada segundo y
    mostrar el valor dentro de un <span> nuevo. Usa setInterval y clearInterval,
    y asegurate de que pulsar "Iniciar" dos veces no cree dos intervalos.

    EJERCICIO 3 (medio) - Semaforo automatico
    Crea tres circulos (rojo, ambar, verde) con CSS. Con un unico setInterval,
    haz que el semaforo cambie de color en el orden real: verde 4 s, ambar 1 s,
    rojo 4 s, y vuelta a empezar. Anade un boton que lo detenga.
    Pista: guarda el estado actual en una variable y usa un array de fases.

    EJERCICIO 4 (medio) - Antirrebote (debounce)
    Escribe una funcion antirrebote(fn, espera) que devuelva una NUEVA funcion.
    Cada vez que se llame a esa nueva funcion debe cancelar el temporizador
    anterior con clearTimeout y programar otro. Resultado: fn solo se ejecuta
    cuando el usuario deja de escribir durante "espera" milisegundos.
    Pruebala en el campo de filtro de la seccion 6.

    EJERCICIO 5 (dificil) - Trocear un calculo pesado
    Escribe una funcion que sume los numeros del 1 al 50.000.000. Compruebalo:
    la pagina se congela. Ahora reescribela para que procese el trabajo en
    bloques de 1.000.000 y ceda el hilo entre bloque y bloque con
    setTimeout(..., 0), actualizando una barra de progreso. La pagina debe
    seguir respondiendo mientras calcula.
  */
})();
