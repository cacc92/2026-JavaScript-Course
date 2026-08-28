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
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Archivo por completar. Los separadores de sección y la prosa están
 *   colocados; el código se escribe en vivo siguiendo los "TODO (en clase)".
 *   La versión resuelta está en ../../js/04-crear-y-eliminar.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Consola visual de esta sección (viene ya escrita: es andamiaje).
  const consola = window.Consola.crear('salida-crear');

  // TODO (en clase) - REFERENCIAS DE PARTIDA:
  //   Guarda los seis elementos de la sección 5 del HTML:
  //     const lista           = document.getElementById('lista-tareas');
  //     const banco           = document.getElementById('banco-pruebas');
  //     const campoCantidad   = document.getElementById('campo-cantidad');
  //     const btnBucle        = document.getElementById('btn-bucle');
  //     const btnFragment     = document.getElementById('btn-fragment');
  //     const btnLimpiarBanco = document.getElementById('btn-limpiar-banco');
  //   (aprox. 6 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('createElement: crear sin insertar');
  //   2. Crea la primera tarea SIN insertarla (se inserta en la sección 2):
  //        const tarea1 = document.createElement('li');
  //        tarea1.textContent = 'Repasar los selectores del DOM';
  //   3. Demuestra que existe pero no está en el árbol:
  //        'Elemento creado ->' , tarea1
  //        '¿Está en el documento? ->' , document.contains(tarea1) , '<- todavía no'
  //        'Su padre es ->' , tarea1.parentElement , '<- null: no tiene padre'
  //   Resultado esperado en pantalla: la lista de tareas sigue VACÍA.
  //   (aprox. 6 líneas)

  // ============================================================
  // 2. INSERTARLO EN EL ÁRBOL: appendChild Y append
  // ============================================================

  /*
    appendChild(nodo)  -> el método clásico. Solo acepta UN nodo y lo devuelve.
    append(...cosas)   -> moderno. Acepta VARIOS nodos y también TEXTO suelto,
                          pero no devuelve nada (undefined).

    Los dos añaden al FINAL de los hijos.
  */

  // TODO (en clase):
  //   1. consola.titulo('appendChild y append');
  //   2. Inserta la tarea1:  lista.appendChild(tarea1);
  //      e imprime otra vez las dos comprobaciones, que ahora cambian:
  //        'Tras appendChild, ¿está en el documento? ->' , document.contains(tarea1)  -> true
  //        'Ahora su padre es ->' , tarea1.parentElement                              -> <ul#lista-tareas.lista>
  //   3. Crea dos tareas más (mismo patrón que tarea1):
  //        tarea2 -> 'Practicar classList con la caja de colores'
  //        tarea3 -> 'Crear tarjetas de producto dinámicamente'
  //      e insértalas DE GOLPE:  lista.append(tarea2, tarea3);
  //      Imprime 'Tras append(tarea2, tarea3), hijos de la lista ->' con
  //      lista.children.length   -> 3
  //   4. ⚠️ ERROR COMÚN: pasar texto suelto a appendChild. Imprime una línea en
  //      blanco y estas dos:
  //        'appendChild("texto") -> lanzaría un TypeError.'
  //        'append("texto")      -> funciona: crea un nodo de texto solo.'
  //   (aprox. 12 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('createTextNode');
  //   2. Monta la cuarta tarea en dos piezas separadas:
  //        const tarea4 = document.createElement('li');
  //        const textoTarea = document.createTextNode('Medir el rendimiento con DocumentFragment');
  //        tarea4.appendChild(textoTarea);
  //        lista.appendChild(tarea4);
  //   3. Imprime:
  //        'Nodo de texto creado ->' , textoTarea.nodeValue
  //        'nodeType del nodo de texto ->' , textoTarea.nodeType , '(3 = texto)'
  //        'Hijos de la lista ahora ->' , lista.children.length     -> 4
  //   (aprox. 7 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('prepend, before y after');
  //   2. tareaPrimera -> 'Leer el README antes de empezar', insertada con
  //        lista.prepend(tareaPrimera);   // se coloca la primera de la lista
  //      Imprime 'prepend -> insertado como primer hijo.'
  //      (guarda la variable: se reutiliza en la sección 6)
  //   3. tareaAntes -> 'Abrir la consola del navegador con F12', insertada con
  //        tareaPrimera.after(tareaAntes);   // justo detrás de la primera
  //      Imprime 'after   -> insertado justo detrás del elemento de referencia.'
  //   4. tareaFinal -> 'Guardar los cambios y recargar la página'. Añádele la
  //      clase que la tacha:  tareaFinal.classList.add('completada');
  //      e insértala con  lista.lastElementChild.after(tareaFinal);
  //      Imprime 'Total de tareas en la lista ->' con lista.children.length  -> 7
  //   5. Comprueba el orden final leyendo los textos:
  //        const textos = Array.from(lista.children).map((li) => li.textContent);
  //        consola.imprimir('Orden actual:');
  //        textos.forEach((t, i) => consola.imprimir('   ' + (i + 1) + '. ' + t));
  //   (aprox. 16 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('insertAdjacentHTML');
  //   2. Inserta marcado real al final de la lista:
  //        lista.insertAdjacentHTML('beforeend',
  //          '<li>Tarea insertada con <strong>insertAdjacentHTML</strong></li>');
  //      e imprime:
  //        'Posiciones válidas: beforebegin, afterbegin, beforeend, afterend'
  //        'Hijos de la lista tras insertar ->' , lista.children.length   -> 8
  //   3. La versión que inserta un ELEMENTO ya creado (sin interpretar HTML):
  //        const tareaSegura = document.createElement('li');
  //        tareaSegura.textContent = 'Tarea insertada con insertAdjacentElement (segura)';
  //        lista.insertAdjacentElement('beforeend', tareaSegura);
  //      Imprime 'insertAdjacentElement -> misma colocación, sin riesgo de XSS.'
  //   (aprox. 9 líneas)

  // ============================================================
  // 6. UN DETALLE QUE SORPRENDE: LOS NODOS SE MUEVEN, NO SE COPIAN
  // ============================================================

  /*
    Si insertas un elemento que YA está en el árbol, no se duplica:
    se MUEVE de sitio. Un nodo solo puede tener un padre a la vez.

    Esto es muy útil para reordenar listas... y muy confuso la primera vez
    que te pasa sin querer.
  */

  // TODO (en clase):
  //   1. consola.titulo('INSERTAR UN NODO EXISTENTE LO MUEVE');
  //   2. Imprime 'Hijos antes ->' con lista.children.length.
  //   3. Vuelve a insertar un elemento QUE YA ESTABA:
  //        lista.appendChild(tareaPrimera);   // se mueve al final, no se duplica
  //      Imprime 'Hijos después ->' con lista.children.length y la coletilla
  //      '<- el mismo número', y luego
  //      'La tarea que era la primera ahora es la última.'
  //   4. Devuélvela a su sitio para dejar la lista ordenada:
  //        lista.prepend(tareaPrimera);
  //   (aprox. 6 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('cloneNode');
  //   2. Monta el elemento original (nunca se inserta: es solo para clonar):
  //        const original = document.createElement('div');
  //        original.id = 'ficha-original';
  //        original.className = 'mini-tarjeta';
  //        original.innerHTML = '<h4>Ficha</h4><p>Contenido de la ficha</p>';
  //   3. Haz los dos clones:
  //        const clonSuperficial = original.cloneNode(false);
  //        const clonProfundo    = original.cloneNode(true);
  //   4. Imprime la comparación:
  //        'Hijos del original          ->' , original.children.length         -> 2
  //        'Hijos del clon superficial  ->' , clonSuperficial.children.length , '<- vacío'   -> 0
  //        'Hijos del clon profundo     ->' , clonProfundo.children.length     -> 2
  //        'id del clon profundo        ->' , clonProfundo.id , '<- ¡duplicado!'
  //   5. Corrige el id:  clonProfundo.id = 'ficha-copia';
  //      e imprime 'Corregido                   ->' con clonProfundo.id
  //   (aprox. 12 líneas)

  // ============================================================
  // 8. ELIMINAR: remove Y removeChild
  // ============================================================

  /*
    elemento.remove()          -> moderno, directo: "quítate de en medio".
    padre.removeChild(hijo)    -> clásico: el PADRE expulsa al hijo y lo devuelve.

    removeChild sigue siendo útil cuando quieres quedarte con el nodo
    eliminado para reinsertarlo en otro sitio.
  */

  // TODO (en clase):
  //   1. consola.titulo('remove y removeChild');
  //   2. Vía moderna: crea  temporal  (un <li> con el texto 'Tarea temporal que
  //      vamos a eliminar'), añádelo con appendChild e imprime
  //      'Hijos tras añadir la temporal ->' con lista.children.length.
  //      Después  temporal.remove();  e imprime
  //      'Tras temporal.remove()        ->' con lista.children.length (vuelve al anterior).
  //   3. Vía clásica, que DEVUELVE el nodo eliminado: crea  otraTemporal
  //      ('Otra tarea temporal'), añádela y elimínala con
  //        const eliminado = lista.removeChild(otraTemporal);
  //      e imprime:
  //        'removeChild devuelve el nodo ->' , eliminado.textContent
  //        '¿Sigue en el documento? ->' , document.contains(eliminado) , '<- no'
  //        'Pero la variable lo conserva: se puede volver a insertar.'
  //   (aprox. 12 líneas)

  // ⚠️ ERROR COMÚN: llamar a removeChild desde un elemento que NO es el padre.
  // Lanza un error de tipo NotFoundError. Con remove() esto no puede pasar.

  /*
    VACIAR UN CONTENEDOR ENTERO
    Tres formas habituales:
       contenedor.innerHTML = '';                    // corta, muy usada
       contenedor.replaceChildren();                 // moderna y explícita
       while (c.firstChild) c.removeChild(c.firstChild);  // clásica
  */

  // TODO (en clase):
  //   Imprime una línea en blanco y la frase
  //   'Para vaciar un contenedor: innerHTML = "" o replaceChildren().'
  //   (aprox. 2 líneas)

  // ============================================================
  // 9. REEMPLAZAR CON replaceWith
  // ============================================================

  /*
    viejo.replaceWith(nuevo) sustituye un elemento por otro en el mismo sitio.
    Acepta varios elementos e incluso texto.
  */

  // TODO (en clase):
  //   1. consola.titulo('replaceWith');
  //   2. Crea e inserta  aReemplazar  (<li> con 'Texto provisional').
  //   3. Crea  definitivo  (<li> con 'Tarea definitiva (creada con replaceWith)')
  //      y añádele la clase 'completada'.
  //   4. Sustituye:  aReemplazar.replaceWith(definitivo);
  //      e imprime:
  //        'El elemento provisional ha sido sustituido en su misma posición.'
  //        'Último hijo de la lista ->' , lista.lastElementChild.textContent
  //   (aprox. 9 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('DocumentFragment');
  //   2. Crea el fragmento:  const fragmento = document.createDocumentFragment();
  //   3. Métele tres <li> con un bucle  for (let i = 1; i <= 3; i++)  cuyo texto
  //      sea  'Elemento ' + i + ' llegado dentro de un fragmento'  y que se
  //      añadan con  fragmento.appendChild(item);   // no toca el documento
  //   4. Imprime 'Hijos dentro del fragmento antes de insertar ->' con
  //      fragmento.children.length  -> 3
  //   5. Inserta:  lista.appendChild(fragmento);   // una sola operación
  //      e imprime 'Hijos dentro del fragmento después          ->' con
  //      fragmento.children.length y la coletilla '<- se ha vaciado'  -> 0
  //      y por último 'Hijos de la lista ->' con lista.children.length.
  //   (aprox. 12 líneas)

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

  // TODO (en clase) - FUNCIONES AUXILIARES DE LA MEDICIÓN:
  //   1. leerCantidad(): lee cuántos elementos quiere insertar el docente, con
  //      topes de seguridad para que el navegador no se quede colgado.
  //        - const valor = Number(campoCantidad.value);   // .value es TEXTO
  //        - Number('') es 0 y Number('hola') es NaN: cubre ambos casos con
  //          if (!Number.isFinite(valor) || valor < 100) return 100;
  //        - if (valor > 20000) return 20000;   // tope para no bloquear el navegador
  //        - return Math.floor(valor);
  //   2. crearEtiqueta(numero): fabrica un <span> con el número dentro y lo
  //      devuelve. Se usa en LAS DOS pruebas para que la comparación sea justa:
  //      lo único que cambia entre ellas es CÓMO se inserta, no QUÉ se inserta.
  //   (aprox. 12 líneas entre las dos)

  // TODO (en clase) - PRUEBA A: insertar uno a uno directamente en el documento
  //   btnBucle.addEventListener('click', function () { ... }) y dentro:
  //     1. const cantidad = leerCantidad();
  //     2. banco.textContent = '';            // vaciamos el banco de pruebas
  //     3. const inicio = performance.now();
  //     4. for (let i = 1; i <= cantidad; i++) { banco.appendChild(crearEtiqueta(i)); }
  //        <- toca el documento en CADA vuelta
  //     5. const duracion = performance.now() - inicio;
  //     6. consola.titulo('PRUEBA A: insertar uno a uno') y luego:
  //          'Elementos insertados ->' , cantidad
  //          'Operaciones sobre el documento ->' , cantidad
  //          'Tiempo -> ' + duracion.toFixed(2) + ' ms'
  //   (aprox. 12 líneas)

  // TODO (en clase) - PRUEBA B: insertar todo de una vez con DocumentFragment
  //   btnFragment.addEventListener('click', function () { ... }) y dentro lo mismo,
  //   pero montando primero un  const trozo = document.createDocumentFragment();
  //   dentro del bucle  trozo.appendChild(crearEtiqueta(i));   // fuera del documento: gratis
  //   y después  banco.appendChild(trozo);   // UNA sola operación sobre el documento
  //   Mensajes: consola.titulo('PRUEBA B: DocumentFragment') y luego:
  //     'Elementos insertados ->' , cantidad
  //     'Operaciones sobre el documento -> 1'
  //     'Tiempo -> ' + duracion.toFixed(2) + ' ms'
  //     ''
  //     'Compara este número con el de la prueba A.'
  //     'Ejecuta cada prueba dos o tres veces: la primera siempre'
  //     'sale peor porque el navegador aún está "calentando".'
  //   (aprox. 16 líneas)

  // TODO (en clase) - BOTÓN DE VACIADO:
  //   btnLimpiarBanco.addEventListener('click', function () { ... }) y dentro:
  //     banco.textContent = '';
  //     consola.titulo('BANCO DE PRUEBAS VACIADO');
  //     'Hijos del banco ->' , banco.children.length   -> 0
  //   (aprox. 5 líneas)

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
