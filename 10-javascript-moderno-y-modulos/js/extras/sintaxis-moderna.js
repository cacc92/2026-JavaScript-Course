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

// ============================================================
// IMPORTACIONES
// ------------------------------------------------------------
// Fijate en la ruta: este archivo vive en js/extras/, asi que para
// llegar a js/modulos/ hay que SUBIR un nivel con '../'.
// Importamos tres plantillas etiquetadas para la seccion 2.
// ============================================================
import { destacar, dinero, seguroHTML } from '../modulos/formato.js';

console.log('[sintaxis-moderna.js] Modulo evaluado.');

// ============================================================
// 1. LET / CONST / VAR Y LA ZONA MUERTA TEMPORAL
// ============================================================

/**
 * Demostracion de declaraciones y de la TDZ.
 * @param {{imprimir: Function, titulo: Function}} consola
 */
export function demoDeclaraciones(consola) {
  // ---------------------------------------------------------
  // 1.1 var se "eleva" (hoisting) e inicia valiendo undefined
  // ---------------------------------------------------------
  // Cuando el motor entra en una funcion, primero RESERVA sitio para
  // todas las variables `var` y les pone undefined. Por eso se puede
  // leer una var antes de la linea donde se declara, sin error.
  // Es confuso: parece que la variable existe antes de escribirla.
  consola.titulo('var: hoisting con valor undefined');

  function demostrarVar() {
    // Leemos ANTES de la linea de declaracion: devuelve undefined.
    const valorAntes = mensajeVar;
    var mensajeVar = 'Hola desde var';
    return { valorAntes, valorDespues: mensajeVar };
  }

  consola.imprimir('Resultado con var:', demostrarVar());
  consola.imprimir('-> Leer una var antes de declararla NO da error: da undefined.');

  // ---------------------------------------------------------
  // 1.2 let y const tambien se elevan, pero quedan en la TDZ
  // ---------------------------------------------------------
  // La ZONA MUERTA TEMPORAL es el tramo de codigo que va desde el
  // inicio del bloque hasta la linea donde se declara la variable.
  // Dentro de ese tramo la variable EXISTE pero esta "sin inicializar",
  // y tocarla lanza un ReferenceError.
  //
  // Analogia: la silla del aula ya esta reservada con tu nombre, pero
  // hasta que llegues nadie puede sentarse en ella. Si alguien lo
  // intenta, el profesor lo echa (ReferenceError).
  consola.titulo('const/let: zona muerta temporal (TDZ)');

  function demostrarTDZ() {
    // La siguiente linea lanza ReferenceError: notaFinal existe en el
    // ambito, pero todavia no se ha inicializado.
    const copia = notaFinal;
    const notaFinal = 6.5;
    return copia + notaFinal;
  }

  try {
    demostrarTDZ();
  } catch (error) {
    consola.imprimir(`Error capturado: ${error.constructor.name} -> ${error.message}`);
    consola.imprimir('-> Eso es la TDZ: la variable existe pero aun no se puede usar.');
  }

  // ---------------------------------------------------------
  // 1.3 typeof deja de ser seguro dentro de la TDZ
  // ---------------------------------------------------------
  // Con variables NO declaradas, typeof siempre fue seguro y devolvia
  // "undefined". Con let/const en TDZ, typeof TAMBIEN lanza error.
  consola.titulo('typeof y la TDZ');

  consola.imprimir('typeof variableInexistente ->', typeof variableQueNoExisteEnNingunSitio);

  function typeofEnTDZ() {
    const tipo = typeof puntaje; // ReferenceError
    const puntaje = 10;
    return tipo;
  }

  try {
    typeofEnTDZ();
  } catch (error) {
    consola.imprimir(`typeof dentro de la TDZ -> ${error.constructor.name}`);
    // ERROR COMUN: creer que typeof "nunca falla". Con let/const si falla.
  }

  // ---------------------------------------------------------
  // 1.4 Ambito de BLOQUE frente a ambito de FUNCION
  // ---------------------------------------------------------
  // `var` solo respeta los limites de una funcion. `let` y `const`
  // respetan cualquier par de llaves { }: un if, un for, un bloque suelto.
  consola.titulo('Ambito de bloque');

  var visibleFuera = 'soy var, salgo del if';
  if (true) {
    var visibleFuera2 = 'soy var declarada dentro del if';
    let soloDentro = 'soy let, muero al cerrar la llave';
    consola.imprimir('Dentro del if, let vale:', soloDentro);
  }
  consola.imprimir('Fuera del if, la var declarada dentro vale:', visibleFuera2);
  consola.imprimir('(la variable let ni siquiera existe aqui fuera)');
  consola.imprimir('var externa:', visibleFuera);

  // ---------------------------------------------------------
  // 1.5 El clasico bucle con funciones: var comparte, let no
  // ---------------------------------------------------------
  // Con `var` hay UNA sola variable compartida por todas las vueltas,
  // asi que al final todas las funciones ven el mismo valor.
  // Con `let` se crea una variable NUEVA en cada vuelta.
  consola.titulo('Bucles: var comparte la variable, let la renueva');

  const funcionesConVar = [];
  for (var indice = 0; indice < 3; indice += 1) {
    funcionesConVar.push(() => indice);
  }

  const funcionesConLet = [];
  for (let posicion = 0; posicion < 3; posicion += 1) {
    funcionesConLet.push(() => posicion);
  }

  consola.imprimir('Con var  ->', funcionesConVar.map((f) => f())); // [3, 3, 3]
  consola.imprimir('Con let  ->', funcionesConLet.map((f) => f())); // [0, 1, 2]
  consola.imprimir('-> Este es el motivo numero uno para no usar var nunca mas.');

  // ---------------------------------------------------------
  // 1.6 const NO significa "inmutable"
  // ---------------------------------------------------------
  // const impide REASIGNAR la variable (apuntarla a otra cosa), pero
  // el contenido de un objeto o array si se puede modificar.
  //
  // Analogia: const es como pegar una etiqueta con pegamento a una caja.
  // No puedes despegarla y ponerla en otra caja, pero si puedes abrir la
  // caja y cambiar lo que hay dentro.
  consola.titulo('const: la etiqueta esta fija, el contenido no');

  const curso = { nombre: 'Full Stack 2', estudiantes: 24 };
  curso.estudiantes = 26;               // permitido: mutamos el contenido
  curso.modalidad = 'presencial';       // permitido: anadimos una propiedad
  consola.imprimir('Objeto const mutado:', curso);

  // Lo que SI esta prohibido es reasignar la variable. Este codigo,
  // escrito y ejecutado, lanzaria un TypeError:
  //
  //     const limite = 10;
  //     limite = 20;   // TypeError: Assignment to constant variable.
  //
  // No lo ejecutamos aqui para no tener que envolverlo en un try/catch
  // que distraiga; en clase basta con escribirlo en la consola del
  // navegador (F12) y ver el error en directo.
  consola.imprimir('Reasignar una const lanzaria: TypeError: Assignment to constant variable.');

  // ---------------------------------------------------------
  // 1.7 Object.freeze: congelar el CONTENIDO
  // ---------------------------------------------------------
  // Si de verdad queremos que nadie toque el contenido, existe
  // Object.freeze. Como los modulos estan siempre en modo estricto,
  // intentar escribir en un objeto congelado LANZA un TypeError
  // (en modo no estricto fallaba en silencio, que era mucho peor).
  //
  // OJO: freeze congela un solo nivel (es "superficial"), igual que el
  // spread. Los objetos anidados siguen siendo modificables.
  consola.titulo('Object.freeze');

  const configuracion = Object.freeze({ tema: 'oscuro', idioma: 'es' });

  try {
    configuracion.tema = 'claro';
  } catch (error) {
    consola.imprimir(`Escribir en un objeto congelado -> ${error.constructor.name}`);
  }

  consola.imprimir('El objeto congelado sigue igual:', configuracion);
  consola.imprimir('Object.isFrozen(configuracion) ->', Object.isFrozen(configuracion));
}

// ============================================================
// 2. TEMPLATE LITERALS Y TAGGED TEMPLATES
// ============================================================

export function demoPlantillas(consola) {
  const estudiante = { nombre: 'Camila Rojas', nota: 6.4, asistencia: 0.92 };

  // ---------------------------------------------------------
  // 2.1 Interpolacion de expresiones
  // ---------------------------------------------------------
  // Dentro de ${ } cabe CUALQUIER expresion, no solo una variable:
  // operaciones, llamadas a funciones, ternarios, otro template...
  // Lo que NO cabe es una sentencia (un if o un for).
  consola.titulo('Interpolacion con expresiones');

  consola.imprimir(`Estudiante: ${estudiante.nombre}`);
  consola.imprimir(`Nota redondeada: ${Math.round(estudiante.nota)}`);
  consola.imprimir(`Asistencia: ${(estudiante.asistencia * 100).toFixed(1)}%`);
  consola.imprimir(`Situacion: ${estudiante.nota >= 4 ? 'Aprobado' : 'Reprobado'}`);
  consola.imprimir(`Anidado: ${`(nota ${estudiante.nota} sobre 7,0)`}`);

  // ---------------------------------------------------------
  // 2.2 Cadenas multilinea
  // ---------------------------------------------------------
  // Antes habia que concatenar con \n y comillas por todas partes.
  // Con las comillas invertidas, los saltos de linea se escriben tal cual.
  //
  // BUENA PRACTICA: cuidado con la sangria. Todo lo que escribas dentro
  // de las comillas invertidas FORMA PARTE del texto, espacios incluidos.
  consola.titulo('Cadenas multilinea');

  const certificado = `CERTIFICADO DE NOTAS
--------------------------------
Estudiante : ${estudiante.nombre}
Nota final : ${estudiante.nota.toFixed(1)}
Asistencia : ${(estudiante.asistencia * 100).toFixed(0)}%
--------------------------------`;

  consola.imprimir(certificado);

  // ---------------------------------------------------------
  // 2.3 Tagged templates: una funcion delante de las comillas
  // ---------------------------------------------------------
  // Sintaxis:  miEtiqueta`texto ${valor} texto`
  // El motor llama a miEtiqueta con (trozosDeTexto, ...valores).
  // La funcion decide como combinarlo todo, e incluso puede devolver
  // algo que no sea un string.
  consola.titulo('Tagged templates (plantillas etiquetadas)');

  // destacar rodea cada valor interpolado con comillas angulares.
  consola.imprimir(destacar`La nota de ${estudiante.nombre} es ${estudiante.nota}.`);

  // dinero formatea automaticamente los numeros como moneda.
  const subtotal = 24_990;
  const envio = 3_500;
  consola.imprimir(dinero`Subtotal: ${subtotal} + envio ${envio} = total ${subtotal + envio}`);

  // ---------------------------------------------------------
  // 2.4 Como funciona por dentro una etiqueta
  // ---------------------------------------------------------
  // Definimos aqui mismo una etiqueta que simplemente muestra lo que
  // recibe. Es la mejor forma de entender el mecanismo.
  consola.titulo('Que recibe exactamente una etiqueta');

  function inspeccionar(trozos, ...valores) {
    return `trozos = ${JSON.stringify(trozos)} | valores = ${JSON.stringify(valores)}`;
  }

  consola.imprimir(inspeccionar`Hola ${'Ana'}, tienes ${3} tareas pendientes.`);
  consola.imprimir('-> Hay siempre UN trozo de texto mas que valores interpolados.');

  // ---------------------------------------------------------
  // 2.5 Uso serio: escapar HTML para evitar XSS
  // ---------------------------------------------------------
  // Si insertamos texto del usuario con innerHTML sin escaparlo,
  // cualquiera puede inyectar etiquetas y ejecutar codigo.
  consola.titulo('Etiqueta seguroHTML: escapar entrada del usuario');

  const nombreMalicioso = '<img src=x onerror="robarSesion()">';
  consola.imprimir('Sin escapar :', `<p>Hola ${nombreMalicioso}</p>`);
  consola.imprimir('Escapado    :', seguroHTML`<p>Hola ${nombreMalicioso}</p>`);
  consola.imprimir('-> Escapado, el navegador lo muestra como TEXTO y no lo ejecuta.');

  // ---------------------------------------------------------
  // 2.6 String.raw: la etiqueta que trae el propio lenguaje
  // ---------------------------------------------------------
  // Devuelve el texto SIN procesar las secuencias de escape.
  // Muy util para rutas de Windows o para expresiones regulares.
  consola.titulo('String.raw');

  consola.imprimir('Normal :', `Primera linea\nSegunda linea`);
  consola.imprimir('Con raw:', String.raw`Primera linea\nSegunda linea`);
}

// ============================================================
// 3. DESTRUCTURING AVANZADO
// ============================================================

export function demoDestructuring(consola) {
  // ---------------------------------------------------------
  // 3.1 Arrays: posicion, huecos, valores por defecto y rest
  // ---------------------------------------------------------
  // En los arrays lo que manda es la POSICION.
  consola.titulo('Destructuring de arrays');

  const notas = [6.5, 4.8, 3.2, 7.0, 5.5];

  const [primera, segunda] = notas;
  consola.imprimir('primera:', primera, '| segunda:', segunda);

  // Una coma vacia SALTA una posicion.
  const [, , tercera] = notas;
  consola.imprimir('tercera (saltando dos):', tercera);

  // Valor por defecto: se usa solo si el elemento es undefined.
  const [n1, n2, n3, n4, n5, n6 = 1.0] = notas;
  consola.imprimir('n6 no existia en el array, toma su valor por defecto:', n6);

  // Rest en destructuring: el resto de elementos en un array nuevo.
  const [mejorIntento, ...intentosRestantes] = notas;
  consola.imprimir('mejorIntento:', mejorIntento, '| resto:', intentosRestantes);

  // Intercambiar dos variables sin variable auxiliar.
  let a = 'primero';
  let b = 'segundo';
  [a, b] = [b, a];
  consola.imprimir('Intercambio sin variable temporal ->', { a, b });

  // ---------------------------------------------------------
  // 3.2 Objetos: nombre, renombrado y valores por defecto
  // ---------------------------------------------------------
  // En los objetos lo que manda es el NOMBRE de la propiedad,
  // no el orden en que la escribas.
  consola.titulo('Destructuring de objetos');

  const estudiante = {
    nombre: 'Ignacio Fuentes',
    correo: 'ignacio.fuentes@instituto.cl',
    notas: [5.8, 6.2, 4.4],
    contacto: {
      telefono: '+56 9 8765 4321',
      direccion: { comuna: 'Nunoa', ciudad: 'Santiago' },
    },
  };

  const { nombre, correo } = estudiante;
  consola.imprimir('nombre:', nombre, '| correo:', correo);

  // Renombrado con dos puntos: propiedadOriginal: nombreNuevo
  const { nombre: nombreCompleto, correo: email } = estudiante;
  consola.imprimir('Renombrado ->', { nombreCompleto, email });

  // Valor por defecto para una propiedad que no existe.
  const { carrera = 'Sin definir' } = estudiante;
  consola.imprimir('carrera (no existia):', carrera);

  // Renombrado Y valor por defecto a la vez.
  const { promedio: promedioGeneral = 0 } = estudiante;
  consola.imprimir('promedio renombrado con defecto:', promedioGeneral);

  // Rest de objeto: recoge "todo lo demas" en un objeto nuevo.
  // Es la forma limpia de quitar una propiedad sin usar delete.
  const { correo: _correoIgnorado, ...estudianteSinCorreo } = estudiante;
  consola.imprimir('Objeto sin la propiedad correo:', Object.keys(estudianteSinCorreo));

  // ---------------------------------------------------------
  // 3.3 Anidado: objetos dentro de objetos
  // ---------------------------------------------------------
  // Los dos puntos aqui NO renombran: abren un nivel mas.
  consola.titulo('Destructuring anidado');

  const {
    contacto: {
      telefono,
      direccion: { comuna, ciudad },
    },
  } = estudiante;

  consola.imprimir('telefono:', telefono, '| comuna:', comuna, '| ciudad:', ciudad);
  // ERROR COMUN: creer que `contacto` queda declarada como variable.
  // No es asi: al escribir `contacto: { ... }` solo se declaran telefono,
  // comuna y ciudad. Si quieres las dos cosas, repite la propiedad:
  const { contacto, contacto: { telefono: tel } } = estudiante;
  consola.imprimir('Ahora si tenemos contacto y telefono:', Object.keys(contacto), tel);

  // ---------------------------------------------------------
  // 3.4 EL COMBINADO: arrays DENTRO de objetos
  // ---------------------------------------------------------
  // Este es el caso mas frecuente cuando se consume una API real.
  consola.titulo('Arrays dentro de objetos (el caso mas util)');

  const respuestaDelServidor = {
    exito: true,
    pagina: 1,
    resultados: [
      { id: 101, producto: 'Teclado mecanico', precio: 45_990, etiquetas: ['oferta', 'nuevo'] },
      { id: 102, producto: 'Monitor 27 pulgadas', precio: 189_990, etiquetas: ['destacado'] },
      { id: 103, producto: 'Mouse inalambrico', precio: 19_990, etiquetas: [] },
    ],
  };

  // Sacamos: el exito, el PRIMER resultado completo, y de ese primer
  // resultado su producto, su precio y su PRIMERA etiqueta.
  const {
    exito,
    resultados: [
      primerProducto,
      { producto: nombreSegundo, precio: precioSegundo },
    ],
  } = respuestaDelServidor;

  consola.imprimir('exito:', exito);
  consola.imprimir('primer resultado completo:', primerProducto);
  consola.imprimir('segundo ->', nombreSegundo, precioSegundo);

  // Y ahora arrays dentro de objetos dentro de arrays, con defecto:
  const {
    resultados: [{ etiquetas: [etiquetaPrincipal = 'sin etiqueta'] }],
  } = respuestaDelServidor;
  consola.imprimir('etiqueta principal del primero:', etiquetaPrincipal);

  // El tercer producto no tiene etiquetas: el valor por defecto salva el dia.
  const [, , tercero] = respuestaDelServidor.resultados;
  const { etiquetas: [etiquetaTercero = 'sin etiqueta'] } = tercero;
  consola.imprimir('etiqueta del tercero (array vacio):', etiquetaTercero);

  // ---------------------------------------------------------
  // 3.5 Destructuring en los PARAMETROS de una funcion
  // ---------------------------------------------------------
  // Es la forma moderna de recibir "opciones con nombre". Quien llama
  // no tiene que recordar el orden de los argumentos.
  consola.titulo('Destructuring en parametros con valores por defecto');

  // El `= {}` del final es CLAVE: permite llamar a la funcion sin
  // argumentos. Sin el, crearMatricula() lanzaria un TypeError porque
  // intentaria desestructurar undefined.
  function crearMatricula({
    estudiante: nombreEstudiante = 'Sin nombre',
    curso: nombreCurso = 'Full Stack 2',
    modulos = [],
    contacto: { email: correoContacto = 'sin-correo@ejemplo.cl' } = {},
  } = {}) {
    return {
      nombreEstudiante,
      nombreCurso,
      cantidadModulos: modulos.length,
      primerModulo: modulos.at(0) ?? 'ninguno',
      correoContacto,
    };
  }

  consola.imprimir('Sin argumentos:', crearMatricula());
  consola.imprimir('Parcial:', crearMatricula({ estudiante: 'Valentina Soto' }));
  consola.imprimir('Completo:', crearMatricula({
    estudiante: 'Diego Munoz',
    modulos: ['DOM', 'Eventos', 'Modulos'],
    contacto: { email: 'diego@instituto.cl' },
  }));

  // ---------------------------------------------------------
  // 3.6 Destructuring en bucles
  // ---------------------------------------------------------
  consola.titulo('Destructuring dentro de for...of');

  const inventario = { teclados: 12, monitores: 4, mouses: 27 };

  // Object.entries convierte el objeto en pares [clave, valor] y
  // desestructuramos cada par directamente en la cabecera del bucle.
  for (const [articulo, cantidad] of Object.entries(inventario)) {
    consola.imprimir(`${articulo.padEnd(12, '.')} ${String(cantidad).padStart(3, ' ')} unidades`);
  }

  // Tambien funciona sobre arrays de objetos.
  for (const { id, producto } of respuestaDelServidor.resultados) {
    consola.imprimir(`#${id} -> ${producto}`);
  }

  // ---------------------------------------------------------
  // 3.7 Proteccion frente a null / undefined
  // ---------------------------------------------------------
  // ERROR COMUN: desestructurar algo que puede venir vacio.
  //   const { nombre } = undefined;  -> TypeError
  // La solucion es un `?? {}` de red de seguridad.
  consola.titulo('Desestructurar con red de seguridad');

  const respuestaVacia = null;
  const { datos = 'sin datos' } = respuestaVacia ?? {};
  consola.imprimir('Con `?? {}` no explota:', datos);

  try {
    const { algo } = respuestaVacia; // TypeError
    consola.imprimir(algo);
  } catch (error) {
    consola.imprimir(`Sin la red de seguridad -> ${error.constructor.name}`);
  }
}

// ============================================================
// 4. SPREAD Y REST EN TODOS SUS CONTEXTOS
// ============================================================

export function demoSpreadRest(consola) {
  // Los tres puntos ... significan cosas OPUESTAS segun donde esten:
  //   - A la IZQUIERDA de un = (o en parametros): REST -> empaqueta.
  //   - A la DERECHA (dentro de [], {} o de una llamada): SPREAD -> desempaqueta.
  //
  // Analogia: rest mete la compra en una bolsa; spread saca la compra
  // de la bolsa y la reparte por la mesa.

  // ---------------------------------------------------------
  // 4.1 Spread con arrays
  // ---------------------------------------------------------
  consola.titulo('Spread con arrays');

  const modulosBasicos = ['Variables', 'Funciones', 'Arrays'];
  const modulosAvanzados = ['Modulos', 'Asincronia'];

  const copia = [...modulosBasicos];
  const unidos = [...modulosBasicos, ...modulosAvanzados];
  const conIntermedio = [...modulosBasicos, 'DOM', ...modulosAvanzados];

  consola.imprimir('copia:', copia);
  consola.imprimir('unidos:', unidos);
  consola.imprimir('con elemento intercalado:', conIntermedio);
  consola.imprimir('La copia es un array distinto?', copia !== modulosBasicos); // true

  // Spread sobre cualquier ITERABLE, no solo arrays.
  consola.imprimir('Texto a array:', [...'Hola']);           // ['H','o','l','a']
  consola.imprimir('Set a array (sin duplicados):', [...new Set([1, 2, 2, 3, 3, 3])]);

  // Truco muy usado: quitar duplicados de un array en una linea.
  const notasConRepetidas = [6.5, 4.0, 6.5, 7.0, 4.0];
  consola.imprimir('Notas unicas:', [...new Set(notasConRepetidas)]);

  // Convertir una NodeList del DOM en un array de verdad (para poder
  // usar map, filter, reduce, que la NodeList no tiene todos).
  const titulosDeLaPagina = [...document.querySelectorAll('.seccion > h2')];
  consola.imprimir('Secciones encontradas en la pagina:', titulosDeLaPagina.length);

  // ---------------------------------------------------------
  // 4.2 Spread con objetos
  // ---------------------------------------------------------
  consola.titulo('Spread con objetos');

  const configuracionBase = { tema: 'oscuro', idioma: 'es', notificaciones: true };
  const preferenciasUsuario = { idioma: 'en', fuente: 'grande' };

  // El de la DERECHA gana en caso de conflicto. Aqui idioma acaba en 'en'.
  const configuracionFinal = { ...configuracionBase, ...preferenciasUsuario };
  consola.imprimir('Mezcla (gana la derecha):', configuracionFinal);

  // Invirtiendo el orden gana el otro: el orden IMPORTA.
  consola.imprimir('Orden invertido:', { ...preferenciasUsuario, ...configuracionBase });

  // Anadir o pisar una propiedad puntual sin mutar el original.
  const conAcento = { ...configuracionBase, acento: '#38bdf8' };
  consola.imprimir('Original intacto:', configuracionBase);
  consola.imprimir('Nuevo con acento:', conAcento);

  // ---------------------------------------------------------
  // 4.3 CUIDADO: el spread hace copias SUPERFICIALES
  // ---------------------------------------------------------
  // Solo copia el primer nivel. Los objetos anidados se COMPARTEN.
  // Este es uno de los errores mas caros y silenciosos del lenguaje.
  consola.titulo('El spread copia solo un nivel (copia superficial)');

  const cursoOriginal = {
    nombre: 'Full Stack 2',
    horario: { dia: 'martes', hora: '19:00' },
  };

  const cursoCopia = { ...cursoOriginal };
  cursoCopia.nombre = 'Full Stack 3';          // solo cambia la copia
  cursoCopia.horario.hora = '21:00';           // CAMBIA LOS DOS

  consola.imprimir('Original:', cursoOriginal);
  consola.imprimir('Copia:', cursoCopia);
  consola.imprimir('Comparten el mismo objeto horario?', cursoOriginal.horario === cursoCopia.horario);

  // La solucion moderna: structuredClone hace una copia PROFUNDA.
  const cursoProfundo = structuredClone(cursoOriginal);
  cursoProfundo.horario.hora = '08:00';
  consola.imprimir('Con structuredClone el original NO cambia:', cursoOriginal.horario.hora);

  // ---------------------------------------------------------
  // 4.4 Spread al LLAMAR a una funcion
  // ---------------------------------------------------------
  consola.titulo('Spread en llamadas a funciones');

  const temperaturas = [18, 24, 11, 30, 27];
  consola.imprimir('Math.max(temperaturas)     ->', Math.max(temperaturas));    // NaN
  consola.imprimir('Math.max(...temperaturas)  ->', Math.max(...temperaturas)); // 30
  consola.imprimir('-> Sin spread le pasamos UN array; Math.max espera numeros sueltos.');

  // ---------------------------------------------------------
  // 4.5 REST en los parametros de una funcion
  // ---------------------------------------------------------
  consola.titulo('Rest en parametros');

  // Los dos primeros argumentos tienen nombre propio; el resto se
  // agrupa en un array real llamado `invitados`.
  function organizarReunion(sala, hora, ...invitados) {
    return `Sala ${sala} a las ${hora}. ${invitados.length} invitados: ${invitados.join(', ')}`;
  }

  consola.imprimir(organizarReunion('B-204', '10:30', 'Ana', 'Luis', 'Camila'));
  consola.imprimir(organizarReunion('A-101', '15:00'));

  // El rest es un ARRAY DE VERDAD, a diferencia del viejo `arguments`,
  // que era un objeto parecido a un array y no tenia map ni filter.
  // Ademas `arguments` no existe en las funciones flecha.
  function sumarTodo(...numeros) {
    return numeros.reduce((total, n) => total + n, 0);
  }
  consola.imprimir('sumarTodo(1, 2, 3, 4):', sumarTodo(1, 2, 3, 4));
  consola.imprimir('sumarTodo(...[10, 20, 30]):', sumarTodo(...[10, 20, 30]));

  // REGLA: el parametro rest tiene que ir el ULTIMO y solo puede haber uno.
  // function invalida(...items, final) {}  -> SyntaxError

  // ---------------------------------------------------------
  // 4.6 Rest en destructuring (arrays y objetos)
  // ---------------------------------------------------------
  consola.titulo('Rest dentro del destructuring');

  const [ganador, subcampeon, ...demasParticipantes] = ['Ana', 'Luis', 'Camila', 'Diego', 'Sofia'];
  consola.imprimir('podio:', { ganador, subcampeon }, '| resto:', demasParticipantes);

  const usuario = { id: 7, nombre: 'Sofia', clave: 'secreta123', rol: 'docente' };
  // Patron muy usado en backend: quitar campos sensibles antes de responder.
  const { clave, ...usuarioPublico } = usuario;
  consola.imprimir('Usuario sin la clave:', usuarioPublico);

  // ---------------------------------------------------------
  // 4.7 Rest en el catch y en otros lugares
  // ---------------------------------------------------------
  // Combinacion util: parametros con valor por defecto + rest.
  consola.titulo('Combinaciones');

  function registrarNotas(estudiante = 'Anonimo', minimo = 4, ...notas) {
    const aprobadas = notas.filter((n) => n >= minimo);
    return `${estudiante}: ${aprobadas.length} de ${notas.length} notas aprobadas`;
  }

  consola.imprimir(registrarNotas('Camila', 4, 6.5, 3.2, 5.0, 4.0));
  consola.imprimir(registrarNotas());
}

// ============================================================
// 5. PARAMETROS POR DEFECTO EVALUADOS EN TIEMPO DE LLAMADA
// ============================================================

export function demoParametrosPorDefecto(consola) {
  // ---------------------------------------------------------
  // 5.1 Lo basico: undefined dispara el defecto, null NO
  // ---------------------------------------------------------
  consola.titulo('undefined activa el defecto, null no');

  function saludar(nombre = 'invitado') {
    return `Hola, ${nombre}`;
  }

  consola.imprimir(saludar());              // usa el defecto
  consola.imprimir(saludar(undefined));     // tambien usa el defecto
  consola.imprimir(saludar(null));          // NO usa el defecto: imprime "null"
  consola.imprimir(saludar(''));            // NO usa el defecto: cadena vacia
  consola.imprimir('-> Solo undefined activa el valor por defecto. Es un error comun.');

  // ---------------------------------------------------------
  // 5.2 El defecto se evalua EN CADA LLAMADA
  // ---------------------------------------------------------
  // Esta es la diferencia clave con otros lenguajes (Python, por ejemplo)
  // donde el valor por defecto se calcula UNA sola vez al definir la
  // funcion. En JavaScript se calcula cada vez que hace falta.
  consola.titulo('El defecto se calcula en cada llamada');

  let vecesCalculado = 0;

  function siguienteFolio() {
    vecesCalculado += 1;
    return `FOLIO-${String(vecesCalculado).padStart(4, '0')}`;
  }

  function emitirBoleta(monto, folio = siguienteFolio()) {
    return `${folio} por ${monto}`;
  }

  consola.imprimir(emitirBoleta(1_990));
  consola.imprimir(emitirBoleta(2_500));
  consola.imprimir(emitirBoleta(3_100, 'FOLIO-MANUAL'));   // no llama a la funcion
  consola.imprimir(emitirBoleta(4_000));
  consola.imprimir('Veces que se calculo el folio automatico:', vecesCalculado);
  consola.imprimir('-> Al pasar un folio manual, la funcion por defecto NI SE EJECUTA.');

  // ---------------------------------------------------------
  // 5.3 Consecuencia practica: arrays y objetos frescos
  // ---------------------------------------------------------
  // Como el defecto se evalua cada vez, cada llamada recibe un array
  // NUEVO. Si el defecto se calculara una sola vez, todas las llamadas
  // compartirian el mismo array y se irian pisando.
  consola.titulo('Cada llamada recibe una estructura nueva');

  function agregarTarea(tarea, lista = []) {
    lista.push(tarea);
    return lista;
  }

  consola.imprimir('Primera llamada:', agregarTarea('Estudiar modulos'));
  consola.imprimir('Segunda llamada:', agregarTarea('Repasar destructuring'));
  consola.imprimir('-> Cada una devuelve un array independiente. Perfecto.');

  // Compara con el antipatron de compartir un array de fuera:
  const listaCompartida = [];
  function agregarMal(tarea, lista = listaCompartida) {
    lista.push(tarea);
    return lista;
  }
  agregarMal('Tarea A');
  agregarMal('Tarea B');
  consola.imprimir('Con array compartido se acumula todo:', agregarMal('Tarea C'));

  // ---------------------------------------------------------
  // 5.4 Un defecto puede usar parametros ANTERIORES
  // ---------------------------------------------------------
  // Los parametros se evaluan de izquierda a derecha, asi que un
  // parametro puede apoyarse en los que vienen antes que el.
  consola.titulo('Defectos que dependen de otros parametros');

  function crearUsuario(nombre, alias = nombre.toLowerCase().replaceAll(' ', '.'), rol = 'estudiante') {
    return { nombre, alias, rol };
  }

  consola.imprimir(crearUsuario('Maria Jose Pinto'));
  consola.imprimir(crearUsuario('Pedro Salas', 'pedrito', 'docente'));

  // Pero al reves NO funciona: hay una TDZ tambien en los parametros.
  function alReves(a = b, b = 2) {
    return a + b;
  }

  try {
    alReves();
  } catch (error) {
    consola.imprimir(`Usar un parametro posterior -> ${error.constructor.name}: ${error.message}`);
    consola.imprimir('-> Los parametros tambien tienen zona muerta temporal.');
  }

  // ---------------------------------------------------------
  // 5.5 Defectos y la propiedad length de la funcion
  // ---------------------------------------------------------
  // funcion.length cuenta los parametros ANTES del primero con defecto.
  consola.titulo('Detalle curioso: funcion.length');

  function tresParametros(a, b, c) { return a + b + c; }
  function conDefecto(a, b = 2, c = 3) { return a + b + c; }
  function conRest(a, ...resto) { return a + resto.length; }

  consola.imprimir('tresParametros.length =', tresParametros.length); // 3
  consola.imprimir('conDefecto.length     =', conDefecto.length);     // 1
  consola.imprimir('conRest.length        =', conRest.length);        // 1
}

// ============================================================
// 6. ENCADENAMIENTO OPCIONAL (?.) Y FUSION NULA (??)
// ============================================================

export function demoOpcionalYNulo(consola) {
  const pedido = {
    id: 5501,
    cliente: {
      nombre: 'Constanza Vera',
      direccion: { calle: 'Av. Providencia 1234', comuna: 'Providencia' },
      // Fijate: no hay propiedad `telefono`.
    },
    items: [
      { sku: 'TEC-01', descripcion: 'Teclado mecanico', cantidad: 1, precio: 45_990 },
      { sku: 'MON-27', descripcion: 'Monitor 27"', cantidad: 2, precio: 189_990 },
    ],
    descuento: 0,          // OJO: cero, pero es un valor VALIDO
    comentario: '',        // cadena vacia, tambien valida
    cupon: null,           // explicitamente sin cupon
  };

  // ---------------------------------------------------------
  // 6.1 El problema que resuelve ?.
  // ---------------------------------------------------------
  consola.titulo('Encadenamiento opcional ?.');

  try {
    // pedido.envio es undefined; leer .transportista de undefined explota.
    consola.imprimir(pedido.envio.transportista);
  } catch (error) {
    consola.imprimir(`Sin ?. -> ${error.constructor.name}: ${error.message}`);
  }

  // Con ?. la cadena se DETIENE en cuanto encuentra null o undefined y
  // devuelve undefined, sin lanzar error.
  consola.imprimir('Con ?. ->', pedido.envio?.transportista);
  consola.imprimir('Anidado profundo ->', pedido.cliente?.direccion?.comuna);
  consola.imprimir('Rama inexistente ->', pedido.cliente?.empresa?.rut?.digito);

  // El "corto circuito" es total: si el primer eslabon falla, NADA de lo
  // que viene despues se evalua (ni siquiera las llamadas a funciones).
  let vecesEvaluado = 0;
  const contar = () => { vecesEvaluado += 1; return 0; };
  const nada = null;
  consola.imprimir('Resultado:', nada?.items?.[contar()]);
  consola.imprimir('La funcion contar() se ejecuto', vecesEvaluado, 'veces (deberia ser 0).');

  // ---------------------------------------------------------
  // 6.2 Las tres formas del encadenamiento opcional
  // ---------------------------------------------------------
  consola.titulo('?. con propiedades, con corchetes y con llamadas');

  // a) Propiedad:      objeto?.propiedad
  consola.imprimir('a) propiedad :', pedido.cliente?.nombre);

  // b) Corchetes:      objeto?.[expresion]   <- ojo al punto antes del corchete
  const campoDinamico = 'comuna';
  consola.imprimir('b) corchetes :', pedido.cliente?.direccion?.[campoDinamico]);
  consola.imprimir('   en arrays :', pedido.items?.[1]?.descripcion);
  consola.imprimir('   fuera de rango:', pedido.items?.[9]?.descripcion);

  // c) Llamada:        objeto.metodo?.()    <- llama solo si el metodo existe
  consola.imprimir('c) metodo inexistente:', pedido.calcularTotal?.());
  const conMetodo = { total: () => 235_980 };
  consola.imprimir('   metodo existente  :', conMetodo.total?.());

  // ERROR COMUN: pensar que ?. protege de una variable NO DECLARADA.
  // No lo hace: `noExiste?.algo` lanza ReferenceError igual.
  // ?. protege del valor null/undefined, no de la falta de declaracion.

  // ---------------------------------------------------------
  // 6.3 Fusion nula ?? frente a ||
  // ---------------------------------------------------------
  // || salta con cualquier valor FALSY: 0, '', NaN, false, null, undefined.
  // ?? salta SOLO con null o undefined.
  //
  // Analogia: || pregunta "esto vale algo?" y considera que un cero no
  // vale nada. ?? pregunta "esto EXISTE?" y un cero existe perfectamente.
  consola.titulo('?? frente a ||');

  consola.imprimir('descuento con || ->', pedido.descuento || 10);  // 10  (mal!)
  consola.imprimir('descuento con ?? ->', pedido.descuento ?? 10);  // 0   (bien)

  consola.imprimir('comentario con || ->', `"${pedido.comentario || 'Sin comentarios'}"`);
  consola.imprimir('comentario con ?? ->', `"${pedido.comentario ?? 'Sin comentarios'}"`);

  consola.imprimir('cupon (null) con ?? ->', pedido.cupon ?? 'sin cupon');
  consola.imprimir('propiedad ausente con ?? ->', pedido.notaInterna ?? 'sin nota');

  // Tabla resumen para proyectar en clase.
  consola.titulo('Tabla comparativa');
  const valores = [0, '', false, NaN, null, undefined, 'texto', 42];
  for (const valor of valores) {
    const conOr = valor || 'DEFECTO';
    const conNulo = valor ?? 'DEFECTO';
    const etiqueta = String(valor === '' ? "''" : valor).padEnd(11, ' ');
    consola.imprimir(`${etiqueta} | ||  -> ${String(conOr).padEnd(9)} | ??  -> ${conNulo}`);
  }

  // ---------------------------------------------------------
  // 6.4 ?. y ?? trabajando juntos
  // ---------------------------------------------------------
  consola.titulo('La pareja perfecta: ?. junto a ??');

  const telefono = pedido.cliente?.telefono ?? 'Telefono no registrado';
  consola.imprimir('telefono:', telefono);

  const primeraItemDescripcion = pedido.items?.at(0)?.descripcion ?? 'Pedido vacio';
  consola.imprimir('primer item:', primeraItemDescripcion);

  // ERROR COMUN DE SINTAXIS: no se puede mezclar ?? con || o && sin parentesis.
  //   const x = a ?? b || c;        -> SyntaxError
  //   const x = (a ?? b) || c;      -> correcto
  // El lenguaje lo prohibe a proposito, para que no haya ambiguedad.
  const a = null;
  const b = 0;
  const c = 'ultimo';
  consola.imprimir('Con parentesis (a ?? b) || c ->', (a ?? b) || c);
  consola.imprimir('Con parentesis a ?? (b || c) ->', a ?? (b || c));
}

// ============================================================
// 7. OPERADORES LOGICOS DE ASIGNACION
// ============================================================

export function demoAsignacionLogica(consola) {
  // Son azucar sintactico que combina un operador logico con una
  // asignacion. Los tres hacen CORTOCIRCUITO: si no toca asignar,
  // la asignacion ni siquiera se ejecuta.
  //
  //   x ||= y   equivale a   x || (x = y)
  //   x &&= y   equivale a   x && (x = y)
  //   x ??= y   equivale a   x ?? (x = y)

  consola.titulo('||=  asigna si el valor actual es FALSY');

  let titulo = '';
  titulo ||= 'Titulo por defecto';
  consola.imprimir('Cadena vacia con ||= ->', titulo);

  let contador = 0;
  contador ||= 100;
  consola.imprimir('Cero con ||= ->', contador, '(cuidado: el 0 se perdio)');

  let nombre = 'Camila';
  nombre ||= 'Anonima';
  consola.imprimir('Valor ya presente ->', nombre, '(no se toca)');

  consola.titulo('&&=  asigna solo si el valor actual es TRUTHY');

  let apodo = 'la profe';
  apodo &&= apodo.toUpperCase();
  consola.imprimir('Con valor:', apodo);

  let apodoVacio = null;
  apodoVacio &&= apodoVacio.toUpperCase(); // no se ejecuta -> no hay TypeError
  consola.imprimir('Con null no explota:', apodoVacio);
  consola.imprimir('-> &&= es una forma comoda de transformar algo "solo si existe".');

  consola.titulo('??=  asigna solo si es null o undefined');

  const preferencias = {
    tema: null,
    volumen: 0,
    idioma: undefined,
    fuente: 'mediana',
  };

  preferencias.tema ??= 'oscuro';       // era null      -> asigna
  preferencias.volumen ??= 50;          // era 0 (valido)-> NO asigna
  preferencias.idioma ??= 'es';         // era undefined -> asigna
  preferencias.fuente ??= 'grande';     // ya tenia valor-> NO asigna

  consola.imprimir('Preferencias finales:', preferencias);
  consola.imprimir('-> Fijate en que el volumen 0 SOBREVIVE. Con ||= habria pasado a 50.');

  // ---------------------------------------------------------
  // 7.1 El detalle importante: el CORTOCIRCUITO
  // ---------------------------------------------------------
  // Si no hay que asignar, la asignacion no ocurre EN ABSOLUTO. Eso
  // importa cuando la propiedad tiene un setter, o cuando escribir
  // dispara algun efecto (por ejemplo, redibujar la pantalla).
  consola.titulo('Cortocircuito: la asignacion ni se intenta');

  let escrituras = 0;
  const objetoObservado = {
    _valor: 'ya tengo valor',
    get valor() {
      return this._valor;
    },
    set valor(nuevo) {
      escrituras += 1;
      this._valor = nuevo;
    },
  };

  objetoObservado.valor ??= 'nuevo valor';   // no asigna: ya tenia valor
  consola.imprimir('Escrituras tras ??= con valor presente:', escrituras); // 0

  objetoObservado.valor = 'asignacion normal';
  consola.imprimir('Escrituras tras asignacion normal:', escrituras);      // 1
  consola.imprimir('-> Con `objeto.valor = objeto.valor ?? x` el setter SI se dispararia.');

  // ---------------------------------------------------------
  // 7.2 Uso real: inicializar estructuras anidadas
  // ---------------------------------------------------------
  consola.titulo('Caso real: agrupar sin comprobar si la clave existe');

  const inscripciones = [
    { curso: 'Full Stack 2', estudiante: 'Ana' },
    { curso: 'Bases de datos', estudiante: 'Luis' },
    { curso: 'Full Stack 2', estudiante: 'Camila' },
    { curso: 'Full Stack 2', estudiante: 'Diego' },
  ];

  const porCurso = {};
  for (const { curso, estudiante } of inscripciones) {
    // Sin ??= habria que escribir:
    //   if (!porCurso[curso]) porCurso[curso] = [];
    porCurso[curso] ??= [];
    porCurso[curso].push(estudiante);
  }

  consola.imprimir('Agrupado con ??= :', porCurso);
}

// ============================================================
// 8. SEPARADORES NUMERICOS Y NUMEROS EN GENERAL
// ============================================================

export function demoNumeros(consola) {
  // ---------------------------------------------------------
  // 8.1 Guiones bajos como separadores de miles
  // ---------------------------------------------------------
  // Solo sirven para que TU leas mejor el codigo. El motor los ignora
  // por completo. Se pueden poner donde quieras entre digitos.
  consola.titulo('Separadores numericos (guion bajo)');

  const sueldoMinimo = 500_000;
  const presupuesto = 1_250_000;
  const distanciaSol = 149_600_000;

  consola.imprimir('sueldoMinimo  =', sueldoMinimo);
  consola.imprimir('presupuesto   =', presupuesto);
  consola.imprimir('distanciaSol  =', distanciaSol, 'km');
  consola.imprimir('1_000_000 === 1000000 ?', 1_000_000 === 1000000); // true

  // Tambien funcionan con decimales y con otras bases.
  const constanteFisica = 6.626_070_15e-34;
  const mascaraBinaria = 0b1010_0001;
  const colorHex = 0xff_38_bd;
  const permisos = 0o7_5_5;

  consola.imprimir('decimal con separadores :', constanteFisica);
  consola.imprimir('binario 0b1010_0001     :', mascaraBinaria);
  consola.imprimir('hexadecimal 0xff_38_bd  :', colorHex);
  consola.imprimir('octal 0o7_5_5           :', permisos);

  // REGLAS: no puede ir al principio, ni al final, ni junto al punto
  // decimal, ni doble. Todo eso es un error de sintaxis:
  //   _1000   1000_   1_.5   1__000

  // ---------------------------------------------------------
  // 8.2 BigInt para enteros gigantes
  // ---------------------------------------------------------
  consola.titulo('BigInt: mas alla del entero seguro');

  consola.imprimir('Number.MAX_SAFE_INTEGER =', Number.MAX_SAFE_INTEGER);
  consola.imprimir('Sumarle 2 da lo mismo que sumarle 1?',
    Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2); // true, ese es el problema

  const enorme = 9_007_199_254_740_993n;   // la n final lo convierte en BigInt
  consola.imprimir('Con BigInt:', enorme + 1n);
  consola.imprimir('typeof enorme ->', typeof enorme);
  // ERROR COMUN: mezclar BigInt con Number en una operacion lanza TypeError.
  try {
    // La linea de abajo mezcla tipos a proposito.
    const mezcla = enorme + Number(1);
    consola.imprimir(mezcla);
  } catch (error) {
    consola.imprimir(`Mezclar BigInt y Number -> ${error.constructor.name}`);
  }

  // ---------------------------------------------------------
  // 8.3 Number.isInteger, Number.isFinite y Number.isNaN
  // ---------------------------------------------------------
  // Las versiones "Number." NO convierten tipos. Las globales antiguas
  // (isNaN, isFinite) si convierten, y eso produce sorpresas.
  consola.titulo('Number.isInteger / isFinite / isNaN');

  consola.imprimir('Number.isInteger(7)      ->', Number.isInteger(7));
  consola.imprimir("Number.isInteger('7')    ->", Number.isInteger('7'));    // false
  consola.imprimir('Number.isInteger(7.0)    ->', Number.isInteger(7.0));    // true (7.0 es 7)
  consola.imprimir('Number.isInteger(7.5)    ->', Number.isInteger(7.5));    // false

  consola.imprimir("isNaN('hola')            ->", isNaN('hola'));            // true (convierte)
  consola.imprimir("Number.isNaN('hola')     ->", Number.isNaN('hola'));     // false (no convierte)
  consola.imprimir('Number.isNaN(NaN)        ->', Number.isNaN(NaN));        // true

  consola.imprimir("isFinite('42')           ->", isFinite('42'));           // true
  consola.imprimir("Number.isFinite('42')    ->", Number.isFinite('42'));    // false

  // BUENA PRACTICA: usa siempre las versiones de Number.

  // ---------------------------------------------------------
  // 8.4 Decimales y dinero
  // ---------------------------------------------------------
  consola.titulo('El clasico problema de los decimales');

  consola.imprimir('0.1 + 0.2 =', 0.1 + 0.2);
  consola.imprimir('0.1 + 0.2 === 0.3 ?', 0.1 + 0.2 === 0.3); // false
  consola.imprimir('Con tolerancia:', Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);
  consola.imprimir('-> Para dinero, trabaja en centavos con enteros.');

  // toFixed devuelve un STRING, no un numero: es un error muy comun.
  const precio = 19.999;
  consola.imprimir('precio.toFixed(2) ->', precio.toFixed(2), '| typeof:', typeof precio.toFixed(2));
  consola.imprimir('Para volver a numero: Number(precio.toFixed(2)) ->', Number(precio.toFixed(2)));
}

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
