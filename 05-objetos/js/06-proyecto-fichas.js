/**
 * ============================================================================
 * ARCHIVO: js/06-proyecto-fichas.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * PROYECTO PRACTICO: "FICHAS DE ESTUDIANTES"
 *
 * Aquí juntamos TODO lo aprendido en los archivos 01 a 05:
 *   - Un array de objetos con datos anidados (contacto, dirección, notas).
 *   - Una función que crea cada tarjeta usando DESTRUCTURING EN LOS PARAMETROS.
 *   - ENCADENAMIENTO OPCIONAL (?.) y FUSION NULA (??) para los datos que
 *     pueden faltar: ningún estudiante tiene la ficha completa.
 *   - map / reduce / filter sobre el array de objetos.
 *   - Un Set para calcular las ciudades sin repetir.
 *   - Dos botones: uno muestra el JSON formateado y otro lo vuelve a parsear.
 *
 * IDEA DIDACTICA: los datos vienen "sucios", como en la vida real. El código
 * NO debe romperse porque a alguien le falte el teléfono.
 * ============================================================================
 */

(function () {
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-proyecto');
  const { escaparHTML } = window.Utilidades;

  // ==========================================================================
  // 1. LOS DATOS: UN ARRAY DE OBJETOS CON ANIDACION
  // ==========================================================================
  /*
   * Fíjate en las diferencias entre las fichas:
   *   - Diego no tiene objeto `contacto`.
   *   - Sofía tiene contacto pero no teléfono.
   *   - Martín no tiene redes sociales.
   *   - Camila no tiene notas todavía.
   * Esto es EXACTAMENTE lo que pasa con los datos reales de un servidor.
   */
  const estudiantes = [
    {
      id: 1,
      nombre: 'Lucía',
      apellido: 'Ferreira',
      edad: 21,
      activo: true,
      fechaAlta: new Date('2026-03-02T09:00:00Z'),
      contacto: {
        email: 'lucia.ferreira@example.com',
        telefono: '+598 99 123 456',
        redes: { github: 'luciafe' },
      },
      direccion: { calle: 'Av. Italia 1234', ciudad: 'Montevideo', pais: 'Uruguay' },
      notas: [
        { asignatura: 'HTML y CSS', nota: 9 },
        { asignatura: 'JavaScript', nota: 8.5 },
        { asignatura: 'Git', nota: 10 },
      ],
    },
    {
      id: 2,
      nombre: 'Martín',
      apellido: 'Rodríguez',
      edad: 27,
      activo: true,
      fechaAlta: new Date('2026-03-05T09:00:00Z'),
      contacto: {
        email: 'martin.rodriguez@example.com',
        telefono: '+598 91 555 001',
        // sin redes
      },
      direccion: { ciudad: 'Salto', pais: 'Uruguay' }, // sin calle
      notas: [
        { asignatura: 'HTML y CSS', nota: 7 },
        { asignatura: 'JavaScript', nota: 5.5 },
        { asignatura: 'Git', nota: 8 },
      ],
    },
    {
      id: 3,
      nombre: 'Sofía',
      apellido: 'Méndez',
      edad: 19,
      activo: true,
      fechaAlta: new Date('2026-03-06T09:00:00Z'),
      contacto: {
        email: 'sofia.mendez@example.com',
        // sin teléfono
        redes: { github: 'sofimendez' },
      },
      direccion: { calle: 'Bulevar Artigas 900', ciudad: 'Montevideo', pais: 'Uruguay' },
      notas: [
        { asignatura: 'HTML y CSS', nota: 10 },
        { asignatura: 'JavaScript', nota: 9.4 },
        { asignatura: 'Git', nota: 9 },
      ],
    },
    {
      id: 4,
      nombre: 'Diego',
      apellido: 'Pereyra',
      edad: 24,
      activo: false,
      fechaAlta: new Date('2026-03-08T09:00:00Z'),
      // sin objeto contacto entero
      direccion: { ciudad: 'Paysandú', pais: 'Uruguay' },
      notas: [
        { asignatura: 'HTML y CSS', nota: 4.5 },
        { asignatura: 'JavaScript', nota: 6 },
      ],
    },
    {
      id: 5,
      nombre: 'Camila',
      apellido: 'Suárez',
      edad: 22,
      activo: true,
      fechaAlta: new Date('2026-03-11T09:00:00Z'),
      contacto: { email: 'camila.suarez@example.com', telefono: '+598 94 777 222' },
      // sin dirección
      // sin notas: todavía no rindió nada
    },
  ];

  // ==========================================================================
  // 2. FUNCIONES AUXILIARES
  // ==========================================================================

  /**
   * calcularPromedio(): recibe el array de notas y devuelve el promedio.
   * Si el array está vacío o no existe, devuelve null (y NO NaN, que sería
   * un valor difícil de mostrar).
   */
  function calcularPromedio(notas = []) {
    // ?. protege por si llega undefined; ?? convierte ese undefined en 0.
    if ((notas?.length ?? 0) === 0) return null;

    const suma = notas.reduce((acumulado, { nota }) => acumulado + nota, 0);
    return suma / notas.length;
  }

  /**
   * obtenerIniciales(): construye el avatar de texto (por ejemplo "LF").
   * Usa ?. porque el apellido podría no venir.
   */
  function obtenerIniciales(nombre, apellido) {
    const primera = nombre?.[0] ?? '?';   // ?.[ ] sobre un string: devuelve su primera letra
    const segunda = apellido?.[0] ?? '';
    return (primera + segunda).toUpperCase();
  }

  /**
   * claseSegunNota(): devuelve la clase CSS que le corresponde a una nota.
   * Es una función "pura": mismos datos de entrada, mismo resultado.
   */
  function claseSegunNota(nota) {
    if (nota >= 9) return 'pastilla pastilla--exito';
    if (nota >= 7) return 'pastilla';
    if (nota >= 6) return 'pastilla pastilla--alerta';
    return 'pastilla pastilla--error';
  }

  // ==========================================================================
  // 3. LA FUNCION ESTRELLA: crearTarjeta CON DESTRUCTURING EN PARAMETROS
  // ==========================================================================
  /**
   * crearTarjeta(): recibe UN objeto estudiante y devuelve el HTML de su ficha.
   *
   * Todo el trabajo de "abrir" el objeto está en la lista de parámetros:
   *   - Sacamos nombre, apellido, edad y activo del primer nivel.
   *   - Bajamos a `contacto` y a `direccion` con destructuring ANIDADO.
   *   - `= {}` en cada nivel anidado evita el error cuando ese objeto no viene
   *     (le pasa a Diego con contacto y a Camila con direccion).
   *   - `notas = []` da un array vacío por defecto.
   *
   * Al leer la firma se sabe de un vistazo qué datos necesita la función.
   *
   * @param {object} estudiante ficha completa o parcial de un estudiante
   * @returns {string} HTML de la tarjeta
   */
  function crearTarjeta({
    nombre,
    apellido = '',
    edad,
    activo = true,
    contacto: { email, telefono, redes } = {},
    direccion: { calle, ciudad, pais } = {},
    notas = [],
  }) {
    // Datos calculados a partir de lo anterior.
    const promedio = calcularPromedio(notas);
    const iniciales = obtenerIniciales(nombre, apellido);

    // ?. para bajar a un nivel que puede no existir + ?? para el texto final.
    const usuarioGithub = redes?.github ?? null;

    // Construimos la dirección solo con las partes que existen.
    // filter(Boolean) elimina los undefined y las cadenas vacías del array.
    const direccionTexto = [calle, ciudad, pais].filter(Boolean).join(', ');

    // Las pastillas de notas se generan con map() y se unen con join('').
    const pastillasNotas = notas
      .map(
        ({ asignatura, nota }) =>
          `<span class="${claseSegunNota(nota)}" title="${escaparHTML(asignatura)}">
             ${escaparHTML(asignatura)}: ${nota}
           </span>`
      )
      .join('');

    /*
     * ✅ BUENA PRÁCTICA: TODO dato que venga de fuera se pasa por escaparHTML()
     * antes de meterlo en innerHTML. Así un nombre con "<" nunca se interpreta
     * como una etiqueta HTML.
     */
    return `
      <article class="ficha">
        <div class="ficha__cabecera">
          <div class="ficha__avatar">${escaparHTML(iniciales)}</div>
          <div>
            <h3 class="ficha__nombre">${escaparHTML(nombre)} ${escaparHTML(apellido)}</h3>
            <p class="ficha__meta">${edad ?? '--'} años · ${activo ? 'Activo' : 'Baja'}</p>
          </div>
        </div>

        <ul class="ficha__datos">
          <li><strong>Email:</strong> ${
            email ? escaparHTML(email) : '<span class="ficha__vacio">sin email</span>'
          }</li>
          <li><strong>Teléfono:</strong> ${
            telefono ? escaparHTML(telefono) : '<span class="ficha__vacio">sin teléfono</span>'
          }</li>
          <li><strong>Dirección:</strong> ${
            direccionTexto
              ? escaparHTML(direccionTexto)
              : '<span class="ficha__vacio">sin dirección</span>'
          }</li>
          <li><strong>GitHub:</strong> ${
            usuarioGithub
              ? '@' + escaparHTML(usuarioGithub)
              : '<span class="ficha__vacio">no indica</span>'
          }</li>
        </ul>

        <div class="ficha__notas">
          ${
            pastillasNotas ||
            '<span class="pastilla pastilla--alerta">Todavía sin notas</span>'
          }
        </div>

        <div class="ficha__pie">
          <span>${notas.length} asignatura(s)</span>
          <span>Promedio: ${promedio !== null ? promedio.toFixed(2) : '--'}</span>
        </div>
      </article>
    `;
  }

  // ==========================================================================
  // 4. RENDERIZAR TODAS LAS FICHAS
  // ==========================================================================
  /*
   * El patrón es siempre el mismo en front end:
   *   array de datos  ->  map(crearTarjeta)  ->  join('')  ->  innerHTML
   *
   * map() transforma cada objeto en un trozo de HTML, join('') los pega y
   * innerHTML los inserta de una sola vez (más rápido que insertar uno a uno).
   */
  function renderizarFichas(lista) {
    const contenedor = document.getElementById('lista-fichas');
    if (!contenedor) return; // defensa: si el HTML cambia, no rompemos nada

    contenedor.innerHTML = lista.map(crearTarjeta).join('');
  }

  renderizarFichas(estudiantes);

  // ==========================================================================
  // 5. ESTADISTICAS DEL GRUPO (map, filter, reduce y Set)
  // ==========================================================================
  titulo('Estadísticas del grupo');

  imprimir('Total de estudiantes ->', estudiantes.length);

  const activos = estudiantes.filter(({ activo }) => activo);
  imprimir('Estudiantes activos ->', activos.length);

  // Las ciudades, sin repetir: un Set resuelve el problema en una línea.
  // Con ?. evitamos el error en la ficha de Camila, que no tiene dirección.
  const ciudades = new Set(estudiantes.map(({ direccion }) => direccion?.ciudad ?? 'Sin ciudad'));
  imprimir('Ciudades distintas ->', ciudades);

  // Promedio general: solo cuentan quienes ya tienen notas.
  const promedios = estudiantes
    .map(({ notas }) => calcularPromedio(notas))
    .filter((promedio) => promedio !== null);

  const promedioGeneral = promedios.reduce((a, b) => a + b, 0) / promedios.length;
  imprimir('Promedio general del grupo ->', promedioGeneral.toFixed(2));

  // Quién tiene el promedio más alto (reduce comparando de a dos).
  const mejor = estudiantes.reduce((mejorHastaAhora, actual) => {
    const promedioActual = calcularPromedio(actual.notas) ?? -1;
    const promedioMejor = calcularPromedio(mejorHastaAhora.notas) ?? -1;
    return promedioActual > promedioMejor ? actual : mejorHastaAhora;
  });
  imprimir('Mejor promedio ->', `${mejor.nombre} ${mejor.apellido}`);

  // Quiénes NO tienen teléfono: encadenamiento opcional puro.
  const sinTelefono = estudiantes
    .filter((estudiante) => !estudiante.contacto?.telefono)
    .map(({ nombre }) => nombre);
  imprimir('Sin teléfono registrado ->', sinTelefono);

  imprimir('\nPulsa los botones de arriba para ver el JSON y volver a parsearlo.');

  // ==========================================================================
  // 6. BOTON 1: VER EL JSON FORMATEADO
  // ==========================================================================
  /*
   * JSON.stringify(datos, null, 2) genera el texto con indentación de 2
   * espacios. Es la forma más cómoda de inspeccionar una estructura de datos.
   */
  const botonJson = document.getElementById('btn-ver-json');

  // Guardamos el texto en una variable del ámbito de la IIFE para que el
  // segundo botón pueda usar exactamente el mismo texto.
  let jsonGenerado = '';

  // Usamos ?. también aquí: si algún día el botón desaparece del HTML, la
  // página no se rompe (getElementById devolvería null).
  botonJson?.addEventListener('click', () => {
    jsonGenerado = JSON.stringify(estudiantes, null, 2);

    titulo('JSON.stringify(estudiantes, null, 2)');
    imprimir('Tipo del resultado ->', typeof jsonGenerado, '| longitud:', jsonGenerado.length);
    imprimir(jsonGenerado);

    imprimir('\nFíjate en tres detalles:');
    imprimir('  a) Todas las claves quedaron entre comillas dobles.');
    imprimir('  b) Las fechas (Date) se convirtieron en texto ISO.');
    imprimir('  c) Las fichas incompletas simplemente NO traen esas claves.');
  });

  // ==========================================================================
  // 7. BOTON 2: VOLVER A PARSEAR EL JSON
  // ==========================================================================
  /*
   * JSON.parse reconstruye objetos NUEVOS a partir del texto. Aquí lo
   * comprobamos y, de paso, vemos qué se perdió por el camino.
   */
  const botonParsear = document.getElementById('btn-parsear-json');

  botonParsear?.addEventListener('click', () => {
    titulo('JSON.parse(texto)');

    // Si todavía no se pulsó el primer botón, generamos el texto ahora.
    if (!jsonGenerado) {
      jsonGenerado = JSON.stringify(estudiantes, null, 2);
      imprimir('(Se generó el JSON automáticamente porque aún no existía.)');
    }

    // ✅ BUENA PRÁCTICA: JSON.parse siempre dentro de try/catch.
    try {
      const recuperados = JSON.parse(jsonGenerado);

      imprimir('¿Es un array? ->', Array.isArray(recuperados));
      imprimir('Cantidad de fichas ->', recuperados.length);
      imprimir('Primera ficha recuperada ->', recuperados[0]);
      imprimir('Acceso anidado ->', recuperados[0].contacto?.redes?.github);

      // Comprobamos que son objetos DISTINTOS a los originales.
      imprimir('¿Es el mismo objeto que el original? ->', recuperados[0] === estudiantes[0]);
      imprimir('¿Tiene los mismos datos? ->', recuperados[0].nombre === estudiantes[0].nombre);

      // Lo que se perdió en el viaje: el Date dejó de ser un Date.
      imprimir('Original: fechaAlta es ->', estudiantes[0].fechaAlta instanceof Date ? 'un Date' : 'un string');
      imprimir('Recuperado: fechaAlta es ->', recuperados[0].fechaAlta instanceof Date ? 'un Date' : 'un string');
      imprimir('Para recuperar el Date hay que hacerlo a mano: new Date(texto).');

      const fechaReconstruida = new Date(recuperados[0].fechaAlta);
      imprimir('Fecha reconstruida (año) ->', fechaReconstruida.getFullYear());

      // El ciclo completo funciona: volvemos a dibujar las fichas con los
      // datos recuperados del texto.
      renderizarFichas(recuperados);
      imprimir('\nLas fichas de arriba se volvieron a dibujar con los datos parseados.');
    } catch (error) {
      imprimir('No se pudo parsear ->', error.name + ': ' + error.message);
    }
  });

  // ==========================================================================
  // EJERCICIOS PROPUESTOS (proyecto)
  // ==========================================================================
  /*
   * 1) Añade a cada ficha una línea con el país usando ?. y ?? para mostrar
   *    "país no informado" cuando falte.
   *
   * 2) Añade un botón "Solo activos" que vuelva a renderizar la lista
   *    filtrando con filter(({ activo }) => activo).
   *
   * 3) Añade un botón "Ordenar por promedio" que ordene las fichas de mayor a
   *    menor. Cuidado: sort() modifica el array original; usa [...estudiantes]
   *    para trabajar sobre una copia.
   *
   * 4) Crea una función `resumenPorCiudad(estudiantes)` que devuelva un Map
   *    con la ciudad como clave y la cantidad de estudiantes como valor.
   *    Muéstralo en la consola visual.
   *
   * 5) Añade un sexto estudiante SIN la propiedad `nombre` y comprueba qué
   *    pasa. Después protege la función crearTarjeta con un valor por defecto.
   *
   * 6) (Reto) Guarda el array en localStorage al pulsar un botón y recupéralo
   *    al cargar la página, reconstruyendo las fechas con un reviver.
   */
})();
