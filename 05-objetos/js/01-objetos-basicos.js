/**
 * ============================================================================
 * ARCHIVO: js/01-objetos-basicos.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * QUE ENSEÑA ESTE ARCHIVO:
 *   1. Qué es un objeto literal y cómo se escribe (pares clave-valor).
 *   2. Acceso con punto y con corchetes, y cuándo el corchete es OBLIGATORIO.
 *   3. Añadir, modificar y eliminar propiedades (`delete`).
 *   4. Objetos anidados y arrays de objetos.
 *   5. Métodos de objeto y la palabra clave `this`.
 *   6. Por qué una arrow function NO sirve como método.
 *   7. Shorthand de propiedades y de métodos.
 *   8. Propiedades computadas: `{ [clave]: valor }`.
 *
 * AL TERMINAR DEBERIAS SABER:
 *   Modelar cualquier "cosa" del mundo real (un estudiante, un producto, un
 *   pedido) como un objeto de JavaScript, y leer/modificar sus datos.
 *
 * NOTA TECNICA: este archivo NO usa 'use strict' a propósito, porque en la
 * sección 5 queremos ver qué pasa con `this` en modo NO estricto.
 * ============================================================================
 */

(function () {
  // Pedimos a las utilidades una consola visual conectada al <pre id="salida-01">.
  // Desestructuramos el objeto devuelto para quedarnos solo con lo que usamos
  // (el destructuring lo estudiamos a fondo en el archivo 03).
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-01');

  // ==========================================================================
  // 1. QUE ES UN OBJETO LITERAL
  // ==========================================================================
  /*
   * Un array guarda una LISTA ordenada de valores: se accede por posición.
   * Un objeto guarda datos ETIQUETADOS: se accede por nombre.
   *
   * Analogía: un array es una fila de casilleros numerados (0, 1, 2...);
   * un objeto es un formulario con campos escritos ("nombre", "edad", "email").
   *
   * Cada elemento del objeto es un PAR clave-valor:
   *   clave (o propiedad) : valor
   */
  titulo('1. El objeto literal: pares clave-valor');

  const estudiante = {
    nombre: 'Lucía',                     // valor de tipo string
    apellido: 'Ferreira',
    edad: 21,                            // valor de tipo number
    activo: true,                        // valor de tipo boolean
    notas: [8.5, 9, 7.25],               // un array como valor
    'correo personal': 'lucia@example.com', // clave con espacio: OBLIGA a comillas
  };

  imprimir('El objeto completo:', estudiante);
  imprimir('typeof estudiante ->', typeof estudiante); // "object"

  // Las claves SIN comillas y las claves CON comillas son equivalentes,
  // siempre que la clave sea un identificador válido (sin espacios, sin
  // guiones, sin empezar por número).
  // ✅ BUENA PRÁCTICA: escribir las claves sin comillas cuando se puede;
  // el código queda más limpio.

  // ⚠️ ERROR COMÚN: separar los pares con punto y coma. Dentro de un objeto
  // se separan con COMA. El punto y coma solo va al final de la declaración.

  // ==========================================================================
  // 2. ACCESO CON PUNTO Y CON CORCHETES
  // ==========================================================================
  /*
   * Hay dos formas de leer una propiedad:
   *   objeto.clave      -> notación de PUNTO (la habitual, la más legible)
   *   objeto['clave']   -> notación de CORCHETES (la flexible)
   *
   * El corchete es OBLIGATORIO en tres casos:
   *   a) La clave tiene espacios, guiones o caracteres raros.
   *   b) La clave empieza por un número.
   *   c) La clave está guardada en una VARIABLE (clave dinámica).
   */
  titulo('2. Acceso con punto y con corchetes');

  imprimir('Con punto:      estudiante.nombre ->', estudiante.nombre);
  imprimir('Con corchetes:  estudiante["nombre"] ->', estudiante['nombre']);

  // Caso a) clave con espacio: el punto daría un error de sintaxis.
  imprimir('Clave con espacio ->', estudiante['correo personal']);

  // Caso c) clave dinámica guardada en una variable.
  const propiedadElegida = 'edad';
  imprimir('estudiante[propiedadElegida] ->', estudiante[propiedadElegida]); // 21

  // ⚠️ ERROR COMÚN: escribir `estudiante.propiedadElegida`.
  // Con el punto, JavaScript busca literalmente una clave llamada
  // "propiedadElegida", que NO existe. Por eso devuelve undefined:
  imprimir('estudiante.propiedadElegida ->', estudiante.propiedadElegida); // undefined

  // Pedir una propiedad inexistente NO es un error: devuelve undefined.
  imprimir('estudiante.telefono ->', estudiante.telefono); // undefined

  // Las claves de un objeto son SIEMPRE cadenas de texto (o símbolos).
  // Si usamos un número, JavaScript lo convierte a texto por detrás.
  const porPosicion = { 1: 'primero', 2: 'segundo' };
  imprimir('porPosicion[1] ->', porPosicion[1]);       // "primero"
  imprimir('porPosicion["1"] ->', porPosicion['1']);   // "primero" (¡la misma!)

  // ==========================================================================
  // 3. AÑADIR, MODIFICAR Y ELIMINAR PROPIEDADES
  // ==========================================================================
  /*
   * Un objeto declarado con `const` NO es inmutable. `const` protege la
   * VARIABLE (no se le puede asignar otro objeto), pero el CONTENIDO del
   * objeto se puede cambiar libremente.
   *
   * Analogía: `const` es como tener una única llave de una casa. No puedes
   * cambiar de casa, pero sí mover los muebles de dentro.
   */
  titulo('3. Añadir, modificar y eliminar propiedades');

  // AÑADIR: basta con asignar a una clave que no existe.
  estudiante.ciudad = 'Montevideo';
  estudiante['telefono'] = '+598 99 123 456';

  // MODIFICAR: se asigna a una clave que ya existe.
  estudiante.edad = 22;

  imprimir('Tras añadir y modificar:', estudiante);

  // ELIMINAR: el operador `delete` borra la propiedad por completo.
  delete estudiante.activo;
  imprimir('¿Sigue existiendo "activo"? ->', 'activo' in estudiante); // false

  // ⚠️ ERROR COMÚN: creer que `estudiante.activo = undefined` es lo mismo que
  // `delete`. NO lo es: la clave sigue existiendo, solo que vale undefined.
  const conUndefined = { a: 1, b: undefined };
  imprimir('Claves de {a:1, b:undefined} ->', Object.keys(conUndefined)); // ["a","b"]

  // ⚠️ ERROR COMÚN: usar `delete` en un array. Borra el valor pero NO reduce
  // la longitud: deja un "hueco" y eso rompe muchos recorridos.
  const notasSueltas = [8.5, 9, 7.25];
  delete notasSueltas[1];
  imprimir('delete en array ->', notasSueltas, 'longitud:', notasSueltas.length); // sigue 3
  // ✅ BUENA PRÁCTICA: para arrays se usa splice() o filter().

  // ==========================================================================
  // 4. OBJETOS ANIDADOS Y ARRAYS DE OBJETOS
  // ==========================================================================
  /*
   * El valor de una propiedad puede ser CUALQUIER cosa: otro objeto, un array,
   * un array de objetos... Así modelamos datos del mundo real, que casi nunca
   * son planos.
   *
   * Esta es exactamente la forma de los datos que llegan de una API.
   */
  titulo('4. Objetos anidados y arrays de objetos');

  const curso = {
    codigo: 'FS2-2026',
    titulo: 'Full Stack 2 - Desarrollo Front End',
    // Objeto dentro de objeto:
    docente: {
      nombre: 'Carlos',
      contacto: {
        email: 'carlos@instituto.edu',
        // Fíjate: aquí NO hay teléfono. Lo usaremos más adelante.
      },
    },
    // Array de objetos: la estructura más común en front end.
    estudiantes: [
      { id: 1, nombre: 'Lucía', nota: 8.5 },
      { id: 2, nombre: 'Martín', nota: 6.75 },
      { id: 3, nombre: 'Sofía', nota: 9.4 },
    ],
  };

  // Para bajar por los niveles se encadenan los puntos.
  imprimir('Email del docente ->', curso.docente.contacto.email);
  imprimir('Segundo estudiante ->', curso.estudiantes[1].nombre);
  imprimir('Nota del tercero ->', curso.estudiantes[2].nota);

  // Al ser un array normal, funcionan todos los métodos de array.
  const nombresDeClase = curso.estudiantes.map((alumno) => alumno.nombre);
  imprimir('Nombres con map() ->', nombresDeClase);

  const aprobados = curso.estudiantes.filter((alumno) => alumno.nota >= 7);
  imprimir('Aprobados con filter() ->', aprobados);

  // ⚠️ ERROR COMÚN: bajar por un nivel que no existe.
  // curso.docente.telefono es undefined, y pedirle .prefijo a undefined
  // rompe el programa con "Cannot read properties of undefined".
  try {
    imprimir(curso.docente.telefono.prefijo);
  } catch (error) {
    imprimir('Error capturado ->', error.message);
  }
  // La solución elegante (?.) la veremos en el archivo 03.

  // ==========================================================================
  // 5. METODOS DE OBJETO Y LA PALABRA CLAVE this
  // ==========================================================================
  /*
   * Cuando el valor de una propiedad es una FUNCIÓN, esa propiedad se llama
   * MÉTODO. Los métodos son las "acciones" que sabe hacer el objeto.
   *
   * Dentro de un método, `this` apunta al objeto que está a la IZQUIERDA del
   * punto en el momento de la llamada.
   *   ficha.presentarse()  ->  dentro de presentarse, this === ficha
   *
   * Regla mental: `this` no se decide al ESCRIBIR la función, sino al LLAMARLA.
   */
  titulo('5. Métodos de objeto y la palabra clave this');

  const ficha = {
    nombre: 'Lucía',
    notas: [8.5, 9, 7.25],

    // Forma clásica: propiedad cuyo valor es una función anónima.
    promedio: function () {
      const suma = this.notas.reduce((acumulado, nota) => acumulado + nota, 0);
      return suma / this.notas.length;
    },

    // Shorthand de método (ES6): más corto y exactamente equivalente.
    presentarse() {
      return `Hola, soy ${this.nombre} y mi promedio es ${this.promedio().toFixed(2)}`;
    },

    // ⚠️ ERROR COMÚN: usar una arrow function como método.
    // Las arrow NO tienen su propio `this`: heredan el del lugar donde se
    // ESCRIBIERON. Aquí ese lugar es el archivo, no el objeto.
    presentarseMal: () => {
      // `this` aquí NO es `ficha`, sino el objeto global (window).
      return `Hola, soy ${this.nombre}`; // -> "Hola, soy undefined"
    },
  };

  imprimir('Promedio ->', ficha.promedio().toFixed(2));
  imprimir('Método correcto ->', ficha.presentarse());
  imprimir('Método con arrow ->', ficha.presentarseMal()); // "Hola, soy undefined"

  // Otro tropiezo clásico: EXTRAER el método de su objeto.
  const funcionSuelta = ficha.presentarse;
  // Al llamarla así ya no hay nada a la izquierda del punto: se pierde el `this`.
  // Como `this` pasa a ser el objeto global, `this.promedio` no existe y
  // la llamada revienta. Lo envolvemos en try/catch para VER el error sin
  // que se detenga el resto del archivo.
  try {
    imprimir('Método extraído ->', funcionSuelta());
  } catch (error) {
    imprimir('Método extraído lanzó ->', error.message);
  }

  // ✅ BUENA PRÁCTICA: si necesitas pasar un método por ahí, átalo con bind(),
  // que devuelve una copia de la función con el `this` fijado para siempre.
  const funcionAtada = ficha.presentarse.bind(ficha);
  imprimir('Método atado con bind() ->', funcionAtada());

  // ✅ Regla práctica: métodos de objeto -> función normal.
  //    Callbacks dentro de un método (map, setTimeout...) -> arrow function,
  //    porque así conservan el `this` del método que las rodea.

  // ==========================================================================
  // 6. SHORTHAND DE PROPIEDADES Y DE METODOS
  // ==========================================================================
  /*
   * Es muy frecuente tener variables que se llaman igual que la clave que
   * queremos crear. Desde ES6 se puede escribir solo el nombre una vez.
   */
  titulo('6. Shorthand de propiedades y de métodos');

  const nombre = 'Martín';
  const edad = 23;
  const carrera = 'Analista programador';

  // Forma larga (la de toda la vida):
  const alumnoLargo = { nombre: nombre, edad: edad, carrera: carrera };

  // Forma corta (shorthand): la clave toma el nombre de la variable.
  const alumnoCorto = {
    nombre,
    edad,
    carrera,
    // Shorthand de método: se omiten `: function`.
    describir() {
      return `${this.nombre} (${this.edad}) estudia ${this.carrera}`;
    },
  };

  imprimir('Forma larga ->', alumnoLargo);
  imprimir('Forma corta ->', alumnoCorto);
  imprimir('Su método ->', alumnoCorto.describir());

  // ⚠️ ERROR COMÚN: pensar que el shorthand renombra. `{ nombre }` crea la
  // clave "nombre". Si quieres otra clave, hay que escribirla:
  const conOtraClave = { nombreCompleto: nombre };
  imprimir('Renombrando a mano ->', conOtraClave);

  // ==========================================================================
  // 7. PROPIEDADES COMPUTADAS: { [clave]: valor }
  // ==========================================================================
  /*
   * ¿Y si el NOMBRE de la clave no lo sabemos hasta que el programa corre?
   * (por ejemplo, viene de un <select> o de una respuesta del servidor).
   * Poniendo la expresión entre corchetes DENTRO del literal, JavaScript la
   * evalúa y usa el resultado como clave.
   */
  titulo('7. Propiedades computadas');

  const claveDinamica = 'promedioFinal';
  const asignatura = 'Matemática';

  const boletin = {
    [claveDinamica]: 8.25,                         // clave tomada de la variable
    [`nota${asignatura}`]: 9,                      // clave construida con plantilla
    [asignatura.toLowerCase() + '_aprobada']: true, // clave calculada con métodos
  };

  imprimir('Boletín con claves computadas ->', boletin);
  imprimir('Leemos con la misma variable ->', boletin[claveDinamica]);

  // Sin propiedades computadas habría que hacerlo en dos pasos:
  const boletinManual = {};
  boletinManual[claveDinamica] = 8.25; // esto también funciona, es más verboso

  imprimir('Equivalente en dos pasos ->', boletinManual);

  // Caso real: contar cuántos estudiantes hay por ciudad.
  const inscripciones = [
    { nombre: 'Lucía', ciudad: 'Montevideo' },
    { nombre: 'Martín', ciudad: 'Salto' },
    { nombre: 'Sofía', ciudad: 'Montevideo' },
    { nombre: 'Diego', ciudad: 'Paysandú' },
  ];

  const conteoPorCiudad = {};
  inscripciones.forEach((inscripcion) => {
    const ciudad = inscripcion.ciudad;
    // Si la ciudad aún no está en el objeto, arrancamos en 0 y sumamos 1.
    conteoPorCiudad[ciudad] = (conteoPorCiudad[ciudad] || 0) + 1;
  });

  imprimir('Estudiantes por ciudad ->', conteoPorCiudad);

  // ⚠️ ERROR COMÚN al usar objetos como diccionario: si una clave del objeto
  // coincide con algo heredado (como "toString"), la comprobación con
  // `if (objeto[clave])` puede dar sorpresas. En el archivo 05 veremos que
  // `Map` está pensado exactamente para este trabajo.

  // ==========================================================================
  // EJERCICIOS PROPUESTOS (archivo 01)
  // ==========================================================================
  /*
   * 1) Crea un objeto `libro` con las propiedades: titulo, autor, anio,
   *    disponible (boolean) y una clave con espacio llamada "codigo interno".
   *    Imprime cada valor: las tres primeras con notación de punto y la última
   *    con corchetes.
   *
   * 2) Partiendo de `libro`, añade la propiedad `editorial`, cambia `anio` por
   *    el año actual y elimina `disponible` con delete. Comprueba con el
   *    operador `in` que `disponible` ya no está.
   *
   * 3) Crea un objeto `biblioteca` que tenga: nombre, direccion (objeto con
   *    calle, ciudad y pais) y libros (array con 3 objetos libro).
   *    Imprime la ciudad y el título del segundo libro.
   *
   * 4) Añade a `biblioteca` un método `cantidadDeLibros()` que devuelva cuántos
   *    libros hay usando `this`. Después crea el MISMO método con una arrow
   *    function, ejecútalo y explica en un comentario por qué falla.
   *
   * 5) Escribe una función `agruparPorAutor(libros)` que devuelva un objeto
   *    cuyas claves sean los nombres de los autores (usa propiedades
   *    computadas) y cuyos valores sean arrays con los títulos de ese autor.
   */
})();
