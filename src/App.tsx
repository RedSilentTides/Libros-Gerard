import React, { useState, useEffect, useMemo } from 'react';
import { Book, ViewMode, FilterState } from './types/book';
import { INITIAL_BOOKS } from './utils/sampleData';
import { fetchRepoExcelFile } from './utils/excelHandler';
import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { BookCard } from './components/BookCard';
import { BookTable } from './components/BookTable';
import { ShelfView } from './components/ShelfView';
import { BookDetailModal } from './components/BookDetailModal';
import { ExportModal } from './components/ExportModal';
import { BookOpen, RefreshCw, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'digital_library_books_v1';

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading library from local storage:', e);
    }
    return INITIAL_BOOKS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 'table';
    }
    return 'grid';
  });

  const [filters, setFilters] = useState<FilterState>({
    query: '',
    categorias: [],
    autores: [],
    editoriales: [],
    estanterias: [],
    estados: [],
  });

  // Toast feedback state
  const [toast, setToast] = useState<string | null>(null);
  const [isSyncingRepo, setIsSyncingRepo] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSyncFromRepoExcel = async (showNotification = false) => {
    setIsSyncingRepo(true);
    try {
      const repoBooks = await fetchRepoExcelFile();
      if (repoBooks && repoBooks.length > 0) {
        setBooks(repoBooks);
        if (showNotification) {
          showToast(`Catálogo cargado desde public/libreria.xlsx (${repoBooks.length} libros)`);
        }
      }
    } catch (err) {
      console.warn('Could not fetch public/libreria.xlsx:', err);
      if (showNotification) {
        showToast('No se encontró public/libreria.xlsx en el repositorio.');
      }
    } finally {
      setIsSyncingRepo(false);
    }
  };

  useEffect(() => {
    handleSyncFromRepoExcel(false);
  }, []);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Error saving library to local storage:', e);
    }
  }, [books]);

  // Derived filter options
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.categoria) {
        b.categoria.split(',').forEach((c) => set.add(c.trim()));
      }
    });
    return Array.from(set).sort();
  }, [books]);

  const autores = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.autor) {
        b.autor.split(',').forEach((a) => {
          const trimmed = a.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set).sort();
  }, [books]);

  const editorials = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.editorial) set.add(b.editorial);
    });
    return Array.from(set).sort();
  }, [books]);

  const estanterias = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.estanteria) set.add(b.estanteria);
    });
    return Array.from(set).sort();
  }, [books]);

  const ubicaciones = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.ubicacion) set.add(b.ubicacion);
    });
    return Array.from(set).sort();
  }, [books]);

  // Filtered books list
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Search query filter
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        const matchesQuery =
          b.titulo.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          (b.autor && b.autor.toLowerCase().includes(q)) ||
          b.editorial.toLowerCase().includes(q) ||
          b.categoria.toLowerCase().includes(q) ||
          b.estanteria.toLowerCase().includes(q) ||
          b.ubicacion.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (filters.categorias && filters.categorias.length > 0) {
        const bookCats = b.categoria ? b.categoria.split(',').map((c) => c.toLowerCase().trim()) : [];
        const matchesCategory = filters.categorias.some((selectedCat) => {
          const sc = selectedCat.toLowerCase().trim();
          return bookCats.includes(sc) || (b.categoria && b.categoria.toLowerCase().includes(sc));
        });
        if (!matchesCategory) return false;
      }

      if (filters.autores && filters.autores.length > 0) {
        const matchesAutor = filters.autores.some((selAutor) => {
          if (!b.autor) return false;
          const bookAutores = b.autor.split(',').map((a) => a.toLowerCase().trim());
          const target = selAutor.toLowerCase().trim();
          return bookAutores.includes(target) || b.autor.toLowerCase().includes(target);
        });
        if (!matchesAutor) return false;
      }

      if (filters.editoriales && filters.editoriales.length > 0) {
        const matchesEditorial = filters.editoriales.some(
          (ed) => b.editorial && b.editorial.toLowerCase().trim() === ed.toLowerCase().trim()
        );
        if (!matchesEditorial) return false;
      }

      if (filters.estanterias && filters.estanterias.length > 0) {
        const matchesEstanteria = filters.estanterias.some(
          (est) => b.estanteria && b.estanteria.toLowerCase().trim() === est.toLowerCase().trim()
        );
        if (!matchesEstanteria) return false;
      }

      if (filters.estados && filters.estados.length > 0) {
        const matchesEstado = filters.estados.some((est) => b.estado === est);
        if (!matchesEstado) return false;
      }

      return true;
    });
  }, [books, filters]);

  const handleToggleCategory = (cat: string) => {
    setFilters((prev) => {
      const current = prev.categorias || [];
      const exists = current.includes(cat);
      return {
        ...prev,
        categorias: exists ? current.filter((c) => c !== cat) : [...current, cat],
      };
    });
  };

  const handleToggleAutor = (autor: string) => {
    setFilters((prev) => {
      const current = prev.autores || [];
      const exists = current.includes(autor);
      return {
        ...prev,
        autores: exists ? current.filter((a) => a !== autor) : [...current, autor],
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        filters={filters}
        setFilters={setFilters}
        onOpenExport={() => setIsExportOpen(true)}
        totalBooks={books.length}
        onSyncRepoExcel={() => handleSyncFromRepoExcel(true)}
        isSyncingRepo={isSyncingRepo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics & Filter Bar */}
        <StatsDashboard
          books={books}
          categories={categories}
          autores={autores}
          editorials={editorials}
          estanterias={estanterias}
          filters={filters}
          setFilters={setFilters}
        />

        {/* View Layout Render */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs max-w-md mx-auto my-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">No se encontraron libros</h3>
              <p className="text-xs text-slate-500 mt-1">
                {filters.query || filters.categorias.length > 0 || filters.autores.length > 0 || filters.editoriales.length > 0 || filters.estanterias.length > 0 || filters.estados.length > 0
                  ? 'Intenta borrar algunos filtros de búsqueda para ver más resultados.'
                  : 'No hay libros disponibles en el catálogo.'}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => handleSyncFromRepoExcel(true)}
                disabled={isSyncingRepo}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingRepo ? 'animate-spin' : ''}`} />
                <span>Recargar Excel</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelectBook={(b) => setSelectedBook(b)}
                    onToggleCategory={handleToggleCategory}
                    onToggleAutor={handleToggleAutor}
                  />
                ))}
              </div>
            )}

            {viewMode === 'table' && (
              <BookTable
                books={filteredBooks}
                onSelectBook={(b) => setSelectedBook(b)}
                onToggleCategory={handleToggleCategory}
                onToggleAutor={handleToggleAutor}
              />
            )}

            {viewMode === 'shelf' && (
              <ShelfView
                books={filteredBooks}
                onSelectBook={(b) => setSelectedBook(b)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>Librería Gerard • Catálogo de Libros y Estanterías</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSyncFromRepoExcel(true)}
              className="hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Sincronizar Catálogo
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        books={books}
      />
    </div>
  );
}
