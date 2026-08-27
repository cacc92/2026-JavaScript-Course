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
 * ============================================================================
 */

(function () {
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-04');

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
  titulo('1. Objeto de JavaScript vs texto JSON');

  const objetoJs = {
    id: 17,                    // clave sin comillas: válido en JS
    nombre: 'Lucía',           // comillas simples: válidas en JS
    activo: true,
    promedio: 8.25,
    tutor: null,
  };

  const textoJson = JSON.stringify(objetoJs);

  imprimir('Es un objeto ->', typeof objetoJs);   // "object"
  imprimir('Es texto JSON ->', typeof textoJson); // "string"
  imprimir('Contenido del texto ->', textoJson);
  imprimir('Longitud del texto ->', textoJson.length, 'caracteres');

  // Demostración de que de verdad es texto: podemos usar métodos de string.
  imprimir('¿Contiene "Lucía"? ->', textoJson.includes('Lucía'));
  imprimir('En mayúsculas ->', textoJson.toUpperCase());

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
  titulo('2. JSON.stringify() con indentación y replacer');

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

  // Sin indentación: compacto, ideal para ENVIAR por la red (pesa menos).
  imprimir('Compacto ->', JSON.stringify(inscripcion));

  // Con indentación de 2 espacios: ideal para LEER y depurar.
  // ✅ BUENA PRÁCTICA: cuando quieras inspeccionar un objeto en la consola
  // visual, usa JSON.stringify(objeto, null, 2).
  imprimir('Formateado con 2 espacios ->\n' + JSON.stringify(inscripcion, null, 2));

  // También se puede indentar con un texto en vez de un número.
  imprimir('Indentado con guiones ->\n' + JSON.stringify(inscripcion, null, '--'));

  // REPLACER como ARRAY: lista blanca de claves que queremos conservar.
  const soloLoPublico = JSON.stringify(inscripcion, ['id', 'curso', 'estudiante', 'nombre'], 2);
  imprimir('Replacer con array (lista blanca) ->\n' + soloLoPublico);

  // REPLACER como FUNCION: se ejecuta para cada par clave/valor.
  // Devolver undefined ELIMINA esa clave del resultado.
  const sinDatosSensibles = JSON.stringify(
    inscripcion,
    (clave, valor) => {
      if (clave === 'contrasena') return undefined; // se elimina
      if (typeof valor === 'number') return Math.round(valor); // se transforma
      return valor; // el resto pasa tal cual
    },
    2
  );
  imprimir('Replacer con función ->\n' + sinDatosSensibles);

  // MÉTODO toJSON(): si un objeto tiene este método, stringify lo usa.
  // Es la forma de decidir cómo se serializa una clase propia.
  const evaluacion = {
    asignatura: 'JavaScript',
    nota: 9.4,
    fecha: new Date('2026-06-10T12:00:00Z'),
    toJSON() {
      // Devolvemos una versión "aplanada" y controlada del objeto.
      return {
        asignatura: this.asignatura,
        nota: this.nota,
        fecha: this.fecha.toISOString().slice(0, 10), // solo AAAA-MM-DD
      };
    },
  };
  imprimir('Con toJSON() personalizado ->', JSON.stringify(evaluacion));

  // ==========================================================================
  // 3. QUE SE PIERDE AL CONVERTIR A JSON
  // ==========================================================================
  /*
   * JSON solo entiende datos, no comportamiento. Todo lo que no encaja en sus
   * reglas desaparece o se transforma. Conviene conocer la lista de memoria.
   */
  titulo('3. Lo que JSON no sabe representar');

  const objetoCompleto = {
    texto: 'hola',
    numero: 42,
    booleano: true,
    nulo: null,
    indefinido: undefined,             // desaparece
    funcion: function () { return 1; }, // desaparece
    fecha: new Date('2026-01-15T00:00:00Z'), // se convierte en string
    noEsUnNumero: NaN,                 // se convierte en null
    infinito: Infinity,                // se convierte en null
    conjunto: new Set([1, 2, 3]),      // se convierte en {}
    mapa: new Map([['a', 1]]),         // se convierte en {}
  };

  imprimir('Resultado ->\n' + JSON.stringify(objetoCompleto, null, 2));

  // Fíjate en el detalle más engañoso de la lista: `conjunto` y `mapa` NO
  // desaparecen, salen como {} (un objeto vacío). Es peor que perderlos, porque
  // parece que se guardó algo y en realidad no hay nada dentro.

  // En un ARRAY, undefined y las funciones no desaparecen: se vuelven null,
  // porque un array no puede tener huecos en JSON.
  imprimir('Array con undefined ->', JSON.stringify([1, undefined, function () {}, 4]));

  // ⚠️ ERROR COMÚN: guardar una fecha en JSON y esperar recuperar un Date.
  // Lo que vuelve es un string; hay que reconstruirlo con new Date(...).

  /*
   * CASO APARTE: BigInt (los números enteros gigantes que se escriben con una
   * `n` al final, como 9007199254740993n). No es que se pierda: JSON.stringify
   * LANZA un TypeError y tumba toda la conversión.
   * Lo aislamos en su propio try/catch, precisamente porque un solo BigInt
   * escondido dentro de un objeto grande basta para romper el stringify entero.
   */
  try {
    JSON.stringify({ identificador: 9007199254740993n });
  } catch (error) {
    imprimir('BigInt en JSON ->', error.name + ': ' + error.message);
  }
  // ✅ SOLUCIÓN: convertirlo a texto antes, con un replacer:
  imprimir(
    'BigInt convertido a texto ->',
    JSON.stringify({ identificador: 9007199254740993n }, (clave, valor) =>
      typeof valor === 'bigint' ? valor.toString() : valor
    )
  );

  // ==========================================================================
  // 4. JSON.parse(): DE TEXTO A OBJETO
  // ==========================================================================
  /*
   * JSON.parse(texto, reviver) hace el camino contrario: lee el texto y
   * construye un objeto NUEVO en memoria.
   */
  titulo('4. JSON.parse()');

  const textoDelServidor = `{
    "id": 21,
    "nombre": "Sofía",
    "activo": true,
    "notas": [9.4, 8.8, 10],
    "contacto": { "email": "sofia@example.com" },
    "alta": "2026-03-01T09:30:00.000Z"
  }`;

  const estudianteRecuperado = JSON.parse(textoDelServidor);

  imprimir('Ahora es un objeto ->', typeof estudianteRecuperado);
  imprimir('Acceso normal ->', estudianteRecuperado.contacto.email);
  imprimir('Primera nota ->', estudianteRecuperado.notas[0]);
  imprimir('El array es un array de verdad ->', Array.isArray(estudianteRecuperado.notas));

  // La fecha llegó como texto:
  imprimir('typeof alta ->', typeof estudianteRecuperado.alta); // "string"

  // REVIVER: función que se ejecuta para cada par al reconstruir. Sirve para
  // "revivir" tipos que JSON no soporta, como las fechas.
  const conFechasReales = JSON.parse(textoDelServidor, (clave, valor) => {
    // Detectamos el formato ISO con una expresión regular sencilla.
    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor)) {
      return new Date(valor);
    }
    return valor;
  });

  imprimir('Con reviver, alta es ->', conFechasReales.alta instanceof Date ? 'un Date' : 'un string');
  imprimir('Año de alta ->', conFechasReales.alta.getFullYear());

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
  titulo('5. Errores típicos con JSON');

  /**
   * parsearSeguro(): intenta parsear y, si falla, devuelve un valor de
   * respaldo en vez de romper la aplicación.
   */
  function parsearSeguro(texto, respaldo = null) {
    try {
      return JSON.parse(texto);
    } catch (error) {
      imprimir('   [fallo] ' + error.name + ': ' + error.message);
      return respaldo;
    }
  }

  imprimir('a) Comillas simples en vez de dobles:');
  parsearSeguro("{'nombre': 'Lucía'}");

  imprimir('b) Coma de más al final:');
  parsearSeguro('{"nombre": "Lucía", "edad": 21,}');

  imprimir('c) Claves sin comillas:');
  parsearSeguro('{nombre: "Lucía"}');

  imprimir('d) El servidor devolvió undefined o vacío:');
  parsearSeguro(undefined, { vacio: true });

  imprimir('e) El servidor devolvió HTML (página de error 404):');
  parsearSeguro('<!DOCTYPE html><html><body>404</body></html>', []);

  imprimir('f) Un texto que sí es válido:');
  imprimir('   ->', parsearSeguro('{"nombre": "Lucía", "edad": 21}'));

  // ⚠️ ERROR COMÚN: hacer stringify dos veces. El resultado es un texto con
  // comillas escapadas, y al parsear una vez seguimos teniendo texto.
  const dobleTexto = JSON.stringify(JSON.stringify({ nombre: 'Lucía' }));
  imprimir('Doble stringify ->', dobleTexto);
  imprimir('Al parsear una vez sigue siendo ->', typeof JSON.parse(dobleTexto));

  // ⚠️ ERROR COMÚN: pasar a JSON.parse algo que ya es un objeto.
  parsearSeguro({ nombre: 'Lucía' }); // se convierte a "[object Object]" y falla

  // ⚠️ ERROR COMÚN: intentar convertir a JSON un objeto con referencias
  // circulares (un objeto que se apunta a sí mismo).
  const nodoA = { nombre: 'A' };
  const nodoB = { nombre: 'B', anterior: nodoA };
  nodoA.siguiente = nodoB; // el bucle ya está montado
  try {
    JSON.stringify(nodoA);
  } catch (error) {
    imprimir('Referencia circular ->', error.name);
  }

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
  titulo('6. JSON + localStorage (caso real)');

  const preferencias = { tema: 'oscuro', tamanoFuente: 17, mostrarAyuda: true };

  try {
    // GUARDAR
    localStorage.setItem('fs2-preferencias', JSON.stringify(preferencias));

    // RECUPERAR
    const guardado = localStorage.getItem('fs2-preferencias');
    imprimir('Lo que hay en localStorage (texto) ->', guardado);

    // ⚠️ getItem devuelve null si la clave no existe: por eso el `?? "{}"`.
    const recuperadas = JSON.parse(guardado ?? '{}');
    imprimir('Recuperado como objeto ->', recuperadas);
    imprimir('Tamaño de fuente + 1 ->', recuperadas.tamanoFuente + 1); // 18, es número

    // Limpiamos para no dejar basura en el navegador de la clase.
    localStorage.removeItem('fs2-preferencias');
  } catch (error) {
    imprimir('localStorage no disponible ->', error.message);
  }

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
