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
 * ============================================================================
 */

// IIFE: encierra todo el archivo para que sus variables no choquen con las de
// los otros .js que carga el mismo index.html.
(function () {
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-02');

  // Datos de trabajo: un producto del inventario de una tienda.
  const producto = {
    id: 'TEC-101',
    nombre: 'Teclado mecánico retroiluminado',
    precio: 45.9,
    stock: 12,
    categoria: 'Periféricos',
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
  titulo('1. Recorrer un objeto con for...in');

  for (const clave in producto) {
    // `clave` es un string; para llegar al valor hace falta el corchete,
    // porque el nombre está en una variable.
    imprimir(clave, '->', producto[clave]);
  }

  // ⚠️ ERROR COMÚN: for...in también recorre las propiedades HEREDADAS del
  // prototipo. Aquí lo vemos en vivo.
  const configuracionBase = { moneda: 'UYU', pais: 'Uruguay' };
  // Object.create() crea un objeto cuyo "padre" (prototipo) es el que le pasamos.
  const configuracionTienda = Object.create(configuracionBase);
  configuracionTienda.nombreTienda = 'TecnoSur';
  configuracionTienda.ciudad = 'Montevideo';

  imprimir('for...in incluye lo heredado:');
  for (const clave in configuracionTienda) {
    imprimir('   ', clave); // salen 4 claves: 2 propias + 2 heredadas
  }

  // ✅ BUENA PRÁCTICA: filtrar con Object.hasOwn() para quedarse solo con las
  // propiedades PROPIAS del objeto.
  imprimir('Solo las propias:');
  for (const clave in configuracionTienda) {
    if (Object.hasOwn(configuracionTienda, clave)) {
      imprimir('   ', clave);
    }
  }

  // ⚠️ ERROR COMÚN: usar for...in con arrays. Devuelve los índices como TEXTO
  // ("0", "1", "2") y puede alterar el orden. Para arrays: for...of o forEach.
  const colores = ['rojo', 'verde', 'azul'];
  for (const indice in colores) {
    imprimir('for...in en array -> indice:', indice, 'typeof:', typeof indice);
  }

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
  titulo('2. Object.keys / values / entries');

  imprimir('keys ->', Object.keys(producto));
  imprimir('values ->', Object.values(producto));
  imprimir('entries ->', Object.entries(producto));

  imprimir('Cantidad de propiedades ->', Object.keys(producto).length);

  // Comprobamos que ignoran el prototipo (comparar con la sección 1):
  imprimir('keys de configuracionTienda ->', Object.keys(configuracionTienda));

  // ==========================================================================
  // 3. COMBINAR ENTRIES CON LOS METODOS DE ARRAY
  // ==========================================================================
  /*
   * Object.entries() + destructuring en el parámetro es el patrón más usado
   * para recorrer objetos en código moderno.
   * Cada elemento es un array de 2 posiciones, y `[clave, valor]` lo abre.
   */
  titulo('3. entries + map / forEach / filter / reduce');

  Object.entries(producto).forEach(([clave, valor]) => {
    imprimir(`${clave.padEnd(12)} : ${valor}`); // padEnd alinea la salida
  });

  // Ventas del mes por vendedor: objeto -> array -> cálculo -> objeto.
  const ventasPorVendedor = {
    lucia: 12500,
    martin: 9800,
    sofia: 15300,
    diego: 7400,
  };

  // reduce() para sumar todos los valores.
  const totalVendido = Object.values(ventasPorVendedor).reduce(
    (acumulado, importe) => acumulado + importe,
    0 // valor inicial del acumulador
  );
  imprimir('Total vendido ->', totalVendido);

  // filter() sobre entries para quedarnos con quienes superan una meta.
  const superanLaMeta = Object.entries(ventasPorVendedor).filter(
    ([, importe]) => importe >= 10000 // la coma sola omite la clave, que no usamos
  );
  imprimir('Superan la meta ->', superanLaMeta);

  // Object.fromEntries() hace el camino inverso: array de pares -> objeto.
  // Con map() aplicamos un 10% de comisión a cada importe.
  const comisiones = Object.fromEntries(
    Object.entries(ventasPorVendedor).map(([vendedor, importe]) => [
      vendedor,
      Number((importe * 0.1).toFixed(2)),
    ])
  );
  imprimir('Comisiones (10%) ->', comisiones);

  // Ordenar un objeto por su valor: entries -> sort -> fromEntries.
  const ranking = Object.fromEntries(
    Object.entries(ventasPorVendedor).sort(([, a], [, b]) => b - a) // de mayor a menor
  );
  imprimir('Ranking de ventas ->', ranking);

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
  titulo('4. Object.assign()');

  const valoresPorDefecto = { tema: 'oscuro', idioma: 'es', notificaciones: true };
  const preferenciasUsuario = { tema: 'claro' };

  // ✅ BUENA PRÁCTICA: pasar un objeto vacío {} como destino para NO modificar
  // ninguno de los dos originales.
  const configuracionFinal = Object.assign({}, valoresPorDefecto, preferenciasUsuario);
  imprimir('Configuración final ->', configuracionFinal); // tema: "claro"
  imprimir('¿Se modificó el original? ->', valoresPorDefecto);

  // ⚠️ ERROR COMÚN: olvidar el {} inicial.
  const destinoMutado = { a: 1 };
  Object.assign(destinoMutado, { b: 2 });
  imprimir('destinoMutado quedó modificado ->', destinoMutado); // { a: 1, b: 2 }

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
  titulo('5. Spread para clonar y fusionar');

  const copiaProducto = { ...producto };
  copiaProducto.precio = 39.9;

  imprimir('Precio de la copia ->', copiaProducto.precio);   // 39.9
  imprimir('Precio del original ->', producto.precio);       // 45.9 (intacto)

  // Fusionar: el orden manda, gana el último que aparezca.
  const productoEnOferta = { ...producto, precio: 29.9, oferta: true };
  imprimir('Producto en oferta ->', productoEnOferta);

  // ⚠️ ERROR COMÚN: invertir el orden y "pisar" sin querer los cambios.
  const malFusionado = { precio: 29.9, ...producto };
  imprimir('Orden invertido (el precio vuelve a 45.9) ->', malFusionado.precio);

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
  titulo('6. Copia superficial vs copia profunda');

  const pedidoOriginal = {
    numero: 'A-2026-018',
    cliente: 'Lucía Ferreira',
    envio: {
      ciudad: 'Montevideo',
      direccion: 'Av. Italia 1234',
    },
    articulos: ['Teclado', 'Mouse'],
  };

  const copiaSuperficial = { ...pedidoOriginal };
  copiaSuperficial.cliente = 'Martín Rodríguez';   // primer nivel: independiente
  copiaSuperficial.envio.ciudad = 'Salto';         // ⚠️ nivel 2: COMPARTIDO

  imprimir('Cliente del original ->', pedidoOriginal.cliente); // "Lucía Ferreira" (bien)
  imprimir('Ciudad del original ->', pedidoOriginal.envio.ciudad); // "Salto" (¡sorpresa!)
  imprimir('¿Comparten el mismo objeto envio? ->', pedidoOriginal.envio === copiaSuperficial.envio); // true

  // Dejamos el original como estaba para las pruebas siguientes.
  pedidoOriginal.envio.ciudad = 'Montevideo';

  /*
   * SOLUCIÓN 1 (moderna y recomendada): structuredClone().
   * Está en el navegador desde 2022. Clona en profundidad y además soporta
   * fechas, Map, Set y hasta referencias circulares.
   * Lo único que NO puede clonar son funciones y nodos del DOM.
   */
  if (typeof structuredClone === 'function') {
    const copiaProfunda = structuredClone(pedidoOriginal);
    copiaProfunda.envio.ciudad = 'Rivera';

    imprimir('structuredClone -> ciudad de la copia:', copiaProfunda.envio.ciudad);
    imprimir('structuredClone -> ciudad del original:', pedidoOriginal.envio.ciudad);
    imprimir('¿Comparten envio? ->', pedidoOriginal.envio === copiaProfunda.envio); // false

    // structuredClone NO sabe clonar funciones: lanza un DataCloneError.
    try {
      structuredClone({ saludar: function () {} });
    } catch (error) {
      imprimir('structuredClone con función ->', error.name);
    }
  } else {
    imprimir('Este navegador no tiene structuredClone (es muy antiguo).');
  }

  /*
   * SOLUCIÓN 2 (el truco clásico): JSON.parse(JSON.stringify(objeto)).
   * Convierte el objeto a texto y lo vuelve a leer, así que el resultado es
   * completamente nuevo. Funciona en cualquier navegador, pero tiene PEAJES:
   *   - Las fechas (Date) se convierten en string.
   *   - Se pierden funciones, undefined y símbolos.
   *   - NaN e Infinity se convierten en null.
   *   - Explota si hay referencias circulares.
   */
  const conCosasRaras = {
    creado: new Date('2026-03-15T10:00:00Z'),
    puntuacion: NaN,
    revisadoPor: undefined,
    calcular: function () { return 1; },
    envio: { ciudad: 'Montevideo' },
  };

  const clonJson = JSON.parse(JSON.stringify(conCosasRaras));
  imprimir('Clon con JSON ->', clonJson);
  imprimir('typeof de la fecha clonada ->', typeof clonJson.creado); // "string", ya no es Date

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
  titulo('7. Object.freeze() y Object.seal()');

  const constantesApp = Object.freeze({
    NOMBRE: 'Gestor de estudiantes',
    VERSION: '1.0.0',
    NOTA_MINIMA_APROBACION: 7,
  });

  // Fuera del modo estricto, estos intentos FALLAN EN SILENCIO: no pasa nada.
  constantesApp.VERSION = '2.0.0';
  constantesApp.AUTOR = 'Equipo docente';
  delete constantesApp.NOMBRE;

  imprimir('Objeto congelado ->', constantesApp); // no cambió nada
  imprimir('Object.isFrozen ->', Object.isFrozen(constantesApp)); // true

  // ⚠️ ERROR COMÚN: creer que el fallo es silencioso siempre. En modo estricto
  // (y dentro de un módulo ES) lanza TypeError. Lo comprobamos con una función
  // que activa el modo estricto solo para ella.
  function intentarEnModoEstricto(objetoCongelado) {
    'use strict';
    try {
      objetoCongelado.VERSION = '2.0.0';
    } catch (error) {
      imprimir('En modo estricto lanza ->', error.name + ': ' + error.message);
    }
  }
  intentarEnModoEstricto(constantesApp);

  // ⚠️ freeze también es SUPERFICIAL: solo congela el primer nivel.
  const ajustes = Object.freeze({
    tema: 'oscuro',
    avanzado: { depuracion: false },
  });
  ajustes.avanzado.depuracion = true; // ¡esto SÍ funciona!
  imprimir('freeze es superficial ->', ajustes);

  // Para congelar todo hay que recorrer el objeto en profundidad.
  function congelarProfundo(objetivo) {
    // Recorremos cada valor y, si es un objeto, nos llamamos a nosotros mismos.
    Object.values(objetivo).forEach((valor) => {
      if (valor !== null && typeof valor === 'object' && !Object.isFrozen(valor)) {
        congelarProfundo(valor); // llamada RECURSIVA
      }
    });
    return Object.freeze(objetivo);
  }

  const ajustesBlindados = congelarProfundo({
    tema: 'oscuro',
    avanzado: { depuracion: false },
  });
  ajustesBlindados.avanzado.depuracion = true; // ahora sí queda bloqueado
  imprimir('Congelado en profundidad ->', ajustesBlindados);

  // seal(): se puede editar lo existente, no añadir ni borrar.
  const sesion = Object.seal({ usuario: 'lucia', rol: 'estudiante' });
  sesion.rol = 'delegada';       // permitido
  sesion.token = 'abc123';       // ignorado
  delete sesion.usuario;         // ignorado
  imprimir('Objeto sellado ->', sesion);
  imprimir('isSealed ->', Object.isSealed(sesion), '| isFrozen ->', Object.isFrozen(sesion));

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
  titulo('8. in, hasOwnProperty y Object.hasOwn');

  imprimir("'stock' in producto ->", 'stock' in producto);           // true
  imprimir("'descuento' in producto ->", 'descuento' in producto);   // false
  imprimir("'toString' in producto ->", 'toString' in producto);     // true (¡heredado!)

  imprimir('hasOwnProperty("toString") ->', producto.hasOwnProperty('toString')); // false
  imprimir('Object.hasOwn(producto, "stock") ->', Object.hasOwn(producto, 'stock')); // true

  // ⚠️ ERROR COMÚN: comprobar la existencia con `if (obj.clave)`.
  // Un valor válido pero "falsy" (0, "", false) haría creer que no existe.
  const productoAgotado = { nombre: 'Mouse', stock: 0 };
  if (productoAgotado.stock) {
    imprimir('Con if(obj.stock): hay stock');
  } else {
    imprimir('Con if(obj.stock): parece que NO existe... ¡pero existe y vale 0!');
  }
  imprimir('Con Object.hasOwn ->', Object.hasOwn(productoAgotado, 'stock')); // true

  // ⚠️ Caso avanzado: un objeto creado con Object.create(null) no hereda nada,
  // ni siquiera hasOwnProperty. Llamarlo lanzaría un TypeError.
  const diccionarioLimpio = Object.create(null);
  diccionarioLimpio.hola = 'hello';
  imprimir('¿Tiene hasOwnProperty? ->', typeof diccionarioLimpio.hasOwnProperty); // "undefined"
  imprimir('Object.hasOwn sí funciona ->', Object.hasOwn(diccionarioLimpio, 'hola')); // true

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
