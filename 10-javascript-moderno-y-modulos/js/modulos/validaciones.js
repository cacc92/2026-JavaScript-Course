/**
 * ============================================================
 * ARCHIVO: js/modulos/validaciones.js
 * TEMA: Modulo de validaciones + un modulo importando a otro
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Que un modulo puede IMPORTAR a otro modulo (aqui importamos
 *    almacen.js). Asi se construye un grafo de dependencias.
 *  - Que el almacen es el MISMO objeto para todos: si validamos aqui,
 *    el contador que lee main.js sube. Prueba viva del "singleton".
 *  - Objetos de resultado con una FORMA CONSTANTE:
 *      { valido, mensaje, problemas }
 *    para que quien nos llame nunca tenga que adivinar.
 *  - Encadenamiento opcional, fusion nula, rest/spread, Object.entries,
 *    Object.fromEntries y Array.prototype.flat/flatMap en accion.
 * ============================================================
 */

// ============================================================
// 1. IMPORTAR OTRO MODULO
// ------------------------------------------------------------
// Las rutas de un `import` en el navegador deben ser RELATIVAS y
// llevar SIEMPRE la extension .js. Es un error comun venir de Node
// y escribir `from './almacen'` (sin extension): en el navegador eso
// da un 404 y el modulo no carga.
//
// Como estamos en la misma carpeta, la ruta empieza por './'.
// ERROR COMUN: escribir `from 'almacen.js'` sin el './'. El navegador
// interpreta eso como un "bare specifier" (nombre de paquete) y falla,
// salvo que exista un import map.
// ============================================================
import { registrarEvento, sumarContador, ID_INSTANCIA } from './almacen.js';

console.log(`[validaciones.js] Modulo evaluado. Ve el almacen ${ID_INSTANCIA}.`);

// ============================================================
// 2. REGLAS DE CONTRASENA (configuracion exportada)
// ------------------------------------------------------------
// Sacar los "numeros magicos" a una constante con nombre hace que el
// codigo se lea solo y que cambiar una regla sea trivial.
// ============================================================
export const REGLAS_CONTRASENA = {
  largoMinimo: 8,
  largoRecomendado: 12,
  exigeMayuscula: true,
  exigeMinuscula: true,
  exigeNumero: true,
  exigeSimbolo: true,
};

/** Contrasenas prohibidas por ser demasiado obvias. */
export const CONTRASENAS_PROHIBIDAS = [
  '12345678',
  'password',
  'contrasena',
  'qwertyui',
  'admin123',
  'iloveyou',
];

// ============================================================
// 3. VALIDAR CORREO ELECTRONICO
// ------------------------------------------------------------
// AVISO HONESTO: no existe una expresion regular perfecta para el
// correo (el estandar RFC 5322 es monstruoso). Lo que hacemos aqui es
// una comprobacion razonable para dar retroalimentacion al usuario;
// la validacion definitiva siempre es enviar un correo de confirmacion.
// ============================================================
export function validarEmail(valor) {
  // Normalizamos: quitamos espacios de los dos extremos y pasamos a
  // minusculas. `?? ''` protege de recibir null o undefined.
  const email = String(valor ?? '').trim().toLowerCase();

  // Contamos la validacion en el almacen COMPARTIDO.
  sumarContador('validacionesEmail');

  // Array donde iremos acumulando todo lo que este mal.
  const problemas = [];

  if (email.length === 0) {
    problemas.push('El correo esta vacio.');
  } else {
    // Estructura minima: algo @ algo . algo, sin espacios ni arrobas extra.
    const patron = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/;

    if (!patron.test(email)) problemas.push('El formato no parece un correo valido.');
    if (email.includes('..')) problemas.push('No puede tener dos puntos seguidos.');
    if (email.startsWith('.') || email.startsWith('@')) problemas.push('No puede empezar por punto ni por arroba.');
    if (email.length > 254) problemas.push('El correo es demasiado largo.');
  }

  // Sacamos el dominio con desestructuracion de array. split('@') da
  // ['ana', 'duocuc.cl'] y nos quedamos con el segundo elemento.
  // El `?? null` cubre el caso de que no haya arroba y sea undefined.
  const [usuario, dominio] = email.split('@');

  const resultado = {
    valido: problemas.length === 0,
    email,
    usuario: usuario ?? null,
    // La FUSION NULA (??) convierte el undefined en un null explicito:
    // "no hay dominio" queda dicho a proposito, no por descuido.
    dominio: dominio ?? null,
    // Aqui SI hay ENCADENAMIENTO OPCIONAL (?.): si `dominio` es undefined,
    // la cadena se corta y devuelve undefined en vez de reventar al llamar
    // a .split() sobre undefined. Y at(-1) coge el ultimo trozo.
    extension: dominio?.split('.').at(-1) ?? null,
    problemas,
    mensaje: problemas.length === 0
      ? 'Correo con formato valido.'
      : problemas[0], // mostramos el primer problema como mensaje principal
  };

  registrarEvento('validacion-email', { email, valido: resultado.valido });

  return resultado;
}

// ============================================================
// 4. VALIDAR CONTRASENA
// ------------------------------------------------------------
// Devolvemos algo mas rico que un simple true/false: un puntaje de 0 a
// 100, una etiqueta de fuerza y la lista de lo que falta. Asi la
// interfaz puede pintar una barra de color y guiar al usuario.
// ============================================================
export function validarContrasena(valor, opciones = {}) {
  // Spread para mezclar la configuracion por defecto con la recibida.
  // Lo que venga en `opciones` PISA a lo que hay en REGLAS_CONTRASENA,
  // porque el spread de la derecha se aplica despues.
  const reglas = { ...REGLAS_CONTRASENA, ...opciones };

  const clave = String(valor ?? '');
  sumarContador('validacionesContrasena');

  const problemas = [];
  let puntaje = 0;

  // --- Largo ---
  if (clave.length === 0) {
    problemas.push('La contrasena esta vacia.');
  } else if (clave.length < reglas.largoMinimo) {
    problemas.push(`Debe tener al menos ${reglas.largoMinimo} caracteres.`);
  } else {
    puntaje += 25;
    // Bonus por ser mas larga de lo minimo: la longitud es, de lejos,
    // el factor que mas fortalece una contrasena.
    if (clave.length >= reglas.largoRecomendado) puntaje += 15;
  }

  // --- Composicion ---
  // Cada regla es un objeto con su patron y su mensaje. Recorrerlas en
  // un bucle evita repetir seis veces el mismo if.
  const comprobaciones = [
    { activa: reglas.exigeMinuscula, patron: /[a-z]/, mensaje: 'Falta una letra minuscula.', puntos: 15 },
    { activa: reglas.exigeMayuscula, patron: /[A-Z]/, mensaje: 'Falta una letra mayuscula.', puntos: 15 },
    { activa: reglas.exigeNumero, patron: /[0-9]/, mensaje: 'Falta un numero.', puntos: 15 },
    { activa: reglas.exigeSimbolo, patron: /[^A-Za-z0-9]/, mensaje: 'Falta un simbolo (!, ?, #, ...).', puntos: 15 },
  ];

  for (const { activa, patron, mensaje, puntos } of comprobaciones) {
    // Desestructuramos cada objeto directamente en el for...of.
    if (!activa) continue;                    // la regla esta desactivada
    if (patron.test(clave)) {
      puntaje += puntos;
    } else if (clave.length > 0) {
      problemas.push(mensaje);
    }
  }

  // --- Listas negras y patrones tontos ---
  const enMinusculas = clave.toLowerCase();
  if (CONTRASENAS_PROHIBIDAS.some((prohibida) => enMinusculas.includes(prohibida))) {
    problemas.push('Contiene una contrasena demasiado conocida.');
    puntaje -= 30;
  }

  // Tres o mas caracteres identicos seguidos: "aaa", "111".
  if (/(.)\1\1/.test(clave)) {
    problemas.push('Evita repetir el mismo caracter tres veces seguidas.');
    puntaje -= 10;
  }

  // Dejamos el puntaje dentro de 0-100 sin importar cuanto sumamos o restamos.
  puntaje = Math.max(0, Math.min(100, puntaje));

  // Etiqueta segun el puntaje. Un array de umbrales ordenado de mayor a
  // menor + find() es mas limpio que una escalera de if/else.
  const escalas = [
    { desde: 85, etiqueta: 'Muy fuerte', color: 'exito' },
    { desde: 65, etiqueta: 'Fuerte', color: 'exito' },
    { desde: 45, etiqueta: 'Aceptable', color: 'alerta' },
    { desde: 20, etiqueta: 'Debil', color: 'error' },
    { desde: 0, etiqueta: 'Muy debil', color: 'error' },
  ];

  // find() devuelve el primer elemento que cumple. Como el array esta
  // ordenado de mayor a menor, encontramos la escala correcta.
  const escala = escalas.find((nivel) => puntaje >= nivel.desde) ?? escalas.at(-1);

  const resultado = {
    valido: problemas.length === 0 && clave.length >= reglas.largoMinimo,
    puntaje,
    fuerza: escala.etiqueta,
    color: escala.color,
    largo: clave.length,
    problemas,
    mensaje: problemas.length === 0
      ? `Contrasena ${escala.etiqueta.toLowerCase()}.`
      : problemas[0],
  };

  registrarEvento('validacion-contrasena', { puntaje, fuerza: resultado.fuerza });

  return resultado;
}

// ============================================================
// 5. VALIDACIONES GENERICAS PEQUENAS
// ============================================================

/** Comprueba que un campo obligatorio tenga contenido real (no solo espacios). */
export function validarRequerido(valor, nombreCampo = 'El campo') {
  const texto = String(valor ?? '').trim();
  return {
    valido: texto.length > 0,
    mensaje: texto.length > 0 ? 'Correcto.' : `${nombreCampo} es obligatorio.`,
  };
}

/** Comprueba que un texto este dentro de un rango de longitud. */
export function validarLongitud(valor, { minimo = 0, maximo = 255, nombreCampo = 'El campo' } = {}) {
  const texto = String(valor ?? '').trim();
  const problemas = [];

  if (texto.length < minimo) problemas.push(`${nombreCampo} necesita al menos ${minimo} caracteres.`);
  if (texto.length > maximo) problemas.push(`${nombreCampo} no puede pasar de ${maximo} caracteres.`);

  return {
    valido: problemas.length === 0,
    largo: texto.length,
    problemas,
    mensaje: problemas[0] ?? 'Correcto.',
  };
}

/** Comprueba que un numero este dentro de un rango, ambos extremos incluidos. */
export function validarRango(valor, { minimo = 1, maximo = 7, nombreCampo = 'El valor' } = {}) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return { valido: false, mensaje: `${nombreCampo} debe ser un numero.` };
  }

  const dentro = numero >= minimo && numero <= maximo;
  return {
    valido: dentro,
    numero,
    mensaje: dentro ? 'Correcto.' : `${nombreCampo} debe estar entre ${minimo} y ${maximo}.`,
  };
}

// ============================================================
// 6. VALIDAR UN FORMULARIO COMPLETO
// ------------------------------------------------------------
// Aqui se ve muy bien la pareja Object.entries + Object.fromEntries:
//  - Object.entries convierte un objeto en un array de pares [clave, valor].
//  - Le aplicamos map/filter como a cualquier array.
//  - Object.fromEntries hace el camino de vuelta: pares -> objeto.
//
// Analogia: es como desarmar un mueble para transportarlo (entries),
// moverlo comodamente (map) y volver a montarlo en destino (fromEntries).
// ============================================================
export function validarFormulario(datos, reglas) {
  // 1) Desarmamos las reglas en pares [campo, funcionValidadora].
  const pares = Object.entries(reglas);

  // 2) Ejecutamos cada validador sobre su campo correspondiente.
  const resultadosPorCampo = pares.map(([campo, validador]) => {
    // Desestructuracion de ARRAY en los parametros de la funcion flecha:
    // cada `par` es [clave, valor] y lo abrimos al vuelo.
    const resultado = validador(datos?.[campo]);
    //                          ^^^^^^^^^^^^^ encadenamiento opcional con
    //                          acceso por corchetes: datos?.['email']
    return [campo, resultado];
  });

  // 3) Volvemos a montar un objeto: { email: {...}, clave: {...} }
  const detalle = Object.fromEntries(resultadosPorCampo);

  // 4) Juntamos todos los problemas de todos los campos en una sola lista.
  //    flatMap = map + flat(1) en un solo paso: mapeamos cada campo a su
  //    array de problemas y aplanamos el resultado.
  const todosLosProblemas = Object.values(detalle).flatMap(
    (resultado) => resultado.problemas ?? (resultado.valido ? [] : [resultado.mensaje])
  );

  return {
    valido: todosLosProblemas.length === 0,
    detalle,
    problemas: todosLosProblemas,
    cantidadDeErrores: todosLosProblemas.length,
  };
}

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Anade `validarTelefono(valor, pais = 'CL')` que acepte "+56 9 1234 5678"
 *    y "912345678". Usa replaceAll para quitar espacios y guiones antes de
 *    comprobar el patron.
 *
 * 2) Amplia validarContrasena para que sume 10 puntos extra si la contrasena
 *    contiene al menos tres tipos de caracteres distintos, y documenta el
 *    cambio en el comentario de la funcion.
 *
 * 3) Escribe `validarConfirmacion(clave, confirmacion)` que compruebe que las
 *    dos contrasenas coinciden. Cuidado con comparar con == en vez de ===.
 *
 * 4) Usa validarFormulario para validar un objeto de matricula con los campos
 *    nombre, email, clave y nota. Imprime en la consola visual cuantos errores
 *    hay y cual es el primero.
 *
 * 5) AVANZADO: convierte los validadores en funciones que devuelven funciones
 *    (currificacion): `longitudMinima(8)` deberia devolver un validador listo
 *    para pasar a validarFormulario. Explica que ventaja tiene.
 * ============================================================
 */
