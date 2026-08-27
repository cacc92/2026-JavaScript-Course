/**
 * ============================================================================
 * ARCHIVO: js/04-ui.js
 * PROYECTO: 11 · Proyecto final integrador: tienda con carrito (TechStore)
 * ----------------------------------------------------------------------------
 * TEMAS DEL CURSO QUE SE APLICAN AQUÍ
 *   · Proyecto 06 (DOM)        -> getElementById, innerHTML, textContent,
 *                                 createElement, appendChild, classList,
 *                                 atributos data-* y setAttribute.
 *   · Proyecto 04 (Arrays)     -> map + join('') para construir HTML.
 *   · Proyecto 05 (Objetos)    -> destructuring, objeto de referencias al DOM.
 *   · Proyecto 03 (Funciones)  -> funciones pequeñas con una sola tarea.
 *   · Proyecto 01 (Fundamentos)-> plantillas de texto con backticks.
 *
 * QUÉ ES ESTE ARCHIVO
 * La CAPA DE PRESENTACIÓN. Es el único archivo del proyecto que toca el DOM.
 * Aquí no hay reglas de negocio: nadie decide si se puede agregar un producto
 * o cuánto suma el IVA. Este archivo solo sabe DIBUJAR lo que le den.
 *
 * POR QUÉ ESTA SEPARACIÓN IMPORTA TANTO
 * Cuando la lógica y la pintura se mezclan, un cambio de diseño obliga a tocar
 * los cálculos, y cualquier retoque en los cálculos rompe el diseño. Separarlos
 * permite rehacer la interfaz entera sin abrir 03-clases.js.
 *
 * SOBRE innerHTML Y LA SEGURIDAD
 * Construimos el HTML con plantillas y lo insertamos con innerHTML porque es
 * rápido de leer y de explicar. A cambio, TODO texto que venga de los datos
 * pasa antes por escaparHTML(). Si no lo hiciéramos, un nombre de producto con
 * etiquetas dentro se ejecutaría como HTML real (ataque XSS).
 *
 * ÍNDICE DEL ARCHIVO
 *   1. Referencias al DOM (se buscan UNA sola vez).
 *   2. Avisos emergentes (toasts).
 *   3. Catálogo: esqueletos, tarjetas, filtros y resumen.
 *   4. Panel del carrito: líneas, totales, abrir y cerrar.
 *   5. Modal de checkout: abrir, cerrar, resumen y confirmación.
 *   6. Validación visual de los campos del formulario.
 *   7. Publicación en TIENDA.ui.
 *   8. Ejercicios propuestos.
 * ============================================================================
 */

window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';

  const {
    imprimir, hora, escaparHTML, formatearPrecio, porcentaje, estrellas, recortar
  } = TIENDA.utiles;

  // ==========================================================================
  // 1. REFERENCIAS AL DOM
  // ==========================================================================
  /*
    Buscar un elemento en el DOM cuesta tiempo. Si lo hiciéramos dentro de cada
    función, estaríamos repitiendo la misma búsqueda cientos de veces.
    Solución: buscarlos UNA vez al cargar el archivo y guardarlos en un objeto.

    Esto funciona porque los <script> llevan `defer`: cuando este código se
    ejecuta, el HTML ya está completo.
    ⚠️ ERROR COMÚN: sin defer, todos estos elementos valdrían null.

    Convención: el nombre de la variable se parece al id, pero en camelCase.
  */
  const el = {
    // Catálogo
    rejilla: document.getElementById('rejilla-productos'),
    filtros: document.getElementById('filtros-categoria'),
    resumenResultados: document.getElementById('resumen-resultados'),
    estadoVacio: document.getElementById('estado-vacio'),
    buscador: document.getElementById('buscador'),
    orden: document.getElementById('orden'),

    // Carrito
    abrirCarrito: document.getElementById('abrir-carrito'),
    cerrarCarrito: document.getElementById('cerrar-carrito'),
    panel: document.getElementById('panel-carrito'),
    capa: document.getElementById('capa-oscura'),
    lineas: document.getElementById('lineas-carrito'),
    carritoVacio: document.getElementById('carrito-vacio'),
    contador: document.getElementById('contador-carrito'),
    subtotal: document.getElementById('subtotal-carrito'),
    iva: document.getElementById('iva-carrito'),
    etiquetaIva: document.getElementById('etiqueta-iva'),
    total: document.getElementById('total-carrito'),
    vaciar: document.getElementById('vaciar-carrito'),
    irCheckout: document.getElementById('ir-checkout'),

    // Checkout
    modal: document.getElementById('modal-checkout'),
    cerrarModal: document.getElementById('cerrar-modal'),
    formulario: document.getElementById('formulario-checkout'),
    resumenPedido: document.getElementById('resumen-pedido'),
    vistaFormulario: document.getElementById('vista-formulario'),
    vistaConfirmacion: document.getElementById('vista-confirmacion'),
    tituloModal: document.getElementById('titulo-modal'),

    // Varios
    toasts: document.getElementById('toasts'),
    salida: document.getElementById('salida')
  };

  // Guardamos qué elemento tenía el foco antes de abrir el panel o el modal,
  // para devolvérselo al cerrar. Es un detalle de accesibilidad que se agradece
  // muchísimo cuando alguien navega solo con el teclado.
  let ultimoFoco = null;

  // ==========================================================================
  // 2. AVISOS EMERGENTES (TOASTS)
  // ==========================================================================
  /*
    Un toast informa sin bloquear. Es la alternativa correcta a alert().

    Ciclo de vida:
      1. Se crea el <div> con createElement.
      2. Se añade al contenedor con appendChild (aparece con una animación CSS).
      3. A los X milisegundos se le pone la clase .saliendo (animación de salida).
      4. 250 ms después se elimina del DOM con remove().

    ⚠️ ERROR COMÚN: crear toasts y no eliminarlos nunca. Al cabo de un rato hay
    cientos de nodos invisibles en el DOM consumiendo memoria.
  */
  const ICONOS_TOAST = {
    exito: '✅',
    alerta: '⚠️',
    error: '⛔',
    info: 'ℹ️'
  };

  function toast(mensaje, tipo = 'info', duracion = 2600) {
    if (!el.toasts) return;

    const aviso = document.createElement('div');
    aviso.className = `toast ${tipo}`;
    // role="status" hace que los lectores de pantalla lo anuncien.
    aviso.setAttribute('role', 'status');

    // innerHTML con datos escapados: el mensaje puede contener el nombre de un
    // producto, y los nombres los escribe alguien que no somos nosotros.
    aviso.innerHTML = `
      <span class="icono-toast" aria-hidden="true">${ICONOS_TOAST[tipo] ?? ICONOS_TOAST.info}</span>
      <span>${escaparHTML(mensaje)}</span>
    `;

    el.toasts.appendChild(aviso);

    setTimeout(() => {
      aviso.classList.add('saliendo');
      // Esperamos a que termine la animación antes de quitarlo del DOM.
      setTimeout(() => aviso.remove(), 250);
    }, duracion);
  }

  // ==========================================================================
  // 3. CATÁLOGO
  // ==========================================================================
  /**
   * pintarEsqueletos(): rellena la rejilla con tarjetas fantasma mientras
   * la promesa de carga está pendiente.
   *
   * Array.from({ length: n }, callback) crea un array de n elementos sin tener
   * que escribir un bucle. Es el truco clásico para "repetir HTML n veces".
   */
  function pintarEsqueletos(cantidad = 8) {
    if (!el.rejilla) return;

    el.rejilla.innerHTML = Array.from({ length: cantidad }, () => `
      <div class="esqueleto" aria-hidden="true">
        <div class="bloque imagen"></div>
        <div class="bloque linea media"></div>
        <div class="bloque linea"></div>
        <div class="bloque linea corta"></div>
      </div>
    `).join('');

    ocultar(el.estadoVacio, true);
    if (el.resumenResultados) el.resumenResultados.textContent = 'Cargando catálogo...';
  }

  /**
   * plantillaProducto(): devuelve el HTML de UNA tarjeta.
   *
   * Separar la plantilla de una tarjeta del bucle que las pinta todas es lo
   * que hace que el código siga siendo legible cuando la tarjeta crece.
   *
   * FÍJATE EN LOS ATRIBUTOS data-*
   *   data-accion="agregar"  -> qué hay que hacer al pulsar.
   *   data-id="p03"          -> sobre qué producto.
   * Son la clave de la DELEGACIÓN DE EVENTOS que verás en 05-app.js: en lugar
   * de poner un listener por botón, ponemos UNO en la rejilla y leemos estos
   * atributos para saber qué se pulsó.
   */
  function plantillaProducto(producto, cantidadEnCarrito = 0) {
    const agotado = !producto.hayStock;
    const topeAlcanzado = cantidadEnCarrito >= producto.stock;

    // El texto del botón cambia según la situación. Un operador ternario
    // encadenado se lee bien si está formateado como una tabla.
    const textoBoton = agotado
      ? 'Agotado'
      : topeAlcanzado
        ? 'Máximo en el carrito'
        : 'Agregar al carrito';

    return `
      <article class="tarjeta-producto" data-id="${escaparHTML(producto.id)}">
        <div class="imagen-producto" style="--degradado: ${producto.degradado}">
          <span class="etiqueta-categoria">${escaparHTML(producto.categoria)}</span>
          <span aria-hidden="true">${producto.emoji}</span>
        </div>

        <div class="cuerpo-producto">
          <h3 class="nombre-producto">${escaparHTML(producto.nombre)}</h3>
          <p class="descripcion-producto">${escaparHTML(recortar(producto.descripcion, 110))}</p>

          <div class="fila-meta">
            <span class="valoracion" title="Valoración media">${estrellas(producto.valoracion)}</span>
            <span class="stock ${producto.estadoStock}">${escaparHTML(producto.textoStock)}</span>
          </div>

          <div class="precio">${producto.precioFormateado}</div>

          <button
            type="button"
            class="boton ancho"
            data-accion="agregar"
            data-id="${escaparHTML(producto.id)}"
            ${agotado || topeAlcanzado ? 'disabled' : ''}>
            ${textoBoton}
          </button>
        </div>
      </article>
    `;
  }

  /**
   * pintarCatalogo(): dibuja todas las tarjetas de una vez.
   *
   * EL PATRÓN map + join('') + innerHTML
   *   1. map transforma cada producto en un trozo de HTML (un string).
   *   2. join('') pega todos esos trozos en un único string gigante.
   *      ⚠️ ERROR COMÚN: olvidar el join. Al convertir el array a texto,
   *      JavaScript mete comas entre los elementos y aparecen comas sueltas
   *      por toda la página.
   *   3. innerHTML lo inserta de UNA sola vez: un único repintado del
   *      navegador en lugar de uno por tarjeta.
   */
  function pintarCatalogo(productos, carrito) {
    if (!el.rejilla) return;

    if (productos.length === 0) {
      el.rejilla.innerHTML = '';
      ocultar(el.estadoVacio, false);
      return;
    }

    ocultar(el.estadoVacio, true);

    el.rejilla.innerHTML = productos
      .map((producto) => plantillaProducto(producto, carrito ? carrito.cantidadDe(producto.id) : 0))
      .join('');
  }

  /** Texto informativo: "Mostrando 6 de 16 productos". */
  function actualizarResumen(mostrados, total, filtro, busqueda) {
    if (!el.resumenResultados) return;

    let texto = `Mostrando ${mostrados} de ${total} productos`;
    if (filtro && filtro !== 'todas') texto += ` · categoría: ${filtro}`;
    if (busqueda) texto += ` · búsqueda: "${busqueda}"`;

    // textContent (y no innerHTML) porque aquí se mete lo que el usuario
    // escribió en el buscador. Con textContent es IMPOSIBLE inyectar HTML.
    el.resumenResultados.textContent = texto;
  }

  /**
   * pintarFiltros(): crea los botones de categoría.
   * El primero, "Todas", se añade a mano con spread al principio del array.
   */
  function pintarFiltros(categorias, activa = 'todas') {
    if (!el.filtros) return;

    const todas = ['todas', ...categorias];

    el.filtros.innerHTML = todas
      .map((categoria) => {
        const etiqueta = categoria === 'todas' ? 'Todas' : categoria;
        const claseActiva = categoria === activa ? ' activo' : '';
        return `
          <button
            type="button"
            class="chip${claseActiva}"
            data-categoria="${escaparHTML(categoria)}"
            aria-pressed="${categoria === activa}">${escaparHTML(etiqueta)}</button>
        `;
      })
      .join('');
  }

  /**
   * marcarFiltroActivo(): mueve la clase .activo de un chip a otro.
   *
   * No hace falta repintar todos los botones: basta con recorrerlos y usar
   * classList.toggle(clase, condicion), que añade la clase si la condición es
   * verdadera y la quita si es falsa. Mucho más limpio que un if/else.
   */
  function marcarFiltroActivo(categoria) {
    if (!el.filtros) return;
    el.filtros.querySelectorAll('.chip').forEach((chip) => {
      const esActivo = chip.dataset.categoria === categoria;
      chip.classList.toggle('activo', esActivo);
      chip.setAttribute('aria-pressed', String(esActivo));
    });
  }

  // ==========================================================================
  // 4. PANEL DEL CARRITO
  // ==========================================================================
  /**
   * plantillaLinea(): el HTML de una línea del carrito.
   * Igual que en las tarjetas, cada botón lleva data-accion y data-id para
   * que el listener delegado sepa qué hacer.
   */
  function plantillaLinea(linea) {
    const { producto, cantidad } = linea;   // Destructuring del objeto línea

    return `
      <li class="linea-carrito" data-id="${escaparHTML(producto.id)}">
        <div class="miniatura" style="--degradado: ${producto.degradado}" aria-hidden="true">
          ${producto.emoji}
        </div>

        <div class="datos-linea">
          <div class="titulo" title="${escaparHTML(producto.nombre)}">${escaparHTML(producto.nombre)}</div>
          <div class="precio-unitario">${producto.precioFormateado} por unidad</div>

          <div class="controles-cantidad">
            <button type="button" class="boton-cantidad" data-accion="restar"
                    data-id="${escaparHTML(producto.id)}" aria-label="Quitar una unidad">−</button>

            <span class="cantidad" aria-live="polite">${cantidad}</span>

            <button type="button" class="boton-cantidad" data-accion="sumar"
                    data-id="${escaparHTML(producto.id)}" aria-label="Añadir una unidad"
                    ${linea.puedeSumar ? '' : 'disabled'}>+</button>

            <span class="subtotal-linea">${linea.subtotalFormateado}</span>
          </div>
        </div>

        <button type="button" class="quitar-linea" data-accion="quitar"
                data-id="${escaparHTML(producto.id)}" aria-label="Quitar ${escaparHTML(producto.nombre)}">🗑️</button>
      </li>
    `;
  }

  /**
   * pintarCarrito(): redibuja el panel entero a partir del objeto carrito.
   *
   * ✅ BUENA PRÁCTICA: una sola función que pinta TODO el carrito a partir del
   * estado actual, en lugar de mil parches que añaden o quitan trocitos. Se
   * llama "renderizado a partir del estado" y es la idea que hay detrás de
   * React, Vue y compañía. Si el estado es correcto, la pantalla lo será.
   */
  function pintarCarrito(carrito) {
    if (!el.lineas) return;

    el.lineas.innerHTML = carrito.lineas.map(plantillaLinea).join('');

    // Estado vacío: se muestra el mensaje y se apaga el botón de comprar.
    ocultar(el.carritoVacio, !carrito.estaVacio);
    if (el.irCheckout) el.irCheckout.disabled = carrito.estaVacio;
    if (el.vaciar) el.vaciar.disabled = carrito.estaVacio;

    // Totales. Se piden a los getters, que los recalculan en el momento.
    if (el.subtotal) el.subtotal.textContent = formatearPrecio(carrito.subtotal);
    if (el.iva) el.iva.textContent = formatearPrecio(carrito.iva);
    if (el.total) el.total.textContent = formatearPrecio(carrito.total);
    if (el.etiquetaIva) el.etiquetaIva.textContent = `IVA (${porcentaje(carrito.tasaIva)})`;

    actualizarContador(carrito);
  }

  /** Actualiza la burbujita del número de artículos del botón del carrito. */
  function actualizarContador(carrito) {
    if (!el.contador) return;
    const total = carrito.cantidadTotal;
    el.contador.textContent = total;
    // Si no hay nada, escondemos la burbuja en lugar de mostrar un 0.
    el.contador.classList.toggle('oculto', total === 0);
  }

  /** Abre el panel lateral. */
  function abrirCarrito() {
    if (!el.panel) return;
    ultimoFoco = document.activeElement;      // Recordamos dónde estaba el foco

    el.panel.classList.add('abierto');
    el.panel.setAttribute('aria-hidden', 'false');
    el.capa?.classList.add('visible');
    document.body.classList.add('sin-scroll');

    // Llevamos el foco dentro del panel para poder navegarlo con el teclado.
    el.cerrarCarrito?.focus();
  }

  /** Cierra el panel lateral. */
  function cerrarCarrito() {
    if (!el.panel) return;

    el.panel.classList.remove('abierto');
    el.panel.setAttribute('aria-hidden', 'true');

    // Solo apagamos la capa y devolvemos el scroll si tampoco hay modal abierto.
    if (!hayModalAbierto()) {
      el.capa?.classList.remove('visible');
      document.body.classList.remove('sin-scroll');
    }

    // Devolvemos el foco a donde estaba antes de abrir.
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
  }

  function hayPanelAbierto() {
    return Boolean(el.panel?.classList.contains('abierto'));
  }

  // ==========================================================================
  // 5. MODAL DE CHECKOUT
  // ==========================================================================
  /**
   * pintarResumenPedido(): la lista de lo que se va a comprar, dentro del modal.
   */
  function pintarResumenPedido(carrito) {
    if (!el.resumenPedido) return;

    const filas = carrito.lineas
      .map((linea) => `
        <li>
          <span>${linea.cantidad} × ${escaparHTML(linea.producto.nombre)}</span>
          <span>${linea.subtotalFormateado}</span>
        </li>
      `)
      .join('');

    el.resumenPedido.innerHTML = `
      <h3>Resumen del pedido</h3>
      <ul>
        ${filas}
        <li><span>Subtotal</span><span>${formatearPrecio(carrito.subtotal)}</span></li>
        <li><span>IVA (${porcentaje(carrito.tasaIva)})</span><span>${formatearPrecio(carrito.iva)}</span></li>
        <li class="total-resumen"><span>Total a pagar</span><span>${formatearPrecio(carrito.total)}</span></li>
      </ul>
    `;
  }

  function abrirModal() {
    if (!el.modal) return;
    ultimoFoco = document.activeElement;

    el.modal.classList.add('abierto');
    el.modal.setAttribute('aria-hidden', 'false');
    el.capa?.classList.add('visible');
    document.body.classList.add('sin-scroll');

    // Foco en el primer campo del formulario: quien usa teclado empieza a
    // escribir directamente.
    document.getElementById('nombre')?.focus();
  }

  function cerrarModal() {
    if (!el.modal) return;

    el.modal.classList.remove('abierto');
    el.modal.setAttribute('aria-hidden', 'true');

    if (!hayPanelAbierto()) {
      el.capa?.classList.remove('visible');
      document.body.classList.remove('sin-scroll');
    }

    if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
  }

  function hayModalAbierto() {
    return Boolean(el.modal?.classList.contains('abierto'));
  }

  /** Vuelve a mostrar el formulario (después de una compra o al reabrir). */
  function mostrarVistaFormulario() {
    ocultar(el.vistaFormulario, false);
    ocultar(el.vistaConfirmacion, true);
    if (el.tituloModal) el.tituloModal.textContent = 'Finalizar compra';
  }

  /**
   * mostrarConfirmacion(): sustituye el formulario por el mensaje de éxito.
   * Recibe un objeto con los datos del pedido ya validados.
   */
  function mostrarConfirmacion({ numero, nombre, email, total, unidades, fecha }) {
    if (!el.vistaConfirmacion) return;

    el.vistaConfirmacion.innerHTML = `
      <span class="icono-exito" aria-hidden="true">🎉</span>
      <h3>¡Pedido confirmado!</h3>
      <p>Gracias por tu compra, <strong>${escaparHTML(nombre)}</strong>.</p>
      <p>Número de pedido: <span class="numero-pedido">${escaparHTML(numero)}</span></p>
      <p>${unidades} artículo(s) · Total pagado: <strong>${formatearPrecio(total)}</strong></p>
      <p>Enviaremos la confirmación a <strong>${escaparHTML(email)}</strong>.</p>
      <p>Fecha estimada de entrega: <strong>${escaparHTML(fecha)}</strong>.</p>
      <button type="button" class="boton ancho" id="seguir-comprando">
        Seguir comprando
      </button>
    `;

    ocultar(el.vistaFormulario, true);
    ocultar(el.vistaConfirmacion, false);
    if (el.tituloModal) el.tituloModal.textContent = 'Pedido realizado';
  }

  // ==========================================================================
  // 6. VALIDACIÓN VISUAL DE LOS CAMPOS
  // ==========================================================================
  /*
    Estas funciones NO deciden si un campo es válido: eso lo hace 05-app.js.
    Aquí solo se pinta el resultado. Otra vez la misma separación.

    Cada campo del HTML tiene esta forma:
      <div class="campo" data-campo="email">
        <input id="email">
        <span class="mensaje-error" id="error-email"></span>
      </div>
  */

  /** Pinta un campo como incorrecto y escribe el mensaje debajo. */
  function marcarCampoInvalido(nombreCampo, mensaje) {
    const contenedor = document.querySelector(`.campo[data-campo="${nombreCampo}"]`);
    const error = document.getElementById(`error-${nombreCampo}`);

    contenedor?.classList.add('invalido');
    contenedor?.classList.remove('valido');
    if (error) error.textContent = mensaje;

    // aria-invalid avisa a los lectores de pantalla de que ese campo falla.
    document.getElementById(nombreCampo)?.setAttribute('aria-invalid', 'true');
  }

  /** Pinta un campo como correcto y borra su mensaje. */
  function marcarCampoValido(nombreCampo) {
    const contenedor = document.querySelector(`.campo[data-campo="${nombreCampo}"]`);
    const error = document.getElementById(`error-${nombreCampo}`);

    contenedor?.classList.remove('invalido');
    contenedor?.classList.add('valido');
    if (error) error.textContent = '';

    document.getElementById(nombreCampo)?.setAttribute('aria-invalid', 'false');
  }

  /** Deja todos los campos en su estado neutro (ni verde ni rojo). */
  function limpiarValidacion() {
    document.querySelectorAll('.campo').forEach((campo) => {
      campo.classList.remove('invalido', 'valido');
    });
    document.querySelectorAll('.mensaje-error').forEach((error) => {
      error.textContent = '';
    });
  }

  // ==========================================================================
  // UTILIDAD INTERNA
  // ==========================================================================
  /**
   * ocultar(elemento, condicion): añade o quita la clase .oculto.
   * Se usa tanto que merece su propia función. Nótese que no usamos
   * elemento.style.display: las clases son más fáciles de mantener y de
   * depurar (se ven en el inspector).
   */
  function ocultar(elemento, condicion) {
    if (!elemento) return;
    elemento.classList.toggle('oculto', Boolean(condicion));
  }

  // ==========================================================================
  // 7. PUBLICACIÓN EN EL ESPACIO DE NOMBRES
  // ==========================================================================
  TIENDA.ui = {
    el,                       // Las referencias, para que 05-app.js escuche eventos
    toast,
    pintarEsqueletos,
    pintarCatalogo,
    actualizarResumen,
    pintarFiltros,
    marcarFiltroActivo,
    pintarCarrito,
    actualizarContador,
    abrirCarrito,
    cerrarCarrito,
    hayPanelAbierto,
    pintarResumenPedido,
    abrirModal,
    cerrarModal,
    hayModalAbierto,
    mostrarVistaFormulario,
    mostrarConfirmacion,
    marcarCampoInvalido,
    marcarCampoValido,
    limpiarValidacion,
    ocultar
  };

  imprimir(`[${hora()}] 04-ui.js cargado. Referencias al DOM preparadas.`);
})(window.TIENDA);


/**
 * ============================================================================
 * EJERCICIOS PROPUESTOS (archivo 04-ui.js)
 * ----------------------------------------------------------------------------
 * 1. FÁCIL. Cambia el número de esqueletos de 8 a 12 y sube el retardo de
 *    carga en 02-datos.js para verlos con calma.
 *
 * 2. FÁCIL. Añade a la tarjeta una etiqueta "Top ventas" cuando la valoración
 *    sea 4.7 o mayor. Crea también su estilo en el CSS.
 *
 * 3. MEDIO. Sustituye el patrón innerHTML por creación de nodos con
 *    document.createElement y appendChild en plantillaLinea(). Compara ambas
 *    versiones: ¿cuál es más larga?, ¿cuál es más segura?
 *
 * 4. MEDIO. Haz que el toast se pueda cerrar antes de tiempo pulsando sobre
 *    él. Cuidado: el contenedor tiene pointer-events: none en el CSS.
 *
 * 5. DIFÍCIL. Implementa una "trampa de foco" en el modal: al pulsar el
 *    tabulador dentro, el foco no debe salirse nunca de la ventana. Pista:
 *    escucha keydown, busca los elementos enfocables y controla el primero y
 *    el último.
 *
 * 6. DIFÍCIL. Añade una animación al contador del carrito cada vez que cambie
 *    (por ejemplo un pequeño rebote). Piensa cómo reiniciar la animación
 *    cuando se repite el mismo cambio dos veces seguidas.
 * ============================================================================
 */
