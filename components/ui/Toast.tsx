'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0 text-[rgb(var(--success))]" />,
    error: <XCircle className="w-5 h-5 shrink-0 text-[rgb(var(--danger))]" />,
    warning: <AlertCircle className="w-5 h-5 shrink-0 text-[rgb(var(--warning))]" />,
    info: <Info className="w-5 h-5 shrink-0 text-[rgb(var(--primary))]" />,
  };

  const leftBorder: Record<ToastType, string> = {
    success: 'border-l-[rgb(var(--success))]',
    error: 'border-l-[rgb(var(--danger))]',
    warning: 'border-l-[rgb(var(--warning))]',
    info: 'border-l-[rgb(var(--primary))]',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl',
              'bg-[rgb(var(--surface))] border border-[rgb(var(--border))] border-l-4',
              'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
              'animate-toast-in',
              leftBorder[toast.type]
            )}
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-[rgb(var(--text))] leading-snug">{toast.message}</p>
            <button
              onClick={() => remove(toast.id)}
              className="text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
