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

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Los DATOS de partida (CONFIGURACION y MONEDAS) ya vienen escritos:
   teclear un diccionario de cinco monedas en clase es tiempo perdido.
   Lo que se escribe en vivo es la LOGICA que los usa.

   Al terminar, este archivo debe exportar:
     - por defecto: formatearMoneda
     - nombradas: CONFIGURACION, MONEDAS, formatearMoneda, formatearNumero,
       formatearPorcentaje, aFecha, formatearFecha, fechaRelativa,
       capitalizar, aTitulo, limpiarSeparadores, normalizarEntrada,
       codigoDeFactura, alinear, truncar, aUrlAmigable,
       destacar, dinero, seguroHTML

   Tiempo estimado: 25 minutos.
   ============================================================ */

// TODO (en clase):
//   Antes de nada, deja la marca de evaluacion del modulo, fuera de
//   cualquier funcion:
//     console.log('[formato.js] Modulo evaluado.');
//   (aprox. 1 linea)

// ============================================================
// 1. CONFIGURACION POR DEFECTO
// ------------------------------------------------------------
// Un objeto de configuracion exportado permite que la aplicacion lo
// consulte, y que en clase cambiemos el idioma en caliente.
//
// NOTA DE LA PLANTILLA: esta seccion son DATOS, no logica. Viene
// escrita para no perder tiempo copiandola en la pizarra.
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

// TODO (en clase):
//   1. Declara `function formatearMoneda(valor, { moneda = CONFIGURACION.monedaPorDefecto, idioma } = {})`.
//      OJO: SIN la palabra `export` delante. Se exportara al final del
//      archivo, en la seccion 7, y ahi se vera por que.
//   2. Convierte con `const numero = Number(valor);` y pon una guarda
//      temprana: si `!Number.isFinite(numero)` devuelve 'Valor no numerico'.
//   3. Busca `const informacion = MONEDAS[moneda];` y calcula el idioma con
//      fusion nula encadenada:
//        const idiomaFinal = idioma ?? informacion?.idioma ?? CONFIGURACION.idiomaPorDefecto;
//      Comenta las dos cosas: el ?. (por si la moneda no existe) y el ??
//      (se queda con el PRIMER valor que no sea null ni undefined; un 0
//      o una cadena vacia SI se aceptarian, a diferencia de ||).
//   4. Dentro de un try devuelve
//        new Intl.NumberFormat(idiomaFinal, { style: 'currency', currency: moneda }).format(numero)
//      y en el catch degrada con elegancia: `${numero.toFixed(2)} ${moneda}`.
//      (Intl lanza RangeError si el codigo de moneda no es valido.)
//   Resultado esperado: formatearMoneda(149990) -> "$149.990"
//                       formatearMoneda(1500, { moneda: 'EUR' }) -> "1.500,00 €"
//                       formatearMoneda('hola') -> "Valor no numerico"
//   (aprox. 18 lineas)

// ============================================================
// 3. FORMATEAR NUMEROS Y PORCENTAJES
// ============================================================

// TODO (en clase):
//   1. Exporta `formatearNumero(valor, { idioma = CONFIGURACION.idiomaPorDefecto, decimales = 0 } = {})`.
//      Guarda temprana igual que antes y devuelve un Intl.NumberFormat con
//      minimumFractionDigits y maximumFractionDigits a `decimales`.
//      Resultado esperado: formatearNumero(1234567) -> "1.234.567"
//   2. Exporta `formatearPorcentaje(proporcion, { idioma = CONFIGURACION.idiomaPorDefecto, decimales = 1 } = {})`
//      con `style: 'percent'`.
//      ⚠️ ERROR COMUN: pasarle 73.4 esperando "73,4 %". Intl espera la
//      PROPORCION: formatearPorcentaje(0.734) -> "73,4 %"
//   (aprox. 20 lineas)

// ============================================================
// 4. FECHAS
// ------------------------------------------------------------
// ⚠️ ERROR COMUN con los <input type="date">: devuelven "2026-03-15".
// Si escribimos new Date('2026-03-15') el navegador lo interpreta como
// medianoche UTC y, en husos horarios al oeste, muestra el DIA ANTERIOR.
// La solucion segura es construir la fecha por partes: new Date(a, m-1, d).
// ============================================================

// TODO (en clase):
//   1. Exporta `aFecha(entrada)`, que convierte con seguridad cualquier
//      entrada en un Date valido o en null:
//        - Si ya es Date: devuelve null cuando Number.isNaN(entrada.getTime()),
//          porque un Date invalido existe (new Date('hola')).
//        - Si es string: `entrada.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)`.
//          ⚠️ ERROR COMUN: hacer entrada.match(...)[1] sin comprobar que
//          match() no devolvio null ("Cannot read properties of null").
//          Si hay coincidencia, desestructura saltando el primer elemento:
//            const [, anio, mes, dia] = partes;
//          y construye `new Date(Number(anio), Number(mes) - 1, Number(dia))`.
//          Recuerda en voz alta: los meses van de 0 a 11, enero es 0.
//          Si no coincide el patron, intenta un new Date(entrada) generico.
//        - Si es number: new Date(entrada), validando igual.
//        - En cualquier otro caso: null.
//   2. Exporta `formatearFecha(entrada, { estilo = 'largo', idioma = CONFIGURACION.idiomaPorDefecto } = {})`.
//      Usa aFecha() y devuelve 'Fecha no valida' si sale null. Define un
//      objeto `opciones` que haga de menu (mucho mas legible que una
//      escalera de if/else) con estas cinco entradas exactas:
//        largo:     { day: 'numeric', month: 'long', year: 'numeric' }
//        corto:     { day: '2-digit', month: 'short', year: 'numeric' }
//        numerico:  { day: '2-digit', month: '2-digit', year: 'numeric' }
//        conHora:   { dateStyle: 'medium', timeStyle: 'short' }
//        diaSemana: { weekday: 'long', day: 'numeric', month: 'long' }
//      Elige con `opciones[estilo] ?? opciones.largo` y devuelve un
//      Intl.DateTimeFormat.
//      Resultado esperado: formatearFecha('2026-03-15') -> "15 de marzo de 2026"
//   3. Exporta `fechaRelativa(entrada, { idioma = CONFIGURACION.idiomaPorDefecto, referencia = new Date() } = {})`.
//      Crea `new Intl.RelativeTimeFormat(idioma, { numeric: 'auto' })`,
//      calcula la diferencia en segundos (positiva = futuro), recorre con
//      for...of una tabla de unidades de mayor a menor
//        year 31_536_000 | month 2_592_000 | week 604_800 | day 86_400 | hour 3_600 | minute 60
//      desestructurando CON RENOMBRADO `{ nombre, segundos: tamano }` para no
//      chocar con la variable `segundos`, y devuelve la primera unidad en la
//      que Math.abs(segundos) >= tamano. Si no, formatea en 'second'.
//      Resultado esperado: "en 3 dias", "hace 2 meses".
//   (aprox. 65 lineas entre las tres funciones)

// ============================================================
// 5. UTILIDADES DE TEXTO CON METODOS MODERNOS DE STRING
// ============================================================

// TODO (en clase):
//   1. Exporta `capitalizar(texto)`: normaliza con `String(texto ?? '').trim()`,
//      devuelve '' si esta vacio y si no `cadena.at(0).toUpperCase() + cadena.slice(1).toLowerCase()`.
//      Usa at(0), no charAt(0). Resultado: capitalizar('ana') -> "Ana"
//   2. Exporta `aTitulo(texto)`: split(' ') + filter(Boolean) + map(capitalizar) + join(' ').
//      Resultado: aTitulo('maria jose perez') -> "Maria Jose Perez"
//   3. Exporta `limpiarSeparadores(texto)`: replaceAll('_', ' '), replaceAll('-', ' '),
//      replaceAll(/\s{2,}/g, ' ') y trim().
//      ⚠️ ERROR COMUN: rematar con .replaceAll('  ', ' ') creyendo que eso
//      colapsa CUALQUIER racha de espacios. No lo hace: solo sustituye pares
//      exactos, asi que tres espacios se quedan en dos. Para rachas de
//      longitud variable hace falta una regex con /g.
//   4. Exporta `normalizarEntrada(texto)`: trimStart() y trimEnd() encadenados.
//      Se usan para conservar la sangria de un lado y limpiar el otro.
//   5. Exporta `codigoDeFactura(numero, { prefijo = 'FAC', largo = 6 } = {})`:
//      String(numero).padStart(largo, '0') dentro de `${prefijo}-${relleno}`.
//      Resultado: codigoDeFactura(42) -> "FAC-000042"
//   6. Exporta `alinear(texto, ancho = 24, relleno = '.')` -> String(texto).padEnd(ancho, relleno).
//      La usa reporte-avanzado.js para alinear columnas, no la olvides.
//   7. Exporta `truncar(texto, maximo = 60)`: si cabe, tal cual; si no,
//      slice(0, maximo - 1).trimEnd() + '…' (restamos 1 porque … ocupa una posicion).
//   8. Exporta `aUrlAmigable(texto)`: toLowerCase(), normalize('NFD'),
//      replaceAll(/[\u0300-\u036f]/g, '') para quitar las tildes ya separadas,
//      replaceAll(/[^a-z0-9\s-]/g, ''), trim() y replaceAll(/\s+/g, '-').
//      ⚠️ ERROR COMUN: replaceAll con expresion regular EXIGE la bandera /g;
//      sin ella lanza un TypeError.
//      Resultado: aUrlAmigable('Clase 10: Modulos') -> "clase-10-modulos"
//   (aprox. 45 lineas entre las ocho funciones)

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

// TODO (en clase):
//   Las tres funciones tienen la MISMA firma: (trozos, ...valores), y las
//   tres se resuelven con un reduce sobre `trozos` que va intercalando los
//   valores. Recuerda que hay siempre UN trozo mas que valores.
//   1. Exporta `destacar(trozos, ...valores)`: rodea cada valor interpolado
//      con comillas angulares « ». Si ya no quedan valores, no anade nada.
//      Resultado: destacar`La nota de ${'Ana'} es ${6.4}.`
//                 -> "La nota de «Ana» es «6.4»."
//   2. Exporta `dinero(trozos, ...valores)`: formatea con formatearMoneda()
//      SOLO los valores que sean `typeof valor === 'number'`; el resto se
//      deja con String(valor).
//      Resultado: dinero`Subtotal: ${24990}` -> "Subtotal: $24.990"
//   3. Exporta `seguroHTML(trozos, ...valores)`: define dentro una funcion
//      flecha `escapar` que haga replaceAll de & < > " ' por &amp; &lt;
//      &gt; &quot; &#39;. El & va PRIMERO o romperia a los demas.
//      ✅ BUENA PRACTICA: si alguna vez insertas texto de un usuario con
//      innerHTML, escapalo antes. Si el usuario escribe
//        <img src=x onerror="alert('robado')">
//      y lo insertas sin escapar, ese codigo se ejecuta. Eso es un XSS.
//   (aprox. 30 lineas entre las tres)

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

// TODO (en clase):
//   1. Escribe `export default formatearMoneda;`
//   2. Y en la linea siguiente `export { formatearMoneda };`
//      Un mismo valor puede salir por las DOS puertas sin ningun problema:
//      quien quiera la importa sin llaves y con el nombre que prefiera, y
//      quien quiera la importa con llaves y su nombre exacto.
//   (aprox. 2 lineas)

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
