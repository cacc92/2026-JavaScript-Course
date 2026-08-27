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
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONSOLA VISUAL Y UTILIDADES
  // ==========================================================================
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

  class Publicacion {
    // ---- CAMPOS PRIVADOS DE INSTANCIA ----
    #id;
    #titulo;
    #autor;
    #anio;
    #disponible = true;
    #prestadaA = null;
    #historial = [];

    // ---- CAMPOS PRIVADOS ESTÁTICOS (pertenecen a la CLASE, no al objeto) ----
    // Los usamos como contadores globales del sistema. Al ser privados y
    // estáticos, nadie puede falsear las estadísticas desde fuera.
    static #ultimoId = 0;
    static #totalCreadas = 0;
    static #totalPrestamos = 0;

    constructor(titulo, autor, anio) {
      // --- CLASE ABSTRACTA SIMULADA ---
      // new.target es la clase con la que se llamó a `new`. Si alguien intenta
      // `new Publicacion(...)` directamente, lo impedimos.
      if (new.target === Publicacion) {
        throw new Error(
          'Publicacion es una clase abstracta: usa Libro o Revista.'
        );
      }

      // Validaciones: mejor detener la creación que guardar datos corruptos.
      if (typeof titulo !== 'string' || titulo.trim() === '') {
        throw new TypeError('El título es obligatorio.');
      }

      // Generamos un identificador único usando el contador estático privado.
      // ⚠️ IMPORTANTE: escribimos Publicacion.#ultimoId (nombre de la clase) y
      // NO this.constructor.#ultimoId. Si usáramos `this.constructor`, al crear
      // un Libro el motor buscaría el campo privado en la clase Libro (donde no
      // existe) y lanzaría un TypeError.
      Publicacion.#ultimoId += 1;
      Publicacion.#totalCreadas += 1;

      this.#id = 'P-' + String(Publicacion.#ultimoId).padStart(3, '0'); // P-001
      this.#titulo = titulo.trim();
      this.#autor = (autor && String(autor).trim()) || 'Autoría desconocida';
      this.#anio = Number(anio) || new Date().getFullYear();

      this.#anotar('alta en el catálogo');
    }

    // ---- MÉTODO PRIVADO: uso interno, no forma parte de la interfaz pública --
    #anotar(evento) {
      this.#historial.push({
        evento: evento,
        fecha: new Date().toLocaleTimeString('es-ES'),
      });
    }

    // ---- GETTERS: lectura controlada (ENCAPSULAMIENTO) ----
    // Fíjate en que NO hay setters para id, disponible ni prestadaA: son datos
    // que solo puede cambiar la propia clase mediante prestar() y devolver().
    get id() { return this.#id; }
    get titulo() { return this.#titulo; }
    get autor() { return this.#autor; }
    get anio() { return this.#anio; }
    get disponible() { return this.#disponible; }
    get prestadaA() { return this.#prestadaA; }

    // Getter que devuelve una COPIA del historial: si devolviéramos el array
    // original, cualquiera podría alterarlo desde fuera con push().
    get historial() {
      return this.#historial.map((registro) => ({ ...registro }));
    }

    // Getter calculado: el nombre de la clase real del objeto ("Libro",
    // "Revista"). Lo usamos en la interfaz para poner la etiqueta de tipo.
    get tipo() {
      return this.constructor.name;
    }

    // Getter calculado: cuántos años tiene la publicación.
    get antiguedad() {
      return new Date().getFullYear() - this.#anio;
    }

    // ---- SETTER CON VALIDACIÓN ----
    // El título sí se puede corregir (una errata), pero pasando el control.
    set titulo(nuevoTitulo) {
      if (typeof nuevoTitulo !== 'string' || nuevoTitulo.trim().length < 2) {
        throw new TypeError('El título debe tener al menos 2 caracteres.');
      }
      this.#anotar(`título corregido: "${this.#titulo}" -> "${nuevoTitulo.trim()}"`);
      this.#titulo = nuevoTitulo.trim();
    }

    // ---- MÉTODOS PÚBLICOS: la interfaz que usa el resto de la aplicación ----

    /**
     * prestar(): entrega la publicación a una persona.
     * Devuelve un objeto {ok, mensaje} en lugar de lanzar un error, porque un
     * préstamo fallido es una situación NORMAL que la interfaz debe explicar.
     */
    prestar(persona) {
      const lector = (persona && String(persona).trim()) || 'Lector anónimo';

      if (!this.#disponible) {
        return {
          ok: false,
          mensaje: `"${this.#titulo}" ya está prestada a ${this.#prestadaA}.`,
        };
      }

      this.#disponible = false;
      this.#prestadaA = lector;
      Publicacion.#totalPrestamos += 1; // Contador estático de toda la clase
      this.#anotar(`prestada a ${lector}`);

      return { ok: true, mensaje: `"${this.#titulo}" prestada a ${lector}.` };
    }

    /**
     * devolver(): la publicación vuelve a estar disponible.
     */
    devolver() {
      if (this.#disponible) {
        return { ok: false, mensaje: `"${this.#titulo}" no estaba prestada.` };
      }

      const anterior = this.#prestadaA;
      this.#disponible = true;
      this.#prestadaA = null;
      this.#anotar(`devuelta por ${anterior}`);

      return { ok: true, mensaje: `"${this.#titulo}" devuelta por ${anterior}.` };
    }

    /**
     * coincideCon(): ¿el texto buscado aparece en el título o en la autoría?
     * toLowerCase() en ambos lados para que la búsqueda no distinga mayúsculas.
     */
    coincideCon(texto) {
      const busqueda = String(texto).toLowerCase().trim();
      if (busqueda === '') return true; // Sin texto, coinciden todas
      return (
        this.#titulo.toLowerCase().includes(busqueda) ||
        this.#autor.toLowerCase().includes(busqueda)
      );
    }

    // ---- MÉTODO ABSTRACTO ----
    // PILAR: POLIMORFISMO. Publicacion NO sabe describirse: obliga a cada hija
    // a hacerlo. Si una futura clase (Comic, Audiolibro...) se olvida de
    // implementarlo, el error explica exactamente qué falta.
    descripcion() {
      throw new Error(
        `La clase ${this.constructor.name} debe implementar descripcion().`
      );
    }

    // ---- MÉTODO CONCRETO QUE USA EL ABSTRACTO ----
    // Este método sí está implementado y lo heredan todas las hijas. Llama a
    // descripcion() sin saber cómo la resolverá cada una: abstracción pura.
    ficha() {
      const estado = this.#disponible ? 'disponible' : `prestada a ${this.#prestadaA}`;
      return `[${this.#id}] ${this.descripcion()} — ${estado}`;
    }

    // toString() se usa automáticamente al convertir el objeto a texto.
    toString() {
      return this.ficha();
    }

    // ---- MIEMBROS ESTÁTICOS: información de la CLASE, no de un objeto ----
    // ⚠️ OJO: dentro de un método estático que puede heredarse, `this` es la
    // clase que hizo la llamada (podría ser Libro). Por eso accedemos siempre
    // a los campos privados con el nombre explícito Publicacion.
    static get totalCreadas() { return Publicacion.#totalCreadas; }
    static get totalPrestamos() { return Publicacion.#totalPrestamos; }

    /**
     * Método estático de utilidad: compara dos publicaciones por año.
     * No necesita ninguna instancia concreta, por eso es static (igual que
     * Math.max o Array.isArray).
     */
    static masAntigua(a, b) {
      return a.anio <= b.anio ? a : b;
    }

    /**
     * Comprobación de tipo segura con campos privados: solo devuelve true si
     * el objeto se creó realmente con esta clase o una hija suya.
     */
    static esPublicacion(objeto) {
      return #id in Object(objeto);
    }
  }

  // ==========================================================================
  // 3. CLASES HIJAS: Libro y Revista
  // ==========================================================================
  // PILAR: HERENCIA. Ninguna de las dos vuelve a escribir prestar(), devolver()
  // ni los getters: todo eso lo reciben gratis de Publicacion.
  // PILAR: POLIMORFISMO. Cada una implementa descripcion() a su manera.

  class Libro extends Publicacion {
    #paginas;
    #genero;

    constructor(titulo, autor, anio, paginas, genero) {
      // super() ejecuta el constructor de Publicacion. Es OBLIGATORIO y debe
      // ir ANTES de usar `this`.
      super(titulo, autor, anio);

      this.#paginas = Number(paginas) > 0 ? Number(paginas) : 100;
      this.#genero = genero || 'General';
    }

    get paginas() { return this.#paginas; }
    get genero() { return this.#genero; }

    // Getter calculado propio de los libros.
    get horasDeLectura() {
      // Estimación sencilla: unas 50 páginas por hora.
      return Math.max(1, Math.round(this.#paginas / 50));
    }

    // SOBRESCRITURA del método abstracto del padre.
    descripcion() {
      return `"${this.titulo}" de ${this.autor} (${this.anio}) · ${this.#paginas} págs · ${this.#genero}`;
    }

    // SOBRESCRITURA que REUTILIZA la del padre con super.
    ficha() {
      return super.ficha() + ` · lectura aprox. ${this.horasDeLectura} h`;
    }
  }

  class Revista extends Publicacion {
    #numero;
    #periodicidad;

    constructor(titulo, editorial, anio, numero, periodicidad) {
      super(titulo, editorial, anio);
      this.#numero = Number(numero) > 0 ? Number(numero) : 1;
      this.#periodicidad = periodicidad || 'mensual';
    }

    get numero() { return this.#numero; }
    get periodicidad() { return this.#periodicidad; }

    // Misma orden ("descríbete"), respuesta completamente distinta.
    descripcion() {
      return `"${this.titulo}" nº ${this.#numero} · ${this.periodicidad} · editada por ${this.autor} (${this.anio})`;
    }

    // Las revistas se prestan menos días: añadimos un dato propio.
    diasDePrestamo() {
      return 7; // Los libros suelen ser 15; esto lo usamos en el ejercicio 3
    }
  }

  // ==========================================================================
  // 4. CLASE Biblioteca: GESTIÓN DE LA COLECCIÓN
  // ==========================================================================
  // PILAR: ABSTRACCIÓN. Por fuera se usa con verbos claros (agregar, prestar,
  // devolver, buscar, listar). Por dentro hay un array, pero eso es asunto
  // suyo: si mañana cambiamos el array por un Map, nadie se entera.

  class Biblioteca {
    #nombre;
    #coleccion = [];

    // Contador estático: cuántas bibliotecas se han creado en la aplicación.
    static #instancias = 0;

    constructor(nombre) {
      this.#nombre = nombre;
      Biblioteca.#instancias += 1;
    }

    get nombre() { return this.#nombre; }

    // Getters calculados: se leen como propiedades y siempre están al día.
    get total() { return this.#coleccion.length; }
    get disponibles() { return this.#coleccion.filter((p) => p.disponible).length; }
    get prestadas() { return this.#coleccion.filter((p) => !p.disponible).length; }

    static get instancias() { return Biblioteca.#instancias; }

    /**
     * agregar(): añade una publicación validando que sea del tipo correcto.
     * Acepta uno o varios elementos gracias al parámetro rest.
     */
    agregar(...publicaciones) {
      publicaciones.forEach((publicacion) => {
        // Comprobación de tipo: si no es una Publicacion, no entra.
        if (!(publicacion instanceof Publicacion)) {
          imprimir('⚠ Solo se pueden agregar objetos Publicacion (o hijas).');
          return;
        }
        this.#coleccion.push(publicacion);
      });
      return this; // Permite encadenar: biblioteca.agregar(a).agregar(b)
    }

    /**
     * buscarPorId(): método auxiliar interno. find() devuelve el primer
     * elemento que cumpla la condición, o undefined si no hay ninguno.
     */
    buscarPorId(id) {
      return this.#coleccion.find((publicacion) => publicacion.id === id);
    }

    /**
     * prestar(): delega en el método prestar() de la publicación.
     * La biblioteca no toca los datos internos: solo pide el favor.
     */
    prestar(id, persona) {
      const publicacion = this.buscarPorId(id);
      if (!publicacion) return { ok: false, mensaje: `No existe la publicación ${id}.` };
      return publicacion.prestar(persona);
    }

    devolver(id) {
      const publicacion = this.buscarPorId(id);
      if (!publicacion) return { ok: false, mensaje: `No existe la publicación ${id}.` };
      return publicacion.devolver();
    }

    /**
     * buscar(): filtra por texto usando el método coincideCon() de cada
     * publicación. POLIMORFISMO: da igual que sean libros o revistas.
     */
    buscar(texto) {
      return this.#coleccion.filter((publicacion) => publicacion.coincideCon(texto));
    }

    /**
     * listar(): devuelve una COPIA filtrada y ordenada de la colección.
     * Nunca devolvemos el array interno: eso rompería el encapsulamiento.
     */
    listar(filtro = 'todas', texto = '') {
      let resultado = this.buscar(texto);

      // switch: elegimos el criterio de filtrado según la pestaña activa.
      switch (filtro) {
        case 'disponibles':
          resultado = resultado.filter((p) => p.disponible);
          break;
        case 'prestadas':
          resultado = resultado.filter((p) => !p.disponible);
          break;
        case 'libros':
          resultado = resultado.filter((p) => p instanceof Libro);
          break;
        case 'revistas':
          resultado = resultado.filter((p) => p instanceof Revista);
          break;
        default:
          // 'todas': no filtramos nada más.
          break;
      }

      // sort() con localeCompare ordena alfabéticamente respetando tildes y ñ.
      return resultado.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
    }

    /**
     * estadisticas(): resumen del estado actual. Combina datos de instancia
     * con los contadores estáticos de la clase Publicacion.
     */
    estadisticas() {
      return {
        biblioteca: this.#nombre,
        total: this.total,
        disponibles: this.disponibles,
        prestadas: this.prestadas,
        creadasEnTotal: Publicacion.totalCreadas,
        prestamosRealizados: Publicacion.totalPrestamos,
      };
    }
  }

  // ==========================================================================
  // 5. CATÁLOGO INICIAL
  // ==========================================================================

  const biblioteca = new Biblioteca('Biblioteca del campus');

  /**
   * cargarCatalogoInicial(): crea las publicaciones de ejemplo.
   * La sacamos a una función para poder reutilizarla con el botón "reiniciar".
   */
  function cargarCatalogoInicial() {
    biblioteca.agregar(
      new Libro('Cien años de soledad', 'Gabriel García Márquez', 1967, 471, 'Novela'),
      new Libro('El nombre de la rosa', 'Umberto Eco', 1980, 640, 'Histórica'),
      new Libro('JavaScript sin misterios', 'Marta Gil', 2024, 320, 'Técnico'),
      new Libro('Estructuras de datos', 'Pablo Ortega', 2021, 512, 'Técnico'),
      new Revista('Ciencia Hoy', 'Editorial Aula', 2025, 148, 'mensual'),
      new Revista('Código Abierto', 'Comunidad Dev', 2025, 12, 'trimestral')
    );
  }

  cargarCatalogoInicial();

  // ==========================================================================
  // 5.1 DEMOSTRACIÓN EN LA CONSOLA (lo que el docente explica antes de tocar la UI)
  // ==========================================================================

  titulo('SISTEMA DE BIBLIOTECA: DEMOSTRACIÓN');

  imprimir('Biblioteca creada:', biblioteca.nombre);
  imprimir('Publicaciones en el catálogo:', biblioteca.total);

  // --- POLIMORFISMO: mismo bucle, mismo método, resultados distintos ---
  imprimir('\n--- POLIMORFISMO: todas se describen con descripcion() ---');
  biblioteca.listar().forEach((publicacion) => {
    imprimir(`[${publicacion.tipo}] ${publicacion.descripcion()}`);
  });

  // --- ENCAPSULAMIENTO: los datos privados no se pueden tocar ---
  imprimir('\n--- ENCAPSULAMIENTO ---');
  const primera = biblioteca.listar()[0];
  imprimir('Título (getter):', primera.titulo);
  imprimir('¿Se puede leer primera["#titulo"]?', primera['#titulo']); // undefined
  imprimir('Object.keys() no muestra nada privado:', Object.keys(primera));

  // Intentamos "robar" la disponibilidad asignándola directamente. Como el
  // getter `disponible` no tiene setter, en modo estricto salta un error.
  try {
    primera.disponible = true;
  } catch (error) {
    imprimir('⚠ No se puede asignar a un getter sin setter:', error.message);
  }

  // El setter de título sí existe, pero valida:
  try {
    primera.titulo = 'X'; // demasiado corto
  } catch (error) {
    imprimir('⚠ El setter rechaza el valor:', error.message);
  }

  // --- HERENCIA: métodos del padre disponibles en las hijas ---
  imprimir('\n--- HERENCIA ---');
  imprimir('Resultado de prestar:', biblioteca.prestar(primera.id, 'Ana Torres').mensaje);
  imprimir('Intento repetido:    ', biblioteca.prestar(primera.id, 'Luis Ramírez').mensaje);
  imprimir('Ficha completa:      ', primera.ficha());
  imprimir('Historial interno (copia):', primera.historial);

  // --- MIEMBROS ESTÁTICOS ---
  imprimir('\n--- ESTÁTICOS ---');
  imprimir('Publicaciones creadas en total:', Publicacion.totalCreadas);
  imprimir('Préstamos realizados:', Publicacion.totalPrestamos);
  imprimir('Bibliotecas creadas:', Biblioteca.instancias);

  const masVieja = Publicacion.masAntigua(biblioteca.listar()[0], biblioteca.listar()[1]);
  imprimir('La más antigua de las dos primeras:', masVieja.titulo, masVieja.anio);

  // --- CLASE ABSTRACTA ---
  imprimir('\n--- CLASE ABSTRACTA ---');
  try {
    const invalida = new Publicacion('Prueba', 'Nadie', 2020);
    imprimir('Esto nunca se ve', invalida);
  } catch (error) {
    imprimir('⚠', error.message);
  }

  // Una hija que se olvida de implementar descripcion():
  class Comic extends Publicacion {}
  try {
    const comic = new Comic('Comic sin descripción', 'Autoría X', 2023);
    imprimir(comic.descripcion());
  } catch (error) {
    imprimir('⚠', error.message);
  }

  // --- COMPROBACIÓN DE TIPOS ---
  imprimir('\n--- instanceof ---');
  imprimir('primera instanceof Libro:      ', primera instanceof Libro);
  imprimir('primera instanceof Publicacion:', primera instanceof Publicacion);
  imprimir('¿Un objeto falso pasa el control?',
    Publicacion.esPublicacion({ id: 'P-999', titulo: 'Falso' })); // false

  // Devolvemos la publicación para dejar el catálogo limpio antes de pintar.
  biblioteca.devolver(primera.id);

  // ==========================================================================
  // 6. CAPA DE INTERFAZ (DOM)
  // ==========================================================================
  // Separamos claramente el MODELO (las clases de arriba, que no saben nada de
  // HTML) de la VISTA (estas funciones, que solo pintan y escuchan eventos).
  // ✅ BUENA PRÁCTICA: si mañana cambias el diseño, las clases no se tocan.

  // --- Referencias a los elementos del HTML ---
  const rejilla = document.getElementById('rejilla-publicaciones');
  const buscador = document.getElementById('buscador');
  const grupoFiltros = document.getElementById('grupo-filtros');
  const formulario = document.getElementById('form-publicacion');
  const campoTipo = document.getElementById('campo-tipo');
  const campoTitulo = document.getElementById('campo-titulo');
  const campoAutor = document.getElementById('campo-autor');
  const campoAnio = document.getElementById('campo-anio');
  const campoExtra = document.getElementById('campo-extra');
  const etiquetaExtra = document.getElementById('etiqueta-extra');
  const campoLector = document.getElementById('campo-lector');
  const botonReiniciar = document.getElementById('btn-reiniciar-biblioteca');
  const botonLimpiarConsola = document.getElementById('limpiar-06');

  // Si el HTML no tiene la sección del proyecto, salimos sin romper nada.
  if (!rejilla) return;

  // Estado de la vista: qué filtro está activo y qué se ha escrito en la búsqueda.
  const estadoVista = {
    filtro: 'todas',
    texto: '',
  };

  /**
   * pintarEstadisticas(): vuelca los contadores en el panel superior.
   */
  function pintarEstadisticas() {
    const datos = biblioteca.estadisticas();
    const asignar = (id, valor) => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.textContent = valor;
    };
    asignar('metrica-total', datos.total);
    asignar('metrica-disponibles', datos.disponibles);
    asignar('metrica-prestadas', datos.prestadas);
    asignar('metrica-creadas', datos.creadasEnTotal);
    asignar('metrica-prestamos', datos.prestamosRealizados);
  }

  /**
   * crearTarjeta(): devuelve el HTML de UNA publicación.
   * POLIMORFISMO en la vista: llamamos a publicacion.descripcion() sin
   * preguntar si es Libro o Revista. Cada objeto responde por sí mismo.
   */
  function crearTarjeta(publicacion) {
    const disponible = publicacion.disponible;
    const claseTipo = 'tipo-' + publicacion.tipo.toLowerCase(); // tipo-libro / tipo-revista
    const clasePrestada = disponible ? '' : ' prestada';

    // Los botones llevan data-accion y data-id: así un ÚNICO manejador de
    // eventos sirve para todas las tarjetas (delegación de eventos).
    return `
      <article class="tarjeta-publicacion ${claseTipo}${clasePrestada}">
        <div>
          <span class="insignia ${disponible ? 'disponible' : 'prestado'}">
            ${disponible ? 'Disponible' : 'Prestada'}
          </span>
          <span class="insignia tipo">${escapar(publicacion.tipo)}</span>
        </div>
        <h4>${escapar(publicacion.titulo)}</h4>
        <p class="meta">${escapar(publicacion.autor)} · ${publicacion.anio} · ${escapar(publicacion.id)}</p>
        <p class="descripcion">${escapar(publicacion.descripcion())}</p>
        ${disponible
          ? ''
          : `<p class="meta">En poder de: <strong>${escapar(publicacion.prestadaA)}</strong></p>`}
        <div class="acciones-tarjeta">
          <button class="boton" data-accion="prestar" data-id="${publicacion.id}" ${disponible ? '' : 'disabled'}>
            Prestar
          </button>
          <button class="boton exito" data-accion="devolver" data-id="${publicacion.id}" ${disponible ? 'disabled' : ''}>
            Devolver
          </button>
          <button class="boton secundario" data-accion="ficha" data-id="${publicacion.id}">
            Ver ficha
          </button>
        </div>
      </article>
    `;
  }

  /**
   * pintar(): redibuja la rejilla completa según el estado de la vista.
   */
  function pintar() {
    const lista = biblioteca.listar(estadoVista.filtro, estadoVista.texto);

    if (lista.length === 0) {
      rejilla.innerHTML = '<p class="vacio">No hay publicaciones que coincidan con la búsqueda.</p>';
    } else {
      // map + join: convertimos cada objeto en HTML y lo unimos en una cadena.
      rejilla.innerHTML = lista.map(crearTarjeta).join('');
    }

    pintarEstadisticas();
  }

  /**
   * registrar(): muestra el resultado de una operación en la consola visual.
   * Recibe el objeto {ok, mensaje} que devuelven prestar() y devolver().
   */
  function registrar(resultado) {
    imprimir((resultado.ok ? '✔ ' : '✖ ') + resultado.mensaje);
  }

  // --- DELEGACIÓN DE EVENTOS ---
  // En lugar de poner un listener en cada botón (que además desaparecen cada
  // vez que repintamos), ponemos UNO solo en el contenedor. Cuando se hace
  // clic, miramos qué botón fue el origen.
  rejilla.addEventListener('click', function (evento) {
    // closest() sube por el árbol desde el elemento clicado buscando un botón.
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return; // Clic en cualquier otro sitio de la tarjeta: lo ignoramos

    const id = boton.dataset.id;          // data-id  -> dataset.id
    const accion = boton.dataset.accion;  // data-accion -> dataset.accion

    if (accion === 'prestar') {
      const lector = campoLector ? campoLector.value : '';
      registrar(biblioteca.prestar(id, lector));
    } else if (accion === 'devolver') {
      registrar(biblioteca.devolver(id));
    } else if (accion === 'ficha') {
      const publicacion = biblioteca.buscarPorId(id);
      if (publicacion) {
        // toString() se dispara solo al concatenar con un texto.
        imprimir('\nFICHA -> ' + publicacion);
        imprimir('Historial:', publicacion.historial);
      }
    }

    pintar(); // Repintamos para reflejar el nuevo estado
  });

  // --- BUSCADOR ---
  if (buscador) {
    // 'input' se dispara con cada tecla; 'change' solo al perder el foco.
    buscador.addEventListener('input', function (evento) {
      estadoVista.texto = evento.target.value;
      pintar();
    });
  }

  // --- FILTROS (también con delegación de eventos) ---
  if (grupoFiltros) {
    grupoFiltros.addEventListener('click', function (evento) {
      const boton = evento.target.closest('button[data-filtro]');
      if (!boton) return;

      estadoVista.filtro = boton.dataset.filtro;

      // Marcamos visualmente cuál está activo.
      grupoFiltros.querySelectorAll('button[data-filtro]').forEach((b) => {
        b.classList.toggle('filtro-activo', b === boton);
      });

      pintar();
    });
  }

  // --- FORMULARIO DE ALTA ---
  if (formulario) {
    // Cambiamos la etiqueta del campo extra según el tipo elegido.
    if (campoTipo && etiquetaExtra) {
      campoTipo.addEventListener('change', function () {
        etiquetaExtra.textContent = campoTipo.value === 'libro' ? 'Páginas' : 'Número';
        campoExtra.placeholder = campoTipo.value === 'libro' ? '320' : '148';
      });
    }

    formulario.addEventListener('submit', function (evento) {
      // ⚠️ IMPRESCINDIBLE: sin preventDefault el navegador recarga la página
      // al enviar el formulario y perderíamos todo el estado.
      evento.preventDefault();

      const tipo = campoTipo.value;
      const tituloNuevo = campoTitulo.value;
      const autorNuevo = campoAutor.value;
      const anioNuevo = campoAnio.value;
      const extra = campoExtra.value;

      try {
        // Aquí se ve la utilidad de las clases: una sola línea crea un objeto
        // completo, validado y con todos sus métodos listos para usar.
        const nueva = tipo === 'libro'
          ? new Libro(tituloNuevo, autorNuevo, anioNuevo, extra, 'General')
          : new Revista(tituloNuevo, autorNuevo, anioNuevo, extra, 'mensual');

        biblioteca.agregar(nueva);
        imprimir('✔ Alta correcta: ' + nueva.ficha());
        formulario.reset(); // Vacía los campos
        pintar();
      } catch (error) {
        // Si el constructor lanzó un error de validación, lo mostramos.
        imprimir('✖ No se pudo crear: ' + error.message);
      }
    });
  }

  // --- BOTÓN DE REINICIO ---
  if (botonReiniciar) {
    botonReiniciar.addEventListener('click', function () {
      // Devolvemos todo lo prestado. Fíjate en que no vaciamos el array: la
      // biblioteca no expone ningún método para hacerlo, y así debe ser.
      biblioteca.listar().forEach((publicacion) => {
        if (!publicacion.disponible) publicacion.devolver();
      });
      estadoVista.filtro = 'todas';
      estadoVista.texto = '';
      if (buscador) buscador.value = '';
      if (grupoFiltros) {
        grupoFiltros.querySelectorAll('button[data-filtro]').forEach((b) => {
          b.classList.toggle('filtro-activo', b.dataset.filtro === 'todas');
        });
      }
      imprimir('\n↺ Todas las publicaciones han sido devueltas.');
      pintar();
    });
  }

  if (botonLimpiarConsola) {
    botonLimpiarConsola.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // Primer pintado al cargar la página.
  pintar();
  imprimir('\n✔ Interfaz lista. Usa los botones de las tarjetas.');

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
