/**
 * ============================================================================
 * ARCHIVO: js/05-fetch.js
 * TEMA:    fetch. La peticion, el objeto Response, response.ok y
 *          response.status, response.json(), por que un 404 NO rechaza la
 *          promesa, cabeceras, metodo POST con body JSON, cancelacion con
 *          AbortController y los CUATRO estados de la interfaz.
 *
 * QUE VAS A APRENDER
 *  1. Que fetch devuelve una promesa que se cumple con un objeto Response.
 *  2. Que leer el cuerpo (response.json()) es una SEGUNDA promesa.
 *  3. Que un 404 o un 500 son "exitos" para fetch: hay que mirar response.ok.
 *  4. A enviar datos con POST, cabeceras y JSON.stringify.
 *  5. A cancelar una peticion en curso con AbortController.
 *  6. A pintar los cuatro estados de una pantalla que pide datos:
 *     CARGANDO, EXITO, ERROR y VACIO.
 *
 * ############################################################################
 * # AVISO MUY IMPORTANTE PARA EL AULA: EL MODO SIMULADO                      #
 * ############################################################################
 * # Una peticion fetch a una API externa FALLA si:                           #
 * #   - abrimos el index.html haciendo doble clic (protocolo file://), o     #
 * #   - no hay conexion a internet, o                                        #
 * #   - la API publica esta caida o bloqueada por la red del centro.         #
 * #                                                                          #
 * # Para que la clase funcione SIEMPRE, la funcion obtenerUsuarios() hace un #
 * # intento real de fetch dentro de un try/catch y, si falla por cualquier   #
 * # motivo, recurre a un array de datos SIMULADOS definido en este mismo     #
 * # archivo, devolviendolos tras un retraso artificial con una promesa y     #
 * # setTimeout (para que el spinner de carga se vea igual).                  #
 * #                                                                          #
 * # La insignia de la pagina indica en todo momento si los datos vienen de   #
 * # la API real o del modo simulado. Para ver el fetch REAL, abre el         #
 * # proyecto con Live Server (ver README.md).                                #
 * ############################################################################
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL Y UTILIDADES
  // ============================================================
  const consola = document.getElementById('salida-fetch');

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

  /** esperar(): pausa asincrona reutilizable. Simula la latencia de la red. */
  function esperar(milisegundos) {
    return new Promise(function (resolve) {
      setTimeout(resolve, milisegundos);
    });
  }

  // ============================================================
  // 1. CONFIGURACION
  // ============================================================
  // jsonplaceholder es una API publica de PRUEBAS: no necesita clave, no
  // guarda nada de verdad y responde con datos falsos pero con forma real.
  const API = 'https://jsonplaceholder.typicode.com';
  const URL_USUARIOS = API + '/users';
  const URL_INEXISTENTE = API + '/usuarios-que-no-existen';   // devolvera 404
  const URL_PESADA = API + '/photos';                         // 5000 registros: tarda

  // Tiempo maximo que estamos dispuestos a esperar a la API antes de pasar
  // al modo simulado. Sin limite, una red lenta dejaria el spinner eterno.
  const LIMITE_MS = 6000;

  // ============================================================
  // 2. DATOS SIMULADOS (el plan B que salva la clase)
  // ============================================================
  // Mantienen la MISMA forma que devuelve la API real. Eso es importante:
  // si el simulacro tuviera otra estructura, el codigo que pinta las
  // tarjetas tendria que cambiar y el ejemplo dejaria de ser realista.
  const USUARIOS_SIMULADOS = [
    { id: 1, name: 'Lucia Ferreira', username: 'luciaf', email: 'lucia.ferreira@correo.es', phone: '910 22 33 44', website: 'luciaferreira.dev', address: { city: 'Valencia' }, company: { name: 'Estudio Norte' } },
    { id: 2, name: 'Mateo Aguirre', username: 'maguirre', email: 'mateo.aguirre@correo.es', phone: '911 55 66 77', website: 'aguirre.io', address: { city: 'Bilbao' }, company: { name: 'Datalab Sur' } },
    { id: 3, name: 'Sofia Duarte', username: 'sduarte', email: 'sofia.duarte@correo.es', phone: '912 88 99 00', website: 'duarte.design', address: { city: 'Sevilla' }, company: { name: 'Marea Digital' } },
    { id: 4, name: 'Bruno Salgado', username: 'bsalgado', email: 'bruno.salgado@correo.es', phone: '913 11 22 33', website: 'salgado.dev', address: { city: 'A Coruna' }, company: { name: 'Puerto Cloud' } },
    { id: 5, name: 'Irene Cabral', username: 'icabral', email: 'irene.cabral@correo.es', phone: '914 44 55 66', website: 'cabral.tech', address: { city: 'Zaragoza' }, company: { name: 'Aula Viva' } },
    { id: 6, name: 'Diego Ocampo', username: 'docampo', email: 'diego.ocampo@correo.es', phone: '915 77 88 99', website: 'ocampo.app', address: { city: 'Murcia' }, company: { name: 'Sistemas Rio' } },
    { id: 7, name: 'Carla Bermudez', username: 'cbermudez', email: 'carla.bermudez@correo.es', phone: '916 33 44 55', website: 'bermudez.dev', address: { city: 'Granada' }, company: { name: 'Alhambra Soft' } },
    { id: 8, name: 'Nicolas Peralta', username: 'nperalta', email: 'nicolas.peralta@correo.es', phone: '917 66 77 88', website: 'peralta.codes', address: { city: 'Salamanca' }, company: { name: 'Torre Datos' } },
    { id: 9, name: 'Elena Vidal', username: 'evidal', email: 'elena.vidal@correo.es', phone: '918 99 00 11', website: 'vidal.studio', address: { city: 'Palma' }, company: { name: 'Mediterranea Web' } },
    { id: 10, name: 'Hugo Marchena', username: 'hmarchena', email: 'hugo.marchena@correo.es', phone: '919 12 34 56', website: 'marchena.dev', address: { city: 'Oviedo' }, company: { name: 'Cantabrico Labs' } }
  ];

  // ============================================================
  // 3. COMO FUNCIONA fetch, PASO A PASO
  // ============================================================
  //   const respuesta = await fetch(url);
  //
  // PRIMERA PROMESA: fetch(url) se cumple en cuanto llegan las CABECERAS de
  // la respuesta. Nos entrega un objeto Response con, entre otras cosas:
  //
  //   respuesta.ok         -> true si el status esta entre 200 y 299
  //   respuesta.status     -> el numero: 200, 201, 404, 500...
  //   respuesta.statusText -> el texto: "OK", "Not Found"...
  //   respuesta.headers    -> un objeto Headers con las cabeceras
  //   respuesta.url        -> la URL final (util si hubo redirecciones)
  //
  // SEGUNDA PROMESA: el CUERPO todavia esta llegando. Para leerlo hay que
  // elegir en que formato lo queremos, y eso devuelve otra promesa:
  //
  //   await respuesta.json()  -> objeto/array de JavaScript
  //   await respuesta.text()  -> texto plano
  //   await respuesta.blob()  -> binario (imagenes, PDF...)
  //
  // ⚠️ ERROR COMUN: hacer console.log(respuesta.json()) y ver "Promise".
  // Falta el await. Y ojo: el cuerpo se puede leer UNA SOLA VEZ. Si llamas
  // a .json() dos veces, la segunda falla con "body stream already read".
  //
  // ############################################################
  // ⚠️ ⚠️  EL ERROR NUMERO UNO CON fetch  ⚠️ ⚠️
  // fetch NO RECHAZA LA PROMESA CON UN 404 NI CON UN 500.
  // Para fetch, "el servidor me contesto" ya es un exito, aunque la
  // respuesta diga "no existe". La promesa solo se rechaza si la peticion
  // no llega a completarse: sin red, DNS que no resuelve, CORS bloqueado,
  // o peticion cancelada.
  // POR ESO hay que comprobar respuesta.ok a mano y lanzar el error nosotros.
  // ############################################################

  /**
   * pedirJSON(): envoltorio propio de fetch que hace SIEMPRE lo correcto.
   * @param {string} url        - direccion a la que llamar
   * @param {Object} opciones   - opciones estandar de fetch (method, headers, body, signal)
   * @returns {Promise<any>} los datos ya convertidos desde JSON
   *
   * ✅ BUENA PRACTICA: no llamar a fetch suelto por toda la aplicacion.
   * Se escribe una funcion como esta, y el resto del codigo la usa.
   */
  async function pedirJSON(url, opciones) {
    const respuesta = await fetch(url, opciones);

    // AQUI esta la comprobacion que casi todo el mundo olvida.
    if (!respuesta.ok) {
      // Ojo: con HTTP/2 el statusText llega vacio, asi que ponemos un texto
      // de reserva con el operador || para que el mensaje nunca quede cojo.
      const texto = respuesta.statusText || 'sin texto de estado';
      throw new Error('El servidor respondio ' + respuesta.status + ' (' + texto + ')');
    }

    return respuesta.json();   // segunda promesa: leer y convertir el cuerpo
  }

  /**
   * pedirJSONConLimite(): igual que la anterior, pero abandona la peticion
   * si tarda mas de "limite" milisegundos. Usa AbortController por dentro.
   */
  async function pedirJSONConLimite(url, limite, opciones) {
    const controlador = new AbortController();
    const idLimite = setTimeout(function () {
      controlador.abort();     // dispara la cancelacion
    }, limite);

    try {
      // Mezclamos las opciones que nos pasen con nuestra senal de cancelacion.
      // El operador ... (spread) copia las propiedades del objeto.
      return await pedirJSON(url, { ...opciones, signal: controlador.signal });
    } finally {
      // ✅ BUENA PRACTICA: limpiar SIEMPRE el temporizador, haya ido bien o mal.
      // Si no, quedaria un abort programado sobre una peticion ya terminada.
      clearTimeout(idLimite);
    }
  }

  // ============================================================
  // 4. obtenerUsuarios(): API REAL CON RESPALDO SIMULADO
  // ============================================================
  // Esta es la funcion clave del proyecto. Su contrato es:
  // "pase lo que pase, te devuelvo usuarios, y te digo de donde salieron".
  //
  // Devuelve un objeto con la forma:
  //   { origen: 'api' | 'simulado', usuarios: [...], motivo: string|null }

  /**
   * @param {Object} opciones
   * @param {boolean} opciones.forzarFallo - si es true, revienta a proposito
   *        (lo usa el boton "Provocar un error" para ensenar el estado de error).
   */
  async function obtenerUsuarios(opciones = {}) {
    const forzarFallo = opciones.forzarFallo === true;

    // --- Camino especial para la demo del estado de error ---------------
    if (forzarFallo) {
      imprimir('[obtenerUsuarios] modo "provocar error": voy a fallar a proposito.');
      await esperar(900);    // dejamos ver el spinner antes de romper
      throw new Error('No se pudo conectar con el servidor de usuarios (error simulado a proposito)');
    }

    // --- Intento 1: la API real ------------------------------------------
    try {
      imprimir('[obtenerUsuarios] intentando fetch real a ' + URL_USUARIOS);
      const datos = await pedirJSONConLimite(URL_USUARIOS, LIMITE_MS);

      // Comprobamos que lo recibido tiene la pinta que esperamos.
      // ✅ BUENA PRACTICA: nunca confies ciegamente en la forma de los datos ajenos.
      if (!Array.isArray(datos) || datos.length === 0) {
        throw new Error('La API respondio, pero no con una lista de usuarios');
      }

      imprimir('[obtenerUsuarios] OK: ' + datos.length + ' usuarios desde la API real.');
      return { origen: 'api', usuarios: datos, motivo: null };

    } catch (error) {
      // --- Intento 2: modo simulado --------------------------------------
      // Aqui caemos por CUALQUIER motivo: sin internet, file://, CORS,
      // API caida, tiempo agotado, respuesta rara... Da igual: seguimos.
      const motivo = error.name === 'AbortError'
        ? 'La API tardo mas de ' + LIMITE_MS + ' ms en responder'
        : error.message;

      imprimir('[obtenerUsuarios] fallo el fetch real -> ' + motivo);
      imprimir('[obtenerUsuarios] activando MODO SIMULADO con datos locales.');

      // Retraso artificial: sin el, los datos apareceran tan rapido que el
      // spinner ni se veria y la demo perderia todo su sentido didactico.
      await esperar(900);

      // Devolvemos una COPIA del array simulado con el operador spread.
      // ⚠️ ERROR COMUN: devolver el array original. Si luego alguien lo
      // ordena o lo filtra en el sitio, corrompe los datos de partida.
      return { origen: 'simulado', usuarios: [...USUARIOS_SIMULADOS], motivo: motivo };
    }
  }

  // ============================================================
  // 5. LOS CUATRO ESTADOS DE LA INTERFAZ
  // ============================================================
  // Toda pantalla que pide datos a un servidor tiene cuatro estados, y hay
  // que disenar los cuatro. Si solo se dibuja el de exito, el usuario ve una
  // pantalla en blanco cada vez que algo va mal o tarda.
  //
  //   1. CARGANDO -> spinner o esqueleto. "Te estoy escuchando".
  //   2. EXITO    -> los datos pintados.
  //   3. ERROR    -> que ha pasado y, sobre todo, un boton para REINTENTAR.
  //   4. VACIO    -> hay respuesta, pero no hay nada que mostrar.
  //                  Es un estado distinto del error, y se confunden mucho.

  const zona = document.getElementById('zona-usuarios');
  const insignia = document.getElementById('estado-datos');
  const filtro = document.getElementById('filtro-usuarios');

  // Estado en memoria: la lista completa que se descargo la ultima vez.
  // El filtro trabaja sobre esta copia, sin volver a pedir nada al servidor.
  let usuariosCargados = [];

  /** vaciarZona(): borra el contenido actual del contenedor. */
  function vaciarZona() {
    if (zona) zona.replaceChildren();   // forma moderna y limpia de vaciar un nodo
  }

  /** mostrarCargando(): estado 1. */
  function mostrarCargando(mensaje) {
    if (!zona) return;
    vaciarZona();

    const caja = document.createElement('div');
    caja.className = 'estado estado-cargando';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';      // la animacion vive en el CSS

    const texto = document.createElement('p');
    texto.textContent = mensaje || 'Cargando usuarios...';

    caja.append(spinner, texto);
    zona.append(caja);
  }

  /** mostrarError(): estado 3, con boton de reintentar. */
  function mostrarError(mensaje) {
    if (!zona) return;
    vaciarZona();

    const caja = document.createElement('div');
    caja.className = 'estado estado-error';

    const icono = document.createElement('span');
    icono.className = 'icono';
    icono.textContent = '\u26A0\uFE0F';

    const texto = document.createElement('p');
    // textContent, no innerHTML: si el mensaje viniera del servidor y
    // contuviera etiquetas HTML, innerHTML las ejecutaria. Eso es un XSS.
    texto.textContent = mensaje;

    const boton = document.createElement('button');
    boton.id = 'btn-reintentar';        // el clic se atiende por delegacion
    boton.textContent = 'Reintentar';

    caja.append(icono, texto, boton);
    zona.append(caja);
  }

  /** mostrarVacio(): estado 4. */
  function mostrarVacio(mensaje) {
    if (!zona) return;
    vaciarZona();

    const caja = document.createElement('div');
    caja.className = 'estado estado-vacio';

    const icono = document.createElement('span');
    icono.className = 'icono';
    icono.textContent = '\uD83D\uDD0D';

    const texto = document.createElement('p');
    texto.textContent = mensaje || 'No hay ningun usuario que mostrar.';

    caja.append(icono, texto);
    zona.append(caja);
  }

  /** iniciales(): saca las iniciales de un nombre para el avatar. */
  function iniciales(nombre) {
    return nombre
      .split(' ')                                   // ["Lucia", "Ferreira"]
      .filter(function (parte) { return parte.length > 0; })
      .slice(0, 2)                                  // como mucho dos palabras
      .map(function (parte) { return parte[0].toUpperCase(); })
      .join('');                                    // "LF"
  }

  /** crearTarjeta(): construye el <li> de un usuario con nodos del DOM. */
  function crearTarjeta(usuario) {
    const item = document.createElement('li');
    item.className = 'tarjeta-usuario';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = iniciales(usuario.name || '?');

    const nombre = document.createElement('h4');
    nombre.textContent = usuario.name;

    // El encadenamiento opcional (?.) evita el clasico
    // "Cannot read properties of undefined": si address no existe, da undefined
    // en vez de reventar. El operador ?? pone un valor por defecto si es
    // null o undefined.
    const ciudad = usuario.address?.city ?? 'Ciudad desconocida';
    const empresa = usuario.company?.name ?? 'Sin empresa';

    const linea1 = document.createElement('p');
    linea1.className = 'dato';
    linea1.textContent = usuario.email;

    const linea2 = document.createElement('p');
    linea2.className = 'dato';
    linea2.textContent = ciudad + ' · ' + empresa;

    item.append(avatar, nombre, linea1, linea2);
    return item;
  }

  /** mostrarUsuarios(): estado 2, la lista de tarjetas. */
  function mostrarUsuarios(lista) {
    if (!zona) return;

    // Si no hay nada que pintar, el estado correcto es VACIO, no EXITO.
    if (!lista || lista.length === 0) {
      mostrarVacio('Ningun usuario coincide con el filtro. Prueba con otro texto.');
      return;
    }

    vaciarZona();

    const ul = document.createElement('ul');
    ul.className = 'tarjetas';

    // ✅ BUENA PRACTICA: construir todo y anadirlo al documento UNA SOLA VEZ.
    // Tocar el DOM dentro de un bucle obliga al navegador a recalcular el
    // diseno una y otra vez. Aqui el <ul> aun no esta en la pagina.
    lista.forEach(function (usuario) {
      ul.append(crearTarjeta(usuario));
    });

    zona.append(ul);
  }

  /** actualizarInsignia(): dice de donde salieron los datos que se ven. */
  function actualizarInsignia(estado, texto) {
    if (!insignia) return;
    insignia.className = 'insignia ' + estado;   // real | simulado | fallo
    insignia.textContent = texto;
  }

  // ============================================================
  // 6. EL FLUJO COMPLETO: CARGAR USUARIOS
  // ============================================================
  // Aqui se ve el ciclo de vida entero de una pantalla con datos remotos.

  let cargando = false;   // evita dobles clics que lancen dos cargas a la vez

  async function cargarUsuarios(opciones = {}) {
    if (cargando) {
      imprimir('Ya hay una carga en marcha. Espera a que termine.');
      return;
    }

    cargando = true;
    titulo('6 - Cargar usuarios (ciclo completo)');

    // ESTADO 1: CARGANDO
    mostrarCargando('Pidiendo usuarios al servidor...');
    actualizarInsignia('', 'cargando...');

    try {
      const resultado = await obtenerUsuarios(opciones);

      usuariosCargados = resultado.usuarios;

      // ESTADO 2: EXITO
      aplicarFiltro();   // pinta la lista (respetando lo escrito en el filtro)

      if (resultado.origen === 'api') {
        actualizarInsignia('real', 'datos de la API real (' + usuariosCargados.length + ')');
        imprimir('Datos REALES descargados de ' + URL_USUARIOS);
      } else {
        actualizarInsignia('simulado', 'modo simulado (' + usuariosCargados.length + ')');
        imprimir('MODO SIMULADO activo. Motivo: ' + resultado.motivo);
        imprimir('Para ver el fetch real, abre el proyecto con Live Server (mira el README).');
      }

    } catch (error) {
      // ESTADO 3: ERROR
      usuariosCargados = [];
      mostrarError(error.message);
      actualizarInsignia('fallo', 'error al cargar');
      imprimir('[ERROR] ' + error.message);
      imprimir('La interfaz muestra el estado de error CON boton de reintentar.');

    } finally {
      // ✅ BUENA PRACTICA: liberar el cerrojo pase lo que pase.
      cargando = false;
      imprimir('[finally] carga finalizada (con exito o con error).');
    }
  }

  /** aplicarFiltro(): filtra en memoria, sin volver a llamar al servidor. */
  function aplicarFiltro() {
    // trim() quita espacios sobrantes; toLowerCase() para comparar sin
    // importar mayusculas o minusculas.
    const texto = filtro ? filtro.value.trim().toLowerCase() : '';

    if (usuariosCargados.length === 0) {
      // Sin datos y sin haber pedido nada: estado inicial, no error.
      mostrarVacio('Todavia no hay usuarios. Pulsa «Cargar usuarios».');
      return;
    }

    if (texto === '') {
      mostrarUsuarios(usuariosCargados);
      return;
    }

    const filtrados = usuariosCargados.filter(function (usuario) {
      const nombre = (usuario.name || '').toLowerCase();
      const ciudad = (usuario.address?.city || '').toLowerCase();
      // includes devuelve true si el texto aparece en algun sitio de la cadena.
      return nombre.includes(texto) || ciudad.includes(texto);
    });

    mostrarUsuarios(filtrados);
  }

  /** vaciarLista(): vuelve al estado inicial (util para repetir la demo). */
  function vaciarLista() {
    usuariosCargados = [];
    if (filtro) filtro.value = '';
    mostrarVacio('Lista vaciada. Pulsa «Cargar usuarios» para volver a pedirlos.');
    actualizarInsignia('', 'sin datos todavia');
    imprimir('Lista vaciada. Estado de la interfaz: VACIO.');
  }

  // ============================================================
  // 7. DEMOS SUELTAS DE fetch
  // ============================================================

  /** 7.1 - GET y anatomia del objeto Response. */
  async function demoGet() {
    titulo('5.1 - GET y el objeto Response');
    imprimir('Lanzando fetch a ' + URL_USUARIOS + '/1 ...');

    try {
      const respuesta = await fetch(URL_USUARIOS + '/1');

      // La PRIMERA promesa ya se cumplio: tenemos cabeceras y estado.
      imprimir('respuesta.ok          ->', respuesta.ok);
      imprimir('respuesta.status      ->', respuesta.status);
      imprimir('respuesta.statusText  ->', respuesta.statusText || '(vacio en HTTP/2)');
      imprimir('respuesta.type        ->', respuesta.type);
      imprimir('respuesta.url         ->', respuesta.url);
      imprimir('cabecera content-type ->', respuesta.headers.get('content-type'));

      if (!respuesta.ok) {
        throw new Error('Respuesta no correcta: ' + respuesta.status);
      }

      // La SEGUNDA promesa: leer el cuerpo y convertirlo desde JSON.
      const usuario = await respuesta.json();
      imprimir('Cuerpo ya convertido a objeto JavaScript:');
      imprimir(usuario);

      // ⚠️ ERROR COMUN: volver a leer el cuerpo. Solo se puede una vez.
      try {
        await respuesta.json();
      } catch (error) {
        imprimir('Al leer el cuerpo por SEGUNDA vez -> ' + error.message);
        imprimir('El cuerpo es un flujo (stream): se consume y ya no vuelve.');
        imprimir('[OK] Si lo necesitas dos veces, guarda el resultado en una variable.');
      }

    } catch (error) {
      imprimir('[ERROR de red] ' + error.message);
      imprimir('Esto ocurre si abriste el archivo con file:// o no hay internet.');
      imprimir('La promesa de fetch SOLO se rechaza en casos asi, nunca por un 404.');
    }
  }

  /** 7.2 - La demostracion del 404 silencioso. */
  async function demoCuatroCeroCuatro() {
    titulo('5.2 - [!] Por que un 404 NO rechaza la promesa');
    imprimir('Pidiendo una direccion que NO existe:');
    imprimir(URL_INEXISTENTE);

    try {
      const respuesta = await fetch(URL_INEXISTENTE);

      // ¡Sorpresa! Hemos llegado hasta aqui SIN pasar por el catch.
      imprimir('');
      imprimir('Hemos llegado al then/try sin errores. Y sin embargo:');
      imprimir('  respuesta.ok     ->', respuesta.ok, '  <- false');
      imprimir('  respuesta.status ->', respuesta.status, '  <- 404');
      imprimir('');
      imprimir('Para fetch, "el servidor me contesto" ES un exito.');
      imprimir('Si no compruebas .ok, seguiras adelante con datos que no existen.');
      imprimir('');

      // --- La forma INCORRECTA ---
      const datosMalos = await respuesta.json().catch(function () { return null; });
      imprimir('SIN comprobar .ok, esto es lo que llega al resto de la app:', datosMalos);
      imprimir('[!] Un objeto vacio o un error de parseo. Y la interfaz pintaria "undefined".');
      imprimir('');

      // --- La forma CORRECTA ---
      imprimir('[OK] LA FORMA CORRECTA (la que hace nuestra funcion pedirJSON):');
      imprimir('   if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);');

      try {
        await pedirJSON(URL_INEXISTENTE);
      } catch (error) {
        imprimir('   Y ahora si tenemos un error de verdad -> ' + error.message);
      }

    } catch (error) {
      imprimir('[ERROR de red] ' + error.message);
      imprimir('Sin conexion no podemos ensenar el 404 real, pero la regla es la misma:');
      imprimir('  fetch solo rechaza por fallos de RED, nunca por codigos de estado HTTP.');
    }
  }

  /** 7.3 - POST con cabeceras y cuerpo JSON. */
  async function demoPost() {
    titulo('5.3 - POST: enviar datos al servidor');

    // Los datos que queremos crear en el servidor.
    const nuevaTarea = {
      title: 'Repasar el event loop antes del examen',
      body: 'Microtareas antes que macrotareas. Practicar con setTimeout 0.',
      userId: 1
    };

    imprimir('Objeto de JavaScript que queremos enviar:');
    imprimir(nuevaTarea);
    imprimir('');
    imprimir('Opciones de la peticion:');
    imprimir('  method  -> POST');
    imprimir('  headers -> Content-Type: application/json');
    imprimir('  body    -> JSON.stringify(objeto)   <- texto, no objeto');
    imprimir('');
    imprimir('[!] ERROR COMUN: pasar el objeto directamente en body. HTTP viaja en');
    imprimir('   texto: hay que serializarlo con JSON.stringify. Y sin la cabecera');
    imprimir('   Content-Type, muchos servidores no saben interpretarlo.');
    imprimir('');

    try {
      const respuesta = await fetch(API + '/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
          // Aqui iria tambien la autenticacion en una API real:
          // 'Authorization': 'Bearer <token>'
        },
        body: JSON.stringify(nuevaTarea)
      });

      imprimir('respuesta.status ->', respuesta.status, '(201 = Created)');

      if (!respuesta.ok) {
        throw new Error('El servidor respondio ' + respuesta.status);
      }

      const creado = await respuesta.json();
      imprimir('El servidor devuelve el recurso creado, con su id nuevo:');
      imprimir(creado);
      imprimir('(jsonplaceholder no guarda nada de verdad: simula la creacion.)');

    } catch (error) {
      imprimir('[ERROR de red] ' + error.message);
      imprimir('Modo simulado: asi habria respondido el servidor:');
      imprimir({ ...nuevaTarea, id: 101 });
      imprimir('Fijate en que devuelve lo mismo que enviamos MAS el id asignado.');
    }
  }

  // ============================================================
  // 8. AbortController: CANCELAR UNA PETICION EN CURSO
  // ============================================================
  // Si el usuario se va de la pantalla mientras se descargan datos, seguir
  // esperando gasta bateria y ancho de banda, y ademas puede intentar pintar
  // datos en un componente que ya no existe.
  //
  // Receta en tres pasos:
  //   1. const controlador = new AbortController();
  //   2. fetch(url, { signal: controlador.signal });
  //   3. controlador.abort();   -> la promesa se rechaza con un AbortError
  //
  // ⚠️ ERROR COMUN: tratar la cancelacion como si fuera un fallo y ensenar
  // al usuario una pantalla de error roja. Cancelar es algo que ha pedido EL
  // usuario: hay que distinguirlo mirando error.name === 'AbortError'.

  let controladorActual = null;   // guardamos el "mando a distancia" activo

  /**
   * tareaLentaCancelable(): simula una descarga larga que RESPETA la senal
   * de cancelacion. La usamos como respaldo cuando no hay red, para que la
   * demo funcione igual en modo sin conexion.
   */
  function tareaLentaCancelable(milisegundos, senal) {
    return new Promise(function (resolve, reject) {
      const id = setTimeout(function () {
        resolve('descarga simulada completada tras ' + milisegundos + ' ms');
      }, milisegundos);

      // Si ya venia cancelada antes de empezar, cortamos de inmediato.
      if (senal.aborted) {
        clearTimeout(id);
        reject(crearErrorDeCancelacion());
        return;
      }

      // Escuchamos el evento 'abort' de la senal. Es un EventTarget normal.
      senal.addEventListener('abort', function () {
        clearTimeout(id);
        reject(crearErrorDeCancelacion());
      });
    });
  }

  /** Crea un error con name 'AbortError', igual que el que lanza fetch. */
  function crearErrorDeCancelacion() {
    const error = new Error('La peticion fue cancelada por el usuario');
    error.name = 'AbortError';
    return error;
  }

  async function demoPeticionLenta() {
    titulo('5.4 - AbortController: cancelar una peticion');

    // Si habia otra peticion en marcha, la cancelamos antes de empezar.
    if (controladorActual) {
      imprimir('Habia una peticion anterior en curso: la cancelo primero.');
      controladorActual.abort();
    }

    // PASO 1: crear el controlador.
    controladorActual = new AbortController();
    const senal = controladorActual.signal;

    imprimir('Peticion iniciada. Tienes unos segundos para pulsar "Cancelar peticion".');
    const inicio = performance.now();

    try {
      // PASO 2: pasar la senal a fetch. Intentamos una descarga pesada real.
      let resultado;
      try {
        const respuesta = await fetch(URL_PESADA, { signal: senal });
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
        const datos = await respuesta.json();
        resultado = 'descargados ' + datos.length + ' registros desde la API real';
      } catch (errorDeRed) {
        // Si la cancelacion ya ocurrio, relanzamos: NO es un fallo de red.
        if (errorDeRed.name === 'AbortError') throw errorDeRed;

        // Sin conexion: pasamos a la version simulada, con la MISMA senal,
        // para que el boton de cancelar siga funcionando igual.
        imprimir('(sin acceso a la API: uso una descarga simulada de 5 s)');
        resultado = await tareaLentaCancelable(5000, senal);
      }

      // En clase la red del centro puede ser muy rapida y la descarga
      // terminaria antes de que nadie llegue a pulsar "Cancelar". Por eso
      // anadimos un "procesado" artificial hasta completar 5 segundos.
      // Tambien respeta la senal, asi que la cancelacion sigue funcionando.
      const transcurrido = performance.now() - inicio;
      const restante = Math.max(0, 5000 - transcurrido);
      if (restante > 0) {
        imprimir('Descarga hecha en ' + Math.round(transcurrido) + ' ms.');
        imprimir('Ahora simulo ' + Math.round(restante) + ' ms de procesado para que');
        imprimir('te de tiempo a pulsar "Cancelar peticion".');
        await tareaLentaCancelable(restante, senal);
      }

      const duracion = Math.round(performance.now() - inicio);
      imprimir('TERMINADA en ' + duracion + ' ms -> ' + resultado);

    } catch (error) {
      const duracion = Math.round(performance.now() - inicio);

      // ✅ BUENA PRACTICA: separar "cancelado" de "ha fallado".
      if (error.name === 'AbortError') {
        imprimir('CANCELADA a los ' + duracion + ' ms. error.name -> "AbortError"');
        imprimir('No es un fallo: el usuario lo pidio. No muestres pantalla de error.');
      } else {
        imprimir('[ERROR] ' + error.message);
      }

    } finally {
      controladorActual = null;
    }
  }

  function cancelarPeticion() {
    if (!controladorActual) {
      imprimir('No hay ninguna peticion en curso que cancelar.');
      return;
    }
    // PASO 3: pulsar el boton rojo.
    controladorActual.abort();
    imprimir('controlador.abort() ejecutado.');
  }

  // ============================================================
  // 9. CONECTAR LOS BOTONES
  // ============================================================
  function alPulsar(id, manejador) {
    const boton = document.getElementById(id);
    if (!boton) {
      console.warn('[05-fetch] No encuentro el boton con id "' + id + '".');
      return;
    }
    boton.addEventListener('click', function () {
      // Envolvemos en Promise.resolve para capturar errores de funciones async.
      Promise.resolve(manejador()).catch(function (error) {
        imprimir('[error no controlado] ' + error.message);
      });
    });
  }

  alPulsar('btn-demo-get', demoGet);
  alPulsar('btn-demo-404', demoCuatroCeroCuatro);
  alPulsar('btn-post', demoPost);
  alPulsar('btn-peticion-lenta', demoPeticionLenta);
  alPulsar('btn-cancelar-peticion', cancelarPeticion);
  alPulsar('btn-limpiar-5', limpiar);

  alPulsar('btn-cargar-usuarios', function () { return cargarUsuarios(); });
  alPulsar('btn-error-deliberado', function () { return cargarUsuarios({ forzarFallo: true }); });
  alPulsar('btn-vaciar', vaciarLista);

  // Filtro en vivo: cada tecla vuelve a filtrar la lista YA descargada.
  // Nota: en una app real conviene aplicar un "antirrebote" (debounce) si
  // cada pulsacion dispara una peticion al servidor. Aqui filtramos en
  // memoria, asi que no hace falta.
  if (filtro) {
    filtro.addEventListener('input', aplicarFiltro);
  }

  // DELEGACION DE EVENTOS: el boton "Reintentar" se crea y se destruye cada
  // vez que se pinta el estado de error, asi que no podemos engancharle un
  // listener de forma permanente. En su lugar escuchamos en el contenedor,
  // que si es fijo, y miramos QUIEN fue el origen real del clic.
  if (zona) {
    zona.addEventListener('click', function (evento) {
      // closest sube por el arbol buscando el ancestro que encaje.
      const boton = evento.target.closest('#btn-reintentar');
      if (!boton) return;
      imprimir('Reintentando la carga desde el estado de error...');
      cargarUsuarios();
    });
  }

  // ============================================================
  // 10. ESTADO INICIAL DE LA PANTALLA
  // ============================================================
  // No cargamos nada al abrir la pagina: el docente decide cuando hacerlo.
  actualizarInsignia('', 'sin datos todavia');

  // ============================================================
  // 11. EJERCICIOS PROPUESTOS
  // ============================================================
  /*
    EJERCICIO 1 (facil) - Otro recurso de la misma API
    Copia demoGet() y adaptala para pedir https://jsonplaceholder.typicode.com/posts/1.
    Muestra en la consola visual el titulo y el cuerpo del post. Comprueba
    antes response.ok y lanza un Error descriptivo si no es correcto.

    EJERCICIO 2 (facil) - Contador de estados
    Anade a la pagina un contador que muestre cuantas veces se ha entrado en
    cada estado: cargando, exito, error y vacio. Actualizalo dentro de las
    funciones mostrarCargando, mostrarUsuarios, mostrarError y mostrarVacio.

    EJERCICIO 3 (medio) - Detalle del usuario
    Haz que al pulsar una tarjeta se pida el detalle de ese usuario a
    /users/<id> y se muestren sus datos completos en un panel lateral, con su
    propio estado de carga. Usa delegacion de eventos sobre el <ul>, igual que
    hicimos con el boton de reintentar.

    EJERCICIO 4 (medio) - Usuarios y sus publicaciones en paralelo
    Descarga a la vez /users y /posts con Promise.all. Despues cuenta cuantas
    publicaciones tiene cada usuario y muestra ese numero en su tarjeta.
    Compara el tiempo con hacerlo en dos await seguidos.

    EJERCICIO 5 (dificil) - Buscador con antirrebote y cancelacion
    Convierte el filtro en un buscador REAL contra el servidor:
    /users?username_like=<texto>. Aplica un antirrebote de 400 ms para no
    lanzar una peticion por tecla, y cancela con AbortController la peticion
    anterior cada vez que se dispare una nueva. Trata los cuatro estados y
    asegurate de que una respuesta lenta antigua nunca pise a una mas reciente.
  */
})();
