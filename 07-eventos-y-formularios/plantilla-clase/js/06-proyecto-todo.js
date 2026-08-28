/**
 * ============================================================================
 * ARCHIVO: js/06-proyecto-todo.js
 * PROYECTO: 07 · Eventos, formularios y almacenamiento
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
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección, el andamiaje (imprimir) y los DATOS de partida (claves
 *   de localStorage, límites y tareas de ejemplo), pero el código de cada
 *   apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/06-proyecto-todo.js
 *
 *   ORDEN RECOMENDADO PARA ESCRIBIRLO EN VIVO:
 *     1 y 2 (referencias y estado) -> 5 (render) -> 6 (alta) -> 3 (persistencia)
 *     -> 7 (delegación) -> 10 y 11 (filtros y limpieza) -> 8 y 9 (animación y
 *     edición) -> 12 (arranque).
 *   Hasta que no exista render() la lista no pinta nada: es normal y conviene
 *   avisarlo antes de empezar.
 * ============================================================================
 */

// IIFE: todo el proyecto vive dentro de su propia caja.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto de clase.

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

  const botonLimpiar06 = document.getElementById('limpiar-06');
  if (botonLimpiar06) {
    botonLimpiar06.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

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

  // TODO (en clase):
  //   Declara estas OCHO constantes con document.getElementById (los ids ya
  //   existen en el HTML de la sección 6):
  //     formTarea            -> 'form-tarea'
  //     inputTarea           -> 'input-tarea'
  //     errorTarea           -> 'error-tarea'
  //     listaTareas          -> 'lista-tareas'
  //     estadoVacio          -> 'estado-vacio'
  //     contenedorFiltros    -> 'filtros'
  //     contadorPendientes   -> 'contador-pendientes'
  //     btnBorrarCompletadas -> 'btn-borrar-completadas'
  //   (aprox. 8 lineas)

  // ==========================================================================
  // 2. EL ESTADO
  // ==========================================================================

  /*
    Claves de localStorage con prefijo del proyecto para no chocar con otras
    aplicaciones del mismo dominio.
  */

  // --- DATOS DE PARTIDA (ya escritos: teclearlos en clase es tiempo perdido) -
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

  // TODO (en clase):
  //   1. Declara las TRES variables de estado (con let, porque cambian):
  //        let tareas = [];              // LA FUENTE DE VERDAD
  //        let filtroActivo = 'todas';   // 'todas' | 'pendientes' | 'completadas'
  //        let contadorIds = 0;          // para que dos tareas creadas en el
  //                                      // mismo milisegundo no choquen
  //   2. function crearId() que devuelva un identificador único y legible:
  //        contadorIds = contadorIds + 1;
  //        return 't-' + Date.now().toString(36) + '-' + contadorIds;
  //        (toString(36) convierte el número a base 36 -dígitos + letras-:
  //         sale mucho más corto que en base 10)
  //   Resultado esperado: crearId() devuelve algo como "t-mf3k9x2-1".
  //   (aprox. 8 lineas)

  // ==========================================================================
  // 3. PERSISTENCIA EN localStorage
  // ==========================================================================

  /*
    Recordatorio del archivo 05: localStorage solo guarda TEXTO.
    Un array de objetos hay que serializarlo con JSON.stringify al guardar y
    reconstruirlo con JSON.parse al leer.
  */

  // TODO (en clase) · 3.a guardarEnDisco():
  //   Guarda el array completo de tareas y el filtro elegido:
  //     try {
  //       localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
  //       localStorage.setItem(CLAVE_FILTRO, filtroActivo);
  //     } catch (error) {
  //       // Modo incógnito o almacenamiento lleno: avisamos, pero la
  //       // aplicación sigue funcionando en memoria.
  //       imprimir('No se ha podido guardar en localStorage: ' + error.name);
  //     }
  //   (aprox. 9 lineas)

  // TODO (en clase) · 3.b leerClave(clave):
  //   Lectura protegida de una clave suelta. Devuelve el texto o null.
  //     try { return localStorage.getItem(clave); } catch (error) { return null; }
  //   ⚠️ Algunos navegadores (Safari, o el modo privado de otros) BLOQUEAN el
  //   almacenamiento cuando la página se abre con doble clic (protocolo file://)
  //   y lanzan un error solo con LEER. Si no lo capturamos, la aplicación entera
  //   se queda sin arrancar. Con este envoltorio, como mucho perdemos la
  //   persistencia, pero la lista de tareas sigue funcionando.
  //   (aprox. 7 lineas)

  // TODO (en clase) · 3.c cargarDeDisco():
  //   Devuelve SIEMPRE un array (vacío si no hay nada o si está corrupto):
  //     dentro de try:
  //       const texto = leerClave(CLAVE_TAREAS);
  //       if (texto === null) return [];
  //       const datos = JSON.parse(texto);
  //       // ✅ BUENA PRÁCTICA: no te fíes de lo que hay guardado. Puede venir
  //       // de una versión anterior de tu aplicación o estar manipulado a mano.
  //       if (!Array.isArray(datos)) return [];
  //       // Nos quedamos solo con los elementos que tengan la forma esperada:
  //       return datos.filter(function (t) {
  //         return t && typeof t.id === 'string' && typeof t.texto === 'string';
  //       });
  //     dentro de catch:
  //       imprimir('Datos de tareas corruptos, se empieza de cero: ' + error.message);
  //       localStorage.removeItem(CLAVE_TAREAS);
  //       return [];
  //   Demostración de clase: en DevTools > Application > Local Storage, cambia
  //   el valor de fs2-07-tareas por "esto no es json" y recarga: la aplicación
  //   avisa y arranca vacía en vez de romperse.
  //   (aprox. 18 lineas)

  // ==========================================================================
  // 4. VALIDACIÓN DEL TEXTO DE UNA TAREA
  // ==========================================================================

  // --- DATOS DE PARTIDA (ya escritos) ---
  const MINIMO = 3;
  const MAXIMO = 80;

  // TODO (en clase) · 4.a validarTexto(texto, idIgnorar):
  //   Devuelve un mensaje de error, o cadena vacía si el texto es válido.
  //     @param texto      lo que ha escrito el usuario (ya recortado con trim)
  //     @param idIgnorar  id de la tarea que se está editando, para que no se
  //                       considere duplicada de sí misma
  //   Reglas, en este orden:
  //     texto === ''            -> 'Escribe algo antes de añadir la tarea.'
  //     texto.length < MINIMO   -> 'La tarea debe tener al menos ' + MINIMO + ' caracteres.'
  //     texto.length > MAXIMO   -> 'Máximo ' + MAXIMO + ' caracteres.'
  //     duplicada               -> 'Esa tarea ya está en la lista.'
  //   Para el duplicado, some() devuelve true si ALGÚN elemento cumple:
  //     const duplicada = tareas.some(function (t) {
  //       return t.id !== idIgnorar && t.texto.toLowerCase() === texto.toLowerCase();
  //     });
  //   (toLowerCase() en los dos lados: "Comprar pan" y "comprar pan" son la misma)
  //   (aprox. 14 lineas)

  // TODO (en clase) · 4.b mostrarError(mensaje):
  //   Muestra u oculta el mensaje de error del formulario de alta:
  //     errorTarea.textContent = mensaje;
  //     inputTarea.classList.toggle('campo__control--error', mensaje !== '');
  //   (aprox. 4 lineas)

  // ==========================================================================
  // 5. PINTAR LA LISTA (render)
  // ==========================================================================

  // TODO (en clase) · 5.a tareasVisibles():
  //   Devuelve las tareas que corresponden al filtro activo:
  //     'pendientes'  -> tareas.filter((t) => !t.completada)
  //     'completadas' -> tareas.filter((t) => t.completada)
  //     'todas'       -> tareas
  //   (aprox. 8 lineas)

  /*
    crearElementoTarea() construye el <li> de UNA tarea.
    Se crean los elementos con createElement y se rellenan con textContent
    en vez de montar una cadena con innerHTML: así, si el usuario escribe
    "<img onerror=...>", se verá como texto y no se ejecutará nada.
  */

  // TODO (en clase) · 5.b crearElementoTarea(tarea) -> devuelve un <li>:
  //   1. const li = document.createElement('li');
  //      li.className = 'tarea' + (tarea.completada ? ' tarea--completada' : '');
  //      li.dataset.id = tarea.id;   // el id viaja en el HTML, listo para la delegación
  //   2. Checkbox de completada:
  //      <input type="checkbox" class="tarea__check"> con check.checked = tarea.completada
  //      y check.setAttribute('aria-label', 'Marcar como completada: ' + tarea.texto);
  //      (etiqueta accesible para quien navega con lector de pantalla)
  //   3. Texto de la tarea:
  //      <span class="tarea__texto"> con span.textContent = tarea.texto   // ✅ seguro
  //      y span.title = 'Doble clic para editar';
  //   4. Botones de acción dentro de <span class="tarea__acciones">, los dos con
  //      type='button' y className 'btn btn--mini' (el de eliminar añade 'btn--peligro'):
  //        btnEditar.dataset.accion   = 'editar';    btnEditar.textContent   = 'Editar';
  //        btnEliminar.dataset.accion = 'eliminar';  btnEliminar.textContent = 'Eliminar';
  //   5. Ensambla con appendChild en este orden: check, span, acciones dentro
  //      del li; y devuelve el li.
  //   (aprox. 35 lineas)

  /*
    render() vuelve a dibujar la lista entera a partir del estado.

    OPTIMIZACIÓN: un DocumentFragment es un contenedor "de mentira" que vive
    en memoria. Metemos ahí los <li> y lo insertamos de una sola vez.
    Así el navegador recalcula el diseño UNA vez en lugar de una por tarea.
  */

  // TODO (en clase) · 5.c render():
  //   1. const visibles = tareasVisibles();
  //      listaTareas.innerHTML = '';   // vaciamos antes de repintar
  //   2. const fragmento = document.createDocumentFragment();
  //      visibles.forEach((tarea) => fragmento.appendChild(crearElementoTarea(tarea)));
  //      listaTareas.appendChild(fragmento);
  //   3. Mensaje de lista vacía:
  //      estadoVacio.classList.toggle('oculto', visibles.length > 0);
  //      si visibles.length === 0, el texto es
  //        'Todavía no has añadido ninguna tarea.'            (si tareas.length === 0)
  //        'No hay tareas en el filtro "' + filtroActivo + '".' (si las hay pero filtradas)
  //   4. Contador de pendientes, con singular y plural bien puestos:
  //      const pendientes = tareas.filter((t) => !t.completada).length;
  //      contadorPendientes.textContent = pendientes === 1
  //        ? '1 tarea pendiente' : pendientes + ' tareas pendientes';
  //   5. El botón de borrar completadas solo tiene sentido si hay completadas:
  //      const completadas = tareas.length - pendientes;
  //      btnBorrarCompletadas.disabled = completadas === 0;
  //      btnBorrarCompletadas.textContent = completadas === 0
  //        ? 'Borrar completadas' : 'Borrar completadas (' + completadas + ')';
  //   6. Marca visualmente el filtro activo:
  //      contenedorFiltros.querySelectorAll('.filtro').forEach(function (boton) {
  //        const esActivo = boton.dataset.filtro === filtroActivo;
  //        boton.classList.toggle('filtro--activo', esActivo);
  //        boton.setAttribute('aria-pressed', esActivo);  // estado para lectores de pantalla
  //      });
  //   (aprox. 35 lineas)

  // TODO (en clase) · 5.d dos atajos que se repiten mucho:
  //   function guardarYRender() { guardarEnDisco(); render(); }
  //   function buscarTarea(id)  { return tareas.find((t) => t.id === id); }
  //   (aprox. 6 lineas)

  // ==========================================================================
  // 6. ALTA DE TAREAS (submit + validación)
  // ==========================================================================

  // TODO (en clase):
  //   formTarea.addEventListener('submit', function (evento) { ... }) con:
  //   1. evento.preventDefault();   // sin esto la página se recarga y se pierde todo
  //   2. const texto = inputTarea.value.trim();
  //      const error = validarTexto(texto, null);
  //      if (error !== '') {           // SALIDA TEMPRANA
  //        mostrarError(error); inputTarea.focus();
  //        imprimir('Alta rechazada: ' + error);
  //        return;
  //      }
  //      mostrarError('');
  //   3. ✅ unshift añade al PRINCIPIO: lo último creado aparece arriba.
  //      tareas.unshift({
  //        id: crearId(), texto: texto, completada: false,
  //        creadaEn: new Date().toISOString()
  //      });
  //   4. guardarYRender();
  //      imprimir('Tarea añadida: "' + texto + '" · total: ' + tareas.length);
  //      inputTarea.value = '';
  //      inputTarea.focus();   // listo para escribir la siguiente sin tocar el ratón
  //   5. Y mientras el usuario corrige, quitamos el mensaje de error:
  //      inputTarea.addEventListener('input', function () {
  //        if (errorTarea.textContent !== '') mostrarError('');
  //      });
  //   Resultado esperado: escribir "ab" y enviar muestra en rojo "La tarea debe
  //   tener al menos 3 caracteres."; escribir "Comprar pan" la añade arriba del
  //   todo y el contador de pendientes sube en uno.
  //   (aprox. 30 lineas)

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

  // TODO (en clase) · 7.a MARCAR COMO COMPLETADA (evento change del checkbox):
  //   change SÍ burbujea, así que puede delegarse igual que click.
  //     listaTareas.addEventListener('change', function (evento) {
  //       const check = evento.target.closest('.tarea__check');
  //       if (!check) return;
  //       const li = check.closest('.tarea');
  //       const tarea = buscarTarea(li.dataset.id);
  //       if (!tarea) return;
  //       tarea.completada = check.checked;
  //       guardarYRender();
  //       imprimir('"' + tarea.texto + '" -> ' + (tarea.completada ? 'completada' : 'pendiente'));
  //     });
  //   (aprox. 12 lineas)

  // TODO (en clase) · 7.b BOTONES EDITAR Y ELIMINAR (evento click):
  //     const boton = evento.target.closest('[data-accion]');   // closest sube
  //     if (!boton) return;                                     // desde donde se pulsó
  //     const li = boton.closest('.tarea');
  //     const id = li.dataset.id;
  //     const tarea = buscarTarea(id);
  //     if (!tarea) return;
  //     'eliminar' -> eliminarTarea(li, id);      (apartado 8)
  //     'editar'   -> iniciarEdicion(li, id);     (apartado 9)
  //   (aprox. 14 lineas)

  // TODO (en clase) · 7.c DOBLE CLIC SOBRE EL TEXTO PARA EDITAR:
  //     listaTareas.addEventListener('dblclick', function (evento) {
  //       const span = evento.target.closest('.tarea__texto');
  //       if (!span) return;
  //       const li = span.closest('.tarea');
  //       iniciarEdicion(li, li.dataset.id);
  //     });
  //   (aprox. 7 lineas)

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

  // TODO (en clase) · function eliminarTarea(li, id):
  //   1. const tarea = buscarTarea(id);
  //      let yaBorrada = false;    // cerrojo: debe borrarse UNA sola vez,
  //                                // venga el aviso de donde venga
  //   2. function borrarDeVerdad() {
  //        if (yaBorrada) return;
  //        yaBorrada = true;
  //        tareas = tareas.filter((t) => t.id !== id);   // filter crea un array NUEVO
  //        guardarYRender();
  //        imprimir('Tarea eliminada: "' + (tarea ? tarea.texto : id) + '"');
  //      }
  //   3. li.classList.add('tarea--saliendo');
  //      li.addEventListener('animationend', borrarDeVerdad, { once: true });
  //   4. ✅ BUENA PRÁCTICA: red de seguridad. Si la animación no llega a
  //      ejecutarse (el elemento ya no está en la página, el usuario tiene
  //      desactivadas las animaciones del sistema...), borramos igualmente:
  //        window.setTimeout(borrarDeVerdad, 400);
  //      Nunca dejes una acción del usuario dependiendo SOLO de que una
  //      animación termine: si no termina, la aplicación se queda a medias.
  //   Resultado esperado: la tarea se desvanece hacia la derecha y desaparece;
  //   el mensaje de la consola sale UNA sola vez, no dos.
  //   (aprox. 20 lineas)

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

  // TODO (en clase) · function iniciarEdicion(li, id):
  //   1. const tarea = buscarTarea(id);
  //      const span  = li.querySelector('.tarea__texto');
  //      if (!tarea || !span) return;   // ya se está editando: el span no existe
  //   2. Crea el editor:
  //        const editor = document.createElement('input');
  //        editor.type = 'text';
  //        editor.className = 'tarea__editor';
  //        editor.value = tarea.texto;
  //        editor.maxLength = MAXIMO;
  //        editor.setAttribute('aria-label', 'Editar tarea');
  //        li.replaceChild(editor, span);
  //        editor.focus();
  //        editor.select();   // deja el texto seleccionado: se puede sobrescribir ya
  //        imprimir('Editando: "' + tarea.texto + '" (Enter guarda, Esc cancela)');
  //   3. let yaCerrado = false;  y  function terminarEdicion(guardarCambios):
  //        if (yaCerrado) return;  yaCerrado = true;
  //        si guardarCambios:
  //          const nuevoTexto = editor.value.trim();
  //          const error = validarTexto(nuevoTexto, id);   // ojo: id, para no
  //                                                        // chocar consigo misma
  //          error !== ''                -> imprimir('Edición descartada: ' + error)
  //          nuevoTexto !== tarea.texto  -> imprimir('Texto actualizado: "' + tarea.texto +
  //                                                  '" -> "' + nuevoTexto + '"'),
  //                                         tarea.texto = nuevoTexto y guardarEnDisco()
  //        si no: imprimir('Edición cancelada con Escape.');
  //        y SIEMPRE al final: render();   // vuelve a poner el <span> en su sitio
  //      ⚠️ Ese "cerrojo" evita un problema real: al pulsar Enter guardamos y
  //      repintamos, lo que ELIMINA el input del DOM... y eso dispara su blur,
  //      que volvería a entrar aquí. Con la bandera solo se ejecuta una vez.
  //   4. Manejadores del editor:
  //        'keydown' -> Enter: evento.preventDefault() y terminarEdicion(true)
  //                     Escape: evento.preventDefault() y terminarEdicion(false)
  //        'blur'    -> terminarEdicion(true)   // al hacer clic fuera se guarda,
  //                                             // como en las apps reales
  //   Resultado esperado: doble clic sobre el texto, escribir, Enter -> el texto
  //   cambia y persiste tras F5. Con Escape vuelve el texto original.
  //   (aprox. 45 lineas)

  // ==========================================================================
  // 10. FILTROS
  // ==========================================================================

  /*
    Tres botones, un solo manejador: otra vez delegación.
    El valor del filtro viaja en el atributo data-filtro del HTML, así que
    añadir un cuarto filtro no requeriría tocar este código.
  */

  // TODO (en clase):
  //   contenedorFiltros.addEventListener('click', function (evento) { ... }) con:
  //     const boton = evento.target.closest('.filtro');
  //     if (!boton) return;
  //     filtroActivo = boton.dataset.filtro;
  //     guardarYRender();   // el filtro elegido también se recuerda al recargar
  //     const cuantas = tareasVisibles().length;
  //     imprimir('Filtro activo: ' + filtroActivo + ' · mostrando ' +
  //              (cuantas === 1 ? '1 tarea' : cuantas + ' tareas'));
  //   (Singular y plural bien puestos: los detalles de idioma también son parte
  //    de la calidad de una interfaz.)
  //   Resultado esperado: el botón pulsado se queda resaltado, la lista se
  //   filtra y, tras F5, sigue el mismo filtro seleccionado.
  //   (aprox. 12 lineas)

  // ==========================================================================
  // 11. BORRAR COMPLETADAS
  // ==========================================================================

  // TODO (en clase):
  //   btnBorrarCompletadas.addEventListener('click', function () { ... }) con:
  //     const cuantas = tareas.filter((t) => t.completada).length;
  //     if (cuantas === 0) return;
  //     const enunciado = cuantas === 1 ? '1 tarea completada' : cuantas + ' tareas completadas';
  //     // confirm() dentro de un manejador: nunca en la carga de la página.
  //     const seguro = window.confirm('¿Seguro que quieres borrar ' + enunciado + '?');
  //     if (!seguro) { imprimir('Borrado cancelado.'); return; }
  //     tareas = tareas.filter((t) => !t.completada);   // nos quedamos con las pendientes
  //     guardarYRender();
  //     imprimir((cuantas === 1 ? 'Eliminada ' : 'Eliminadas ') + enunciado + '.');
  //   (aprox. 14 lineas)

  // ==========================================================================
  // 12. ARRANQUE DE LA APLICACIÓN
  // ==========================================================================

  /*
    Este bloque es el que hace que, al recargar con F5, todo siga en su sitio:
    leemos el estado del disco ANTES del primer render.
  */

  // --- DATOS DE PARTIDA (ya escritos) ---
  // Tareas de ejemplo para la primera visita, de modo que la pantalla no
  // aparezca vacía durante la explicación en clase.
  const TAREAS_DE_EJEMPLO = [
    { texto: 'Repasar los apuntes del proyecto 06', completada: true },
    { texto: 'Practicar la delegación de eventos', completada: false },
    { texto: 'Entregar el ejercicio de formularios', completada: false }
  ];

  // TODO (en clase):
  //   1. tareas = cargarDeDisco();
  //   2. El filtro guardado solo se acepta si es uno de los tres válidos
  //      (nunca te fíes de lo que hay en localStorage):
  //        const filtroGuardado = leerClave(CLAVE_FILTRO);
  //        if (['todas', 'pendientes', 'completadas'].includes(filtroGuardado)) {
  //          filtroActivo = filtroGuardado;
  //        }
  //   3. Si es la PRIMERA visita (no hay tareas y la clave ni siquiera existe),
  //      siembra las de ejemplo dándoles id y fecha:
  //        if (tareas.length === 0 && leerClave(CLAVE_TAREAS) === null) {
  //          tareas = TAREAS_DE_EJEMPLO.map(function (t) {
  //            return { id: crearId(), texto: t.texto, completada: t.completada,
  //                     creadaEn: new Date().toISOString() };
  //          });
  //          guardarEnDisco();
  //        }
  //   4. render();
  //      imprimir('Aplicación iniciada · ' + tareas.length + ' tareas recuperadas de localStorage.');
  //      imprimir('Prueba a recargar la página con F5: todo seguirá exactamente igual.');
  //   Resultado esperado en la primera carga: tres tareas en pantalla, la
  //   primera tachada, el pie diciendo "2 tareas pendientes" y el botón
  //   "Borrar completadas (1)" habilitado.
  //   (aprox. 20 lineas)

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
