/**
 * ============================================================================
 * ARCHIVO: js/02-recorrer-y-copiar.js
 * PROYECTO: 05 · Objetos, JSON, Map y Set
 * ----------------------------------------------------------------------------
 * QUE ENSEÑA ESTE ARCHIVO:
 *   1. Recorrer objetos con for...in (y su trampa: el prototipo).
 *   2. Object.keys(), Object.values() y Object.entries().
 *   3. Combinar entries() con map/forEach/filter/reduce + Object.fromEntries().
 *   4. Object.assign(): fusionar objetos.
 *   5. Spread (...) para clonar y fusionar.
 *   6. Copia SUPERFICIAL vs copia PROFUNDA: structuredClone y el truco de JSON.
 *   7. Object.freeze() y Object.seal(): congelar y sellar objetos.
 *   8. Comprobar si una propiedad existe: in, hasOwnProperty, Object.hasOwn.
 *
 * AL TERMINAR DEBERIAS SABER:
 *   Transformar un objeto en listas, copiarlo sin romper el original y saber
 *   por qué "copiar" en JavaScript no siempre copia lo que uno cree.
 *
 * NOTA TECNICA: este archivo tampoco usa 'use strict' porque en la sección 7
 * queremos ver cómo Object.freeze() falla EN SILENCIO fuera del modo estricto.
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE: los datos de partida ya están escritos; lo que se escribe
 * en vivo es la lógica que los recorre y los copia.
 * La solución completa está en ../../js/02-recorrer-y-copiar.js
 * ============================================================================
 */

// IIFE: encierra todo el archivo para que sus variables no choquen con las de
// los otros .js que carga el mismo index.html.
(function () {
  // ANDAMIAJE (ya hecho): consola visual conectada al <pre id="salida-02">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-02');

  // DATOS DE PARTIDA (ya escritos, no hay que teclearlos en clase):
  // un producto del inventario de una tienda.
  const producto = {
    id: 'TEC-101',
    nombre: 'Teclado mecánico retroiluminado',
    precio: 45.9,
    stock: 12,
    categoria: 'Periféricos',
  };

  // DATOS DE PARTIDA: ventas del mes por vendedor (se usan en la sección 3).
  const ventasPorVendedor = {
    lucia: 12500,
    martin: 9800,
    sofia: 15300,
    diego: 7400,
  };

  // ==========================================================================
  // 1. RECORRER CON for...in
  // ==========================================================================
  /*
   * for...in recorre las CLAVES de un objeto, una por una.
   * Ojo a la diferencia:
   *   for...of  -> recorre VALORES de cosas iterables (arrays, Map, Set...).
   *   for...in  -> recorre CLAVES de un objeto.
   * Un objeto plano NO es iterable, así que `for...of objeto` lanza error.
   */

  // TODO (en clase):
  //   1. titulo('1. Recorrer un objeto con for...in').
  //   2. `for (const clave in producto) { imprimir(clave, '->', producto[clave]); }`
  //      Recuerda: `clave` es un string, para llegar al valor hace falta el CORCHETE.
  //   3. Demuestra la trampa del prototipo:
  //        const configuracionBase = { moneda: 'UYU', pais: 'Uruguay' };
  //        const configuracionTienda = Object.create(configuracionBase);
  //        configuracionTienda.nombreTienda = 'TecnoSur';
  //        configuracionTienda.ciudad = 'Montevideo';
  //      Recórrelo con for...in: salen 4 claves (2 propias + 2 heredadas).
  //      Declara estas tres variables FUERA del bucle, porque configuracionTienda
  //      se vuelve a usar en la sección 2.
  //   4. Repite el recorrido filtrando con `if (Object.hasOwn(configuracionTienda, clave))`
  //      para quedarte solo con las propias.
  //   5. Declara `const colores = ['rojo', 'verde', 'azul'];` y recórrelo con
  //      for...in imprimiendo el indice y su `typeof` -> siempre "string".
  //   Resultado esperado en pantalla: las 5 propiedades del producto, luego 4 claves,
  //   luego 2 claves, luego tres lineas con typeof: string
  //   (aprox. 20 lineas)

  // ⚠️ ERROR COMÚN: for...in también recorre las propiedades HEREDADAS del
  // prototipo. Object.create() crea un objeto cuyo "padre" es el que le pasamos.

  // ✅ BUENA PRÁCTICA: filtrar con Object.hasOwn() para quedarse solo con las
  // propiedades PROPIAS del objeto.

  // ⚠️ ERROR COMÚN: usar for...in con arrays. Devuelve los índices como TEXTO
  // ("0", "1", "2") y puede alterar el orden. Para arrays: for...of o forEach.

  // ==========================================================================
  // 2. Object.keys(), Object.values() y Object.entries()
  // ==========================================================================
  /*
   * Estos tres métodos convierten un objeto en un ARRAY, y eso es una gran
   * noticia: a partir de ahí podemos usar map, filter, reduce, sort...
   *
   *   Object.keys(obj)    -> array con las claves        ["id", "nombre", ...]
   *   Object.values(obj)  -> array con los valores       ["TEC-101", 45.9, ...]
   *   Object.entries(obj) -> array de pares [clave, valor]
   *
   * Los tres ignoran lo heredado del prototipo: solo dan propiedades propias.
   */

  // TODO (en clase):
  //   1. titulo('2. Object.keys / values / entries').
  //   2. Imprime Object.keys(producto), Object.values(producto) y Object.entries(producto).
  //   3. Imprime `Object.keys(producto).length` con la etiqueta 'Cantidad de propiedades ->'.
  //   4. Imprime `Object.keys(configuracionTienda)`: solo salen las 2 PROPIAS,
  //      a diferencia del for...in de la sección 1.
  //   Resultado esperado en pantalla: los tres arrays, "Cantidad de propiedades -> 5"
  //   y ["nombreTienda","ciudad"]
  //   (aprox. 5 lineas)

  // ==========================================================================
  // 3. COMBINAR ENTRIES CON LOS METODOS DE ARRAY
  // ==========================================================================
  /*
   * Object.entries() + destructuring en el parámetro es el patrón más usado
   * para recorrer objetos en código moderno.
   * Cada elemento es un array de 2 posiciones, y `[clave, valor]` lo abre.
   */

  // TODO (en clase):
  //   1. titulo('3. entries + map / forEach / filter / reduce').
  //   2. `Object.entries(producto).forEach(([clave, valor]) => { ... })` e imprime
  //      `${clave.padEnd(12)} : ${valor}` (padEnd alinea la salida en columnas).
  //   3. Suma todas las ventas con reduce sobre Object.values(ventasPorVendedor),
  //      guárdalo en `totalVendido` e imprímelo -> 45000
  //   4. Filtra con `Object.entries(ventasPorVendedor).filter(([, importe]) => importe >= 10000)`
  //      guárdalo en `superanLaMeta` e imprímelo. Fíjate en la coma sola: omite
  //      la clave, que no usamos.
  //   5. Aplica un 10% de comisión: Object.entries -> map devolviendo
  //      [vendedor, Number((importe * 0.1).toFixed(2))] -> Object.fromEntries.
  //      Guárdalo en `comisiones` e imprímelo.
  //   6. Ordena de mayor a menor: Object.entries -> .sort(([, a], [, b]) => b - a)
  //      -> Object.fromEntries. Guárdalo en `ranking` e imprímelo.
  //   Resultado esperado en pantalla: las 5 lineas alineadas, "Total vendido -> 45000",
  //   los pares de lucia y sofia, { lucia: 1250, martin: 980, sofia: 1530, diego: 740 }
  //   y el ranking sofia > lucia > martin > diego
  //   (aprox. 20 lineas)

  // Object.fromEntries() hace el camino inverso: array de pares -> objeto.

  // ==========================================================================
  // 4. Object.assign(): FUSIONAR OBJETOS
  // ==========================================================================
  /*
   * Object.assign(destino, fuente1, fuente2, ...) copia las propiedades de las
   * fuentes DENTRO del destino y devuelve el destino.
   *
   * Dos ideas clave:
   *   - MUTA el objeto destino (lo modifica de verdad).
   *   - Si una clave se repite, gana la ÚLTIMA fuente.
   */

  // TODO (en clase):
  //   1. titulo('4. Object.assign()').
  //   2. Declara:
  //        const valoresPorDefecto = { tema: 'oscuro', idioma: 'es', notificaciones: true };
  //        const preferenciasUsuario = { tema: 'claro' };
  //   3. Fusiona SIN mutar: `Object.assign({}, valoresPorDefecto, preferenciasUsuario)`
  //      guárdalo en `configuracionFinal` e imprímelo -> tema: "claro".
  //   4. Imprime `valoresPorDefecto` para comprobar que sigue con tema: "oscuro".
  //   5. Demuestra el error común: `const destinoMutado = { a: 1 };`
  //      `Object.assign(destinoMutado, { b: 2 });` e imprímelo -> { a: 1, b: 2 }
  //   Resultado esperado en pantalla: configuracion con tema "claro", el original
  //   intacto, y destinoMutado modificado
  //   (aprox. 8 lineas)

  // ✅ BUENA PRÁCTICA: pasar un objeto vacío {} como destino para NO modificar
  // ninguno de los dos originales.
  // ⚠️ ERROR COMÚN: olvidar el {} inicial y mutar sin querer el primer objeto.

  // ==========================================================================
  // 5. SPREAD (...) PARA CLONAR Y FUSIONAR
  // ==========================================================================
  /*
   * El operador de propagación (spread) "desparrama" las propiedades de un
   * objeto dentro de otro literal. Hace lo mismo que Object.assign({}, ...)
   * pero se lee mucho mejor, y es lo que se usa hoy en día.
   *
   * Analogía: vaciar el contenido de una caja dentro de otra caja nueva.
   */

  // TODO (en clase):
  //   1. titulo('5. Spread para clonar y fusionar').
  //   2. `const copiaProducto = { ...producto };` cambia `copiaProducto.precio = 39.9;`
  //      e imprime el precio de la copia (39.9) y el del original (45.9, intacto).
  //   3. `const productoEnOferta = { ...producto, precio: 29.9, oferta: true };`
  //      imprímelo: el orden manda, gana el ÚLTIMO que aparezca.
  //   4. Invierte el orden: `const malFusionado = { precio: 29.9, ...producto };`
  //      e imprime `malFusionado.precio` -> vuelve a 45.9 (el spread pisa el cambio).
  //   Resultado esperado en pantalla: 39.9, 45.9, el objeto en oferta, y 45.9
  //   (aprox. 8 lineas)

  // ⚠️ ERROR COMÚN: invertir el orden y "pisar" sin querer los cambios.

  // ==========================================================================
  // 6. COPIA SUPERFICIAL vs COPIA PROFUNDA
  // ==========================================================================
  /*
   * Tanto el spread como Object.assign hacen una copia SUPERFICIAL (shallow):
   * copian el primer nivel. Si una propiedad es a su vez un objeto, lo que se
   * copia es la REFERENCIA (la dirección), no el contenido.
   *
   * Analogía: fotocopias una hoja que dice "las llaves están en el cajón 3".
   * Tienes dos hojas, pero el cajón 3 sigue siendo UNO solo.
   */

  // TODO (en clase) — parte A, el problema:
  //   1. titulo('6. Copia superficial vs copia profunda').
  //   2. Declara `const pedidoOriginal = { ... }` con:
  //        numero: 'A-2026-018', cliente: 'Lucía Ferreira',
  //        envio: { ciudad: 'Montevideo', direccion: 'Av. Italia 1234' },
  //        articulos: ['Teclado', 'Mouse']
  //   3. `const copiaSuperficial = { ...pedidoOriginal };`
  //      cambia `copiaSuperficial.cliente = 'Martín Rodríguez';`  (nivel 1: independiente)
  //      cambia `copiaSuperficial.envio.ciudad = 'Salto';`        (nivel 2: COMPARTIDO)
  //   4. Imprime `pedidoOriginal.cliente` -> "Lucía Ferreira" (bien)
  //      Imprime `pedidoOriginal.envio.ciudad` -> "Salto" (¡sorpresa!)
  //      Imprime `pedidoOriginal.envio === copiaSuperficial.envio` -> true
  //   5. Deja el original como estaba: `pedidoOriginal.envio.ciudad = 'Montevideo';`
  //   (aprox. 14 lineas)

  /*
   * SOLUCIÓN 1 (moderna y recomendada): structuredClone().
   * Está en el navegador desde 2022. Clona en profundidad y además soporta
   * fechas, Map, Set y hasta referencias circulares.
   * Lo único que NO puede clonar son funciones y nodos del DOM.
   */

  // TODO (en clase) — parte B, structuredClone:
  //   1. Envuelve todo en `if (typeof structuredClone === 'function') { ... } else { ... }`
  //      (en el else: imprimir('Este navegador no tiene structuredClone (es muy antiguo).')).
  //   2. Dentro del if: `const copiaProfunda = structuredClone(pedidoOriginal);`
  //      cambia `copiaProfunda.envio.ciudad = 'Rivera';`
  //   3. Imprime la ciudad de la copia (Rivera), la del original (Montevideo)
  //      y `pedidoOriginal.envio === copiaProfunda.envio` -> false.
  //   4. En un try/catch, llama a `structuredClone({ saludar: function () {} })`
  //      e imprime `error.name` -> "DataCloneError": no sabe clonar funciones.
  //   (aprox. 14 lineas)

  /*
   * SOLUCIÓN 2 (el truco clásico): JSON.parse(JSON.stringify(objeto)).
   * Convierte el objeto a texto y lo vuelve a leer, así que el resultado es
   * completamente nuevo. Funciona en cualquier navegador, pero tiene PEAJES:
   *   - Las fechas (Date) se convierten en string.
   *   - Se pierden funciones, undefined y símbolos.
   *   - NaN e Infinity se convierten en null.
   *   - Explota si hay referencias circulares.
   */

  // TODO (en clase) — parte C, el truco de JSON:
  //   1. Declara `const conCosasRaras = { ... }` con:
  //        creado: new Date('2026-03-15T10:00:00Z'),
  //        puntuacion: NaN,
  //        revisadoPor: undefined,
  //        calcular: function () { return 1; },
  //        envio: { ciudad: 'Montevideo' }
  //   2. `const clonJson = JSON.parse(JSON.stringify(conCosasRaras));` e imprímelo.
  //   3. Imprime `typeof clonJson.creado` -> "string": ya NO es un Date.
  //   Resultado esperado en pantalla: el clon solo conserva creado (como texto),
  //   puntuacion: null y envio; typeof de la fecha clonada -> string
  //   (aprox. 10 lineas)

  // ✅ REGLA PRÁCTICA:
  //   - Objeto de un solo nivel     -> spread { ...obj }
  //   - Objeto con niveles anidados -> structuredClone(obj)
  //   - Solo datos simples y hay que soportar navegadores viejos -> truco JSON

  // ==========================================================================
  // 7. Object.freeze() Y Object.seal()
  // ==========================================================================
  /*
   * Recordatorio: `const` protege la VARIABLE, no el contenido del objeto.
   * Si queremos proteger el CONTENIDO, hay dos niveles:
   *
   *   Object.freeze(obj) -> CONGELAR: no se puede añadir, ni modificar,
   *                         ni eliminar nada.
   *   Object.seal(obj)   -> SELLAR: no se puede añadir ni eliminar,
   *                         pero SÍ modificar lo que ya existe.
   */

  // TODO (en clase):
  //   1. titulo('7. Object.freeze() y Object.seal()').
  //   2. `const constantesApp = Object.freeze({ NOMBRE: 'Gestor de estudiantes',
  //      VERSION: '1.0.0', NOTA_MINIMA_APROBACION: 7 });`
  //   3. Intenta modificarlo (falla EN SILENCIO fuera del modo estricto):
  //        constantesApp.VERSION = '2.0.0';
  //        constantesApp.AUTOR = 'Equipo docente';
  //        delete constantesApp.NOMBRE;
  //      Imprime `constantesApp` (no cambió nada) y `Object.isFrozen(constantesApp)` -> true.
  //   4. Escribe `function intentarEnModoEstricto(objetoCongelado) { 'use strict'; ... }`
  //      que dentro de try/catch asigne objetoCongelado.VERSION = '2.0.0' e imprima
  //      error.name + ': ' + error.message. Llámala con constantesApp.
  //   5. freeze es SUPERFICIAL: `const ajustes = Object.freeze({ tema: 'oscuro',
  //      avanzado: { depuracion: false } });` luego `ajustes.avanzado.depuracion = true;`
  //      e imprime `ajustes` -> ¡el nivel 2 SÍ cambió!
  //   6. Escribe `function congelarProfundo(objetivo)` que recorra Object.values,
  //      se llame a sí misma (RECURSIÓN) cuando el valor sea un objeto no congelado,
  //      y termine con `return Object.freeze(objetivo);`.
  //      Úsala sobre { tema: 'oscuro', avanzado: { depuracion: false } }, guarda el
  //      resultado en `ajustesBlindados`, intenta cambiar depuracion e imprímelo:
  //      ahora sí queda bloqueado.
  //   7. seal(): `const sesion = Object.seal({ usuario: 'lucia', rol: 'estudiante' });`
  //      `sesion.rol = 'delegada';` (permitido), `sesion.token = 'abc123';` (ignorado),
  //      `delete sesion.usuario;` (ignorado). Imprime `sesion`, `Object.isSealed(sesion)`
  //      y `Object.isFrozen(sesion)` -> true y false.
  //   Resultado esperado en pantalla: el objeto congelado intacto, true, el TypeError
  //   del modo estricto, depuracion: true, depuracion: false, y { usuario: "lucia", rol: "delegada" }
  //   (aprox. 34 lineas)

  // ⚠️ ERROR COMÚN: creer que el fallo es silencioso siempre. En modo estricto
  // (y dentro de un módulo ES) lanza TypeError.
  // ⚠️ freeze también es SUPERFICIAL: solo congela el primer nivel.

  // ==========================================================================
  // 8. COMPROBAR SI UNA PROPIEDAD EXISTE
  // ==========================================================================
  /*
   * Tres herramientas, con matices importantes:
   *
   *   'clave' in obj             -> true también si la hereda del prototipo.
   *   obj.hasOwnProperty('clave')-> true solo si es PROPIA (forma clásica).
   *   Object.hasOwn(obj, 'clave')-> igual que la anterior pero más segura y
   *                                 moderna (ES2022). Es la recomendada hoy.
   */

  // TODO (en clase):
  //   1. titulo('8. in, hasOwnProperty y Object.hasOwn').
  //   2. Imprime, sobre `producto`:
  //        'stock' in producto        -> true
  //        'descuento' in producto    -> false
  //        'toString' in producto     -> true (¡heredado del prototipo!)
  //        producto.hasOwnProperty('toString')      -> false
  //        Object.hasOwn(producto, 'stock')         -> true
  //   3. Demuestra el error común: `const productoAgotado = { nombre: 'Mouse', stock: 0 };`
  //      Un `if (productoAgotado.stock)` cae en el else aunque la clave SÍ existe
  //      (0 es falsy). Imprime los dos mensajes y luego
  //      `Object.hasOwn(productoAgotado, 'stock')` -> true.
  //   4. Caso avanzado: `const diccionarioLimpio = Object.create(null);`
  //      `diccionarioLimpio.hola = 'hello';`
  //      Imprime `typeof diccionarioLimpio.hasOwnProperty` -> "undefined"
  //      y `Object.hasOwn(diccionarioLimpio, 'hola')` -> true.
  //   Resultado esperado en pantalla: true, false, true, false, true, el aviso del 0,
  //   "undefined" y true
  //   (aprox. 16 lineas)

  // ⚠️ ERROR COMÚN: comprobar la existencia con `if (obj.clave)`.
  // Un valor válido pero "falsy" (0, "", false) haría creer que no existe.
  // ⚠️ Caso avanzado: un objeto creado con Object.create(null) no hereda nada,
  // ni siquiera hasOwnProperty. Llamarlo lanzaría un TypeError.

  // ==========================================================================
  // EJERCICIOS PROPUESTOS (archivo 02)
  // ==========================================================================
  /*
   * 1) Dado el objeto `{ manzana: 3, pera: 0, banana: 7, kiwi: 2 }`, imprime
   *    solo las frutas con stock mayor que 0, usando Object.entries() y filter.
   *
   * 2) Escribe una función `invertir(objeto)` que devuelva un objeto nuevo con
   *    las claves y los valores intercambiados. Pista: entries + map +
   *    Object.fromEntries.
   *
   * 3) Crea un objeto `pedido` con un objeto anidado `envio`. Haz una copia con
   *    spread, cambia la ciudad de la copia y demuestra con un console.log que
   *    el original también cambió. Después arréglalo con structuredClone.
   *
   * 4) Escribe `fusionarConfiguracion(porDefecto, usuario)` que devuelva la
   *    fusión de ambos SIN modificar ninguno de los dos, y que devuelva el
   *    resultado congelado con Object.freeze.
   *
   * 5) Escribe `contarPropiedadesProfundas(objeto)` que cuente cuántas
   *    propiedades hay en TODOS los niveles de un objeto anidado (usa
   *    recursión, como en congelarProfundo).
   */
})();
