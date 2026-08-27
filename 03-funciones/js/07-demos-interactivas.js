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

(function () {
  'use strict';

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

  /**
   * Objeto de funciones. Cada una es PURA: recibe dos números,
   * devuelve uno, y no toca nada de fuera.
   * Les damos nombre (function sumar, no function anónima) para poder
   * mostrar `.name` en la interfaz.
   */
  const operaciones = {
    '+': function sumar(a, b) { return a + b; },
    '-': function restar(a, b) { return a - b; },
    '*': function multiplicar(a, b) { return a * b; },
    '/': function dividir(a, b) { return a / b; },
    '%': function resto(a, b) { return a % b; },
    '**': function potencia(a, b) { return a ** b; }
  };

  // Localizamos los elementos de la página una sola vez.
  const campoA = document.getElementById('calc-a');
  const campoB = document.getElementById('calc-b');
  const selectorOperador = document.getElementById('calc-operador');
  const botonCalcular = document.getElementById('calc-calcular');
  const panelResultado = document.getElementById('calc-resultado');
  const listaHistorial = document.getElementById('calc-historial');
  const botonLimpiarHistorial = document.getElementById('calc-limpiar');

  /**
   * rellenarSelector(): crea una <option> por cada clave del objeto
   * `operaciones`. Si mañana añadimos una raíz cuadrada al objeto,
   * aparecerá aquí sin tocar esta función ni el HTML.
   */
  function rellenarSelector() {
    if (!selectorOperador) return;

    // Object.keys() devuelve un array con los nombres de las propiedades.
    Object.keys(operaciones).forEach(function (simbolo) {
      const opcion = document.createElement('option');
      opcion.value = simbolo;
      // .name es el nombre de la función guardada en esa clave.
      opcion.textContent = simbolo + '   ' + operaciones[simbolo].name;
      selectorOperador.appendChild(opcion);
    });
  }

  /**
   * leerNumero(): convierte el texto de un input en número.
   * Devuelve NaN si no es un número válido, y quien llame decidirá.
   * ⚠️ El valor de un input SIEMPRE es texto, aunque sea type="number".
   * @param {HTMLInputElement} campo
   * @returns {number}
   */
  function leerNumero(campo) {
    // .trim() quita los espacios; si queda vacío devolvemos NaN a mano,
    // porque Number('') vale 0 y eso nos engañaría.
    const texto = campo.value.trim();
    if (texto === '') return NaN;
    return Number(texto);
  }

  /**
   * formatearResultado(): decide cómo mostrar el número final.
   * Es PURA: mismo número, mismo texto, siempre.
   * @param {number} valor
   * @returns {string}
   */
  function formatearResultado(valor) {
    if (Number.isNaN(valor)) return 'Resultado no numérico (NaN)';
    if (!Number.isFinite(valor)) return 'Infinito (¿dividiste entre cero?)';

    // Si es entero lo mostramos tal cual; si no, con 4 decimales
    // y sin ceros sobrantes al final.
    if (Number.isInteger(valor)) return String(valor);
    return String(Number(valor.toFixed(4)));
  }

  /**
   * agregarAlHistorial(): añade una línea a la lista de la página.
   * Es IMPURA a propósito: su trabajo es justamente el efecto
   * secundario de modificar el DOM. Lo importante es que ese efecto
   * está aislado en una función pequeña con un nombre que lo anuncia.
   * @param {string} texto
   */
  function agregarAlHistorial(texto) {
    if (!listaHistorial) return;
    const elemento = document.createElement('li');
    elemento.textContent = texto;
    // insertBefore con el primer hijo coloca lo nuevo arriba del todo.
    listaHistorial.insertBefore(elemento, listaHistorial.firstChild);
  }

  /**
   * calcular(): orquesta todo el proceso al pulsar el botón.
   * Fíjate en cómo se reparte el trabajo entre funciones pequeñas:
   * leer -> validar -> operar -> formatear -> mostrar.
   */
  function calcular() {
    const a = leerNumero(campoA);
    const b = leerNumero(campoB);
    const simbolo = selectorOperador.value;

    // 1. Validación de los números.
    if (Number.isNaN(a) || Number.isNaN(b)) {
      panelResultado.textContent = 'Escribe dos números válidos.';
      return;   // salida temprana: no seguimos si los datos no sirven
    }

    // 2. Buscamos la función correspondiente en el objeto.
    const operacion = operaciones[simbolo];

    // ✅ BUENA PRÁCTICA: comprobar que existe antes de invocarla.
    // Si alguien manipulara el <select>, aquí llegaría undefined y
    // llamarlo daría "TypeError: operacion is not a function".
    if (typeof operacion !== 'function') {
      panelResultado.textContent = 'Operación desconocida: ' + simbolo;
      return;
    }

    // 3. Aviso especial de la división entre cero.
    if (simbolo === '/' && b === 0) {
      panelResultado.textContent = 'No se puede dividir entre cero.';
      agregarAlHistorial(a + ' / 0  ->  error');
      imprimir('Intento de división entre cero: en JavaScript daría ' + (a / 0) + '.');
      return;
    }

    // 4. Ejecutamos la función guardada en el objeto.
    const resultado = operacion(a, b);
    const textoResultado = formatearResultado(resultado);

    // 5. Mostramos por los tres canales: panel, historial y consola.
    panelResultado.textContent = a + ' ' + simbolo + ' ' + b + ' = ' + textoResultado;
    agregarAlHistorial(a + ' ' + simbolo + ' ' + b + ' = ' + textoResultado);
    imprimir('Se ejecutó operaciones["' + simbolo + '"] -> ' + operacion.name +
      '(' + a + ', ' + b + ') = ' + textoResultado);
  }

  // Conectamos los eventos solo si TODOS los elementos existen.
  if (campoA && campoB && selectorOperador && botonCalcular && panelResultado) {
    rellenarSelector();

    // addEventListener recibe un CALLBACK: le damos la función SIN
    // paréntesis. Con paréntesis se ejecutaría ahora y le pasaríamos
    // undefined, que es el error más repetido de la asignatura.
    botonCalcular.addEventListener('click', calcular);

    // Detalle de usabilidad: calcular también al pulsar Enter.
    [campoA, campoB].forEach(function (campo) {
      campo.addEventListener('keydown', function (evento) {
        if (evento.key === 'Enter') calcular();
      });
    });
  }

  if (botonLimpiarHistorial && listaHistorial) {
    botonLimpiarHistorial.addEventListener('click', function () {
      listaHistorial.innerHTML = '';    // vacía la lista de golpe
      if (panelResultado) panelResultado.textContent = 'Historial vacío. Listo para calcular.';
    });
  }

  // Mostramos en la consola visual lo que acabamos de montar.
  titulo('Demo 1: la calculadora por dentro');
  imprimir('Operaciones disponibles ->', Object.keys(operaciones).join('  '));
  imprimir('typeof operaciones["+"] ->', typeof operaciones['+']);
  imprimir('operaciones["+"].name ->', operaciones['+'].name);
  imprimir('operaciones["+"](2, 3) ->', operaciones['+'](2, 3));
  imprimir('operaciones["**"](2, 10) ->', operaciones['**'](2, 10));
  imprimir('Elegir la operación es leer una propiedad del objeto: sin un solo if.');

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

  /**
   * crearContador(): devuelve un objeto con las únicas cuatro
   * operaciones permitidas sobre una cuenta privada.
   * @param {number} [valorInicial=0]
   * @param {number} [paso=1]
   */
  function crearContador(valorInicial = 0, paso = 1) {
    // ↓↓↓ ESTA es la variable privada. Vive en el closure. ↓↓↓
    let cuenta = valorInicial;

    // También privado: llevamos la cuenta de cuántas veces se ha tocado.
    let interacciones = 0;

    // Función auxiliar interna: tampoco se publica al exterior.
    function ajustar(cantidad) {
      cuenta += cantidad;
      interacciones += 1;
      return cuenta;
    }

    // Solo esto sale al mundo exterior. Es el "contrato público".
    return {
      incrementar: function () { return ajustar(paso); },
      decrementar: function () { return ajustar(-paso); },
      reiniciar: function () {
        cuenta = valorInicial;
        interacciones += 1;
        return cuenta;
      },
      valor: function () { return cuenta; },
      resumen: function () {
        return 'valor actual: ' + cuenta + ' | interacciones: ' + interacciones;
      }
    };
  }

  // Creamos EL contador de la página. Nadie más tiene acceso a su interior.
  const contadorDePagina = crearContador(0, 1);

  const marcador = document.getElementById('contador-valor');
  const botonMas = document.getElementById('contador-mas');
  const botonMenos = document.getElementById('contador-menos');
  const botonReiniciar = document.getElementById('contador-reiniciar');
  const botonEspiar = document.getElementById('contador-espiar');

  /**
   * pintarContador(): vuelca el valor actual en la pantalla.
   * Toda la escritura en el DOM está concentrada aquí; el resto del
   * código solo se preocupa de la lógica.
   */
  function pintarContador() {
    if (!marcador) return;
    const valor = contadorDePagina.valor();
    marcador.textContent = String(valor);

    // Pequeño detalle visual: color según el signo.
    if (valor > 0) marcador.style.color = 'var(--exito)';
    else if (valor < 0) marcador.style.color = 'var(--error)';
    else marcador.style.color = 'var(--primario)';
  }

  if (marcador && botonMas && botonMenos) {
    botonMas.addEventListener('click', function () {
      contadorDePagina.incrementar();
      pintarContador();
      imprimir('+1 ->', contadorDePagina.resumen());
    });

    botonMenos.addEventListener('click', function () {
      contadorDePagina.decrementar();
      pintarContador();
      imprimir('-1 ->', contadorDePagina.resumen());
    });

    pintarContador();   // pintamos el estado inicial (0)
  }

  if (botonReiniciar) {
    botonReiniciar.addEventListener('click', function () {
      contadorDePagina.reiniciar();
      pintarContador();
      imprimir('Reiniciado ->', contadorDePagina.resumen());
    });
  }

  // Botón "espiar": demuestra en directo que la variable es inalcanzable.
  if (botonEspiar) {
    botonEspiar.addEventListener('click', function () {
      titulo('¿Se puede espiar la variable privada?');

      imprimir('contadorDePagina.cuenta ->', contadorDePagina.cuenta);
      imprimir('   undefined: la propiedad no existe en el objeto devuelto.');

      imprimir('Object.keys(contadorDePagina) ->', Object.keys(contadorDePagina).join(', '));
      imprimir('   Solo se ven las cinco funciones públicas. Ni rastro de `cuenta`.');

      imprimir('contadorDePagina.ajustar ->', contadorDePagina.ajustar);
      imprimir('   La función auxiliar interna tampoco se publicó.');

      // Intento de sabotaje: crear una propiedad con ese nombre.
      contadorDePagina.cuenta = 1000;
      imprimir('Tras hacer contadorDePagina.cuenta = 1000:');
      imprimir('   contadorDePagina.cuenta ->', contadorDePagina.cuenta);
      imprimir('   pero el valor REAL sigue siendo ->', contadorDePagina.valor());
      imprimir('   Hemos creado una propiedad nueva y sin efecto: el contador');
      imprimir('   auténtico vive en el closure y es intocable.');

      // Limpiamos el sabotaje para dejar el objeto como estaba.
      delete contadorDePagina.cuenta;

      // Y demostramos que cada contador es independiente.
      const otroContador = crearContador(100, 10);
      otroContador.incrementar();
      otroContador.incrementar();
      imprimir('Un contador NUEVO, con su propia mochila ->', otroContador.resumen());
      imprimir('El de la página no se ha enterado de nada ->', contadorDePagina.resumen());
    });
  }

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

  const botonSaludo = document.getElementById('saludo-boton');

  /**
   * construirSaludo(): función PURA que arma el texto.
   * Separamos el cálculo (puro) de la interacción con el usuario
   * (impura), tal como vimos en el archivo 06.
   * @param {string} nombre
   * @param {number} hora - de 0 a 23
   */
  function construirSaludo(nombre, hora) {
    const nombreLimpio = String(nombre).trim() || 'estudiante anónimo';
    let momento = 'Buenas noches';
    if (hora >= 6 && hora < 13) momento = 'Buenos días';
    else if (hora >= 13 && hora < 21) momento = 'Buenas tardes';
    return momento + ', ' + nombreLimpio + '. Bienvenido/a a Funciones a fondo.';
  }

  if (botonSaludo) {
    botonSaludo.addEventListener('click', function () {
      // prompt() devuelve el texto escrito, o null si se pulsa Cancelar.
      const nombre = prompt('¿Cómo te llamas?', 'Marta');

      if (nombre === null) {
        imprimir('El usuario pulsó Cancelar: prompt() devolvió null.');
        return;
      }

      const hora = new Date().getHours();
      const saludo = construirSaludo(nombre, hora);

      alert(saludo);            // efecto secundario: bloquea hasta aceptar
      imprimir('prompt() devolvió ->', JSON.stringify(nombre));
      imprimir('construirSaludo() calculó ->', saludo);
    });
  }

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
