import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ToastManager from '../components/Toast';

// Define toast type
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Define the shape of a toast notification
export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

// Define the context interface
interface ToastContextType {
  showToast: (message: string, type: ToastType, title?: string) => void;
  hideToast: (id: string) => void;
}

// Create the context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Create a provider component
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, title?: string) => {
    const id = uuidv4();
    const newToast: Toast = {
      id,
      message,
      type,
      title
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto-remove toast after 2.3 seconds (2 seconds + 0.3s for animation)
    setTimeout(() => {
      hideToast(id);
    }, 2300);
    
    return id;
  };

  const hideToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastManager toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

// Create a custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext; 