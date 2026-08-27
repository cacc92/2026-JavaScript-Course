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
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const consola = window.Consola.crear('salida-navegar');

  const departamento = document.getElementById('departamento-informatica');
  const equipo = document.getElementById('equipo-frontend');
  const objetivo = document.getElementById('persona-objetivo'); // Bruno, el del medio

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

  consola.titulo('NODOS vs ELEMENTOS');

  consola.imprimir('equipo.childNodes.length ->', equipo.childNodes.length, '<- incluye espacios');
  consola.imprimir('equipo.children.length   ->', equipo.children.length, '<- solo etiquetas');

  // Vamos a ver qué son esos nodos "invisibles":
  consola.imprimir('');
  consola.imprimir('Detalle de childNodes:');
  Array.from(equipo.childNodes).forEach(function (nodo, indice) {
    // nodeType: 1 = elemento, 3 = texto, 8 = comentario
    const tipo = nodo.nodeType === 1 ? 'elemento' :
                 nodo.nodeType === 3 ? 'texto' :
                 nodo.nodeType === 8 ? 'comentario' : 'otro';

    // Para los nodos de texto mostramos el contenido con JSON.stringify
    // para que se vean los \n y los espacios.
    const contenido = nodo.nodeType === 1
      ? window.Consola.describir(nodo)
      : JSON.stringify(nodo.nodeValue);

    consola.imprimir('   [' + indice + '] ' + tipo + ' -> ' + contenido);
  });

  consola.imprimir('');
  consola.imprimir('⚠️ ERROR COMÚN: usar firstChild esperando el primer elemento.');
  consola.imprimir('   Casi siempre devuelve un salto de línea. Usa firstElementChild.');

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

  consola.titulo('SUBIR POR EL ÁRBOL');

  consola.imprimir('Partimos de ->', objetivo);
  consola.imprimir('objetivo.parentElement        ->', objetivo.parentElement);
  consola.imprimir('El padre del padre            ->', objetivo.parentElement.parentElement);

  // Podemos encadenar tantas veces como haga falta... pero es frágil:
  // si mañana alguien mete un <div> más, la cadena se rompe.
  consola.imprimir('');
  consola.imprimir('⚠️ Encadenar .parentElement.parentElement es frágil:');
  consola.imprimir('   basta con envolver el HTML en un div más para romperlo.');
  consola.imprimir('   Para eso existe closest(), que veremos en el punto 6.');

  // La diferencia en el tope del árbol:
  const html = document.documentElement;
  consola.imprimir('');
  consola.imprimir('html.parentNode    ->', html.parentNode === document ? 'document' : html.parentNode);
  consola.imprimir('html.parentElement ->', html.parentElement, '<- null');

  // ============================================================
  // 3. BAJAR: children, firstElementChild, lastElementChild
  // ============================================================

  consola.titulo('BAJAR POR EL ÁRBOL');

  consola.imprimir('equipo.children            ->', equipo.children);
  consola.imprimir('equipo.firstElementChild   ->', equipo.firstElementChild);
  consola.imprimir('equipo.lastElementChild    ->', equipo.lastElementChild);
  consola.imprimir('equipo.childElementCount   ->', equipo.childElementCount);

  // Recorrer los hijos directos. OJO: children es una HTMLCollection VIVA,
  // así que la convertimos a array antes de usar forEach.
  consola.imprimir('');
  consola.imprimir('Recorrido de los hijos directos:');
  Array.from(equipo.children).forEach(function (hijo, i) {
    consola.imprimir('   ' + i + ' -> ' + window.Consola.describir(hijo) +
      ' : "' + hijo.textContent + '"');
  });

  /*
    OJO CON LA PALABRA "HIJO"
    children son solo los hijos DIRECTOS (un nivel). Los nietos no salen.
    Para buscar a cualquier profundidad se usa querySelectorAll, que recorre
    todo el subárbol.
  */
  consola.imprimir('');
  consola.imprimir('Hijos DIRECTOS del departamento ->', departamento.children.length);
  consola.imprimir('Descendientes a cualquier nivel ->', departamento.querySelectorAll('*').length);

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

  consola.titulo('HERMANOS');

  consola.imprimir('Elemento de partida ->', objetivo, ':', objetivo.textContent);
  consola.imprimir('Anterior  ->', objetivo.previousElementSibling.textContent);
  consola.imprimir('Siguiente ->', objetivo.nextElementSibling.textContent);

  /*
    ¿Y en los extremos? Aquí hay una sorpresa muy instructiva.
    Ana es la primera PERSONA, pero NO es el primer hijo del equipo:
    antes que ella está el <h4> con el nombre del equipo.
  */
  const primeraPersona = equipo.querySelector('.persona');
  consola.imprimir('');
  consola.imprimir('Primera persona ->', primeraPersona.textContent);
  consola.imprimir('   Su hermano anterior ->', primeraPersona.previousElementSibling);
  consola.imprimir('   ¡No es null! Es el <h4> del equipo.');

  // El verdadero primer hijo sí devuelve null al pedirle el anterior:
  const primerHijoReal = equipo.firstElementChild; // el <h4>
  consola.imprimir('   Primer hijo real ->', primerHijoReal);
  consola.imprimir('   Su anterior ->', primerHijoReal.previousElementSibling, '<- ahora sí, null');

  // Y el último hijo no tiene siguiente:
  consola.imprimir('   Último hijo ->', equipo.lastElementChild);
  consola.imprimir('   Su siguiente ->', equipo.lastElementChild.nextElementSibling, '<- null');

  /*
    ⚠️ ERROR COMÚN: suponer que "el hermano anterior" será del mismo tipo.
    Los hermanos son TODOS los elementos con el mismo padre, mezclando
    etiquetas distintas. Si necesitas solo los de una clase, filtra:
  */
  const soloPersonas = Array.from(equipo.children).filter(function (el) {
    return el.classList.contains('persona');
  });
  consola.imprimir('');
  consola.imprimir('Hijos filtrados por clase "persona" ->', soloPersonas.length);

  // Resaltamos visualmente los parentescos para explicarlo en clase.
  objetivo.classList.add('resaltado-objetivo');
  if (objetivo.previousElementSibling) {
    objetivo.previousElementSibling.classList.add('resaltado-hermano');
  }
  if (objetivo.nextElementSibling) {
    objetivo.nextElementSibling.classList.add('resaltado-hermano');
  }
  consola.imprimir('');
  consola.imprimir('Mira la zona de pruebas: en azul el elemento de partida');
  consola.imprimir('y en verde sus dos hermanos directos.');

  // ============================================================
  // 5. matches(): PREGUNTAR SIN BUSCAR
  // ============================================================

  /*
    matches(selector) responde true o false a la pregunta:
    "¿este elemento encaja con este selector CSS?".

    Es la forma correcta de comprobar varias condiciones a la vez,
    porque acepta cualquier selector, no solo una clase.
  */

  consola.titulo('matches()');

  consola.imprimir('objetivo.matches(".persona")          ->', objetivo.matches('.persona'));
  consola.imprimir('objetivo.matches("#persona-objetivo") ->', objetivo.matches('#persona-objetivo'));
  consola.imprimir('objetivo.matches("div")               ->', objetivo.matches('div'));
  consola.imprimir('objetivo.matches(".equipo .persona")  ->', objetivo.matches('.equipo .persona'));
  consola.imprimir('objetivo.matches("p:first-of-type")   ->', objetivo.matches('p:first-of-type'));

  // Uso típico: filtrar una lista mezclada
  const elementosDelEquipo = Array.from(equipo.children);
  const cuantasPersonas = elementosDelEquipo.filter((el) => el.matches('.persona')).length;
  consola.imprimir('');
  consola.imprimir('Elementos que encajan con ".persona" ->', cuantasPersonas);

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

  consola.titulo('closest()');

  consola.imprimir('Desde ->', objetivo);
  consola.imprimir('closest(".equipo")       ->', objetivo.closest('.equipo'));
  consola.imprimir('closest(".departamento") ->', objetivo.closest('.departamento'));
  consola.imprimir('closest("section")       ->', objetivo.closest('section'));
  consola.imprimir('closest("body")          ->', objetivo.closest('body'));

  // Detalle clave: closest se incluye A SÍ MISMO en la búsqueda.
  consola.imprimir('');
  consola.imprimir('closest(".persona") ->', objetivo.closest('.persona'),
    '<- se devuelve a sí mismo');
  consola.imprimir('(closest empieza mirándose a sí mismo antes de subir)');

  // Si no hay ningún ancestro que encaje, devuelve null (no da error).
  consola.imprimir('closest(".no-existe") ->', objetivo.closest('.no-existe'));

  // Leer un data-* del ancestro: patrón habitual en componentes.
  const area = objetivo.closest('[data-area]');
  consola.imprimir('');
  consola.imprimir('Área a la que pertenece Bruno ->', area.dataset.area);
  consola.imprimir('(subimos hasta el ancestro que tiene data-area y lo leemos)');

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

  consola.titulo('EL ÁRBOL DE LA ZONA DE PRUEBAS');

  /**
   * dibujarArbol(): imprime el elemento y, recursivamente, sus descendientes.
   * @param {Element} elemento - punto de partida
   * @param {number} nivel - profundidad actual (para la sangría)
   */
  function dibujarArbol(elemento, nivel) {
    const sangria = '   '.repeat(nivel);
    consola.imprimir(sangria + '└ ' + window.Consola.describir(elemento));

    // Recorremos SOLO los hijos elemento, y bajamos un nivel más.
    Array.from(elemento.children).forEach(function (hijo) {
      dibujarArbol(hijo, nivel + 1);
    });
  }

  dibujarArbol(document.getElementById('arbol-demo'), 0);

  consola.imprimir('');
  consola.imprimir('✅ RESUMEN DE NAVEGACIÓN');
  consola.imprimir('   Arriba   -> parentElement, closest(selector)');
  consola.imprimir('   Abajo    -> children, firstElementChild, querySelector');
  consola.imprimir('   Al lado  -> nextElementSibling, previousElementSibling');
  consola.imprimir('   Preguntar-> matches(selector)');
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
