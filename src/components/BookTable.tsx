import React, { useState } from 'react';
import { Book } from '../types/book';
import { ExternalLink, MapPin, ArrowUpDown, Image as ImageIcon } from 'lucide-react';

interface BookTableProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onToggleCategory?: (category: string) => void;
  onToggleAutor?: (autor: string) => void;
}

type SortField = 'titulo' | 'isbn' | 'editorial' | 'estanteria' | 'categoria';

export const BookTable: React.FC<BookTableProps> = ({
  books,
  onSelectBook,
  onToggleCategory,
  onToggleAutor,
}) => {
  const [sortField, setSortField] = useState<SortField>('titulo');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    const valA = (a[sortField] || '').toString().toLowerCase();
    const valB = (b[sortField] || '').toString().toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Portada</th>
              <th
                onClick={() => handleSort('isbn')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>ISBN</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('titulo')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Título / Detalle</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('editorial')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors hidden md:table-cell"
              >
                <div className="flex items-center gap-1">
                  <span>Editorial</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('categoria')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors hidden lg:table-cell"
              >
                <div className="flex items-center gap-1">
                  <span>Categoría</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('estanteria')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Estantería & Ubicación</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedBooks.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50/80 transition-colors group">
                {/* Image Preview */}
                <td className="py-2.5 px-4 text-center">
                  <div
                    onClick={() => onSelectBook(book)}
                    className="w-10 h-13 rounded bg-slate-100 border border-slate-200 overflow-hidden mx-auto cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
                  >
                    {book.imagen ? (
                      <img
                        src={book.imagen}
                        alt={book.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </td>

                {/* ISBN */}
                <td className="py-2.5 px-4 font-mono text-xs text-slate-600 font-medium">
                  {book.isbn}
                </td>

                {/* Title */}
                <td className="py-2.5 px-4">
                  <div
                    onClick={() => onSelectBook(book)}
                    className="font-semibold text-slate-900 hover:text-amber-700 cursor-pointer line-clamp-2 max-w-md"
                    title={book.titulo}
                  >
                    {book.titulo}
                  </div>
                  {book.autor && (
                    <p
                      onClick={(e) => {
                        if (onToggleAutor && book.autor) {
                          e.stopPropagation();
                          onToggleAutor(book.autor);
                        }
                      }}
                      className={`text-xs text-slate-500 italic mt-0.5 ${
                        onToggleAutor ? 'hover:text-amber-700 cursor-pointer transition-colors' : ''
                      }`}
                      title={onToggleAutor ? `Filtrar por ${book.autor}` : book.autor}
                    >
                      {book.autor}
                    </p>
                  )}
                </td>

                {/* Editorial */}
                <td className="py-2.5 px-4 text-slate-700 font-medium hidden md:table-cell">
                  {book.editorial || <span className="text-slate-400 italic">S/N</span>}
                </td>

                {/* Category */}
                <td className="py-2.5 px-4 hidden lg:table-cell">
                  {book.categoria ? (
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {book.categoria
                        .split(',')
                        .map((cat) => cat.trim())
                        .filter(Boolean)
                        .map((cat, idx) => (
                          <span
                            key={idx}
                            onClick={(e) => {
                              if (onToggleCategory) {
                                e.stopPropagation();
                                onToggleCategory(cat);
                              }
                            }}
                            className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md border border-amber-200/80 cursor-pointer transition-colors"
                            title={`Filtrar por ${cat}`}
                          >
                            {cat}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic">S/C</span>
                  )}
                </td>

                {/* Estantería & Ubicación */}
                <td className="py-2.5 px-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      <strong className="font-semibold">{book.estanteria || 'General'}</strong>
                      {book.ubicacion && <span className="text-amber-700 font-normal"> • {book.ubicacion}</span>}
                    </span>
                  </div>
                </td>

                {/* Estado */}
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      book.estado === 'Leído'
                        ? 'bg-emerald-100 text-emerald-800'
                        : book.estado === 'Prestado'
                        ? 'bg-amber-100 text-amber-800'
                        : book.estado === 'Deseado'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {book.estado || 'Disponible'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {book.url && (
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Abrir URL"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onSelectBook(book)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                    >
                      Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
