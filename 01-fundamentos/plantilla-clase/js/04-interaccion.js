/**
 * ============================================================
 * ARCHIVO: js/04-interaccion.js   ·   PLANTILLA DE CLASE
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
 * ------------------------------------------------------------
 * COMO USAR ESTA PLANTILLA:
 *   Se escribe en vivo el codigo de cada bloque "TODO (en clase)".
 *   AVISO: hasta que no se escriba la seccion 7, el boton de la pagina
 *   con onclick="demoInlineEjemplo()" no hara nada y dara ReferenceError
 *   AL PULSARLO (no al cargar). Es un buen momento para explicar por que
 *   el JavaScript en linea es fragil.
 *   La version resuelta esta en ../../js/04-interaccion.js
 * ============================================================
 */

/*
  Como en los archivos anteriores, la IIFE ya viene escrita: aisla las
  variables de este archivo para que no choquen con las de los otros tres.
*/
(function () {
  'use strict';

  // Reutilizamos las funciones de salida creadas en el archivo 01.
  // (Andamiaje: ya viene escrito, sin esto no se ve nada en pantalla.)
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

    Esta seccion es solo teoria: no se escribe codigo aqui.
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

  // TODO (en clase):
  //   Declara cinco constantes con document.getElementById(), una por linea.
  //   Los ids ya existen en el index.html de esta misma carpeta:
  //     const botonAlert   = document.getElementById('btn-alert');
  //     const botonPrompt  = document.getElementById('btn-prompt');
  //     const botonConfirm = document.getElementById('btn-confirm');
  //     const botonLimpiar = document.getElementById('btn-limpiar');
  //     const bloqueSalida = document.getElementById('salida');
  //   Truco de clase: imprime una de ellas para ensenar que devuelve el
  //   elemento HTML entero, y prueba un id inventado para ver el null.
  //   (aprox. 5 lineas)

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

  // TODO (en clase):
  //   1. Abre un if (botonAlert) { ... }   // el if evita un error si el boton no existiera
  //   2. Dentro: botonAlert.addEventListener('click', function () { ... });
  //   3. Dentro del manejador:
  //        a) Declara const mensaje = `...` (template literal multilinea) con:
  //             Esto es un alert().
  //             (linea en blanco)
  //             Bloquea la pagina hasta que pulses Aceptar
  //             y no devuelve ningun dato util.
  //        b) const valorDevuelto = alert(mensaje);   // guardamos el retorno solo para demostrar que es undefined
  //        c) imprimir('')
  //           imprimir('[alert] Aviso mostrado. alert() devuelve:', String(valorDevuelto), '<- no aporta ningun dato')
  //   Resultado esperado: al pulsar "Probar alert()" sale la ventana, y al
  //   aceptarla aparece en la consola visual:
  //     [alert] Aviso mostrado. alert() devuelve: undefined <- no aporta ningun dato
  //   (aprox. 12 lineas)

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
    NaN, truthy/falsy y template literals. Es el bloque estrella del archivo.
  */

  // TODO (en clase):
  //   1. if (botonPrompt) { botonPrompt.addEventListener('click', function () { ... }); }
  //   2. Dentro del manejador, en este orden:
  //        a) const respuesta = prompt('Escribe tu nota final (numero del 0 al 10):', '7.5');
  //        b) titulo('PRUEBA DE prompt()')
  //        c) CASO CANCELAR: if (respuesta === null) { imprimir('[prompt] Pulsaste Cancelar. prompt() devolvio null.'); return; }
  //           El return sale de la funcion: no hay nada que procesar.
  //        d) imprimir('[prompt] Valor recibido:', `"${respuesta}"`)
  //           imprimir('[prompt] typeof del valor:', typeof respuesta, '<- SIEMPRE es string')
  //        e) Demuestra el error clasico ANTES de convertir:
  //           imprimir('[prompt] Sin convertir, valor + 1 ->', respuesta + 1)    -> "7.51"
  //        f) const notaNumerica = Number(respuesta);
  //        g) CASO NO VALIDO (recuerda que Number('') vale 0, por eso se
  //           descarta primero el texto vacio con trim()):
  //             if (respuesta.trim() === '' || !Number.isFinite(notaNumerica)) {
  //               imprimir('[prompt] Eso no es un numero valido. Number() devolvio:', String(notaNumerica));
  //               alert('El valor introducido no es un numero valido.');
  //               return;
  //             }
  //        h) imprimir('[prompt] Convertido con Number():', notaNumerica, '| typeof:', typeof notaNumerica)
  //           imprimir('[prompt] Ahora si, valor + 1 ->', notaNumerica + 1)      -> 8.5
  //        i) Ternario para el veredicto:
  //             const veredicto = notaNumerica >= 5 ? 'APROBADO' : 'SUSPENSO';
  //             imprimir(`[prompt] Nota ${notaNumerica} -> ${veredicto}`)
  //             alert(`Nota registrada: ${notaNumerica}\nResultado: ${veredicto}`)
  //   Resultado esperado con el valor por defecto 7.5:
  //     [prompt] Valor recibido: "7.5"
  //     [prompt] typeof del valor: string <- SIEMPRE es string
  //     [prompt] Sin convertir, valor + 1 -> 7.51
  //     [prompt] Convertido con Number(): 7.5 | typeof: number
  //     [prompt] Ahora si, valor + 1 -> 8.5
  //     [prompt] Nota 7.5 -> APROBADO
  //   (aprox. 26 lineas)

  // ⚠️ ERROR COMUN: comprobar solo con if (respuesta). El texto vacio
  // es falsy, asi que cancelar y escribir nada se mezclarian. Por eso
  // arriba se distinguen los dos casos por separado.

  // ============================================================
  // 5. confirm(): PREGUNTA Y DEVUELVE UN BOOLEANO
  // ============================================================

  /*
    confirm(pregunta) muestra dos botones: Aceptar y Cancelar.
    Devuelve exactamente true o false, asi que su resultado se puede
    usar directamente en un if.
  */

  // TODO (en clase):
  //   1. if (botonConfirm) { botonConfirm.addEventListener('click', function () { ... }); }
  //   2. Dentro del manejador:
  //        a) const respuesta = confirm('¿Quieres marcar la asistencia de hoy?');
  //        b) titulo('PRUEBA DE confirm()')
  //        c) imprimir('[confirm] Valor devuelto:', respuesta, '| typeof:', typeof respuesta)
  //        d) if (respuesta) { imprimir('[confirm] Asistencia registrada.'); }
  //           else { imprimir('[confirm] Operacion cancelada por el usuario.'); }
  //   Resultado esperado al aceptar:
  //     [confirm] Valor devuelto: true | typeof: boolean
  //     [confirm] Asistencia registrada.
  //   (aprox. 11 lineas)

  // Como ya es booleano, no hace falta compararlo con === true.
  // ✅ BUENA PRACTICA: if (respuesta), no if (respuesta === true).

  // ============================================================
  // 6. BOTON PARA LIMPIAR LA CONSOLA VISUAL
  // ============================================================

  /*
    Vaciar el contenido de un elemento es tan simple como asignar un
    texto vacio a su propiedad textContent. Muy util en clase para
    volver a ejecutar una seccion sin ruido anterior.
  */

  // TODO (en clase):
  //   1. if (botonLimpiar && bloqueSalida) { botonLimpiar.addEventListener('click', function () { ... }); }
  //      (se comprueban LOS DOS: hace falta el boton y el bloque de salida)
  //   2. Dentro del manejador:
  //        bloqueSalida.textContent = '';   // se borra la consola visual
  //        console.clear();                 // y tambien la de DevTools
  //        imprimir('Consola limpia. Recarga la pagina (F5) para volver a ver todo.')
  //   Resultado esperado: la caja negra queda vacia y con esa unica frase.
  //   (aprox. 7 lineas)

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

  // TODO (en clase):
  //   Truco pedagogico: ANTES de escribir nada, pulsa el boton "Botón con
  //   onclick en línea (mal ejemplo)" y ensena el ReferenceError de la
  //   consola. Despues escribe la funcion y vuelve a pulsarlo.
  //   1. window.demoInlineEjemplo = function () { ... };
  //   2. Dentro:
  //        titulo('EJEMPLO DE onclick EN LINEA')
  //        imprimir('Este boton llamo a una funcion desde el atributo onclick del HTML.')
  //        imprimir('Funciona, pero mezcla estructura y comportamiento.')
  //        imprimir('Ademas obliga a crear una funcion global (window.demoInlineEjemplo).')
  //        alert('Funciono, pero asi NO se hace.\nUsa addEventListener en el archivo .js.')
  //   (aprox. 7 lineas)

  // ============================================================
  // 8. MENSAJE FINAL DE LA PAGINA
  // ============================================================

  // TODO (en clase):
  //   Cierra el proyecto con el resumen que se ejecuta al cargar:
  //     titulo('FIN DE LA CARGA AUTOMATICA')
  //     imprimir('Los cuatro archivos JS se ejecutaron en orden gracias a defer.')
  //     imprimir('Ahora prueba los botones de la seccion 10 y compara resultados.')
  //     imprimir('Recuerda: F12 abre DevTools para ver la consola real del navegador.')
  //   Resultado esperado en pantalla: el ultimo separador de la consola visual
  //   con esas tres frases debajo.
  //   (aprox. 4 lineas)

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
