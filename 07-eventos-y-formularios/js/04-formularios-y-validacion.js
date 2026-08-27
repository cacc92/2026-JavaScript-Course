/**
 * ============================================================================
 * ARCHIVO: js/04-formularios-y-validacion.js
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
 * ============================================================================
 */

// IIFE: mantiene privadas las variables de este archivo.
(function () {
  'use strict';

  // ==========================================================================
  // 0. HERRAMIENTAS DE LA SECCIÓN
  // ==========================================================================

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

  document.getElementById('limpiar-04').addEventListener('click', function () {
    document.getElementById(ID_SALIDA).textContent = '';
  });

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
  const demoInput = document.getElementById('demo-input');
  const demoChange = document.getElementById('demo-change');

  demoInput.addEventListener('input', function (evento) {
    // evento.target.value siempre trae el valor YA actualizado.
    imprimir('input  · valor actual: "' + evento.target.value + '" (' + evento.target.value.length + ' caracteres)');
  });

  demoChange.addEventListener('change', function (evento) {
    titulo('1. change');
    imprimir('change · valor confirmado: "' + evento.target.value + '"');
    imprimir('Fíjate: no ha saltado ni una vez mientras escribías.');
  });

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
  const campoFocus = document.getElementById('campo-focus');

  campoFocus.addEventListener('focus', function () {
    titulo('2. focus / blur');
    imprimir('focus · el campo ha recibido el foco.');
  });

  campoFocus.addEventListener('blur', function (evento) {
    imprimir('blur  · el campo ha perdido el foco. Valor final: "' + evento.target.value + '"');
  });

  // ==========================================================================
  // 3. LEER LOS DATOS: value, checked, selected
  // ==========================================================================

  const formDatos = document.getElementById('form-datos');

  formDatos.addEventListener('submit', function (evento) {
    /*
      preventDefault() es OBLIGATORIO aquí. Sin él, el navegador enviaría el
      formulario y RECARGARÍA la página: perderías todo el estado y verías el
      típico "parpadeo" que hace pensar que el código no funciona.
    */
    evento.preventDefault();

    titulo('3. Lectura manual de los datos');

    // --- Campo de texto: .value (SIEMPRE devuelve un string) --------------
    const nombre = document.getElementById('dato-nombre').value.trim();
    imprimir('Nombre (.value):', '"' + nombre + '"');

    // ⚠️ ERROR COMÚN: sumar valores de inputs numéricos sin convertirlos.
    //    "2" + "3" da "23", no 5. Usa Number(x) o parseFloat(x).

    // --- <select> simple: .value es el value de la opción elegida ---------
    const select = document.getElementById('dato-curso');
    imprimir('Curso (.value):', select.value);
    // selectedIndex es la POSICIÓN elegida; options[i].text, su texto visible.
    imprimir('Texto visible de la opción:', select.options[select.selectedIndex].text);

    // --- Checkbox: NO se lee con .value, sino con .checked (true/false) ---
    const boletin = document.getElementById('dato-boletin');
    imprimir('Boletín (.checked):', boletin.checked);

    // ⚠️ ERROR COMÚN: leer checkbox.value. Devuelve "on" esté marcado o no.

    // --- Radios: hay que buscar el que esté marcado -----------------------
    // querySelector con :checked devuelve el primero que cumpla; si no hay
    // ninguno marcado, devuelve null (por eso comprobamos antes de usarlo).
    const radio = formDatos.querySelector('input[name="modalidad"]:checked');
    imprimir('Modalidad (radio marcado):', radio ? radio.value : 'ninguna');

    // --- <select multiple>: selectedOptions es una lista de opciones ------
    const tecnologias = document.getElementById('dato-tecnologias');
    // selectedOptions no es un array de verdad, así que lo convertimos con
    // Array.from() para poder usar map().
    const elegidas = Array.from(tecnologias.selectedOptions).map((op) => op.value);
    imprimir('Tecnologías (selectedOptions):', elegidas.join(', ') || 'ninguna');
  });

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
  document.getElementById('btn-formdata').addEventListener('click', function () {
    titulo('4. FormData');

    const datos = new FormData(formDatos);

    // Recorrer pareja a pareja: FormData es iterable.
    for (const [clave, valor] of datos.entries()) {
      imprimir('  ' + clave + ' = ' + valor);
    }

    // Y ahora todo de golpe convertido en un objeto JavaScript normal:
    const objeto = Object.fromEntries(datos);
    imprimir('Como objeto listo para enviar al servidor:', objeto);

    // Aquí se ve el aviso 2: si hay varias tecnologías elegidas, el objeto
    // solo conserva la última. La forma correcta es getAll():
    imprimir('Todas las tecnologías con getAll():', datos.getAll('tecnologias').join(', ') || 'ninguna');

    if (!datos.has('boletin')) {
      imprimir('El checkbox "boletin" no aparece porque está DESMARCADO.');
    }
  });

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
  const formRegistro = document.getElementById('form-registro');
  const avisoOk = document.getElementById('registro-ok');

  /** Pinta un mensaje de error bajo un campo y lo marca en rojo. */
  function mostrarError(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    const hueco = document.getElementById('error-' + idCampo);

    hueco.textContent = mensaje;

    // Los checkbox no llevan la clase de campo de texto, por eso comprobamos.
    if (campo.type !== 'checkbox') {
      // classList.toggle con segundo parámetro: añade si es true, quita si es false.
      campo.classList.toggle('campo__control--error', mensaje !== '');
    }
  }

  /** Devuelve el mensaje de error de un campo, o '' si el valor es correcto. */
  function validarNombre(valor) {
    if (valor === '') return 'El nombre es obligatorio.';
    if (valor.length < 3) return 'Debe tener al menos 3 caracteres.';
    return '';
  }

  function validarEmail(valor) {
    if (valor === '') return 'El correo es obligatorio.';
    // Comprobación sencilla y suficiente para clase: algo, arroba, algo,
    // punto y al menos dos letras. Las expresiones regulares "perfectas" para
    // email son enormes y ni así aciertan siempre.
    const patron = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!patron.test(valor)) return 'Formato de correo no válido (ejemplo: ana@correo.com).';
    return '';
  }

  function validarEdad(valor) {
    if (valor === '') return 'La edad es obligatoria.';

    const edad = Number(valor); // convertimos el string a número

    // Number.isNaN comprueba si la conversión ha fallado ("hola" -> NaN).
    if (Number.isNaN(edad)) return 'La edad debe ser un número.';
    if (!Number.isInteger(edad)) return 'La edad debe ser un número entero.';
    if (edad < 16) return 'Debes tener al menos 16 años para matricularte.';
    if (edad > 120) return 'Revisa la edad: ese valor no parece real.';
    return '';
  }

  function validarClave(valor) {
    if (valor === '') return 'La contraseña es obligatoria.';
    if (valor.length < 8) return 'Mínimo 8 caracteres (tienes ' + valor.length + ').';
    // /\d/ significa "algún dígito"; .test() devuelve true o false.
    if (!/\d/.test(valor)) return 'Debe contener al menos un número.';
    return '';
  }

  /** Valida todo el formulario. Devuelve true si está TODO correcto. */
  function validarFormularioRegistro() {
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const edad = document.getElementById('reg-edad').value.trim();
    const clave = document.getElementById('reg-clave').value;
    const terminos = document.getElementById('reg-terminos').checked;

    const errores = {
      'reg-nombre': validarNombre(nombre),
      'reg-email': validarEmail(email),
      'reg-edad': validarEdad(edad),
      'reg-clave': validarClave(clave),
      'reg-terminos': terminos ? '' : 'Debes aceptar las condiciones.'
    };

    let hayErrores = false;

    // Object.entries convierte el objeto en pares [clave, valor] recorribles.
    for (const [idCampo, mensaje] of Object.entries(errores)) {
      mostrarError(idCampo, mensaje);
      if (mensaje !== '') {
        hayErrores = true;
        imprimir('  ✗ ' + idCampo + ': ' + mensaje);
      }
    }

    return !hayErrores; // true = formulario válido
  }

  formRegistro.addEventListener('submit', function (evento) {
    evento.preventDefault();
    titulo('5. Validación manual');

    const esValido = validarFormularioRegistro();

    // classList.toggle con segundo argumento: oculta el aviso si NO es válido.
    avisoOk.classList.toggle('oculto', !esValido);

    if (esValido) {
      imprimir('  ✓ Todos los campos son correctos.');
      imprimir('Aquí es donde se enviarían los datos al servidor (fetch).');
    } else {
      imprimir('Formulario NO enviado: corrige los errores marcados en rojo.');

      // ✅ BUENA PRÁCTICA: llevar el foco al primer campo con error.
      const primerError = formRegistro.querySelector('.campo__control--error');
      if (primerError) primerError.focus();
    }
  });

  // Validación "en vivo" pero amable: solo limpiamos el error mientras el
  // usuario corrige, sin volver a gritarle en cada tecla.
  ['reg-nombre', 'reg-email', 'reg-edad', 'reg-clave'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () {
      mostrarError(id, '');
    });
  });

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
  const formNativo = document.getElementById('form-nativo');
  const natUsuario = document.getElementById('nat-usuario');

  // --- Mensaje de error personalizado -------------------------------------
  natUsuario.addEventListener('input', function () {
    /*
      ⚠️ ERROR COMÚN Y MUY TRAICIONERO: poner un mensaje con setCustomValidity
      y no limpiarlo nunca. Mientras el mensaje no sea cadena vacía, el campo
      se considera INVÁLIDO para siempre y el formulario no se envía jamás.
      Por eso lo primero es SIEMPRE limpiar.
    */
    natUsuario.setCustomValidity('');

    if (natUsuario.validity.patternMismatch) {
      natUsuario.setCustomValidity('El usuario debe tener de 3 a 12 letras minúsculas, sin espacios, números ni tildes.');
    } else if (natUsuario.validity.valueMissing) {
      natUsuario.setCustomValidity('Necesitamos un nombre de usuario para crear tu cuenta.');
    }
  });

  // El evento 'invalid' se dispara en CADA campo que no pasa la validación
  // nativa al intentar enviar. No burbujea, por eso lo registramos en todos.
  Array.from(formNativo.elements).forEach(function (campo) {
    if (!campo.name && !campo.id) return; // los botones no nos interesan

    campo.addEventListener('invalid', function () {
      imprimir('  ✗ invalid en #' + campo.id + ' -> ' + campo.validationMessage);
    });
  });

  // --- checkValidity(): comprobar sin enviar -------------------------------
  document.getElementById('btn-checkvalidity').addEventListener('click', function () {
    titulo('6. Validación nativa: checkValidity()');

    Array.from(formNativo.elements).forEach(function (campo) {
      if (campo.tagName === 'BUTTON') return;

      const valido = campo.checkValidity();
      imprimir('  #' + campo.id + ' -> ' + (valido ? 'válido' : 'NO válido: ' + campo.validationMessage));

      // El objeto validity nos dice EXACTAMENTE qué regla se ha incumplido.
      if (!valido) {
        const v = campo.validity;
        const motivos = [];
        if (v.valueMissing) motivos.push('valueMissing (falta el valor)');
        if (v.typeMismatch) motivos.push('typeMismatch (no encaja con el type)');
        if (v.patternMismatch) motivos.push('patternMismatch (no cumple el pattern)');
        if (v.rangeUnderflow) motivos.push('rangeUnderflow (menor que min)');
        if (v.rangeOverflow) motivos.push('rangeOverflow (mayor que max)');
        if (v.stepMismatch) motivos.push('stepMismatch (no encaja con step)');
        if (v.customError) motivos.push('customError (mensaje propio)');
        imprimir('      motivos: ' + motivos.join(', '));
      }
    });

    // reportValidity() hace lo mismo que checkValidity() pero además muestra
    // el globo de error del navegador en el primer campo problemático.
    const todoOk = formNativo.reportValidity();
    imprimir('Resultado global: ' + (todoOk ? 'formulario válido' : 'hay campos por corregir'));
  });

  // --- submit: solo se dispara si la validación nativa ha pasado -----------
  formNativo.addEventListener('submit', function (evento) {
    evento.preventDefault();
    titulo('6.b Envío del formulario nativo');
    imprimir('El navegador ha validado TODO antes de llegar aquí.');

    const datos = Object.fromEntries(new FormData(formNativo));
    imprimir('Datos que se enviarían:', datos);

    // ⚠️ Si un campo no tiene atributo name, no aparecerá en FormData aunque
    //    tenga id. En este formulario didáctico solo usamos id, por eso el
    //    objeto sale vacío: es un fallo MUY habitual y conviene enseñarlo.
    if (Object.keys(datos).length === 0) {
      imprimir('¡Está vacío! Ningún campo de este formulario tiene atributo name.');
      imprimir('Lección: FormData necesita name, el id no le sirve.');
    }
  });

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
