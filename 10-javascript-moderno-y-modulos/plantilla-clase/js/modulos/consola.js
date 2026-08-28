/**
 * ============================================================
 * ARCHIVO: js/modulos/consola.js
 * TEMA: Modulos ES - exportaciones nombradas + "consola visual"
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Como se escribe un modulo ES real (un archivo = un modulo).
 *  - Exportaciones NOMBRADAS con `export function` y `export const`.
 *  - Que el codigo de nivel superior de un modulo se ejecuta UNA
 *    sola vez, por mucho que otros archivos lo importen.
 *  - El patron "consola visual": imprimir en la pagina lo mismo
 *    que se imprime en la consola del navegador (F12), para poder
 *    proyectarlo en clase sin abrir las herramientas de desarrollo.
 *
 * NOTA IMPORTANTE PARA EL DOCENTE
 * Este archivo NO necesita una IIFE `(function () { ... })()`.
 * En los proyectos anteriores envolviamos todo en una IIFE porque
 * los scripts clasicos comparten el ambito global y dos archivos
 * podian chocar con el mismo nombre de variable. Los MODULOS ES
 * ya tienen ambito propio: nada se filtra al objeto `window`.
 * Ese es, precisamente, uno de los grandes motivos para usarlos.
 * ============================================================
 */

/* ============================================================
   MODO CLASE: ESTE ARCHIVO YA VIENE ESCRITO Y FUNCIONANDO
   ------------------------------------------------------------
   Es la UNICA excepcion de la plantilla. Todo lo demas esta por
   escribir, pero consola.js no: es el ANDAMIAJE que permite que
   imprimir(), titulo() y crearConsola() muestren algo en pantalla
   desde el primer minuto de la clase. Sin el no se podria
   demostrar nada sin abrir las herramientas de desarrollo.

   En clase basta con leerlo por encima (5 minutos) y quedarse con
   tres ideas: un archivo = un modulo, `export` publica y lo que no
   lleva `export` es privado. Despues se pasa a los archivos que si
   hay que escribir.
   ============================================================ */

// ============================================================
// 1. EFECTO DE NIVEL SUPERIOR: "este modulo se evaluo"
// ------------------------------------------------------------
// Todo lo que escribimos fuera de una funcion se ejecuta cuando el
// modulo se evalua por primera vez. Este console.log aparecera UNA
// unica vez en DevTools, sin importar cuantos archivos lo importen.
// Lo usaremos mas adelante como prueba visible del "singleton".
// ============================================================
console.log('[consola.js] Modulo evaluado (esto se ve una sola vez).');

// Marca de tiempo del momento exacto en que se evaluo el modulo.
// `export const` la deja disponible para quien la importe.
export const MOMENTO_DE_CARGA = new Date();

// ============================================================
// 2. FUNCION AUXILIAR PRIVADA: describir(valor)
// ------------------------------------------------------------
// Esta funcion NO lleva `export`, asi que es PRIVADA del modulo:
// solo se puede usar aqui dentro. Es el equivalente moderno de las
// "variables privadas" que antes conseguiamos con una IIFE.
//
// Su trabajo: convertir cualquier valor de JavaScript en un texto
// legible para mostrarlo en pantalla. `String(valor)` no basta,
// porque un objeto se convertiria en el inutil "[object Object]".
// ============================================================
function describir(valor) {
  // `typeof null` devuelve "object" (un error historico del lenguaje),
  // por eso hay que preguntar por null ANTES que por object.
  if (valor === null) return 'null';                    // el "vacio a proposito"
  if (valor === undefined) return 'undefined';          // el "vacio por accidente"

  // Los textos se muestran tal cual: si los pasaramos por JSON.stringify
  // apareceria con comillas dobles y ensuciaria la lectura en clase.
  if (typeof valor === 'string') return valor;

  // Los simbolos y los BigInt no se pueden convertir con JSON.stringify.
  if (typeof valor === 'symbol') return String(valor);   // Symbol(descripcion)
  if (typeof valor === 'bigint') return `${valor}n`;     // 9007199254740993n

  // Las funciones se describen por su nombre, no por su codigo fuente.
  if (typeof valor === 'function') {
    return `[funcion ${valor.name || 'anonima'}]`;
  }

  // Map y Set tampoco sobreviven a JSON.stringify (darian "{}").
  // Los convertimos a array con el operador spread (...) para verlos.
  if (valor instanceof Map) {
    return `Map(${valor.size}) ${JSON.stringify([...valor.entries()])}`;
  }
  if (valor instanceof Set) {
    return `Set(${valor.size}) ${JSON.stringify([...valor.values()])}`;
  }

  // Las fechas se muestran en formato ISO, corto y sin ambiguedad.
  if (valor instanceof Date) return valor.toISOString();

  // Los errores muestran su nombre y su mensaje.
  if (valor instanceof Error) return `${valor.name}: ${valor.message}`;

  // Para el resto de objetos y arrays usamos JSON con sangria de 2.
  if (typeof valor === 'object') {
    try {
      return JSON.stringify(valor, null, 2);
    } catch (error) {
      // Si el objeto tiene una referencia circular (a -> b -> a),
      // JSON.stringify lanza un error. Lo capturamos para no romper la pagina.
      // BUENA PRACTICA: nunca dejar que una utilidad de log tumbe la app.
      return '[objeto no serializable: ' + error.message + ']';
    }
  }

  // Numeros y booleanos caen aqui.
  return String(valor);
}

// ============================================================
// 3. ESCRITURA EN UN DESTINO CONCRETO
// ------------------------------------------------------------
// Funcion privada que hace el trabajo real: busca el <pre> por su id
// y le anade texto. Si el elemento no existe, no hace nada y no falla.
// ============================================================
function escribirEn(idDestino, mensajes) {
  // 1) Siempre escribimos tambien en la consola real del navegador.
  console.log(...mensajes);

  // 2) Y ademas en el bloque visual de la pagina, si existe.
  const destino = document.getElementById(idDestino);
  if (!destino) return; // la pagina no tiene ese contenedor: salimos en silencio

  const texto = mensajes.map(describir).join(' ');
  destino.textContent += texto + '\n';

  // Autoscroll: siempre queremos ver la ultima linea escrita.
  destino.scrollTop = destino.scrollHeight;
}

// ============================================================
// 4. API PUBLICA POR DEFECTO (escribe en el <pre id="salida">)
// ------------------------------------------------------------
// Estas son las funciones que usa el "registro general" de la pagina.
// ============================================================

/**
 * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
 * COMO en el bloque visual de la pagina, para que se vea en clase sin
 * abrir DevTools.
 *
 * Usa parametros REST (...mensajes) para aceptar cuantos argumentos
 * queramos, igual que console.log:  imprimir('Nota:', 6.5, { ok: true })
 */
export function imprimir(...mensajes) {
  escribirEn('salida', mensajes);
}

/**
 * titulo(): imprime un separador visual antes de cada seccion, para
 * que la salida no sea un muro de texto indistinguible.
 */
export function titulo(texto) {
  escribirEn('salida', ['\n' + '='.repeat(58)]);
  escribirEn('salida', ['  ' + String(texto).toUpperCase()]);
  escribirEn('salida', ['='.repeat(58)]);
}

/**
 * limpiar(): vacia una consola visual. Muy util en clase para volver
 * a ejecutar una demostracion desde cero.
 */
export function limpiar(idDestino = 'salida') {
  const destino = document.getElementById(idDestino);
  if (destino) destino.textContent = '';
}

// ============================================================
// 5. FABRICA DE CONSOLAS: crearConsola(id)
// ------------------------------------------------------------
// Cada seccion de la pagina tiene su PROPIA consola visual, para que
// las demostraciones no se mezclen en un unico bloque enorme.
//
// crearConsola devuelve un objeto con funciones que "recuerdan" a que
// id deben escribir. Ese recuerdo se llama CLAUSURA (closure): las
// funciones internas siguen viendo la variable `idDestino` del exterior
// aunque crearConsola ya haya terminado de ejecutarse.
//
// Analogia: es como entregarle a cada alumno un cuaderno con su nombre
// escrito en la tapa; cada uno escribe siempre en el suyo.
// ============================================================
export function crearConsola(idDestino) {
  return {
    // Imprime una linea en ESTA consola.
    imprimir(...mensajes) {
      escribirEn(idDestino, mensajes);
    },

    // Encabezado de bloque dentro de ESTA consola.
    titulo(texto) {
      escribirEn(idDestino, ['\n--- ' + String(texto).toUpperCase() + ' ---']);
    },

    // Linea separadora fina.
    separador() {
      escribirEn(idDestino, ['.'.repeat(52)]);
    },

    // Vacia ESTA consola.
    limpiar() {
      const destino = document.getElementById(idDestino);
      if (destino) destino.textContent = '';
    },

    // Guardamos el id por si alguien necesita consultarlo.
    id: idDestino,
  };
}

// ============================================================
// 6. AYUDANTE PARA MOSTRAR ERRORES CONTROLADOS
// ------------------------------------------------------------
// En este proyecto provocamos errores a proposito (por ejemplo, la
// zona muerta temporal). Este ayudante ejecuta una funcion, captura
// el error y lo imprime bonito en lugar de romper la pagina.
// ============================================================
export function intentar(consola, etiqueta, funcion) {
  try {
    const resultado = funcion();
    consola.imprimir(`${etiqueta} -> sin error. Resultado:`, resultado);
    return resultado;
  } catch (error) {
    // `error.constructor.name` nos da "ReferenceError", "TypeError", etc.
    consola.imprimir(`${etiqueta} -> ${error.constructor.name}: ${error.message}`);
    return undefined;
  }
}

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade a este modulo una funcion exportada `imprimirTabla(consola, filas)`
 *    que reciba un array de objetos y los muestre alineados en columnas,
 *    usando padEnd() para rellenar cada celda hasta un ancho fijo.
 *
 * 2) Crea una exportacion nombrada `contarLineas(idDestino)` que devuelva
 *    cuantas lineas se han escrito hasta ahora en esa consola visual.
 *    Pista: `textContent.split('\n')`.
 *
 * 3) Amplia `describir()` para que los arrays de mas de 20 elementos se
 *    resuman como "Array(120) [primero, ..., ultimo]" en vez de imprimirse
 *    completos. Explica por que esto mejora la lectura en clase.
 *
 * 4) Anade un modo "con marca de tiempo": crearConsola(id, { hora: true })
 *    debe anteponer la hora HH:MM:SS a cada linea. Usa padStart(2, '0').
 *
 * 5) AVANZADO: exporta por defecto (export default) un objeto `consolaGeneral`
 *    que agrupe imprimir, titulo y limpiar. Luego importalo en main.js con
 *    el nombre que quieras y comprueba que funciona igual.
 * ============================================================
 */
