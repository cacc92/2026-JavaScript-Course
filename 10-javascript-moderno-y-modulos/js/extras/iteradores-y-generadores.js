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

console.log('[iteradores-y-generadores.js] Modulo evaluado.');

// ============================================================
// 1. QUE ES SER ITERABLE
// ============================================================

export function demoProtocoloIterable(consola) {
  consola.titulo('Que cosas son iterables de fabrica');

  // Un objeto es ITERABLE si tiene un metodo bajo la clave especial
  // Symbol.iterator. Los corchetes son necesarios porque la clave no
  // es un texto, es un simbolo.
  const candidatos = {
    'array [1,2,3]': [1, 2, 3],
    'texto "hola"': 'hola',
    'Set': new Set([1, 2]),
    'Map': new Map([['a', 1]]),
    'objeto plano': { a: 1, b: 2 },
    'NodeList': document.querySelectorAll('h2'),
    'arguments-like': { 0: 'a', 1: 'b', length: 2 },
  };

  for (const [nombre, valor] of Object.entries(candidatos)) {
    // typeof valor?.[Symbol.iterator] === 'function' es la comprobacion.
    const esIterable = typeof valor?.[Symbol.iterator] === 'function';
    consola.imprimir(`${nombre.padEnd(18, '.')} iterable: ${esIterable}`);
  }

  consola.imprimir('');
  consola.imprimir('-> Por eso for...of NO funciona con objetos planos.');
  consola.imprimir('   Para recorrer un objeto se usa Object.entries(objeto).');

  consola.titulo('El protocolo iterador, paso a paso');

  // Vamos a hacer a mano lo que for...of hace por dentro.
  const asignaturas = ['HTML', 'CSS', 'JavaScript'];

  // 1) Pedimos el iterador llamando al metodo Symbol.iterator.
  const marcapaginas = asignaturas[Symbol.iterator]();

  // 2) Cada next() devuelve un objeto { value, done }.
  consola.imprimir('next() ->', marcapaginas.next());
  consola.imprimir('next() ->', marcapaginas.next());
  consola.imprimir('next() ->', marcapaginas.next());
  consola.imprimir('next() ->', marcapaginas.next());  // done: true, value: undefined
  consola.imprimir('');
  consola.imprimir('-> for...of hace exactamente esto y para cuando done es true.');
}

// ============================================================
// 2. IMPLEMENTAR Symbol.iterator A MANO
// ============================================================

/**
 * Un objeto "rango" que se puede recorrer con for...of.
 * Se construye con una funcion normal que devuelve un objeto literal
 * con la clave computada [Symbol.iterator].
 */
export function crearRango(desde, hasta, paso = 1) {
  return {
    desde,
    hasta,
    paso,

    // Esta es LA clave del asunto. El nombre del metodo va entre
    // corchetes porque es un simbolo, no un texto.
    [Symbol.iterator]() {
      // `actual` vive en la CLAUSURA del iterador: cada vez que alguien
      // pide un iterador nuevo, empieza otra vez desde el principio.
      let actual = this.desde;
      const limite = this.hasta;
      const salto = this.paso;

      // Devolvemos el objeto ITERADOR: solo necesita next().
      return {
        next() {
          if (actual <= limite) {
            const valor = actual;
            actual += salto;
            // El contrato: { value, done }
            return { value: valor, done: false };
          }
          return { value: undefined, done: true };
        },

        // OPCIONAL pero recomendable: si el bucle se corta con break,
        // el motor llama a return() para que podamos limpiar recursos.
        return() {
          console.log('[rango] El bucle se interrumpio antes de terminar.');
          return { value: undefined, done: true };
        },

        // Truco util: hacer que el propio iterador sea iterable.
        // Asi se puede pasar directamente a otro for...of o a un spread.
        [Symbol.iterator]() {
          return this;
        },
      };
    },
  };
}

/**
 * La misma idea, pero con una CLASE. Aqui el metodo iterador es a la vez
 * un GENERADOR (fijate en el asterisco): asi nos ahorramos escribir next()
 * a mano. Es la forma corta y la que se usa en el mundo real.
 */
export class ListaDeEspera {
  #personas = [];   // campo privado de clase (el # es parte del nombre)

  constructor(...personas) {
    this.#personas = [...personas];
  }

  agregar(persona) {
    this.#personas.push(persona);
    return this;              // devolvemos this para poder encadenar
  }

  get cantidad() {
    return this.#personas.length;
  }

  // Metodo generador que ademas es el iterador de la clase.
  *[Symbol.iterator]() {
    // Recorremos entregando de uno en uno, por orden de llegada.
    for (const persona of this.#personas) {
      yield persona;
    }
  }

  // Un segundo recorrido, en orden inverso, expuesto como metodo normal.
  *enOrdenInverso() {
    for (let i = this.#personas.length - 1; i >= 0; i -= 1) {
      yield this.#personas[i];
    }
  }
}

export function demoIteradorPropio(consola) {
  consola.titulo('Un objeto rango con Symbol.iterator escrito a mano');

  const rango = crearRango(1, 10, 3);

  // Ahora nuestro objeto funciona con for...of...
  const recogidos = [];
  for (const numero of rango) {
    recogidos.push(numero);
  }
  consola.imprimir('for...of sobre el rango:', recogidos);

  // ...y con TODO lo que consume iterables:
  consola.imprimir('spread [...rango]     :', [...rango]);
  consola.imprimir('Array.from(rango)     :', Array.from(rango));
  consola.imprimir('desestructurando      :', (() => { const [a, b] = rango; return { a, b }; })());
  consola.imprimir('dentro de un Set      :', new Set(crearRango(1, 3)));

  consola.imprimir('');
  consola.imprimir('Cada for...of pide un iterador NUEVO, por eso se puede recorrer dos veces:');
  consola.imprimir('primer recorrido :', [...crearRango(1, 4)]);
  consola.imprimir('segundo recorrido:', [...crearRango(1, 4)]);

  consola.titulo('Interrumpir con break llama al metodo return()');

  for (const numero of crearRango(1, 100)) {
    if (numero > 3) break;   // mira la consola del navegador (F12)
    consola.imprimir('valor:', numero);
  }

  consola.titulo('La misma idea con una clase');

  const cola = new ListaDeEspera('Ana', 'Luis');
  cola.agregar('Camila').agregar('Diego');   // encadenado

  consola.imprimir('Cantidad en la cola:', cola.cantidad);
  consola.imprimir('Orden de llegada  :', [...cola]);
  consola.imprimir('Orden inverso     :', [...cola.enOrdenInverso()]);

  for (const [posicion, persona] of [...cola].entries()) {
    consola.imprimir(`  ${posicion + 1}. ${persona}`);
  }
}

// ============================================================
// 3. FUNCIONES GENERADORAS: function* y yield
// ============================================================

/**
 * GENERADOR DE IDENTIFICADORES.
 * Cada llamada a next() entrega el siguiente identificador de la serie.
 * El estado (`numero`) vive DENTRO del generador: no hace falta una
 * variable global ni una clase entera.
 *
 * Fijate en el asterisco: `function*` es lo que convierte una funcion
 * normal en una funcion generadora.
 */
export function* generadorDeIds(prefijo = 'EST', { inicio = 1, ancho = 4 } = {}) {
  let numero = inicio;

  // Un bucle infinito dentro de un generador NO cuelga el navegador,
  // porque el generador se PAUSA en cada yield y solo sigue cuando le
  // vuelven a pedir un valor. Esta es la magia de la evaluacion perezosa.
  while (true) {
    // yield ENTREGA un valor y CONGELA la funcion justo en este punto.
    yield `${prefijo}-${String(numero).padStart(ancho, '0')}`;
    numero += 1;
  }
}

/**
 * GENERADOR INFINITO DE FIBONACCI.
 * La sucesion donde cada numero es la suma de los dos anteriores:
 * 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
 *
 * Escrito como array habria que decidir de antemano cuantos calcular.
 * Como generador, se calculan EXACTAMENTE los que se pidan.
 */
export function* fibonacci() {
  let anterior = 0;
  let actual = 1;

  while (true) {
    yield anterior;
    // Desestructuracion para intercambiar los dos valores en una linea.
    [anterior, actual] = [actual, anterior + actual];
  }
}

/**
 * Ayudante imprescindible cuando se trabaja con generadores infinitos:
 * toma los primeros N valores de CUALQUIER iterable y para.
 *
 * ERROR COMUN: escribir [...fibonacci()] y colgar la pestana, porque el
 * spread intenta consumir un iterable que nunca termina.
 */
export function tomar(iterable, cantidad) {
  const resultado = [];
  for (const valor of iterable) {
    if (resultado.length >= cantidad) break;
    resultado.push(valor);
  }
  return resultado;
}

/** Generador que filtra otro iterable sin materializarlo en memoria. */
export function* filtrarPerezoso(iterable, condicion) {
  for (const valor of iterable) {
    if (condicion(valor)) yield valor;
  }
}

/** Generador que transforma otro iterable, tambien de forma perezosa. */
export function* mapearPerezoso(iterable, transformar) {
  for (const valor of iterable) {
    yield transformar(valor);
  }
}

export function demoGeneradores(consola) {
  consola.titulo('Generador de identificadores');

  // Llamar a un generador NO ejecuta su cuerpo: devuelve un objeto
  // generador (que es a la vez iterable e iterador).
  const ids = generadorDeIds('EST');
  consola.imprimir('Llamar al generador devuelve:', typeof ids);

  consola.imprimir('next() ->', ids.next());
  consola.imprimir('next() ->', ids.next());
  consola.imprimir('next().value ->', ids.next().value);
  consola.imprimir('next().value ->', ids.next().value);

  // Un generador distinto lleva su propio contador independiente.
  const idsDeCurso = generadorDeIds('CUR', { inicio: 100, ancho: 3 });
  consola.imprimir('Otro generador, otro contador:', idsDeCurso.next().value, idsDeCurso.next().value);
  consola.imprimir('Y el primero sigue donde estaba:', ids.next().value);

  consola.titulo('Fibonacci infinito, sin colgar el navegador');

  consola.imprimir('Primeros 12 :', tomar(fibonacci(), 12));
  consola.imprimir('Primeros 20 :', tomar(fibonacci(), 20));
  consola.imprimir('-> Nunca se calculan mas numeros de los que pedimos.');

  // Encadenar generadores perezosos: nada se calcula hasta el tomar().
  const paresGrandes = filtrarPerezoso(fibonacci(), (n) => n % 2 === 0 && n > 100);
  consola.imprimir('Primeros 5 fibonacci pares mayores que 100:', tomar(paresGrandes, 5));

  const enTexto = mapearPerezoso(fibonacci(), (n) => `F=${n}`);
  consola.imprimir('Transformados perezosamente:', tomar(enTexto, 6));

  consola.titulo('Un generador FINITO se agota');

  function* tresColores() {
    yield 'rojo';
    yield 'verde';
    yield 'azul';
    // Al llegar al final, done pasa a true. Si escribimos un `return`,
    // ese valor aparece en el ultimo next() pero for...of lo IGNORA.
    return 'fin de la lista';
  }

  const colores = tresColores();
  // Imprimimos value y done por separado: JSON.stringify se come las
  // propiedades que valen undefined y confundiria la lectura en clase.
  for (let vuelta = 1; vuelta <= 5; vuelta += 1) {
    const { value, done } = colores.next();
    consola.imprimir(`next() #${vuelta} -> value: ${value} | done: ${done}`);
  }
  consola.imprimir('-> En la cuarta llamada aparece el valor del return, con done: true.');
  consola.imprimir('');
  consola.imprimir('for...of sobre uno nuevo:', [...tresColores()]);
  consola.imprimir('-> El valor del return NO aparece en el spread ni en for...of.');

  // ERROR COMUN: reutilizar un generador ya agotado.
  consola.imprimir('Reutilizar el agotado:', [...colores]);  // array vacio

  consola.titulo('yield* : delegar en otro iterable');

  function* menuCompleto() {
    yield 'Bienvenida';
    // yield* entrega TODOS los valores del iterable que le pasemos,
    // uno por uno, como si estuvieran escritos aqui.
    yield* tresColores();
    yield* ['opcion A', 'opcion B'];
    yield* 'ab';              // los strings tambien son iterables
    yield 'Despedida';
  }

  consola.imprimir([...menuCompleto()]);

  consola.titulo('Enviar valores HACIA el generador con next(valor)');

  // Un generador no solo entrega: tambien puede RECIBIR. El valor que
  // se pasa a next(valor) se convierte en el resultado del yield que
  // estaba esperando. Se usa para maquinas de estado y para asincronia.
  function* asistente() {
    const nombre = yield 'Como te llamas?';
    const curso = yield `Hola ${nombre}. En que curso estas?`;
    return `Registrado: ${nombre} en ${curso}.`;
  }

  const conversacion = asistente();
  // El PRIMER next() no puede enviar nada: solo arranca el generador
  // hasta el primer yield. Es el error mas comun con este patron.
  consola.imprimir('1)', conversacion.next().value);
  consola.imprimir('2)', conversacion.next('Valentina').value);
  consola.imprimir('3)', conversacion.next('Full Stack 2').value);

  consola.titulo('Cerrar un generador antes de tiempo con return()');

  const contador = generadorDeIds('TMP');
  consola.imprimir(contador.next().value);
  consola.imprimir('return() ->', contador.return('cancelado'));
  consola.imprimir('Despues del return:', contador.next());
  consola.imprimir('-> Un generador cerrado ya no entrega mas valores.');
}

// ============================================================
// 4. UN CASO PRACTICO COMPLETO
// ============================================================

/**
 * Recorre una estructura anidada de contenidos del curso y va
 * entregando cada leccion, sin importar cuantos niveles haya.
 * La recursion con generadores se escribe con yield* sobre uno mismo.
 */
export function* recorrerContenidos(nodo, ruta = []) {
  const rutaActual = [...ruta, nodo.titulo];

  if (Array.isArray(nodo.hijos) && nodo.hijos.length > 0) {
    for (const hijo of nodo.hijos) {
      // Delegamos en la llamada recursiva: todo lo que ella entregue,
      // lo entregamos nosotros hacia arriba.
      yield* recorrerContenidos(hijo, rutaActual);
    }
  } else {
    // Es una hoja: la entregamos con su ruta completa.
    yield { leccion: nodo.titulo, ruta: rutaActual.join(' > '), minutos: nodo.minutos ?? 0 };
  }
}

export function demoCasoPractico(consola) {
  consola.titulo('Recorrer un temario anidado con un generador recursivo');

  const temario = {
    titulo: 'Full Stack 2',
    hijos: [
      {
        titulo: 'Front End',
        hijos: [
          { titulo: 'El DOM', minutos: 90 },
          { titulo: 'Eventos', minutos: 75 },
          {
            titulo: 'JavaScript moderno',
            hijos: [
              { titulo: 'Destructuring', minutos: 45 },
              { titulo: 'Generadores', minutos: 60 },
              { titulo: 'Modulos ES', minutos: 80 },
            ],
          },
        ],
      },
      {
        titulo: 'Herramientas',
        hijos: [{ titulo: 'Control de versiones', minutos: 50 }],
      },
    ],
  };

  let totalMinutos = 0;
  for (const { leccion, ruta, minutos } of recorrerContenidos(temario)) {
    totalMinutos += minutos;
    consola.imprimir(`${String(minutos).padStart(3)} min | ${ruta}`);
  }

  consola.imprimir('');
  consola.imprimir(`Total del temario: ${totalMinutos} minutos (${(totalMinutos / 60).toFixed(1)} horas)`);

  // Como es un iterable, se puede usar con cualquier herramienta.
  const lecciones = [...recorrerContenidos(temario)];
  const masLargas = lecciones
    .filter((l) => l.minutos >= 75)
    .map((l) => l.leccion);
  consola.imprimir('Lecciones de 75 minutos o mas:', masLargas);
}

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
