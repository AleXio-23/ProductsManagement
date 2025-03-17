import React from 'react';
import styled from 'styled-components';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(3px);
`;

const DialogContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  box-shadow: 0 16px 24px rgba(0, 0, 0, 0.14), 0 6px 12px rgba(0, 0, 0, 0.12);
  animation: dialogFadeIn 0.3s ease-out;
  
  @keyframes dialogFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DialogHeader = styled.div<{ type?: 'confirm' | 'alert' | 'error' }>`
  padding: 20px 24px;
  background-color: ${props => {
    switch (props.type) {
      case 'confirm': return '#f8f9fa';
      case 'alert': return '#e9f2ff';
      case 'error': return '#fff5f5';
      default: return '#f8f9fa';
    }
  }};
  border-bottom: 1px solid ${props => {
    switch (props.type) {
      case 'confirm': return '#dee2e6';
      case 'alert': return '#cce5ff';
      case 'error': return '#f8d7da';
      default: return '#dee2e6';
    }
  }};
`;

const DialogTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #212529;
  font-weight: 600;
`;

const DialogContent = styled.div`
  padding: 24px;
  color: #495057;
  font-size: 1rem;
  line-height: 1.5;
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return '#0d6efd';
      case 'danger': return '#dc3545';
      case 'secondary': return '#6c757d';
      default: return '#6c757d';
    }
  }};
  
  color: white;

  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return '#0b5ed7';
        case 'danger': return '#bb2d3b';
        case 'secondary': return '#5c636a';
        default: return '#5c636a';
      }
    }};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface DialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'error';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmText = 'OK',
  cancelText = 'გაუქმება',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <DialogOverlay onClick={handleOverlayClick}>
      <DialogContainer onClick={e => e.stopPropagation()}>
        <DialogHeader type={type}>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {message}
        </DialogContent>
        <DialogFooter>
          {type === 'confirm' && (
            <Button variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <Button 
            variant={type === 'error' ? 'danger' : 'primary'} 
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContainer>
    </DialogOverlay>
  );
};

export default Dialog; 