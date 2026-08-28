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
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Archivo por completar. Hasta que no se escriba el código, el formulario
 *   no creará nada y la grilla se quedará vacía: es lo esperado.
 *   La versión resuelta está en ../../js/07-proyecto-tarjetas.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Consola visual de esta sección (viene ya escrita: es andamiaje).
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

  // TODO (en clase):
  //   1. Guarda las seis referencias del formulario:
  //        const formulario     = document.getElementById('formulario-producto');
  //        const campoNombre    = document.getElementById('campo-nombre');
  //        const campoPrecio    = document.getElementById('campo-precio');
  //        const campoCategoria = document.getElementById('campo-categoria');
  //        const campoColor     = document.getElementById('campo-color');
  //        const mensajeError   = document.getElementById('mensaje-error');
  //   2. Guarda las tres de la zona de la grilla:
  //        const grilla        = document.getElementById('grilla-productos');
  //        const contador      = document.getElementById('contador-productos');
  //        const mensajeVacio  = document.getElementById('mensaje-vacio');
  //   3. Guarda los dos botones auxiliares:
  //        const btnEjemplos = document.getElementById('btn-ejemplos');
  //        const btnVaciar   = document.getElementById('btn-vaciar');
  //   4. Y un contador propio, con let porque va a cambiar, para dar un
  //      identificador único a cada producto:
  //        let siguienteId = 1;
  //   (aprox. 12 líneas)

  // ============================================================
  // 2. FUNCIONES DE APOYO
  // ============================================================

  // TODO (en clase) - formatearPrecio(numero):
  //   Convierte un número en un texto de precio:
  //     return numero.toFixed(2) + ' €';
  //   toFixed(2) fuerza SIEMPRE dos decimales y devuelve un TEXTO:
  //       (5).toFixed(2)     -> "5.00"
  //       (49.9).toFixed(2)  -> "49.90"
  //   ⚠️ ERROR COMÚN: seguir haciendo cuentas con el resultado de toFixed().
  //   Ya no es un número, es texto: "5.00" + 1 daría "5.001".
  //   (aprox. 3 líneas)

  // TODO (en clase) - mostrarError(texto):
  //   Escribe un mensaje de validación bajo el formulario:
  //     mensajeError.textContent = texto;
  //   Si le pasamos una cadena vacía, el hueco se limpia.
  //   Usamos textContent: el mensaje es texto, no HTML.
  //   (aprox. 3 líneas)

  // TODO (en clase) - actualizarInterfaz():
  //   Mantiene coherentes el contador y el mensaje de "no hay productos".
  //   Se llama después de CUALQUIER cambio en la grilla (crear, eliminar,
  //   vaciar). Centralizarlo en una función evita que se nos olvide actualizar
  //   el contador en alguno de los tres sitios.
  //     1. const total = grilla.children.length;   // solo los hijos directos: las tarjetas
  //     2. Operador ternario para el singular y el plural:
  //          contador.textContent = total + (total === 1 ? ' producto' : ' productos');
  //     3. toggle con segundo argumento: pone la clase si la condición es true.
  //        Aquí ocultamos el mensaje cuando hay al menos un producto:
  //          mensajeVacio.classList.toggle('invisible', total > 0);
  //   Resultado esperado en pantalla: el contador dice "0 productos" / "1 producto".
  //   (aprox. 5 líneas)

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

  // TODO (en clase) - crearTarjeta(producto):
  //   Recibe un objeto {id, nombre, precio, categoria, color} y devuelve un
  //   <article> ya montado pero SIN insertar.
  //     1. EL CONTENEDOR:
  //          const tarjeta = document.createElement('article');
  //          tarjeta.className = 'tarjeta-producto';
  //     2. Guarda los datos EN el elemento con atributos data-*. Así la tarjeta
  //        es autosuficiente: cualquier función que la reciba sabe a qué
  //        producto corresponde sin buscar en ninguna lista.
  //          tarjeta.dataset.id        = producto.id;
  //          tarjeta.dataset.precio    = producto.precio;
  //          tarjeta.dataset.categoria = producto.categoria;
  //     3. El color lo elige el usuario, así que el CSS no puede saberlo: este
  //        es un caso LEGÍTIMO de element.style.
  //          tarjeta.style.borderTopColor = producto.color;
  //     4. EL NOMBRE: un <h4> con  titulo.textContent = producto.nombre;
  //        (texto plano: a prueba de XSS)
  //     5. EL PRECIO: un <p> con class 'precio-producto' y
  //          precio.textContent = formatearPrecio(producto.precio);
  //     6. LA CATEGORÍA: un <span> con class 'categoria-producto' y
  //          categoria.textContent = producto.categoria;
  //     7. LA BARRA DE BOTONES: un <div> con class 'acciones-producto' que
  //        contenga dos <button>:
  //          btnDestacar -> type 'button', class 'btn-destacar', texto 'Destacar'
  //          btnEliminar -> type 'button', class 'btn-eliminar', texto 'Eliminar'
  //        ⚠️ sin el type='button', dentro de un <form> harían submit.
  //     8. MONTA EL ÁRBOL con append, que acepta varios hijos de una vez:
  //          acciones.append(btnDestacar, btnEliminar);
  //          tarjeta.append(titulo, precio, categoria, acciones);
  //     9. return tarjeta;
  //   (aprox. 26 líneas)

  // ============================================================
  // 4. AÑADIR UN PRODUCTO A LA GRILLA
  // ============================================================

  // TODO (en clase) - anadirProducto(datos):
  //   Construye la tarjeta y la coloca la PRIMERA de la grilla.
  //   Usamos prepend (y no append) para que lo último creado aparezca arriba:
  //   es lo que espera el usuario cuando acaba de dar de alta algo.
  //     1. Monta el objeto producto añadiéndole el id:
  //          const producto = {
  //            id: siguienteId,
  //            nombre: datos.nombre,
  //            precio: datos.precio,
  //            categoria: datos.categoria,
  //            color: datos.color
  //          };
  //     2. siguienteId++;   // el siguiente producto tendrá el número siguiente
  //     3. const tarjeta = crearTarjeta(producto);
  //        grilla.prepend(tarjeta);
  //     4. actualizarInterfaz();
  //     5. return producto;
  //   (aprox. 14 líneas)

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

  // TODO (en clase):
  //   formulario.addEventListener('submit', function (evento) { ... }) y dentro:
  //     1. evento.preventDefault();   // cancelamos el envío tradicional
  //        mostrarError('');          // limpiamos errores anteriores
  //     2. LEER LOS DATOS. .value SIEMPRE devuelve texto, incluso en un
  //        input type="number". trim() quita los espacios de los extremos:
  //          const nombre      = campoNombre.value.trim();
  //          const precioTexto = campoPrecio.value.trim();
  //          const categoria   = campoCategoria.value;
  //          const color       = campoColor.value;
  //     3. VALIDAR EL NOMBRE. Si está vacío: mostrarError('El nombre del producto
  //        no puede estar vacío.'), campoNombre.focus() para devolver el cursor
  //        al campo problemático, y return para no seguir con datos inválidos.
  //        Si nombre.length > 60: 'El nombre no puede superar los 60 caracteres.'
  //     4. VALIDAR EL PRECIO.  const precio = Number(precioTexto);
  //        - Si precioTexto === '' -> 'Escribe un precio.' + focus + return
  //        - Si Number.isNaN(precio) -> 'El precio debe ser un número.'
  //          ⚠️ Number.isNaN es la comprobación fiable. La antigua isNaN()
  //          convierte antes de comprobar y da resultados sorprendentes:
  //          isNaN('') es false.
  //          DETALLE PARA EL DOCENTE: si en clase escribes letras en el campo de
  //          precio, verás el mensaje "Escribe un precio" en lugar de este. No es
  //          un fallo: en un <input type="number"> el navegador descarta lo que no
  //          sea un número y .value devuelve una cadena VACÍA. Esta comprobación
  //          sigue siendo imprescindible el día que el campo sea type="text" o que
  //          los datos lleguen de otra parte (una API, por ejemplo).
  //        - Si precio < 0 -> 'El precio no puede ser negativo.'
  //     5. TODO CORRECTO: crea la tarjeta
  //          const producto = anadirProducto({ nombre, precio, categoria, color });
  //        (en la solución las propiedades van escritas a la larga:
  //         nombre: nombre, precio: precio, ...)
  //        y registra en consola:
  //          consola.titulo('PRODUCTO CREADO');
  //          consola.imprimir(producto);
  //          consola.imprimir('Tarjetas en la grilla ->', grilla.children.length);
  //     6. DEJAR EL FORMULARIO LISTO PARA EL SIGUIENTE:
  //          formulario.reset();    // vuelve a los valores iniciales del HTML
  //          campoNombre.focus();   // el cursor ya está donde toca
  //   (aprox. 44 líneas)

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

  // TODO (en clase):
  //   grilla.addEventListener('click', function (evento) { ... }) y dentro:
  //     1. Localiza la tarjeta afectada subiendo desde el punto del clic:
  //          const tarjeta = evento.target.closest('.tarjeta-producto');
  //          if (!tarjeta) return;   // el clic cayó en un hueco de la grilla
  //     2. BOTÓN DESTACAR:  if (evento.target.matches('.btn-destacar')) { ... }
  //          const destacada = tarjeta.classList.toggle('destacada-producto');
  //          evento.target.textContent = destacada ? 'Quitar' : 'Destacar';
  //          consola.titulo('TARJETA DESTACADA');
  //          'Producto id ->' , tarjeta.dataset.id
  //          '¿Está destacada ahora? ->' , destacada
  //          'Clases de la tarjeta ->' , tarjeta.className
  //          return;
  //     3. BOTÓN ELIMINAR:  if (evento.target.matches('.btn-eliminar')) { ... }
  //        Lee los datos ANTES de borrar, porque después ya no estarán:
  //          const id = tarjeta.dataset.id;
  //          const nombre = tarjeta.querySelector('h4').textContent;
  //          tarjeta.remove();       // adiós al elemento
  //          actualizarInterfaz();   // el contador y el mensaje deben enterarse
  //          consola.titulo('TARJETA ELIMINADA');
  //          'Producto eliminado ->' , nombre , '(id ' + id + ')'
  //          'Tarjetas restantes ->' , grilla.children.length
  //   (aprox. 26 líneas)

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

  // DATOS DE PARTIDA (vienen ya escritos: teclearlos en clase es tiempo perdido).
  const productosDeEjemplo = [
    { nombre: 'Teclado mecánico RGB', precio: 89.9, categoria: 'Periféricos', color: '#38bdf8' },
    { nombre: 'Monitor 27" QHD', precio: 249.0, categoria: 'Monitores', color: '#4ade80' },
    { nombre: 'Silla ergonómica Pro', precio: 319.5, categoria: 'Mobiliario', color: '#c084fc' }
  ];

  // TODO (en clase):
  //   btnEjemplos.addEventListener('click', function () { ... }) y dentro:
  //     1. const fragmento = document.createDocumentFragment();
  //     2. productosDeEjemplo.forEach(function (datos) { ... }) y dentro del
  //        forEach monta el objeto producto con su id (igual que en
  //        anadirProducto), incrementa siguienteId y añade la tarjeta AL
  //        FRAGMENTO, no a la grilla:
  //          fragmento.appendChild(crearTarjeta(producto));
  //        (el documento no se entera todavía)
  //     3. UNA sola operación sobre el documento:  grilla.prepend(fragmento);
  //     4. actualizarInterfaz();
  //     5. consola.titulo('EJEMPLOS CARGADOS') y luego:
  //          'Se han insertado' , productosDeEjemplo.length , 'tarjetas'
  //          'con UNA sola operación sobre el documento.'
  //          'Tarjetas en la grilla ->' , grilla.children.length
  //   Resultado esperado en pantalla: tres tarjetas y el contador en "3 productos".
  //   (aprox. 22 líneas)

  // ============================================================
  // 8. VACIAR LA GRILLA
  // ============================================================

  // TODO (en clase):
  //   btnVaciar.addEventListener('click', function () { ... }) y dentro:
  //     1. const cuantas = grilla.children.length;
  //     2. Si ya estaba vacía, avisa y sal:
  //          if (cuantas === 0) {
  //            consola.titulo('LA GRILLA YA ESTABA VACÍA');
  //            consola.imprimir('No hay nada que borrar.');
  //            return;
  //          }
  //     3. replaceChildren() sin argumentos deja el contenedor vacío:
  //          grilla.replaceChildren();
  //        Alternativas equivalentes:
  //          grilla.innerHTML = '';
  //          while (grilla.firstChild) grilla.removeChild(grilla.firstChild);
  //        La versión con replaceChildren dice exactamente lo que hace y no
  //        obliga al navegador a interpretar HTML.
  //     4. actualizarInterfaz();
  //     5. consola.titulo('GRILLA VACIADA') y luego:
  //          'Tarjetas eliminadas ->' , cuantas
  //          'Hijos de la grilla  ->' , grilla.children.length   -> 0
  //   (aprox. 18 líneas)

  // ============================================================
  // 9. ESTADO INICIAL
  // ============================================================

  // TODO (en clase):
  //   1. Deja la interfaz coherente desde el primer momento: contador a cero y
  //      mensaje de "no hay productos" visible. Basta con llamar una vez a
  //        actualizarInterfaz();
  //   2. consola.titulo('GENERADOR DE TARJETAS LISTO') y luego estas líneas:
  //        'Rellena el formulario y pulsa "Crear tarjeta".'
  //        'Cada tarjeta se construye con createElement, se le da'
  //        'contenido con textContent y se inserta con prepend().'
  //        ''
  //        'PRUEBA RECOMENDADA EN CLASE:'
  //        'escribe como nombre de producto  <b>Oferta</b>  y observa'
  //        'que las etiquetas se ven como texto. Eso es textContent'
  //        'protegiéndonos de una inyección de HTML.'
  //   (aprox. 10 líneas)
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
