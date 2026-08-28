/**
 * ============================================================================
 * ARCHIVO: js/04-async-await.js   ·   PLANTILLA DE CLASE (sin resolver)
 * TEMA:    async / await. Como transforma el codigo, por que una funcion
 *          async siempre devuelve una promesa, try/catch/finally, y la
 *          diferencia REAL de tiempo entre await en bucle (secuencial)
 *          y Promise.all (paralelo).
 *
 * QUE VAS A APRENDER
 *  1. Que async/await es "azucar sintactico" sobre las promesas: por debajo
 *     todo sigue siendo exactamente lo mismo.
 *  2. Que una funcion async SIEMPRE devuelve una promesa, sin excepciones.
 *  3. A capturar errores asincronos con try/catch, como en cualquier lenguaje.
 *  4. El error de rendimiento mas caro del front end: poner un await dentro
 *     de un bucle cuando las tareas son independientes.
 *  5. A medir esa diferencia con un cronometro y verla en barras.
 *
 * IIFE: todo encerrado para no chocar con los otros archivos .js.
 *
 * COMO SE USA ESTA PLANTILLA
 * La teoria esta completa; el codigo se escribe en vivo con los bloques
 * "TODO (en clase)". La solucion esta en ../js/04-async-await.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL DE ESTA SECCION   [YA ESCRITO]
  // ============================================================
  const consola = document.getElementById('salida-async');

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

  // ============================================================
  // 1. UTILIDADES ASINCRONAS DE APOYO
  // ============================================================
  // esperar() es nuestro "sleep": una promesa que se cumple tras N ms.
  // Como setTimeout llamara a resolve sin argumentos, la promesa se cumple
  // con undefined, que es justo lo que queremos para una pausa.

  // TODO (en clase):
  //   1. Declara esperar(milisegundos) y devuelve
  //      new Promise(function (resolve) { setTimeout(resolve, milisegundos); }).
  //      Fijate en que a setTimeout le pasamos resolve SIN parentesis: es una
  //      funcion, no una llamada.
  //   (aprox. 5 lineas)

  /**
   * descargarInforme(): simula la descarga de un informe del servidor.
   * @param {string} nombre - nombre del informe
   * @param {number} ms     - lo que tarda
   * @returns {Promise<Object>} objeto con el informe ya "descargado"
   *
   * La palabra async delante convierte automaticamente el valor devuelto
   * en una promesa cumplida con ese valor.
   */
  // TODO (en clase):
  //   1. Declara async function descargarInforme(nombre, ms).
  //   2. Haz await esperar(ms) -> pausa la FUNCION, no la pagina.
  //   3. Devuelve el objeto { informe: nombre, paginas: nombre.length * 3, duracion: ms }.
  //   Resultado esperado: descargarInforme('Matriculas', 500) se cumple medio
  //   segundo despues con { informe: 'Matriculas', paginas: 30, duracion: 500 }.
  //   (aprox. 4 lineas)

  /** cronometro(): mide milisegundos transcurridos desde su creacion. */
  // TODO (en clase):
  //   1. Declara cronometro(): guarda const inicio = performance.now() y devuelve
  //      una funcion que devuelva Math.round(performance.now() - inicio).
  //      Ojo: en este archivo devuelve un NUMERO, no un texto con ' ms'.
  //   (aprox. 6 lineas)

  // ============================================================
  // 2. EL MISMO CODIGO CON then Y CON await
  // ============================================================
  // async/await NO es una alternativa a las promesas: es otra FORMA DE
  // ESCRIBIRLAS. La palabra await significa literalmente:
  // "pausa esta funcion aqui hasta que la promesa se resuelva, y dame su valor".
  //
  // Importante: await pausa LA FUNCION, no el navegador. El hilo queda libre
  // para atender clics, animaciones y otras tareas mientras tanto.

  /** Version clasica con .then() encadenados. */
  // TODO (en clase):
  //   1. Declara conThen() (NO es async) con const t = cronometro().
  //   2. Devuelve descargarInforme('Matriculas', 500) encadenando:
  //      .then -> imprime '  [then] 1 -> <informe> (<paginas> paginas)' y DEVUELVE
  //               descargarInforme('Asistencia', 500)
  //      .then -> imprime '  [then] 2 -> <informe> (<paginas> paginas)' y
  //               '  [then] terminado en <t()> ms'
  //   (aprox. 12 lineas)

  /** La MISMA logica con async/await: se lee de arriba abajo. */
  // TODO (en clase):
  //   1. Declara async function conAwait() con su cronometro.
  //   2. const uno = await descargarInforme('Matriculas', 500); imprime
  //      '  [await] 1 -> <informe> (<paginas> paginas)'.
  //   3. const dos = await descargarInforme('Asistencia', 500); imprime
  //      '  [await] 2 -> ...' y '  [await] terminado en <t()> ms'.
  //   Resultado esperado: las mismas cuatro lineas que conThen() y el mismo
  //   tiempo total (~1000 ms), con la mitad de sangria.
  //   (aprox. 9 lineas)

  // TODO (en clase):
  //   1. Declara async function demoThenVsAwait() con
  //      titulo('4.1 - El mismo codigo con then y con await').
  //   2. Imprime 'VERSION CON .then() (funciones dentro de funciones):' y haz
  //      await conThen().
  //   3. Imprime una linea vacia y 'VERSION CON async/await (lectura lineal, sin
  //      anidar):' y haz await conAwait().
  //   4. Cierra con las cuatro lineas de conclusion:
  //      'Mismo resultado, mismo tiempo, misma maquinaria por debajo.'
  //      'Lo unico que cambia es la LEGIBILIDAD del codigo fuente.'
  //      '[OK] BUENA PRACTICA: usa async/await por defecto; guarda .then() para'
  //      '   cadenas cortas y para los combinadores.'
  //   (aprox. 15 lineas)

  // ============================================================
  // 3. UNA FUNCION async SIEMPRE DEVUELVE UNA PROMESA
  // ============================================================
  // Esto no admite matices: aunque la funcion no tenga ni un solo await y
  // devuelva el numero 42, lo que sale por la puerta es una PROMESA cumplida
  // con 42. Si dentro se lanza un throw, sale una promesa RECHAZADA.
  //
  // ⚠️ ERROR COMUN: llamar a una funcion async y usar su resultado como si
  // fuera un valor normal:
  //     const total = calcularTotal();     // total es una PROMESA
  //     console.log(total + 10);           // "[object Promise]10"  <- desastre
  // Lo correcto: const total = await calcularTotal();

  // TODO (en clase):
  //   1. Declara async function demoAsyncDevuelvePromesa() con
  //      titulo('4.2 - Una funcion async SIEMPRE devuelve una promesa').
  //   2. Dentro, declara async function calcularTotal() { return 42; }: ni un solo
  //      await y aun asi devuelve promesa.
  //   3. const resultado = calcularTotal(); e imprime:
  //      'typeof calcularTotal() ->' junto a typeof resultado        (object)
  //      '¿Es una promesa? ->' junto a resultado instanceof Promise  (true)
  //      'Concatenarla sin await da esto ->' junto a String(resultado) + '10'
  //      '[!] ERROR COMUN: eso de arriba. Falta el await.'
  //   4. const valor = await resultado; e imprime 'Con await ->', valor,
  //      '(y ahora si suma:', valor + 10, ')'.
  //   5. Imprime 'Y si la funcion lanza un error, la promesa sale RECHAZADA:',
  //      declara async function fallar() { throw new Error('Presupuesto no
  //      encontrado'); } y consumela con
  //      await fallar().catch(function (error) { imprimir('  capturado con
  //      .catch() ->', error.message); }) -> es una promesa normal y corriente.
  //   6. Cierra con la consecuencia practica: await funciona sobre cualquier valor.
  //      '  await 5           ->' junto a await 5   (' (lo envuelve en promesa cumplida)')
  //      '  await "texto"     ->' junto a await 'texto'
  //      'Por eso puedes hacer await sobre una funcion que a veces devuelve'
  //      'promesa y a veces un valor de la cache: funciona igual.'
  //   (aprox. 36 lineas)

  // ============================================================
  // 4. MANEJO DE ERRORES: try / catch / finally
  // ============================================================
  // Esta es la gran comodidad de async/await: los errores asincronos se
  // capturan con el MISMO try/catch de toda la vida.
  //
  //   try     -> el codigo que puede fallar
  //   catch   -> que hacer si falla (recibe el error)
  //   finally -> lo que pasa siempre: apagar el spinner, cerrar la conexion
  //
  // ⚠️ ERROR COMUN: poner el await FUERA del try. Si la promesa se rechaza,
  // el error se escapa y aparece como "Uncaught (in promise)".

  // TODO (en clase):
  //   1. Declara async function demoTryCatch() con
  //      titulo('4.3 - try / catch / finally con async/await').
  //   2. Dentro declara async function guardarNota(estudiante, nota): haz
  //      await esperar(400); si nota < 0 || nota > 10 lanza
  //      new Error('Nota fuera de rango para <estudiante>: <nota>'); si no,
  //      devuelve 'Nota <nota> guardada para <estudiante>'.
  //   3. CASO 1 (todo bien): imprime 'CASO 1: nota valida (8.5)' y dentro de un
  //      try/catch/finally haz const mensaje = await guardarNota('Lucia Ferreira', 8.5)
  //      e imprime '  [try]     <mensaje>'; el catch imprime '  [catch]   <mensaje>'
  //      (no entrara) y el finally '  [finally] cerrando el formulario (se ejecuta siempre)'.
  //   4. CASO 2 (falla): imprime 'CASO 2: nota invalida (12)' y repite el
  //      try/catch/finally con guardarNota('Mateo Aguirre', 12). En el catch imprime
  //      el mensaje y ademas '            El throw de dentro de la funcion async
  //      llego hasta aqui.'; el finally imprime '  [finally] cerrando el formulario
  //      (se ejecuta igualmente)'.
  //   5. Cierra con los avisos didacticos:
  //      '[!] ERROR COMUN 1: escribir el await fuera del try.'
  //      '   const datos = await pedir();   // si falla, nadie lo captura'
  //      '   try { usar(datos); } catch ...'
  //      '[!] ERROR COMUN 2: capturar el error y no hacer nada con el:'
  //      '   catch (e) { }   <- el fallo desaparece y nadie se entera.'
  //      '[OK] BUENA PRACTICA: en el catch, o informas al usuario, o relanzas'
  //      '   el error con throw para que lo trate quien te llamo.'
  //   Resultado esperado: el CASO 1 sale por [try], el CASO 2 por [catch], y el
  //   [finally] aparece en los dos.
  //   (aprox. 47 lineas)

  // ============================================================
  // 5. SECUENCIAL vs PARALELO: EL ERROR DE RENDIMIENTO MAS CARO
  // ============================================================
  // Cuando varias tareas asincronas NO dependen unas de otras, esperarlas
  // de una en una es tirar el tiempo a la basura.
  //
  //   SECUENCIAL (lento):        PARALELO (rapido):
  //   for (const x of lista) {   const promesas = lista.map(f);
  //     await f(x);              await Promise.all(promesas);
  //   }
  //
  // Con tres tareas de 600 ms: 1800 ms frente a 600 ms. Tres veces mas rapido
  // sin tocar ni el servidor ni la red, solo reordenando dos lineas.
  //
  // ⚠️ MATIZ IMPORTANTE: si la tarea 2 NECESITA el resultado de la tarea 1
  // (por ejemplo, primero el usuario y despues sus pedidos), entonces el
  // await en bucle es CORRECTO y obligatorio. Paralelizar solo tiene sentido
  // cuando las tareas son independientes entre si.

  // Datos de partida: vienen escritos para no perder tiempo tecleandolos.
  const INFORMES = [
    { nombre: 'Matriculas del trimestre', ms: 600 },
    { nombre: 'Asistencia por grupo', ms: 600 },
    { nombre: 'Notas medias por asignatura', ms: 600 }
  ];

  /** Version SECUENCIAL: un await dentro del bucle. */
  // TODO (en clase):
  //   1. Declara async function descargarSecuencial() con const t = cronometro()
  //      y const resultados = [].
  //   2. Recorre INFORMES con for (const info of INFORMES) -> for...of permite
  //      usar await dentro del bucle de forma natural.
  //   3. Dentro del bucle: const informe = await descargarInforme(info.nombre, info.ms);
  //      imprime '  descargado: <informe.informe>  (<t()> ms acumulados)' y
  //      haz resultados.push(informe). Aqui la funcion se PARA en cada vuelta.
  //   4. Devuelve { resultados: resultados, total: t() }.
  //   Resultado esperado: los ms acumulados van saliendo ~600, ~1200, ~1800.
  //   (aprox. 15 lineas)

  /** Version PARALELA: lanzamos las tres y esperamos a todas juntas. */
  // TODO (en clase):
  //   1. Declara async function descargarEnParalelo() con su cronometro.
  //   2. PASO 1: const promesas = INFORMES.map(function (info) { return
  //      descargarInforme(info.nombre, info.ms); }). OJO: al crearlas, las tres
  //      peticiones YA HAN SALIDO.
  //   3. PASO 2: const resultados = await Promise.all(promesas) -> un unico await.
  //   4. Recorre resultados con forEach imprimiendo la misma linea
  //      '  descargado: <informe> (<t()> ms acumulados)'.
  //   5. Devuelve { resultados: resultados, total: t() }.
  //   Resultado esperado: los tres salen con ~600 ms acumulados, no 1800.
  //   (aprox. 18 lineas)

  // --- Pintado de las barras de medicion --------------------------------
  // TODO (en clase):
  //   1. Guarda UNA sola vez las cuatro referencias del medidor con
  //      document.getElementById: 'barra-secuencial', 'barra-paralelo',
  //      'ms-secuencial' y 'ms-paralelo' (constantes barraSecuencial,
  //      barraParalelo, msSecuencial y msParalelo).
  //   2. Escribe pintarMedida(cual, ms, maximo), donde cual es 'secuencial' o
  //      'paralelo': elige la barra y la etiqueta con un operador ternario, sal
  //      con return si alguna no existe, calcula
  //      const porcentaje = Math.min(100, Math.round((ms / maximo) * 100))
  //      (Math.min evita pasarse del 100 %), asigna barra.style.width =
  //      porcentaje + '%' y etiqueta.textContent = ms + ' ms'.
  //   Resultado esperado en pantalla: la barra azul del medidor crece y el texto
  //   "— ms" se sustituye por el tiempo medido.
  //   (aprox. 14 lineas)

  /** Evita que el docente lance dos mediciones a la vez y se solapen. */
  // TODO (en clase):
  //   1. Escribe bloquearBotones(bloquear): recorre con forEach el array
  //      ['btn-secuencial', 'btn-paralelo', 'btn-comparar-tiempos'], busca cada
  //      boton por id y, si existe, ponle boton.disabled = bloquear.
  //   (aprox. 6 lineas)

  // TODO (en clase):
  //   1. Declara async function demoSecuencial() con
  //      titulo('4.4 - await dentro de un bucle (SECUENCIAL)'), bloquearBotones(true)
  //      y la linea 'Tres informes de 600 ms cada uno, esperados de uno en uno.'
  //   2. const { total } = await descargarSecuencial();   (desestructuracion)
  //   3. Imprime 'TOTAL SECUENCIAL: <total> ms  (aprox. 600 + 600 + 600)',
  //      llama a pintarMedida('secuencial', total, 2000) y a bloquearBotones(false).
  //   (aprox. 11 lineas)

  // TODO (en clase):
  //   1. Declara async function demoParalelo() con titulo('4.5 - Promise.all
  //      (PARALELO)'), bloquearBotones(true) y la linea
  //      'Los mismos tres informes de 600 ms, lanzados a la vez.'
  //   2. const { total } = await descargarEnParalelo();
  //   3. Imprime 'TOTAL PARALELO: <total> ms  (aprox. el de la mas lenta)',
  //      pintarMedida('paralelo', total, 2000) y bloquearBotones(false).
  //   (aprox. 11 lineas)

  // TODO (en clase):
  //   1. Declara async function demoComparar() con
  //      titulo('4.6 - Comparativa medida: secuencial vs paralelo') y bloquearBotones(true).
  //   2. Imprime '--- 1) SECUENCIAL: for...of con await dentro ---', guarda
  //      const secuencial = await descargarSecuencial() e imprime
  //      '    total: <secuencial.total> ms'.
  //   3. Imprime '--- 2) PARALELO: map + Promise.all ---', guarda
  //      const paralelo = await descargarEnParalelo() e imprime su total igual.
  //   4. Escala las dos barras contra el tiempo mayor:
  //      const maximo = Math.max(secuencial.total, paralelo.total) y llama dos
  //      veces a pintarMedida con ese maximo.
  //   5. Calcula const ahorro = secuencial.total - paralelo.total y
  //      const veces = paralelo.total > 0 ? (secuencial.total / paralelo.total).toFixed(1) : '-'
  //      (evitamos dividir entre cero).
  //   6. Imprime entre lineas de guiones
  //      'AHORRO: <ahorro> ms   (<veces> veces mas rapido)' y las cuatro lineas finales:
  //      '[OK] BUENA PRACTICA: si las tareas NO dependen entre si, lanzalas'
  //      '   todas y espera una sola vez con Promise.all.'
  //      '[!] PERO: si la tarea 2 necesita el resultado de la 1 (primero el'
  //      '   usuario, luego sus pedidos), el await en bucle es lo correcto.'
  //      '   Paralelizar dependencias produce datos incompletos o errores.'
  //   7. Termina con bloquearBotones(false).
  //   Resultado esperado: ~1800 ms frente a ~600 ms, "3.0 veces mas rapido", y las
  //   dos barras del medidor a distinta longitud.
  //   (aprox. 34 lineas)

  // ============================================================
  // 6. CONECTAR LOS BOTONES
  // ============================================================
  // Detalle importante: los manejadores son funciones async. addEventListener
  // acepta funciones async sin problema, pero NO espera a que terminen ni
  // captura sus errores. Por eso conviene que cada demo tenga su try/catch.

  // TODO (en clase):
  //   1. Escribe alPulsar(id, manejador): busca el boton, avisa con
  //      console.warn('[04-async-await] No encuentro el boton con id "' + id + '".')
  //      si no existe, y si existe engancha un listener de 'click' que llame al
  //      manejador ENVUELTO: Promise.resolve(manejador()).catch(function (error) {
  //      imprimir('[error no controlado en la demo] ' + error.message);
  //      bloquearBotones(false); }). Asi ningun error se pierde en silencio ni
  //      deja los botones bloqueados.
  //   2. Engancha los siete botones de la seccion 4:
  //        'btn-then-vs-await'          -> demoThenVsAwait
  //        'btn-async-devuelve-promesa' -> demoAsyncDevuelvePromesa
  //        'btn-try-catch'              -> demoTryCatch
  //        'btn-secuencial'             -> demoSecuencial
  //        'btn-paralelo'               -> demoParalelo
  //        'btn-comparar-tiempos'       -> demoComparar
  //        'btn-limpiar-4'              -> limpiar
  //   (aprox. 21 lineas)

  // ============================================================
  // 7. EJERCICIOS PROPUESTOS
  // ============================================================
  /*
    EJERCICIO 1 (facil) - Traducir de then a await
    Coge la funcion conThen() de este archivo y reescribela tu mismo con
    async/await sin mirar conAwait(). Despues compara tu version con la del
    archivo. ¿Cuantas lineas te has ahorrado?

    EJERCICIO 2 (facil) - Contar hasta cinco despacio
    Escribe una funcion async contarDespacio() que imprima los numeros del 1
    al 5 con una pausa de 500 ms entre cada uno, usando await esperar(500)
    dentro de un for. Comprueba que la pagina sigue respondiendo mientras cuenta
    (prueba a pulsar otro boton en ese rato).

    EJERCICIO 3 (medio) - Paralelizar de verdad
    Escribe descargarTodo(listaDeNombres) que descargue un informe por cada
    nombre. Hazlo primero secuencial y luego paralelo, cronometrando las dos
    versiones con performance.now(). Prueba con listas de 3, 6 y 12 nombres:
    ¿crece igual el tiempo en los dos casos?

    EJERCICIO 4 (medio) - Paralelo con limite de concurrencia
    Lanzar 200 peticiones a la vez satura al servidor. Escribe
    enTandas(tareas, tamanoDeTanda) que ejecute las tareas en grupos de N
    en paralelo, esperando a que termine cada grupo antes de empezar el
    siguiente. Combina un for...of (secuencial entre tandas) con
    Promise.all (paralelo dentro de la tanda).

    EJERCICIO 5 (dificil) - Cadena con dependencias y reintentos
    Simula este flujo: autenticar -> obtener perfil -> obtener pedidos ->
    obtener detalle de CADA pedido. Los tres primeros pasos dependen entre si
    (secuenciales); los detalles de los pedidos son independientes (paralelos).
    Anade ademas un reintento automatico: si un paso falla, se reintenta una
    vez tras 500 ms antes de darse por vencido. Todo con async/await y un unico
    try/catch/finally en la funcion principal.
  */
})();
