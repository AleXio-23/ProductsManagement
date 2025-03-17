import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Define animation keyframes
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Define container for all toasts
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// Define toast type styles
interface ToastWrapperProps {
  type: 'success' | 'error' | 'info' | 'warning';
  isExiting: boolean;
}

const getBackgroundColor = (type: string) => {
  switch (type) {
    case 'success':
      return '#4caf50'; // Green
    case 'error':
      return '#f44336'; // Red
    case 'warning':
      return '#ff9800'; // Orange
    case 'info':
      return '#2196f3'; // Blue
    default:
      return '#2196f3'; // Default blue
  }
};

const ToastWrapper = styled.div<ToastWrapperProps>`
  min-width: 250px;
  margin-bottom: 10px;
  padding: 15px 20px;
  border-radius: 4px;
  background-color: ${props => getBackgroundColor(props.type)};
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out;
`;

const ToastMessage = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, title, message, type, duration = 2000, onClose }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      
      // Add a slight delay to allow the exit animation to play
      const exitTimer = setTimeout(() => {
        onClose(id);
      }, 300);
      
      return () => clearTimeout(exitTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <ToastWrapper type={type} isExiting={isExiting}>
      <ToastMessage>
        {title && <ToastTitle>{title}</ToastTitle>}
        <div>{message}</div>
      </ToastMessage>
    </ToastWrapper>
  );
};

interface ToastManagerProps {
  toasts: Array<{
    id: string;
    title?: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
  onClose: (id: string) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onClose }) => {
  return (
    <ToastContainer>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </ToastContainer>
  );
};

export default ToastManager; 