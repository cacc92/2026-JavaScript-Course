/**
 * ARCHIVO: js/03-clases-y-estilos.js
 * PROYECTO: 06 - Manipulación del DOM
 * ------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   - classList y sus métodos: add, remove, toggle, contains, replace.
 *   - Por qué className es peligroso y classList no.
 *   - Estilos en línea con element.style y sus limitaciones.
 *   - getComputedStyle: leer el estilo REAL que aplica el navegador.
 *   - Variables CSS leídas y escritas desde JavaScript.
 *
 * QUÉ APRENDERÁS
 *   - La regla de oro del front end: JavaScript pone la clase, CSS decide
 *     cómo se ve esa clase.
 *
 * NOTA DE LA PLANTILLA DE CLASE
 *   Archivo por completar. Los separadores de sección y la prosa están
 *   colocados; el código se escribe en vivo siguiendo los "TODO (en clase)".
 *   La versión resuelta está en ../../js/03-clases-y-estilos.js
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // Consola visual de esta sección (viene ya escrita: es andamiaje).
  const consola = window.Consola.crear('salida-clases');

  // TODO (en clase) - REFERENCIAS DE PARTIDA:
  //   Guarda la caja de color y los tres botones de la sección 4 del HTML:
  //     const caja        = document.getElementById('caja-clases');
  //     const btnToggle   = document.getElementById('btn-toggle-clase');
  //     const btnReplace  = document.getElementById('btn-replace-clase');
  //     const btnComputed = document.getElementById('btn-computed');
  //   (aprox. 4 líneas)

  // ============================================================
  // 1. LEER LAS CLASES DE UN ELEMENTO
  // ============================================================

  /*
    Un elemento puede llevar varias clases separadas por espacios:
        <div class="caja-color tema-frio">

    Tenemos dos formas de acceder a ellas:
      - className : un ÚNICO texto con todas las clases juntas.
      - classList : una lista manejable, con métodos para añadir y quitar.
  */

  // TODO (en clase):
  //   1. consola.titulo('className vs classList');
  //   2. Imprime:
  //        'caja.className ->' , caja.className          -> caja-color tema-frio
  //        'typeof className ->' , typeof caja.className , '(un simple texto)'
  //        ''
  //        'caja.classList        ->' , Array.from(caja.classList)
  //        'caja.classList.length ->' , caja.classList.length      -> 2
  //        'caja.classList.item(0)->' , caja.classList.item(0)     -> caja-color
  //   (aprox. 6 líneas)

  // ============================================================
  // 2. POR QUÉ className ES PELIGROSO
  // ============================================================

  /*
    className es un texto: al asignarle un valor SUSTITUYES todas las clases.
    Si el elemento tenía otras clases importantes, las acabas de borrar.

    Analogía: className es repintar la pared entera; classList es pegar o
    quitar una pegatina concreta sin tocar el resto.
  */

  // TODO (en clase):
  //   1. consola.titulo('EL PELIGRO DE className');
  //   2. Trabaja sobre un elemento de mentira para no romper la caja real:
  //        const pruebas = document.createElement('div');
  //        pruebas.className = 'tarjeta activa seleccionada';
  //      Imprime 'Clases iniciales ->' con pruebas.className.
  //   3. ⚠️ ERROR COMÚN: querer "añadir" una clase con className y borrarlo todo.
  //        pruebas.className = 'destacada';
  //      Imprime 'Tras className = "destacada" ->' con pruebas.className y luego
  //      la línea '⚠️ Han desaparecido tarjeta, activa y seleccionada.'
  //   4. El apaño del código antiguo (concatenar con un espacio delante):
  //        pruebas.className = 'tarjeta activa seleccionada';
  //        pruebas.className += ' destacada';
  //      Imprime una línea en blanco, 'Apaño con += ->' con el valor y
  //      'Funciona, pero si lo repites duplicas la clase:'
  //      Repite  pruebas.className += ' destacada';  e imprime
  //      '   Repetido ->' con el valor y la coletilla '<- "destacada" dos veces'.
  //   5. Cierra con '✅ BUENA PRÁCTICA: usa classList y olvídate de estos problemas.'
  //   (aprox. 13 líneas)

  // ============================================================
  // 3. classList.add() Y classList.remove()
  // ============================================================

  /*
    add() añade una o varias clases. Si ya está, no la duplica.
    remove() quita una o varias. Si no está, no protesta ni da error.
    Ambos aceptan varios argumentos separados por comas.
  */

  // TODO (en clase):
  //   1. consola.titulo('add() y remove()');
  //   2. Crea el elemento de pruebas de esta sección (se reutiliza en la 4 y la 5):
  //        const demo = document.createElement('div');
  //        demo.className = 'tarjeta';
  //   3. Ejecuta y comenta paso a paso, imprimiendo demo.className cada vez:
  //        demo.classList.add('activa');                 -> 'Tras add("activa")   ->'
  //        demo.classList.add('activa');   // repetido   -> 'add("activa") repetido ->' , '<- no se duplica'
  //        demo.classList.add('grande', 'con-sombra');   -> 'Tras add("grande", "con-sombra") ->'
  //        demo.classList.remove('grande');              -> 'Tras remove("grande") ->'
  //        demo.classList.remove('no-existe');           -> imprime
  //          'remove de una clase inexistente -> sin error, todo sigue igual'
  //   (aprox. 12 líneas)

  // ============================================================
  // 4. classList.contains() Y classList.toggle()
  // ============================================================

  /*
    contains() responde true/false: "¿lleva esta clase?".
    toggle() es un interruptor: si la tiene la quita, si no la tiene la pone.
    Además, toggle() DEVUELVE true si la clase quedó puesta y false si quedó quitada.

    toggle admite un segundo argumento (forzar) que decide el resultado:
        elemento.classList.toggle('activa', true)   -> la pone, esté o no
        elemento.classList.toggle('activa', false)  -> la quita, esté o no
    Es utilísimo: classList.toggle('error', hayError) en una sola línea.
  */

  // TODO (en clase):
  //   1. consola.titulo('contains() y toggle()');
  //   2. Imprime  demo.classList.contains('activa')  -> true  y
  //      demo.classList.contains('invisible')        -> false
  //      con las etiquetas 'demo.classList.contains("activa")    ->' y
  //      'demo.classList.contains("invisible") ->'.
  //   3. Guarda el valor devuelto por toggle en una variable REASIGNABLE:
  //        let resultado = demo.classList.toggle('resaltada');
  //      e imprime 'toggle("resaltada") -> devuelve', resultado, '| clases:', demo.className
  //      Repite el toggle reasignando  resultado  y vuelve a imprimir la misma línea:
  //      la primera vez devuelve true y la segunda false.
  //   4. Forzado con segundo argumento:
  //        demo.classList.toggle('activa', true);   -> 'toggle("activa", true)  -> forzamos ponerla:' , demo.className
  //        demo.classList.toggle('activa', false);  -> 'toggle("activa", false) -> forzamos quitarla:' , demo.className
  //   (aprox. 10 líneas)

  // ============================================================
  // 5. classList.replace()
  // ============================================================

  /*
    replace(vieja, nueva) cambia una clase por otra CONSERVANDO su posición.
    Devuelve true si el cambio se hizo y false si la clase vieja no estaba.
    Perfecto para temas: tema-frio -> tema-calido.
  */

  // TODO (en clase):
  //   1. consola.titulo('replace()');
  //   2. Prepara el elemento:  demo.className = 'tarjeta tema-frio con-sombra';
  //   3. Cambio que SÍ ocurre:
  //        const cambiado = demo.classList.replace('tema-frio', 'tema-calido');
  //      Imprime 'replace("tema-frio","tema-calido") ->', cambiado, '|', demo.className
  //      (devuelve true y la clase queda en la MISMA posición del medio)
  //   4. Cambio que NO ocurre:
  //        const noCambiado = demo.classList.replace('tema-inexistente', 'tema-x');
  //      Imprime 'replace de una clase que no está   ->', noCambiado, '<- devuelve false'
  //   (aprox. 6 líneas)

  // ============================================================
  // 6. BOTONES DE DEMOSTRACIÓN EN VIVO
  // ============================================================

  /*
    Los tres botones de esta sección actúan sobre la caja azul de arriba.
    Como el CSS tiene una transición, el cambio de clase se ve animado:
    es la mejor forma de que la clase "se vea" en clase.
  */

  // TODO (en clase):
  //   1. btnToggle.addEventListener('click', function () { ... }) y dentro:
  //        const quedaPuesta = caja.classList.toggle('destacada');
  //        consola.titulo('toggle("destacada") pulsado');
  //        '¿La clase ha quedado puesta? ->' , quedaPuesta
  //        'Clases actuales ->' , caja.className
  //        'El CSS de .destacada aplica scale(1.03) y un halo morado.'
  //   2. btnReplace.addEventListener('click', function () { ... }) y dentro haz el
  //      intercambio en LOS DOS SENTIDOS, para que el botón se pueda pulsar muchas
  //      veces. Aprovecha el valor devuelto por replace(): si no pudo cambiar
  //      frío -> cálido, es que ya estaba cálido, así que se hace el inverso.
  //        const haCambiado = caja.classList.replace('tema-frio', 'tema-calido');
  //        if (!haCambiado) { caja.classList.replace('tema-calido', 'tema-frio'); }
  //        consola.titulo('replace() pulsado');
  //        '¿Cambió de frío a cálido? ->' , haCambiado
  //        'Clases actuales ->' , caja.className
  //   Resultado esperado en pantalla: la caja se agranda con halo morado con el
  //   primer botón y alterna entre azul y naranja con el segundo.
  //   (aprox. 20 líneas)

  // ============================================================
  // 7. ESTILOS EN LÍNEA CON element.style
  // ============================================================

  /*
    element.style escribe en el atributo style="" del elemento, es decir,
    estilos EN LÍNEA. Tiene dos peculiaridades importantes:

      1) Los nombres van en camelCase:
             background-color   ->   style.backgroundColor
             font-size          ->   style.fontSize
             border-top-width   ->   style.borderTopWidth

      2) Los valores son TEXTO y casi siempre necesitan unidad:
             style.width = 200      -> no hace nada (falta "px")
             style.width = '200px'  -> correcto
  */

  // TODO (en clase):
  //   1. consola.titulo('element.style');
  //   2. Crea un elemento suelto:  const cajaEstilo = document.createElement('div');
  //   3. ⚠️ ERROR COMÚN: olvidar las comillas y las unidades.
  //        cajaEstilo.style.width = 200;
  //      Imprime 'style.width = 200      ->' , JSON.stringify(cajaEstilo.style.width) ,
  //      '<- ignorado'   (sale "" porque el navegador descarta el valor sin unidad)
  //        cajaEstilo.style.width = '200px';
  //      Imprime 'style.width = "200px"  ->' , cajaEstilo.style.width , '<- correcto'
  //   4. ⚠️ ERROR COMÚN: escribir el nombre con guiones. En JS va en camelCase:
  //        cajaEstilo.style.backgroundColor = '#38bdf8';
  //        cajaEstilo.style.fontSize = '1.2rem';
  //      Imprime 'Atributo style generado ->' , cajaEstilo.getAttribute('style')
  //   5. setProperty acepta el nombre REAL con guiones:
  //        cajaEstilo.style.setProperty('border-radius', '12px');
  //      Imprime 'Tras setProperty("border-radius") ->' con el atributo style.
  //   6. Y removeProperty las quita:
  //        cajaEstilo.style.removeProperty('font-size');
  //      Imprime 'Tras removeProperty("font-size")  ->' con el atributo style.
  //   (aprox. 12 líneas)

  /*
    ¿POR QUÉ ES MEJOR USAR CLASES QUE element.style?

    1) Separación de responsabilidades: el diseño vive en el CSS, la lógica
       en el JS. Si el diseñador cambia un color, no toca JavaScript.
    2) Un estilo en línea gana casi siempre en especificidad y luego es un
       infierno sobrescribirlo desde la hoja de estilos.
    3) Con una clase cambias diez propiedades de golpe; con style, diez líneas.
    4) Las transiciones y las media queries se escriben mucho mejor en CSS.

    ✅ BUENA PRÁCTICA: usa element.style solo para valores que el CSS no puede
    saber de antemano: una posición calculada, un porcentaje de progreso o,
    como en el proyecto de esta página, un color elegido por el usuario.
  */

  // TODO (en clase):
  //   Cierra la sección imprimiendo una línea en blanco y estas dos:
  //     '✅ Regla de oro: JS pone la clase, CSS decide cómo se ve.'
  //     '   element.style se reserva para valores calculados.'
  //   (aprox. 3 líneas)

  // ============================================================
  // 8. getComputedStyle: EL ESTILO REAL
  // ============================================================

  /*
    element.style SOLO lee los estilos en línea. Si el color viene de la hoja
    de estilos, element.style.color devuelve una cadena vacía.

    Para saber qué está aplicando REALMENTE el navegador se usa
    getComputedStyle(elemento), que devuelve todos los valores ya calculados:
    resuelve variables CSS, hereda, convierte rem a px, etc.

    OJO: es de solo lectura, y llamarlo obliga al navegador a recalcular
    estilos, así que evítalo dentro de bucles grandes.
  */

  // TODO (en clase):
  //   1. btnComputed.addEventListener('click', function () { ... }) y dentro:
  //        consola.titulo('getComputedStyle()');
  //   2. Primero lo que hay en el atributo style="" (probablemente vacío):
  //        'caja.style.backgroundColor ->' , JSON.stringify(caja.style.backgroundColor) ,
  //        '<- vacío: viene del CSS'
  //   3. Después lo que aplica el navegador de verdad:
  //        const estilos = getComputedStyle(caja);
  //      e imprime, una línea por cada uno:
  //        'computed backgroundColor   ->' , estilos.backgroundColor
  //        'computed borderTopColor    ->' , estilos.borderTopColor
  //        'computed fontSize          ->' , estilos.fontSize , '(siempre en px)'
  //        'computed padding           ->' , estilos.padding
  //        'computed display           ->' , estilos.display
  //      Pedimos borderTopColor y no borderColor a propósito: las propiedades
  //      "resumidas" (border, margin, background...) pueden devolver cadena vacía
  //      en algunos navegadores cuando los cuatro lados no coinciden. Las
  //      propiedades concretas (borderTopColor, marginLeft...) siempre responden.
  //   4. También se pueden leer las variables CSS declaradas en :root:
  //        const raiz = getComputedStyle(document.documentElement);
  //      Imprime una línea en blanco, 'Variables CSS del proyecto:' y luego
  //        '   --primario ->' , raiz.getPropertyValue('--primario').trim()
  //        '   --acento   ->' , raiz.getPropertyValue('--acento').trim()
  //        '   --radio    ->' , raiz.getPropertyValue('--radio').trim()
  //        '(getPropertyValue devuelve el valor con espacios: usa trim())'
  //   (aprox. 18 líneas)

  // ============================================================
  // 9. ESCRIBIR VARIABLES CSS DESDE JAVASCRIPT
  // ============================================================

  /*
    Truco muy potente: en vez de cambiar cien elementos uno a uno, cambias
    UNA variable CSS en la raíz y todo lo que la use se actualiza solo.
    Así se implementan los modos claro/oscuro y los temas personalizados.

    Aquí solo lo demostramos por consola para no alterar el diseño de la
    página; en los ejercicios te tocará aplicarlo de verdad.
  */

  // TODO (en clase):
  //   1. consola.titulo('VARIABLES CSS DESDE JAVASCRIPT');
  //   2. Imprime estas tres líneas literales (la del medio se imprime con
  //      comillas dobles fuera y simples dentro, porque el texto lleva
  //      apóstrofos):
  //        'Para cambiar el color primario de TODA la página:'
  //        "   document.documentElement.style.setProperty('--primario', '#f472b6');"
  //        'Una sola línea reestiliza decenas de elementos a la vez.'
  //   (aprox. 4 líneas)
})();

/*
================================================================
EJERCICIOS PROPUESTOS
================================================================
1) Añade un botón que ponga la clase "destacado" a TODOS los productos de la
   sección 2 y otro que se la quite. Pista: querySelectorAll + forEach.

2) Escribe una función  alternarTema()  que cambie la variable CSS --primario
   entre azul (#38bdf8) y rosa (#f472b6) cada vez que se llama. Comprueba con
   getComputedStyle que el valor ha cambiado de verdad.

3) Crea una función  marcarSiEsLargo(elemento)  que añada la clase "destacado"
   solo si el texto del elemento tiene más de 20 caracteres, usando la forma
   corta: classList.toggle('destacado', condicion).

4) Investiga la diferencia entre  caja.style.display = 'none'  y añadir una
   clase .invisible con display:none. ¿Cuál es más fácil de deshacer? ¿Por qué?

5) RETO: crea una barra de progreso. Un <div> exterior con una clase del CSS y
   un <div> interior cuyo ancho se fije con element.style.width en porcentaje.
   Añade un botón que la suba de 10 en 10 hasta 100 y cambie de color a verde
   (añadiendo una clase) cuando llegue al final.
================================================================
*/
