import { useState, useEffect } from 'react';
import { toastStore } from './toastStore';

/**
 * @hook useToastStore
 * @description Hook de React para suscribirse al estado del ToastStore global.
 * Fuerza un re-renderizado solo cuando la lista de toasts cambia.
 */
export const useToastStore = () => {
  const [toasts, setToasts] = useState(toastStore.getToasts());

  useEffect(() => {
    // Cuando el store notifica un cambio, actualizamos el estado de React
    const unsubscribe = toastStore.subscribe(currentToasts => {
      setToasts([...currentToasts]); // Usar una nueva referencia de array para forzar el re-render
    });

    return () => unsubscribe();
  }, []);

  return { toasts };
};
