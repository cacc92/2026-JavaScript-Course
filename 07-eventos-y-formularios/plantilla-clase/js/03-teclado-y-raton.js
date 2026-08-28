/**
 * ============================================================================
 * ARCHIVO: js/03-teclado-y-raton.js
 * PROYECTO: 07 · Eventos, formularios y almacenamiento
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
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y el andamiaje (imprimir, titulo, limpiarConsola), pero
 *   el código de cada apartado está sustituido por instrucciones
 *   "TODO (en clase)".
 *   La versión resuelta está en ../../js/03-teclado-y-raton.js
 * ============================================================================
 */

// IIFE para que las variables de este archivo no choquen con las de los demás.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto de clase.

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

  // limpiarConsola() se deja escrita porque el apartado 6 (atajos de teclado)
  // la reutiliza: así el atajo Ctrl+Shift+L se resuelve en una sola línea.
  function limpiarConsola() {
    document.getElementById(ID_SALIDA).textContent = '';
  }

  const botonLimpiar03 = document.getElementById('limpiar-03');
  if (botonLimpiar03) {
    botonLimpiar03.addEventListener('click', limpiarConsola);
  }

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

  // TODO (en clase):
  //   1. const cajaClick = document.getElementById('caja-click');
  //      let clicsCaja = 0;
  //   2. Manejador de 'click' sobre esa caja: incrementa clicsCaja e imprime
  //        'click  · total: ' + clicsCaja + ' · evento.detail = ' + evento.detail
  //   3. Manejador de 'dblclick' sobre la MISMA caja:
  //        titulo('1. dblclick');
  //        const activa = cajaClick.classList.toggle('caja-demo--activa');
  //        imprimir('Doble clic detectado. Color ' + (activa ? 'cambiado' : 'restaurado') + '.');
  //        imprimir('Fíjate arriba: antes del dblclick se dispararon DOS clicks.');
  //   Resultado esperado con un doble clic: tres líneas seguidas ->
  //   click total 1 (detail 1), click total 2 (detail 2) y después el dblclick,
  //   que además cambia el color de fondo de la caja.
  //   (aprox. 12 lineas)

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

  // TODO (en clase):
  //   1. Referencias y contadores:
  //        const zonaEnter = document.getElementById('zona-enter');
  //        const contEnter = document.getElementById('cont-enter');
  //        const contOver  = document.getElementById('cont-over');
  //        let vecesEnter = 0;
  //        let vecesOver  = 0;
  //   2. 'mouseenter' en zonaEnter: incrementa vecesEnter, escribe el número en
  //      contEnter.textContent e imprime
  //        'mouseenter · entradas reales en la zona: ' + vecesEnter
  //   3. 'mouseleave' en zonaEnter: imprime
  //        'mouseleave · has salido de la zona por completo.'
  //   4. 'mouseover' en zonaEnter: incrementa vecesOver, lo escribe en
  //      contOver.textContent y, usando target para saber sobre qué elemento
  //      concreto está el ratón:
  //        const sobre = evento.target.id || evento.target.className || evento.target.tagName;
  //        imprimir('mouseover  · disparo ' + vecesOver + ' (sobre: ' + sobre + ')');
  //   Resultado esperado al entrar en la zona y pasar al recuadro interior y
  //   volver a salir: #cont-enter se queda en 1 mientras #cont-over sube a 3 o
  //   más. Esa diferencia de números ES la lección del apartado.
  //   (aprox. 20 lineas)

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

  // TODO (en clase):
  //   1. const pad    = document.getElementById('pad-raton');
  //      const coords = document.getElementById('coords');
  //      let movimientos = 0;
  //   2. 'mousemove' sobre pad:
  //        a) SIEMPRE (actualizar texto es barato):
  //             coords.textContent = 'x: ' + Math.round(evento.offsetX) +
  //                                  ', y: ' + Math.round(evento.offsetY);
  //        b) movimientos = movimientos + 1;
  //        c) SOLO 1 de cada 25 veces (movimientos % 25 === 0), porque imprimir
  //           es caro. Esta técnica de reducir la frecuencia se parece al
  //           throttling:
  //             imprimir('mousemove nº ' + movimientos +
  //                      ' · offset(' + Math.round(evento.offsetX) + ', ' + Math.round(evento.offsetY) + ')' +
  //                      ' · client(' + evento.clientX + ', ' + evento.clientY + ')');
  //   Resultado esperado: #coords cambia continuamente mientras se mueve el
  //   ratón por el pad, pero en la consola solo sale una línea cada 25 eventos.
  //   (aprox. 14 lineas)

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

  // TODO (en clase):
  //   1. const zonaContextual = document.getElementById('zona-contextual');
  //      const menuContextual = document.getElementById('menu-contextual');
  //      (el <ul> del menú ya está en el HTML, con la clase "oculto" puesta)
  //   2. 'contextmenu' sobre zonaContextual:
  //        evento.preventDefault();                    // adiós al menú nativo
  //        const caja = zonaContextual.getBoundingClientRect();
  //        const x = evento.clientX - caja.left;       // posición DENTRO de la zona
  //        const y = evento.clientY - caja.top;
  //        menuContextual.style.left = x + 'px';       // ⚠️ las unidades son obligatorias
  //        menuContextual.style.top  = y + 'px';
  //        menuContextual.classList.remove('oculto');
  //        titulo('4. contextmenu');
  //        imprimir('Menú propio abierto en x: ' + Math.round(x) + ', y: ' + Math.round(y));
  //   3. Delegación otra vez: UN manejador de 'click' en menuContextual para
  //      las tres opciones (<li data-opcion="copiar|renombrar|eliminar">):
  //        const opcion = evento.target.closest('li');
  //        if (!opcion) return;
  //        imprimir('Opción elegida: ' + opcion.dataset.opcion);
  //        menuContextual.classList.add('oculto');
  //   4. Cerrar el menú al pulsar en cualquier otro sitio, aprovechando que
  //      TODOS los clics burbujean hasta document:
  //        document.addEventListener('click', function (evento) {
  //          if (evento.target.closest('#menu-contextual')) return;
  //          menuContextual.classList.add('oculto');
  //        });
  //   Resultado esperado: clic derecho en la zona -> aparece el menú morado
  //   justo bajo el puntero; al elegir una opción se imprime su data-opcion y
  //   el menú se cierra; un clic fuera también lo cierra.
  //   (aprox. 25 lineas)

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

  // TODO (en clase):
  //   1. const inputTeclas = document.getElementById('input-teclas');
  //   2. 'keydown' sobre ese input:
  //        a) Construye un array `modificadores` y añade con push 'Ctrl' si
  //           evento.ctrlKey, 'Shift' si evento.shiftKey, 'Alt' si evento.altKey
  //           y 'Meta/Cmd' si evento.metaKey (tecla Windows o Command).
  //        b) imprimir('keydown · key: "' + evento.key + '"' +
  //                    ' · code: "' + evento.code + '"' +
  //                    ' · repetida: ' + evento.repeat +
  //                    (modificadores.length ? ' · modificadores: ' + modificadores.join('+') : ''));
  //        c) Teclas especiales frecuentes:
  //             if (evento.key === 'Enter') -> imprimir('   >> Has pulsado Enter: aquí se enviaría el formulario.')
  //             if (evento.key === 'Escape') -> imprimir('   >> Escape: se suele usar para cerrar o cancelar.')
  //                                             y vaciar el campo (inputTeclas.value = '')
  //   3. 'keyup' sobre el mismo input: imprimir('keyup   · has soltado "' + evento.key + '"')
  //   Demostración de clase: escribe una "ñ" y luego una "A" con Shift. Verás
  //   que key cambia ("ñ", "A") pero code se queda en la tecla física
  //   ("Semicolon" en teclado ES para la ñ, "KeyA" para la a).
  //   (aprox. 20 lineas)

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

  // TODO (en clase):
  //   1. document.addEventListener('keydown', function (evento) { ... }) que:
  //        const conControl = evento.ctrlKey || evento.metaKey;
  //        if (conControl && evento.shiftKey && evento.key.toLowerCase() === 'l') {
  //          evento.preventDefault();   // evitamos que el navegador haga lo suyo
  //          limpiarConsola();          // ya está escrita en el apartado 0
  //          imprimir('Atajo Ctrl/Cmd + Shift + L: consola de la sección 3 limpiada.');
  //        }
  //      OJO al toLowerCase(): con Shift pulsado, evento.key vale 'L' en mayúscula.
  //   Resultado esperado: con el foco en cualquier parte de la página,
  //   Ctrl/Cmd + Shift + L vacía #salida-03 y deja esa única línea.
  //   (aprox. 8 lineas)

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

  // TODO (en clase):
  //   1. Referencias y estado:
  //        const tablero  = document.getElementById('tablero');
  //        const cuadrado = document.getElementById('cuadrado');
  //        const PASO = 14;      // píxeles que avanza en cada pulsación
  //        let posX = 10;
  //        let posY = 10;
  //   2. function colocarCuadrado() que recorta la posición para que el
  //      cuadrado no se salga y la aplica:
  //        const limiteX = tablero.clientWidth  - cuadrado.offsetWidth;
  //        const limiteY = tablero.clientHeight - cuadrado.offsetHeight;
  //        posX = Math.max(0, Math.min(limiteX, posX));   // ni negativo ni pasado
  //        posY = Math.max(0, Math.min(limiteY, posY));
  //        cuadrado.style.left = posX + 'px';
  //        cuadrado.style.top  = posY + 'px';
  //   3. Llama UNA vez a colocarCuadrado() para la posición inicial (10, 10).
  //   4. 'keydown' sobre tablero:
  //        const flechas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  //        if (!flechas.includes(evento.key)) return;   // salida temprana
  //        evento.preventDefault();                     // sin esto la página hace scroll
  //        ArrowUp -> posY - PASO   ArrowDown  -> posY + PASO
  //        ArrowLeft -> posX - PASO ArrowRight -> posX + PASO
  //        colocarCuadrado();
  //        imprimir('Tecla ' + evento.key + ' · posición: (' + posX + ', ' + posY + ')');
  //   5. Pistas visuales de foco (explican por qué "a veces no responde"):
  //        'focus' en tablero -> imprimir('El tablero tiene el foco: ya puedes usar las flechas.')
  //        'blur'  en tablero -> imprimir('El tablero ha perdido el foco: las flechas ya no lo mueven.')
  //   Resultado esperado: clic en el tablero, flecha derecha -> el cuadrado se
  //   mueve a (24, 10) y la consola lo confirma. Al llegar al borde, la
  //   posición deja de crecer.
  //   (aprox. 35 lineas)

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
