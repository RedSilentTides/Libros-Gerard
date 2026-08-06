import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck, AlertCircle, X, Check } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminPin: string | null;
  setAdminPin: (pin: string | null) => void;
  isAdmin: boolean;
  setIsAdmin: (status: boolean) => void;
  onAuthenticatedSuccess?: () => void;
  showToast: (msg: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  adminPin,
  setAdminPin,
  isAdmin,
  setIsAdmin,
  onAuthenticatedSuccess,
  showToast,
}) => {
  const [inputPin, setInputPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If no PIN exists yet, prompt to create one
    if (!adminPin) {
      if (!newPin || newPin.length < 4) {
        setError('El PIN debe tener al menos 4 dígitos o caracteres.');
        return;
      }
      if (newPin !== confirmPin) {
        setError('Los PIN ingresados no coinciden.');
        return;
      }
      setAdminPin(newPin);
      setIsAdmin(true);
      showToast('¡PIN de Administrador creado y sesión iniciada!');
      if (onAuthenticatedSuccess) onAuthenticatedSuccess();
      onClose();
      return;
    }

    // Verify existing PIN
    if (inputPin === adminPin) {
      setIsAdmin(true);
      showToast('¡Modo Administrador activado!');
      if (onAuthenticatedSuccess) onAuthenticatedSuccess();
      onClose();
    } else {
      setError('PIN incorrecto. Inténtalo de nuevo.');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputPin !== adminPin) {
      setError('El PIN actual no es correcto.');
      return;
    }
    if (!newPin || newPin.length < 4) {
      setError('El nuevo PIN debe tener al menos 4 dígitos.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('Los nuevos PIN no coinciden.');
      return;
    }

    setAdminPin(newPin);
    showToast('¡PIN de Administrador cambiado con éxito!');
    setIsChangingPin(false);
    setInputPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    showToast('Sesión de Administrador cerrada. Modo Lectura activo.');
    onClose();
  };

  const handleRemovePin = () => {
    if (window.confirm('¿Deseas quitar la protección por PIN? Cualquier visitante podrá modificar el catálogo local.')) {
      setAdminPin(null);
      setIsAdmin(false);
      showToast('Protección por PIN eliminada.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isAdmin ? 'Modo Administrador Activo' : 'Acceso Restringido'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAdmin
                  ? 'Tienes permisos para editar e importar'
                  : 'Ingresa tu PIN para modificar la librería'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Already Logged In Admin View */}
          {isAdmin && !isChangingPin && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <p className="font-bold text-sm flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Sesión desbloqueada
                </p>
                <p className="mt-1 text-emerald-700 leading-relaxed">
                  Puedes importar planillas Excel, agregar nuevos libros, modificar la información y eliminar registros.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock className="w-4 h-4" />
                  <span>Bloquear / Cerrar Sesión de Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(true);
                    setError(null);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Cambiar PIN de Administrador</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePin}
                  className="w-full py-2 text-rose-600 hover:text-rose-700 text-xs font-medium text-center hover:underline"
                >
                  Desactivar protección por PIN
                </button>
              </div>
            </div>
          )}

          {/* Form to Change PIN when logged in */}
          {isAdmin && isChangingPin && (
            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cambiar PIN</h4>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">PIN Actual</label>
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nuevo PIN</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirmar Nuevo PIN</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Repite el nuevo PIN"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 shadow-xs"
                >
                  Guardar Nuevo PIN
                </button>
              </div>
            </form>
          )}

          {/* Form to Set Initial PIN (first time) */}
          {!isAdmin && !adminPin && (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-amber-600" />
                  Configura tu contraseña de Administrador
                </p>
                <p className="mt-1 text-amber-800">
                  Crea un PIN personal para proteger las funciones de edición e importación Excel en este sitio.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Crear nuevo PIN (Ejemplo: 1234)</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Escribe tu clave aquí"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirmar PIN</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Repite tu clave"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 shadow-xs"
                >
                  Crear PIN e Iniciar Sesión
                </button>
              </div>
            </form>
          )}

          {/* Form to Unlock Existing PIN */}
          {!isAdmin && adminPin && (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">PIN de Administrador</label>
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="Ingresa tu clave de acceso"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 shadow-xs flex items-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Desbloquear</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
