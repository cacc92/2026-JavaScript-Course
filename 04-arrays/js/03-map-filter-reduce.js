/**
 * ============================================================================
 * ARCHIVO: js/03-map-filter-reduce.js
 * PROYECTO: 04 · Arrays y métodos funcionales
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. map(): TRANSFORMAR cada elemento y obtener un array nuevo del mismo tamaño.
 *   2. filter(): SELECCIONAR los elementos que cumplen una condición.
 *   3. reduce(): RESUMIR el array entero en un único valor, paso a paso.
 *   4. Los cuatro usos clásicos de reduce: sumar, buscar el máximo,
 *      agrupar por categoría y contar ocurrencias.
 *   5. reduceRight(): lo mismo, pero recorriendo de derecha a izquierda.
 *   6. Encadenamiento (filter + map + reduce) como TUBERÍA de datos.
 *
 * LA IDEA DE FONDO
 *   Antes resolvíamos todo con bucles for y variables auxiliares. Estos tres
 *   métodos expresan la INTENCIÓN en lugar del mecanismo:
 *      for  -> "recorre desde 0 hasta length-1 y ve acumulando..."
 *      map  -> "conviérteme cada elemento en otra cosa"
 *      filter -> "quédate solo con los que cumplan esto"
 *      reduce -> "resúmemelo todo en un valor"
 *   Se leen casi como una frase en español, y por eso el código con estos
 *   métodos suele ser mucho más corto y más fácil de revisar.
 *
 * (Todo va dentro de una IIFE para que estas variables no choquen con las de
 *  los otros archivos .js que carga la misma página.)
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (consola visual de esta sección)
  // ============================================================
  var ID_SALIDA = 'salida-3';

  function formatear(valor) {
    if (typeof valor === 'string') return valor;
    if (valor === undefined) return 'undefined';
    if (valor === null) return 'null';
    if (typeof valor === 'object') {
      var compacto = JSON.stringify(valor);
      if (compacto === undefined) return String(valor);
      return compacto.length <= 90 ? compacto : JSON.stringify(valor, null, 2);
    }
    return String(valor);
  }

  function imprimir(...mensajes) {
    console.log(...mensajes);
    var salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    salida.textContent += mensajes.map(formatear).join(' ') + '\n';
  }

  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ============================================================
  // DATOS DE TRABAJO DE ESTA SECCIÓN
  // ============================================================
  // Las ventas de una semana en la papelería del instituto.
  // Cada objeto es una LÍNEA de venta: qué producto, de qué categoría,
  // cuántas unidades se vendieron y a qué precio unitario.

  const ventas = [
    { producto: 'Cuaderno A4', categoria: 'Papelería', cantidad: 12, precio: 3.5 },
    { producto: 'Lápiz HB', categoria: 'Escritura', cantidad: 40, precio: 0.8 },
    { producto: 'Calculadora', categoria: 'Tecnología', cantidad: 3, precio: 24.9 },
    { producto: 'Regla 30cm', categoria: 'Geometría', cantidad: 10, precio: 1.9 },
    { producto: 'Bolígrafo azul', categoria: 'Escritura', cantidad: 25, precio: 1.2 },
    { producto: 'Compás', categoria: 'Geometría', cantidad: 6, precio: 4.75 },
    { producto: 'Marcador', categoria: 'Escritura', cantidad: 18, precio: 2.1 },
  ];

  const notasParciales = [7, 9, 5, 10, 6];

  // ============================================================
  // 1. map(): TRANSFORMAR CADA ELEMENTO
  // ============================================================
  // map recorre el array, pasa cada elemento por tu función y guarda lo que
  // devuelvas en un array NUEVO. El original no se toca.
  // Analogía: una cinta transportadora con una máquina encima. Entran 5 piezas
  // y salen 5 piezas, pero transformadas. La cantidad NUNCA cambia:
  // el array resultante tiene exactamente el mismo length que el de entrada.

  titulo('1. map(): TRANSFORMAR');

  imprimir('Original ->', notasParciales);

  // (a) Transformación numérica: sumar medio punto de participación.
  const conBonificacion = notasParciales.map((nota) => nota + 0.5);
  imprimir('map(nota => nota + 0.5) ->', conBonificacion); // [7.5, 9.5, 5.5, 10.5, 6.5]
  imprimir('El original NO cambió ->', notasParciales);

  // (b) Cambiar de tipo: de números a textos.
  const notasComoTexto = notasParciales.map((nota) => 'Nota: ' + nota + '/10');
  imprimir('map a textos ->', notasComoTexto);

  // (c) Usar el índice (segundo argumento de la callback).
  const numeradas = notasParciales.map((nota, indice) => 'Parcial ' + (indice + 1) + ' = ' + nota);
  imprimir('map con índice ->', numeradas);

  // (d) EL USO MÁS FRECUENTE EN LA VIDA REAL: extraer una propiedad de objetos.
  const nombresProductos = ventas.map((venta) => venta.producto);
  imprimir('map(v => v.producto) ->', nombresProductos);

  // (e) Crear objetos NUEVOS a partir de los antiguos, añadiendo un campo calculado.
  // Ojo con los paréntesis: (venta) => ({ ... }). Sin ellos, JavaScript creería
  // que las llaves abren el cuerpo de la función y devolvería undefined.
  const ventasConTotal = ventas.map((venta) => ({
    producto: venta.producto,
    total: venta.cantidad * venta.precio,
  }));
  imprimir('map creando objetos nuevos ->', ventasConTotal);
  // Fíjate en que algunos totales salen con una cola rara: 74.69999999999999
  // en lugar de 74.7. No es un fallo tuyo: es cómo el ordenador guarda los
  // decimales en binario. Lo explicamos en la sección 4.1 de este archivo.

  // (f) map + join: el combo que genera HTML (lo usaremos en el proyecto final).
  const listaHtml = nombresProductos.map((nombre) => '<li>' + nombre + '</li>').join('');
  imprimir('map + join generan HTML ->', listaHtml);

  // ------------------------------------------------------------
  // Errores típicos con map
  // ------------------------------------------------------------
  // ⚠️ ERROR COMÚN 1: usar map cuando no te interesa el resultado.
  // Si solo quieres imprimir o enviar algo, usa forEach: map crea un array
  // completo que nadie va a leer (trabajo y memoria desperdiciados).

  // ⚠️ ERROR COMÚN 2: olvidar el return cuando la callback lleva llaves.
  const malHecho = notasParciales.map((nota) => {
    nota * 2; // Se calcula y se tira: falta el return.
  });
  imprimir('map SIN return ->', malHecho); // [null,null,null,null,null] -> son undefined

  const bienHecho = notasParciales.map((nota) => {
    const doble = nota * 2;
    return doble; // ✅ Con llaves, el return es obligatorio.
  });
  imprimir('map CON return ->', bienHecho); // [14,18,10,20,12]

  // ⚠️ ERROR COMÚN 3 (clásico de entrevista): pasar parseInt directamente a map.
  // map llama a la callback con (elemento, indice, array), y parseInt interpreta
  // ese segundo argumento como la BASE numérica. Resultado: desastre.
  imprimir('["10","10","10"].map(parseInt) ->', ['10', '10', '10'].map(parseInt));
  // [10, NaN, 2] -> base 0 (= decimal), base 1 (inválida), base 2 (binario: "10" = 2)
  imprimir('["10","10","10"].map(Number) ->', ['10', '10', '10'].map(Number)); // [10,10,10]
  // ✅ BUENA PRÁCTICA: usa Number, o escribe la callback completa:
  //    .map((texto) => parseInt(texto, 10))

  // ============================================================
  // 2. filter(): SELECCIONAR LOS QUE CUMPLEN UNA CONDICIÓN
  // ============================================================
  // filter recorre el array y se queda con los elementos cuya callback
  // devuelve un valor VERDADERO. Devuelve un array nuevo, que puede tener
  // desde 0 elementos hasta todos.
  // Analogía: un colador. Pasas la lista entera y solo caen los que cumplen.

  titulo('2. filter(): SELECCIONAR');

  const aprobadas = notasParciales.filter((nota) => nota >= 6);
  imprimir('filter(nota => nota >= 6) ->', aprobadas); // [7,9,10,6]

  const reprobadas = notasParciales.filter((nota) => nota < 6);
  imprimir('filter(nota => nota < 6) ->', reprobadas); // [5]

  // Con objetos, exactamente igual:
  const escritura = ventas.filter((venta) => venta.categoria === 'Escritura');
  imprimir('Ventas de la categoría Escritura ->', escritura.length + ' líneas');
  imprimir(
    'Productos ->',
    escritura.map((v) => v.producto)
  ); // ["Lápiz HB","Bolígrafo azul","Marcador"]

  // Condiciones combinadas: ventas grandes y baratas.
  const superventas = ventas.filter((venta) => venta.cantidad >= 15 && venta.precio < 3);
  imprimir(
    'Más de 15 uds. y menos de 3 EUR ->',
    superventas.map((v) => v.producto)
  ); // ["Lápiz HB","Bolígrafo azul","Marcador"]

  // Buscador de texto: la base de cualquier campo de búsqueda de una web.
  // toLowerCase() en los dos lados evita que las mayúsculas afecten al resultado.
  const termino = 'ca';
  const encontrados = ventas.filter((venta) =>
    venta.producto.toLowerCase().includes(termino.toLowerCase())
  );
  imprimir(
    'Buscar "' + termino + '" ->',
    encontrados.map((v) => v.producto)
  ); // ["Calculadora","Marcador"]

  // Truco muy usado: filter(Boolean) limpia los valores "falsos" de una lista
  // (undefined, null, 0, "", NaN, false). Boolean es una función que convierte
  // a true/false, y se la pasamos directamente como callback.
  const sucio = ['Ana Ruiz', '', null, 'Luis Paz', undefined, 'Sara Gil', 0];
  imprimir('filter(Boolean) ->', sucio.filter(Boolean)); // ["Ana Ruiz","Luis Paz","Sara Gil"]

  // ------------------------------------------------------------
  // filter vs find: la confusión número uno
  // ------------------------------------------------------------
  // filter -> SIEMPRE devuelve un ARRAY (aunque esté vacío o tenga un elemento).
  // find   -> devuelve el ELEMENTO suelto (o undefined).
  const conFilter = ventas.filter((v) => v.producto === 'Compás');
  const conFind = ventas.find((v) => v.producto === 'Compás');
  imprimir('filter devuelve ->', conFilter); // [ { ... } ]  <- array
  imprimir('find devuelve ->', conFind); //   { ... }    <- objeto
  // ⚠️ ERROR COMÚN: escribir conFilter.precio. Un array no tiene .precio:
  // habría que escribir conFilter[0].precio.

  // ⚠️ ERROR COMÚN: comprobar el resultado de filter con un if directo.
  // Un array VACÍO es un valor VERDADERO en JavaScript, así que este if
  // siempre entra. Hay que mirar la longitud.
  const sinResultados = ventas.filter((v) => v.precio > 1000);
  if (sinResultados.length === 0) {
    imprimir('Correcto: comprobamos .length === 0, no el array en sí');
  }

  // ============================================================
  // 3. reduce(): RESUMIR TODO EN UN SOLO VALOR
  // ============================================================
  // reduce es el más potente y el que más cuesta al principio. La idea:
  // vas arrastrando un valor (el ACUMULADOR) mientras recorres el array,
  // y en cada vuelta decides cuál será el acumulador de la vuelta siguiente.
  // Analogía: una bola de nieve rodando cuesta abajo. Empieza con un tamaño
  // (el valor inicial) y en cada elemento decides cuánto crece.
  //
  // ANATOMÍA:
  //   array.reduce(function (acumulador, elementoActual, indice, arrayCompleto) {
  //     return nuevoAcumulador;   // <-- SIEMPRE hay que devolver el acumulador
  //   }, valorInicial);
  //
  // ✅ REGLA DE ORO: lo que devuelves en cada vuelta es el "acumulador" que
  // recibirás en la vuelta siguiente. Si olvidas el return, en la vuelta
  // siguiente el acumulador vale undefined y todo se rompe.

  titulo('3. reduce(): PASO A PASO');

  const notasReduce = [7, 9, 5, 10];

  const suma = notasReduce.reduce((acumulador, nota) => acumulador + nota, 0);
  imprimir('Suma de ' + JSON.stringify(notasReduce) + ' ->', suma); // 31

  // ------------------------------------------------------------
  // TABLA DE ITERACIONES (dibújala en la pizarra mientras lo explicas)
  // ------------------------------------------------------------
  //  Partimos de acumulador = 0, porque ese es el valorInicial que pasamos.
  //
  //  vuelta | acumulador (entra) | nota | acumulador + nota | devuelve
  //  -------|--------------------|------|-------------------|---------
  //    1    |         0          |   7  |       0 + 7       |    7
  //    2    |         7          |   9  |       7 + 9       |   16
  //    3    |        16          |   5  |      16 + 5       |   21
  //    4    |        21          |  10  |      21 + 10      |   31
  //  -------|--------------------|------|-------------------|---------
  //  Resultado final de reduce: 31 (lo que devolvió la ÚLTIMA vuelta).
  //
  // Lo mismo con un bucle for, para ver que es exactamente la misma idea:
  let sumaConFor = 0; // <- el "valor inicial"
  for (let i = 0; i < notasReduce.length; i++) {
    sumaConFor = sumaConFor + notasReduce[i]; // <- el "return acumulador + nota"
  }
  imprimir('La misma suma con un for ->', sumaConFor); // 31

  // Y el promedio: se calcula dividiendo al final, fuera del reduce.
  const promedio = suma / notasReduce.length;
  imprimir('Promedio ->', promedio.toFixed(2)); // "7.75"

  // ------------------------------------------------------------
  // 3.b) ¿Y si NO paso valor inicial?
  // ------------------------------------------------------------
  // reduce toma el PRIMER elemento como acumulador inicial y empieza a
  // recorrer desde el segundo. Es decir, hace una vuelta menos.
  const sumaSinInicial = notasReduce.reduce((acumulador, nota) => acumulador + nota);
  imprimir('reduce sin valor inicial ->', sumaSinInicial); // 31 (mismo resultado aquí)

  // ⚠️ ERROR COMÚN 1: reduce sin valor inicial sobre un array VACÍO lanza
  // "TypeError: Reduce of empty array with no initial value" y rompe la página.
  // Con valor inicial, simplemente devuelve ese valor. Lo demostramos con
  // try/catch para que el error no detenga el resto de la clase.
  try {
    [].reduce((a, b) => a + b);
  } catch (error) {
    imprimir('[].reduce(...) sin inicial lanza ->', error.name + ': ' + error.message);
  }
  imprimir('[].reduce(..., 0) con inicial ->', [].reduce((a, b) => a + b, 0)); // 0

  // ⚠️ ERROR COMÚN 2: sin valor inicial, el tipo del acumulador lo marca el
  // primer elemento. Si el array son objetos y quieres sumar sus precios,
  // el primer acumulador sería un OBJETO y la suma daría "[object Object]3.5".
  // ✅ BUENA PRÁCTICA: pon SIEMPRE el valor inicial. Es una letra más y evita
  // los dos errores anteriores.

  // ============================================================
  // 4. LOS CUATRO USOS CLÁSICOS DE reduce
  // ============================================================

  titulo('4. LOS CUATRO USOS CLÁSICOS DE reduce');

  // ------------------------------------------------------------
  // 4.1) SUMAR una propiedad de objetos (facturación total)
  // ------------------------------------------------------------
  const facturacion = ventas.reduce(
    (total, venta) => total + venta.cantidad * venta.precio,
    0 // Empezamos en 0 euros.
  );
  imprimir('Facturación total ->', facturacion.toFixed(2) + ' EUR'); // "264.00 EUR"

  // Nota sobre decimales: los números con decimales en JavaScript se guardan en
  // binario y a veces aparecen colas raras (0.1 + 0.2 da 0.30000000000000004).
  imprimir('0.1 + 0.2 ->', 0.1 + 0.2); // 0.30000000000000004
  // ✅ BUENA PRÁCTICA: para MOSTRAR dinero usa toFixed(2), y si trabajas con
  // importes serios, guarda céntimos como números enteros.

  // También sumamos unidades vendidas:
  const unidades = ventas.reduce((total, venta) => total + venta.cantidad, 0);
  imprimir('Unidades vendidas ->', unidades); // 114

  // ------------------------------------------------------------
  // 4.2) MÁXIMO y MÍNIMO
  // ------------------------------------------------------------
  // Con números sueltos: el acumulador guarda "el mayor visto hasta ahora".
  const notaMaxima = notasParciales.reduce((mayor, nota) => (nota > mayor ? nota : mayor));
  imprimir('Nota máxima ->', notaMaxima); // 10

  const notaMinima = notasParciales.reduce((menor, nota) => (nota < menor ? nota : menor));
  imprimir('Nota mínima ->', notaMinima); // 5

  // Con objetos hay que devolver el OBJETO entero, no solo el número,
  // porque después queremos saber de qué producto se trata.
  const masVendido = ventas.reduce((campeon, venta) =>
    venta.cantidad > campeon.cantidad ? venta : campeon
  );
  imprimir('Producto más vendido ->', masVendido.producto + ' (' + masVendido.cantidad + ' uds.)');

  // Alternativa rápida para números sueltos (spread + Math.max, archivo 04):
  imprimir('Math.max(...notasParciales) ->', Math.max(...notasParciales)); // 10

  // ------------------------------------------------------------
  // 4.3) AGRUPAR POR CATEGORÍA (reduce hacia un OBJETO)
  // ------------------------------------------------------------
  // Aquí el acumulador no es un número: es un objeto vacío {} que vamos
  // llenando. La clave es el nombre de la categoría y el valor, un array
  // con los productos de esa categoría.
  const porCategoria = ventas.reduce((grupos, venta) => {
    // Si es la primera vez que vemos esta categoría, creamos su array vacío.
    if (!grupos[venta.categoria]) {
      grupos[venta.categoria] = [];
    }
    grupos[venta.categoria].push(venta.producto);
    return grupos; // ⚠️ Sin este return, la vuelta siguiente recibe undefined.
  }, {});
  imprimir('Agrupado por categoría ->', porCategoria);

  // Versión compacta del mismo agrupamiento, usando ?? (operador de fusión nula):
  // "toma lo que ya hay; si es null o undefined, usa el array vacío".
  const porCategoriaCompacto = ventas.reduce((grupos, venta) => {
    grupos[venta.categoria] = (grupos[venta.categoria] ?? []).concat(venta.producto);
    return grupos;
  }, {});
  imprimir('Versión compacta ->', porCategoriaCompacto);

  // Agrupar SUMANDO en lugar de listar: facturación por categoría.
  const facturacionPorCategoria = ventas.reduce((totales, venta) => {
    const importe = venta.cantidad * venta.precio;
    totales[venta.categoria] = (totales[venta.categoria] || 0) + importe;
    return totales;
  }, {});
  imprimir('Facturación por categoría ->', facturacionPorCategoria);
  // Aquí vuelve a asomar el asunto de los decimales: Escritura da
  // 99.80000000000001. Para MOSTRARLO usaríamos toFixed(2) -> "99.80".

  // JavaScript moderno trae Object.groupBy, que hace el agrupamiento por ti.
  // Comprobamos que exista porque es muy reciente.
  if (typeof Object.groupBy === 'function') {
    const agrupadoNativo = Object.groupBy(ventas, (venta) => venta.categoria);
    imprimir('Object.groupBy(categorías) ->', Object.keys(agrupadoNativo));
  } else {
    imprimir('Este navegador aún no tiene Object.groupBy; usamos reduce');
  }

  // ------------------------------------------------------------
  // 4.4) CONTAR OCURRENCIAS (el "histograma" clásico)
  // ------------------------------------------------------------
  // Cuántas veces aparece cada valor en una lista. El acumulador es un objeto
  // donde cada clave es el valor y cada valor es su contador.
  const asignaturasImpartidas = [
    'Física', 'Química', 'Física', 'Biología',
    'Matemáticas', 'Física', 'Química',
  ];

  const conteo = asignaturasImpartidas.reduce((contador, asignatura) => {
    // (contador[asignatura] || 0) resuelve el problema de la primera vez:
    // si aún no existe la clave, su valor es undefined y usamos 0.
    contador[asignatura] = (contador[asignatura] || 0) + 1;
    return contador;
  }, {});
  imprimir('Conteo de asignaturas ->', conteo); // {"Física":3,"Química":2,...}

  // Con la tabla de iteraciones a la vista:
  //  vuelta | asignatura   | contador antes                  | contador después
  //    1    | Física       | {}                              | {Física:1}
  //    2    | Química      | {Física:1}                      | {Física:1, Química:1}
  //    3    | Física       | {Física:1, Química:1}           | {Física:2, Química:1}
  //   ...   | ...          | ...                             | ...

  // Y de paso, cómo pasar ese objeto a un texto legible:
  const resumenConteo = Object.entries(conteo)
    .map(([asignatura, veces]) => asignatura + ' x' + veces)
    .join(', ');
  imprimir('Resumen legible ->', resumenConteo);

  // ============================================================
  // 5. reduceRight(): DE DERECHA A IZQUIERDA
  // ============================================================
  // Idéntico a reduce pero empezando por el último elemento. Solo importa
  // cuando la operación NO es conmutativa, es decir, cuando el orden cambia
  // el resultado: sumar da igual, concatenar textos no.

  titulo('5. reduceRight()');

  const letras = ['a', 'b', 'c', 'd'];
  imprimir('reduce      ->', letras.reduce((acc, letra) => acc + letra)); // "abcd"
  imprimir('reduceRight ->', letras.reduceRight((acc, letra) => acc + letra)); // "dcba"

  // Con una suma el resultado es el mismo (sumar es conmutativo):
  imprimir('Suma con reduce      ->', notasReduce.reduce((a, b) => a + b, 0)); // 31
  imprimir('Suma con reduceRight ->', notasReduce.reduceRight((a, b) => a + b, 0)); // 31

  // Caso real de reduceRight: reconstruir una ruta de carpetas desde la más
  // profunda hasta la raíz, o deshacer una pila de cambios en orden inverso.
  const historial = ['abrir', 'editar', 'guardar'];
  const deshacer = historial.reduceRight((texto, accion) => texto + ' <- ' + accion, 'FIN');
  imprimir('Deshacer historial ->', deshacer); // "FIN <- guardar <- editar <- abrir"

  // ============================================================
  // 6. ENCADENAMIENTO: LA TUBERÍA DE DATOS (PIPELINE)
  // ============================================================
  // Como filter y map devuelven arrays, se pueden encadenar uno detrás de otro.
  // Cada método recibe el resultado del anterior. Es una CADENA DE MONTAJE:
  //     datos crudos -> filtrar -> transformar -> resumir -> resultado
  // ✅ BUENA PRÁCTICA: escribe un método por línea, alineados. Se lee como una
  // receta y cada paso se puede comentar por separado.

  titulo('6. ENCADENAMIENTO: filter + map + reduce');

  const facturacionEscritura = ventas
    .filter((venta) => venta.categoria === 'Escritura') // 1. Solo esa categoría.
    .map((venta) => venta.cantidad * venta.precio) //      2. Importe de cada línea.
    .reduce((total, importe) => total + importe, 0); //    3. Suma de todos.

  imprimir('Facturación de Escritura ->', facturacionEscritura.toFixed(2) + ' EUR'); // "99.80 EUR"

  // Veamos la tubería paso a paso para explicarla en clase:
  const paso1 = ventas.filter((v) => v.categoria === 'Escritura');
  imprimir('Paso 1 (filter) -> ' + paso1.length + ' líneas:', paso1.map((v) => v.producto));
  const paso2 = paso1.map((v) => v.cantidad * v.precio);
  imprimir('Paso 2 (map) ->', paso2); // [32, 30, 37.8...]
  const paso3 = paso2.reduce((t, i) => t + i, 0);
  imprimir('Paso 3 (reduce) ->', paso3.toFixed(2));

  // Otra tubería: nombres de los productos que superan los 50 EUR de venta,
  // en mayúsculas y separados por comas.
  const destacados = ventas
    .filter((venta) => venta.cantidad * venta.precio > 50)
    .map((venta) => venta.producto.toUpperCase())
    .join(', ');
  imprimir('Ventas de más de 50 EUR ->', destacados); // "CALCULADORA"

  // Y una más: el promedio de precio de los productos de Escritura.
  const preciosEscritura = ventas
    .filter((venta) => venta.categoria === 'Escritura')
    .map((venta) => venta.precio);
  const promedioEscritura =
    preciosEscritura.reduce((total, precio) => total + precio, 0) / preciosEscritura.length;
  imprimir('Precio medio en Escritura ->', promedioEscritura.toFixed(2) + ' EUR');

  // ⚠️ NOTA DE RENDIMIENTO (nivel avanzado): cada eslabón de la cadena crea un
  // array intermedio. Con listas de decenas o miles de elementos es
  // irrelevante; con millones, un solo bucle for sería más eficiente.
  // ✅ Prioriza SIEMPRE la legibilidad y optimiza solo si mides un problema real.

  imprimir('\nFin de la sección 3. Continúa en la sección 4.');

  /* ============================================================================
   * EJERCICIOS PROPUESTOS (sección 3)
   * ----------------------------------------------------------------------------
   * 1. Con el array "ventas", crea con map un array de textos con el formato
   *    "Cuaderno A4: 42.00 EUR" (producto y su importe total con dos decimales).
   *
   * 2. Filtra las ventas cuya categoría NO sea 'Escritura' y muestra cuántas
   *    líneas quedan y qué productos son. Después haz lo mismo con un array
   *    de categorías excluidas usando includes().
   *
   * 3. Calcula con reduce, en una sola pasada, un objeto que contenga
   *    { unidades, importe, lineas } con el total de unidades vendidas,
   *    la facturación total y el número de líneas de venta.
   *    Pista: el valor inicial es { unidades: 0, importe: 0, lineas: 0 }.
   *
   * 4. Escribe una tubería que devuelva el NOMBRE del producto más caro de la
   *    categoría 'Geometría' usando filter + reduce (sin ordenar el array).
   *
   * 5. Reto: implementa tu propia función miMap(array, callback) usando un
   *    bucle for y push, sin usar map. Después implementa miFilter y miReduce.
   *    Comprueba que dan el mismo resultado que los métodos nativos.
   * ============================================================================ */
})();
