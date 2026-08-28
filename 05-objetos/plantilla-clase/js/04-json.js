/**
 * ============================================================================
 * ARCHIVO: js/04-json.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * QUE ENSEÑA ESTE ARCHIVO:
 *   1. Qué es JSON y en qué se diferencia de un objeto de JavaScript.
 *   2. JSON.stringify(): objeto -> texto. Indentación y "replacer".
 *   3. JSON.parse(): texto -> objeto. El "reviver".
 *   4. Qué se PIERDE al convertir a JSON.
 *   5. Los errores típicos con JSON (y cómo protegerse con try/catch).
 *   6. Guardar y recuperar datos con localStorage (caso real).
 *
 * AL TERMINAR DEBERIAS SABER:
 *   Convertir datos a texto para enviarlos o guardarlos, y volver a
 *   convertirlos en objetos sin sustos.
 *
 * POR QUE IMPORTA: absolutamente todas las APIs con las que trabajarás en
 * front end hablan JSON. Es el idioma común entre el navegador y el servidor.
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE: los objetos y los textos de ejemplo ya están escritos;
 * lo que se teclea en vivo son las llamadas a JSON.stringify / JSON.parse.
 * La solución completa está en ../../js/04-json.js
 * ============================================================================
 */

(function () {
  // ANDAMIAJE (ya hecho): consola visual conectada al <pre id="salida-04">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-04');

  // DATOS DE PARTIDA (ya escritos, no se teclean en clase).

  // Se usa en la sección 1: un objeto de JavaScript corriente.
  const objetoJs = {
    id: 17,                    // clave sin comillas: válido en JS
    nombre: 'Lucía',           // comillas simples: válidas en JS
    activo: true,
    promedio: 8.25,
    tutor: null,
  };

  // Se usa en la sección 2: incluye un dato sensible que hay que filtrar.
  const inscripcion = {
    id: 'INS-2026-004',
    estudiante: {
      nombre: 'Martín',
      apellido: 'Rodríguez',
      contrasena: 'sup3rs3cr3ta',   // dato sensible: no debería salir nunca
      email: 'martin@example.com',
    },
    curso: 'Full Stack 2',
    notas: [7, 9.5, 8],
  };

  // Se usa en la sección 4: texto JSON tal como llegaría de un servidor.
  const textoDelServidor = `{
    "id": 21,
    "nombre": "Sofía",
    "activo": true,
    "notas": [9.4, 8.8, 10],
    "contacto": { "email": "sofia@example.com" },
    "alta": "2026-03-01T09:30:00.000Z"
  }`;

  // ==========================================================================
  // 1. QUE ES JSON
  // ==========================================================================
  /*
   * JSON = JavaScript Object Notation.
   * Es un FORMATO DE TEXTO para representar datos. Nació inspirado en la
   * sintaxis de los objetos de JavaScript, pero NO es JavaScript: es texto
   * plano que cualquier lenguaje (Java, Python, PHP...) sabe leer.
   *
   * Analogía: el objeto es un mueble armado; el JSON es ese mueble desmontado
   * y metido en una caja plana para poder transportarlo.
   *
   * REGLAS DE JSON (más estrictas que las de un objeto JS):
   *   - Las CLAVES van SIEMPRE entre comillas dobles.
   *   - Las cadenas van entre comillas DOBLES, nunca simples.
   *   - Valores permitidos: string, number, boolean, null, objeto y array.
   *   - NO admite: funciones, undefined, comentarios, ni coma final sobrante.
   */

  // TODO (en clase):
  //   1. titulo('1. Objeto de JavaScript vs texto JSON').
  //   2. `const textoJson = JSON.stringify(objetoJs);`
  //   3. Imprime `typeof objetoJs` -> "object" y `typeof textoJson` -> "string".
  //   4. Imprime el propio `textoJson` y su `.length` con la etiqueta
  //      'Longitud del texto ->' ... 'caracteres'.
  //   5. Demuestra que ES texto usando métodos de string sobre él:
  //      `textoJson.includes('Lucía')` -> true y `textoJson.toUpperCase()`.
  //   Resultado esperado en pantalla: "object", "string",
  //   {"id":17,"nombre":"Lucía","activo":true,"promedio":8.25,"tutor":null},
  //   la longitud, true y el mismo texto en mayúsculas
  //   (aprox. 7 lineas)

  // ⚠️ ERROR COMÚN: llamar "un JSON" a un objeto de JavaScript.
  // Si no es texto, no es JSON. Un objeto es un objeto.

  // ==========================================================================
  // 2. JSON.stringify(): DE OBJETO A TEXTO
  // ==========================================================================
  /*
   * JSON.stringify(valor, replacer, espacios)
   *   valor    -> lo que queremos convertir.
   *   replacer -> (opcional) filtro: un array de claves o una función.
   *   espacios -> (opcional) indentación para que el texto sea legible.
   */

  // TODO (en clase):
  //   1. titulo('2. JSON.stringify() con indentación y replacer').
  //   2. Imprime `JSON.stringify(inscripcion)` (compacto: ideal para ENVIAR).
  //   3. Imprime 'Formateado con 2 espacios ->\n' + JSON.stringify(inscripcion, null, 2)
  //      (ideal para LEER y depurar).
  //   4. Imprime la versión indentada con un TEXTO en vez de un número:
  //      JSON.stringify(inscripcion, null, '--').
  //   5. REPLACER como ARRAY (lista blanca): guarda en `soloLoPublico`
  //      JSON.stringify(inscripcion, ['id', 'curso', 'estudiante', 'nombre'], 2)
  //      e imprímelo.
  //   6. REPLACER como FUNCION: guarda en `sinDatosSensibles`
  //      JSON.stringify(inscripcion, (clave, valor) => { ... }, 2) donde la función:
  //        - si clave === 'contrasena' devuelve undefined  (elimina la clave)
  //        - si typeof valor === 'number' devuelve Math.round(valor)
  //        - en cualquier otro caso devuelve valor
  //      Imprímelo.
  //   7. MÉTODO toJSON(): declara
  //        const evaluacion = { asignatura: 'JavaScript', nota: 9.4,
  //          fecha: new Date('2026-06-10T12:00:00Z'),
  //          toJSON() { return { asignatura: this.asignatura, nota: this.nota,
  //                              fecha: this.fecha.toISOString().slice(0, 10) }; } };
  //      Imprime `JSON.stringify(evaluacion)`.
  //   Resultado esperado en pantalla: el JSON compacto, el indentado, el indentado
  //   con guiones, la lista blanca sin contrasena ni notas, la versión sin contrasena
  //   con las notas redondeadas, y {"asignatura":"JavaScript","nota":9.4,"fecha":"2026-06-10"}
  //   (aprox. 24 lineas)

  // ✅ BUENA PRÁCTICA: cuando quieras inspeccionar un objeto en la consola
  // visual, usa JSON.stringify(objeto, null, 2).
  // Devolver undefined dentro del replacer ELIMINA esa clave del resultado.

  // ==========================================================================
  // 3. QUE SE PIERDE AL CONVERTIR A JSON
  // ==========================================================================
  /*
   * JSON solo entiende datos, no comportamiento. Todo lo que no encaja en sus
   * reglas desaparece o se transforma. Conviene conocer la lista de memoria.
   */

  // TODO (en clase):
  //   1. titulo('3. Lo que JSON no sabe representar').
  //   2. Declara `const objetoCompleto = { ... }` con un caso de cada tipo:
  //        texto: 'hola', numero: 42, booleano: true, nulo: null,
  //        indefinido: undefined,                    // desaparece
  //        funcion: function () { return 1; },       // desaparece
  //        fecha: new Date('2026-01-15T00:00:00Z'),  // se convierte en string
  //        noEsUnNumero: NaN,                        // se convierte en null
  //        infinito: Infinity,                       // se convierte en null
  //        conjunto: new Set([1, 2, 3]),             // se convierte en {}
  //        mapa: new Map([['a', 1]])                 // se convierte en {}
  //   3. Imprime 'Resultado ->\n' + JSON.stringify(objetoCompleto, null, 2).
  //   4. Imprime `JSON.stringify([1, undefined, function () {}, 4])`:
  //      en un ARRAY no desaparecen, se vuelven null -> [1,null,null,4]
  //   5. BigInt: dentro de try/catch llama a
  //      `JSON.stringify({ identificador: 9007199254740993n })` e imprime
  //      error.name + ': ' + error.message -> TypeError, tumba la conversión entera.
  //   6. Solución: repite el stringify pasando un replacer que haga
  //      `typeof valor === 'bigint' ? valor.toString() : valor` e imprímelo.
  //   Resultado esperado en pantalla: el JSON sin indefinido ni funcion, con la
  //   fecha como texto, null en NaN e Infinity y {} en conjunto y mapa;
  //   [1,null,null,4]; el TypeError; y {"identificador":"9007199254740993"}
  //   (aprox. 22 lineas)

  // Fíjate en el detalle más engañoso de la lista: `conjunto` y `mapa` NO
  // desaparecen, salen como {} (un objeto vacío). Es peor que perderlos, porque
  // parece que se guardó algo y en realidad no hay nada dentro.

  // ⚠️ ERROR COMÚN: guardar una fecha en JSON y esperar recuperar un Date.
  // Lo que vuelve es un string; hay que reconstruirlo con new Date(...).

  // ==========================================================================
  // 4. JSON.parse(): DE TEXTO A OBJETO
  // ==========================================================================
  /*
   * JSON.parse(texto, reviver) hace el camino contrario: lee el texto y
   * construye un objeto NUEVO en memoria.
   */

  // TODO (en clase):
  //   1. titulo('4. JSON.parse()').
  //   2. `const estudianteRecuperado = JSON.parse(textoDelServidor);`
  //      (el texto ya está declarado arriba, en los datos de partida).
  //   3. Imprime `typeof estudianteRecuperado` -> "object",
  //      `estudianteRecuperado.contacto.email`, `estudianteRecuperado.notas[0]`
  //      y `Array.isArray(estudianteRecuperado.notas)` -> true.
  //   4. Imprime `typeof estudianteRecuperado.alta` -> "string": la fecha llegó como texto.
  //   5. REVIVER: `const conFechasReales = JSON.parse(textoDelServidor, (clave, valor) => {...})`
  //      donde la función devuelve `new Date(valor)` si
  //      `typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor)`, y `valor` si no.
  //   6. Imprime si `conFechasReales.alta instanceof Date` ('un Date' / 'un string')
  //      y `conFechasReales.alta.getFullYear()` -> 2026.
  //   Resultado esperado en pantalla: "object", "sofia@example.com", 9.4, true,
  //   "string", "un Date" y 2026
  //   (aprox. 14 lineas)

  // ==========================================================================
  // 5. ERRORES TIPICOS CON JSON
  // ==========================================================================
  /*
   * JSON.parse es MUY estricto: si el texto no cumple las reglas al 100%,
   * lanza un SyntaxError y detiene el programa.
   *
   * ✅ BUENA PRÁCTICA: envolver SIEMPRE JSON.parse en try/catch cuando el
   * texto viene de fuera (un servidor, localStorage, un archivo...).
   */

  // TODO (en clase):
  //   1. titulo('5. Errores típicos con JSON').
  //   2. Escribe la función de defensa:
  //        function parsearSeguro(texto, respaldo = null) {
  //          try { return JSON.parse(texto); }
  //          catch (error) { imprimir('   [fallo] ' + error.name + ': ' + error.message);
  //                          return respaldo; }
  //        }
  //   3. Pruébala con los seis casos, imprimiendo antes la etiqueta de cada uno:
  //        a) "{'nombre': 'Lucía'}"                       -> comillas simples
  //        b) '{"nombre": "Lucía", "edad": 21,}'          -> coma de más
  //        c) '{nombre: "Lucía"}'                         -> claves sin comillas
  //        d) parsearSeguro(undefined, { vacio: true })   -> el servidor no devolvió nada
  //        e) '<!DOCTYPE html><html><body>404</body></html>' con respaldo []
  //        f) '{"nombre": "Lucía", "edad": 21}'           -> este SÍ es válido: imprime el objeto
  //   4. Doble stringify: `const dobleTexto = JSON.stringify(JSON.stringify({ nombre: 'Lucía' }));`
  //      Imprímelo y luego `typeof JSON.parse(dobleTexto)` -> sigue siendo "string".
  //   5. Llama a `parsearSeguro({ nombre: 'Lucía' })`: pasarle un OBJETO lo convierte
  //      a "[object Object]" y falla.
  //   6. Referencia circular: `const nodoA = { nombre: 'A' };`
  //      `const nodoB = { nombre: 'B', anterior: nodoA };` `nodoA.siguiente = nodoB;`
  //      Dentro de try/catch, `JSON.stringify(nodoA)` e imprime error.name -> "TypeError".
  //   Resultado esperado en pantalla: cinco lineas [fallo] con su SyntaxError,
  //   el objeto válido del caso f, el doble texto escapado, "string" y "TypeError"
  //   (aprox. 26 lineas)

  // ⚠️ ERROR COMÚN: hacer stringify dos veces. El resultado es un texto con
  // comillas escapadas, y al parsear una vez seguimos teniendo texto.
  // ⚠️ ERROR COMÚN: pasar a JSON.parse algo que ya es un objeto.
  // ⚠️ ERROR COMÚN: intentar convertir a JSON un objeto con referencias
  // circulares (un objeto que se apunta a sí mismo).

  // ==========================================================================
  // 6. CASO REAL: GUARDAR DATOS EN localStorage
  // ==========================================================================
  /*
   * localStorage solo guarda TEXTO. Por eso JSON es su compañero inseparable:
   *   - Para guardar:    localStorage.setItem(clave, JSON.stringify(objeto))
   *   - Para recuperar:  JSON.parse(localStorage.getItem(clave))
   *
   * Envolvemos todo en try/catch porque en algunos navegadores, abriendo el
   * archivo con doble clic (file://) o en modo incógnito, localStorage puede
   * estar bloqueado.
   */

  // TODO (en clase):
  //   1. titulo('6. JSON + localStorage (caso real)').
  //   2. Declara `const preferencias = { tema: 'oscuro', tamanoFuente: 17, mostrarAyuda: true };`
  //   3. Abre un try { ... } catch (error) { imprimir('localStorage no disponible ->',
  //      error.message); }  y dentro del try:
  //        a) GUARDAR: localStorage.setItem('fs2-preferencias', JSON.stringify(preferencias));
  //        b) RECUPERAR: `const guardado = localStorage.getItem('fs2-preferencias');`
  //           e imprímelo con la etiqueta 'Lo que hay en localStorage (texto) ->'.
  //        c) `const recuperadas = JSON.parse(guardado ?? '{}');` e imprímelo.
  //           (getItem devuelve null si la clave no existe: por eso el ?? '{}').
  //        d) Imprime `recuperadas.tamanoFuente + 1` -> 18, es un número de verdad.
  //        e) Limpia con localStorage.removeItem('fs2-preferencias').
  //   Resultado esperado en pantalla: el texto guardado, el objeto recuperado y 18
  //   (o el aviso de localStorage no disponible si se abre con file://)
  //   (aprox. 14 lineas)

  // ==========================================================================
  // EJERCICIOS PROPUESTOS (archivo 04)
  // ==========================================================================
  /*
   * 1) Crea un objeto `pedido` con al menos un objeto anidado y un array.
   *    Imprímelo en la consola visual con JSON.stringify(pedido, null, 2).
   *
   * 2) Usa un replacer con forma de ARRAY para generar un JSON que contenga
   *    únicamente las claves "id", "cliente" y "total".
   *
   * 3) Escribe un replacer con forma de FUNCION que oculte cualquier clave
   *    llamada "contrasena", "dni" o "tarjeta" sustituyendo su valor por
   *    "***" en lugar de eliminarla.
   *
   * 4) Escribe `parsearSeguro(texto, respaldo)` por tu cuenta (sin mirar) y
   *    pruébala con cinco cadenas mal formadas distintas.
   *
   * 5) Añade a un objeto un método `toJSON()` que devuelva solo los campos
   *    públicos, y comprueba que JSON.stringify lo respeta.
   *
   * 6) (Reto) Escribe `guardarEnLocal(clave, valor)` y `leerDeLocal(clave,
   *    respaldo)` que hagan stringify/parse y controlen los errores con
   *    try/catch.
   */
})();
