/**
 * ============================================================================
 * ARCHIVO: js/06-proyecto-todo.js
 * TEMA:    PROYECTO PRÁCTICO · Lista de tareas (To-Do) con persistencia
 * ----------------------------------------------------------------------------
 * Este archivo junta TODO lo aprendido en los cinco anteriores:
 *   - Formulario con submit + preventDefault y validación propia.
 *   - Delegación de eventos con closest() para marcar, editar y eliminar.
 *   - Eventos change (checkbox), dblclick (editar) y keydown (Enter / Escape).
 *   - Filtros con data-atributos y estado activo.
 *   - Persistencia completa en localStorage con JSON.stringify / JSON.parse.
 *
 * ARQUITECTURA (importantísima, y la misma que usan React, Vue o Angular):
 *
 *        ESTADO  ->  PINTAR  ->  EVENTO DEL USUARIO  ->  CAMBIAR ESTADO  ->  ...
 *
 *   1) Hay UNA ÚNICA fuente de verdad: el array "tareas".
 *   2) La función render() dibuja la pantalla a partir de ese array.
 *   3) Los manejadores NUNCA tocan el HTML a mano: modifican el array,
 *      guardan y vuelven a llamar a render().
 *
 *   ⚠️ ERROR COMÚN de principiante: ir tocando el DOM en cada manejador
 *   (añadir un <li> aquí, tachar un texto allá). Al principio funciona, pero
 *   en cuanto hay filtros y contadores la pantalla y los datos dejan de
 *   coincidir y aparecen fallos imposibles de encontrar.
 * ============================================================================
 */

// IIFE: todo el proyecto vive dentro de su propia caja.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================

  const ID_SALIDA = 'salida-06';

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

  document.getElementById('limpiar-06').addEventListener('click', function () {
    document.getElementById(ID_SALIDA).textContent = '';
  });

  // ==========================================================================
  // 1. REFERENCIAS AL DOM
  // ==========================================================================

  /*
    Se buscan UNA sola vez, al principio, y se guardan en constantes.
    Buscar el mismo elemento dentro de un manejador que se ejecuta cien veces
    es trabajo desperdiciado.
    ✅ BUENA PRÁCTICA: agrupar aquí todas las referencias hace que se vea de un
    vistazo con qué partes de la página trabaja el archivo.
  */
  const formTarea = document.getElementById('form-tarea');
  const inputTarea = document.getElementById('input-tarea');
  const errorTarea = document.getElementById('error-tarea');
  const listaTareas = document.getElementById('lista-tareas');
  const estadoVacio = document.getElementById('estado-vacio');
  const contenedorFiltros = document.getElementById('filtros');
  const contadorPendientes = document.getElementById('contador-pendientes');
  const btnBorrarCompletadas = document.getElementById('btn-borrar-completadas');

  // ==========================================================================
  // 2. EL ESTADO
  // ==========================================================================

  /*
    Claves de localStorage con prefijo del proyecto para no chocar con otras
    aplicaciones del mismo dominio.
  */
  const CLAVE_TAREAS = 'fs2-07-tareas';
  const CLAVE_FILTRO = 'fs2-07-filtro';

  /*
    Cada tarea es un objeto con esta forma:
      {
        id: 't-lqz3k1-0',      identificador único (texto)
        texto: 'Repasar el DOM',
        completada: false,
        creadaEn: '2026-02-14T10:00:00.000Z'
      }

    ⚠️ El id se guarda como TEXTO a propósito: los atributos data-* del HTML
    siempre devuelven texto. Si el id fuera un número tendríamos que convertir
    en cada comparación, y es una fuente clásica de errores
    ("3" === 3 es false).
  */
  let tareas = [];          // la fuente de verdad
  let filtroActivo = 'todas'; // 'todas' | 'pendientes' | 'completadas'
  let contadorIds = 0;      // para que dos tareas creadas en el mismo milisegundo no choquen

  /** Genera un identificador único y legible. */
  function crearId() {
    contadorIds = contadorIds + 1;
    // toString(36) convierte el número a base 36 (dígitos + letras): más corto.
    return 't-' + Date.now().toString(36) + '-' + contadorIds;
  }

  // ==========================================================================
  // 3. PERSISTENCIA EN localStorage
  // ==========================================================================

  /*
    Recordatorio del archivo 05: localStorage solo guarda TEXTO.
    Un array de objetos hay que serializarlo con JSON.stringify al guardar y
    reconstruirlo con JSON.parse al leer.
  */

  /** Guarda el array completo de tareas y el filtro elegido. */
  function guardarEnDisco() {
    try {
      localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
      localStorage.setItem(CLAVE_FILTRO, filtroActivo);
    } catch (error) {
      // Modo incógnito o almacenamiento lleno: avisamos, pero la aplicación
      // sigue funcionando en memoria.
      imprimir('No se ha podido guardar en localStorage: ' + error.name);
    }
  }

  /** Lee las tareas guardadas. Devuelve siempre un array (vacío si no hay). */
  function cargarDeDisco() {
    try {
      const texto = leerClave(CLAVE_TAREAS);
      if (texto === null) return [];

      const datos = JSON.parse(texto);

      // ✅ BUENA PRÁCTICA: no te fíes de lo que hay guardado. Puede venir de
      // una versión anterior de tu aplicación o estar manipulado a mano.
      if (!Array.isArray(datos)) return [];

      // Nos quedamos solo con los elementos que tengan la forma esperada.
      return datos.filter(function (t) {
        return t && typeof t.id === 'string' && typeof t.texto === 'string';
      });
    } catch (error) {
      imprimir('Datos de tareas corruptos, se empieza de cero: ' + error.message);
      localStorage.removeItem(CLAVE_TAREAS);
      return [];
    }
  }

  /**
   * Lectura protegida de una clave suelta.
   * ⚠️ Algunos navegadores (Safari, o el modo privado de otros) BLOQUEAN el
   * almacenamiento cuando la página se abre con doble clic (protocolo file://)
   * y lanzan un error solo con leer. Si no lo capturamos, la aplicación entera
   * se queda sin arrancar. Con este envoltorio, como mucho perdemos la
   * persistencia, pero la lista de tareas sigue funcionando.
   */
  function leerClave(clave) {
    try {
      return localStorage.getItem(clave);
    } catch (error) {
      return null;
    }
  }

  // ==========================================================================
  // 4. VALIDACIÓN DEL TEXTO DE UNA TAREA
  // ==========================================================================

  const MINIMO = 3;
  const MAXIMO = 80;

  /**
   * Devuelve un mensaje de error, o cadena vacía si el texto es válido.
   * @param {string} texto      lo que ha escrito el usuario (ya recortado)
   * @param {string} idIgnorar  id de la tarea que se está editando (para que
   *                            no se considere duplicada de sí misma)
   */
  function validarTexto(texto, idIgnorar) {
    if (texto === '') return 'Escribe algo antes de añadir la tarea.';
    if (texto.length < MINIMO) return 'La tarea debe tener al menos ' + MINIMO + ' caracteres.';
    if (texto.length > MAXIMO) return 'Máximo ' + MAXIMO + ' caracteres.';

    // some() devuelve true si ALGÚN elemento cumple la condición.
    // toLowerCase() en ambos lados: "Comprar pan" y "comprar pan" son la misma.
    const duplicada = tareas.some(function (t) {
      return t.id !== idIgnorar && t.texto.toLowerCase() === texto.toLowerCase();
    });

    if (duplicada) return 'Esa tarea ya está en la lista.';

    return '';
  }

  /** Muestra u oculta el mensaje de error del formulario de alta. */
  function mostrarError(mensaje) {
    errorTarea.textContent = mensaje;
    inputTarea.classList.toggle('campo__control--error', mensaje !== '');
  }

  // ==========================================================================
  // 5. PINTAR LA LISTA (render)
  // ==========================================================================

  /** Devuelve las tareas que corresponden al filtro activo. */
  function tareasVisibles() {
    if (filtroActivo === 'pendientes') {
      return tareas.filter((t) => !t.completada);
    }
    if (filtroActivo === 'completadas') {
      return tareas.filter((t) => t.completada);
    }
    return tareas; // 'todas'
  }

  /**
   * Construye el <li> de UNA tarea.
   * Se crean los elementos con createElement y se rellenan con textContent
   * en vez de montar una cadena con innerHTML: así, si el usuario escribe
   * "<img onerror=...>", se verá como texto y no se ejecutará nada.
   */
  function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.className = 'tarea' + (tarea.completada ? ' tarea--completada' : '');
    li.dataset.id = tarea.id; // el id viaja en el HTML, listo para la delegación

    // --- Checkbox de completada ---
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'tarea__check';
    check.checked = tarea.completada;
    // Etiqueta accesible para quien navega con lector de pantalla.
    check.setAttribute('aria-label', 'Marcar como completada: ' + tarea.texto);

    // --- Texto de la tarea ---
    const span = document.createElement('span');
    span.className = 'tarea__texto';
    span.textContent = tarea.texto; // ✅ seguro frente a HTML inyectado
    span.title = 'Doble clic para editar';

    // --- Botones de acción (llevan data-accion para la delegación) ---
    const acciones = document.createElement('span');
    acciones.className = 'tarea__acciones';

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn btn--mini';
    btnEditar.dataset.accion = 'editar';
    btnEditar.textContent = 'Editar';

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.className = 'btn btn--mini btn--peligro';
    btnEliminar.dataset.accion = 'eliminar';
    btnEliminar.textContent = 'Eliminar';

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(acciones);

    return li;
  }

  /** Vuelve a dibujar la lista entera a partir del estado. */
  function render() {
    const visibles = tareasVisibles();

    // Vaciamos la lista antes de repintar.
    listaTareas.innerHTML = '';

    /*
      OPTIMIZACIÓN: un DocumentFragment es un contenedor "de mentira" que vive
      en memoria. Metemos ahí los <li> y lo insertamos de una sola vez.
      Así el navegador recalcula el diseño UNA vez en lugar de una por tarea.
    */
    const fragmento = document.createDocumentFragment();
    visibles.forEach(function (tarea) {
      fragmento.appendChild(crearElementoTarea(tarea));
    });
    listaTareas.appendChild(fragmento);

    // Mensaje de lista vacía.
    estadoVacio.classList.toggle('oculto', visibles.length > 0);
    if (visibles.length === 0) {
      estadoVacio.textContent = tareas.length === 0
        ? 'Todavía no has añadido ninguna tarea.'
        : 'No hay tareas en el filtro "' + filtroActivo + '".';
    }

    // Contador de pendientes (con singular y plural bien puestos).
    const pendientes = tareas.filter((t) => !t.completada).length;
    contadorPendientes.textContent = pendientes === 1
      ? '1 tarea pendiente'
      : pendientes + ' tareas pendientes';

    // El botón de borrar completadas solo tiene sentido si hay completadas.
    const completadas = tareas.length - pendientes;
    btnBorrarCompletadas.disabled = completadas === 0;
    btnBorrarCompletadas.textContent = completadas === 0
      ? 'Borrar completadas'
      : 'Borrar completadas (' + completadas + ')';

    // Marcamos visualmente el filtro activo.
    contenedorFiltros.querySelectorAll('.filtro').forEach(function (boton) {
      const esActivo = boton.dataset.filtro === filtroActivo;
      boton.classList.toggle('filtro--activo', esActivo);
      // aria-pressed comunica el estado a los lectores de pantalla.
      boton.setAttribute('aria-pressed', esActivo);
    });
  }

  /** Atajo que se repite mucho: guardar y repintar. */
  function guardarYRender() {
    guardarEnDisco();
    render();
  }

  /** Busca una tarea por su id. Devuelve el objeto o undefined. */
  function buscarTarea(id) {
    return tareas.find((t) => t.id === id);
  }

  // ==========================================================================
  // 6. ALTA DE TAREAS (submit + validación)
  // ==========================================================================

  formTarea.addEventListener('submit', function (evento) {
    // Sin esto la página se recargaría y perderíamos el foco y el estado.
    evento.preventDefault();

    const texto = inputTarea.value.trim();
    const error = validarTexto(texto, null);

    if (error !== '') {
      mostrarError(error);
      inputTarea.focus();
      imprimir('Alta rechazada: ' + error);
      return; // salida temprana: no seguimos
    }

    mostrarError('');

    // ✅ unshift añade al PRINCIPIO: lo último creado aparece arriba.
    tareas.unshift({
      id: crearId(),
      texto: texto,
      completada: false,
      creadaEn: new Date().toISOString()
    });

    guardarYRender();

    imprimir('Tarea añadida: "' + texto + '" · total: ' + tareas.length);

    inputTarea.value = '';
    inputTarea.focus(); // listo para escribir la siguiente sin tocar el ratón
  });

  // Mientras el usuario corrige, quitamos el mensaje de error.
  inputTarea.addEventListener('input', function () {
    if (errorTarea.textContent !== '') mostrarError('');
  });

  // ==========================================================================
  // 7. DELEGACIÓN: MARCAR, EDITAR Y ELIMINAR
  // ==========================================================================

  /*
    Aquí está la razón de ser de la delegación: la lista se repinta entera cada
    vez que cambia algo, así que los <li> de ahora NO son los mismos objetos que
    los de hace un segundo. Si pusiéramos listeners en cada botón, habría que
    volver a registrarlos en cada render.

    Con un único listener en el <ul> (que nunca se destruye) el problema
    desaparece por completo.
  */

  // --- 7.a Marcar como completada: el evento change del checkbox ----------
  // change SÍ burbujea, así que puede delegarse igual que click.
  listaTareas.addEventListener('change', function (evento) {
    const check = evento.target.closest('.tarea__check');
    if (!check) return;

    const li = check.closest('.tarea');
    const tarea = buscarTarea(li.dataset.id);
    if (!tarea) return;

    tarea.completada = check.checked;
    guardarYRender();

    imprimir('"' + tarea.texto + '" -> ' + (tarea.completada ? 'completada' : 'pendiente'));
  });

  // --- 7.b Botones Editar y Eliminar --------------------------------------
  listaTareas.addEventListener('click', function (evento) {
    // closest sube desde donde se pulsó hasta encontrar un botón de acción.
    const boton = evento.target.closest('[data-accion]');
    if (!boton) return;

    const li = boton.closest('.tarea');
    const id = li.dataset.id;
    const tarea = buscarTarea(id);
    if (!tarea) return;

    if (boton.dataset.accion === 'eliminar') {
      eliminarTarea(li, id);
    } else if (boton.dataset.accion === 'editar') {
      iniciarEdicion(li, id);
    }
  });

  // --- 7.c Doble clic sobre el texto para editar --------------------------
  listaTareas.addEventListener('dblclick', function (evento) {
    const span = evento.target.closest('.tarea__texto');
    if (!span) return;

    const li = span.closest('.tarea');
    iniciarEdicion(li, li.dataset.id);
  });

  // ==========================================================================
  // 8. ELIMINAR CON ANIMACIÓN
  // ==========================================================================

  /*
    Si borramos la tarea del array y repintamos, desaparece de golpe.
    Para que se vea suave: primero añadimos la clase que dispara la animación
    de salida y esperamos al evento 'animationend' (otro evento del navegador,
    como click o keydown). Cuando la animación termina, borramos de verdad.

    { once: true } porque solo queremos escucharlo una vez.
  */
  function eliminarTarea(li, id) {
    const tarea = buscarTarea(id);

    // Cerrojo: la tarea debe borrarse UNA sola vez, venga el aviso de donde venga.
    let yaBorrada = false;

    function borrarDeVerdad() {
      if (yaBorrada) return;
      yaBorrada = true;

      // filter() crea un array NUEVO sin la tarea borrada.
      tareas = tareas.filter((t) => t.id !== id);
      guardarYRender();
      imprimir('Tarea eliminada: "' + (tarea ? tarea.texto : id) + '"');
    }

    li.classList.add('tarea--saliendo');
    li.addEventListener('animationend', borrarDeVerdad, { once: true });

    // ✅ BUENA PRÁCTICA: red de seguridad. Si la animación no llega a ejecutarse
    // (el elemento ya no está en la página, el usuario tiene desactivadas las
    // animaciones del sistema...), borramos igualmente a los 400 ms.
    // Nunca dejes una acción del usuario dependiendo SOLO de que una animación
    // termine: si no termina, la aplicación se queda colgada a medias.
    window.setTimeout(borrarDeVerdad, 400);
  }

  // ==========================================================================
  // 9. EDICIÓN EN LÍNEA
  // ==========================================================================

  /*
    Editar "en línea" (inline) significa cambiar el texto en su sitio, sin
    ventanas ni páginas nuevas. La técnica:
      1) Sustituir el <span> por un <input> con el texto actual.
      2) Dar el foco y seleccionar el contenido para poder escribir directamente.
      3) Enter guarda, Escape cancela, y salir del campo (blur) también guarda.
      4) Repintar para volver al estado normal.
  */
  function iniciarEdicion(li, id) {
    const tarea = buscarTarea(id);
    const span = li.querySelector('.tarea__texto');

    // Si ya se está editando esta tarea, el span ya no existe: no hacemos nada.
    if (!tarea || !span) return;

    const editor = document.createElement('input');
    editor.type = 'text';
    editor.className = 'tarea__editor';
    editor.value = tarea.texto;
    editor.maxLength = MAXIMO;
    editor.setAttribute('aria-label', 'Editar tarea');

    li.replaceChild(editor, span);
    editor.focus();
    editor.select(); // deja el texto seleccionado: se puede sobrescribir ya

    imprimir('Editando: "' + tarea.texto + '" (Enter guarda, Esc cancela)');

    /*
      Este "cerrojo" evita un problema real: al pulsar Enter guardamos y
      repintamos, lo que ELIMINA el input del DOM... y eso dispara su blur,
      que volvería a entrar aquí. Con la bandera solo se ejecuta una vez.
    */
    let yaCerrado = false;

    function terminarEdicion(guardarCambios) {
      if (yaCerrado) return;
      yaCerrado = true;

      if (guardarCambios) {
        const nuevoTexto = editor.value.trim();
        const error = validarTexto(nuevoTexto, id);

        if (error !== '') {
          imprimir('Edición descartada: ' + error);
        } else if (nuevoTexto !== tarea.texto) {
          imprimir('Texto actualizado: "' + tarea.texto + '" -> "' + nuevoTexto + '"');
          tarea.texto = nuevoTexto;
          guardarEnDisco();
        }
      } else {
        imprimir('Edición cancelada con Escape.');
      }

      render(); // vuelve a poner el <span> en su sitio
    }

    editor.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter') {
        evento.preventDefault(); // el input está dentro de la página, no del form
        terminarEdicion(true);
      } else if (evento.key === 'Escape') {
        evento.preventDefault();
        terminarEdicion(false);
      }
    });

    // Al hacer clic fuera, guardamos (comportamiento habitual en apps reales).
    editor.addEventListener('blur', function () {
      terminarEdicion(true);
    });
  }

  // ==========================================================================
  // 10. FILTROS
  // ==========================================================================

  /*
    Tres botones, un solo manejador: otra vez delegación.
    El valor del filtro viaja en el atributo data-filtro del HTML, así que
    añadir un cuarto filtro no requeriría tocar este código.
  */
  contenedorFiltros.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.filtro');
    if (!boton) return;

    filtroActivo = boton.dataset.filtro;
    guardarYRender(); // el filtro elegido también se recuerda al recargar

    // Singular y plural bien puestos: los detalles de idioma también son
    // parte de la calidad de una interfaz.
    const cuantas = tareasVisibles().length;
    imprimir(
      'Filtro activo: ' + filtroActivo + ' · mostrando ' +
      (cuantas === 1 ? '1 tarea' : cuantas + ' tareas')
    );
  });

  // ==========================================================================
  // 11. BORRAR COMPLETADAS
  // ==========================================================================

  btnBorrarCompletadas.addEventListener('click', function () {
    const cuantas = tareas.filter((t) => t.completada).length;
    if (cuantas === 0) return;

    // Texto en singular o plural según el número, igual que en el contador.
    const enunciado = cuantas === 1 ? '1 tarea completada' : cuantas + ' tareas completadas';

    // confirm() dentro de un manejador: nunca en la carga de la página.
    const seguro = window.confirm('¿Seguro que quieres borrar ' + enunciado + '?');
    if (!seguro) {
      imprimir('Borrado cancelado.');
      return;
    }

    // Nos quedamos solo con las que NO están completadas.
    tareas = tareas.filter((t) => !t.completada);
    guardarYRender();

    imprimir((cuantas === 1 ? 'Eliminada ' : 'Eliminadas ') + enunciado + '.');
  });

  // ==========================================================================
  // 12. ARRANQUE DE LA APLICACIÓN
  // ==========================================================================

  /*
    Este bloque es el que hace que, al recargar con F5, todo siga en su sitio:
    leemos el estado del disco ANTES del primer render.
  */
  tareas = cargarDeDisco();

  // El filtro guardado solo se acepta si es uno de los tres válidos.
  const filtroGuardado = leerClave(CLAVE_FILTRO);
  if (['todas', 'pendientes', 'completadas'].includes(filtroGuardado)) {
    filtroActivo = filtroGuardado;
  }

  // Si es la primera visita, sembramos tres tareas de ejemplo para que la
  // pantalla no aparezca vacía durante la explicación en clase.
  if (tareas.length === 0 && leerClave(CLAVE_TAREAS) === null) {
    tareas = [
      { id: crearId(), texto: 'Repasar los apuntes del proyecto 06', completada: true, creadaEn: new Date().toISOString() },
      { id: crearId(), texto: 'Practicar la delegación de eventos', completada: false, creadaEn: new Date().toISOString() },
      { id: crearId(), texto: 'Entregar el ejercicio de formularios', completada: false, creadaEn: new Date().toISOString() }
    ];
    guardarEnDisco();
  }

  render();

  imprimir('Aplicación iniciada · ' + tareas.length + ' tareas recuperadas de localStorage.');
  imprimir('Prueba a recargar la página con F5: todo seguirá exactamente igual.');

  /* ==========================================================================
   * EJERCICIOS PROPUESTOS · archivo 06 (proyecto)
   * --------------------------------------------------------------------------
   * 1) Añade a cada tarea la fecha de creación visible en pequeño, a la derecha
   *    del texto. Ya la tienes guardada en la propiedad creadaEn.
   *    Pista: new Date(tarea.creadaEn).toLocaleDateString('es-ES').
   *
   * 2) Añade un botón "Marcar todas" que ponga todas las tareas como
   *    completadas (y que las desmarque si ya lo estaban todas).
   *
   * 3) Añade un campo de búsqueda que filtre las tareas por texto en vivo,
   *    combinándose con los filtros existentes. Pista: evento input y otra
   *    variable de estado, "busqueda", usada dentro de tareasVisibles().
   *
   * 4) Añade prioridad (alta / media / baja) al crear la tarea, guárdala en el
   *    objeto, píntala con un color de borde distinto y permite ordenar la
   *    lista por prioridad. Pista: array.sort().
   *
   * 5) (Reto) Permite reordenar las tareas arrastrándolas con el ratón usando
   *    los eventos dragstart, dragover y drop, y guarda el nuevo orden en
   *    localStorage. Pista: el <li> necesita el atributo draggable="true".
   *
   * 6) (Reto avanzado) Añade un botón "Deshacer" que recupere la última tarea
   *    eliminada. Pista: guarda una copia de la tarea borrada en una variable
   *    antes de sacarla del array.
   * ========================================================================== */
})();
