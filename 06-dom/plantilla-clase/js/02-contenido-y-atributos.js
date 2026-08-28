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
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Archivo por completar. Los separadores de sección y la prosa están
 *   colocados; el código se escribe en vivo siguiendo los "TODO (en clase)".
 *   La versión resuelta está en ../../js/02-contenido-y-atributos.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Consola visual de esta sección (viene ya escrita: es andamiaje).
  const consola = window.Consola.crear('salida-contenido');

  // TODO (en clase) - REFERENCIAS DE PARTIDA:
  //   Guarda en constantes los cuatro elementos de la zona de pruebas de esta
  //   sección. Se usan a lo largo de TODO el archivo, así que van los primeros:
  //     const parrafo        = document.getElementById('parrafo-precio');
  //     const enlace         = document.getElementById('enlace-demo');
  //     const campo          = document.getElementById('campo-demo');
  //     const tarjetaDataset = document.getElementById('tarjeta-dataset');
  //   (aprox. 4 líneas)

  // ============================================================
  // 1. textContent: EL TEXTO, TODO EL TEXTO Y NADA MÁS QUE EL TEXTO
  // ============================================================

  /*
    textContent devuelve el texto de un elemento y de todos sus descendientes,
    tal cual está en el HTML: incluye el texto de los elementos ocultos con CSS
    y conserva los espacios y saltos de línea del código fuente.

    Es rápido porque no necesita saber cómo se está pintando la página.
  */

  // TODO (en clase):
  //   1. consola.titulo('textContent');
  //   2. Imprime  JSON.stringify(parrafo.textContent)  con la etiqueta
  //      'textContent en crudo ->'. JSON.stringify se usa aquí para VER los
  //      saltos de línea (\n) y los espacios.
  //   3. Imprime  parrafo.textContent.length  con la etiqueta 'Longitud ->' y
  //      la palabra 'caracteres' al final.
  //   4. Imprime la frase literal
  //      'Incluye el <span> oculto por CSS: sí, lo ves ahí arriba.'
  //   (aprox. 4 líneas)

  // ============================================================
  // 2. innerText: LO QUE EL USUARIO REALMENTE VE
  // ============================================================

  /*
    innerText devuelve el texto tal y como se RENDERIZA: ignora lo que está
    oculto con display:none y normaliza los espacios sobrantes.

    Precio a pagar: para responder, el navegador necesita calcular los estilos.
    Eso es más lento. En un bucle de miles de vueltas se nota mucho.
  */

  // TODO (en clase):
  //   1. consola.titulo('innerText');
  //   2. Repite las tres líneas de la sección anterior cambiando textContent
  //      por innerText:
  //        'innerText en crudo ->' , JSON.stringify(parrafo.innerText)
  //        'Longitud ->' , parrafo.innerText.length , 'caracteres'
  //        'Fíjate: el texto oculto NO aparece y los espacios están limpios.'
  //   Resultado esperado en pantalla: una longitud MENOR que la de textContent.
  //   (aprox. 4 líneas)

  // ============================================================
  // 3. innerHTML: EL CONTENIDO COMO MARCADO
  // ============================================================

  /*
    innerHTML devuelve (y permite escribir) el HTML interno como texto.
    Al LEER, ves las etiquetas. Al ESCRIBIR, el navegador interpreta lo que
    le das y construye nodos reales.
  */

  // TODO (en clase):
  //   1. consola.titulo('innerHTML');
  //   2. Imprime  parrafo.innerHTML  con la etiqueta 'innerHTML ->'.
  //   3. Imprime la frase 'Aquí sí se ven las etiquetas <strong> y <span>.'
  //   (aprox. 3 líneas)

  // ============================================================
  // 4. LOS TRES, UNO AL LADO DEL OTRO
  // ============================================================

  // TODO (en clase):
  //   1. consola.titulo('COMPARATIVA RÁPIDA');
  //   2. Imprime estas cinco líneas literales, una por llamada:
  //        'textContent -> todo el texto, incluido lo oculto. RÁPIDO.'
  //        'innerText   -> solo lo visible, espacios normalizados. LENTO.'
  //        'innerHTML   -> el marcado completo. POTENTE Y PELIGROSO.'
  //        ''
  //        '✅ BUENA PRÁCTICA: si solo vas a poner texto, usa textContent.'
  //   (aprox. 6 líneas)

  // ============================================================
  // 5. ESCRIBIR CONTENIDO
  // ============================================================

  /*
    Escribir en cualquiera de las tres propiedades BORRA todo lo que había
    dentro del elemento y lo sustituye. No añade: reemplaza.
  */

  // TODO (en clase):
  //   1. consola.titulo('ESCRIBIR CONTENIDO');
  //   2. Crea un elemento de usar y tirar para no estropear la zona de pruebas:
  //        const cajaTemporal = document.createElement('div');
  //   3. Prueba textContent:
  //        cajaTemporal.textContent = '<b>Hola</b>';
  //      e imprime tres líneas: 'Con textContent, el HTML se ve como TEXTO:',
  //      '   innerHTML resultante ->' con cajaTemporal.innerHTML (sale escapado:
  //      &lt;b&gt;Hola&lt;/b&gt;) y '   (el navegador ha escapado los signos < y >)'.
  //   4. Prueba innerHTML:
  //        cajaTemporal.innerHTML = '<b>Hola</b>';
  //      e imprime 'Con innerHTML, el HTML se INTERPRETA:',
  //      '   textContent resultante ->' con cajaTemporal.textContent  -> Hola
  //      y '   hijos creados ->' con cajaTemporal.children.length  -> 1
  //      más el comentario '(un <b> de verdad)'.
  //   5. ⚠️ ERROR COMÚN: usar += con innerHTML dentro de un bucle. Imprime una
  //      línea en blanco y luego estas dos:
  //        '⚠️ ERROR COMÚN: caja.innerHTML += "..." dentro de un bucle.'
  //        '   Reconstruye todo el subárbol en cada vuelta y borra los eventos.'
  //      Explica de viva voz: cada += obliga al navegador a leer todo el HTML,
  //      unirlo y reconstruir TODOS los nodos desde cero.
  //   (aprox. 14 líneas)

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

  /*
    addEventListener se estudia a fondo en el proyecto de eventos. Aquí solo
    necesitamos saber que significa: "cuando ocurra 'click' en este botón,
    ejecuta esta función".

    ✅ BUENA PRÁCTICA: nunca lanzar demostraciones agresivas al cargar la
    página. Van dentro de un botón que el docente pulsa cuando quiere.
  */

  // TODO (en clase):
  //   1. Guarda las cuatro referencias de la caja de peligro:
  //        const campoXss    = document.getElementById('campo-xss');
  //        const destinoXss  = document.getElementById('destino-xss');
  //        const btnXssTexto = document.getElementById('btn-xss-texto');
  //        const btnXssHtml  = document.getElementById('btn-xss-html');
  //   2. btnXssTexto.addEventListener('click', function () { ... }) con la VÍA
  //      SEGURA dentro:  destinoXss.textContent = campoXss.value;
  //      y después consola.titulo('INSERCIÓN CON textContent (segura)') más:
  //        'Se ha insertado exactamente este texto:'
  //        campoXss.value
  //        'No se ha ejecutado nada. Las etiquetas se ven como letras.'
  //   3. btnXssHtml.addEventListener('click', function () { ... }) con la VÍA
  //      PELIGROSA:  destinoXss.innerHTML = campoXss.value;
  //      y después consola.titulo('INSERCIÓN CON innerHTML (peligrosa)') más:
  //        'El navegador ha construido nodos reales a partir del texto.'
  //        'Contenido final del destino ->' , destinoXss.textContent
  //        '⚠️ El atributo onerror de la imagen se ha ejecutado solo.'
  //        '   Imagina que ese código enviara las cookies a otro servidor.'
  //   Resultado esperado en pantalla: con el primer botón se ven las etiquetas
  //   escritas como letras; con el segundo, el destino pasa a decir
  //   "CODIGO AJENO EJECUTADO".
  //   (aprox. 20 líneas)

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

  // TODO (en clase):
  //   1. enlace.addEventListener('click', function (evento) { ... }) y dentro:
  //        evento.preventDefault();   // cancelamos la navegación
  //        consola.titulo('CLIC EN EL ENLACE DE PRUEBAS');
  //        'Se ha cancelado la navegación con evento.preventDefault().'
  //        'Destino que tenía ->' , enlace.href
  //   (aprox. 6 líneas)

  /*
    Un atributo es lo que se escribe dentro de la etiqueta en el HTML:
    <a href="..." title="..." data-tipo="...">

    Cuatro métodos para manejarlos, todos trabajan con TEXTO:
      getAttribute(nombre)          -> lee (string o null)
      setAttribute(nombre, valor)   -> crea o cambia
      removeAttribute(nombre)       -> elimina
      hasAttribute(nombre)          -> pregunta (true/false)
  */

  // TODO (en clase):
  //   1. consola.titulo('getAttribute / setAttribute / hasAttribute / removeAttribute');
  //   2. Imprime:
  //        'href  ->' , enlace.getAttribute('href')     -> pagina-inexistente.html
  //        'title ->' , enlace.getAttribute('title')    -> Enlace de ejemplo
  //        '¿tiene target? ->' , enlace.hasAttribute('target')   -> false
  //   3. Añade el atributo:  enlace.setAttribute('target', '_blank');
  //      e imprime 'Tras setAttribute("target", "_blank") ->' con hasAttribute -> true
  //   4. Quítalo:  enlace.removeAttribute('target');
  //      e imprime 'Tras removeAttribute("target")       ->' con hasAttribute -> false
  //   5. Imprime  enlace.getAttribute('inventado')  con la etiqueta
  //      'getAttribute("inventado") ->'. Da null, NO una cadena vacía.
  //   6. Lista completa de atributos:
  //        const nombresAtributos = Array.from(enlace.attributes).map((a) => a.name);
  //      e imprímela con 'Todos sus atributos ->'
  //   (aprox. 11 líneas)

  // ============================================================
  // 8. ATRIBUTO vs PROPIEDAD: LA TRAMPA CLÁSICA
  // ============================================================

  /*
    Muchos atributos tienen además una PROPIEDAD directa en el objeto
    (elemento.id, elemento.href, elemento.value...). No siempre valen lo mismo:

      - El ATRIBUTO guarda lo que estaba escrito en el HTML original.
      - La PROPIEDAD guarda el valor ACTUAL, ya interpretado por el navegador.
  */

  // TODO (en clase):
  //   1. consola.titulo('ATRIBUTO vs PROPIEDAD');
  //   2. CASO 1 (href): imprime
  //        'enlace.getAttribute("href") ->' , enlace.getAttribute('href')
  //        'enlace.href                 ->' , enlace.href
  //        '(la propiedad resuelve la ruta completa, con file:// o https://)'
  //   3. CASO 2 (value de un input): imprime una línea en blanco y luego
  //        'campo.value                 ->' , campo.value
  //        'campo.getAttribute("value") ->' , campo.getAttribute('value')
  //      Después cambia el valor:  campo.value = 'Texto cambiado desde JavaScript';
  //      y vuelve a imprimir los dos, con las coletillas '<- cambiado' y
  //      '<- ¡el original!' precedidos de la línea 'Después de campo.value = "...":'
  //      Cierra con:
  //        '⚠️ ERROR COMÚN: leer lo que escribió el usuario con getAttribute("value").'
  //        '✅ BUENA PRÁCTICA: para formularios usa SIEMPRE la propiedad .value'
  //   4. CASO 3 (class): la propiedad NO se llama class (palabra reservada), se
  //      llama className, aunque para esto usaremos classList (archivo 03).
  //      Imprime  parrafo.getAttribute('id')  y  parrafo.id  con las etiquetas
  //      'parrafo.getAttribute("id") ->' y 'parrafo.id                 ->'
  //      seguido de '(propiedad directa)'.
  //   Resultado esperado en pantalla: la propiedad .value cambia y el atributo
  //   sigue diciendo "Valor inicial del HTML".
  //   (aprox. 16 líneas)

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

  // TODO (en clase):
  //   1. consola.titulo('ATRIBUTOS data-* Y dataset');
  //   2. Imprime las cuatro traducciones sobre tarjetaDataset:
  //        'data-id           -> dataset.id         ->' , tarjetaDataset.dataset.id
  //        'data-categoria    -> dataset.categoria  ->' , ...dataset.categoria
  //        'data-precio-base  -> dataset.precioBase ->' , ...dataset.precioBase
  //        'data-en-oferta    -> dataset.enOferta   ->' , ...dataset.enOferta
  //   3. ⚠️ ERROR COMÚN NÚMERO DOS: creer que dataset devuelve números o
  //      booleanos. TODO lo que sale de dataset es TEXTO. Siempre.
  //      Declara  const precioTexto = tarjetaDataset.dataset.precioBase;
  //      e imprime:
  //        'typeof dataset.precioBase ->' , typeof precioTexto , '<- ¡texto, no número!'
  //        'precioTexto + 10 ->' , precioTexto + 10 , '<- concatena, no suma'
  //      (sale "49.9010")
  //   4. Conversión a mano:  const precioNumero = Number(precioTexto);
  //      Imprime 'Number(precioTexto) + 10 ->' , precioNumero + 10 , '<- ahora sí suma'
  //   5. Lo mismo con booleanos:  const enOfertaTexto = tarjetaDataset.dataset.enOferta;
  //      Imprime:
  //        'dataset.enOferta === true    ->' , enOfertaTexto === true   , '<- false: es texto'
  //        'dataset.enOferta === "true"  ->' , enOfertaTexto === 'true' , '<- así sí'
  //        'Boolean("false") ->' , Boolean('false') , '<- ¡trampa mortal!'
  //      ⚠️ OJO: cualquier texto no vacío es "verdadero" en un if. Incluso "false".
  //   6. Escribir en dataset CREA el atributo en el HTML:
  //        tarjetaDataset.dataset.stock = '12';                   // data-stock="12"
  //        tarjetaDataset.dataset.ultimaRevision = '2026-08-26';  // data-ultima-revision
  //      Imprime 'Tras escribir en dataset, el HTML del elemento es:' y luego
  //        tarjetaDataset.outerHTML.split('>')[0] + '>'
  //   7. Borrar con delete:  delete tarjetaDataset.dataset.ultimaRevision;
  //      Imprime 'Tras delete dataset.ultimaRevision ->' con
  //        tarjetaDataset.hasAttribute('data-ultima-revision')   -> false
  //   8. Recorrer todos los data-* con Object.entries (devuelve pares [clave, valor]):
  //        Object.entries(tarjetaDataset.dataset).forEach(function (par) {
  //          consola.imprimir('   ' + par[0] + ' = ' + par[1]);
  //        });
  //      precedido de la línea 'Todos los data-* de la tarjeta:'
  //   (aprox. 26 líneas)
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
