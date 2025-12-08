import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'danger',
      ...opts,
    });
    setIsOpen(true);
    setIsLoading(false);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolver) {
      resolver(true);
    }
    setIsOpen(false);
    setIsLoading(false);
    setResolver(null);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    if (resolver) {
      resolver(false);
    }
    setIsOpen(false);
    setIsLoading(false);
    setResolver(null);
  }, [resolver]);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    confirm,
    isOpen,
    options,
    isLoading,
    handleConfirm,
    handleCancel,
    setLoadingState,
  };
}

