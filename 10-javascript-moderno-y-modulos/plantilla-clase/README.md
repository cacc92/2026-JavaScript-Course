# Plantilla de clase · Proyecto 10 · JavaScript moderno (ES6+) y módulos

Esta carpeta es la **versión para dictar la clase escribiendo el JavaScript en vivo**.
La maqueta (HTML y CSS) ya está terminada; los archivos de `js/` están vacíos a propósito
y solo contienen la explicación y las instrucciones de qué escribir.

La **solución completa** está en la carpeta padre: `../index.html` y `../js/`.
Ten los dos archivos abiertos en paralelo mientras dictas: la plantilla tiene las mismas
secciones, con los mismos números y en el mismo orden que el archivo resuelto.

---

## ⚠️ Este proyecto necesita un servidor local

Es la única excepción del curso, y precisamente eso es parte de lo que enseña.
Los módulos ES están sujetos a la política CORS y **no funcionan con `file://`**.

- **Live Server (recomendado en clase).** Clic derecho sobre `index.html` → *Open with Live Server*.
- **Python.** En una terminal dentro de esta carpeta: `python3 -m http.server 8000`
  y después visita `http://localhost:8000`.

Si abres la plantilla con doble clic verás el aviso rojo grande explicándolo.

---

## Qué ya viene hecho y qué se escribe en vivo

| Archivo | Estado |
|---|---|
| `index.html` | **Completo.** Idéntico al del proyecto resuelto: todos los elementos, ids y clases ya puestos. Solo cambia el `<title>`, el enlace de vuelta al índice y el cartel de MODO CLASE. |
| `css/estilos.css` | **Completo.** Copia exacta del final, más una sección 19 con las reglas del cartel `.aviso-modo-clase`. |
| `js/modulos/consola.js` | **Completo y funcionando.** Es la única excepción: es el andamiaje (`imprimir`, `titulo`, `crearConsola`, `limpiar`, `intentar`) que permite mostrar resultados en pantalla desde el primer minuto. |
| `js/main.js` y los otros 7 archivos `.js` | **Por escribir.** Solo comentarios: la teoría intacta y bloques `// TODO (en clase):` con instrucciones precisas. |

Los **datos de partida** también vienen escritos, porque teclearlos en clase es tiempo perdido:
`MONEDAS` y `CONFIGURACION` en `formato.js`, `REGLAS_CONTRASENA` y `CONTRASENAS_PROHIBIDAS`
en `validaciones.js`, y `NOTAS_CURSO` y `ESTUDIANTES` en `metodos-modernos.js`.
Lo que se escribe en vivo es la lógica que los procesa.

---

## La página arranca vacía: es lo esperado

Al abrir la plantilla sin haber escrito una sola línea:

- Todas las consolas visuales están **en blanco**.
- El aviso **"Los módulos ES todavía no se han cargado" sigue en rojo**. Lo pone en verde
  la función `confirmarCargaDeModulos()` de `main.js`, que aún no existe.
- La caja de herramientas no muestra ningún resultado y el `<select>` de monedas está vacío
  (lo rellena `precargarFormularios()`).
- **La consola del navegador (F12) no muestra ningún error.** Si ves alguno, es que se coló
  algo al escribir en vivo, no que la plantilla esté rota.

Ese estado inicial es un buen punto de partida pedagógico: "esto es una página sin JavaScript;
vamos a darle vida".

---

## Orden recomendado y minutos estimados

El proyecto es grande. Está pensado para **tres o cuatro sesiones**, no para una.

### Sesión 1 · Los módulos, de cero a página viva (≈ 60 min)

| Paso | Archivo | Min |
|---|---|---|
| 1 | Leer por encima `js/modulos/consola.js` (ya escrito). Tres ideas: un archivo = un módulo, `export` publica, lo que no lleva `export` es privado. | 5 |
| 2 | `js/modulos/almacen.js` completo (secciones 1–7). El singleton y `??=`. | 20 |
| 3 | `js/main.js` secciones 1, 6, 13 y 15: importar solo `consola.js`, crear las consolas, escribir un `iniciar()` mínimo y llamarlo. **Primera señal de vida en pantalla.** | 20 |
| 4 | `js/main.js` sección 9 (`demostrarAlmacen`) y sección 12 (botones). | 15 |

> Truco: no escribas los quince imports antes de la primera línea visible. Un import de algo
> que todavía no existe rompe **toda** la aplicación. Añade cada import cuando su módulo esté listo.

### Sesión 2 · Sintaxis moderna (≈ 90 min, repartible)

| Paso | Archivo | Min |
|---|---|---|
| 5 | `js/extras/sintaxis-moderna.js` §1 declaraciones y TDZ | 20 |
| 6 | `js/extras/sintaxis-moderna.js` §2 template literals y tagged templates | 15 |
| 7 | `js/extras/sintaxis-moderna.js` §3 destructuring avanzado | 25 |
| 8 | `js/extras/sintaxis-moderna.js` §4 spread y rest | 20 |
| 9 | `js/extras/sintaxis-moderna.js` §5 parámetros por defecto | 15 |
| 10 | `js/extras/sintaxis-moderna.js` §6 `?.` y `??` | 20 |
| 11 | `js/extras/sintaxis-moderna.js` §7 `\|\|=`, `&&=`, `??=` y §8 números | 20 |

Ve conectando cada demo en la tabla de despacho `DEMOSTRACIONES` de `main.js` (sección 7)
en cuanto escribas su función: así se prueba con el botón de su propia sección.

### Sesión 3 · Métodos modernos, iteradores y generadores (≈ 80 min)

| Paso | Archivo | Min |
|---|---|---|
| 12 | `js/extras/metodos-modernos.js` §1–5 (`at`, `findLast`, `flat`, `Object.*`, `groupBy`) | 25 |
| 13 | `js/extras/metodos-modernos.js` §6–9 (String, Number, `structuredClone`, no destructivos) | 20 |
| 14 | `js/extras/iteradores-y-generadores.js` §1–2 (protocolo iterable, `Symbol.iterator`) | 20 |
| 15 | `js/extras/iteradores-y-generadores.js` §3–4 (`function*`, `yield`, `yield*`, caso práctico) | 25 |

### Sesión 4 · La aplicación completa (≈ 90 min)

| Paso | Archivo | Min |
|---|---|---|
| 16 | `js/modulos/formato.js` completo (`export default` + Intl + tagged templates) | 25 |
| 17 | `js/modulos/matematicas.js` completo (rest, spread, lista de exportación con `as`) | 25 |
| 18 | `js/modulos/validaciones.js` completo (un módulo importando a otro) | 25 |
| 19 | `js/main.js` sección 11: la caja de herramientas (las cuatro funciones) | 25 |
| 20 | `js/main.js` sección 8 (`demostrarModulos`) — la sección estrella | 20 |
| 21 | `js/extras/reporte-avanzado.js` + `main.js` sección 10: `import()` dinámico con la pestaña **Red** abierta | 20 |

**Total aproximado: 5 h 20 min de escritura en vivo.** Súmale las pausas y las preguntas.

---

## Cómo comparar con la solución

La versión resuelta es la **carpeta padre**, no otra rama ni otro repositorio:

```
10-javascript-moderno-y-modulos/
├── index.html          ← solución
├── css/estilos.css     ← solución
├── js/                 ← solución (los 9 archivos escritos)
├── README.md           ← guía docente completa del proyecto
└── plantilla-clase/    ← estás aquí
    ├── index.html
    ├── css/estilos.css
    └── js/             ← los mismos 9 archivos, por escribir
```

- Los archivos de `plantilla-clase/js/` tienen **las mismas secciones numeradas y en el mismo
  orden** que sus equivalentes de `js/`. Si la plantilla dice `// 5. MEDIANA`, en el archivo
  resuelto encontrarás `// 5. MEDIANA` con el código debajo.
- Cada `// TODO (en clase):` termina con una estimación de líneas —`(aprox. 10 líneas)`— para
  calcular el tiempo sobre la marcha.
- Cuando un TODO dice "copia los datos del archivo resuelto", hazlo literalmente: son datos,
  no materia.
- Para comparar dos archivos concretos sin salir de la terminal:

  ```
  diff js/modulos/almacen.js plantilla-clase/js/modulos/almacen.js
  ```

- El `README.md` de la carpeta padre tiene la guía docente completa del proyecto: temario,
  errores comunes y evaluación. Este README solo cubre el uso de la plantilla.

---

## Qué NO tocar

- **No modifiques `index.html` ni `css/estilos.css`.** La maqueta está terminada; si la clase
  ve cambiar el HTML se pierde el hilo del tema, que es JavaScript.
- **No borres los comentarios de teoría ni los avisos ⚠️ ERROR COMÚN / ✅ BUENA PRÁCTICA.**
  Son el material de exposición: se leen en voz alta antes de escribir cada bloque.
- **No borres el bloque final de EJERCICIOS PROPUESTOS** de cada archivo: es lo que se lleva
  el estudiante para practicar en casa.
- Los `// TODO (en clase):` sí se van borrando a medida que se escribe el código que describen.
