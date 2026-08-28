/**
 * ============================================================
 * ARCHIVO: js/extras/sintaxis-moderna.js
 * TEMA: Repaso avanzado de la sintaxis moderna de JavaScript (ES6+)
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  1. let / const, ambito de bloque y la ZONA MUERTA TEMPORAL (TDZ).
 *  2. Template literals: expresiones, multilinea y tagged templates.
 *  3. Destructuring avanzado y combinado.
 *  4. Spread y rest en todos sus contextos.
 *  5. Parametros por defecto evaluados en tiempo de LLAMADA.
 *  6. Encadenamiento opcional ?. y fusion nula ??
 *  7. Operadores logicos de asignacion ||=, &&=, ??=
 *  8. Separadores numericos con guion bajo (1_000_000).
 *
 * COMO SE USA
 * Cada tema es una funcion exportada que recibe una "consola" (creada
 * con crearConsola del modulo consola.js) y escribe ahi sus resultados.
 * main.js las llama una por una. Asi el docente puede comentar cada
 * bloque mientras la clase ve la salida en pantalla.
 * ============================================================
 */

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Este es el archivo MAS LARGO del proyecto (unas 1.100 lineas en la
   version resuelta) y tambien el mas repetitivo: son ocho demos con la
   misma estructura. NO intentes escribirlo entero en una sesion.

   Reparto sugerido:
     - Clase A: secciones 1, 2 y 3   (declaraciones, plantillas, destructuring)
     - Clase B: secciones 4, 5 y 6   (spread/rest, parametros, ?. y ??)
     - Clase C: secciones 7 y 8      (asignacion logica, numeros)

   Cada funcion `demoX(consola)` debe existir y ser exportada aunque
   solo tenga dentro un par de lineas: main.js las llama por su nombre.
   Escribe primero las ocho firmas vacias y ve rellenandolas.

   Firmas exactas que espera main.js:
     demoDeclaraciones, demoPlantillas, demoDestructuring, demoSpreadRest,
     demoParametrosPorDefecto, demoOpcionalYNulo, demoAsignacionLogica,
     demoNumeros
   ============================================================ */

// ============================================================
// IMPORTACIONES
// ------------------------------------------------------------
// Fijate en la ruta: este archivo vive en js/extras/, asi que para
// llegar a js/modulos/ hay que SUBIR un nivel con '../'.
// Importamos tres plantillas etiquetadas para la seccion 2.
// ============================================================

// TODO (en clase):
//   1. Importa las tres plantillas etiquetadas del modulo de formato:
//        import { destacar, dinero, seguroHTML } from '../modulos/formato.js';
//      Detente en el '../': desde js/extras/ hay que subir a js/ y bajar
//      a modulos/. Es el error de ruta numero uno del proyecto.
//   2. Marca de evaluacion: console.log('[sintaxis-moderna.js] Modulo evaluado.');
//   (aprox. 2 lineas)

// ============================================================
// 1. LET / CONST / VAR Y LA ZONA MUERTA TEMPORAL
// ============================================================

// TODO (en clase) — export function demoDeclaraciones(consola)
//   Recibe una consola con los metodos .titulo(texto) e .imprimir(...).
//
//   1.1 var se "eleva" (hoisting) e inicia valiendo undefined.
//       Cuando el motor entra en una funcion, primero RESERVA sitio para
//       todas las variables `var` y les pone undefined. Por eso se puede
//       leer una var antes de la linea donde se declara, sin error.
//       -> consola.titulo('var: hoisting con valor undefined')
//       -> Declara dentro `function demostrarVar()` que LEA `mensajeVar`
//          antes de su propia linea `var mensajeVar = 'Hola desde var';`
//          y devuelva { valorAntes, valorDespues }.
//       -> Imprime el resultado y la conclusion:
//          "-> Leer una var antes de declararla NO da error: da undefined."
//       (aprox. 8 lineas)
//
//   1.2 let y const tambien se elevan, pero quedan en la TDZ.
//       La ZONA MUERTA TEMPORAL es el tramo de codigo que va desde el
//       inicio del bloque hasta la linea donde se declara la variable.
//       Dentro de ese tramo la variable EXISTE pero esta "sin inicializar",
//       y tocarla lanza un ReferenceError.
//       Analogia: la silla del aula ya esta reservada con tu nombre, pero
//       hasta que llegues nadie puede sentarse en ella. Si alguien lo
//       intenta, el profesor lo echa (ReferenceError).
//       -> consola.titulo('const/let: zona muerta temporal (TDZ)')
//       -> `function demostrarTDZ()` que lea `notaFinal` una linea ANTES
//          de `const notaFinal = 6.5;`. Llamala dentro de try/catch e
//          imprime `Error capturado: ${error.constructor.name} -> ${error.message}`.
//       (aprox. 12 lineas)
//
//   1.3 typeof deja de ser seguro dentro de la TDZ.
//       Con variables NO declaradas, typeof siempre fue seguro y devolvia
//       "undefined". Con let/const en TDZ, typeof TAMBIEN lanza error.
//       -> Imprime `typeof variableQueNoExisteEnNingunSitio` (da "undefined").
//       -> Y una funcion `typeofEnTDZ()` que haga `typeof puntaje` antes de
//          `const puntaje = 10;`, dentro de try/catch.
//       ⚠️ ERROR COMUN: creer que typeof "nunca falla". Con let/const si falla.
//       (aprox. 12 lineas)
//
//   1.4 Ambito de BLOQUE frente a ambito de FUNCION.
//       `var` solo respeta los limites de una funcion. `let` y `const`
//       respetan cualquier par de llaves { }: un if, un for, un bloque suelto.
//       -> Declara `var visibleFuera`, un `if (true) { var visibleFuera2 = ...; let soloDentro = ...; }`
//          e imprime desde FUERA del if la var declarada dentro. Comenta que
//          la variable let ni siquiera existe ahi fuera.
//       (aprox. 10 lineas)
//
//   1.5 El clasico bucle con funciones: var comparte, let no.
//       Con `var` hay UNA sola variable compartida por todas las vueltas,
//       asi que al final todas las funciones ven el mismo valor.
//       Con `let` se crea una variable NUEVA en cada vuelta.
//       -> Dos arrays de funciones: uno llenado con `for (var indice ...)` y
//          otro con `for (let posicion ...)`, tres vueltas cada uno.
//       Resultado esperado en pantalla:
//          Con var  -> [3,3,3]
//          Con let  -> [0,1,2]
//          -> Este es el motivo numero uno para no usar var nunca mas.
//       (aprox. 14 lineas)
//
//   1.6 const NO significa "inmutable".
//       const impide REASIGNAR la variable (apuntarla a otra cosa), pero
//       el contenido de un objeto o array si se puede modificar.
//       Analogia: const es como pegar una etiqueta con pegamento a una caja.
//       No puedes despegarla y ponerla en otra caja, pero si puedes abrir la
//       caja y cambiar lo que hay dentro.
//       -> `const curso = { nombre: 'Full Stack 2', estudiantes: 24 };`
//          Muta estudiantes a 26, anade modalidad 'presencial' e imprimelo.
//       -> NO ejecutes la reasignacion: solo imprime el aviso
//          'Reasignar una const lanzaria: TypeError: Assignment to constant variable.'
//          En clase basta con escribirlo en la consola del navegador (F12).
//       (aprox. 8 lineas)
//
//   1.7 Object.freeze: congelar el CONTENIDO.
//       Si de verdad queremos que nadie toque el contenido, existe
//       Object.freeze. Como los modulos estan siempre en modo estricto,
//       intentar escribir en un objeto congelado LANZA un TypeError
//       (en modo no estricto fallaba en silencio, que era mucho peor).
//       OJO: freeze congela un solo nivel (es "superficial"), igual que el
//       spread. Los objetos anidados siguen siendo modificables.
//       -> `const configuracion = Object.freeze({ tema: 'oscuro', idioma: 'es' });`
//          Intenta escribir dentro de un try/catch, imprime el nombre del
//          error, el objeto intacto y Object.isFrozen(configuracion).
//       (aprox. 12 lineas)

// ============================================================
// 2. TEMPLATE LITERALS Y TAGGED TEMPLATES
// ============================================================

// TODO (en clase) — export function demoPlantillas(consola)
//   Datos de partida (una linea, escribela tal cual):
//     const estudiante = { nombre: 'Camila Rojas', nota: 6.4, asistencia: 0.92 };
//
//   2.1 Interpolacion de expresiones.
//       Dentro de ${ } cabe CUALQUIER expresion, no solo una variable:
//       operaciones, llamadas a funciones, ternarios, otro template...
//       Lo que NO cabe es una sentencia (un if o un for).
//       -> Cinco lineas con template literals: el nombre, Math.round(nota),
//          la asistencia con (asistencia * 100).toFixed(1) + '%', un ternario
//          Aprobado/Reprobado con umbral 4, y un template ANIDADO dentro de otro.
//       (aprox. 6 lineas)
//
//   2.2 Cadenas multilinea.
//       Antes habia que concatenar con \n y comillas por todas partes.
//       Con las comillas invertidas, los saltos de linea se escriben tal cual.
//       ✅ BUENA PRACTICA: cuidado con la sangria. Todo lo que escribas dentro
//       de las comillas invertidas FORMA PARTE del texto, espacios incluidos.
//       -> Construye `const certificado = ...` en varias lineas con el titulo
//          "CERTIFICADO DE NOTAS", una linea de guiones, y las filas
//          "Estudiante :", "Nota final :" y "Asistencia :". Imprimelo.
//       (aprox. 8 lineas)
//
//   2.3 Tagged templates: una funcion delante de las comillas.
//       Sintaxis:  miEtiqueta`texto ${valor} texto`
//       El motor llama a miEtiqueta con (trozosDeTexto, ...valores).
//       La funcion decide como combinarlo todo, e incluso puede devolver
//       algo que no sea un string.
//       -> Usa las dos etiquetas importadas de formato.js:
//            consola.imprimir(destacar`La nota de ${estudiante.nombre} es ${estudiante.nota}.`)
//          y, con `const subtotal = 24_990;` y `const envio = 3_500;`,
//            consola.imprimir(dinero`Subtotal: ${subtotal} + envio ${envio} = total ${subtotal + envio}`)
//       (aprox. 5 lineas)
//
//   2.4 Como funciona por dentro una etiqueta.
//       Definimos aqui mismo una etiqueta que simplemente muestra lo que
//       recibe. Es la mejor forma de entender el mecanismo.
//       -> `function inspeccionar(trozos, ...valores)` que devuelva
//          `trozos = ${JSON.stringify(trozos)} | valores = ${JSON.stringify(valores)}`
//          y usala como inspeccionar`Hola ${'Ana'}, tienes ${3} tareas pendientes.`
//       Conclusion que hay que imprimir:
//          "-> Hay siempre UN trozo de texto mas que valores interpolados."
//       (aprox. 6 lineas)
//
//   2.5 Uso serio: escapar HTML para evitar XSS.
//       Si insertamos texto del usuario con innerHTML sin escaparlo,
//       cualquiera puede inyectar etiquetas y ejecutar codigo.
//       -> `const nombreMalicioso = '<img src=x onerror="robarSesion()">';`
//          Imprime la version sin escapar y la version con seguroHTML``.
//          Cierra con: "-> Escapado, el navegador lo muestra como TEXTO y no lo ejecuta."
//       (aprox. 5 lineas)
//
//   2.6 String.raw: la etiqueta que trae el propio lenguaje.
//       Devuelve el texto SIN procesar las secuencias de escape.
//       Muy util para rutas de Windows o para expresiones regulares.
//       -> Imprime el mismo texto con salto \n normal y con String.raw.
//       (aprox. 3 lineas)

// ============================================================
// 3. DESTRUCTURING AVANZADO
// ============================================================

// TODO (en clase) — export function demoDestructuring(consola)
//
//   3.1 Arrays: posicion, huecos, valores por defecto y rest.
//       En los arrays lo que manda es la POSICION.
//       -> Datos: `const notas = [6.5, 4.8, 3.2, 7.0, 5.5];`
//       -> `const [primera, segunda] = notas;`
//       -> Una coma vacia SALTA una posicion: `const [, , tercera] = notas;`
//       -> Valor por defecto (solo se usa si el elemento es undefined):
//          `const [n1, n2, n3, n4, n5, n6 = 1.0] = notas;`
//       -> Rest: `const [mejorIntento, ...intentosRestantes] = notas;`
//       -> Intercambio sin variable auxiliar: `let a = 'primero'; let b = 'segundo'; [a, b] = [b, a];`
//       (aprox. 14 lineas)
//
//   3.2 Objetos: nombre, renombrado y valores por defecto.
//       En los objetos lo que manda es el NOMBRE de la propiedad,
//       no el orden en que la escribas.
//       -> Datos (copialos del archivo resuelto, son 9 lineas): un objeto
//          `estudiante` con nombre 'Ignacio Fuentes', correo, notas y un
//          objeto anidado contacto { telefono, direccion { comuna, ciudad } }.
//       -> `const { nombre, correo } = estudiante;`
//       -> Renombrado con dos puntos: `const { nombre: nombreCompleto, correo: email } = estudiante;`
//       -> Valor por defecto para una propiedad que no existe: `const { carrera = 'Sin definir' } = estudiante;`
//       -> Renombrado Y defecto a la vez: `const { promedio: promedioGeneral = 0 } = estudiante;`
//       -> Rest de objeto (la forma limpia de quitar una propiedad sin delete):
//          `const { correo: _correoIgnorado, ...estudianteSinCorreo } = estudiante;`
//       (aprox. 16 lineas)
//
//   3.3 Anidado: objetos dentro de objetos.
//       Los dos puntos aqui NO renombran: abren un nivel mas.
//       -> Desestructura telefono, comuna y ciudad de una sola vez.
//       ⚠️ ERROR COMUN: creer que `contacto` queda declarada como variable.
//       No es asi: al escribir `contacto: { ... }` solo se declaran telefono,
//       comuna y ciudad. Si quieres las dos cosas, repite la propiedad:
//         const { contacto, contacto: { telefono: tel } } = estudiante;
//       (aprox. 10 lineas)
//
//   3.4 EL COMBINADO: arrays DENTRO de objetos.
//       Este es el caso mas frecuente cuando se consume una API real.
//       -> Datos: `const respuestaDelServidor = { exito: true, pagina: 1, resultados: [...] }`
//          con tres productos (id 101 'Teclado mecanico' 45_990 etiquetas
//          ['oferta','nuevo']; id 102 'Monitor 27 pulgadas' 189_990 ['destacado'];
//          id 103 'Mouse inalambrico' 19_990 []). Copialo del archivo resuelto.
//       -> Saca de una sola expresion: exito, el PRIMER resultado completo y,
//          del segundo, su producto y su precio renombrados.
//       -> Y luego arrays dentro de objetos dentro de arrays, con defecto:
//          `const { resultados: [{ etiquetas: [etiquetaPrincipal = 'sin etiqueta'] }] } = respuestaDelServidor;`
//       -> Repitelo con el TERCER producto (etiquetas vacio) para que se vea
//          que el valor por defecto salva el dia.
//       (aprox. 22 lineas + 8 de datos)
//
//   3.5 Destructuring en los PARAMETROS de una funcion.
//       Es la forma moderna de recibir "opciones con nombre". Quien llama
//       no tiene que recordar el orden de los argumentos.
//       -> Escribe `crearMatricula({ estudiante = 'Sin nombre', curso = 'Full Stack 2',
//          modulos = [], contacto: { email = 'sin-correo@ejemplo.cl' } = {} } = {})`
//          (renombra estudiante->nombreEstudiante y curso->nombreCurso al
//          desestructurar) y que devuelva { nombreEstudiante, nombreCurso,
//          cantidadModulos, primerModulo: modulos.at(0) ?? 'ninguno', correoContacto }.
//       El `= {}` del final es CLAVE: permite llamar a la funcion sin
//       argumentos. Sin el, crearMatricula() lanzaria un TypeError porque
//       intentaria desestructurar undefined.
//       -> Llamala tres veces: sin argumentos, parcial y completa.
//       (aprox. 22 lineas)
//
//   3.6 Destructuring en bucles.
//       -> `const inventario = { teclados: 12, monitores: 4, mouses: 27 };`
//          Recorre con `for (const [articulo, cantidad] of Object.entries(inventario))`
//          e imprime alineado con padEnd(12, '.') y padStart(3, ' ').
//       -> Y sobre el array de objetos: `for (const { id, producto } of respuestaDelServidor.resultados)`
//       (aprox. 8 lineas)
//
//   3.7 Proteccion frente a null / undefined.
//       ⚠️ ERROR COMUN: desestructurar algo que puede venir vacio.
//         const { nombre } = undefined;  -> TypeError
//       La solucion es un `?? {}` de red de seguridad.
//       -> `const respuestaVacia = null;` y `const { datos = 'sin datos' } = respuestaVacia ?? {};`
//       -> Y el mismo caso SIN la red, dentro de try/catch, para ver el TypeError.
//       (aprox. 10 lineas)

// ============================================================
// 4. SPREAD Y REST EN TODOS SUS CONTEXTOS
// ============================================================

// TODO (en clase) — export function demoSpreadRest(consola)
//   Empieza la funcion con este comentario, que es el resumen de la seccion:
//     Los tres puntos ... significan cosas OPUESTAS segun donde esten:
//       - A la IZQUIERDA de un = (o en parametros): REST -> empaqueta.
//       - A la DERECHA (dentro de [], {} o de una llamada): SPREAD -> desempaqueta.
//     Analogia: rest mete la compra en una bolsa; spread saca la compra
//     de la bolsa y la reparte por la mesa.
//
//   4.1 Spread con arrays.
//       -> `const modulosBasicos = ['Variables', 'Funciones', 'Arrays'];`
//          `const modulosAvanzados = ['Modulos', 'Asincronia'];`
//       -> copia, unidos, conIntermedio (con 'DOM' intercalado) y la
//          comprobacion `copia !== modulosBasicos` (true: es otro array).
//       -> Spread sobre cualquier ITERABLE, no solo arrays:
//          [...'Hola'] y [...new Set([1, 2, 2, 3, 3, 3])].
//       -> Truco muy usado: quitar duplicados en una linea con
//          [...new Set([6.5, 4.0, 6.5, 7.0, 4.0])].
//       -> Y convertir una NodeList del DOM en un array de verdad:
//          `[...document.querySelectorAll('.seccion > h2')]` e imprime su .length
//          (en esta pagina debe dar 18).
//       (aprox. 16 lineas)
//
//   4.2 Spread con objetos.
//       -> `const configuracionBase = { tema: 'oscuro', idioma: 'es', notificaciones: true };`
//          `const preferenciasUsuario = { idioma: 'en', fuente: 'grande' };`
//       -> Mezcla: el de la DERECHA gana en caso de conflicto (idioma acaba
//          en 'en'). Imprime tambien el orden invertido: el orden IMPORTA.
//       -> Anade una propiedad puntual sin mutar el original:
//          `const conAcento = { ...configuracionBase, acento: '#38bdf8' };`
//       (aprox. 10 lineas)
//
//   4.3 CUIDADO: el spread hace copias SUPERFICIALES.
//       Solo copia el primer nivel. Los objetos anidados se COMPARTEN.
//       Este es uno de los errores mas caros y silenciosos del lenguaje.
//       -> `const cursoOriginal = { nombre: 'Full Stack 2', horario: { dia: 'martes', hora: '19:00' } };`
//          Copia con spread, cambia `nombre` (solo cambia la copia) y
//          `horario.hora` (CAMBIA LOS DOS). Imprime los dos objetos y
//          `cursoOriginal.horario === cursoCopia.horario` (true).
//       -> La solucion moderna: `structuredClone(cursoOriginal)` y comprueba
//          que ahora el original NO cambia.
//       (aprox. 14 lineas)
//
//   4.4 Spread al LLAMAR a una funcion.
//       -> `const temperaturas = [18, 24, 11, 30, 27];`
//          Imprime Math.max(temperaturas) -> NaN y Math.max(...temperaturas) -> 30.
//          "-> Sin spread le pasamos UN array; Math.max espera numeros sueltos."
//       (aprox. 5 lineas)
//
//   4.5 REST en los parametros de una funcion.
//       -> `function organizarReunion(sala, hora, ...invitados)`: los dos
//          primeros argumentos tienen nombre propio; el resto se agrupa en un
//          array real. Llamala con ('B-204', '10:30', 'Ana', 'Luis', 'Camila')
//          y con ('A-101', '15:00').
//       -> `function sumarTodo(...numeros)` con reduce. Llamala con argumentos
//          sueltos y con spread, para ver que es lo mismo.
//       El rest es un ARRAY DE VERDAD, a diferencia del viejo `arguments`,
//       que era un objeto parecido a un array y no tenia map ni filter.
//       Ademas `arguments` no existe en las funciones flecha.
//       REGLA: el parametro rest tiene que ir el ULTIMO y solo puede haber uno.
//       (aprox. 12 lineas)
//
//   4.6 Rest dentro del destructuring (arrays y objetos).
//       -> `const [ganador, subcampeon, ...demasParticipantes] = ['Ana', 'Luis', 'Camila', 'Diego', 'Sofia'];`
//       -> Patron muy usado en backend: quitar campos sensibles antes de responder.
//          `const usuario = { id: 7, nombre: 'Sofia', clave: 'secreta123', rol: 'docente' };`
//          `const { clave, ...usuarioPublico } = usuario;`
//       (aprox. 8 lineas)
//
//   4.7 Combinaciones.
//       -> `function registrarNotas(estudiante = 'Anonimo', minimo = 4, ...notas)`
//          que filtre las notas >= minimo y devuelva
//          `${estudiante}: ${aprobadas.length} de ${notas.length} notas aprobadas`.
//          Llamala con ('Camila', 4, 6.5, 3.2, 5.0, 4.0) y sin argumentos.
//       (aprox. 8 lineas)

// ============================================================
// 5. PARAMETROS POR DEFECTO EVALUADOS EN TIEMPO DE LLAMADA
// ============================================================

// TODO (en clase) — export function demoParametrosPorDefecto(consola)
//
//   5.1 undefined activa el defecto, null no.
//       -> `function saludar(nombre = 'invitado')` y llamala cuatro veces:
//          sin argumentos, con undefined, con null y con ''.
//       Resultado esperado en pantalla:
//          Hola, invitado / Hola, invitado / Hola, null / Hola,
//          "-> Solo undefined activa el valor por defecto. Es un error comun."
//       (aprox. 8 lineas)
//
//   5.2 El defecto se evalua EN CADA LLAMADA.
//       Esta es la diferencia clave con otros lenguajes (Python, por ejemplo)
//       donde el valor por defecto se calcula UNA sola vez al definir la
//       funcion. En JavaScript se calcula cada vez que hace falta.
//       -> `let vecesCalculado = 0;` y `function siguienteFolio()` que sume 1
//          y devuelva `FOLIO-${String(vecesCalculado).padStart(4, '0')}`.
//       -> `function emitirBoleta(monto, folio = siguienteFolio())`.
//          Llamala con 1_990, 2_500, (3_100, 'FOLIO-MANUAL') y 4_000.
//       Resultado esperado: FOLIO-0001, FOLIO-0002, FOLIO-MANUAL, FOLIO-0003
//       y vecesCalculado = 3.
//          "-> Al pasar un folio manual, la funcion por defecto NI SE EJECUTA."
//       (aprox. 14 lineas)
//
//   5.3 Cada llamada recibe una estructura nueva.
//       Como el defecto se evalua cada vez, cada llamada recibe un array
//       NUEVO. Si el defecto se calculara una sola vez, todas las llamadas
//       compartirian el mismo array y se irian pisando.
//       -> `function agregarTarea(tarea, lista = [])` que haga push y devuelva
//          la lista. Llamala dos veces con tareas distintas.
//       -> Compara con el antipatron: `const listaCompartida = [];` y
//          `function agregarMal(tarea, lista = listaCompartida)`. Llamala tres
//          veces y se ve que se acumula todo.
//       (aprox. 12 lineas)
//
//   5.4 Un defecto puede usar parametros ANTERIORES.
//       Los parametros se evaluan de izquierda a derecha, asi que un
//       parametro puede apoyarse en los que vienen antes que el.
//       -> `function crearUsuario(nombre, alias = nombre.toLowerCase().replaceAll(' ', '.'), rol = 'estudiante')`.
//          Llamala con ('Maria Jose Pinto') y con ('Pedro Salas', 'pedrito', 'docente').
//       -> Pero al reves NO funciona: `function alReves(a = b, b = 2)` dentro de
//          try/catch. Hay una TDZ tambien en los parametros.
//       (aprox. 12 lineas)
//
//   5.5 Detalle curioso: funcion.length.
//       funcion.length cuenta los parametros ANTES del primero con defecto.
//       -> Declara `tresParametros(a, b, c)`, `conDefecto(a, b = 2, c = 3)` y
//          `conRest(a, ...resto)` e imprime su .length.
//       Resultado esperado: 3, 1 y 1.
//       (aprox. 7 lineas)

// ============================================================
// 6. ENCADENAMIENTO OPCIONAL (?.) Y FUSION NULA (??)
// ============================================================

// TODO (en clase) — export function demoOpcionalYNulo(consola)
//   Datos de partida (copialos del archivo resuelto, unas 14 lineas): un
//   objeto `pedido` con id 5501, un `cliente` que tiene nombre y direccion
//   pero NO tiene telefono, dos `items`, y tres propiedades tramposas a
//   proposito: descuento: 0, comentario: '' y cupon: null.
//
//   6.1 El problema que resuelve ?.
//       -> Dentro de try/catch, lee `pedido.envio.transportista`: pedido.envio
//          es undefined y leer .transportista de undefined explota.
//       -> Con ?. la cadena se DETIENE en cuanto encuentra null o undefined y
//          devuelve undefined, sin lanzar error. Imprime tres casos:
//          pedido.envio?.transportista, pedido.cliente?.direccion?.comuna y
//          pedido.cliente?.empresa?.rut?.digito.
//       -> Demuestra el cortocircuito TOTAL: `let vecesEvaluado = 0;`, una
//          flecha `contar` que lo suba y devuelva 0, `const nada = null;` e
//          imprime `nada?.items?.[contar()]`. contar() se ejecuto 0 veces.
//       (aprox. 14 lineas)
//
//   6.2 Las tres formas del encadenamiento opcional.
//       a) Propiedad:      objeto?.propiedad
//       b) Corchetes:      objeto?.[expresion]   <- ojo al punto antes del corchete
//       c) Llamada:        objeto.metodo?.()    <- llama solo si el metodo existe
//       -> Un ejemplo de cada: pedido.cliente?.nombre; con `const campoDinamico = 'comuna'`
//          pedido.cliente?.direccion?.[campoDinamico]; pedido.items?.[1]?.descripcion
//          y pedido.items?.[9]?.descripcion (fuera de rango); pedido.calcularTotal?.()
//          y un `const conMetodo = { total: () => 235_980 };` con conMetodo.total?.().
//       ⚠️ ERROR COMUN: pensar que ?. protege de una variable NO DECLARADA.
//       No lo hace: `noExiste?.algo` lanza ReferenceError igual.
//       ?. protege del valor null/undefined, no de la falta de declaracion.
//       (aprox. 12 lineas)
//
//   6.3 Fusion nula ?? frente a ||.
//       || salta con cualquier valor FALSY: 0, '', NaN, false, null, undefined.
//       ?? salta SOLO con null o undefined.
//       Analogia: || pregunta "esto vale algo?" y considera que un cero no
//       vale nada. ?? pregunta "esto EXISTE?" y un cero existe perfectamente.
//       -> Compara descuento con || (da 10, mal) y con ?? (da 0, bien);
//          comentario con los dos; cupon (null) y una propiedad ausente.
//       -> Y monta la tabla comparativa para proyectar: recorre con for...of
//          `[0, '', false, NaN, null, undefined, 'texto', 42]` imprimiendo en
//          cada vuelta el valor, su resultado con || y con ??, alineados con
//          padEnd(11) y padEnd(9).
//       (aprox. 16 lineas)
//
//   6.4 La pareja perfecta: ?. junto a ??.
//       -> `const telefono = pedido.cliente?.telefono ?? 'Telefono no registrado';`
//       -> `const primeraItemDescripcion = pedido.items?.at(0)?.descripcion ?? 'Pedido vacio';`
//       ⚠️ ERROR COMUN DE SINTAXIS: no se puede mezclar ?? con || o && sin parentesis.
//         const x = a ?? b || c;        -> SyntaxError
//         const x = (a ?? b) || c;      -> correcto
//       El lenguaje lo prohibe a proposito, para que no haya ambiguedad.
//       -> Con `const a = null; const b = 0; const c = 'ultimo';` imprime las
//          dos versiones con parentesis y comenta que dan resultados distintos.
//       (aprox. 10 lineas)

// ============================================================
// 7. OPERADORES LOGICOS DE ASIGNACION
// ============================================================

// TODO (en clase) — export function demoAsignacionLogica(consola)
//   Abre la funcion con este recordatorio en comentario:
//     Son azucar sintactico que combina un operador logico con una
//     asignacion. Los tres hacen CORTOCIRCUITO: si no toca asignar,
//     la asignacion ni siquiera se ejecuta.
//       x ||= y   equivale a   x || (x = y)
//       x &&= y   equivale a   x && (x = y)
//       x ??= y   equivale a   x ?? (x = y)
//
//   7.a ||= asigna si el valor actual es FALSY.
//       -> Tres casos: `let titulo = ''` (se sustituye), `let contador = 0`
//          (¡cuidado, el 0 se pierde!) y `let nombre = 'Camila'` (no se toca).
//       (aprox. 10 lineas)
//
//   7.b &&= asigna solo si el valor actual es TRUTHY.
//       -> `let apodo = 'la profe'; apodo &&= apodo.toUpperCase();`
//       -> `let apodoVacio = null; apodoVacio &&= apodoVacio.toUpperCase();`
//          No explota, porque la parte derecha ni se ejecuta.
//          "-> &&= es una forma comoda de transformar algo 'solo si existe'."
//       (aprox. 8 lineas)
//
//   7.c ??= asigna solo si es null o undefined.
//       -> `const preferencias = { tema: null, volumen: 0, idioma: undefined, fuente: 'mediana' };`
//          Aplica ??= a las cuatro claves ('oscuro', 50, 'es', 'grande').
//       Resultado esperado: tema 'oscuro', volumen 0, idioma 'es', fuente 'mediana'.
//          "-> Fijate en que el volumen 0 SOBREVIVE. Con ||= habria pasado a 50."
//       (aprox. 10 lineas)
//
//   7.1 El detalle importante: el CORTOCIRCUITO.
//       Si no hay que asignar, la asignacion no ocurre EN ABSOLUTO. Eso
//       importa cuando la propiedad tiene un setter, o cuando escribir
//       dispara algun efecto (por ejemplo, redibujar la pantalla).
//       -> `let escrituras = 0;` y un objeto con get/set valor que suba
//          `escrituras` en cada escritura. Aplica ??= (no asigna: sigue en 0)
//          y luego una asignacion normal (pasa a 1).
//          "-> Con `objeto.valor = objeto.valor ?? x` el setter SI se dispararia."
//       (aprox. 16 lineas)
//
//   7.2 Caso real: agrupar sin comprobar si la clave existe.
//       -> `const inscripciones = [...]` con cuatro objetos { curso, estudiante }:
//          Full Stack 2/Ana, Bases de datos/Luis, Full Stack 2/Camila,
//          Full Stack 2/Diego.
//       -> `const porCurso = {};` y un for...of desestructurando { curso, estudiante }
//          con `porCurso[curso] ??= [];` antes del push.
//          Sin ??= habria que escribir `if (!porCurso[curso]) porCurso[curso] = [];`
//       (aprox. 14 lineas)

// ============================================================
// 8. SEPARADORES NUMERICOS Y NUMEROS EN GENERAL
// ============================================================

// TODO (en clase) — export function demoNumeros(consola)
//   OJO: esta funcion se llama igual que una de metodos-modernos.js. No hay
//   choque porque main.js las importa con `import * as` en dos espacios de
//   nombres distintos (sintaxis.demoNumeros y metodos.demoNumeros).
//
//   8.1 Separadores numericos (guion bajo).
//       Solo sirven para que TU leas mejor el codigo. El motor los ignora
//       por completo. Se pueden poner donde quieras entre digitos.
//       -> `const sueldoMinimo = 500_000;`, `const presupuesto = 1_250_000;`
//          `const distanciaSol = 149_600_000;` e imprime `1_000_000 === 1000000` (true).
//       -> Tambien funcionan con decimales y con otras bases:
//          6.626_070_15e-34, 0b1010_0001, 0xff_38_bd y 0o7_5_5. Imprime los cuatro.
//       REGLAS: no puede ir al principio, ni al final, ni junto al punto
//       decimal, ni doble. Todo eso es un error de sintaxis:
//         _1000   1000_   1_.5   1__000
//       (aprox. 16 lineas)
//
//   8.2 BigInt: mas alla del entero seguro.
//       -> Imprime Number.MAX_SAFE_INTEGER y la comparacion
//          `Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2` (true,
//          y ese es justamente el problema).
//       -> `const enorme = 9_007_199_254_740_993n;` (la n final lo convierte en
//          BigInt). Imprime enorme + 1n y typeof enorme.
//       ⚠️ ERROR COMUN: mezclar BigInt con Number en una operacion lanza
//       TypeError. Provocalo dentro de un try/catch.
//       (aprox. 14 lineas)
//
//   8.3 Number.isInteger / isFinite / isNaN.
//       Las versiones "Number." NO convierten tipos. Las globales antiguas
//       (isNaN, isFinite) si convierten, y eso produce sorpresas.
//       -> Imprime, con el valor esperado al lado en un comentario:
//          Number.isInteger(7) true | Number.isInteger('7') false
//          Number.isInteger(7.0) true (7.0 es 7) | Number.isInteger(7.5) false
//          isNaN('hola') true (convierte) | Number.isNaN('hola') false
//          Number.isNaN(NaN) true | isFinite('42') true | Number.isFinite('42') false
//       ✅ BUENA PRACTICA: usa siempre las versiones de Number.
//       (aprox. 12 lineas)
//
//   8.4 El clasico problema de los decimales.
//       -> Imprime 0.1 + 0.2, la comparacion con 0.3 (false) y la version con
//          tolerancia `Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON` (true).
//          "-> Para dinero, trabaja en centavos con enteros."
//       -> `const precio = 19.999;` toFixed(2) devuelve un STRING, no un numero:
//          imprime el valor y su typeof, y luego Number(precio.toFixed(2)).
//       (aprox. 8 lineas)

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Escribe una funcion `resumirPedido(pedido)` que use SOLO destructuring
 *    en los parametros (nada de pedido.algo dentro del cuerpo) para devolver
 *    el nombre del cliente, la comuna y la descripcion del primer item, con
 *    valores por defecto para todos los casos ausentes.
 *
 * 2) Crea la plantilla etiquetada `notas` que reciba una plantilla con numeros
 *    interpolados y anada automaticamente "(aprobado)" o "(reprobado)" detras
 *    de cada nota segun el umbral 4,0.
 *
 * 3) Toma la funcion `emitirBoleta` de la seccion 5 y modificala para que el
 *    folio incluya el ano actual (FOLIO-2026-0001). El defecto debe seguir
 *    evaluandose en cada llamada; demuestralo en la consola.
 *
 * 4) Escribe `obtenerValor(objeto, ruta, porDefecto)` que reciba una ruta como
 *    'cliente.direccion.comuna' y la recorra con reduce y ?. devolviendo el
 *    valor por defecto si algun eslabon falta.
 *
 * 5) AVANZADO: reescribe el agrupador de la seccion 7.2 usando Object.groupBy
 *    cuando el navegador lo soporte, y ??= como plan B. Mide con
 *    performance.now() cual tarda menos con 10_000 inscripciones.
 * ============================================================
 */
