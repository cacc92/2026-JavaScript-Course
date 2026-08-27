/**
 * ARCHIVO: js/02-contenido-y-atributos.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - Leer y escribir contenido: textContent, innerText e innerHTML.
 *   - Por qué innerHTML es una puerta abierta a ataques XSS.
 *   - Atributos: getAttribute, setAttribute, removeAttribute, hasAttribute.
 *   - La diferencia entre el ATRIBUTO del HTML y la PROPIEDAD del objeto.
 *   - Atributos personalizados data-* y el objeto dataset.
 *
 * QUÉ APRENDERÁS
 *   - A elegir siempre la opción segura para meter texto en la página.
 *   - A guardar datos en el propio HTML sin inventar variables globales.
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const consola = window.Consola.crear('salida-contenido');

  // Elementos de la zona de pruebas de esta sección.
  const parrafo = document.getElementById('parrafo-precio');
  const enlace = document.getElementById('enlace-demo');
  const campo = document.getElementById('campo-demo');
  const tarjetaDataset = document.getElementById('tarjeta-dataset');

  // ============================================================
  // 1. textContent: EL TEXTO, TODO EL TEXTO Y NADA MÁS QUE EL TEXTO
  // ============================================================

  /*
    textContent devuelve el texto de un elemento y de todos sus descendientes,
    tal cual está en el HTML: incluye el texto de los elementos ocultos con CSS
    y conserva los espacios y saltos de línea del código fuente.

    Es rápido porque no necesita saber cómo se está pintando la página.
  */

  consola.titulo('textContent');

  // JSON.stringify aquí nos sirve para VER los saltos de línea (\n) y espacios.
  consola.imprimir('textContent en crudo ->', JSON.stringify(parrafo.textContent));
  consola.imprimir('Longitud ->', parrafo.textContent.length, 'caracteres');
  consola.imprimir('Incluye el <span> oculto por CSS: sí, lo ves ahí arriba.');

  // ============================================================
  // 2. innerText: LO QUE EL USUARIO REALMENTE VE
  // ============================================================

  /*
    innerText devuelve el texto tal y como se RENDERIZA: ignora lo que está
    oculto con display:none y normaliza los espacios sobrantes.

    Precio a pagar: para responder, el navegador necesita calcular los estilos.
    Eso es más lento. En un bucle de miles de vueltas se nota mucho.
  */

  consola.titulo('innerText');

  consola.imprimir('innerText en crudo ->', JSON.stringify(parrafo.innerText));
  consola.imprimir('Longitud ->', parrafo.innerText.length, 'caracteres');
  consola.imprimir('Fíjate: el texto oculto NO aparece y los espacios están limpios.');

  // ============================================================
  // 3. innerHTML: EL CONTENIDO COMO MARCADO
  // ============================================================

  /*
    innerHTML devuelve (y permite escribir) el HTML interno como texto.
    Al LEER, ves las etiquetas. Al ESCRIBIR, el navegador interpreta lo que
    le das y construye nodos reales.
  */

  consola.titulo('innerHTML');

  consola.imprimir('innerHTML ->', parrafo.innerHTML);
  consola.imprimir('Aquí sí se ven las etiquetas <strong> y <span>.');

  // ============================================================
  // 4. LOS TRES, UNO AL LADO DEL OTRO
  // ============================================================

  consola.titulo('COMPARATIVA RÁPIDA');
  consola.imprimir('textContent -> todo el texto, incluido lo oculto. RÁPIDO.');
  consola.imprimir('innerText   -> solo lo visible, espacios normalizados. LENTO.');
  consola.imprimir('innerHTML   -> el marcado completo. POTENTE Y PELIGROSO.');
  consola.imprimir('');
  consola.imprimir('✅ BUENA PRÁCTICA: si solo vas a poner texto, usa textContent.');

  // ============================================================
  // 5. ESCRIBIR CONTENIDO
  // ============================================================

  /*
    Escribir en cualquiera de las tres propiedades BORRA todo lo que había
    dentro del elemento y lo sustituye. No añade: reemplaza.
  */

  consola.titulo('ESCRIBIR CONTENIDO');

  // Creamos un elemento de usar y tirar para no estropear la zona de pruebas.
  const cajaTemporal = document.createElement('div');

  cajaTemporal.textContent = '<b>Hola</b>';
  consola.imprimir('Con textContent, el HTML se ve como TEXTO:');
  consola.imprimir('   innerHTML resultante ->', cajaTemporal.innerHTML);
  consola.imprimir('   (el navegador ha escapado los signos < y >)');

  cajaTemporal.innerHTML = '<b>Hola</b>';
  consola.imprimir('Con innerHTML, el HTML se INTERPRETA:');
  consola.imprimir('   textContent resultante ->', cajaTemporal.textContent);
  consola.imprimir('   hijos creados ->', cajaTemporal.children.length, '(un <b> de verdad)');

  // ⚠️ ERROR COMÚN: usar += con innerHTML dentro de un bucle.
  // Cada += obliga al navegador a leer todo el HTML, unirlo y reconstruir
  // TODOS los nodos desde cero. Además, destruye los eventos ya asignados.
  consola.imprimir('');
  consola.imprimir('⚠️ ERROR COMÚN: caja.innerHTML += "..." dentro de un bucle.');
  consola.imprimir('   Reconstruye todo el subárbol en cada vuelta y borra los eventos.');

  // ============================================================
  // 6. EL RIESGO REAL: XSS
  // ============================================================

  /*
    XSS (Cross-Site Scripting) significa que un atacante consigue que SU código
    se ejecute dentro de TU página. Si tomas algo que escribió un usuario
    (un comentario, un nombre, un campo de búsqueda) y lo metes con innerHTML,
    le estás dando permiso para ejecutar JavaScript en el navegador de tus
    visitantes: robar sesiones, leer datos, suplantar al usuario.

    Un detalle importante que sorprende a todo el mundo: insertar una etiqueta
    <script> con innerHTML NO la ejecuta. Pero un atributo como onerror SÍ.
    Por eso el ejemplo usa una imagen que falla a propósito.
  */

  const campoXss = document.getElementById('campo-xss');
  const destinoXss = document.getElementById('destino-xss');
  const btnXssTexto = document.getElementById('btn-xss-texto');
  const btnXssHtml = document.getElementById('btn-xss-html');

  /*
    addEventListener se estudia a fondo en el proyecto de eventos. Aquí solo
    necesitamos saber que significa: "cuando ocurra 'click' en este botón,
    ejecuta esta función".

    ✅ BUENA PRÁCTICA: nunca lanzar demostraciones agresivas al cargar la
    página. Van dentro de un botón que el docente pulsa cuando quiere.
  */

  btnXssTexto.addEventListener('click', function () {
    // La vía segura: el navegador trata TODO como texto plano.
    destinoXss.textContent = campoXss.value;

    consola.titulo('INSERCIÓN CON textContent (segura)');
    consola.imprimir('Se ha insertado exactamente este texto:');
    consola.imprimir(campoXss.value);
    consola.imprimir('No se ha ejecutado nada. Las etiquetas se ven como letras.');
  });

  btnXssHtml.addEventListener('click', function () {
    // La vía peligrosa: el navegador CONSTRUYE lo que venga en ese texto.
    destinoXss.innerHTML = campoXss.value;

    consola.titulo('INSERCIÓN CON innerHTML (peligrosa)');
    consola.imprimir('El navegador ha construido nodos reales a partir del texto.');
    consola.imprimir('Contenido final del destino ->', destinoXss.textContent);
    consola.imprimir('⚠️ El atributo onerror de la imagen se ha ejecutado solo.');
    consola.imprimir('   Imagina que ese código enviara las cookies a otro servidor.');
  });

  // ============================================================
  // 7. ATRIBUTOS: LOS MÉTODOS CLÁSICOS
  // ============================================================

  /*
    ANTES DE EMPEZAR: el enlace de pruebas apunta a "pagina-inexistente.html".
    Es a propósito, porque queremos ver cómo el navegador convierte esa ruta
    relativa en una URL absoluta. Pero si alguien lo pulsa se iría a una
    página que no existe y perdería el sitio donde estaba.

    Lo evitamos con preventDefault(), que cancela el comportamiento por
    defecto del navegador (aquí, navegar). El enlace sigue siendo un enlace
    de verdad para todo lo demás: solo le quitamos el "salto".
  */
  enlace.addEventListener('click', function (evento) {
    evento.preventDefault(); // cancelamos la navegación

    consola.titulo('CLIC EN EL ENLACE DE PRUEBAS');
    consola.imprimir('Se ha cancelado la navegación con evento.preventDefault().');
    consola.imprimir('Destino que tenía ->', enlace.href);
  });

  /*
    Un atributo es lo que se escribe dentro de la etiqueta en el HTML:
    <a href="..." title="..." data-tipo="...">

    Cuatro métodos para manejarlos, todos trabajan con TEXTO:
      getAttribute(nombre)          -> lee (string o null)
      setAttribute(nombre, valor)   -> crea o cambia
      removeAttribute(nombre)       -> elimina
      hasAttribute(nombre)          -> pregunta (true/false)
  */

  consola.titulo('getAttribute / setAttribute / hasAttribute / removeAttribute');

  consola.imprimir('href  ->', enlace.getAttribute('href'));
  consola.imprimir('title ->', enlace.getAttribute('title'));
  consola.imprimir('¿tiene target? ->', enlace.hasAttribute('target'));

  // Añadimos un atributo nuevo
  enlace.setAttribute('target', '_blank');
  consola.imprimir('Tras setAttribute("target", "_blank") ->', enlace.hasAttribute('target'));

  // Y lo quitamos
  enlace.removeAttribute('target');
  consola.imprimir('Tras removeAttribute("target")       ->', enlace.hasAttribute('target'));

  // Un atributo que no existe devuelve null, NO una cadena vacía.
  consola.imprimir('getAttribute("inventado") ->', enlace.getAttribute('inventado'));

  // Lista completa de atributos del elemento
  const nombresAtributos = Array.from(enlace.attributes).map((a) => a.name);
  consola.imprimir('Todos sus atributos ->', nombresAtributos);

  // ============================================================
  // 8. ATRIBUTO vs PROPIEDAD: LA TRAMPA CLÁSICA
  // ============================================================

  /*
    Muchos atributos tienen además una PROPIEDAD directa en el objeto
    (elemento.id, elemento.href, elemento.value...). No siempre valen lo mismo:

      - El ATRIBUTO guarda lo que estaba escrito en el HTML original.
      - La PROPIEDAD guarda el valor ACTUAL, ya interpretado por el navegador.
  */

  consola.titulo('ATRIBUTO vs PROPIEDAD');

  // Caso 1: href. El atributo es relativo; la propiedad es la URL absoluta.
  consola.imprimir('enlace.getAttribute("href") ->', enlace.getAttribute('href'));
  consola.imprimir('enlace.href                 ->', enlace.href);
  consola.imprimir('(la propiedad resuelve la ruta completa, con file:// o https://)');

  // Caso 2: value de un input. Aquí está el error clásico de los formularios.
  consola.imprimir('');
  consola.imprimir('campo.value                 ->', campo.value);
  consola.imprimir('campo.getAttribute("value") ->', campo.getAttribute('value'));

  campo.value = 'Texto cambiado desde JavaScript';

  consola.imprimir('Después de campo.value = "...":');
  consola.imprimir('   campo.value                 ->', campo.value, '<- cambiado');
  consola.imprimir('   campo.getAttribute("value") ->', campo.getAttribute('value'), '<- ¡el original!');
  consola.imprimir('');
  consola.imprimir('⚠️ ERROR COMÚN: leer lo que escribió el usuario con getAttribute("value").');
  consola.imprimir('✅ BUENA PRÁCTICA: para formularios usa SIEMPRE la propiedad .value');

  // Caso 3: class. La propiedad NO se llama class (es palabra reservada),
  // se llama className. Aunque para esto usaremos classList (archivo 03).
  consola.imprimir('');
  consola.imprimir('parrafo.getAttribute("id") ->', parrafo.getAttribute('id'));
  consola.imprimir('parrafo.id                 ->', parrafo.id, '(propiedad directa)');

  // ============================================================
  // 9. ATRIBUTOS data-* Y EL OBJETO dataset
  // ============================================================

  /*
    HTML permite inventarse atributos propios siempre que empiecen por "data-".
    Sirven para guardar información en el propio elemento: el id de un producto,
    una categoría, un estado... Así el dato viaja pegado al elemento y no hace
    falta mantener variables globales en paralelo.

    Se leen con el objeto dataset, que traduce los nombres:
        data-precio-base   ->   dataset.precioBase
    Es decir: se quita "data-" y los guiones se convierten en mayúscula
    (esto se llama camelCase).
  */

  consola.titulo('ATRIBUTOS data-* Y dataset');

  consola.imprimir('data-id           -> dataset.id         ->', tarjetaDataset.dataset.id);
  consola.imprimir('data-categoria    -> dataset.categoria  ->', tarjetaDataset.dataset.categoria);
  consola.imprimir('data-precio-base  -> dataset.precioBase ->', tarjetaDataset.dataset.precioBase);
  consola.imprimir('data-en-oferta    -> dataset.enOferta   ->', tarjetaDataset.dataset.enOferta);

  // ⚠️ ERROR COMÚN NÚMERO DOS: creer que dataset devuelve números o booleanos.
  // TODO lo que sale de dataset es TEXTO. Siempre.
  const precioTexto = tarjetaDataset.dataset.precioBase;
  consola.imprimir('');
  consola.imprimir('typeof dataset.precioBase ->', typeof precioTexto, '<- ¡texto, no número!');
  consola.imprimir('precioTexto + 10 ->', precioTexto + 10, '<- concatena, no suma');

  // La conversión hay que hacerla a mano:
  const precioNumero = Number(precioTexto);
  consola.imprimir('Number(precioTexto) + 10 ->', precioNumero + 10, '<- ahora sí suma');

  // Lo mismo con los booleanos:
  const enOfertaTexto = tarjetaDataset.dataset.enOferta; // "true" (texto)
  consola.imprimir('');
  consola.imprimir('dataset.enOferta === true    ->', enOfertaTexto === true, '<- false: es texto');
  consola.imprimir('dataset.enOferta === "true"  ->', enOfertaTexto === 'true', '<- así sí');

  // ⚠️ OJO: cualquier texto no vacío es "verdadero" en un if. Incluso "false".
  consola.imprimir('Boolean("false") ->', Boolean('false'), '<- ¡trampa mortal!');

  // Escribir en dataset crea o actualiza el atributo en el HTML:
  tarjetaDataset.dataset.stock = '12';        // crea data-stock="12"
  tarjetaDataset.dataset.ultimaRevision = '2026-08-26'; // crea data-ultima-revision
  consola.imprimir('');
  consola.imprimir('Tras escribir en dataset, el HTML del elemento es:');
  consola.imprimir(tarjetaDataset.outerHTML.split('>')[0] + '>');

  // Y se borran con delete o con removeAttribute:
  delete tarjetaDataset.dataset.ultimaRevision;
  consola.imprimir('Tras delete dataset.ultimaRevision ->',
    tarjetaDataset.hasAttribute('data-ultima-revision'));

  // Recorrer todos los data-* de un elemento:
  consola.imprimir('');
  consola.imprimir('Todos los data-* de la tarjeta:');
  // Object.entries convierte un objeto en un array de pares [clave, valor]
  Object.entries(tarjetaDataset.dataset).forEach(function (par) {
    consola.imprimir('   ' + par[0] + ' = ' + par[1]);
  });
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Cambia el texto del párrafo de precios para que diga "Precio del teclado:
   59.90 euros" usando textContent. ¿Qué le ha pasado a la etiqueta <strong>?
   Explica por qué.

2) Escribe una función  precioConIva(elemento)  que lea el atributo
   data-precio-base de un elemento, le sume el 21% y devuelva el resultado
   como número redondeado a dos decimales. Pista: Number() y toFixed(2).

3) Añade al enlace de pruebas los atributos rel="noopener" y target="_blank"
   con setAttribute, imprime la lista completa de sus atributos y luego
   déjalo como estaba.

4) Investiga: crea un <div>, ponle innerHTML = '<script>alert(1)<\/script>'
   y comprueba que NO se ejecuta. Después explica por qué el ejemplo con
   <img onerror> sí funciona. ¿Qué conclusión sacas sobre "confiar" en que
   innerHTML es seguro?

5) RETO: escribe una función  insertarSeguro(elemento, textoDelUsuario)  que
   permita SOLO las etiquetas <b> e <i> y convierta cualquier otra en texto
   plano. Pista: primero escapa todo con textContent y después reemplaza
   únicamente las secuencias que quieras permitir.
================================================================
*/
