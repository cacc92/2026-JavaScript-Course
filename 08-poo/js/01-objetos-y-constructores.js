/**
 * ============================================================================
 * ARCHIVO: js/01-objetos-y-constructores.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. Qué es la POO y cuáles son sus 4 pilares, en lenguaje sencillo.
 *   2. Los objetos literales: el punto de partida... y su gran limitación.
 *   3. Las funciones fábrica (factory functions) como primer arreglo.
 *   4. Las funciones constructoras y el operador `new`.
 *   5. Qué hace `new` PASO A PASO (lo simulamos a mano para verlo).
 *   6. Encapsulamiento "clásico" con closures (variables privadas).
 *
 * QUÉ SE APRENDE
 *   A pensar en "moldes" (plantillas) en lugar de copiar y pegar objetos,
 *   y a entender qué ocurre realmente cuando escribimos `new Algo()`.
 *
 * NOTA IMPORTANTE SOBRE LA IIFE
 *   Todo el archivo está envuelto en una IIFE:  (function () { ... })();
 *   IIFE = Immediately Invoked Function Expression = función que se define
 *   y se ejecuta al instante. ¿Por qué la usamos?
 *   Porque el index.html carga VARIOS archivos .js y todos comparten el
 *   mismo ámbito global. Si dos archivos declararan `const imprimir = ...`
 *   el navegador lanzaría el error:
 *       "SyntaxError: Identifier 'imprimir' has already been declared".
 *   Al envolver cada archivo en su propia función, sus variables quedan
 *   ENCERRADAS dentro y no chocan con las de los demás archivos.
 * ============================================================================
 */

(function () {
  // 'use strict' activa el "modo estricto": JavaScript se vuelve más severo y
  // avisa de errores que en modo normal pasaría por alto en silencio.
  // Lo necesitamos en la sección 6 para demostrar qué ocurre si olvidamos `new`.
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA "CONSOLA VISUAL"
  // ==========================================================================
  // Los estudiantes no siempre tienen abierto DevTools (F12). Por eso todo lo
  // que imprimimos se escribe DOS veces: en la consola real del navegador y
  // en un bloque <pre> visible dentro de la página.

  // Identificador del <pre> de ESTA sección dentro del index.html.
  var ID_SALIDA = 'salida-01';

  /**
   * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la página, para que se vea en clase sin
   * abrir las herramientas de desarrollo.
   * Los "..." de (...mensajes) son el parámetro REST: agrupan todos los
   * argumentos recibidos dentro de un array llamado `mensajes`.
   */
  function imprimir(...mensajes) {
    console.log(...mensajes); // Salida clásica de DevTools (el spread "reparte")

    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return; // Si la página no tiene consola visual, no hace nada

    const texto = mensajes
      .map((m) => {
        // Si el valor es un objeto lo convertimos a texto legible con sangría.
        if (typeof m === 'object' && m !== null) {
          try {
            return JSON.stringify(m, null, 2);
          } catch (error) {
            // JSON.stringify falla con referencias circulares (a -> b -> a).
            return String(m);
          }
        }
        return String(m); // Números, textos, booleanos... se convierten a texto
      })
      .join(' ');

    salida.textContent += texto + '\n';
  }

  /**
   * titulo(): imprime un separador visual muy marcado antes de cada apartado.
   * Sirve para que, proyectando en clase, se distinga dónde empieza cada tema.
   */
  function titulo(texto) {
    imprimir('\n============================================');
    imprimir('  ' + texto);
    imprimir('============================================');
  }

  // Botón "Limpiar" de esta consola: vacía el <pre> sin recargar la página.
  const botonLimpiar = document.getElementById('limpiar-01');
  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. ¿QUÉ ES LA PROGRAMACIÓN ORIENTADA A OBJETOS?
  // ==========================================================================
  // La POO es una forma de ORGANIZAR el código. En lugar de tener datos por un
  // lado (variables sueltas) y funciones por otro, los juntamos en "objetos"
  // que representan cosas del mundo real: un estudiante, un producto, un libro.
  //
  // Un objeto tiene:
  //   - PROPIEDADES: lo que el objeto SABE de sí mismo (nombre, edad, notas).
  //   - MÉTODOS:     lo que el objeto SABE HACER (calcular su promedio).
  //
  // Analogía: un microondas. Por fuera tiene botones (métodos públicos) y una
  // pantalla (propiedades). Por dentro hay electrónica que nadie toca. Sabemos
  // usarlo sin saber cómo funciona: eso es exactamente la idea de la POO.

  titulo('1. LOS 4 PILARES DE LA POO');

  // Los 4 pilares, explicados en una frase cada uno. Los guardamos en un array
  // de objetos porque... bueno, porque un objeto es justo lo que estamos
  // estudiando: datos agrupados con nombre.
  const pilares = [
    {
      nombre: 'ABSTRACCIÓN',
      idea: 'Mostrar solo lo necesario y esconder los detalles complicados.',
      analogia: 'Conduces un coche con volante y pedales; no tocas el motor.',
    },
    {
      nombre: 'ENCAPSULAMIENTO',
      idea: 'Proteger los datos internos: solo se cambian por vías controladas.',
      analogia: 'El saldo del banco no se edita a mano: se ingresa o se retira.',
    },
    {
      nombre: 'HERENCIA',
      idea: 'Una clase hija reutiliza y amplía lo que ya hace la clase padre.',
      analogia: 'Un perro ES un animal: hereda respirar y añade ladrar.',
    },
    {
      nombre: 'POLIMORFISMO',
      idea: 'La misma orden produce comportamientos distintos según el objeto.',
      analogia: 'Dices "haz ruido": el perro ladra y el gato maúlla.',
    },
  ];

  // forEach recorre el array y ejecuta la función una vez por cada elemento.
  pilares.forEach(function (pilar, indice) {
    imprimir(`\n${indice + 1}) ${pilar.nombre}`); // indice empieza en 0
    imprimir('   Idea:     ' + pilar.idea);
    imprimir('   Analogía: ' + pilar.analogia);
  });

  // ==========================================================================
  // 2. PUNTO DE PARTIDA: EL OBJETO LITERAL
  // ==========================================================================
  // Un "objeto literal" es un objeto escrito directamente con llaves { }.
  // Es la forma más simple y rápida de agrupar datos relacionados.

  titulo('2. OBJETOS LITERALES');

  const estudianteAna = {
    // Propiedades: pares clave: valor separados por comas.
    nombre: 'Ana Torres',
    edad: 20,
    curso: 'Full Stack 2',
    notas: [8, 9.5, 7], // Una propiedad puede contener un array

    // Método: una propiedad cuyo valor es una función.
    // Sintaxis corta de ES6: escribimos `promedio() {}` en vez de
    // `promedio: function () {}`. Hacen exactamente lo mismo.
    promedio() {
      // `this` dentro de un método apunta al objeto que lo llamó (estudianteAna).
      const suma = this.notas.reduce((acumulado, nota) => acumulado + nota, 0);
      return suma / this.notas.length;
    },

    presentarse() {
      // Las plantillas de texto (backticks) permiten insertar ${expresiones}.
      return `Hola, soy ${this.nombre} y curso ${this.curso}.`;
    },
  };

  imprimir(estudianteAna.presentarse());
  imprimir('Promedio de Ana:', estudianteAna.promedio().toFixed(2)); // "8.17"

  // Acceso a propiedades: dos notaciones equivalentes.
  imprimir('Con punto:      ', estudianteAna.edad);      // 20
  imprimir('Con corchetes:  ', estudianteAna['edad']);   // 20  (igual resultado)

  // ✅ BUENA PRÁCTICA: usa el punto siempre que puedas (se lee mejor).
  // Los corchetes son para cuando el nombre de la propiedad está en una
  // variable o tiene caracteres raros:
  const propiedadElegida = 'curso';
  imprimir('Propiedad dinámica:', estudianteAna[propiedadElegida]); // "Full Stack 2"

  // ⚠️ ERROR COMÚN: `estudianteAna[curso]` (sin comillas) busca una VARIABLE
  // llamada curso que no existe -> ReferenceError.

  // ==========================================================================
  // 3. LA LIMITACIÓN DE LOS OBJETOS LITERALES
  // ==========================================================================
  // ¿Y si necesitamos 300 estudiantes? Copiar y pegar el objeto 300 veces es
  // inviable: mucho código repetido y, si mañana cambiamos `promedio()`, hay
  // que corregirlo en los 300 sitios. Ese dolor es el que resuelve la POO.

  titulo('3. LA LIMITACIÓN DEL LITERAL: REPETICIÓN');

  // Copia manual (esto es lo que NO queremos hacer):
  const estudianteLuis = {
    nombre: 'Luis Ramírez',
    edad: 22,
    curso: 'Full Stack 2',
    notas: [6, 7, 8.5],
    promedio() {
      const suma = this.notas.reduce((acumulado, nota) => acumulado + nota, 0);
      return suma / this.notas.length;
    },
    presentarse() {
      return `Hola, soy ${this.nombre} y curso ${this.curso}.`;
    },
  };

  imprimir(estudianteLuis.presentarse());
  imprimir('Promedio de Luis:', estudianteLuis.promedio().toFixed(2));

  // Demostración del problema: cada objeto tiene su PROPIA copia de la función.
  // Son dos funciones distintas en memoria aunque el código sea idéntico.
  imprimir('¿Comparten el método promedio?', estudianteAna.promedio === estudianteLuis.promedio); // false

  // ⚠️ ERROR COMÚN: pensar que copiar objetos con `=` crea uno nuevo.
  const alias = estudianteLuis;   // NO es una copia: es OTRO nombre para lo mismo
  alias.edad = 99;                // Modificamos a través del alias...
  imprimir('Edad de Luis tras tocar el alias:', estudianteLuis.edad); // 99 (!)
  alias.edad = 22;                // Lo dejamos como estaba para no liar el resto

  // ✅ BUENA PRÁCTICA: para copiar (de forma superficial) usa el spread:
  const copiaDeLuis = { ...estudianteLuis, nombre: 'Luis (copia)' };
  copiaDeLuis.edad = 40;
  imprimir('Edad del original tras copiar:', estudianteLuis.edad); // 22, intacto

  // ==========================================================================
  // 4. PRIMERA SOLUCIÓN: LA FUNCIÓN FÁBRICA (FACTORY)
  // ==========================================================================
  // Una "fábrica" es simplemente una función normal que CONSTRUYE y DEVUELVE
  // un objeto. No hace falta `new`. Es sencilla y muy legible.

  titulo('4. FUNCIÓN FÁBRICA');

  function crearEstudiante(nombre, edad, notas) {
    // Devolvemos un objeto literal construido con los parámetros recibidos.
    return {
      nombre: nombre,
      edad: edad,
      curso: 'Full Stack 2',
      notas: notas,
      promedio() {
        if (this.notas.length === 0) return 0; // Evitamos dividir entre cero
        const suma = this.notas.reduce((acumulado, n) => acumulado + n, 0);
        return suma / this.notas.length;
      },
    };
  }

  const marta = crearEstudiante('Marta Gil', 21, [9, 9.5, 10]);
  const pedro = crearEstudiante('Pedro Sanz', 24, [5, 6.5, 7]);

  imprimir('Marta:', marta.nombre, '- promedio', marta.promedio().toFixed(2));
  imprimir('Pedro:', pedro.nombre, '- promedio', pedro.promedio().toFixed(2));

  // El problema sigue ahí: cada llamada crea una función `promedio` nueva.
  imprimir('¿Comparten método?', marta.promedio === pedro.promedio); // false

  // ==========================================================================
  // 5. LA FUNCIÓN CONSTRUCTORA Y EL OPERADOR new
  // ==========================================================================
  // Una función constructora es una función normal pensada para usarse con
  // `new`. Por CONVENIO su nombre empieza en MAYÚSCULA: así quien lea el
  // código sabe que debe invocarla con `new`.
  // Dentro NO devolvemos nada: solo rellenamos `this`, que `new` prepara
  // por nosotros como un objeto vacío.

  titulo('5. FUNCIÓN CONSTRUCTORA + new');

  function Producto(nombre, precio, stock) {
    // `this` es el objeto nuevo que `new` acaba de crear.
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.enOferta = false; // Valor por defecto para todas las instancias

    // Ponemos un método aquí SOLO para demostrar el problema de memoria.
    // (En la sección 2 del proyecto lo moveremos al prototipo.)
    this.valorInventario = function () {
      return this.precio * this.stock;
    };
  }

  // `new` crea una INSTANCIA: un objeto concreto fabricado con ese molde.
  const teclado = new Producto('Teclado mecánico', 89.9, 12);
  const monitor = new Producto('Monitor 27"', 219.0, 5);

  imprimir('Producto 1:', teclado.nombre, '->', teclado.valorInventario().toFixed(2), 'EUR');
  imprimir('Producto 2:', monitor.nombre, '->', monitor.valorInventario().toFixed(2), 'EUR');

  // Cada instancia es independiente: cambiar una no afecta a la otra.
  teclado.enOferta = true;
  imprimir('Teclado en oferta:', teclado.enOferta); // true
  imprimir('Monitor en oferta:', monitor.enOferta); // false

  // Comprobamos de qué molde salió cada objeto (lo veremos a fondo en 04).
  imprimir('teclado instanceof Producto:', teclado instanceof Producto); // true
  imprimir('Nombre del constructor:', teclado.constructor.name);         // "Producto"

  // ==========================================================================
  // 6. ¿QUÉ HACE `new` EXACTAMENTE? LOS 4 PASOS
  // ==========================================================================
  // `new Producto('X', 1, 2)` hace, por debajo, estas cuatro cosas:
  //   1. Crea un objeto vacío: {}
  //   2. Enlaza ese objeto con Producto.prototype (su "padre", ver archivo 02).
  //   3. Ejecuta Producto con `this` apuntando a ese objeto nuevo.
  //   4. Devuelve el objeto automáticamente (salvo que la función devuelva
  //      explícitamente OTRO objeto).
  // Vamos a escribirlo nosotros mismos para verlo con nuestros propios ojos.

  titulo('6. SIMULACIÓN DE new PASO A PASO');

  function simularNew(Constructora, ...argumentos) {
    // PASO 1 y 2: objeto vacío enlazado al prototipo de la constructora.
    const objeto = Object.create(Constructora.prototype);
    imprimir('Paso 1+2 -> objeto vacío enlazado a', Constructora.name + '.prototype');

    // PASO 3: ejecutamos la constructora forzando `this` = objeto.
    // `apply` recibe los argumentos como array (lo vemos a fondo en el 05).
    const resultado = Constructora.apply(objeto, argumentos);
    imprimir('Paso 3   -> constructora ejecutada con this = objeto nuevo');

    // PASO 4: si la constructora devolvió un objeto, gana ese; si no, el nuestro.
    const devuelto = (typeof resultado === 'object' && resultado !== null)
      ? resultado
      : objeto;
    imprimir('Paso 4   -> devolvemos el objeto');
    return devuelto;
  }

  const raton = simularNew(Producto, 'Ratón inalámbrico', 25.5, 30);
  imprimir('Resultado de la simulación:', raton.nombre, raton.precio);
  imprimir('¿Es instancia de Producto?', raton instanceof Producto); // true (!)

  // ==========================================================================
  // 7. ERRORES CLÁSICOS CON LAS FUNCIONES CONSTRUCTORAS
  // ==========================================================================

  titulo('7. ERRORES CLÁSICOS');

  // ⚠️ ERROR COMÚN Nº1: olvidar `new`.
  // Sin `new` no se crea ningún objeto: en modo estricto `this` vale undefined
  // y asignar una propiedad a undefined revienta.
  try {
    // Guardamos el resultado para que quede claro que NO es una instancia.
    const productoRoto = Producto('Sin new', 10, 1); // <- falta new
    imprimir('Esto no debería verse:', productoRoto);
  } catch (error) {
    imprimir('⚠ Error capturado al olvidar new:', error.message);
  }

  // ✅ BUENA PRÁCTICA: blindar la constructora con `new.target`.
  // `new.target` vale undefined si la función NO se llamó con `new`.
  // OJO: al parámetro lo llamamos `nombreCurso` y no `titulo` para no tapar
  // (shadowing) a nuestra función auxiliar titulo() dentro de este bloque.
  function Curso(nombreCurso, horas) {
    if (!new.target) {
      // Si olvidaron el new, lo añadimos nosotros y devolvemos el resultado.
      return new Curso(nombreCurso, horas);
    }
    this.titulo = nombreCurso;
    this.horas = horas;
  }

  const cursoConNew = new Curso('JavaScript desde cero', 60);
  const cursoSinNew = Curso('CSS moderno', 40); // ¡Funciona igual gracias al blindaje!
  imprimir('Con new:', cursoConNew.titulo, '| Sin new:', cursoSinNew.titulo);
  imprimir('Ambos son instancias de Curso:',
    cursoConNew instanceof Curso && cursoSinNew instanceof Curso); // true

  // ⚠️ ERROR COMÚN Nº2: nombrar la constructora en minúscula. No da error,
  // pero engaña a quien lee el código. El convenio (PascalCase) importa.

  // ==========================================================================
  // 8. ABSTRACCIÓN Y ENCAPSULAMIENTO CON CLOSURES
  // ==========================================================================
  // Antes de que existieran los campos privados con `#` (que veremos en el
  // archivo 03), la única forma REAL de ocultar datos era el closure:
  // una variable declarada dentro de la función solo es visible ahí dentro,
  // pero las funciones internas siguen "recordándola" aunque la fábrica
  // ya haya terminado. A eso se le llama CLOSURE (cierre).

  titulo('8. ENCAPSULAMIENTO CON CLOSURES');

  function crearCuentaDeAlumno(nombreAlumno) {
    // `creditos` es PRIVADA: no existe fuera de esta función.
    let creditos = 0;
    // Historial también privado: nadie puede falsificarlo desde fuera.
    const historial = [];

    // Devolvemos solo la "interfaz pública": los botones del microondas.
    return {
      nombre: nombreAlumno, // Esta sí es pública

      // ABSTRACCIÓN: quien usa esto no sabe (ni le importa) que hay un array.
      sumarCreditos(cantidad) {
        // ENCAPSULAMIENTO: validamos antes de tocar el dato interno.
        if (typeof cantidad !== 'number' || cantidad <= 0) {
          imprimir('⚠ Cantidad inválida, se ignora:', cantidad);
          return this; // Devolvemos this para poder encadenar llamadas
        }
        creditos += cantidad;
        historial.push(`+${cantidad} créditos`);
        return this;
      },

      verCreditos() {
        return creditos; // Lectura controlada
      },

      verHistorial() {
        // Devolvemos una COPIA del array para que nadie modifique el original.
        return [...historial];
      },
    };
  }

  const cuentaAna = crearCuentaDeAlumno('Ana Torres');
  // Encadenamos llamadas porque cada método devuelve `this`.
  cuentaAna.sumarCreditos(6).sumarCreditos(4).sumarCreditos(-3); // el -3 se rechaza

  imprimir('Créditos de Ana:', cuentaAna.verCreditos()); // 10
  imprimir('Historial:', cuentaAna.verHistorial());       // ["+6 créditos", "+4 créditos"]

  // La prueba del encapsulamiento: la variable interna NO se ve desde fuera.
  imprimir('¿Se puede leer cuentaAna.creditos?', cuentaAna.creditos); // undefined

  // Y aunque inventemos la propiedad, el dato real no cambia.
  cuentaAna.creditos = 9999;
  imprimir('Tras intentar falsear creditos, el real sigue siendo:', cuentaAna.verCreditos()); // 10

  // ✅ BUENA PRÁCTICA: exponer métodos (verCreditos) en lugar de datos crudos.
  //    Así podemos cambiar la implementación interna sin romper a quien nos usa.

  imprimir('\n(Fin del archivo 01. Continúa en 02-prototipos.js)');

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) OBJETO LITERAL.
  //    Crea un objeto literal `tarea` con las propiedades: titulo, prioridad
  //    ("alta"/"media"/"baja"), completada (booleano) y un método
  //    `resumen()` que devuelva por ejemplo:
  //    "[PENDIENTE] Estudiar prototipos (prioridad: alta)".
  //
  // 2) FUNCIÓN FÁBRICA.
  //    Escribe `crearTarea(titulo, prioridad)` que devuelva un objeto como el
  //    del ejercicio 1 con `completada` en false y un método `completar()`
  //    que la marque como hecha y devuelva el propio objeto (para encadenar).
  //
  // 3) FUNCIÓN CONSTRUCTORA.
  //    Convierte el ejercicio 2 en una función constructora `Tarea(titulo,
  //    prioridad)` que se use con `new`. Blíndala con `new.target` para que
  //    también funcione si alguien olvida el `new`.
  //
  // 4) ENCAPSULAMIENTO CON CLOSURE.
  //    Crea `crearMonedero(saldoInicial)` con una variable privada `saldo` y
  //    los métodos `ingresar(cantidad)`, `retirar(cantidad)` y `verSaldo()`.
  //    Reglas: no se puede ingresar un valor que no sea número positivo y no
  //    se puede retirar más de lo que hay (muestra un aviso con imprimir()).
  //
  // 5) RETO (difícil).
  //    Escribe tu propia versión de `simularNew` llamada `miNew(Constructora,
  //    argumentos)` que reciba los argumentos en un ARRAY en lugar de usar
  //    parámetros rest. Después, comprueba con `instanceof` que el objeto
  //    creado es realmente una instancia de la constructora.
  // ==========================================================================
})();
