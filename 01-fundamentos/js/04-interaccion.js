/**
 * ============================================================
 * ARCHIVO: js/04-interaccion.js
 * PROYECTO: 01 - Fundamentos de JavaScript
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO:
 *   1. Las tres ventanas clasicas del navegador:
 *        alert()   -> avisa
 *        prompt()  -> pregunta y devuelve TEXTO (o null si se cancela)
 *        confirm() -> pregunta y devuelve un BOOLEANO
 *   2. Por que estas funciones NUNCA se llaman al cargar la pagina.
 *   3. Un primer contacto con addEventListener para conectar botones.
 *   4. Como se enlaza todo lo aprendido: lo que escribe el usuario
 *      llega como texto y hay que convertirlo antes de operar.
 *
 * QUE SE APRENDE AL TERMINAR:
 *   A pedir datos al usuario, a validarlos y a entender por que en
 *   aplicaciones reales estas ventanas se sustituyen por formularios.
 * ============================================================
 */

(function () {
  'use strict';

  // Reutilizamos las funciones de salida creadas en el archivo 01.
  const imprimir = window.imprimir || function (...mensajes) { console.log(...mensajes); };
  const titulo = window.titulo || function (texto) { console.log('== ' + texto + ' =='); };

  // ============================================================
  // 1. POR QUE ESTAS VENTANAS VAN DENTRO DE BOTONES
  // ============================================================

  /*
    alert, prompt y confirm son BLOQUEANTES: mientras la ventana esta
    abierta, el navegador congela la pagina entera. No se puede hacer
    scroll, ni pulsar nada, ni terminar de cargar.

    Si las llamaramos al cargar el archivo, la clase empezaria con una
    ventana gris obligatoria antes de ver nada. Por eso las metemos
    dentro de botones: se ejecutan solo cuando el docente decide.

    ⚠️ ERROR COMUN: escribir prompt() suelto en el archivo "para probar".
    La pagina se queda bloqueada hasta que alguien responde.
  */

  // ============================================================
  // 2. LOCALIZAR LOS BOTONES DEL HTML
  // ============================================================

  /*
    document.getElementById busca en el HTML el elemento cuyo id coincide
    y nos devuelve una referencia a el. Si no lo encuentra, devuelve null.

    Gracias a defer en la etiqueta <script>, este codigo se ejecuta
    cuando el HTML ya esta construido, asi que los botones existen.
  */

  const botonAlert = document.getElementById('btn-alert');
  const botonPrompt = document.getElementById('btn-prompt');
  const botonConfirm = document.getElementById('btn-confirm');
  const botonLimpiar = document.getElementById('btn-limpiar');
  const bloqueSalida = document.getElementById('salida');

  // ============================================================
  // 3. alert(): SOLO INFORMA
  // ============================================================

  /*
    alert() muestra un mensaje con un unico boton de Aceptar.
    No devuelve informacion util (devuelve undefined).

    addEventListener('click', funcion) significa:
    "cuando este elemento reciba un clic, ejecuta esta funcion".
    Los eventos se estudian a fondo en el proyecto 03; aqui basta con
    entender la idea de "cuando pase X, haz Y".
  */

  if (botonAlert) {   // el if evita un error si el boton no existiera
    botonAlert.addEventListener('click', function () {
      // Con template literal podemos escribir varias lineas comodamente.
      const mensaje = `Esto es un alert().

Bloquea la pagina hasta que pulses Aceptar
y no devuelve ningun dato util.`;

      // Guardamos lo que devuelve alert() solo para demostrar que es undefined.
      const valorDevuelto = alert(mensaje);

      imprimir('');
      imprimir('[alert] Aviso mostrado. alert() devuelve:', String(valorDevuelto), '<- no aporta ningun dato');
    });
  }

  // ============================================================
  // 4. prompt(): PREGUNTA Y DEVUELVE TEXTO
  // ============================================================

  /*
    prompt(pregunta, valorPorDefecto) abre una ventana con un campo de
    texto. Devuelve:
      - un STRING con lo que escribio la persona (aunque escriba numeros)
      - null si pulsa Cancelar
      - '' (texto vacio) si acepta sin escribir nada

    Aqui se juntan casi todos los temas del proyecto: tipos, conversion,
    NaN, truthy/falsy y template literals.
  */

  if (botonPrompt) {
    botonPrompt.addEventListener('click', function () {
      const respuesta = prompt('Escribe tu nota final (numero del 0 al 10):', '7.5');

      titulo('PRUEBA DE prompt()');

      // ⚠️ ERROR COMUN: comprobar solo con if (respuesta). El texto vacio
      // es falsy, asi que cancelar y escribir nada se mezclarian.
      // Distinguimos los dos casos por separado.
      if (respuesta === null) {
        imprimir('[prompt] Pulsaste Cancelar. prompt() devolvio null.');
        return;   // salimos de la funcion: no hay nada que procesar
      }

      imprimir('[prompt] Valor recibido:', `"${respuesta}"`);
      imprimir('[prompt] typeof del valor:', typeof respuesta, '<- SIEMPRE es string');

      // Todo lo que escribe el usuario llega como TEXTO. Si no convertimos,
      // sumar le anadiria caracteres en lugar de sumar de verdad.
      imprimir('[prompt] Sin convertir, valor + 1 ->', respuesta + 1);

      const notaNumerica = Number(respuesta);

      // Number('') vale 0, asi que descartamos primero el texto vacio.
      if (respuesta.trim() === '' || !Number.isFinite(notaNumerica)) {
        imprimir('[prompt] Eso no es un numero valido. Number() devolvio:', String(notaNumerica));
        alert('El valor introducido no es un numero valido.');
        return;
      }

      imprimir('[prompt] Convertido con Number():', notaNumerica, '| typeof:', typeof notaNumerica);
      imprimir('[prompt] Ahora si, valor + 1 ->', notaNumerica + 1);

      // Ternario para decidir el mensaje segun la nota.
      const veredicto = notaNumerica >= 5 ? 'APROBADO' : 'SUSPENSO';
      imprimir(`[prompt] Nota ${notaNumerica} -> ${veredicto}`);
      alert(`Nota registrada: ${notaNumerica}\nResultado: ${veredicto}`);
    });
  }

  // ============================================================
  // 5. confirm(): PREGUNTA Y DEVUELVE UN BOOLEANO
  // ============================================================

  /*
    confirm(pregunta) muestra dos botones: Aceptar y Cancelar.
    Devuelve exactamente true o false, asi que su resultado se puede
    usar directamente en un if.
  */

  if (botonConfirm) {
    botonConfirm.addEventListener('click', function () {
      const respuesta = confirm('¿Quieres marcar la asistencia de hoy?');

      titulo('PRUEBA DE confirm()');
      imprimir('[confirm] Valor devuelto:', respuesta, '| typeof:', typeof respuesta);

      // Como ya es booleano, no hace falta compararlo con === true.
      // ✅ BUENA PRACTICA: if (respuesta), no if (respuesta === true).
      if (respuesta) {
        imprimir('[confirm] Asistencia registrada.');
      } else {
        imprimir('[confirm] Operacion cancelada por el usuario.');
      }
    });
  }

  // ============================================================
  // 6. BOTON PARA LIMPIAR LA CONSOLA VISUAL
  // ============================================================

  /*
    Vaciar el contenido de un elemento es tan simple como asignar un
    texto vacio a su propiedad textContent. Muy util en clase para
    volver a ejecutar una seccion sin ruido anterior.
  */

  if (botonLimpiar && bloqueSalida) {
    botonLimpiar.addEventListener('click', function () {
      bloqueSalida.textContent = '';     // se borra la consola visual
      console.clear();                   // y tambien la de DevTools
      imprimir('Consola limpia. Recarga la pagina (F5) para volver a ver todo.');
    });
  }

  // ============================================================
  // 7. EL MAL EJEMPLO: JAVASCRIPT EN LINEA (onclick)
  // ============================================================

  /*
    En el HTML hay un boton con onclick="demoInlineEjemplo()".
    Para que ese atributo funcione, la funcion tiene que ser GLOBAL,
    es decir, vivir colgada de window. Como nuestro codigo esta dentro
    de una IIFE, hay que exponerla a proposito.

    ⚠️ Justamente esa obligacion es uno de los motivos para NO usar
    JavaScript en linea: te fuerza a ensuciar el ambito global.
    ✅ BUENA PRACTICA: usar siempre addEventListener, como en los tres
    botones anteriores.
  */

  window.demoInlineEjemplo = function () {
    titulo('EJEMPLO DE onclick EN LINEA');
    imprimir('Este boton llamo a una funcion desde el atributo onclick del HTML.');
    imprimir('Funciona, pero mezcla estructura y comportamiento.');
    imprimir('Ademas obliga a crear una funcion global (window.demoInlineEjemplo).');
    alert('Funciono, pero asi NO se hace.\nUsa addEventListener en el archivo .js.');
  };

  // ============================================================
  // 8. MENSAJE FINAL DE LA PAGINA
  // ============================================================

  titulo('FIN DE LA CARGA AUTOMATICA');
  imprimir('Los cuatro archivos JS se ejecutaron en orden gracias a defer.');
  imprimir('Ahora prueba los botones de la seccion 10 y compara resultados.');
  imprimir('Recuerda: F12 abre DevTools para ver la consola real del navegador.');

  /*
    ============================================================
    EJERCICIOS PROPUESTOS
    ============================================================
    1) Anade un cuarto boton que pida el nombre con prompt() y salude con
       un alert() usando un template literal. Si la persona cancela, no
       debe mostrarse ningun saludo.

    2) Crea un boton "Calculadora rapida" que pida dos numeros con dos
       prompt(), los convierta y muestre suma, resta, multiplicacion,
       division y resto en la consola visual.

    3) Usa confirm() para pedir confirmacion antes de limpiar la consola:
       si la persona cancela, la consola no debe borrarse.

    4) Escribe una funcion pedirNumero(mensaje) que repita el prompt()
       hasta que se introduzca un numero valido o se pulse Cancelar.
       (Pista: un bucle while y Number.isFinite).

    5) RETO: crea un mini cuestionario de tres preguntas con confirm(),
       cuenta los aciertos y muestra al final la puntuacion y el
       porcentaje con un solo template literal multilinea.
    ============================================================
  */
})();
