/**
 * ============================================================
 * ARCHIVO: js/main.js
 * TEMA: Punto de entrada de la aplicacion (modulo principal)
 * ------------------------------------------------------------
 * Este archivo se carga desde el HTML asi:
 *
 *     <script type="module" src="js/main.js"></script>
 *
 * QUE ENSENA ESTE ARCHIVO
 *  - Las CUATRO formas de importar:
 *      import { a, b } from '...'          -> nombradas
 *      import { a as otroNombre } from '...' -> nombradas con renombrado
 *      import porDefecto from '...'        -> la exportacion por defecto
 *      import * as espacio from '...'      -> todo el modulo como objeto
 *  - La importacion DINAMICA: import('...') devuelve una promesa y solo
 *    descarga el archivo cuando de verdad hace falta.
 *  - Que el orden de los imports NO importa: el navegador construye
 *    primero el grafo completo de dependencias y despues evalua los
 *    modulos de abajo hacia arriba (primero las hojas).
 *  - Que los modulos se ejecutan en modo estricto y con carga diferida
 *    (como si llevaran `defer`), asi que el DOM ya existe cuando este
 *    codigo corre. No hace falta envolver nada en DOMContentLoaded.
 * ============================================================
 */

// ============================================================
// 1. IMPORTACIONES NOMBRADAS
// ------------------------------------------------------------
// Van entre llaves y el nombre tiene que coincidir EXACTAMENTE con el
// que se exporto. No es como el `export default`, donde elegimos el
// nombre libremente.
// ============================================================
import { imprimir, titulo, crearConsola, limpiar, MOMENTO_DE_CARGA } from './modulos/consola.js';

// ============================================================
// 2. IMPORTACION POR DEFECTO + NOMBRADAS EN LA MISMA LINEA
// ------------------------------------------------------------
// `formatearMoneda` es la exportacion por defecto de formato.js.
// Podriamos haberla llamado `precio` o `plata`: el nombre lo ponemos
// nosotros. Lo que va entre llaves si respeta el nombre original.
// ============================================================
import formatearMoneda, {
  formatearFecha,
  fechaRelativa,
  formatearNumero,
  formatearPorcentaje,
  aTitulo,
  codigoDeFactura,
  aUrlAmigable,
  destacar,
  MONEDAS,
} from './modulos/formato.js';

// ============================================================
// 3. IMPORTACION NOMBRADA CON RENOMBRADO (as)
// ------------------------------------------------------------
// `validarContrasena` es un nombre largo; aqui lo usamos como
// `revisarClave`. Es util para evitar choques de nombres cuando dos
// modulos exportan algo que se llama igual.
// ============================================================
import {
  validarEmail,
  validarContrasena as revisarClave,
  validarRequerido,
  validarFormulario,
  REGLAS_CONTRASENA,
} from './modulos/validaciones.js';

// ============================================================
// 4. IMPORTAR TODO EL MODULO COMO UN OBJETO (import * as)
// ------------------------------------------------------------
// `matematicas` es un "espacio de nombres del modulo": un objeto con
// todas sus exportaciones. Se usa cuando un modulo tiene muchas cosas
// y queremos dejar claro de donde viene cada una al leerlo.
//
// DETALLE: ese objeto es de SOLO LECTURA. Intentar
// matematicas.sumar = otraCosa lanza un TypeError.
// ============================================================
import * as matematicas from './modulos/matematicas.js';

// Los tres modulos de teoria se importan igual, y ademas asi evitamos
// un choque real: sintaxis.demoNumeros y metodos.demoNumeros se llaman
// igual pero son funciones distintas. Con el espacio de nombres, sin
// problema. Si los hubiesemos importado sueltos, habria que renombrar.
import * as sintaxis from './extras/sintaxis-moderna.js';
import * as metodos from './extras/metodos-modernos.js';
import * as generadores from './extras/iteradores-y-generadores.js';

// ============================================================
// 5. EL ALMACEN COMPARTIDO
// ------------------------------------------------------------
// validaciones.js tambien importa este mismo modulo. Vamos a demostrar
// mas abajo que los dos ven EXACTAMENTE el mismo estado.
// ============================================================
import {
  ID_INSTANCIA,
  VECES_EVALUADO,
  registrarEvento,
  obtenerEstado,
  obtenerEventos,
  obtenerContadores,
  contarEventos,
  establecerPreferencia,
  obtenerPreferencia,
  reiniciar,
} from './modulos/almacen.js';

console.log('[main.js] Modulo principal evaluado. Todas las dependencias ya estaban listas.');

// ============================================================
// 6. CONSOLAS VISUALES DE CADA SECCION
// ------------------------------------------------------------
// Creamos un objeto con una consola por seccion. Cada una escribe en su
// propio <pre> del HTML.
// ============================================================
const consolas = {
  declaraciones: crearConsola('salida-declaraciones'),
  plantillas: crearConsola('salida-plantillas'),
  destructuring: crearConsola('salida-destructuring'),
  spread: crearConsola('salida-spread'),
  parametros: crearConsola('salida-parametros'),
  opcional: crearConsola('salida-opcional'),
  logicos: crearConsola('salida-logicos'),
  metodosArray: crearConsola('salida-metodos-array'),
  metodosTexto: crearConsola('salida-metodos-texto'),
  iteradores: crearConsola('salida-iteradores'),
  generadores: crearConsola('salida-generadores'),
  numeros: crearConsola('salida-numeros'),
  modulos: crearConsola('salida-modulos'),
  almacen: crearConsola('salida-almacen'),
  dinamico: crearConsola('salida-dinamico'),
};

// ============================================================
// 7. REGISTRO DE DEMOSTRACIONES
// ------------------------------------------------------------
// Un objeto donde cada clave es el nombre de una demo y el valor es la
// funcion que la ejecuta. Asi los botones del HTML solo necesitan un
// atributo data-demo con el nombre, y no hay que escribir un
// addEventListener por cada boton.
//
// Este patron se llama "tabla de despacho" (dispatch table) y sustituye
// con ventaja a un switch gigante.
// ============================================================
const DEMOSTRACIONES = {
  declaraciones: () => sintaxis.demoDeclaraciones(consolas.declaraciones),
  plantillas: () => sintaxis.demoPlantillas(consolas.plantillas),
  destructuring: () => sintaxis.demoDestructuring(consolas.destructuring),
  spread: () => sintaxis.demoSpreadRest(consolas.spread),
  parametros: () => sintaxis.demoParametrosPorDefecto(consolas.parametros),
  opcional: () => sintaxis.demoOpcionalYNulo(consolas.opcional),
  logicos: () => sintaxis.demoAsignacionLogica(consolas.logicos),
  numeros: () => sintaxis.demoNumeros(consolas.numeros),

  'metodos-array': () => {
    metodos.demoAt(consolas.metodosArray);
    metodos.demoFindLast(consolas.metodosArray);
    metodos.demoFlat(consolas.metodosArray);
    metodos.demoObjetos(consolas.metodosArray);
    metodos.demoGroupBy(consolas.metodosArray);
    metodos.demoNoDestructivos(consolas.metodosArray);
  },

  'metodos-texto': () => {
    metodos.demoStrings(consolas.metodosTexto);
    metodos.demoNumeros(consolas.metodosTexto);
    metodos.demoStructuredClone(consolas.metodosTexto);
  },

  iteradores: () => {
    generadores.demoProtocoloIterable(consolas.iteradores);
    generadores.demoIteradorPropio(consolas.iteradores);
  },

  generadores: () => {
    generadores.demoGeneradores(consolas.generadores);
    generadores.demoCasoPractico(consolas.generadores);
  },

  modulos: () => demostrarModulos(),
  almacen: () => demostrarAlmacen(),
};

// Mapa de que consola le corresponde a cada demo, para poder limpiarla
// antes de volver a ejecutarla.
const CONSOLA_DE_DEMO = {
  declaraciones: consolas.declaraciones,
  plantillas: consolas.plantillas,
  destructuring: consolas.destructuring,
  spread: consolas.spread,
  parametros: consolas.parametros,
  opcional: consolas.opcional,
  logicos: consolas.logicos,
  numeros: consolas.numeros,
  'metodos-array': consolas.metodosArray,
  'metodos-texto': consolas.metodosTexto,
  iteradores: consolas.iteradores,
  generadores: consolas.generadores,
  modulos: consolas.modulos,
  almacen: consolas.almacen,
};

/**
 * Ejecuta una demo por su nombre, limpiando antes su consola.
 * Envuelve la llamada en try/catch: si una demo falla, las demas siguen
 * funcionando y el error se ve en pantalla en lugar de romper la clase.
 */
function ejecutarDemo(nombre) {
  const demo = DEMOSTRACIONES[nombre];

  // Guarda temprana: si el nombre no esta en la tabla de despacho, `demo`
  // vale undefined. Avisamos y salimos, en vez de intentar llamarlo y
  // provocar un "TypeError: demo is not a function".
  if (!demo) {
    imprimir(`No existe la demostracion "${nombre}".`);
    return;
  }

  const consola = CONSOLA_DE_DEMO[nombre];
  consola?.limpiar();

  try {
    demo();
  } catch (error) {
    console.error(`[main.js] Error en la demo "${nombre}":`, error);
    consola?.imprimir(`ERROR INESPERADO: ${error.message}`);
  }
}

// ============================================================
// 8. SECCION 13: DEMOSTRAR COMO FUNCIONAN LOS MODULOS
// ============================================================

async function demostrarModulos() {
  const c = consolas.modulos;

  c.titulo('Los modulos tienen su propio ambito');

  // En un script clasico, `const x = 1` de nivel superior NO crea
  // window.x, pero `var x = 1` SI lo hacia. En un modulo, ninguna de
  // las dos cosas toca el objeto global.
  c.imprimir('window.ID_INSTANCIA existe?', typeof window.ID_INSTANCIA !== 'undefined');
  c.imprimir('window.formatearMoneda existe?', typeof window.formatearMoneda !== 'undefined');
  c.imprimir('-> Nada de lo que declaramos se filtra al objeto window.');
  c.imprimir('   Por eso los modulos NO necesitan la IIFE (function(){...})()');
  c.imprimir('   que usabamos en los proyectos anteriores.');

  c.titulo('Modo estricto automatico');

  // Los modulos estan SIEMPRE en modo estricto, sin escribir 'use strict'.
  // Una consecuencia visible: dentro de una funcion normal llamada de
  // forma suelta, `this` vale undefined en lugar de window.
  function quienEsThis() {
    return this;
  }
  c.imprimir('this dentro de una funcion suelta:', quienEsThis());
  c.imprimir('-> En un script clasico esto seria el objeto window.');

  // Otra consecuencia: asignar a una variable no declarada lanza error.
  try {
    // La escribimos a traves de una funcion para que el error ocurra al
    // ejecutar y no al analizar el archivo.
    asignarVariableNoDeclarada();
  } catch (error) {
    c.imprimir(`Asignar sin declarar -> ${error.constructor.name}: ${error.message}`);
    c.imprimir('-> En modo NO estricto esto habria creado una variable global silenciosa.');
  }

  c.titulo('Los valores importados son de SOLO LECTURA');

  try {
    // El espacio de nombres de un modulo esta sellado.
    matematicas.NOTA_APROBACION = 5.0;
    c.imprimir('Se pudo modificar? Valor actual:', matematicas.NOTA_APROBACION);
  } catch (error) {
    c.imprimir(`Modificar un import -> ${error.constructor.name}`);
    c.imprimir('-> Los imports son enlaces vivos de solo lectura, no copias.');
  }

  c.titulo('El modulo se evalua UNA sola vez');

  c.imprimir('ID de la instancia del almacen visto desde main.js:', ID_INSTANCIA);
  c.imprimir('VECES_EVALUADO que reporta el modulo almacen:', VECES_EVALUADO);
  c.imprimir('consola.js se cargo a las:', MOMENTO_DE_CARGA.toLocaleTimeString('es-CL'));

  // Ahora lo pedimos OTRA VEZ, esta vez de forma dinamica. El navegador
  // NO vuelve a descargarlo ni a evaluarlo: nos entrega el mismo modulo.
  const segundaCopia = await import('./modulos/almacen.js');

  c.imprimir('ID visto tras un segundo import():', segundaCopia.ID_INSTANCIA);
  c.imprimir('Son el mismo valor?', ID_INSTANCIA === segundaCopia.ID_INSTANCIA);
  c.imprimir('Es la misma funcion registrarEvento?', registrarEvento === segundaCopia.registrarEvento);
  c.imprimir('-> Prueba definitiva: un modulo es un SINGLETON.');

  c.titulo('Los imports son enlaces VIVOS, no copias');

  // validaciones.js modifica el almacen. Como el import es un enlace
  // vivo, main.js ve el cambio inmediatamente, sin volver a importar.
  const antes = contarEventos();
  validarEmail('prueba.enlace.vivo@instituto.cl');
  const despues = contarEventos();

  c.imprimir('Eventos antes de validar un correo:', antes);
  c.imprimir('Eventos despues:', despues);
  c.imprimir('-> validaciones.js escribio en el MISMO almacen que lee main.js.');

  c.titulo('Rutas de importacion: reglas del navegador');
  c.imprimir("import { x } from './modulos/almacen.js'   CORRECTO");
  c.imprimir("import { x } from './modulos/almacen'      ERROR 404 (falta .js)");
  c.imprimir("import { x } from 'modulos/almacen.js'     ERROR (falta el ./)");
  c.imprimir("import { x } from '../modulos/almacen.js'  sube un nivel de carpeta");
  c.imprimir('-> En el navegador, la extension .js es OBLIGATORIA.');
}

/** Provoca un ReferenceError propio del modo estricto. */
function asignarVariableNoDeclarada() {
  // En modo estricto, escribir en una variable que nadie declaro lanza
  // ReferenceError. Los modulos estan siempre en modo estricto.
  variableQueNadieDeclaro = 42;
  return variableQueNadieDeclaro;
}

// ============================================================
// 9. SECCION 14: EL ALMACEN COMPARTIDO EN VIVO
// ============================================================

function demostrarAlmacen() {
  const c = consolas.almacen;
  const estado = obtenerEstado();

  c.titulo('Estado actual del almacen');
  c.imprimir('Instancia         :', ID_INSTANCIA);
  c.imprimir('Iniciado          :', formatearFecha(estado.iniciadoEn, { estilo: 'conHora' }));
  c.imprimir('Es decir          :', fechaRelativa(estado.iniciadoEn));
  c.imprimir('Eventos totales   :', contarEventos());
  c.imprimir('Preferencias      :', estado.preferencias);

  c.titulo('Contadores de uso de la caja de herramientas');
  const contadores = obtenerContadores();
  for (const [clave, valor] of Object.entries(contadores)) {
    const legible = clave.replaceAll(/([A-Z])/g, ' $1').toLowerCase();
    c.imprimir(`${legible.padEnd(26, '.')} ${String(valor).padStart(4)}`);
  }

  c.titulo('Ultimos eventos registrados');
  const ultimos = obtenerEventos({ limite: 8 });
  if (ultimos.length === 0) {
    c.imprimir('(sin eventos todavia)');
  } else {
    for (const evento of ultimos) {
      const hora = new Date(evento.momento).toLocaleTimeString('es-CL');
      c.imprimir(`[${hora}] #${String(evento.id).padStart(3, '0')} ${evento.tipo}`);
    }
  }

  c.titulo('obtenerEstado() devuelve una COPIA, no el original');
  const copia = obtenerEstado();
  copia.eventos.length = 0;                 // vaciamos la copia
  copia.contadores.validacionesEmail = 9999;
  c.imprimir('Tras vaciar la copia, el almacen sigue con:', contarEventos(), 'eventos');
  c.imprimir('Y el contador real sigue en:', obtenerContadores().validacionesEmail);
  c.imprimir('-> Gracias a structuredClone, nadie puede corromper el estado desde fuera.');
}

// ============================================================
// 10. SECCION 15: IMPORTACION DINAMICA (code splitting)
// ============================================================

/**
 * Referencia al modulo ya cargado. La primera vez vale null; despues de
 * la primera carga guardamos el modulo para poder comparar tiempos.
 */
let moduloReporte = null;

async function cargarReporteAvanzado() {
  const c = consolas.dinamico;
  const boton = document.getElementById('boton-dinamico');
  const estado = document.getElementById('estado-dinamico');

  // Bloqueamos el boton mientras dura la carga: sin esto, el usuario
  // puede pulsar cinco veces seguidas y lanzar cinco cargas.
  if (boton) {
    boton.disabled = true;
    boton.textContent = 'Cargando modulo...';
  }

  const inicio = performance.now();

  try {
    // ------------------------------------------------------
    // AQUI ESTA LA IMPORTACION DINAMICA
    // ------------------------------------------------------
    // import() se escribe como si fuera una funcion y devuelve una
    // PROMESA que se resuelve con el espacio de nombres del modulo.
    //
    // Diferencias con el import estatico:
    //  - Se puede poner DENTRO de un if, de un evento o de una funcion.
    //  - La ruta puede ser una variable calculada en tiempo de ejecucion.
    //  - El archivo NO se descarga al abrir la pagina, sino ahora.
    //
    // Eso es el "code splitting": partir la aplicacion en trozos y
    // traer cada trozo solo cuando el usuario lo necesita. Una pagina
    // que arranca con 80 KB en lugar de 800 KB se siente instantanea.
    // ------------------------------------------------------
    const modulo = await import('./extras/reporte-avanzado.js');

    const duracion = performance.now() - inicio;
    const esPrimeraVez = moduloReporte === null;
    moduloReporte = modulo;

    c.limpiar();

    // La exportacion por defecto vive en la propiedad `.default`.
    // Al importar dinamicamente NO hay azucar sintactico: hay que
    // escribir modulo.default de forma explicita. Es un error comun.
    const generarReporte = modulo.default;

    const resumen = generarReporte(c, { idInstanciaPrincipal: ID_INSTANCIA });

    c.imprimir('');
    c.imprimir(`Tiempo de este import(): ${duracion.toFixed(1)} ms`);
    c.imprimir(esPrimeraVez
      ? '-> Primera carga: el navegador tuvo que ir a buscar el archivo.'
      : '-> Segunda carga o posteriores: salio de la cache, por eso es casi instantanea.');

    if (estado) {
      estado.textContent = `Modulo cargado (v${modulo.VERSION}) · reportes generados: ${resumen.vecesGenerado}`;
      estado.className = 'insignia insignia--exito';
    }

    imprimir(`Modulo dinamico cargado en ${duracion.toFixed(1)} ms (v${modulo.VERSION}).`);
    registrarEvento('import-dinamico', { milisegundos: Math.round(duracion) });
  } catch (error) {
    // Si el proyecto se abrio con doble clic (file://) el import()
    // fallara por la politica CORS. Lo explicamos con claridad.
    console.error('[main.js] No se pudo cargar el modulo dinamico:', error);
    c.imprimir('No se pudo cargar el modulo:', error.message);
    c.imprimir('');
    c.imprimir('Causa mas probable: la pagina se abrio con doble clic (file://).');
    c.imprimir('Solucion: levanta un servidor local. Mira el aviso del inicio.');

    if (estado) {
      estado.textContent = 'Error al cargar';
      estado.className = 'insignia insignia--error';
    }
  } finally {
    // El bloque finally se ejecuta pase lo que pase: es el sitio
    // correcto para devolver el boton a su estado normal.
    if (boton) {
      boton.disabled = false;
      boton.textContent = 'Cargar el modulo del reporte';
    }
  }
}

// ============================================================
// 11. SECCION 16: LA CAJA DE HERRAMIENTAS (parte practica)
// ============================================================

/**
 * Dibuja una lista de pares clave/valor dentro de un contenedor.
 *
 * BUENA PRACTICA: construimos los elementos con createElement y
 * textContent en vez de innerHTML. Como parte del contenido viene de lo
 * que escribe el usuario, con innerHTML estariamos abriendo la puerta a
 * una inyeccion de HTML (XSS).
 */
function pintarResultado(idContenedor, lineas, { claseGeneral = '' } = {}) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  // Vaciamos el contenedor de forma segura.
  contenedor.textContent = '';
  contenedor.className = `resultado ${claseGeneral}`.trim();

  for (const linea of lineas) {
    // Cada linea puede ser un texto suelto o un par { clave, valor }.
    if (typeof linea === 'string') {
      const parrafo = document.createElement('p');
      parrafo.className = 'texto-suave';
      parrafo.textContent = linea;
      contenedor.appendChild(parrafo);
      continue;
    }

    const { clave, valor, clase = '' } = linea;

    const fila = document.createElement('div');
    fila.className = 'linea';

    const etiquetaClave = document.createElement('span');
    etiquetaClave.className = 'clave';
    etiquetaClave.textContent = clave;

    const etiquetaValor = document.createElement('span');
    etiquetaValor.className = `valor ${clase}`.trim();
    etiquetaValor.textContent = String(valor);

    fila.append(etiquetaClave, etiquetaValor);
    contenedor.appendChild(fila);
  }
}

// ---------------------------------------------------------
// 11.1 Herramienta de moneda
// ---------------------------------------------------------
function herramientaMoneda() {
  const montoTexto = document.getElementById('entrada-monto')?.value ?? '';
  const moneda = document.getElementById('entrada-moneda')?.value ?? 'CLP';

  const monto = Number(montoTexto);

  // Validamos antes de calcular nada.
  if (montoTexto.trim() === '' || !Number.isFinite(monto)) {
    pintarResultado('resultado-moneda', [
      { clave: 'Error', valor: 'Escribe un monto numerico valido.', clase: 'texto-error' },
    ]);
    return;
  }

  // Guardamos la preferencia en el almacen compartido.
  establecerPreferencia('moneda', moneda);

  const informacion = MONEDAS[moneda];
  const iva = monto * 0.19;
  const totalConIva = monto + iva;
  const conDescuento = monto * 0.9;

  pintarResultado('resultado-moneda', [
    { clave: 'Moneda', valor: `${moneda} - ${informacion?.etiqueta ?? 'desconocida'}` },
    { clave: 'Monto formateado', valor: formatearMoneda(monto, { moneda }), clase: 'texto-exito' },
    { clave: 'IVA (19 %)', valor: formatearMoneda(iva, { moneda }) },
    { clave: 'Total con IVA', valor: formatearMoneda(totalConIva, { moneda }), clase: 'texto-exito' },
    { clave: 'Con 10 % de descuento', valor: formatearMoneda(conDescuento, { moneda }) },
    { clave: 'Numero con separadores', valor: formatearNumero(monto, { decimales: 0 }) },
    { clave: 'Proporcion del presupuesto', valor: formatearPorcentaje(monto / matematicas.PRESUPUESTO_MAXIMO) },
    { clave: 'Codigo de factura', valor: codigoDeFactura(Math.round(monto % 1000)) },
  ]);

  // Ademas dejamos rastro en la consola general.
  imprimir(destacar`Moneda: ${formatearMoneda(monto, { moneda })} (${moneda})`);
  registrarEvento('formato-moneda', { monto, moneda });
  // Sumamos al contador del almacen para que el reporte dinamico lo vea.
  sumarUso('formatosMoneda');
}

// ---------------------------------------------------------
// 11.2 Herramienta de fechas
// ---------------------------------------------------------
function herramientaFecha() {
  const valor = document.getElementById('entrada-fecha')?.value ?? '';

  const comprobacion = validarRequerido(valor, 'La fecha');
  if (!comprobacion.valido) {
    pintarResultado('resultado-fecha', [
      { clave: 'Error', valor: comprobacion.mensaje, clase: 'texto-error' },
    ]);
    return;
  }

  // Calculamos cuantos dias faltan o han pasado.
  const hoy = new Date();
  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const diferenciaDias = Math.round((fecha - hoy) / 86_400_000);

  pintarResultado('resultado-fecha', [
    { clave: 'Formato largo', valor: aTitulo(formatearFecha(valor, { estilo: 'largo' })), clase: 'texto-exito' },
    { clave: 'Dia de la semana', valor: aTitulo(formatearFecha(valor, { estilo: 'diaSemana' })) },
    { clave: 'Formato corto', valor: formatearFecha(valor, { estilo: 'corto' }) },
    { clave: 'Formato numerico', valor: formatearFecha(valor, { estilo: 'numerico' }) },
    { clave: 'Distancia', valor: fechaRelativa(valor), clase: 'texto-alerta' },
    { clave: 'Dias de diferencia', valor: formatearNumero(diferenciaDias) },
    { clave: 'En ingles', valor: formatearFecha(valor, { estilo: 'largo', idioma: 'en-US' }) },
    { clave: 'Url amigable', valor: aUrlAmigable(formatearFecha(valor, { estilo: 'largo' })) },
  ]);

  imprimir(`Fecha formateada: ${formatearFecha(valor, { estilo: 'largo' })} (${fechaRelativa(valor)})`);
  registrarEvento('formato-fecha', { valor });
  sumarUso('formatosFecha');
}

// ---------------------------------------------------------
// 11.3 Herramienta de validacion
// ---------------------------------------------------------
function herramientaValidacion() {
  const email = document.getElementById('entrada-email')?.value ?? '';
  const clave = document.getElementById('entrada-clave')?.value ?? '';

  // Usamos el validador de formulario completo: recibe un objeto de
  // datos y un objeto de reglas, y devuelve el detalle de cada campo.
  const informe = validarFormulario(
    { email, clave },
    {
      email: validarEmail,
      clave: revisarClave,   // el nombre renombrado en el import
    }
  );

  const detalleEmail = informe.detalle.email;
  const detalleClave = informe.detalle.clave;

  // Pintamos la barra de fuerza de la contrasena.
  const relleno = document.getElementById('barra-fuerza-relleno');
  if (relleno) {
    relleno.style.width = `${detalleClave.puntaje}%`;
    const colores = { exito: '#4ade80', alerta: '#fbbf24', error: '#f87171' };
    relleno.style.backgroundColor = colores[detalleClave.color] ?? '#f87171';
  }

  const lineas = [
    { clave: 'Correo', valor: detalleEmail.valido ? 'Valido' : 'No valido', clase: detalleEmail.valido ? 'texto-exito' : 'texto-error' },
    { clave: 'Usuario', valor: detalleEmail.usuario ?? '(sin usuario)' },
    { clave: 'Dominio', valor: detalleEmail.dominio ?? '(sin dominio)' },
    { clave: 'Extension', valor: detalleEmail.extension ?? '(sin extension)' },
    { clave: 'Contrasena', valor: `${detalleClave.fuerza} (${detalleClave.puntaje}/100)`, clase: `texto-${detalleClave.color}` },
    { clave: 'Largo', valor: `${detalleClave.largo} caracteres (minimo ${REGLAS_CONTRASENA.largoMinimo})` },
    { clave: 'Errores totales', valor: informe.cantidadDeErrores, clase: informe.valido ? 'texto-exito' : 'texto-error' },
  ];

  // Anadimos cada problema como una linea de texto suelto.
  if (informe.problemas.length > 0) {
    lineas.push('Problemas detectados:');
    for (const problema of informe.problemas) {
      lineas.push({ clave: '·', valor: problema, clase: 'texto-error' });
    }
  } else {
    lineas.push('Todo correcto: el formulario pasaria la validacion.');
  }

  pintarResultado('resultado-validacion', lineas);

  imprimir(`Validacion -> correo ${detalleEmail.valido ? 'OK' : 'ERROR'}, clave ${detalleClave.fuerza}.`);
}

// ---------------------------------------------------------
// 11.4 Herramienta de estadisticas
// ---------------------------------------------------------
function herramientaEstadisticas() {
  const texto = document.getElementById('entrada-notas')?.value ?? '';
  const notas = matematicas.extraerNumeros(texto);

  if (notas.length === 0) {
    pintarResultado('resultado-estadisticas', [
      { clave: 'Error', valor: 'Escribe al menos una nota separada por comas o espacios.', clase: 'texto-error' },
    ]);
    return;
  }

  // Desestructuramos el resumen completo en variables sueltas.
  const {
    cantidad,
    promedio,
    mediana,
    minimo,
    maximo,
    rango,
    desviacion,
    aprobados,
    reprobados,
    porcentajeAprobacion,
    ultima,
  } = matematicas.resumenEstadistico(notas);

  pintarResultado('resultado-estadisticas', [
    { clave: 'Notas leidas', valor: cantidad },
    { clave: 'Promedio', valor: promedio.toFixed(2), clase: promedio >= matematicas.NOTA_APROBACION ? 'texto-exito' : 'texto-error' },
    { clave: 'Mediana', valor: mediana.toFixed(2) },
    { clave: 'Nota mas baja', valor: minimo.toFixed(1), clase: 'texto-error' },
    { clave: 'Nota mas alta', valor: maximo.toFixed(1), clase: 'texto-exito' },
    { clave: 'Rango', valor: rango.toFixed(1) },
    { clave: 'Desviacion estandar', valor: desviacion.toFixed(2) },
    { clave: 'Aprobados', valor: `${aprobados} de ${cantidad}`, clase: 'texto-exito' },
    { clave: 'Reprobados', valor: reprobados, clase: reprobados > 0 ? 'texto-error' : '' },
    { clave: 'Porcentaje de aprobacion', valor: `${porcentajeAprobacion} %`, clase: 'texto-alerta' },
    { clave: 'Ultima nota (at(-1))', valor: ultima },
    { clave: 'Notas ordenadas', valor: [...notas].sort((a, b) => a - b).join(' · ') },
  ]);

  imprimir(`Estadisticas de ${cantidad} notas -> promedio ${promedio}, aprobados ${aprobados}.`);
  registrarEvento('calculo-estadistico', { cantidad, promedio });
  sumarUso('calculosEstadisticos');
}

/**
 * Pequeno ayudante que sube un contador del almacen. Lo hacemos con un
 * import dinamico en linea para NO tener que importar sumarContador
 * arriba: es una demostracion extra de que import() se puede usar en
 * cualquier punto del codigo.
 */
async function sumarUso(clave) {
  const almacen = await import('./modulos/almacen.js');
  almacen.sumarContador(clave);
}

// ============================================================
// 12. CONEXION DE LOS BOTONES DEL HTML
// ------------------------------------------------------------
// Un solo escuchador en el documento (delegacion de eventos) en lugar
// de decenas de addEventListener. Cuando alguien pulsa cualquier cosa,
// miramos si el elemento pulsado tiene los atributos data-* que nos
// interesan y actuamos en consecuencia.
// ============================================================
function conectarEventos() {
  document.addEventListener('click', (evento) => {
    // closest() sube por el arbol buscando el ancestro mas cercano que
    // encaje. Asi funciona aunque el usuario pulse sobre un icono que
    // este dentro del boton.
    const boton = evento.target.closest('[data-accion]');
    if (!boton) return;

    // Desestructuramos el dataset (que es un objeto con todos los data-*).
    const { accion, demo, consola: idConsola } = boton.dataset;

    if (accion === 'ejecutar' && demo) {
      ejecutarDemo(demo);
      return;
    }

    if (accion === 'limpiar' && idConsola) {
      limpiar(idConsola);
      return;
    }

    // Tabla de despacho para el resto de acciones sueltas.
    const acciones = {
      'ejecutar-todo': ejecutarTodasLasDemos,
      'limpiar-todo': limpiarTodo,
      'cargar-dinamico': cargarReporteAvanzado,
      'herramienta-moneda': herramientaMoneda,
      'herramienta-fecha': herramientaFecha,
      'herramienta-validacion': herramientaValidacion,
      'herramienta-estadisticas': herramientaEstadisticas,
      'reiniciar-almacen': () => {
        reiniciar();
        demostrarAlmacen();
        imprimir('Almacen reiniciado por el docente.');
      },
    };

    acciones[accion]?.();
  });

  // Actualizacion en vivo de la barra de fuerza mientras se escribe.
  const campoClave = document.getElementById('entrada-clave');
  campoClave?.addEventListener('input', () => {
    const resultado = revisarClave(campoClave.value);
    const relleno = document.getElementById('barra-fuerza-relleno');
    if (!relleno) return;
    relleno.style.width = `${resultado.puntaje}%`;
    const colores = { exito: '#4ade80', alerta: '#fbbf24', error: '#f87171' };
    relleno.style.backgroundColor = colores[resultado.color] ?? '#f87171';
  });

  // Recalcular la moneda al cambiar el selector, sin pulsar el boton.
  document.getElementById('entrada-moneda')?.addEventListener('change', herramientaMoneda);
}

// ============================================================
// 13. EJECUCION INICIAL
// ============================================================

function ejecutarTodasLasDemos() {
  // Object.keys sobre la tabla de despacho: si manana anadimos una demo
  // nueva, este bucle la recoge solo. Nada que tocar aqui.
  for (const nombre of Object.keys(DEMOSTRACIONES)) {
    ejecutarDemo(nombre);
  }
  imprimir('Todas las demostraciones se ejecutaron de nuevo.');
}

function limpiarTodo() {
  for (const consola of Object.values(consolas)) {
    consola.limpiar();
  }
  limpiar('salida');
  imprimir('Consolas limpiadas. Pulsa "Ejecutar todas las demostraciones" para repetir.');
}

/** Marca en la pagina que los modulos SI se cargaron. */
function confirmarCargaDeModulos() {
  const estado = document.getElementById('estado-modulos');
  if (!estado) return;

  estado.className = 'aviso aviso--exito';
  estado.innerHTML = '';

  const titulo3 = document.createElement('h3');
  titulo3.textContent = 'Modulos ES cargados correctamente';

  const parrafo = document.createElement('p');
  parrafo.textContent =
    'Si lees este mensaje en verde es porque la pagina se esta sirviendo por HTTP y ' +
    'el navegador pudo resolver todos los import. Cargados: consola, formato, matematicas, ' +
    'validaciones, almacen, sintaxis-moderna, metodos-modernos e iteradores-y-generadores.';

  estado.append(titulo3, parrafo);
}

/** Rellena la caja de herramientas con valores de ejemplo utiles en clase. */
function precargarFormularios() {
  const hoy = new Date();
  const dentroDeUnMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());

  const campoFecha = document.getElementById('entrada-fecha');
  if (campoFecha) {
    // Construimos AAAA-MM-DD con padStart: el input date exige ese formato.
    const anio = dentroDeUnMes.getFullYear();
    const mes = String(dentroDeUnMes.getMonth() + 1).padStart(2, '0');
    const dia = String(dentroDeUnMes.getDate()).padStart(2, '0');
    campoFecha.value = `${anio}-${mes}-${dia}`;
  }

  // Rellenamos el selector de monedas a partir del objeto MONEDAS,
  // en lugar de escribir las opciones a mano en el HTML.
  const selector = document.getElementById('entrada-moneda');
  if (selector && selector.options.length === 0) {
    for (const [codigo, { etiqueta }] of Object.entries(MONEDAS)) {
      const opcion = document.createElement('option');
      opcion.value = codigo;
      opcion.textContent = `${codigo} · ${etiqueta}`;
      selector.appendChild(opcion);
    }
    selector.value = obtenerPreferencia('moneda', 'CLP');
  }
}

/** Arranque de la aplicacion. */
function iniciar() {
  confirmarCargaDeModulos();
  precargarFormularios();
  conectarEventos();

  // --- Registro general de la pagina ---
  titulo('Proyecto 10 iniciado');
  imprimir('Fecha y hora:', formatearFecha(new Date(), { estilo: 'conHora' }));
  imprimir('Instancia del almacen compartido:', ID_INSTANCIA);
  imprimir('Modulos cargados: consola, formato, matematicas, validaciones, almacen,');
  imprimir('                  sintaxis-moderna, metodos-modernos, iteradores-y-generadores.');
  imprimir('El modulo reporte-avanzado.js todavia NO se ha descargado (seccion 15).');
  imprimir('Nota de aprobacion configurada en:', matematicas.NOTA_APROBACION);
  imprimir('Presupuesto de ejemplo:', formatearMoneda(matematicas.PRESUPUESTO_MAXIMO));

  // --- Ejecutamos todas las demostraciones de teoria ---
  ejecutarTodasLasDemos();

  // --- Dejamos la caja de herramientas con un primer resultado ---
  // Asi la seccion practica no aparece vacia al abrir la pagina y el
  // docente puede comentarla antes de tocar ningun campo.
  herramientaMoneda();
  herramientaFecha();
  herramientaValidacion();
  herramientaEstadisticas();

  titulo('Todo listo');
  imprimir('Usa los botones de cada seccion para repetir cualquier demostracion.');

  registrarEvento('sistema', { accion: 'aplicacion iniciada' });
}

// ============================================================
// 14. RED DE SEGURIDAD
// ------------------------------------------------------------
// Si algo falla de forma inesperada, lo mostramos en la consola visual
// en lugar de dejar la pagina en blanco sin explicacion.
// ============================================================
window.addEventListener('error', (evento) => {
  imprimir(`ERROR NO CONTROLADO: ${evento.message}`);
});

window.addEventListener('unhandledrejection', (evento) => {
  imprimir(`PROMESA RECHAZADA SIN CAPTURAR: ${evento.reason}`);
});

// ============================================================
// 15. ARRANQUE
// ------------------------------------------------------------
// Los modulos se ejecutan SIEMPRE de forma diferida, como si el script
// llevara `defer`. Eso significa que el HTML completo ya esta analizado
// y el DOM ya existe cuando llega esta linea.
//
// ERROR COMUN: envolver esto en DOMContentLoaded "por si acaso". No hace
// falta, y con un modulo el evento puede haberse disparado ya.
// ============================================================
iniciar();

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade una quinta herramienta a la caja: un conversor de unidades
 *    (kilometros a millas, celsius a fahrenheit). Crea el modulo
 *    js/modulos/conversiones.js con exportaciones nombradas e importalo aqui.
 *
 * 2) Cambia el import de matematicas para traer solo `resumenEstadistico` y
 *    `extraerNumeros` de forma nombrada, y ajusta el codigo. Comenta que
 *    ventaja tiene frente al `import * as`.
 *
 * 3) Haz que la preferencia de moneda se recuerde entre recargas guardandola
 *    en localStorage, y que el almacen la lea al iniciar. Cuidado:
 *    localStorage solo guarda texto.
 *
 * 4) Anade un segundo boton de carga dinamica que importe un modulo distinto
 *    segun el valor de un <select>. Usa una plantilla para construir la ruta:
 *    await import(`./extras/${nombreElegido}.js`).
 *
 * 5) AVANZADO: convierte la funcion iniciar() en asincrona y carga los tres
 *    modulos de teoria (sintaxis, metodos, generadores) con import() dinamico
 *    en paralelo usando Promise.all. Mide con performance.now() la diferencia
 *    frente a los imports estaticos y comentala.
 * ============================================================
 */
