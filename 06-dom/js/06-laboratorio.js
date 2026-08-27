/**
 * ARCHIVO: js/06-laboratorio.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Un panel de demostración donde CADA botón ejecuta UNA sola
 *     operación del DOM sobre una caja de ejemplo.
 *   - La técnica de la DELEGACIÓN: un único addEventListener en el
 *     panel entero en lugar de uno por botón.
 *   - El uso combinado de dataset, closest y matches en un caso real.
 *
 * QUÉ APRENDERÁS
 *   - A explicar (y a ver) el efecto aislado de cada instrucción del DOM.
 *
 * CÓMO USARLO EN CLASE
 *   Pulsa un botón, señala la caja y lee en voz alta la línea que aparece
 *   en el recuadro "Línea ejecutada". Un botón, un concepto.
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const consola = window.Consola.crear('salida-lab');

  const panel = document.querySelector('.panel-lab');
  const escenario = document.getElementById('escenario-lab');
  const visorCodigo = document.getElementById('codigo-lab');

  /*
    GUARDAMOS UNA COPIA VIRGEN DE LA CAJA
    Antes de tocar nada, clonamos la caja original en profundidad y la
    apartamos en una variable. Nunca la insertamos en el documento: es
    nuestro "molde" para poder reiniciar el laboratorio las veces que
    haga falta durante la clase.
  */
  const cajaOriginal = document.getElementById('caja-lab').cloneNode(true);

  // Contador para dar un id único a cada clon que creemos.
  let contadorClones = 0;

  // Paleta de colores del proyecto, para el botón "Cambiar el color".
  const colores = ['#38bdf8', '#4ade80', '#fbbf24', '#f87171', '#c084fc'];
  let indiceColor = 0;

  // ============================================================
  // 1. FUNCIONES AUXILIARES
  // ============================================================

  /**
   * obtenerCaja(): devuelve la caja de ejemplo actual.
   *
   * ¿Por qué buscarla cada vez y no guardarla en una variable al principio?
   * Porque el botón "Reiniciar" SUSTITUYE la caja por una nueva. Si
   * hubiéramos guardado la referencia antigua, seguiríamos apuntando a un
   * elemento que ya no está en el documento: los cambios no se verían.
   *
   * ⚠️ ERROR COMÚN: guardar una referencia a un elemento que después se
   * elimina o se reemplaza. La variable sigue siendo válida en JavaScript,
   * pero el elemento ya no está en pantalla.
   */
  function obtenerCaja() {
    return document.getElementById('caja-lab');
  }

  /**
   * mostrarCodigo(): escribe en el visor la línea que se acaba de ejecutar
   * y la repite en la consola visual.
   *
   * Usamos textContent (nunca innerHTML) porque el texto contiene comillas,
   * paréntesis y signos < >, y queremos verlos tal cual.
   */
  function mostrarCodigo(linea, explicacion) {
    visorCodigo.textContent = linea;

    consola.titulo(linea);
    consola.imprimir(explicacion);
  }

  /**
   * contarClones(): devuelve un array con los clones que hay ahora mismo.
   * Convertimos a array con Array.from para poder usar métodos de array.
   */
  function contarClones() {
    return Array.from(escenario.querySelectorAll('.clon'));
  }

  // ============================================================
  // 2. LAS OPERACIONES, UNA POR UNA
  // ============================================================

  /*
    En vez de escribir un if/else gigante, guardamos cada operación como una
    función dentro de un OBJETO. La clave del objeto coincide con el valor
    del atributo data-operacion del botón.

    Ventaja: añadir una operación nueva es añadir un botón en el HTML y una
    función aquí. No hay que tocar nada más. Este patrón se llama a veces
    "tabla de despacho" y sustituye con elegancia a los switch enormes.
  */

  const operaciones = {

    // --- Cambiar el texto -------------------------------------
    texto: function () {
      const caja = obtenerCaja();
      const momento = new Date().toLocaleTimeString();

      caja.textContent = 'Texto cambiado a las ' + momento;

      mostrarCodigo(
        "caja.textContent = 'Texto cambiado a las " + momento + "';",
        'textContent sustituye TODO el contenido del elemento por texto plano. ' +
        'Si dentro había etiquetas, desaparecen.'
      );
    },

    // --- Insertar HTML ----------------------------------------
    html: function () {
      const caja = obtenerCaja();

      caja.innerHTML = 'Contenido con <strong>negrita</strong> y <em>cursiva</em>';

      mostrarCodigo(
        "caja.innerHTML = 'Contenido con <strong>negrita</strong>...';",
        'innerHTML interpreta el texto como marcado y crea nodos reales. ' +
        'Solo debe usarse con contenido que escribimos NOSOTROS, nunca con ' +
        'texto que venga de un usuario.'
      );

      consola.imprimir('Hijos creados dentro de la caja ->', caja.children.length);
    },

    // --- Cambiar el color -------------------------------------
    color: function () {
      const caja = obtenerCaja();

      // El operador % (resto) hace que el índice vuelva a 0 al llegar al final.
      const color = colores[indiceColor % colores.length];
      indiceColor++;

      caja.style.backgroundColor = color;
      caja.style.borderColor = color;

      mostrarCodigo(
        "caja.style.backgroundColor = '" + color + "';",
        'element.style escribe estilos EN LÍNEA (atributo style=""). ' +
        'Se reserva para valores que el CSS no puede conocer de antemano, ' +
        'como un color elegido por el usuario.'
      );

      consola.imprimir('Atributo style resultante ->', caja.getAttribute('style'));
    },

    // --- Alternar una clase -----------------------------------
    clase: function () {
      const caja = obtenerCaja();

      // toggle devuelve true si la clase quedó puesta.
      const activa = caja.classList.toggle('marcada');

      mostrarCodigo(
        "caja.classList.toggle('marcada');",
        'La forma correcta de cambiar el aspecto: JavaScript pone o quita la ' +
        'clase y el CSS decide qué significa. Aquí .marcada gira la caja y ' +
        'le pone un halo morado, todo definido en el CSS.'
      );

      consola.imprimir('¿La clase ha quedado puesta? ->', activa);
      consola.imprimir('Clases actuales ->', caja.className);
    },

    // --- Escribir un data-* -----------------------------------
    atributo: function () {
      const caja = obtenerCaja();

      // Leemos el estado actual y lo alternamos entre dos valores.
      const nuevoEstado = caja.dataset.estado === 'revisado' ? 'pendiente' : 'revisado';
      caja.dataset.estado = nuevoEstado;

      mostrarCodigo(
        "caja.dataset.estado = '" + nuevoEstado + "';",
        'dataset escribe en el atributo data-estado del HTML. Sirve para ' +
        'guardar información pegada al elemento sin inventar variables ' +
        'globales. Recuerda: todo lo que sale de dataset es TEXTO.'
      );

      consola.imprimir('Atributo real en el HTML ->',
        caja.getAttribute('data-estado'));
      consola.imprimir('Inspecciona el elemento con F12 para verlo en el HTML.');
    },

    // --- Clonar la caja ---------------------------------------
    clonar: function () {
      const caja = obtenerCaja();

      // true = copia profunda (el elemento y todo lo que lleva dentro).
      const clon = caja.cloneNode(true);

      contadorClones++;

      // ⚠️ IMPRESCINDIBLE: cambiar el id del clon.
      // Dos elementos con el mismo id es HTML inválido y getElementById
      // solo encontraría el primero.
      clon.id = 'caja-lab-clon-' + contadorClones;
      clon.classList.add('clon');
      clon.textContent = 'Clon número ' + contadorClones;

      escenario.appendChild(clon);

      mostrarCodigo(
        "const clon = caja.cloneNode(true);  escenario.appendChild(clon);",
        'cloneNode(true) copia el elemento y su contenido. cloneNode(false) ' +
        'copiaría solo la cáscara vacía. Los eventos añadidos con ' +
        'addEventListener NO se copian, y el id se duplica: hay que cambiarlo.'
      );

      consola.imprimir('id del clon ->', clon.id);
      consola.imprimir('Clones en el escenario ->', contarClones().length);
    },

    // --- Insertar antes ---------------------------------------
    antes: function () {
      const caja = obtenerCaja();

      const etiqueta = document.createElement('div');
      etiqueta.className = 'caja-lab clon';
      etiqueta.textContent = 'Insertado ANTES de la caja';

      // before() se llama sobre el elemento de referencia, no sobre el padre.
      caja.before(etiqueta);
      contadorClones++;

      mostrarCodigo(
        "caja.before(nuevoElemento);",
        'before() coloca el elemento nuevo justo delante de la caja, como ' +
        'hermano suyo. Su pareja es after(). No confundir con prepend(), ' +
        'que inserta DENTRO del contenedor.'
      );

      consola.imprimir('Elementos en el escenario ->', escenario.children.length);
    },

    // --- Eliminar el último clon ------------------------------
    eliminar: function () {
      const clones = contarClones();

      // ✅ BUENA PRÁCTICA: comprobar SIEMPRE que hay algo antes de tocarlo.
      if (clones.length === 0) {
        mostrarCodigo(
          "// No hay clones que eliminar",
          'No queda ningún clon en el escenario. Pulsa antes "Clonar la caja". ' +
          'Si hubiéramos llamado a .remove() sobre undefined, el programa ' +
          'se habría roto con "Cannot read properties of undefined".'
        );
        return; // salimos de la función sin hacer nada más
      }

      const ultimo = clones[clones.length - 1];
      const idEliminado = ultimo.id || '(sin id)';

      ultimo.remove();

      mostrarCodigo(
        "ultimoClon.remove();",
        'remove() elimina el elemento del árbol. Es la forma moderna; la ' +
        'clásica era padre.removeChild(hijo), que además devuelve el nodo ' +
        'eliminado por si quieres reinsertarlo en otro sitio.'
      );

      consola.imprimir('Elemento eliminado ->', idEliminado);
      consola.imprimir('Clones restantes   ->', contarClones().length);
    },

    // --- Reiniciar el laboratorio -----------------------------
    reiniciar: function () {
      /*
        replaceChildren() vacía el contenedor y, si le pasamos elementos,
        los pone como únicos hijos. Es la forma moderna y explícita de
        "borra todo y pon esto".

        Insertamos una copia del molde guardado al principio, para que la
        caja vuelva a estar exactamente como estaba al cargar la página.
      */
      escenario.replaceChildren(cajaOriginal.cloneNode(true));

      contadorClones = 0;
      indiceColor = 0;

      mostrarCodigo(
        "escenario.replaceChildren(cajaOriginal.cloneNode(true));",
        'Volvemos al estado inicial. Guardamos un clon del original al ' +
        'arrancar la página precisamente para poder hacer esto tantas veces ' +
        'como haga falta durante la clase.'
      );

      consola.imprimir('Escenario reiniciado. Hijos ->', escenario.children.length);
    }
  };

  // ============================================================
  // 3. DELEGACIÓN DE EVENTOS: UN SOLO OYENTE PARA TODOS LOS BOTONES
  // ============================================================

  /*
    Podríamos recorrer los nueve botones y ponerle un addEventListener a cada
    uno. Funcionaría, pero hay una técnica mejor: poner UN solo oyente en el
    panel que los contiene.

    ¿Por qué funciona? Porque los eventos BURBUJEAN: cuando pulsas un botón,
    el evento sube por sus padres hasta el documento. Escuchando arriba nos
    enteramos de todos los clics de abajo.

    Ventajas:
      - Un solo oyente en lugar de nueve (menos memoria).
      - Si mañana añadimos un botón nuevo al HTML, funciona sin tocar el JS.

    Dentro del manejador:
      evento.target        -> el elemento EXACTO donde se pulsó.
      .closest('button')   -> sube hasta el botón (por si se pulsó en un icono
                              o en el texto de dentro del botón).
  */

  panel.addEventListener('click', function (evento) {
    // Buscamos el botón de operación más cercano al punto pulsado.
    const boton = evento.target.closest('button[data-operacion]');

    // Si el clic fue en el título del panel o en un hueco, boton es null.
    if (!boton) return;

    // Leemos qué operación pidió ese botón (viene de su atributo data-operacion).
    const nombre = boton.dataset.operacion;

    // Buscamos la función correspondiente en nuestro objeto de operaciones.
    const operacion = operaciones[nombre];

    // ✅ BUENA PRÁCTICA: comprobar que existe antes de llamarla.
    if (typeof operacion !== 'function') {
      consola.imprimir('No hay ninguna operación llamada "' + nombre + '".');
      return;
    }

    operacion(); // y la ejecutamos
  });

  // ============================================================
  // 4. MENSAJE INICIAL
  // ============================================================

  consola.titulo('LABORATORIO LISTO');
  consola.imprimir('Botones conectados ->', panel.querySelectorAll('button').length);
  consola.imprimir('Operaciones disponibles ->', Object.keys(operaciones));
  consola.imprimir('');
  consola.imprimir('Todo el panel funciona con UN solo addEventListener,');
  consola.imprimir('gracias al burbujeo de eventos y a closest().');
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Añade un botón "Insertar después" que use after() en lugar de before().
   Recuerda: basta con añadir el <button data-operacion="despues"> en el HTML
   y la función despues() en el objeto operaciones.

2) Añade una operación "contar" que imprima cuántos elementos hay en el
   escenario, cuántos son clones y cuál es el texto del último.

3) Modifica la operación "eliminar" para que borre el PRIMER clon en lugar
   del último. ¿Qué método de navegación te viene mejor?

4) Añade una operación "envolver" que meta la caja dentro de un <div> nuevo
   con borde. Pista: crea el div, usa caja.before(div) y después
   div.appendChild(caja) (recuerda que insertar un nodo existente lo MUEVE).

5) RETO: haz que al pulsar sobre cualquier clon del escenario, ese clon se
   elimine. Usa delegación de eventos sobre el escenario y closest('.clon'),
   sin añadir un oyente a cada clon.
================================================================
*/
