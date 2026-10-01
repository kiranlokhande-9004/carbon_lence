import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        let border = 'border-emerald-200 bg-white';
        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
          border = 'border-rose-200 bg-white';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />;
          border = 'border-sky-200 bg-white';
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 ${border}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium text-slate-800">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
