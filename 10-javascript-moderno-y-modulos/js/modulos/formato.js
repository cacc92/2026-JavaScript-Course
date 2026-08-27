/**
 * ============================================================
 * ARCHIVO: js/modulos/formato.js
 * TEMA: Modulo de formato (dinero, fechas, texto) + export default
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - `export default`: la exportacion PRINCIPAL de un modulo. Solo
 *    puede haber UNA por archivo y quien la importa le pone el nombre
 *    que quiera (no necesita llaves ni `as`).
 *  - Convivencia de `export default` con exportaciones nombradas.
 *  - Template literals con expresiones y en varias lineas.
 *  - TAGGED TEMPLATES (plantillas etiquetadas): una funcion que
 *    intercepta el texto y los valores de una plantilla.
 *  - Metodos modernos de String: replaceAll, trimStart, trimEnd,
 *    padStart, padEnd, at.
 *  - Las APIs Intl.NumberFormat, Intl.DateTimeFormat y
 *    Intl.RelativeTimeFormat, que vienen DENTRO del navegador y
 *    evitan tener que instalar librerias externas.
 * ============================================================
 */

console.log('[formato.js] Modulo evaluado.');

// ============================================================
// 1. CONFIGURACION POR DEFECTO
// ------------------------------------------------------------
// Un objeto de configuracion exportado permite que la aplicacion lo
// consulte, y que en clase cambiemos el idioma en caliente.
// ============================================================
export const CONFIGURACION = {
  idiomaPorDefecto: 'es-CL',
  monedaPorDefecto: 'CLP',
};

/**
 * Monedas que ofrece la caja de herramientas.
 * Un objeto plano hace de "diccionario": clave -> descripcion.
 */
export const MONEDAS = {
  CLP: { etiqueta: 'Peso chileno', idioma: 'es-CL', decimales: 0 },
  EUR: { etiqueta: 'Euro', idioma: 'es-ES', decimales: 2 },
  USD: { etiqueta: 'Dolar estadounidense', idioma: 'en-US', decimales: 2 },
  MXN: { etiqueta: 'Peso mexicano', idioma: 'es-MX', decimales: 2 },
  ARS: { etiqueta: 'Peso argentino', idioma: 'es-AR', decimales: 2 },
};

// ============================================================
// 2. FORMATEAR MONEDA  (sera la EXPORTACION POR DEFECTO)
// ------------------------------------------------------------
// Intl.NumberFormat sabe donde va el simbolo, si el separador de miles
// es punto o coma y cuantos decimales usa cada moneda. Escribir esto
// a mano es una fuente inagotable de bugs.
//
// Fijate en la desestructuracion en los parametros con valores por
// defecto Y con `= {}` al final: eso permite llamar a la funcion como
// formatearMoneda(1500) sin pasar el segundo argumento.
// ============================================================
function formatearMoneda(valor, { moneda = CONFIGURACION.monedaPorDefecto, idioma } = {}) {
  const numero = Number(valor);

  // Guarda temprana: si no es un numero utilizable, devolvemos un texto
  // claro en vez de "NaN", que al estudiante no le dice nada.
  if (!Number.isFinite(numero)) return 'Valor no numerico';

  // Encadenamiento opcional (?.) por si nos pasan una moneda desconocida:
  // MONEDAS['XYZ'] es undefined y sin el ?. explotaria al leer .idioma.
  const informacion = MONEDAS[moneda];
  const idiomaFinal = idioma ?? informacion?.idioma ?? CONFIGURACION.idiomaPorDefecto;
  //                          ^^ fusion nula encadenada: se queda con el PRIMER
  //                             valor que no sea null ni undefined (un 0 o una
  //                             cadena vacia SI se aceptarian, a diferencia de ||)

  try {
    return new Intl.NumberFormat(idiomaFinal, {
      style: 'currency',
      currency: moneda,
    }).format(numero);
  } catch (error) {
    // Si el codigo de moneda no es valido, Intl lanza un RangeError.
    // Preferimos degradar con elegancia antes que romper la pagina.
    return `${numero.toFixed(2)} ${moneda}`;
  }
}

// ============================================================
// 3. FORMATEAR NUMEROS Y PORCENTAJES
// ============================================================

/** Separadores de miles segun el idioma: 1234567 -> "1.234.567" en es-CL. */
export function formatearNumero(valor, { idioma = CONFIGURACION.idiomaPorDefecto, decimales = 0 } = {}) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 'Valor no numerico';

  return new Intl.NumberFormat(idioma, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(numero);
}

/** 0.734 -> "73,4 %". Ojo: Intl espera la PROPORCION, no el 73.4. */
export function formatearPorcentaje(proporcion, { idioma = CONFIGURACION.idiomaPorDefecto, decimales = 1 } = {}) {
  const numero = Number(proporcion);
  if (!Number.isFinite(numero)) return 'Valor no numerico';

  return new Intl.NumberFormat(idioma, {
    style: 'percent',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(numero);
}

// ============================================================
// 4. FECHAS
// ------------------------------------------------------------
// ERROR COMUN con los <input type="date">: devuelven "2026-03-15".
// Si escribimos new Date('2026-03-15') el navegador lo interpreta como
// medianoche UTC y, en husos horarios al oeste, muestra el DIA ANTERIOR.
// La solucion segura es construir la fecha por partes: new Date(a, m-1, d).
// ============================================================

/** Convierte con seguridad cualquier entrada en un objeto Date valido (o null). */
export function aFecha(entrada) {
  if (entrada instanceof Date) {
    // Un Date invalido existe: new Date('hola'). Se detecta con isNaN.
    return Number.isNaN(entrada.getTime()) ? null : entrada;
  }

  if (typeof entrada === 'string') {
    // Buscamos el patron AAAA-MM-DD que producen los inputs de fecha.
    const partes = entrada.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

    // match() devuelve null cuando NO hay coincidencia, asi que hay que
    // comprobarlo antes de leer nada. ⚠️ ERROR COMUN: hacer directamente
    // entrada.match(...)[1] y encontrarse un "Cannot read properties of null".
    if (partes) {
      // Desestructuracion de array saltandose el primer elemento (la
      // coincidencia completa) con una coma vacia.
      const [, anio, mes, dia] = partes;
      // Los meses en JavaScript van de 0 a 11: enero es 0. Por eso mes - 1.
      const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
      return Number.isNaN(fecha.getTime()) ? null : fecha;
    }

    const generica = new Date(entrada);
    return Number.isNaN(generica.getTime()) ? null : generica;
  }

  if (typeof entrada === 'number') {
    const desdeNumero = new Date(entrada);
    return Number.isNaN(desdeNumero.getTime()) ? null : desdeNumero;
  }

  return null;
}

/**
 * Formatea una fecha con distintos estilos.
 * estilo: 'largo' | 'corto' | 'numerico' | 'conHora' | 'diaSemana'
 */
export function formatearFecha(entrada, { estilo = 'largo', idioma = CONFIGURACION.idiomaPorDefecto } = {}) {
  const fecha = aFecha(entrada);
  if (!fecha) return 'Fecha no valida';

  // Un objeto que hace de "menu de opciones". Mucho mas legible que
  // una cadena de if/else if/else.
  const opciones = {
    largo: { day: 'numeric', month: 'long', year: 'numeric' },
    corto: { day: '2-digit', month: 'short', year: 'numeric' },
    numerico: { day: '2-digit', month: '2-digit', year: 'numeric' },
    conHora: { dateStyle: 'medium', timeStyle: 'short' },
    diaSemana: { weekday: 'long', day: 'numeric', month: 'long' },
  };

  // Fusion nula: si el estilo pedido no existe, caemos en el largo.
  const configuracion = opciones[estilo] ?? opciones.largo;

  return new Intl.DateTimeFormat(idioma, configuracion).format(fecha);
}

/**
 * Distancia en palabras: "hace 3 dias", "en 2 meses".
 * Intl.RelativeTimeFormat se encarga del singular/plural y del idioma.
 */
export function fechaRelativa(entrada, { idioma = CONFIGURACION.idiomaPorDefecto, referencia = new Date() } = {}) {
  const fecha = aFecha(entrada);
  if (!fecha) return 'Fecha no valida';

  const formateador = new Intl.RelativeTimeFormat(idioma, { numeric: 'auto' });

  // Diferencia en segundos. Positiva = futuro, negativa = pasado.
  const segundos = Math.round((fecha.getTime() - referencia.getTime()) / 1000);

  // Tabla de unidades de mayor a menor. Recorremos hasta encontrar la
  // primera unidad en la que la diferencia sea de al menos 1.
  const unidades = [
    { nombre: 'year', segundos: 31_536_000 },
    { nombre: 'month', segundos: 2_592_000 },
    { nombre: 'week', segundos: 604_800 },
    { nombre: 'day', segundos: 86_400 },
    { nombre: 'hour', segundos: 3_600 },
    { nombre: 'minute', segundos: 60 },
  ];

  for (const { nombre, segundos: tamano } of unidades) {
    // Desestructuracion CON RENOMBRADO dentro del for...of:
    // sacamos `segundos` de cada objeto pero lo llamamos `tamano`
    // para no chocar con la variable `segundos` de mas arriba.
    if (Math.abs(segundos) >= tamano) {
      return formateador.format(Math.round(segundos / tamano), nombre);
    }
  }

  return formateador.format(segundos, 'second');
}

// ============================================================
// 5. UTILIDADES DE TEXTO CON METODOS MODERNOS DE STRING
// ============================================================

/** "ana" -> "Ana". Usa at(0) en lugar de charAt(0). */
export function capitalizar(texto) {
  const cadena = String(texto ?? '').trim();
  if (cadena.length === 0) return '';

  // at(0) devuelve el primer caracter; slice(1) el resto.
  return cadena.at(0).toUpperCase() + cadena.slice(1).toLowerCase();
}

/** "maria jose perez" -> "Maria Jose Perez". */
export function aTitulo(texto) {
  return String(texto ?? '')
    .split(' ')
    .filter(Boolean)
    .map(capitalizar)
    .join(' ');
}

/**
 * replaceAll (ES2021) reemplaza TODAS las coincidencias sin necesidad
 * de escribir una expresion regular con la bandera /g.
 *
 * ERROR COMUN: usar replace() creyendo que cambia todas.
 *   'a-b-c'.replace('-', ' ')     -> "a b-c"   (solo la primera)
 *   'a-b-c'.replaceAll('-', ' ')  -> "a b c"   (todas)
 */
export function limpiarSeparadores(texto) {
  return String(texto ?? '')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    // ⚠️ ERROR COMUN: rematar con .replaceAll('  ', ' ') creyendo que eso
    // colapsa CUALQUIER racha de espacios. No lo hace: solo sustituye pares
    // exactos, asi que "a___b" (tres espacios) se queda con dos. Para
    // colapsar rachas de longitud variable hace falta una regex con /g.
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
}

/**
 * trimStart() y trimEnd() recortan espacios de UN SOLO lado.
 * Se usan, por ejemplo, para conservar la sangria de un bloque de
 * codigo pero quitar los saltos de linea sobrantes al final.
 */
export function normalizarEntrada(texto) {
  return String(texto ?? '').trimStart().trimEnd();
}

/**
 * padStart / padEnd rellenan hasta un largo minimo.
 * Casos reales: numeros de factura, horas, tablas alineadas.
 */
export function codigoDeFactura(numero, { prefijo = 'FAC', largo = 6 } = {}) {
  // 42 -> "FAC-000042"
  const relleno = String(numero).padStart(largo, '0');
  return `${prefijo}-${relleno}`;
}

/** Alinea texto a la izquierda rellenando con puntos: util para menus. */
export function alinear(texto, ancho = 24, relleno = '.') {
  return String(texto).padEnd(ancho, relleno);
}

/** Corta un texto largo y le anade puntos suspensivos. */
export function truncar(texto, maximo = 60) {
  const cadena = String(texto ?? '');
  if (cadena.length <= maximo) return cadena;
  // Restamos 1 porque el caracter … ocupa una posicion.
  return cadena.slice(0, maximo - 1).trimEnd() + '…';
}

/** Convierte un titulo en una url amigable: "Clase 10: Modulos" -> "clase-10-modulos". */
export function aUrlAmigable(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')                     // separa la letra de su tilde
    .replaceAll(/[\u0300-\u036f]/g, '')   // elimina las tildes ya separadas
    // OJO: replaceAll con expresion regular EXIGE la bandera /g.
    // Sin ella lanza un TypeError. Es un error comun muy tipico.
    .replaceAll(/[^a-z0-9\s-]/g, '')      // fuera signos raros
    .trim()
    .replaceAll(/\s+/g, '-');         // espacios -> guiones
}

// ============================================================
// 6. TAGGED TEMPLATES (plantillas etiquetadas)
// ------------------------------------------------------------
// Una plantilla etiquetada es una FUNCION escrita justo antes de las
// comillas invertidas:
//
//     precio`El total es ${1500}`
//
// El navegador llama a la funcion `precio` con:
//   - un array con los TROZOS DE TEXTO fijos
//   - los valores interpolados como argumentos sueltos (rest)
//
// La funcion decide como unir todo. Es el mecanismo que usan por
// dentro librerias famosas para escribir CSS o consultas SQL seguras.
// ============================================================

/**
 * destacar`texto ${valor} texto`
 * Rodea cada valor interpolado con comillas angulares para que se vea
 * claramente que parte es fija y cual es dinamica.
 */
export function destacar(trozos, ...valores) {
  // reduce recorre los trozos y va intercalando los valores.
  return trozos.reduce((acumulado, trozo, indice) => {
    const valor = valores[indice];
    // Si ya no quedan valores (el ultimo trozo), no anadimos nada.
    const insercion = indice < valores.length ? `«${valor}»` : '';
    return acumulado + trozo + insercion;
  }, '');
}

/**
 * dinero`Subtotal: ${1500} / Total: ${1785}`
 * Formatea automaticamente como moneda TODOS los numeros interpolados.
 * Los valores que no sean numeros se dejan tal cual.
 */
export function dinero(trozos, ...valores) {
  return trozos.reduce((acumulado, trozo, indice) => {
    if (indice >= valores.length) return acumulado + trozo;
    const valor = valores[indice];
    const formateado = typeof valor === 'number' ? formatearMoneda(valor) : String(valor);
    return acumulado + trozo + formateado;
  }, '');
}

/**
 * seguroHTML`<p>Hola ${nombreDelUsuario}</p>`
 * Escapa los caracteres peligrosos de TODO lo que se interpola.
 *
 * BUENA PRACTICA: si alguna vez insertas texto de un usuario con
 * innerHTML, escapalo antes. Si el usuario escribe
 *   <img src=x onerror="alert('robado')">
 * y lo insertas sin escapar, ese codigo se ejecuta. Eso es un XSS.
 */
export function seguroHTML(trozos, ...valores) {
  const escapar = (valor) =>
    String(valor)
      .replaceAll('&', '&amp;')   // el & va PRIMERO o romperia los demas
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  return trozos.reduce((acumulado, trozo, indice) => {
    if (indice >= valores.length) return acumulado + trozo;
    return acumulado + trozo + escapar(valores[indice]);
  }, '');
}

// ============================================================
// 7. LA EXPORTACION POR DEFECTO
// ------------------------------------------------------------
// Solo puede haber UNA `export default` por modulo. Quien importe
// decide el nombre libremente y NO usa llaves:
//
//     import formatearMoneda from './modulos/formato.js';
//     import precio from './modulos/formato.js';   // mismo valor, otro nombre
//
// Cuando un modulo tiene una funcion claramente principal, esta es la
// forma mas comoda. El resto de utilidades van como exportaciones
// nombradas (que si necesitan llaves e importan por nombre exacto).
// ============================================================
export default formatearMoneda;

// Ademas la exportamos con nombre, por si alguien prefiere importarla asi.
// Un mismo valor puede salir por las dos puertas sin ningun problema.
export { formatearMoneda };

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade `formatearLista(items)` usando Intl.ListFormat para obtener
 *    "Ana, Luis y Camila" a partir de ['Ana', 'Luis', 'Camila'].
 *
 * 2) Crea la plantilla etiquetada `mayusculas` que ponga en mayusculas todos
 *    los valores interpolados pero deje intacto el texto fijo.
 *
 * 3) Escribe `tiempoDeLectura(texto, palabrasPorMinuto = 200)` que devuelva
 *    "3 min de lectura". Usa split(/\s+/), Math.ceil y un template literal.
 *
 * 4) Amplia formatearFecha con el estilo 'iso' que devuelva AAAA-MM-DD usando
 *    padStart(2, '0') para el mes y el dia. Comprueba que funciona con enero.
 *
 * 5) AVANZADO: escribe la plantilla etiquetada `tabla` que reciba filas y
 *    devuelva un texto alineado en columnas con padEnd, calculando el ancho
 *    de cada columna a partir del contenido mas largo.
 * ============================================================
 */
