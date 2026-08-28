/**
 * ============================================================================
 * ARCHIVO: js/06-proyecto-biblioteca.js
 * PROYECTO: 08 · Programación Orientada a Objetos (POO)
 * ----------------------------------------------------------------------------
 * PROYECTO PRÁCTICO: SISTEMA DE BIBLIOTECA
 *
 * Aquí juntamos TODO lo estudiado en los archivos 01 a 05 en una aplicación
 * real y funcional. Cada bloque indica qué PILAR de la POO ilustra:
 *
 *   ABSTRACCIÓN     -> La clase Publicacion define QUÉ es una publicación sin
 *                      decidir si es un libro o una revista. Biblioteca ofrece
 *                      métodos simples (prestar, devolver) y esconde el array.
 *   ENCAPSULAMIENTO -> Todos los datos importantes son campos privados (#) y
 *                      solo se tocan a través de getters y métodos validados.
 *   HERENCIA        -> Libro y Revista extienden Publicacion y reutilizan todo
 *                      su comportamiento con extends y super.
 *   POLIMORFISMO    -> La interfaz dibuja las tarjetas llamando a descripcion()
 *                      sin preguntar nunca de qué clase es cada publicación.
 *
 * ESTRUCTURA DEL ARCHIVO
 *   1. Consola visual y utilidades.
 *   2. Clase abstracta Publicacion (campos privados, getters, estáticos).
 *   3. Clases Libro y Revista (herencia + sobrescritura).
 *   4. Clase Biblioteca (gestión de la colección).
 *   5. Datos iniciales del catálogo.
 *   6. Capa de interfaz: pintar tarjetas y escuchar eventos.
 *
 * (Envuelto en una IIFE para no chocar con las variables de los otros archivos.)
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y las utilidades (imprimir, titulo, escapar) y los DATOS
 *   del catálogo inicial, pero el código de cada apartado está sustituido por
 *   instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/06-proyecto-biblioteca.js
 *
 *   OJO: mientras no se escriban las clases y la capa de interfaz, la rejilla
 *   de publicaciones se queda vacía, las métricas marcan 0 y el formulario no
 *   hace nada. Es lo esperado: no hay ningún error, simplemente no hay código
 *   escuchando todavía.
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONSOLA VISUAL Y UTILIDADES
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Incluye la
  //    consola visual y el escapado de HTML, que se explican de viva voz.

  var ID_SALIDA = 'salida-06';

  function imprimir(...mensajes) {
    console.log(...mensajes);
    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    const texto = mensajes
      .map((m) => {
        if (typeof m === 'object' && m !== null) {
          try {
            return JSON.stringify(m, null, 2);
          } catch (error) {
            return String(m);
          }
        }
        return String(m);
      })
      .join(' ');
    salida.textContent += texto + '\n';
    // Autoscroll: la consola siempre muestra la última línea escrita.
    salida.scrollTop = salida.scrollHeight;
  }

  function titulo(texto) {
    imprimir('\n============================================');
    imprimir('  ' + texto);
    imprimir('============================================');
  }

  /**
   * escapar(): convierte caracteres peligrosos (<, >, &, comillas) en texto
   * inofensivo antes de meterlos en el HTML.
   * ✅ BUENA PRÁCTICA de seguridad: nunca insertes texto escrito por el usuario
   * directamente con innerHTML sin limpiarlo antes; si no, alguien podría
   * inyectar etiquetas <script> (ataque conocido como XSS).
   */
  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================================================
  // 2. CLASE ABSTRACTA: Publicacion
  // ==========================================================================
  // PILAR: ABSTRACCIÓN + ENCAPSULAMIENTO.
  // Publicacion representa "algo que la biblioteca presta". No sabemos (ni nos
  // importa aquí) si será un libro o una revista: eso lo deciden las hijas.
  // Todos sus datos son PRIVADOS: desde fuera es imposible marcar una
  // publicación como disponible sin pasar por devolver().

  // TODO (en clase): declara `class Publicacion` con sus campos privados.
  //   1. CAMPOS PRIVADOS DE INSTANCIA:
  //        #id;  #titulo;  #autor;  #anio;
  //        #disponible = true;  #prestadaA = null;  #historial = [];
  //   2. CAMPOS PRIVADOS ESTÁTICOS (pertenecen a la CLASE, no al objeto). Los
  //      usamos como contadores globales del sistema; al ser privados y
  //      estáticos, nadie puede falsear las estadísticas desde fuera:
  //        static #ultimoId = 0;  static #totalCreadas = 0;  static #totalPrestamos = 0;
  //   (aprox. 10 lineas)

  // TODO (en clase): el constructor(titulo, autor, anio) de Publicacion.
  //   1. CLASE ABSTRACTA SIMULADA. new.target es la clase con la que se llamó
  //      a `new`; si alguien intenta `new Publicacion(...)` directamente, lo
  //      impedimos:
  //        if (new.target === Publicacion) {
  //          throw new Error('Publicacion es una clase abstracta: usa Libro o Revista.');
  //        }
  //   2. Validación: mejor detener la creación que guardar datos corruptos:
  //        if (typeof titulo !== 'string' || titulo.trim() === '') {
  //          throw new TypeError('El título es obligatorio.');
  //        }
  //   3. Generamos un identificador único con el contador estático privado.
  //      ⚠️ IMPORTANTE: escribimos Publicacion.#ultimoId (nombre de la clase) y
  //      NO this.constructor.#ultimoId. Si usáramos `this.constructor`, al crear
  //      un Libro el motor buscaría el campo privado en la clase Libro (donde no
  //      existe) y lanzaría un TypeError.
  //        Publicacion.#ultimoId += 1;
  //        Publicacion.#totalCreadas += 1;
  //   4. Asignación de los campos, con valores por defecto:
  //        this.#id = 'P-' + String(Publicacion.#ultimoId).padStart(3, '0');  // P-001
  //        this.#titulo = titulo.trim();
  //        this.#autor = (autor && String(autor).trim()) || 'Autoría desconocida';
  //        this.#anio = Number(anio) || new Date().getFullYear();
  //   5. Cierra con  this.#anotar('alta en el catálogo');
  //   (aprox. 18 lineas)

  // TODO (en clase): el MÉTODO PRIVADO de uso interno (no forma parte de la
  // interfaz pública), dentro de la misma clase:
  //   #anotar(evento) -> hace push a this.#historial de
  //     { evento: evento, fecha: new Date().toLocaleTimeString('es-ES') }
  //   (aprox. 6 lineas)

  // TODO (en clase): los GETTERS de lectura controlada (ENCAPSULAMIENTO).
  // Fíjate en que NO hay setters para id, disponible ni prestadaA: son datos
  // que solo puede cambiar la propia clase mediante prestar() y devolver().
  //   1. Getters directos, uno por línea:
  //        get id()         { return this.#id; }
  //        get titulo()     { return this.#titulo; }
  //        get autor()      { return this.#autor; }
  //        get anio()       { return this.#anio; }
  //        get disponible() { return this.#disponible; }
  //        get prestadaA()  { return this.#prestadaA; }
  //   2. get historial() -> devuelve una COPIA; si devolviéramos el array
  //      original, cualquiera podría alterarlo desde fuera con push():
  //        return this.#historial.map((registro) => ({ ...registro }));
  //   3. get tipo() -> getter calculado con el nombre de la clase real del
  //      objeto ("Libro", "Revista"). Lo usa la interfaz para la etiqueta:
  //        return this.constructor.name;
  //   4. get antiguedad() -> new Date().getFullYear() - this.#anio;
  //   (aprox. 12 lineas)

  // TODO (en clase): el SETTER CON VALIDACIÓN. El título sí se puede corregir
  // (una errata), pero pasando el control:
  //   set titulo(nuevoTitulo) {
  //     if (typeof nuevoTitulo !== 'string' || nuevoTitulo.trim().length < 2) {
  //       throw new TypeError('El título debe tener al menos 2 caracteres.');
  //     }
  //     this.#anotar(`título corregido: "${this.#titulo}" -> "${nuevoTitulo.trim()}"`);
  //     this.#titulo = nuevoTitulo.trim();
  //   }
  //   (aprox. 7 lineas)

  // TODO (en clase): los MÉTODOS PÚBLICOS, la interfaz que usa el resto de la
  // aplicación.
  //   1. prestar(persona): entrega la publicación a una persona. Devuelve un
  //      objeto {ok, mensaje} en lugar de lanzar un error, porque un préstamo
  //      fallido es una situación NORMAL que la interfaz debe explicar.
  //        const lector = (persona && String(persona).trim()) || 'Lector anónimo';
  //        si !this.#disponible -> return { ok: false,
  //             mensaje: `"${this.#titulo}" ya está prestada a ${this.#prestadaA}.` };
  //        si está libre: pon #disponible en false, #prestadaA = lector,
  //             Publicacion.#totalPrestamos += 1  (contador estático de la clase),
  //             this.#anotar(`prestada a ${lector}`) y devuelve
  //             { ok: true, mensaje: `"${this.#titulo}" prestada a ${lector}.` }
  //   2. devolver(): la publicación vuelve a estar disponible.
  //        si ya estaba disponible -> { ok: false, mensaje: `"${this.#titulo}" no estaba prestada.` }
  //        si no: guarda `const anterior = this.#prestadaA;`, pon #disponible en
  //             true y #prestadaA en null, anota `devuelta por ${anterior}` y
  //             devuelve { ok: true, mensaje: `"${this.#titulo}" devuelta por ${anterior}.` }
  //   3. coincideCon(texto): ¿el texto buscado aparece en el título o en la
  //      autoría? toLowerCase() en ambos lados para que la búsqueda no distinga
  //      mayúsculas. Con la cadena vacía devuelve true (coinciden todas).
  //   (aprox. 34 lineas)

  // TODO (en clase): el MÉTODO ABSTRACTO y el método concreto que lo usa.
  //   1. descripcion() -> PILAR POLIMORFISMO. Publicacion NO sabe describirse:
  //      obliga a cada hija a hacerlo. Si una futura clase (Comic, Audiolibro...)
  //      se olvida de implementarlo, el error explica exactamente qué falta:
  //        throw new Error(`La clase ${this.constructor.name} debe implementar descripcion().`);
  //   2. ficha() -> MÉTODO CONCRETO, este sí implementado y heredado por todas.
  //      Llama a descripcion() sin saber cómo la resolverá cada una (abstracción):
  //        const estado = this.#disponible ? 'disponible' : `prestada a ${this.#prestadaA}`;
  //        return `[${this.#id}] ${this.descripcion()} — ${estado}`;
  //   3. toString() -> se usa automáticamente al convertir el objeto a texto:
  //        return this.ficha();
  //   (aprox. 12 lineas)

  // TODO (en clase): los MIEMBROS ESTÁTICOS (información de la CLASE, no de un
  // objeto). ⚠️ OJO: dentro de un método estático que puede heredarse, `this` es
  // la clase que hizo la llamada (podría ser Libro). Por eso accedemos siempre a
  // los campos privados con el nombre explícito Publicacion.
  //   1. static get totalCreadas()   { return Publicacion.#totalCreadas; }
  //      static get totalPrestamos() { return Publicacion.#totalPrestamos; }
  //   2. static masAntigua(a, b) -> utilidad que compara dos publicaciones por
  //      año; no necesita ninguna instancia concreta, por eso es static (igual
  //      que Math.max o Array.isArray):  return a.anio <= b.anio ? a : b;
  //   3. static esPublicacion(objeto) -> comprobación de tipo segura con campos
  //      privados: solo devuelve true si el objeto se creó realmente con esta
  //      clase o una hija suya:  return #id in Object(objeto);
  //   Con esto se cierra la llave de `class Publicacion`.
  //   (aprox. 8 lineas)

  // ==========================================================================
  // 3. CLASES HIJAS: Libro y Revista
  // ==========================================================================
  // PILAR: HERENCIA. Ninguna de las dos vuelve a escribir prestar(), devolver()
  // ni los getters: todo eso lo reciben gratis de Publicacion.
  // PILAR: POLIMORFISMO. Cada una implementa descripcion() a su manera.

  // TODO (en clase): `class Libro extends Publicacion`.
  //   1. Campos privados propios: #paginas; #genero;
  //   2. constructor(titulo, autor, anio, paginas, genero):
  //        super(titulo, autor, anio);   // OBLIGATORIO y ANTES de usar `this`
  //        this.#paginas = Number(paginas) > 0 ? Number(paginas) : 100;
  //        this.#genero = genero || 'General';
  //   3. Getters: get paginas() y get genero().
  //   4. get horasDeLectura() -> getter calculado propio de los libros.
  //      Estimación sencilla, unas 50 páginas por hora:
  //        return Math.max(1, Math.round(this.#paginas / 50));
  //   5. descripcion() -> SOBRESCRITURA del método abstracto del padre:
  //        `"${this.titulo}" de ${this.autor} (${this.anio}) · ${this.#paginas} págs · ${this.#genero}`
  //   6. ficha() -> SOBRESCRITURA que REUTILIZA la del padre con super:
  //        return super.ficha() + ` · lectura aprox. ${this.horasDeLectura} h`;
  //   (aprox. 24 lineas)

  // TODO (en clase): `class Revista extends Publicacion`.
  //   1. Campos privados propios: #numero; #periodicidad;
  //   2. constructor(titulo, editorial, anio, numero, periodicidad):
  //        super(titulo, editorial, anio);
  //        this.#numero = Number(numero) > 0 ? Number(numero) : 1;
  //        this.#periodicidad = periodicidad || 'mensual';
  //   3. Getters: get numero() y get periodicidad().
  //   4. descripcion() -> misma orden ("descríbete"), respuesta completamente
  //      distinta:
  //        `"${this.titulo}" nº ${this.#numero} · ${this.periodicidad} · editada por ${this.autor} (${this.anio})`
  //   5. diasDePrestamo() -> las revistas se prestan menos días: devuelve 7.
  //      (Los libros suelen ser 15; eso se usa en el ejercicio 3.)
  //   (aprox. 20 lineas)

  // ==========================================================================
  // 4. CLASE Biblioteca: GESTIÓN DE LA COLECCIÓN
  // ==========================================================================
  // PILAR: ABSTRACCIÓN. Por fuera se usa con verbos claros (agregar, prestar,
  // devolver, buscar, listar). Por dentro hay un array, pero eso es asunto
  // suyo: si mañana cambiamos el array por un Map, nadie se entera.

  // TODO (en clase): `class Biblioteca`, primera parte.
  //   1. Campos privados: #nombre;  #coleccion = [];
  //      Y el contador estático de cuántas bibliotecas se han creado:
  //        static #instancias = 0;
  //   2. constructor(nombre) -> this.#nombre = nombre; Biblioteca.#instancias += 1;
  //   3. get nombre() { return this.#nombre; }
  //   4. Getters CALCULADOS: se leen como propiedades y siempre están al día:
  //        get total()       -> this.#coleccion.length
  //        get disponibles() -> this.#coleccion.filter((p) => p.disponible).length
  //        get prestadas()   -> this.#coleccion.filter((p) => !p.disponible).length
  //        static get instancias() -> Biblioteca.#instancias
  //   (aprox. 12 lineas)

  // TODO (en clase): los métodos de gestión de Biblioteca.
  //   1. agregar(...publicaciones) -> recorre con forEach; si el elemento NO es
  //      `instanceof Publicacion` imprime
  //        '⚠ Solo se pueden agregar objetos Publicacion (o hijas).'
  //      y sale de esa vuelta con return; si lo es, hace push a #coleccion.
  //      Al final devuelve this (permite encadenar .agregar(a).agregar(b)).
  //   2. buscarPorId(id) -> método auxiliar. find() devuelve el primer elemento
  //      que cumpla la condición, o undefined si no hay ninguno:
  //        return this.#coleccion.find((publicacion) => publicacion.id === id);
  //   3. prestar(id, persona) -> DELEGA en el método prestar() de la publicación:
  //      la biblioteca no toca los datos internos, solo pide el favor. Si no
  //      existe devuelve { ok: false, mensaje: `No existe la publicación ${id}.` }.
  //   4. devolver(id) -> igual que el anterior, llamando a publicacion.devolver().
  //   5. buscar(texto) -> filtra usando coincideCon() de cada publicación.
  //      POLIMORFISMO: da igual que sean libros o revistas.
  //   (aprox. 26 lineas)

  // TODO (en clase): listar() y estadisticas(), los dos métodos de consulta.
  //   1. listar(filtro = 'todas', texto = '') -> devuelve una COPIA filtrada y
  //      ordenada. Nunca devolvemos el array interno: rompería el encapsulamiento.
  //        let resultado = this.buscar(texto);
  //        switch (filtro) con estos casos, cada uno con su break:
  //          'disponibles' -> resultado.filter((p) => p.disponible)
  //          'prestadas'   -> resultado.filter((p) => !p.disponible)
  //          'libros'      -> resultado.filter((p) => p instanceof Libro)
  //          'revistas'    -> resultado.filter((p) => p instanceof Revista)
  //          default       -> 'todas': no filtramos nada más.
  //        Y al final, sort() con localeCompare, que ordena alfabéticamente
  //        respetando tildes y ñ:
  //          return resultado.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
  //   2. estadisticas() -> resumen del estado actual, combinando datos de
  //      instancia con los contadores estáticos de Publicacion. Devuelve el
  //      objeto con estas claves EXACTAS, que la interfaz usará después:
  //        { biblioteca: this.#nombre, total: this.total,
  //          disponibles: this.disponibles, prestadas: this.prestadas,
  //          creadasEnTotal: Publicacion.totalCreadas,
  //          prestamosRealizados: Publicacion.totalPrestamos }
  //   Con esto se cierra la llave de `class Biblioteca`.
  //   (aprox. 34 lineas)

  // ==========================================================================
  // 5. CATÁLOGO INICIAL
  // ==========================================================================

  // DATOS DE PARTIDA (ya escritos: teclear los títulos en clase es tiempo
  // perdido). En la versión resuelta estos seis registros aparecen escritos
  // directamente como llamadas a `new Libro(...)` y `new Revista(...)` dentro
  // de cargarCatalogoInicial(); aquí los dejamos como datos planos para poder
  // recorrerlos sin que exista todavía ninguna clase.
  const DATOS_INICIALES = [
    { tipo: 'libro', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, extra: 471, detalle: 'Novela' },
    { tipo: 'libro', titulo: 'El nombre de la rosa', autor: 'Umberto Eco', anio: 1980, extra: 640, detalle: 'Histórica' },
    { tipo: 'libro', titulo: 'JavaScript sin misterios', autor: 'Marta Gil', anio: 2024, extra: 320, detalle: 'Técnico' },
    { tipo: 'libro', titulo: 'Estructuras de datos', autor: 'Pablo Ortega', anio: 2021, extra: 512, detalle: 'Técnico' },
    { tipo: 'revista', titulo: 'Ciencia Hoy', autor: 'Editorial Aula', anio: 2025, extra: 148, detalle: 'mensual' },
    { tipo: 'revista', titulo: 'Código Abierto', autor: 'Comunidad Dev', anio: 2025, extra: 12, detalle: 'trimestral' },
  ];

  // TODO (en clase):
  //   1. Crea la biblioteca:
  //        const biblioteca = new Biblioteca('Biblioteca del campus');
  //   2. Escribe `function cargarCatalogoInicial()`, que crea las publicaciones
  //      de ejemplo. La sacamos a una función para poder reutilizarla con el
  //      botón "reiniciar". Recorre DATOS_INICIALES y por cada registro:
  //        const publicacion = dato.tipo === 'libro'
  //          ? new Libro(dato.titulo, dato.autor, dato.anio, dato.extra, dato.detalle)
  //          : new Revista(dato.titulo, dato.autor, dato.anio, dato.extra, dato.detalle);
  //        biblioteca.agregar(publicacion);
  //   3. Llámala una vez:  cargarCatalogoInicial();
  //   Resultado esperado: 6 publicaciones en el catálogo (4 libros y 2 revistas).
  //   (aprox. 10 lineas)

  // ==========================================================================
  // 5.1 DEMOSTRACIÓN EN LA CONSOLA (lo que el docente explica antes de tocar la UI)
  // ==========================================================================

  // TODO (en clase): la cabecera de la demostración.
  //   1. titulo('SISTEMA DE BIBLIOTECA: DEMOSTRACIÓN').
  //   2. imprimir('Biblioteca creada:', biblioteca.nombre);
  //      imprimir('Publicaciones en el catálogo:', biblioteca.total);   -> 6
  //   (aprox. 3 lineas)

  // TODO (en clase): POLIMORFISMO — mismo bucle, mismo método, resultados
  // distintos.
  //   1. imprimir('\n--- POLIMORFISMO: todas se describen con descripcion() ---');
  //   2. biblioteca.listar().forEach((publicacion) => {
  //        imprimir(`[${publicacion.tipo}] ${publicacion.descripcion()}`);
  //      });
  //   Resultado esperado en pantalla: seis líneas ordenadas alfabéticamente,
  //   empezando por "[Revista] "Ciencia Hoy" nº 148 · mensual · editada por
  //   Editorial Aula (2025)".
  //   (aprox. 4 lineas)

  // TODO (en clase): ENCAPSULAMIENTO — los datos privados no se pueden tocar.
  //   1. imprimir('\n--- ENCAPSULAMIENTO ---');
  //      const primera = biblioteca.listar()[0];
  //      imprimir('Título (getter):', primera.titulo);
  //      imprimir('¿Se puede leer primera["#titulo"]?', primera['#titulo']);  -> undefined
  //      imprimir('Object.keys() no muestra nada privado:', Object.keys(primera));  -> []
  //   2. Intentamos "robar" la disponibilidad asignándola directamente. Como el
  //      getter `disponible` no tiene setter, en modo estricto salta un error:
  //        try { primera.disponible = true; }
  //        catch (error) { imprimir('⚠ No se puede asignar a un getter sin setter:', error.message); }
  //   3. El setter de título sí existe, pero valida:
  //        try { primera.titulo = 'X'; }   // demasiado corto
  //        catch (error) { imprimir('⚠ El setter rechaza el valor:', error.message); }
  //   OJO: la constante `primera` se usa hasta el final de la demostración.
  //   (aprox. 12 lineas)

  // TODO (en clase): HERENCIA — métodos del padre disponibles en las hijas.
  //   1. imprimir('\n--- HERENCIA ---');
  //   2. imprimir('Resultado de prestar:', biblioteca.prestar(primera.id, 'Ana Torres').mensaje);
  //      imprimir('Intento repetido:    ', biblioteca.prestar(primera.id, 'Luis Ramírez').mensaje);
  //      imprimir('Ficha completa:      ', primera.ficha());
  //      imprimir('Historial interno (copia):', primera.historial);
  //   Resultado esperado en pantalla: el préstamo correcto, el segundo intento
  //   rechazado ("ya está prestada a Ana Torres"), la ficha con el estado y el
  //   historial con dos registros.
  //   (aprox. 5 lineas)

  // TODO (en clase): MIEMBROS ESTÁTICOS.
  //   1. imprimir('\n--- ESTÁTICOS ---');
  //      imprimir('Publicaciones creadas en total:', Publicacion.totalCreadas);
  //      imprimir('Préstamos realizados:', Publicacion.totalPrestamos);
  //      imprimir('Bibliotecas creadas:', Biblioteca.instancias);
  //   2. const masVieja = Publicacion.masAntigua(biblioteca.listar()[0], biblioteca.listar()[1]);
  //      imprimir('La más antigua de las dos primeras:', masVieja.titulo, masVieja.anio);
  //   Resultado esperado en pantalla: 6 creadas, 1 préstamo, 1 biblioteca.
  //   (aprox. 6 lineas)

  // TODO (en clase): CLASE ABSTRACTA.
  //   1. imprimir('\n--- CLASE ABSTRACTA ---');
  //   2. Dentro de un try haz `new Publicacion('Prueba', 'Nadie', 2020)` y
  //      captura el error con  imprimir('⚠', error.message)
  //   3. Una hija que se olvida de implementar descripcion():
  //        class Comic extends Publicacion {}
  //        try { const comic = new Comic('Comic sin descripción', 'Autoría X', 2023);
  //              imprimir(comic.descripcion()); }
  //        catch (error) { imprimir('⚠', error.message); }
  //   Resultado esperado en pantalla:
  //        ⚠ Publicacion es una clase abstracta: usa Libro o Revista.
  //        ⚠ La clase Comic debe implementar descripcion().
  //   (aprox. 12 lineas)

  // TODO (en clase): COMPROBACIÓN DE TIPOS y limpieza final.
  //   1. imprimir('\n--- instanceof ---');
  //      imprimir('primera instanceof Libro:      ', primera instanceof Libro);
  //      imprimir('primera instanceof Publicacion:', primera instanceof Publicacion);
  //      imprimir('¿Un objeto falso pasa el control?',
  //        Publicacion.esPublicacion({ id: 'P-999', titulo: 'Falso' }));   -> false
  //   2. Devolvemos la publicación para dejar el catálogo limpio antes de pintar:
  //        biblioteca.devolver(primera.id);
  //   (aprox. 6 lineas)

  // ==========================================================================
  // 6. CAPA DE INTERFAZ (DOM)
  // ==========================================================================
  // Separamos claramente el MODELO (las clases de arriba, que no saben nada de
  // HTML) de la VISTA (estas funciones, que solo pintan y escuchan eventos).
  // ✅ BUENA PRÁCTICA: si mañana cambias el diseño, las clases no se tocan.

  // TODO (en clase): las referencias a los elementos del HTML. Los ids ya están
  // puestos en index.html, solo hay que recogerlos con getElementById:
  //   const rejilla            -> 'rejilla-publicaciones'
  //   const buscador           -> 'buscador'
  //   const grupoFiltros       -> 'grupo-filtros'
  //   const formulario         -> 'form-publicacion'
  //   const campoTipo          -> 'campo-tipo'
  //   const campoTitulo        -> 'campo-titulo'
  //   const campoAutor         -> 'campo-autor'
  //   const campoAnio          -> 'campo-anio'
  //   const campoExtra         -> 'campo-extra'
  //   const etiquetaExtra      -> 'etiqueta-extra'
  //   const campoLector        -> 'campo-lector'
  //   const botonReiniciar     -> 'btn-reiniciar-biblioteca'
  //   const botonLimpiarConsola -> 'limpiar-06'
  // Y después la salida de seguridad, para que el archivo no rompa si el HTML
  // no tiene la sección del proyecto:
  //   if (!rejilla) return;
  // Estado de la vista: qué filtro está activo y qué se ha escrito en la búsqueda:
  //   const estadoVista = { filtro: 'todas', texto: '' };
  //   (aprox. 17 lineas)

  // TODO (en clase): pintarEstadisticas(), que vuelca los contadores en el
  // panel superior.
  //   1. const datos = biblioteca.estadisticas();
  //   2. Función auxiliar interna para no repetir código:
  //        const asignar = (id, valor) => {
  //          const elemento = document.getElementById(id);
  //          if (elemento) elemento.textContent = valor;
  //        };
  //   3. Cinco llamadas, con estos ids EXACTOS del HTML:
  //        asignar('metrica-total', datos.total);
  //        asignar('metrica-disponibles', datos.disponibles);
  //        asignar('metrica-prestadas', datos.prestadas);
  //        asignar('metrica-creadas', datos.creadasEnTotal);
  //        asignar('metrica-prestamos', datos.prestamosRealizados);
  //   Resultado esperado en pantalla: el panel "Estado del sistema" pasa de
  //   ceros a 6 · 6 · 0 · 6 · 1.
  //   (aprox. 12 lineas)

  // TODO (en clase): crearTarjeta(publicacion), que devuelve el HTML de UNA
  // publicación. POLIMORFISMO en la vista: llamamos a publicacion.descripcion()
  // sin preguntar si es Libro o Revista. Cada objeto responde por sí mismo.
  //   1. Prepara las tres variables de estilo:
  //        const disponible = publicacion.disponible;
  //        const claseTipo = 'tipo-' + publicacion.tipo.toLowerCase();  // tipo-libro / tipo-revista
  //        const clasePrestada = disponible ? '' : ' prestada';
  //   2. Devuelve una plantilla de texto con esta estructura (las clases ya
  //      existen en css/estilos.css, respétalas tal cual):
  //        <article class="tarjeta-publicacion ${claseTipo}${clasePrestada}">
  //          <div> con  <span class="insignia ${disponible ? 'disponible' : 'prestado'}">
  //                       ${disponible ? 'Disponible' : 'Prestada'}</span>
  //                y    <span class="insignia tipo">${escapar(publicacion.tipo)}</span>
  //          <h4>${escapar(publicacion.titulo)}</h4>
  //          <p class="meta">${escapar(publicacion.autor)} · ${publicacion.anio} · ${escapar(publicacion.id)}</p>
  //          <p class="descripcion">${escapar(publicacion.descripcion())}</p>
  //          si NO está disponible, además:
  //            <p class="meta">En poder de: <strong>${escapar(publicacion.prestadaA)}</strong></p>
  //          <div class="acciones-tarjeta"> con TRES botones:
  //            class="boton"           data-accion="prestar"  data-id="${publicacion.id}"  disabled si NO disponible
  //            class="boton exito"     data-accion="devolver" data-id="${publicacion.id}"  disabled si SÍ disponible
  //            class="boton secundario" data-accion="ficha"   data-id="${publicacion.id}"
  //   Los botones llevan data-accion y data-id: así un ÚNICO manejador de
  //   eventos sirve para todas las tarjetas (delegación de eventos).
  //   Recuerda pasar por escapar() todo texto que venga del usuario (XSS).
  //   (aprox. 30 lineas)

  // TODO (en clase): pintar() y registrar().
  //   1. pintar() -> redibuja la rejilla completa según el estado de la vista:
  //        const lista = biblioteca.listar(estadoVista.filtro, estadoVista.texto);
  //        si lista.length === 0:
  //          rejilla.innerHTML = '<p class="vacio">No hay publicaciones que coincidan con la búsqueda.</p>';
  //        si no: map + join, convertimos cada objeto en HTML y lo unimos:
  //          rejilla.innerHTML = lista.map(crearTarjeta).join('');
  //        y termina llamando a pintarEstadisticas();
  //   2. registrar(resultado) -> muestra el resultado de una operación en la
  //      consola visual. Recibe el objeto {ok, mensaje} que devuelven prestar()
  //      y devolver():
  //        imprimir((resultado.ok ? '✔ ' : '✖ ') + resultado.mensaje);
  //   (aprox. 12 lineas)

  // TODO (en clase): DELEGACIÓN DE EVENTOS en la rejilla. En lugar de poner un
  // listener en cada botón (que además desaparecen cada vez que repintamos),
  // ponemos UNO solo en el contenedor y miramos qué botón fue el origen.
  //   1. rejilla.addEventListener('click', function (evento) { ... });
  //   2. Dentro: closest() sube por el árbol desde el elemento clicado buscando
  //      un botón; si no hay, se ignora el clic:
  //        const boton = evento.target.closest('button[data-accion]');
  //        if (!boton) return;
  //        const id = boton.dataset.id;          // data-id -> dataset.id
  //        const accion = boton.dataset.accion;  // data-accion -> dataset.accion
  //   3. Tres ramas:
  //        'prestar'  -> const lector = campoLector ? campoLector.value : '';
  //                      registrar(biblioteca.prestar(id, lector));
  //        'devolver' -> registrar(biblioteca.devolver(id));
  //        'ficha'    -> busca con biblioteca.buscarPorId(id) y, si existe:
  //                        imprimir('\nFICHA -> ' + publicacion);  // toString() se dispara al concatenar
  //                        imprimir('Historial:', publicacion.historial);
  //   4. Y al final, fuera del if, pintar();  para reflejar el nuevo estado.
  //   (aprox. 22 lineas)

  // TODO (en clase): el BUSCADOR.
  //   1. if (buscador) { buscador.addEventListener('input', function (evento) {
  //        estadoVista.texto = evento.target.value;
  //        pintar();
  //      }); }
  //      ('input' se dispara con cada tecla; 'change' solo al perder el foco.)
  //   Resultado esperado: al teclear "eco" solo queda "El nombre de la rosa".
  //   (aprox. 6 lineas)

  // TODO (en clase): los FILTROS, también con delegación de eventos.
  //   1. if (grupoFiltros) { grupoFiltros.addEventListener('click', function (evento) { ... }); }
  //   2. Dentro:
  //        const boton = evento.target.closest('button[data-filtro]');
  //        if (!boton) return;
  //        estadoVista.filtro = boton.dataset.filtro;
  //        // Marcamos visualmente cuál está activo:
  //        grupoFiltros.querySelectorAll('button[data-filtro]').forEach((b) => {
  //          b.classList.toggle('filtro-activo', b === boton);
  //        });
  //        pintar();
  //   Resultado esperado: la pestaña pulsada se resalta y la rejilla se reduce.
  //   (aprox. 12 lineas)

  // TODO (en clase): el FORMULARIO DE ALTA.
  //   1. Todo dentro de  if (formulario) { ... }
  //   2. Primero, cambiar la etiqueta del campo extra según el tipo elegido:
  //        if (campoTipo && etiquetaExtra) {
  //          campoTipo.addEventListener('change', function () {
  //            etiquetaExtra.textContent = campoTipo.value === 'libro' ? 'Páginas' : 'Número';
  //            campoExtra.placeholder = campoTipo.value === 'libro' ? '320' : '148';
  //          });
  //        }
  //   3. Después el envío:  formulario.addEventListener('submit', function (evento) { ... })
  //      ⚠️ IMPRESCINDIBLE: empieza con evento.preventDefault(). Sin él, el
  //      navegador recarga la página al enviar el formulario y perderíamos todo
  //      el estado.
  //      Recoge los cinco valores (campoTipo.value, campoTitulo.value,
  //      campoAutor.value, campoAnio.value, campoExtra.value) y, dentro de un try:
  //        const nueva = tipo === 'libro'
  //          ? new Libro(tituloNuevo, autorNuevo, anioNuevo, extra, 'General')
  //          : new Revista(tituloNuevo, autorNuevo, anioNuevo, extra, 'mensual');
  //        biblioteca.agregar(nueva);
  //        imprimir('✔ Alta correcta: ' + nueva.ficha());
  //        formulario.reset();   // Vacía los campos
  //        pintar();
  //      Y en el catch, si el constructor lanzó un error de validación:
  //        imprimir('✖ No se pudo crear: ' + error.message);
  //   Resultado esperado: con el título vacío aparece "✖ No se pudo crear: El
  //   título es obligatorio." y NO se añade nada al catálogo.
  //   (aprox. 34 lineas)

  // TODO (en clase): el BOTÓN DE REINICIO ("Devolver todo").
  //   1. if (botonReiniciar) { botonReiniciar.addEventListener('click', function () { ... }); }
  //   2. Dentro: devolvemos todo lo prestado. Fíjate en que NO vaciamos el
  //      array: la biblioteca no expone ningún método para hacerlo, y así debe ser.
  //        biblioteca.listar().forEach((publicacion) => {
  //          if (!publicacion.disponible) publicacion.devolver();
  //        });
  //   3. Reinicia el estado de la vista: estadoVista.filtro = 'todas',
  //      estadoVista.texto = '', vacía el buscador si existe y vuelve a marcar
  //      el filtro "todas" con classList.toggle('filtro-activo', b.dataset.filtro === 'todas').
  //   4. Termina con:
  //        imprimir('\n↺ Todas las publicaciones han sido devueltas.');
  //        pintar();
  //   (aprox. 18 lineas)

  // TODO (en clase): el botón de limpiar la consola del proyecto y el PRIMER
  // PINTADO al cargar la página.
  //   1. if (botonLimpiarConsola) {
  //        botonLimpiarConsola.addEventListener('click', function () {
  //          document.getElementById(ID_SALIDA).textContent = '';
  //        });
  //      }
  //   2. pintar();
  //      imprimir('\n✔ Interfaz lista. Usa los botones de las tarjetas.');
  //   Resultado esperado: la rejilla se llena con las seis tarjetas y el panel
  //   de métricas deja de estar a cero.
  //   (aprox. 8 lineas)

  // ==========================================================================
  // EJERCICIOS PROPUESTOS
  // ==========================================================================
  //
  // 1) NUEVA SUBCLASE.
  //    Crea la clase `Audiolibro` que herede de Publicacion con los campos
  //    privados `#duracionMinutos` y `#narrador`. Implementa descripcion() y
  //    añade el getter calculado `duracionFormateada` ("5 h 20 min").
  //    Agrega dos audiolibros al catálogo inicial y comprueba que la interfaz
  //    los pinta sin tocar NI UNA LÍNEA de crearTarjeta(). Explica por qué.
  //
  // 2) FILTRO NUEVO.
  //    Añade el filtro "recientes" (publicaciones de los últimos 5 años).
  //    Necesitarás un botón nuevo en el HTML con data-filtro="recientes" y un
  //    case nuevo en el switch de listar(). Usa el getter `antiguedad`.
  //
  // 3) FECHAS DE DEVOLUCIÓN.
  //    Añade a Publicacion un campo privado `#fechaDevolucion`. Al prestar,
  //    calcula la fecha sumando los días que indique el método
  //    `diasDePrestamo()` (15 para libros, 7 para revistas: tendrás que
  //    implementarlo también en Libro). Muestra la fecha en la tarjeta y
  //    marca en rojo las que estén fuera de plazo.
  //
  // 4) ESTADÍSTICAS AVANZADAS.
  //    Añade a Biblioteca el método `masPrestadas(n)` que devuelva las n
  //    publicaciones con más préstamos en su historial. Pista: cuenta cuántos
  //    registros del historial contienen la palabra "prestada".
  //
  // 5) RETO (difícil).
  //    Crea la clase `Socio` (nombre, dni privado, array privado de préstamos)
  //    con un límite de 3 publicaciones simultáneas. Cambia `prestar()` para
  //    que reciba un objeto Socio en lugar de un texto y rechace el préstamo
  //    si el socio ya llegó a su límite. Añade un selector de socios en la
  //    interfaz. Piensa bien qué relación hay entre Socio y Publicacion:
  //    ¿herencia o composición? Justifícalo en un comentario.
  // ==========================================================================
})();
