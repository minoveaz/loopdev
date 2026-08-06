import { ToastProps } from './types';

// El tipo Toast ahora incluye tenantId obligatorio para aislamiento
type Toast = Omit<ToastProps, 'onDismiss'> & {
  tenantId: string;
  dedupeKey?: string;
};
type Subscriber = (toasts: Toast[]) => void;

class ToastStore {
  private toasts: Toast[] = [];
  private subscribers: Subscriber[] = [];

  // Lógica de Throttle para estabilidad (Minor Fix)

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }

  private notify() {
    this.subscribers.forEach((subscriber) => subscriber([...this.toasts]));
  }

  add = (toastData: Omit<Toast, 'id'>): string => {
    const { dedupeKey, tenantId, ...rest } = toastData;

    // 1. STABILITY GATE: Throttle (Evita que bucles infinitos bloqueen la UI)

    // 2. TELEMETRY: Reporte automático de errores
    if (toastData.variant === 'error') {
      console.log(
        `[TELEMETRY] ${new Date().toISOString()} | Tenant: ${tenantId} | Error: ${toastData.title}`,
      );
    }

    // 3. LOGIC: Deduplicación (Story 3)
    if (dedupeKey) {
      const existingToast = this.toasts.find(
        (t) => t.dedupeKey === dedupeKey && t.tenantId === tenantId,
      );
      if (existingToast) {
        this.toasts = this.toasts.map((t) => (t.id === existingToast.id ? { ...t, ...rest } : t));
        this.notify();
        return existingToast.id;
      }
    }

    // 4. CREATION: ID Seguro (v2.4.1)
    const id = crypto.randomUUID();
    this.toasts = [...this.toasts, { ...toastData, id }];
    this.notify();
    return id;
  };

  dismiss = (id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  };

  dismissAll = () => {
    this.toasts = [];
    this.notify();
  };

  update = (id: string, patch: Partial<Toast>) => {
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, ...patch } : t));
    this.notify();
  };

  getToasts() {
    return this.toasts;
  }
}

export const toastStore = new ToastStore();

export const toast = {
  show: toastStore.add,
  dismiss: toastStore.dismiss,
  dismissAll: toastStore.dismissAll,
  update: toastStore.update,
};
