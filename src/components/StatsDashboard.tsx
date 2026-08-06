import React from 'react';
import { Book, FilterState } from '../types/book';
import { BookOpen, Layers, Tag, Building2, MapPin, AlertCircle, Filter, X } from 'lucide-react';

interface StatsDashboardProps {
  books: Book[];
  categories: string[];
  editorials: string[];
  estanterias: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  books,
  categories,
  editorials,
  estanterias,
  filters,
  setFilters,
}) => {
  const totalBooks = books.length;
  const booksWithLocation = books.filter((b) => b.estanteria && b.ubicacion).length;
  const booksWithoutCover = books.filter((b) => !b.imagen).length;

  const activeFilterCount =
    (filters.categoria ? 1 : 0) +
    (filters.editorial ? 1 : 0) +
    (filters.estanteria ? 1 : 0) +
    (filters.ubicacion ? 1 : 0) +
    (filters.estado ? 1 : 0);

  const clearAllFilters = () => {
    setFilters({
      query: '',
      categoria: '',
      editorial: '',
      estanteria: '',
      ubicacion: '',
      estado: '',
    });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Top Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Libros</p>
            <p className="text-lg font-bold text-slate-900">{totalBooks}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Estanterías</p>
            <p className="text-lg font-bold text-slate-900">{estanterias.length}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Categorías</p>
            <p className="text-lg font-bold text-slate-900">{categories.length}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Editoriales</p>
            <p className="text-lg font-bold text-slate-900">{editorials.length}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Con Ubicación</p>
            <p className="text-lg font-bold text-slate-900">
              {booksWithLocation} <span className="text-xs text-slate-400 font-normal">/ {totalBooks}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Filtros Rápidos</span>
            {activeFilterCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Filter by Category */}
            <select
              value={filters.categoria}
              onChange={(e) => setFilters((prev) => ({ ...prev, categoria: e.target.value }))}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Filter by Editorial */}
            <select
              value={filters.editorial}
              onChange={(e) => setFilters((prev) => ({ ...prev, editorial: e.target.value }))}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todas las Editoriales</option>
              {editorials.map((ed) => (
                <option key={ed} value={ed}>
                  {ed}
                </option>
              ))}
            </select>

            {/* Filter by Estantería */}
            <select
              value={filters.estanteria}
              onChange={(e) => setFilters((prev) => ({ ...prev, estanteria: e.target.value }))}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todas las Estanterías</option>
              {estanterias.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>

            {/* Filter by Estado */}
            <select
              value={filters.estado}
              onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todos los Estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Leído">Leído</option>
              <option value="Prestado">Prestado</option>
              <option value="Deseado">Deseado</option>
            </select>

            {/* Clear Filters */}
            {(activeFilterCount > 0 || filters.query) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
