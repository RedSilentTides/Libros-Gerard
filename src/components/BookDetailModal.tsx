import React from 'react';
import { Book } from '../types/book';
import { X, ExternalLink, MapPin, Tag, Building2, BookOpen, Copy, Check, Calendar, StickyNote } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const [copiedIsbn, setCopiedIsbn] = React.useState(false);

  if (!book) return null;

  const copyIsbn = () => {
    navigator.clipboard.writeText(book.isbn);
    setCopiedIsbn(true);
    setTimeout(() => setCopiedIsbn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-slate-800 text-sm">Detalles del Libro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Cover Column */}
            <div className="md:col-span-1 space-y-4">
              <div className="aspect-3/4 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm relative group">
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
                  <div className="w-full h-full bg-slate-800 p-4 flex flex-col items-center justify-center text-center text-slate-300">
                    <BookOpen className="w-8 h-8 mb-2 text-amber-400" />
                    <p className="text-xs font-semibold">{book.titulo}</p>
                  </div>
                )}
              </div>

              {/* Quick Status Pill */}
              <div className="text-center">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    book.estado === 'Leído'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : book.estado === 'Prestado'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : book.estado === 'Deseado'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  Estado: {book.estado || 'Disponible'}
                </span>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">{book.titulo}</h2>
                {book.autor && (
                  <p className="text-sm font-medium text-slate-600 italic mt-1">{book.autor}</p>
                )}
              </div>

              {/* Location Highlight Box */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" /> Ubicación Física en Librería
                </p>
                <p className="text-sm text-amber-950 font-bold">
                  Estantería: <span className="text-amber-800 font-normal">{book.estanteria || 'No asignada'}</span>
                </p>
                <p className="text-sm text-amber-950 font-bold">
                  Ubicación / Balda: <span className="text-amber-800 font-normal">{book.ubicacion || 'No asignada'}</span>
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-medium block">ISBN</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono font-bold text-slate-800">{book.isbn}</span>
                    <button
                      onClick={copyIsbn}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      title="Copiar ISBN"
                    >
                      {copiedIsbn ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-medium block">Editorial</span>
                  <span className="font-bold text-slate-800 mt-0.5 block truncate">
                    {book.editorial || 'No especificada'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 col-span-2">
                  <span className="text-slate-400 font-medium block mb-1">Categorías</span>
                  <div className="flex flex-wrap gap-1.5">
                    {book.categoria ? (
                      book.categoria
                        .split(',')
                        .map((cat) => cat.trim())
                        .filter(Boolean)
                        .map((cat, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md"
                          >
                            {cat}
                          </span>
                        ))
                    ) : (
                      <span className="text-slate-500 italic">Sin categoría</span>
                    )}
                  </div>
                </div>
              </div>

              {/* External URL button */}
              {book.url && (
                <div>
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors w-full justify-center"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>Abrir en Tienda / BuscaLibre</span>
                  </a>
                </div>
              )}

              {/* Notes */}
              {book.notas && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1 mb-1">
                    <StickyNote className="w-3.5 h-3.5 text-amber-600" /> Notas personales
                  </span>
                  <p className="text-slate-700 italic">{book.notas}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Registrado el {book.fechaAgregado || 'Recientemente'}
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
