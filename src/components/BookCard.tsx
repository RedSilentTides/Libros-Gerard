import React, { useState } from 'react';
import { Book } from '../types/book';
import { MapPin, ExternalLink, BookOpen, CheckCircle, Clock, Bookmark } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onSelectBook: (book: Book) => void;
  onToggleCategory?: (category: string) => void;
  onToggleAutor?: (autor: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelectBook,
  onToggleCategory,
  onToggleAutor,
}) => {
  const [imgError, setImgError] = useState(false);

  // Status Badge Helper
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Leído':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Leído
          </span>
        );
      case 'Prestado':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Prestado
          </span>
        );
      case 'Deseado':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Bookmark className="w-3 h-3 text-purple-600" /> Deseado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Disponible
          </span>
        );
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      <div>
        {/* Cover Image Container */}
        <div
          onClick={() => onSelectBook(book)}
          className="relative aspect-3/4 bg-slate-100 overflow-hidden cursor-pointer group-hover:brightness-[0.98] transition-all"
        >
          {book.imagen && !imgError ? (
            <img
              src={book.imagen}
              alt={book.titulo}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-700 via-stone-800 to-slate-900 p-4 flex flex-col justify-between text-amber-100 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <BookOpen className="w-6 h-6 opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs">
                  {book.editorial || 'Libro'}
                </span>
              </div>
              <div className="my-auto text-center py-4">
                <p className="font-serif font-bold text-sm text-amber-50 line-clamp-3 leading-snug">
                  {book.titulo}
                </p>
                {book.autor && (
                  <p className="text-xs text-amber-200/80 mt-1 font-sans italic line-clamp-1">
                    {book.autor}
                  </p>
                )}
              </div>
              <div className="text-[10px] text-amber-300/60 font-mono tracking-widest text-center">
                ISBN: {book.isbn}
              </div>
            </div>
          )}

          {/* Quick status pill on image */}
          <div className="absolute top-2.5 right-2.5 z-10 shadow-xs">
            {getStatusBadge(book.estado)}
          </div>

          {/* Location pill over image */}
          {(book.estanteria || book.ubicacion) && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs flex items-center justify-between font-medium truncate">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">
                  {book.estanteria} {book.ubicacion ? `• ${book.ubicacion}` : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          {/* Categories */}
          {book.categoria && (
            <div className="flex flex-wrap gap-1">
              {book.categoria
                .split(',')
                .map((cat) => cat.trim())
                .filter(Boolean)
                .map((cat, i) => (
                  <span
                    key={i}
                    onClick={(e) => {
                      if (onToggleCategory) {
                        e.stopPropagation();
                        onToggleCategory(cat);
                      }
                    }}
                    className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md border border-amber-200/80 truncate max-w-[160px] cursor-pointer transition-colors"
                    title={`Filtrar por ${cat}`}
                  >
                    {cat}
                  </span>
                ))}
            </div>
          )}

          {/* Title */}
          <h3
            onClick={() => onSelectBook(book)}
            className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-700 cursor-pointer transition-colors"
            title={book.titulo}
          >
            {book.titulo}
          </h3>

          {/* Author */}
          {book.autor && (
            <p
              onClick={(e) => {
                if (onToggleAutor && book.autor) {
                  e.stopPropagation();
                  onToggleAutor(book.autor);
                }
              }}
              className={`text-xs text-slate-600 font-medium italic line-clamp-1 ${
                onToggleAutor ? 'hover:text-amber-700 cursor-pointer transition-colors' : ''
              }`}
              title={onToggleAutor ? `Filtrar por ${book.autor}` : book.autor}
            >
              por {book.autor}
            </p>
          )}

          {/* Editorial & ISBN */}
          <div className="text-xs text-slate-500 space-y-0.5">
            {book.editorial && (
              <p className="font-medium text-slate-700 truncate">
                Editorial: <span className="text-slate-900">{book.editorial}</span>
              </p>
            )}
            <p className="font-mono text-[11px] text-slate-400">ISBN: {book.isbn}</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        {book.url ? (
          <a
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium hover:underline"
            title="Abrir enlace externo (BuscaLibre/Tienda)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver web</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin enlace</span>
        )}

        <button
          onClick={() => onSelectBook(book)}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          Detalles →
        </button>
      </div>
    </div>
  );
};
