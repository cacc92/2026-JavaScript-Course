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

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Este es el primer archivo que conviene escribir en vivo, porque
   validaciones.js, main.js y reporte-avanzado.js dependen de el.
   Cuando termines, el archivo debe exportar exactamente estos ocho
   nombres, ni uno mas ni uno menos:

     ID_INSTANCIA, VECES_EVALUADO, registrarEvento, sumarContador,
     obtenerEstado, obtenerEventos, contarEventos, obtenerContadores,
     establecerPreferencia, obtenerPreferencia, reiniciar

   Tiempo estimado: 20 minutos.
   ============================================================ */

// ============================================================
// 1. PRUEBA VISIBLE DE LA EVALUACION UNICA
// ------------------------------------------------------------
// Este codigo esta en el nivel superior del modulo. Se ejecuta en el
// instante en que el navegador evalua el archivo por primera vez.
// Aunque main.js, validaciones.js y reporte-avanzado.js lo importen
// los tres, este contador NUNCA pasara de 1.
// ============================================================

// TODO (en clase):
//   1. Declara `let vecesEvaluado = 0;` y en la linea siguiente sumale 1.
//      Escribelo en dos lineas a proposito: asi se ve que es codigo de
//      nivel superior que se ejecuta al evaluar el modulo.
//   2. Imprime en la consola del navegador, con un template literal:
//        console.log(`[almacen.js] Modulo evaluado ${vecesEvaluado} vez. Si ves esto repetido, algo raro pasa.`)
//   3. Exporta la constante ID_INSTANCIA. Es el texto 'ALM-' seguido de
//      un numero aleatorio entre 100_000 y 999_999 pasado a base 36 y en
//      mayusculas:
//        'ALM-' + Math.floor(Math.random() * 900_000 + 100_000).toString(36).toUpperCase()
//      Aprovecha para senalar el separador numerico con guion bajo.
//   4. Exporta `VECES_EVALUADO` con el valor de vecesEvaluado.
//   Resultado esperado en la consola del navegador (F12), UNA sola vez:
//     [almacen.js] Modulo evaluado 1 vez. Si ves esto repetido, algo raro pasa.
//   (aprox. 8 lineas)

// ============================================================
// 2. EL ESTADO PRIVADO
// ------------------------------------------------------------
// `estado` NO lleva export. Es privado del modulo: nadie de fuera
// puede escribir `estado.eventos = []` y romperlo todo.
//
// ⚠️ ERROR COMUN: exportar el objeto mutable directamente
//    export const estado = { ... }
// Aunque `const` impide reasignar la variable, NO congela el objeto:
// cualquiera podria hacer estado.eventos.length = 0. Exportar
// funciones nos deja controlar como se modifica la informacion.
// ============================================================

// TODO (en clase):
//   1. Declara `const estado = { ... }` SIN export, con esta forma exacta
//      (main.js y reporte-avanzado.js cuentan con ella):
//        iniciadoEn: new Date(),
//        eventos: [],
//        contadores: {
//          validacionesEmail: 0, validacionesContrasena: 0,
//          formatosMoneda: 0, formatosFecha: 0, calculosEstadisticos: 0,
//        },
//        preferencias: { moneda: null, idioma: null },
//   2. Declara debajo `let siguienteId = 1;` (id incremental de cada evento).
//   (aprox. 16 lineas)

// ============================================================
// 3. REGISTRAR EVENTOS
// ------------------------------------------------------------
// Aqui aprovechamos varias caracteristicas modernas a la vez:
//  - Parametros por defecto (`detalle = {}`).
//  - Spread de objetos para copiar `detalle` sin compartir referencia.
//  - Shorthand de propiedades: { tipo } equivale a { tipo: tipo }.
// ============================================================

// TODO (en clase):
//   1. Exporta `registrarEvento(tipo, detalle = {})`.
//   2. Dentro construye `const evento = { id: siguienteId, tipo, momento: new Date(), ...detalle }`.
//      Senala las dos cosas: el shorthand `tipo` y el spread final, que
//      copia las propiedades de `detalle` en un objeto NUEVO (copia
//      superficial: solo un nivel).
//   3. Suma 1 a siguienteId y haz `estado.eventos.push(evento)`.
//   4. Si estado.eventos.length > 200, quita el mas antiguo con shift().
//   5. Devuelve el evento.
//   (aprox. 12 lineas)

// ============================================================
// 4. SUMAR A UN CONTADOR
// ------------------------------------------------------------
// Demostracion del operador de ASIGNACION LOGICA DE FUSION NULA (??=):
//   objeto.clave ??= 0   ->  "si es null o undefined, ponle 0"
// Es la forma corta y segura de inicializar un contador que quizas
// todavia no existe.
// ============================================================

// TODO (en clase):
//   1. Exporta `sumarContador(clave, cantidad = 1)`.
//   2. Primera linea del cuerpo: `estado.contadores[clave] ??= 0;`
//      Es LA linea que hay que comentar en voz alta.
//   3. Suma `cantidad` y devuelve el valor resultante.
//   Resultado esperado: sumarContador('validacionesEmail') devuelve 1 la
//   primera vez, 2 la segunda; sumarContador('inventado') devuelve 1
//   aunque esa clave no existiera en el objeto contadores.
//   (aprox. 5 lineas)

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

// TODO (en clase):
//   1. Exporta `obtenerEstado()`: si `typeof structuredClone === 'function'`
//      devuelve structuredClone(estado); si no, devuelve el plan B
//      `{ ...estado, eventos: [...estado.eventos] }` (copia superficial).
//   2. Exporta `obtenerEventos({ limite = 10, tipo = null } = {})`:
//      copia el array con [...estado.eventos]; si `tipo` es truthy filtra
//      por evento.tipo === tipo; invierte con toReversed() si existe
//      (ES2023) o con reverse() sobre la copia; y devuelve slice(0, limite).
//      Se lee: del mas nuevo al mas viejo.
//   3. Exporta `contarEventos()` -> estado.eventos.length.
//   4. Exporta `obtenerContadores()` -> `{ ...estado.contadores }`.
//   ✅ BUENA PRACTICA que hay que enunciar: quien lee un estado compartido
//   nunca debe recibir el original, porque cualquier descuido suyo lo
//   corrompe para toda la aplicacion.
//   (aprox. 24 lineas)

// ============================================================
// 6. PREFERENCIAS CON OPERADORES DE ASIGNACION LOGICA
// ------------------------------------------------------------
// ||=  asigna si el valor actual es FALSY  (0, '', null, undefined, NaN, false)
// ??=  asigna solo si es NULLISH           (null o undefined)
// &&=  asigna solo si el valor actual es TRUTHY
// ============================================================

// TODO (en clase):
//   1. Exporta `establecerPreferencia(clave, valor)`: guarda el valor en
//      estado.preferencias[clave], registra un evento de tipo 'preferencia'
//      con { clave, valor } y devuelve el valor guardado.
//   2. Exporta `obtenerPreferencia(clave, porDefecto)`: devuelve
//      `estado.preferencias[clave] ?? porDefecto`.
//      ⚠️ ERROR COMUN: usar || aqui. Con || fallariamos si la preferencia
//      guardada fuese 0 o '' (valores perfectamente validos).
//   (aprox. 8 lineas)

// ============================================================
// 7. REINICIAR
// ------------------------------------------------------------
// Util para el docente: dejar el almacen como recien cargado sin
// tener que recargar la pagina entera.
// ============================================================

// TODO (en clase):
//   1. Exporta `reiniciar()` sin parametros.
//   2. Vacia el array con `estado.eventos.length = 0;` y explica por que
//      NO usamos `estado.eventos = []`: queremos mantener la MISMA
//      referencia del array.
//   3. Devuelve siguienteId a 1.
//   4. Recorre `Object.keys(estado.contadores)` con for...of y pon cada
//      contador a 0.
//   5. Pon estado.preferencias.moneda y .idioma a null.
//   6. Registra un evento 'sistema' con { accion: 'almacen reiniciado' }.
//   (aprox. 10 lineas)

// TODO (en clase, ultima linea del archivo):
//   Fuera de toda funcion, registra el primer evento en el momento de la
//   evaluacion del modulo:
//     registrarEvento('sistema', { accion: 'almacen inicializado', instancia: ID_INSTANCIA });
//   Resultado esperado: contarEventos() vale 1 nada mas cargar la pagina.
//   (aprox. 1 linea)

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
