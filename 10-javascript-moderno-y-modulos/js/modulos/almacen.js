/**
 * ============================================================
 * ARCHIVO: js/modulos/almacen.js
 * TEMA: Estado compartido entre modulos (patron "singleton")
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Que un modulo ES se EVALUA UNA SOLA VEZ por mas veces que se
 *    importe: el navegador guarda el resultado en cache (el "registro
 *    de modulos") y a partir de ahi reparte siempre la MISMA copia.
 *  - Como aprovechar eso para tener un estado compartido por toda la
 *    aplicacion sin ensuciar el objeto global `window`.
 *  - Por que conviene NO exportar el objeto de estado directamente,
 *    sino funciones que lo lean y lo modifiquen de forma controlada.
 *  - structuredClone() para entregar copias profundas de seguridad.
 *
 * ANALOGIA
 * Piensa en la secretaria academica de un instituto. Aunque tres
 * profesores distintos vayan a pedirle la lista de notas, hay UNA
 * sola secretaria y UNA sola lista. Cada profesor no recibe una
 * secretaria nueva: recibe la de siempre.
 * ============================================================
 */

// ============================================================
// 1. PRUEBA VISIBLE DE LA EVALUACION UNICA
// ------------------------------------------------------------
// Este codigo esta en el nivel superior del modulo. Se ejecuta en el
// instante en que el navegador evalua el archivo por primera vez.
// Aunque main.js, validaciones.js y reporte-avanzado.js lo importen
// los tres, este contador NUNCA pasara de 1.
// ============================================================
let vecesEvaluado = 0;
vecesEvaluado += 1;

console.log(`[almacen.js] Modulo evaluado ${vecesEvaluado} vez. Si ves esto repetido, algo raro pasa.`);

/**
 * Identificador unico de esta instancia del modulo.
 * Lo generamos con numeros aleatorios en el momento de la evaluacion.
 * Si dos archivos distintos importan `ID_INSTANCIA` y obtienen el
 * MISMO valor, queda demostrado que comparten la misma instancia.
 *
 * Fijate en el separador numerico con guion bajo: 100_000 se lee mucho
 * mejor que 100000 y para JavaScript vale exactamente lo mismo.
 */
export const ID_INSTANCIA =
  'ALM-' + Math.floor(Math.random() * 900_000 + 100_000).toString(36).toUpperCase();

/** Cuantas veces se evaluo el modulo (siempre deberia ser 1). */
export const VECES_EVALUADO = vecesEvaluado;

// ============================================================
// 2. EL ESTADO PRIVADO
// ------------------------------------------------------------
// `estado` NO lleva export. Es privado del modulo: nadie de fuera
// puede escribir `estado.eventos = []` y romperlo todo.
//
// ERROR COMUN: exportar el objeto mutable directamente
//    export const estado = { ... }
// Aunque `const` impide reasignar la variable, NO congela el objeto:
// cualquiera podria hacer estado.eventos.length = 0. Exportar
// funciones nos deja controlar como se modifica la informacion.
// ============================================================
const estado = {
  // Momento en que arranco la aplicacion.
  iniciadoEn: new Date(),

  // Historial de acciones del usuario. Cada evento es un objeto.
  eventos: [],

  // Contadores agregados. Los usaremos en el reporte dinamico.
  contadores: {
    validacionesEmail: 0,
    validacionesContrasena: 0,
    formatosMoneda: 0,
    formatosFecha: 0,
    calculosEstadisticos: 0,
  },

  // Preferencias del usuario. `null` significa "aun no elegido".
  preferencias: {
    moneda: null,
    idioma: null,
  },
};

// Contador interno para dar un id incremental a cada evento.
let siguienteId = 1;

// ============================================================
// 3. REGISTRAR EVENTOS
// ------------------------------------------------------------
// Aqui aprovechamos varias caracteristicas modernas a la vez:
//  - Parametros por defecto (`detalle = {}`).
//  - Spread de objetos para copiar `detalle` sin compartir referencia.
//  - Shorthand de propiedades: { tipo } equivale a { tipo: tipo }.
// ============================================================
export function registrarEvento(tipo, detalle = {}) {
  const evento = {
    id: siguienteId,
    tipo,                                  // shorthand: mismo nombre clave/valor
    momento: new Date(),
    // El spread copia las propiedades de `detalle` en un objeto NUEVO.
    // Asi, si quien nos llamo modifica su objeto despues, nuestro
    // historial no cambia. Es una copia SUPERFICIAL (un nivel).
    ...detalle,
  };

  siguienteId += 1;
  estado.eventos.push(evento);

  // Limitamos el historial a los ultimos 200 eventos para no crecer
  // sin control durante una clase larga.
  if (estado.eventos.length > 200) {
    estado.eventos.shift(); // quita el mas antiguo
  }

  return evento;
}

// ============================================================
// 4. SUMAR A UN CONTADOR
// ------------------------------------------------------------
// Demostracion del operador de ASIGNACION LOGICA DE FUSION NULA (??=):
//   objeto.clave ??= 0   ->  "si es null o undefined, ponle 0"
// Es la forma corta y segura de inicializar un contador que quizas
// todavia no existe.
// ============================================================
export function sumarContador(clave, cantidad = 1) {
  // Si la clave no existia, la creamos en 0 antes de sumar.
  estado.contadores[clave] ??= 0;
  estado.contadores[clave] += cantidad;
  return estado.contadores[clave];
}

// ============================================================
// 5. LECTURAS SEGURAS (devolvemos COPIAS, no el original)
// ------------------------------------------------------------
// structuredClone() hace una copia PROFUNDA: duplica objetos anidados,
// fechas, Map, Set y arrays. Es nativo del navegador desde 2022 y
// sustituye al viejo truco JSON.parse(JSON.stringify(obj)), que perdia
// las fechas (las convertia en texto) y no soportaba Map ni Set.
//
// Al devolver una copia, quien lee el estado puede trastear con el
// resultado sin corromper el original. Es "solo lectura" de verdad.
// ============================================================
export function obtenerEstado() {
  // Comprobamos que el navegador soporte structuredClone antes de usarlo.
  if (typeof structuredClone === 'function') {
    return structuredClone(estado);
  }
  // Plan B para navegadores antiguos: copia superficial de emergencia.
  return { ...estado, eventos: [...estado.eventos] };
}

/** Devuelve una copia del historial de eventos, del mas nuevo al mas viejo. */
export function obtenerEventos({ limite = 10, tipo = null } = {}) {
  // Desestructuracion de un objeto EN LOS PARAMETROS, con valores por
  // defecto y con `= {}` al final para que la funcion tambien se pueda
  // llamar sin argumentos:  obtenerEventos()
  let lista = [...estado.eventos];               // copia para no ordenar el original

  // `tipo` llega como null por defecto, y null es un valor FALSY: por eso
  // basta un if para decidir si hay que filtrar o no. (Aqui no interviene
  // ningun operador moderno: el ?. y el ?? se usan mas abajo y en otros
  // modulos; conviene no confundirlos con una simple comprobacion de verdad.)
  if (tipo) {
    lista = lista.filter((evento) => evento.tipo === tipo);
  }

  // toReversed() (ES2023) devuelve un array NUEVO invertido, sin tocar el
  // original. Si el navegador es antiguo, usamos el clasico reverse()
  // sobre la copia que ya hicimos.
  const invertida = typeof lista.toReversed === 'function'
    ? lista.toReversed()
    : lista.reverse();

  return invertida.slice(0, limite);
}

/** Cuantos eventos hay registrados en total. */
export function contarEventos() {
  return estado.eventos.length;
}

/** Devuelve una copia de los contadores. */
export function obtenerContadores() {
  return { ...estado.contadores };
}

// ============================================================
// 6. PREFERENCIAS CON OPERADORES DE ASIGNACION LOGICA
// ------------------------------------------------------------
// ||=  asigna si el valor actual es FALSY  (0, '', null, undefined, NaN, false)
// ??=  asigna solo si es NULLISH           (null o undefined)
// &&=  asigna solo si el valor actual es TRUTHY
// ============================================================
export function establecerPreferencia(clave, valor) {
  estado.preferencias[clave] = valor;
  registrarEvento('preferencia', { clave, valor });
  return estado.preferencias[clave];
}

export function obtenerPreferencia(clave, porDefecto) {
  // ?? devuelve el lado derecho SOLO si el izquierdo es null o undefined.
  // Con || fallariamos si la preferencia guardada fuese 0 o '' (validos).
  return estado.preferencias[clave] ?? porDefecto;
}

// ============================================================
// 7. REINICIAR
// ------------------------------------------------------------
// Util para el docente: dejar el almacen como recien cargado sin
// tener que recargar la pagina entera.
// ============================================================
export function reiniciar() {
  estado.eventos.length = 0;   // vacia el array manteniendo la MISMA referencia
  siguienteId = 1;
  for (const clave of Object.keys(estado.contadores)) {
    estado.contadores[clave] = 0;
  }
  estado.preferencias.moneda = null;
  estado.preferencias.idioma = null;
  registrarEvento('sistema', { accion: 'almacen reiniciado' });
}

// Registramos el primer evento en el momento de la evaluacion del modulo.
registrarEvento('sistema', { accion: 'almacen inicializado', instancia: ID_INSTANCIA });

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade una funcion exportada `resumenPorTipo()` que devuelva un objeto
 *    con cuantos eventos hay de cada tipo. Resuelvelo primero con reduce()
 *    y despues, si el navegador lo soporta, con Object.groupBy().
 *
 * 2) Comprueba experimentalmente el singleton: en main.js importa ID_INSTANCIA
 *    de forma estatica y ademas con `await import('./modulos/almacen.js')`.
 *    Imprime los dos valores y explica por que coinciden.
 *
 * 3) Anade `exportarJSON()` que devuelva el estado como texto JSON con sangria.
 *    Cuidado: las fechas deben salir en formato ISO. Investiga el parametro
 *    `replacer` de JSON.stringify.
 *
 * 4) Protege el estado de verdad: aplica Object.freeze() al objeto que devuelve
 *    obtenerContadores() y comprueba en la consola que ya no se puede modificar.
 *
 * 5) AVANZADO: convierte el almacen en un sistema de suscripciones. Anade
 *    `suscribir(funcion)` que guarde escuchas en un Set y avise a todas cada vez
 *    que se registre un evento. Devuelve una funcion para cancelar la suscripcion.
 * ============================================================
 */
