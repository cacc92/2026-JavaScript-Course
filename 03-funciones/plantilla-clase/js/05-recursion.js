/**
 * ============================================================
 * ARCHIVO: js/05-recursion.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: funciones que se llaman a sí mismas.
 *
 * QUÉ SE APRENDE AQUÍ:
 *   1. Qué es la recursión y sus dos piezas obligatorias:
 *      CASO BASE y CASO RECURSIVO.
 *   2. Conteo regresivo paso a paso.
 *   3. Factorial: versión iterativa vs versión recursiva.
 *   4. Fibonacci, por qué la versión ingenua es lentísima y
 *      cómo arreglarla con memoización (¡otra vez los closures!).
 *   5. Qué ocurre EXACTAMENTE si falta el caso base.
 *   6. Un caso real donde la recursión gana de calle: recorrer
 *      estructuras anidadas (categorías, carpetas, comentarios).
 *   7. Demo interactiva conectada a la página.
 * ============================================================
 */

// La IIFE ya viene escrita: aísla las variables de este archivo.
(function () {
  'use strict';

  // Andamiaje ya escrito: consola visual del <pre id="salida-05">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-05');

  // ============================================================
  // 1. LA IDEA: CASO BASE Y CASO RECURSIVO
  // ============================================================

  /*
   * Una función RECURSIVA es una función que se llama a sí misma
   * con un problema un poquito más pequeño, hasta llegar a un caso
   * tan simple que se puede resolver sin volver a llamarse.
   *
   * Toda recursión necesita DOS piezas:
   *
   *   1. CASO BASE      -> la condición de parada. El escalón final.
   *   2. CASO RECURSIVO -> la llamada a sí misma con datos MÁS PEQUEÑOS,
   *                        acercándose siempre al caso base.
   *
   * Analogía: bajar una escalera. El caso recursivo es "baja un
   * escalón y repite"; el caso base es "si ya estás en el suelo, para".
   * Sin caso base seguirías bajando... y te caes (error de pila).
   *
   * (Esta sección es solo teoría: no hay nada que teclear.)
   */

  // ============================================================
  // 2. CONTEO REGRESIVO
  // ============================================================

  // TODO (en clase):
  //   1. titulo('2. Conteo regresivo (la recursión más simple)').
  //   2. Escribe function cuentaAtras(numero) con las dos piezas:
  //        - CASO BASE: if (numero <= 0) { imprimir('   ¡Despegue!'); return; }
  //          (un return vacío, solo para salir)
  //        - trabajo de este escalón: imprimir('   ' + numero + '...')
  //        - CASO RECURSIVO: cuentaAtras(numero - 1);
  //   3. Llámala con cuentaAtras(5).
  //   Resultado esperado en pantalla:
  //      5...
  //      4...
  //      3...
  //      2...
  //      1...
  //      ¡Despegue!
  //   (aprox. 10 líneas)

  /*
   * ¿Qué ha pasado por dentro?
   *
   *   cuentaAtras(5) -> imprime 5 y llama a cuentaAtras(4)
   *     cuentaAtras(4) -> imprime 4 y llama a cuentaAtras(3)
   *       cuentaAtras(3) -> imprime 3 y llama a cuentaAtras(2)
   *         cuentaAtras(2) -> imprime 2 y llama a cuentaAtras(1)
   *           cuentaAtras(1) -> imprime 1 y llama a cuentaAtras(0)
   *             cuentaAtras(0) -> CASO BASE: imprime ¡Despegue! y vuelve
   *
   * Cada llamada queda "esperando" a que termine la de dentro. Esa pila
   * de llamadas pendientes se llama CALL STACK (pila de llamadas).
   */

  // ============================================================
  // 3. FACTORIAL: ITERATIVO VS RECURSIVO
  // ============================================================

  /*
   * El factorial de n (se escribe n!) es la multiplicación de todos
   * los enteros de 1 a n:
   *
   *     5! = 5 x 4 x 3 x 2 x 1 = 120
   *
   * Y su definición matemática ya es recursiva:
   *
   *     n! = n x (n-1)!      y      0! = 1
   *
   * Por eso el código recursivo se parece tanto a la fórmula.
   */

  // TODO (en clase):
  //   1. titulo('3. Factorial: dos formas de resolver lo mismo').
  //   2. Versión ITERATIVA: function factorialIterativo(n) con
  //      let resultado = 1 y for (let i = 2; i <= n; i++) resultado *= i.
  //   3. Versión RECURSIVA: function factorialRecursivo(n) con
  //        - guarda de seguridad: if (n < 0) return
  //          'No existe el factorial de un número negativo';
  //          (sin ella, un negativo nunca alcanzaría el caso base)
  //        - CASO BASE: if (n <= 1) return 1;
  //        - CASO RECURSIVO: return n * factorialRecursivo(n - 1);
  //   4. Imprime factorialIterativo(5), factorialRecursivo(5),
  //      factorialRecursivo(0), factorialRecursivo(10) y factorialRecursivo(-3).
  //   Resultado esperado en pantalla:
  //      factorialIterativo(5) -> 120
  //      factorialRecursivo(5) -> 120
  //      factorialRecursivo(0) -> 1
  //      factorialRecursivo(10) -> 3628800
  //      factorialRecursivo(-3) -> No existe el factorial de un número negativo
  //   (aprox. 16 líneas)

  // TODO (en clase):
  //   1. Desglose visual para la pizarra: function factorialExplicado(n) que
  //      devuelva '1' como caso base y, si no, n + ' x ' + factorialExplicado(n - 1).
  //   2. imprimir('5! se desarrolla como ->',
  //        factorialExplicado(5) + ' = ' + factorialRecursivo(5));
  //   Resultado esperado en pantalla:
  //      5! se desarrolla como -> 5 x 4 x 3 x 2 x 1 = 120
  //   (aprox. 5 líneas)

  // ⚠️ Los números crecen MUY rápido. A partir de 171! JavaScript
  // devuelve Infinity porque supera el mayor número que puede representar.

  // TODO (en clase):
  //   1. imprimir('factorialRecursivo(171) ->', factorialRecursivo(171));
  //   Resultado esperado en pantalla: factorialRecursivo(171) -> Infinity
  //   (aprox. 1 línea)

  // ============================================================
  // 4. FIBONACCI
  // ============================================================

  /*
   * La sucesión de Fibonacci empieza con 0 y 1, y cada número es la
   * suma de los dos anteriores:
   *
   *     0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...
   *
   * Definición recursiva:
   *     fib(0) = 0
   *     fib(1) = 1
   *     fib(n) = fib(n-1) + fib(n-2)
   *
   * Aquí hay DOS casos base y DOS llamadas recursivas.
   */

  // TODO (en clase):
  //   1. titulo('4. Fibonacci: elegante pero tramposo').
  //   2. Declara el contador de medición ANTES de la función:
  //      let llamadasFibonacci = 0;   (se reutiliza en la demo de la sección 7)
  //   3. Escribe la versión INGENUA, function fibonacci(n):
  //        - la primera línea del cuerpo incrementa llamadasFibonacci += 1
  //        - CASOS BASE: if (n <= 0) return 0;  if (n === 1) return 1;
  //        - CASO RECURSIVO: return fibonacci(n - 1) + fibonacci(n - 2);
  //   4. Construye const primerosDiez = [] con un for de 0 a 9 que haga
  //      push de fibonacci(i), e imprime primerosDiez.join(', ').
  //   5. Mide el problema: pon llamadasFibonacci = 0, calcula fibonacci(20)
  //      e imprime valor y llamadas. Repite lo mismo con fibonacci(25).
  //   Resultado esperado en pantalla:
  //      Primeros 10 números -> 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
  //      fibonacci(20) = 6765 | llamadas realizadas: 21891
  //      fibonacci(25) = 75025 | llamadas realizadas: 242785
  //   (aprox. 20 líneas)

  // ⚠️ ERROR COMÚN: usar esta versión con números grandes.
  // Cada +5 en n multiplica el trabajo por más de 10. Con n = 45 el
  // navegador se queda bloqueado varios segundos. NO lo pruebes en clase
  // sin avisar.

  /*
   * SOLUCIÓN: MEMOIZACIÓN.
   * El problema es que fibonacci(20) calcula fibonacci(18) muchísimas
   * veces. Si guardamos cada resultado la primera vez que lo obtenemos,
   * las siguientes veces lo leemos de la caché.
   *
   * ¿Dónde guardamos la caché? En un CLOSURE, igual que en la sección 3.
   */

  // TODO (en clase):
  //   1. Escribe function crearFibonacciMemoizado(), una FÁBRICA que devuelve
  //      una función fibonacci con su propia caché privada. La hacemos fábrica
  //      (y no una función suelta) para poder MEDIR con la caché vacía cada vez.
  //   2. Dentro, privadas: const cache = {}; y let llamadas = 0;
  //   3. Dentro, function fib(n):
  //        - llamadas += 1
  //        - if (n <= 0) return 0;  if (n === 1) return 1;
  //        - if (n in cache) return cache[n];   <- lo que cambia todo
  //        - cache[n] = fib(n - 1) + fib(n - 2); return cache[n];
  //   4. Cuelga dos ayudantes DE LA PROPIA FUNCIÓN (una función también es
  //      un objeto y admite propiedades):
  //        fib.contarLlamadas = function () { return llamadas; };
  //        fib.reiniciarContador = function () { llamadas = 0; };
  //      y devuelve fib.
  //   5. Crea const fibonacciRapido = crearFibonacciMemoizado(); e imprime
  //      fibonacciRapido(25) junto a fibonacciRapido.contarLlamadas().
  //   6. Reinicia el contador, vuelve a pedir el MISMO valor e imprímelo:
  //      ahora lo lee de la caché.
  //   7. Crea otra memoizada nueva (fibonacciGrande) y pide el 70.
  //   Resultado esperado en pantalla:
  //      fibonacciRapido(25) = 75025 | llamadas: 49
  //      fibonacciRapido(25) otra vez = 75025 | llamadas: 1
  //      fibonacciGrande(70) = 190392490709135 | llamadas: 139
  //   (aprox. 30 líneas)

  // Con caché son 139 llamadas (2n - 1). La versión ingenua necesitaría
  // 2 x fib(71) - 1, es decir más de 600 BILLONES de llamadas (6 x 10^14):
  // no terminaría ni dejándola corriendo años. Esta responde al instante.

  // ============================================================
  // 5. ¿QUÉ PASA SI FALTA EL CASO BASE?
  // ============================================================

  /*
   * Sin caso base, la función se llama a sí misma para siempre.
   * Cada llamada ocupa un hueco en la pila de llamadas, que tiene un
   * tamaño limitado (unas 10.000 llamadas, según el navegador).
   * Cuando se llena, el navegador corta la ejecución con el error:
   *
   *     RangeError: Maximum call stack size exceeded
   *
   * Es el equivalente recursivo del bucle infinito.
   */

  // ⚠️ EJEMPLO DE LO QUE NO SE DEBE HACER (falta el caso base).
  // Nota técnica para el docente: guarda el resultado en una variable en
  // lugar de escribir `return sinCasoBase(n - 1);` directamente. Así la
  // llamada no queda en "posición final" y todos los navegadores acumulan
  // la pila y lanzan el error (Safari optimiza las llamadas finales y se
  // quedaría dando vueltas para siempre, colgando la página).

  // TODO (en clase):
  //   1. titulo('5. Sin caso base: desbordamiento de la pila').
  //   2. Escribe function sinCasoBase(n) SIN ningún if de parada:
  //        const resultadoParcial = sinCasoBase(n - 1);
  //        return resultadoParcial;
  //   3. Llámala dentro de try { sinCasoBase(5); } catch (error) { ... }
  //      e imprime en el catch, en tres líneas:
  //        '   Error capturado ->' + error.name
  //        '   Mensaje ->' + error.message
  //        '   Traducción: se llenó la pila de llamadas pendientes.'
  //   Resultado esperado en pantalla:
  //      Error capturado -> RangeError
  //      Mensaje -> Maximum call stack size exceeded
  //      Traducción: se llenó la pila de llamadas pendientes.
  //   (aprox. 12 líneas)

  // TODO (en clase):
  //   1. Un caso más sutil: SÍ hay caso base, pero nunca se alcanza porque
  //      el problema no se hace más pequeño. Escribe function nuncaLlegaAlBase(n):
  //        if (n === 0) return 'Fin';
  //        const resultadoParcial = nuncaLlegaAlBase(n);   // ⚠️ n no cambia nunca
  //        return resultadoParcial;
  //   2. Llámala con nuncaLlegaAlBase(3) dentro de try/catch e imprime
  //      '   Con caso base pero sin acercarse a él ->' + error.name.
  //   Resultado esperado en pantalla:
  //      Con caso base pero sin acercarse a él -> RangeError
  //   (aprox. 10 líneas)

  // ✅ BUENA PRÁCTICA: antes de escribir el caso recursivo, pregúntate
  // siempre dos cosas: ¿cuándo paro? y ¿el problema se hace más pequeño
  // en cada llamada?

  // ============================================================
  // 6. RECURSIÓN EN LA VIDA REAL: ESTRUCTURAS ANIDADAS
  // ============================================================

  /*
   * La recursión brilla cuando el DATO tiene forma de árbol y no sabes
   * cuántos niveles de profundidad tiene: carpetas dentro de carpetas,
   * comentarios con respuestas, menús con submenús...
   *
   * Con bucles necesitarías un for anidado por cada nivel, y no sabes
   * cuántos hay. Con recursión, da igual: tres niveles o veinte.
   */

  // DATOS DE PARTIDA (ya escritos: teclear este árbol en clase es tiempo perdido).
  const catalogo = {
    nombre: 'Tienda',
    productos: 0,
    subcategorias: [
      {
        nombre: 'Informática',
        productos: 3,
        subcategorias: [
          { nombre: 'Portátiles', productos: 12, subcategorias: [] },
          {
            nombre: 'Periféricos',
            productos: 5,
            subcategorias: [
              { nombre: 'Teclados', productos: 8, subcategorias: [] },
              { nombre: 'Ratones', productos: 6, subcategorias: [] }
            ]
          }
        ]
      },
      {
        nombre: 'Mobiliario',
        productos: 2,
        subcategorias: [
          { nombre: 'Sillas', productos: 9, subcategorias: [] }
        ]
      }
    ]
  };

  // TODO (en clase):
  //   1. titulo('6. Recorrer un árbol de categorías').
  //   2. Escribe function mostrarArbol(categoria, nivel = 0):
  //        - const sangria = '   ' + '|  '.repeat(nivel);
  //        - imprimir(sangria + '+- ' + categoria.nombre + ' (' + categoria.productos + ')');
  //        - CASO RECURSIVO: categoria.subcategorias.forEach(function (hija) {
  //            mostrarArbol(hija, nivel + 1); });
  //          Si `subcategorias` está vacío el forEach no hace nada: ese es el
  //          caso base, y aquí aparece de forma natural.
  //   3. Llámala con mostrarArbol(catalogo).
  //   Resultado esperado en pantalla: el árbol con sangría, empezando por
  //   "+- Tienda (0)" y terminando por "+- Sillas (9)".
  //   (aprox. 8 líneas)

  // TODO (en clase):
  //   1. Escribe function contarProductos(categoria) que empiece con
  //      let total = categoria.productos y sume, con un for...of sobre
  //      categoria.subcategorias, lo que devuelva contarProductos(hija).
  //   2. imprimir('Total de productos en todo el catálogo ->', contarProductos(catalogo));
  //   Resultado esperado en pantalla:
  //      Total de productos en todo el catálogo -> 45
  //   (aprox. 8 líneas)

  // TODO (en clase):
  //   1. Escribe function calcularProfundidad(categoria):
  //        - CASO BASE: if (categoria.subcategorias.length === 0) return 1;  (una hoja)
  //        - recorre las hijas con Math.max(maxima, calcularProfundidad(hija))
  //          y devuelve maxima + 1.
  //   2. imprimir('Profundidad del catálogo ->', calcularProfundidad(catalogo) + ' niveles');
  //   Resultado esperado en pantalla:
  //      Profundidad del catálogo -> 4 niveles
  //   (aprox. 9 líneas)

  // TODO (en clase):
  //   1. Bonus: function listarNombres(categoria) que aplane el árbol en una
  //      lista simple. Empieza con let nombres = [categoria.nombre]; y en cada
  //      hija haz nombres = nombres.concat(listarNombres(hija)).
  //   2. imprimir('Aplanado ->', listarNombres(catalogo).join(' / '));
  //   Resultado esperado en pantalla:
  //      Aplanado -> Tienda / Informática / Portátiles / Periféricos / Teclados / Ratones / Mobiliario / Sillas
  //   (aprox. 8 líneas)

  // ============================================================
  // 7. DEMO INTERACTIVA (conectada a los botones de la página)
  // ============================================================

  /*
   * Enganchamos las funciones anteriores a la interfaz. Fíjate en que
   * addEventListener recibe una FUNCIÓN como segundo argumento: es un
   * callback, exactamente lo que estudiamos en el archivo 04.
   *
   * Los elementos de la página YA EXISTEN en el HTML: son
   *   #fib-numero     -> <input type="number">
   *   #fib-boton      -> el botón "Calcular Fibonacci"
   *   #fib-resultado  -> el panel donde se escribe el resultado
   */

  // ✅ BUENA PRÁCTICA: nunca des por hecho que un elemento está en el DOM.

  // TODO (en clase):
  //   1. Localiza los tres elementos con document.getElementById:
  //        const campoNumero = ... 'fib-numero'
  //        const botonCalcular = ... 'fib-boton'
  //        const panelResultado = ... 'fib-resultado'
  //   2. Envuélvelo TODO en if (campoNumero && botonCalcular && panelResultado) { }
  //      y dentro haz botonCalcular.addEventListener('click', function () { ... });
  //   3. Dentro del callback del clic:
  //        a) const n = Number(campoNumero.value);   (el valor de un input es TEXTO)
  //        b) Validación: si !Number.isInteger(n) || n < 0 ->
  //           panelResultado.textContent = 'Escribe un número entero positivo.'; return;
  //           si n > 30 -> 'Máximo 30: la versión ingenua bloquearía el navegador.'; return;
  //        c) Ayuda de singular/plural:
  //           const enLlamadas = (cantidad) => cantidad + (cantidad === 1 ? ' llamada' : ' llamadas');
  //        d) Versión ingenua: pon llamadasFibonacci = 0, mide con
  //           performance.now() antes y después de fibonacci(n), y guarda
  //           el valor, los ms y llamadasFibonacci.
  //        e) Versión memoizada: crea una NUEVA con crearFibonacciMemoizado()
  //           en cada clic (así la caché empieza vacía y la comparación es
  //           justa), mídela igual y lee memoizada.contarLlamadas().
  //        f) Tercera medida: memoizada.reiniciarContador(), vuelve a llamarla
  //           con el mismo n y lee de nuevo contarLlamadas().
  //        g) Escribe el resultado en el panel:
  //           panelResultado.textContent = 'fibonacci(' + n + ') = ' + valor;
  //        h) Vuelca las tres medidas a la consola visual con
  //           titulo('Demo interactiva: fibonacci(' + n + ')') y cuatro imprimir():
  //           'Resultado ->', 'Ingenua            -> ', 'Con caché (vacía)  -> '
  //           y 'Con caché (llena)  -> ... (ya lo tenía calculado)'.
  //        i) Si las dos cuentas son mayores que 0, calcula
  //           Math.round(llamadasIngenua / llamadasRapida) e imprime
  //           'La memoización hizo X veces menos trabajo.'
  //   Resultado esperado en pantalla al pulsar con el 20: el panel muestra
  //   "fibonacci(20) = 6765" y la consola, 21891 llamadas de la ingenua
  //   frente a 39 de la memoizada (y 1 con la caché llena).
  //   (aprox. 45 líneas)

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // 1) (Fácil) Escribe sumarHasta(n) que devuelva 1 + 2 + ... + n de
  //    forma recursiva. Comprueba que sumarHasta(10) da 55.
  //
  // 2) (Fácil) Escribe contarHaciaArriba(desde, hasta) que imprima los
  //    números en orden ascendente usando recursión (no un bucle).
  //
  // 3) (Media) Escribe invertirTexto(texto) de forma recursiva:
  //    "hola" debe devolver "aloh". Pista: el caso base es el texto
  //    vacío o de un solo carácter.
  //
  // 4) (Media) Escribe esPalindromo(texto) usando recursión: compara
  //    el primer y el último carácter y repite con lo de en medio.
  //    Prueba con "reconocer" y con "javascript".
  //
  // 5) (Difícil) Escribe buscarCategoria(nodo, nombre) que recorra el
  //    `catalogo` y devuelva el objeto de la categoría con ese nombre,
  //    o null si no existe. Debe funcionar a cualquier profundidad.
  //
  // 6) (Difícil) Escribe aplanarArray(array) que convierta
  //    [1, [2, [3, [4]], 5]] en [1, 2, 3, 4, 5] sin usar .flat().
  //    Pista: Array.isArray() te dice si un elemento es otro array.
  // ============================================================
})();
