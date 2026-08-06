import * as XLSX from 'xlsx';
import { Book, ExcelImportRow } from '../types/book';

// Expected column names matching the user's explicit format:
// "ISBN", "Título", "Editorial", "Categoría", "Imagen URL", "URL", "Estantería", "Ubicación"

export const exportBooksToExcel = (books: Book[], filename = 'libreria_digital.xlsx') => {
  const exportData = books.map((b) => ({
    ISBN: b.isbn || '',
    'Título': b.titulo || '',
    Editorial: b.editorial || '',
    'Categoría': b.categoria || '',
    Imagen: b.imagen || '',
    URL: b.url || '',
    'Estantería': b.estanteria || '',
    'Ubicación': b.ubicacion || '',
    Estado: b.estado || 'Disponible',
    Notas: b.notas || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths for nice viewing in Excel
  worksheet['!cols'] = [
    { wch: 16 }, // ISBN
    { wch: 45 }, // Título
    { wch: 25 }, // Editorial
    { wch: 35 }, // Categoría
    { wch: 40 }, // Imagen
    { wch: 40 }, // URL
    { wch: 18 }, // Estantería
    { wch: 18 }, // Ubicación
    { wch: 15 }, // Estado
    { wch: 30 }, // Notas
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Librería');

  XLSX.writeFile(workbook, filename);
};

export const downloadSampleExcelTemplate = () => {
  const sampleRows = [
    {
      ISBN: '9781639731763',
      'Título': 'Throne of Glass box set (en Inglés) - Maas, Sarah J.',
      Editorial: 'Bloomsbury Publishing',
      'Categoría': 'Fantasía Épica/Fantasía Heroica, Fantasía Romántica',
      Imagen: 'https://images.cdn3.buscalibre.com/fit-in/660x660/3e/fe/3efe68aa23dca29a742b7c86d6b950f6.jpg',
      URL: 'https://www.buscalibre.cl/libro-throne-of-glass-box-set/9781639731763/p/54430159',
      'Estantería': 'pieza',
      'Ubicación': 'Balda 1.',
      Estado: 'Disponible',
      Notas: 'Ejemplo de importación de librería',
    },
    {
      ISBN: '9788420412146',
      'Título': 'Cien años de soledad - Gabriel García Márquez',
      Editorial: 'Alfaguara',
      'Categoría': 'Realismo Mágico',
      Imagen: '',
      URL: 'https://www.buscalibre.cl/libro-cien-anos-de-soledad/9788420412146/p/4710123',
      'Estantería': 'Salón',
      'Ubicación': 'Balda 2',
      Estado: 'Leído',
      Notas: '',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  worksheet['!cols'] = [
    { wch: 16 },
    { wch: 45 },
    { wch: 25 },
    { wch: 35 },
    { wch: 40 },
    { wch: 40 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 30 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla Libreria');
  XLSX.writeFile(workbook, 'plantilla_libreria_formato.xlsx');
};

export const parseExcelRows = (rawRows: ExcelImportRow[]): Book[] => {
  const parsedBooks: Book[] = rawRows.map((row, index) => {
    // Normalize column names regardless of accents or exact casing
    const findValue = (...keys: string[]): string => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
          return String(row[k]).trim();
        }
      }
      // Case-insensitive search fallback
      const lowerRow = Object.keys(row).reduce((acc: Record<string, any>, currKey) => {
        acc[currKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')] = row[currKey];
        return acc;
      }, {});

      for (const k of keys) {
        const normKey = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lowerRow[normKey] !== undefined && lowerRow[normKey] !== null) {
          return String(lowerRow[normKey]).trim();
        }
      }
      return '';
    };

    const rawIsbn = findValue('ISBN', 'isbn', 'codigo', 'barcode');
    const rawTitulo = findValue('Título', 'Titulo', 'titulo', 'title', 'nombre');
    const rawEditorial = findValue('Editorial', 'editorial', 'publisher');
    const rawCategoria = findValue('Categoría', 'Categoria', 'categoria', 'category', 'genero');
    const rawImagen = findValue('Imagen URL', 'Imagen', 'imagen', 'image', 'cover', 'foto');
    const rawUrl = findValue('URL', 'url', 'link', 'enlace', 'buscalibre');
    const rawEstanteria = findValue('Estantería', 'Estanteria', 'estanteria', 'shelf', 'estante', 'mueble');
    const rawUbicacion = findValue('Ubicación', 'Ubicacion', 'ubicacion', 'location', 'balda', 'posicion');
    const rawEstado = findValue('Estado', 'estado', 'status');
    const rawNotas = findValue('Notas', 'notas', 'comentario', 'observaciones');

    // Derive author if title contains " - Author"
    let title = rawTitulo || 'Sin Título';
    let author = '';
    if (title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length >= 2) {
        author = parts[parts.length - 1].trim();
      }
    }

    return {
      id: `imp-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
      isbn: rawIsbn || `S/N-${index + 1}`,
      titulo: title,
      autor: author,
      editorial: rawEditorial || 'Sin Editorial',
      categoria: rawCategoria || 'Sin Categoría',
      imagen: rawImagen,
      url: rawUrl,
      estanteria: rawEstanteria || 'General',
      ubicacion: rawUbicacion || 'Sin Asignar',
      estado: (['Disponible', 'Leído', 'Prestado', 'Deseado'].includes(rawEstado) 
        ? rawEstado 
        : 'Disponible') as Book['estado'],
      fechaAgregado: new Date().toISOString().split('T')[0],
      notas: rawNotas,
    };
  });

  // Filter out empty rows
  return parsedBooks.filter(
    (b) => b.titulo !== 'Sin Título' || b.isbn !== `S/N-1`
  );
};

export const fetchRepoExcelFile = async (): Promise<Book[]> => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const fileUrl = `${cleanBase}libreria.xlsx?v=${Date.now()}`;

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: No se pudo descargar libreria.xlsx`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawRows = XLSX.utils.sheet_to_json<ExcelImportRow>(worksheet, { defval: '' });
  return parseExcelRows(rawRows);
};

export const parseExcelFile = (file: File): Promise<Book[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawRows = XLSX.utils.sheet_to_json<ExcelImportRow>(worksheet, { defval: '' });
        resolve(parseExcelRows(rawRows));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
