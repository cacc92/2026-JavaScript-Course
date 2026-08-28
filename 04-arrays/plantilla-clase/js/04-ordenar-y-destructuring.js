/**
 * ============================================================================
 * ARCHIVO: js/04-ordenar-y-destructuring.js
 * PROYECTO: 04 · Arrays y métodos funcionales
 * ----------------------------------------------------------------------------
 * QUÉ ENSEÑA ESTE ARCHIVO
 *   1. sort() a fondo: por qué ordena mal los números y cómo se escribe
 *      un comparador correcto (ascendente y descendente).
 *   2. Ordenar arrays de OBJETOS por una propiedad.
 *   3. Ordenar textos con acentos y mayúsculas usando localeCompare.
 *   4. Destructuring de arrays: valores por defecto, saltos, rest e
 *      intercambio de variables sin variable auxiliar.
 *   5. Spread (...) para copiar y combinar arrays.
 *      Copia SUPERFICIAL vs copia PROFUNDA: la trampa de los objetos anidados.
 *   6. Array.from() y Array.of().
 *   7. Set para eliminar duplicados.
 *
 * (Todo va dentro de una IIFE para que estas variables no choquen con las de
 *  los otros archivos .js que carga la misma página.)
 * ============================================================================
 */

/* ============================================================================
 * CÓMO USAR ESTA PLANTILLA (nota del docente)
 * ----------------------------------------------------------------------------
 * Versión "para escribir en vivo". Vienen ya escritos el andamiaje de salida
 * (formatear, imprimir, titulo) y los DATOS DE TRABAJO (participantes).
 * Los arrays pequeños de cada ejemplo se dictan dentro de cada TODO.
 * Solución de referencia: ../js/04-ordenar-y-destructuring.js
 * ============================================================================ */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (consola visual de esta sección)
  // ============================================================
  // NOTA DE LA PLANTILLA: esta sección 0 viene YA ESCRITA (andamiaje).
  var ID_SALIDA = 'salida-4';

  function formatear(valor) {
    if (typeof valor === 'string') return valor;
    if (valor === undefined) return 'undefined';
    if (valor === null) return 'null';
    if (typeof valor === 'object') {
      var compacto = JSON.stringify(valor);
      if (compacto === undefined) return String(valor);
      return compacto.length <= 90 ? compacto : JSON.stringify(valor, null, 2);
    }
    return String(valor);
  }

  function imprimir(...mensajes) {
    console.log(...mensajes);
    var salida = document.getElementById(ID_SALIDA);
    if (!salida) return;
    salida.textContent += mensajes.map(formatear).join(' ') + '\n';
  }

  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ============================================================
  // DATOS DE TRABAJO DE ESTA SECCIÓN
  // ============================================================
  // NOTA DE LA PLANTILLA: estos datos vienen YA ESCRITOS a propósito.

  const participantes = [
    { nombre: 'Ana Ruiz', edad: 19, puntos: 88 },
    { nombre: 'Luis Paz', edad: 22, puntos: 95 },
    { nombre: 'Sara Gil', edad: 20, puntos: 74 },
    { nombre: 'Iván Mora', edad: 19, puntos: 95 },
    { nombre: 'Nadia Soto', edad: 21, puntos: 61 },
  ];

  // ============================================================
  // 1. sort(): EL MÉTODO QUE MÁS SORPRESAS DA
  // ============================================================
  // Dos cosas que hay que saber SIEMPRE de sort:
  //   (1) MUTA el array original (lo reordena en el sitio) y además lo devuelve.
  //   (2) Sin comparador, convierte cada elemento a TEXTO y ordena
  //       alfabéticamente (por código de carácter). Con números, eso está mal.
  //
  // ¿POR QUÉ SALE ASÍ? Porque compara los TEXTOS "10", "100", "25", "3", "9"
  // carácter a carácter, igual que un diccionario:
  //   "10" < "100" (es más corto y coincide el principio)
  //   "100" < "25" porque el primer carácter "1" va antes que "2"
  //   "25" < "3"   porque "2" va antes que "3"
  //   "3"  < "9"
  // Analogía: en la guía telefónica, "Perez" va antes que "Álvarez" si
  // ordenamos letra a letra sin conocer el idioma. Aquí ocurre lo mismo con
  // los números: se ordenan como palabras, no como cantidades.

  // TODO (en clase):
  //   1. Abre con titulo('1. sort() SIN COMPARADOR: EL PROBLEMA CON LOS NÚMEROS').
  //   2. Declara const numeros = [10, 9, 100, 25, 3]  <- se usa en toda la sección 1.
  //   3. const ordenAlfabetico = [...numeros].sort()
  //      [...numeros] hace una COPIA del array (el operador spread, que
  //      estudiamos en la sección 5 de este mismo archivo). Copiamos antes de
  //      ordenar porque sort() MUTA, y queremos conservar el original.
  //   4. Imprime "numeros" con la etiqueta 'Original ->' y después
  //      "ordenAlfabetico" con 'sort() sin comparador ->'.
  //   Resultado esperado en pantalla:
  //     Original -> [10,9,100,25,3]
  //     sort() sin comparador -> [10,100,25,3,9]
  //   (aprox. 4 líneas)

  // ------------------------------------------------------------
  // 1.b) EL COMPARADOR: la función de dos argumentos
  // ------------------------------------------------------------
  // sort acepta una función que recibe DOS elementos (a y b) y debe devolver:
  //    un número NEGATIVO -> a va ANTES que b
  //    CERO               -> da igual, mantienen su orden relativo
  //    un número POSITIVO -> a va DESPUÉS que b
  // Con números, la resta ya cumple esas tres condiciones por sí sola:
  //    a - b  ->  ASCENDENTE  (de menor a mayor)
  //    b - a  ->  DESCENDENTE (de mayor a menor)
  //
  // Cómo razonar la resta con un ejemplo concreto: comparamos 10 y 9.
  //   a - b = 10 - 9 = 1  -> positivo -> el 10 se coloca DESPUÉS del 9. Correcto.
  //   b - a = 9 - 10 = -1 -> negativo -> ahora el 10 va ANTES. Descendente.
  //
  // ⚠️ ERROR COMÚN 1: creer que sort() devuelve una copia. MUTA el original.
  //
  // ⚠️ ERROR COMÚN 2: escribir el comparador con booleanos, así:
  //       .sort((a, b) => a > b)
  // Un booleano se convierte a 1 o 0, y nunca devuelve un número negativo,
  // así que sort no recibe la información que necesita y el orden sale mal
  // (a veces parece funcionar con pocos elementos, y por eso engaña tanto).
  //
  // ✅ BUENA PRÁCTICA: copiar antes de ordenar cuando el original importa.
  //    [...arr].sort(...)   o   arr.slice().sort(...)   o   arr.toSorted(...)

  // TODO (en clase):
  //   1. Abre con titulo('1.c) COMPARADOR NUMÉRICO').
  //   2. const ascendente = [...numeros].sort((a, b) => a - b) e imprímelo.
  //      const descendente = [...numeros].sort((a, b) => b - a) e imprímelo.
  //   3. Demuestra que MUTA: const mutado = [5, 1, 4];
  //      const resultado = mutado.sort((a, b) => a - b);
  //      imprime resultado === mutado y después "mutado".
  //   4. Escribe un if (typeof Array.prototype.toSorted === 'function'):
  //      dentro, const base = [5, 1, 4]; imprime base.toSorted((a, b) => a - b)
  //      y luego "base" para ver que sigue intacto.
  //      En el else imprime 'Este navegador no tiene toSorted(); usa [...arr].sort()'.
  //   Resultado esperado en pantalla:
  //     sort((a, b) => a - b) -> [3,9,10,25,100]
  //     sort((a, b) => b - a) -> [100,25,10,9,3]
  //     ¿resultado y mutado son el MISMO array? -> true
  //     mutado quedó -> [1,4,5]
  //     base.toSorted((a,b) => a-b) -> [1,4,5]   /   ...y base sigue intacto -> [5,1,4]
  //   (aprox. 12 líneas)

  // ============================================================
  // 2. ORDENAR ARRAYS DE OBJETOS
  // ============================================================
  // La lógica es la misma, solo que en el comparador accedemos a la propiedad
  // por la que queremos ordenar.

  // TODO (en clase):
  //   1. Abre con titulo('2. ORDENAR OBJETOS POR UNA PROPIEDAD').
  //   2. Escribe la función auxiliar resumir(lista) que devuelva
  //      lista.map((p) => p.nombre + '(' + p.puntos + ')').join('  ').
  //      Se reutiliza en toda la sección.
  //   3. Imprime resumir(participantes) con la etiqueta 'Original ->'.
  //   4. const porPuntosDesc = [...participantes].sort((a, b) => b.puntos - a.puntos)
  //      e imprime resumir(porPuntosDesc).
  //   5. const porPuntosAsc con (a, b) => a.puntos - b.puntos, igual.
  //   6. const porEdad = [...participantes].sort((a, b) => a.edad - b.edad) e
  //      imprime porEdad.map((p) => p.nombre + '(' + p.edad + ')').join('  ').
  //   Resultado esperado en pantalla:
  //     Por puntos DESC -> Luis Paz(95)  Iván Mora(95)  Ana Ruiz(88)  Sara Gil(74)  Nadia Soto(61)
  //     Por puntos ASC  -> Nadia Soto(61)  Sara Gil(74)  Ana Ruiz(88)  Luis Paz(95)  Iván Mora(95)
  //     Por edad ASC -> Ana Ruiz(19)  Iván Mora(19)  Sara Gil(20)  Nadia Soto(21)  Luis Paz(22)
  //   (aprox. 12 líneas)

  // ------------------------------------------------------------
  // 2.b) Ordenar por DOS criterios (desempate)
  // ------------------------------------------------------------
  // "Primero por puntos de mayor a menor; si empatan, por nombre alfabético".
  // El truco: si el primer criterio da 0 (empate), pasamos al segundo.
  //
  // Nota: desde 2019 sort() es ESTABLE: los elementos que empatan conservan el
  // orden en el que estaban. Antes no era así y podía variar entre navegadores.

  // TODO (en clase):
  //   1. const conDesempate = [...participantes].sort((a, b) => { ... }):
  //      calcula const porPuntos = b.puntos - a.puntos;
  //      si porPuntos !== 0 devuélvelo (no hay empate: decide este criterio);
  //      si no, devuelve a.nombre.localeCompare(b.nombre, 'es').
  //   2. Imprime resumir(conDesempate) con la etiqueta 'Puntos DESC + nombre A-Z ->'.
  //   Resultado esperado en pantalla:
  //     Puntos DESC + nombre A-Z -> Iván Mora(95)  Luis Paz(95)  Ana Ruiz(88)  Sara Gil(74)  Nadia Soto(61)
  //   Luis Paz e Iván Mora empatan a 95: gana la I de "Iván" frente a la L de "Luis".
  //   (aprox. 6 líneas)

  // ============================================================
  // 3. ORDENAR TEXTOS: localeCompare
  // ============================================================
  // El sort() por defecto compara por código Unicode, no por reglas del idioma.
  // Consecuencias en español: las mayúsculas van antes que las minúsculas y
  // las vocales acentuadas quedan al final, detrás de la Z.
  // Se ordena por el número interno (Unicode) de cada letra:
  //   B = 66, Z = 90, a = 97, Ó = 211, á = 225
  // Por eso TODAS las mayúsculas van antes que cualquier minúscula y las
  // vocales acentuadas terminan al final, detrás de la Z. No es lo que
  // esperaría ninguna persona hispanohablante.
  //
  // localeCompare(otroTexto, idioma, opciones) devuelve un número NEGATIVO, CERO
  // o POSITIVO (en la práctica -1, 0 o 1) aplicando las reglas de ordenación del
  // idioma. Es EXACTAMENTE el contrato que sort necesita de un comparador.
  //
  // La opción sensitivity: 'base' ignora acentos y mayúsculas al comparar,
  // muy útil también para BUSCAR (que "Angel" encuentre a "Ángel").

  // TODO (en clase):
  //   1. Abre con titulo('3. ORDENAR TEXTOS CON ACENTOS Y MAYÚSCULAS').
  //   2. Declara const nombres = ['Óscar', 'ana', 'Zoe', 'ángel', 'Bruno'].
  //      Imprímelo y después imprime [...nombres].sort() (el orden Unicode).
  //   3. const conLocale = [...nombres].sort((a, b) => a.localeCompare(b, 'es'))
  //      e imprímelo: ese sí es el orden natural en español.
  //   4. const comparacion = 'ángel'.localeCompare('Angel', 'es', { sensitivity: 'base' })
  //      e imprímelo (0 significa "iguales").
  //   5. Descendente alfabético: imprime
  //      [...nombres].sort((a, b) => b.localeCompare(a, 'es')).
  //   6. Números guardados como texto: const versiones = ['tema10', 'tema2', 'tema1'].
  //      Imprime el sort con localeCompare normal y después con
  //      { numeric: true } para comparar los dos resultados.
  //   Resultado esperado en pantalla:
  //     sort() por defecto -> ["Bruno","Zoe","ana","Óscar","ángel"]
  //     sort con localeCompare("es") -> ["ana","ángel","Bruno","Óscar","Zoe"]
  //     "ángel" vs "Angel" con sensitivity base -> 0
  //     Sin numeric -> ["tema1","tema10","tema2"]
  //     Con numeric: true -> ["tema1","tema2","tema10"]
  //   (aprox. 12 líneas)

  // ============================================================
  // 4. DESTRUCTURING DE ARRAYS
  // ============================================================
  // "Desestructurar" es sacar valores de un array y meterlos en variables
  // sueltas de una sola vez, según su POSICIÓN.
  // Analogía: abrir una caja de herramientas y colocar cada pieza en su hueco.

  // TODO (en clase):
  //   1. Abre con titulo('4. DESTRUCTURING DE ARRAYS').
  //   2. Declara const podio = ['Ana Ruiz', 'Luis Paz', 'Sara Gil', 'Iván Mora'].
  //      Se reutiliza en los apartados 4.b y 4.d.
  //   3. Enseña primero la FORMA ANTIGUA: const oroViejo = podio[0];
  //      const plataViejo = podio[1]; e imprime oroViejo + ' / ' + plataViejo.
  //   4. Y ahora la moderna en una línea: const [oro, plata, bronce] = podio;
  //      imprime oro + ' / ' + plata + ' / ' + bronce.
  //   Resultado esperado en pantalla:
  //     Forma antigua -> Ana Ruiz / Luis Paz
  //     const [oro, plata, bronce] = podio -> Ana Ruiz / Luis Paz / Sara Gil
  //   (aprox. 7 líneas)

  // ------------------------------------------------------------
  // 4.b) SALTOS: la coma vacía ignora una posición
  // ------------------------------------------------------------
  // Si solo te interesan el primero y el tercero, dejas un hueco con una coma.

  // TODO (en clase):
  //   1. Escribe const [primero, , tercero] = podio; e imprime
  //      primero + ' y ' + tercero.
  //   Resultado esperado en pantalla:
  //     const [primero, , tercero] -> Ana Ruiz y Sara Gil
  //   (aprox. 2 líneas)

  // ------------------------------------------------------------
  // 4.c) VALORES POR DEFECTO
  // ------------------------------------------------------------
  // Si la posición no existe, la variable valdría undefined. Con = valor
  // le damos un respaldo.
  //
  // ⚠️ ERROR COMÚN: creer que el valor por defecto también cubre el null.
  // Solo se aplica cuando el valor es EXACTAMENTE undefined.

  // TODO (en clase):
  //   1. const [a1 = 0, a2 = 0, a3 = 0] = [5, 8];  <- solo hay dos elementos.
  //      Imprime a1, a2, a3 en la misma llamada.
  //   2. const [b1 = 'sin dato', b2 = 'sin dato'] = [null, undefined];
  //      Imprime b1, '/', b2.
  //   Resultado esperado en pantalla:
  //     const [a1=0, a2=0, a3=0] = [5, 8] -> 5 8 0
  //     [null, undefined] con defaults -> null / sin dato
  //   (aprox. 4 líneas)

  // ------------------------------------------------------------
  // 4.d) REST (...): "y todo lo demás"
  // ------------------------------------------------------------
  // Recoge en un ARRAY los elementos restantes. Debe ir siempre el ÚLTIMO.

  // TODO (en clase):
  //   1. const [ganador, ...resto] = podio; imprime "ganador" y después "resto".
  //   Resultado esperado en pantalla:
  //     Ganador -> Ana Ruiz
  //     Resto -> ["Luis Paz","Sara Gil","Iván Mora"]
  //   (aprox. 3 líneas)

  // ------------------------------------------------------------
  // 4.e) INTERCAMBIO DE VARIABLES (el truco estrella)
  // ------------------------------------------------------------
  // Antes hacía falta una variable auxiliar:
  //     let aux = x;  x = y;  y = aux;
  // Con destructuring es una sola línea, y se lee tal cual: "x pasa a ser y".
  //
  // ⚠️ Si la línea anterior termina sin punto y coma, un corchete al inicio de
  // línea puede unirse con la línea de arriba y provocar un error raro.
  // ✅ BUENA PRÁCTICA: termina siempre las instrucciones con punto y coma.

  // TODO (en clase):
  //   1. Declara let turnoManana = 'Grupo A' y let turnoTarde = 'Grupo B'
  //      (con let, porque van a cambiar de valor). Imprímelos con 'Antes ->'.
  //   2. Escribe el intercambio en una línea:
  //      [turnoManana, turnoTarde] = [turnoTarde, turnoManana];
  //      e imprímelos otra vez con 'Después ->'.
  //   Resultado esperado en pantalla:
  //     Antes -> Grupo A | Grupo B
  //     Después -> Grupo B | Grupo A
  //   (aprox. 5 líneas)

  // ------------------------------------------------------------
  // 4.f) Destructuring ANIDADO y en PARÁMETROS de función
  // ------------------------------------------------------------
  // Muy habitual con Object.entries(), que devuelve pares [clave, valor].

  // TODO (en clase):
  //   1. const coordenadas = [[10, 20], [30, 40]];
  //      const [[x1, y1], [x2, y2]] = coordenadas;
  //      Imprime 'x1=' + x1, 'y1=' + y1, 'x2=' + x2, 'y2=' + y2.
  //   2. const puntosPorGrupo = { 'Grupo A': 88, 'Grupo B': 95, 'Grupo C': 74 };
  //      Recórrelo con Object.entries(puntosPorGrupo).forEach(([grupo, puntos]) => ...)
  //      imprimiendo '  ' + grupo + ' -> ' + puntos + ' puntos'.
  //   Resultado esperado en pantalla:
  //     Destructuring anidado -> x1=10 y1=20 x2=30 y2=40
  //     Grupo A -> 88 puntos / Grupo B -> 95 puntos / Grupo C -> 74 puntos
  //   (aprox. 8 líneas)

  // ============================================================
  // 5. SPREAD (...): COPIAR Y COMBINAR
  // ============================================================
  // El operador spread "desparrama" los elementos de un array allí donde se
  // escriba. Ojo: los mismos tres puntos significan REST cuando están a la
  // izquierda (recogiendo) y SPREAD cuando están a la derecha (repartiendo).
  //
  // ⚠️ Math.max espera números separados, no un array: Math.max([1,2,3]) da NaN.

  // TODO (en clase):
  //   1. Abre con titulo('5. SPREAD: COPIAR Y COMBINAR ARRAYS').
  //   2. Declara const grupoManana = ['Ana Ruiz', 'Luis Paz'] y
  //      const grupoTarde = ['Sara Gil', 'Iván Mora'].
  //   3. (a) Copiar: const copia = [...grupoManana]; haz copia.push('Nuevo alumno');
  //      imprime "copia" y después "grupoManana" (sigue con 2: es independiente).
  //   4. (b) Combinar: const todos = [...grupoManana, ...grupoTarde] e imprímelo.
  //   5. (c) Insertar en medio: const conDocente = [...grupoManana, 'Docente', ...grupoTarde].
  //   6. (d) const puntuaciones = [88, 95, 74, 95, 61]; imprime
  //      Math.max(...puntuaciones), Math.min(...puntuaciones) y, para enseñar el
  //      error clásico, Math.max(puntuaciones).
  //   7. (e) Imprime [...'Hola'] para convertir un texto en array de caracteres.
  //   Resultado esperado en pantalla:
  //     copia -> ["Ana Ruiz","Luis Paz","Nuevo alumno"]   /   original -> ["Ana Ruiz","Luis Paz"]
  //     Combinar -> los 4 nombres
  //     Con elemento en medio -> ["Ana Ruiz","Luis Paz","Docente","Sara Gil","Iván Mora"]
  //     Math.max(...puntuaciones) -> 95   Math.min(...) -> 61   Math.max(puntuaciones) -> NaN
  //     [..."Hola"] -> ["H","o","l","a"]
  //   (aprox. 13 líneas)

  // ------------------------------------------------------------
  // 5.b) COPIA SUPERFICIAL vs COPIA PROFUNDA (¡importantísimo!)
  // ------------------------------------------------------------
  // Spread y slice hacen una copia SUPERFICIAL ("shallow"): copian el array,
  // pero si dentro hay objetos, copian la REFERENCIA a esos objetos, no los
  // objetos en sí. Analogía: fotocopias la lista de invitados, pero las dos
  // listas siguen apuntando a las mismas personas de carne y hueso.
  //
  // ✅ SOLUCIÓN 1 (moderna y recomendada): structuredClone hace copia PROFUNDA.
  // ✅ SOLUCIÓN 2 (clásica): JSON.parse(JSON.stringify(...)).
  //    Funciona con datos simples, pero PIERDE fechas (las convierte a texto),
  //    funciones, undefined y no admite referencias circulares.
  // ✅ SOLUCIÓN 3 (para un nivel de anidamiento): copiar también cada objeto
  //    con map + spread.

  // TODO (en clase):
  //   1. Abre con titulo('5.c) COPIA SUPERFICIAL vs PROFUNDA').
  //   2. Declara const inscritos = [{ nombre: 'Ana Ruiz', nota: 7 },
  //      { nombre: 'Luis Paz', nota: 5 }].
  //   3. const copiaSuperficial = [...inscritos];
  //      haz copiaSuperficial.push({ nombre: 'Sara Gil', nota: 9 }) e imprime
  //      copiaSuperficial.length y inscritos.length: añadir SÍ es independiente.
  //   4. Ahora la trampa: copiaSuperficial[0].nota = 10; imprime inscritos[0]
  //      con la etiqueta '⚠️ Original tras tocar la copia ->'. ¡También cambió!
  //   5. if (typeof structuredClone === 'function'): const copiaProfunda =
  //      structuredClone(inscritos); pon copiaProfunda[0].nota = 1; imprime la
  //      copia y luego inscritos[0] (sigue en 10). En el else imprime
  //      'Este navegador no tiene structuredClone'.
  //   6. const copiaJson = JSON.parse(JSON.stringify(inscritos));
  //      copiaJson[1].nota = 0; imprime copiaJson[1] y inscritos[1].
  //   7. const copiaPorMap = inscritos.map((estudiante) => ({ ...estudiante }));
  //      copiaPorMap[0].nota = 3; imprime copiaPorMap[0] e inscritos[0].
  //   Resultado esperado en pantalla:
  //     Longitud copia -> 3 | original -> 2
  //     ⚠️ Original tras tocar la copia -> {"nombre":"Ana Ruiz","nota":10}
  //     Copia profunda modificada -> nota: 1   /   Original intacto -> nota: 10
  //     Copia por JSON -> nota: 0   |   original -> nota: 5
  //     Copia con map + spread -> nota: 3   |   original -> nota: 10
  //   (aprox. 18 líneas)

  // ============================================================
  // 6. Array.from() Y Array.of()
  // ============================================================
  // Array.from convierte en array cualquier cosa "parecida a un array"
  // (que tenga length o sea iterable) y admite una función transformadora.
  // El truco del objeto {length: n} sirve para generar secuencias.
  // El primer parámetro de la función es el elemento (aquí undefined, por eso
  // se escribe _ por convención: "no lo uso") y el segundo es el índice.
  //
  // Uso REAL en el navegador: querySelectorAll devuelve una NodeList, que
  // NO es un array (no tiene map, filter ni reduce). Array.from la convierte.
  //
  // Array.of() crea un array con los valores que le pases. Existe justamente
  // para resolver la ambigüedad de new Array(3) que vimos en la sección 1.

  // TODO (en clase):
  //   1. Abre con titulo('6. Array.from() Y Array.of()').
  //   2. Imprime Array.from('Hola').
  //   3. const del1al5 = Array.from({ length: 5 }, (_, indice) => indice + 1)
  //      e imprímelo.
  //   4. const tablaDel7 = Array.from({ length: 10 }, (_, i) => 7 * (i + 1))
  //      e imprímelo.
  //   5. Array.from como map en la misma pasada: imprime
  //      Array.from(participantes, (p) => p.nombre).
  //   6. Caso real del navegador:
  //      const secciones = Array.from(document.querySelectorAll('.tarjeta'));
  //      imprime secciones.map((seccion) => seccion.id).
  //   7. Imprime Array.of(3), después new Array(3) junto con '| length:' y
  //      new Array(3).length, y por último Array.of(1, 2, 3).
  //   Resultado esperado en pantalla:
  //     Array.from("Hola") -> ["H","o","l","a"]
  //     Array.from({length: 5}, (_, i) => i + 1) -> [1,2,3,4,5]
  //     Tabla del 7 -> [7,14,21,28,35,42,49,56,63,70]
  //     Secciones de esta página -> ["seccion-1","seccion-2","seccion-3","seccion-4","seccion-5"]
  //     Array.of(3) -> [3]   frente a   Array(3) -> [null,null,null] | length: 3
  //   (aprox. 12 líneas)

  // ============================================================
  // 7. Set: ELIMINAR DUPLICADOS
  // ============================================================
  // Un Set es una colección que NO admite valores repetidos. Si intentas
  // meter dos veces lo mismo, la segunda se ignora en silencio.
  // Analogía: una lista de asistencia donde cada persona firma una sola vez.
  //
  // ⚠️ Un Set NO es un array: no tiene map, filter ni reduce. Hay que
  // convertirlo de vuelta, y para eso tenemos dos formas equivalentes:
  // [...conjunto] con spread, o Array.from(conjunto).

  // TODO (en clase):
  //   1. Abre con titulo('7. Set: ELIMINAR DUPLICADOS').
  //   2. Declara const cursosRepetidos = ['Front End', 'Bases de Datos',
  //      'Front End', 'Redes', 'Bases de Datos', 'Front End'].
  //   3. const conjunto = new Set(cursosRepetidos). Imprime cursosRepetidos.length,
  //      conjunto.size y conjunto.has('Redes').
  //   4. const sinDuplicadosA = [...conjunto] y
  //      const sinDuplicadosB = Array.from(conjunto). Imprime los dos.
  //   5. La receta de una línea que verás en todos los proyectos: imprime
  //      [...new Set(cursosRepetidos)].sort((a, b) => a.localeCompare(b, 'es')).
  //   6. Imprime [...new Set([1, 2, 2, 3, 1, NaN, NaN])].join(', ')
  //      Lo unimos con join para verlo bien: al convertir a JSON, NaN saldría
  //      como null. Fíjate en que Set SÍ elimina el NaN duplicado (ese que
  //      indexOf no sabía encontrar y includes sí).
  //   Resultado esperado en pantalla:
  //     cursosRepetidos.length -> 6      conjunto.size -> 3
  //     conjunto.has("Redes") -> true
  //     Receta -> ["Bases de Datos","Front End","Redes"]
  //     [...new Set([1, 2, 2, 3, 1, NaN, NaN])] -> 1, 2, 3, NaN
  //   (aprox. 12 líneas)

  // ⚠️ ERROR COMÚN: esperar que Set elimine OBJETOS duplicados por contenido.
  // Compara por referencia: dos objetos con los mismos datos son distintos.
  //
  // ✅ Para eliminar objetos duplicados hay que elegir una CLAVE (por ejemplo,
  // el id) y usar un Map, que guarda pares clave-valor sin repetir la clave.

  // TODO (en clase):
  //   1. const objetosRepetidos = [{ id: 1 }, { id: 1 }, { id: 2 }];
  //      imprime new Set(objetosRepetidos).size  <- da 3, no 2.
  //   2. Declara const estudiantesConRepes con cuatro objetos
  //      { id, nombre }: (1, 'Ana Ruiz'), (2, 'Luis Paz'), (1, 'Ana Ruiz')
  //      y (3, 'Sara Gil').
  //   3. const unicos = [...new Map(estudiantesConRepes.map((e) => [e.id, e])).values()];
  //      imprime unicos.map((e) => e.id + ':' + e.nombre).join(' | ').
  //   4. Bonus, operaciones de conjuntos con Set + filter:
  //      const grupoUno = ['Ana Ruiz', 'Luis Paz', 'Sara Gil'];
  //      const grupoDos = ['Sara Gil', 'Iván Mora', 'Ana Ruiz'];
  //      const setDos = new Set(grupoDos);
  //      Imprime la Unión [...new Set([...grupoUno, ...grupoDos])],
  //      la Intersección grupoUno.filter((nombre) => setDos.has(nombre)) y
  //      la Diferencia grupoUno.filter((n) => !setDos.has(n)).
  //   5. Cierra el archivo con imprimir(
  //      '\nFin de la sección 4. Aplica todo esto en el proyecto de la sección 5.').
  //   Resultado esperado en pantalla:
  //     Set con objetos "iguales" -> 3
  //     Sin duplicados por id -> 1:Ana Ruiz | 2:Luis Paz | 3:Sara Gil
  //     Unión -> ["Ana Ruiz","Luis Paz","Sara Gil","Iván Mora"]
  //     Intersección -> ["Ana Ruiz","Sara Gil"]
  //     Diferencia (solo en grupoUno) -> ["Luis Paz"]
  //   (aprox. 16 líneas)

  /* ============================================================================
   * EJERCICIOS PROPUESTOS (sección 4)
   * ----------------------------------------------------------------------------
   * 1. Dado const temperaturas = [22, 5, 18, 30, 9]:
   *    a) ordénalas de menor a mayor SIN mutar el array original,
   *    b) ordénalas de mayor a menor,
   *    c) explica en un comentario qué devuelve sort() sin comparador y por qué.
   *
   * 2. Ordena el array "participantes" por edad ascendente y, en caso de empate,
   *    por puntos descendente. Imprime el resultado como
   *    "Ana Ruiz - 19 años - 88 pts".
   *
   * 3. Con destructuring, y en UNA sola línea por apartado:
   *    a) saca el primer y el último elemento de un array de 5 nombres
   *       (pista: usa rest y luego at(-1)),
   *    b) intercambia dos variables,
   *    c) extrae los dos primeros valores de [ ] dando 'Sin datos' por defecto.
   *
   * 4. Crea una función combinarListas(...listas) que reciba cualquier número
   *    de arrays, los una en uno solo, elimine duplicados con Set y devuelva el
   *    resultado ordenado alfabéticamente con localeCompare.
   *
   * 5. Reto: escribe una función clonarProfundo(datos) que copie un array de
   *    objetos de forma que modificar la copia NUNCA afecte al original.
   *    Hazlo de dos maneras (structuredClone y map + spread) y demuestra con
   *    console.log que ambas funcionan.
   * ============================================================================ */
})();
