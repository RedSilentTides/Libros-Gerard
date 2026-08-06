import React, { useState, useEffect, useMemo } from 'react';
import { Book, ViewMode, FilterState } from './types/book';
import { INITIAL_BOOKS } from './utils/sampleData';
import { downloadSampleExcelTemplate, fetchRepoExcelFile } from './utils/excelHandler';
import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { BookCard } from './components/BookCard';
import { BookTable } from './components/BookTable';
import { ShelfView } from './components/ShelfView';
import { BookDetailModal } from './components/BookDetailModal';
import { BookFormModal } from './components/BookFormModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { ExportModal } from './components/ExportModal';
import { AdminModal } from './components/AdminModal';
import { RefreshCw, BookOpen, Plus, FileSpreadsheet, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'digital_library_books_v1';
const PIN_STORAGE_KEY = 'digital_library_admin_pin';

export default function App() {
  const [adminPin, setAdminPinState] = useState<string | null>(() => {
    return localStorage.getItem(PIN_STORAGE_KEY);
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const savedPin = localStorage.getItem(PIN_STORAGE_KEY);
    // If no PIN is configured yet, default to admin until user sets a PIN
    return !savedPin;
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const setAdminPin = (pin: string | null) => {
    setAdminPinState(pin);
    if (pin) {
      localStorage.setItem(PIN_STORAGE_KEY, pin);
    } else {
      localStorage.removeItem(PIN_STORAGE_KEY);
    }
  };

  const requireAdmin = (action: () => void) => {
    if (isAdmin || !adminPin) {
      action();
    } else {
      setPendingAction(() => action);
      setIsAdminModalOpen(true);
    }
  };
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

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    categoria: '',
    editorial: '',
    estanteria: '',
    ubicacion: '',
    estado: '',
  });

  // Toast feedback state
  const [toast, setToast] = useState<string | null>(null);
  const [isSyncingRepo, setIsSyncingRepo] = useState(false);
  const [isRepoExcelActive, setIsRepoExcelActive] = useState(false);

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
        setIsRepoExcelActive(true);
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
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
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

      if (filters.categoria) {
        const targetCat = filters.categoria.toLowerCase().trim();
        const bookCats = b.categoria ? b.categoria.split(',').map((c) => c.toLowerCase().trim()) : [];
        if (!bookCats.includes(targetCat) && !b.categoria.toLowerCase().includes(targetCat)) {
          return false;
        }
      }
      if (filters.editorial && b.editorial.toLowerCase() !== filters.editorial.toLowerCase()) {
        return false;
      }
      if (filters.estanteria && b.estanteria.toLowerCase() !== filters.estanteria.toLowerCase()) {
        return false;
      }
      if (filters.ubicacion && b.ubicacion.toLowerCase() !== filters.ubicacion.toLowerCase()) {
        return false;
      }
      if (filters.estado && b.estado !== filters.estado) {
        return false;
      }

      return true;
    });
  }, [books, filters]);

  // Book Handlers
  const handleSaveBook = (bookData: Omit<Book, 'id'> | Book) => {
    if ('id' in bookData && bookData.id) {
      // Update existing
      setBooks((prev) =>
        prev.map((b) => (b.id === bookData.id ? (bookData as Book) : b))
      );
      showToast('¡Libro actualizado correctamente!');
    } else {
      // Add new
      const newBook: Book = {
        ...bookData,
        id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      } as Book;
      setBooks((prev) => [newBook, ...prev]);
      showToast('¡Libro agregado al catálogo!');
    }
  };

  const handleDeleteBook = (id: string) => {
    requireAdmin(() => {
      if (window.confirm('¿Estás seguro de que deseas eliminar este libro de la librería?')) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        if (selectedBook?.id === id) setSelectedBook(null);
        showToast('Libro eliminado del catálogo.');
      }
    });
  };

  const handleImportSuccess = (importedBooks: Book[], mode: 'upsert' | 'replace' | 'append') => {
    if (mode === 'replace') {
      setBooks(importedBooks);
      showToast(`Catálogo reemplazado con ${importedBooks.length} libros del Excel.`);
    } else if (mode === 'append') {
      const existingIsbns = new Set(books.map((b) => b.isbn.trim().toLowerCase()));
      const newOnly = importedBooks.filter(
        (b) => !existingIsbns.has(b.isbn.trim().toLowerCase())
      );
      setBooks((prev) => [...prev, ...newOnly]);
      showToast(`Se agregaron ${newOnly.length} libros nuevos sin duplicar.`);
    } else {
      // Upsert mode (default & requested)
      setBooks((prev) => {
        const bookMap = new Map<string, Book>();
        // Add current books
        prev.forEach((b) => {
          const key = b.isbn ? b.isbn.trim().toLowerCase() : b.id;
          bookMap.set(key, b);
        });
        // Merge imported books
        importedBooks.forEach((imp) => {
          const key = imp.isbn ? imp.isbn.trim().toLowerCase() : imp.id;
          if (bookMap.has(key) && key !== '' && !key.startsWith('s/n')) {
            const current = bookMap.get(key)!;
            bookMap.set(key, {
              ...current,
              titulo: imp.titulo || current.titulo,
              editorial: imp.editorial || current.editorial,
              categoria: imp.categoria || current.categoria,
              imagen: imp.imagen || current.imagen,
              url: imp.url || current.url,
              estanteria: imp.estanteria || current.estanteria,
              ubicacion: imp.ubicacion || current.ubicacion,
              estado: imp.estado || current.estado,
              notas: imp.notas || current.notas,
            });
          } else {
            bookMap.set(imp.id, imp);
          }
        });
        return Array.from(bookMap.values());
      });
      showToast(`Librería actualizada mediante fusión Excel (${importedBooks.length} procesados).`);
    }
  };

  const handleResetDemoData = () => {
    requireAdmin(() => {
      if (window.confirm('¿Restablecer catálogo con los datos de demostración iniciales?')) {
        setBooks(INITIAL_BOOKS);
        showToast('Catálogo restablecido con los datos de demo.');
      }
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
        onOpenAddBook={() => {
          requireAdmin(() => {
            setBookToEdit(null);
            setIsFormOpen(true);
          });
        }}
        onDownloadTemplate={downloadSampleExcelTemplate}
        onResetData={handleResetDemoData}
        totalBooks={books.length}
        isAdmin={isAdmin}
        hasAdminPin={Boolean(adminPin)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onSyncRepoExcel={() => handleSyncFromRepoExcel(true)}
        isSyncingRepo={isSyncingRepo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Repo Source Notice Banner */}
        <div className="mb-6 p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <span>Fuente oficial: public/libreria.xlsx en GitHub</span>
                {isRepoExcelActive && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-semibold border border-emerald-200">
                    Sincronizado
                  </span>
                )}
              </p>
              <p className="text-xs text-indigo-800/90 mt-0.5 leading-relaxed">
                El catálogo que ven todos los visitantes se carga directamente desde el archivo <strong>libreria.xlsx</strong> alojado en tu repositorio. Para cambiar o agregar libros permanentemente en la web, actualiza ese archivo Excel en GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSyncFromRepoExcel(true)}
            disabled={isSyncingRepo}
            className="self-end md:self-auto px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRepo ? 'animate-spin' : ''}`} />
            <span>Recargar Excel</span>
          </button>
        </div>

        {/* Statistics & Filter Bar */}
        <StatsDashboard
          books={books}
          categories={categories}
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
                {filters.query || filters.categoria || filters.estanteria
                  ? 'Intenta borrar algunos filtros de búsqueda para ver más resultados.'
                  : 'Tu librería está vacía. ¡Recarga el catálogo desde public/libreria.xlsx en el repositorio o agrega tu primer libro!'}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => handleSyncFromRepoExcel(true)}
                disabled={isSyncingRepo}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingRepo ? 'animate-spin' : ''}`} />
                <span>Recargar Repo Excel</span>
              </button>
              <button
                onClick={() => {
                  setBookToEdit(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Libro</span>
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
                    onEditBook={(b) => {
                      requireAdmin(() => {
                        setBookToEdit(b);
                        setIsFormOpen(true);
                      });
                    }}
                    onDeleteBook={handleDeleteBook}
                  />
                ))}
              </div>
            )}

            {viewMode === 'table' && (
              <BookTable
                books={filteredBooks}
                onSelectBook={(b) => setSelectedBook(b)}
                onEditBook={(b) => {
                  requireAdmin(() => {
                    setBookToEdit(b);
                    setIsFormOpen(true);
                  });
                }}
                onDeleteBook={handleDeleteBook}
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
          <p>Librería Digital • Gestión de Catálogo y Estanterías</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadSampleExcelTemplate}
              className="hover:text-amber-700 underline"
            >
              Descargar Plantilla Excel
            </button>
            <button
              onClick={handleResetDemoData}
              className="hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reestablecer Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onEdit={(b) => {
          requireAdmin(() => {
            setBookToEdit(b);
            setIsFormOpen(true);
          });
        }}
      />

      <BookFormModal
        isOpen={isFormOpen}
        bookToEdit={bookToEdit}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBook}
        existingEstanterias={estanterias}
        existingUbicaciones={ubicaciones}
      />

      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        books={books}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminPin={adminPin}
        setAdminPin={setAdminPin}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        showToast={showToast}
        onAuthenticatedSuccess={() => {
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
      />
    </div>
  );
}
