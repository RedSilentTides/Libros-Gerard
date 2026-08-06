# Librería Gerard

Aplicación web interactiva para digitalizar, organizar y gestionar un catálogo de libros físico y digital con soporte de importación/exportación Excel y visualización por estanterías.

---

## 🚀 Características

- **Sincronización Automática con Excel del Repositorio (`public/libreria.xlsx`):**
  - La aplicación lee automáticamente el catálogo desde el archivo `public/libreria.xlsx` guardado en el repositorio.
  - Esto garantiza que la lista pública en el sitio web está **100% controlada por ti desde GitHub**. Ningún visitante puede alterar permanentemente lo que se muestra en la web.
- **Modo Administrador Protegido por PIN:**
  - Las herramientas de edición, creación, eliminación e importación rápida están protegidas por clave PIN personal.
- **Importación y Exportación Excel (.xlsx / .csv):**
  - Carga masiva de libros directamente desde tu planilla de Excel.
  - Reconocimiento automático de campos (ISBN, Título, Editorial, Categoría, Imagen URL, URL, Estantería, Ubicación, Estado, Notas).
  - Tres modos de importación: **Fusión/Actualización por ISBN**, **Reemplazar todo** o **Solo agregar nuevos**.
  - Exportación con un solo clic de la librería completa a archivo `.xlsx`.
- **Búsqueda Automática por ISBN:**
  - Consulta a la API pública de Google Books para autocompletar título, autor, editorial, portada y categoría a partir del ISBN.
- **Visualización por Estanterías y Baldas:**
  - Modo gráfico que organiza tus libros según el mueble/habitación (`estanteria`) y la repisa/balda (`ubicacion`).
- **Vista Cuadrícula y Tabla:**
  - Visualización en tarjetas con portadas y enlaces directos a tienda/BuscaLibre.
  - Vista en tabla con ordenación interactiva por cualquier columna.
- **Buscador y Filtros en Tiempo Real:**
  - Filtrado rápido por categoría, editorial, estantería, estado (Disponible, Leído, Prestado, Deseado) y texto.
- **Persistencia de Datos:**
  - Los datos se guardan automáticamente en tu navegador (`localStorage`).

---

## 📊 Formato de Excel Compatible

La aplicación acepta planillas Excel con las siguientes columnas (el orden de las columnas es libre y reconoce variantes con o sin tildes):

| Columna | Ejemplo | Descripción |
| :--- | :--- | :--- |
| **ISBN** | `9781639731763` | Código de barras / identificador único del libro |
| **Título** | `Throne of Glass box set (en Inglés) - Maas, Sarah J.` | Título del libro (soporta autor después de `-`) |
| **Editorial** | `Bloomsbury Publishing` | Casa editorial |
| **Categoría** | `Fantasía Épica, Fantasía Romántica` | Género o categorías separadas por coma |
| **Imagen URL** | `https://images.cdn3.buscalibre.com/...` | Enlace a la imagen de portada |
| **URL** | `https://www.buscalibre.cl/libro-...` | Enlace de compra o ficha web |
| **Estantería** | `pieza` | Mueble, habitación o estantería principal |
| **Ubicación** | `Balda 1.` | Repisa o ubicación específica dentro del mueble |

---



