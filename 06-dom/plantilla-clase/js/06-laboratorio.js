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
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Archivo por completar. Hasta que no se escriba el código, los botones
 *   del panel no harán nada: es lo esperado, no un error.
 *   La versión resuelta está en ../../js/06-laboratorio.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Consola visual de esta sección (viene ya escrita: es andamiaje).
  const consola = window.Consola.crear('salida-lab');

  // DATOS DE PARTIDA (vienen ya escritos: teclearlos en clase es tiempo perdido).
  // Paleta de colores del proyecto, para el botón "Cambiar el color".
  const colores = ['#38bdf8', '#4ade80', '#fbbf24', '#f87171', '#c084fc'];

  // TODO (en clase) - REFERENCIAS Y ESTADO DE PARTIDA:
  //   1. Guarda los tres elementos del laboratorio (sección 7 del HTML):
  //        const panel       = document.querySelector('.panel-lab');
  //        const escenario   = document.getElementById('escenario-lab');
  //        const visorCodigo = document.getElementById('codigo-lab');
  //   2. GUARDA UNA COPIA VIRGEN DE LA CAJA. Antes de tocar nada, clona la caja
  //      original en profundidad y apártala en una variable. NUNCA se inserta en
  //      el documento: es el "molde" para poder reiniciar el laboratorio las
  //      veces que haga falta durante la clase.
  //        const cajaOriginal = document.getElementById('caja-lab').cloneNode(true);
  //   3. Declara con let (van a cambiar) los dos contadores de estado:
  //        let contadorClones = 0;   // para dar un id único a cada clon
  //        let indiceColor = 0;      // posición actual dentro del array colores
  //   (aprox. 6 líneas)

  // ============================================================
  // 1. FUNCIONES AUXILIARES
  // ============================================================

  // TODO (en clase) - obtenerCaja():
  //   Devuelve la caja de ejemplo actual con
  //     return document.getElementById('caja-lab');
  //
  //   ¿Por qué buscarla cada vez y no guardarla en una variable al principio?
  //   Porque el botón "Reiniciar" SUSTITUYE la caja por una nueva. Si hubiéramos
  //   guardado la referencia antigua, seguiríamos apuntando a un elemento que ya
  //   no está en el documento: los cambios no se verían.
  //
  //   ⚠️ ERROR COMÚN: guardar una referencia a un elemento que después se
  //   elimina o se reemplaza. La variable sigue siendo válida en JavaScript,
  //   pero el elemento ya no está en pantalla.
  //   (aprox. 3 líneas)

  // TODO (en clase) - mostrarCodigo(linea, explicacion):
  //   Escribe en el visor la línea que se acaba de ejecutar y la repite en la
  //   consola visual:
  //     visorCodigo.textContent = linea;
  //     consola.titulo(linea);
  //     consola.imprimir(explicacion);
  //
  //   Usamos textContent (nunca innerHTML) porque el texto contiene comillas,
  //   paréntesis y signos < >, y queremos verlos tal cual.
  //   (aprox. 5 líneas)

  // TODO (en clase) - contarClones():
  //   Devuelve un array con los clones que hay ahora mismo:
  //     return Array.from(escenario.querySelectorAll('.clon'));
  //   Convertimos a array con Array.from para poder usar métodos de array.
  //   (aprox. 3 líneas)

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

  // TODO (en clase):
  //   Declara  const operaciones = { ... };  con NUEVE claves, exactamente las
  //   nueve que aparecen en los atributos data-operacion de los botones del
  //   HTML: texto, html, color, clase, atributo, clonar, antes, eliminar y
  //   reiniciar. Cada una es una function () { ... } sin parámetros.
  //   El detalle de cada una está en los bloques de abajo.
  //   (aprox. 2 líneas de apertura y cierre del objeto)

  // --- TODO: operación  texto  ------------------------------
  //   1. const caja = obtenerCaja();
  //   2. const momento = new Date().toLocaleTimeString();
  //   3. caja.textContent = 'Texto cambiado a las ' + momento;
  //   4. mostrarCodigo("caja.textContent = 'Texto cambiado a las " + momento + "';",
  //        'textContent sustituye TODO el contenido del elemento por texto plano. ' +
  //        'Si dentro había etiquetas, desaparecen.');
  //   (aprox. 8 líneas)

  // --- TODO: operación  html  -------------------------------
  //   1. const caja = obtenerCaja();
  //   2. caja.innerHTML = 'Contenido con <strong>negrita</strong> y <em>cursiva</em>';
  //   3. mostrarCodigo("caja.innerHTML = 'Contenido con <strong>negrita</strong>...';",
  //        'innerHTML interpreta el texto como marcado y crea nodos reales. ' +
  //        'Solo debe usarse con contenido que escribimos NOSOTROS, nunca con ' +
  //        'texto que venga de un usuario.');
  //   4. consola.imprimir('Hijos creados dentro de la caja ->', caja.children.length);  -> 2
  //   (aprox. 9 líneas)

  // --- TODO: operación  color  ------------------------------
  //   1. const caja = obtenerCaja();
  //   2. Recorre la paleta en círculo con el operador % (resto), que hace que el
  //      índice vuelva a 0 al llegar al final:
  //        const color = colores[indiceColor % colores.length];
  //        indiceColor++;
  //   3. caja.style.backgroundColor = color;   y   caja.style.borderColor = color;
  //   4. mostrarCodigo("caja.style.backgroundColor = '" + color + "';",
  //        'element.style escribe estilos EN LÍNEA (atributo style=""). ' +
  //        'Se reserva para valores que el CSS no puede conocer de antemano, ' +
  //        'como un color elegido por el usuario.');
  //   5. consola.imprimir('Atributo style resultante ->', caja.getAttribute('style'));
  //   (aprox. 12 líneas)

  // --- TODO: operación  clase  ------------------------------
  //   1. const caja = obtenerCaja();
  //   2. const activa = caja.classList.toggle('marcada');   // devuelve true si quedó puesta
  //   3. mostrarCodigo("caja.classList.toggle('marcada');",
  //        'La forma correcta de cambiar el aspecto: JavaScript pone o quita la ' +
  //        'clase y el CSS decide qué significa. Aquí .marcada gira la caja y ' +
  //        'le pone un halo morado, todo definido en el CSS.');
  //   4. Imprime '¿La clase ha quedado puesta? ->' con activa
  //      y 'Clases actuales ->' con caja.className.
  //   (aprox. 10 líneas)

  // --- TODO: operación  atributo  ---------------------------
  //   1. const caja = obtenerCaja();
  //   2. Lee el estado actual y altérnalo entre dos valores con un ternario:
  //        const nuevoEstado = caja.dataset.estado === 'revisado' ? 'pendiente' : 'revisado';
  //        caja.dataset.estado = nuevoEstado;
  //      (el HTML arranca con data-estado="inicial", así que el primer clic
  //       lo deja en "revisado")
  //   3. mostrarCodigo("caja.dataset.estado = '" + nuevoEstado + "';",
  //        'dataset escribe en el atributo data-estado del HTML. Sirve para ' +
  //        'guardar información pegada al elemento sin inventar variables ' +
  //        'globales. Recuerda: todo lo que sale de dataset es TEXTO.');
  //   4. Imprime 'Atributo real en el HTML ->' con caja.getAttribute('data-estado')
  //      y 'Inspecciona el elemento con F12 para verlo en el HTML.'
  //   (aprox. 12 líneas)

  // --- TODO: operación  clonar  -----------------------------
  //   1. const caja = obtenerCaja();
  //   2. const clon = caja.cloneNode(true);   // true = copia profunda
  //   3. contadorClones++;
  //   4. ⚠️ IMPRESCINDIBLE: cambiar el id del clon. Dos elementos con el mismo id
  //      es HTML inválido y getElementById solo encontraría el primero.
  //        clon.id = 'caja-lab-clon-' + contadorClones;
  //        clon.classList.add('clon');
  //        clon.textContent = 'Clon número ' + contadorClones;
  //   5. escenario.appendChild(clon);
  //   6. mostrarCodigo("const clon = caja.cloneNode(true);  escenario.appendChild(clon);",
  //        'cloneNode(true) copia el elemento y su contenido. cloneNode(false) ' +
  //        'copiaría solo la cáscara vacía. Los eventos añadidos con ' +
  //        'addEventListener NO se copian, y el id se duplica: hay que cambiarlo.');
  //   7. Imprime 'id del clon ->' con clon.id y 'Clones en el escenario ->' con
  //      contarClones().length
  //   (aprox. 16 líneas)

  // --- TODO: operación  antes  ------------------------------
  //   1. const caja = obtenerCaja();
  //   2. Crea la etiqueta nueva:
  //        const etiqueta = document.createElement('div');
  //        etiqueta.className = 'caja-lab clon';
  //        etiqueta.textContent = 'Insertado ANTES de la caja';
  //   3. before() se llama sobre el ELEMENTO DE REFERENCIA, no sobre el padre:
  //        caja.before(etiqueta);
  //        contadorClones++;
  //   4. mostrarCodigo("caja.before(nuevoElemento);",
  //        'before() coloca el elemento nuevo justo delante de la caja, como ' +
  //        'hermano suyo. Su pareja es after(). No confundir con prepend(), ' +
  //        'que inserta DENTRO del contenedor.');
  //   5. consola.imprimir('Elementos en el escenario ->', escenario.children.length);
  //   (aprox. 14 líneas)

  // --- TODO: operación  eliminar  ---------------------------
  //   1. const clones = contarClones();
  //   2. ✅ BUENA PRÁCTICA: comprobar SIEMPRE que hay algo antes de tocarlo.
  //        if (clones.length === 0) {
  //          mostrarCodigo("// No hay clones que eliminar",
  //            'No queda ningún clon en el escenario. Pulsa antes "Clonar la caja". ' +
  //            'Si hubiéramos llamado a .remove() sobre undefined, el programa ' +
  //            'se habría roto con "Cannot read properties of undefined".');
  //          return;   // salimos de la función sin hacer nada más
  //        }
  //   3. const ultimo = clones[clones.length - 1];
  //      const idEliminado = ultimo.id || '(sin id)';
  //      ultimo.remove();
  //   4. mostrarCodigo("ultimoClon.remove();",
  //        'remove() elimina el elemento del árbol. Es la forma moderna; la ' +
  //        'clásica era padre.removeChild(hijo), que además devuelve el nodo ' +
  //        'eliminado por si quieres reinsertarlo en otro sitio.');
  //   5. Imprime 'Elemento eliminado ->' con idEliminado y
  //      'Clones restantes   ->' con contarClones().length
  //   (aprox. 20 líneas)

  // --- TODO: operación  reiniciar  --------------------------
  //   1. replaceChildren() vacía el contenedor y, si le pasamos elementos, los
  //      pone como únicos hijos. Es la forma moderna y explícita de
  //      "borra todo y pon esto". Insertamos una COPIA del molde guardado al
  //      principio, para que la caja vuelva a estar exactamente como estaba al
  //      cargar la página (por eso se clona el molde, y no se inserta el molde):
  //        escenario.replaceChildren(cajaOriginal.cloneNode(true));
  //   2. Devuelve los contadores a cero:  contadorClones = 0;  indiceColor = 0;
  //   3. mostrarCodigo("escenario.replaceChildren(cajaOriginal.cloneNode(true));",
  //        'Volvemos al estado inicial. Guardamos un clon del original al ' +
  //        'arrancar la página precisamente para poder hacer esto tantas veces ' +
  //        'como haga falta durante la clase.');
  //   4. consola.imprimir('Escenario reiniciado. Hijos ->', escenario.children.length);
  //   (aprox. 12 líneas)

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

  // TODO (en clase):
  //   panel.addEventListener('click', function (evento) { ... }) y dentro:
  //     1. Busca el botón de operación más cercano al punto pulsado:
  //          const boton = evento.target.closest('button[data-operacion]');
  //     2. Si el clic fue en el título del panel o en un hueco, boton es null:
  //          if (!boton) return;
  //     3. Lee qué operación pidió ese botón:
  //          const nombre = boton.dataset.operacion;
  //     4. Busca la función correspondiente en el objeto de operaciones:
  //          const operacion = operaciones[nombre];
  //     5. ✅ BUENA PRÁCTICA: comprobar que existe ANTES de llamarla:
  //          if (typeof operacion !== 'function') {
  //            consola.imprimir('No hay ninguna operación llamada "' + nombre + '".');
  //            return;
  //          }
  //     6. operacion();   // y la ejecutamos
  //   (aprox. 14 líneas)

  // ============================================================
  // 4. MENSAJE INICIAL
  // ============================================================

  // TODO (en clase):
  //   1. consola.titulo('LABORATORIO LISTO');
  //   2. Imprime:
  //        'Botones conectados ->' , panel.querySelectorAll('button').length   -> 9
  //        'Operaciones disponibles ->' , Object.keys(operaciones)
  //        ''
  //        'Todo el panel funciona con UN solo addEventListener,'
  //        'gracias al burbujeo de eventos y a closest().'
  //   (aprox. 6 líneas)
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
