/**
 * ARCHIVO: js/05-navegar-el-arbol.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Subir: parentElement y parentNode.
 *   - Bajar: children, childNodes, firstElementChild, lastElementChild.
 *   - Moverse de lado: nextElementSibling, previousElementSibling.
 *   - Buscar hacia arriba con closest().
 *   - Preguntar con matches().
 *   - Por qué existen dos versiones de casi todo (nodos vs elementos).
 *
 * QUÉ APRENDERÁS
 *   - A moverte desde un elemento hasta cualquier otro sin volver a buscar
 *     en todo el documento. Es la base de la delegación de eventos y de
 *     cualquier componente reutilizable.
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Archivo por completar. Los separadores de sección y la prosa están
 *   colocados; el código se escribe en vivo siguiendo los "TODO (en clase)".
 *   La versión resuelta está en ../../js/05-navegar-el-arbol.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Consola visual de esta sección (viene ya escrita: es andamiaje).
  const consola = window.Consola.crear('salida-navegar');

  // TODO (en clase) - REFERENCIAS DE PARTIDA:
  //   Guarda los tres elementos de la zona de pruebas de la sección 6 del HTML:
  //     const departamento = document.getElementById('departamento-informatica');
  //     const equipo       = document.getElementById('equipo-frontend');
  //     const objetivo     = document.getElementById('persona-objetivo'); // Bruno, el del medio
  //   (aprox. 3 líneas)

  // ============================================================
  // 1. NODOS vs ELEMENTOS: POR QUÉ HAY DOS DE TODO
  // ============================================================

  /*
    En el árbol del DOM no solo hay etiquetas. También hay nodos de texto
    (los espacios y saltos de línea entre etiquetas cuentan) y nodos de
    comentario. Por eso casi todas las propiedades de navegación existen
    en dos versiones:

        childNodes  -> TODOS los nodos: elementos, textos y comentarios.
        children    -> SOLO los elementos (las etiquetas).

    Regla práctica: el 99% de las veces quieres la versión con "Element"
    en el nombre. La versión "Node" te devolverá espacios en blanco y te
    volverá loco.
  */

  // TODO (en clase):
  //   1. consola.titulo('NODOS vs ELEMENTOS');
  //   2. Imprime los dos contadores uno al lado del otro:
  //        'equipo.childNodes.length ->' , equipo.childNodes.length , '<- incluye espacios'   -> 9
  //        'equipo.children.length   ->' , equipo.children.length   , '<- solo etiquetas'     -> 4
  //   3. Enseña qué son esos nodos "invisibles" recorriendo childNodes:
  //        Array.from(equipo.childNodes).forEach(function (nodo, indice) { ... });
  //      Dentro, calcula el tipo con un ternario encadenado sobre nodo.nodeType
  //      (1 = elemento, 3 = texto, 8 = comentario, si no 'otro') y el contenido:
  //      si es elemento usa  window.Consola.describir(nodo)  y si no
  //      JSON.stringify(nodo.nodeValue)  para que se vean los \n y los espacios.
  //      Imprime cada línea como  '   [' + indice + '] ' + tipo + ' -> ' + contenido
  //      precedida de la cabecera 'Detalle de childNodes:'.
  //   4. Cierra con estas dos líneas:
  //        '⚠️ ERROR COMÚN: usar firstChild esperando el primer elemento.'
  //        '   Casi siempre devuelve un salto de línea. Usa firstElementChild.'
  //   Resultado esperado en pantalla: una lista alternando texto ("\n    ") y
  //   elemento (<h4>, <p.persona>, ...).
  //   (aprox. 16 líneas)

  // ============================================================
  // 2. SUBIR: parentElement Y parentNode
  // ============================================================

  /*
    parentElement -> el elemento que lo contiene.
    parentNode    -> el nodo que lo contiene.

    Casi siempre son el mismo. Solo se diferencian en el tope del árbol:
    el padre de <html> como NODO es document, pero document no es un
    elemento, así que parentElement devuelve null.
  */

  // TODO (en clase):
  //   1. consola.titulo('SUBIR POR EL ÁRBOL');
  //   2. Imprime la cadena de padres desde Bruno:
  //        'Partimos de ->' , objetivo
  //        'objetivo.parentElement        ->' , objetivo.parentElement                  -> <div#equipo-frontend.equipo>
  //        'El padre del padre            ->' , objetivo.parentElement.parentElement    -> <div#departamento-informatica.departamento>
  //   3. Advierte de la fragilidad de encadenar. Imprime una línea en blanco y:
  //        '⚠️ Encadenar .parentElement.parentElement es frágil:'
  //        '   basta con envolver el HTML en un div más para romperlo.'
  //        '   Para eso existe closest(), que veremos en el punto 6.'
  //   4. La diferencia en el TOPE del árbol:
  //        const html = document.documentElement;
  //      Imprime:
  //        'html.parentNode    ->' , html.parentNode === document ? 'document' : html.parentNode
  //        'html.parentElement ->' , html.parentElement , '<- null'
  //   (aprox. 10 líneas)

  // ============================================================
  // 3. BAJAR: children, firstElementChild, lastElementChild
  // ============================================================

  // TODO (en clase):
  //   1. consola.titulo('BAJAR POR EL ÁRBOL');
  //   2. Imprime las cuatro propiedades de bajada sobre el equipo:
  //        'equipo.children            ->' , equipo.children
  //        'equipo.firstElementChild   ->' , equipo.firstElementChild    -> <h4>
  //        'equipo.lastElementChild    ->' , equipo.lastElementChild     -> <p.persona> (Carla)
  //        'equipo.childElementCount   ->' , equipo.childElementCount    -> 4
  //   3. Recorre los hijos DIRECTOS. OJO: children es una HTMLCollection VIVA,
  //      así que hay que convertirla a array antes de usar forEach:
  //        Array.from(equipo.children).forEach(function (hijo, i) {
  //          consola.imprimir('   ' + i + ' -> ' + window.Consola.describir(hijo) +
  //            ' : "' + hijo.textContent + '"');
  //        });
  //      precedido de la cabecera 'Recorrido de los hijos directos:'.
  //   4. OJO CON LA PALABRA "HIJO": children son solo los hijos DIRECTOS (un
  //      nivel). Los nietos no salen. Para buscar a cualquier profundidad se usa
  //      querySelectorAll, que recorre todo el subárbol. Demuéstralo:
  //        'Hijos DIRECTOS del departamento ->' , departamento.children.length      -> 2
  //        'Descendientes a cualquier nivel ->' , departamento.querySelectorAll('*').length  -> 6
  //   (aprox. 13 líneas)

  // ============================================================
  // 4. MOVERSE DE LADO: LOS HERMANOS
  // ============================================================

  /*
    Hermanos = elementos que comparten el mismo padre.
      nextElementSibling     -> el siguiente
      previousElementSibling -> el anterior
    Si no hay ninguno, devuelven null (el primero no tiene anterior y el
    último no tiene siguiente).
  */

  // TODO (en clase):
  //   1. consola.titulo('HERMANOS');
  //   2. Desde Bruno, mira a los lados:
  //        'Elemento de partida ->' , objetivo , ':' , objetivo.textContent
  //        'Anterior  ->' , objetivo.previousElementSibling.textContent   -> Ana Restrepo
  //        'Siguiente ->' , objetivo.nextElementSibling.textContent       -> Carla Méndez
  //   3. LA SORPRESA DE LOS EXTREMOS. Ana es la primera PERSONA, pero NO es el
  //      primer hijo del equipo: antes que ella está el <h4> del nombre del equipo.
  //        const primeraPersona = equipo.querySelector('.persona');
  //      Imprime:
  //        'Primera persona ->' , primeraPersona.textContent
  //        '   Su hermano anterior ->' , primeraPersona.previousElementSibling  -> <h4>
  //        '   ¡No es null! Es el <h4> del equipo.'
  //   4. El verdadero primer hijo sí devuelve null al pedirle el anterior:
  //        const primerHijoReal = equipo.firstElementChild;   // el <h4>
  //      Imprime '   Primer hijo real ->' , primerHijoReal  y
  //      '   Su anterior ->' , primerHijoReal.previousElementSibling , '<- ahora sí, null'
  //   5. Y el último hijo no tiene siguiente:
  //        '   Último hijo ->' , equipo.lastElementChild
  //        '   Su siguiente ->' , equipo.lastElementChild.nextElementSibling , '<- null'
  //   6. ⚠️ ERROR COMÚN: suponer que "el hermano anterior" será del mismo tipo.
  //      Los hermanos son TODOS los elementos con el mismo padre, mezclando
  //      etiquetas distintas. Si necesitas solo los de una clase, filtra:
  //        const soloPersonas = Array.from(equipo.children).filter(function (el) {
  //          return el.classList.contains('persona');
  //        });
  //      Imprime 'Hijos filtrados por clase "persona" ->' con soloPersonas.length -> 3
  //   7. Resalta visualmente los parentescos para explicarlo en clase (las tres
  //      clases están ya definidas en el CSS):
  //        objetivo.classList.add('resaltado-objetivo');
  //        if (objetivo.previousElementSibling) { ...add('resaltado-hermano'); }
  //        if (objetivo.nextElementSibling)     { ...add('resaltado-hermano'); }
  //      Imprime después:
  //        'Mira la zona de pruebas: en azul el elemento de partida'
  //        'y en verde sus dos hermanos directos.'
  //   Resultado esperado en pantalla: Bruno se pinta en azul y Ana y Carla en verde.
  //   (aprox. 24 líneas)

  // ============================================================
  // 5. matches(): PREGUNTAR SIN BUSCAR
  // ============================================================

  /*
    matches(selector) responde true o false a la pregunta:
    "¿este elemento encaja con este selector CSS?".

    Es la forma correcta de comprobar varias condiciones a la vez,
    porque acepta cualquier selector, no solo una clase.
  */

  // TODO (en clase):
  //   1. consola.titulo('matches()');
  //   2. Pregunta cinco cosas distintas sobre el mismo elemento:
  //        'objetivo.matches(".persona")          ->' , objetivo.matches('.persona')          -> true
  //        'objetivo.matches("#persona-objetivo") ->' , objetivo.matches('#persona-objetivo') -> true
  //        'objetivo.matches("div")               ->' , objetivo.matches('div')               -> false
  //        'objetivo.matches(".equipo .persona")  ->' , objetivo.matches('.equipo .persona')  -> true
  //        'objetivo.matches("p:first-of-type")   ->' , objetivo.matches('p:first-of-type')   -> false
  //   3. Uso típico: filtrar una lista mezclada.
  //        const elementosDelEquipo = Array.from(equipo.children);
  //        const cuantasPersonas = elementosDelEquipo.filter((el) => el.matches('.persona')).length;
  //      Imprime 'Elementos que encajan con ".persona" ->' con ese número  -> 3
  //   (aprox. 9 líneas)

  // ============================================================
  // 6. closest(): SUBIR BUSCANDO
  // ============================================================

  /*
    closest(selector) es el método más útil de toda esta sección.
    Empieza en el PROPIO elemento y va subiendo por sus padres hasta
    encontrar el primero que encaje con el selector. Si no encuentra
    ninguno, devuelve null.

    Analogía: es como preguntar "¿dónde está la salida?" y ir subiendo
    plantas hasta encontrar un cartel.

    Es lo que permite escribir un solo manejador de eventos para una lista
    entera: cuando alguien pulsa en cualquier punto de una tarjeta, con
    evento.target.closest('.tarjeta') obtienes la tarjeta completa, hayas
    pulsado en el título, en el precio o en el icono.
  */

  // TODO (en clase):
  //   1. consola.titulo('closest()');
  //   2. Sube por niveles desde Bruno:
  //        'Desde ->' , objetivo
  //        'closest(".equipo")       ->' , objetivo.closest('.equipo')
  //        'closest(".departamento") ->' , objetivo.closest('.departamento')
  //        'closest("section")       ->' , objetivo.closest('section')
  //        'closest("body")          ->' , objetivo.closest('body')
  //   3. DETALLE CLAVE: closest se incluye A SÍ MISMO en la búsqueda.
  //        'closest(".persona") ->' , objetivo.closest('.persona') , '<- se devuelve a sí mismo'
  //        '(closest empieza mirándose a sí mismo antes de subir)'
  //   4. Si no hay ningún ancestro que encaje, devuelve null (no da error):
  //        'closest(".no-existe") ->' , objetivo.closest('.no-existe')
  //   5. Patrón habitual en componentes: leer un data-* del ancestro.
  //        const area = objetivo.closest('[data-area]');
  //      Imprime 'Área a la que pertenece Bruno ->' con area.dataset.area -> informatica
  //      y '(subimos hasta el ancestro que tiene data-area y lo leemos)'.
  //   (aprox. 13 líneas)

  // ============================================================
  // 7. UN RECORRIDO COMPLETO, DE ARRIBA ABAJO
  // ============================================================

  /*
    Función recursiva: una función que se llama a sí misma. Aquí la usamos
    para dibujar el árbol de la zona de pruebas con sangría.

    Cada llamada se ocupa de UN elemento y delega en sí misma para cada hijo,
    aumentando el nivel de sangría. Cuando un elemento no tiene hijos, la
    cadena de llamadas se detiene sola: ese es el "caso base".
  */

  // TODO (en clase):
  //   1. consola.titulo('EL ÁRBOL DE LA ZONA DE PRUEBAS');
  //   2. Escribe la función recursiva  dibujarArbol(elemento, nivel):
  //        - const sangria = '   '.repeat(nivel);
  //        - imprime  sangria + '└ ' + window.Consola.describir(elemento)
  //        - recorre SOLO los hijos elemento y baja un nivel más:
  //            Array.from(elemento.children).forEach(function (hijo) {
  //              dibujarArbol(hijo, nivel + 1);
  //            });
  //   3. Llámala partiendo del contenedor de la zona de pruebas:
  //        dibujarArbol(document.getElementById('arbol-demo'), 0);
  //   4. Cierra con el resumen. Imprime una línea en blanco y estas cinco:
  //        '✅ RESUMEN DE NAVEGACIÓN'
  //        '   Arriba   -> parentElement, closest(selector)'
  //        '   Abajo    -> children, firstElementChild, querySelector'
  //        '   Al lado  -> nextElementSibling, previousElementSibling'
  //        '   Preguntar-> matches(selector)'
  //   Resultado esperado en pantalla: un árbol con sangría de 6 líneas, desde
  //   <div#arbol-demo.caja-demo> hasta los tres <p.persona>.
  //   (aprox. 15 líneas)
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Partiendo del elemento con id "persona-objetivo", llega hasta el <h3> del
   departamento usando SOLO propiedades de navegación (nada de getElementById).

2) Escribe una función  hermanos(elemento)  que devuelva un array con todos
   los hermanos de un elemento SIN incluirlo a él mismo.
   Pista: Array.from(elemento.parentElement.children).filter(...)

3) Añade a cada .persona un botón "Subir" que la intercambie con la persona
   anterior usando previousElementSibling y before().

4) Explica con tus palabras por qué  equipo.childNodes.length  y
   equipo.children.length  dan números distintos. ¿Qué pasaría si escribieras
   todo el HTML del equipo en una sola línea, sin saltos de línea?

5) RETO: escribe una función  ruta(elemento)  que devuelva la ruta CSS completa
   desde <body> hasta ese elemento, del estilo:
   "body > main > section#navegar-el-arbol > div.caja-demo > ...".
   Pista: sube con parentElement dentro de un while y ve guardando los pasos.
================================================================
*/
