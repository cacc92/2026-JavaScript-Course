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
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE: el array `estudiantes` ya está escrito (teclearlo en
 * clase sería tiempo perdido). Lo que se escribe en vivo es TODA la lógica que
 * lo procesa y lo pinta en pantalla.
 *
 * MIENTRAS NO SE ESCRIBA NADA, el contenedor #lista-fichas se queda VACIO y la
 * consola visual #salida-proyecto también. Eso es lo esperado: no hay error.
 *
 * La solución completa está en ../../js/06-proyecto-fichas.js
 * ============================================================================
 */

(function () {
  // ANDAMIAJE (ya hecho): consola visual del proyecto y la utilidad de escapado.
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

  // DATOS DE PARTIDA (ya escritos, no se teclean en clase).
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

  // TODO (en clase) — escribe las tres funciones auxiliares:
  //
  //   a) calcularPromedio(notas = [])
  //      Recibe el array de notas (objetos { asignatura, nota }) y devuelve el
  //      promedio. Si el array está vacío o no existe devuelve null (¡no NaN!,
  //      que sería imposible de mostrar bien).
  //        - `if ((notas?.length ?? 0) === 0) return null;`   // ?. y ?? juntos
  //        - suma con reduce desestructurando en el parámetro:
  //          `notas.reduce((acumulado, { nota }) => acumulado + nota, 0)`
  //        - devuelve suma / notas.length
  //      (aprox. 5 lineas)
  //
  //   b) obtenerIniciales(nombre, apellido)
  //      Construye el avatar de texto ("LF"). Usa ?. porque el apellido podría
  //      no venir: `const primera = nombre?.[0] ?? '?';`
  //      `const segunda = apellido?.[0] ?? '';` y devuelve la suma en mayúsculas.
  //      (aprox. 4 lineas)
  //
  //   c) claseSegunNota(nota)
  //      Función PURA: mismos datos de entrada, mismo resultado. Devuelve la
  //      clase CSS que corresponde (esas clases YA existen en el CSS):
  //        nota >= 9  -> 'pastilla pastilla--exito'
  //        nota >= 7  -> 'pastilla'
  //        nota >= 6  -> 'pastilla pastilla--alerta'
  //        el resto   -> 'pastilla pastilla--error'
  //      (aprox. 6 lineas)

  // ==========================================================================
  // 3. LA FUNCION ESTRELLA: crearTarjeta CON DESTRUCTURING EN PARAMETROS
  // ==========================================================================
  /*
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
   */

  // TODO (en clase) — escribe `function crearTarjeta({ ... })`:
  //
  //   FIRMA (esto es lo importante de la sección, escríbela despacio):
  //     function crearTarjeta({
  //       nombre,
  //       apellido = '',
  //       edad,
  //       activo = true,
  //       contacto: { email, telefono, redes } = {},
  //       direccion: { calle, ciudad, pais } = {},
  //       notas = [],
  //     }) { ... }
  //
  //   CUERPO:
  //     1. `const promedio = calcularPromedio(notas);`
  //     2. `const iniciales = obtenerIniciales(nombre, apellido);`
  //     3. `const usuarioGithub = redes?.github ?? null;`
  //     4. `const direccionTexto = [calle, ciudad, pais].filter(Boolean).join(', ');`
  //        filter(Boolean) elimina los undefined y las cadenas vacías.
  //     5. `const pastillasNotas = notas.map(({ asignatura, nota }) => ...).join('');`
  //        cada pastilla es un <span class="${claseSegunNota(nota)}"
  //        title="${escaparHTML(asignatura)}">${escaparHTML(asignatura)}: ${nota}</span>
  //     6. Devuelve una plantilla de texto (`) con esta estructura EXACTA, porque
  //        las clases ya están estilizadas en el CSS:
  //          <article class="ficha">
  //            <div class="ficha__cabecera">
  //              <div class="ficha__avatar">iniciales</div>
  //              <div>
  //                <h3 class="ficha__nombre">nombre apellido</h3>
  //                <p class="ficha__meta">${edad ?? '--'} años · ${activo ? 'Activo' : 'Baja'}</p>
  //              </div>
  //            </div>
  //            <ul class="ficha__datos">   -> cuatro <li> con <strong>Email:</strong>,
  //                 Teléfono:, Dirección: y GitHub:. Cuando el dato falta, pon
  //                 <span class="ficha__vacio">sin email</span> (sin teléfono,
  //                 sin dirección, no indica). El GitHub va con '@' delante.
  //            </ul>
  //            <div class="ficha__notas">  -> pastillasNotas, o si está vacío
  //                 <span class="pastilla pastilla--alerta">Todavía sin notas</span>
  //            </div>
  //            <div class="ficha__pie">    -> dos <span>: "${notas.length} asignatura(s)"
  //                 y "Promedio: ${promedio !== null ? promedio.toFixed(2) : '--'}"
  //            </div>
  //          </article>
  //   (aprox. 55 lineas)

  /*
   * ✅ BUENA PRÁCTICA: TODO dato que venga de fuera se pasa por escaparHTML()
   * antes de meterlo en innerHTML. Así un nombre con "<" nunca se interpreta
   * como una etiqueta HTML. (escaparHTML ya está disponible arriba.)
   */

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

  // TODO (en clase):
  //   1. Escribe `function renderizarFichas(lista) { ... }` que:
  //        - busque el contenedor con `document.getElementById('lista-fichas')`
  //        - si no existe, `return;`  (defensa: si el HTML cambia, no rompemos nada)
  //        - haga `contenedor.innerHTML = lista.map(crearTarjeta).join('');`
  //   2. Llámala una vez: `renderizarFichas(estudiantes);`
  //   Resultado esperado en pantalla: las 5 tarjetas aparecen en el bloque 06.
  //   (aprox. 7 lineas)

  // ==========================================================================
  // 5. ESTADISTICAS DEL GRUPO (map, filter, reduce y Set)
  // ==========================================================================

  // TODO (en clase):
  //   1. titulo('Estadísticas del grupo').
  //   2. Imprime `estudiantes.length` con la etiqueta 'Total de estudiantes ->' -> 5
  //   3. `const activos = estudiantes.filter(({ activo }) => activo);`
  //      Imprime `activos.length` -> 4 (Diego está de baja).
  //   4. Ciudades sin repetir, con Set y ?. (Camila no tiene dirección):
  //        const ciudades = new Set(estudiantes.map(({ direccion }) =>
  //          direccion?.ciudad ?? 'Sin ciudad'));
  //      Imprímelo -> Montevideo, Salto, Paysandú, Sin ciudad.
  //   5. Promedio general (solo cuentan quienes ya tienen notas):
  //        const promedios = estudiantes.map(({ notas }) => calcularPromedio(notas))
  //                                     .filter((promedio) => promedio !== null);
  //        const promedioGeneral = promedios.reduce((a, b) => a + b, 0) / promedios.length;
  //      Imprímelo con .toFixed(2) -> 7.87
  //   6. Mejor promedio con reduce comparando de a dos:
  //        estudiantes.reduce((mejorHastaAhora, actual) => { ... }) usando
  //        `calcularPromedio(...) ?? -1` en los dos lados. Imprime
  //        `${mejor.nombre} ${mejor.apellido}` -> "Sofía Méndez".
  //   7. Quiénes NO tienen teléfono (encadenamiento opcional puro):
  //        estudiantes.filter((estudiante) => !estudiante.contacto?.telefono)
  //                   .map(({ nombre }) => nombre)
  //      Imprímelo -> ["Sofía","Diego"].
  //   8. imprimir('\nPulsa los botones de arriba para ver el JSON y volver a parsearlo.');
  //   Resultado esperado en pantalla: 5, 4, el Set de 4 ciudades, 7.87,
  //   "Sofía Méndez", ["Sofía","Diego"] y el aviso final
  //   (aprox. 24 lineas)

  // ==========================================================================
  // 6. BOTON 1: VER EL JSON FORMATEADO
  // ==========================================================================
  /*
   * JSON.stringify(datos, null, 2) genera el texto con indentación de 2
   * espacios. Es la forma más cómoda de inspeccionar una estructura de datos.
   */

  // TODO (en clase):
  //   1. `const botonJson = document.getElementById('btn-ver-json');`
  //   2. Declara `let jsonGenerado = '';` en el ámbito de la IIFE, para que el
  //      SEGUNDO botón pueda usar exactamente el mismo texto.
  //   3. `botonJson?.addEventListener('click', () => { ... });`
  //      Usamos ?. también aquí: si algún día el botón desaparece del HTML,
  //      getElementById devolvería null y la página no se rompería.
  //      Dentro del callback:
  //        a) jsonGenerado = JSON.stringify(estudiantes, null, 2);
  //        b) titulo('JSON.stringify(estudiantes, null, 2)');
  //        c) imprimir('Tipo del resultado ->', typeof jsonGenerado,
  //                    '| longitud:', jsonGenerado.length);
  //        d) imprimir(jsonGenerado);
  //        e) imprime los tres detalles a comentar en voz alta:
  //             a) Todas las claves quedaron entre comillas dobles.
  //             b) Las fechas (Date) se convirtieron en texto ISO.
  //             c) Las fichas incompletas simplemente NO traen esas claves.
  //   Resultado esperado en pantalla: al pulsar "📄 Ver el JSON formateado",
  //   aparece el JSON indentado de los 5 estudiantes.
  //   (aprox. 14 lineas)

  // ==========================================================================
  // 7. BOTON 2: VOLVER A PARSEAR EL JSON
  // ==========================================================================
  /*
   * JSON.parse reconstruye objetos NUEVOS a partir del texto. Aquí lo
   * comprobamos y, de paso, vemos qué se perdió por el camino.
   */

  // TODO (en clase):
  //   1. `const botonParsear = document.getElementById('btn-parsear-json');`
  //   2. `botonParsear?.addEventListener('click', () => { ... });` con:
  //        a) titulo('JSON.parse(texto)');
  //        b) Si `jsonGenerado` sigue vacío, genéralo ahora y avisa:
  //           '(Se generó el JSON automáticamente porque aún no existía.)'
  //        c) try { ... } catch (error) { imprimir('No se pudo parsear ->',
  //           error.name + ': ' + error.message); }
  //        d) Dentro del try: `const recuperados = JSON.parse(jsonGenerado);` e imprime
  //             Array.isArray(recuperados)                    -> true
  //             recuperados.length                            -> 5
  //             recuperados[0]                                -> la primera ficha
  //             recuperados[0].contacto?.redes?.github         -> "luciafe"
  //             recuperados[0] === estudiantes[0]              -> false (objetos DISTINTOS)
  //             recuperados[0].nombre === estudiantes[0].nombre -> true (mismos datos)
  //             si `estudiantes[0].fechaAlta instanceof Date`   -> "un Date"
  //             si `recuperados[0].fechaAlta instanceof Date`   -> "un string"
  //           y el recordatorio: para recuperar el Date hay que hacerlo a mano,
  //           `new Date(recuperados[0].fechaAlta)`; imprime su .getFullYear() -> 2026.
  //        e) Cierra el ciclo: `renderizarFichas(recuperados);` y avisa
  //           '\nLas fichas de arriba se volvieron a dibujar con los datos parseados.'
  //   Resultado esperado en pantalla: al pulsar "🔄 Volver a parsear el JSON",
  //   la comparación original/recuperado y las fichas redibujadas.
  //   (aprox. 26 lineas)

  // ✅ BUENA PRÁCTICA: JSON.parse siempre dentro de try/catch.

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
