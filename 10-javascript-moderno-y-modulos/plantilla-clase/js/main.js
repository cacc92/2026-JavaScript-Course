/**
 * ============================================================
 * ARCHIVO: js/main.js
 * TEMA: Punto de entrada de la aplicacion (modulo principal)
 * ------------------------------------------------------------
 * Este archivo se carga desde el HTML asi:
 *
 *     <script type="module" src="js/main.js"></script>
 *
 * QUE ENSENA ESTE ARCHIVO
 *  - Las CUATRO formas de importar:
 *      import { a, b } from '...'          -> nombradas
 *      import { a as otroNombre } from '...' -> nombradas con renombrado
 *      import porDefecto from '...'        -> la exportacion por defecto
 *      import * as espacio from '...'      -> todo el modulo como objeto
 *  - La importacion DINAMICA: import('...') devuelve una promesa y solo
 *    descarga el archivo cuando de verdad hace falta.
 *  - Que el orden de los imports NO importa: el navegador construye
 *    primero el grafo completo de dependencias y despues evalua los
 *    modulos de abajo hacia arriba (primero las hojas).
 *  - Que los modulos se ejecutan en modo estricto y con carga diferida
 *    (como si llevaran `defer`), asi que el DOM ya existe cuando este
 *    codigo corre. No hace falta envolver nada en DOMContentLoaded.
 * ============================================================
 */

/* ============================================================
   MODO CLASE — LEE ESTO ANTES DE EMPEZAR
   ------------------------------------------------------------
   Este archivo esta VACIO a proposito. Por eso, al abrir la plantilla:

     - las consolas visuales de todas las secciones estan en blanco,
     - el aviso rojo "Los modulos ES todavia no se han cargado" sigue
       en rojo (lo pone en verde una funcion de este archivo, la 13),
     - y la consola del navegador (F12) NO muestra ningun error.

   Eso es exactamente lo esperado. En cuanto se escriba el primer
   import y la primera llamada, la pagina empieza a llenarse.

   ORDEN RECOMENDADO PARA ESCRIBIR ESTE ARCHIVO
     1. Secciones 1 a 5: los imports. Pero al principio deja SOLO el
        import de consola.js (que ya viene escrito y funcionando) y
        anade cada uno de los demas a medida que existan sus modulos.
        ⚠️ Un import de algo que todavia no se ha escrito rompe TODA la
        aplicacion: el navegador no evalua ni una linea del modulo.
     2. Seccion 6: las consolas visuales.
     3. Secciones 12, 13 y 15: conectar botones y arrancar. Con esto ya
        se ve algo en pantalla.
     4. Secciones 7 a 11: las demos y la caja de herramientas, una a una.
     5. Seccion 14: la red de seguridad, al final.

   TRUCO DE CLASE: escribe primero un `iniciar()` que solo haga
   `imprimir('Hola')` y compruebalo en pantalla. Ver la primera linea
   aparecer en el <pre id="salida"> engancha mucho mas que veinte
   minutos de imports antes de la primera senal de vida.

   Tiempo estimado total: 60-70 minutos.
   ============================================================ */

// ============================================================
// 1. IMPORTACIONES NOMBRADAS
// ------------------------------------------------------------
// Van entre llaves y el nombre tiene que coincidir EXACTAMENTE con el
// que se exporto. No es como el `export default`, donde elegimos el
// nombre libremente.
// ============================================================

// TODO (en clase):
//   Escribe la primera importacion. consola.js ya viene escrito en la
//   plantilla, asi que esta linea funciona desde el minuto uno:
//     import { imprimir, titulo, crearConsola, limpiar, MOMENTO_DE_CARGA } from './modulos/consola.js';
//   Comprueba en el acto que funciona anadiendo debajo, temporalmente,
//   `imprimir('Hola desde main.js');` y recargando: debe aparecer en el
//   <pre id="salida"> de la seccion 00.
//   (aprox. 1 linea)

// ============================================================
// 2. IMPORTACION POR DEFECTO + NOMBRADAS EN LA MISMA LINEA
// ------------------------------------------------------------
// `formatearMoneda` es la exportacion por defecto de formato.js.
// Podriamos haberla llamado `precio` o `plata`: el nombre lo ponemos
// nosotros. Lo que va entre llaves si respeta el nombre original.
// ============================================================

// TODO (en clase):
//   Importa de './modulos/formato.js' la exportacion por defecto con el
//   nombre `formatearMoneda` y, entre llaves, estas nueve nombradas:
//     formatearFecha, fechaRelativa, formatearNumero, formatearPorcentaje,
//     aTitulo, codigoDeFactura, aUrlAmigable, destacar, MONEDAS
//   Prueba en voz alta a cambiar el nombre de la de por defecto (por
//   ejemplo a `precio`) para que la clase vea que sigue funcionando, y
//   despues a cambiar uno de los nombres entre llaves para ver que eso NO
//   funciona (queda undefined).
//   (aprox. 12 lineas)

// ============================================================
// 3. IMPORTACION NOMBRADA CON RENOMBRADO (as)
// ------------------------------------------------------------
// `validarContrasena` es un nombre largo; aqui lo usamos como
// `revisarClave`. Es util para evitar choques de nombres cuando dos
// modulos exportan algo que se llama igual.
// ============================================================

// TODO (en clase):
//   Importa de './modulos/validaciones.js':
//     validarEmail, validarContrasena as revisarClave, validarRequerido,
//     validarFormulario, REGLAS_CONTRASENA
//   A partir de aqui, en todo el archivo se usa `revisarClave`, no
//   `validarContrasena`.
//   (aprox. 7 lineas)

// ============================================================
// 4. IMPORTAR TODO EL MODULO COMO UN OBJETO (import * as)
// ------------------------------------------------------------
// `matematicas` es un "espacio de nombres del modulo": un objeto con
// todas sus exportaciones. Se usa cuando un modulo tiene muchas cosas
// y queremos dejar claro de donde viene cada una al leerlo.
//
// DETALLE: ese objeto es de SOLO LECTURA. Intentar
// matematicas.sumar = otraCosa lanza un TypeError.
// ============================================================

// TODO (en clase):
//   1. `import * as matematicas from './modulos/matematicas.js';`
//   2. Y los tres modulos de teoria igual:
//        import * as sintaxis from './extras/sintaxis-moderna.js';
//        import * as metodos from './extras/metodos-modernos.js';
//        import * as generadores from './extras/iteradores-y-generadores.js';
//      Asi ademas evitamos un choque REAL: sintaxis.demoNumeros y
//      metodos.demoNumeros se llaman igual pero son funciones distintas.
//      Con el espacio de nombres, sin problema. Si los hubiesemos
//      importado sueltos, habria que renombrar uno de los dos.
//   (aprox. 4 lineas)

// ============================================================
// 5. EL ALMACEN COMPARTIDO
// ------------------------------------------------------------
// validaciones.js tambien importa este mismo modulo. Vamos a demostrar
// mas abajo que los dos ven EXACTAMENTE el mismo estado.
// ============================================================

// TODO (en clase):
//   Importa de './modulos/almacen.js' estas diez nombradas:
//     ID_INSTANCIA, VECES_EVALUADO, registrarEvento, obtenerEstado,
//     obtenerEventos, obtenerContadores, contarEventos,
//     establecerPreferencia, obtenerPreferencia, reiniciar
//   Y debajo, la marca de evaluacion del modulo principal:
//     console.log('[main.js] Modulo principal evaluado. Todas las dependencias ya estaban listas.');
//   Momento perfecto para abrir F12 y leer el ORDEN de los mensajes: las
//   hojas del grafo (consola, almacen) se evaluan ANTES que main.js.
//   (aprox. 13 lineas)

// ============================================================
// 6. CONSOLAS VISUALES DE CADA SECCION
// ------------------------------------------------------------
// Creamos un objeto con una consola por seccion. Cada una escribe en su
// propio <pre> del HTML.
// ============================================================

// TODO (en clase):
//   Declara `const consolas = { ... }` con QUINCE consolas creadas con
//   crearConsola(). Clave -> id del <pre> del HTML (respeta los ids, ya
//   estan puestos en la maqueta):
//     declaraciones  -> 'salida-declaraciones'
//     plantillas     -> 'salida-plantillas'
//     destructuring  -> 'salida-destructuring'
//     spread         -> 'salida-spread'
//     parametros     -> 'salida-parametros'
//     opcional       -> 'salida-opcional'
//     logicos        -> 'salida-logicos'
//     metodosArray   -> 'salida-metodos-array'
//     metodosTexto   -> 'salida-metodos-texto'
//     iteradores     -> 'salida-iteradores'
//     generadores    -> 'salida-generadores'
//     numeros        -> 'salida-numeros'
//     modulos        -> 'salida-modulos'
//     almacen        -> 'salida-almacen'
//     dinamico       -> 'salida-dinamico'
//   (aprox. 17 lineas)

// ============================================================
// 7. REGISTRO DE DEMOSTRACIONES
// ------------------------------------------------------------
// Un objeto donde cada clave es el nombre de una demo y el valor es la
// funcion que la ejecuta. Asi los botones del HTML solo necesitan un
// atributo data-demo con el nombre, y no hay que escribir un
// addEventListener por cada boton.
//
// Este patron se llama "tabla de despacho" (dispatch table) y sustituye
// con ventaja a un switch gigante.
// ============================================================

// TODO (en clase):
//   1. Declara `const DEMOSTRACIONES = { ... }`. Las claves son EXACTAMENTE
//      los valores del atributo data-demo de los botones del HTML:
//        declaraciones, plantillas, destructuring, spread, parametros,
//        opcional, logicos, numeros -> cada una llama a la funcion
//        correspondiente de `sintaxis` pasandole su consola. Por ejemplo:
//          declaraciones: () => sintaxis.demoDeclaraciones(consolas.declaraciones),
//        OJO con dos que no se llaman igual que la clave:
//          spread   -> sintaxis.demoSpreadRest
//          parametros -> sintaxis.demoParametrosPorDefecto
//        'metodos-array' -> llama en este orden a metodos.demoAt, demoFindLast,
//          demoFlat, demoObjetos, demoGroupBy y demoNoDestructivos, todas con
//          consolas.metodosArray.
//        'metodos-texto' -> metodos.demoStrings, demoNumeros y
//          demoStructuredClone con consolas.metodosTexto.
//        iteradores  -> generadores.demoProtocoloIterable y demoIteradorPropio.
//        generadores -> generadores.demoGeneradores y demoCasoPractico.
//        modulos  -> demostrarModulos()   (la escribiras en la seccion 8)
//        almacen  -> demostrarAlmacen()   (seccion 9)
//   2. Declara `const CONSOLA_DE_DEMO = { ... }`, un mapa de que consola le
//      corresponde a cada demo (las mismas 14 claves, sin 'dinamico'), para
//      poder limpiarla antes de volver a ejecutarla.
//   3. Escribe `function ejecutarDemo(nombre)`:
//        - Busca la demo en la tabla. Guarda temprana: si no existe, `demo`
//          vale undefined; avisa con imprimir(`No existe la demostracion "${nombre}".`)
//          y sal, en vez de provocar un "TypeError: demo is not a function".
//        - `CONSOLA_DE_DEMO[nombre]?.limpiar();`
//        - Llama a demo() dentro de try/catch. Si una demo falla, las demas
//          siguen funcionando y el error se ve en pantalla en lugar de romper
//          la clase: console.error(...) y `consola?.imprimir(`ERROR INESPERADO: ${error.message}`)`.
//   (aprox. 70 lineas las tres partes)

// ============================================================
// 8. SECCION 13: DEMOSTRAR COMO FUNCIONAN LOS MODULOS
// ============================================================

// TODO (en clase) — async function demostrarModulos()
//   Escribe en `consolas.modulos` (id="salida-modulos"). Es la seccion
//   estrella del proyecto: cinco bloques encadenados.
//   1. titulo 'Los modulos tienen su propio ambito'
//      En un script clasico, `const x = 1` de nivel superior NO crea
//      window.x, pero `var x = 1` SI lo hacia. En un modulo, ninguna de
//      las dos cosas toca el objeto global. Imprime
//      `typeof window.ID_INSTANCIA !== 'undefined'` y lo mismo con
//      window.formatearMoneda (los dos false), y las conclusiones:
//        '-> Nada de lo que declaramos se filtra al objeto window.'
//        '   Por eso los modulos NO necesitan la IIFE (function(){...})()'
//        '   que usabamos en los proyectos anteriores.'
//   2. titulo 'Modo estricto automatico'
//      Los modulos estan SIEMPRE en modo estricto, sin escribir 'use strict'.
//      Declara dentro `function quienEsThis() { return this; }` e imprimelo:
//      vale undefined, no window. Y provoca el otro sintoma llamando a
//      `asignarVariableNoDeclarada()` dentro de try/catch (la escribiras
//      justo despues de esta funcion).
//   3. titulo 'Los valores importados son de SOLO LECTURA'
//      Intenta `matematicas.NOTA_APROBACION = 5.0;` dentro de try/catch.
//      El espacio de nombres de un modulo esta sellado:
//        '-> Los imports son enlaces vivos de solo lectura, no copias.'
//   4. titulo 'El modulo se evalua UNA sola vez'
//      Imprime ID_INSTANCIA, VECES_EVALUADO y
//      MOMENTO_DE_CARGA.toLocaleTimeString('es-CL'). Despues pide el almacen
//      OTRA VEZ, de forma dinamica:
//        const segundaCopia = await import('./modulos/almacen.js');
//      y compara: mismo ID, misma funcion registrarEvento (`===` da true).
//        '-> Prueba definitiva: un modulo es un SINGLETON.'
//   5. titulo 'Los imports son enlaces VIVOS, no copias'
//      Guarda `contarEventos()` en `antes`, llama a
//      `validarEmail('prueba.enlace.vivo@instituto.cl')` y vuelve a contar.
//      El numero sube: validaciones.js escribio en el MISMO almacen que lee
//      main.js.
//   6. titulo 'Rutas de importacion: reglas del navegador'
//      Cuatro lineas de texto puro, para proyectar:
//        "import { x } from './modulos/almacen.js'   CORRECTO"
//        "import { x } from './modulos/almacen'      ERROR 404 (falta .js)"
//        "import { x } from 'modulos/almacen.js'     ERROR (falta el ./)"
//        "import { x } from '../modulos/almacen.js'  sube un nivel de carpeta"
//        '-> En el navegador, la extension .js es OBLIGATORIA.'
//   (aprox. 55 lineas)

// TODO (en clase) — function asignarVariableNoDeclarada()
//   Provoca un ReferenceError propio del modo estricto. En modo estricto,
//   escribir en una variable que nadie declaro lanza ReferenceError, y los
//   modulos estan siempre en modo estricto.
//   Cuerpo: `variableQueNadieDeclaro = 42; return variableQueNadieDeclaro;`
//   Va en una funcion aparte para que el error ocurra al EJECUTAR y no al
//   analizar el archivo.
//   (aprox. 4 lineas)

// ============================================================
// 9. SECCION 14: EL ALMACEN COMPARTIDO EN VIVO
// ============================================================

// TODO (en clase) — function demostrarAlmacen()
//   Escribe en `consolas.almacen` (id="salida-almacen").
//   1. titulo 'Estado actual del almacen': imprime, alineado con etiquetas
//      de ancho fijo, la instancia (ID_INSTANCIA), `formatearFecha(estado.iniciadoEn,
//      { estilo: 'conHora' })`, `fechaRelativa(estado.iniciadoEn)`,
//      contarEventos() y estado.preferencias.
//   2. titulo 'Contadores de uso de la caja de herramientas': recorre
//      Object.entries(obtenerContadores()) y convierte cada clave camelCase
//      en palabras con `clave.replaceAll(/([A-Z])/g, ' $1').toLowerCase()`,
//      imprimiendo `${legible.padEnd(26, '.')} ${String(valor).padStart(4)}`.
//   3. titulo 'Ultimos eventos registrados': `obtenerEventos({ limite: 8 })`.
//      Si esta vacio, imprime '(sin eventos todavia)'. Si no, una linea por
//      evento: `[${hora}] #${String(evento.id).padStart(3, '0')} ${evento.tipo}`.
//   4. titulo 'obtenerEstado() devuelve una COPIA, no el original':
//      pide otra copia, vaciale los eventos y ponle un contador a 9999, y
//      comprueba que el almacen real NO se movio.
//        '-> Gracias a structuredClone, nadie puede corromper el estado desde fuera.'
//   (aprox. 35 lineas)

// ============================================================
// 10. SECCION 15: IMPORTACION DINAMICA (code splitting)
// ============================================================

// TODO (en clase):
//   1. Declara, fuera de toda funcion, `let moduloReporte = null;`
//      La primera vez vale null; despues de la primera carga guardamos el
//      modulo para poder comparar tiempos.
//   2. Escribe `async function cargarReporteAvanzado()`:
//      - Toma `consolas.dinamico`, el boton id="boton-dinamico" y la insignia
//        id="estado-dinamico" con getElementById.
//      - Bloquea el boton mientras dura la carga (disabled = true, texto
//        'Cargando modulo...'): sin esto, el usuario puede pulsar cinco veces
//        seguidas y lanzar cinco cargas.
//      - `const inicio = performance.now();`
//      - AQUI ESTA LA IMPORTACION DINAMICA, dentro de un try:
//          const modulo = await import('./extras/reporte-avanzado.js');
//        import() se escribe como si fuera una funcion y devuelve una PROMESA
//        que se resuelve con el espacio de nombres del modulo. Diferencias con
//        el import estatico:
//          - Se puede poner DENTRO de un if, de un evento o de una funcion.
//          - La ruta puede ser una variable calculada en tiempo de ejecucion.
//          - El archivo NO se descarga al abrir la pagina, sino ahora.
//        Eso es el "code splitting": partir la aplicacion en trozos y traer
//        cada trozo solo cuando el usuario lo necesita. Una pagina que arranca
//        con 80 KB en lugar de 800 KB se siente instantanea.
//      - Calcula la duracion, mira si `moduloReporte === null` (primera vez),
//        guarda el modulo y limpia la consola.
//      - ⚠️ ERROR COMUN: la exportacion por defecto vive en la propiedad
//        `.default`. Al importar dinamicamente NO hay azucar sintactico:
//          const generarReporte = modulo.default;
//      - Llama a `generarReporte(c, { idInstanciaPrincipal: ID_INSTANCIA })`,
//        imprime `Tiempo de este import(): ${duracion.toFixed(1)} ms` y una de
//        las dos explicaciones segun sea la primera vez o no:
//          '-> Primera carga: el navegador tuvo que ir a buscar el archivo.'
//          '-> Segunda carga o posteriores: salio de la cache, por eso es casi instantanea.'
//      - Actualiza la insignia: textContent
//        `Modulo cargado (v${modulo.VERSION}) · reportes generados: ${resumen.vecesGenerado}`
//        y className 'insignia insignia--exito'.
//      - Deja rastro en la consola general con imprimir() y registra el evento
//        'import-dinamico' con { milisegundos: Math.round(duracion) }.
//      - En el catch: si el proyecto se abrio con doble clic (file://) el
//        import() fallara por la politica CORS. Explicalo con claridad en la
//        consola visual y pon la insignia en 'insignia insignia--error'.
//      - En el finally (se ejecuta pase lo que pase: es el sitio correcto para
//        esto) devuelve el boton a su estado normal: disabled = false y texto
//        'Cargar el modulo del reporte'.
//   (aprox. 60 lineas)

// ============================================================
// 11. SECCION 16: LA CAJA DE HERRAMIENTAS (parte practica)
// ============================================================

// TODO (en clase) — function pintarResultado(idContenedor, lineas, { claseGeneral = '' } = {})
//   Dibuja una lista de pares clave/valor dentro de un contenedor.
//   ✅ BUENA PRACTICA: construimos los elementos con createElement y
//   textContent en vez de innerHTML. Como parte del contenido viene de lo
//   que escribe el usuario, con innerHTML estariamos abriendo la puerta a
//   una inyeccion de HTML (XSS).
//   1. getElementById y guarda temprana si no existe.
//   2. Vacia con `contenedor.textContent = '';` y pon
//      `contenedor.className = `resultado ${claseGeneral}`.trim();`
//   3. Recorre `lineas` con for...of. Cada linea puede ser:
//      - un texto suelto -> un <p class="texto-suave"> con ese texto.
//      - un objeto { clave, valor, clase } -> un <div class="linea"> con un
//        <span class="clave"> y un <span class="valor ..."> dentro,
//        anadidos con `fila.append(etiquetaClave, etiquetaValor)`.
//   (aprox. 32 lineas)

// ---------------------------------------------------------
// 11.1 Herramienta de moneda
// ---------------------------------------------------------

// TODO (en clase) — function herramientaMoneda()
//   1. Lee `document.getElementById('entrada-monto')?.value ?? ''` y
//      `document.getElementById('entrada-moneda')?.value ?? 'CLP'`.
//   2. Valida ANTES de calcular nada: si el texto esta vacio o
//      `!Number.isFinite(monto)`, pinta en 'resultado-moneda' una sola linea
//      { clave: 'Error', valor: 'Escribe un monto numerico valido.', clase: 'texto-error' }
//      y sal.
//   3. `establecerPreferencia('moneda', moneda);` — guardamos la preferencia
//      en el almacen compartido.
//   4. Calcula iva = monto * 0.19, totalConIva y conDescuento = monto * 0.9.
//   5. Pinta OCHO lineas en 'resultado-moneda': Moneda (`${moneda} - ${informacion?.etiqueta ?? 'desconocida'}`),
//      Monto formateado, IVA (19 %), Total con IVA, Con 10 % de descuento,
//      Numero con separadores (formatearNumero), Proporcion del presupuesto
//      (formatearPorcentaje(monto / matematicas.PRESUPUESTO_MAXIMO)) y
//      Codigo de factura (codigoDeFactura(Math.round(monto % 1000))).
//   6. Deja rastro con la plantilla etiquetada:
//      `imprimir(destacar\`Moneda: ${formatearMoneda(monto, { moneda })} (${moneda})\`)`,
//      registra el evento 'formato-moneda' y llama a `sumarUso('formatosMoneda')`.
//   Resultado esperado con el valor 149990 que trae el input por defecto:
//      "Monto formateado: $149.990" y "Total con IVA: $178.488".
//   (aprox. 32 lineas)

// ---------------------------------------------------------
// 11.2 Herramienta de fechas
// ---------------------------------------------------------

// TODO (en clase) — function herramientaFecha()
//   1. Lee el id="entrada-fecha" y valida con `validarRequerido(valor, 'La fecha')`.
//      Si falla, pinta el error en 'resultado-fecha' y sal.
//   2. Calcula los dias de diferencia con hoy construyendo la fecha por
//      partes: `const [anio, mes, dia] = valor.split('-').map(Number);`
//      `const fecha = new Date(anio, mes - 1, dia);` y
//      `Math.round((fecha - hoy) / 86_400_000)`.
//   3. Pinta OCHO lineas en 'resultado-fecha': Formato largo (pasado por
//      aTitulo), Dia de la semana, Formato corto, Formato numerico, Distancia
//      (fechaRelativa, clase 'texto-alerta'), Dias de diferencia, En ingles
//      (idioma 'en-US') y Url amigable (aUrlAmigable del formato largo).
//   4. imprimir(...), registrarEvento('formato-fecha', { valor }) y
//      sumarUso('formatosFecha').
//   (aprox. 24 lineas)

// ---------------------------------------------------------
// 11.3 Herramienta de validacion
// ---------------------------------------------------------

// TODO (en clase) — function herramientaValidacion()
//   1. Lee id="entrada-email" e id="entrada-clave".
//   2. Usa el validador de formulario completo: recibe un objeto de datos y
//      un objeto de reglas, y devuelve el detalle de cada campo:
//        validarFormulario({ email, clave }, { email: validarEmail, clave: revisarClave })
//      Fijate en que aqui se usa el nombre RENOMBRADO en el import.
//   3. Pinta la barra de fuerza: coge id="barra-fuerza-relleno", ponle
//      `style.width = `${detalleClave.puntaje}%`` y el color segun
//      `{ exito: '#4ade80', alerta: '#fbbf24', error: '#f87171' }[detalleClave.color] ?? '#f87171'`.
//   4. Construye un array `lineas` con siete entradas: Correo (Valido/No valido),
//      Usuario, Dominio, Extension (los tres con `?? '(sin ...)'`), Contrasena
//      (`${fuerza} (${puntaje}/100)` con clase `texto-${color}`), Largo y
//      Errores totales.
//   5. Si hay problemas, anade la linea de texto 'Problemas detectados:' y uno
//      por problema con clave '·'. Si no, 'Todo correcto: el formulario pasaria
//      la validacion.'
//   6. pintarResultado('resultado-validacion', lineas) e imprimir(...).
//   Resultado esperado con los valores por defecto del formulario:
//      Correo Valido, Contrasena Muy fuerte (100/100), Errores totales 0.
//   (aprox. 40 lineas)

// ---------------------------------------------------------
// 11.4 Herramienta de estadisticas
// ---------------------------------------------------------

// TODO (en clase) — function herramientaEstadisticas()
//   1. Lee id="entrada-notas" y conviertelo con matematicas.extraerNumeros().
//      Si el array queda vacio, pinta el error en 'resultado-estadisticas' y sal.
//   2. DESESTRUCTURA el resumen completo en variables sueltas:
//        const { cantidad, promedio, mediana, minimo, maximo, rango, desviacion,
//                aprobados, reprobados, porcentajeAprobacion, ultima }
//          = matematicas.resumenEstadistico(notas);
//   3. Pinta DOCE lineas en 'resultado-estadisticas': Notas leidas, Promedio
//      (con clase verde o roja segun matematicas.NOTA_APROBACION), Mediana,
//      Nota mas baja, Nota mas alta, Rango, Desviacion estandar, Aprobados
//      (`${aprobados} de ${cantidad}`), Reprobados, Porcentaje de aprobacion,
//      Ultima nota (at(-1)) y Notas ordenadas
//      (`[...notas].sort((a, b) => a - b).join(' · ')`).
//   4. imprimir(...), registrarEvento('calculo-estadistico', { cantidad, promedio })
//      y sumarUso('calculosEstadisticos').
//   Resultado esperado con las notas que trae el textarea por defecto:
//      Notas leidas 8, Promedio 5.00, Aprobados 6 de 8, Porcentaje 75 %.
//   (aprox. 30 lineas)

// TODO (en clase) — async function sumarUso(clave)
//   Pequeno ayudante que sube un contador del almacen. Lo hacemos con un
//   import dinamico EN LINEA para NO tener que importar sumarContador
//   arriba: es una demostracion extra de que import() se puede usar en
//   cualquier punto del codigo.
//     const almacen = await import('./modulos/almacen.js');
//     almacen.sumarContador(clave);
//   (aprox. 4 lineas)

// ============================================================
// 12. CONEXION DE LOS BOTONES DEL HTML
// ------------------------------------------------------------
// Un solo escuchador en el documento (delegacion de eventos) en lugar
// de decenas de addEventListener. Cuando alguien pulsa cualquier cosa,
// miramos si el elemento pulsado tiene los atributos data-* que nos
// interesan y actuamos en consecuencia.
// ============================================================

// TODO (en clase) — function conectarEventos()
//   1. `document.addEventListener('click', (evento) => { ... })`.
//      Dentro: `const boton = evento.target.closest('[data-accion]');` y sal
//      si no hay. closest() sube por el arbol buscando el ancestro mas cercano
//      que encaje, asi funciona aunque el usuario pulse sobre un icono que
//      este dentro del boton.
//   2. Desestructura el dataset (un objeto con todos los data-*):
//        const { accion, demo, consola: idConsola } = boton.dataset;
//   3. Si accion === 'ejecutar' && demo -> ejecutarDemo(demo) y return.
//      Si accion === 'limpiar' && idConsola -> limpiar(idConsola) y return.
//   4. Tabla de despacho para el resto de acciones sueltas, con estas siete
//      claves exactas (son los data-accion del HTML):
//        'ejecutar-todo' -> ejecutarTodasLasDemos
//        'limpiar-todo' -> limpiarTodo
//        'cargar-dinamico' -> cargarReporteAvanzado
//        'herramienta-moneda' -> herramientaMoneda
//        'herramienta-fecha' -> herramientaFecha
//        'herramienta-validacion' -> herramientaValidacion
//        'herramienta-estadisticas' -> herramientaEstadisticas
//        'reiniciar-almacen' -> una flecha que llame a reiniciar(),
//           demostrarAlmacen() e imprimir('Almacen reiniciado por el docente.')
//      Y ejecutala con encadenamiento opcional de llamada: `acciones[accion]?.();`
//   5. Actualizacion en vivo de la barra de fuerza mientras se escribe:
//      `document.getElementById('entrada-clave')?.addEventListener('input', ...)`
//      que llame a revisarClave(campoClave.value) y repinte
//      id="barra-fuerza-relleno".
//   6. Recalcular la moneda al cambiar el selector, sin pulsar el boton:
//      `document.getElementById('entrada-moneda')?.addEventListener('change', herramientaMoneda);`
//   (aprox. 45 lineas)

// ============================================================
// 13. EJECUCION INICIAL
// ============================================================

// TODO (en clase) — function ejecutarTodasLasDemos()
//   `for (const nombre of Object.keys(DEMOSTRACIONES)) ejecutarDemo(nombre);`
//   Si manana anadimos una demo nueva, este bucle la recoge solo. Nada que
//   tocar aqui. Cierra con imprimir('Todas las demostraciones se ejecutaron de nuevo.').
//   (aprox. 6 lineas)

// TODO (en clase) — function limpiarTodo()
//   Recorre `Object.values(consolas)` llamando a consola.limpiar(), llama
//   ademas a limpiar('salida') e imprime
//   'Consolas limpiadas. Pulsa "Ejecutar todas las demostraciones" para repetir.'
//   (aprox. 7 lineas)

// TODO (en clase) — function confirmarCargaDeModulos()
//   Marca en la pagina que los modulos SI se cargaron. Es la funcion que
//   pone en VERDE el aviso rojo del principio.
//   1. Coge id="estado-modulos" (guarda temprana si no existe).
//   2. `estado.className = 'aviso aviso--exito';` y vacia con innerHTML = ''.
//   3. Crea un <h3> con 'Modulos ES cargados correctamente' y un <p>
//      explicando que si se lee en verde es porque la pagina se esta
//      sirviendo por HTTP y el navegador pudo resolver todos los import.
//      Anadelos con `estado.append(titulo3, parrafo)`.
//   (aprox. 18 lineas)

// TODO (en clase) — function precargarFormularios()
//   Rellena la caja de herramientas con valores de ejemplo utiles en clase.
//   1. Calcula la fecha de dentro de un mes y escribela en id="entrada-fecha"
//      en formato AAAA-MM-DD (el input date EXIGE ese formato), construyendo
//      mes y dia con `String(...).padStart(2, '0')`.
//   2. Rellena el <select id="entrada-moneda"> a partir del objeto MONEDAS,
//      en lugar de escribir las opciones a mano en el HTML:
//        for (const [codigo, { etiqueta }] of Object.entries(MONEDAS)) { ... }
//      con `opcion.textContent = `${codigo} · ${etiqueta}`;` y, al final,
//      `selector.value = obtenerPreferencia('moneda', 'CLP');`
//      Hazlo solo si `selector.options.length === 0`.
//   (aprox. 22 lineas)

// TODO (en clase) — function iniciar()
//   Arranque de la aplicacion, en este orden:
//   1. confirmarCargaDeModulos(); precargarFormularios(); conectarEventos();
//   2. Registro general: titulo('Proyecto 10 iniciado') y siete lineas con
//      imprimir(): fecha y hora (formatearFecha con estilo 'conHora'),
//      la instancia del almacen, los modulos cargados (dos lineas), el aviso
//      de que reporte-avanzado.js todavia NO se ha descargado, la nota de
//      aprobacion (matematicas.NOTA_APROBACION) y el presupuesto de ejemplo
//      formateado como moneda.
//   3. ejecutarTodasLasDemos();
//   4. Deja la caja de herramientas con un primer resultado llamando a las
//      cuatro herramientas. Asi la seccion practica no aparece vacia al abrir
//      la pagina y el docente puede comentarla antes de tocar ningun campo.
//   5. titulo('Todo listo') + imprimir('Usa los botones de cada seccion para
//      repetir cualquier demostracion.') + registrarEvento('sistema',
//      { accion: 'aplicacion iniciada' }).
//   (aprox. 25 lineas)

// ============================================================
// 14. RED DE SEGURIDAD
// ------------------------------------------------------------
// Si algo falla de forma inesperada, lo mostramos en la consola visual
// en lugar de dejar la pagina en blanco sin explicacion.
// ============================================================

// TODO (en clase):
//   Dos escuchadores a nivel de window, fuera de toda funcion:
//     window.addEventListener('error', (evento) => imprimir(`ERROR NO CONTROLADO: ${evento.message}`));
//     window.addEventListener('unhandledrejection', (evento) => imprimir(`PROMESA RECHAZADA SIN CAPTURAR: ${evento.reason}`));
//   (aprox. 8 lineas)

// ============================================================
// 15. ARRANQUE
// ------------------------------------------------------------
// Los modulos se ejecutan SIEMPRE de forma diferida, como si el script
// llevara `defer`. Eso significa que el HTML completo ya esta analizado
// y el DOM ya existe cuando llega esta linea.
//
// ⚠️ ERROR COMUN: envolver esto en DOMContentLoaded "por si acaso". No hace
// falta, y con un modulo el evento puede haberse disparado ya.
// ============================================================

// TODO (en clase):
//   Ultima linea del archivo, sin nada mas:
//     iniciar();
//   (aprox. 1 linea)

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade una quinta herramienta a la caja: un conversor de unidades
 *    (kilometros a millas, celsius a fahrenheit). Crea el modulo
 *    js/modulos/conversiones.js con exportaciones nombradas e importalo aqui.
 *
 * 2) Cambia el import de matematicas para traer solo `resumenEstadistico` y
 *    `extraerNumeros` de forma nombrada, y ajusta el codigo. Comenta que
 *    ventaja tiene frente al `import * as`.
 *
 * 3) Haz que la preferencia de moneda se recuerde entre recargas guardandola
 *    en localStorage, y que el almacen la lea al iniciar. Cuidado:
 *    localStorage solo guarda texto.
 *
 * 4) Anade un segundo boton de carga dinamica que importe un modulo distinto
 *    segun el valor de un <select>. Usa una plantilla para construir la ruta:
 *    await import(`./extras/${nombreElegido}.js`).
 *
 * 5) AVANZADO: convierte la funcion iniciar() en asincrona y carga los tres
 *    modulos de teoria (sintaxis, metodos, generadores) con import() dinamico
 *    en paralelo usando Promise.all. Mide con performance.now() la diferencia
 *    frente a los imports estaticos y comentala.
 * ============================================================
 */
