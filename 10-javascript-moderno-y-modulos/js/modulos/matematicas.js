/**
 * ============================================================
 * ARCHIVO: js/modulos/matematicas.js
 * TEMA: Modulo de utilidades numericas y estadisticas
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Exportaciones nombradas en sus DOS formas:
 *      a) `export function nombre() {}`  (exportacion en linea)
 *      b) `export { interno as publico }` (lista de exportacion al final)
 *  - Parametros REST (...numeros) para funciones de aridad variable.
 *  - Spread al llamar a funciones: Math.max(...notas).
 *  - Separadores numericos con guion bajo: 1_000_000.
 *  - Number.isInteger, Number.isFinite y por que son mejores que
 *    las funciones globales isNaN() / isFinite().
 *  - Array.prototype.at() para leer el ultimo elemento.
 *
 * CONTEXTO DE LOS EJEMPLOS
 * Trabajamos con notas de estudiantes en escala chilena de 1,0 a 7,0
 * y con precios de productos. Nada de foo/bar.
 * ============================================================
 */

console.log('[matematicas.js] Modulo evaluado.');

// ============================================================
// 1. CONSTANTES EXPORTADAS
// ------------------------------------------------------------
// `export const` publica un valor de solo lectura para quien importe.
// Fijate en los separadores numericos: son puro azucar visual, el
// motor los ignora. 1_000_000 === 1000000 es true.
// ============================================================

/** Nota minima para aprobar en la escala 1,0 - 7,0. */
export const NOTA_APROBACION = 4.0;

/** Nota maxima posible. */
export const NOTA_MAXIMA = 7.0;

/** Tope de presupuesto de ejemplo: un millon. Leelo en voz alta con el guion bajo. */
export const PRESUPUESTO_MAXIMO = 1_000_000;

/**
 * Un numero grande escrito de forma legible. Se lee agrupando de tres en tres:
 * mil doscientos treinta y cuatro millones quinientos sesenta y siete mil
 * ochocientos noventa. Justo por eso existen los separadores: sin ellos
 * (1234567890) nadie es capaz de decir la cifra de un vistazo.
 */
export const POBLACION_EJEMPLO = 1_234_567_890;

// ============================================================
// 2. VALIDACION INTERNA DE ENTRADAS
// ------------------------------------------------------------
// Funcion PRIVADA (sin export). Antes de calcular cualquier cosa,
// nos aseguramos de recibir un array de numeros reales.
//
// ERROR COMUN: confiar en que el usuario escribio numeros.
// Un input HTML devuelve SIEMPRE texto: "5.5" es un string, no un 5.5.
// ============================================================
function soloNumerosValidos(valores) {
  // Array.isArray es la forma correcta de saber si algo es un array.
  // ERROR COMUN: usar `typeof valores === 'object'`, porque eso
  // tambien da true para {}, null y las fechas.
  if (!Array.isArray(valores)) return [];

  return valores
    .map((valor) => Number(valor))           // convertimos texto -> numero
    .filter((numero) => Number.isFinite(numero)); // descartamos NaN e Infinity
}

// ============================================================
// 3. SUMA CON PARAMETROS REST
// ------------------------------------------------------------
// El REST (...) recoge TODOS los argumentos sueltos en un array real.
// Es lo contrario del spread: rest EMPAQUETA, spread DESEMPAQUETA.
//
//   sumar(1, 2, 3)        -> numeros vale [1, 2, 3]
//   sumar(...[1, 2, 3])   -> exactamente lo mismo
//
// BUENA PRACTICA: el parametro rest debe ser SIEMPRE el ultimo.
// `function mal(...items, ultimo)` es un error de sintaxis.
// ============================================================
export function sumar(...numeros) {
  // reduce recorre el array acumulando un resultado. El 0 final es
  // el valor inicial del acumulador: imprescindible para que sumar()
  // sin argumentos devuelva 0 en lugar de lanzar un error.
  return soloNumerosValidos(numeros).reduce((acumulado, actual) => acumulado + actual, 0);
}

// ============================================================
// 4. PROMEDIO (se exportara con OTRO nombre al final del archivo)
// ------------------------------------------------------------
// Aqui la funcion se llama `calcularPromedio`, pero la exportaremos
// como `promedio`. Sirve para ensenar que el nombre interno y el
// nombre publico de un modulo pueden ser distintos.
// ============================================================
function calcularPromedio(numeros) {
  const validos = soloNumerosValidos(numeros);

  // Guarda temprana: si no hay datos, devolvemos 0 y evitamos dividir
  // entre cero (que en JavaScript da NaN, no un error).
  if (validos.length === 0) return 0;

  return sumar(...validos) / validos.length; // spread al llamar a sumar
}

// ============================================================
// 5. MEDIANA
// ------------------------------------------------------------
// La mediana es el valor que queda justo en el medio al ordenar los
// datos. A diferencia del promedio, no se deja arrastrar por un valor
// extremo: si un estudiante saca un 1,0, el promedio cae mucho pero
// la mediana casi no se mueve.
// ============================================================
export function mediana(numeros) {
  const validos = soloNumerosValidos(numeros);
  if (validos.length === 0) return 0;

  // ERROR COMUN: usar sort() sin funcion comparadora.
  // sort() ordena como TEXTO por defecto: [10, 9, 100].sort() da
  // [10, 100, 9]. Hay que pasarle (a, b) => a - b para orden numerico.
  //
  // Ademas usamos [...validos] para ordenar una COPIA: sort() modifica
  // el array original y eso sorprende a mucha gente.
  const ordenados = [...validos].sort((a, b) => a - b);

  const medio = Math.floor(ordenados.length / 2);

  // Si la cantidad es impar hay un elemento central exacto.
  if (ordenados.length % 2 !== 0) return ordenados[medio];

  // Si es par, la mediana es el promedio de los dos centrales.
  return (ordenados[medio - 1] + ordenados[medio]) / 2;
}

// ============================================================
// 6. MINIMO Y MAXIMO CON SPREAD
// ------------------------------------------------------------
// Math.max espera argumentos sueltos: Math.max(3, 9, 5).
// Si le pasamos el array directamente, Math.max([3, 9, 5]) da NaN.
// El spread convierte el array en argumentos sueltos.
//
// LIMITE PRACTICO: con arrays gigantescos (cientos de miles de
// elementos) el spread puede desbordar la pila de llamadas. En ese
// caso se usa reduce(). Para las notas de un curso no hay problema.
// ============================================================
export function minimo(numeros) {
  const validos = soloNumerosValidos(numeros);
  if (validos.length === 0) return 0;
  return Math.min(...validos);
}

export function maximo(numeros) {
  const validos = soloNumerosValidos(numeros);
  if (validos.length === 0) return 0;
  return Math.max(...validos);
}

// ============================================================
// 7. DESVIACION ESTANDAR (poblacional)
// ------------------------------------------------------------
// Mide cuanto se separan los datos de su promedio. Si es baja, el
// curso es parejo; si es alta, hay mucha diferencia entre estudiantes.
// Formula: raiz cuadrada del promedio de las diferencias al cuadrado.
// ============================================================
export function desviacionEstandar(numeros) {
  const validos = soloNumerosValidos(numeros);
  if (validos.length === 0) return 0;

  const media = calcularPromedio(validos);
  const diferenciasAlCuadrado = validos.map((numero) => (numero - media) ** 2);
  //                                                     ^^ operador de potencia (ES2016)

  return Math.sqrt(calcularPromedio(diferenciasAlCuadrado));
}

// ============================================================
// 8. REDONDEO CON DECIMALES CONTROLADOS
// ------------------------------------------------------------
// Math.round solo redondea a entero. Para 2 decimales multiplicamos,
// redondeamos y volvemos a dividir.
//
// ERROR COMUN: esperar precision infinita con decimales.
// 0.1 + 0.2 no da exactamente 0.3 (da 0.30000000000000004) porque los
// numeros se guardan en binario. Para dinero de verdad se trabaja en
// centavos con enteros, o con librerias especializadas.
// ============================================================
export function redondear(numero, decimales = 2) {
  const valor = Number(numero);
  if (!Number.isFinite(valor)) return 0;

  // Number.isInteger comprueba si es un entero SIN convertir tipos.
  // Number.isInteger('4') es false; el viejo isNaN('4') era true/false
  // segun conversiones implicitas, y eso confundia mucho.
  if (!Number.isInteger(decimales) || decimales < 0) decimales = 2;

  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

// ============================================================
// 9. LIMITAR UN VALOR A UN RANGO
// ------------------------------------------------------------
// Muy util para barras de progreso: nunca menos de 0, nunca mas de 100.
// ============================================================
export function limitar(valor, minimoPermitido = 0, maximoPermitido = 100) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return minimoPermitido;
  return Math.min(Math.max(numero, minimoPermitido), maximoPermitido);
}

// ============================================================
// 10. PORCENTAJE
// ============================================================
export function porcentaje(parte, total) {
  const p = Number(parte);
  const t = Number(total);
  if (!Number.isFinite(p) || !Number.isFinite(t) || t === 0) return 0;
  return redondear((p / t) * 100, 1);
}

// ============================================================
// 11. RESUMEN ESTADISTICO COMPLETO
// ------------------------------------------------------------
// Devuelve un objeto con todo calculado. Quien lo reciba puede
// DESESTRUCTURARLO comodamente:
//    const { promedio, mediana, aprobados } = resumenEstadistico(notas);
//
// Fijate en `datos.at(-1)`: el metodo at() (ES2022) acepta indices
// negativos y cuenta desde el final. Antes habia que escribir
// datos[datos.length - 1], mucho mas largo y facil de equivocar.
// ============================================================
export function resumenEstadistico(numeros, { minimoAprobacion = NOTA_APROBACION } = {}) {
  const datos = soloNumerosValidos(numeros);

  // Si no hay datos devolvemos una estructura vacia pero con LA MISMA
  // FORMA, para que quien la use no tenga que comprobar si existe cada
  // propiedad. BUENA PRACTICA: formas de objeto consistentes.
  if (datos.length === 0) {
    return {
      cantidad: 0,
      suma: 0,
      promedio: 0,
      mediana: 0,
      minimo: 0,
      maximo: 0,
      rango: 0,
      desviacion: 0,
      aprobados: 0,
      reprobados: 0,
      porcentajeAprobacion: 0,
      primera: null,
      ultima: null,
      hayDatos: false,
    };
  }

  const aprobados = datos.filter((nota) => nota >= minimoAprobacion).length;

  return {
    cantidad: datos.length,
    suma: redondear(sumar(...datos)),
    promedio: redondear(calcularPromedio(datos)),
    mediana: redondear(mediana(datos)),
    minimo: minimo(datos),
    maximo: maximo(datos),
    rango: redondear(maximo(datos) - minimo(datos)),
    desviacion: redondear(desviacionEstandar(datos)),
    aprobados,
    reprobados: datos.length - aprobados,
    porcentajeAprobacion: porcentaje(aprobados, datos.length),
    primera: datos.at(0),    // equivale a datos[0]
    ultima: datos.at(-1),    // el ultimo, sin escribir length - 1
    hayDatos: true,
  };
}

// ============================================================
// 12. CONVERTIR TEXTO LIBRE EN UN ARRAY DE NUMEROS
// ------------------------------------------------------------
// El textarea de la pagina recibe algo como "6,5 5.8; 4  7".
// Aceptamos comas, punto y coma, espacios y saltos de linea como
// separadores, y admitimos la coma decimal del formato espanol.
// ============================================================
export function extraerNumeros(texto) {
  if (typeof texto !== 'string') return [];

  return texto
    // Cortamos por cualquier combinacion de separadores.
    .split(/[\s;,]+/)
    // trim() por si quedaron espacios sueltos en los extremos.
    .map((trozo) => trozo.trim())
    // Descartamos los trozos vacios (Boolean como funcion de filtro
    // es un truco corto y legible para "quitame lo falsy").
    .filter(Boolean)
    .map((trozo) => Number(trozo))
    .filter((numero) => Number.isFinite(numero));
}

// ============================================================
// 13. LISTA DE EXPORTACION AL FINAL (con renombrado)
// ------------------------------------------------------------
// Esta es la SEGUNDA forma de exportar. En vez de poner `export`
// delante de cada declaracion, se agrupa todo al final del archivo.
// Ventaja: de un vistazo ves la "API publica" completa del modulo.
//
// La palabra clave `as` renombra: internamente la funcion se llama
// `calcularPromedio`, pero quien importe pedira `promedio`.
// ============================================================
export {
  calcularPromedio as promedio,
  soloNumerosValidos as limpiarNumeros,
};

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade y exporta `moda(numeros)`: el valor que mas se repite.
 *    Resuelvelo con un Map o con reduce. Si hay empate, devuelve el menor.
 *
 * 2) Escribe `notasSobre(numeros, umbral = 6)` usando findLast() para
 *    devolver la ULTIMA nota que supera el umbral, y explica en un comentario
 *    en que se diferencia de find().
 *
 * 3) Crea `aplicarCurva(notas, puntos = 0.5)` que sume una cantidad a cada nota
 *    sin superar NOTA_MAXIMA. Devuelve un array NUEVO (no modifiques el original)
 *    y usa la funcion limitar() que ya existe en este modulo.
 *
 * 4) Exporta una constante `ESCALAS` con la escala chilena y la espanola (0-10),
 *    y una funcion `convertirEscala(nota, desde, hacia)` que traduzca entre ambas.
 *
 * 5) AVANZADO: anade `percentil(numeros, p)` que calcule el percentil p (0-100)
 *    por interpolacion lineal. Comprueba que percentil(datos, 50) coincide con
 *    la mediana que ya calcula este modulo.
 * ============================================================
 */
