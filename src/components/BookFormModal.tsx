import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { X, Search, Sparkles, MapPin, Image as ImageIcon, Link as LinkIcon, Save, RefreshCw } from 'lucide-react';

interface BookFormModalProps {
  isOpen: boolean;
  bookToEdit?: Book | null;
  onClose: () => void;
  onSave: (bookData: Omit<Book, 'id'> | Book) => void;
  existingEstanterias: string[];
  existingUbicaciones: string[];
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  bookToEdit,
  onClose,
  onSave,
  existingEstanterias,
  existingUbicaciones,
}) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    isbn: '',
    titulo: '',
    autor: '',
    editorial: '',
    categoria: '',
    imagen: '',
    url: '',
    estanteria: 'pieza',
    ubicacion: 'Balda 1.',
    estado: 'Disponible',
    notas: '',
  });

  const [isSearchingIsbn, setIsSearchingIsbn] = useState(false);
  const [isbnLookupError, setIsbnLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (bookToEdit) {
      setFormData(bookToEdit);
    } else {
      setFormData({
        isbn: '',
        titulo: '',
        autor: '',
        editorial: '',
        categoria: '',
        imagen: '',
        url: '',
        estanteria: 'pieza',
        ubicacion: 'Balda 1.',
        estado: 'Disponible',
        notas: '',
      });
    }
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  // ISBN Auto-Lookup using Google Books Public API
  const handleIsbnLookup = async () => {
    const isbnClean = formData.isbn?.trim().replace(/[- ]/g, '');
    if (!isbnClean) {
      setIsbnLookupError('Introduce un número de ISBN válido primero');
      return;
    }

    setIsSearchingIsbn(true);
    setIsbnLookupError(null);

    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnClean}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const info = data.items[0].volumeInfo;
        const title = info.title || '';
        const subtitle = info.subtitle ? `: ${info.subtitle}` : '';
        const authors = info.authors ? info.authors.join(', ') : '';
        const publisher = info.publisher || '';
        const categories = info.categories ? info.categories.join(', ') : '';
        const image = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';

        setFormData((prev) => ({
          ...prev,
          titulo: `${title}${subtitle}${authors ? ` - ${authors}` : ''}`,
          autor: authors,
          editorial: publisher || prev.editorial,
          categoria: categories || prev.categoria,
          imagen: image ? image.replace('http:', 'https:') : prev.imagen,
          url: prev.url || `https://www.google.com/search?q=isbn+${isbnClean}`,
        }));
      } else {
        setIsbnLookupError('No se encontraron datos automáticos para este ISBN. Puedes completarlo manualmente.');
      }
    } catch (err) {
      setIsbnLookupError('Error al consultar el servicio ISBN. Completa los datos manualmente.');
    } finally {
      setIsSearchingIsbn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo?.trim()) return;

    onSave({
      ...formData,
      isbn: formData.isbn || 'S/N',
      titulo: formData.titulo,
      editorial: formData.editorial || 'Sin Editorial',
      categoria: formData.categoria || 'Sin Categoría',
      imagen: formData.imagen || '',
      url: formData.url || '',
      estanteria: formData.estanteria || 'pieza',
      ubicacion: formData.ubicacion || 'Balda 1.',
      estado: (formData.estado as Book['estado']) || 'Disponible',
      fechaAgregado: formData.fechaAgregado || new Date().toISOString().split('T')[0],
    } as any);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {bookToEdit ? 'Editar Libro' : 'Agregar Nuevo Libro a la Librería'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* ISBN & Auto-fetch */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              ISBN (Código de barras)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: 9781639731763"
                value={formData.isbn || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={handleIsbnLookup}
                disabled={isSearchingIsbn}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
              >
                {isSearchingIsbn ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                )}
                <span>Auto-buscar</span>
              </button>
            </div>
            {isbnLookupError && (
              <p className="text-xs text-amber-700 mt-1">{isbnLookupError}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Título del Libro *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Throne of Glass box set (en Inglés) - Maas, Sarah J."
              value={formData.titulo || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Editorial & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Editorial
              </label>
              <input
                type="text"
                placeholder="Ej: Bloomsbury Publishing"
                value={formData.editorial || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, editorial: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categorías (separadas por coma)
              </label>
              <input
                type="text"
                placeholder="Ej: Aventura De Ficción, Fantasía Heroica, Fantasía Urbana"
                value={formData.categoria || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoria: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Puedes agregar múltiples categorías separadas por coma.
              </p>
            </div>
          </div>

          {/* Physical Location Fields: Estantería & Ubicación */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Ubicación Física en la Librería</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  Estantería / Room (Ej: pieza, Salón, Oficina)
                </label>
                <input
                  type="text"
                  placeholder="Ej: pieza"
                  list="estanterias-list"
                  value={formData.estanteria || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, estanteria: e.target.value }))}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-amber-950"
                />
                <datalist id="estanterias-list">
                  {existingEstanterias.map((est) => (
                    <option key={est} value={est} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  Ubicación Especifica / Balda (Ej: Balda 1., Repisa 3)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Balda 1."
                  list="ubicaciones-list"
                  value={formData.ubicacion || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ubicacion: e.target.value }))}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-amber-950"
                />
                <datalist id="ubicaciones-list">
                  {existingUbicaciones.map((ubi) => (
                    <option key={ubi} value={ubi} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Image URL & Product Link URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Imagen URL (Portada)
              </label>
              <input
                type="url"
                placeholder="https://images.cdn3.buscalibre.com/..."
                value={formData.imagen || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, imagen: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                URL Enlace Web (BuscaLibre/Tienda)
              </label>
              <input
                type="url"
                placeholder="https://www.buscalibre.cl/libro-..."
                value={formData.url || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Estado & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Estado
              </label>
              <select
                value={formData.estado || 'Disponible'}
                onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value as any }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Disponible">Disponible</option>
                <option value="Leído">Leído</option>
                <option value="Prestado">Prestado</option>
                <option value="Deseado">Deseado</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Notas adicionales
              </label>
              <input
                type="text"
                placeholder="Ej: Edición especial, prestado a amigo..."
                value={formData.notas || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, notas: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{bookToEdit ? 'Guardar Cambios' : 'Agregar Libro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
