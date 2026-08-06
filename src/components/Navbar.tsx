import React from 'react';
import { BookOpen, FileSpreadsheet, Download, Plus, Search, Layers, Grid, Table as TableIcon, Bookmark, RefreshCw } from 'lucide-react';
import { ViewMode, FilterState } from '../types/book';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenAddBook: () => void;
  onDownloadTemplate: () => void;
  onResetData: () => void;
  totalBooks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  filters,
  setFilters,
  onOpenImport,
  onOpenExport,
  onOpenAddBook,
  onDownloadTemplate,
  onResetData,
  totalBooks,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Brand & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm ring-4 ring-amber-50">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none flex items-center gap-2">
                  Librería Digital
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {totalBooks} {totalBooks === 1 ? 'libro' : 'libros'}
                  </span>
                </h1>
                <p className="text-xs text-slate-5 font-medium mt-1 text-slate-500">
                  Catálogo online con estanterías y sincronización Excel
                </p>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('shelf')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'shelf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-0 md:mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, ISBN, editorial, categoría, estantería..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, query: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            
            {/* View Switcher Desktop */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista en cuadrícula"
              >
                <Grid className="w-3.5 h-3.5" />
                Cuadrícula
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista en tabla de datos"
              >
                <TableIcon className="w-3.5 h-3.5" />
                Tabla
              </button>
              <button
                onClick={() => setViewMode('shelf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'shelf'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista por Estanterías y Baldas"
              >
                <Layers className="w-3.5 h-3.5" />
                Estanterías
              </button>
            </div>

            {/* Excel Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenImport}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                title="Importar catálogo desde archivo Excel (.xlsx / .csv)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Importar Excel</span>
              </button>

              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
                title="Exportar libros a Excel"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>

            {/* Add Book */}
            <button
              onClick={onOpenAddBook}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Libro</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
