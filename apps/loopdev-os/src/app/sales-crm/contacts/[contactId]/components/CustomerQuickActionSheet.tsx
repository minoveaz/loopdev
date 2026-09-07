'use client';

import Link from 'next/link';
import { ListTodo, Briefcase, PhoneCall, Mail, X, UserCheck } from 'lucide-react';

interface CustomerQuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  contactId: string;
  phone?: string | null;
  email?: string | null;
  onEditContact?: () => void;
}

export function CustomerQuickActionSheet({
  isOpen,
  onClose,
  name,
  contactId,
  phone,
  email,
  onEditContact,
}: CustomerQuickActionSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full bg-surface-light dark:bg-surface-dark border-t border-border-subtle rounded-t-2xl p-6 space-y-4 shadow-xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <span className="text-sm font-semibold text-text-main">Acción Rápida - {name}</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-main transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
            onClick={onClose}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-subtle bg-surface-muted/20 hover:border-primary/40 text-center transition-all"
          >
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <ListTodo className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-text-main">Nueva Tarea</span>
          </Link>
          <Link
            href={`/sales-crm/pipeline?newDeal=true&contactId=${contactId}`}
            onClick={onClose}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-subtle bg-surface-muted/20 hover:border-primary/40 text-center transition-all"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-text-main">Nuevo Trato</span>
          </Link>
          {onEditContact && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditContact();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-subtle bg-surface-muted/20 hover:border-primary/40 text-center transition-all"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-text-main">Editar Ficha</span>
            </button>
          )}
          {phone ? (
            <a
              href={`tel:${phone}`}
              onClick={onClose}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-subtle bg-surface-muted/20 hover:border-primary/40 text-center transition-all"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <PhoneCall className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-text-main">Llamar</span>
            </a>
          ) : null}
          {email ? (
            <a
              href={`mailto:${email}`}
              onClick={onClose}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-subtle bg-surface-muted/20 hover:border-primary/40 text-center transition-all"
            >
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-text-main">Enviar Email</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
