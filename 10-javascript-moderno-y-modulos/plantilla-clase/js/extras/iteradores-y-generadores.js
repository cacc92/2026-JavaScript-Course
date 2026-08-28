/**
 * ============================================================
 * ARCHIVO: js/extras/iteradores-y-generadores.js
 * TEMA: Protocolo iterable, Symbol.iterator y funciones generadoras
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO
 *  - Que significa que algo sea ITERABLE y por que for...of funciona
 *    con arrays, strings, Map y Set pero NO con objetos normales.
 *  - El protocolo ITERADOR: un objeto con un metodo next() que
 *    devuelve { value, done }.
 *  - Como implementar Symbol.iterator A MANO en un objeto y en una clase.
 *  - Funciones generadoras: function* y yield.
 *  - Un generador de identificadores y un generador INFINITO de Fibonacci.
 *  - Delegacion con yield*, envio de valores con next(valor) y cierre
 *    anticipado con return().
 *  - Evaluacion perezosa: calcular solo lo que se pide.
 *
 * ANALOGIA CENTRAL
 * Un ITERABLE es un libro. Un ITERADOR es el marcapaginas: sabe por
 * que pagina vas y sabe pasar a la siguiente. Un GENERADOR es un libro
 * que se escribe solo, pagina a pagina, justo cuando la pides.
 * ============================================================
 */

/* ============================================================
   MODO CLASE
   ------------------------------------------------------------
   El tema mas abstracto del proyecto. Conviene escribirlo despacio y
   parar en cada `yield` a preguntar a la clase que va a pasar.

   main.js llama a estas funciones agrupadas en dos botones:
     boton "iteradores":  demoProtocoloIterable, demoIteradorPropio
     boton "generadores": demoGeneradores, demoCasoPractico
   Y ademas hay que exportar: crearRango, ListaDeEspera, generadorDeIds,
   fibonacci, tomar, filtrarPerezoso, mapearPerezoso, recorrerContenidos.

   Tiempo estimado: 40 minutos.
   ============================================================ */

// TODO (en clase):
//   Marca de evaluacion, fuera de toda funcion:
//     console.log('[iteradores-y-generadores.js] Modulo evaluado.');
//   (aprox. 1 linea)

// ============================================================
// 1. QUE ES SER ITERABLE
// ============================================================

// TODO (en clase) — export function demoProtocoloIterable(consola)
//   1. consola.titulo('Que cosas son iterables de fabrica')
//      Un objeto es ITERABLE si tiene un metodo bajo la clave especial
//      Symbol.iterator. Los corchetes son necesarios porque la clave no
//      es un texto, es un simbolo.
//      Construye un objeto `candidatos` con estas siete entradas (son datos,
//      copialos del archivo resuelto):
//        'array [1,2,3]', 'texto "hola"', 'Set', 'Map', 'objeto plano',
//        'NodeList' (document.querySelectorAll('h2')) y
//        'arguments-like' ({ 0: 'a', 1: 'b', length: 2 })
//      Recorrelo con `for (const [nombre, valor] of Object.entries(candidatos))`
//      y en cada vuelta imprime
//        `${nombre.padEnd(18, '.')} iterable: ${typeof valor?.[Symbol.iterator] === 'function'}`
//      Resultado esperado: true en los cinco primeros, false en 'objeto plano'
//      y en 'arguments-like'.
//      "-> Por eso for...of NO funciona con objetos planos."
//      "   Para recorrer un objeto se usa Object.entries(objeto)."
//   2. consola.titulo('El protocolo iterador, paso a paso')
//      Haz a mano lo que for...of hace por dentro:
//        const asignaturas = ['HTML', 'CSS', 'JavaScript'];
//        const marcapaginas = asignaturas[Symbol.iterator]();
//      e imprime CUATRO llamadas a marcapaginas.next(). La cuarta debe salir
//      con done: true y value: undefined.
//      "-> for...of hace exactamente esto y para cuando done es true."
//   (aprox. 22 lineas)

// ============================================================
// 2. IMPLEMENTAR Symbol.iterator A MANO
// ============================================================

// TODO (en clase) — export function crearRango(desde, hasta, paso = 1)
//   Un objeto "rango" que se puede recorrer con for...of. Se construye con
//   una funcion normal que devuelve un objeto literal con la clave computada
//   [Symbol.iterator].
//   1. Devuelve un objeto con las propiedades desde, hasta, paso y el metodo
//      `[Symbol.iterator]() { ... }`. El nombre del metodo va entre corchetes
//      porque es un simbolo, no un texto.
//   2. Dentro del metodo, guarda `let actual = this.desde;` y las constantes
//      `limite` y `salto`. `actual` vive en la CLAUSURA del iterador: cada vez
//      que alguien pide un iterador nuevo, empieza otra vez desde el principio.
//   3. Devuelve el objeto ITERADOR con:
//      - next(): mientras actual <= limite devuelve { value, done: false } y
//        avanza; despues { value: undefined, done: true }. Ese es EL CONTRATO.
//      - return(): OPCIONAL pero recomendable. Si el bucle se corta con break,
//        el motor lo llama para que podamos limpiar recursos. Haz un
//        console.log('[rango] El bucle se interrumpio antes de terminar.')
//        y devuelve { value: undefined, done: true }.
//      - [Symbol.iterator]() { return this; }  <- truco util: hacer que el
//        propio iterador sea iterable, para poder pasarlo a otro for...of.
//   (aprox. 32 lineas)

// TODO (en clase) — export class ListaDeEspera
//   La misma idea, pero con una CLASE. Aqui el metodo iterador es a la vez
//   un GENERADOR (fijate en el asterisco): asi nos ahorramos escribir next()
//   a mano. Es la forma corta y la que se usa en el mundo real.
//   1. Campo privado de clase: `#personas = [];` (el # es parte del nombre).
//   2. `constructor(...personas)` que haga `this.#personas = [...personas];`
//   3. `agregar(persona)`: push y `return this;` para poder ENCADENAR llamadas.
//   4. `get cantidad()` que devuelva this.#personas.length.
//   5. Metodo generador que ademas es el iterador de la clase:
//        *[Symbol.iterator]() { for (const persona of this.#personas) yield persona; }
//   6. Un segundo recorrido, en orden inverso, expuesto como metodo normal:
//        *enOrdenInverso() { ...bucle descendente con yield... }
//   (aprox. 24 lineas)

// TODO (en clase) — export function demoIteradorPropio(consola)
//   1. consola.titulo('Un objeto rango con Symbol.iterator escrito a mano')
//      `const rango = crearRango(1, 10, 3);` y recorrelo con for...of
//      acumulando en un array. Resultado esperado: [1, 4, 7, 10].
//      Demuestra que funciona con TODO lo que consume iterables: [...rango],
//      Array.from(rango), un destructuring `const [a, b] = rango` y
//      `new Set(crearRango(1, 3))`.
//      Recorre dos veces `crearRango(1, 4)` para ver que cada for...of pide un
//      iterador NUEVO y por eso se puede recorrer mas de una vez.
//   2. consola.titulo('Interrumpir con break llama al metodo return()')
//      `for (const numero of crearRango(1, 100)) { if (numero > 3) break; ... }`
//      El mensaje de return() sale en la consola del navegador (F12).
//   3. consola.titulo('La misma idea con una clase')
//      `const cola = new ListaDeEspera('Ana', 'Luis');` y encadena
//      `cola.agregar('Camila').agregar('Diego');`. Imprime cola.cantidad,
//      [...cola], [...cola.enOrdenInverso()] y una lista numerada recorriendo
//      `[...cola].entries()`.
//   Resultado esperado: cantidad 4 | orden de llegada Ana, Luis, Camila, Diego
//   (aprox. 24 lineas)

// ============================================================
// 3. FUNCIONES GENERADORAS: function* y yield
// ============================================================

// TODO (en clase) — export function* generadorDeIds(prefijo = 'EST', { inicio = 1, ancho = 4 } = {})
//   GENERADOR DE IDENTIFICADORES. Cada llamada a next() entrega el siguiente
//   identificador de la serie. El estado (`numero`) vive DENTRO del generador:
//   no hace falta una variable global ni una clase entera.
//   Fijate en el asterisco: `function*` es lo que convierte una funcion
//   normal en una funcion generadora.
//   1. `let numero = inicio;`
//   2. `while (true) { yield `${prefijo}-${String(numero).padStart(ancho, '0')}`; numero += 1; }`
//      Un bucle infinito dentro de un generador NO cuelga el navegador,
//      porque el generador se PAUSA en cada yield y solo sigue cuando le
//      vuelven a pedir un valor. Esta es la magia de la evaluacion perezosa.
//   Resultado esperado: EST-0001, EST-0002, EST-0003...
//   (aprox. 6 lineas)

// TODO (en clase) — export function* fibonacci()
//   La sucesion donde cada numero es la suma de los dos anteriores:
//   0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
//   Escrito como array habria que decidir de antemano cuantos calcular.
//   Como generador, se calculan EXACTAMENTE los que se pidan.
//   1. `let anterior = 0;` y `let actual = 1;`
//   2. `while (true) { yield anterior; [anterior, actual] = [actual, anterior + actual]; }`
//      Usa el destructuring para intercambiar los dos valores en una linea.
//   (aprox. 6 lineas)

// TODO (en clase) — export function tomar(iterable, cantidad)
//   Ayudante imprescindible cuando se trabaja con generadores infinitos:
//   toma los primeros N valores de CUALQUIER iterable y para.
//   ⚠️ ERROR COMUN: escribir [...fibonacci()] y colgar la pestana, porque el
//   spread intenta consumir un iterable que nunca termina.
//   -> Acumula en un array dentro de un for...of y haz `break` cuando
//      resultado.length >= cantidad.
//   (aprox. 8 lineas)

// TODO (en clase) — export function* filtrarPerezoso(iterable, condicion)
//   Generador que filtra otro iterable sin materializarlo en memoria:
//     for (const valor of iterable) { if (condicion(valor)) yield valor; }
//   (aprox. 4 lineas)

// TODO (en clase) — export function* mapearPerezoso(iterable, transformar)
//   Igual, pero transformando: `yield transformar(valor);`
//   (aprox. 4 lineas)

// TODO (en clase) — export function demoGeneradores(consola)
//   1. consola.titulo('Generador de identificadores')
//      Llamar a un generador NO ejecuta su cuerpo: devuelve un objeto
//      generador (que es a la vez iterable e iterador). Imprime `typeof ids`
//      (da "object") y cuatro next(): los dos primeros completos y los dos
//      siguientes con .value.
//      Crea un segundo generador `generadorDeIds('CUR', { inicio: 100, ancho: 3 })`
//      para ver que lleva su propio contador independiente, y comprueba que
//      el primero sigue donde estaba.
//      Resultado esperado: EST-0001..EST-0004, luego CUR-100 y CUR-101, y el
//      primero continua en EST-0005.
//   2. consola.titulo('Fibonacci infinito, sin colgar el navegador')
//      Imprime tomar(fibonacci(), 12) y tomar(fibonacci(), 20).
//      "-> Nunca se calculan mas numeros de los que pedimos."
//      Encadena generadores perezosos (nada se calcula hasta el tomar()):
//      `filtrarPerezoso(fibonacci(), (n) => n % 2 === 0 && n > 100)` con tomar 5,
//      y `mapearPerezoso(fibonacci(), (n) => `F=${n}`)` con tomar 6.
//   3. consola.titulo('Un generador FINITO se agota')
//      Define dentro `function* tresColores()` que haga yield de 'rojo',
//      'verde' y 'azul' y termine con `return 'fin de la lista';`
//      Llama a next() CINCO veces en un bucle imprimiendo value y done por
//      separado (JSON.stringify se come las propiedades undefined).
//      "-> En la cuarta llamada aparece el valor del return, con done: true."
//      Imprime tambien [...tresColores()] (el return NO aparece) y, como
//      ⚠️ ERROR COMUN, [...colores] sobre el generador ya agotado: array vacio.
//   4. consola.titulo('yield* : delegar en otro iterable')
//      `function* menuCompleto()` que haga yield 'Bienvenida', luego
//      `yield* tresColores()`, `yield* ['opcion A', 'opcion B']`, `yield* 'ab'`
//      (los strings tambien son iterables) y por ultimo yield 'Despedida'.
//      Imprime [...menuCompleto()].
//   5. consola.titulo('Enviar valores HACIA el generador con next(valor)')
//      Un generador no solo entrega: tambien puede RECIBIR. El valor que
//      se pasa a next(valor) se convierte en el resultado del yield que
//      estaba esperando. Se usa para maquinas de estado y para asincronia.
//      `function* asistente()` con `const nombre = yield 'Como te llamas?';`,
//      `const curso = yield `Hola ${nombre}. En que curso estas?`;` y un return.
//      ⚠️ ERROR COMUN: el PRIMER next() no puede enviar nada, solo arranca el
//      generador hasta el primer yield. Llama a next(), next('Valentina') y
//      next('Full Stack 2').
//   6. consola.titulo('Cerrar un generador antes de tiempo con return()')
//      Con `generadorDeIds('TMP')`: un next(), luego .return('cancelado') y
//      otro next(). "-> Un generador cerrado ya no entrega mas valores."
//   (aprox. 55 lineas)

// ============================================================
// 4. UN CASO PRACTICO COMPLETO
// ============================================================

// TODO (en clase) — export function* recorrerContenidos(nodo, ruta = [])
//   Recorre una estructura anidada de contenidos del curso y va entregando
//   cada leccion, sin importar cuantos niveles haya. La recursion con
//   generadores se escribe con yield* sobre uno mismo.
//   1. `const rutaActual = [...ruta, nodo.titulo];`
//   2. Si `Array.isArray(nodo.hijos) && nodo.hijos.length > 0`, recorre los
//      hijos y delega: `yield* recorrerContenidos(hijo, rutaActual);`
//      Todo lo que entregue la llamada recursiva lo entregamos hacia arriba.
//   3. Si no, es una hoja: entregala con su ruta completa:
//      `yield { leccion: nodo.titulo, ruta: rutaActual.join(' > '), minutos: nodo.minutos ?? 0 };`
//   (aprox. 12 lineas)

// TODO (en clase) — export function demoCasoPractico(consola)
//   1. consola.titulo('Recorrer un temario anidado con un generador recursivo')
//      Datos: el objeto `temario` (unas 24 lineas). Son DATOS puros: copialo
//      tal cual del archivo resuelto en lugar de teclearlo. Estructura:
//      'Full Stack 2' -> 'Front End' -> [El DOM 90, Eventos 75,
//      'JavaScript moderno' -> [Destructuring 45, Generadores 60, Modulos ES 80]]
//      y 'Herramientas' -> [Control de versiones 50].
//   2. Recorrelo con `for (const { leccion, ruta, minutos } of recorrerContenidos(temario))`
//      acumulando totalMinutos e imprimiendo
//      `${String(minutos).padStart(3)} min | ${ruta}`.
//      Resultado esperado: 6 lineas y "Total del temario: 400 minutos (6.7 horas)".
//   3. Como es un iterable, se puede usar con cualquier herramienta:
//      `const lecciones = [...recorrerContenidos(temario)];` y filtra las de
//      75 minutos o mas. Resultado esperado: ['El DOM', 'Eventos', 'Modulos ES'].
//   (aprox. 18 lineas + 24 de datos)

/*
 * ============================================================
 * EJERCICIOS PROPUESTOS
 * ------------------------------------------------------------
 * 1) Escribe el generador `contarAtras(desde)` que entregue numeros desde
 *    `desde` hasta 0 y termine. Recorrelo con for...of y con spread.
 *
 * 2) Crea `zip(iterableA, iterableB)`: un generador que entregue pares
 *    [a, b] tomando un elemento de cada uno y parando cuando el mas corto
 *    se agote. Pista: pide los iteradores a mano con Symbol.iterator.
 *
 * 3) Implementa `crearRangoDescendente(desde, hasta)` reutilizando la idea
 *    de crearRango pero con Symbol.iterator escrito como generador. Compara
 *    cuantas lineas de codigo te ahorras.
 *
 * 4) Escribe el generador `numerosPrimos()` infinito y usa tomar() para
 *    obtener los primeros 20. Comprueba con performance.now() cuanto tarda
 *    pedir 20 y cuanto pedir 200.
 *
 * 5) AVANZADO: anade a la clase ListaDeEspera un metodo generador
 *    `porGrupos(tamano)` que entregue arrays de N personas cada vez
 *    (el ultimo grupo puede ser mas corto). Usalo para repartir la clase
 *    en equipos de 3.
 * ============================================================
 */
