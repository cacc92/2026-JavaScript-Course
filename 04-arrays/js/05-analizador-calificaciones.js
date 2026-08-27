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
  const estado = {
    filtro: 'todos', // todos | aprobados | reprobados | destacados
    orden: 'original', // original | nota-desc | nota-asc | nombre-asc | edad-asc
    curso: 'todos', // 'todos' o el nombre de un curso concreto
  };

  // ------------------------------------------------------------
  // 1.c) CATÁLOGO DE FILTROS
  // ------------------------------------------------------------
  // En vez de una cadena de if / else if, guardamos cada filtro como una
  // función dentro de un objeto. La clave coincide con el atributo
  // data-filtro del botón en el HTML.
  // Ventaja: añadir un filtro nuevo es añadir UNA línea aquí y un botón allí,
  // sin tocar la lógica. Este patrón se llama "tabla de despacho".
  const FILTROS = {
    todos: () => true, // No descarta a nadie.
    aprobados: (estudiante) => estudiante.nota >= NOTA_APROBACION,
    reprobados: (estudiante) => estudiante.nota < NOTA_APROBACION,
    destacados: (estudiante) => estudiante.nota >= NOTA_DESTACADA,
  };

  // ------------------------------------------------------------
  // 1.d) CATÁLOGO DE COMPARADORES PARA sort()
  // ------------------------------------------------------------
  // Recuerda del archivo 04: el comparador devuelve un número negativo,
  // cero o positivo. Para números se usa la resta; para textos, localeCompare
  // con el idioma 'es' para que las tildes y las mayúsculas se ordenen bien.
  const ORDENES = {
    'nota-desc': (a, b) => b.nota - a.nota,
    'nota-asc': (a, b) => a.nota - b.nota,
    'nombre-asc': (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
    // Doble criterio: por edad y, si empatan, alfabéticamente por nombre.
    'edad-asc': (a, b) => a.edad - b.edad || a.nombre.localeCompare(b.nombre, 'es'),
  };
  // Nota sobre el operador || de la última línea: si (a.edad - b.edad) da 0
  // (empate, valor "falso"), JavaScript evalúa la parte derecha y devuelve el
  // desempate por nombre. Es una forma muy compacta de encadenar criterios.

  // ============================================================
  // 2. REFERENCIAS AL HTML
  // ============================================================
  // Las buscamos UNA sola vez al arrancar y las guardamos en constantes.
  // ✅ BUENA PRÁCTICA: no llamar a getElementById dentro de un bucle o en cada
  // repintado; buscar en el documento tiene un coste y aquí no cambia nunca.
  const panelControles = document.getElementById('panel-controles');
  const contenedorTabla = document.getElementById('contenedor-tabla');
  const panelEstadisticas = document.getElementById('panel-estadisticas');
  const panelCursos = document.getElementById('panel-cursos');
  const estadoTabla = document.getElementById('estado-tabla');
  const selectorCurso = document.getElementById('filtro-curso');
  const botonRestablecer = document.getElementById('btn-restablecer');

  // Si por lo que sea faltara algún elemento (por ejemplo, si copias este JS a
  // otra página), salimos sin hacer nada en lugar de romper con un error.
  // ✅ Comprobamos TODOS los que se usan después, no solo algunos: si faltara
  // panelCursos o estadoTabla, actualizarVista() reventaría con
  // "Cannot set properties of null".
  if (
    !panelControles ||
    !contenedorTabla ||
    !panelEstadisticas ||
    !panelCursos ||
    !estadoTabla ||
    !selectorCurso
  ) {
    console.warn('Analizador de calificaciones: falta algún elemento del HTML.');
    return;
  }

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
  function escaparHtml(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * estaAprobado(): una sola definición de "aprobado" para toda la aplicación.
   * Si la regla cambia, cambia aquí y en ningún otro sitio.
   */
  function estaAprobado(estudiante) {
    return estudiante.nota >= NOTA_APROBACION;
  }

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
  function obtenerListaVisible() {
    // Paso 1: filtro por curso. Si es 'todos', la función siempre da true.
    const porCurso = ESTUDIANTES.filter(
      (estudiante) => estado.curso === 'todos' || estudiante.curso === estado.curso
    );

    // Paso 2: filtro por estado (aprobados, reprobados, destacados...).
    // Sacamos la función del catálogo; si la clave no existiera usamos "todos"
    // como red de seguridad.
    const funcionFiltro = FILTROS[estado.filtro] || FILTROS.todos;
    const filtrados = porCurso.filter(funcionFiltro);

    // Paso 3: ordenación. sort() MUTA, así que ordenamos sobre una copia.
    // Aquí "filtrados" ya es un array nuevo creado por filter, así que ordenarlo
    // sería seguro; usamos [...] de todas formas para que la costumbre quede
    // grabada: antes de sort, copia.
    const comparador = ORDENES[estado.orden];
    return comparador ? [...filtrados].sort(comparador) : filtrados;
  }

  /**
   * calcularEstadisticas(): resume la lista con reduce.
   * Devuelve un objeto con todos los números que la interfaz necesita.
   * Si la lista está vacía devolvemos null y quien llame decidirá qué pintar.
   */
  function calcularEstadisticas(lista) {
    if (lista.length === 0) return null;

    // (a) SUMA de notas -> de ahí sale el promedio. Valor inicial 0.
    const sumaNotas = lista.reduce((total, estudiante) => total + estudiante.nota, 0);
    const promedio = sumaNotas / lista.length;

    // (b) MÁXIMA y MÍNIMA. Devolvemos el OBJETO completo, no solo el número,
    // porque también queremos mostrar de quién es esa nota.
    const mejor = lista.reduce((campeon, estudiante) =>
      estudiante.nota > campeon.nota ? estudiante : campeon
    );
    const peor = lista.reduce((farolillo, estudiante) =>
      estudiante.nota < farolillo.nota ? estudiante : farolillo
    );

    // (c) CONTAR aprobados con reduce: sumamos 1 cuando la condición se cumple
    // y 0 cuando no. (Con filter(...).length se logra lo mismo; aquí lo hacemos
    // con reduce para practicar el patrón "contador".)
    const aprobados = lista.reduce(
      (contador, estudiante) => contador + (estaAprobado(estudiante) ? 1 : 0),
      0
    );
    const reprobados = lista.length - aprobados;

    // (d) EDAD PROMEDIO, otra suma con reduce.
    const edadPromedio =
      lista.reduce((total, estudiante) => total + estudiante.edad, 0) / lista.length;

    // (e) CANTIDAD POR CURSO: reduce hacia un OBJETO (el patrón "agrupar").
    // El acumulador empieza siendo {} y va ganando una clave por cada curso.
    const porCurso = lista.reduce((conteo, estudiante) => {
      conteo[estudiante.curso] = (conteo[estudiante.curso] || 0) + 1;
      return conteo; // ⚠️ Sin este return, la siguiente vuelta recibe undefined.
    }, {});

    // (f) PROMEDIO POR CURSO: agrupamos sumas y cantidades, y dividimos al final.
    const acumuladoPorCurso = lista.reduce((acumulado, estudiante) => {
      if (!acumulado[estudiante.curso]) {
        acumulado[estudiante.curso] = { suma: 0, cantidad: 0 };
      }
      acumulado[estudiante.curso].suma += estudiante.nota;
      acumulado[estudiante.curso].cantidad += 1;
      return acumulado;
    }, {});

    // Object.entries convierte el objeto en un array de pares [clave, valor],
    // y con destructuring + map lo transformamos en algo cómodo de pintar.
    const promedioPorCurso = Object.entries(acumuladoPorCurso).map(([curso, datos]) => ({
      curso: curso,
      cantidad: datos.cantidad,
      promedio: datos.suma / datos.cantidad,
    }));

    return {
      total: lista.length,
      promedio: promedio,
      mejor: mejor,
      peor: peor,
      aprobados: aprobados,
      reprobados: reprobados,
      porcentajeAprobacion: (aprobados / lista.length) * 100,
      edadPromedio: edadPromedio,
      porCurso: porCurso,
      promedioPorCurso: promedioPorCurso,
    };
  }

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
   */
  function construirTabla(lista) {
    // Caso vacío: ningún estudiante cumple el filtro. Siempre hay que
    // contemplarlo o el usuario ve un hueco en blanco sin explicación.
    if (lista.length === 0) {
      return '<p class="sin-datos">Ningún estudiante cumple los filtros seleccionados.</p>';
    }

    const filas = lista
      .map((estudiante, indice) => {
        const aprobado = estaAprobado(estudiante);
        // Operador ternario: condicion ? valorSiVerdadero : valorSiFalso.
        const claseNota = aprobado ? 'nota-ok' : 'nota-mal';
        const distintivo = aprobado
          ? '<span class="distintivo distintivo-ok">Aprobado</span>'
          : '<span class="distintivo distintivo-mal">Reprobado</span>';

        // Las plantillas de texto (comillas invertidas) permiten escribir HTML
        // en varias líneas e insertar valores con ${...}. Mucho más legible
        // que concatenar con + por todas partes.
        return `
          <tr>
            <td class="col-num col-indice">${indice + 1}</td>
            <td class="nombre-estudiante">${escaparHtml(estudiante.nombre)}</td>
            <td><span class="etiqueta-curso">${escaparHtml(estudiante.curso)}</span></td>
            <td class="col-num">${estudiante.edad}</td>
            <td class="col-num ${claseNota}"><strong>${estudiante.nota.toFixed(1)}</strong></td>
            <td>${distintivo}</td>
          </tr>`;
      })
      .join(''); // Sin separador: las filas van pegadas una detrás de otra.

    return `
      <table class="tabla-notas">
        <thead>
          <tr>
            <th>#</th>
            <th>Estudiante</th>
            <th>Curso</th>
            <th>Edad</th>
            <th>Nota</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>`;
  }

  /**
   * construirEstadisticas(): tarjetas con los números calculados por reduce.
   */
  function construirEstadisticas(datos) {
    if (!datos) {
      return '<p class="sin-datos">Sin datos que resumir.</p>';
    }

    // Definimos las tarjetas como un ARRAY de objetos y las pintamos con map.
    // Añadir una estadística nueva es añadir un objeto a esta lista.
    const tarjetas = [
      { titulo: 'Estudiantes', valor: datos.total, clase: '' },
      { titulo: 'Promedio', valor: datos.promedio.toFixed(2), clase: 'acento' },
      { titulo: 'Nota máxima', valor: datos.mejor.nota.toFixed(1), clase: 'exito' },
      { titulo: 'Nota mínima', valor: datos.peor.nota.toFixed(1), clase: 'error' },
      { titulo: 'Aprobados', valor: datos.aprobados, clase: 'exito' },
      { titulo: 'Reprobados', valor: datos.reprobados, clase: 'error' },
      {
        titulo: '% aprobación',
        valor: datos.porcentajeAprobacion.toFixed(0) + '%',
        clase: 'alerta',
      },
      { titulo: 'Edad media', valor: datos.edadPromedio.toFixed(1), clase: '' },
    ];

    return tarjetas
      .map(
        (tarjeta) => `
          <div class="estadistica ${tarjeta.clase}">
            <span class="valor">${tarjeta.valor}</span>
            <span class="titulo">${tarjeta.titulo}</span>
          </div>`
      )
      .join('');
  }

  /**
   * construirPanelCursos(): una pastilla por curso, con su recuento y promedio.
   * Ordenamos alfabéticamente con localeCompare para que el orden sea estable
   * y no dependa de cómo estuvieran escritos los datos.
   */
  function construirPanelCursos(datos) {
    if (!datos) return '';

    return datos.promedioPorCurso
      .slice() // Copia antes de ordenar (sort muta).
      .sort((a, b) => a.curso.localeCompare(b.curso, 'es'))
      .map(
        (fila) => `
          <div class="pastilla-curso">
            <span>${escaparHtml(fila.curso)}</span>
            <strong>${fila.cantidad}</strong>
            <span>estudiantes · media ${fila.promedio.toFixed(2)}</span>
          </div>`
      )
      .join('');
  }

  /**
   * actualizarVista(): el "director de orquesta".
   * Se llama después de CUALQUIER cambio de estado y repinta todo.
   */
  function actualizarVista() {
    const lista = obtenerListaVisible();
    const datos = calcularEstadisticas(lista);

    contenedorTabla.innerHTML = construirTabla(lista);
    panelEstadisticas.innerHTML = construirEstadisticas(datos);
    panelCursos.innerHTML = construirPanelCursos(datos);

    // Línea de estado: cuántos se muestran y con qué criterios.
    const descripcionCurso = estado.curso === 'todos' ? 'todos los cursos' : estado.curso;
    estadoTabla.textContent =
      'Mostrando ' + lista.length + ' de ' + ESTUDIANTES.length + ' estudiantes' +
      ' · filtro: ' + estado.filtro +
      ' · curso: ' + descripcionCurso +
      ' · orden: ' + estado.orden;

    // Además dejamos el resultado en la consola del navegador. console.table
    // dibuja una tabla preciosa con arrays de objetos: pruébalo en clase (F12).
    console.log('--- Analizador de calificaciones ---');
    console.table(lista);
    console.log('Estadísticas:', datos);
  }

  /**
   * marcarBotonActivo(): resalta el botón pulsado dentro de su propio grupo.
   * Recorremos los botones hermanos quitando la clase y se la ponemos solo al
   * elegido. Es el patrón clásico de "pestañas".
   */
  function marcarBotonActivo(botonPulsado, atributo) {
    // querySelectorAll devuelve una NodeList; Array.from la convierte en array
    // para poder usar forEach con total comodidad (archivo 04, sección 6).
    const hermanos = Array.from(panelControles.querySelectorAll('[data-' + atributo + ']'));
    hermanos.forEach((boton) => boton.classList.remove('activo'));
    botonPulsado.classList.add('activo');
  }

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
  function poblarSelectorCursos() {
    const cursosUnicos = [...new Set(ESTUDIANTES.map((estudiante) => estudiante.curso))].sort(
      (a, b) => a.localeCompare(b, 'es')
    );

    const opciones = ['todos'].concat(cursosUnicos);

    selectorCurso.innerHTML = opciones
      .map((curso) => {
        const etiqueta = curso === 'todos' ? 'Todos los cursos' : curso;
        return `<option value="${escaparHtml(curso)}">${escaparHtml(etiqueta)}</option>`;
      })
      .join('');
  }

  // ------------------------------------------------------------
  // 6.b) Eventos
  // ------------------------------------------------------------
  // DELEGACIÓN DE EVENTOS: en lugar de añadir un listener a cada botón,
  // ponemos UNO solo en el contenedor. Cuando se hace clic dentro, el evento
  // "burbujea" hacia arriba y llega al panel; ahí miramos quién lo originó
  // (event.target) y actuamos. Menos código y funciona incluso con botones
  // que se añadan más tarde.
  panelControles.addEventListener('click', (evento) => {
    // closest('button') sube desde el elemento pulsado hasta el <button> más
    // cercano; así funciona aunque se pulse el texto de dentro del botón.
    const boton = evento.target.closest('button');
    if (!boton) return; // El clic fue en un hueco del panel: no hacemos nada.

    // dataset.filtro lee el atributo data-filtro="..." del HTML.
    if (boton.dataset.filtro) {
      estado.filtro = boton.dataset.filtro;
      marcarBotonActivo(boton, 'filtro');
      actualizarVista();
      return;
    }

    if (boton.dataset.orden) {
      estado.orden = boton.dataset.orden;
      marcarBotonActivo(boton, 'orden');
      actualizarVista();
      return;
    }
  });

  // El <select> no usa 'click' sino el evento 'change', que se dispara cuando
  // se elige una opción distinta.
  selectorCurso.addEventListener('change', () => {
    estado.curso = selectorCurso.value;
    actualizarVista();
  });

  // Botón restablecer: devolvemos el estado a sus valores iniciales,
  // reponemos la marca visual de los botones y repintamos.
  if (botonRestablecer) {
    botonRestablecer.addEventListener('click', () => {
      estado.filtro = 'todos';
      estado.orden = 'original';
      estado.curso = 'todos';
      selectorCurso.value = 'todos';

      const filtroTodos = panelControles.querySelector('[data-filtro="todos"]');
      const ordenOriginal = panelControles.querySelector('[data-orden="original"]');
      if (filtroTodos) marcarBotonActivo(filtroTodos, 'filtro');
      if (ordenOriginal) marcarBotonActivo(ordenOriginal, 'orden');

      actualizarVista();
    });
  }

  // ------------------------------------------------------------
  // 6.c) Primera ejecución
  // ------------------------------------------------------------
  // El script se carga con defer, así que el HTML ya está construido y podemos
  // pintar directamente. Primero llenamos el selector y después dibujamos todo.
  poblarSelectorCursos();
  actualizarVista();

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
