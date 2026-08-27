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
 * ============================================================================
 */

window.TIENDA = window.TIENDA || {};

(function (TIENDA) {
  'use strict';

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
  class Producto {
    // CAMPOS PRIVADOS. El almohadilla (#) los hace inaccesibles desde fuera:
    // producto.#stock lanza un SyntaxError. Solo el código de dentro de la
    // clase puede leerlos o escribirlos.
    #stock;
    #precio;

    /**
     * El constructor recibe un OBJETO y lo desarma con destructuring.
     *
     * Ventajas sobre recibir ocho parámetros sueltos:
     *   - No hay que recordar el orden.
     *   - Se pueden poner valores por defecto uno a uno.
     *   - Al crear el objeto se lee qué es cada cosa.
     */
    constructor({
      id,
      nombre,
      categoria,
      precio,
      stock = 0,
      valoracion = 0,
      descripcion = '',
      emoji = '📦',
      colores = ['#334155', '#1e293b']
    }) {
      // ⚠️ ERROR COMÚN: crear objetos con datos inválidos y descubrirlo
      // veinte funciones más tarde. Validar EN EL CONSTRUCTOR hace que el
      // error salte en el sitio exacto donde se cometió.
      if (!id) throw new Error('Un producto necesita un id.');
      if (!nombre) throw new Error(`El producto ${id} necesita un nombre.`);

      this.id = id;
      this.nombre = nombre;
      this.categoria = categoria || 'Sin categoría';
      this.valoracion = Number(valoracion) || 0;
      this.descripcion = descripcion;
      this.emoji = emoji;
      this.colores = colores;

      // Los datos delicados van a los campos privados, filtrados antes.
      // Math.max(0, ...) impide un precio o un stock negativo.
      this.#precio = Math.max(0, Number(precio) || 0);
      this.#stock = Math.max(0, Math.trunc(Number(stock) || 0));
      // Math.trunc corta los decimales: no existen "2,5 unidades" en stock.
    }

    // ---- GETTERS -----------------------------------------------------------
    /*
      Un getter es un método que se USA COMO SI FUERA UNA PROPIEDAD:
          producto.precio     <- sin paréntesis
      Sirve para exponer un dato privado en modo solo lectura, o para
      calcular algo al vuelo. Si alguien intenta `producto.precio = 0`, no
      pasa nada (no hay setter): el precio queda protegido.
    */

    get precio() { return this.#precio; }

    get stock() { return this.#stock; }

    /** Precio ya formateado para mostrar: "89,90 €". */
    get precioFormateado() { return formatearPrecio(this.#precio); }

    /** true si queda al menos una unidad. */
    get hayStock() { return this.#stock > 0; }

    /**
     * Devuelve 'agotado', 'bajo' o 'alto'. La interfaz usa ese texto
     * directamente como clase CSS, así que el color del stock lo decide
     * esta única línea de lógica.
     */
    get estadoStock() {
      if (this.#stock === 0) return 'agotado';
      if (this.#stock <= 5) return 'bajo';
      return 'alto';
    }

    /** Texto humano del stock, listo para la tarjeta. */
    get textoStock() {
      if (this.#stock === 0) return 'Agotado';
      if (this.#stock <= 5) return `¡Solo ${this.#stock} unidades!`;
      return `${this.#stock} disponibles`;
    }

    /** El degradado CSS de la "foto" del producto, montado con una plantilla. */
    get degradado() {
      const [colorA, colorB] = this.colores;   // Destructuring de array
      return `linear-gradient(135deg, ${colorA}, ${colorB})`;
    }

    // ---- MÉTODOS -----------------------------------------------------------
    /** ¿Puedo llevarme `cantidad` unidades de este producto? */
    hayStockPara(cantidad) {
      return cantidad > 0 && cantidad <= this.#stock;
    }

    /**
     * toString() se llama SOLO cuando el objeto se usa como texto:
     *     `${producto}`  ->  "Teclado mecánico Aurora TKL (89,90 €)"
     * Es un método heredado de Object que aquí sobrescribimos: polimorfismo.
     */
    toString() {
      return `${this.nombre} (${this.precioFormateado})`;
    }

    /**
     * MÉTODO ESTÁTICO: pertenece a la CLASE, no a las instancias.
     * Se llama Producto.desdeLista(...), nunca producto.desdeLista(...).
     * Es la típica "fábrica": convierte los objetos planos que llegan del
     * servidor en instancias de verdad, con todos sus getters.
     */
    static desdeLista(listaDeObjetos) {
      return listaDeObjetos.map((objeto) => new Producto(objeto));
    }
  }

  // ==========================================================================
  // 2. CLASE LineaCarrito
  // ==========================================================================
  /*
    Una línea del carrito relaciona UN producto con UNA cantidad.
    Podríamos guardar solo { id, cantidad }, pero entonces cada vez que
    quisiéramos el subtotal habría que ir a buscar el producto al catálogo.
    Guardando el producto entero, la línea se basta sola.
  */
  class LineaCarrito {
    constructor(producto, cantidad = 1) {
      this.producto = producto;
      // La cantidad nunca puede salirse del rango 1..stock.
      this.cantidad = limitar(Math.trunc(cantidad), 1, Math.max(1, producto.stock));
    }

    /** Getter calculado: precio × cantidad, redondeado a dos decimales. */
    get subtotal() {
      return redondearDinero(this.producto.precio * this.cantidad);
    }

    get subtotalFormateado() {
      return formatearPrecio(this.subtotal);
    }

    /** ¿Se puede sumar una unidad más sin pasarse del stock? */
    get puedeSumar() {
      return this.cantidad < this.producto.stock;
    }

    /**
     * toJSON() lo llama automáticamente JSON.stringify().
     * Guardamos SOLO el id y la cantidad: el resto de datos del producto ya
     * están en el catálogo y podrían haber cambiado (precio, stock...).
     * ✅ BUENA PRÁCTICA: en el almacenamiento se guarda lo mínimo imprescindible.
     */
    toJSON() {
      return { id: this.producto.id, cantidad: this.cantidad };
    }
  }

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
  class Carrito {
    #lineas = [];        // El array real, privado.
    #suscriptores = [];  // Funciones a las que avisar cuando algo cambie.
    #tasaIva;

    constructor(tasaIva = 0.21) {
      this.#tasaIva = tasaIva;
    }

    // ---- LECTURA -----------------------------------------------------------
    /**
     * Devuelve una COPIA del array de líneas.
     * ⚠️ ERROR COMÚN: devolver this.#lineas directamente. Quien lo recibiera
     * podría hacerle push o splice y saltarse todas las reglas. El spread
     * ([...array]) crea un array nuevo con los mismos elementos.
     */
    get lineas() { return [...this.#lineas]; }

    get estaVacio() { return this.#lineas.length === 0; }

    get tasaIva() { return this.#tasaIva; }

    /**
     * Número total de unidades (no de líneas distintas).
     * reduce recorre el array acumulando un resultado. El 0 del final es el
     * valor inicial del acumulador.
     * ⚠️ ERROR COMÚN: olvidar ese 0. Con el array vacío, reduce sin valor
     * inicial lanza "Reduce of empty array with no initial value".
     */
    get cantidadTotal() {
      return this.#lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
    }

    /** Suma de todos los subtotales de línea. */
    get subtotal() {
      const total = this.#lineas.reduce((suma, linea) => suma + linea.subtotal, 0);
      return redondearDinero(total);
    }

    /** Impuesto aplicado sobre el subtotal. */
    get iva() {
      return redondearDinero(this.subtotal * this.#tasaIva);
    }

    /** Subtotal + IVA. Se apoya en los dos getters anteriores. */
    get total() {
      return redondearDinero(this.subtotal + this.iva);
    }

    /** Busca la línea de un producto. Devuelve undefined si no está. */
    buscarLinea(idProducto) {
      return this.#lineas.find((linea) => linea.producto.id === idProducto);
    }

    /** Cuántas unidades de ese producto hay ya en el carrito. */
    cantidadDe(idProducto) {
      return this.buscarLinea(idProducto)?.cantidad ?? 0;
      // ?. evita el error si buscarLinea devuelve undefined.
      // ?? pone 0 cuando el resultado es null o undefined.
    }

    // ---- ESCRITURA ---------------------------------------------------------
    /**
     * agregar(): añade un producto o suma unidades si ya estaba.
     *
     * Devuelve SIEMPRE un objeto con el resultado, nunca muestra mensajes:
     *   { ok, tipo, mensaje }
     * donde `tipo` es 'exito' | 'alerta' | 'error', que es justo lo que
     * necesita la función de toasts.
     */
    agregar(producto, cantidad = 1) {
      if (!(producto instanceof Producto)) {
        // instanceof comprueba de qué clase es un objeto.
        return { ok: false, tipo: 'error', mensaje: 'Ese producto no es válido.' };
      }

      if (!producto.hayStock) {
        return {
          ok: false,
          tipo: 'alerta',
          mensaje: `${producto.nombre} está agotado.`
        };
      }

      const linea = this.buscarLinea(producto.id);
      const cantidadActual = linea ? linea.cantidad : 0;
      const cantidadDeseada = cantidadActual + Math.trunc(cantidad);

      // CONTROL DE STOCK: la regla de negocio más importante de una tienda.
      if (cantidadDeseada > producto.stock) {
        return {
          ok: false,
          tipo: 'alerta',
          mensaje: `Solo quedan ${producto.stock} unidades de ${producto.nombre}.`
        };
      }

      if (linea) {
        linea.cantidad = cantidadDeseada;     // Ya estaba: solo sumamos
      } else {
        this.#lineas.push(new LineaCarrito(producto, cantidad));  // Línea nueva
      }

      this.#notificar('agregar');
      return {
        ok: true,
        tipo: 'exito',
        mensaje: `${producto.nombre} agregado al carrito.`
      };
    }

    /**
     * cambiarCantidad(): fija una cantidad EXACTA (no suma).
     * Si la nueva cantidad es 0 o menos, la línea desaparece: es el
     * comportamiento que espera cualquiera al pulsar "-" con una unidad.
     */
    cambiarCantidad(idProducto, nuevaCantidad) {
      const linea = this.buscarLinea(idProducto);
      if (!linea) {
        return { ok: false, tipo: 'error', mensaje: 'Ese producto no está en el carrito.' };
      }

      const cantidad = Math.trunc(Number(nuevaCantidad));

      if (cantidad <= 0) {
        return this.quitar(idProducto);
      }

      if (cantidad > linea.producto.stock) {
        return {
          ok: false,
          tipo: 'alerta',
          mensaje: `No hay más de ${linea.producto.stock} unidades de ${linea.producto.nombre}.`
        };
      }

      linea.cantidad = cantidad;
      this.#notificar('cantidad');
      return { ok: true, tipo: 'exito', mensaje: `Cantidad actualizada a ${cantidad}.` };
    }

    /**
     * quitar(): elimina la línea entera.
     * filter NO modifica el array original: devuelve uno nuevo con los que
     * cumplen la condición. Por eso reasignamos this.#lineas.
     */
    quitar(idProducto) {
      const linea = this.buscarLinea(idProducto);
      if (!linea) {
        return { ok: false, tipo: 'error', mensaje: 'Ese producto no está en el carrito.' };
      }

      this.#lineas = this.#lineas.filter((l) => l.producto.id !== idProducto);
      this.#notificar('quitar');
      return {
        ok: true,
        tipo: 'alerta',
        mensaje: `${linea.producto.nombre} eliminado del carrito.`
      };
    }

    /** vaciar(): deja el carrito a cero. */
    vaciar() {
      if (this.estaVacio) {
        return { ok: false, tipo: 'alerta', mensaje: 'El carrito ya estaba vacío.' };
      }
      this.#lineas = [];
      this.#notificar('vaciar');
      return { ok: true, tipo: 'alerta', mensaje: 'Carrito vaciado.' };
    }

    // ---- SUSCRIPCIÓN (patrón observador) -----------------------------------
    /**
     * suscribir(): registra una función que se ejecutará en cada cambio.
     * Devuelve otra función que sirve para darse de baja (closure del
     * proyecto 03: la función recuerda cuál era `callback`).
     */
    suscribir(callback) {
      if (typeof callback !== 'function') return () => {};
      this.#suscriptores.push(callback);
      return () => {
        this.#suscriptores = this.#suscriptores.filter((f) => f !== callback);
      };
    }

    /** Método PRIVADO: solo se llama desde dentro de la clase. */
    #notificar(motivo) {
      this.#suscriptores.forEach((callback) => {
        try {
          callback(this, motivo);
        } catch (error) {
          // Si un suscriptor falla, no debe tumbar a los demás.
          console.error('Fallo en un suscriptor del carrito:', error);
        }
      });
    }

    // ---- SERIALIZACIÓN -----------------------------------------------------
    /** Lo que se guardará en localStorage. Solo ids y cantidades. */
    toJSON() {
      return {
        version: 1,                       // Útil el día que cambie el formato
        actualizado: new Date().toISOString(),
        lineas: this.#lineas.map((linea) => linea.toJSON())
      };
    }

    /**
     * MÉTODO ESTÁTICO DE RECONSTRUCCIÓN.
     * Recibe lo que se guardó y el catálogo ACTUAL, y devuelve un carrito.
     *
     * Aquí está la parte que casi todo el mundo olvida: los datos guardados
     * pueden haber envejecido. Un producto puede haberse retirado del
     * catálogo, o su stock puede haber bajado. Por eso cada línea se
     * comprueba antes de aceptarla.
     */
    static desdeDatos(datosGuardados, productos, tasaIva) {
      const carrito = new Carrito(tasaIva);
      const lineas = datosGuardados?.lineas ?? [];
      let descartadas = 0;

      lineas.forEach(({ id, cantidad }) => {
        const producto = productos.find((p) => p.id === id);

        if (!producto || !producto.hayStock) {
          descartadas++;
          return;                                  // Ya no existe o está agotado
        }

        // Recortamos la cantidad al stock actual por si bajó.
        const cantidadSegura = limitar(Math.trunc(cantidad), 1, producto.stock);
        carrito.agregar(producto, cantidadSegura);
      });

      if (descartadas > 0) {
        imprimir(`[${hora()}] Se descartaron ${descartadas} línea(s) guardadas que ya no son válidas.`);
      }

      return carrito;
    }

    /** Resumen en texto plano, útil para la bitácora y para el pedido. */
    resumenTexto() {
      if (this.estaVacio) return 'Carrito vacío.';
      return this.#lineas
        .map((l) => `${l.cantidad} x ${l.producto.nombre} = ${l.subtotalFormateado}`)
        .join('\n');
    }
  }

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
  class Almacen {
    /** Comprueba de verdad si se puede escribir (no basta con `if (localStorage)`). */
    static get disponible() {
      try {
        const prueba = '__prueba__';
        window.localStorage.setItem(prueba, '1');
        window.localStorage.removeItem(prueba);
        return true;
      } catch (error) {
        return false;
      }
    }

    static guardar(clave, valor) {
      try {
        window.localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (error) {
        imprimir(`[${hora()}] No se pudo guardar en localStorage: ${error.message}`);
        return false;
      }
    }

    static leer(clave, porDefecto = null) {
      try {
        const texto = window.localStorage.getItem(clave);
        if (texto === null) return porDefecto;    // La clave no existe todavía
        return JSON.parse(texto);
      } catch (error) {
        // Si el contenido estaba corrupto lo borramos: mejor empezar limpio
        // que arrastrar un error en cada recarga.
        imprimir(`[${hora()}] Dato corrupto en localStorage, se descarta: ${error.message}`);
        try { window.localStorage.removeItem(clave); } catch (e) { /* nada */ }
        return porDefecto;
      }
    }

    static borrar(clave) {
      try {
        window.localStorage.removeItem(clave);
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  // ==========================================================================
  // 5. PUBLICACIÓN EN EL ESPACIO DE NOMBRES
  // ==========================================================================
  TIENDA.Producto = Producto;
  TIENDA.LineaCarrito = LineaCarrito;
  TIENDA.Carrito = Carrito;
  TIENDA.Almacen = Almacen;

  imprimir(
    `[${hora()}] 03-clases.js cargado. Clases disponibles: Producto, ` +
    `LineaCarrito, Carrito y Almacen. localStorage ${Almacen.disponible ? 'SÍ' : 'NO'} está disponible.`
  );
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
