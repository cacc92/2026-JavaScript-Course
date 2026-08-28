/**
 * ============================================================================
 * ARCHIVO: js/04-formularios-y-validacion.js
 * PROYECTO: 07 · Eventos, formularios y almacenamiento
 * TEMA:    Formularios: eventos, lectura de datos y validación
 * ----------------------------------------------------------------------------
 * QUÉ APRENDERÁS AQUÍ:
 *   - El evento submit y por qué SIEMPRE lleva preventDefault().
 *   - input vs change: cuándo se dispara cada uno.
 *   - focus y blur (y sus hermanos que sí burbujean: focusin y focusout).
 *   - Cómo leer los datos: .value, .checked, .selected y selectedOptions.
 *   - FormData + Object.fromEntries: leer todo el formulario en una línea.
 *   - Validación escrita a mano con mensajes de error personalizados.
 *   - Validación nativa HTML5: required, pattern, min, max, type,
 *     checkValidity(), reportValidity(), setCustomValidity() y el objeto
 *     validity.
 *
 * ----------------------------------------------------------------------------
 * PLANTILLA DE CLASE
 *   Este archivo es la versión PARA ESCRIBIR EN VIVO. Conserva la teoría, los
 *   títulos de sección y el andamiaje (imprimir, titulo), pero el código de
 *   cada apartado está sustituido por instrucciones "TODO (en clase)".
 *   La versión resuelta está en ../../js/04-formularios-y-validacion.js
 * ============================================================================
 */

// IIFE: mantiene privadas las variables de este archivo.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================
  // ✅ ESTE APARTADO YA VIENE ESCRITO: es andamiaje, no materia. Sin él no se
  //    puede demostrar nada en pantalla desde el primer minuto de clase.

  const ID_SALIDA = 'salida-04';

  function imprimir(...mensajes) {
    console.log(...mensajes);
    const salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    salida.textContent += texto + '\n';
    salida.scrollTop = salida.scrollHeight;
  }

  function titulo(texto) {
    imprimir('\n===== ' + texto + ' =====');
  }

  const botonLimpiar04 = document.getElementById('limpiar-04');
  if (botonLimpiar04) {
    botonLimpiar04.addEventListener('click', function () {
      document.getElementById(ID_SALIDA).textContent = '';
    });
  }

  // ==========================================================================
  // 1. input vs change
  // ==========================================================================

  /*
    Los dos avisan de que un campo ha cambiado, pero en momentos distintos:

      input  -> EN CADA PULSACIÓN. Valor actualizado al instante.
                Ideal para: buscadores en vivo, contadores de caracteres,
                habilitar/deshabilitar el botón de enviar, validación al vuelo.

      change -> CUANDO EL CAMBIO SE "CONFIRMA". En un campo de texto, al perder
                el foco (o al pulsar Enter). En un <select>, checkbox o radio,
                al elegir la opción (ahí es inmediato).
                Ideal para: guardar en servidor, recalcular cosas caras.

    Analogía: input es alguien mirando por encima de tu hombro mientras
    escribes; change es el momento en que entregas el papel.
  */

  // TODO (en clase):
  //   1. const demoInput  = document.getElementById('demo-input');
  //      const demoChange = document.getElementById('demo-change');
  //   2. 'input' sobre demoInput (evento.target.value SIEMPRE trae el valor ya
  //      actualizado):
  //        imprimir('input  · valor actual: "' + evento.target.value + '" (' +
  //                 evento.target.value.length + ' caracteres)');
  //   3. 'change' sobre demoChange:
  //        titulo('1. change');
  //        imprimir('change · valor confirmado: "' + evento.target.value + '"');
  //        imprimir('Fíjate: no ha saltado ni una vez mientras escribías.');
  //   Resultado esperado: al escribir "hola" en el primer campo salen CUATRO
  //   líneas (una por tecla); en el segundo no sale nada hasta pulsar Tab.
  //   (aprox. 8 lineas)

  // ⚠️ ERROR COMÚN: usar change para un buscador en vivo. El usuario escribe
  //    y no pasa nada hasta que hace clic fuera. Para eso se usa input.

  // ==========================================================================
  // 2. focus Y blur
  // ==========================================================================

  /*
    focus -> el campo recibe el foco (clic dentro o llegada con Tab).
    blur  -> el campo pierde el foco.

    ⚠️ IMPORTANTE: focus y blur NO burbujean. Si necesitas escucharlos desde un
    contenedor (por ejemplo, todo el formulario), usa focusin y focusout, que
    son idénticos pero sí burbujean.

    ✅ BUENA PRÁCTICA: valida un campo en su blur (cuando el usuario ya ha
    terminado con él) y no en cada tecla; así no le gritas mientras escribe.
  */

  // TODO (en clase):
  //   1. const campoFocus = document.getElementById('campo-focus');
  //   2. 'focus' sobre campoFocus:
  //        titulo('2. focus / blur');
  //        imprimir('focus · el campo ha recibido el foco.');
  //   3. 'blur' sobre campoFocus:
  //        imprimir('blur  · el campo ha perdido el foco. Valor final: "' +
  //                 evento.target.value + '"');
  //   Resultado esperado: al hacer clic dentro sale el título y la línea focus;
  //   al hacer clic fuera, la línea blur con lo que se haya escrito.
  //   (aprox. 8 lineas)

  // ==========================================================================
  // 3. LEER LOS DATOS: value, checked, selected
  // ==========================================================================

  /*
    preventDefault() es OBLIGATORIO en el submit. Sin él, el navegador enviaría
    el formulario y RECARGARÍA la página: perderías todo el estado y verías el
    típico "parpadeo" que hace pensar que el código no funciona.
  */

  // TODO (en clase):
  //   1. const formDatos = document.getElementById('form-datos');
  //      (guárdalo en una constante del ámbito del archivo: el apartado 4
  //       también lo necesita)
  //   2. formDatos.addEventListener('submit', function (evento) { ... }) con
  //      evento.preventDefault() en la PRIMERA línea y titulo('3. Lectura manual de los datos').
  //   3. Campo de texto -> .value (SIEMPRE devuelve un string):
  //        const nombre = document.getElementById('dato-nombre').value.trim();
  //        imprimir('Nombre (.value):', '"' + nombre + '"');
  //   4. <select> simple -> .value es el value de la opción elegida:
  //        const select = document.getElementById('dato-curso');
  //        imprimir('Curso (.value):', select.value);                      // "js"
  //        imprimir('Texto visible de la opción:', select.options[select.selectedIndex].text);
  //   5. Checkbox -> NO se lee con .value, sino con .checked (true/false):
  //        const boletin = document.getElementById('dato-boletin');
  //        imprimir('Boletín (.checked):', boletin.checked);               // true
  //   6. Radios -> hay que buscar el que esté marcado. querySelector con
  //      :checked devuelve null si no hay ninguno, por eso el operador ternario:
  //        const radio = formDatos.querySelector('input[name="modalidad"]:checked');
  //        imprimir('Modalidad (radio marcado):', radio ? radio.value : 'ninguna');
  //   7. <select multiple> -> selectedOptions NO es un array de verdad:
  //        const tecnologias = document.getElementById('dato-tecnologias');
  //        const elegidas = Array.from(tecnologias.selectedOptions).map((op) => op.value);
  //        imprimir('Tecnologías (selectedOptions):', elegidas.join(', ') || 'ninguna');
  //   Resultado esperado con los valores de fábrica del HTML:
  //     Nombre "Lucía Fernández" · Curso js (JavaScript) · Boletín true ·
  //     Modalidad presencial · Tecnologías js
  //   (aprox. 22 lineas)

  // ⚠️ ERROR COMÚN: sumar valores de inputs numéricos sin convertirlos.
  //    "2" + "3" da "23", no 5. Usa Number(x) o parseFloat(x).
  // ⚠️ ERROR COMÚN: leer checkbox.value. Devuelve "on" esté marcado o no.

  // ==========================================================================
  // 4. FormData + Object.fromEntries
  // ==========================================================================

  /*
    Leer campo a campo funciona, pero en un formulario de 20 campos es
    insoportable. FormData recorre el formulario y recoge automáticamente todos
    los controles que tengan atributo name.

        const datos = new FormData(formulario);
        datos.get('nombre');           // un valor
        datos.getAll('tecnologias');   // todos los valores de ese name
        Object.fromEntries(datos);     // objeto normal { clave: valor, ... }

    DOS AVISOS IMPORTANTES:
      1) Solo entran los campos con atributo name. Sin name, no existen.
      2) Los checkbox NO marcados no aparecen; y con nombres repetidos,
         fromEntries se queda solo con el ÚLTIMO valor. Para esos casos hay
         que usar getAll().
  */

  // TODO (en clase):
  //   1. document.getElementById('btn-formdata').addEventListener('click', function () { ... })
  //      con titulo('4. FormData') y  const datos = new FormData(formDatos);
  //   2. Recorre pareja a pareja (FormData es iterable):
  //        for (const [clave, valor] of datos.entries()) {
  //          imprimir('  ' + clave + ' = ' + valor);
  //        }
  //   3. Todo de golpe convertido en objeto JavaScript normal:
  //        const objeto = Object.fromEntries(datos);
  //        imprimir('Como objeto listo para enviar al servidor:', objeto);
  //   4. Demuestra el aviso 2: si hay varias tecnologías elegidas, el objeto
  //      solo conserva la última. La forma correcta es getAll():
  //        imprimir('Todas las tecnologías con getAll():',
  //                 datos.getAll('tecnologias').join(', ') || 'ninguna');
  //   5. Y el caso del checkbox desmarcado:
  //        if (!datos.has('boletin')) {
  //          imprimir('El checkbox "boletin" no aparece porque está DESMARCADO.');
  //        }
  //   Demostración de clase: elige JavaScript Y CSS con Ctrl/Cmd, pulsa el
  //   botón y compara la línea del objeto (solo "css") con la de getAll()
  //   ("js, css"). Desmarca luego el boletín y vuelve a pulsar.
  //   (aprox. 16 lineas)

  // ==========================================================================
  // 5. VALIDACIÓN ESCRITA A MANO
  // ==========================================================================

  /*
    Validar es comprobar que los datos tienen sentido ANTES de usarlos.
    Estrategia habitual y muy legible:
      1) Una función por campo que devuelve un mensaje de error o cadena vacía.
      2) Una función que pinta o borra ese mensaje bajo el campo.
      3) En el submit, se validan todos y solo se continúa si no hay errores.

    ⚠️ IMPORTANTE DE SEGURIDAD: la validación en el navegador es para AYUDAR al
    usuario, nunca para proteger la aplicación. Cualquiera puede saltársela.
    El servidor SIEMPRE debe volver a validar.
  */

  // TODO (en clase) · 5.a PINTAR EL ERROR:
  //   1. const formRegistro = document.getElementById('form-registro');
  //      const avisoOk      = document.getElementById('registro-ok');
  //   2. function mostrarError(idCampo, mensaje) que:
  //        const campo = document.getElementById(idCampo);
  //        const hueco = document.getElementById('error-' + idCampo);
  //        hueco.textContent = mensaje;
  //        y, SOLO si campo.type !== 'checkbox' (los checkbox no llevan la
  //        clase de campo de texto):
  //          campo.classList.toggle('campo__control--error', mensaje !== '');
  //        (toggle con segundo parámetro: añade si es true, quita si es false)
  //   Nota de nombres: los huecos del HTML son #error-reg-nombre, #error-reg-email,
  //   #error-reg-edad, #error-reg-clave y #error-reg-terminos. De ahí el truco
  //   de concatenar 'error-' + idCampo.
  //   (aprox. 10 lineas)

  // TODO (en clase) · 5.b UNA FUNCIÓN POR CAMPO (devuelven '' si todo va bien):
  //   1. validarNombre(valor):
  //        '' vacío            -> 'El nombre es obligatorio.'
  //        menos de 3 letras   -> 'Debe tener al menos 3 caracteres.'
  //   2. validarEmail(valor):
  //        '' vacío            -> 'El correo es obligatorio.'
  //        no cumple el patrón -> 'Formato de correo no válido (ejemplo: ana@correo.com).'
  //        Patrón suficiente para clase (las regex "perfectas" de email son
  //        enormes y ni así aciertan):  /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
  //   3. validarEdad(valor):
  //        '' vacío                       -> 'La edad es obligatoria.'
  //        const edad = Number(valor);
  //        Number.isNaN(edad)             -> 'La edad debe ser un número.'
  //        !Number.isInteger(edad)        -> 'La edad debe ser un número entero.'
  //        edad < 16                      -> 'Debes tener al menos 16 años para matricularte.'
  //        edad > 120                     -> 'Revisa la edad: ese valor no parece real.'
  //   4. validarClave(valor):
  //        '' vacío            -> 'La contraseña es obligatoria.'
  //        menos de 8          -> 'Mínimo 8 caracteres (tienes ' + valor.length + ').'
  //        sin ningún dígito   -> 'Debe contener al menos un número.'
  //        (/\d/ significa "algún dígito"; .test() devuelve true o false)
  //   (aprox. 30 lineas entre las cuatro)

  // TODO (en clase) · 5.c VALIDAR TODO Y ENVIAR:
  //   1. function validarFormularioRegistro() que devuelve true si TODO es correcto:
  //        a) Lee los cinco valores: #reg-nombre, #reg-email y #reg-edad con
  //           .value.trim(); #reg-clave con .value (sin trim: los espacios
  //           cuentan en una contraseña); #reg-terminos con .checked.
  //        b) Construye un objeto `errores` cuyas CLAVES son los ids:
  //             { 'reg-nombre': validarNombre(nombre), 'reg-email': ...,
  //               'reg-edad': ..., 'reg-clave': ...,
  //               'reg-terminos': terminos ? '' : 'Debes aceptar las condiciones.' }
  //        c) Recórrelo con  for (const [idCampo, mensaje] of Object.entries(errores))
  //           llamando a mostrarError(idCampo, mensaje) y, cuando el mensaje no
  //           esté vacío, marcando hayErrores = true e imprimiendo
  //             '  ✗ ' + idCampo + ': ' + mensaje
  //        d) return !hayErrores;
  //   2. formRegistro.addEventListener('submit', ...) con evento.preventDefault(),
  //      titulo('5. Validación manual'), const esValido = validarFormularioRegistro();
  //        avisoOk.classList.toggle('oculto', !esValido);
  //        Si es válido:  imprimir('  ✓ Todos los campos son correctos.') y
  //                       imprimir('Aquí es donde se enviarían los datos al servidor (fetch).')
  //        Si no:         imprimir('Formulario NO enviado: corrige los errores marcados en rojo.')
  //                       y ✅ BUENA PRÁCTICA: llevar el foco al primer campo con error
  //                         const primerError = formRegistro.querySelector('.campo__control--error');
  //                         if (primerError) primerError.focus();
  //   3. Validación "en vivo" pero amable: solo LIMPIAR el error mientras el
  //      usuario corrige, sin volver a gritarle en cada tecla:
  //        ['reg-nombre', 'reg-email', 'reg-edad', 'reg-clave'].forEach(function (id) {
  //          document.getElementById(id).addEventListener('input', function () {
  //            mostrarError(id, '');
  //          });
  //        });
  //   Resultado esperado: enviar el formulario vacío pinta los cinco mensajes
  //   en rojo y deja el foco en #reg-nombre; al rellenarlo bien aparece el
  //   aviso verde "Formulario válido. Datos listos para enviar.".
  //   (aprox. 40 lineas)

  // ==========================================================================
  // 6. VALIDACIÓN NATIVA HTML5
  // ==========================================================================

  /*
    El navegador sabe validar solo si usamos los atributos adecuados:

      required           el campo no puede quedar vacío
      type="email"       comprueba que tenga forma de correo
      type="number"      solo admite números
      min / max          valor mínimo y máximo (números y fechas)
      minlength/maxlength  longitud del texto
      pattern="..."      expresión regular que debe cumplirse
      step               salto permitido (0.5, 1...)

    Métodos y propiedades que da JavaScript:
      campo.checkValidity()      -> true/false. NO muestra nada al usuario.
      campo.reportValidity()     -> igual, pero ADEMÁS enseña el globo de error.
      campo.validity             -> objeto con el detalle: valueMissing,
                                    typeMismatch, patternMismatch, rangeUnderflow,
                                    rangeOverflow, tooShort, customError...
      campo.validationMessage    -> el texto que mostraría el navegador.
      campo.setCustomValidity(t) -> pone un mensaje propio. Con '' se limpia
                                    y el campo vuelve a considerarse válido.

    Si un formulario tiene el atributo novalidate, el navegador no valida solo
    (es lo que hemos hecho arriba para validar a mano). Este formulario NO lo
    lleva, así que valida él.
  */

  // TODO (en clase) · 6.a MENSAJE DE ERROR PERSONALIZADO:
  //   1. const formNativo = document.getElementById('form-nativo');
  //      const natUsuario = document.getElementById('nat-usuario');
  //   2. natUsuario.addEventListener('input', function () { ... }) que:
  //        a) PRIMERO SIEMPRE:  natUsuario.setCustomValidity('');
  //        b) if (natUsuario.validity.patternMismatch) -> setCustomValidity(
  //             'El usuario debe tener de 3 a 12 letras minúsculas, sin espacios, números ni tildes.')
  //           else if (natUsuario.validity.valueMissing) -> setCustomValidity(
  //             'Necesitamos un nombre de usuario para crear tu cuenta.')
  //   Resultado esperado: escribir "Ana99" y pulsar Enviar muestra ese globo
  //   de error propio en vez del texto genérico del navegador.
  //   (aprox. 8 lineas)

  // ⚠️ ERROR COMÚN Y MUY TRAICIONERO: poner un mensaje con setCustomValidity
  //    y no limpiarlo nunca. Mientras el mensaje no sea cadena vacía, el campo
  //    se considera INVÁLIDO para siempre y el formulario no se envía jamás.
  //    Por eso lo primero es SIEMPRE limpiar.

  // TODO (en clase) · 6.b EL EVENTO 'invalid':
  //   Se dispara en CADA campo que no pasa la validación nativa al intentar
  //   enviar. NO burbujea, por eso hay que registrarlo en todos:
  //     Array.from(formNativo.elements).forEach(function (campo) {
  //       if (!campo.name && !campo.id) return;   // los botones no nos interesan
  //       campo.addEventListener('invalid', function () {
  //         imprimir('  ✗ invalid en #' + campo.id + ' -> ' + campo.validationMessage);
  //       });
  //     });
  //   Resultado esperado: enviar el formulario vacío escribe cuatro líneas
  //   "invalid en #nat-usuario / #nat-email / #nat-nota / #nat-fecha".
  //   (aprox. 8 lineas)

  // TODO (en clase) · 6.c checkValidity(): COMPROBAR SIN ENVIAR:
  //   1. document.getElementById('btn-checkvalidity').addEventListener('click', ...)
  //      con titulo('6. Validación nativa: checkValidity()').
  //   2. Recorre Array.from(formNativo.elements) saltando los BUTTON
  //      (if (campo.tagName === 'BUTTON') return;) y para cada campo:
  //        const valido = campo.checkValidity();
  //        imprimir('  #' + campo.id + ' -> ' +
  //                 (valido ? 'válido' : 'NO válido: ' + campo.validationMessage));
  //   3. Si NO es válido, el objeto validity dice EXACTAMENTE qué regla falló.
  //      Monta un array `motivos` y añade con push:
  //        v.valueMissing    -> 'valueMissing (falta el valor)'
  //        v.typeMismatch    -> 'typeMismatch (no encaja con el type)'
  //        v.patternMismatch -> 'patternMismatch (no cumple el pattern)'
  //        v.rangeUnderflow  -> 'rangeUnderflow (menor que min)'
  //        v.rangeOverflow   -> 'rangeOverflow (mayor que max)'
  //        v.stepMismatch    -> 'stepMismatch (no encaja con step)'
  //        v.customError     -> 'customError (mensaje propio)'
  //      y luego imprimir('      motivos: ' + motivos.join(', '));
  //   4. Al final, reportValidity() hace lo mismo que checkValidity() pero
  //      ADEMÁS muestra el globo del navegador en el primer campo problemático:
  //        const todoOk = formNativo.reportValidity();
  //        imprimir('Resultado global: ' + (todoOk ? 'formulario válido' : 'hay campos por corregir'));
  //   Demostración de clase: pon la nota en 12 y verás rangeOverflow; ponla en
  //   7,25 y verás stepMismatch (el step del HTML es 0.5).
  //   (aprox. 28 lineas)

  // TODO (en clase) · 6.d submit (solo se dispara si la validación nativa pasó):
  //   1. formNativo.addEventListener('submit', function (evento) { ... }) con
  //      evento.preventDefault(), titulo('6.b Envío del formulario nativo') e
  //      imprimir('El navegador ha validado TODO antes de llegar aquí.').
  //   2. const datos = Object.fromEntries(new FormData(formNativo));
  //      imprimir('Datos que se enviarían:', datos);
  //   3. Y la lección final, que conviene enseñar a propósito:
  //        if (Object.keys(datos).length === 0) {
  //          imprimir('¡Está vacío! Ningún campo de este formulario tiene atributo name.');
  //          imprimir('Lección: FormData necesita name, el id no le sirve.');
  //        }
  //   Resultado esperado: con el formulario bien relleno, "Datos que se
  //   enviarían: {}" seguido de las dos líneas de la lección. ⚠️ Si un campo no
  //   tiene atributo name, no aparece en FormData aunque tenga id.
  //   (aprox. 12 lineas)

  /* ==========================================================================
   * EJERCICIOS PROPUESTOS · archivo 04
   * --------------------------------------------------------------------------
   * 1) Añade al formulario de registro un segundo campo de contraseña
   *    ("Repite la contraseña") y valida que ambas coincidan. Pista: necesitas
   *    una función que reciba los dos valores.
   *
   * 2) Añade un contador de caracteres bajo el campo de nombre que se
   *    actualice en vivo con el evento input y muestre "12 / 40".
   *
   * 3) Pon atributo name a todos los campos de #form-nativo y comprueba que
   *    ahora sí aparecen en el objeto de FormData al enviarlo.
   *
   * 4) Deshabilita el botón "Registrarme" mientras el formulario no sea
   *    válido, y actívalo en cuanto lo sea. Pista: escucha input en el
   *    formulario entero (input SÍ burbujea) y llama a tu validación.
   *
   * 5) (Reto) Crea un validador de DNI español: 8 dígitos seguidos de una
   *    letra, comprobando que la letra sea la correcta. La letra se obtiene
   *    con "TRWAGMYFPDXBNJZSQVHLCKE"[numero % 23].
   * ========================================================================== */
})();
