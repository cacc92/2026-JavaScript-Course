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

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (consola visual de esta sección)
  // ============================================================
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

  titulo('1. sort() SIN COMPARADOR: EL PROBLEMA CON LOS NÚMEROS');

  const numeros = [10, 9, 100, 25, 3];
  // [...numeros] hace una COPIA del array (el operador spread, que estudiamos
  // en la sección 5 de este mismo archivo). Copiamos antes de ordenar porque
  // sort() MUTA, y queremos conservar el original para las comparaciones.
  const ordenAlfabetico = [...numeros].sort();
  imprimir('Original ->', numeros);
  imprimir('sort() sin comparador ->', ordenAlfabetico); // [10, 100, 25, 3, 9]

  // ¿POR QUÉ SALE ASÍ? Porque compara los TEXTOS "10", "100", "25", "3", "9"
  // carácter a carácter, igual que un diccionario:
  //   "10" < "100" (es más corto y coincide el principio)
  //   "100" < "25" porque el primer carácter "1" va antes que "2"
  //   "25" < "3"   porque "2" va antes que "3"
  //   "3"  < "9"
  // Analogía: en la guía telefónica, "Perez" va antes que "Álvarez" si
  // ordenamos letra a letra sin conocer el idioma. Aquí ocurre lo mismo con
  // los números: se ordenan como palabras, no como cantidades.

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

  titulo('1.c) COMPARADOR NUMÉRICO');

  const ascendente = [...numeros].sort((a, b) => a - b);
  imprimir('sort((a, b) => a - b) ->', ascendente); // [3, 9, 10, 25, 100]

  const descendente = [...numeros].sort((a, b) => b - a);
  imprimir('sort((a, b) => b - a) ->', descendente); // [100, 25, 10, 9, 3]

  // Cómo razonar la resta con un ejemplo concreto: comparamos 10 y 9.
  //   a - b = 10 - 9 = 1  -> positivo -> el 10 se coloca DESPUÉS del 9. Correcto.
  //   b - a = 9 - 10 = -1 -> negativo -> ahora el 10 va ANTES. Descendente.

  // ⚠️ ERROR COMÚN 1: creer que sort() devuelve una copia. MUTA el original.
  const mutado = [5, 1, 4];
  const resultado = mutado.sort((a, b) => a - b);
  imprimir('¿resultado y mutado son el MISMO array? ->', resultado === mutado); // true
  imprimir('mutado quedó ->', mutado); // [1,4,5]  <- el original cambió

  // ✅ BUENA PRÁCTICA: copiar antes de ordenar cuando el original importa.
  //    [...arr].sort(...)   o   arr.slice().sort(...)   o   arr.toSorted(...)
  if (typeof Array.prototype.toSorted === 'function') {
    const base = [5, 1, 4];
    imprimir('base.toSorted((a,b) => a-b) ->', base.toSorted((a, b) => a - b)); // [1,4,5]
    imprimir('...y base sigue intacto ->', base); // [5,1,4]
  } else {
    imprimir('Este navegador no tiene toSorted(); usa [...arr].sort()');
  }

  // ⚠️ ERROR COMÚN 2: escribir el comparador con booleanos, así:
  //       .sort((a, b) => a > b)
  // Un booleano se convierte a 1 o 0, y nunca devuelve un número negativo,
  // así que sort no recibe la información que necesita y el orden sale mal
  // (a veces parece funcionar con pocos elementos, y por eso engaña tanto).

  // ============================================================
  // 2. ORDENAR ARRAYS DE OBJETOS
  // ============================================================
  // La lógica es la misma, solo que en el comparador accedemos a la propiedad
  // por la que queremos ordenar.

  titulo('2. ORDENAR OBJETOS POR UNA PROPIEDAD');

  // Función auxiliar para imprimir la lista de forma compacta y legible.
  function resumir(lista) {
    return lista.map((p) => p.nombre + '(' + p.puntos + ')').join('  ');
  }

  imprimir('Original ->', resumir(participantes));

  const porPuntosDesc = [...participantes].sort((a, b) => b.puntos - a.puntos);
  imprimir('Por puntos DESC ->', resumir(porPuntosDesc));

  const porPuntosAsc = [...participantes].sort((a, b) => a.puntos - b.puntos);
  imprimir('Por puntos ASC ->', resumir(porPuntosAsc));

  const porEdad = [...participantes].sort((a, b) => a.edad - b.edad);
  imprimir(
    'Por edad ASC ->',
    porEdad.map((p) => p.nombre + '(' + p.edad + ')').join('  ')
  );

  // ------------------------------------------------------------
  // 2.b) Ordenar por DOS criterios (desempate)
  // ------------------------------------------------------------
  // "Primero por puntos de mayor a menor; si empatan, por nombre alfabético".
  // El truco: si el primer criterio da 0 (empate), pasamos al segundo.
  const conDesempate = [...participantes].sort((a, b) => {
    const porPuntos = b.puntos - a.puntos;
    if (porPuntos !== 0) return porPuntos; // No hay empate: decide este criterio.
    return a.nombre.localeCompare(b.nombre, 'es'); // Empate: desempata el nombre.
  });
  imprimir('Puntos DESC + nombre A-Z ->', resumir(conDesempate));
  // Luis Paz e Iván Mora empatan a 95: gana la I de "Iván" frente a la L de "Luis".

  // Nota: desde 2019 sort() es ESTABLE: los elementos que empatan conservan el
  // orden en el que estaban. Antes no era así y podía variar entre navegadores.

  // ============================================================
  // 3. ORDENAR TEXTOS: localeCompare
  // ============================================================
  // El sort() por defecto compara por código Unicode, no por reglas del idioma.
  // Consecuencias en español: las mayúsculas van antes que las minúsculas y
  // las vocales acentuadas quedan al final, detrás de la Z.

  titulo('3. ORDENAR TEXTOS CON ACENTOS Y MAYÚSCULAS');

  const nombres = ['Óscar', 'ana', 'Zoe', 'ángel', 'Bruno'];

  imprimir('Original ->', nombres);
  imprimir('sort() por defecto ->', [...nombres].sort());
  // ["Bruno","Zoe","ana","Óscar","ángel"]
  // Se ordena por el número interno (Unicode) de cada letra:
  //   B = 66, Z = 90, a = 97, Ó = 211, á = 225
  // Por eso TODAS las mayúsculas van antes que cualquier minúscula y las
  // vocales acentuadas terminan al final, detrás de la Z. No es lo que
  // esperaría ninguna persona hispanohablante.

  // localeCompare(otroTexto, idioma, opciones) devuelve un número NEGATIVO, CERO
  // o POSITIVO (en la práctica -1, 0 o 1) aplicando las reglas de ordenación del
  // idioma. Es EXACTAMENTE el contrato que sort necesita de un comparador.
  const conLocale = [...nombres].sort((a, b) => a.localeCompare(b, 'es'));
  imprimir('sort con localeCompare("es") ->', conLocale);
  // ["ana","ángel","Bruno","Óscar","Zoe"]  <- orden natural en español

  // La opción sensitivity: 'base' ignora acentos y mayúsculas al comparar,
  // muy útil también para BUSCAR (que "Angel" encuentre a "Ángel").
  const comparacion = 'ángel'.localeCompare('Angel', 'es', { sensitivity: 'base' });
  imprimir('"ángel" vs "Angel" con sensitivity base ->', comparacion); // 0 = iguales

  // Descendente alfabético: se invierten los dos operandos.
  imprimir(
    'Alfabético DESC ->',
    [...nombres].sort((a, b) => b.localeCompare(a, 'es'))
  );

  // Para ordenar números guardados como texto ("10", "9"), existe numeric: true.
  const versiones = ['tema10', 'tema2', 'tema1'];
  imprimir('Sin numeric ->', [...versiones].sort((a, b) => a.localeCompare(b, 'es')));
  imprimir(
    'Con numeric: true ->',
    [...versiones].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
  ); // ["tema1","tema2","tema10"]

  // ============================================================
  // 4. DESTRUCTURING DE ARRAYS
  // ============================================================
  // "Desestructurar" es sacar valores de un array y meterlos en variables
  // sueltas de una sola vez, según su POSICIÓN.
  // Analogía: abrir una caja de herramientas y colocar cada pieza en su hueco.

  titulo('4. DESTRUCTURING DE ARRAYS');

  const podio = ['Ana Ruiz', 'Luis Paz', 'Sara Gil', 'Iván Mora'];

  // Sin destructuring (la forma antigua):
  const oroViejo = podio[0];
  const plataViejo = podio[1];
  imprimir('Forma antigua ->', oroViejo + ' / ' + plataViejo);

  // Con destructuring: una sola línea, mucho más legible.
  const [oro, plata, bronce] = podio;
  imprimir('const [oro, plata, bronce] = podio ->', oro + ' / ' + plata + ' / ' + bronce);

  // ------------------------------------------------------------
  // 4.b) SALTOS: la coma vacía ignora una posición
  // ------------------------------------------------------------
  // Si solo te interesan el primero y el tercero, dejas un hueco con una coma.
  const [primero, , tercero] = podio;
  imprimir('const [primero, , tercero] ->', primero + ' y ' + tercero);

  // ------------------------------------------------------------
  // 4.c) VALORES POR DEFECTO
  // ------------------------------------------------------------
  // Si la posición no existe, la variable valdría undefined. Con = valor
  // le damos un respaldo.
  const [a1 = 0, a2 = 0, a3 = 0] = [5, 8]; // Solo hay dos elementos.
  imprimir('const [a1=0, a2=0, a3=0] = [5, 8] ->', a1, a2, a3); // 5 8 0

  // ⚠️ ERROR COMÚN: creer que el valor por defecto también cubre el null.
  // Solo se aplica cuando el valor es EXACTAMENTE undefined.
  const [b1 = 'sin dato', b2 = 'sin dato'] = [null, undefined];
  imprimir('[null, undefined] con defaults ->', b1, '/', b2); // null / "sin dato"

  // ------------------------------------------------------------
  // 4.d) REST (...): "y todo lo demás"
  // ------------------------------------------------------------
  // Recoge en un ARRAY los elementos restantes. Debe ir siempre el ÚLTIMO.
  const [ganador, ...resto] = podio;
  imprimir('Ganador ->', ganador);
  imprimir('Resto ->', resto); // array con los otros tres

  // ------------------------------------------------------------
  // 4.e) INTERCAMBIO DE VARIABLES (el truco estrella)
  // ------------------------------------------------------------
  // Antes hacía falta una variable auxiliar:
  //     let aux = x;  x = y;  y = aux;
  // Con destructuring es una sola línea, y se lee tal cual: "x pasa a ser y".
  let turnoManana = 'Grupo A';
  let turnoTarde = 'Grupo B';
  imprimir('Antes ->', turnoManana, '|', turnoTarde);

  [turnoManana, turnoTarde] = [turnoTarde, turnoManana];
  imprimir('Después ->', turnoManana, '|', turnoTarde);
  // ⚠️ Si la línea anterior empieza sin punto y coma, un corchete al inicio de
  // línea puede unirse con la línea de arriba y provocar un error raro.
  // ✅ BUENA PRÁCTICA: termina siempre las instrucciones con punto y coma.

  // ------------------------------------------------------------
  // 4.f) Destructuring ANIDADO y en PARÁMETROS de función
  // ------------------------------------------------------------
  const coordenadas = [
    [10, 20],
    [30, 40],
  ];
  const [[x1, y1], [x2, y2]] = coordenadas;
  imprimir('Destructuring anidado ->', 'x1=' + x1, 'y1=' + y1, 'x2=' + x2, 'y2=' + y2);

  // Muy habitual con Object.entries(), que devuelve pares [clave, valor].
  const puntosPorGrupo = { 'Grupo A': 88, 'Grupo B': 95, 'Grupo C': 74 };
  Object.entries(puntosPorGrupo).forEach(([grupo, puntos]) => {
    imprimir('  ' + grupo + ' -> ' + puntos + ' puntos');
  });

  // ============================================================
  // 5. SPREAD (...): COPIAR Y COMBINAR
  // ============================================================
  // El operador spread "desparrama" los elementos de un array allí donde se
  // escriba. Ojo: los mismos tres puntos significan REST cuando están a la
  // izquierda (recogiendo) y SPREAD cuando están a la derecha (repartiendo).

  titulo('5. SPREAD: COPIAR Y COMBINAR ARRAYS');

  const grupoManana = ['Ana Ruiz', 'Luis Paz'];
  const grupoTarde = ['Sara Gil', 'Iván Mora'];

  // (a) Copiar
  const copia = [...grupoManana];
  copia.push('Nuevo alumno');
  imprimir('copia ->', copia);
  imprimir('original ->', grupoManana); // sigue con 2: la copia es independiente

  // (b) Combinar (equivale a concat, pero se lee mejor)
  const todos = [...grupoManana, ...grupoTarde];
  imprimir('Combinar ->', todos);

  // (c) Insertar en medio y añadir elementos sueltos
  const conDocente = [...grupoManana, 'Docente', ...grupoTarde];
  imprimir('Con elemento en medio ->', conDocente);

  // (d) Pasar un array como argumentos sueltos a una función.
  // Math.max espera números separados, no un array: Math.max([1,2,3]) da NaN.
  const puntuaciones = [88, 95, 74, 95, 61];
  imprimir('Math.max(...puntuaciones) ->', Math.max(...puntuaciones)); // 95
  imprimir('Math.min(...puntuaciones) ->', Math.min(...puntuaciones)); // 61
  imprimir('Math.max(puntuaciones) ->', Math.max(puntuaciones)); // NaN  <- el error clásico

  // (e) Convertir un texto en array de caracteres.
  imprimir('[..."Hola"] ->', [...'Hola']); // ["H","o","l","a"]

  // ------------------------------------------------------------
  // 5.b) COPIA SUPERFICIAL vs COPIA PROFUNDA (¡importantísimo!)
  // ------------------------------------------------------------
  // Spread y slice hacen una copia SUPERFICIAL ("shallow"): copian el array,
  // pero si dentro hay objetos, copian la REFERENCIA a esos objetos, no los
  // objetos en sí. Analogía: fotocopias la lista de invitados, pero las dos
  // listas siguen apuntando a las mismas personas de carne y hueso.

  titulo('5.c) COPIA SUPERFICIAL vs PROFUNDA');

  const inscritos = [
    { nombre: 'Ana Ruiz', nota: 7 },
    { nombre: 'Luis Paz', nota: 5 },
  ];

  const copiaSuperficial = [...inscritos];

  // Añadir o quitar elementos SÍ es independiente:
  copiaSuperficial.push({ nombre: 'Sara Gil', nota: 9 });
  imprimir('Longitud copia ->', copiaSuperficial.length, '| original ->', inscritos.length); // 3 | 2

  // Pero modificar el INTERIOR de un objeto afecta a los dos arrays:
  copiaSuperficial[0].nota = 10;
  imprimir('⚠️ Original tras tocar la copia ->', inscritos[0]); // nota: 10 (¡cambió!)

  // ✅ SOLUCIÓN 1 (moderna y recomendada): structuredClone hace copia PROFUNDA.
  if (typeof structuredClone === 'function') {
    const copiaProfunda = structuredClone(inscritos);
    copiaProfunda[0].nota = 1;
    imprimir('Copia profunda modificada ->', copiaProfunda[0]); // nota: 1
    imprimir('Original intacto ->', inscritos[0]); // nota: 10, no se movió
  } else {
    imprimir('Este navegador no tiene structuredClone');
  }

  // ✅ SOLUCIÓN 2 (clásica): JSON.parse(JSON.stringify(...)).
  // Funciona con datos simples, pero PIERDE fechas (las convierte a texto),
  // funciones, undefined y no admite referencias circulares.
  const copiaJson = JSON.parse(JSON.stringify(inscritos));
  copiaJson[1].nota = 0;
  imprimir('Copia por JSON ->', copiaJson[1], '| original ->', inscritos[1]);

  // ✅ SOLUCIÓN 3 (para un nivel de anidamiento): copiar también cada objeto.
  const copiaPorMap = inscritos.map((estudiante) => ({ ...estudiante }));
  copiaPorMap[0].nota = 3;
  imprimir('Copia con map + spread ->', copiaPorMap[0], '| original ->', inscritos[0]);

  // ============================================================
  // 6. Array.from() Y Array.of()
  // ============================================================

  titulo('6. Array.from() Y Array.of()');

  // Array.from convierte en array cualquier cosa "parecida a un array"
  // (que tenga length o sea iterable) y admite una función transformadora.

  imprimir('Array.from("Hola") ->', Array.from('Hola')); // ["H","o","l","a"]

  // El truco del objeto {length: n} para generar secuencias.
  // El primer parámetro de la función es el elemento (aquí undefined, por eso
  // se escribe _ por convención: "no lo uso") y el segundo es el índice.
  const del1al5 = Array.from({ length: 5 }, (_, indice) => indice + 1);
  imprimir('Array.from({length: 5}, (_, i) => i + 1) ->', del1al5); // [1,2,3,4,5]

  const tablaDel7 = Array.from({ length: 10 }, (_, i) => 7 * (i + 1));
  imprimir('Tabla del 7 ->', tablaDel7);

  // Con un segundo argumento, Array.from hace de map en la misma pasada:
  imprimir(
    'Array.from(participantes, p => p.nombre) ->',
    Array.from(participantes, (p) => p.nombre)
  );

  // Uso REAL en el navegador: querySelectorAll devuelve una NodeList, que
  // NO es un array (no tiene map, filter ni reduce). Array.from la convierte.
  const secciones = Array.from(document.querySelectorAll('.tarjeta'));
  imprimir(
    'Secciones de esta página ->',
    secciones.map((seccion) => seccion.id)
  );

  // Array.of() crea un array con los valores que le pases. Existe justamente
  // para resolver la ambigüedad de new Array(3) que vimos en la sección 1.
  imprimir('Array.of(3) ->', Array.of(3)); // [3]   <- un elemento
  imprimir('Array(3) ->', new Array(3), '| length:', new Array(3).length); // 3 huecos
  imprimir('Array.of(1, 2, 3) ->', Array.of(1, 2, 3)); // [1,2,3]

  // ============================================================
  // 7. Set: ELIMINAR DUPLICADOS
  // ============================================================
  // Un Set es una colección que NO admite valores repetidos. Si intentas
  // meter dos veces lo mismo, la segunda se ignora en silencio.
  // Analogía: una lista de asistencia donde cada persona firma una sola vez.

  titulo('7. Set: ELIMINAR DUPLICADOS');

  const cursosRepetidos = [
    'Front End', 'Bases de Datos', 'Front End',
    'Redes', 'Bases de Datos', 'Front End',
  ];

  const conjunto = new Set(cursosRepetidos);
  imprimir('cursosRepetidos.length ->', cursosRepetidos.length); // 6
  imprimir('conjunto.size ->', conjunto.size); // 3
  imprimir('conjunto.has("Redes") ->', conjunto.has('Redes')); // true

  // ⚠️ Un Set NO es un array: no tiene map, filter ni reduce. Hay que
  // convertirlo de vuelta, y para eso tenemos dos formas equivalentes:
  const sinDuplicadosA = [...conjunto]; // con spread
  const sinDuplicadosB = Array.from(conjunto); // con Array.from
  imprimir('[...new Set(arr)] ->', sinDuplicadosA);
  imprimir('Array.from(new Set(arr)) ->', sinDuplicadosB);

  // La receta de una sola línea que verás en todos los proyectos:
  imprimir('Receta ->', [...new Set(cursosRepetidos)].sort((a, b) => a.localeCompare(b, 'es')));

  // También funciona con números, y elimina incluso el NaN duplicado (ese que
  // indexOf no sabía encontrar y includes sí).
  // Lo unimos con join para verlo bien: al convertir a JSON, NaN saldría como null.
  imprimir(
    '[...new Set([1, 2, 2, 3, 1, NaN, NaN])] ->',
    [...new Set([1, 2, 2, 3, 1, NaN, NaN])].join(', ')
  ); // "1, 2, 3, NaN"

  // ⚠️ ERROR COMÚN: esperar que Set elimine OBJETOS duplicados por contenido.
  // Compara por referencia: dos objetos con los mismos datos son distintos.
  const objetosRepetidos = [{ id: 1 }, { id: 1 }, { id: 2 }];
  imprimir('Set con objetos "iguales" ->', new Set(objetosRepetidos).size); // 3, no 2

  // ✅ Para eliminar objetos duplicados hay que elegir una CLAVE (aquí, el id)
  // y usar un Map, que guarda pares clave-valor sin repetir la clave.
  const estudiantesConRepes = [
    { id: 1, nombre: 'Ana Ruiz' },
    { id: 2, nombre: 'Luis Paz' },
    { id: 1, nombre: 'Ana Ruiz' },
    { id: 3, nombre: 'Sara Gil' },
  ];
  const unicos = [...new Map(estudiantesConRepes.map((e) => [e.id, e])).values()];
  imprimir(
    'Sin duplicados por id ->',
    unicos.map((e) => e.id + ':' + e.nombre).join(' | ')
  );

  // Bonus: operaciones de conjuntos clásicas resueltas con Set + filter.
  const grupoUno = ['Ana Ruiz', 'Luis Paz', 'Sara Gil'];
  const grupoDos = ['Sara Gil', 'Iván Mora', 'Ana Ruiz'];
  const setDos = new Set(grupoDos);

  imprimir('Unión ->', [...new Set([...grupoUno, ...grupoDos])]);
  imprimir('Intersección ->', grupoUno.filter((nombre) => setDos.has(nombre)));
  imprimir('Diferencia (solo en grupoUno) ->', grupoUno.filter((n) => !setDos.has(n)));

  imprimir('\nFin de la sección 4. Aplica todo esto en el proyecto de la sección 5.');

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
