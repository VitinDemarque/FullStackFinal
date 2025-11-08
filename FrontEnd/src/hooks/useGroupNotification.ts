import { useState, useCallback } from 'react';
import { GroupNotificationProps } from '../components/Groups/GroupNotification';

export interface NotificationState extends GroupNotificationProps {
  id: number;
}

let notificationId = 0;

export function useGroupNotification() {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const showNotification = useCallback((props: GroupNotificationProps) => {
    const id = notificationId++;
    const notification: NotificationState = { ...props, id };
    
    setNotifications(prev => [...prev, notification]);
    
    return id;
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    return showNotification({ variant: 'success', title, message });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string) => {
    return showNotification({ variant: 'error', title, message });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    return showNotification({ variant: 'info', title, message });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    return showNotification({ variant: 'warning', title, message });
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
}

