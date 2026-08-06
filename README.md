# Digitalizador de Librería

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

## 🛠️ Instalación y Desarrollo Local

Para ejecutar el proyecto en tu computadora localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   cd TU_REPOSITORIO
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🌐 Publicar en GitHub Pages (Hosting Gratuito)

Este repositorio incluye una acción automatizada (`.github/workflows/deploy.yml`) que compila y publica tu sitio web automáticamente cada vez que subes cambios a la rama principal.

### Pasos para activar el hosting gratuito en GitHub:

1. Ve a tu repositorio en **GitHub.com**.
2. Entra en la pestaña **Settings** (Configuración del repositorio).
3. En el menú de la izquierda, haz clic en **Pages**.
4. En **Build and deployment** -> **Source**, selecciona **GitHub Actions**.
5. ¡Listo! Cada vez que hagas `git push`, GitHub compilará el código y desplegará tu app en una URL gratuita con el formato:
   `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`

---

## 🔒 Privacidad y Permisos en GitHub

Por defecto en GitHub:
- Si creas un repositorio **Público**, **cualquier persona podrá ver el código y usar la app**, pero **SOLO TÚ** (el dueño de la cuenta) tendrás permisos de modificación/escritura (`push`). Nadie más puede modificar tu código.
- Si alguien desea sugerir cambios, solo puede hacerlo mediante un *Pull Request*, el cual tú puedes aceptar o rechazar libremente.

