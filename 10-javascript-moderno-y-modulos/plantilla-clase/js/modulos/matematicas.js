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

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Archivo de logica pura: aqui no hay DOM ni datos que copiar, se
   escribe entero en vivo. Es el mas mecanico de todos y va rapido.

   Al terminar debe exportar: NOTA_APROBACION, NOTA_MAXIMA,
   PRESUPUESTO_MAXIMO, POBLACION_EJEMPLO, sumar, mediana, minimo,
   maximo, desviacionEstandar, redondear, limitar, porcentaje,
   resumenEstadistico, extraerNumeros, promedio (renombrada) y
   limpiarNumeros (renombrada).

   Tiempo estimado: 25 minutos.
   ============================================================ */

// TODO (en clase):
//   Marca de evaluacion del modulo, fuera de toda funcion:
//     console.log('[matematicas.js] Modulo evaluado.');
//   (aprox. 1 linea)

// ============================================================
// 1. CONSTANTES EXPORTADAS
// ------------------------------------------------------------
// `export const` publica un valor de solo lectura para quien importe.
// Fijate en los separadores numericos: son puro azucar visual, el
// motor los ignora. 1_000_000 === 1000000 es true.
// ============================================================

// TODO (en clase):
//   Exporta cuatro constantes, escribiendo los numeros grandes CON
//   guion bajo para que se vea el punto de la seccion:
//     export const NOTA_APROBACION = 4.0;        // nota minima para aprobar (escala 1,0-7,0)
//     export const NOTA_MAXIMA = 7.0;
//     export const PRESUPUESTO_MAXIMO = 1_000_000;
//     export const POBLACION_EJEMPLO = 1_234_567_890;
//   Lee POBLACION_EJEMPLO en voz alta agrupando de tres en tres y
//   pregunta a la clase si podrian hacerlo con 1234567890. Ese es
//   exactamente el motivo de que existan los separadores.
//   (aprox. 4 lineas)

// ============================================================
// 2. VALIDACION INTERNA DE ENTRADAS
// ------------------------------------------------------------
// Funcion PRIVADA (sin export). Antes de calcular cualquier cosa,
// nos aseguramos de recibir un array de numeros reales.
//
// ⚠️ ERROR COMUN: confiar en que el usuario escribio numeros.
// Un input HTML devuelve SIEMPRE texto: "5.5" es un string, no un 5.5.
// ============================================================

// TODO (en clase):
//   1. Declara `function soloNumerosValidos(valores)` SIN export (se
//      exportara renombrada al final del archivo).
//   2. Guarda temprana: si `!Array.isArray(valores)` devuelve [].
//      ⚠️ ERROR COMUN: usar `typeof valores === 'object'`, porque eso
//      tambien da true para {}, null y las fechas.
//   3. Devuelve `valores.map(Number)` encadenado con
//      `.filter((numero) => Number.isFinite(numero))`, que descarta NaN e Infinity.
//   Resultado esperado: soloNumerosValidos(['6.5', 'hola', 4]) -> [6.5, 4]
//   (aprox. 6 lineas)

// ============================================================
// 3. SUMA CON PARAMETROS REST
// ------------------------------------------------------------
// El REST (...) recoge TODOS los argumentos sueltos en un array real.
// Es lo contrario del spread: rest EMPAQUETA, spread DESEMPAQUETA.
//
//   sumar(1, 2, 3)        -> numeros vale [1, 2, 3]
//   sumar(...[1, 2, 3])   -> exactamente lo mismo
//
// ✅ BUENA PRACTICA: el parametro rest debe ser SIEMPRE el ultimo.
// `function mal(...items, ultimo)` es un error de sintaxis.
// ============================================================

// TODO (en clase):
//   1. Exporta `sumar(...numeros)`.
//   2. Devuelve `soloNumerosValidos(numeros).reduce((acumulado, actual) => acumulado + actual, 0)`.
//      Insiste en el 0 final: es el valor inicial del acumulador y sin el
//      sumar() sin argumentos lanzaria un error en lugar de devolver 0.
//   Resultado esperado: sumar(1, 2, 3) -> 6 ; sumar() -> 0
//   (aprox. 3 lineas)

// ============================================================
// 4. PROMEDIO (se exportara con OTRO nombre al final del archivo)
// ------------------------------------------------------------
// Aqui la funcion se llama `calcularPromedio`, pero la exportaremos
// como `promedio`. Sirve para ensenar que el nombre interno y el
// nombre publico de un modulo pueden ser distintos.
// ============================================================

// TODO (en clase):
//   1. Declara `function calcularPromedio(numeros)` SIN export.
//   2. Limpia con soloNumerosValidos y, si el array queda vacio, devuelve 0:
//      asi evitamos dividir entre cero (que en JavaScript da NaN, no un error).
//   3. Devuelve `sumar(...validos) / validos.length`. Senala el spread al
//      llamar a sumar: convertimos el array en argumentos sueltos.
//   (aprox. 6 lineas)

// ============================================================
// 5. MEDIANA
// ------------------------------------------------------------
// La mediana es el valor que queda justo en el medio al ordenar los
// datos. A diferencia del promedio, no se deja arrastrar por un valor
// extremo: si un estudiante saca un 1,0, el promedio cae mucho pero
// la mediana casi no se mueve.
// ============================================================

// TODO (en clase):
//   1. Exporta `mediana(numeros)`. Limpia y devuelve 0 si no hay datos.
//   2. Ordena una COPIA: `const ordenados = [...validos].sort((a, b) => a - b);`
//      ⚠️ ERROR COMUN doble: (a) usar sort() sin funcion comparadora, que
//      ordena como TEXTO ([10, 9, 100].sort() da [10, 100, 9]); (b) olvidar
//      el [...] y mutar el array original, porque sort() muta.
//   3. `const medio = Math.floor(ordenados.length / 2);`
//   4. Si la cantidad es impar devuelve ordenados[medio]; si es par,
//      el promedio de los dos centrales.
//   Resultado esperado: mediana([1, 2, 3, 4]) -> 2.5 ; mediana([3, 1, 2]) -> 2
//   (aprox. 10 lineas)

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

// TODO (en clase):
//   Exporta dos funciones gemelas, `minimo(numeros)` y `maximo(numeros)`:
//   limpian con soloNumerosValidos, devuelven 0 si no hay datos y si no
//   `Math.min(...validos)` / `Math.max(...validos)`.
//   (aprox. 10 lineas las dos)

// ============================================================
// 7. DESVIACION ESTANDAR (poblacional)
// ------------------------------------------------------------
// Mide cuanto se separan los datos de su promedio. Si es baja, el
// curso es parejo; si es alta, hay mucha diferencia entre estudiantes.
// Formula: raiz cuadrada del promedio de las diferencias al cuadrado.
// ============================================================

// TODO (en clase):
//   1. Exporta `desviacionEstandar(numeros)`. Limpia y devuelve 0 si vacio.
//   2. `const media = calcularPromedio(validos);`
//   3. `const diferenciasAlCuadrado = validos.map((numero) => (numero - media) ** 2);`
//      Aprovecha para presentar el operador de potencia ** (ES2016).
//   4. Devuelve `Math.sqrt(calcularPromedio(diferenciasAlCuadrado))`.
//   (aprox. 7 lineas)

// ============================================================
// 8. REDONDEO CON DECIMALES CONTROLADOS
// ------------------------------------------------------------
// Math.round solo redondea a entero. Para 2 decimales multiplicamos,
// redondeamos y volvemos a dividir.
//
// ⚠️ ERROR COMUN: esperar precision infinita con decimales.
// 0.1 + 0.2 no da exactamente 0.3 (da 0.30000000000000004) porque los
// numeros se guardan en binario. Para dinero de verdad se trabaja en
// centavos con enteros, o con librerias especializadas.
// ============================================================

// TODO (en clase):
//   1. Exporta `redondear(numero, decimales = 2)`.
//   2. Guarda temprana con Number.isFinite; devuelve 0 si no lo es.
//   3. Si `!Number.isInteger(decimales) || decimales < 0`, fuerza decimales = 2.
//      Comenta que Number.isInteger NO convierte tipos: Number.isInteger('4')
//      es false, mientras que el viejo isNaN('4') dependia de conversiones
//      implicitas y confundia a todo el mundo.
//   4. `const factor = 10 ** decimales;` y devuelve `Math.round(valor * factor) / factor`.
//   Resultado esperado: redondear(6.4567) -> 6.46 ; redondear(6.4567, 1) -> 6.5
//   (aprox. 8 lineas)

// ============================================================
// 9. LIMITAR UN VALOR A UN RANGO
// ------------------------------------------------------------
// Muy util para barras de progreso: nunca menos de 0, nunca mas de 100.
// ============================================================

// TODO (en clase):
//   Exporta `limitar(valor, minimoPermitido = 0, maximoPermitido = 100)`:
//   convierte a numero, devuelve minimoPermitido si no es finito y si no
//   `Math.min(Math.max(numero, minimoPermitido), maximoPermitido)`.
//   Resultado esperado: limitar(150) -> 100 ; limitar(-5) -> 0
//   (aprox. 5 lineas)

// ============================================================
// 10. PORCENTAJE
// ============================================================

// TODO (en clase):
//   Exporta `porcentaje(parte, total)`: convierte los dos a numero, y si
//   alguno no es finito o el total es 0 devuelve 0. Si no, devuelve
//   `redondear((p / t) * 100, 1)`.
//   Resultado esperado: porcentaje(3, 4) -> 75 ; porcentaje(1, 3) -> 33.3
//   (aprox. 6 lineas)

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

// TODO (en clase):
//   1. Exporta `resumenEstadistico(numeros, { minimoAprobacion = NOTA_APROBACION } = {})`.
//   2. Limpia con soloNumerosValidos. Si NO hay datos, devuelve un objeto
//      con LA MISMA FORMA pero a cero, para que quien lo use no tenga que
//      comprobar si existe cada propiedad. Las claves son, en este orden:
//        cantidad, suma, promedio, mediana, minimo, maximo, rango,
//        desviacion, aprobados, reprobados, porcentajeAprobacion,
//        primera (null), ultima (null), hayDatos (false)
//      ✅ BUENA PRACTICA que hay que enunciar: formas de objeto consistentes.
//   3. Si hay datos, cuenta `const aprobados = datos.filter((nota) => nota >= minimoAprobacion).length;`
//      y devuelve el mismo objeto relleno, redondeando suma, promedio,
//      mediana, rango y desviacion con redondear(); primera: datos.at(0),
//      ultima: datos.at(-1), hayDatos: true.
//   Resultado esperado con [6.5, 4.8, 3.2, 7.0, 5.5, 2.9, 6.1, 4.0]:
//      cantidad 8, promedio 5, mediana 5.15, aprobados 6, reprobados 2,
//      porcentajeAprobacion 75, ultima 4
//   (aprox. 45 lineas)

// ============================================================
// 12. CONVERTIR TEXTO LIBRE EN UN ARRAY DE NUMEROS
// ------------------------------------------------------------
// El textarea de la pagina (id="entrada-notas") recibe algo como
// "6,5 5.8; 4  7". Aceptamos comas, punto y coma, espacios y saltos de
// linea como separadores.
// ============================================================

// TODO (en clase):
//   1. Exporta `extraerNumeros(texto)`. Si no es un string devuelve [].
//   2. Encadena: `.split(/[\s;,]+/)` para cortar por cualquier combinacion
//      de separadores, `.map((trozo) => trozo.trim())`, `.filter(Boolean)`
//      para quitar los trozos vacios (truco corto y legible: "quitame lo
//      falsy"), `.map(Number)` y `.filter((numero) => Number.isFinite(numero))`.
//   Resultado esperado: extraerNumeros('6.5, 4.8; 3.2  7') -> [6.5, 4.8, 3.2, 7]
//   (aprox. 10 lineas)

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

// TODO (en clase):
//   Escribe la lista de exportacion final con renombrado:
//     export {
//       calcularPromedio as promedio,
//       soloNumerosValidos as limpiarNumeros,
//     };
//   Comprueba en la consola del navegador que `matematicas.calcularPromedio`
//   es undefined pero `matematicas.promedio` existe: el nombre interno
//   NO sale del modulo.
//   (aprox. 4 lineas)

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
