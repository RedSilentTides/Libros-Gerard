import React from 'react';
import { Book } from '../types/book';
import { exportBooksToExcel } from '../utils/excelHandler';
import { Download, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, books }) => {
  if (!isOpen) return null;

  const handleExport = (ext: 'xlsx' | 'csv') => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `libreria_catalogo_${dateStr}.${ext}`;
    exportBooksToExcel(books, filename);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <Download className="w-5 h-5 text-amber-600" />
            <span>Exportar Catálogo a Excel</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <p className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>{books.length} libros listos para exportación</span>
            </p>
            <p className="text-amber-800">
              El archivo descargado contendrá las columnas exactas requeridas:
            </p>
            <p className="font-mono text-[11px] bg-white/70 p-2 rounded border border-amber-300 text-amber-900 font-medium">
              ISBN, Título, Editorial, Categoría, Imagen, URL, Estantería, Ubicación, Estado, Notas
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleExport('xlsx')}
              className="w-full flex items-center justify-between px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
                <div className="text-left">
                  <p className="text-sm">Descargar Excel (.xlsx)</p>
                  <p className="text-[10px] text-emerald-100 font-normal">
                    Formato estándar de Microsoft Excel con formato y anchos de columna
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors text-xs"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
