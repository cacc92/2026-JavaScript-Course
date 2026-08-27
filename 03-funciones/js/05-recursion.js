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

(function () {
  'use strict';

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
   */

  // ============================================================
  // 2. CONTEO REGRESIVO
  // ============================================================

  titulo('2. Conteo regresivo (la recursión más simple)');

  /**
   * cuentaAtras(): imprime desde n hasta 1 y termina con "¡Despegue!".
   * @param {number} numero
   */
  function cuentaAtras(numero) {
    // CASO BASE: cuando llegamos a 0 dejamos de llamarnos.
    if (numero <= 0) {
      imprimir('   ¡Despegue!');
      return;   // return vacío: solo sirve para salir
    }

    // Trabajo de este escalón.
    imprimir('   ' + numero + '...');

    // CASO RECURSIVO: la misma función, con un problema más pequeño.
    cuentaAtras(numero - 1);
  }

  cuentaAtras(5);

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

  titulo('3. Factorial: dos formas de resolver lo mismo');

  /** Versión ITERATIVA: con un bucle de toda la vida. */
  function factorialIterativo(n) {
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
      resultado *= i;
    }
    return resultado;
  }

  /** Versión RECURSIVA: se lee casi igual que la fórmula matemática. */
  function factorialRecursivo(n) {
    // ⚠️ Guarda de seguridad: sin esto, un número negativo provocaría
    // llamadas infinitas (nunca alcanzaría el caso base).
    if (n < 0) return 'No existe el factorial de un número negativo';

    // CASO BASE: 0! y 1! valen 1.
    if (n <= 1) return 1;

    // CASO RECURSIVO
    return n * factorialRecursivo(n - 1);
  }

  imprimir('factorialIterativo(5) ->', factorialIterativo(5));   // 120
  imprimir('factorialRecursivo(5) ->', factorialRecursivo(5));   // 120
  imprimir('factorialRecursivo(0) ->', factorialRecursivo(0));   // 1
  imprimir('factorialRecursivo(10) ->', factorialRecursivo(10)); // 3628800
  imprimir('factorialRecursivo(-3) ->', factorialRecursivo(-3));

  // Desglose visual de la resolución, para verlo en la pizarra.
  function factorialExplicado(n) {
    if (n <= 1) return '1';
    return n + ' x ' + factorialExplicado(n - 1);
  }
  imprimir('5! se desarrolla como ->', factorialExplicado(5) + ' = ' + factorialRecursivo(5));

  // ⚠️ Los números crecen MUY rápido. A partir de 171! JavaScript
  // devuelve Infinity porque supera el mayor número que puede representar.
  imprimir('factorialRecursivo(171) ->', factorialRecursivo(171)); // Infinity

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

  titulo('4. Fibonacci: elegante pero tramposo');

  // Contador para medir cuántas veces se ejecuta la función.
  let llamadasFibonacci = 0;

  /** Versión INGENUA: preciosa de leer, terrible de rendimiento. */
  function fibonacci(n) {
    llamadasFibonacci += 1;

    // CASOS BASE
    if (n <= 0) return 0;
    if (n === 1) return 1;

    // CASO RECURSIVO: dos llamadas por cada una
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const primerosDiez = [];
  for (let i = 0; i < 10; i++) {
    primerosDiez.push(fibonacci(i));
  }
  imprimir('Primeros 10 números ->', primerosDiez.join(', '));

  // Medimos el problema: contamos las llamadas para un valor concreto.
  llamadasFibonacci = 0;
  const resultado20 = fibonacci(20);
  imprimir('fibonacci(20) =', resultado20, '| llamadas realizadas:', llamadasFibonacci);

  llamadasFibonacci = 0;
  const resultado25 = fibonacci(25);
  imprimir('fibonacci(25) =', resultado25, '| llamadas realizadas:', llamadasFibonacci);

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

  /**
   * crearFibonacciMemoizado(): FÁBRICA que devuelve una función
   * fibonacci con su propia caché privada.
   *
   * La hacemos fábrica (y no una única función suelta) por un motivo
   * muy práctico: cada vez que queramos MEDIR de forma honesta cuánto
   * trabajo cuesta un cálculo, necesitamos una caché vacía. Si
   * reutilizásemos siempre la misma, el segundo cálculo daría siempre
   * "1 llamada" y no se vería la comparación.
   */
  function crearFibonacciMemoizado() {
    const cache = {};        // memoria privada, invisible desde fuera
    let llamadas = 0;

    function fib(n) {
      llamadas += 1;
      if (n <= 0) return 0;
      if (n === 1) return 1;

      // ¿Ya lo calculamos antes? Lo devolvemos sin recalcular.
      if (n in cache) return cache[n];

      cache[n] = fib(n - 1) + fib(n - 2);
      return cache[n];
    }

    // Colgamos un par de ayudantes de la propia función, aprovechando
    // que una función también es un objeto y admite propiedades.
    fib.contarLlamadas = function () {
      return llamadas;
    };
    fib.reiniciarContador = function () {
      llamadas = 0;
    };
    return fib;
  }

  const fibonacciRapido = crearFibonacciMemoizado();

  imprimir('fibonacciRapido(25) =', fibonacciRapido(25),
    '| llamadas:', fibonacciRapido.contarLlamadas());   // 49 frente a 242785

  // Segunda llamada al MISMO valor: ya está en la caché.
  fibonacciRapido.reiniciarContador();
  imprimir('fibonacciRapido(25) otra vez =', fibonacciRapido(25),
    '| llamadas:', fibonacciRapido.contarLlamadas());   // 1: lo lee de la caché

  // Y un número que la versión ingenua no terminaría nunca.
  const fibonacciGrande = crearFibonacciMemoizado();
  imprimir('fibonacciGrande(70) =', fibonacciGrande(70),
    '| llamadas:', fibonacciGrande.contarLlamadas());
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

  titulo('5. Sin caso base: desbordamiento de la pila');

  /** ⚠️ EJEMPLO DE LO QUE NO SE DEBE HACER (falta el caso base). */
  function sinCasoBase(n) {
    // Falta el if que detenga la recursión.
    // Nota técnica: guardamos el resultado en una variable en lugar de
    // escribir `return sinCasoBase(n - 1);` directamente. Así la llamada
    // no queda en "posición final" y todos los navegadores acumulan la
    // pila y lanzan el error (Safari optimiza las llamadas finales y
    // se quedaría dando vueltas para siempre, colgando la página).
    const resultadoParcial = sinCasoBase(n - 1);
    return resultadoParcial;
  }

  // Lo ejecutamos dentro de try/catch para poder enseñar el error
  // sin que la página se rompa.
  try {
    sinCasoBase(5);
  } catch (error) {
    imprimir('   Error capturado ->', error.name);
    imprimir('   Mensaje ->', error.message);
    imprimir('   Traducción: se llenó la pila de llamadas pendientes.');
  }

  // Un caso más sutil: SÍ hay caso base, pero nunca se alcanza porque
  // el problema no se hace más pequeño.
  function nuncaLlegaAlBase(n) {
    if (n === 0) return 'Fin';
    // ⚠️ n no cambia nunca: el caso base de arriba jamás se cumple.
    const resultadoParcial = nuncaLlegaAlBase(n);
    return resultadoParcial;
  }

  try {
    nuncaLlegaAlBase(3);
  } catch (error) {
    imprimir('   Con caso base pero sin acercarse a él ->', error.name);
  }

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

  titulo('6. Recorrer un árbol de categorías');

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

  /**
   * mostrarArbol(): imprime la estructura con sangría según el nivel.
   * @param {Object} categoria - nodo actual
   * @param {number} [nivel=0] - profundidad, para calcular la sangría
   */
  function mostrarArbol(categoria, nivel = 0) {
    const sangria = '   ' + '|  '.repeat(nivel);
    imprimir(sangria + '+- ' + categoria.nombre + ' (' + categoria.productos + ')');

    // CASO RECURSIVO: repetimos lo mismo con cada hijo, un nivel más adentro.
    // Si `subcategorias` está vacío, el forEach no hace nada: ese es el
    // caso base, y aquí aparece de forma natural.
    categoria.subcategorias.forEach(function (hija) {
      mostrarArbol(hija, nivel + 1);
    });
  }

  mostrarArbol(catalogo);

  /** contarProductos(): suma los productos de TODO el árbol. */
  function contarProductos(categoria) {
    let total = categoria.productos;
    for (const hija of categoria.subcategorias) {
      total += contarProductos(hija);   // suma lo que devuelva cada rama
    }
    return total;
  }

  imprimir('Total de productos en todo el catálogo ->', contarProductos(catalogo)); // 45

  /** calcularProfundidad(): cuántos niveles tiene el árbol. */
  function calcularProfundidad(categoria) {
    if (categoria.subcategorias.length === 0) return 1;   // CASO BASE: una hoja

    let maxima = 0;
    for (const hija of categoria.subcategorias) {
      maxima = Math.max(maxima, calcularProfundidad(hija));
    }
    return maxima + 1;
  }

  imprimir('Profundidad del catálogo ->', calcularProfundidad(catalogo) + ' niveles'); // 4

  // Bonus: aplanar el árbol en una lista simple de nombres.
  function listarNombres(categoria) {
    let nombres = [categoria.nombre];
    for (const hija of categoria.subcategorias) {
      nombres = nombres.concat(listarNombres(hija));
    }
    return nombres;
  }

  imprimir('Aplanado ->', listarNombres(catalogo).join(' / '));

  // ============================================================
  // 7. DEMO INTERACTIVA (conectada a los botones de la página)
  // ============================================================

  /*
   * Enganchamos las funciones anteriores a la interfaz. Fíjate en que
   * addEventListener recibe una FUNCIÓN como segundo argumento: es un
   * callback, exactamente lo que estudiamos en el archivo 04.
   */

  const campoNumero = document.getElementById('fib-numero');
  const botonCalcular = document.getElementById('fib-boton');
  const panelResultado = document.getElementById('fib-resultado');

  // Comprobamos que los elementos existen antes de usarlos.
  // ✅ BUENA PRÁCTICA: nunca des por hecho que un elemento está en el DOM.
  if (campoNumero && botonCalcular && panelResultado) {
    botonCalcular.addEventListener('click', function () {
      // El valor de un input SIEMPRE llega como texto: hay que convertirlo.
      const n = Number(campoNumero.value);

      // Validación: número entero, no negativo y con un tope de seguridad.
      if (!Number.isInteger(n) || n < 0) {
        panelResultado.textContent = 'Escribe un número entero positivo.';
        return;
      }
      if (n > 30) {
        panelResultado.textContent = 'Máximo 30: la versión ingenua bloquearía el navegador.';
        return;
      }

      // Pequeña ayuda para que el texto concuerde en singular y plural.
      const enLlamadas = (cantidad) => cantidad + (cantidad === 1 ? ' llamada' : ' llamadas');

      // --- Versión ingenua ---
      llamadasFibonacci = 0;
      const inicioIngenua = performance.now();
      const valor = fibonacci(n);
      const msIngenua = performance.now() - inicioIngenua;
      const llamadasIngenua = llamadasFibonacci;

      // --- Versión memoizada ---
      // Creamos una memoizada NUEVA en cada clic. Así la caché empieza
      // vacía y la comparación es justa: si reutilizásemos siempre la
      // misma, a partir del segundo clic diría "1 llamada" y parecería
      // trampa.
      const memoizada = crearFibonacciMemoizado();
      const inicioRapida = performance.now();
      memoizada(n);
      const msRapida = performance.now() - inicioRapida;
      const llamadasRapida = memoizada.contarLlamadas();

      // --- Tercera medida: la misma memoizada, con la caché ya caliente ---
      memoizada.reiniciarContador();
      memoizada(n);
      const llamadasRepetida = memoizada.contarLlamadas();

      panelResultado.textContent = 'fibonacci(' + n + ') = ' + valor;

      titulo('Demo interactiva: fibonacci(' + n + ')');
      imprimir('Resultado ->', valor);
      imprimir('Ingenua            -> ' + enLlamadas(llamadasIngenua) + ' en ' + msIngenua.toFixed(2) + ' ms');
      imprimir('Con caché (vacía)  -> ' + enLlamadas(llamadasRapida) + ' en ' + msRapida.toFixed(2) + ' ms');
      imprimir('Con caché (llena)  -> ' + enLlamadas(llamadasRepetida) + ' (ya lo tenía calculado)');

      if (llamadasIngenua > 0 && llamadasRapida > 0) {
        const vecesMenos = Math.round(llamadasIngenua / llamadasRapida);
        imprimir('La memoización hizo ' + vecesMenos + ' veces menos trabajo.');
      }
    });
  }

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
