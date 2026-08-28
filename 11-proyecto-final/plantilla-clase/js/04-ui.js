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
 * ----------------------------------------------------------------------------
 * ▶ PLANTILLA DE CLASE
 * Versión POR COMPLETAR. La solución está en ../../js/04-ui.js
 * El HTML y el CSS ya están hechos: todos los ids y las clases que se citan en
 * los TODO existen de verdad en index.html y en css/estilos.css. No hay que
 * inventarse ningún nombre.
 * ============================================================================
 */

window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';

  // Cableado con el archivo de utilidades (viene escrito).
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
  // TODO (en clase):
  //   Crea `const el = { ... }` con document.getElementById() para cada id.
  //   Los ids EXISTEN YA en index.html; cópialos tal cual:
  //     // Catálogo
  //     rejilla: 'rejilla-productos'      filtros: 'filtros-categoria'
  //     resumenResultados: 'resumen-resultados'
  //     estadoVacio: 'estado-vacio'       buscador: 'buscador'
  //     orden: 'orden'
  //     // Carrito
  //     abrirCarrito: 'abrir-carrito'     cerrarCarrito: 'cerrar-carrito'
  //     panel: 'panel-carrito'            capa: 'capa-oscura'
  //     lineas: 'lineas-carrito'          carritoVacio: 'carrito-vacio'
  //     contador: 'contador-carrito'      subtotal: 'subtotal-carrito'
  //     iva: 'iva-carrito'                etiquetaIva: 'etiqueta-iva'
  //     total: 'total-carrito'            vaciar: 'vaciar-carrito'
  //     irCheckout: 'ir-checkout'
  //     // Checkout
  //     modal: 'modal-checkout'           cerrarModal: 'cerrar-modal'
  //     formulario: 'formulario-checkout' resumenPedido: 'resumen-pedido'
  //     vistaFormulario: 'vista-formulario'
  //     vistaConfirmacion: 'vista-confirmacion'
  //     tituloModal: 'titulo-modal'
  //     // Varios
  //     toasts: 'toasts'                  salida: 'salida'
  //   Después declara, fuera del objeto:
  //     let ultimoFoco = null;
  //   Guardamos qué elemento tenía el foco antes de abrir el panel o el modal,
  //   para devolvérselo al cerrar. Es un detalle de accesibilidad que se
  //   agradece muchísimo cuando alguien navega solo con el teclado.
  //   Comprobación: imprimir(Object.values(el).filter(Boolean).length);
  //   Resultado esperado en pantalla: 25
  //   (aprox. 40 líneas)

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
  // TODO (en clase):
  //   1. const ICONOS_TOAST = { exito: '✅', alerta: '⚠️', error: '⛔', info: 'ℹ️' };
  //   2. function toast(mensaje, tipo = 'info', duracion = 2600) { ... }
  //      - if (!el.toasts) return;   // salida temprana defensiva
  //      - const aviso = document.createElement('div');
  //        aviso.className = `toast ${tipo}`;
  //        aviso.setAttribute('role', 'status');   // los lectores lo anuncian
  //      - aviso.innerHTML con DOS <span>:
  //          <span class="icono-toast" aria-hidden="true">${ICONOS_TOAST[tipo] ?? ICONOS_TOAST.info}</span>
  //          <span>${escaparHTML(mensaje)}</span>
  //        innerHTML con datos escapados: el mensaje puede contener el nombre
  //        de un producto, y los nombres los escribe alguien que no somos
  //        nosotros.
  //      - el.toasts.appendChild(aviso);
  //      - setTimeout de `duracion` ms que añade la clase 'saliendo' y, dentro,
  //        otro setTimeout de 250 ms que hace aviso.remove().
  //   Prueba: toast('Hola clase', 'exito');
  //   Resultado esperado: aparece abajo a la derecha un aviso verde con ✅ que
  //   se va solo a los 2,6 segundos.
  //   (aprox. 22 líneas)

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
  // TODO (en clase):
  //   1. function pintarEsqueletos(cantidad = 8) con salida temprana si !el.rejilla.
  //   2. el.rejilla.innerHTML = Array.from({ length: cantidad }, () => `...`).join('')
  //      donde la plantilla de cada esqueleto es exactamente:
  //        <div class="esqueleto" aria-hidden="true">
  //          <div class="bloque imagen"></div>
  //          <div class="bloque linea media"></div>
  //          <div class="bloque linea"></div>
  //          <div class="bloque linea corta"></div>
  //        </div>
  //   3. ocultar(el.estadoVacio, true);
  //   4. if (el.resumenResultados) el.resumenResultados.textContent = 'Cargando catálogo...';
  //   Resultado esperado en pantalla: ocho tarjetas grises que laten.
  //   (aprox. 15 líneas)

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
  // TODO (en clase):
  //   1. function plantillaProducto(producto, cantidadEnCarrito = 0).
  //   2. const agotado = !producto.hayStock;
  //      const topeAlcanzado = cantidadEnCarrito >= producto.stock;
  //   3. const textoBoton con un ternario encadenado:
  //        agotado -> 'Agotado'; topeAlcanzado -> 'Máximo en el carrito';
  //        si no -> 'Agregar al carrito'.
  //      Un ternario encadenado se lee bien si está formateado como una tabla.
  //   4. Devuelve la plantilla con esta estructura EXACTA de clases del CSS:
  //        <article class="tarjeta-producto" data-id="...">
  //          <div class="imagen-producto" style="--degradado: ${producto.degradado}">
  //            <span class="etiqueta-categoria">categoría</span>
  //            <span aria-hidden="true">emoji</span>
  //          </div>
  //          <div class="cuerpo-producto">
  //            <h3 class="nombre-producto">nombre</h3>
  //            <p class="descripcion-producto">recortar(descripcion, 110)</p>
  //            <div class="fila-meta">
  //              <span class="valoracion" title="Valoración media">estrellas(valoracion)</span>
  //              <span class="stock ${producto.estadoStock}">textoStock</span>
  //            </div>
  //            <div class="precio">producto.precioFormateado</div>
  //            <button type="button" class="boton ancho"
  //                    data-accion="agregar" data-id="..."
  //                    ${agotado || topeAlcanzado ? 'disabled' : ''}>textoBoton</button>
  //          </div>
  //        </article>
  //      ✅ Pasa por escaparHTML() el id, la categoría, el nombre, la
  //      descripción y el textoStock. El emoji y el precio ya formateado los
  //      generamos nosotros: no hace falta.
  //   (aprox. 30 líneas)

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
  // TODO (en clase):
  //   1. function pintarCatalogo(productos, carrito) con salida temprana si !el.rejilla.
  //   2. Si productos.length === 0: vacía la rejilla, ocultar(el.estadoVacio, false)
  //      y return. (Ese es el bloque #estado-vacio del HTML: "No encontramos
  //      productos".)
  //   3. Si no: ocultar(el.estadoVacio, true) y
  //        el.rejilla.innerHTML = productos
  //          .map((p) => plantillaProducto(p, carrito ? carrito.cantidadDe(p.id) : 0))
  //          .join('');
  //   (aprox. 14 líneas)

  /** Texto informativo: "Mostrando 6 de 16 productos". */
  // TODO (en clase):
  //   1. function actualizarResumen(mostrados, total, filtro, busqueda).
  //   2. let texto = `Mostrando ${mostrados} de ${total} productos`;
  //      si filtro y filtro !== 'todas'  ->  texto += ` · categoría: ${filtro}`;
  //      si busqueda                     ->  texto += ` · búsqueda: "${busqueda}"`;
  //   3. el.resumenResultados.textContent = texto;
  //      textContent (y no innerHTML) porque aquí se mete lo que el usuario
  //      escribió en el buscador. Con textContent es IMPOSIBLE inyectar HTML.
  //   Resultado esperado en pantalla: Mostrando 3 de 16 productos · categoría: Audio
  //   (aprox. 10 líneas)

  /**
   * pintarFiltros(): crea los botones de categoría.
   * El primero, "Todas", se añade a mano con spread al principio del array.
   */
  // TODO (en clase):
  //   1. function pintarFiltros(categorias, activa = 'todas').
  //   2. const todas = ['todas', ...categorias];
  //   3. el.filtros.innerHTML = todas.map((categoria) => { ... }).join('') donde
  //      cada botón es:
  //        <button type="button" class="chip${claseActiva}"
  //                data-categoria="${escaparHTML(categoria)}"
  //                aria-pressed="${categoria === activa}">${escaparHTML(etiqueta)}</button>
  //      con const etiqueta = categoria === 'todas' ? 'Todas' : categoria;
  //      y   const claseActiva = categoria === activa ? ' activo' : '';
  //   Resultado esperado en pantalla: siete chips (Todas + las 6 categorías).
  //   (aprox. 18 líneas)

  /**
   * marcarFiltroActivo(): mueve la clase .activo de un chip a otro.
   *
   * No hace falta repintar todos los botones: basta con recorrerlos y usar
   * classList.toggle(clase, condicion), que añade la clase si la condición es
   * verdadera y la quita si es falsa. Mucho más limpio que un if/else.
   */
  // TODO (en clase):
  //   1. function marcarFiltroActivo(categoria) con salida temprana si !el.filtros.
  //   2. el.filtros.querySelectorAll('.chip').forEach((chip) => { ... }):
  //        const esActivo = chip.dataset.categoria === categoria;
  //        chip.classList.toggle('activo', esActivo);
  //        chip.setAttribute('aria-pressed', String(esActivo));
  //   (aprox. 8 líneas)

  // ==========================================================================
  // 4. PANEL DEL CARRITO
  // ==========================================================================
  /**
   * plantillaLinea(): el HTML de una línea del carrito.
   * Igual que en las tarjetas, cada botón lleva data-accion y data-id para
   * que el listener delegado sepa qué hacer.
   */
  // TODO (en clase):
  //   1. function plantillaLinea(linea).
  //   2. const { producto, cantidad } = linea;   // destructuring del objeto línea
  //   3. Devuelve la plantilla con esta estructura EXACTA:
  //        <li class="linea-carrito" data-id="...">
  //          <div class="miniatura" style="--degradado: ${producto.degradado}" aria-hidden="true">emoji</div>
  //          <div class="datos-linea">
  //            <div class="titulo" title="nombre">nombre</div>
  //            <div class="precio-unitario">${producto.precioFormateado} por unidad</div>
  //            <div class="controles-cantidad">
  //              <button class="boton-cantidad" data-accion="restar" data-id="..."
  //                      aria-label="Quitar una unidad">−</button>
  //              <span class="cantidad" aria-live="polite">${cantidad}</span>
  //              <button class="boton-cantidad" data-accion="sumar" data-id="..."
  //                      aria-label="Añadir una unidad"
  //                      ${linea.puedeSumar ? '' : 'disabled'}>+</button>
  //              <span class="subtotal-linea">${linea.subtotalFormateado}</span>
  //            </div>
  //          </div>
  //          <button class="quitar-linea" data-accion="quitar" data-id="..."
  //                  aria-label="Quitar ${nombre}">🗑️</button>
  //        </li>
  //      (todos los <button> llevan type="button" y todo texto de producto va
  //      por escaparHTML)
  //   (aprox. 28 líneas)

  /**
   * pintarCarrito(): redibuja el panel entero a partir del objeto carrito.
   *
   * ✅ BUENA PRÁCTICA: una sola función que pinta TODO el carrito a partir del
   * estado actual, en lugar de mil parches que añaden o quitan trocitos. Se
   * llama "renderizado a partir del estado" y es la idea que hay detrás de
   * React, Vue y compañía. Si el estado es correcto, la pantalla lo será.
   */
  // TODO (en clase):
  //   1. function pintarCarrito(carrito) con salida temprana si !el.lineas.
  //   2. el.lineas.innerHTML = carrito.lineas.map(plantillaLinea).join('');
  //   3. Estado vacío: ocultar(el.carritoVacio, !carrito.estaVacio) y desactiva
  //      los botones: el.irCheckout.disabled = carrito.estaVacio;
  //      el.vaciar.disabled = carrito.estaVacio;
  //   4. Totales, pedidos a los getters (que los recalculan en el momento):
  //        el.subtotal.textContent    = formatearPrecio(carrito.subtotal);
  //        el.iva.textContent         = formatearPrecio(carrito.iva);
  //        el.total.textContent       = formatearPrecio(carrito.total);
  //        el.etiquetaIva.textContent = `IVA (${porcentaje(carrito.tasaIva)})`;
  //      (protege cada asignación con un if, por si el elemento no existiera)
  //   5. Termina llamando a actualizarContador(carrito);
  //   Resultado esperado en el panel con un teclado: Subtotal 89,90 € ·
  //   IVA (21 %) 18,88 € · Total 108,78 €
  //   (aprox. 18 líneas)

  /** Actualiza la burbujita del número de artículos del botón del carrito. */
  // TODO (en clase):
  //   1. function actualizarContador(carrito) con salida temprana si !el.contador.
  //   2. const total = carrito.cantidadTotal;
  //      el.contador.textContent = total;
  //   3. el.contador.classList.toggle('oculto', total === 0);
  //      Si no hay nada, escondemos la burbuja en lugar de mostrar un 0.
  //   (aprox. 6 líneas)

  // TODO (en clase) — abrirCarrito() y cerrarCarrito():
  //   abrirCarrito():
  //     1. ultimoFoco = document.activeElement;   // recordamos dónde estaba el foco
  //     2. el.panel.classList.add('abierto');
  //        el.panel.setAttribute('aria-hidden', 'false');
  //     3. el.capa?.classList.add('visible');
  //        document.body.classList.add('sin-scroll');
  //     4. el.cerrarCarrito?.focus();   // el foco entra en el panel
  //   cerrarCarrito():
  //     1. Quita la clase 'abierto' y pon aria-hidden a 'true'.
  //     2. Solo apaga la capa y devuelve el scroll si NO hay modal abierto:
  //          if (!hayModalAbierto()) { ...remove('visible'); ...remove('sin-scroll'); }
  //     3. Devuelve el foco: if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
  //   Y una consulta corta:
  //     function hayPanelAbierto() { return Boolean(el.panel?.classList.contains('abierto')); }
  //   (aprox. 28 líneas)

  // ==========================================================================
  // 5. MODAL DE CHECKOUT
  // ==========================================================================
  /**
   * pintarResumenPedido(): la lista de lo que se va a comprar, dentro del modal.
   */
  // TODO (en clase):
  //   1. function pintarResumenPedido(carrito) con salida temprana si !el.resumenPedido.
  //   2. const filas = carrito.lineas.map((linea) => `
  //        <li><span>${linea.cantidad} × ${escaparHTML(linea.producto.nombre)}</span>
  //            <span>${linea.subtotalFormateado}</span></li>`).join('');
  //   3. el.resumenPedido.innerHTML = `
  //        <h3>Resumen del pedido</h3>
  //        <ul>
  //          ${filas}
  //          <li><span>Subtotal</span><span>${formatearPrecio(carrito.subtotal)}</span></li>
  //          <li><span>IVA (${porcentaje(carrito.tasaIva)})</span><span>${formatearPrecio(carrito.iva)}</span></li>
  //          <li class="total-resumen"><span>Total a pagar</span><span>${formatearPrecio(carrito.total)}</span></li>
  //        </ul>`;
  //   (aprox. 20 líneas)

  // TODO (en clase) — abrirModal(), cerrarModal() y hayModalAbierto():
  //   abrirModal(): igual que abrirCarrito pero sobre el.modal, y al final
  //     document.getElementById('nombre')?.focus();
  //     Foco en el primer campo del formulario: quien usa teclado empieza a
  //     escribir directamente.
  //   cerrarModal(): quita 'abierto', pon aria-hidden 'true', y solo apaga la
  //     capa y el scroll si !hayPanelAbierto(). Devuelve el foco a ultimoFoco.
  //   hayModalAbierto(): Boolean(el.modal?.classList.contains('abierto'))
  //   (aprox. 26 líneas)

  /** Vuelve a mostrar el formulario (después de una compra o al reabrir). */
  // TODO (en clase):
  //   1. function mostrarVistaFormulario():
  //        ocultar(el.vistaFormulario, false);
  //        ocultar(el.vistaConfirmacion, true);
  //        if (el.tituloModal) el.tituloModal.textContent = 'Finalizar compra';
  //   (aprox. 5 líneas)

  /**
   * mostrarConfirmacion(): sustituye el formulario por el mensaje de éxito.
   * Recibe un objeto con los datos del pedido ya validados.
   */
  // TODO (en clase):
  //   1. Firma con destructuring en el propio parámetro:
  //        function mostrarConfirmacion({ numero, nombre, email, total, unidades, fecha })
  //   2. el.vistaConfirmacion.innerHTML con:
  //        <span class="icono-exito" aria-hidden="true">🎉</span>
  //        <h3>¡Pedido confirmado!</h3>
  //        <p>Gracias por tu compra, <strong>nombre</strong>.</p>
  //        <p>Número de pedido: <span class="numero-pedido">numero</span></p>
  //        <p>unidades artículo(s) · Total pagado: <strong>formatearPrecio(total)</strong></p>
  //        <p>Enviaremos la confirmación a <strong>email</strong>.</p>
  //        <p>Fecha estimada de entrega: <strong>fecha</strong>.</p>
  //        <button type="button" class="boton ancho" id="seguir-comprando">Seguir comprando</button>
  //      (nombre, numero, email y fecha pasan por escaparHTML)
  //   3. ocultar(el.vistaFormulario, true); ocultar(el.vistaConfirmacion, false);
  //      if (el.tituloModal) el.tituloModal.textContent = 'Pedido realizado';
  //   ⚠️ El id "seguir-comprando" se crea AQUÍ, en tiempo de ejecución. Por eso
  //   en 05-app.js su clic se atiende con delegación desde el modal.
  //   (aprox. 22 líneas)

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
  // TODO (en clase) — marcarCampoInvalido(nombreCampo, mensaje):
  //   1. const contenedor = document.querySelector(`.campo[data-campo="${nombreCampo}"]`);
  //      const error = document.getElementById(`error-${nombreCampo}`);
  //   2. contenedor?.classList.add('invalido');
  //      contenedor?.classList.remove('valido');
  //      if (error) error.textContent = mensaje;
  //   3. document.getElementById(nombreCampo)?.setAttribute('aria-invalid', 'true');
  //      aria-invalid avisa a los lectores de pantalla de que ese campo falla.
  //   (aprox. 10 líneas)

  // TODO (en clase) — marcarCampoValido(nombreCampo):
  //   El espejo del anterior: quita 'invalido', añade 'valido', vacía el
  //   mensaje de error y pone aria-invalid a 'false'.
  //   (aprox. 10 líneas)

  // TODO (en clase) — limpiarValidacion():
  //   Deja todos los campos en su estado neutro (ni verde ni rojo):
  //   1. document.querySelectorAll('.campo').forEach((campo) =>
  //        campo.classList.remove('invalido', 'valido'));
  //   2. document.querySelectorAll('.mensaje-error').forEach((error) =>
  //        error.textContent = '');
  //   (aprox. 8 líneas)

  // ==========================================================================
  // UTILIDAD INTERNA
  // ==========================================================================
  /**
   * ocultar(elemento, condicion): añade o quita la clase .oculto.
   * Se usa tanto que merece su propia función. Nótese que no usamos
   * elemento.style.display: las clases son más fáciles de mantener y de
   * depurar (se ven en el inspector).
   */
  // TODO (en clase):
  //   1. function ocultar(elemento, condicion) { ... }
  //   2. Salida temprana si (!elemento) return;
  //   3. elemento.classList.toggle('oculto', Boolean(condicion));
  //   ✅ Escríbela LA PRIMERA de todo el archivo aunque esté al final: la usan
  //   pintarEsqueletos, pintarCatalogo, pintarCarrito y las tres funciones de
  //   validación. Se puede colocar aquí porque las declaraciones `function` se
  //   elevan (hoisting).
  //   (aprox. 4 líneas)

  // ==========================================================================
  // 7. PUBLICACIÓN EN EL ESPACIO DE NOMBRES
  // ==========================================================================
  // TODO (en clase):
  //   Crea TIENDA.ui con estas 22 claves, en este orden (sintaxis abreviada):
  //     el, toast, pintarEsqueletos, pintarCatalogo, actualizarResumen,
  //     pintarFiltros, marcarFiltroActivo, pintarCarrito, actualizarContador,
  //     abrirCarrito, cerrarCarrito, hayPanelAbierto, pintarResumenPedido,
  //     abrirModal, cerrarModal, hayModalAbierto, mostrarVistaFormulario,
  //     mostrarConfirmacion, marcarCampoInvalido, marcarCampoValido,
  //     limpiarValidacion, ocultar
  //   La primera, `el`, se publica para que 05-app.js pueda escuchar eventos
  //   sin volver a buscar los elementos.
  //   ⚠️ Esta publicación NO puede estar escrita en la plantilla: si las
  //   funciones todavía no existen, el navegador lanzaría un ReferenceError
  //   nada más abrir la página.
  //   Comprobación en la consola del navegador:
  //     Object.keys(TIENDA.ui).length   ->   22
  //   (aprox. 24 líneas)

  // Mensaje de carga. En la solución lleva marca de tiempo con hora().
  imprimir('04-ui.js cargado (PLANTILLA). Las referencias al DOM y las funciones de pintado están por escribir.');
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
