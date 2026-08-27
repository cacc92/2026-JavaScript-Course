/**
 * ============================================================================
 * ARCHIVO: js/01-eventos-basicos.js
 * PROYECTO: 07 · Eventos, formularios y almacenamiento
 * TEMA:    Qué es un evento y cómo se escucha
 * ----------------------------------------------------------------------------
 * QUÉ APRENDERÁS AQUÍ:
 *   - Qué es exactamente un evento y quién lo dispara.
 *   - Las TRES formas de asignar un manejador y por qué addEventListener gana.
 *   - Cómo quitar un manejador con removeEventListener (y por qué necesita
 *     una función con nombre).
 *   - El objeto event: type, target, currentTarget y timeStamp.
 *   - La diferencia entre target y currentTarget (fuente eterna de confusión).
 *   - preventDefault(): cancelar el comportamiento de fábrica del navegador.
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y el andamiaje (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/01-eventos-basicos.js
 * ============================================================================
 */

/*
  ¿POR QUÉ TODO EL ARCHIVO ESTÁ DENTRO DE (function () { ... })(); ?

  Esta página carga SEIS archivos .js distintos. Si en dos de ellos
  declaráramos, por ejemplo, "const salida = ...", el navegador lanzaría el
  error "Identifier 'salida' has already been declared" y la página se rompería.

  La solución se llama IIFE (Immediately Invoked Function Expression:
  "función que se invoca a sí misma inmediatamente"). Al meter el código dentro
  de una función, todas sus variables viven SOLO dentro de ella: son privadas.
  Es como poner cada tema dentro de su propia caja cerrada.
*/
(function () {
  // 'use strict' activa el modo estricto: el navegador avisa de errores
  // que de otro modo pasarían en silencio (por ejemplo, usar una variable
  // sin declararla). Buena práctica en todo archivo JS.
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN (consola visual)
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto de clase.

  // Id del <pre> donde escribe ESTA sección. Cada archivo tiene el suyo.
  const ID_SALIDA = 'salida-01';

  /**
   * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la página, para que se vea en clase sin
   * necesidad de abrir las herramientas de desarrollo.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes); // salida clásica de DevTools

    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return; // si la página no tiene consola visual, no hacemos nada

    // Los objetos se ven fatal como "[object Object]", así que los convertimos
    // a texto legible con JSON.stringify y una indentación de 2 espacios.
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');

    salida.textContent += texto + '\n';
    salida.scrollTop = salida.scrollHeight; // auto-scroll: siempre se ve lo último
  }

  /** titulo(): imprime un separador visual antes de cada bloque. */
  function titulo(texto) {
    imprimir('\n===== ' + texto + ' =====');
  }

  // Botón "Limpiar" de esta consola (también andamiaje ya resuelto).
  const botonLimpiar01 = document.getElementById('limpiar-01');
  if (botonLimpiar01) {
    botonLimpiar01.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. ¿QUÉ ES UN EVENTO?
  // ==========================================================================

  /*
    Un evento es un AVISO que lanza el navegador cuando ocurre algo:
    el usuario pulsa el ratón, escribe una tecla, envía un formulario,
    la página termina de cargar, una imagen falla...

    Piensa en el timbre de una casa: el timbre (el evento) suena, y tú decides
    qué hacer cuando suena (el manejador). El timbre no sabe qué harás; solo
    avisa. Nosotros "nos suscribimos" a ese aviso.

    Vocabulario que se usará todo el curso:
      - evento (event): el hecho que ocurre. Tiene un nombre: 'click', 'keydown'...
      - manejador (handler / listener): la función que reacciona a ese hecho.
      - disparar (fire / trigger): el momento en que el evento sucede.
  */

  // TODO (en clase):
  //   1. Llama a titulo('1. Eventos básicos: la página está lista').
  //   2. Llama a imprimir('Este texto se ha escrito al cargar el archivo 01, sin ningún clic.').
  //   Resultado esperado en #salida-01: el separador con el título y, debajo,
  //   esa frase, SIN que nadie haya pulsado nada (demuestra que el archivo se
  //   ejecuta al cargar la página).
  //   (aprox. 2 lineas)

  // ==========================================================================
  // 2. FORMA 1: EL ATRIBUTO onclick EN EL HTML (la antigua)
  // ==========================================================================

  /*
    En el HTML hay un botón escrito así:

        <button onclick="saludarDesdeAtributo(event)">Forma 1</button>

    Para que eso funcione, la función DEBE ser global (accesible desde window).
    Como este archivo está dentro de una IIFE, sus funciones son privadas;
    por eso la colgamos a propósito de window. Que haga falta este truco ya
    es una pista de lo poco recomendable que es esta técnica.
  */

  // TODO (en clase):
  //   1. Declara la función GLOBAL que el HTML espera:
  //        window.saludarDesdeAtributo = function (evento) { ... };
  //      (si no la creas, al pulsar el botón "Forma 1" la consola del
  //      navegador dará "saludarDesdeAtributo is not defined").
  //   2. Dentro de esa función:
  //        titulo('2. Forma 1: atributo onclick en el HTML');
  //        imprimir('Ha funcionado, pero mezcla HTML y JavaScript en el mismo sitio.');
  //        imprimir('Tipo de evento recibido:', evento.type);   -> "click"
  //   Resultado esperado al pulsar el botón "Forma 1": el título del apartado 2
  //   y las dos frases, terminando en "Tipo de evento recibido: click".
  //   (aprox. 5 lineas)

  // ⚠️ ERROR COMÚN: creer que "onclick" en el HTML es lo mismo que un listener.
  //    Problemas reales de esta forma:
  //      1. Ensucia el HTML con lógica de programación.
  //      2. Solo admite UN manejador por elemento.
  //      3. Obliga a tener funciones globales (chocan entre archivos).
  //      4. No se puede usar con opciones como once, capture o passive.
  // ✅ BUENA PRÁCTICA: reconocerla al verla en código antiguo, pero NO usarla.

  // ==========================================================================
  // 3. FORMA 2: LA PROPIEDAD .onclick DESDE JAVASCRIPT
  // ==========================================================================

  /*
    Mejor que la anterior porque el HTML queda limpio. Pero sigue teniendo un
    defecto grave: .onclick es UNA propiedad, así que solo puede guardar UNA
    función. Si asignas otra, la segunda PISA a la primera, igual que cuando
    guardas dos veces en la misma variable.
  */

  // TODO (en clase):
  //   1. Guarda el botón: const btnPropiedad = document.getElementById('btn-propiedad');
  //   2. Asígnale un PRIMER manejador que imprima
  //        'Manejador A (este NUNCA se ejecutará: lo pisa el B)'
  //      con la sintaxis  btnPropiedad.onclick = function () { ... };
  //   3. Asígnale un SEGUNDO manejador ENCIMA (misma propiedad .onclick) que
  //      reciba `evento` e imprima:
  //        titulo('3. Forma 2: propiedad .onclick');
  //        imprimir('Manejador B: soy el único que sobrevive.');
  //        imprimir('El manejador A se perdió al asignar el B encima.');
  //        imprimir('Elemento pulsado:', evento.currentTarget.id);  -> "btn-propiedad"
  //   Resultado esperado al pulsar "Forma 2": SOLO se ve el manejador B.
  //   El texto del manejador A no aparece nunca: esa es la lección.
  //   (aprox. 10 lineas)

  // ⚠️ ERROR COMÚN: escribir btn.onclick = miFuncion(); con paréntesis.
  //    Con paréntesis EJECUTAS la función ya mismo y guardas su resultado
  //    (normalmente undefined). Se pasa la función SIN paréntesis: es una
  //    receta que se entrega, no un plato que se sirve.

  // ==========================================================================
  // 4. FORMA 3: addEventListener (LA CORRECTA)
  // ==========================================================================

  /*
    Sintaxis:  elemento.addEventListener('nombreDelEvento', funcion, opciones);

    Ventajas frente a las dos anteriores:
      - Se pueden registrar MUCHOS manejadores para el mismo evento.
      - Permite opciones: once, capture, passive.
      - Se puede quitar después con removeEventListener.
      - Mantiene el HTML completamente limpio de JavaScript.
  */

  // TODO (en clase):
  //   1. const btnListener = document.getElementById('btn-listener');
  //   2. Regístrale TRES manejadores del evento 'click' sobre el MISMO botón:
  //        - Manejador 1 (function anónima): titulo('4. Forma 3: addEventListener')
  //          y imprimir('Manejador 1: registrado con addEventListener.').
  //        - Manejador 2 (function anónima): imprimir('Manejador 2: yo también me ejecuto, no piso a nadie.').
  //        - Manejador 3 (arrow function): imprimir('Manejador 3: se ejecutan en el ORDEN en que se registraron.').
  //   Resultado esperado al pulsar "Forma 3": los TRES mensajes seguidos, en
  //   ese orden. Compáralo con el apartado 3, donde solo sobrevivía uno.
  //   (aprox. 10 lineas)

  // ✅ BUENA PRÁCTICA: usa siempre addEventListener. Es el estándar moderno.

  // ==========================================================================
  // 5. QUITAR MANEJADORES: removeEventListener
  // ==========================================================================

  /*
    Para quitar un manejador, el navegador necesita saber EXACTAMENTE cuál.
    Y solo puede identificarlo si le pasamos LA MISMA referencia de función
    que le dimos al registrarlo.

    Analogía: para dar de baja una suscripción tienes que enseñar tu número de
    socio. Si dices "quiero dar de baja a alguien parecido a mí", no vale.

    Por eso el manejador debe tener NOMBRE y estar guardado en una variable.
  */

  // TODO (en clase):
  //   1. Guarda las tres referencias del DOM:
  //        const btnContador = document.getElementById('btn-contador');
  //        const marcador    = document.getElementById('marcador-clics');
  //        const btnQuitar   = document.getElementById('btn-quitar');
  //   2. Declara `let clics = 0;`  (let, porque su valor va a cambiar).
  //   3. Escribe una función CON NOMBRE `contarClics(evento)` que:
  //        - incremente clics,
  //        - escriba el número en marcador.textContent,
  //        - imprima 'Clic número ' + clics + ' sobre #' + evento.currentTarget.id
  //   4. Regístrala pasando la REFERENCIA, sin paréntesis:
  //        btnContador.addEventListener('click', contarClics);
  //   5. En btnQuitar, al hacer clic:
  //        titulo('5. removeEventListener');
  //        btnContador.removeEventListener('click', contarClics);
  //        imprimir('Manejador retirado. El botón de la izquierda ya no cuenta clics.');
  //        imprimir('Pruébalo: puedes pulsarlo, pero el número se queda en ' + clics + '.');
  //        btnContador.disabled = true;   <- para que se note visualmente
  //   Resultado esperado: #marcador-clics sube 1, 2, 3... y al pulsar "Quitar
  //   manejador" el botón queda deshabilitado y el número se congela.
  //   (aprox. 18 lineas)

  // Demostración de por qué una función ANÓNIMA no se puede quitar.
  // TODO (en clase):
  //   1. const btnAnonimo = document.getElementById('btn-anonimo');
  //   2. Regístrale un listener 'click' con una función ANÓNIMA que:
  //        - imprima 'Manejador anónimo ejecutado (intentaré quitarme a mí mismo...).'
  //        - llame a btnAnonimo.removeEventListener('click', function () { ... })
  //          escribiendo dentro una función de texto IDÉNTICO al del manejador.
  //        - imprima 'No ha servido de nada: vuelve a pulsar y seguiré respondiendo.'
  //   Resultado esperado: por más veces que se pulse, el mensaje sigue saliendo.
  //   Dos recetas iguales escritas en dos papeles distintos siguen siendo dos
  //   papeles: el navegador no encuentra nada que quitar y NO da error.
  //   (aprox. 10 lineas)

  // ⚠️ ERROR COMÚN: intentar quitar un manejador anónimo o una arrow function
  //    escrita directamente en el addEventListener. Es imposible.
  // ✅ BUENA PRÁCTICA: si sabes que vas a necesitar quitar un manejador,
  //    dale nombre desde el principio.

  // ==========================================================================
  // 6. EL OBJETO event: type, target, currentTarget, timeStamp
  // ==========================================================================

  /*
    Cuando un evento se dispara, el navegador llama a tu función y le pasa
    automáticamente UN argumento: el objeto del evento. Contiene toda la
    información de lo que ha pasado. Por convención lo llamamos "evento",
    "event" o "e".

    Propiedades imprescindibles:
      - type:          nombre del evento ('click', 'keydown'...).
      - target:        el elemento MÁS PROFUNDO donde ocurrió de verdad.
      - currentTarget: el elemento en el que TÚ pusiste el addEventListener.
      - timeStamp:     milisegundos desde que se abrió la página.

    LA DIFERENCIA CLAVE (target vs currentTarget):
      Imagina que pones un micrófono en la puerta de un aula (currentTarget).
      Si alguien estornuda en la última fila (target), el micrófono lo capta,
      pero el estornudo NO ocurrió en la puerta.
      target = quién estornudó. currentTarget = dónde está tu micrófono.
  */

  // TODO (en clase):
  //   1. const cajaEvento = document.getElementById('caja-evento');
  //      OJO: el listener va en la CAJA, no en el botón que hay dentro de ella.
  //   2. cajaEvento.addEventListener('click', function (evento) { ... }) con:
  //        titulo('6. El objeto event');
  //        imprimir('evento.type          =', evento.type);
  //        imprimir('evento.target        =', '<' + evento.target.tagName.toLowerCase() + '> id="' + evento.target.id + '"');
  //        imprimir('evento.currentTarget =', '<' + evento.currentTarget.tagName.toLowerCase() + '> id="' + evento.currentTarget.id + '"');
  //        imprimir('evento.timeStamp     =', Math.round(evento.timeStamp) + ' ms desde que cargó la página');
  //   3. Compara los dos con === (mismo objeto en memoria):
  //        - si coinciden: imprimir('Has pulsado la caja directamente: target y currentTarget coinciden.')
  //        - si no: imprimir('Has pulsado el botón interior: son DISTINTOS.') y
  //                 imprimir('Texto del elemento pulsado: "' + evento.target.textContent.trim() + '"')
  //   Resultado esperado: al pulsar el borde de la caja, target === currentTarget;
  //   al pulsar el botón de dentro, target es el <button> y currentTarget la caja.
  //   (aprox. 16 lineas)

  // ⚠️ ERROR COMÚN: usar event.target creyendo que siempre es el elemento donde
  //    pusiste el listener. En cuanto ese elemento tenga hijos (un icono, un
  //    <span>...), target será el hijo y tu código dejará de funcionar.
  // ✅ BUENA PRÁCTICA: si quieres el elemento donde escuchas, usa currentTarget.
  //    Si quieres saber qué pulsó exactamente el usuario, usa target.

  // ==========================================================================
  // 7. preventDefault(): CANCELAR EL COMPORTAMIENTO POR DEFECTO
  // ==========================================================================

  /*
    Muchos elementos traen una acción "de fábrica":
      - un <a> navega a su href,
      - un <input type="checkbox"> se marca al pulsarlo,
      - un formulario se envía y RECARGA la página,
      - la tecla flecha abajo hace scroll.

    event.preventDefault() le dice al navegador: "gracias, pero de esto me
    encargo yo". No detiene la propagación del evento (eso es otra cosa que
    veremos en el archivo 02), solo cancela la acción automática.
  */

  // TODO (en clase):
  //   1. const enlace = document.getElementById('enlace-bloqueado');
  //      Regístrale un 'click' que llame PRIMERO a evento.preventDefault() y
  //      después imprima:
  //        titulo('7. preventDefault()');
  //        imprimir('Clic en el enlace, pero NO hemos navegado.');
  //        imprimir('Destino que se ha cancelado:', evento.currentTarget.href);
  //   2. const checkbox = document.getElementById('chk-bloqueado');
  //      Regístrale un 'click' que llame a evento.preventDefault() y luego:
  //        imprimir('Has intentado marcar el checkbox y lo hemos impedido.');
  //        imprimir('Estado real de .checked:', evento.currentTarget.checked);  -> false
  //   Resultado esperado: el enlace no lleva a ninguna parte y el checkbox
  //   se queda SIEMPRE desmarcado por mucho que se pulse.
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMÚN: escribir preventDefault sin los paréntesis.
  //    evento.preventDefault;   // no hace NADA: solo menciona la función
  //    evento.preventDefault(); // correcto: la EJECUTA
  // ⚠️ ERROR COMÚN 2: usar "return false" (eso solo funciona en la forma
  //    antigua del atributo onclick, no con addEventListener).

  /* ==========================================================================
   * EJERCICIOS PROPUESTOS · archivo 01
   * --------------------------------------------------------------------------
   * 1) Añade en el HTML un botón nuevo con id="btn-color" y, desde este
   *    archivo, regístrale con addEventListener un manejador que cambie el
   *    color de fondo de la caja #caja-evento a un color a tu elección.
   *
   * 2) Crea un botón que registre y otro que elimine un manejador que imprima
   *    la hora actual cada vez que se pulse una tercera zona de la página.
   *    Pista: necesitas guardar la función en una variable con nombre.
   *
   * 3) Modifica el manejador de #caja-evento para que, además de lo que ya
   *    imprime, muestre cuántos hijos directos tiene el currentTarget.
   *    Pista: evento.currentTarget.children.length
   *
   * 4) Haz que el checkbox #chk-bloqueado solo se pueda marcar si el usuario
   *    mantiene pulsada la tecla Shift mientras hace clic.
   *    Pista: dentro del manejador, evento.shiftKey vale true o false.
   *
   * 5) (Reto) Crea un contador de clics que se reinicie a cero automáticamente
   *    si pasan más de 2 segundos entre un clic y el siguiente.
   *    Pista: guarda el timeStamp del clic anterior y compáralo con el nuevo.
   * ========================================================================== */
})();
