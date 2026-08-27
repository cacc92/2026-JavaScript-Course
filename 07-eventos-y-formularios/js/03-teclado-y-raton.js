/**
 * ============================================================================
 * ARCHIVO: js/03-teclado-y-raton.js
 * TEMA:    Eventos de ratón y de teclado
 * ----------------------------------------------------------------------------
 * QUÉ APRENDERÁS AQUÍ:
 *   - click y dblclick, y cómo conviven.
 *   - La diferencia real entre mouseenter/mouseleave y mouseover/mouseout.
 *   - mousemove y las coordenadas del puntero (clientX/clientY).
 *   - contextmenu: cómo sustituir el menú del clic derecho por uno propio.
 *   - keydown y keyup.
 *   - event.key vs event.code (la confusión número uno del teclado).
 *   - Atajos con ctrlKey, shiftKey, altKey y metaKey.
 * ============================================================================
 */

// IIFE para que las variables de este archivo no choquen con las de los demás.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================

  const ID_SALIDA = 'salida-03';

  function imprimir(...mensajes) {
    console.log(...mensajes);
    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    salida.textContent += texto + '\n';
    salida.scrollTop = salida.scrollHeight;
  }

  function titulo(texto) {
    imprimir('\n===== ' + texto + ' =====');
  }

  function limpiarConsola() {
    document.getElementById(ID_SALIDA).textContent = '';
  }

  document.getElementById('limpiar-03').addEventListener('click', limpiarConsola);

  // ==========================================================================
  // 1. click Y dblclick
  // ==========================================================================

  /*
    click    -> se dispara al pulsar y soltar el botón principal del ratón.
    dblclick -> se dispara cuando hay dos clics seguidos y rápidos.

    DATO IMPORTANTE: un doble clic NO cancela los clics. La secuencia real es:
        click, click, dblclick
    Por eso nunca pongas acciones contradictorias en click y en dblclick sobre
    el mismo elemento (por ejemplo, "abrir" y "borrar"): las dos ocurrirán.

    Además, event.detail nos dice cuántos clics seguidos lleva el usuario.
  */
  const cajaClick = document.getElementById('caja-click');
  let clicsCaja = 0;

  cajaClick.addEventListener('click', function (evento) {
    clicsCaja = clicsCaja + 1;
    imprimir('click  · total: ' + clicsCaja + ' · evento.detail = ' + evento.detail);
  });

  cajaClick.addEventListener('dblclick', function () {
    titulo('1. dblclick');
    // toggle: si la clase está, la quita; si no está, la pone.
    const activa = cajaClick.classList.toggle('caja-demo--activa');
    imprimir('Doble clic detectado. Color ' + (activa ? 'cambiado' : 'restaurado') + '.');
    imprimir('Fíjate arriba: antes del dblclick se dispararon DOS clicks.');
  });

  // ==========================================================================
  // 2. mouseenter/mouseleave  vs  mouseover/mouseout
  // ==========================================================================

  /*
    Los cuatro avisan de que el ratón entra o sale de un elemento, pero:

      mouseenter / mouseleave
        - NO burbujean.
        - Ignoran a los hijos: si mueves el ratón de la zona al recuadro
          interior, para ellos sigues DENTRO. Se disparan una sola vez.

      mouseover / mouseout
        - SÍ burbujean.
        - Cada vez que pasas a un hijo, se dispara mouseout del padre y
          mouseover del hijo (que sube por burbujeo hasta el padre).

    Analogía: mouseenter es el portero de la casa, que solo anota si entras o
    sales de la casa. mouseover es un vigilante que anota cada vez que cambias
    de habitación dentro de la casa.

    ✅ BUENA PRÁCTICA: para efectos de "resaltar al pasar el ratón" usa casi
    siempre mouseenter/mouseleave. Te ahorra parpadeos y disparos repetidos.
  */
  const zonaEnter = document.getElementById('zona-enter');
  const contEnter = document.getElementById('cont-enter');
  const contOver = document.getElementById('cont-over');

  let vecesEnter = 0;
  let vecesOver = 0;

  zonaEnter.addEventListener('mouseenter', function () {
    vecesEnter = vecesEnter + 1;
    contEnter.textContent = vecesEnter;
    imprimir('mouseenter · entradas reales en la zona: ' + vecesEnter);
  });

  zonaEnter.addEventListener('mouseleave', function () {
    imprimir('mouseleave · has salido de la zona por completo.');
  });

  zonaEnter.addEventListener('mouseover', function (evento) {
    vecesOver = vecesOver + 1;
    contOver.textContent = vecesOver;
    // Con target vemos sobre QUÉ elemento concreto está el ratón.
    const sobre = evento.target.id || evento.target.className || evento.target.tagName;
    imprimir('mouseover  · disparo ' + vecesOver + ' (sobre: ' + sobre + ')');
  });

  // ⚠️ ERROR COMÚN: usar mouseover para mostrar un tooltip y volverse loco
  //    porque parpadea. Es que cada hijo vuelve a dispararlo.

  // ==========================================================================
  // 3. mousemove Y LAS COORDENADAS DEL PUNTERO
  // ==========================================================================

  /*
    mousemove se dispara CONSTANTEMENTE mientras el ratón se mueve: puede
    lanzarse decenas de veces por segundo. Nunca hagas trabajo pesado dentro.

    Coordenadas disponibles:
      - clientX / clientY : respecto a la ventana visible.
      - pageX  / pageY    : respecto al documento (incluye el scroll).
      - offsetX / offsetY : respecto al propio elemento.
  */
  const pad = document.getElementById('pad-raton');
  const coords = document.getElementById('coords');
  let movimientos = 0;

  pad.addEventListener('mousemove', function (evento) {
    // Actualizar texto es barato: lo hacemos siempre.
    coords.textContent = 'x: ' + Math.round(evento.offsetX) + ', y: ' + Math.round(evento.offsetY);

    movimientos = movimientos + 1;

    // Imprimir en la consola es caro: lo hacemos 1 de cada 25 veces.
    // Esta técnica de "reducir la frecuencia" se parece al throttling.
    if (movimientos % 25 === 0) {
      imprimir('mousemove nº ' + movimientos +
               ' · offset(' + Math.round(evento.offsetX) + ', ' + Math.round(evento.offsetY) + ')' +
               ' · client(' + evento.clientX + ', ' + evento.clientY + ')');
    }
  });

  // ==========================================================================
  // 4. contextmenu: SUSTITUIR EL MENÚ DEL CLIC DERECHO
  // ==========================================================================

  /*
    El evento 'contextmenu' se dispara con el clic derecho. Si llamamos a
    preventDefault(), el menú del navegador no aparece y podemos mostrar el
    nuestro. Lo usan los gestores de archivos web, los editores, etc.

    ⚠️ Úsalo con cabeza: quitarle al usuario el menú del navegador sin ofrecer
    algo mejor es una mala experiencia.
  */
  const zonaContextual = document.getElementById('zona-contextual');
  const menuContextual = document.getElementById('menu-contextual');

  zonaContextual.addEventListener('contextmenu', function (evento) {
    evento.preventDefault(); // adiós al menú nativo

    // getBoundingClientRect() devuelve la posición y tamaño del elemento en la
    // ventana. Restando su esquina superior izquierda a las coordenadas del
    // ratón obtenemos la posición DENTRO de la zona.
    const caja = zonaContextual.getBoundingClientRect();
    const x = evento.clientX - caja.left;
    const y = evento.clientY - caja.top;

    menuContextual.style.left = x + 'px'; // ⚠️ las unidades son obligatorias
    menuContextual.style.top = y + 'px';
    menuContextual.classList.remove('oculto');

    titulo('4. contextmenu');
    imprimir('Menú propio abierto en x: ' + Math.round(x) + ', y: ' + Math.round(y));
  });

  // Delegación otra vez: un solo manejador para las tres opciones del menú.
  menuContextual.addEventListener('click', function (evento) {
    const opcion = evento.target.closest('li');
    if (!opcion) return;

    imprimir('Opción elegida: ' + opcion.dataset.opcion);
    menuContextual.classList.add('oculto');
  });

  // Cerrar el menú al hacer clic en cualquier otro sitio del documento.
  // Aquí se aprovecha que TODOS los clics acaban burbujeando hasta document.
  document.addEventListener('click', function (evento) {
    // Si el clic ocurrió dentro del menú, no lo cerramos aquí.
    if (evento.target.closest('#menu-contextual')) return;
    menuContextual.classList.add('oculto');
  });

  // ==========================================================================
  // 5. TECLADO: keydown, keyup, key y code
  // ==========================================================================

  /*
    keydown -> al PULSAR la tecla. Si la mantienes, se repite (event.repeat).
    keyup   -> al SOLTARLA. Se dispara una sola vez.
    (existe keypress, pero está OBSOLETO: no lo uses).

    LA GRAN DIFERENCIA:
      event.key  -> el CARÁCTER que produce la tecla: 'a', 'A', 'ñ', 'Enter',
                    'Escape', 'ArrowUp', ' ' (espacio).
                    Cambia con el idioma del teclado y con Shift.
      event.code -> la TECLA FÍSICA, su posición en el teclado: 'KeyA',
                    'KeyN', 'Enter', 'Space', 'ArrowUp'.
                    NO cambia aunque el usuario tenga teclado francés.

    Regla práctica:
      - ¿Te importa la LETRA que ha escrito? -> event.key
      - ¿Te importa DÓNDE está la tecla (controles WASD de un juego)? -> event.code

    ⚠️ event.keyCode y event.which están OBSOLETOS. No los uses en código nuevo.
  */
  const inputTeclas = document.getElementById('input-teclas');

  inputTeclas.addEventListener('keydown', function (evento) {
    // Se construye una lista con los modificadores que estén pulsados.
    const modificadores = [];
    if (evento.ctrlKey) modificadores.push('Ctrl');
    if (evento.shiftKey) modificadores.push('Shift');
    if (evento.altKey) modificadores.push('Alt');
    if (evento.metaKey) modificadores.push('Meta/Cmd'); // tecla Windows o Command

    imprimir('keydown · key: "' + evento.key + '"' +
             ' · code: "' + evento.code + '"' +
             ' · repetida: ' + evento.repeat +
             (modificadores.length ? ' · modificadores: ' + modificadores.join('+') : ''));

    // Teclas especiales frecuentes:
    if (evento.key === 'Enter') {
      imprimir('   >> Has pulsado Enter: aquí se enviaría el formulario.');
    }
    if (evento.key === 'Escape') {
      imprimir('   >> Escape: se suele usar para cerrar o cancelar.');
      inputTeclas.value = '';
    }
  });

  inputTeclas.addEventListener('keyup', function (evento) {
    imprimir('keyup   · has soltado "' + evento.key + '"');
  });

  // ==========================================================================
  // 6. ATAJOS DE TECLADO CON MODIFICADORES
  // ==========================================================================

  /*
    Un atajo se detecta comprobando a la vez la tecla y los modificadores.
    Escuchamos en 'document' para que funcione en toda la página.

    ⚠️ CUIDADO: no pises atajos del navegador (Ctrl+T, Ctrl+W, Ctrl+N...).
    Aquí usamos Ctrl+Shift+L, que está libre en la mayoría de navegadores.
    ⚠️ En Mac, la tecla equivalente a Ctrl suele ser Cmd (metaKey). Por eso
    aceptamos las dos.
  */
  document.addEventListener('keydown', function (evento) {
    const conControl = evento.ctrlKey || evento.metaKey;

    // toLowerCase() porque con Shift pulsado, key vale 'L' en mayúscula.
    if (conControl && evento.shiftKey && evento.key.toLowerCase() === 'l') {
      evento.preventDefault(); // evitamos que el navegador haga lo suyo
      limpiarConsola();
      imprimir('Atajo Ctrl/Cmd + Shift + L: consola de la sección 3 limpiada.');
    }
  });

  // ==========================================================================
  // 7. MOVER UN ELEMENTO CON LAS FLECHAS
  // ==========================================================================

  /*
    Un div normal NO recibe eventos de teclado porque no puede tener el foco.
    Para dárselo se usa el atributo tabindex="0" en el HTML (ya está puesto).
    Así el tablero es enfocable con clic y con la tecla Tab.

    Dentro, llamamos a preventDefault() para que las flechas muevan el cuadrado
    y NO hagan scroll de la página.
  */
  const tablero = document.getElementById('tablero');
  const cuadrado = document.getElementById('cuadrado');

  const PASO = 14; // píxeles que avanza en cada pulsación
  let posX = 10;
  let posY = 10;

  /** Coloca el cuadrado, sin dejar que se salga del tablero. */
  function colocarCuadrado() {
    // Math.max(0, ...) impide valores negativos (salirse por arriba/izquierda).
    // Math.min(limite, ...) impide pasarse por abajo/derecha.
    const limiteX = tablero.clientWidth - cuadrado.offsetWidth;
    const limiteY = tablero.clientHeight - cuadrado.offsetHeight;

    posX = Math.max(0, Math.min(limiteX, posX));
    posY = Math.max(0, Math.min(limiteY, posY));

    cuadrado.style.left = posX + 'px';
    cuadrado.style.top = posY + 'px';
  }

  colocarCuadrado(); // posición inicial

  tablero.addEventListener('keydown', function (evento) {
    // Guardamos las teclas que nos interesan en un array para preguntar
    // con includes() en vez de encadenar cuatro comparaciones.
    const flechas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (!flechas.includes(evento.key)) {
      return; // cualquier otra tecla no nos interesa aquí
    }

    evento.preventDefault(); // sin esto, la página haría scroll

    if (evento.key === 'ArrowUp') posY = posY - PASO;
    if (evento.key === 'ArrowDown') posY = posY + PASO;
    if (evento.key === 'ArrowLeft') posX = posX - PASO;
    if (evento.key === 'ArrowRight') posX = posX + PASO;

    colocarCuadrado();
    imprimir('Tecla ' + evento.key + ' · posición: (' + posX + ', ' + posY + ')');
  });

  // Pistas visuales de foco: ayudan a entender por qué a veces "no responde".
  tablero.addEventListener('focus', function () {
    imprimir('El tablero tiene el foco: ya puedes usar las flechas.');
  });

  tablero.addEventListener('blur', function () {
    imprimir('El tablero ha perdido el foco: las flechas ya no lo mueven.');
  });

  /* ==========================================================================
   * EJERCICIOS PROPUESTOS · archivo 03
   * --------------------------------------------------------------------------
   * 1) Añade el efecto de que el cuadrado del tablero cambie de color cada vez
   *    que choca con un borde (cuando su posición queda recortada por el
   *    límite). Pista: compara la posición antes y después de colocarCuadrado.
   *
   * 2) Amplía el control del tablero para que también responda a las teclas
   *    W, A, S, D. Usa event.code ('KeyW'...) y razona por qué en un juego es
   *    mejor code que key.
   *
   * 3) Crea un atajo Ctrl/Cmd + K que lleve el foco al campo #input-teclas
   *    (como el buscador de muchas aplicaciones). Pista: elemento.focus().
   *
   * 4) Cambia el pad del ratón para que su color de fondo dependa de la
   *    posición horizontal del puntero. Pista: usa offsetX y
   *    pad.style.backgroundColor = 'hsl(' + grados + ', 70%, 45%)'.
   *
   * 5) (Reto) Implementa un contador de "clics por segundo": cada vez que se
   *    pulse la caja de la sección 3.1, muestra cuántos clics se han hecho en
   *    los últimos 1000 ms. Pista: guarda los timeStamp en un array y filtra
   *    los que ya sean antiguos.
   * ========================================================================== */
})();
