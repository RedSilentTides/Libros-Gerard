import React, { useState, useRef } from 'react';
import { Book } from '../types/book';
import { parseExcelFile, downloadSampleExcelTemplate } from '../utils/excelHandler';
import { FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, RefreshCw, X, ArrowRight, Layers } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedBooks: Book[], mode: 'upsert' | 'replace' | 'append') => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedBooks, setParsedBooks] = useState<Book[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'upsert' | 'replace' | 'append'>('upsert');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsParsing(true);
    setErrorMsg(null);

    try {
      const books = await parseExcelFile(selectedFile);
      if (books.length === 0) {
        setErrorMsg('El archivo no contiene filas de libros válidas o no coincide con los nombres de columnas.');
      } else {
        setParsedBooks(books);
      }
    } catch (err: any) {
      setErrorMsg(`Error al leer el archivo Excel: ${err.message || 'Formato no soportado'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedBooks.length === 0) return;
    onImportSuccess(parsedBooks, importMode);
    onClose();
    // Reset state
    setFile(null);
    setParsedBooks([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Importar Catálogo de Libros (Excel)</h2>
              <p className="text-xs text-emerald-200/80">
                Formatos compatibles: .xlsx, .xls, .csv
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Format Instruction & Sample Download */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-emerald-950">Columnas recomendadas en tu Excel:</p>
              <p className="font-mono text-emerald-800 bg-white/60 px-2 py-1 rounded border border-emerald-200">
                ISBN | Título | Editorial | Categoría | Imagen URL | URL | Estantería | Ubicación
              </p>
            </div>
            <button
              onClick={downloadSampleExcelTemplate}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shrink-0 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Plantilla Excel</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {!file && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 p-8 rounded-2xl text-center cursor-pointer transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls, .csv"
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">
                Haz clic o arrastra tu archivo Excel (.xlsx / .csv) aquí
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Soporta tu formato con columnas: ISBN, Título, Editorial, Categoría, Imagen, URL, Estantería, Ubicación.
              </p>
            </div>
          )}

          {/* Parsing Spinner */}
          {isParsing && (
            <div className="p-8 text-center text-slate-600 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
              <p className="font-semibold text-sm">Leyendo y procesando archivo Excel...</p>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table & Import Mode */}
          {parsedBooks.length > 0 && !isParsing && (
            <div className="space-y-4">
              
              {/* Summary header */}
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Se detectaron {parsedBooks.length} libros en el archivo:</span>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedBooks([]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Cambiar archivo
                </button>
              </div>

              {/* Mode Selection */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2 text-xs">
                <label className="font-bold text-amber-950 block uppercase tracking-wider">
                  Acción al importar en tu librería:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                      importMode === 'upsert'
                        ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 font-bold text-slate-900'
                        : 'bg-white/60 border-amber-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'upsert'}
                        onChange={() => setImportMode('upsert')}
                        className="text-amber-600"
                      />
                      <span>Actualizar / Fusión (Recomendado)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal mt-1">
                      Actualiza libros existentes si coincide el ISBN y agrega los nuevos.
                    </span>
                  </label>

                  <label
                    className={`p-2.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                      importMode === 'replace'
                        ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 font-bold text-slate-900'
                        : 'bg-white/60 border-amber-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-amber-600"
                      />
                      <span>Reemplazar todo</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal mt-1">
                      Borra el catálogo actual y lo sustituye por este archivo Excel.
                    </span>
                  </label>

                  <label
                    className={`p-2.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                      importMode === 'append'
                        ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 font-bold text-slate-900'
                        : 'bg-white/60 border-amber-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="text-amber-600"
                      />
                      <span>Solo agregar nuevos</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal mt-1">
                      Conserva los actuales y agrega solo ISBNs no registrados.
                    </span>
                  </label>
                </div>
              </div>

              {/* Preview table */}
              <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 sticky top-0 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-3">ISBN</th>
                      <th className="py-2 px-3">Título</th>
                      <th className="py-2 px-3">Editorial</th>
                      <th className="py-2 px-3">Estantería</th>
                      <th className="py-2 px-3">Ubicación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedBooks.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-600">{b.isbn}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 truncate max-w-xs">{b.titulo}</td>
                        <td className="py-2 px-3 text-slate-700">{b.editorial}</td>
                        <td className="py-2 px-3 text-amber-800 font-semibold">{b.estanteria}</td>
                        <td className="py-2 px-3 text-amber-700">{b.ubicacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>

          {parsedBooks.length > 0 && (
            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <span>Confirmar e Importar {parsedBooks.length} libros</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
