export interface Book {
  id: string;
  isbn: string;
  titulo: string;
  autor?: string;
  editorial: string;
  categoria: string;
  imagen: string;
  url: string;
  estanteria: string;
  ubicacion: string;
  estado?: 'Disponible' | 'Leído' | 'Prestado' | 'Deseado';
  notas?: string;
  paginas?: number;
  fechaAgregado: string;
}

export type ViewMode = 'grid' | 'table' | 'shelf';

export interface FilterState {
  query: string;
  categorias: string[];
  autores: string[];
  editoriales: string[];
  estanterias: string[];
  estados: string[];
  ubicacion?: string;
}

export interface ExcelImportRow {
  ISBN?: string | number;
  isbn?: string | number;
  'Título'?: string;
  'Titulo'?: string;
  titulo?: string;
  title?: string;
  Editorial?: string;
  editorial?: string;
  publisher?: string;
  'Categoría'?: string;
  'Categoria'?: string;
  categoria?: string;
  category?: string;
  Imagen?: string;
  imagen?: string;
  'Imagen URL'?: string;
  image?: string;
  URL?: string;
  url?: string;
  link?: string;
  'Estantería'?: string;
  'Estanteria'?: string;
  estanteria?: string;
  shelf?: string;
  'Ubicación'?: string;
  'Ubicacion'?: string;
  ubicacion?: string;
  location?: string;
  [key: string]: any;
}
