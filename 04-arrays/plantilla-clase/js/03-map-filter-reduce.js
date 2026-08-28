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

/* ============================================================================
 * CÓMO USAR ESTA PLANTILLA (nota del docente)
 * ----------------------------------------------------------------------------
 * Versión "para escribir en vivo". Vienen ya escritos el andamiaje de salida
 * (formatear, imprimir, titulo) y los DATOS DE TRABAJO (ventas, notasParciales).
 * Todo lo demás son bloques "TODO (en clase)".
 * Solución de referencia: ../js/03-map-filter-reduce.js
 * ============================================================================ */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (consola visual de esta sección)
  // ============================================================
  // NOTA DE LA PLANTILLA: esta sección 0 viene YA ESCRITA (andamiaje).
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
  //
  // NOTA DE LA PLANTILLA: estos datos vienen YA ESCRITOS a propósito.

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
  //
  // Ojo con los paréntesis al devolver un objeto: (venta) => ({ ... }).
  // Sin ellos, JavaScript creería que las llaves abren el cuerpo de la función
  // y devolvería undefined.

  // TODO (en clase):
  //   1. Abre con titulo('1. map(): TRANSFORMAR') e imprime "notasParciales"
  //      con la etiqueta 'Original ->'.
  //   2. (a) const conBonificacion = notasParciales.map((nota) => nota + 0.5).
  //      Imprímelo y después vuelve a imprimir notasParciales para probar que
  //      el original NO cambió.
  //   3. (b) const notasComoTexto = notasParciales.map((nota) => 'Nota: ' + nota + '/10').
  //   4. (c) const numeradas = notasParciales.map((nota, indice) =>
  //      'Parcial ' + (indice + 1) + ' = ' + nota).
  //   5. (d) El uso más frecuente: const nombresProductos = ventas.map((venta) => venta.producto).
  //      GUÁRDALO, porque se reutiliza en el apartado (f).
  //   6. (e) const ventasConTotal = ventas.map((venta) => ({ producto: venta.producto,
  //      total: venta.cantidad * venta.precio })). Imprímelo.
  //   7. (f) map + join: const listaHtml = nombresProductos.map((nombre) =>
  //      '<li>' + nombre + '</li>').join('') e imprímelo.
  //   Resultado esperado en pantalla:
  //     map(nota => nota + 0.5) -> [7.5,9.5,5.5,10.5,6.5]
  //     El original NO cambió -> [7,9,5,10,6]
  //     map(v => v.producto) -> ["Cuaderno A4","Lápiz HB",...]
  //     map + join generan HTML -> <li>Cuaderno A4</li><li>Lápiz HB</li>...
  //   Fíjate en que algunos totales salen con una cola rara: 74.69999999999999
  //   en lugar de 74.7. No es un fallo tuyo: es cómo el ordenador guarda los
  //   decimales en binario. Lo explicamos en la sección 4.1 de este archivo.
  //   (aprox. 16 líneas)

  // ------------------------------------------------------------
  // Errores típicos con map
  // ------------------------------------------------------------
  // ⚠️ ERROR COMÚN 1: usar map cuando no te interesa el resultado.
  // Si solo quieres imprimir o enviar algo, usa forEach: map crea un array
  // completo que nadie va a leer (trabajo y memoria desperdiciados).
  //
  // ⚠️ ERROR COMÚN 2: olvidar el return cuando la callback lleva llaves.
  //
  // ⚠️ ERROR COMÚN 3 (clásico de entrevista): pasar parseInt directamente a map.
  // map llama a la callback con (elemento, indice, array), y parseInt interpreta
  // ese segundo argumento como la BASE numérica. Resultado: desastre.
  // ✅ BUENA PRÁCTICA: usa Number, o escribe la callback completa:
  //    .map((texto) => parseInt(texto, 10))

  // TODO (en clase):
  //   1. const malHecho = notasParciales.map((nota) => { nota * 2; })  <- SIN return.
  //      Imprímelo con la etiqueta 'map SIN return ->'.
  //   2. const bienHecho = notasParciales.map((nota) => { const doble = nota * 2;
  //      return doble; }). Imprímelo con la etiqueta 'map CON return ->'.
  //   3. Imprime ['10', '10', '10'].map(parseInt) y ['10', '10', '10'].map(Number).
  //   Resultado esperado en pantalla:
  //     map SIN return -> [null,null,null,null,null]   (son undefined)
  //     map CON return -> [14,18,10,20,12]
  //     ["10","10","10"].map(parseInt) -> [10,null,2]   (10, NaN y 2)
  //     ["10","10","10"].map(Number) -> [10,10,10]
  //   (aprox. 10 líneas)

  // ============================================================
  // 2. filter(): SELECCIONAR LOS QUE CUMPLEN UNA CONDICIÓN
  // ============================================================
  // filter recorre el array y se queda con los elementos cuya callback
  // devuelve un valor VERDADERO. Devuelve un array nuevo, que puede tener
  // desde 0 elementos hasta todos.
  // Analogía: un colador. Pasas la lista entera y solo caen los que cumplen.
  //
  // Truco muy usado: filter(Boolean) limpia los valores "falsos" de una lista
  // (undefined, null, 0, "", NaN, false). Boolean es una función que convierte
  // a true/false, y se la pasamos directamente como callback.

  // TODO (en clase):
  //   1. Abre con titulo('2. filter(): SELECCIONAR').
  //   2. const aprobadas = notasParciales.filter((nota) => nota >= 6) e imprímelo.
  //      const reprobadas = notasParciales.filter((nota) => nota < 6) e imprímelo.
  //   3. Con objetos: const escritura = ventas.filter((venta) => venta.categoria === 'Escritura').
  //      Imprime escritura.length + ' líneas' y después escritura.map((v) => v.producto).
  //   4. Condiciones combinadas: const superventas = ventas.filter((venta) =>
  //      venta.cantidad >= 15 && venta.precio < 3). Imprime sus productos.
  //   5. Buscador de texto: const termino = 'ca' y
  //      const encontrados = ventas.filter((venta) =>
  //        venta.producto.toLowerCase().includes(termino.toLowerCase()))
  //      toLowerCase() en los dos lados evita que las mayúsculas afecten.
  //      Imprime los productos encontrados.
  //   6. const sucio = ['Ana Ruiz', '', null, 'Luis Paz', undefined, 'Sara Gil', 0]
  //      e imprime sucio.filter(Boolean).
  //   Resultado esperado en pantalla:
  //     filter(nota => nota >= 6) -> [7,9,10,6]      filter(nota => nota < 6) -> [5]
  //     Ventas de la categoría Escritura -> 3 líneas
  //     Productos -> ["Lápiz HB","Bolígrafo azul","Marcador"]
  //     Más de 15 uds. y menos de 3 EUR -> ["Lápiz HB","Bolígrafo azul","Marcador"]
  //     Buscar "ca" -> ["Calculadora","Marcador"]
  //     filter(Boolean) -> ["Ana Ruiz","Luis Paz","Sara Gil"]
  //   (aprox. 16 líneas)

  // ------------------------------------------------------------
  // filter vs find: la confusión número uno
  // ------------------------------------------------------------
  // filter -> SIEMPRE devuelve un ARRAY (aunque esté vacío o tenga un elemento).
  // find   -> devuelve el ELEMENTO suelto (o undefined).
  //
  // ⚠️ ERROR COMÚN: escribir conFilter.precio. Un array no tiene .precio:
  // habría que escribir conFilter[0].precio.
  //
  // ⚠️ ERROR COMÚN: comprobar el resultado de filter con un if directo.
  // Un array VACÍO es un valor VERDADERO en JavaScript, así que ese if
  // siempre entra. Hay que mirar la longitud.

  // TODO (en clase):
  //   1. const conFilter = ventas.filter((v) => v.producto === 'Compás') y
  //      const conFind = ventas.find((v) => v.producto === 'Compás'). Imprime
  //      los dos seguidos para que se vea el array frente al objeto suelto.
  //   2. const sinResultados = ventas.filter((v) => v.precio > 1000) y escribe
  //      if (sinResultados.length === 0) { ... } imprimiendo
  //      'Correcto: comprobamos .length === 0, no el array en sí'.
  //   Resultado esperado en pantalla:
  //     filter devuelve -> [{...}]      (un array de un elemento)
  //     find devuelve -> {...}          (el objeto)
  //     Correcto: comprobamos .length === 0, no el array en sí
  //   (aprox. 7 líneas)

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

  // TODO (en clase):
  //   1. Abre con titulo('3. reduce(): PASO A PASO').
  //   2. Declara const notasReduce = [7, 9, 5, 10]  <- se reutiliza en todo el archivo.
  //   3. const suma = notasReduce.reduce((acumulador, nota) => acumulador + nota, 0).
  //      Imprime 'Suma de ' + JSON.stringify(notasReduce) + ' ->' y la suma.
  //   4. Escribe LA MISMA suma con un for clásico (let sumaConFor = 0; recorre con
  //      i y acumula) e imprímela: es exactamente la misma idea que el reduce.
  //   5. const promedio = suma / notasReduce.length e imprime promedio.toFixed(2).
  //   Resultado esperado en pantalla:
  //     Suma de [7,9,5,10] -> 31
  //     La misma suma con un for -> 31
  //     Promedio -> 7.75
  //   (aprox. 10 líneas)

  // ------------------------------------------------------------
  // 3.b) ¿Y si NO paso valor inicial?
  // ------------------------------------------------------------
  // reduce toma el PRIMER elemento como acumulador inicial y empieza a
  // recorrer desde el segundo. Es decir, hace una vuelta menos.
  //
  // ⚠️ ERROR COMÚN 1: reduce sin valor inicial sobre un array VACÍO lanza
  // "TypeError: Reduce of empty array with no initial value" y rompe la página.
  // Con valor inicial, simplemente devuelve ese valor. Lo demostramos con
  // try/catch para que el error no detenga el resto de la clase.
  //
  // ⚠️ ERROR COMÚN 2: sin valor inicial, el tipo del acumulador lo marca el
  // primer elemento. Si el array son objetos y quieres sumar sus precios,
  // el primer acumulador sería un OBJETO y la suma daría "[object Object]3.5".
  // ✅ BUENA PRÁCTICA: pon SIEMPRE el valor inicial. Es una letra más y evita
  // los dos errores anteriores.

  // TODO (en clase):
  //   1. const sumaSinInicial = notasReduce.reduce((acumulador, nota) => acumulador + nota)
  //      (sin el 0 final) e imprímelo: aquí da el mismo 31.
  //   2. Escribe un try { [].reduce((a, b) => a + b); } catch (error) { ... } e
  //      imprime dentro del catch error.name + ': ' + error.message.
  //   3. Imprime [].reduce((a, b) => a + b, 0) para ver que con inicial da 0.
  //   Resultado esperado en pantalla:
  //     reduce sin valor inicial -> 31
  //     [].reduce(...) sin inicial lanza -> TypeError: Reduce of empty array with no initial value
  //     [].reduce(..., 0) con inicial -> 0
  //   (aprox. 8 líneas)

  // ============================================================
  // 4. LOS CUATRO USOS CLÁSICOS DE reduce
  // ============================================================

  // TODO (en clase):
  //   1. Abre con titulo('4. LOS CUATRO USOS CLÁSICOS DE reduce').
  //   (aprox. 1 línea)

  // ------------------------------------------------------------
  // 4.1) SUMAR una propiedad de objetos (facturación total)
  // ------------------------------------------------------------
  // Nota sobre decimales: los números con decimales en JavaScript se guardan en
  // binario y a veces aparecen colas raras (0.1 + 0.2 da 0.30000000000000004).
  // ✅ BUENA PRÁCTICA: para MOSTRAR dinero usa toFixed(2), y si trabajas con
  // importes serios, guarda céntimos como números enteros.

  // TODO (en clase):
  //   1. const facturacion = ventas.reduce((total, venta) =>
  //      total + venta.cantidad * venta.precio, 0)   <- empezamos en 0 euros.
  //      Imprime facturacion.toFixed(2) + ' EUR'.
  //   2. Imprime 0.1 + 0.2 para que se vea la cola binaria.
  //   3. const unidades = ventas.reduce((total, venta) => total + venta.cantidad, 0)
  //      e imprímelo.
  //   Resultado esperado en pantalla:
  //     Facturación total -> 264.00 EUR
  //     0.1 + 0.2 -> 0.30000000000000004
  //     Unidades vendidas -> 114
  //   (aprox. 7 líneas)

  // ------------------------------------------------------------
  // 4.2) MÁXIMO y MÍNIMO
  // ------------------------------------------------------------
  // Con números sueltos: el acumulador guarda "el mayor visto hasta ahora".
  // Con objetos hay que devolver el OBJETO entero, no solo el número,
  // porque después queremos saber de qué producto se trata.

  // TODO (en clase):
  //   1. const notaMaxima = notasParciales.reduce((mayor, nota) =>
  //      (nota > mayor ? nota : mayor))   <- sin valor inicial, a propósito.
  //      Y const notaMinima con la comparación invertida. Imprime las dos.
  //   2. const masVendido = ventas.reduce((campeon, venta) =>
  //      venta.cantidad > campeon.cantidad ? venta : campeon).
  //      Imprime masVendido.producto + ' (' + masVendido.cantidad + ' uds.)'.
  //   3. Alternativa rápida para números sueltos (spread + Math.max, archivo 04):
  //      imprime Math.max(...notasParciales).
  //   Resultado esperado en pantalla:
  //     Nota máxima -> 10        Nota mínima -> 5
  //     Producto más vendido -> Lápiz HB (40 uds.)
  //     Math.max(...notasParciales) -> 10
  //   (aprox. 8 líneas)

  // ------------------------------------------------------------
  // 4.3) AGRUPAR POR CATEGORÍA (reduce hacia un OBJETO)
  // ------------------------------------------------------------
  // Aquí el acumulador no es un número: es un objeto vacío {} que vamos
  // llenando. La clave es el nombre de la categoría y el valor, un array
  // con los productos de esa categoría.
  // JavaScript moderno trae Object.groupBy, que hace el agrupamiento por ti.
  // Comprobamos que exista porque es muy reciente.

  // TODO (en clase):
  //   1. const porCategoria = ventas.reduce((grupos, venta) => { ... }, {}):
  //      si no existe grupos[venta.categoria], créalo como array vacío;
  //      haz push del venta.producto y ⚠️ NO OLVIDES el return grupos.
  //      Imprímelo.
  //   2. Versión compacta con ?? (operador de fusión nula, "toma lo que ya hay;
  //      si es null o undefined, usa el array vacío"):
  //      grupos[venta.categoria] = (grupos[venta.categoria] ?? []).concat(venta.producto).
  //      Guárdalo en porCategoriaCompacto e imprímelo.
  //   3. Agrupar SUMANDO en lugar de listar: const facturacionPorCategoria con
  //      totales[venta.categoria] = (totales[venta.categoria] || 0) + importe,
  //      donde importe = venta.cantidad * venta.precio. Imprímelo.
  //   4. Escribe un if (typeof Object.groupBy === 'function') que imprima
  //      Object.keys(Object.groupBy(ventas, (venta) => venta.categoria)), con un
  //      else que imprima 'Este navegador aún no tiene Object.groupBy; usamos reduce'.
  //   Resultado esperado en pantalla:
  //     Agrupado por categoría -> {"Papelería":["Cuaderno A4"],"Escritura":[...],...}
  //     Facturación por categoría -> {"Papelería":42,"Escritura":99.80000000000001,...}
  //   Aquí vuelve a asomar el asunto de los decimales: Escritura da
  //   99.80000000000001. Para MOSTRARLO usaríamos toFixed(2) -> "99.80".
  //   (aprox. 22 líneas)

  // ------------------------------------------------------------
  // 4.4) CONTAR OCURRENCIAS (el "histograma" clásico)
  // ------------------------------------------------------------
  // Cuántas veces aparece cada valor en una lista. El acumulador es un objeto
  // donde cada clave es el valor y cada valor es su contador.
  // (contador[asignatura] || 0) resuelve el problema de la primera vez:
  // si aún no existe la clave, su valor es undefined y usamos 0.
  //
  // Con la tabla de iteraciones a la vista:
  //  vuelta | asignatura   | contador antes                  | contador después
  //    1    | Física       | {}                              | {Física:1}
  //    2    | Química      | {Física:1}                      | {Física:1, Química:1}
  //    3    | Física       | {Física:1, Química:1}           | {Física:2, Química:1}
  //   ...   | ...          | ...                             | ...

  // TODO (en clase):
  //   1. Declara const asignaturasImpartidas = ['Física', 'Química', 'Física',
  //      'Biología', 'Matemáticas', 'Física', 'Química'].
  //   2. const conteo = asignaturasImpartidas.reduce((contador, asignatura) => {
  //      contador[asignatura] = (contador[asignatura] || 0) + 1; return contador; }, {}).
  //      Imprímelo.
  //   3. Pásalo a texto legible: const resumenConteo = Object.entries(conteo)
  //      .map(([asignatura, veces]) => asignatura + ' x' + veces).join(', ').
  //      Imprímelo.
  //   Resultado esperado en pantalla:
  //     Conteo de asignaturas -> {"Física":3,"Química":2,"Biología":1,"Matemáticas":1}
  //     Resumen legible -> Física x3, Química x2, Biología x1, Matemáticas x1
  //   (aprox. 12 líneas)

  // ============================================================
  // 5. reduceRight(): DE DERECHA A IZQUIERDA
  // ============================================================
  // Idéntico a reduce pero empezando por el último elemento. Solo importa
  // cuando la operación NO es conmutativa, es decir, cuando el orden cambia
  // el resultado: sumar da igual, concatenar textos no.
  // Caso real de reduceRight: reconstruir una ruta de carpetas desde la más
  // profunda hasta la raíz, o deshacer una pila de cambios en orden inverso.

  // TODO (en clase):
  //   1. Abre con titulo('5. reduceRight()').
  //   2. const letras = ['a', 'b', 'c', 'd']. Imprime
  //      letras.reduce((acc, letra) => acc + letra) y
  //      letras.reduceRight((acc, letra) => acc + letra).
  //   3. Comprueba que con una suma da igual: imprime
  //      notasReduce.reduce((a, b) => a + b, 0) y
  //      notasReduce.reduceRight((a, b) => a + b, 0).
  //   4. const historial = ['abrir', 'editar', 'guardar'] y
  //      const deshacer = historial.reduceRight((texto, accion) =>
  //      texto + ' <- ' + accion, 'FIN'). Imprímelo.
  //   Resultado esperado en pantalla:
  //     reduce      -> abcd          reduceRight -> dcba
  //     Suma con reduce -> 31        Suma con reduceRight -> 31
  //     Deshacer historial -> FIN <- guardar <- editar <- abrir
  //   (aprox. 9 líneas)

  // ============================================================
  // 6. ENCADENAMIENTO: LA TUBERÍA DE DATOS (PIPELINE)
  // ============================================================
  // Como filter y map devuelven arrays, se pueden encadenar uno detrás de otro.
  // Cada método recibe el resultado del anterior. Es una CADENA DE MONTAJE:
  //     datos crudos -> filtrar -> transformar -> resumir -> resultado
  // ✅ BUENA PRÁCTICA: escribe un método por línea, alineados. Se lee como una
  // receta y cada paso se puede comentar por separado.
  //
  // ⚠️ NOTA DE RENDIMIENTO (nivel avanzado): cada eslabón de la cadena crea un
  // array intermedio. Con listas de decenas o miles de elementos es
  // irrelevante; con millones, un solo bucle for sería más eficiente.
  // ✅ Prioriza SIEMPRE la legibilidad y optimiza solo si mides un problema real.

  // TODO (en clase):
  //   1. Abre con titulo('6. ENCADENAMIENTO: filter + map + reduce').
  //   2. Escribe la tubería completa, UN MÉTODO POR LÍNEA, en
  //      const facturacionEscritura:
  //        .filter((venta) => venta.categoria === 'Escritura')   // 1. Solo esa categoría.
  //        .map((venta) => venta.cantidad * venta.precio)        // 2. Importe de cada línea.
  //        .reduce((total, importe) => total + importe, 0)       // 3. Suma de todos.
  //      Imprime facturacionEscritura.toFixed(2) + ' EUR'.
  //   3. Repite la MISMA tubería partida en tres pasos (paso1, paso2, paso3)
  //      imprimiendo cada uno, para explicarla en la pizarra.
  //   4. Otra tubería: const destacados = ventas
  //      .filter((venta) => venta.cantidad * venta.precio > 50)
  //      .map((venta) => venta.producto.toUpperCase())
  //      .join(', '). Imprímelo.
  //   5. Y una más: const preciosEscritura = ventas.filter(...Escritura...)
  //      .map((venta) => venta.precio); después calcula el promedio dividiendo
  //      su reduce entre preciosEscritura.length e imprime toFixed(2) + ' EUR'.
  //   6. Cierra el archivo con
  //      imprimir('\nFin de la sección 3. Continúa en la sección 4.').
  //   Resultado esperado en pantalla:
  //     Facturación de Escritura -> 99.80 EUR
  //     Paso 1 (filter) -> 3 líneas: ["Lápiz HB","Bolígrafo azul","Marcador"]
  //     Paso 2 (map) -> [32,30,37.800000000000004]
  //     Paso 3 (reduce) -> 99.80
  //     Ventas de más de 50 EUR -> CALCULADORA
  //     Precio medio en Escritura -> 1.37 EUR
  //   (aprox. 22 líneas)

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
