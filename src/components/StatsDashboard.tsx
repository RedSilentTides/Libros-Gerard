import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Book, FilterState } from '../types/book';
import { BookOpen, Layers, Tag, Building2, MapPin, Filter, X, ChevronDown, Check, Search, User } from 'lucide-react';

interface MultiSelectPopoverProps {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  getOptionCount?: (option: string) => number;
}

const MultiSelectPopover: React.FC<MultiSelectPopoverProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onChange,
  getOptionCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase().trim()));
  }, [options, searchTerm]);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const isAllSelected = options.length > 0 && selectedValues.length === options.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const activeCount = selectedValues.length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
          activeCount > 0
            ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold shadow-xs'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <span className={activeCount > 0 ? 'text-amber-700' : 'text-slate-500'}>{icon}</span>
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
            {activeCount}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-lg z-50 p-2.5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header actions */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
            <span>{label}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-amber-700 hover:underline font-semibold"
              >
                {isAllSelected ? 'Desmarcar todo' : 'Marcar todo'}
              </button>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-slate-400 hover:text-rose-600"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Search inside filter if list > 5 */}
          {options.length > 5 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={`Buscar ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {filteredOptions.length === 0 ? (
              <p className="text-slate-400 text-[11px] p-2 text-center">No se encontraron opciones</p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt);
                const count = getOptionCount ? getOptionCount(opt) : null;

                return (
                  <label
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/80 text-amber-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{opt}</span>
                    </div>

                    {count !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium shrink-0 ml-2 ${
                          isSelected ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatsDashboardProps {
  books: Book[];
  categories: string[];
  autores: string[];
  editorials: string[];
  estanterias: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  books,
  categories,
  autores,
  editorials,
  estanterias,
  filters,
  setFilters,
}) => {
  const totalBooks = books.length;
  const booksWithLocation = books.filter((b) => b.estanteria && b.ubicacion).length;

  const activeFilterCount =
    (filters.categorias ? filters.categorias.length : 0) +
    (filters.autores ? filters.autores.length : 0) +
    (filters.editoriales ? filters.editoriales.length : 0) +
    (filters.estanterias ? filters.estanterias.length : 0) +
    (filters.estados ? filters.estados.length : 0);

  const clearAllFilters = () => {
    setFilters({
      query: '',
      categorias: [],
      autores: [],
      editoriales: [],
      estanterias: [],
      estados: [],
    });
  };

  // Option count helpers
  const getCategoryCount = (cat: string) => {
    const target = cat.toLowerCase().trim();
    return books.filter((b) => {
      if (!b.categoria) return false;
      const cats = b.categoria.split(',').map((c) => c.toLowerCase().trim());
      return cats.includes(target) || b.categoria.toLowerCase().includes(target);
    }).length;
  };

  const getAutorCount = (aut: string) => {
    const target = aut.toLowerCase().trim();
    return books.filter((b) => {
      if (!b.autor) return false;
      const bookAutores = b.autor.split(',').map((a) => a.toLowerCase().trim());
      return bookAutores.includes(target) || b.autor.toLowerCase().includes(target);
    }).length;
  };

  const getEditorialCount = (ed: string) => {
    const target = ed.toLowerCase().trim();
    return books.filter((b) => b.editorial && b.editorial.toLowerCase().trim() === target).length;
  };

  const getEstanteriaCount = (est: string) => {
    const target = est.toLowerCase().trim();
    return books.filter((b) => b.estanteria && b.estanteria.toLowerCase().trim() === target).length;
  };

  const getEstadoCount = (est: string) => {
    return books.filter((b) => b.estado === est).length;
  };

  const removeCategoryFilter = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categorias: prev.categorias.filter((c) => c !== cat),
    }));
  };

  const removeAutorFilter = (aut: string) => {
    setFilters((prev) => ({
      ...prev,
      autores: prev.autores.filter((a) => a !== aut),
    }));
  };

  const removeEditorialFilter = (ed: string) => {
    setFilters((prev) => ({
      ...prev,
      editoriales: prev.editoriales.filter((e) => e !== ed),
    }));
  };

  const removeEstanteriaFilter = (est: string) => {
    setFilters((prev) => ({
      ...prev,
      estanterias: prev.estanterias.filter((e) => e !== est),
    }));
  };

  const removeEstadoFilter = (est: string) => {
    setFilters((prev) => ({
      ...prev,
      estados: prev.estados.filter((e) => e !== est),
    }));
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

      {/* Multi-Select Filter Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Filtros Múltiples</span>
            {activeFilterCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activeFilterCount} activo{activeFilterCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Categorías */}
            <MultiSelectPopover
              label="Categorías"
              icon={<Tag className="w-3.5 h-3.5" />}
              options={categories}
              selectedValues={filters.categorias || []}
              onChange={(newVals) => setFilters((prev) => ({ ...prev, categorias: newVals }))}
              getOptionCount={getCategoryCount}
            />

            {/* Autores */}
            <MultiSelectPopover
              label="Autores"
              icon={<User className="w-3.5 h-3.5" />}
              options={autores}
              selectedValues={filters.autores || []}
              onChange={(newVals) => setFilters((prev) => ({ ...prev, autores: newVals }))}
              getOptionCount={getAutorCount}
            />

            {/* Editoriales */}
            <MultiSelectPopover
              label="Editoriales"
              icon={<Building2 className="w-3.5 h-3.5" />}
              options={editorials}
              selectedValues={filters.editoriales || []}
              onChange={(newVals) => setFilters((prev) => ({ ...prev, editoriales: newVals }))}
              getOptionCount={getEditorialCount}
            />

            {/* Estanterías */}
            <MultiSelectPopover
              label="Estanterías"
              icon={<Layers className="w-3.5 h-3.5" />}
              options={estanterias}
              selectedValues={filters.estanterias || []}
              onChange={(newVals) => setFilters((prev) => ({ ...prev, estanterias: newVals }))}
              getOptionCount={getEstanteriaCount}
            />

            {/* Estados */}
            <MultiSelectPopover
              label="Estado"
              icon={<BookOpen className="w-3.5 h-3.5" />}
              options={['Disponible', 'Leído', 'Prestado', 'Deseado']}
              selectedValues={filters.estados || []}
              onChange={(newVals) => setFilters((prev) => ({ ...prev, estados: newVals }))}
              getOptionCount={getEstadoCount}
            />

            {/* Clear All Filters Button */}
            {(activeFilterCount > 0 || filters.query) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar todos</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips / Badges Bar */}
        {(activeFilterCount > 0 || filters.query) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Filtros activos:</span>

            {/* Query Tag */}
            {filters.query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200 font-medium">
                <span>Búsqueda: &quot;{filters.query}&quot;</span>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, query: '' }))}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Category Tags */}
            {filters.categorias?.map((cat) => (
              <span
                key={`cat-${cat}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-medium"
              >
                <Tag className="w-3 h-3 text-amber-600" />
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => removeCategoryFilter(cat)}
                  className="hover:text-rose-600 text-amber-700 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Autor Tags */}
            {filters.autores?.map((aut) => (
              <span
                key={`aut-${aut}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-900 rounded-md border border-purple-200 font-medium"
              >
                <User className="w-3 h-3 text-purple-600" />
                <span>{aut}</span>
                <button
                  type="button"
                  onClick={() => removeAutorFilter(aut)}
                  className="hover:text-rose-600 text-purple-700 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Editorial Tags */}
            {filters.editoriales?.map((ed) => (
              <span
                key={`ed-${ed}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 rounded-md border border-blue-200 font-medium"
              >
                <Building2 className="w-3 h-3 text-blue-600" />
                <span>{ed}</span>
                <button
                  type="button"
                  onClick={() => removeEditorialFilter(ed)}
                  className="hover:text-rose-600 text-blue-700 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Estanteria Tags */}
            {filters.estanterias?.map((est) => (
              <span
                key={`est-${est}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-900 rounded-md border border-indigo-200 font-medium"
              >
                <Layers className="w-3 h-3 text-indigo-600" />
                <span>{est}</span>
                <button
                  type="button"
                  onClick={() => removeEstanteriaFilter(est)}
                  className="hover:text-rose-600 text-indigo-700 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Estado Tags */}
            {filters.estados?.map((est) => (
              <span
                key={`estado-${est}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-md border border-emerald-200 font-medium"
              >
                <span>Estado: {est}</span>
                <button
                  type="button"
                  onClick={() => removeEstadoFilter(est)}
                  className="hover:text-rose-600 text-emerald-700 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

