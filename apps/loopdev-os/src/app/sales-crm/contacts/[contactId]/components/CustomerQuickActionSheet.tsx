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
      className="backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-end bg-black/50 duration-200 lg:hidden"
      onClick={onClose}
    >
      <div
        className="bg-surface-light dark:bg-surface-dark border-border-subtle animate-in slide-in-from-bottom w-full space-y-4 rounded-t-2xl border-t p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border-subtle flex items-center justify-between border-b pb-2">
          <span className="text-text-main text-sm font-semibold">Acción Rápida - {name}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
            onClick={onClose}
            className="border-border-subtle bg-surface-muted/20 hover:border-primary/40 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all"
          >
            <div className="bg-primary/10 text-primary rounded-xl p-2.5">
              <ListTodo className="h-5 w-5" />
            </div>
            <span className="text-text-main text-xs font-medium">Nueva Tarea</span>
          </Link>
          <Link
            href={`/sales-crm/pipeline?newDeal=true&contactId=${contactId}`}
            onClick={onClose}
            className="border-border-subtle bg-surface-muted/20 hover:border-primary/40 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all"
          >
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-text-main text-xs font-medium">Nuevo Trato</span>
          </Link>
          {onEditContact && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditContact();
              }}
              className="border-border-subtle bg-surface-muted/20 hover:border-primary/40 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all"
            >
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <span className="text-text-main text-xs font-medium">Editar Ficha</span>
            </button>
          )}
          {phone ? (
            <a
              href={`tel:${phone}`}
              onClick={onClose}
              className="border-border-subtle bg-surface-muted/20 hover:border-primary/40 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all"
            >
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                <PhoneCall className="h-5 w-5" />
              </div>
              <span className="text-text-main text-xs font-medium">Llamar</span>
            </a>
          ) : null}
          {email ? (
            <a
              href={`mailto:${email}`}
              onClick={onClose}
              className="border-border-subtle bg-surface-muted/20 hover:border-primary/40 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all"
            >
              <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-text-main text-xs font-medium">Enviar Email</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
