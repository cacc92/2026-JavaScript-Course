/**
 * ============================================================================
 * ARCHIVO: js/01-event-loop.js   ·   PLANTILLA DE CLASE (sin resolver)
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
 *
 * COMO SE USA ESTA PLANTILLA
 * Las explicaciones estan completas; el codigo NO. Cada bloque "TODO (en clase)"
 * describe exactamente que hay que escribir, con que nombres y que debe salir
 * en pantalla. La solucion esta en ../js/01-event-loop.js
 * ============================================================================
 */

(function () {
  // 'use strict' activa el modo estricto: el navegador avisa de errores que
  // normalmente se tragaria en silencio (por ejemplo, usar una variable sin
  // declarar). Es una red de seguridad gratuita.
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE LA CONSOLA VISUAL   [YA ESCRITO]
  // ============================================================
  // Los estudiantes no siempre tienen abierto DevTools (F12). Estas dos
  // funciones escriben el mensaje en LOS DOS SITIOS: la consola real del
  // navegador y el bloque <pre> oscuro de la pagina.
  //
  // Este bloque viene HECHO a proposito: es andamiaje, no materia. Sin el no
  // se puede demostrar nada en pantalla desde el primer minuto.

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

  // TODO (en clase):
  //   1. Comprueba con un if que la constante consolaGeneral existe
  //      (es el <pre id="salida"> de la seccion "Consola visual del proyecto").
  //   2. Si existe, asignale a su textContent este texto de bienvenida,
  //      concatenando las cinco lineas con el operador + y '\n' al final de cada una:
  //        'Proyecto 09 - Asincronia en JavaScript'
  //        '------------------------------------------------------------'
  //        'Cada seccion tiene su propia consola visual.'
  //        'Abre tambien DevTools con F12: veras exactamente lo mismo.'
  //        'Nada se ejecuta solo: pulsa los botones para lanzar cada demo.'
  //   Resultado esperado en pantalla: al recargar, el bloque oscuro de arriba
  //   muestra esas cinco lineas y ninguna otra consola tiene nada.
  //   (aprox. 8 lineas)

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
  // TODO (en clase):
  //   1. Declara la funcion bloquearHilo(milisegundos).
  //   2. Guarda en una constante 'inicio' el valor de Date.now().
  //   3. Escribe un bucle while que no haga NADA en su cuerpo mientras
  //      Date.now() - inicio sea menor que milisegundos (deja dentro un
  //      comentario explicando que el bucle esta vacio a proposito).
  //   4. Devuelve con return Date.now() - inicio: la duracion real del bloqueo.
  //   Resultado esperado: bloquearHilo(2000) devuelve un numero cercano a 2000
  //   y, mientras corre, la pagina no responde a ningun clic.
  //   (aprox. 7 lineas)

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
  // TODO (en clase):
  //   1. Declara demoOrdenDeEjecucion() y empieza con
  //      titulo('1.1 - Orden real de ejecucion').
  //   2. Imprime la invitacion a predecir y una linea de guiones:
  //      'Prediccion: ¿en que orden crees que van a salir los 4 mensajes?'
  //      '------------------------------------------------------------'
  //   3. (A) Codigo SINCRONO: imprimir('1) SINCRONO  - primera linea del script').
  //   4. (B) MACROTAREA: setTimeout con 0 ms que imprima
  //      '4) MACROTAREA - callback de setTimeout(..., 0)' y, en otra linea,
  //      '   -> el ultimo, porque las macrotareas van despues de las microtareas'.
  //   5. (C) MICROTAREA: Promise.resolve().then(...) que imprima
  //      '3) MICROTAREA - callback de Promise.resolve().then()' y
  //      '   -> se ejecuta antes que el setTimeout aunque se escribio despues'.
  //   6. (D) Mas codigo sincrono: imprimir('2) SINCRONO  - ultima linea del script').
  //   7. Cierra con la linea de guiones y
  //      '(la funcion ya termino; la pila esta vacia: entra el event loop)'.
  //   Resultado esperado en pantalla (consola · event loop): los mensajes salen
  //   numerados 1, 2, 3, 4 aunque en el codigo esten escritos 1, 4, 3, 2.
  //   (aprox. 27 lineas)

  /**
   * explicarOrden(): el razonamiento paso a paso, para proyectarlo justo
   * despues de la demo anterior.
   */
  // TODO (en clase):
  //   1. Declara explicarOrden() con titulo('1.1 bis - Por que ese orden, paso a paso').
  //   2. Imprime SIETE lineas 'PASO 1' ... 'PASO 7' que cuenten el recorrido:
  //      PASO 1 la pila imprime el primer sincrono; PASO 2 setTimeout se entrega
  //      a las Web APIs y su callback va a la COLA DE MACROTAREAS; PASO 3 el then
  //      de una promesa ya cumplida va a la COLA DE MICROTAREAS; PASO 4 el segundo
  //      sincrono sale al instante; PASO 5 la funcion termina y LA PILA QUEDA VACIA;
  //      PASO 6 el event loop vacia TODAS las microtareas (sale 3); PASO 7 solo
  //      entonces coge UNA macrotarea (sale 4).
  //   3. Termina con el resumen y el aviso:
  //      'RESUMEN:  sincrono  >  microtareas (promesas)  >  macrotareas (timeouts)'
  //      '[!] ERROR COMUN: creer que setTimeout(fn, 0) ejecuta fn "ahora mismo".'
  //      '   El 0 es un MINIMO de espera, no una promesa de inmediatez.'
  //   Resultado esperado en pantalla: un texto de 11 lineas, sin nada asincrono.
  //   (aprox. 17 lineas)

  /**
   * demoBloqueo(): demuestra que el hilo es uno solo.
   * Programamos un setTimeout de 0 ms y JUSTO DESPUES bloqueamos el hilo
   * dos segundos. El callback no puede colarse: tiene que esperar.
   */
  // TODO (en clase):
  //   1. Declara demoBloqueo() con titulo('1.1 ter - Un solo hilo: bloquear la pagina').
  //   2. Avisa por pantalla de lo que va a pasar y de que pueden intentar pulsar
  //      cualquier boton mientras tanto: no respondera.
  //   3. Guarda const marcaInicio = Date.now().
  //   4. Programa un setTimeout de 0 ms cuyo callback calcule
  //      Date.now() - marcaInicio e imprima:
  //      'El callback pedia 0 ms de espera y ha tardado <retraso> ms.'
  //      'Motivo: la pila estaba ocupada. El event loop no puede interrumpir nada.'
  //   5. Justo despues llama a bloquearHilo(2000), guarda lo devuelto en 'duracion'
  //      e imprime 'Hilo bloqueado durante <duracion> ms (bucle while sin salida).'
  //   6. Cierra con los dos avisos didacticos:
  //      '[!] ERROR COMUN: hacer calculos pesados en el hilo principal congela la interfaz.'
  //      '[OK] BUENA PRACTICA: trocear el trabajo, o moverlo a un Web Worker.'
  //   Resultado esperado: el retraso mostrado ronda los 2000 ms, no 0.
  //   (aprox. 18 lineas)

  // ============================================================
  // 4. setTimeout Y clearTimeout
  // ============================================================
  // setTimeout(callback, ms) devuelve un IDENTIFICADOR (un numero en el
  // navegador). Ese identificador es el "ticket" que nos permite cancelar
  // la tarea antes de que ocurra, usando clearTimeout(identificador).
  //
  // ✅ BUENA PRACTICA: guarda SIEMPRE el identificador en una variable si
  // existe la mas minima posibilidad de tener que cancelar.
  //
  // ⚠️ ERROR COMUN 1: pulsar el boton dos veces y crear dos temporizadores
  // sin cancelar el anterior.
  // ⚠️ ERROR COMUN 2: escribir setTimeout(miFuncion(), 3000) CON parentesis.
  // Con parentesis la funcion se ejecuta YA y a setTimeout le llega su
  // resultado (normalmente undefined). Hay que pasar la funcion SIN llamarla.

  // TODO (en clase):
  //   1. Declara con let una variable idAviso inicializada a null. Vive en el
  //      ambito de la IIFE: la comparten las dos funciones de abajo, pero es
  //      invisible para el resto de archivos del proyecto.
  //   2. Escribe programarAviso():
  //      - titulo('1.2 - setTimeout y clearTimeout');
  //      - si idAviso !== null, hazle clearTimeout e imprime
  //        'Habia un aviso pendiente: lo cancelo antes de programar el nuevo.';
  //      - imprime 'Programando un aviso para dentro de 3 segundos...';
  //      - asigna a idAviso un setTimeout de 3000 ms cuyo callback imprima
  //        '¡Han pasado 3 segundos! Aqui esta el aviso.' y despues ponga
  //        idAviso = null;
  //      - imprime 'Identificador del temporizador: ' + idAviso y la linea
  //        'Esta linea sale ANTES que el aviso: setTimeout no detiene el programa.'
  //   3. Escribe cancelarAviso():
  //      - titulo('1.2 bis - Cancelar un setTimeout');
  //      - si idAviso === null, imprime 'No hay ningun aviso pendiente que cancelar.'
  //        y sal con return (salida temprana: mas legible que un else);
  //      - si no, clearTimeout(idAviso), imprime
  //        'Aviso <id> cancelado. El callback NUNCA se ejecutara.' y pon idAviso = null.
  //   Resultado esperado: con el boton «Programar aviso (3 s)» aparece el numero
  //   del temporizador al instante y el aviso 3 segundos despues; si entre medias
  //   se pulsa «Cancelar aviso», el aviso no llega nunca.
  //   (aprox. 38 lineas)

  // ============================================================
  // 5. setInterval Y clearInterval
  // ============================================================
  // setInterval(callback, ms) repite el callback cada ms milisegundos
  // HASTA QUE ALGUIEN LO PARE. No se detiene solo. Nunca.
  //
  // ⚠️ ERROR COMUN (y grave): olvidar el clearInterval. El intervalo sigue
  // corriendo aunque el elemento haya desaparecido de la pantalla. Es una de
  // las fugas de memoria mas frecuentes en aplicaciones reales.
  //
  // ✅ BUENA PRACTICA: TODO setInterval debe tener escrita, desde el primer
  // momento, la condicion que lo detiene.

  // TODO (en clase):
  //   1. Declara el estado de la seccion:
  //        let idCuenta = null;              // identificador del intervalo activo
  //        let segundosRestantes = 10;       // estado de la cuenta atras
  //        const marcador = document.getElementById('marcador-cuenta');
  //   2. Escribe pintarMarcador(texto, clase): si no hay marcador, return;
  //      si lo hay, pon marcador.textContent = texto y reescribe entero
  //      marcador.className = 'insignia' + (clase ? ' ' + clase : '')
  //      (reescribirlo entero quita la clase de color anterior).
  //   3. Escribe iniciarCuentaAtras():
  //      - titulo('1.3 - setInterval y clearInterval');
  //      - si idCuenta !== null, imprime
  //        'La cuenta atras ya esta en marcha. Detenla antes de reiniciarla.' y return;
  //      - pon segundosRestantes = 10, imprime
  //        'Arranco una cuenta atras de 10 segundos, un tick por segundo.'
  //        y llama a pintarMarcador('quedan 10 s', 'real');
  //      - asigna a idCuenta un setInterval de 1000 ms que en cada vuelta reste 1,
  //        imprima 'tick -> quedan <n> segundos', repinte el marcador y, cuando
  //        segundosRestantes <= 0, haga clearInterval(idCuenta), idCuenta = null,
  //        imprima 'Cuenta atras terminada. clearInterval ejecutado.' y llame a
  //        pintarMarcador('cuenta atras terminada', 'simulado');
  //      - imprime 'Identificador del intervalo: ' + idCuenta.
  //   4. Escribe detenerCuentaAtras(): si idCuenta === null imprime
  //      'No hay ninguna cuenta atras en marcha.' y return; si no, clearInterval,
  //      imprime 'Cuenta atras detenida a mano en <n> segundos.', pon idCuenta = null
  //      y pintarMarcador('cuenta atras detenida', 'fallo').
  //   Resultado esperado en pantalla: la insignia con id "marcador-cuenta" pasa de
  //   "cuenta atras detenida" a "quedan 9 s", "quedan 8 s"... y la consola imprime
  //   un tick por segundo hasta cero.
  //   (aprox. 52 lineas)

  // ============================================================
  // 6. CONECTAR LOS BOTONES (event listeners)
  // ============================================================
  // Un pequeno ayudante para no repetir el mismo if en cada boton.
  // Si el id no existe, avisamos por consola en vez de romper la pagina con
  // "Cannot read properties of null".
  //
  // ✅ BUENA PRACTICA: comprobar siempre que el elemento existe antes de
  // engancharle un listener.

  // TODO (en clase):
  //   1. Escribe alPulsar(id, manejador): busca el boton con
  //      document.getElementById(id); si no existe, avisa con
  //      console.warn('[01-event-loop] No encuentro el boton con id "' + id + '".')
  //      y return; si existe, boton.addEventListener('click', manejador).
  //   2. Engancha los ocho botones de la seccion 1, en este orden:
  //        'btn-orden-ejecucion'   -> demoOrdenDeEjecucion
  //        'btn-explicar-orden'    -> explicarOrden
  //        'btn-bloquear-hilo'     -> demoBloqueo
  //        'btn-programar-timeout' -> programarAviso
  //        'btn-cancelar-timeout'  -> cancelarAviso
  //        'btn-iniciar-cuenta'    -> iniciarCuentaAtras
  //        'btn-detener-cuenta'    -> detenerCuentaAtras
  //        'btn-limpiar-1'         -> limpiar
  //   Resultado esperado: los ocho botones de la seccion 1 responden y la consola
  //   del navegador no muestra ni un solo aviso amarillo.
  //   (aprox. 17 lineas)

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
