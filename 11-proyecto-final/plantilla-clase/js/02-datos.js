/**
 * ============================================================================
 * ARCHIVO: js/02-datos.js
 * PROYECTO: 11 · Proyecto final integrador: tienda con carrito (TechStore)
 * ----------------------------------------------------------------------------
 * TEMAS DEL CURSO QUE SE APLICAN AQUÍ
 *   · Proyecto 04 (Arrays)      -> array de objetos, map, filter, sort, Set.
 *   · Proyecto 05 (Objetos)     -> objetos con propiedades anidadas, spread
 *                                  para clonar, structuredClone / JSON.
 *   · Proyecto 09 (Asincronía)  -> new Promise, setTimeout, resolve y reject;
 *                                  simulación de una petición a un servidor
 *                                  que a veces falla.
 *   · Proyecto 10 (JS moderno)  -> Object.freeze, spread, plantillas.
 *
 * QUÉ ES ESTE ARCHIVO
 * La "base de datos" de la tienda. En una aplicación real estos datos
 * llegarían de un servidor con fetch(); aquí están escritos a mano para que
 * el proyecto funcione con doble clic, sin servidor y sin conexión.
 *
 * REGLA DE ORO DE LA SEPARACIÓN DE RESPONSABILIDADES
 * Este archivo NO sabe pintar nada. No toca el DOM ni una sola vez. Solo
 * guarda datos y ofrece una función para "pedirlos". Gracias a eso, el día
 * que cambiemos el catálogo por un fetch() real, únicamente habrá que tocar
 * la función cargarCatalogo() y el resto de la aplicación no se enterará.
 *
 * ÍNDICE DEL ARCHIVO
 *   1. Constantes de configuración de la tienda (IVA, clave de almacenamiento).
 *   2. El catálogo: array de objetos producto.
 *   3. Categorías calculadas con un Set (sin repetir, sin escribirlas a mano).
 *   4. cargarCatalogo(): la promesa que simula la petición al servidor.
 *   5. Publicación en TIENDA.datos.
 *   6. Ejercicios propuestos.
 * ----------------------------------------------------------------------------
 * ▶ PLANTILLA DE CLASE
 * Versión POR COMPLETAR. La solución está en ../../js/02-datos.js
 *
 * LOS DATOS YA VIENEN ESCRITOS: la configuración (sección 1) y los 16
 * productos del catálogo (sección 2). Teclear dieciséis objetos en clase es
 * tiempo perdido; lo que se escribe en vivo es la LÓGICA que los procesa
 * (secciones 3, 4 y 5).
 * ============================================================================
 */

window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';

  // Traemos las utilidades del archivo anterior con DESTRUCTURING de objetos:
  // en lugar de escribir TIENDA.utiles.imprimir cada vez, sacamos las
  // funciones que necesitamos a variables sueltas.
  // (Esta línea viene escrita: es el cableado entre archivos. Ojo: `hora`
  // valdrá undefined hasta que se escriba en 01-utilidades.js.)
  const { imprimir, hora } = TIENDA.utiles;

  // ==========================================================================
  // 1. CONFIGURACIÓN DE LA TIENDA
  // ==========================================================================
  /*
    Todo lo que un día podría querer cambiarse vive junto y en mayúsculas.
    La convención en JavaScript es: NOMBRE_EN_MAYUSCULAS para las constantes
    de configuración que no cambian nunca durante la ejecución.
  */

  /** Porcentaje de impuesto aplicado al subtotal. 0.21 = 21 %. */
  const IVA = 0.21;

  /** Clave con la que se guarda el carrito en localStorage.
      Se pone un prefijo con el nombre de la app para no chocar con otras
      páginas que compartan el mismo origen. */
  const CLAVE_ALMACEN = 'techstore.carrito.v1';

  /** Milisegundos que "tarda el servidor" en responder. Súbelo a 3000 en
      clase para que se vean bien los esqueletos de carga. */
  const RETARDO_CARGA = 900;

  // ==========================================================================
  // 2. EL CATÁLOGO
  // ==========================================================================
  /*
    Un array de objetos: la estructura de datos más habitual del desarrollo
    web. Exactamente así llegan los datos de cualquier API real.

    CADA PRODUCTO TIENE:
      id          -> texto único. Es la "matrícula" del producto: el carrito,
                     el DOM y localStorage lo usarán para identificarlo.
      nombre      -> lo que ve el cliente.
      categoria   -> se usa para los botones de filtro.
      precio      -> número, SIN símbolo de moneda ni texto.
                     ⚠️ ERROR COMÚN: guardar el precio como "89,90 €". Sería
                     un string y no se podría sumar. El formato se aplica solo
                     al MOSTRARLO, nunca al guardarlo.
      stock       -> unidades disponibles. Un 0 significa agotado.
      valoracion  -> nota de 0 a 5 con un decimal.
      descripcion -> texto corto para la tarjeta.
      emoji       -> hace de "foto" del producto. Cero peticiones de red.
      colores     -> [colorA, colorB] con los que la interfaz construye el
                     degradado de fondo de la tarjeta.

    Object.freeze() al final "congela" el array: impide añadir, quitar o
    modificar productos por accidente. El catálogo es la fuente de la verdad
    y nadie debería poder alterarlo desde otro archivo.
  */
  const CATALOGO = [
    {
      id: 'p01',
      nombre: 'Teclado mecánico Aurora TKL',
      categoria: 'Periféricos',
      precio: 89.9,
      stock: 12,
      valoracion: 4.7,
      descripcion: 'Formato compacto sin teclado numérico, interruptores silenciosos e iluminación por tecla.',
      emoji: '⌨️',
      colores: ['#0ea5e9', '#312e81']
    },
    {
      id: 'p02',
      nombre: 'Ratón inalámbrico Nube Pro',
      categoria: 'Periféricos',
      precio: 45.5,
      stock: 25,
      valoracion: 4.4,
      descripcion: 'Sensor de 16.000 ppp, seis botones programables y hasta 70 días de autonomía.',
      emoji: '🖱️',
      colores: ['#22d3ee', '#0f766e']
    },
    {
      id: 'p03',
      nombre: 'Auriculares Estudio 700',
      categoria: 'Audio',
      precio: 129,
      stock: 8,
      valoracion: 4.8,
      descripcion: 'Cancelación activa de ruido, almohadillas de memoria y 40 horas de batería.',
      emoji: '🎧',
      colores: ['#a855f7', '#4c1d95']
    },
    {
      id: 'p04',
      nombre: 'Micrófono Podcast Vox',
      categoria: 'Audio',
      precio: 99.9,
      stock: 5,
      valoracion: 4.5,
      descripcion: 'Condensador cardioide con conexión USB-C, salida de auriculares y brazo articulado.',
      emoji: '🎙️',
      colores: ['#f472b6', '#831843']
    },
    {
      id: 'p05',
      nombre: 'Altavoces Eco 2.1',
      categoria: 'Audio',
      precio: 89,
      stock: 9,
      valoracion: 4.2,
      descripcion: 'Dos satélites y un subwoofer de madera. Entrada óptica, jack y Bluetooth 5.3.',
      emoji: '🔊',
      colores: ['#fb7185', '#7f1d1d']
    },
    {
      id: 'p06',
      nombre: 'Monitor Nítido 27" QHD',
      categoria: 'Monitores',
      precio: 259,
      stock: 6,
      valoracion: 4.6,
      descripcion: 'Panel IPS de 2560x1440 a 165 Hz, 1 ms de respuesta y soporte con ajuste de altura.',
      emoji: '🖥️',
      colores: ['#38bdf8', '#1e3a8a']
    },
    {
      id: 'p07',
      nombre: 'Monitor portátil Viaje 15"',
      categoria: 'Monitores',
      precio: 179,
      // Este producto está AGOTADO a propósito: sirve para demostrar en clase
      // cómo se deshabilita el botón y qué mensaje recibe quien lo intenta.
      stock: 0,
      valoracion: 4.1,
      descripcion: 'Pantalla Full HD de 15,6 pulgadas que se alimenta por un solo cable USB-C.',
      emoji: '📺',
      colores: ['#64748b', '#0f172a']
    },
    {
      id: 'p08',
      nombre: 'Portátil Vega Air 14"',
      categoria: 'Portátiles',
      precio: 949,
      stock: 3,
      valoracion: 4.9,
      descripcion: 'Ultraligero de 1,1 kg con 16 GB de memoria, 512 GB de disco y 18 horas de batería.',
      emoji: '💻',
      colores: ['#818cf8', '#1e1b4b']
    },
    {
      id: 'p09',
      nombre: 'Portátil Taller 16" creadores',
      categoria: 'Portátiles',
      precio: 1349,
      stock: 2,
      valoracion: 4.7,
      descripcion: 'Pensado para edición de vídeo: gráfica dedicada, 32 GB de memoria y pantalla calibrada.',
      emoji: '📓',
      colores: ['#c084fc', '#4a044e']
    },
    {
      id: 'p10',
      nombre: 'SSD Rayo 1 TB NVMe',
      categoria: 'Almacenamiento',
      precio: 109,
      stock: 18,
      valoracion: 4.8,
      descripcion: 'Lectura de 7.000 MB/s, disipador incluido y cinco años de garantía.',
      emoji: '💾',
      colores: ['#4ade80', '#14532d']
    },
    {
      id: 'p11',
      nombre: 'Disco externo Bóveda 2 TB',
      categoria: 'Almacenamiento',
      precio: 79.9,
      stock: 10,
      valoracion: 4.3,
      descripcion: 'Carcasa resistente a golpes, cifrado por hardware y cable USB-C trenzado.',
      emoji: '🗄️',
      colores: ['#34d399', '#134e4a']
    },
    {
      id: 'p12',
      nombre: 'Webcam Nitidez 1080p',
      categoria: 'Periféricos',
      precio: 59,
      stock: 14,
      valoracion: 4.0,
      descripcion: 'Enfoque automático, corrección de luz y tapa física para la privacidad.',
      emoji: '📷',
      colores: ['#60a5fa', '#1e40af']
    },
    {
      id: 'p13',
      nombre: 'Tableta gráfica Trazo 10"',
      categoria: 'Periféricos',
      precio: 149,
      stock: 5,
      valoracion: 4.6,
      descripcion: 'Lápiz sin batería con 8.192 niveles de presión y ocho teclas de acceso rápido.',
      emoji: '🖊️',
      colores: ['#f0abfc', '#701a75']
    },
    {
      id: 'p14',
      nombre: 'Base USB-C Puerto 9 en 1',
      categoria: 'Accesorios',
      precio: 69.9,
      stock: 7,
      valoracion: 4.5,
      descripcion: 'HDMI 4K, lector de tarjetas, red por cable y carga de 100 W en un solo conector.',
      emoji: '🔌',
      colores: ['#fbbf24', '#78350f']
    },
    {
      id: 'p15',
      nombre: 'Soporte ergonómico Altura',
      categoria: 'Accesorios',
      precio: 34.9,
      stock: 30,
      valoracion: 4.2,
      descripcion: 'Aluminio plegable con seis alturas. Levanta la pantalla al nivel de los ojos.',
      emoji: '📐',
      colores: ['#fcd34d', '#92400e']
    },
    {
      id: 'p16',
      nombre: 'Lámpara de escritorio Foco LED',
      categoria: 'Accesorios',
      precio: 42,
      stock: 4,
      valoracion: 4.4,
      descripcion: 'Cinco temperaturas de color, brazo articulado y puerto USB para cargar el móvil.',
      emoji: '💡',
      colores: ['#fde047', '#854d0e']
    }
  ];

  // TODO (en clase):
  //   1. Congela cada producto uno a uno:
  //        CATALOGO.forEach((producto) => Object.freeze(producto));
  //   2. Congela después el array entero: Object.freeze(CATALOGO);
  //   ⚠️ OJO: freeze es SUPERFICIAL. Congela el array, pero no los objetos que
  //   hay dentro; por eso hacen falta las DOS líneas y en ese orden.
  //   Demostración recomendada: antes de escribirlo, prueba en la consola del
  //   navegador a hacer TIENDA.datos.CATALOGO.push({}) y verás que funciona;
  //   después de congelarlo, en modo estricto lanza un TypeError.
  //   (aprox. 2 líneas)

  // ==========================================================================
  // 3. CATEGORÍAS CALCULADAS
  // ==========================================================================
  /*
    Las categorías NO se escriben a mano. Se deducen del propio catálogo.
    Así, cuando un estudiante añada un producto de una categoría nueva, el
    botón de filtro aparecerá solo.

    Cómo funciona la línea de abajo, de dentro hacia fuera:
      1. CATALOGO.map(p => p.categoria)  -> array con TODAS las categorías,
                                            repetidas: ['Periféricos', 'Audio', ...]
      2. new Set(...)                    -> un Set elimina los duplicados.
      3. [...set]                        -> el spread lo vuelve a convertir
                                            en un array normal.
      4. .sort()                         -> las ordena alfabéticamente.
  */
  // TODO (en clase):
  //   1. function obtenerCategorias() { ... }
  //   2. const todas = CATALOGO.map((producto) => producto.categoria);
  //   3. const sinRepetir = [...new Set(todas)];
  //   4. Devuelve sinRepetir.sort((a, b) => a.localeCompare(b, TIENDA.utiles.IDIOMA));
  //      localeCompare ordena bien las palabras con tildes y con ñ.
  //      ⚠️ ERROR COMÚN: usar sort() a secas con textos acentuados: 'Ñ' quedaría
  //      detrás de 'Z' porque compara por código de carácter, no por alfabeto.
  //   Prueba: imprimir(obtenerCategorias());
  //   Resultado esperado en pantalla (6 categorías, por orden alfabético):
  //     Accesorios, Almacenamiento, Audio, Monitores, Periféricos, Portátiles
  //   (aprox. 6 líneas)

  // ==========================================================================
  // 4. cargarCatalogo(): LA PROMESA QUE SIMULA EL SERVIDOR
  // ==========================================================================
  /*
    Esta es la pieza de asincronía del proyecto. Devuelve una PROMESA que:
      - queda PENDIENTE durante RETARDO_CARGA milisegundos,
      - y después se CUMPLE con una copia del catálogo,
      - salvo que se pida fallar, en cuyo caso se RECHAZA con un Error.

    Repaso del proyecto 09: una promesa tiene tres estados posibles.
      pending   -> todavía no se sabe.
      fulfilled -> salió bien, se llamó a resolve(valor).
      rejected  -> salió mal, se llamó a reject(error).

    POR QUÉ DEVOLVEMOS UNA COPIA Y NO EL ORIGINAL
    Si devolviéramos el array real, cualquier parte de la aplicación podría
    modificarlo sin querer (por ejemplo al ordenar con sort, que MUTA el
    array). Devolver copias es la forma más barata de evitar errores muy
    difíciles de encontrar.

    El parámetro es un OBJETO DE OPCIONES con destructuring y valores por
    defecto: cargarCatalogo() funciona sin argumentos, y
    cargarCatalogo({ fallar: true }) fuerza el error.
  */
  // TODO (en clase):
  //   1. Firma exacta:
  //        function cargarCatalogo({ fallar = false, retardo = RETARDO_CARGA } = {}) {
  //   2. Antes de nada, deja rastro en la bitácora:
  //        imprimir(`[${hora()}] Pidiendo el catálogo al "servidor"... (promesa pendiente)`);
  //   3. Devuelve new Promise((resolve, reject) => { ... }).
  //      Dentro, un setTimeout(() => { ... }, retardo):
  //        setTimeout NO es JavaScript puro: lo proporciona el navegador. Pone
  //        la función en la cola de tareas y el motor la ejecuta cuando termina
  //        todo lo síncrono. Ese es el famoso "event loop" del proyecto 09.
  //   4. Si `fallar` es true:
  //        reject(new Error('No se pudo conectar con el servidor de TechStore.'));
  //        y return; para no seguir.
  //        reject() se usa siempre con un objeto Error, nunca con un string:
  //        así el catch recibe también la pila de llamadas (stack).
  //   5. Si no, clona cada producto y resuelve con la copia:
  //        const copia = CATALOGO.map((producto) => ({
  //          ...producto,
  //          colores: [...producto.colores]
  //        }));
  //        resolve(copia);
  //      ⚠️ OJO CON EL SPREAD: { ...producto } crea un objeto nuevo, pero la
  //      copia es SUPERFICIAL (de un solo nivel). Las propiedades que sean
  //      objetos o arrays NO se duplican: se comparte la misma referencia.
  //      Aquí eso afectaría al array `colores`, por eso se copia aparte con
  //      [...producto.colores]. Ahora sí es una copia independiente.
  //      Alternativa moderna en una línea: structuredClone(producto), que
  //      clona en profundidad. Lo hacemos a mano para que se vea el problema.
  //   Prueba: cargarCatalogo().then((lista) => imprimir('Recibidos', lista.length));
  //   Resultado esperado en pantalla (tras 900 ms): Recibidos 16
  //   (aprox. 20 líneas)

  /**
   * buscarPorId(): devuelve el producto original del catálogo con ese id,
   * o undefined si no existe.
   *
   * find() recorre el array y devuelve el PRIMER elemento que cumpla la
   * condición (a diferencia de filter, que devuelve todos los que cumplan
   * dentro de un array).
   */
  // TODO (en clase):
  //   1. function buscarPorId(id) que devuelva
  //      CATALOGO.find((producto) => producto.id === id);
  //   Prueba: imprimir(buscarPorId('p03').nombre);
  //   Resultado esperado en pantalla: Auriculares Estudio 700
  //   (aprox. 3 líneas)

  // ==========================================================================
  // 5. PUBLICACIÓN EN EL ESPACIO DE NOMBRES
  // ==========================================================================
  // La plantilla publica ya los DATOS, que son lo único que existe de partida.
  // Se deja escrito porque 05-app.js hace `const { CATALOGO, IVA, ... } =
  // TIENDA.datos;` nada más cargar: si TIENDA.datos no existiera, la página
  // arrancaría con un TypeError.
  TIENDA.datos = {
    CATALOGO,
    IVA,
    CLAVE_ALMACEN,
    RETARDO_CARGA
  };

  // TODO (en clase):
  //   Cuando termines las secciones 3 y 4, añade a este objeto TIENDA.datos
  //   las tres funciones que faltan, en este orden:
  //     obtenerCategorias, cargarCatalogo, buscarPorId
  //   Comprobación en la consola del navegador:
  //     Object.keys(TIENDA.datos)  ->  7 claves
  //   (aprox. 3 líneas)

  // Mensaje de carga. En la solución lleva marca de tiempo con hora() y cuenta
  // también las categorías; aquí va simplificado porque esas piezas todavía no
  // existen.
  imprimir(`02-datos.js cargado (PLANTILLA). ${CATALOGO.length} productos escritos; las funciones están por escribir.`);
})(window.TIENDA);


/**
 * ============================================================================
 * EJERCICIOS PROPUESTOS (archivo 02-datos.js)
 * ----------------------------------------------------------------------------
 * 1. FÁCIL. Añade tres productos nuevos de una categoría que todavía no
 *    exista (por ejemplo "Redes"). Recarga la página: el botón de filtro
 *    debería aparecer solo. Explica por qué.
 *
 * 2. FÁCIL. Sube RETARDO_CARGA a 3000 y observa los esqueletos de carga.
 *    Después bájalo a 0. ¿Sigue habiendo asincronía con retardo cero?
 *    (Pista: sí, y la bitácora lo demuestra.)
 *
 * 3. MEDIO. Escribe `productosPorCategoria()` que devuelva un objeto del tipo
 *    { 'Audio': 3, 'Portátiles': 2, ... } usando reduce.
 *
 * 4. MEDIO. Haz que cargarCatalogo() falle de forma aleatoria una de cada
 *    cuatro veces (Math.random() < 0.25) para simular una red inestable.
 *    Comprueba que la aplicación muestra el error y no se rompe.
 *
 * 5. DIFÍCIL. Añade una segunda función `cargarValoraciones(id)` que devuelva
 *    una promesa con los comentarios de un producto, y encadena las dos
 *    llamadas con Promise.all() para cargar catálogo y valoraciones a la vez.
 *
 * 6. DIFÍCIL. Saca el catálogo a un archivo `productos.json` y cárgalo con
 *    fetch(). Recuerda que entonces harán falta un servidor local y un
 *    try/catch alrededor del await.
 * ============================================================================
 */
