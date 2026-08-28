/**
 * ============================================================================
 * ARCHIVO: js/03-clases.js
 * PROYECTO: 11 · Proyecto final integrador: tienda con carrito (TechStore)
 * ----------------------------------------------------------------------------
 * TEMAS DEL CURSO QUE SE APLICAN AQUÍ
 *   · Proyecto 08 (POO)         -> class, constructor, campos privados (#),
 *                                  getters calculados, métodos estáticos,
 *                                  encapsulamiento y validación interna.
 *   · Proyecto 04 (Arrays)      -> reduce para los totales, filter para
 *                                  quitar líneas, find para localizarlas,
 *                                  map para transformar.
 *   · Proyecto 05 (Objetos)     -> destructuring en el constructor,
 *                                  JSON.stringify / JSON.parse, toJSON().
 *   · Proyecto 03 (Funciones)   -> callbacks (el patrón de suscripción).
 *   · Proyecto 07 (Formularios) -> localStorage envuelto en una clase.
 *
 * QUÉ ES ESTE ARCHIVO
 * La LÓGICA DE NEGOCIO de la tienda: qué es un producto, qué es un carrito y
 * qué reglas debe cumplir. Igual que el archivo de datos, aquí NO se toca el
 * DOM ni una sola vez.
 *
 * LA REGLA MÁS IMPORTANTE DEL ARCHIVO
 * Las clases nunca muestran mensajes al usuario. Cuando una operación no se
 * puede hacer, el método DEVUELVE un objeto con el resultado:
 *
 *     { ok: false, tipo: 'alerta', mensaje: 'Solo quedan 3 unidades' }
 *
 * y es la interfaz (04-ui.js) quien decide si eso se pinta como un toast, un
 * texto rojo o nada. Así la misma clase Carrito serviría en una aplicación de
 * consola, en un móvil o en una web distinta.
 *
 * ÍNDICE DEL ARCHIVO
 *   1. Clase Producto.
 *   2. Clase LineaCarrito.
 *   3. Clase Carrito (el corazón del proyecto).
 *   4. Clase Almacen (envoltorio seguro de localStorage).
 *   5. Publicación en TIENDA.
 *   6. Ejercicios propuestos.
 * ----------------------------------------------------------------------------
 * ▶ PLANTILLA DE CLASE
 * Versión POR COMPLETAR. La solución está en ../../js/03-clases.js
 * Aquí se escribe TODO el código en vivo: es el archivo con más materia del
 * proyecto y el que conviene dictar más despacio.
 * ============================================================================
 */

window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';

  // Cableado con el archivo de utilidades (viene escrito). Recuerda que estos
  // nombres valdrán undefined hasta que estén escritos en 01-utilidades.js.
  const { imprimir, hora, formatearPrecio, limitar, redondearDinero } = TIENDA.utiles;

  // ==========================================================================
  // 1. CLASE Producto
  // ==========================================================================
  /*
    Un objeto plano del catálogo ya guarda los datos. ¿Para qué una clase?
    Porque un producto no es solo datos: también tiene COMPORTAMIENTO y
    REGLAS. Con una clase podemos preguntarle cosas ("¿te queda stock?",
    "¿cómo se escribe tu precio?") en lugar de repetir esos cálculos por
    toda la aplicación.

    Es el primer pilar de la POO: ENCAPSULAMIENTO. Los datos y las operaciones
    que les afectan viajan juntos.
  */
  // TODO (en clase) — ESQUELETO DE LA CLASE:
  //   1. class Producto { ... }
  //   2. Declara DOS CAMPOS PRIVADOS al principio del cuerpo: #stock y #precio.
  //      El almohadilla (#) los hace inaccesibles desde fuera:
  //      producto.#stock lanza un SyntaxError. Solo el código de dentro de la
  //      clase puede leerlos o escribirlos.
  //   (aprox. 4 líneas)

  /**
   * El constructor recibe un OBJETO y lo desarma con destructuring.
   *
   * Ventajas sobre recibir ocho parámetros sueltos:
   *   - No hay que recordar el orden.
   *   - Se pueden poner valores por defecto uno a uno.
   *   - Al crear el objeto se lee qué es cada cosa.
   */
  // TODO (en clase) — CONSTRUCTOR:
  //   1. constructor({ id, nombre, categoria, precio, stock = 0,
  //                    valoracion = 0, descripcion = '', emoji = '📦',
  //                    colores = ['#334155', '#1e293b'] }) { ... }
  //   2. Valida lo imprescindible y lanza si falta:
  //        if (!id) throw new Error('Un producto necesita un id.');
  //        if (!nombre) throw new Error(`El producto ${id} necesita un nombre.`);
  //      ⚠️ ERROR COMÚN: crear objetos con datos inválidos y descubrirlo
  //      veinte funciones más tarde. Validar EN EL CONSTRUCTOR hace que el
  //      error salte en el sitio exacto donde se cometió.
  //   3. Asigna las propiedades públicas: this.id, this.nombre,
  //      this.categoria = categoria || 'Sin categoría',
  //      this.valoracion = Number(valoracion) || 0, this.descripcion,
  //      this.emoji y this.colores.
  //   4. Los datos delicados van a los campos privados, ya filtrados:
  //        this.#precio = Math.max(0, Number(precio) || 0);
  //        this.#stock  = Math.max(0, Math.trunc(Number(stock) || 0));
  //      Math.max(0, ...) impide un precio o un stock negativo y Math.trunc
  //      corta los decimales: no existen "2,5 unidades" en stock.
  //   Prueba: imprimir(new Producto({ id: 'x', nombre: 'Prueba', precio: 10 }).nombre);
  //   Resultado esperado en pantalla: Prueba
  //   (aprox. 22 líneas)

  // ---- GETTERS -----------------------------------------------------------
  /*
    Un getter es un método que se USA COMO SI FUERA UNA PROPIEDAD:
        producto.precio     <- sin paréntesis
    Sirve para exponer un dato privado en modo solo lectura, o para
    calcular algo al vuelo. Si alguien intenta `producto.precio = 0`, no
    pasa nada (no hay setter): el precio queda protegido.
  */
  // TODO (en clase) — SIETE GETTERS dentro de la clase Producto:
  //   1. get precio()            -> devuelve this.#precio
  //   2. get stock()             -> devuelve this.#stock
  //   3. get precioFormateado()  -> formatearPrecio(this.#precio). "89,90 €"
  //   4. get hayStock()          -> this.#stock > 0
  //   5. get estadoStock()       -> 'agotado' si el stock es 0,
  //                                 'bajo' si es <= 5, 'alto' en otro caso.
  //      La interfaz usa ese texto directamente como clase CSS, así que el
  //      color del stock lo decide esta única línea de lógica.
  //   6. get textoStock()        -> 'Agotado' | `¡Solo ${this.#stock} unidades!`
  //                                 (si <= 5) | `${this.#stock} disponibles`
  //   7. get degradado()         -> desestructura const [colorA, colorB] = this.colores
  //                                 y devuelve la plantilla
  //                                 `linear-gradient(135deg, ${colorA}, ${colorB})`
  //   (aprox. 22 líneas)

  // ---- MÉTODOS -----------------------------------------------------------
  // TODO (en clase) — TRES MIEMBROS MÁS de Producto:
  //   1. hayStockPara(cantidad) -> cantidad > 0 && cantidad <= this.#stock
  //      ("¿Puedo llevarme `cantidad` unidades de este producto?")
  //   2. toString() -> `${this.nombre} (${this.precioFormateado})`
  //      toString() se llama SOLO cuando el objeto se usa como texto:
  //        `${producto}`  ->  "Teclado mecánico Aurora TKL (89,90 €)"
  //      Es un método heredado de Object que aquí sobrescribimos: polimorfismo.
  //   3. static desdeLista(listaDeObjetos) -> listaDeObjetos.map((o) => new Producto(o))
  //      MÉTODO ESTÁTICO: pertenece a la CLASE, no a las instancias. Se llama
  //      Producto.desdeLista(...), nunca producto.desdeLista(...). Es la típica
  //      "fábrica": convierte los objetos planos que llegan del servidor en
  //      instancias de verdad, con todos sus getters.
  //   (aprox. 10 líneas)

  // ==========================================================================
  // 2. CLASE LineaCarrito
  // ==========================================================================
  /*
    Una línea del carrito relaciona UN producto con UNA cantidad.
    Podríamos guardar solo { id, cantidad }, pero entonces cada vez que
    quisiéramos el subtotal habría que ir a buscar el producto al catálogo.
    Guardando el producto entero, la línea se basta sola.
  */
  // TODO (en clase) — class LineaCarrito:
  //   1. constructor(producto, cantidad = 1):
  //        this.producto = producto;
  //        this.cantidad = limitar(Math.trunc(cantidad), 1, Math.max(1, producto.stock));
  //      La cantidad nunca puede salirse del rango 1..stock.
  //   2. get subtotal()            -> redondearDinero(this.producto.precio * this.cantidad)
  //   3. get subtotalFormateado()  -> formatearPrecio(this.subtotal)
  //   4. get puedeSumar()          -> this.cantidad < this.producto.stock
  //      ("¿Se puede sumar una unidad más sin pasarse del stock?")
  //   5. toJSON() -> { id: this.producto.id, cantidad: this.cantidad }
  //      toJSON() lo llama automáticamente JSON.stringify(). Guardamos SOLO el
  //      id y la cantidad: el resto de datos del producto ya están en el
  //      catálogo y podrían haber cambiado (precio, stock...).
  //      ✅ BUENA PRÁCTICA: en el almacenamiento se guarda lo mínimo imprescindible.
  //   (aprox. 20 líneas)

  // ==========================================================================
  // 3. CLASE Carrito
  // ==========================================================================
  /*
    El corazón del proyecto. Guarda las líneas, aplica las reglas de negocio
    y calcula los totales.

    TRES IDEAS CLAVE QUE HAY QUE EXPLICAR EN CLASE:

    1) EL ARRAY DE LÍNEAS ES PRIVADO (#lineas).
       Desde fuera no se puede hacer carrito.lineas.push(...) saltándose las
       validaciones. Solo se puede tocar a través de los métodos.

    2) LOS TOTALES SON GETTERS, NO PROPIEDADES.
       No existe this.total = ... en ningún sitio. Se recalcula con reduce
       cada vez que se pide. Es imposible que quede desactualizado.

    3) EL CARRITO AVISA CUANDO CAMBIA (patrón "observador").
       Quien quiera enterarse se apunta con carrito.suscribir(funcion). El
       carrito no sabe QUIÉN escucha ni QUÉ hará: solo llama a los callbacks.
       Gracias a eso, la interfaz se redibuja y el carrito se guarda en
       localStorage sin que la clase Carrito sepa nada del DOM ni del almacén.
  */
  // TODO (en clase) — ESQUELETO Y CAMPOS PRIVADOS:
  //   1. class Carrito { ... }
  //   2. Tres campos privados con valor inicial:
  //        #lineas = [];        // El array real, privado.
  //        #suscriptores = [];  // Funciones a las que avisar cuando algo cambie.
  //        #tasaIva;
  //   3. constructor(tasaIva = 0.21) { this.#tasaIva = tasaIva; }
  //   (aprox. 8 líneas)

  // ---- LECTURA -----------------------------------------------------------
  // TODO (en clase) — GETTERS Y CONSULTAS del Carrito:
  //   1. get lineas() -> devuelve una COPIA: [...this.#lineas]
  //      ⚠️ ERROR COMÚN: devolver this.#lineas directamente. Quien lo recibiera
  //      podría hacerle push o splice y saltarse todas las reglas. El spread
  //      crea un array nuevo con los mismos elementos.
  //   2. get estaVacio()   -> this.#lineas.length === 0
  //   3. get tasaIva()     -> this.#tasaIva
  //   4. get cantidadTotal() -> this.#lineas.reduce((suma, l) => suma + l.cantidad, 0)
  //      Número total de UNIDADES, no de líneas distintas.
  //      ⚠️ ERROR COMÚN: olvidar ese 0 final. Con el array vacío, reduce sin
  //      valor inicial lanza "Reduce of empty array with no initial value".
  //   5. get subtotal() -> reduce de l.subtotal y devuelve redondearDinero(total)
  //   6. get iva()      -> redondearDinero(this.subtotal * this.#tasaIva)
  //   7. get total()    -> redondearDinero(this.subtotal + this.iva)
  //   8. buscarLinea(idProducto) -> this.#lineas.find((l) => l.producto.id === idProducto)
  //   9. cantidadDe(idProducto)  -> this.buscarLinea(idProducto)?.cantidad ?? 0
  //      ?. evita el error si buscarLinea devuelve undefined; ?? pone 0 cuando
  //      el resultado es null o undefined.
  //   (aprox. 25 líneas)

  // ---- ESCRITURA ---------------------------------------------------------
  /*
    Los métodos que MODIFICAN el carrito devuelven SIEMPRE un objeto con el
    resultado, nunca muestran mensajes:
      { ok, tipo, mensaje }
    donde `tipo` es 'exito' | 'alerta' | 'error', que es justo lo que necesita
    la función de toasts de 04-ui.js.
  */
  // TODO (en clase) — agregar(producto, cantidad = 1):
  //   1. Si !(producto instanceof Producto) devuelve
  //        { ok: false, tipo: 'error', mensaje: 'Ese producto no es válido.' }
  //      instanceof comprueba de qué clase es un objeto.
  //   2. Si !producto.hayStock devuelve
  //        { ok: false, tipo: 'alerta', mensaje: `${producto.nombre} está agotado.` }
  //   3. const linea = this.buscarLinea(producto.id);
  //      const cantidadActual = linea ? linea.cantidad : 0;
  //      const cantidadDeseada = cantidadActual + Math.trunc(cantidad);
  //   4. CONTROL DE STOCK (la regla de negocio más importante de una tienda):
  //      si cantidadDeseada > producto.stock devuelve
  //        { ok: false, tipo: 'alerta',
  //          mensaje: `Solo quedan ${producto.stock} unidades de ${producto.nombre}.` }
  //   5. Si ya había línea, actualiza linea.cantidad = cantidadDeseada;
  //      si no, this.#lineas.push(new LineaCarrito(producto, cantidad));
  //   6. Avisa con this.#notificar('agregar') y devuelve
  //        { ok: true, tipo: 'exito', mensaje: `${producto.nombre} agregado al carrito.` }
  //   (aprox. 30 líneas)

  // TODO (en clase) — cambiarCantidad(idProducto, nuevaCantidad):
  //   Fija una cantidad EXACTA (no suma).
  //   1. Busca la línea; si no existe devuelve
  //        { ok: false, tipo: 'error', mensaje: 'Ese producto no está en el carrito.' }
  //   2. const cantidad = Math.trunc(Number(nuevaCantidad));
  //   3. Si cantidad <= 0 devuelve this.quitar(idProducto). Es el comportamiento
  //      que espera cualquiera al pulsar "-" con una unidad.
  //   4. Si cantidad > linea.producto.stock devuelve
  //        { ok: false, tipo: 'alerta',
  //          mensaje: `No hay más de ${linea.producto.stock} unidades de ${linea.producto.nombre}.` }
  //   5. Asigna linea.cantidad = cantidad; llama a this.#notificar('cantidad') y
  //      devuelve { ok: true, tipo: 'exito', mensaje: `Cantidad actualizada a ${cantidad}.` }
  //   (aprox. 22 líneas)

  // TODO (en clase) — quitar(idProducto):
  //   1. Busca la línea; si no existe devuelve el mismo error que arriba.
  //   2. this.#lineas = this.#lineas.filter((l) => l.producto.id !== idProducto);
  //      filter NO modifica el array original: devuelve uno nuevo con los que
  //      cumplen la condición. Por eso se reasigna this.#lineas.
  //   3. this.#notificar('quitar') y devuelve
  //        { ok: true, tipo: 'alerta',
  //          mensaje: `${linea.producto.nombre} eliminado del carrito.` }
  //   (aprox. 12 líneas)

  // TODO (en clase) — vaciar():
  //   1. Si this.estaVacio devuelve
  //        { ok: false, tipo: 'alerta', mensaje: 'El carrito ya estaba vacío.' }
  //   2. this.#lineas = []; this.#notificar('vaciar'); y devuelve
  //        { ok: true, tipo: 'alerta', mensaje: 'Carrito vaciado.' }
  //   (aprox. 8 líneas)

  // ---- SUSCRIPCIÓN (patrón observador) -----------------------------------
  // TODO (en clase) — suscribir(callback) y #notificar(motivo):
  //   1. suscribir(callback):
  //        - si typeof callback !== 'function' devuelve () => {} (baja vacía).
  //        - this.#suscriptores.push(callback);
  //        - devuelve una función de BAJA que filtra ese callback fuera del
  //          array. Es un closure del proyecto 03: la función recuerda cuál
  //          era `callback`.
  //   2. #notificar(motivo) es un MÉTODO PRIVADO: solo se llama desde dentro
  //      de la clase. Recorre this.#suscriptores con forEach y llama a cada
  //      callback(this, motivo) dentro de un try/catch:
  //        catch (error) { console.error('Fallo en un suscriptor del carrito:', error); }
  //      Si un suscriptor falla, no debe tumbar a los demás.
  //   (aprox. 18 líneas)

  // ---- SERIALIZACIÓN -----------------------------------------------------
  // TODO (en clase) — toJSON():
  //   Devuelve lo que se guardará en localStorage. Solo ids y cantidades:
  //     { version: 1,                                  // útil el día que cambie el formato
  //       actualizado: new Date().toISOString(),
  //       lineas: this.#lineas.map((linea) => linea.toJSON()) }
  //   (aprox. 7 líneas)

  // TODO (en clase) — static desdeDatos(datosGuardados, productos, tasaIva):
  //   MÉTODO ESTÁTICO DE RECONSTRUCCIÓN. Recibe lo que se guardó y el catálogo
  //   ACTUAL, y devuelve un carrito.
  //   Aquí está la parte que casi todo el mundo olvida: los datos guardados
  //   pueden haber envejecido. Un producto puede haberse retirado del catálogo,
  //   o su stock puede haber bajado. Por eso cada línea se comprueba antes de
  //   aceptarla.
  //   1. const carrito = new Carrito(tasaIva);
  //   2. const lineas = datosGuardados?.lineas ?? [];
  //      let descartadas = 0;
  //   3. lineas.forEach(({ id, cantidad }) => { ... }):
  //        - busca el producto en `productos` con find.
  //        - si no existe o !producto.hayStock: descartadas++ y return.
  //        - const cantidadSegura = limitar(Math.trunc(cantidad), 1, producto.stock);
  //          (recorta la cantidad al stock actual por si bajó)
  //        - carrito.agregar(producto, cantidadSegura);
  //   4. Si descartadas > 0, deja rastro:
  //        imprimir(`[${hora()}] Se descartaron ${descartadas} línea(s) guardadas que ya no son válidas.`);
  //   5. Devuelve carrito.
  //   (aprox. 22 líneas)

  // TODO (en clase) — resumenTexto():
  //   Resumen en texto plano, útil para la bitácora y para el pedido.
  //   1. Si this.estaVacio devuelve 'Carrito vacío.'
  //   2. Si no, this.#lineas.map((l) => `${l.cantidad} x ${l.producto.nombre} = ${l.subtotalFormateado}`).join('\n')
  //   Resultado esperado en pantalla, con dos teclados y unos auriculares:
  //     2 x Teclado mecánico Aurora TKL = 179,80 €
  //     1 x Auriculares Estudio 700 = 129,00 €
  //   (aprox. 6 líneas)

  // ==========================================================================
  // 4. CLASE Almacen (ENVOLTORIO DE localStorage)
  // ==========================================================================
  /*
    localStorage guarda pares clave/valor en el navegador y sobrevive a los
    cierres del navegador. Tiene tres trampas que hay que conocer:

      1. SOLO GUARDA TEXTO. Un objeto hay que convertirlo con JSON.stringify
         y recuperarlo con JSON.parse.
      2. PUEDE LANZAR EXCEPCIONES: en modo incógnito, con el almacenamiento
         lleno, o al abrir la página con file:// en algunos navegadores.
      3. EL TEXTO GUARDADO PUEDE ESTAR CORRUPTO, y entonces JSON.parse falla.

    Por eso NUNCA se usa localStorage directamente por toda la aplicación:
    se envuelve una vez en una clase con try/catch y se usa siempre esa.

    Todos los métodos son ESTÁTICOS: no tiene sentido crear "un almacén",
    solo hay uno. Almacen.guardar(...), Almacen.leer(...).
  */
  // TODO (en clase) — class Almacen con CUATRO miembros estáticos:
  //   1. static get disponible():
  //        try { escribe la clave '__prueba__' con '1', bórrala y devuelve true }
  //        catch (error) { return false; }
  //      Comprueba de verdad si se puede escribir: no basta con
  //      `if (localStorage)`.
  //   2. static guardar(clave, valor):
  //        try { window.localStorage.setItem(clave, JSON.stringify(valor)); return true; }
  //        catch (error) {
  //          imprimir(`[${hora()}] No se pudo guardar en localStorage: ${error.message}`);
  //          return false;
  //        }
  //   3. static leer(clave, porDefecto = null):
  //        try { const texto = window.localStorage.getItem(clave);
  //              if (texto === null) return porDefecto;   // la clave no existe todavía
  //              return JSON.parse(texto); }
  //        catch (error) {
  //          Si el contenido estaba corrupto lo borramos: mejor empezar limpio
  //          que arrastrar un error en cada recarga.
  //          imprimir(`[${hora()}] Dato corrupto en localStorage, se descarta: ${error.message}`);
  //          try { window.localStorage.removeItem(clave); } catch (e) { /* nada */ }
  //          return porDefecto;
  //        }
  //   4. static borrar(clave): removeItem dentro de try/catch, true o false.
  //   Prueba en la consola del navegador: TIENDA.Almacen.disponible  ->  true
  //   (aprox. 45 líneas)

  // ==========================================================================
  // 5. PUBLICACIÓN EN EL ESPACIO DE NOMBRES
  // ==========================================================================
  // TODO (en clase):
  //   Cuelga las cuatro clases del espacio de nombres, una por línea:
  //     TIENDA.Producto = Producto;
  //     TIENDA.LineaCarrito = LineaCarrito;
  //     TIENDA.Carrito = Carrito;
  //     TIENDA.Almacen = Almacen;
  //   ⚠️ Estas cuatro líneas NO pueden estar escritas en la plantilla: si las
  //   clases todavía no existen, el navegador lanzaría un ReferenceError nada
  //   más abrir la página.
  //   (aprox. 4 líneas)

  // Mensaje de carga. En la solución lleva marca de tiempo con hora() y
  // consulta Almacen.disponible; aquí va simplificado porque nada de eso
  // existe todavía.
  imprimir('03-clases.js cargado (PLANTILLA). Producto, LineaCarrito, Carrito y Almacen están por escribir.');
})(window.TIENDA);


/**
 * ============================================================================
 * EJERCICIOS PROPUESTOS (archivo 03-clases.js)
 * ----------------------------------------------------------------------------
 * 1. FÁCIL. Añade a Producto un getter `esCaro` que devuelva true cuando el
 *    precio supere los 200. Úsalo para mostrar una etiqueta "Gama alta" en
 *    la tarjeta.
 *
 * 2. FÁCIL. Añade a Carrito un getter `numeroDeLineas` (líneas distintas, no
 *    unidades) y muéstralo en la cabecera del panel lateral.
 *
 * 3. MEDIO. Implementa `Carrito.aplicarCupon(codigo)` que guarde un descuento
 *    en un campo privado y haz que el getter `total` lo tenga en cuenta.
 *    Cuidado con el orden: primero descuento, después IVA.
 *
 * 4. MEDIO. Crea una subclase `ProductoDigital extends Producto` cuyo stock
 *    sea siempre infinito y cuyo `textoStock` diga "Descarga inmediata".
 *    Comprueba que el carrito la acepta sin cambiar una sola línea de Carrito
 *    (eso es POLIMORFISMO).
 *
 * 5. DIFÍCIL. Añade a Carrito un historial privado de las últimas diez
 *    operaciones (`#historial`) y un método `deshacer()` que revierta la
 *    última. Pista: guarda una copia del estado antes de cada cambio.
 *
 * 6. DIFÍCIL. Haz que Almacen guarde también la fecha de expiración: si el
 *    carrito guardado tiene más de 24 horas, que se descarte al leerlo.
 * ============================================================================
 */
