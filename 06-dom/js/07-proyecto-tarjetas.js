/**
 * ARCHIVO: js/07-proyecto-tarjetas.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * PROYECTO PRÁCTICO: GENERADOR DE TARJETAS DE PRODUCTO
 *
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Cómo se juntan TODAS las piezas de los archivos anteriores en algo
 *     que se parece a una aplicación real.
 *   - Leer los datos de un formulario y validarlos antes de usarlos.
 *   - Construir una tarjeta completa con createElement, sin innerHTML.
 *   - Insertar varias tarjetas de golpe con DocumentFragment.
 *   - Delegación de eventos para los botones de tarjetas que aún no existen.
 *   - Mantener la interfaz coherente: contador, mensaje de lista vacía...
 *
 * QUÉ APRENDERÁS
 *   - El ciclo completo: datos -> validación -> creación de nodos ->
 *     inserción -> interacción -> eliminación.
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const consola = window.Consola.crear('salida-proyecto');

  // ============================================================
  // 1. REFERENCIAS A LOS ELEMENTOS DE LA INTERFAZ
  // ============================================================

  /*
    ✅ BUENA PRÁCTICA: buscar los elementos UNA vez, al principio, y guardarlos
    en constantes. Buscar el mismo elemento dentro de cada función es trabajo
    repetido y hace el código más difícil de leer.

    Solo guardamos los que EXISTEN desde el principio en el HTML. Las tarjetas
    se crean después, así que a esas no las podemos guardar aquí.
  */

  const formulario = document.getElementById('formulario-producto');
  const campoNombre = document.getElementById('campo-nombre');
  const campoPrecio = document.getElementById('campo-precio');
  const campoCategoria = document.getElementById('campo-categoria');
  const campoColor = document.getElementById('campo-color');
  const mensajeError = document.getElementById('mensaje-error');

  const grilla = document.getElementById('grilla-productos');
  const contador = document.getElementById('contador-productos');
  const mensajeVacio = document.getElementById('mensaje-vacio');

  const btnEjemplos = document.getElementById('btn-ejemplos');
  const btnVaciar = document.getElementById('btn-vaciar');

  // Contador propio para dar un identificador único a cada producto.
  let siguienteId = 1;

  // ============================================================
  // 2. FUNCIONES DE APOYO
  // ============================================================

  /**
   * formatearPrecio(): convierte un número en un texto de precio.
   * toFixed(2) fuerza SIEMPRE dos decimales y devuelve un TEXTO:
   *     (5).toFixed(2)     -> "5.00"
   *     (49.9).toFixed(2)  -> "49.90"
   *
   * ⚠️ ERROR COMÚN: seguir haciendo cuentas con el resultado de toFixed().
   * Ya no es un número, es texto: "5.00" + 1 daría "5.001".
   *
   * @param {number} numero
   * @returns {string}
   */
  function formatearPrecio(numero) {
    return numero.toFixed(2) + ' €';
  }

  /**
   * mostrarError(): escribe un mensaje de validación bajo el formulario.
   * Si le pasamos una cadena vacía, el hueco se limpia.
   *
   * Usamos textContent: el mensaje es texto, no HTML.
   */
  function mostrarError(texto) {
    mensajeError.textContent = texto;
  }

  /**
   * actualizarInterfaz(): mantiene coherentes el contador y el mensaje de
   * "no hay productos".
   *
   * Se llama después de CUALQUIER cambio en la grilla (crear, eliminar,
   * vaciar). Centralizarlo en una función evita que se nos olvide
   * actualizar el contador en alguno de los tres sitios.
   */
  function actualizarInterfaz() {
    // children cuenta solo los elementos hijos directos: nuestras tarjetas.
    const total = grilla.children.length;

    // Operador ternario para el singular y el plural.
    contador.textContent = total + (total === 1 ? ' producto' : ' productos');

    // toggle con segundo argumento: pone la clase si la condición es true.
    // Aquí: ocultamos el mensaje cuando hay al menos un producto.
    mensajeVacio.classList.toggle('invisible', total > 0);
  }

  // ============================================================
  // 3. CONSTRUIR UNA TARJETA CON createElement
  // ============================================================

  /*
    Esta es la función central del proyecto. Recibe un objeto con los datos
    del producto y devuelve un elemento <article> completo, listo para
    insertar. Fíjate en que NO inserta nada: solo construye y devuelve.

    ¿Por qué separar "construir" de "insertar"?
      - Porque así podemos construir cien tarjetas en un fragmento y hacer
        UNA sola inserción.
      - Porque una función que hace una sola cosa es más fácil de probar
        y de entender.

    ¿Por qué createElement y no innerHTML?
      - Porque el nombre del producto lo escribe el usuario. Con textContent
        es IMPOSIBLE que ese nombre se interprete como HTML. Si un usuario
        llama a su producto <img src=x onerror=...>, aquí no pasa nada:
        se verá escrito tal cual, que es justo lo que queremos.
  */

  /**
   * crearTarjeta(): fabrica el elemento de una tarjeta de producto.
   *
   * @param {{id:number, nombre:string, precio:number, categoria:string, color:string}} producto
   * @returns {HTMLElement} el <article> ya montado (pero SIN insertar)
   */
  function crearTarjeta(producto) {
    // --- El contenedor de la tarjeta ---
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto';

    // Guardamos los datos EN el elemento con atributos data-*.
    // Así la tarjeta es autosuficiente: cualquier función que la reciba
    // puede saber a qué producto corresponde sin buscar en ninguna lista.
    tarjeta.dataset.id = producto.id;
    tarjeta.dataset.precio = producto.precio;
    tarjeta.dataset.categoria = producto.categoria;

    // El color lo elige el usuario, así que el CSS no puede saberlo:
    // este es un caso legítimo de element.style.
    tarjeta.style.borderTopColor = producto.color;

    // --- El nombre ---
    const titulo = document.createElement('h4');
    titulo.textContent = producto.nombre; // texto plano: a prueba de XSS

    // --- El precio ---
    const precio = document.createElement('p');
    precio.className = 'precio-producto';
    precio.textContent = formatearPrecio(producto.precio);

    // --- La categoría ---
    const categoria = document.createElement('span');
    categoria.className = 'categoria-producto';
    categoria.textContent = producto.categoria;

    // --- La barra de botones ---
    const acciones = document.createElement('div');
    acciones.className = 'acciones-producto';

    const btnDestacar = document.createElement('button');
    btnDestacar.type = 'button'; // ⚠️ sin esto, dentro de un form haría submit
    btnDestacar.className = 'btn-destacar';
    btnDestacar.textContent = 'Destacar';

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.textContent = 'Eliminar';

    // --- Montamos el árbol de la tarjeta ---
    // append acepta varios hijos de una vez: dos líneas en lugar de cuatro.
    acciones.append(btnDestacar, btnEliminar);
    tarjeta.append(titulo, precio, categoria, acciones);

    return tarjeta;
  }

  // ============================================================
  // 4. AÑADIR UN PRODUCTO A LA GRILLA
  // ============================================================

  /**
   * anadirProducto(): construye la tarjeta y la coloca la primera de la grilla.
   *
   * Usamos prepend (y no append) para que lo último creado aparezca arriba:
   * es lo que espera el usuario cuando acaba de dar de alta algo.
   */
  function anadirProducto(datos) {
    const producto = {
      id: siguienteId,
      nombre: datos.nombre,
      precio: datos.precio,
      categoria: datos.categoria,
      color: datos.color
    };

    siguienteId++; // el siguiente producto tendrá el número siguiente

    const tarjeta = crearTarjeta(producto);
    grilla.prepend(tarjeta);

    actualizarInterfaz();

    return producto;
  }

  // ============================================================
  // 5. VALIDAR Y ENVIAR EL FORMULARIO
  // ============================================================

  /*
    El evento 'submit' se dispara cuando se pulsa el botón de tipo submit
    o cuando se pulsa Enter dentro de un campo.

    ⚠️ ERROR COMÚN NÚMERO UNO DE LOS FORMULARIOS:
    olvidar evento.preventDefault(). Sin esa línea, el navegador recarga la
    página para "enviar" el formulario a un servidor, la tarjeta aparece
    durante una décima de segundo y desaparece. El clásico "no me funciona
    y no sale ningún error".
  */

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // cancelamos el envío tradicional

    mostrarError(''); // limpiamos errores anteriores

    // --- Leer los datos ---
    // .value SIEMPRE devuelve texto, incluso en un input type="number".
    // trim() quita los espacios sobrantes del principio y del final.
    const nombre = campoNombre.value.trim();
    const precioTexto = campoPrecio.value.trim();
    const categoria = campoCategoria.value;
    const color = campoColor.value;

    // --- Validar el nombre ---
    if (nombre === '') {
      mostrarError('El nombre del producto no puede estar vacío.');
      campoNombre.focus(); // devolvemos el cursor al campo problemático
      return;              // salimos: no seguimos con datos inválidos
    }

    if (nombre.length > 60) {
      mostrarError('El nombre no puede superar los 60 caracteres.');
      campoNombre.focus();
      return;
    }

    // --- Validar el precio ---
    // Number('') es 0 y Number('hola') es NaN. Comprobamos ambos casos.
    const precio = Number(precioTexto);

    if (precioTexto === '') {
      mostrarError('Escribe un precio.');
      campoPrecio.focus();
      return;
    }

    /*
      ⚠️ Number.isNaN es la comprobación fiable. La antigua isNaN() convierte
      antes de comprobar y da resultados sorprendentes: isNaN('') es false.

      DETALLE PARA EL DOCENTE: si en clase escribes letras en el campo de
      precio, verás el mensaje "Escribe un precio" en lugar de este. No es un
      fallo: en un <input type="number"> el navegador descarta lo que no sea
      un número y .value devuelve una cadena VACÍA. Esta comprobación sigue
      siendo imprescindible el día que el campo sea type="text" o que los
      datos lleguen de otra parte (una API, por ejemplo).
    */
    if (Number.isNaN(precio)) {
      mostrarError('El precio debe ser un número.');
      campoPrecio.focus();
      return;
    }

    if (precio < 0) {
      mostrarError('El precio no puede ser negativo.');
      campoPrecio.focus();
      return;
    }

    // --- Todo correcto: creamos la tarjeta ---
    const producto = anadirProducto({
      nombre: nombre,
      precio: precio,
      categoria: categoria,
      color: color
    });

    consola.titulo('PRODUCTO CREADO');
    consola.imprimir(producto);
    consola.imprimir('Tarjetas en la grilla ->', grilla.children.length);

    // --- Dejar el formulario listo para el siguiente ---
    formulario.reset();   // vuelve a los valores iniciales del HTML
    campoNombre.focus();  // el cursor ya está donde toca para seguir escribiendo
  });

  // ============================================================
  // 6. LOS BOTONES DE LAS TARJETAS: DELEGACIÓN
  // ============================================================

  /*
    PROBLEMA: las tarjetas no existen cuando se carga la página. No podemos
    hacer querySelectorAll('.btn-eliminar') al principio, porque no hay
    ninguno. Y añadirle un oyente a cada botón según se crea funciona, pero
    acabaríamos con cientos de oyentes.

    SOLUCIÓN: la DELEGACIÓN. Ponemos un único oyente en la grilla, que sí
    existe desde el principio. Cuando se pulsa cualquier botón de cualquier
    tarjeta, el evento burbujea hasta la grilla y allí lo atendemos.

    Las dos herramientas de la sección 6 son la clave:
      evento.target             -> dónde se pulsó exactamente
      .closest('.tarjeta-producto') -> la tarjeta completa a la que pertenece
  */

  grilla.addEventListener('click', function (evento) {
    // Localizamos la tarjeta afectada subiendo desde el punto del clic.
    const tarjeta = evento.target.closest('.tarjeta-producto');

    // Si el clic cayó en un hueco de la grilla, no hay tarjeta: salimos.
    if (!tarjeta) return;

    // --- Botón Destacar ---
    if (evento.target.matches('.btn-destacar')) {
      const destacada = tarjeta.classList.toggle('destacada-producto');

      // Cambiamos también el texto del botón para que refleje el estado.
      evento.target.textContent = destacada ? 'Quitar' : 'Destacar';

      consola.titulo('TARJETA DESTACADA');
      consola.imprimir('Producto id ->', tarjeta.dataset.id);
      consola.imprimir('¿Está destacada ahora? ->', destacada);
      consola.imprimir('Clases de la tarjeta ->', tarjeta.className);
      return;
    }

    // --- Botón Eliminar ---
    if (evento.target.matches('.btn-eliminar')) {
      // Leemos los datos ANTES de borrar: después ya no estarán en pantalla.
      const id = tarjeta.dataset.id;
      const nombre = tarjeta.querySelector('h4').textContent;

      tarjeta.remove();     // adiós al elemento
      actualizarInterfaz(); // el contador y el mensaje deben enterarse

      consola.titulo('TARJETA ELIMINADA');
      consola.imprimir('Producto eliminado ->', nombre, '(id ' + id + ')');
      consola.imprimir('Tarjetas restantes ->', grilla.children.length);
    }
  });

  // ============================================================
  // 7. CARGAR EJEMPLOS CON DocumentFragment
  // ============================================================

  /*
    Aquí aplicamos de verdad lo aprendido en el archivo 04: en lugar de
    insertar las tres tarjetas una a una en la grilla, las montamos en un
    fragmento y hacemos UNA sola inserción en el documento.

    Con tres tarjetas la diferencia es imperceptible; con trescientas, no.
    Pero la buena costumbre se coge desde el primer día.
  */

  const productosDeEjemplo = [
    { nombre: 'Teclado mecánico RGB', precio: 89.9, categoria: 'Periféricos', color: '#38bdf8' },
    { nombre: 'Monitor 27" QHD', precio: 249.0, categoria: 'Monitores', color: '#4ade80' },
    { nombre: 'Silla ergonómica Pro', precio: 319.5, categoria: 'Mobiliario', color: '#c084fc' }
  ];

  btnEjemplos.addEventListener('click', function () {
    const fragmento = document.createDocumentFragment();

    productosDeEjemplo.forEach(function (datos) {
      const producto = {
        id: siguienteId,
        nombre: datos.nombre,
        precio: datos.precio,
        categoria: datos.categoria,
        color: datos.color
      };
      siguienteId++;

      // Las tarjetas van al fragmento: el documento no se entera todavía.
      fragmento.appendChild(crearTarjeta(producto));
    });

    // UNA sola operación sobre el documento.
    grilla.prepend(fragmento);

    actualizarInterfaz();

    consola.titulo('EJEMPLOS CARGADOS');
    consola.imprimir('Se han insertado', productosDeEjemplo.length, 'tarjetas');
    consola.imprimir('con UNA sola operación sobre el documento.');
    consola.imprimir('Tarjetas en la grilla ->', grilla.children.length);
  });

  // ============================================================
  // 8. VACIAR LA GRILLA
  // ============================================================

  btnVaciar.addEventListener('click', function () {
    const cuantas = grilla.children.length;

    if (cuantas === 0) {
      consola.titulo('LA GRILLA YA ESTABA VACÍA');
      consola.imprimir('No hay nada que borrar.');
      return;
    }

    /*
      replaceChildren() sin argumentos deja el contenedor vacío.
      Alternativas equivalentes:
         grilla.innerHTML = '';
         while (grilla.firstChild) grilla.removeChild(grilla.firstChild);
      La versión con replaceChildren dice exactamente lo que hace y no
      obliga al navegador a interpretar HTML.
    */
    grilla.replaceChildren();

    actualizarInterfaz();

    consola.titulo('GRILLA VACIADA');
    consola.imprimir('Tarjetas eliminadas ->', cuantas);
    consola.imprimir('Hijos de la grilla  ->', grilla.children.length);
  });

  // ============================================================
  // 9. ESTADO INICIAL
  // ============================================================

  // Dejamos la interfaz coherente desde el primer momento: contador a cero
  // y mensaje de "no hay productos" visible.
  actualizarInterfaz();

  consola.titulo('GENERADOR DE TARJETAS LISTO');
  consola.imprimir('Rellena el formulario y pulsa "Crear tarjeta".');
  consola.imprimir('Cada tarjeta se construye con createElement, se le da');
  consola.imprimir('contenido con textContent y se inserta con prepend().');
  consola.imprimir('');
  consola.imprimir('PRUEBA RECOMENDADA EN CLASE:');
  consola.imprimir('escribe como nombre de producto  <b>Oferta</b>  y observa');
  consola.imprimir('que las etiquetas se ven como texto. Eso es textContent');
  consola.imprimir('protegiéndonos de una inyección de HTML.');
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Añade un campo "stock" al formulario y muéstralo en la tarjeta. Guárdalo
   también como data-stock. Valida que sea un número entero mayor o igual a 0.

2) Añade un botón "Ordenar por precio" que reordene las tarjetas de menor a
   mayor. Pista: Array.from(grilla.children), ordenar con sort() leyendo
   dataset.precio (convertido con Number) y reinsertar con
   grilla.append(...tarjetasOrdenadas). Recuerda que insertar un nodo que ya
   está en el árbol lo MUEVE.

3) Añade un buscador: un input que, al escribir, oculte las tarjetas cuyo
   nombre no contenga el texto. Pista: usa la clase .invisible y el evento
   'input'; compara en minúsculas con toLowerCase() e includes().

4) Muestra bajo el contador la suma total del precio de todas las tarjetas.
   Debe recalcularse al crear y al eliminar. Pista: reduce() sobre los
   dataset.precio convertidos a número.

5) Impide que se creen dos productos con el mismo nombre: si ya existe, muestra
   un error y resalta durante dos segundos la tarjeta que ya lo tenía.
   Pista: recorre las tarjetas comparando el textContent de su <h4>, y usa
   setTimeout para quitar la clase de resalte.

6) RETO: haz que las tarjetas se puedan editar. Al hacer doble clic sobre el
   nombre, sustitúyelo por un <input> con el valor actual (replaceWith); al
   pulsar Enter o al perder el foco, vuelve a poner el <h4> con el texto nuevo.
================================================================
*/
