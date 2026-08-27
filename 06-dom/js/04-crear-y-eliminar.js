/**
 * ARCHIVO: js/04-crear-y-eliminar.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Crear nodos: createElement y createTextNode.
 *   - Insertarlos: appendChild, append, prepend, before, after,
 *     insertAdjacentHTML e insertAdjacentElement.
 *   - Eliminarlos y reemplazarlos: remove, removeChild, replaceWith.
 *   - Duplicarlos: cloneNode(true) y cloneNode(false).
 *   - DocumentFragment: qué es y por qué acelera las inserciones masivas.
 *   - Medir el rendimiento real con performance.now().
 *
 * QUÉ APRENDERÁS
 *   - A construir interfaces desde cero con JavaScript, sin innerHTML.
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const consola = window.Consola.crear('salida-crear');

  const lista = document.getElementById('lista-tareas');
  const banco = document.getElementById('banco-pruebas');
  const campoCantidad = document.getElementById('campo-cantidad');
  const btnBucle = document.getElementById('btn-bucle');
  const btnFragment = document.getElementById('btn-fragment');
  const btnLimpiarBanco = document.getElementById('btn-limpiar-banco');

  // ============================================================
  // 1. CREAR UN ELEMENTO: EXISTE, PERO NO SE VE
  // ============================================================

  /*
    createElement fabrica un elemento en memoria. Ese elemento existe, tiene
    propiedades y se le puede dar contenido... pero NO está en el documento,
    así que no se ve en pantalla.

    Analogía: has montado un mueble en el taller. Hasta que no lo subes al
    salón (lo insertas en el árbol) nadie lo ve en casa.

    ⚠️ ERROR COMÚN: crear el elemento, configurarlo y olvidarse de insertarlo.
    Luego el estudiante dice "no me aparece nada" y el código es correcto:
    simplemente falta el paso de la inserción.
  */

  consola.titulo('createElement: crear sin insertar');

  const tarea1 = document.createElement('li');
  tarea1.textContent = 'Repasar los selectores del DOM';

  consola.imprimir('Elemento creado ->', tarea1);
  consola.imprimir('¿Está en el documento? ->', document.contains(tarea1), '<- todavía no');
  consola.imprimir('Su padre es ->', tarea1.parentElement, '<- null: no tiene padre');

  // ============================================================
  // 2. INSERTARLO EN EL ÁRBOL: appendChild Y append
  // ============================================================

  /*
    appendChild(nodo)  -> el método clásico. Solo acepta UN nodo y lo devuelve.
    append(...cosas)   -> moderno. Acepta VARIOS nodos y también TEXTO suelto,
                          pero no devuelve nada (undefined).

    Los dos añaden al FINAL de los hijos.
  */

  consola.titulo('appendChild y append');

  lista.appendChild(tarea1);
  consola.imprimir('Tras appendChild, ¿está en el documento? ->', document.contains(tarea1));
  consola.imprimir('Ahora su padre es ->', tarea1.parentElement);

  const tarea2 = document.createElement('li');
  tarea2.textContent = 'Practicar classList con la caja de colores';

  const tarea3 = document.createElement('li');
  tarea3.textContent = 'Crear tarjetas de producto dinámicamente';

  // append acepta varios de golpe: una sola línea en lugar de dos appendChild
  lista.append(tarea2, tarea3);
  consola.imprimir('Tras append(tarea2, tarea3), hijos de la lista ->', lista.children.length);

  // ⚠️ ERROR COMÚN: pasar texto suelto a appendChild.
  // appendChild exige un NODO; append convierte el texto en nodo de texto.
  consola.imprimir('');
  consola.imprimir('appendChild("texto") -> lanzaría un TypeError.');
  consola.imprimir('append("texto")      -> funciona: crea un nodo de texto solo.');

  // ============================================================
  // 3. createTextNode
  // ============================================================

  /*
    El texto de una página también es un nodo. createTextNode lo crea de forma
    explícita. En el día a día usarás textContent (es más corto), pero conviene
    saber que existe porque explica cómo está hecho el árbol por dentro.

    Ventaja de crear el texto como nodo: es imposible que se interprete como
    HTML. Es la vía 100% a prueba de XSS.
  */

  consola.titulo('createTextNode');

  const tarea4 = document.createElement('li');
  const textoTarea = document.createTextNode('Medir el rendimiento con DocumentFragment');
  tarea4.appendChild(textoTarea);
  lista.appendChild(tarea4);

  consola.imprimir('Nodo de texto creado ->', textoTarea.nodeValue);
  consola.imprimir('nodeType del nodo de texto ->', textoTarea.nodeType, '(3 = texto)');
  consola.imprimir('Hijos de la lista ahora ->', lista.children.length);

  // ============================================================
  // 4. prepend, before y after
  // ============================================================

  /*
    Cuatro posiciones, cuatro métodos. Fíjate en QUIÉN los llama:

      padre.prepend(nuevo)     -> primer hijo DENTRO del padre
      padre.append(nuevo)      -> último hijo DENTRO del padre
      hermano.before(nuevo)    -> justo ANTES del hermano (fuera de él)
      hermano.after(nuevo)     -> justo DESPUÉS del hermano (fuera de él)

    prepend y append se llaman sobre el CONTENEDOR.
    before y after se llaman sobre el ELEMENTO DE REFERENCIA.
  */

  consola.titulo('prepend, before y after');

  const tareaPrimera = document.createElement('li');
  tareaPrimera.textContent = 'Leer el README antes de empezar';
  lista.prepend(tareaPrimera); // se coloca la primera de la lista
  consola.imprimir('prepend -> insertado como primer hijo.');

  const tareaAntes = document.createElement('li');
  tareaAntes.textContent = 'Abrir la consola del navegador con F12';
  tareaPrimera.after(tareaAntes); // justo detrás de la primera
  consola.imprimir('after   -> insertado justo detrás del elemento de referencia.');

  const tareaFinal = document.createElement('li');
  tareaFinal.textContent = 'Guardar los cambios y recargar la página';
  tareaFinal.classList.add('completada'); // esta clase la tacha con CSS
  lista.lastElementChild.after(tareaFinal);
  consola.imprimir('Total de tareas en la lista ->', lista.children.length);

  // Comprobamos el orden final leyendo los textos
  const textos = Array.from(lista.children).map((li) => li.textContent);
  consola.imprimir('Orden actual:');
  textos.forEach((t, i) => consola.imprimir('   ' + (i + 1) + '. ' + t));

  // ============================================================
  // 5. insertAdjacentHTML e insertAdjacentElement
  // ============================================================

  /*
    insertAdjacentHTML(posicion, textoHtml) inserta marcado en una de estas
    cuatro posiciones (imagina el elemento como una caja):

        <!-- beforebegin -->
        <div>
          <!-- afterbegin -->
          contenido
          <!-- beforeend -->
        </div>
        <!-- afterend -->

    Su gran ventaja frente a innerHTML += : NO destruye ni vuelve a crear los
    elementos que ya estaban, así que los eventos ya asignados sobreviven.

    ⚠️ Sigue interpretando HTML, así que NUNCA le pases texto escrito por un
    usuario sin limpiarlo antes. Mismo riesgo de XSS que innerHTML.
  */

  consola.titulo('insertAdjacentHTML');

  lista.insertAdjacentHTML('beforeend',
    '<li>Tarea insertada con <strong>insertAdjacentHTML</strong></li>');

  consola.imprimir('Posiciones válidas: beforebegin, afterbegin, beforeend, afterend');
  consola.imprimir('Hijos de la lista tras insertar ->', lista.children.length);

  // La versión que inserta un ELEMENTO ya creado (sin interpretar HTML):
  const tareaSegura = document.createElement('li');
  tareaSegura.textContent = 'Tarea insertada con insertAdjacentElement (segura)';
  lista.insertAdjacentElement('beforeend', tareaSegura);
  consola.imprimir('insertAdjacentElement -> misma colocación, sin riesgo de XSS.');

  // ============================================================
  // 6. UN DETALLE QUE SORPRENDE: LOS NODOS SE MUEVEN, NO SE COPIAN
  // ============================================================

  /*
    Si insertas un elemento que YA está en el árbol, no se duplica:
    se MUEVE de sitio. Un nodo solo puede tener un padre a la vez.

    Esto es muy útil para reordenar listas... y muy confuso la primera vez
    que te pasa sin querer.
  */

  consola.titulo('INSERTAR UN NODO EXISTENTE LO MUEVE');

  consola.imprimir('Hijos antes ->', lista.children.length);
  lista.appendChild(tareaPrimera); // tareaPrimera ya estaba: se mueve al final
  consola.imprimir('Hijos después ->', lista.children.length, '<- el mismo número');
  consola.imprimir('La tarea que era la primera ahora es la última.');

  // La devolvemos a su sitio para dejar la lista ordenada.
  lista.prepend(tareaPrimera);

  // ============================================================
  // 7. CLONAR CON cloneNode
  // ============================================================

  /*
    cloneNode(false) -> copia SOLO el elemento (la cáscara vacía).
    cloneNode(true)  -> copia el elemento Y todo su contenido (copia profunda).

    ⚠️ ERROR COMÚN 1: olvidar el true y preguntarse por qué el clon sale vacío.
    ⚠️ ERROR COMÚN 2: el clon copia atributos y clases, INCLUIDO el id.
       Tener dos elementos con el mismo id es HTML inválido y rompe
       getElementById. Cambia siempre el id del clon.
    ⚠️ ERROR COMÚN 3: los eventos añadidos con addEventListener NO se clonan.
  */

  consola.titulo('cloneNode');

  const original = document.createElement('div');
  original.id = 'ficha-original';
  original.className = 'mini-tarjeta';
  original.innerHTML = '<h4>Ficha</h4><p>Contenido de la ficha</p>';

  const clonSuperficial = original.cloneNode(false);
  const clonProfundo = original.cloneNode(true);

  consola.imprimir('Hijos del original          ->', original.children.length);
  consola.imprimir('Hijos del clon superficial  ->', clonSuperficial.children.length, '<- vacío');
  consola.imprimir('Hijos del clon profundo     ->', clonProfundo.children.length);
  consola.imprimir('id del clon profundo        ->', clonProfundo.id, '<- ¡duplicado!');

  clonProfundo.id = 'ficha-copia';
  consola.imprimir('Corregido                   ->', clonProfundo.id);

  // ============================================================
  // 8. ELIMINAR: remove Y removeChild
  // ============================================================

  /*
    elemento.remove()          -> moderno, directo: "quítate de en medio".
    padre.removeChild(hijo)    -> clásico: el PADRE expulsa al hijo y lo devuelve.

    removeChild sigue siendo útil cuando quieres quedarte con el nodo
    eliminado para reinsertarlo en otro sitio.
  */

  consola.titulo('remove y removeChild');

  const temporal = document.createElement('li');
  temporal.textContent = 'Tarea temporal que vamos a eliminar';
  lista.appendChild(temporal);
  consola.imprimir('Hijos tras añadir la temporal ->', lista.children.length);

  temporal.remove();
  consola.imprimir('Tras temporal.remove()        ->', lista.children.length);

  // Versión clásica, que devuelve el nodo eliminado
  const otraTemporal = document.createElement('li');
  otraTemporal.textContent = 'Otra tarea temporal';
  lista.appendChild(otraTemporal);

  const eliminado = lista.removeChild(otraTemporal);
  consola.imprimir('removeChild devuelve el nodo ->', eliminado.textContent);
  consola.imprimir('¿Sigue en el documento? ->', document.contains(eliminado), '<- no');
  consola.imprimir('Pero la variable lo conserva: se puede volver a insertar.');

  // ⚠️ ERROR COMÚN: llamar a removeChild desde un elemento que NO es el padre.
  // Lanza un error de tipo NotFoundError. Con remove() esto no puede pasar.

  /*
    VACIAR UN CONTENEDOR ENTERO
    Tres formas habituales:
       contenedor.innerHTML = '';                    // corta, muy usada
       contenedor.replaceChildren();                 // moderna y explícita
       while (c.firstChild) c.removeChild(c.firstChild);  // clásica
  */
  consola.imprimir('');
  consola.imprimir('Para vaciar un contenedor: innerHTML = "" o replaceChildren().');

  // ============================================================
  // 9. REEMPLAZAR CON replaceWith
  // ============================================================

  /*
    viejo.replaceWith(nuevo) sustituye un elemento por otro en el mismo sitio.
    Acepta varios elementos e incluso texto.
  */

  consola.titulo('replaceWith');

  const aReemplazar = document.createElement('li');
  aReemplazar.textContent = 'Texto provisional';
  lista.appendChild(aReemplazar);

  const definitivo = document.createElement('li');
  definitivo.textContent = 'Tarea definitiva (creada con replaceWith)';
  definitivo.classList.add('completada');

  aReemplazar.replaceWith(definitivo);
  consola.imprimir('El elemento provisional ha sido sustituido en su misma posición.');
  consola.imprimir('Último hijo de la lista ->', lista.lastElementChild.textContent);

  // ============================================================
  // 10. DocumentFragment: EL CONTENEDOR INVISIBLE
  // ============================================================

  /*
    Cada vez que insertas un elemento en el documento, el navegador puede
    tener que recalcular posiciones y repintar (reflow y repaint). Hacerlo
    3000 veces seguidas es caro.

    Un DocumentFragment es un contenedor que vive FUERA del documento:
    metes ahí los 3000 elementos sin que el navegador repinte nada, y cuando
    lo insertas, el fragmento "se deshace" y entrega todos sus hijos de golpe.
    Resultado: UNA sola operación sobre el documento en lugar de 3000.

    Analogía: en vez de subir la compra bolsa a bolsa desde el coche, la
    metes toda en una caja y subes una vez.

    Detalle importante: al insertar el fragmento, este queda VACÍO. No se
    inserta el fragmento en sí, solo sus hijos. Por eso no aparece ninguna
    etiqueta rara en el HTML final.
  */

  consola.titulo('DocumentFragment');

  const fragmento = document.createDocumentFragment();

  for (let i = 1; i <= 3; i++) {
    const item = document.createElement('li');
    item.textContent = 'Elemento ' + i + ' llegado dentro de un fragmento';
    fragmento.appendChild(item); // no toca el documento
  }

  consola.imprimir('Hijos dentro del fragmento antes de insertar ->', fragmento.children.length);
  lista.appendChild(fragmento);  // una sola operación sobre el documento
  consola.imprimir('Hijos dentro del fragmento después          ->', fragmento.children.length, '<- se ha vaciado');
  consola.imprimir('Hijos de la lista ->', lista.children.length);

  // ============================================================
  // 11. MEDIR EL RENDIMIENTO DE VERDAD
  // ============================================================

  /*
    performance.now() devuelve un número de milisegundos con decimales desde
    que se abrió la página. Restando dos lecturas obtenemos cuánto tardó algo.
    Es más preciso que Date.now(), que solo da milisegundos enteros.

    Patrón de medición:
        const inicio = performance.now();
        ... código a medir ...
        const fin = performance.now();
        const duracion = fin - inicio;
  */

  /**
   * leerCantidad(): lee cuántos elementos quiere insertar el docente,
   * con topes de seguridad para que el navegador no se quede colgado.
   * @returns {number}
   */
  function leerCantidad() {
    // El value de un input es TEXTO: hay que convertirlo a número.
    const valor = Number(campoCantidad.value);

    // Number('') es 0 y Number('hola') es NaN: cubrimos ambos casos.
    if (!Number.isFinite(valor) || valor < 100) return 100;
    if (valor > 20000) return 20000; // tope para no bloquear el navegador

    return Math.floor(valor);
  }

  /**
   * crearEtiqueta(): fabrica un <span> con el número dentro.
   * Se usa en las dos pruebas para que la comparación sea justa: lo único
   * que cambia entre ellas es CÓMO se inserta, no QUÉ se inserta.
   */
  function crearEtiqueta(numero) {
    const span = document.createElement('span');
    span.textContent = numero;
    return span;
  }

  // --- PRUEBA A: insertar uno a uno directamente en el documento ---
  btnBucle.addEventListener('click', function () {
    const cantidad = leerCantidad();
    banco.textContent = ''; // vaciamos el banco de pruebas

    const inicio = performance.now();

    for (let i = 1; i <= cantidad; i++) {
      banco.appendChild(crearEtiqueta(i)); // toca el documento en CADA vuelta
    }

    const duracion = performance.now() - inicio;

    consola.titulo('PRUEBA A: insertar uno a uno');
    consola.imprimir('Elementos insertados ->', cantidad);
    consola.imprimir('Operaciones sobre el documento ->', cantidad);
    consola.imprimir('Tiempo -> ' + duracion.toFixed(2) + ' ms');
  });

  // --- PRUEBA B: insertar todo de una vez con DocumentFragment ---
  btnFragment.addEventListener('click', function () {
    const cantidad = leerCantidad();
    banco.textContent = '';

    const inicio = performance.now();

    const trozo = document.createDocumentFragment();
    for (let i = 1; i <= cantidad; i++) {
      trozo.appendChild(crearEtiqueta(i)); // fuera del documento: gratis
    }
    banco.appendChild(trozo); // UNA sola operación sobre el documento

    const duracion = performance.now() - inicio;

    consola.titulo('PRUEBA B: DocumentFragment');
    consola.imprimir('Elementos insertados ->', cantidad);
    consola.imprimir('Operaciones sobre el documento -> 1');
    consola.imprimir('Tiempo -> ' + duracion.toFixed(2) + ' ms');
    consola.imprimir('');
    consola.imprimir('Compara este número con el de la prueba A.');
    consola.imprimir('Ejecuta cada prueba dos o tres veces: la primera siempre');
    consola.imprimir('sale peor porque el navegador aún está "calentando".');
  });

  btnLimpiarBanco.addEventListener('click', function () {
    banco.textContent = '';
    consola.titulo('BANCO DE PRUEBAS VACIADO');
    consola.imprimir('Hijos del banco ->', banco.children.length);
  });

  /*
    MATIZ HONESTO PARA EL DOCENTE
    En navegadores modernos la diferencia puede ser pequeña, porque el motor
    agrupa el repintado de forma inteligente. La diferencia se dispara cuando
    dentro del bucle se LEEN medidas (offsetHeight, getBoundingClientRect...),
    porque eso obliga al navegador a recalcular al instante: es el famoso
    "layout thrashing". El fragmento sigue siendo la práctica correcta.
  */
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Añade a la lista de tareas tres elementos nuevos usando tres métodos
   distintos: append, prepend e insertAdjacentElement.

2) Escribe una función  crearTarea(texto, completada)  que devuelva un <li>
   con el texto indicado y, si completada es true, con la clase "completada".
   Úsala en un bucle para insertar cinco tareas de golpe con un fragmento.

3) Modifica la prueba de rendimiento para que, dentro del bucle, se lea
   banco.offsetHeight en cada vuelta. Vuelve a medir. ¿Qué ha pasado con el
   tiempo? Explica por qué (busca "layout thrashing").

4) Crea un botón que duplique la última tarea de la lista usando cloneNode(true)
   y le añada el texto " (copia)" al final.

5) RETO: escribe una función  vaciar(contenedor)  y compara tres implementaciones
   midiendo con performance.now(): innerHTML = '', replaceChildren() y un bucle
   while con removeChild. Prueba con 5000 hijos y comenta los resultados.
================================================================
*/
