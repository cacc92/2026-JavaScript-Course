/**
 * ============================================================================
 * ARCHIVO: js/03-promesas.js   ·   PLANTILLA DE CLASE (sin resolver)
 * TEMA:    Promesas. Los tres estados, new Promise(resolve, reject),
 *          then / catch / finally, el encadenado, los errores clasicos
 *          y los cuatro combinadores (all, allSettled, race, any).
 *
 * QUE VAS A APRENDER
 *  1. Que es una promesa y por que resuelve los problemas de los callbacks.
 *  2. Los tres estados y la regla de que solo se cambia de estado UNA vez.
 *  3. A crear promesas propias con new Promise((resolve, reject) => ...).
 *  4. A encadenar .then() devolviendo valores y devolviendo promesas.
 *  5. Los dos errores que TODO el mundo comete: olvidar el return dentro de
 *     un then, y colocar el catch donde no captura nada.
 *  6. Cuando usar Promise.all, allSettled, race o any.
 *
 * IIFE: todo encerrado para que no choque con los otros archivos .js.
 *
 * COMO SE USA ESTA PLANTILLA
 * Las explicaciones estan completas; el codigo lo escribe el docente en vivo
 * siguiendo los bloques "TODO (en clase)". Solucion en ../js/03-promesas.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL DE ESTA SECCION   [YA ESCRITO]
  // ============================================================
  const consola = document.getElementById('salida-promesas');

  function imprimir(...mensajes) {
    console.log(...mensajes);
    if (!consola) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    consola.textContent += texto + '\n';
    consola.scrollTop = consola.scrollHeight;
  }

  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  function limpiar() {
    if (consola) consola.textContent = '';
  }

  /**
   * cronometro(): devuelve una funcion que, cada vez que se llama, informa de
   * los milisegundos transcurridos desde que se creo.
   * performance.now() es mas preciso que Date.now() para medir duraciones.
   */
  // TODO (en clase):
  //   1. Declara cronometro() sin parametros.
  //   2. Guarda const inicio = performance.now().
  //   3. Devuelve una funcion (un CIERRE o closure: recuerda 'inicio') que
  //      devuelva Math.round(performance.now() - inicio) + ' ms'.
  //   Uso previsto: const t = cronometro();  ... imprimir(t());  -> "1204 ms"
  //   (aprox. 6 lineas)

  // ============================================================
  // 1. QUE ES UNA PROMESA
  // ============================================================
  // Una promesa es un OBJETO que representa un resultado que todavia no
  // existe pero que existira: o un valor, o un error.
  //
  // Analogia: pides una hamburguesa y te dan un ticket con un numero.
  // El ticket NO es la hamburguesa, pero te garantiza que va a pasar una de
  // dos cosas: o te llaman y te la dan (cumplida), o te dicen que se acabo
  // la carne y te devuelven el dinero (rechazada). Nunca las dos.
  //
  // LOS TRES ESTADOS
  //   pending   (pendiente)  -> aun trabajando. Es el estado inicial.
  //   fulfilled (cumplida)   -> hay un VALOR. Se llamo a resolve(valor).
  //   rejected  (rechazada)  -> hay un ERROR. Se llamo a reject(error).
  //
  // REGLA DE HIERRO: una promesa cambia de estado UNA SOLA VEZ y ya no
  // vuelve atras. La segunda llamada a resolve() o reject() se ignora
  // en silencio. Esto es una garantia, no un fallo.
  //
  // (Esta seccion es solo teoria: no hay codigo que escribir.)

  // ============================================================
  // 2. CREAR UNA PROMESA CON new Promise
  // ============================================================
  // new Promise recibe una funcion llamada EJECUTOR con dos parametros:
  //
  //     new Promise(function (resolve, reject) { ... })
  //
  //   resolve(valor) -> pasa la promesa a CUMPLIDA con ese valor.
  //   reject(error)  -> pasa la promesa a RECHAZADA con ese error.
  //
  // El ejecutor se ejecuta INMEDIATAMENTE y de forma SINCRONA, en el mismo
  // momento en que se crea la promesa. Lo asincrono es lo que hay dentro.
  //
  // ✅ BUENA PRACTICA: rechazar SIEMPRE con un objeto Error, nunca con un
  // simple string. El Error lleva mensaje y traza.

  /**
   * cocinarPedido(): simula la cocina de un restaurante.
   * @param {string} plato       - nombre del plato
   * @param {number} milisegundos- lo que tarda en prepararse
   * @param {boolean} hayIngredientes - si es false, el pedido se rechaza
   * @returns {Promise<string>} promesa que se cumple con el mensaje de entrega
   */
  // TODO (en clase):
  //   1. Declara cocinarPedido(plato, milisegundos, hayIngredientes) y devuelve
  //      un new Promise(function (resolve, reject) { ... }).
  //   2. Como PRIMERA linea del ejecutor imprime
  //      '   [cocina] recibido el pedido de <plato> (ejecutor SINCRONO)'.
  //      Sirve para demostrar que el ejecutor corre en el acto.
  //   3. Dentro de un setTimeout de 'milisegundos':
  //      - si !hayIngredientes -> reject(new Error('Se acabaron los ingredientes
  //        para: ' + plato)) y return;
  //      - si no -> resolve(plato + ' listo para servir');
  //      - escribe DESPUES un segundo resolve('esto no se vera nunca') para
  //        demostrar en clase que se ignora: la promesa ya cambio de estado.
  //   Resultado esperado: cocinarPedido('Ensalada cesar', 1200, true) imprime el
  //   mensaje de la cocina al instante y se cumple 1,2 s despues.
  //   (aprox. 18 lineas)

  /**
   * esperar(): promesa de uso general que se cumple tras N milisegundos.
   * Es el "sleep" que JavaScript no trae de serie. La usaremos mucho.
   */
  // TODO (en clase):
  //   1. Declara esperar(milisegundos, valor) y devuelve un new Promise con un
  //      unico parametro (resolve).
  //   2. Dentro, un setTimeout de 'milisegundos' que llame a resolve(valor).
  //   Resultado esperado: esperar(700, 'hola') se cumple con 'hola' a los 700 ms.
  //   (aprox. 7 lineas)

  /** fallarTras(): promesa de uso general que se rechaza tras N milisegundos. */
  // TODO (en clase):
  //   1. Declara fallarTras(milisegundos, mensaje) y devuelve
  //      new Promise(function (_, reject) { ... }). El guion bajo es la
  //      convencion para decir "este parametro existe, pero lo ignoro a proposito".
  //   2. Dentro, un setTimeout que llame a reject(new Error(mensaje)).
  //   (aprox. 8 lineas)

  // ============================================================
  // 3. CONSUMIR UNA PROMESA: then / catch / finally
  // ============================================================
  //   .then(fn)    -> fn se ejecuta si la promesa se CUMPLE. Recibe el valor.
  //   .catch(fn)   -> fn se ejecuta si la promesa se RECHAZA. Recibe el error.
  //   .finally(fn) -> fn se ejecuta SIEMPRE, pase lo que pase. No recibe nada.
  //
  // finally es el sitio perfecto para "apagar el spinner": tanto si hubo
  // exito como si hubo error, la interfaz debe dejar de mostrar "cargando".

  // TODO (en clase):
  //   1. Declara demoPromesaCumplida() con titulo('3.1 - Una promesa que se CUMPLE')
  //      y const t = cronometro().
  //   2. Llama a cocinarPedido('Ensalada cesar', 1200, true) y encadena:
  //      .then   -> imprime '[then]    <mensaje>  (<t()>)'
  //      .catch  -> imprime '[catch]   ' + error.message  (aqui no entrara)
  //      .finally -> imprime '[finally] La cocina cierra el ticket. Se ejecuta siempre.'
  //   3. Despues de la cadena, imprime
  //      'Esta linea sale ANTES que el [then]: la promesa aun esta pendiente.'
  //   Resultado esperado: primero el mensaje de la cocina, luego esa ultima linea,
  //   y 1,2 s despues el [then] y el [finally].
  //   (aprox. 17 lineas)

  // TODO (en clase):
  //   1. Declara demoPromesaRechazada() con titulo('3.2 - Una promesa que se RECHAZA')
  //      y su cronometro.
  //   2. Llama a cocinarPedido('Risotto de setas', 1200, false) y encadena:
  //      .then   -> imprime '[then]    ' + mensaje  (no entrara)
  //      .catch  -> imprime '[catch]   <mensaje del error>  (<t()>)' y en otra
  //                 linea '          error instanceof Error ->' junto al booleano
  //      .finally -> imprime '[finally] Igual que antes: se ejecuta pase lo que pase.'
  //                 y '[OK] BUENA PRACTICA: apagar el spinner de carga siempre en finally.'
  //   Resultado esperado: "[catch] Se acabaron los ingredientes para: Risotto de
  //   setas" y "error instanceof Error -> true".
  //   (aprox. 17 lineas)

  // TODO (en clase):
  //   1. Declara demoEstados() con titulo('3.3 - Ver los tres estados en vivo').
  //   2. Crea const promesa = cocinarPedido('Tarta de queso', 1500, true).
  //   3. Justo despues imprime 'Estado ahora mismo: PENDIENTE (pending)' y
  //      'El objeto promesa existe ya, pero no tiene valor todavia:' junto a
  //      String(promesa)  -> se vera "[object Promise]".
  //   4. Encadena promesa.then(function (valor) { ... }) que imprima
  //      'Estado ahora: CUMPLIDA (fulfilled) con el valor -> "<valor>"' y
  //      'A partir de aqui la promesa ya no cambiara nunca mas.'
  //   5. DENTRO de ese then, vuelve a hacer promesa.then(...) sobre la MISMA
  //      promesa e imprime 'Segundo .then sobre la MISMA promesa -> "<v>" (valor
  //      cacheado)': una promesa ya cumplida devuelve su valor al instante.
  //   6. Crea const fallida = fallarTras(2000, 'Horno averiado') y con .catch
  //      imprime 'Otra promesa distinta: RECHAZADA con -> "<mensaje>"'.
  //   (aprox. 25 lineas)

  // ============================================================
  // 4. ENCADENAR then: LA CADENA DE MONTAJE
  // ============================================================
  // .then() devuelve SIEMPRE una promesa nueva. Eso es lo que permite
  // encadenar. Y hay dos maneras de alimentar el siguiente eslabon:
  //
  //   a) devolver un VALOR normal:   return precio * 1.21;
  //      -> el siguiente then recibe ese valor ya calculado.
  //
  //   b) devolver una PROMESA:       return pedirDatos();
  //      -> la cadena ESPERA a que esa promesa se resuelva y el siguiente
  //         then recibe su valor, no la promesa. A esto se le llama
  //         "aplanar" (flattening) y es lo que evita la piramide.

  // TODO (en clase):
  //   1. Declara demoEncadenar() con titulo('3.4 - Encadenar then: valores y promesas')
  //      y const t = cronometro().
  //   2. Parte de cocinarPedido('Pizza margarita', 800, true) y encadena CUATRO then:
  //      [1] imprime '[1] <mensaje>  (<t()>)' y (a) devuelve el VALOR
  //          { plato: 'Pizza margarita', precio: 12.5 }
  //      [2] recibe ese objeto (no una promesa), imprime
  //          '[2] Precio base: 12.5 EUR' y devuelve
  //          Number((pedido.precio * 1.21).toFixed(2))
  //      [3] imprime '[3] Precio con IVA: 15.13 EUR' y (b) devuelve la PROMESA
  //          esperar(700, 'Cobro de <conIva> EUR confirmado')
  //      [4] recibe el STRING ya desenvuelto e imprime '[4] <confirmacion>  (<t()>)'
  //          y '    La cadena espero sola a la promesa del paso 3.'
  //   3. Cierra con un .catch que imprima '[catch] ' + error.message.
  //   Resultado esperado: el paso [4] aparece unos 700 ms despues del [3], y el
  //   precio con IVA es 15.13.
  //   (aprox. 30 lineas)

  // ============================================================
  // 5. ERROR CLASICO 1: OLVIDAR EL return DENTRO DE UN then
  // ============================================================
  // Si dentro de un .then() creamos una promesa pero NO la devolvemos,
  // la cadena no la espera: sigue adelante inmediatamente y el siguiente
  // .then() recibe undefined.
  //
  // ⚠️ ERROR COMUN: es silencioso. No hay error rojo en consola. Simplemente
  // los datos llegan "vacios" y el alumno pasa media hora buscando el fallo.

  // TODO (en clase):
  //   1. Declara demoOlvidarReturn() con
  //      titulo('3.5 - [!] ERROR COMUN: olvidar el return dentro de then') y un cronometro.
  //   2. VERSION INCORRECTA: imprime '--- VERSION INCORRECTA (sin return) ---' y
  //      parte de esperar(200, 'paso A'):
  //        .then -> imprime '[mal 1] <valor>' y llama a esperar(600, 'paso B')
  //                 SIN return (ese es el fallo que queremos ensenar)
  //        .then -> imprime '[mal 2] recibo: <valor>   <-- undefined, y ademas
  //                 llego demasiado pronto (<t()>)'
  //   3. En un tercer .then, imprime una linea vacia y
  //      '--- VERSION CORRECTA (con return) ---', crea const t2 = cronometro() y
  //      DEVUELVE una cadena nueva sobre esperar(200, 'paso A'):
  //        .then -> imprime '[bien 1] <valor>' y devuelve CON return
  //                 esperar(600, 'paso B')
  //        .then -> imprime '[bien 2] recibo: <valor>   <-- el valor correcto,
  //                 tras esperar (<t2()>)' y despues las tres lineas de moraleja:
  //                 'REGLA: dentro de un then, si creas una promesa, DEVUELVELA.'
  //                 'Truco: con funciones flecha de una sola linea el return es implicito:'
  //                 '   .then(v => esperar(600, v))   ya devuelve la promesa.'
  //   Resultado esperado: [mal 2] muestra "undefined" a los ~200 ms; [bien 2]
  //   muestra "paso B" a los ~800 ms.
  //   (aprox. 32 lineas)

  // ============================================================
  // 6. ERROR CLASICO 2: EL catch QUE NO CAPTURA
  // ============================================================
  // El .catch() solo atrapa lo que ocurre ANTES de el en la cadena.
  // Si lo colocamos en medio, todo lo que venga despues queda desprotegido.
  //
  // Y hay un segundo caso mucho mas traicionero: un throw dentro de un
  // setTimeout NO lo captura nadie. Cuando el temporizador se dispara, la
  // cadena de promesas ya termino: ese error se escapa al ambito global.
  //
  // ✅ BUENA PRACTICA: el catch va SIEMPRE al final de la cadena.

  // TODO (en clase):
  //   1. Declara con let una bandera esperandoErrorDeLaDemo = false, para que el
  //      vigilante global de errores solo hable durante esta demo.
  //   2. Escucha los errores globales con
  //      window.addEventListener('error', function (evento) { ... }): si la bandera
  //      es false, return; si es true, imprime
  //      '[window.onerror] Se escapo un error al ambito global: ' + evento.message
  //      y '                 Ningun .catch() pudo verlo. La promesa quedo PENDIENTE
  //      para siempre.', y vuelve a poner la bandera a false.
  //      (En una app real esto no se usa asi: aqui solo sirve para verlo en pantalla.)
  //   (aprox. 10 lineas)

  // TODO (en clase):
  //   1. Declara demoCatchQueNoCaptura() con
  //      titulo('3.6 - [!] ERROR COMUN: el catch que no captura').
  //   2. CASO A: imprime 'CASO A: el catch colocado ANTES del paso que falla.' y
  //      parte de esperar(200, 'todo bien de momento'):
  //        .then  -> imprime '  [A1] <valor>'
  //        .catch -> imprime '  [A-catch temprano] no me entero de nada, ya he pasado'
  //        .then  -> imprime '  [A2] ahora lanzo un error a proposito...' y hace
  //                  throw new Error('Fallo posterior al catch')
  //        .catch -> imprime '  [A-catch final] SI lo capturo: <mensaje>' y
  //                  '  REGLA: el catch cubre lo que esta POR ENCIMA de el, nunca lo
  //                  de debajo.'; devuelve esperar(600) para que el caso B no se mezcle.
  //   3. CASO B (en el siguiente .then): imprime una linea vacia,
  //      'CASO B: un throw dentro de un setTimeout dentro del ejecutor.' y
  //      'Vas a ver un error ROJO en DevTools. Es a proposito.'
  //      Pon esperandoErrorDeLaDemo = true, crea const promesaRota = new Promise(...)
  //      cuyo setTimeout de 300 ms haga throw new Error('Error lanzado dentro de
  //      setTimeout') (ANTIPATRON a proposito), y engánchale un .catch que imprima
  //      '  [B-catch] esto no se vera jamas: ...'. Devuelve esperar(900).
  //   4. Ultimo .then: imprime la version correcta,
  //      '  [OK] LA FORMA CORRECTA del caso B: llamar a reject(), no lanzar.',
  //      crea const promesaSana = new Promise(...) cuyo setTimeout de 200 ms haga
  //      reject(new Error('Error entregado con reject()')), y devuelve
  //      promesaSana.catch(...) imprimiendo
  //      '  [B-catch correcto] capturado sin problemas: <mensaje>'.
  //   Resultado esperado: el [B-catch] normal NUNCA aparece; en su lugar sale la
  //   linea de [window.onerror]. El [B-catch correcto] si aparece.
  //   (aprox. 60 lineas)

  // ============================================================
  // 7. COMBINADORES: TRABAJAR CON VARIAS PROMESAS A LA VEZ
  // ============================================================
  // Los cuatro reciben un ARRAY (o cualquier iterable) de promesas.
  // La diferencia esta en CUANDO deciden que han terminado.

  // --- 7.1 Promise.all -------------------------------------------------
  // Se cumple cuando TODAS se cumplen, y devuelve un array de resultados
  // EN EL MISMO ORDEN del array de entrada (aunque terminen desordenadas).
  // Se rechaza en cuanto UNA falla: es "todo o nada".
  // Usalo cuando necesitas todos los datos para poder pintar la pantalla.

  // TODO (en clase):
  //   1. Declara demoAll() con titulo('3.7 - Promise.all: todo o nada'), un
  //      cronometro y dos lineas de contexto:
  //      'Lanzo 3 tareas a la vez: 900 ms, 400 ms y 1300 ms.'
  //      'Si fueran secuenciales tardarian 2600 ms. En paralelo: lo que tarde la mas lenta.'
  //   2. Llama a Promise.all([...]) con esperar(900, 'perfil del usuario'),
  //      esperar(400, 'lista de pedidos') y esperar(1300, 'historial de pagos').
  //      En el .then imprime 'CUMPLIDA en <t()> (aprox. la duracion de la mas lenta)'
  //      y 'Resultados EN ORDEN DE ENTRADA, no de llegada:' junto al array.
  //      Anade un .catch que imprima el mensaje del error.
  //   3. Encadena otro .then que imprima
  //      'Ahora lo mismo, pero una de las tres falla a los 500 ms:', cree un
  //      cronometro t2 y devuelva un Promise.all donde la segunda promesa sea
  //      fallarTras(500, 'La API de pedidos devolvio un 500'). En su .catch imprime:
  //      'RECHAZADA en <t2()> -> <mensaje>'
  //      '[!] Las otras dos promesas NO se cancelan: siguen corriendo en segundo plano.'
  //      '   Simplemente su resultado ya no le importa a nadie.'
  //   Resultado esperado: la primera parte tarda ~1300 ms; la segunda falla a los ~500 ms.
  //   (aprox. 38 lineas)

  // --- 7.2 Promise.allSettled ------------------------------------------
  // NUNCA se rechaza. Espera a que todas terminen (bien o mal) y devuelve
  // un array de objetos con esta forma:
  //   { status: 'fulfilled', value: ... }   o   { status: 'rejected', reason: ... }
  // Usalo cuando quieras mostrar resultados parciales: "3 de 5 correos enviados".

  // TODO (en clase):
  //   1. Declara demoAllSettled() con titulo('3.8 - Promise.allSettled: quiero
  //      saberlo todo'), un cronometro y la linea
  //      'Enviamos 4 correos. Dos funcionan, dos fallan. Ninguno cancela a los demas.'
  //   2. Llama a Promise.allSettled([...]) con estas cuatro:
  //        esperar(400, 'correo a lucia@instituto.edu enviado')
  //        fallarTras(600, 'buzon lleno: mateo@instituto.edu')
  //        esperar(800, 'correo a sofia@instituto.edu enviado')
  //        fallarTras(300, 'direccion inexistente: pruebas@@instituto.edu')
  //   3. En el .then imprime 'Terminado en <t()>. Ni un solo catch necesario.' y una
  //      linea de guiones; recorre los resultados con forEach(resultado, indice):
  //      si resultado.status === 'fulfilled' imprime '  [<n>] OK    -> <value>',
  //      si no imprime '  [<n>] FALLO -> <reason.message>' (en los rechazados el
  //      error viene en .reason, no en .value).
  //   4. Cuenta los correctos con filter(...).length e imprime la linea de guiones,
  //      'Resumen: 2 de 4 correos enviados.' y
  //      '[OK] Este es el combinador que quieres para envios masivos e informes.'
  //   (aprox. 30 lineas)

  // --- 7.3 Promise.race -------------------------------------------------
  // Termina con la PRIMERA promesa que cambie de estado, sea cumplida o
  // rechazada. Su uso estrella es imponer un tiempo limite (timeout).

  // TODO (en clase):
  //   1. Declara demoRace() con titulo('3.9 - Promise.race: gana la primera en
  //      terminar'), un cronometro y la linea
  //      'CASO 1: servidor lento (2500 ms) contra un limite de 1000 ms.'
  //   2. Promise.race([ esperar(2500, 'datos del servidor lento'),
  //      fallarTras(1000, 'Tiempo de espera agotado (1000 ms)') ]):
  //      .then  -> '  Gano el servidor: <valor>' (no entrara)
  //      .catch -> '  Gano el reloj en <t()> -> <mensaje>' y
  //                '  [OK] Este es el patron "timeout": una carrera contra un cronometro.'
  //   3. Encadena otro .then con el CASO 2: mismo limite pero
  //      esperar(400, 'datos del servidor rapido'). Ahora gana el servidor:
  //      imprime '  Gano el servidor en <t2()> -> <valor>'.
  //   Resultado esperado: caso 1 falla a los ~1000 ms; caso 2 se cumple a los ~400 ms.
  //   (aprox. 34 lineas)

  // --- 7.4 Promise.any --------------------------------------------------
  // Se cumple con la primera que se CUMPLA, ignorando las que fallen.
  // Solo se rechaza si fallan TODAS, y entonces lanza un AggregateError
  // que contiene el array de todos los errores en su propiedad .errors.
  // Usalo con servidores espejo: te vale el primero que responda bien.

  // TODO (en clase):
  //   1. Declara demoAny() con titulo('3.10 - Promise.any: la primera que funcione').
  //   2. DETECCION DE CARACTERISTICAS: si typeof Promise.any !== 'function',
  //      imprime 'Tu navegador no soporta Promise.any. Actualizalo para probar esta
  //      demo.' y return. (Promise.any es de 2021.)
  //   3. Crea el cronometro e imprime
  //      'Tres servidores espejo. Los dos primeros fallan, el tercero responde.'
  //   4. Promise.any([ fallarTras(300, 'espejo-1 caido'),
  //      fallarTras(500, 'espejo-2 no responde'),
  //      esperar(900, 'catalogo descargado desde espejo-3') ]):
  //      .then -> 'CUMPLIDA en <t()> -> <valor>',
  //               'Los dos fallos anteriores se ignoraron por completo.' y
  //               '(Con Promise.race habriamos fallado a los 300 ms.)'
  //   5. Encadena otro .then con el caso en que fallan TODOS: tres fallarTras
  //      (200 'espejo-1 caido', 400 'espejo-2 no responde', 600 'espejo-3 sin
  //      certificado'). En su .catch imprime
  //      'RECHAZADA en <t2()> con un ' + error.constructor.name  -> AggregateError,
  //      'El AggregateError guarda TODOS los errores dentro de .errors:' y recorre
  //      (error.errors || []) con forEach imprimiendo '   errors[<i>] -> <mensaje>'.
  //   (aprox. 47 lineas)

  // ============================================================
  // 8. CONECTAR LOS BOTONES
  // ============================================================
  // TODO (en clase):
  //   1. Escribe alPulsar(id, manejador) como en los archivos anteriores, avisando
  //      con console.warn('[03-promesas] No encuentro el boton con id "' + id + '".').
  //   2. Engancha los once botones de la seccion 3:
  //        'btn-promesa-ok'     -> demoPromesaCumplida
  //        'btn-promesa-fallo'  -> demoPromesaRechazada
  //        'btn-estados'        -> demoEstados
  //        'btn-encadenar'      -> demoEncadenar
  //        'btn-olvidar-return' -> demoOlvidarReturn
  //        'btn-catch-tardio'   -> demoCatchQueNoCaptura
  //        'btn-all'            -> demoAll
  //        'btn-allsettled'     -> demoAllSettled
  //        'btn-race'           -> demoRace
  //        'btn-any'            -> demoAny
  //        'btn-limpiar-3'      -> limpiar
  //   (aprox. 19 lineas)

  // ============================================================
  // 9. EJERCICIOS PROPUESTOS
  // ============================================================
  /*
    EJERCICIO 1 (facil) - Tu primera promesa
    Escribe lanzarDado() que devuelva una promesa. Tras 800 ms debe cumplirse
    con un numero aleatorio del 1 al 6... salvo que salga un 1, en cuyo caso
    debe rechazarse con new Error('Has sacado un 1: pierdes el turno').
    Consumela con then/catch/finally y muestra los tres casos en la consola.

    EJERCICIO 2 (facil) - La cadena del carrito
    Partiendo de una promesa que se cumple con el array
    [{ producto: 'Teclado', precio: 45 }, { producto: 'Raton', precio: 22 }],
    encadena tres .then(): el primero suma los precios, el segundo aplica un
    21 % de IVA, el tercero muestra el total con dos decimales. Cada then debe
    devolver un valor al siguiente.

    EJERCICIO 3 (medio) - Reintentos automaticos
    Escribe reintentar(crearPromesa, intentos) que llame a crearPromesa() y,
    si la promesa se rechaza, lo vuelva a intentar hasta "intentos" veces
    antes de rendirse. Pruebalo con una funcion que falle las dos primeras
    veces y funcione a la tercera. Pista: recursion dentro del .catch().

    EJERCICIO 4 (medio) - Timeout reutilizable
    Escribe conLimite(promesa, milisegundos) que devuelva una nueva promesa:
    la original si termina a tiempo, o un rechazo con
    new Error('Tiempo agotado') si no. Usa Promise.race por dentro.
    Aplicalo despues a la funcion obtenerUsuarios() del archivo 05.

    EJERCICIO 5 (dificil) - Panel de estado de servicios
    Tienes cinco servicios (autenticacion, catalogo, pagos, correo, informes).
    Cada uno tarda un tiempo aleatorio y falla con un 40 % de probabilidad.
    Usa Promise.allSettled para pintar en la pagina una lista con un punto
    verde o rojo por servicio, el tiempo que tardo cada uno y un resumen
    final del tipo "3 de 5 servicios operativos". Nada de <pre>: tarjetas.
  */
})();
