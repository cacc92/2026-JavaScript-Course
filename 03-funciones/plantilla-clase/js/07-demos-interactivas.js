/**
 * ============================================================
 * ARCHIVO: js/07-demos-interactivas.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: poner en práctica TODO lo anterior en dos demos reales
 *       conectadas a los botones de la página.
 *
 * DEMO 1 · CALCULADORA CONSTRUIDA CON FUNCIONES
 *   Los operadores viven dentro de un OBJETO DE FUNCIONES. Elegir
 *   una operación es simplemente leer una propiedad de ese objeto.
 *   Demuestra que una función es un valor más (archivo 01).
 *
 * DEMO 2 · CONTADOR CON CLOSURE
 *   La variable que guarda la cuenta es PRIVADA: no existe forma de
 *   leerla ni de modificarla desde fuera. Demuestra los closures
 *   (archivo 03) y el patrón módulo.
 *
 * DEMO 3 · alert() y prompt() bajo demanda
 *   Se ejecutan SOLO al pulsar un botón, nunca al cargar la página,
 *   porque bloquean el navegador hasta que el usuario responde.
 * ============================================================
 */

// La IIFE ya viene escrita: aísla las variables de este archivo.
(function () {
  'use strict';

  // Andamiaje ya escrito: consola visual del <pre id="salida-07">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-07');

  // ============================================================
  // DEMO 1 · CALCULADORA CON UN OBJETO DE FUNCIONES
  // ============================================================

  /*
   * La idea clave: en lugar de una cadena interminable de
   *
   *     if (operador === '+') ... else if (operador === '-') ...
   *
   * guardamos cada operación como una FUNCIÓN dentro de un objeto,
   * usando el símbolo como clave. Para ejecutar la que toque solo
   * hay que buscarla por su clave:
   *
   *     operaciones['+'](2, 3)   ->   5
   *
   * Ventajas:
   *   - Añadir una operación nueva es añadir UNA línea, sin tocar
   *     el resto del código (principio abierto/cerrado).
   *   - El <select> de la página se construye solo a partir de las
   *     claves del objeto: la interfaz nunca se desincroniza.
   */

  // TODO (en clase):
  //   1. Declara const operaciones = { ... } con SEIS entradas. Cada valor es
  //      una función CON NOMBRE (function sumar, no anónima) para poder mostrar
  //      su .name en la interfaz. Todas son PURAS: dos números entran, uno sale.
  //        '+'  -> function sumar(a, b) { return a + b; }
  //        '-'  -> function restar(a, b) { return a - b; }
  //        '*'  -> function multiplicar(a, b) { return a * b; }
  //        '/'  -> function dividir(a, b) { return a / b; }
  //        '%'  -> function resto(a, b) { return a % b; }
  //        '**' -> function potencia(a, b) { return a ** b; }
  //   2. Insiste: aquí no hay un solo if. Elegir la operación será leer
  //      una propiedad.
  //   (aprox. 8 líneas)

  // Los elementos de la calculadora YA EXISTEN en el HTML:
  //   #calc-a          <input type="number">   primer número
  //   #calc-b          <input type="number">   segundo número
  //   #calc-operador   <select>  VACÍO a propósito: lo rellena el JavaScript
  //   #calc-calcular   botón "Calcular"
  //   #calc-resultado  panel de resultado
  //   #calc-historial  <ul> del historial
  //   #calc-limpiar    botón "Limpiar historial"

  // TODO (en clase):
  //   1. Localiza los siete elementos UNA SOLA VEZ con document.getElementById,
  //      guardándolos en: campoA, campoB, selectorOperador, botonCalcular,
  //      panelResultado, listaHistorial y botonLimpiarHistorial.
  //   (aprox. 7 líneas)

  // TODO (en clase):
  //   1. Escribe function rellenarSelector() que cree una <option> por cada
  //      clave del objeto `operaciones`:
  //        - if (!selectorOperador) return;   (guarda de seguridad)
  //        - Object.keys(operaciones).forEach(function (simbolo) { ... })
  //        - dentro: document.createElement('option'), opcion.value = simbolo,
  //          opcion.textContent = simbolo + '   ' + operaciones[simbolo].name
  //          y selectorOperador.appendChild(opcion)
  //   2. Explica la ganancia: si mañana añadimos una raíz cuadrada al objeto,
  //      aparecerá en el desplegable sin tocar ni esta función ni el HTML.
  //   Resultado esperado en pantalla: el desplegable pasa de estar vacío a
  //   tener seis opciones: "+   sumar", "-   restar", "*   multiplicar",
  //   "/   dividir", "%   resto" y "**   potencia".
  //   (aprox. 10 líneas)

  // ⚠️ El valor de un input SIEMPRE es texto, aunque sea type="number".

  // TODO (en clase):
  //   1. Escribe function leerNumero(campo) que devuelva un número o NaN:
  //        - const texto = campo.value.trim();
  //        - if (texto === '') return NaN;   (a mano, porque Number('') vale 0
  //          y eso nos engañaría)
  //        - return Number(texto);
  //   (aprox. 5 líneas)

  // TODO (en clase):
  //   1. Escribe function formatearResultado(valor). Es PURA: mismo número,
  //      mismo texto, siempre.
  //        - if (Number.isNaN(valor)) return 'Resultado no numérico (NaN)';
  //        - if (!Number.isFinite(valor)) return 'Infinito (¿dividiste entre cero?)';
  //        - if (Number.isInteger(valor)) return String(valor);
  //        - si no: return String(Number(valor.toFixed(4)));   (4 decimales sin
  //          ceros sobrantes al final)
  //   (aprox. 7 líneas)

  // TODO (en clase):
  //   1. Escribe function agregarAlHistorial(texto). Es IMPURA A PROPÓSITO:
  //      su trabajo ES el efecto secundario de modificar el DOM. Lo importante
  //      es que ese efecto está aislado en una función pequeña cuyo nombre lo
  //      anuncia.
  //        - if (!listaHistorial) return;
  //        - crea un <li>, ponle textContent = texto
  //        - listaHistorial.insertBefore(elemento, listaHistorial.firstChild);
  //          (así lo nuevo aparece arriba del todo)
  //   (aprox. 6 líneas)

  // TODO (en clase):
  //   1. Escribe function calcular(), que orquesta todo el proceso al pulsar
  //      el botón. Fíjate en cómo se reparte el trabajo entre funciones
  //      pequeñas: leer -> validar -> operar -> formatear -> mostrar.
  //        a) const a = leerNumero(campoA); const b = leerNumero(campoB);
  //           const simbolo = selectorOperador.value;
  //        b) Validación: si Number.isNaN(a) || Number.isNaN(b) ->
  //           panelResultado.textContent = 'Escribe dos números válidos.'; return;
  //           (salida temprana: no seguimos si los datos no sirven)
  //        c) const operacion = operaciones[simbolo];
  //           ✅ BUENA PRÁCTICA: comprobar que existe antes de invocarla.
  //           if (typeof operacion !== 'function') ->
  //           'Operación desconocida: ' + simbolo; return;
  //           (si alguien manipulara el <select>, aquí llegaría undefined y
  //           llamarlo daría "TypeError: operacion is not a function")
  //        d) Aviso especial de la división entre cero: si simbolo === '/' && b === 0,
  //           escribe 'No se puede dividir entre cero.' en el panel, añade
  //           a + ' / 0  ->  error' al historial, imprime en la consola visual
  //           'Intento de división entre cero: en JavaScript daría ' + (a / 0) + '.'
  //           y return.
  //        e) const resultado = operacion(a, b);   <- la función guardada en el objeto
  //           const textoResultado = formatearResultado(resultado);
  //        f) Muestra por los TRES canales: panel, historial y consola visual,
  //           con el formato a + ' ' + simbolo + ' ' + b + ' = ' + textoResultado
  //           y, en la consola, 'Se ejecutó operaciones["X"] -> nombre(a, b) = R'.
  //   Resultado esperado en pantalla con 12, '/' y 4: el panel muestra
  //   "12 / 4 = 3" y aparece esa misma línea arriba del historial.
  //   (aprox. 30 líneas)

  // TODO (en clase):
  //   1. Conecta los eventos SOLO si todos los elementos existen:
  //      if (campoA && campoB && selectorOperador && botonCalcular && panelResultado) {
  //        - llama primero a rellenarSelector();
  //        - botonCalcular.addEventListener('click', calcular);
  //          ⚠️ SIN paréntesis: con ellos se ejecutaría ahora y se pasaría
  //          undefined. Es el error más repetido de la asignatura.
  //        - detalle de usabilidad: recorre [campoA, campoB] con forEach y
  //          añade a cada uno un 'keydown' que llame a calcular() si
  //          evento.key === 'Enter'.
  //      }
  //   (aprox. 10 líneas)

  // TODO (en clase):
  //   1. if (botonLimpiarHistorial && listaHistorial) { ... } con un 'click' que
  //      vacíe la lista de golpe con listaHistorial.innerHTML = ''; y ponga en
  //      el panel 'Historial vacío. Listo para calcular.'
  //   (aprox. 6 líneas)

  // TODO (en clase):
  //   1. Vuelca a la consola visual lo que acabas de montar:
  //      titulo('Demo 1: la calculadora por dentro') y seis imprimir() con
  //      Object.keys(operaciones).join('  '), typeof operaciones['+'],
  //      operaciones['+'].name, operaciones['+'](2, 3), operaciones['**'](2, 10)
  //      y la frase 'Elegir la operación es leer una propiedad del objeto: sin un solo if.'
  //   Resultado esperado en pantalla:
  //      Operaciones disponibles -> +  -  *  /  %  **
  //      typeof operaciones["+"] -> function
  //      operaciones["+"].name -> sumar
  //      operaciones["+"](2, 3) -> 5
  //      operaciones["**"](2, 10) -> 1024
  //   (aprox. 7 líneas)

  // ============================================================
  // DEMO 2 · CONTADOR CON CLOSURE
  // ============================================================

  /*
   * `crearContador` es una FÁBRICA: cada llamada devuelve un contador
   * independiente con su propia variable `cuenta` encerrada dentro.
   *
   * Esa variable es privada de verdad. No es una convención ni un
   * acuerdo entre programadores: el lenguaje impide literalmente
   * llegar hasta ella desde fuera del closure.
   */

  // TODO (en clase):
  //   1. Escribe function crearContador(valorInicial = 0, paso = 1):
  //        - let cuenta = valorInicial;   ↓ ESTA es la variable privada ↓
  //        - let interacciones = 0;       también privada
  //        - function ajustar(cantidad) { cuenta += cantidad; interacciones += 1;
  //          return cuenta; }   <- auxiliar interna, tampoco se publica
  //   2. Devuelve el "contrato público", un objeto con CINCO métodos y nada más:
  //        incrementar()  -> ajustar(paso)
  //        decrementar()  -> ajustar(-paso)
  //        reiniciar()    -> cuenta = valorInicial, interacciones += 1, devuelve cuenta
  //        valor()        -> devuelve cuenta
  //        resumen()      -> 'valor actual: X | interacciones: Y'
  //   3. Crea EL contador de la página: const contadorDePagina = crearContador(0, 1);
  //   (aprox. 25 líneas)

  // Los elementos del contador YA EXISTEN en el HTML:
  //   #contador-valor      <span> con el marcador
  //   #contador-mas        botón +
  //   #contador-menos      botón −
  //   #contador-reiniciar  botón "Reiniciar"
  //   #contador-espiar     botón "Intentar espiar la variable"

  // TODO (en clase):
  //   1. Localiza los cinco elementos con document.getElementById, guardándolos
  //      en marcador, botonMas, botonMenos, botonReiniciar y botonEspiar.
  //   (aprox. 5 líneas)

  // TODO (en clase):
  //   1. Escribe function pintarContador(), donde se concentra TODA la escritura
  //      en el DOM (el resto del código solo se ocupa de la lógica):
  //        - if (!marcador) return;
  //        - const valor = contadorDePagina.valor();
  //        - marcador.textContent = String(valor);
  //        - detalle visual: si valor > 0 marcador.style.color = 'var(--exito)';
  //          si valor < 0, 'var(--error)'; si no, 'var(--primario)'.
  //   (aprox. 8 líneas)

  // TODO (en clase):
  //   1. if (marcador && botonMas && botonMenos) { ... }:
  //        - 'click' en botonMas -> contadorDePagina.incrementar(), pintarContador()
  //          e imprimir('+1 ->', contadorDePagina.resumen());
  //        - 'click' en botonMenos -> lo mismo con decrementar() y '-1 ->'.
  //        - al final, llama a pintarContador() para pintar el estado inicial (0).
  //   2. if (botonReiniciar) { ... } con un 'click' que llame a reiniciar(),
  //      pintarContador() e imprimir('Reiniciado ->', contadorDePagina.resumen()).
  //   Resultado esperado en pantalla: el marcador cambia de número y de color,
  //   y cada pulsación deja una línea como "+1 -> valor actual: 1 | interacciones: 1".
  //   (aprox. 18 líneas)

  // TODO (en clase):
  //   1. Botón "espiar": demuestra EN DIRECTO que la variable es inalcanzable.
  //      Es el momento estrella de la demo. Dentro de if (botonEspiar) { ... },
  //      en el 'click':
  //        a) titulo('¿Se puede espiar la variable privada?')
  //        b) imprime contadorDePagina.cuenta -> undefined, y explica que la
  //           propiedad no existe en el objeto devuelto.
  //        c) imprime Object.keys(contadorDePagina).join(', ') -> solo las cinco
  //           funciones públicas, ni rastro de `cuenta`.
  //        d) imprime contadorDePagina.ajustar -> undefined: la auxiliar interna
  //           tampoco se publicó.
  //        e) Intento de sabotaje: contadorDePagina.cuenta = 1000; vuelve a
  //           imprimir esa propiedad y, al lado, contadorDePagina.valor():
  //           hemos creado una propiedad nueva y SIN EFECTO.
  //        f) Limpia el sabotaje con delete contadorDePagina.cuenta;
  //        g) Demuestra que cada contador es independiente: crea
  //           const otroContador = crearContador(100, 10);, incremétalo dos veces
  //           e imprime su resumen() y el de contadorDePagina.
  //   Resultado esperado en pantalla:
  //      contadorDePagina.cuenta -> undefined
  //      Object.keys(contadorDePagina) -> incrementar, decrementar, reiniciar, valor, resumen
  //      contadorDePagina.ajustar -> undefined
  //      ... contadorDePagina.cuenta -> 1000  pero el valor REAL sigue siendo -> 0
  //      Un contador NUEVO, con su propia mochila -> valor actual: 120 | interacciones: 2
  //   (aprox. 30 líneas)

  // ============================================================
  // DEMO 3 · alert() Y prompt() BAJO DEMANDA
  // ============================================================

  /*
   * ⚠️ alert(), prompt() y confirm() DETIENEN el navegador hasta que
   * el usuario responde. Por eso NUNCA se ponen en la carga inicial de
   * la página: bloquearían todo lo demás.
   *
   * Aquí van dentro de un botón, así que solo se ejecutan cuando el
   * docente decide mostrarlos.
   *
   * En una aplicación real se sustituyen por ventanas hechas con HTML
   * y CSS, que no bloquean nada y se pueden diseñar.
   */

  // TODO (en clase):
  //   1. Localiza const botonSaludo = document.getElementById('saludo-boton');
  //   2. Escribe function construirSaludo(nombre, hora). Es PURA: separamos el
  //      cálculo (puro) de la interacción con el usuario (impura), tal como
  //      vimos en el archivo 06.
  //        - const nombreLimpio = String(nombre).trim() || 'estudiante anónimo';
  //        - let momento = 'Buenas noches';
  //          si hora >= 6 && hora < 13 -> 'Buenos días'
  //          si no, si hora >= 13 && hora < 21 -> 'Buenas tardes'
  //        - devuelve momento + ', ' + nombreLimpio +
  //          '. Bienvenido/a a Funciones a fondo.'
  //   3. if (botonSaludo) { ... } con un 'click' que:
  //        a) const nombre = prompt('¿Cómo te llamas?', 'Marta');
  //        b) si nombre === null (pulsó Cancelar) imprime
  //           'El usuario pulsó Cancelar: prompt() devolvió null.' y return;
  //        c) const hora = new Date().getHours();
  //        d) const saludo = construirSaludo(nombre, hora);
  //        e) alert(saludo);   <- efecto secundario: bloquea hasta aceptar
  //        f) imprime prompt() devolvió -> JSON.stringify(nombre)
  //           y construirSaludo() calculó -> saludo
  //   Resultado esperado en pantalla (escribiendo "Marta" por la tarde):
  //      prompt() devolvió -> "Marta"
  //      construirSaludo() calculó -> Buenas tardes, Marta. Bienvenido/a a Funciones a fondo.
  //   (aprox. 22 líneas)

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // 1) (Fácil) Añade al objeto `operaciones` una nueva entrada
  //    'max' que devuelva el mayor de los dos números. Comprueba que
  //    aparece sola en el desplegable de la página.
  //
  // 2) (Fácil) Añade la operación 'raiz' que calcule la raíz b-ésima
  //    de a. Pista: a ** (1 / b). Piensa qué pasa si b vale 0.
  //
  // 3) (Media) Modifica crearContador para aceptar un tercer parámetro
  //    `limite`. El contador no debe pasar nunca de ese valor y debe
  //    imprimir un aviso cuando se intente.
  //
  // 4) (Media) Crea un SEGUNDO contador en la página con su propio
  //    marcador y sus propios botones. Comprueba que los dos son
  //    totalmente independientes.
  //
  // 5) (Difícil) Añade al contador un método deshacer() que anule la
  //    última operación realizada. Guarda el historial de valores en
  //    un array PRIVADO dentro del closure.
  //
  // 6) (Difícil) Sustituye alert() y prompt() por una ventana modal
  //    hecha con HTML y CSS. Escribe una función abrirModal(mensaje,
  //    alConfirmar) que reciba un callback y lo ejecute al aceptar.
  // ============================================================
})();
