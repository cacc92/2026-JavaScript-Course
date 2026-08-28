/**
 * ============================================================================
 * ARCHIVO: js/05-analizador-calificaciones.js
 * PROYECTO: 04 · Arrays y métodos funcionales
 * ----------------------------------------------------------------------------
 * PROYECTO PRÁCTICO: ANALIZADOR DE CALIFICACIONES
 *
 * Aquí se junta TODO lo estudiado en las cuatro secciones anteriores dentro de
 * una aplicación pequeña pero completa y realista:
 *
 *   - Un array de OBJETOS { nombre, curso, nota, edad } como fuente de datos.
 *   - map() + join() para GENERAR el HTML de la tabla.
 *   - filter() para los botones de aprobados / reprobados / destacados.
 *   - sort() con comparadores para ordenar por nota, nombre y edad.
 *   - reduce() para todas las estadísticas: promedio, máxima, mínima,
 *     cantidad de aprobados y cantidad de estudiantes por curso.
 *   - Set para obtener la lista de cursos sin repetir.
 *   - Spread para copiar el array antes de ordenarlo (sort MUTA).
 *
 * ARQUITECTURA (patrón que se repite en React, Vue y cualquier framework):
 *
 *      DATOS  ->  ESTADO  ->  CÁLCULO  ->  PINTADO
 *
 *   1. DATOS: el array ESTUDIANTES nunca se modifica. Es la "fuente de verdad".
 *   2. ESTADO: un objeto pequeño que recuerda qué filtro y qué orden eligió
 *      la persona usuaria.
 *   3. CÁLCULO: a partir de los datos y del estado obtenemos la lista visible.
 *   4. PINTADO: volvemos a dibujar la tabla y las estadísticas desde cero.
 *
 * Es decir: no tocamos la tabla celda a celda, sino que la RECONSTRUIMOS
 * entera cada vez que algo cambia. Es más simple de razonar y casi imposible
 * de desincronizar.
 *
 * (Todo va dentro de una IIFE para que estas variables no choquen con las de
 *  los otros archivos .js que carga la misma página.)
 * ============================================================================
 */

/* ============================================================================
 * CÓMO USAR ESTA PLANTILLA (nota del docente)
 * ----------------------------------------------------------------------------
 * Versión "para escribir en vivo" del proyecto final.
 * Vienen YA ESCRITOS: las constantes de configuración y el array ESTUDIANTES
 * (son datos, teclearlos en clase es tiempo perdido).
 * Se escribe en vivo TODO lo demás: estado, catálogos de filtros y órdenes,
 * referencias al DOM, cálculo, pintado y eventos.
 *
 * ⚠️ Hasta que no se escriba el código, la sección 5 de la página se ve con el
 * texto "Cargando datos...", el <select> vacío y sin tabla. ES LO ESPERADO:
 * la plantilla se abre SIN NINGÚN ERROR en la consola precisamente porque
 * todavía no hay nada que ejecutar.
 *
 * Solución de referencia: ../js/05-analizador-calificaciones.js
 * ============================================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. DATOS Y CONSTANTES DE CONFIGURACIÓN
  // ============================================================
  // ✅ BUENA PRÁCTICA: los "números mágicos" sueltos por el código (el 6 del
  // aprobado, el 9 del sobresaliente) se guardan en constantes con NOMBRE.
  // Si mañana el aprobado pasa a ser 7, se cambia en UN solo sitio.
  const NOTA_APROBACION = 6;
  const NOTA_DESTACADA = 9;

  // La fuente de verdad. Escrito en MAYÚSCULAS por convención: "esto no se toca".
  // Ninguna función de este archivo modifica este array; todas trabajan con copias.
  //
  // NOTA DE LA PLANTILLA: este array viene YA ESCRITO a propósito.
  const ESTUDIANTES = [
    { nombre: 'Ana Ruiz', curso: 'Front End', nota: 8.5, edad: 19 },
    { nombre: 'Luis Paz', curso: 'Bases de Datos', nota: 5.4, edad: 22 },
    { nombre: 'Sara Gil', curso: 'Front End', nota: 9.2, edad: 20 },
    { nombre: 'Iván Mora', curso: 'Redes', nota: 4.8, edad: 19 },
    { nombre: 'Nadia Soto', curso: 'Front End', nota: 6.7, edad: 21 },
    { nombre: 'Pablo Vera', curso: 'Bases de Datos', nota: 7.3, edad: 23 },
    { nombre: 'Elena Cruz', curso: 'Redes', nota: 9.6, edad: 20 },
    { nombre: 'Marcos Díaz', curso: 'Front End', nota: 3.9, edad: 18 },
    { nombre: 'Julia Nieto', curso: 'Bases de Datos', nota: 8.1, edad: 22 },
    { nombre: 'Óscar León', curso: 'Redes', nota: 6.0, edad: 24 },
    { nombre: 'Lucía Ramos', curso: 'Front End', nota: 7.8, edad: 19 },
    { nombre: 'Diego Ferrer', curso: 'Bases de Datos', nota: 5.9, edad: 21 },
    { nombre: 'Carmen Ibáñez', curso: 'Redes', nota: 8.9, edad: 20 },
    { nombre: 'Tomás Aguirre', curso: 'Front End', nota: 2.5, edad: 18 },
  ];

  // ------------------------------------------------------------
  // 1.b) ESTADO de la interfaz
  // ------------------------------------------------------------
  // Un objeto que recuerda qué está seleccionado en cada momento.
  // Cuando el usuario pulsa un botón solo cambiamos este objeto y volvemos
  // a pintar. Toda la aplicación depende de estas tres propiedades.

  // TODO (en clase):
  //   1. Declara const estado = { ... } con exactamente tres propiedades y
  //      estos valores iniciales:
  //        filtro: 'todos'      // todos | aprobados | reprobados | destacados
  //        orden: 'original'    // original | nota-desc | nota-asc | nombre-asc | edad-asc
  //        curso: 'todos'       // 'todos' o el nombre de un curso concreto
  //      Con const, pero mutable por dentro: cambiaremos sus propiedades, no la variable.
  //   (aprox. 5 líneas)

  // ------------------------------------------------------------
  // 1.c) CATÁLOGO DE FILTROS
  // ------------------------------------------------------------
  // En vez de una cadena de if / else if, guardamos cada filtro como una
  // función dentro de un objeto. La clave coincide con el atributo
  // data-filtro del botón en el HTML.
  // Ventaja: añadir un filtro nuevo es añadir UNA línea aquí y un botón allí,
  // sin tocar la lógica. Este patrón se llama "tabla de despacho".

  // TODO (en clase):
  //   1. Declara const FILTROS = { ... } con cuatro claves, que deben coincidir
  //      EXACTAMENTE con los data-filtro de los botones del HTML:
  //        todos:      () => true                                     // No descarta a nadie.
  //        aprobados:  (estudiante) => estudiante.nota >= NOTA_APROBACION
  //        reprobados: (estudiante) => estudiante.nota < NOTA_APROBACION
  //        destacados: (estudiante) => estudiante.nota >= NOTA_DESTACADA
  //   (aprox. 6 líneas)

  // ------------------------------------------------------------
  // 1.d) CATÁLOGO DE COMPARADORES PARA sort()
  // ------------------------------------------------------------
  // Recuerda del archivo 04: el comparador devuelve un número negativo,
  // cero o positivo. Para números se usa la resta; para textos, localeCompare
  // con el idioma 'es' para que las tildes y las mayúsculas se ordenen bien.
  //
  // Nota sobre el operador ||: si (a.edad - b.edad) da 0 (empate, valor
  // "falso"), JavaScript evalúa la parte derecha y devuelve el desempate por
  // nombre. Es una forma muy compacta de encadenar criterios.

  // TODO (en clase):
  //   1. Declara const ORDENES = { ... } con cuatro claves, que deben coincidir
  //      con los data-orden de los botones del HTML:
  //        'nota-desc':  (a, b) => b.nota - a.nota
  //        'nota-asc':   (a, b) => a.nota - b.nota
  //        'nombre-asc': (a, b) => a.nombre.localeCompare(b.nombre, 'es')
  //        'edad-asc':   (a, b) => a.edad - b.edad || a.nombre.localeCompare(b.nombre, 'es')
  //      Fíjate en que 'original' NO está: si la clave no existe, no ordenamos.
  //   (aprox. 6 líneas)

  // ============================================================
  // 2. REFERENCIAS AL HTML
  // ============================================================
  // Las buscamos UNA sola vez al arrancar y las guardamos en constantes.
  // ✅ BUENA PRÁCTICA: no llamar a getElementById dentro de un bucle o en cada
  // repintado; buscar en el documento tiene un coste y aquí no cambia nunca.
  //
  // ✅ Comprobamos TODOS los que se usan después, no solo algunos: si faltara
  // panelCursos o estadoTabla, actualizarVista() reventaría con
  // "Cannot set properties of null".

  // TODO (en clase):
  //   1. Guarda con document.getElementById(...) estas SIETE referencias
  //      (el nombre de la constante y, entre comillas, el id exacto del HTML):
  //        panelControles     -> 'panel-controles'
  //        contenedorTabla    -> 'contenedor-tabla'
  //        panelEstadisticas  -> 'panel-estadisticas'
  //        panelCursos        -> 'panel-cursos'
  //        estadoTabla        -> 'estado-tabla'
  //        selectorCurso      -> 'filtro-curso'
  //        botonRestablecer   -> 'btn-restablecer'
  //   2. Escribe la red de seguridad: un if que compruebe con ! los SEIS
  //      primeros (botonRestablecer se comprueba más tarde, en la sección 6.b).
  //      Si falta alguno, haz
  //        console.warn('Analizador de calificaciones: falta algún elemento del HTML.');
  //        return;
  //      Ese return sale de la IIFE sin romper la página.
  //   (aprox. 20 líneas)

  // ============================================================
  // 3. UTILIDADES
  // ============================================================

  /**
   * escaparHtml(): convierte los caracteres peligrosos en su versión segura.
   *
   * Aquí los datos son nuestros y no hay riesgo, pero en una aplicación real
   * el nombre podría venir de un formulario o de una base de datos. Si alguien
   * escribe <script>...</script> como nombre y nosotros lo metemos con
   * innerHTML, ese código SE EJECUTARÍA. Eso se llama inyección XSS.
   * ✅ BUENA PRÁCTICA: escapar SIEMPRE cualquier texto que no controles antes
   * de insertarlo como HTML.
   */

  // TODO (en clase):
  //   1. Escribe function escaparHtml(texto) que devuelva String(texto) con
  //      cuatro .replace() encadenados y expresión regular global:
  //        /&/g  -> '&amp;'      (este PRIMERO, o rompería los siguientes)
  //        /</g  -> '&lt;'
  //        />/g  -> '&gt;'
  //        /"/g  -> '&quot;'
  //   (aprox. 7 líneas)

  /**
   * estaAprobado(): una sola definición de "aprobado" para toda la aplicación.
   * Si la regla cambia, cambia aquí y en ningún otro sitio.
   */

  // TODO (en clase):
  //   1. Escribe function estaAprobado(estudiante) que devuelva
  //      estudiante.nota >= NOTA_APROBACION.
  //   (aprox. 3 líneas)

  // ============================================================
  // 4. CÁLCULO: DE LOS DATOS AL LISTADO VISIBLE
  // ============================================================

  /**
   * obtenerListaVisible(): aplica el estado actual sobre los datos originales.
   * Es la TUBERÍA DE DATOS del archivo 03, aplicada a un caso real:
   *
   *    ESTUDIANTES -> filtrar por curso -> filtrar por estado -> ordenar
   *
   * Devuelve SIEMPRE un array nuevo; ESTUDIANTES no se toca jamás.
   */

  // TODO (en clase):
  //   1. Escribe function obtenerListaVisible() con tres pasos:
  //      Paso 1 · const porCurso = ESTUDIANTES.filter((estudiante) =>
  //        estado.curso === 'todos' || estudiante.curso === estado.curso)
  //        Si es 'todos', la condición siempre da true.
  //      Paso 2 · const funcionFiltro = FILTROS[estado.filtro] || FILTROS.todos;
  //        (el || es la red de seguridad si la clave no existiera)
  //        const filtrados = porCurso.filter(funcionFiltro);
  //      Paso 3 · const comparador = ORDENES[estado.orden];
  //        return comparador ? [...filtrados].sort(comparador) : filtrados;
  //        sort() MUTA, así que ordenamos sobre una copia. Aquí "filtrados" ya
  //        es un array nuevo creado por filter, así que ordenarlo sería seguro;
  //        usamos [...] de todas formas para que la costumbre quede grabada:
  //        antes de sort, copia.
  //   Resultado esperado: con el estado inicial devuelve los 14 estudiantes
  //   en su orden original.
  //   (aprox. 12 líneas)

  /**
   * calcularEstadisticas(): resume la lista con reduce.
   * Devuelve un objeto con todos los números que la interfaz necesita.
   * Si la lista está vacía devolvemos null y quien llame decidirá qué pintar.
   */

  // TODO (en clase):
  //   1. Escribe function calcularEstadisticas(lista). Empieza con la guarda:
  //      if (lista.length === 0) return null;
  //   2. (a) SUMA de notas con reduce y valor inicial 0 -> const sumaNotas.
  //      const promedio = sumaNotas / lista.length.
  //   3. (b) MÁXIMA y MÍNIMA con reduce SIN valor inicial, devolviendo el
  //      OBJETO completo (no solo el número), porque también queremos mostrar
  //      de quién es esa nota: const mejor y const peor.
  //   4. (c) CONTAR aprobados con reduce sumando 1 o 0 según estaAprobado()
  //      -> const aprobados. Y const reprobados = lista.length - aprobados.
  //      (Con filter(...).length se logra lo mismo; aquí lo hacemos con reduce
  //      para practicar el patrón "contador".)
  //   5. (d) const edadPromedio: otra suma con reduce dividida entre lista.length.
  //   6. (e) CANTIDAD POR CURSO: reduce hacia un OBJETO (patrón "agrupar").
  //      conteo[estudiante.curso] = (conteo[estudiante.curso] || 0) + 1;
  //      ⚠️ y el return conteo dentro de la callback, o la vuelta siguiente
  //      recibe undefined. Valor inicial {}. -> const porCurso.
  //   7. (f) PROMEDIO POR CURSO: const acumuladoPorCurso con reduce hacia
  //      { [curso]: { suma, cantidad } }, y después
  //      const promedioPorCurso = Object.entries(acumuladoPorCurso)
  //        .map(([curso, datos]) => ({ curso, cantidad: datos.cantidad,
  //             promedio: datos.suma / datos.cantidad }))
  //   8. Devuelve un objeto con EXACTAMENTE estas diez claves, porque el
  //      pintado las usa por nombre: total, promedio, mejor, peor, aprobados,
  //      reprobados, porcentajeAprobacion ((aprobados / lista.length) * 100),
  //      edadPromedio, porCurso y promedioPorCurso.
  //   Resultado esperado con los 14 estudiantes y sin filtros:
  //     total 14 · promedio 6.87 · máxima 9.6 (Elena Cruz) · mínima 2.5 (Tomás Aguirre)
  //     aprobados 9 · reprobados 5 · % aprobación 64 · edad media 20.4
  //   (aprox. 45 líneas)

  // ============================================================
  // 5. PINTADO: DE LOS DATOS AL HTML
  // ============================================================

  /**
   * construirTabla(): genera el HTML de la tabla con map() + join().
   *
   * ESTA ES LA IDEA CLAVE DEL PROYECTO:
   *   1. map() convierte cada objeto estudiante en un TEXTO con su <tr>.
   *   2. join('') pega todos esos textos en uno solo.
   *   3. innerHTML se lo entrega al navegador, que lo convierte en elementos.
   * Es el mismo mecanismo que usan por dentro los frameworks modernos.
   *
   * Las plantillas de texto (comillas invertidas) permiten escribir HTML
   * en varias líneas e insertar valores con ${...}. Mucho más legible
   * que concatenar con + por todas partes.
   */

  // TODO (en clase):
  //   1. Escribe function construirTabla(lista) que DEVUELVA un texto con HTML
  //      (no lo pinta ella: solo lo construye).
  //   2. Caso vacío primero: si lista.length === 0, devuelve
  //      '<p class="sin-datos">Ningún estudiante cumple los filtros seleccionados.</p>'
  //      Siempre hay que contemplarlo o el usuario ve un hueco en blanco sin
  //      explicación.
  //   3. const filas = lista.map((estudiante, indice) => { ... }).join('')
  //      Sin separador en el join: las filas van pegadas una detrás de otra.
  //      Dentro de la callback:
  //        const aprobado = estaAprobado(estudiante);
  //        const claseNota = aprobado ? 'nota-ok' : 'nota-mal';   // ternario
  //        const distintivo = aprobado
  //          ? '<span class="distintivo distintivo-ok">Aprobado</span>'
  //          : '<span class="distintivo distintivo-mal">Reprobado</span>';
  //      y devuelve un <tr> con SEIS <td> en este orden y con estas clases:
  //        <td class="col-num col-indice">   -> indice + 1
  //        <td class="nombre-estudiante">    -> escaparHtml(estudiante.nombre)
  //        <td>                              -> <span class="etiqueta-curso">curso escapado</span>
  //        <td class="col-num">              -> estudiante.edad
  //        <td class="col-num ${claseNota}"> -> <strong>${estudiante.nota.toFixed(1)}</strong>
  //        <td>                              -> ${distintivo}
  //   4. Devuelve la <table class="tabla-notas"> con su <thead> de seis <th>
  //      (#, Estudiante, Curso, Edad, Nota, Estado) y <tbody>${filas}</tbody>.
  //   (aprox. 38 líneas)

  /**
   * construirEstadisticas(): tarjetas con los números calculados por reduce.
   */

  // TODO (en clase):
  //   1. Escribe function construirEstadisticas(datos).
  //      Si !datos devuelve '<p class="sin-datos">Sin datos que resumir.</p>'.
  //   2. Define las tarjetas como un ARRAY de objetos { titulo, valor, clase }
  //      y píntalas con map. Añadir una estadística nueva será añadir un objeto
  //      a esta lista. Son OCHO, en este orden:
  //        'Estudiantes'   datos.total                          clase ''
  //        'Promedio'      datos.promedio.toFixed(2)            clase 'acento'
  //        'Nota máxima'   datos.mejor.nota.toFixed(1)          clase 'exito'
  //        'Nota mínima'   datos.peor.nota.toFixed(1)           clase 'error'
  //        'Aprobados'     datos.aprobados                      clase 'exito'
  //        'Reprobados'    datos.reprobados                     clase 'error'
  //        '% aprobación'  datos.porcentajeAprobacion.toFixed(0) + '%'   clase 'alerta'
  //        'Edad media'    datos.edadPromedio.toFixed(1)        clase ''
  //   3. Devuelve tarjetas.map(...).join('') generando por cada una:
  //        <div class="estadistica ${tarjeta.clase}">
  //          <span class="valor">${tarjeta.valor}</span>
  //          <span class="titulo">${tarjeta.titulo}</span>
  //        </div>
  //   (aprox. 28 líneas)

  /**
   * construirPanelCursos(): una pastilla por curso, con su recuento y promedio.
   * Ordenamos alfabéticamente con localeCompare para que el orden sea estable
   * y no dependa de cómo estuvieran escritos los datos.
   */

  // TODO (en clase):
  //   1. Escribe function construirPanelCursos(datos). Si !datos devuelve ''.
  //   2. Encadena sobre datos.promedioPorCurso:
  //        .slice()                                        // copia antes de ordenar (sort muta)
  //        .sort((a, b) => a.curso.localeCompare(b.curso, 'es'))
  //        .map((fila) => `...`)
  //        .join('')
  //      Cada pastilla es:
  //        <div class="pastilla-curso">
  //          <span>${escaparHtml(fila.curso)}</span>
  //          <strong>${fila.cantidad}</strong>
  //          <span>estudiantes · media ${fila.promedio.toFixed(2)}</span>
  //        </div>
  //   Resultado esperado sin filtros: Bases de Datos 4 · Front End 6 · Redes 4.
  //   (aprox. 15 líneas)

  /**
   * actualizarVista(): el "director de orquesta".
   * Se llama después de CUALQUIER cambio de estado y repinta todo.
   */

  // TODO (en clase):
  //   1. Escribe function actualizarVista() sin parámetros:
  //        const lista = obtenerListaVisible();
  //        const datos = calcularEstadisticas(lista);
  //   2. Vuelca los tres HTML con innerHTML, en este orden:
  //        contenedorTabla.innerHTML = construirTabla(lista);
  //        panelEstadisticas.innerHTML = construirEstadisticas(datos);
  //        panelCursos.innerHTML = construirPanelCursos(datos);
  //   3. Línea de estado con textContent (NO innerHTML: es texto plano):
  //        const descripcionCurso = estado.curso === 'todos' ? 'todos los cursos' : estado.curso;
  //        estadoTabla.textContent = 'Mostrando ' + lista.length + ' de ' +
  //          ESTUDIANTES.length + ' estudiantes · filtro: ' + estado.filtro +
  //          ' · curso: ' + descripcionCurso + ' · orden: ' + estado.orden;
  //   4. Deja también el resultado en la consola del navegador:
  //        console.log('--- Analizador de calificaciones ---');
  //        console.table(lista);   // dibuja una tabla preciosa: pruébalo en clase (F12)
  //        console.log('Estadísticas:', datos);
  //   Resultado esperado en pantalla al arrancar:
  //     Mostrando 14 de 14 estudiantes · filtro: todos · curso: todos los cursos · orden: original
  //   (aprox. 18 líneas)

  /**
   * marcarBotonActivo(): resalta el botón pulsado dentro de su propio grupo.
   * Recorremos los botones hermanos quitando la clase y se la ponemos solo al
   * elegido. Es el patrón clásico de "pestañas".
   */

  // TODO (en clase):
  //   1. Escribe function marcarBotonActivo(botonPulsado, atributo):
  //        const hermanos = Array.from(
  //          panelControles.querySelectorAll('[data-' + atributo + ']'));
  //      querySelectorAll devuelve una NodeList; Array.from la convierte en
  //      array para poder usar forEach con total comodidad (archivo 04, sección 6).
  //        hermanos.forEach((boton) => boton.classList.remove('activo'));
  //        botonPulsado.classList.add('activo');
  //   (aprox. 6 líneas)

  // ============================================================
  // 6. ARRANQUE E INTERACCIÓN
  // ============================================================

  /**
   * poblarSelectorCursos(): rellena el <select> con los cursos SIN repetir.
   * Aquí se ve el valor práctico de Set:
   *   1. map extrae el curso de cada estudiante -> hay repetidos.
   *   2. new Set(...) elimina los duplicados.
   *   3. [...] lo devuelve a array para poder ordenarlo y mapearlo.
   */

  // TODO (en clase):
  //   1. Escribe function poblarSelectorCursos():
  //        const cursosUnicos = [...new Set(ESTUDIANTES.map((e) => e.curso))]
  //          .sort((a, b) => a.localeCompare(b, 'es'));
  //        const opciones = ['todos'].concat(cursosUnicos);
  //   2. selectorCurso.innerHTML = opciones.map((curso) => {
  //        const etiqueta = curso === 'todos' ? 'Todos los cursos' : curso;
  //        return `<option value="${escaparHtml(curso)}">${escaparHtml(etiqueta)}</option>`;
  //      }).join('');
  //   Resultado esperado: el <select> pasa de vacío a tener CUATRO opciones:
  //     Todos los cursos · Bases de Datos · Front End · Redes
  //   (aprox. 14 líneas)

  // ------------------------------------------------------------
  // 6.b) Eventos
  // ------------------------------------------------------------
  // DELEGACIÓN DE EVENTOS: en lugar de añadir un listener a cada botón,
  // ponemos UNO solo en el contenedor. Cuando se hace clic dentro, el evento
  // "burbujea" hacia arriba y llega al panel; ahí miramos quién lo originó
  // (event.target) y actuamos. Menos código y funciona incluso con botones
  // que se añadan más tarde.

  // TODO (en clase):
  //   1. panelControles.addEventListener('click', (evento) => { ... }):
  //        const boton = evento.target.closest('button');
  //      closest('button') sube desde el elemento pulsado hasta el <button> más
  //      cercano; así funciona aunque se pulse el texto de dentro del botón.
  //        if (!boton) return;   // El clic fue en un hueco del panel.
  //   2. Si boton.dataset.filtro (lee el atributo data-filtro="..." del HTML):
  //        estado.filtro = boton.dataset.filtro;
  //        marcarBotonActivo(boton, 'filtro');
  //        actualizarVista();
  //        return;
  //   3. Lo mismo para boton.dataset.orden con estado.orden y 'orden'.
  //   4. El <select> no usa 'click' sino 'change', que se dispara cuando se
  //      elige una opción distinta:
  //        selectorCurso.addEventListener('change', () => {
  //          estado.curso = selectorCurso.value; actualizarVista(); });
  //   5. Botón restablecer (comprueba antes if (botonRestablecer)):
  //      al hacer clic devuelve estado.filtro a 'todos', estado.orden a
  //      'original', estado.curso a 'todos' y selectorCurso.value a 'todos';
  //      después busca con panelControles.querySelector('[data-filtro="todos"]')
  //      y '[data-orden="original"]', llama a marcarBotonActivo con cada uno si
  //      existe, y termina con actualizarVista().
  //   (aprox. 45 líneas)

  // ------------------------------------------------------------
  // 6.c) Primera ejecución
  // ------------------------------------------------------------
  // El script se carga con defer, así que el HTML ya está construido y podemos
  // pintar directamente. Primero llenamos el selector y después dibujamos todo.

  // TODO (en clase):
  //   1. Llama a poblarSelectorCursos() y después a actualizarVista().
  //      Este par de líneas es lo que hace que la página deje de mostrar
  //      "Cargando datos..." y aparezca la tabla completa.
  //   (aprox. 2 líneas)

  /* ============================================================================
   * EJERCICIOS PROPUESTOS (sección 5 · proyecto)
   * ----------------------------------------------------------------------------
   * 1. Añade dos botones de ordenación nuevos: "Nombre Z-A" y "Edad descendente".
   *    Pista: solo hay que añadir el <button data-orden="..."> en el HTML y una
   *    línea en el objeto ORDENES. No hace falta tocar nada más.
   *
   * 2. Añade una tarjeta de estadística que muestre la MEDIANA de las notas
   *    (el valor central de la lista ordenada; si hay un número par de notas,
   *    el promedio de las dos centrales). Deberás ordenar una copia del array.
   *
   * 3. Añade un campo de búsqueda por nombre (<input type="text">) que filtre
   *    la tabla mientras se escribe. Pista: escucha el evento 'input', guarda
   *    el texto en estado.busqueda y añade un filter con
   *    nombre.toLowerCase().includes(busqueda.toLowerCase()).
   *
   * 4. Muestra el nombre del mejor y del peor estudiante debajo de las
   *    estadísticas (ya los calcula reduce y viajan en datos.mejor y datos.peor;
   *    solo falta pintarlos).
   *
   * 5. Añade una columna "Posición" que muestre el puesto de cada estudiante en
   *    el ranking GENERAL por nota, sin importar el filtro aplicado.
   *    Pista: calcula una vez el ranking completo con sort sobre una copia de
   *    ESTUDIANTES y usa findIndex para localizar a cada uno.
   *
   * 6. Reto final: exporta la lista visible como texto CSV en la consola,
   *    con map + join('\n') y las columnas separadas por punto y coma.
   * ============================================================================ */
})();
