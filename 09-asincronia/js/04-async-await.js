/**
 * ============================================================================
 * ARCHIVO: js/04-async-await.js
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
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL DE ESTA SECCION
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
  // Fijate en la funcion flecha: (resolve) => setTimeout(resolve, ms).
  // Como setTimeout llamara a resolve sin argumentos, la promesa se cumple
  // con undefined, que es justo lo que queremos para una pausa.
  function esperar(milisegundos) {
    return new Promise(function (resolve) {
      setTimeout(resolve, milisegundos);
    });
  }

  /**
   * descargarInforme(): simula la descarga de un informe del servidor.
   * @param {string} nombre - nombre del informe
   * @param {number} ms     - lo que tarda
   * @returns {Promise<Object>} objeto con el informe ya "descargado"
   *
   * La palabra async delante convierte automaticamente el valor devuelto
   * en una promesa cumplida con ese valor.
   */
  async function descargarInforme(nombre, ms) {
    await esperar(ms);                 // pausa la funcion, NO la pagina
    return { informe: nombre, paginas: nombre.length * 3, duracion: ms };
  }

  /** cronometro(): mide milisegundos transcurridos desde su creacion. */
  function cronometro() {
    const inicio = performance.now();
    return function () {
      return Math.round(performance.now() - inicio);
    };
  }

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
  function conThen() {
    const t = cronometro();
    return descargarInforme('Matriculas', 500)
      .then(function (uno) {
        imprimir('  [then] 1 -> ' + uno.informe + ' (' + uno.paginas + ' paginas)');
        return descargarInforme('Asistencia', 500);
      })
      .then(function (dos) {
        imprimir('  [then] 2 -> ' + dos.informe + ' (' + dos.paginas + ' paginas)');
        imprimir('  [then] terminado en ' + t() + ' ms');
      });
  }

  /** La MISMA logica con async/await: se lee de arriba abajo. */
  async function conAwait() {
    const t = cronometro();
    const uno = await descargarInforme('Matriculas', 500);
    imprimir('  [await] 1 -> ' + uno.informe + ' (' + uno.paginas + ' paginas)');

    const dos = await descargarInforme('Asistencia', 500);
    imprimir('  [await] 2 -> ' + dos.informe + ' (' + dos.paginas + ' paginas)');
    imprimir('  [await] terminado en ' + t() + ' ms');
  }

  async function demoThenVsAwait() {
    titulo('4.1 - El mismo codigo con then y con await');
    imprimir('VERSION CON .then() (funciones dentro de funciones):');
    await conThen();

    imprimir('');
    imprimir('VERSION CON async/await (lectura lineal, sin anidar):');
    await conAwait();

    imprimir('');
    imprimir('Mismo resultado, mismo tiempo, misma maquinaria por debajo.');
    imprimir('Lo unico que cambia es la LEGIBILIDAD del codigo fuente.');
    imprimir('[OK] BUENA PRACTICA: usa async/await por defecto; guarda .then() para');
    imprimir('   cadenas cortas y para los combinadores.');
  }

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

  async function demoAsyncDevuelvePromesa() {
    titulo('4.2 - Una funcion async SIEMPRE devuelve una promesa');

    // Ni un solo await dentro, y aun asi devuelve promesa.
    async function calcularTotal() {
      return 42;
    }

    const resultado = calcularTotal();
    imprimir('typeof calcularTotal() ->', typeof resultado);
    imprimir('¿Es una promesa? ->', resultado instanceof Promise);
    imprimir('Concatenarla sin await da esto ->', String(resultado) + '10');
    imprimir('[!] ERROR COMUN: eso de arriba. Falta el await.');

    const valor = await resultado;   // asi SI obtenemos el numero
    imprimir('Con await ->', valor, '(y ahora si suma:', valor + 10, ')');

    imprimir('');
    imprimir('Y si la funcion lanza un error, la promesa sale RECHAZADA:');

    async function fallar() {
      throw new Error('Presupuesto no encontrado');
    }

    // Podemos consumirla con .catch() porque es una promesa normal y corriente.
    await fallar().catch(function (error) {
      imprimir('  capturado con .catch() ->', error.message);
    });

    imprimir('');
    imprimir('CONSECUENCIA PRACTICA: await funciona sobre cualquier valor.');
    imprimir('  await 5           ->', await 5, ' (lo envuelve en promesa cumplida)');
    imprimir('  await "texto"     ->', await 'texto');
    imprimir('Por eso puedes hacer await sobre una funcion que a veces devuelve');
    imprimir('promesa y a veces un valor de la cache: funciona igual.');
  }

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

  async function demoTryCatch() {
    titulo('4.3 - try / catch / finally con async/await');

    /** Simula una operacion que falla o no segun el parametro. */
    async function guardarNota(estudiante, nota) {
      await esperar(400);
      if (nota < 0 || nota > 10) {
        throw new Error('Nota fuera de rango para ' + estudiante + ': ' + nota);
      }
      return 'Nota ' + nota + ' guardada para ' + estudiante;
    }

    // --- CASO 1: todo va bien ---
    imprimir('CASO 1: nota valida (8.5)');
    try {
      const mensaje = await guardarNota('Lucia Ferreira', 8.5);
      imprimir('  [try]     ' + mensaje);
    } catch (error) {
      imprimir('  [catch]   ' + error.message);        // no entra
    } finally {
      imprimir('  [finally] cerrando el formulario (se ejecuta siempre)');
    }

    imprimir('');

    // --- CASO 2: la operacion falla ---
    imprimir('CASO 2: nota invalida (12)');
    try {
      const mensaje = await guardarNota('Mateo Aguirre', 12);
      imprimir('  [try]     ' + mensaje);              // no entra
    } catch (error) {
      imprimir('  [catch]   ' + error.message);
      imprimir('            El throw de dentro de la funcion async llego hasta aqui.');
    } finally {
      imprimir('  [finally] cerrando el formulario (se ejecuta igualmente)');
    }

    imprimir('');
    imprimir('[!] ERROR COMUN 1: escribir el await fuera del try.');
    imprimir('   const datos = await pedir();   // si falla, nadie lo captura');
    imprimir('   try { usar(datos); } catch ...');
    imprimir('');
    imprimir('[!] ERROR COMUN 2: capturar el error y no hacer nada con el:');
    imprimir('   catch (e) { }   <- el fallo desaparece y nadie se entera.');
    imprimir('[OK] BUENA PRACTICA: en el catch, o informas al usuario, o relanzas');
    imprimir('   el error con throw para que lo trate quien te llamo.');
  }

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

  const INFORMES = [
    { nombre: 'Matriculas del trimestre', ms: 600 },
    { nombre: 'Asistencia por grupo', ms: 600 },
    { nombre: 'Notas medias por asignatura', ms: 600 }
  ];

  /** Version SECUENCIAL: un await dentro del bucle. */
  async function descargarSecuencial() {
    const t = cronometro();
    const resultados = [];

    // for...of permite usar await dentro del bucle de forma natural.
    for (const info of INFORMES) {
      // Aqui la funcion se PARA hasta que este informe llega.
      // Los otros dos ni siquiera se han empezado a pedir todavia.
      const informe = await descargarInforme(info.nombre, info.ms);
      imprimir('  descargado: ' + informe.informe + '  (' + t() + ' ms acumulados)');
      resultados.push(informe);
    }

    return { resultados: resultados, total: t() };
  }

  /** Version PARALELA: lanzamos las tres y esperamos a todas juntas. */
  async function descargarEnParalelo() {
    const t = cronometro();

    // PASO 1: map crea las tres promesas. OJO: al crearlas, las tres
    // peticiones YA HAN SALIDO. El trabajo empieza en este mismo instante.
    const promesas = INFORMES.map(function (info) {
      return descargarInforme(info.nombre, info.ms);
    });

    // PASO 2: un unico await para las tres. Tardara lo que tarde la mas lenta.
    const resultados = await Promise.all(promesas);

    resultados.forEach(function (informe) {
      imprimir('  descargado: ' + informe.informe + '  (' + t() + ' ms acumulados)');
    });

    return { resultados: resultados, total: t() };
  }

  // --- Pintado de las barras de medicion --------------------------------
  // Guardamos las referencias a los elementos del medidor una sola vez.
  const barraSecuencial = document.getElementById('barra-secuencial');
  const barraParalelo = document.getElementById('barra-paralelo');
  const msSecuencial = document.getElementById('ms-secuencial');
  const msParalelo = document.getElementById('ms-paralelo');

  /**
   * pintarMedida(): traduce milisegundos a un porcentaje de ancho de barra.
   * @param {'secuencial'|'paralelo'} cual
   * @param {number} ms          - tiempo medido
   * @param {number} maximo      - tiempo que corresponde al 100 % de la barra
   */
  function pintarMedida(cual, ms, maximo) {
    const barra = cual === 'secuencial' ? barraSecuencial : barraParalelo;
    const etiqueta = cual === 'secuencial' ? msSecuencial : msParalelo;
    if (!barra || !etiqueta) return;

    // Math.min evita que la barra se pase del 100 % si algo va muy lento.
    const porcentaje = Math.min(100, Math.round((ms / maximo) * 100));
    barra.style.width = porcentaje + '%';
    etiqueta.textContent = ms + ' ms';
  }

  /** Evita que el docente lance dos mediciones a la vez y se solapen. */
  function bloquearBotones(bloquear) {
    ['btn-secuencial', 'btn-paralelo', 'btn-comparar-tiempos'].forEach(function (id) {
      const boton = document.getElementById(id);
      if (boton) boton.disabled = bloquear;
    });
  }

  async function demoSecuencial() {
    titulo('4.4 - await dentro de un bucle (SECUENCIAL)');
    bloquearBotones(true);
    imprimir('Tres informes de 600 ms cada uno, esperados de uno en uno.');

    const { total } = await descargarSecuencial();

    imprimir('TOTAL SECUENCIAL: ' + total + ' ms  (aprox. 600 + 600 + 600)');
    pintarMedida('secuencial', total, 2000);
    bloquearBotones(false);
  }

  async function demoParalelo() {
    titulo('4.5 - Promise.all (PARALELO)');
    bloquearBotones(true);
    imprimir('Los mismos tres informes de 600 ms, lanzados a la vez.');

    const { total } = await descargarEnParalelo();

    imprimir('TOTAL PARALELO: ' + total + ' ms  (aprox. el de la mas lenta)');
    pintarMedida('paralelo', total, 2000);
    bloquearBotones(false);
  }

  async function demoComparar() {
    titulo('4.6 - Comparativa medida: secuencial vs paralelo');
    bloquearBotones(true);

    imprimir('--- 1) SECUENCIAL: for...of con await dentro ---');
    const secuencial = await descargarSecuencial();
    imprimir('    total: ' + secuencial.total + ' ms');

    imprimir('');
    imprimir('--- 2) PARALELO: map + Promise.all ---');
    const paralelo = await descargarEnParalelo();
    imprimir('    total: ' + paralelo.total + ' ms');

    // Escalamos las dos barras contra el tiempo mayor, para que se comparen bien.
    const maximo = Math.max(secuencial.total, paralelo.total);
    pintarMedida('secuencial', secuencial.total, maximo);
    pintarMedida('paralelo', paralelo.total, maximo);

    const ahorro = secuencial.total - paralelo.total;
    // toFixed(1) da un decimal; si paralelo fuera 0 evitamos dividir entre cero.
    const veces = paralelo.total > 0 ? (secuencial.total / paralelo.total).toFixed(1) : '-';

    imprimir('');
    imprimir('------------------------------------------------------------');
    imprimir('AHORRO: ' + ahorro + ' ms   (' + veces + ' veces mas rapido)');
    imprimir('------------------------------------------------------------');
    imprimir('[OK] BUENA PRACTICA: si las tareas NO dependen entre si, lanzalas');
    imprimir('   todas y espera una sola vez con Promise.all.');
    imprimir('[!] PERO: si la tarea 2 necesita el resultado de la 1 (primero el');
    imprimir('   usuario, luego sus pedidos), el await en bucle es lo correcto.');
    imprimir('   Paralelizar dependencias produce datos incompletos o errores.');

    bloquearBotones(false);
  }

  // ============================================================
  // 6. CONECTAR LOS BOTONES
  // ============================================================
  // Detalle importante: los manejadores son funciones async. addEventListener
  // acepta funciones async sin problema, pero NO espera a que terminen ni
  // captura sus errores. Por eso conviene que cada demo tenga su try/catch.
  function alPulsar(id, manejador) {
    const boton = document.getElementById(id);
    if (!boton) {
      console.warn('[04-async-await] No encuentro el boton con id "' + id + '".');
      return;
    }
    boton.addEventListener('click', function () {
      // Envolvemos la llamada para que ningun error se pierda en silencio.
      Promise.resolve(manejador()).catch(function (error) {
        imprimir('[error no controlado en la demo] ' + error.message);
        bloquearBotones(false);
      });
    });
  }

  alPulsar('btn-then-vs-await', demoThenVsAwait);
  alPulsar('btn-async-devuelve-promesa', demoAsyncDevuelvePromesa);
  alPulsar('btn-try-catch', demoTryCatch);
  alPulsar('btn-secuencial', demoSecuencial);
  alPulsar('btn-paralelo', demoParalelo);
  alPulsar('btn-comparar-tiempos', demoComparar);
  alPulsar('btn-limpiar-4', limpiar);

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
