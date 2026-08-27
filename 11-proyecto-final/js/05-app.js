/**
 * ============================================================================
 * ARCHIVO: js/05-app.js
 * PROYECTO: 11 · Proyecto final integrador: tienda con carrito (TechStore)
 * ----------------------------------------------------------------------------
 * TEMAS DEL CURSO QUE SE APLICAN AQUÍ
 *   · Proyecto 02 (Control de flujo) -> if/else, switch del ordenamiento,
 *                                       operador ternario, salidas tempranas.
 *   · Proyecto 04 (Arrays)           -> filter para buscar y filtrar,
 *                                       sort para ordenar (con copia previa),
 *                                       map y reduce en los cálculos.
 *   · Proyecto 07 (Eventos)          -> input, change, click, submit, keydown,
 *                                       focusout, preventDefault y sobre todo
 *                                       DELEGACIÓN DE EVENTOS.
 *   · Proyecto 07 (Formularios)      -> validación campo a campo con
 *                                       expresiones regulares y mensajes.
 *   · Proyecto 09 (Asincronía)       -> async/await, try/catch/finally.
 *   · Proyecto 08 (POO)              -> uso de las clases Producto y Carrito.
 *   · Proyecto 10 (JS moderno)       -> destructuring, spread, ?. y ??.
 *
 * QUÉ ES ESTE ARCHIVO
 * El DIRECTOR DE ORQUESTA. No define datos ni clases ni plantillas: conecta
 * las piezas. Guarda el estado de la interfaz, escucha los eventos, decide qué
 * hay que recalcular y pide a TIENDA.ui que lo dibuje.
 *
 * EL FLUJO COMPLETO DE LA APLICACIÓN, EN UNA FRASE
 *   evento del usuario -> se actualiza el ESTADO -> se vuelve a RENDERIZAR.
 * Nunca se modifica el DOM "a mano" desde un listener. Siempre se cambia el
 * estado y se repinta a partir de él. Así solo existe una versión de la verdad.
 *
 * ÍNDICE DEL ARCHIVO
 *   1. Estado de la aplicación.
 *   2. Arranque: la carga asíncrona del catálogo.
 *   3. Filtrado, búsqueda y ordenamiento.
 *   4. Renderizado central.
 *   5. Persistencia del carrito en localStorage.
 *   6. Eventos del catálogo (buscador, filtros, orden, botón agregar).
 *   7. Eventos del panel del carrito (delegación).
 *   8. Eventos globales (teclado, capa oscura).
 *   9. Checkout: validación del formulario y confirmación del pedido.
 *   10. Botones del laboratorio de clase.
 *   11. Arranque final.
 *   12. Ejercicios propuestos.
 * ============================================================================
 */

window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';

  const { imprimir, titulo, hora, normalizarTexto, limpiarConsola,
          generarNumeroPedido, fechaLegible, formatearPrecio, esperar } = TIENDA.utiles;
  const { CATALOGO, IVA, CLAVE_ALMACEN, obtenerCategorias, cargarCatalogo } = TIENDA.datos;
  const { Producto, Carrito, Almacen } = TIENDA;
  const ui = TIENDA.ui;
  const el = ui.el;

  // ==========================================================================
  // 1. ESTADO DE LA APLICACIÓN
  // ==========================================================================
  /*
    Todo lo que puede cambiar mientras la página está abierta vive en UN objeto.

    Ventajas de centralizar el estado:
      - Para saber qué está pasando basta mirar un sitio (pruébalo en la
        consola del navegador: TIENDA.app.estado).
      - Cualquier función puede leerlo sin depender del DOM.
      - Depurar es infinitamente más fácil.

    ⚠️ ERROR COMÚN del principiante: usar el DOM como almacén de datos, por
    ejemplo leer el texto de un <span> para saber la cantidad. El DOM es la
    FOTO del estado, nunca el estado.
  */
  const estado = {
    productos: [],          // Array de instancias de Producto (llega del "servidor")
    categoria: 'todas',     // Filtro activo
    busqueda: '',           // Texto del buscador
    orden: 'destacados',    // Criterio de ordenamiento
    cargando: true          // ¿Todavía estamos esperando la promesa?
  };

  // El carrito se crea vacío desde el principio para que ningún listener
  // se encuentre con `undefined` si el usuario pulsa algo mientras carga.
  let carrito = new Carrito(IVA);

  // ==========================================================================
  // 2. ARRANQUE: LA CARGA ASÍNCRONA DEL CATÁLOGO
  // ==========================================================================
  /**
   * cargar(): pide el catálogo y prepara la aplicación.
   *
   * `async` convierte la función en asíncrona: siempre devuelve una promesa y
   * dentro se puede usar `await`, que PAUSA esta función (no el navegador)
   * hasta que la promesa se resuelva.
   *
   * La estructura try / catch / finally del proyecto 09:
   *   try     -> lo que puede fallar.
   *   catch   -> qué hacer si falla (¡nunca dejarlo vacío!).
   *   finally -> lo que hay que hacer pase lo que pase (apagar el "cargando").
   */
  async function cargar({ fallar = false } = {}) {
    estado.cargando = true;
    ui.pintarEsqueletos(8);          // Feedback inmediato: algo está pasando

    try {
      // AQUÍ SE ESPERA. Mientras tanto la página sigue viva: se puede hacer
      // scroll, abrir el panel, escribir en el buscador... Eso es asincronía.
      const listaPlana = await cargarCatalogo({ fallar });

      // Los objetos planos se convierten en instancias con comportamiento.
      estado.productos = Producto.desdeLista(listaPlana);
      imprimir(`[${hora()}] Catálogo recibido: ${estado.productos.length} productos.`);

      // Los filtros se generan a partir de los datos, nunca a mano.
      ui.pintarFiltros(obtenerCategorias(), estado.categoria);

      // Se recupera el carrito guardado en la visita anterior.
      restaurarCarrito();

      ui.toast('Catálogo cargado', 'exito');
    } catch (error) {
      // ⚠️ ERROR COMÚN: escribir un catch vacío. El error desaparece y nadie
      // se entera de nada; después se pierden horas buscando el problema.
      imprimir(`[${hora()}] ERROR al cargar: ${error.message}`);
      estado.productos = [];
      if (el.rejilla) el.rejilla.innerHTML = '';
      ui.actualizarResumen(0, 0);
      ui.toast(error.message, 'error', 4000);
    } finally {
      estado.cargando = false;
      renderizar();
    }
  }

  /**
   * restaurarCarrito(): lee localStorage y reconstruye el carrito.
   * Usa el método estático Carrito.desdeDatos(), que además comprueba que los
   * productos guardados sigan existiendo y que la cantidad quepa en el stock.
   */
  function restaurarCarrito() {
    const guardado = Almacen.leer(CLAVE_ALMACEN, null);

    carrito = Carrito.desdeDatos(guardado, estado.productos, IVA);
    conectarCarrito();

    if (!carrito.estaVacio) {
      imprimir(`[${hora()}] Carrito recuperado de localStorage:\n${carrito.resumenTexto()}`);
      ui.toast('Recuperamos tu carrito anterior', 'info');
    }
  }

  /**
   * conectarCarrito(): registra QUÉ debe ocurrir cada vez que el carrito
   * cambie. Aquí se ve el patrón observador del proyecto 03 en acción:
   * el carrito no llama a estas funciones por su nombre, solo avisa.
   */
  function conectarCarrito() {
    carrito.suscribir((instancia, motivo) => {
      guardarCarrito(instancia);       // 1. Persistir
      renderizar();                    // 2. Repintar
      imprimir(`[${hora()}] Carrito actualizado (${motivo}). ${instancia.cantidadTotal} artículo(s), total ${formatearPrecio(instancia.total)}.`);
    });
  }

  // ==========================================================================
  // 3. FILTRADO, BÚSQUEDA Y ORDENAMIENTO
  // ==========================================================================
  /**
   * productosVisibles(): aplica, en este orden, el filtro de categoría, la
   * búsqueda y el ordenamiento.
   *
   * Los tres pasos son ENCADENABLES porque filter y sort devuelven arrays.
   * Nótese que en ningún momento se toca estado.productos: siempre se trabaja
   * sobre copias. El array original se queda intacto.
   */
  function productosVisibles() {
    // ---- PASO 1: FILTRO POR CATEGORÍA -------------------------------------
    // filter recorre el array y se queda con los elementos cuya función
    // devuelva true. Devuelve SIEMPRE un array nuevo.
    let lista = estado.categoria === 'todas'
      ? [...estado.productos]                    // Copia con spread
      : estado.productos.filter((p) => p.categoria === estado.categoria);

    // ---- PASO 2: BÚSQUEDA EN VIVO -----------------------------------------
    const termino = normalizarTexto(estado.busqueda);

    if (termino !== '') {
      lista = lista.filter((producto) => {
        // Buscamos en el nombre, en la descripción y en la categoría.
        // normalizarTexto quita tildes y mayúsculas de los dos lados, así
        // "raton" encuentra "Ratón inalámbrico".
        const texto = normalizarTexto(
          `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
        );
        return texto.includes(termino);
      });
    }

    // ---- PASO 3: ORDENAMIENTO ---------------------------------------------
    /*
      ⚠️ ERROR COMÚN GRAVE: sort() MODIFICA el array sobre el que se llama.
      Como `lista` ya es una copia (filter devolvió un array nuevo, o hicimos
      spread), aquí es seguro. Si ordenáramos estado.productos directamente,
      estaríamos cambiando el orden original para siempre.

      Cómo funciona el comparador:
        devuelve un número NEGATIVO -> a va antes que b
        devuelve un número POSITIVO -> b va antes que a
        devuelve 0                  -> da igual el orden
      Por eso "a.precio - b.precio" ordena de menor a mayor.
    */
    switch (estado.orden) {
      case 'precio-asc':
        lista.sort((a, b) => a.precio - b.precio);
        break;

      case 'precio-desc':
        lista.sort((a, b) => b.precio - a.precio);
        break;

      case 'valoracion':
        // De mejor a peor valorado; en caso de empate, el más barato primero.
        lista.sort((a, b) => b.valoracion - a.valoracion || a.precio - b.precio);
        break;

      case 'nombre':
        // localeCompare compara textos respetando el alfabeto del idioma
        // (tildes, ñ). ⚠️ ERROR COMÚN: usar a.nombre > b.nombre, que compara
        // por código de carácter y coloca la Ñ detrás de la Z.
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre, TIENDA.utiles.IDIOMA));
        break;

      case 'destacados':
      default:
        // Se respeta el orden en que llegó del servidor: no se toca nada.
        break;
    }

    return lista;
  }

  // ==========================================================================
  // 4. RENDERIZADO CENTRAL
  // ==========================================================================
  /**
   * renderizar(): la única función que dibuja. Se llama después de CUALQUIER
   * cambio de estado. Es corta a propósito: solo reparte trabajo.
   */
  function renderizar() {
    if (estado.cargando) return;      // Mientras carga mandan los esqueletos

    const visibles = productosVisibles();

    ui.pintarCatalogo(visibles, carrito);
    ui.actualizarResumen(visibles.length, estado.productos.length, estado.categoria, estado.busqueda);
    ui.pintarCarrito(carrito);
  }

  // ==========================================================================
  // 5. PERSISTENCIA EN localStorage
  // ==========================================================================
  /**
   * guardarCarrito(): convierte el carrito a texto y lo guarda.
   * El método toJSON() de la clase decide qué se guarda (solo ids y
   * cantidades), así que aquí no hay que pensar nada.
   */
  function guardarCarrito(instancia) {
    const guardado = Almacen.guardar(CLAVE_ALMACEN, instancia);

    if (!guardado) {
      // Puede pasar con file:// en algunos navegadores o en modo incógnito.
      ui.toast('No se pudo guardar el carrito en este navegador', 'alerta');
    }
  }

  // ==========================================================================
  // 6. EVENTOS DEL CATÁLOGO
  // ==========================================================================
  /*
    A partir de aquí, todo son listeners. Fíjate en que ninguno modifica el DOM
    directamente: cambian el estado y llaman a renderizar().
  */

  // ---- BUSCADOR EN VIVO ----------------------------------------------------
  /*
    El evento `input` se dispara con CADA cambio del campo: cada tecla, cada
    pegado, cada borrado. Es el evento correcto para un buscador en vivo.

    ⚠️ ERROR COMÚN: usar `change`, que en un input de texto solo se dispara
    cuando el campo pierde el foco. La búsqueda parecería que no funciona.
  */
  el.buscador?.addEventListener('input', (evento) => {
    estado.busqueda = evento.target.value;
    renderizar();
  });

  // ---- SELECT DE ORDEN -----------------------------------------------------
  // En un <select> sí es `change`: se dispara al elegir una opción distinta.
  el.orden?.addEventListener('change', (evento) => {
    estado.orden = evento.target.value;
    imprimir(`[${hora()}] Orden cambiado a: ${estado.orden}`);
    renderizar();
  });

  // ---- FILTROS POR CATEGORÍA (DELEGACIÓN) ----------------------------------
  /*
    DELEGACIÓN DE EVENTOS (proyecto 07), el concepto más importante del archivo.

    Los botones de categoría los crea el JavaScript, y se vuelven a crear cada
    vez que se repintan. Si les pusiéramos un listener a cada uno, habría que
    volver a ponerlos después de cada repintado (y los antiguos se quedarían
    en memoria).

    En lugar de eso ponemos UN listener en el contenedor, que no se destruye
    nunca. Cuando se pulsa un botón, el evento "burbujea" hacia arriba hasta el
    contenedor, y allí preguntamos con closest() quién fue el culpable.
  */
  el.filtros?.addEventListener('click', (evento) => {
    // closest() sube desde el elemento pulsado buscando un ancestro que
    // cumpla el selector. Devuelve null si no encuentra ninguno.
    const chip = evento.target.closest('.chip');
    if (!chip) return;                     // Se hizo clic en el hueco: no hacemos nada

    estado.categoria = chip.dataset.categoria;   // data-categoria -> dataset.categoria
    ui.marcarFiltroActivo(estado.categoria);
    imprimir(`[${hora()}] Filtro de categoría: ${estado.categoria}`);
    renderizar();
  });

  // ---- BOTÓN "AGREGAR" DE CADA TARJETA (DELEGACIÓN) ------------------------
  el.rejilla?.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion="agregar"]');
    if (!boton) return;

    const producto = estado.productos.find((p) => p.id === boton.dataset.id);
    if (!producto) return;

    // El carrito decide si se puede o no, y devuelve el resultado.
    // La interfaz solo lo muestra. Cada uno en su sitio.
    const resultado = carrito.agregar(producto, 1);
    ui.toast(resultado.mensaje, resultado.tipo);
  });

  // ==========================================================================
  // 7. EVENTOS DEL PANEL DEL CARRITO
  // ==========================================================================
  el.abrirCarrito?.addEventListener('click', ui.abrirCarrito);
  el.cerrarCarrito?.addEventListener('click', ui.cerrarCarrito);

  /*
    UN SOLO listener para los tres botones de TODAS las líneas del carrito:
    sumar, restar y quitar. La acción se lee del atributo data-accion.

    Este es el ejemplo perfecto de por qué la delegación es imprescindible:
    las líneas se destruyen y se vuelven a crear enteras en cada cambio.
  */
  el.lineas?.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion]');
    if (!boton) return;

    const { accion, id } = boton.dataset;      // Destructuring del dataset
    const linea = carrito.buscarLinea(id);
    if (!linea) return;

    let resultado;

    switch (accion) {
      case 'sumar':
        resultado = carrito.cambiarCantidad(id, linea.cantidad + 1);
        break;

      case 'restar':
        // Si baja a 0, cambiarCantidad se encarga de eliminar la línea.
        resultado = carrito.cambiarCantidad(id, linea.cantidad - 1);
        break;

      case 'quitar':
        resultado = carrito.quitar(id);
        break;

      default:
        return;
    }

    // Solo avisamos cuando algo NO se pudo hacer o cuando se quitó algo:
    // un toast por cada "+" sería agotador.
    if (!resultado.ok || accion === 'quitar') {
      ui.toast(resultado.mensaje, resultado.tipo);
    }
  });

  el.vaciar?.addEventListener('click', () => {
    const resultado = carrito.vaciar();
    ui.toast(resultado.mensaje, resultado.tipo);
  });

  // ==========================================================================
  // 8. EVENTOS GLOBALES
  // ==========================================================================
  /*
    La capa oscura cierra lo que esté abierto. Nótese el orden: si hay un modal
    abierto se cierra el modal, no el panel que hay debajo.
  */
  el.capa?.addEventListener('click', () => {
    if (ui.hayModalAbierto()) {
      ui.cerrarModal();
    } else if (ui.hayPanelAbierto()) {
      ui.cerrarCarrito();
    }
  });

  /*
    Tecla Escape: cerrar. Es una convención universal en la web y cuesta
    cuatro líneas. El listener va en `document` porque la tecla puede pulsarse
    con el foco en cualquier sitio.
  */
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;

    if (ui.hayModalAbierto()) ui.cerrarModal();
    else if (ui.hayPanelAbierto()) ui.cerrarCarrito();
  });

  // ==========================================================================
  // 9. CHECKOUT: VALIDACIÓN Y CONFIRMACIÓN
  // ==========================================================================
  /*
    EXPRESIONES REGULARES (regex)
    Una regex es un patrón para comprobar si un texto tiene cierta forma.
    Se escriben entre barras: /patron/. Las piezas que usamos aquí:

      ^      principio del texto        $      final del texto
      \d     un dígito (0-9)            \s     un espacio en blanco
      +      una o más veces            *      cero o más veces
      ?      cero o una vez             {2,4}  entre 2 y 4 veces
      [abc]  uno de estos caracteres    [^abc] cualquiera MENOS estos
      (...)  grupo                      |      o

    ⚠️ ERROR COMÚN: buscar en internet la "regex definitiva del email".
    No existe. La regla oficial ocupa páginas enteras y ni así garantiza que
    el correo exista. Se usa una regex razonable y la confirmación real se
    hace enviando un email.
  */

  // Letras (con tildes y ñ), separadas por espacios, guiones o apóstrofos.
  // El rango \u00C0-\u024F cubre las vocales acentuadas, la ñ y el resto de
  // caracteres latinos. Se escribe con escapes para que el patrón siga siendo
  // correcto aunque el archivo se guarde con otra codificación.
  const RE_NOMBRE = /^[a-zA-Z\u00C0-\u024F]+(?:[ '-][a-zA-Z\u00C0-\u024F]+)*$/;

  // algo + @ + algo + . + extensión de 2 letras o más, sin espacios.
  const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  // Un + opcional y entre 7 y 15 dígitos (ya sin espacios ni guiones).
  const RE_TELEFONO = /^\+?\d{7,15}$/;

  /*
    UN VALIDADOR POR CAMPO.

    Cada función recibe el valor y devuelve:
      null    -> el campo es válido.
      string  -> el mensaje de error que hay que mostrar.

    Devolver null en vez de true tiene una ventaja enorme: el mensaje viaja
    junto con la decisión, así que quien llama no tiene que saber por qué
    falló para poder explicarlo.
  */
  const validadores = {
    nombre(valor) {
      const texto = valor.trim();
      if (texto === '') return 'El nombre es obligatorio.';
      if (texto.length < 3) return 'Debe tener al menos 3 caracteres.';
      if (texto.length > 60) return 'Ese nombre es demasiado largo.';
      if (!RE_NOMBRE.test(texto)) return 'Solo se admiten letras y espacios.';
      return null;
    },

    email(valor) {
      const texto = valor.trim();
      if (texto === '') return 'El correo es obligatorio.';
      if (!RE_EMAIL.test(texto)) return 'Formato no válido. Ejemplo: ana@correo.com';
      return null;
    },

    telefono(valor) {
      // Primero LIMPIAMOS: quitamos espacios, guiones y paréntesis, que la
      // gente escribe de mil maneras distintas. Después validamos lo que queda.
      const limpio = valor.replace(/[\s()-]/g, '');
      if (limpio === '') return 'El teléfono es obligatorio.';
      if (!RE_TELEFONO.test(limpio)) return 'Escribe entre 7 y 15 dígitos.';
      return null;
    },

    direccion(valor) {
      const texto = valor.trim();
      if (texto === '') return 'La dirección es obligatoria.';
      if (texto.length < 8) return 'Indica calle y número.';
      // /\d/ busca "algún dígito en cualquier posición": la altura de la calle.
      if (!/\d/.test(texto)) return 'Falta el número de la dirección.';
      return null;
    },

    // Campo opcional: solo se valida si el usuario escribió algo.
    ciudad(valor) {
      const texto = valor.trim();
      if (texto === '') return null;
      if (texto.length < 3) return 'Nombre de ciudad demasiado corto.';
      return null;
    }
  };

  /** Valida un campo suelto y pinta el resultado. Devuelve true si es válido. */
  function validarCampo(nombreCampo) {
    const input = document.getElementById(nombreCampo);
    const validar = validadores[nombreCampo];
    if (!input || !validar) return true;

    const error = validar(input.value);

    if (error) {
      ui.marcarCampoInvalido(nombreCampo, error);
      return false;
    }

    ui.marcarCampoValido(nombreCampo);
    return true;
  }

  /**
   * validarFormulario(): valida TODOS los campos y devuelve un informe.
   *
   * Object.keys(validadores) da la lista de campos, así que añadir un campo
   * nuevo consiste en añadir un validador y su HTML. Nada más.
   * Se usa reduce para acumular los campos que fallaron.
   */
  function validarFormulario() {
    const campos = Object.keys(validadores);

    const invalidos = campos.reduce((fallidos, campo) => {
      const esValido = validarCampo(campo);
      return esValido ? fallidos : [...fallidos, campo];
    }, []);

    return { valido: invalidos.length === 0, invalidos };
  }

  // ---- ABRIR EL CHECKOUT ---------------------------------------------------
  el.irCheckout?.addEventListener('click', () => {
    if (carrito.estaVacio) {
      ui.toast('Agrega algún producto antes de comprar', 'alerta');
      return;
    }

    ui.mostrarVistaFormulario();
    ui.limpiarValidacion();
    ui.pintarResumenPedido(carrito);
    ui.abrirModal();
    titulo('checkout abierto');
    imprimir(carrito.resumenTexto());
  });

  el.cerrarModal?.addEventListener('click', ui.cerrarModal);

  // ---- VALIDACIÓN MIENTRAS SE ESCRIBE --------------------------------------
  /*
    Dos momentos distintos, y la diferencia importa para la experiencia:

    focusout (al salir del campo) -> se VALIDA. Es el momento correcto:
        marcar en rojo un email mientras alguien lo está escribiendo es
        molesto, porque durante media palabra siempre está mal.

    input (mientras se escribe)   -> solo se LIMPIA el error si el campo ya
        pasó a ser válido, para que el rojo desaparezca en cuanto se corrige.

    Los dos listeners van en el <form> aprovechando la delegación: un solo
    listener sirve para los cinco campos.
  */
  el.formulario?.addEventListener('focusout', (evento) => {
    // El atributo name del input coincide a propósito con su id y con la
    // clave del validador: un solo nombre para las tres cosas.
    const campo = evento.target.name;
    if (campo && validadores[campo]) validarCampo(campo);
  });

  el.formulario?.addEventListener('input', (evento) => {
    const campo = evento.target.name;
    if (!campo || !validadores[campo]) return;

    // Solo re-evaluamos si ya estaba marcado en rojo.
    const contenedor = evento.target.closest('.campo');
    if (contenedor?.classList.contains('invalido')) validarCampo(campo);
  });

  // ---- ENVÍO DEL FORMULARIO ------------------------------------------------
  el.formulario?.addEventListener('submit', async (evento) => {
    /*
      preventDefault() es OBLIGATORIO aquí.
      Por defecto, enviar un formulario recarga la página y manda los datos a
      un servidor. Como no hay servidor, la página se recargaría y se perdería
      todo. ⚠️ ERROR COMÚN número uno con formularios en JavaScript.
    */
    evento.preventDefault();

    const { valido, invalidos } = validarFormulario();

    if (!valido) {
      ui.toast(`Revisa ${invalidos.length} campo(s) del formulario`, 'error');
      // Llevamos el foco al primer campo con error: cortesía básica.
      document.getElementById(invalidos[0])?.focus();
      imprimir(`[${hora()}] Formulario rechazado. Campos con error: ${invalidos.join(', ')}`);
      return;
    }

    if (carrito.estaVacio) {
      ui.toast('El carrito está vacío', 'alerta');
      return;
    }

    // ---- Simulamos el envío al servidor con otra promesa ----
    const boton = document.getElementById('confirmar-pedido');
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Procesando pedido...';

    await esperar(900);       // Aquí iría el fetch() real con method: 'POST'

    // FormData lee de golpe todos los campos del formulario que tengan `name`.
    // Object.fromEntries lo convierte en un objeto normal. Dos líneas en vez
    // de cinco getElementById.
    const datos = Object.fromEntries(new FormData(el.formulario).entries());

    const pedido = {
      numero: generarNumeroPedido(),
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      unidades: carrito.cantidadTotal,
      total: carrito.total,
      fecha: fechaLegible(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))  // +3 días
    };

    titulo(`pedido ${pedido.numero} confirmado`);
    imprimir(carrito.resumenTexto());
    imprimir(`Total cobrado: ${formatearPrecio(pedido.total)}`);
    imprimir(`Enviar a: ${datos.direccion.trim()}${datos.ciudad ? ' · ' + datos.ciudad.trim() : ''}`);

    ui.mostrarConfirmacion(pedido);
    ui.toast('¡Pedido confirmado!', 'exito', 4000);

    // El carrito se vacía DESPUÉS de leer los datos del pedido.
    // ⚠️ ERROR COMÚN: vaciarlo antes y descubrir que el resumen sale en cero.
    carrito.vaciar();
    el.formulario.reset();
    ui.limpiarValidacion();

    boton.disabled = false;
    boton.textContent = textoOriginal;
  });

  // ---- BOTÓN "SEGUIR COMPRANDO" (creado dinámicamente) ---------------------
  // Se crea después de confirmar el pedido, así que no existía cuando se
  // registraron los listeners. Otra vez: delegación desde el modal.
  el.modal?.addEventListener('click', (evento) => {
    if (!evento.target.closest('#seguir-comprando')) return;
    ui.cerrarModal();
    ui.mostrarVistaFormulario();
    ui.cerrarCarrito();
  });

  // ==========================================================================
  // 10. BOTONES DEL LABORATORIO DE CLASE
  // ==========================================================================
  /*
    Nada de esto forma parte de la tienda. Son ayudas para explicar el proyecto
    en vivo. Ninguno se ejecuta solo: todos esperan un clic del docente.
  */
  document.getElementById('limpiar-consola')?.addEventListener('click', limpiarConsola);

  document.getElementById('btn-recargar')?.addEventListener('click', () => {
    titulo('recarga del catálogo');
    imprimir('Se vuelve a llamar a la promesa. Observa los esqueletos de carga.');
    cargar();
  });

  document.getElementById('btn-fallar')?.addEventListener('click', () => {
    titulo('simulación de error de red');
    imprimir('La promesa se va a RECHAZAR. El catch mostrará el mensaje.');
    cargar({ fallar: true });
  });

  document.getElementById('btn-estado')?.addEventListener('click', () => {
    titulo('estado interno de la aplicación');
    imprimir('Filtro de categoría:', estado.categoria);
    imprimir('Texto de búsqueda:', estado.busqueda || '(vacío)');
    imprimir('Criterio de orden:', estado.orden);
    imprimir('Productos cargados:', estado.productos.length);
    imprimir('Productos visibles ahora:', productosVisibles().length);
    imprimir('--- Carrito ---');
    imprimir(carrito.resumenTexto());
    imprimir('Unidades:', carrito.cantidadTotal);
    imprimir('Subtotal:', formatearPrecio(carrito.subtotal));
    imprimir('IVA:', formatearPrecio(carrito.iva));
    imprimir('Total:', formatearPrecio(carrito.total));
    imprimir('--- Lo que se guarda en localStorage ---');
    imprimir(carrito.toJSON());
  });

  document.getElementById('btn-llenar-formulario')?.addEventListener('click', () => {
    // Rellenar campos por código es exactamente lo mismo que hacerlo a mano:
    // se asigna la propiedad .value de cada input.
    const ejemplo = {
      nombre: 'Ana Martínez',
      email: 'ana.martinez@correo.com',
      telefono: '+34 600 123 456',
      ciudad: 'Valencia',
      direccion: 'Avenida Central 1234, piso 3, puerta B'
    };

    Object.entries(ejemplo).forEach(([campo, valor]) => {
      const input = document.getElementById(campo);
      if (input) input.value = valor;
    });

    ui.limpiarValidacion();
    ui.toast('Formulario rellenado con datos válidos', 'info');
    imprimir(`[${hora()}] Formulario rellenado. Ahora prueba a estropear un campo y enviar.`);
  });

  document.getElementById('btn-borrar-almacen')?.addEventListener('click', () => {
    Almacen.borrar(CLAVE_ALMACEN);
    carrito.vaciar();
    ui.toast('Carrito guardado borrado', 'alerta');
    imprimir(`[${hora()}] Clave "${CLAVE_ALMACEN}" eliminada de localStorage.`);
  });

  // ==========================================================================
  // 11. ARRANQUE
  // ==========================================================================
  /*
    Exponemos el estado y el carrito para poder inspeccionarlos en vivo desde
    la consola del navegador durante la clase:

        TIENDA.app.estado
        TIENDA.app.carrito().total
        TIENDA.app.carrito().agregar(TIENDA.app.estado.productos[0], 2)

    `carrito` se expone como FUNCIÓN porque la variable se reasigna al
    restaurar el carrito guardado; si expusiéramos el objeto directamente,
    quedaría apuntando al carrito viejo.
  */
  TIENDA.app = {
    estado,
    carrito: () => carrito,
    renderizar,
    productosVisibles,
    validarFormulario,
    cargar
  };

  titulo('techstore: arranque de la aplicación');
  imprimir(`[${hora()}] 05-app.js cargado. Catálogo original: ${CATALOGO.length} productos.`);
  imprimir('Pulsa F12 para ver estos mismos mensajes en la consola del navegador.');

  // Y aquí empieza todo.
  cargar();
})(window.TIENDA);


/**
 * ============================================================================
 * EJERCICIOS PROPUESTOS (archivo 05-app.js)
 * ----------------------------------------------------------------------------
 * 1. FÁCIL. Añade al <select> una opción "Nombre (Z-A)" y su caso en el
 *    switch. Pista: invierte el orden de a y b en localeCompare.
 *
 * 2. FÁCIL. Haz que la tecla "/" ponga el foco en el buscador, como en muchas
 *    aplicaciones web. Cuidado con no escribir la barra dentro del campo.
 *
 * 3. MEDIO. Guarda también en localStorage el filtro y el orden elegidos, de
 *    forma que al recargar la página la tienda quede como el usuario la dejó.
 *
 * 4. MEDIO. Añade un botón "Limpiar filtros" que aparezca solo cuando haya
 *    una búsqueda o una categoría activa, y que deje el estado en su valor
 *    inicial (recuerda vaciar también el input del buscador).
 *
 * 5. MEDIO. Muestra el número de resultados dentro de cada botón de categoría,
 *    por ejemplo "Audio (3)". Calcúlalo con filter o con reduce.
 *
 * 6. DIFÍCIL. Aplica un debounce de 250 ms al buscador para no filtrar en cada
 *    tecla. Mide con console.time cuántas veces se ejecuta el filtrado antes
 *    y después.
 *
 * 7. DIFÍCIL. Cuando se confirma un pedido, descuenta las unidades compradas
 *    del stock de los productos y comprueba que las tarjetas se actualizan.
 *    ¿Qué método harías falta añadir a la clase Producto?
 *
 * 8. DIFÍCIL. Añade una vista "Mis pedidos": guarda cada pedido confirmado en
 *    localStorage con su número, fecha y líneas, y píntalos en una tabla nueva
 *    debajo del catálogo.
 * ============================================================================
 */
