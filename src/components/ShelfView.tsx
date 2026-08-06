import React from 'react';
import { Book } from '../types/book';
import { Layers, MapPin, BookOpen, ChevronRight } from 'lucide-react';

interface ShelfViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const ShelfView: React.FC<ShelfViewProps> = ({ books, onSelectBook }) => {
  // Group books by estanteria -> ubicacion
  const shelfMap = books.reduce((acc, book) => {
    const est = book.estanteria || 'Sin Estantería Especificada';
    const ubi = book.ubicacion || 'Sin Balda/Ubicación Especificada';

    if (!acc[est]) {
      acc[est] = {};
    }
    if (!acc[est][ubi]) {
      acc[est][ubi] = [];
    }
    acc[est][ubi].push(book);
    return acc;
  }, {} as Record<string, Record<string, Book[]>>);

  const estanteriaNames = Object.keys(shelfMap).sort();

  if (estanteriaNames.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
        No hay libros para mostrar en las estanterías.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {estanteriaNames.map((estName) => {
        const ubiMap = shelfMap[estName];
        const ubicacionNames = Object.keys(ubiMap).sort();
        const totalInEstanteria = (Object.values(ubiMap) as Book[][]).reduce((sum, list) => sum + list.length, 0);

        return (
          <div
            key={estName}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Estantería Header */}
            <div className="bg-gradient-to-r from-stone-800 to-amber-950 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight capitalize flex items-center gap-2">
                    Estantería / Mueble: <span className="text-amber-300">{estName}</span>
                  </h2>
                  <p className="text-xs text-amber-200/70 font-medium">
                    {ubicacionNames.length} baldas / ubicaciones • {totalInEstanteria} libros en total
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-shelves / Baldas list */}
            <div className="p-6 space-y-6 bg-slate-50/50">
              {ubicacionNames.map((ubiName) => {
                const shelfBooks = ubiMap[ubiName];

                return (
                  <div key={ubiName} className="space-y-3">
                    {/* Balda Label */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>{ubiName}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {shelfBooks.length}
                        </span>
                      </div>
                    </div>

                    {/* Shelf rack visual display */}
                    <div className="relative bg-stone-100 p-4 rounded-xl border border-stone-300/80 shadow-inner">
                      {/* Physical shelf wood texture bar at bottom */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-3">
                        {shelfBooks.map((book) => (
                          <div
                            key={book.id}
                            onClick={() => onSelectBook(book)}
                            className="group bg-white rounded-lg border border-slate-200 p-2.5 shadow-2xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between"
                          >
                            <div className="aspect-3/4 bg-slate-100 rounded overflow-hidden mb-2 relative">
                              {book.imagen ? (
                                <img
                                  src={book.imagen}
                                  alt={book.titulo}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-amber-800 p-2 text-amber-100 flex flex-col justify-center items-center text-center">
                                  <BookOpen className="w-5 h-5 mb-1" />
                                  <p className="text-[10px] font-bold line-clamp-2">{book.titulo}</p>
                                </div>
                              )}
                            </div>

                            <div>
                              <p
                                className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-amber-700 leading-tight"
                                title={book.titulo}
                              >
                                {book.titulo}
                              </p>
                              {book.autor && (
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {book.autor}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-400 font-mono mt-1">
                                ISBN: {book.isbn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Wood shelf bar visual */}
                      <div className="h-3 bg-gradient-to-r from-amber-800 via-amber-900 to-amber-850 rounded-b-md shadow-xs border-t border-amber-700" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
