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
 * ============================================================================
 */

(function () {
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-03');

  // Objeto de trabajo: la ficha de un estudiante tal como llegaría de una API.
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
  titulo('1. Destructuring básico');

  // Forma antigua: una línea por dato.
  const nombreAntiguo = estudiante.nombre;
  const edadAntigua = estudiante.edad;
  imprimir('Forma antigua ->', nombreAntiguo, edadAntigua);

  // Forma moderna: una sola línea.
  const { nombre, apellido, edad } = estudiante;
  imprimir('Con destructuring ->', nombre, apellido, edad);

  // Si pedimos una propiedad que no existe, la variable vale undefined
  // (no es un error).
  const { promedio } = estudiante;
  imprimir('promedio (no existe) ->', promedio); // undefined

  // ⚠️ ERROR COMÚN: confundir la sintaxis de objetos con la de arrays.
  //    const [a, b] = objeto;   -> ERROR: el objeto no es iterable.
  //    Para objetos van LLAVES { }, para arrays CORCHETES [ ].
  const [primeraNota, segundaNota] = estudiante.notas; // esto sí: notas es array
  imprimir('Primeras dos notas ->', primeraNota, segundaNota);

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
  titulo('2. Renombrar propiedades');

  const { id: idEstudiante, nombre: nombreDePila } = estudiante;
  imprimir('id renombrado ->', idEstudiante);
  imprimir('nombre renombrado ->', nombreDePila);

  // Caso típico: datos que llegan en inglés desde una API.
  const respuestaApi = { user_name: 'mferreira', is_active: true, created_at: '2026-03-01' };
  const { user_name: usuario, is_active: estaActivo, created_at: fechaAlta } = respuestaApi;
  imprimir('Traducido ->', usuario, estaActivo, fechaAlta);

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
  titulo('3. Valores por defecto');

  const { ciudad = 'Sin especificar', beca = false } = estudiante;
  imprimir('ciudad (no existe en el nivel 1) ->', ciudad);
  imprimir('beca (no existe) ->', beca);

  const datosParciales = { nombre: 'Diego', telefono: null, apodo: '', faltas: 0 };
  const {
    telefono = 'Sin teléfono', // null NO activa el defecto
    apodo = 'Sin apodo',       // "" tampoco
    faltas = 10,               // 0 tampoco
    correo = 'sin-correo@example.com', // undefined SÍ lo activa
  } = datosParciales;

  imprimir('telefono ->', telefono); // null
  imprimir('apodo ->', apodo);       // "" (cadena vacía)
  imprimir('faltas ->', faltas);     // 0
  imprimir('correo ->', correo);     // "sin-correo@example.com"

  // Se pueden combinar renombrado y valor por defecto (primero renombra,
  // después el defecto):  { clave: nuevoNombre = valorPorDefecto }
  const { direccion: domicilio = {}, tutor: responsable = 'No asignado' } = estudiante;
  imprimir('domicilio ->', domicilio);
  imprimir('responsable ->', responsable);

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
  titulo('4. Destructuring anidado');

  const {
    contacto: { email, telefono: telefonoContacto },
    direccion: { ciudad: ciudadEstudiante, pais },
  } = estudiante;

  imprimir('email ->', email);
  imprimir('teléfono ->', telefonoContacto);
  imprimir('ciudad / país ->', ciudadEstudiante, '/', pais);

  // Bajar dos niveles de golpe:
  const { contacto: { redes: { github } } } = estudiante;
  imprimir('github ->', github);

  // ⚠️ ERROR COMÚN: desestructurar un nivel que no existe. Explota igual que
  // un acceso normal, porque por dentro es lo mismo.
  try {
    const { pagos: { ultimoRecibo } } = estudiante;
    imprimir(ultimoRecibo);
  } catch (error) {
    imprimir('Anidado sin defensa ->', error.message);
  }

  // ✅ BUENA PRÁCTICA: poner `= {}` en el nivel intermedio para que, si falta,
  // se desestructure un objeto vacío en vez de undefined.
  const { pagos: { ultimoRecibo = 'Sin recibos' } = {} } = estudiante;
  imprimir('Anidado con defensa ->', ultimoRecibo);

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
  titulo('5. Destructuring en parámetros');

  // Sin destructuring: repetitivo.
  function resumirLargo(alumno) {
    return alumno.nombre + ' ' + alumno.apellido + ' (' + alumno.edad + ')';
  }

  // Con destructuring + valores por defecto + anidado.
  function resumir({ nombre, apellido, edad = 'edad desconocida', direccion: { ciudad } = {} }) {
    return `${nombre} ${apellido} · ${edad} años · ${ciudad ?? 'ciudad desconocida'}`;
  }

  imprimir('Sin destructuring ->', resumirLargo(estudiante));
  imprimir('Con destructuring ->', resumir(estudiante));
  imprimir('Con datos incompletos ->', resumir({ nombre: 'Diego', apellido: 'Pérez' }));

  /*
   * El patrón "objeto de opciones": cuando una función tiene muchos parámetros
   * opcionales, se pasan dentro de un objeto. Así no hay que recordar el orden.
   */
  function crearInscripcion({
    estudiante: nombreAlumno,
    curso = 'Full Stack 2',
    turno = 'noche',
    beca = false,
  } = {}) { // el `= {}` final permite llamar a la función SIN argumentos
    return `${nombreAlumno ?? 'anónimo'} | ${curso} | turno ${turno} | beca: ${beca}`;
  }

  imprimir(crearInscripcion({ estudiante: 'Lucía', turno: 'mañana' }));
  imprimir(crearInscripcion({ estudiante: 'Martín', beca: true }));
  imprimir('Sin argumentos ->', crearInscripcion());

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
  titulo('6. El operador rest en el destructuring');

  const cuenta = {
    usuario: 'lucia',
    email: 'lucia@example.com',
    contrasena: 'sup3rs3cr3ta',
    tokenSesion: 'abc.def.ghi',
    rol: 'estudiante',
  };

  // Sacamos lo sensible y nos quedamos con "el resto".
  const { contrasena, tokenSesion, ...datosPublicos } = cuenta;
  imprimir('Datos públicos ->', datosPublicos);
  imprimir('El objeto original sigue intacto ->', Object.keys(cuenta));

  // ⚠️ ERROR COMÚN: el rest debe ir SIEMPRE al final.
  //    const { ...resto, usuario } = cuenta;  -> SyntaxError

  // Rest también funciona en los parámetros de una función.
  function guardarEstudiante({ id, ...camposEditables }) {
    return `Actualizando el id ${id} con: ${Object.keys(camposEditables).join(', ')}`;
  }
  imprimir(guardarEstudiante({ id: 17, nombre: 'Lucía', edad: 22, beca: true }));

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
  titulo('7. Encadenamiento opcional ?.');

  const estudianteSinDatos = { id: 18, nombre: 'Martín' };

  // Antes había que escribir esto:
  const emailViejo =
    estudianteSinDatos && estudianteSinDatos.contacto && estudianteSinDatos.contacto.email;
  imprimir('Con && (forma antigua) ->', emailViejo);

  // Ahora:
  imprimir('Con ?. ->', estudianteSinDatos.contacto?.email); // undefined, sin error
  imprimir('Encadenando varios ->', estudianteSinDatos.contacto?.redes?.github); // undefined

  // Sin ?. tendríamos el clásico error:
  try {
    imprimir(estudianteSinDatos.contacto.email);
  } catch (error) {
    imprimir('Sin ?. ->', error.message);
  }

  // VARIANTE ?.[ ] : para acceder con corchetes (claves dinámicas o arrays).
  const claveBuscada = 'telefono';
  imprimir('?.[clave] ->', estudiante.contacto?.[claveBuscada]);
  imprimir('?.[índice] ->', estudianteSinDatos.notas?.[0]); // undefined, sin romper
  imprimir('Nota real ->', estudiante.notas?.[0]);          // 8.5

  // VARIANTE ?.() : para llamar a una función que quizá no existe.
  const registro = {
    guardar(dato) {
      return 'Guardado: ' + dato;
    },
  };
  imprimir('Método que existe ->', registro.guardar?.('nota 9'));
  imprimir('Método que NO existe ->', registro.eliminar?.('nota 9')); // undefined

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
  titulo('8. ?? frente a ||');

  const configuracion = {
    faltas: 0,
    comentario: '',
    notificaciones: false,
    limite: null,
  };

  imprimir('faltas || 10 ->', configuracion.faltas || 10);   // 10  <- ⚠️ incorrecto
  imprimir('faltas ?? 10 ->', configuracion.faltas ?? 10);   // 0   <- ✅ correcto

  imprimir('comentario || "vacío" ->', configuracion.comentario || 'vacío'); // "vacío"
  imprimir('comentario ?? "vacío" ->', configuracion.comentario ?? 'vacío'); // ""

  imprimir('notificaciones || true ->', configuracion.notificaciones || true); // true (mal)
  imprimir('notificaciones ?? true ->', configuracion.notificaciones ?? true); // false (bien)

  imprimir('limite ?? 100 ->', configuracion.limite ?? 100); // 100 (null sí activa ??)

  // ✅ Combinación ganadora: ?. para bajar sin miedo y ?? para el valor final.
  imprimir(
    'Teléfono seguro ->',
    estudianteSinDatos.contacto?.telefono ?? 'Sin teléfono registrado'
  );

  // ⚠️ ERROR COMÚN: mezclar ?? con || o && sin paréntesis.
  //    a ?? b || c  -> SyntaxError. Hay que escribir  (a ?? b) || c
  const mezclaCorrecta = (configuracion.limite ?? 100) || 999;
  imprimir('Mezcla con paréntesis ->', mezclaCorrecta);

  // ATAJO ??=  : "asigna solo si está vacío (null o undefined)".
  const preferencias = { tema: null, idioma: 'es' };
  preferencias.tema ??= 'oscuro';   // se asigna, porque era null
  preferencias.idioma ??= 'en';     // NO se asigna, ya tenía valor
  imprimir('Con ??= ->', preferencias);

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
