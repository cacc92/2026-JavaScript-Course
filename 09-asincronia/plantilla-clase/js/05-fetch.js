/**
 * ============================================================================
 * ARCHIVO: js/05-fetch.js   ·   PLANTILLA DE CLASE (sin resolver)
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
 *
 * COMO SE USA ESTA PLANTILLA
 * La teoria, la configuracion y los datos simulados vienen dados. Todo lo que
 * lleva "TODO (en clase)" se escribe en vivo. Solucion en ../js/05-fetch.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL Y UTILIDADES   [imprimir/titulo/limpiar YA ESCRITOS]
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
  // TODO (en clase):
  //   1. Declara esperar(milisegundos) devolviendo
  //      new Promise(function (resolve) { setTimeout(resolve, milisegundos); }).
  //   (aprox. 5 lineas)

  // ============================================================
  // 1. CONFIGURACION   [YA ESCRITO]
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
  // 2. DATOS SIMULADOS (el plan B que salva la clase)   [YA ESCRITO]
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
  // TODO (en clase):
  //   1. Declara async function pedirJSON(url, opciones).
  //   2. const respuesta = await fetch(url, opciones);
  //   3. AQUI va la comprobacion que casi todo el mundo olvida: si !respuesta.ok,
  //      calcula const texto = respuesta.statusText || 'sin texto de estado'
  //      (con HTTP/2 el statusText llega vacio) y lanza
  //      new Error('El servidor respondio ' + respuesta.status + ' (' + texto + ')').
  //   4. Devuelve respuesta.json(): la SEGUNDA promesa, la que lee el cuerpo.
  //   Resultado esperado: pedirJSON(URL_INEXISTENTE) rechaza con
  //   "El servidor respondio 404 (Not Found)".
  //   (aprox. 13 lineas)

  /**
   * pedirJSONConLimite(): igual que la anterior, pero abandona la peticion
   * si tarda mas de "limite" milisegundos. Usa AbortController por dentro.
   */
  // TODO (en clase):
  //   1. Declara async function pedirJSONConLimite(url, limite, opciones).
  //   2. const controlador = new AbortController();
  //   3. const idLimite = setTimeout(function () { controlador.abort(); }, limite);
  //   4. Dentro de un try, devuelve
  //      await pedirJSON(url, { ...opciones, signal: controlador.signal })
  //      (el operador ... copia las propiedades del objeto de opciones).
  //   5. ✅ BUENA PRACTICA: en el finally haz clearTimeout(idLimite) SIEMPRE, haya
  //      ido bien o mal; si no, quedaria un abort programado sobre una peticion
  //      ya terminada.
  //   (aprox. 16 lineas)

  // ============================================================
  // 4. obtenerUsuarios(): API REAL CON RESPALDO SIMULADO
  // ============================================================
  // Esta es la funcion clave del proyecto. Su contrato es:
  // "pase lo que pase, te devuelvo usuarios, y te digo de donde salieron".
  //
  // Devuelve un objeto con la forma:
  //   { origen: 'api' | 'simulado', usuarios: [...], motivo: string|null }

  // TODO (en clase):
  //   1. Declara async function obtenerUsuarios(opciones = {}) y lee
  //      const forzarFallo = opciones.forzarFallo === true (lo usa el boton
  //      «Provocar un error» para ensenar el estado de error).
  //   2. CAMINO ESPECIAL: si forzarFallo, imprime
  //      '[obtenerUsuarios] modo "provocar error": voy a fallar a proposito.',
  //      haz await esperar(900) (para que se vea el spinner) y lanza
  //      new Error('No se pudo conectar con el servidor de usuarios (error
  //      simulado a proposito)').
  //   3. INTENTO 1 (dentro de un try): imprime
  //      '[obtenerUsuarios] intentando fetch real a ' + URL_USUARIOS y haz
  //      const datos = await pedirJSONConLimite(URL_USUARIOS, LIMITE_MS).
  //      ✅ BUENA PRACTICA: nunca confies ciegamente en la forma de los datos
  //      ajenos -> si !Array.isArray(datos) || datos.length === 0, lanza
  //      new Error('La API respondio, pero no con una lista de usuarios').
  //      Si todo va bien, imprime '[obtenerUsuarios] OK: <n> usuarios desde la API
  //      real.' y devuelve { origen: 'api', usuarios: datos, motivo: null }.
  //   4. INTENTO 2 (en el catch, se cae aqui por CUALQUIER motivo): calcula
  //      const motivo = error.name === 'AbortError'
  //        ? 'La API tardo mas de ' + LIMITE_MS + ' ms en responder'
  //        : error.message;
  //      imprime '[obtenerUsuarios] fallo el fetch real -> <motivo>' y
  //      '[obtenerUsuarios] activando MODO SIMULADO con datos locales.',
  //      haz await esperar(900) (retraso artificial: sin el no se veria el spinner)
  //      y devuelve { origen: 'simulado', usuarios: [...USUARIOS_SIMULADOS], motivo: motivo }.
  //      ⚠️ ERROR COMUN: devolver el array original en vez de una COPIA. Si luego
  //      alguien lo ordena o lo filtra en el sitio, corrompe los datos de partida.
  //   Resultado esperado: con Live Server, insignia "datos de la API real (10)";
  //   abriendo con file://, insignia "modo simulado (10)".
  //   (aprox. 45 lineas)

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

  // TODO (en clase):
  //   1. Guarda las tres referencias del DOM con document.getElementById:
  //      'zona-usuarios' (const zona), 'estado-datos' (const insignia) y
  //      'filtro-usuarios' (const filtro).
  //   2. Declara con let usuariosCargados = []: la lista completa descargada la
  //      ultima vez. El filtro trabajara sobre esta copia, sin volver a pedir nada.
  //   (aprox. 5 lineas)

  /** vaciarZona(): borra el contenido actual del contenedor. */
  // TODO (en clase):
  //   1. Declara vaciarZona(): si zona existe, llama a zona.replaceChildren()
  //      (forma moderna y limpia de vaciar un nodo).
  //   (aprox. 3 lineas)

  /** mostrarCargando(): estado 1. */
  // TODO (en clase):
  //   1. Declara mostrarCargando(mensaje): return si no hay zona; vaciarZona().
  //   2. Crea un <div class="estado estado-cargando">, dentro un
  //      <div class="spinner"> (la animacion vive en el CSS) y un <p> con
  //      mensaje || 'Cargando usuarios...'.
  //   3. Metelos con caja.append(spinner, texto) y zona.append(caja).
  //   Resultado esperado en pantalla: el circulo giratorio con el texto debajo,
  //   dentro del contenedor con id "zona-usuarios".
  //   (aprox. 16 lineas)

  /** mostrarError(): estado 3, con boton de reintentar. */
  // TODO (en clase):
  //   1. Declara mostrarError(mensaje): return si no hay zona; vaciarZona().
  //   2. Crea <div class="estado estado-error"> y dentro:
  //      - <span class="icono"> con textContent = '⚠️' (el emoji de aviso),
  //      - <p> con textContent = mensaje. ⚠️ textContent, NO innerHTML: si el
  //        mensaje viniera del servidor con etiquetas HTML, innerHTML las
  //        ejecutaria y eso es un XSS.
  //      - <button> con id 'btn-reintentar' y texto 'Reintentar' (su clic se
  //        atendera por DELEGACION mas abajo).
  //   3. caja.append(icono, texto, boton) y zona.append(caja).
  //   (aprox. 23 lineas)

  /** mostrarVacio(): estado 4. */
  // TODO (en clase):
  //   1. Declara mostrarVacio(mensaje) igual que las anteriores, con
  //      <div class="estado estado-vacio">, un <span class="icono"> con
  //      '🔍' (la lupa) y un <p> con
  //      mensaje || 'No hay ningun usuario que mostrar.'
  //   (aprox. 17 lineas)

  /** iniciales(): saca las iniciales de un nombre para el avatar. */
  // TODO (en clase):
  //   1. Declara iniciales(nombre) y encadena sobre nombre:
  //      .split(' ')  -> ["Lucia", "Ferreira"]
  //      .filter(...) -> descarta las partes vacias
  //      .slice(0, 2) -> como mucho dos palabras
  //      .map(...)    -> primera letra en mayuscula de cada parte
  //      .join('')    -> "LF"
  //   (aprox. 8 lineas)

  /** crearTarjeta(): construye el <li> de un usuario con nodos del DOM. */
  // TODO (en clase):
  //   1. Declara crearTarjeta(usuario) y crea un <li class="tarjeta-usuario">.
  //   2. Dentro: <div class="avatar"> con iniciales(usuario.name || '?'),
  //      un <h4> con usuario.name, y dos <p class="dato">: el primero con
  //      usuario.email y el segundo con ciudad + ' · ' + empresa.
  //   3. Para ciudad y empresa usa encadenamiento opcional y valor por defecto:
  //        const ciudad  = usuario.address?.city ?? 'Ciudad desconocida';
  //        const empresa = usuario.company?.name ?? 'Sin empresa';
  //      El ?. evita el clasico "Cannot read properties of undefined" y el ??
  //      pone el valor por defecto solo si es null o undefined.
  //   4. item.append(avatar, nombre, linea1, linea2) y devuelve item.
  //   Resultado esperado: una tarjeta con "LF", "Lucia Ferreira", su correo y
  //   "Valencia · Estudio Norte".
  //   (aprox. 29 lineas)

  /** mostrarUsuarios(): estado 2, la lista de tarjetas. */
  // TODO (en clase):
  //   1. Declara mostrarUsuarios(lista): return si no hay zona.
  //   2. Si !lista || lista.length === 0, el estado correcto es VACIO, no EXITO:
  //      llama a mostrarVacio('Ningun usuario coincide con el filtro. Prueba con
  //      otro texto.') y return.
  //   3. vaciarZona(), crea un <ul class="tarjetas"> y recorre la lista con
  //      forEach anadiendo ul.append(crearTarjeta(usuario)).
  //   4. ✅ BUENA PRACTICA: construir todo y anadirlo al documento UNA SOLA VEZ
  //      -> zona.append(ul) al final. Tocar el DOM dentro del bucle obligaria al
  //      navegador a recalcular el diseno en cada vuelta.
  //   (aprox. 22 lineas)

  /** actualizarInsignia(): dice de donde salieron los datos que se ven. */
  // TODO (en clase):
  //   1. Declara actualizarInsignia(estado, texto): return si no hay insignia;
  //      pon insignia.className = 'insignia ' + estado  (real | simulado | fallo)
  //      e insignia.textContent = texto.
  //   (aprox. 5 lineas)

  // ============================================================
  // 6. EL FLUJO COMPLETO: CARGAR USUARIOS
  // ============================================================
  // Aqui se ve el ciclo de vida entero de una pantalla con datos remotos.

  // TODO (en clase):
  //   1. Declara con let cargando = false: evita que dos clics seguidos lancen
  //      dos cargas a la vez.
  //   2. Declara async function cargarUsuarios(opciones = {}):
  //      - si cargando, imprime 'Ya hay una carga en marcha. Espera a que
  //        termine.' y return;
  //      - pon cargando = true y titulo('6 - Cargar usuarios (ciclo completo)');
  //      - ESTADO 1 (CARGANDO): mostrarCargando('Pidiendo usuarios al
  //        servidor...') y actualizarInsignia('', 'cargando...');
  //      - dentro de un try: const resultado = await obtenerUsuarios(opciones),
  //        guarda usuariosCargados = resultado.usuarios y llama a aplicarFiltro()
  //        (ESTADO 2, EXITO: pinta respetando lo escrito en el filtro).
  //        Si resultado.origen === 'api', actualizarInsignia('real', 'datos de la
  //        API real (<n>)') e imprime 'Datos REALES descargados de ' + URL_USUARIOS;
  //        si no, actualizarInsignia('simulado', 'modo simulado (<n>)') e imprime
  //        'MODO SIMULADO activo. Motivo: ' + resultado.motivo y
  //        'Para ver el fetch real, abre el proyecto con Live Server (mira el README).';
  //      - en el catch (ESTADO 3, ERROR): usuariosCargados = [],
  //        mostrarError(error.message), actualizarInsignia('fallo', 'error al cargar'),
  //        imprime '[ERROR] ' + error.message y 'La interfaz muestra el estado de
  //        error CON boton de reintentar.';
  //      - en el finally: ✅ BUENA PRACTICA, libera el cerrojo pase lo que pase
  //        (cargando = false) e imprime '[finally] carga finalizada (con exito o
  //        con error).'
  //   Resultado esperado: spinner -> diez tarjetas -> insignia con el origen.
  //   (aprox. 44 lineas)

  /** aplicarFiltro(): filtra en memoria, sin volver a llamar al servidor. */
  // TODO (en clase):
  //   1. Declara aplicarFiltro() y lee
  //      const texto = filtro ? filtro.value.trim().toLowerCase() : ''
  //      (trim quita espacios sobrantes; toLowerCase permite comparar sin
  //      importar mayusculas).
  //   2. Si usuariosCargados.length === 0, es el estado inicial, no un error:
  //      mostrarVacio('Todavia no hay usuarios. Pulsa «Cargar usuarios».') y return.
  //   3. Si texto === '', mostrarUsuarios(usuariosCargados) y return.
  //   4. Si hay texto, filtra usuariosCargados quedandote con los usuarios cuyo
  //      name o cuyo address?.city (los dos en minusculas) hagan
  //      .includes(texto), y pinta el resultado con mostrarUsuarios(filtrados).
  //   Resultado esperado: escribir "val" deja solo a Lucia Ferreira (Valencia);
  //   escribir "zzz" muestra el estado VACIO, no el de error.
  //   (aprox. 26 lineas)

  /** vaciarLista(): vuelve al estado inicial (util para repetir la demo). */
  // TODO (en clase):
  //   1. Declara vaciarLista(): pon usuariosCargados = [], vacia el campo de
  //      filtro (filtro.value = ''), llama a
  //      mostrarVacio('Lista vaciada. Pulsa «Cargar usuarios» para volver a
  //      pedirlos.'), a actualizarInsignia('', 'sin datos todavia') e imprime
  //      'Lista vaciada. Estado de la interfaz: VACIO.'
  //   (aprox. 7 lineas)

  // ============================================================
  // 7. DEMOS SUELTAS DE fetch
  // ============================================================

  /** 7.1 - GET y anatomia del objeto Response. */
  // TODO (en clase):
  //   1. Declara async function demoGet() con titulo('5.1 - GET y el objeto
  //      Response') e imprime 'Lanzando fetch a ' + URL_USUARIOS + '/1 ...'.
  //   2. Dentro de un try: const respuesta = await fetch(URL_USUARIOS + '/1') y
  //      muestra la anatomia de la PRIMERA promesa, una linea por propiedad:
  //        'respuesta.ok          ->' , respuesta.ok
  //        'respuesta.status      ->' , respuesta.status
  //        'respuesta.statusText  ->' , respuesta.statusText || '(vacio en HTTP/2)'
  //        'respuesta.type        ->' , respuesta.type
  //        'respuesta.url         ->' , respuesta.url
  //        'cabecera content-type ->' , respuesta.headers.get('content-type')
  //   3. Si !respuesta.ok, lanza new Error('Respuesta no correcta: ' + respuesta.status).
  //   4. SEGUNDA promesa: const usuario = await respuesta.json(); imprime
  //      'Cuerpo ya convertido a objeto JavaScript:' y el objeto.
  //   5. ⚠️ ERROR COMUN: leer el cuerpo dos veces. En un try/catch interno vuelve
  //      a hacer await respuesta.json() y, en el catch, imprime el mensaje, mas
  //      'El cuerpo es un flujo (stream): se consume y ya no vuelve.' y
  //      '[OK] Si lo necesitas dos veces, guarda el resultado en una variable.'
  //   6. En el catch exterior imprime '[ERROR de red] ' + error.message,
  //      'Esto ocurre si abriste el archivo con file:// o no hay internet.' y
  //      'La promesa de fetch SOLO se rechaza en casos asi, nunca por un 404.'
  //   (aprox. 39 lineas)

  /** 7.2 - La demostracion del 404 silencioso. */
  // TODO (en clase):
  //   1. Declara async function demoCuatroCeroCuatro() con
  //      titulo('5.2 - [!] Por que un 404 NO rechaza la promesa') e imprime
  //      'Pidiendo una direccion que NO existe:' y URL_INEXISTENTE.
  //   2. Dentro de un try: const respuesta = await fetch(URL_INEXISTENTE).
  //      Hemos llegado aqui SIN pasar por el catch: imprime
  //      'Hemos llegado al then/try sin errores. Y sin embargo:',
  //      '  respuesta.ok     ->', respuesta.ok, '  <- false' y
  //      '  respuesta.status ->', respuesta.status, '  <- 404'.
  //   3. Imprime la moraleja: 'Para fetch, "el servidor me contesto" ES un exito.'
  //      y 'Si no compruebas .ok, seguiras adelante con datos que no existen.'
  //   4. FORMA INCORRECTA: const datosMalos = await respuesta.json().catch(
  //      function () { return null; }); imprime
  //      'SIN comprobar .ok, esto es lo que llega al resto de la app:' con el valor y
  //      '[!] Un objeto vacio o un error de parseo. Y la interfaz pintaria "undefined".'
  //   5. FORMA CORRECTA: imprime
  //      '[OK] LA FORMA CORRECTA (la que hace nuestra funcion pedirJSON):' y
  //      '   if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);'
  //      Despues llama a await pedirJSON(URL_INEXISTENTE) dentro de un try/catch
  //      interno e imprime '   Y ahora si tenemos un error de verdad -> <mensaje>'.
  //   6. En el catch exterior explica que sin conexion no se puede ensenar el 404
  //      real, pero la regla es la misma: fetch solo rechaza por fallos de RED.
  //   (aprox. 40 lineas)

  /** 7.3 - POST con cabeceras y cuerpo JSON. */
  // TODO (en clase):
  //   1. Declara async function demoPost() con titulo('5.3 - POST: enviar datos
  //      al servidor').
  //   2. Crea el objeto que queremos enviar:
  //        const nuevaTarea = {
  //          title: 'Repasar el event loop antes del examen',
  //          body: 'Microtareas antes que macrotareas. Practicar con setTimeout 0.',
  //          userId: 1
  //        };
  //      e imprimelo tras la linea 'Objeto de JavaScript que queremos enviar:'.
  //   3. Imprime las opciones de la peticion, una por linea:
  //      '  method  -> POST', '  headers -> Content-Type: application/json',
  //      '  body    -> JSON.stringify(objeto)   <- texto, no objeto'
  //      y el aviso: '[!] ERROR COMUN: pasar el objeto directamente en body. HTTP
  //      viaja en texto: hay que serializarlo con JSON.stringify. Y sin la
  //      cabecera Content-Type, muchos servidores no saben interpretarlo.'
  //   4. Dentro de un try, haz await fetch(API + '/posts', { method: 'POST',
  //      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  //      body: JSON.stringify(nuevaTarea) }) (en una API real aqui iria tambien
  //      'Authorization': 'Bearer <token>').
  //   5. Imprime 'respuesta.status ->', respuesta.status, '(201 = Created)'; si
  //      !respuesta.ok lanza el Error; si va bien, const creado = await
  //      respuesta.json(), imprime 'El servidor devuelve el recurso creado, con su
  //      id nuevo:', el objeto, y '(jsonplaceholder no guarda nada de verdad:
  //      simula la creacion.)'
  //   6. En el catch, modo simulado: imprime '[ERROR de red] ...', 'Modo simulado:
  //      asi habria respondido el servidor:', { ...nuevaTarea, id: 101 } y
  //      'Fijate en que devuelve lo mismo que enviamos MAS el id asignado.'
  //   (aprox. 52 lineas)

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

  // TODO (en clase):
  //   1. Declara con let controladorActual = null: guarda el "mando a distancia"
  //      de la peticion activa.
  //   (aprox. 1 linea)

  /**
   * tareaLentaCancelable(): simula una descarga larga que RESPETA la senal
   * de cancelacion. La usamos como respaldo cuando no hay red, para que la
   * demo funcione igual en modo sin conexion.
   */
  // TODO (en clase):
  //   1. Declara tareaLentaCancelable(milisegundos, senal) devolviendo
  //      new Promise(function (resolve, reject) { ... }).
  //   2. const id = setTimeout(... resolve('descarga simulada completada tras
  //      <ms> ms') ..., milisegundos).
  //   3. Si senal.aborted (ya venia cancelada antes de empezar), clearTimeout(id),
  //      reject(crearErrorDeCancelacion()) y return.
  //   4. Escucha el evento de cancelacion con
  //      senal.addEventListener('abort', function () { clearTimeout(id);
  //      reject(crearErrorDeCancelacion()); }) -> una senal es un EventTarget normal.
  //   (aprox. 20 lineas)

  /** Crea un error con name 'AbortError', igual que el que lanza fetch. */
  // TODO (en clase):
  //   1. Declara crearErrorDeCancelacion(): crea
  //      const error = new Error('La peticion fue cancelada por el usuario'),
  //      ponle error.name = 'AbortError' y devuelvelo.
  //   (aprox. 5 lineas)

  // TODO (en clase):
  //   1. Declara async function demoPeticionLenta() con
  //      titulo('5.4 - AbortController: cancelar una peticion').
  //   2. Si ya habia un controladorActual, imprime 'Habia una peticion anterior en
  //      curso: la cancelo primero.' y llama a controladorActual.abort().
  //   3. PASO 1: controladorActual = new AbortController() y
  //      const senal = controladorActual.signal.
  //   4. Imprime 'Peticion iniciada. Tienes unos segundos para pulsar "Cancelar
  //      peticion".' y guarda const inicio = performance.now().
  //   5. PASO 2, dentro de un try: declara let resultado y, en un try interno,
  //      haz const respuesta = await fetch(URL_PESADA, { signal: senal }); si
  //      !respuesta.ok lanza Error; lee const datos = await respuesta.json() y pon
  //      resultado = 'descargados <n> registros desde la API real'.
  //      En el catch interno: si errorDeRed.name === 'AbortError' RELANZALO (no es
  //      un fallo de red); si no, imprime '(sin acceso a la API: uso una descarga
  //      simulada de 5 s)' y pon resultado = await tareaLentaCancelable(5000, senal).
  //   6. La red del centro puede ser muy rapida: calcula
  //      const transcurrido = performance.now() - inicio y
  //      const restante = Math.max(0, 5000 - transcurrido); si restante > 0,
  //      imprime 'Descarga hecha en <ms> ms.', 'Ahora simulo <ms> ms de procesado
  //      para que' / 'te de tiempo a pulsar "Cancelar peticion".' y haz
  //      await tareaLentaCancelable(restante, senal) -> tambien respeta la senal.
  //   7. Imprime 'TERMINADA en <duracion> ms -> <resultado>'.
  //   8. En el catch exterior, ✅ BUENA PRACTICA: separar "cancelado" de "ha
  //      fallado". Si error.name === 'AbortError', imprime
  //      'CANCELADA a los <ms> ms. error.name -> "AbortError"' y
  //      'No es un fallo: el usuario lo pidio. No muestres pantalla de error.';
  //      si no, imprime '[ERROR] ' + error.message.
  //   9. En el finally: controladorActual = null.
  //   (aprox. 65 lineas)

  // TODO (en clase):
  //   1. Declara cancelarPeticion(): si no hay controladorActual, imprime
  //      'No hay ninguna peticion en curso que cancelar.' y return.
  //   2. PASO 3: llama a controladorActual.abort() e imprime
  //      'controlador.abort() ejecutado.'
  //   (aprox. 9 lineas)

  // ============================================================
  // 9. CONECTAR LOS BOTONES
  // ============================================================
  // TODO (en clase):
  //   1. Escribe alPulsar(id, manejador) avisando con
  //      console.warn('[05-fetch] No encuentro el boton con id "' + id + '".'),
  //      y engancha el clic envolviendo la llamada en
  //      Promise.resolve(manejador()).catch(...) para capturar los errores de las
  //      funciones async, imprimiendo '[error no controlado] ' + error.message.
  //   2. Engancha los botones de la seccion 5:
  //        'btn-demo-get'          -> demoGet
  //        'btn-demo-404'          -> demoCuatroCeroCuatro
  //        'btn-post'              -> demoPost
  //        'btn-peticion-lenta'    -> demoPeticionLenta
  //        'btn-cancelar-peticion' -> cancelarPeticion
  //        'btn-limpiar-5'         -> limpiar
  //   3. Y los de la seccion 6 (proyecto practico):
  //        'btn-cargar-usuarios'   -> function () { return cargarUsuarios(); }
  //        'btn-error-deliberado'  -> function () { return cargarUsuarios({ forzarFallo: true }); }
  //        'btn-vaciar'            -> vaciarLista
  //   4. FILTRO EN VIVO: si existe filtro, engancha
  //      filtro.addEventListener('input', aplicarFiltro). Cada tecla vuelve a
  //      filtrar la lista YA descargada. (En una app real, si cada pulsacion
  //      disparara una peticion, haria falta un antirrebote; aqui filtramos en
  //      memoria y no hace falta.)
  //   5. DELEGACION DE EVENTOS: el boton «Reintentar» se crea y se destruye cada
  //      vez que se pinta el estado de error, asi que no se le puede enganchar un
  //      listener permanente. Escucha el clic en 'zona' (que si es fijo) y dentro
  //      usa const boton = evento.target.closest('#btn-reintentar') (closest sube
  //      por el arbol buscando el ancestro que encaje); si no hay boton, return;
  //      si lo hay, imprime 'Reintentando la carga desde el estado de error...' y
  //      llama a cargarUsuarios().
  //   (aprox. 30 lineas)

  // ============================================================
  // 10. ESTADO INICIAL DE LA PANTALLA
  // ============================================================
  // No cargamos nada al abrir la pagina: el docente decide cuando hacerlo.

  // TODO (en clase):
  //   1. Llama una sola vez a actualizarInsignia('', 'sin datos todavia').
  //   Resultado esperado: al recargar, la insignia dice "sin datos todavia" y la
  //   zona de usuarios conserva su mensaje inicial del HTML.
  //   (aprox. 1 linea)

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
