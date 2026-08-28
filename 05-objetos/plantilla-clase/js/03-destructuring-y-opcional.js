/**
 * ============================================================================
 * ARCHIVO: js/03-destructuring-y-opcional.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * QUE ENSEÑA ESTE ARCHIVO:
 *   1. Destructuring (desestructuración) de objetos: la idea básica.
 *   2. Renombrar propiedades al desestructurar.
 *   3. Valores por defecto (y por qué solo funcionan con undefined).
 *   4. Destructuring anidado.
 *   5. Destructuring en los PARAMETROS de una función.
 *   6. El operador rest (...) dentro del destructuring.
 *   7. Encadenamiento opcional: ?. , ?.[ ] y ?.()
 *   8. Operador de fusión nula ?? frente a ||  (y el atajo ??=).
 *
 * AL TERMINAR DEBERIAS SABER:
 *   Extraer datos de objetos complicados en una sola línea y escribir código
 *   que no se rompa cuando falta un dato.
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE: el objeto de trabajo ya está escrito; lo que se teclea en
 * vivo es la sintaxis de destructuring, ?. y ??.
 * La solución completa está en ../../js/03-destructuring-y-opcional.js
 * ============================================================================
 */

(function () {
  // ANDAMIAJE (ya hecho): consola visual conectada al <pre id="salida-03">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-03');

  // DATOS DE PARTIDA (ya escritos): la ficha de un estudiante tal como
  // llegaría de una API. Fíjate en los tres niveles de anidación.
  const estudiante = {
    id: 17,
    nombre: 'Lucía',
    apellido: 'Ferreira',
    edad: 21,
    contacto: {
      email: 'lucia.ferreira@example.com',
      telefono: '+598 99 123 456',
      redes: {
        github: 'luciafe',
      },
    },
    direccion: {
      ciudad: 'Montevideo',
      pais: 'Uruguay',
    },
    notas: [8.5, 9, 7.25],
  };

  // ==========================================================================
  // 1. DESTRUCTURING: LA IDEA BASICA
  // ==========================================================================
  /*
   * Desestructurar es "abrir" un objeto y sacar sus propiedades a variables
   * sueltas, en una sola línea.
   *
   * Analogía: en vez de ir sacando cosas de la mochila una por una, la vuelcas
   * sobre la mesa y cada cosa queda en su sitio.
   *
   * La clave: los nombres entre llaves deben COINCIDIR con los del objeto.
   * El orden NO importa (a diferencia de los arrays, donde manda la posición).
   */

  // TODO (en clase):
  //   1. titulo('1. Destructuring básico').
  //   2. Forma antigua: `const nombreAntiguo = estudiante.nombre;` y
  //      `const edadAntigua = estudiante.edad;` Imprímelos juntos.
  //   3. Forma moderna: `const { nombre, apellido, edad } = estudiante;` e imprímelos.
  //      OJO: estas variables se reutilizan más abajo, decláralas en el ámbito de la IIFE.
  //   4. `const { promedio } = estudiante;` e imprímelo -> undefined (no existe, no es error).
  //   5. Con arrays van CORCHETES: `const [primeraNota, segundaNota] = estudiante.notas;`
  //      e imprímelos -> 8.5 y 9.
  //   Resultado esperado en pantalla: "Lucía Ferreira 21" dos veces, undefined, y "8.5 9"
  //   (aprox. 8 lineas)

  // ⚠️ ERROR COMÚN: confundir la sintaxis de objetos con la de arrays.
  //    const [a, b] = objeto;   -> ERROR: el objeto no es iterable.
  //    Para objetos van LLAVES { }, para arrays CORCHETES [ ].

  // ==========================================================================
  // 2. RENOMBRAR AL DESESTRUCTURAR
  // ==========================================================================
  /*
   * A veces el nombre de la propiedad no nos sirve: ya existe una variable con
   * ese nombre, o el nombre viene en inglés, o es poco descriptivo.
   * Con `propiedadOriginal: nombreNuevo` le ponemos otra etiqueta.
   *
   * Se lee al revés de lo que parece: "saca `id` y guárdalo en `idEstudiante`".
   */

  // TODO (en clase):
  //   1. titulo('2. Renombrar propiedades').
  //   2. `const { id: idEstudiante, nombre: nombreDePila } = estudiante;`
  //      Imprime los dos -> 17 y "Lucía".
  //   3. Caso típico, datos en inglés desde una API:
  //        const respuestaApi = { user_name: 'mferreira', is_active: true, created_at: '2026-03-01' };
  //        const { user_name: usuario, is_active: estaActivo, created_at: fechaAlta } = respuestaApi;
  //      Imprime los tres con la etiqueta 'Traducido ->'.
  //   Resultado esperado en pantalla: 17, "Lucía" y "mferreira true 2026-03-01"
  //   (aprox. 6 lineas)

  // ⚠️ ERROR COMÚN: creer que los dos puntos son un tipo de dato (como en
  // TypeScript). Aquí `:` significa exclusivamente "renombra a".

  // ==========================================================================
  // 3. VALORES POR DEFECTO
  // ==========================================================================
  /*
   * Con `= valor` damos un plan B para cuando la propiedad no viene.
   * MUY IMPORTANTE: el valor por defecto se aplica SOLO si la propiedad vale
   * undefined. Si vale null, 0, "" o false, ese valor gana.
   */

  // TODO (en clase):
  //   1. titulo('3. Valores por defecto').
  //   2. `const { ciudad = 'Sin especificar', beca = false } = estudiante;`
  //      Imprímelos: ninguna de las dos existe en el primer nivel.
  //   3. Declara `const datosParciales = { nombre: 'Diego', telefono: null, apodo: '', faltas: 0 };`
  //      y desestructura con defectos:
  //        telefono = 'Sin teléfono'            -> gana null    (el defecto NO se activa)
  //        apodo = 'Sin apodo'                  -> gana ""      (tampoco)
  //        faltas = 10                          -> gana 0       (tampoco)
  //        correo = 'sin-correo@example.com'    -> SÍ se activa (era undefined)
  //      Imprime los cuatro, uno por línea.
  //   4. Combina renombrado + defecto:
  //      `const { direccion: domicilio = {}, tutor: responsable = 'No asignado' } = estudiante;`
  //      Imprime los dos.
  //   Resultado esperado en pantalla: "Sin especificar", false, null, "", 0,
  //   "sin-correo@example.com", el objeto direccion y "No asignado"
  //   (aprox. 14 lineas)

  // ==========================================================================
  // 4. DESTRUCTURING ANIDADO
  // ==========================================================================
  /*
   * Si la propiedad es a su vez un objeto, se puede volver a abrir poniendo
   * otras llaves dentro. Se puede bajar tantos niveles como haga falta.
   *
   * ⚠️ CUIDADO: al anidar, `contacto:` ya NO crea la variable `contacto`;
   * solo sirve de camino para llegar a lo de dentro.
   */

  // TODO (en clase):
  //   1. titulo('4. Destructuring anidado').
  //   2. En UNA sola sentencia saca:
  //        contacto: { email, telefono: telefonoContacto },
  //        direccion: { ciudad: ciudadEstudiante, pais }
  //      (renombramos telefono y ciudad porque esos nombres ya se usaron arriba).
  //      Imprime email, telefonoContacto y "ciudadEstudiante / pais".
  //   3. Baja dos niveles de golpe: `const { contacto: { redes: { github } } } = estudiante;`
  //      e imprímelo -> "luciafe".
  //   4. Dentro de un try/catch, desestructura un nivel que NO existe:
  //      `const { pagos: { ultimoRecibo } } = estudiante;` -> lanza TypeError.
  //      Imprime error.message con la etiqueta 'Anidado sin defensa ->'.
  //   5. Ahora con defensa: `const { pagos: { ultimoRecibo = 'Sin recibos' } = {} } = estudiante;`
  //      e imprímelo -> "Sin recibos", sin romper nada.
  //   Resultado esperado en pantalla: el email, el teléfono, "Montevideo / Uruguay",
  //   "luciafe", el mensaje del TypeError y "Sin recibos"
  //   (aprox. 16 lineas)

  // ✅ BUENA PRÁCTICA: poner `= {}` en el nivel intermedio para que, si falta,
  // se desestructure un objeto vacío en vez de undefined.

  // ==========================================================================
  // 5. DESTRUCTURING EN LOS PARAMETROS DE UNA FUNCION
  // ==========================================================================
  /*
   * Este es, con diferencia, el uso más frecuente en el trabajo real.
   * En lugar de recibir el objeto entero y escribir `estudiante.` una y otra
   * vez, abrimos el objeto directamente en la lista de parámetros.
   *
   * Ventaja extra: al leer la firma de la función se sabe EXACTAMENTE qué
   * datos necesita.
   */

  // TODO (en clase):
  //   1. titulo('5. Destructuring en parámetros').
  //   2. Sin destructuring (repetitivo): `function resumirLargo(alumno)` que devuelva
  //      alumno.nombre + ' ' + alumno.apellido + ' (' + alumno.edad + ')'.
  //   3. Con destructuring + defectos + anidado:
  //        function resumir({ nombre, apellido, edad = 'edad desconocida',
  //                           direccion: { ciudad } = {} }) {
  //          return `${nombre} ${apellido} · ${edad} años · ${ciudad ?? 'ciudad desconocida'}`;
  //        }
  //   4. Imprime resumirLargo(estudiante), resumir(estudiante) y
  //      resumir({ nombre: 'Diego', apellido: 'Pérez' }) para ver los defectos actuando.
  //   5. Patrón "objeto de opciones": escribe
  //        function crearInscripcion({ estudiante: nombreAlumno, curso = 'Full Stack 2',
  //                                    turno = 'noche', beca = false } = {}) {
  //          return `${nombreAlumno ?? 'anónimo'} | ${curso} | turno ${turno} | beca: ${beca}`;
  //        }
  //      OJO al `= {}` final: permite llamar a la función SIN argumentos.
  //   6. Llámala tres veces e imprime el resultado:
  //        { estudiante: 'Lucía', turno: 'mañana' }
  //        { estudiante: 'Martín', beca: true }
  //        sin argumentos -> "anónimo | Full Stack 2 | turno noche | beca: false"
  //   Resultado esperado en pantalla: "Lucía Ferreira (21)", la ficha completa,
  //   "Diego Pérez · edad desconocida años · ciudad desconocida" y las tres inscripciones
  //   (aprox. 20 lineas)

  // ⚠️ ERROR COMÚN: olvidar ese `= {}`. Sin él, llamar a la función sin
  // argumentos intenta desestructurar undefined y lanza TypeError.

  // ==========================================================================
  // 6. REST (...) DENTRO DEL DESTRUCTURING
  // ==========================================================================
  /*
   * `...resto` recoge TODAS las propiedades que no hemos nombrado y las mete
   * en un objeto nuevo. Es el complemento del spread: uno reparte, otro junta.
   *
   * Uso estrella: quitar campos sensibles antes de enviar datos a otro sitio.
   */

  // TODO (en clase):
  //   1. titulo('6. El operador rest en el destructuring').
  //   2. Declara `const cuenta = { usuario: 'lucia', email: 'lucia@example.com',
  //      contrasena: 'sup3rs3cr3ta', tokenSesion: 'abc.def.ghi', rol: 'estudiante' };`
  //   3. `const { contrasena, tokenSesion, ...datosPublicos } = cuenta;`
  //      Imprime `datosPublicos` -> solo usuario, email y rol.
  //      Imprime `Object.keys(cuenta)` -> el original sigue con las 5 claves.
  //   4. Rest también en parámetros: escribe
  //        function guardarEstudiante({ id, ...camposEditables }) {
  //          return `Actualizando el id ${id} con: ${Object.keys(camposEditables).join(', ')}`;
  //        }
  //      y llámala con { id: 17, nombre: 'Lucía', edad: 22, beca: true }.
  //   Resultado esperado en pantalla: { usuario, email, rol }, las 5 claves,
  //   y "Actualizando el id 17 con: nombre, edad, beca"
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMÚN: el rest debe ir SIEMPRE al final.
  //    const { ...resto, usuario } = cuenta;  -> SyntaxError

  // ==========================================================================
  // 7. ENCADENAMIENTO OPCIONAL:  ?.   ?.[ ]   ?.()
  // ==========================================================================
  /*
   * `?.` significa: "si lo de la izquierda es null o undefined, deja de leer y
   * devuelve undefined; si no, sigue".
   *
   * Analogía: bajas una escalera y, en cuanto ves que falta un escalón, te
   * detienes en vez de caerte.
   *
   * Sustituye a las cadenas interminables de `&&`.
   */

  // TODO (en clase):
  //   1. titulo('7. Encadenamiento opcional ?.').
  //   2. Declara `const estudianteSinDatos = { id: 18, nombre: 'Martín' };`
  //      (se reutiliza en la sección 8, decláralo en el ámbito de la IIFE).
  //   3. Forma antigua: `const emailViejo = estudianteSinDatos && estudianteSinDatos.contacto
  //      && estudianteSinDatos.contacto.email;` e imprímelo -> undefined.
  //   4. Forma moderna: imprime `estudianteSinDatos.contacto?.email` y
  //      `estudianteSinDatos.contacto?.redes?.github` -> undefined las dos, sin error.
  //   5. Dentro de try/catch, imprime `estudianteSinDatos.contacto.email` SIN el ?.
  //      y captura el error para verlo en pantalla.
  //   6. VARIANTE ?.[ ]: `const claveBuscada = 'telefono';`
  //      Imprime `estudiante.contacto?.[claveBuscada]`  -> el teléfono de Lucía
  //      Imprime `estudianteSinDatos.notas?.[0]`        -> undefined, sin romper
  //      Imprime `estudiante.notas?.[0]`                -> 8.5
  //   7. VARIANTE ?.(): declara `const registro = { guardar(dato) { return 'Guardado: ' + dato; } };`
  //      Imprime `registro.guardar?.('nota 9')`   -> "Guardado: nota 9"
  //      Imprime `registro.eliminar?.('nota 9')`  -> undefined (el método no existe)
  //   Resultado esperado en pantalla: varios undefined, el mensaje del TypeError,
  //   "+598 99 123 456", 8.5 y "Guardado: nota 9"
  //   (aprox. 18 lineas)

  // ⚠️ ERROR COMÚN 1: usar ?. en TODAS partes "por si acaso". Si un dato debe
  // existir sí o sí, es mejor que el error salte y nos avise del bug.
  // ⚠️ ERROR COMÚN 2: creer que ?. protege una ASIGNACIÓN.
  //    obj?.prop = 1  -> SyntaxError. Solo sirve para LEER o LLAMAR.
  // ⚠️ ERROR COMÚN 3: `a?.b.c` solo protege el paso de `a` a `b`.
  //    Si `b` puede faltar, hay que escribir `a?.b?.c`.

  // ==========================================================================
  // 8. OPERADOR DE FUSION NULA:  ??  frente a  ||
  // ==========================================================================
  /*
   * Los dos sirven para dar un valor alternativo, pero se activan con cosas
   * distintas:
   *   ||  se activa con cualquier valor "falsy": 0, "", false, null, undefined, NaN.
   *   ??  se activa SOLO con null o undefined.
   *
   * Si 0 o "" son valores VÁLIDOS en tu programa (una nota 0, un comentario
   * vacío, un contador en cero), `||` te va a traicionar.
   */

  // TODO (en clase):
  //   1. titulo('8. ?? frente a ||').
  //   2. Declara `const configuracion = { faltas: 0, comentario: '',
  //      notificaciones: false, limite: null };`
  //   3. Imprime las parejas, una debajo de la otra, para comparar:
  //        configuracion.faltas || 10          -> 10    ⚠️ incorrecto
  //        configuracion.faltas ?? 10          -> 0     ✅ correcto
  //        configuracion.comentario || 'vacío' -> "vacío"
  //        configuracion.comentario ?? 'vacío' -> ""
  //        configuracion.notificaciones || true -> true  (mal)
  //        configuracion.notificaciones ?? true -> false (bien)
  //        configuracion.limite ?? 100          -> 100   (null sí activa ??)
  //   4. Combinación ganadora ?. + ??: imprime
  //      `estudianteSinDatos.contacto?.telefono ?? 'Sin teléfono registrado'`.
  //   5. Mezclar ?? con || EXIGE paréntesis:
  //      `const mezclaCorrecta = (configuracion.limite ?? 100) || 999;` e imprímelo -> 100.
  //   6. Atajo ??= ("asigna solo si está vacío"):
  //        const preferencias = { tema: null, idioma: 'es' };
  //        preferencias.tema ??= 'oscuro';   // SÍ se asigna (era null)
  //        preferencias.idioma ??= 'en';     // NO se asigna (ya tenía valor)
  //      Imprime `preferencias` -> { tema: "oscuro", idioma: "es" }
  //   Resultado esperado en pantalla: los siete pares comparados,
  //   "Sin teléfono registrado", 100 y { tema: "oscuro", idioma: "es" }
  //   (aprox. 18 lineas)

  // ⚠️ ERROR COMÚN: mezclar ?? con || o && sin paréntesis.
  //    a ?? b || c  -> SyntaxError. Hay que escribir  (a ?? b) || c

  // ==========================================================================
  // EJERCICIOS PROPUESTOS (archivo 03)
  // ==========================================================================
  /*
   * 1) Dado `const pelicula = { titulo: 'Duna', anio: 2021, director: { nombre:
   *    'Denis', apellido: 'Villeneuve' } }`, extrae en una sola sentencia:
   *    titulo, anio renombrado a `estreno`, el nombre del director renombrado a
   *    `directorNombre` y un `genero` con valor por defecto 'Sin género'.
   *
   * 2) Escribe `mostrarProducto({ nombre, precio, descuento = 0, stock })` que
   *    devuelva un texto con el precio final. Pruébala con un producto que
   *    tenga `stock: 0` y comprueba que el 0 se muestra (no "sin stock").
   *
   * 3) Escribe `quitarDatosSensibles(usuario)` que use rest para devolver el
   *    usuario sin las propiedades `contrasena` ni `dni`.
   *
   * 4) Dado un array de estudiantes donde algunos NO tienen `contacto`,
   *    construye con map un array de emails usando ?. y ?? para poner
   *    'sin-email' cuando falte.
   *
   * 5) Escribe `obtenerValor(objeto, ruta)` donde ruta sea un texto como
   *    'contacto.redes.github'. Debe devolver el valor o undefined sin romper
   *    nunca. Pista: ruta.split('.') y reduce con ?. dentro.
   */
})();
