import { Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    isbn: '9781639731763',
    titulo: 'Throne of Glass box set (en Inglés) - Maas, Sarah J.',
    autor: 'Sarah J. Maas',
    editorial: 'Bloomsbury Publishing',
    categoria: 'Fantasía Épica/Fantasía Heroica, Fantasía Romántica',
    imagen: 'https://images.cdn3.buscalibre.com/fit-in/660x660/3e/fe/3efe68aa23dca29a742b7c86d6b950f6.jpg',
    url: 'https://www.buscalibre.cl/libro-throne-of-glass-box-set/9781639731763/p/54430159',
    estanteria: 'pieza',
    ubicacion: 'Balda 1.',
    estado: 'Disponible',
    fechaAgregado: '2026-08-01',
    notas: 'Edición especial de caja coleccionable en inglés.'
  },
  {
    id: '2',
    isbn: '9788420412146',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    editorial: 'Alfaguara',
    categoria: 'Realismo Mágico, Literatura Latinoamericana',
    imagen: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    url: 'https://www.buscalibre.cl/libro-cien-anos-de-soledad/9788420412146/p/4710123',
    estanteria: 'pieza',
    ubicacion: 'Balda 1.',
    estado: 'Leído',
    fechaAgregado: '2026-08-02',
    notas: 'Obra cumbre del realismo mágico.'
  },
  {
    id: '3',
    isbn: '9788445071403',
    titulo: 'El Señor de los Anillos: La Comunidad del Anillo',
    autor: 'J.R.R. Tolkien',
    editorial: 'Minotauro',
    categoria: 'Fantasía Épica, Clásicos',
    imagen: 'https://images.unsplash.com/photo-1629992101753-56d196c8aea7?auto=format&fit=crop&q=80&w=600',
    url: 'https://www.buscalibre.cl/libro-el-senor-de-los-anillos/9788445071403/p/1234567',
    estanteria: 'pieza',
    ubicacion: 'Balda 2.',
    estado: 'Disponible',
    fechaAgregado: '2026-08-03'
  },
  {
    id: '4',
    isbn: '9788408246473',
    titulo: 'Hábitos Atómicos',
    autor: 'James Clear',
    editorial: 'Editorial Planeta',
    categoria: 'Desarrollo Personal, Psicología Aplicada',
    imagen: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    url: 'https://www.buscalibre.cl/libro-habitos-atomicos/9788408246473/p/523411',
    estanteria: 'Salón',
    ubicacion: 'Repisa Superior',
    estado: 'Leído',
    fechaAgregado: '2026-08-04',
    notas: 'Subrayado y con notas adhesivas en el capítulo 3.'
  },
  {
    id: '5',
    isbn: '9788418045745',
    titulo: 'La canción de Aquiles',
    autor: 'Madeline Miller',
    editorial: 'Suma de Letras',
    categoria: 'Ficción Histórica, Fantasía Romántica',
    imagen: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    url: 'https://www.buscalibre.cl/libro-la-cancion-de-aquiles/9788418045745/p/897123',
    estanteria: 'Oficina',
    ubicacion: 'Estante B',
    estado: 'Prestado',
    fechaAgregado: '2026-08-05',
    notas: 'Prestado a María el 15 de julio.'
  }
];
