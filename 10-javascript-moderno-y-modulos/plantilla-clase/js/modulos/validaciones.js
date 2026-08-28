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

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   Requisito previo: almacen.js ya escrito, porque este archivo lo
   importa. Los DATOS (REGLAS_CONTRASENA y CONTRASENAS_PROHIBIDAS)
   vienen escritos; la logica se escribe en vivo.

   Al terminar debe exportar: REGLAS_CONTRASENA, CONTRASENAS_PROHIBIDAS,
   validarEmail, validarContrasena, validarRequerido, validarLongitud,
   validarRango, validarFormulario.

   Tiempo estimado: 25 minutos.
   ============================================================ */

// ============================================================
// 1. IMPORTAR OTRO MODULO
// ------------------------------------------------------------
// Las rutas de un `import` en el navegador deben ser RELATIVAS y
// llevar SIEMPRE la extension .js. Es un error comun venir de Node
// y escribir `from './almacen'` (sin extension): en el navegador eso
// da un 404 y el modulo no carga.
//
// Como estamos en la misma carpeta, la ruta empieza por './'.
// ⚠️ ERROR COMUN: escribir `from 'almacen.js'` sin el './'. El navegador
// interpreta eso como un "bare specifier" (nombre de paquete) y falla,
// salvo que exista un import map.
// ============================================================

// TODO (en clase):
//   1. Escribe la importacion nombrada, en la PRIMERA linea de codigo:
//        import { registrarEvento, sumarContador, ID_INSTANCIA } from './almacen.js';
//      Prueba a quitarle el .js y a quitarle el ./ para que la clase vea
//      los dos errores en la consola, y despues dejalo correcto.
//   2. Debajo, la marca de evaluacion, con template literal:
//        console.log(`[validaciones.js] Modulo evaluado. Ve el almacen ${ID_INSTANCIA}.`);
//      Cuando main.js este escrito, el ID que se imprima aqui debe ser
//      EXACTAMENTE el mismo que imprime main.js. Esa es la prueba del singleton.
//   (aprox. 3 lineas)

// ============================================================
// 2. REGLAS DE CONTRASENA (configuracion exportada)
// ------------------------------------------------------------
// Sacar los "numeros magicos" a una constante con nombre hace que el
// codigo se lea solo y que cambiar una regla sea trivial.
//
// NOTA DE LA PLANTILLA: estas dos constantes son DATOS y vienen ya
// escritas. Lo que se escribe en vivo es lo que las usa.
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

// TODO (en clase):
//   1. Exporta `validarEmail(valor)`.
//   2. Normaliza: `const email = String(valor ?? '').trim().toLowerCase();`
//      El `?? ''` protege de recibir null o undefined.
//   3. Llama a `sumarContador('validacionesEmail')`: estamos escribiendo en
//      el almacen COMPARTIDO desde otro modulo.
//   4. `const problemas = [];` y ve acumulando:
//        - vacio -> 'El correo esta vacio.'
//        - si no, comprueba el patron /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/ ->
//          'El formato no parece un correo valido.'
//        - includes('..') -> 'No puede tener dos puntos seguidos.'
//        - startsWith('.') || startsWith('@') -> 'No puede empezar por punto ni por arroba.'
//        - length > 254 -> 'El correo es demasiado largo.'
//   5. Saca el dominio con destructuring de array: `const [usuario, dominio] = email.split('@');`
//   6. Construye y devuelve el objeto resultado con esta forma exacta
//      (main.js lee estas propiedades por su nombre):
//        valido: problemas.length === 0
//        email, usuario: usuario ?? null, dominio: dominio ?? null
//        extension: dominio?.split('.').at(-1) ?? null
//        problemas
//        mensaje: sin problemas -> 'Correo con formato valido.'; si no, problemas[0]
//      Comenta las dos herramientas de la linea de `extension`: el ?. corta
//      la cadena si dominio es undefined en vez de reventar al llamar a
//      .split(), y at(-1) coge el ultimo trozo.
//   7. Antes de devolver: `registrarEvento('validacion-email', { email, valido: resultado.valido });`
//   Resultado esperado con 'camila.rojas@instituto.cl':
//      valido true, usuario "camila.rojas", dominio "instituto.cl", extension "cl"
//   (aprox. 35 lineas)

// ============================================================
// 4. VALIDAR CONTRASENA
// ------------------------------------------------------------
// Devolvemos algo mas rico que un simple true/false: un puntaje de 0 a
// 100, una etiqueta de fuerza y la lista de lo que falta. Asi la
// interfaz puede pintar una barra de color y guiar al usuario.
// ============================================================

// TODO (en clase):
//   1. Exporta `validarContrasena(valor, opciones = {})`.
//   2. Mezcla la configuracion con spread: `const reglas = { ...REGLAS_CONTRASENA, ...opciones };`
//      Lo que venga en `opciones` PISA a lo de REGLAS_CONTRASENA, porque el
//      spread de la derecha se aplica despues.
//   3. `const clave = String(valor ?? '');` y `sumarContador('validacionesContrasena')`.
//   4. `const problemas = [];` y `let puntaje = 0;`
//   5. LARGO: vacia -> 'La contrasena esta vacia.'; menor que reglas.largoMinimo ->
//      `Debe tener al menos ${reglas.largoMinimo} caracteres.`; si cumple,
//      puntaje += 25 y ademas +15 si llega a reglas.largoRecomendado
//      (la longitud es, de lejos, lo que mas fortalece una contrasena).
//   6. COMPOSICION: define un array `comprobaciones` de cuatro objetos
//      { activa, patron, mensaje, puntos } — minuscula /[a-z]/, mayuscula
//      /[A-Z]/, numero /[0-9]/, simbolo /[^A-Za-z0-9]/ — todos con 15 puntos,
//      y recorrelo con `for (const { activa, patron, mensaje, puntos } of comprobaciones)`
//      desestructurando en la cabecera del bucle. Un bucle evita repetir
//      seis veces el mismo if.
//   7. LISTA NEGRA: si CONTRASENAS_PROHIBIDAS.some(...) aparece dentro de la
//      clave en minusculas -> problema + puntaje -= 30. Si /(.)\1\1/.test(clave)
//      (tres caracteres identicos seguidos) -> problema + puntaje -= 10.
//   8. Encaja el puntaje en 0-100 con Math.max(0, Math.min(100, puntaje)).
//   9. Define el array `escalas` ORDENADO DE MAYOR A MENOR:
//        85 'Muy fuerte' exito | 65 'Fuerte' exito | 45 'Aceptable' alerta
//        20 'Debil' error | 0 'Muy debil' error
//      y elige con `escalas.find((nivel) => puntaje >= nivel.desde) ?? escalas.at(-1)`.
//      Un array ordenado + find() es mas limpio que una escalera de if/else.
//  10. Devuelve { valido, puntaje, fuerza, color, largo, problemas, mensaje }.
//      `valido` es problemas.length === 0 && clave.length >= reglas.largoMinimo.
//  11. Registra el evento 'validacion-contrasena' con { puntaje, fuerza }.
//   Resultado esperado con 'FullStack2026!': fuerza "Muy fuerte", puntaje 100.
//   (aprox. 60 lineas)

// ============================================================
// 5. VALIDACIONES GENERICAS PEQUENAS
// ============================================================

// TODO (en clase):
//   1. Exporta `validarRequerido(valor, nombreCampo = 'El campo')`: recorta el
//      texto y devuelve { valido, mensaje }. Si esta vacio, el mensaje es
//      `${nombreCampo} es obligatorio.`; si no, 'Correcto.'
//   2. Exporta `validarLongitud(valor, { minimo = 0, maximo = 255, nombreCampo = 'El campo' } = {})`:
//      acumula problemas y devuelve { valido, largo, problemas, mensaje },
//      donde mensaje es `problemas[0] ?? 'Correcto.'`
//   3. Exporta `validarRango(valor, { minimo = 1, maximo = 7, nombreCampo = 'El valor' } = {})`:
//      si Number(valor) no es finito devuelve { valido: false, mensaje: `${nombreCampo} debe ser un numero.` };
//      si no, { valido, numero, mensaje }.
//   (aprox. 35 lineas las tres)

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

// TODO (en clase):
//   1. Exporta `validarFormulario(datos, reglas)`. `reglas` es un objeto
//      { campo: funcionValidadora }.
//   2. Desarma: `const pares = Object.entries(reglas);`
//   3. Ejecuta cada validador sobre su campo:
//        const resultadosPorCampo = pares.map(([campo, validador]) => [campo, validador(datos?.[campo])]);
//      Senala las dos cosas: la desestructuracion de ARRAY en los parametros
//      de la flecha, y el encadenamiento opcional con acceso por corchetes
//      `datos?.[campo]`.
//   4. Monta de vuelta: `const detalle = Object.fromEntries(resultadosPorCampo);`
//   5. Junta todos los problemas de todos los campos en una sola lista con
//      flatMap (map + flat(1) en un paso):
//        Object.values(detalle).flatMap((r) => r.problemas ?? (r.valido ? [] : [r.mensaje]))
//   6. Devuelve { valido, detalle, problemas, cantidadDeErrores }.
//   Resultado esperado en la pagina: con el correo y la clave que trae el
//   formulario por defecto, "Errores totales: 0" en el id="resultado-validacion".
//   (aprox. 20 lineas)

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
