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
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const consola = window.Consola.crear('salida-clases');

  const caja = document.getElementById('caja-clases');
  const btnToggle = document.getElementById('btn-toggle-clase');
  const btnReplace = document.getElementById('btn-replace-clase');
  const btnComputed = document.getElementById('btn-computed');

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

  consola.titulo('className vs classList');

  consola.imprimir('caja.className ->', caja.className);
  consola.imprimir('typeof className ->', typeof caja.className, '(un simple texto)');
  consola.imprimir('');
  consola.imprimir('caja.classList        ->', Array.from(caja.classList));
  consola.imprimir('caja.classList.length ->', caja.classList.length);
  consola.imprimir('caja.classList.item(0)->', caja.classList.item(0));

  // ============================================================
  // 2. POR QUÉ className ES PELIGROSO
  // ============================================================

  /*
    className es un texto: al asignarle un valor SUSTITUYES todas las clases.
    Si el elemento tenía otras clases importantes, las acabas de borrar.

    Analogía: className es repintar la pared entera; classList es pegar o
    quitar una pegatina concreta sin tocar el resto.
  */

  consola.titulo('EL PELIGRO DE className');

  // Trabajamos sobre un elemento de mentira para no romper la caja real.
  const pruebas = document.createElement('div');
  pruebas.className = 'tarjeta activa seleccionada';
  consola.imprimir('Clases iniciales ->', pruebas.className);

  // ⚠️ ERROR COMÚN: querer "añadir" una clase con className y borrarlo todo.
  pruebas.className = 'destacada';
  consola.imprimir('Tras className = "destacada" ->', pruebas.className);
  consola.imprimir('⚠️ Han desaparecido tarjeta, activa y seleccionada.');

  // El apaño que se ve en código antiguo: concatenar con un espacio delante.
  pruebas.className = 'tarjeta activa seleccionada';
  pruebas.className += ' destacada';
  consola.imprimir('');
  consola.imprimir('Apaño con += ->', pruebas.className);
  consola.imprimir('Funciona, pero si lo repites duplicas la clase:');
  pruebas.className += ' destacada';
  consola.imprimir('   Repetido ->', pruebas.className, '<- "destacada" dos veces');
  consola.imprimir('✅ BUENA PRÁCTICA: usa classList y olvídate de estos problemas.');

  // ============================================================
  // 3. classList.add() Y classList.remove()
  // ============================================================

  /*
    add() añade una o varias clases. Si ya está, no la duplica.
    remove() quita una o varias. Si no está, no protesta ni da error.
    Ambos aceptan varios argumentos separados por comas.
  */

  consola.titulo('add() y remove()');

  const demo = document.createElement('div');
  demo.className = 'tarjeta';

  demo.classList.add('activa');
  consola.imprimir('Tras add("activa")   ->', demo.className);

  demo.classList.add('activa'); // otra vez la misma
  consola.imprimir('add("activa") repetido ->', demo.className, '<- no se duplica');

  demo.classList.add('grande', 'con-sombra'); // varias de golpe
  consola.imprimir('Tras add("grande", "con-sombra") ->', demo.className);

  demo.classList.remove('grande');
  consola.imprimir('Tras remove("grande") ->', demo.className);

  demo.classList.remove('no-existe'); // no pasa nada, no hay error
  consola.imprimir('remove de una clase inexistente -> sin error, todo sigue igual');

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

  consola.titulo('contains() y toggle()');

  consola.imprimir('demo.classList.contains("activa")    ->', demo.classList.contains('activa'));
  consola.imprimir('demo.classList.contains("invisible") ->', demo.classList.contains('invisible'));

  let resultado = demo.classList.toggle('resaltada');
  consola.imprimir('toggle("resaltada") -> devuelve', resultado, '| clases:', demo.className);

  resultado = demo.classList.toggle('resaltada');
  consola.imprimir('toggle("resaltada") -> devuelve', resultado, '| clases:', demo.className);

  demo.classList.toggle('activa', true);
  consola.imprimir('toggle("activa", true)  -> forzamos ponerla:', demo.className);

  demo.classList.toggle('activa', false);
  consola.imprimir('toggle("activa", false) -> forzamos quitarla:', demo.className);

  // ============================================================
  // 5. classList.replace()
  // ============================================================

  /*
    replace(vieja, nueva) cambia una clase por otra CONSERVANDO su posición.
    Devuelve true si el cambio se hizo y false si la clase vieja no estaba.
    Perfecto para temas: tema-frio -> tema-calido.
  */

  consola.titulo('replace()');

  demo.className = 'tarjeta tema-frio con-sombra';
  const cambiado = demo.classList.replace('tema-frio', 'tema-calido');
  consola.imprimir('replace("tema-frio","tema-calido") ->', cambiado, '|', demo.className);

  const noCambiado = demo.classList.replace('tema-inexistente', 'tema-x');
  consola.imprimir('replace de una clase que no está   ->', noCambiado, '<- devuelve false');

  // ============================================================
  // 6. BOTONES DE DEMOSTRACIÓN EN VIVO
  // ============================================================

  /*
    Los tres botones de esta sección actúan sobre la caja azul de arriba.
    Como el CSS tiene una transición, el cambio de clase se ve animado:
    es la mejor forma de que la clase "se vea" en clase.
  */

  btnToggle.addEventListener('click', function () {
    // toggle devuelve si la clase quedó puesta: lo aprovechamos para el mensaje.
    const quedaPuesta = caja.classList.toggle('destacada');

    consola.titulo('toggle("destacada") pulsado');
    consola.imprimir('¿La clase ha quedado puesta? ->', quedaPuesta);
    consola.imprimir('Clases actuales ->', caja.className);
    consola.imprimir('El CSS de .destacada aplica scale(1.03) y un halo morado.');
  });

  btnReplace.addEventListener('click', function () {
    /*
      Hacemos el intercambio en los dos sentidos para que el botón se pueda
      pulsar muchas veces. Fíjate en cómo usamos el valor devuelto por
      replace() para decidir: si no pudo cambiar frío -> cálido, es que ya
      estaba cálido, así que hacemos el cambio inverso.
    */
    const haCambiado = caja.classList.replace('tema-frio', 'tema-calido');

    if (!haCambiado) {
      caja.classList.replace('tema-calido', 'tema-frio');
    }

    consola.titulo('replace() pulsado');
    consola.imprimir('¿Cambió de frío a cálido? ->', haCambiado);
    consola.imprimir('Clases actuales ->', caja.className);
  });

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

  consola.titulo('element.style');

  const cajaEstilo = document.createElement('div');

  // ⚠️ ERROR COMÚN: olvidar las comillas y las unidades.
  cajaEstilo.style.width = 200;
  consola.imprimir('style.width = 200      ->', JSON.stringify(cajaEstilo.style.width), '<- ignorado');

  cajaEstilo.style.width = '200px';
  consola.imprimir('style.width = "200px"  ->', cajaEstilo.style.width, '<- correcto');

  // ⚠️ ERROR COMÚN: escribir el nombre con guiones.
  cajaEstilo.style.backgroundColor = '#38bdf8';
  cajaEstilo.style.fontSize = '1.2rem';
  consola.imprimir('Atributo style generado ->', cajaEstilo.getAttribute('style'));

  // Para propiedades con guiones también existe setProperty (acepta el nombre real)
  cajaEstilo.style.setProperty('border-radius', '12px');
  consola.imprimir('Tras setProperty("border-radius") ->', cajaEstilo.getAttribute('style'));

  // Y removeProperty para quitarlas
  cajaEstilo.style.removeProperty('font-size');
  consola.imprimir('Tras removeProperty("font-size")  ->', cajaEstilo.getAttribute('style'));

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

  consola.imprimir('');
  consola.imprimir('✅ Regla de oro: JS pone la clase, CSS decide cómo se ve.');
  consola.imprimir('   element.style se reserva para valores calculados.');

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

  btnComputed.addEventListener('click', function () {
    consola.titulo('getComputedStyle()');

    // Lo que hay en el atributo style="" (probablemente vacío)
    consola.imprimir('caja.style.backgroundColor ->',
      JSON.stringify(caja.style.backgroundColor), '<- vacío: viene del CSS');

    // Lo que aplica el navegador de verdad
    const estilos = getComputedStyle(caja);
    consola.imprimir('computed backgroundColor   ->', estilos.backgroundColor);
    // Pedimos borderTopColor y no borderColor a propósito: las propiedades
    // "resumidas" (border, margin, background...) pueden devolver cadena vacía
    // en algunos navegadores cuando los cuatro lados no coinciden. Las
    // propiedades concretas (borderTopColor, marginLeft...) siempre responden.
    consola.imprimir('computed borderTopColor    ->', estilos.borderTopColor);
    consola.imprimir('computed fontSize          ->', estilos.fontSize, '(siempre en px)');
    consola.imprimir('computed padding           ->', estilos.padding);
    consola.imprimir('computed display           ->', estilos.display);

    // También podemos leer las variables CSS declaradas en :root
    const raiz = getComputedStyle(document.documentElement);
    consola.imprimir('');
    consola.imprimir('Variables CSS del proyecto:');
    consola.imprimir('   --primario ->', raiz.getPropertyValue('--primario').trim());
    consola.imprimir('   --acento   ->', raiz.getPropertyValue('--acento').trim());
    consola.imprimir('   --radio    ->', raiz.getPropertyValue('--radio').trim());
    consola.imprimir('(getPropertyValue devuelve el valor con espacios: usa trim())');
  });

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

  consola.titulo('VARIABLES CSS DESDE JAVASCRIPT');
  consola.imprimir('Para cambiar el color primario de TODA la página:');
  consola.imprimir("   document.documentElement.style.setProperty('--primario', '#f472b6');");
  consola.imprimir('Una sola línea reestiliza decenas de elementos a la vez.');
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
