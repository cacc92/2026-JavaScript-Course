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
 *    pagina): AHORA aparece en la lista de peticiones.
 * 4. Pulsalo otra vez: ya no se vuelve a descargar.
 * 5. En la pestana "Consola" veras el mensaje de evaluacion UNA sola vez.
 * ============================================================
 */

// ============================================================
// 1. UN MODULO DINAMICO TAMBIEN PUEDE TENER SUS PROPIOS IMPORTS
// ------------------------------------------------------------
// Cuando el navegador descarga este archivo, ve estos imports y
// descarga tambien lo que falte. Como almacen.js, matematicas.js y
// formato.js YA estaban cargados por main.js, no los vuelve a pedir:
// reutiliza los que ya tiene en el registro de modulos.
// ============================================================
import {
  ID_INSTANCIA,
  obtenerEstado,
  obtenerEventos,
  contarEventos,
  registrarEvento,
} from '../modulos/almacen.js';

import { resumenEstadistico, redondear, PRESUPUESTO_MAXIMO } from '../modulos/matematicas.js';

// Importacion por defecto (sin llaves) + nombradas (con llaves) en la
// MISMA linea. El orden es obligatorio: primero la de por defecto.
import formatearMoneda, { formatearFecha, fechaRelativa, alinear } from '../modulos/formato.js';

// ============================================================
// 2. MARCA DE EVALUACION
// ------------------------------------------------------------
// Este console.log solo aparece cuando el modulo se evalua de verdad,
// es decir, la PRIMERA vez que se pulsa el boton. Es la prueba visible
// de que la carga fue diferida.
// ============================================================
const EVALUADO_EN = new Date();
console.log(`[reporte-avanzado.js] Modulo evaluado bajo demanda a las ${EVALUADO_EN.toLocaleTimeString('es-CL')}.`);

/** Version del modulo. Es una exportacion NOMBRADA. */
export const VERSION = '1.2.0';

/** Momento exacto de la evaluacion, para demostrar la cache de modulos. */
export const MOMENTO_DE_EVALUACION = EVALUADO_EN;

// Contador de veces que se ha PEDIDO un reporte. Como el modulo se
// evalua una sola vez, este contador sobrevive entre pulsaciones.
let vecesGenerado = 0;

// ============================================================
// 3. FUNCION PRIVADA DE APOYO
// ============================================================

/** Dibuja una linea separadora del ancho indicado. */
function separador(ancho = 56, caracter = '=') {
  return caracter.repeat(ancho);
}

// ============================================================
// 4. EXPORTACION NOMBRADA: estadisticas de la sesion
// ============================================================

/**
 * Devuelve un objeto con metricas de la sesion actual leidas del almacen
 * compartido. Al ser una exportacion nombrada, se importa con llaves.
 */
export function calcularMetricas() {
  const estado = obtenerEstado();

  // Contamos cuantos eventos hay de cada tipo. Object.groupBy si el
  // navegador lo soporta; si no, un reduce clasico.
  const porTipo = typeof Object.groupBy === 'function'
    ? Object.groupBy(estado.eventos, (evento) => evento.tipo)
    : estado.eventos.reduce((grupos, evento) => {
        grupos[evento.tipo] ??= [];
        grupos[evento.tipo].push(evento);
        return grupos;
      }, {});

  // Convertimos { tipo: [eventos] } en { tipo: cantidad } con la pareja
  // entries -> map -> fromEntries.
  const conteoPorTipo = Object.fromEntries(
    Object.entries(porTipo).map(([tipo, lista]) => [tipo, lista.length])
  );

  // Milisegundos transcurridos desde que arranco la aplicacion.
  const milisegundos = Date.now() - new Date(estado.iniciadoEn).getTime();

  return {
    instancia: ID_INSTANCIA,
    totalEventos: contarEventos(),
    conteoPorTipo,
    contadores: estado.contadores,
    preferencias: estado.preferencias,
    segundosDeSesion: redondear(milisegundos / 1000, 1),
    iniciadoEn: estado.iniciadoEn,
  };
}

// ============================================================
// 5. EXPORTACION POR DEFECTO: el generador del reporte
// ------------------------------------------------------------
// Recibe una consola (creada con crearConsola) y escribe ahi el informe.
// Devuelve un pequeno resumen por si quien llama quiere usarlo.
// ============================================================
export default function generarReporte(consola, { idInstanciaPrincipal = null } = {}) {
  vecesGenerado += 1;

  const metricas = calcularMetricas();

  consola.imprimir(separador());
  consola.imprimir('  REPORTE AVANZADO DE LA SESION');
  consola.imprimir(`  Modulo reporte-avanzado.js v${VERSION}`);
  consola.imprimir(separador());
  consola.imprimir('');

  // --- Bloque 1: la prueba del singleton -------------------
  consola.imprimir('1) PRUEBA DEL MODULO EVALUADO UNA SOLA VEZ');
  consola.imprimir(alinear('   Instancia vista desde aqui', 36), metricas.instancia);
  if (idInstanciaPrincipal) {
    consola.imprimir(alinear('   Instancia vista desde main.js', 36), idInstanciaPrincipal);
    consola.imprimir(
      alinear('   Son la misma?', 36),
      idInstanciaPrincipal === metricas.instancia ? 'SI (mismo modulo, misma memoria)' : 'NO'
    );
  }
  consola.imprimir(alinear('   Este modulo se evaluo a las', 36), EVALUADO_EN.toLocaleTimeString('es-CL'));
  consola.imprimir(alinear('   Reportes generados hasta ahora', 36), vecesGenerado);
  consola.imprimir('   (La hora de evaluacion NO cambia aunque pulses el boton otra vez:');
  consola.imprimir('    el modulo ya esta en la cache y no se vuelve a ejecutar.)');
  consola.imprimir('');

  // --- Bloque 2: uso de la caja de herramientas ------------
  consola.imprimir('2) USO DE LA CAJA DE HERRAMIENTAS');
  const { contadores } = metricas;
  for (const [clave, cantidad] of Object.entries(contadores)) {
    // replaceAll + una expresion regular para separar camelCase en palabras.
    const legible = clave.replaceAll(/([A-Z])/g, ' $1').toLowerCase();
    consola.imprimir(`   ${alinear(legible, 30)} ${String(cantidad).padStart(4)}`);
  }
  consola.imprimir('');

  // --- Bloque 3: eventos registrados -----------------------
  consola.imprimir('3) EVENTOS REGISTRADOS');
  consola.imprimir(`   ${alinear('Total de eventos', 30)}`, metricas.totalEventos);
  for (const [tipo, cantidad] of Object.entries(metricas.conteoPorTipo)) {
    consola.imprimir(`   ${alinear(tipo, 30)} ${String(cantidad).padStart(4)}`);
  }
  consola.imprimir('');

  consola.imprimir('   Ultimos 5 eventos:');
  const ultimos = obtenerEventos({ limite: 5 });
  if (ultimos.length === 0) {
    consola.imprimir('   (todavia no hay actividad, prueba la caja de herramientas)');
  } else {
    for (const evento of ultimos) {
      const hora = new Date(evento.momento).toLocaleTimeString('es-CL');
      consola.imprimir(`   [${hora}] #${String(evento.id).padStart(3, '0')} ${evento.tipo}`);
    }
  }
  consola.imprimir('');

  // --- Bloque 4: demostracion de las utilidades importadas -
  consola.imprimir('4) LAS UTILIDADES IMPORTADAS SIGUEN DISPONIBLES');
  const notasDeEjemplo = [6.5, 4.2, 3.1, 7.0, 5.4, 6.8];
  const resumen = resumenEstadistico(notasDeEjemplo);
  consola.imprimir(alinear('   Notas de ejemplo', 30), notasDeEjemplo.join(' | '));
  consola.imprimir(alinear('   Promedio', 30), resumen.promedio);
  consola.imprimir(alinear('   Mediana', 30), resumen.mediana);
  consola.imprimir(alinear('   Aprobados', 30), `${resumen.aprobados} de ${resumen.cantidad}`);
  consola.imprimir(alinear('   Presupuesto maximo', 30), formatearMoneda(PRESUPUESTO_MAXIMO));
  consola.imprimir(alinear('   Sesion iniciada', 30), formatearFecha(metricas.iniciadoEn, { estilo: 'conHora' }));
  consola.imprimir(alinear('   Es decir', 30), fechaRelativa(metricas.iniciadoEn));
  consola.imprimir(alinear('   Duracion de la sesion', 30), `${metricas.segundosDeSesion} segundos`);
  consola.imprimir('');
  consola.imprimir(separador());

  // Dejamos constancia en el almacen de que se genero el reporte.
  registrarEvento('reporte', { version: VERSION, numero: vecesGenerado });

  return {
    version: VERSION,
    vecesGenerado,
    evaluadoEn: EVALUADO_EN,
    totalEventos: metricas.totalEventos,
  };
}

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
