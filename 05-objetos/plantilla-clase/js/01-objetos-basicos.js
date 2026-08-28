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
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE: el HTML y el CSS ya están hechos. Aquí solo queda por
 * escribir el JavaScript, siguiendo los bloques TODO en orden.
 * La solución completa está en ../../js/01-objetos-basicos.js
 * ============================================================================
 */

// La IIFE (Immediately Invoked Function Expression) ya viene escrita: encierra
// todo el archivo para que sus variables no choquen con las de los otros .js
// que carga el mismo index.html. Sin ella, dos archivos que declaren
// `const estudiante` provocarían "Identifier 'estudiante' has already been declared".
(function () {
  // ANDAMIAJE (ya hecho): pedimos a las utilidades una consola visual conectada
  // al <pre id="salida-01">. Desestructuramos el objeto devuelto para quedarnos
  // solo con lo que usamos (el destructuring se estudia a fondo en el archivo 03).
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

  // TODO (en clase):
  //   1. Llama a titulo('1. El objeto literal: pares clave-valor').
  //   2. Declara `const estudiante = { ... }` con estas propiedades, en este orden:
  //        nombre: 'Lucía'            (string)
  //        apellido: 'Ferreira'
  //        edad: 21                   (number)
  //        activo: true               (boolean)
  //        notas: [8.5, 9, 7.25]      (un array como valor)
  //        'correo personal': 'lucia@example.com'  <- clave con espacio: OBLIGA a comillas
  //   3. imprimir('El objeto completo:', estudiante);
  //   4. imprimir('typeof estudiante ->', typeof estudiante);  // "object"
  //   Resultado esperado en pantalla: el objeto formateado y luego "typeof estudiante -> object"
  //   (aprox. 12 lineas)

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

  // TODO (en clase):
  //   1. titulo('2. Acceso con punto y con corchetes').
  //   2. Imprime `estudiante.nombre` y `estudiante['nombre']` con las etiquetas
  //      'Con punto:      estudiante.nombre ->' y 'Con corchetes:  estudiante["nombre"] ->'.
  //   3. Caso a) imprime `estudiante['correo personal']` (con el punto sería SyntaxError).
  //   4. Caso c) declara `const propiedadElegida = 'edad';` e imprime
  //      `estudiante[propiedadElegida]`  -> 21
  //   5. Imprime `estudiante.propiedadElegida` para ver el ERROR COMÚN -> undefined.
  //   6. Imprime `estudiante.telefono` (propiedad inexistente) -> undefined, NO es un error.
  //   7. Declara `const porPosicion = { 1: 'primero', 2: 'segundo' };` e imprime
  //      `porPosicion[1]` y `porPosicion['1']`: las DOS dan "primero" porque las
  //      claves de un objeto son siempre texto.
  //   Resultado esperado en pantalla: ...edad -> 21, luego undefined dos veces, luego "primero" dos veces.
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMÚN: escribir `estudiante.propiedadElegida`.
  // Con el punto, JavaScript busca literalmente una clave llamada
  // "propiedadElegida", que NO existe. Por eso devuelve undefined.

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

  // TODO (en clase):
  //   1. titulo('3. Añadir, modificar y eliminar propiedades').
  //   2. AÑADIR: `estudiante.ciudad = 'Montevideo';` y
  //      `estudiante['telefono'] = '+598 99 123 456';`
  //   3. MODIFICAR: `estudiante.edad = 22;`
  //   4. imprimir('Tras añadir y modificar:', estudiante);
  //   5. ELIMINAR: `delete estudiante.activo;` y comprueba con
  //      imprimir('¿Sigue existiendo "activo"? ->', 'activo' in estudiante);  // false
  //   6. Declara `const conUndefined = { a: 1, b: undefined };` e imprime
  //      Object.keys(conUndefined) -> ["a","b"]: asignar undefined NO es lo mismo que delete.
  //   7. Declara `const notasSueltas = [8.5, 9, 7.25];`, haz `delete notasSueltas[1]`
  //      e imprime el array y su .length: sigue valiendo 3 (queda un "hueco").
  //   Resultado esperado en pantalla: el objeto con ciudad y telefono, false, ["a","b"], longitud: 3
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMÚN: creer que `estudiante.activo = undefined` es lo mismo que
  // `delete`. NO lo es: la clave sigue existiendo, solo que vale undefined.

  // ⚠️ ERROR COMÚN: usar `delete` en un array. Borra el valor pero NO reduce
  // la longitud: deja un "hueco" y eso rompe muchos recorridos.
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

  // TODO (en clase):
  //   1. titulo('4. Objetos anidados y arrays de objetos').
  //   2. Declara `const curso = { ... }` con:
  //        codigo: 'FS2-2026'
  //        titulo: 'Full Stack 2 - Desarrollo Front End'
  //        docente: { nombre: 'Carlos', contacto: { email: 'carlos@instituto.edu' } }
  //          -> fíjate: el docente NO tiene telefono, lo usaremos abajo.
  //        estudiantes: [
  //            { id: 1, nombre: 'Lucía',  nota: 8.5 },
  //            { id: 2, nombre: 'Martín', nota: 6.75 },
  //            { id: 3, nombre: 'Sofía',  nota: 9.4 },
  //          ]
  //   3. Imprime `curso.docente.contacto.email`, `curso.estudiantes[1].nombre`
  //      y `curso.estudiantes[2].nota` (encadenando puntos y corchetes).
  //   4. Declara `const nombresDeClase = curso.estudiantes.map((alumno) => alumno.nombre);`
  //      e imprímelo -> ["Lucía","Martín","Sofía"]
  //   5. Declara `const aprobados = curso.estudiantes.filter((alumno) => alumno.nota >= 7);`
  //      e imprímelo -> las fichas de Lucía y Sofía.
  //   6. Dentro de un try/catch, imprime `curso.docente.telefono.prefijo` y captura
  //      el error: imprimir('Error capturado ->', error.message);
  //   Resultado esperado en pantalla: el email, "Martín", 9.4, los arrays, y
  //   "Error capturado -> Cannot read properties of undefined (reading 'prefijo')"
  //   (aprox. 24 lineas)

  // ⚠️ ERROR COMÚN: bajar por un nivel que no existe.
  // curso.docente.telefono es undefined, y pedirle .prefijo a undefined
  // rompe el programa con "Cannot read properties of undefined".
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

  // TODO (en clase):
  //   1. titulo('5. Métodos de objeto y la palabra clave this').
  //   2. Declara `const ficha = { ... }` con:
  //        nombre: 'Lucía'
  //        notas: [8.5, 9, 7.25]
  //        promedio: function () { ... }  -> suma this.notas con reduce y divide
  //                                          entre this.notas.length
  //        presentarse() { ... }          -> shorthand de método; devuelve
  //          `Hola, soy ${this.nombre} y mi promedio es ${this.promedio().toFixed(2)}`
  //        presentarseMal: () => `Hola, soy ${this.nombre}`  -> arrow: this NO es ficha
  //   3. Imprime `ficha.promedio().toFixed(2)`      -> 8.25
  //   4. Imprime `ficha.presentarse()`              -> "Hola, soy Lucía y mi promedio es 8.25"
  //   5. Imprime `ficha.presentarseMal()`           -> "Hola, soy undefined"
  //   6. Declara `const funcionSuelta = ficha.presentarse;` y llámala dentro de
  //      try/catch: al perder el `this` lanza un TypeError; imprime error.message.
  //   7. Declara `const funcionAtada = ficha.presentarse.bind(ficha);` e imprímela:
  //      vuelve a funcionar porque bind() fija el `this` para siempre.
  //   Resultado esperado en pantalla: 8.25, la frase completa, "Hola, soy undefined",
  //   el mensaje del TypeError, y de nuevo la frase completa.
  //   (aprox. 24 lineas)

  // ⚠️ ERROR COMÚN: usar una arrow function como método.
  // Las arrow NO tienen su propio `this`: heredan el del lugar donde se
  // ESCRIBIERON. Aquí ese lugar es el archivo, no el objeto.

  // ✅ BUENA PRÁCTICA: si necesitas pasar un método por ahí, átalo con bind(),
  // que devuelve una copia de la función con el `this` fijado para siempre.

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

  // TODO (en clase):
  //   1. titulo('6. Shorthand de propiedades y de métodos').
  //   2. Declara tres variables sueltas:
  //        const nombre = 'Martín';  const edad = 23;  const carrera = 'Analista programador';
  //   3. Forma larga: `const alumnoLargo = { nombre: nombre, edad: edad, carrera: carrera };`
  //   4. Forma corta: `const alumnoCorto = { nombre, edad, carrera, describir() {...} };`
  //      donde describir() devuelve `${this.nombre} (${this.edad}) estudia ${this.carrera}`.
  //   5. Imprime alumnoLargo, alumnoCorto y `alumnoCorto.describir()`.
  //   6. Declara `const conOtraClave = { nombreCompleto: nombre };` e imprímelo:
  //      el shorthand NO renombra, si quieres otra clave hay que escribirla.
  //   Resultado esperado en pantalla: los dos objetos con los mismos datos y
  //   "Su método -> Martín (23) estudia Analista programador"
  //   (aprox. 14 lineas)

  // ⚠️ ERROR COMÚN: pensar que el shorthand renombra. `{ nombre }` crea la
  // clave "nombre". Si quieres otra clave, hay que escribirla.

  // ==========================================================================
  // 7. PROPIEDADES COMPUTADAS: { [clave]: valor }
  // ==========================================================================
  /*
   * ¿Y si el NOMBRE de la clave no lo sabemos hasta que el programa corre?
   * (por ejemplo, viene de un <select> o de una respuesta del servidor).
   * Poniendo la expresión entre corchetes DENTRO del literal, JavaScript la
   * evalúa y usa el resultado como clave.
   */

  // TODO (en clase):
  //   1. titulo('7. Propiedades computadas').
  //   2. Declara `const claveDinamica = 'promedioFinal';` y `const asignatura = 'Matemática';`
  //   3. Declara `const boletin = { ... }` usando corchetes en las claves:
  //        [claveDinamica]: 8.25
  //        [`nota${asignatura}`]: 9
  //        [asignatura.toLowerCase() + '_aprobada']: true
  //   4. Imprime `boletin` y luego `boletin[claveDinamica]` -> 8.25
  //   5. Muestra el equivalente en dos pasos: `const boletinManual = {};`
  //      `boletinManual[claveDinamica] = 8.25;` e imprímelo.
  //   6. CASO REAL: declara el array `inscripciones` con cuatro objetos
  //      { nombre, ciudad }: Lucía/Montevideo, Martín/Salto, Sofía/Montevideo,
  //      Diego/Paysandú. Recórrelo con forEach y acumula en `conteoPorCiudad`:
  //        conteoPorCiudad[ciudad] = (conteoPorCiudad[ciudad] || 0) + 1;
  //      Imprímelo.
  //   Resultado esperado en pantalla: { promedioFinal: 8.25, notaMatemática: 9,
  //   matemática_aprobada: true } y { Montevideo: 2, Salto: 1, Paysandú: 1 }
  //   (aprox. 22 lineas)

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
