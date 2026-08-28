/**
 * ============================================================
 * ARCHIVO: js/extras/reporte-avanzado.js
 * TEMA: Modulo cargado BAJO DEMANDA con import() dinamico
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Un modulo que NO se descarga al abrir la pagina. El navegador
 *    solo lo pide cuando el usuario pulsa el boton correspondiente.
 *    Eso es "code splitting" (division del codigo) y es la base de
 *    que una aplicacion grande arranque rapido.
 *  - Que un modulo cargado dinamicamente ve EXACTAMENTE el mismo
 *    almacen que el resto de la aplicacion: el registro de modulos es
 *    unico, no importa por que puerta se entre.
 *  - Que la segunda vez que se pide, el navegador NO lo vuelve a
 *    descargar ni a evaluar: lo saca de la cache de modulos.
 *
 * COMO COMPROBARLO EN CLASE
 * 1. Abre las herramientas de desarrollo (F12) en la pestana "Red".
 * 2. Recarga la pagina: reporte-avanzado.js NO aparece en la lista.
 * 3. Pulsa el boton "Cargar el modulo del reporte" (seccion 15 de la
 *    pagina, id="boton-dinamico"): AHORA aparece en la lista de peticiones.
 * 4. Pulsalo otra vez: ya no se vuelve a descargar.
 * 5. En la pestana "Consola" veras el mensaje de evaluacion UNA sola vez.
 * ============================================================
 */

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Este es el ULTIMO archivo que se escribe: necesita almacen.js,
   matematicas.js y formato.js ya terminados, y main.js con la funcion
   cargarReporteAvanzado() lista para pulsar el boton.

   Es tambien el mas vistoso: mientras se escribe conviene tener abierta
   la pestana "Red" de las herramientas de desarrollo, porque la demo
   consiste precisamente en ver CUANDO se descarga el archivo.

   Al terminar debe exportar: VERSION, MOMENTO_DE_EVALUACION,
   calcularMetricas y, por defecto, generarReporte.

   Tiempo estimado: 20 minutos.
   ============================================================ */

// ============================================================
// 1. UN MODULO DINAMICO TAMBIEN PUEDE TENER SUS PROPIOS IMPORTS
// ------------------------------------------------------------
// Cuando el navegador descarga este archivo, ve estos imports y
// descarga tambien lo que falte. Como almacen.js, matematicas.js y
// formato.js YA estaban cargados por main.js, no los vuelve a pedir:
// reutiliza los que ya tiene en el registro de modulos.
// ============================================================

// TODO (en clase):
//   Escribe los tres imports. Fijate en el '../' de cada ruta: este
//   archivo vive en js/extras/ y los modulos estan en js/modulos/.
//   1. import { ID_INSTANCIA, obtenerEstado, obtenerEventos, contarEventos,
//        registrarEvento } from '../modulos/almacen.js';
//   2. import { resumenEstadistico, redondear, PRESUPUESTO_MAXIMO } from '../modulos/matematicas.js';
//   3. Importacion por defecto (sin llaves) + nombradas (con llaves) en la
//      MISMA linea. El orden es obligatorio: primero la de por defecto.
//        import formatearMoneda, { formatearFecha, fechaRelativa, alinear } from '../modulos/formato.js';
//   (aprox. 10 lineas)

// ============================================================
// 2. MARCA DE EVALUACION
// ------------------------------------------------------------
// Este console.log solo aparece cuando el modulo se evalua de verdad,
// es decir, la PRIMERA vez que se pulsa el boton. Es la prueba visible
// de que la carga fue diferida.
// ============================================================

// TODO (en clase):
//   1. `const EVALUADO_EN = new Date();`
//   2. console.log(`[reporte-avanzado.js] Modulo evaluado bajo demanda a las ${EVALUADO_EN.toLocaleTimeString('es-CL')}.`)
//   3. Exporta `VERSION` con el valor '1.2.0' (exportacion NOMBRADA: main.js
//      la lee para pintar la insignia id="estado-dinamico").
//   4. Exporta `MOMENTO_DE_EVALUACION` con el valor de EVALUADO_EN.
//   5. Declara, SIN export, `let vecesGenerado = 0;`. Como el modulo se
//      evalua una sola vez, este contador sobrevive entre pulsaciones: esa
//      es justamente la demostracion.
//   (aprox. 6 lineas)

// ============================================================
// 3. FUNCION PRIVADA DE APOYO
// ============================================================

// TODO (en clase):
//   Declara SIN export `function separador(ancho = 56, caracter = '=')`
//   que devuelva `caracter.repeat(ancho)`. Es privada del modulo.
//   (aprox. 3 lineas)

// ============================================================
// 4. EXPORTACION NOMBRADA: estadisticas de la sesion
// ============================================================

// TODO (en clase) — export function calcularMetricas()
//   Devuelve un objeto con metricas de la sesion actual leidas del almacen
//   compartido. Al ser una exportacion nombrada, se importa con llaves.
//   1. `const estado = obtenerEstado();`
//   2. Cuenta cuantos eventos hay de cada tipo. Object.groupBy si el
//      navegador lo soporta; si no, un reduce clasico con `grupos[tipo] ??= []`.
//   3. Convierte { tipo: [eventos] } en { tipo: cantidad } con la pareja
//      entries -> map -> fromEntries.
//   4. `const milisegundos = Date.now() - new Date(estado.iniciadoEn).getTime();`
//   5. Devuelve { instancia: ID_INSTANCIA, totalEventos: contarEventos(),
//      conteoPorTipo, contadores: estado.contadores, preferencias:
//      estado.preferencias, segundosDeSesion: redondear(milisegundos / 1000, 1),
//      iniciadoEn: estado.iniciadoEn }.
//   (aprox. 28 lineas)

// ============================================================
// 5. EXPORTACION POR DEFECTO: el generador del reporte
// ------------------------------------------------------------
// Recibe una consola (creada con crearConsola) y escribe ahi el informe.
// Devuelve un pequeno resumen por si quien llama quiere usarlo.
// ============================================================

// TODO (en clase) — export default function generarReporte(consola, { idInstanciaPrincipal = null } = {})
//   1. Suma 1 a vecesGenerado y llama a calcularMetricas().
//   2. Cabecera: separador(), '  REPORTE AVANZADO DE LA SESION',
//      `  Modulo reporte-avanzado.js v${VERSION}`, separador() y una linea vacia.
//   3. BLOQUE 1 - '1) PRUEBA DEL MODULO EVALUADO UNA SOLA VEZ'
//      Usa alinear(texto, 36) para las etiquetas. Muestra la instancia vista
//      desde aqui y, si llego idInstanciaPrincipal, la vista desde main.js y
//      si son la misma ('SI (mismo modulo, misma memoria)' / 'NO').
//      Muestra tambien EVALUADO_EN.toLocaleTimeString('es-CL') y vecesGenerado.
//      Cierra con las dos lineas de explicacion:
//        '   (La hora de evaluacion NO cambia aunque pulses el boton otra vez:'
//        '    el modulo ya esta en la cache y no se vuelve a ejecutar.)'
//   4. BLOQUE 2 - '2) USO DE LA CAJA DE HERRAMIENTAS'
//      Recorre Object.entries(metricas.contadores) y convierte cada clave
//      camelCase en palabras con `clave.replaceAll(/([A-Z])/g, ' $1').toLowerCase()`.
//      Imprime `   ${alinear(legible, 30)} ${String(cantidad).padStart(4)}`.
//   5. BLOQUE 3 - '3) EVENTOS REGISTRADOS'
//      Total, el conteo por tipo, y los ultimos 5 eventos con
//      `obtenerEventos({ limite: 5 })`, cada uno como
//      `   [${hora}] #${String(evento.id).padStart(3, '0')} ${evento.tipo}`.
//      Si no hay eventos, imprime '(todavia no hay actividad, prueba la caja de herramientas)'.
//   6. BLOQUE 4 - '4) LAS UTILIDADES IMPORTADAS SIGUEN DISPONIBLES'
//      Con `const notasDeEjemplo = [6.5, 4.2, 3.1, 7.0, 5.4, 6.8];` llama a
//      resumenEstadistico e imprime promedio, mediana, aprobados/cantidad,
//      formatearMoneda(PRESUPUESTO_MAXIMO), formatearFecha(iniciadoEn,
//      { estilo: 'conHora' }), fechaRelativa(iniciadoEn) y los segundos de sesion.
//      Termina con otro separador().
//   7. Deja constancia: `registrarEvento('reporte', { version: VERSION, numero: vecesGenerado });`
//   8. Devuelve { version: VERSION, vecesGenerado, evaluadoEn: EVALUADO_EN,
//      totalEventos: metricas.totalEventos }. main.js usa `resumen.vecesGenerado`
//      para escribir la insignia, asi que ese nombre no se puede cambiar.
//   Resultado esperado en pantalla (id="salida-dinamico"): un informe de cuatro
//   bloques, y la insignia en verde con "Modulo cargado (v1.2.0) · reportes
//   generados: 1".
//   (aprox. 60 lineas)

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade al reporte un bloque 5 con el tiempo medio entre eventos.
 *    Necesitaras restar las marcas de tiempo y usar el modulo matematicas.
 *
 * 2) Exporta una funcion `exportarReporteComoTexto()` que devuelva el mismo
 *    informe en una sola cadena, para poder copiarlo al portapapeles con
 *    navigator.clipboard.writeText().
 *
 * 3) Haz que este modulo tambien se pueda cargar con `await import()` desde
 *    la consola del navegador (F12) y comprueba que la hora de evaluacion
 *    coincide con la del boton. Explica por que.
 *
 * 4) Crea un segundo modulo dinamico `js/extras/grafico-barras.js` que dibuje
 *    un grafico de barras con caracteres (por ejemplo con repeat('#')) y
 *    cargalo desde aqui con otro import() anidado.
 *
 * 5) AVANZADO: mide con performance.now() cuanto tarda el primer import()
 *    y cuanto el segundo. Comenta la diferencia y relacionala con la cache
 *    de modulos del navegador.
 * ============================================================
 */
