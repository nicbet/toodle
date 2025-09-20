import React, { useEffect, useRef } from 'react';

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}> = ({ isOpen, onClose, onAdd, inputValue, setInputValue }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ marginBottom: '16px', color: '#1f2937' }}>Add New Todo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter todo item"
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: '#1f2937',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export const KeyboardShortcutsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleBackdropClick}
    >
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          ×
        </button>

        <h2 style={{
          marginBottom: '24px',
          color: '#1f2937',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Keyboard Shortcuts
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Add new todo</span>
            <kbd style={{
              backgroundColor: '#f3f4f6',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              border: '1px solid #d1d5db'
            }}>/</kbd>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Navigate items</span>
            <kbd style={{
              backgroundColor: '#f3f4f6',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              border: '1px solid #d1d5db'
            }}>↑↓</kbd>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Reorder items</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <kbd style={{
                backgroundColor: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: '1px solid #d1d5db'
              }}>Shift</kbd>
              <span style={{ color: '#6b7280' }}>+</span>
              <kbd style={{
                backgroundColor: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: '1px solid #d1d5db'
              }}>↑↓</kbd>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Toggle completion</span>
            <kbd style={{
              backgroundColor: '#f3f4f6',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              border: '1px solid #d1d5db'
            }}>Space</kbd>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Edit item</span>
            <kbd style={{
              backgroundColor: '#f3f4f6',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              border: '1px solid #d1d5db'
            }}>E</kbd>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Delete item</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <kbd style={{
                backgroundColor: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: '1px solid #d1d5db'
              }}>⌫</kbd>
              <span style={{ color: '#6b7280' }}>or</span>
              <kbd style={{
                backgroundColor: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: '1px solid #d1d5db'
              }}>Del</kbd>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Show shortcuts</span>
            <kbd style={{
              backgroundColor: '#f3f4f6',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              border: '1px solid #d1d5db'
            }}>?</kbd>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          Press <kbd style={{
            backgroundColor: '#f3f4f6',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            border: '1px solid #d1d5db'
          }}>Esc</kbd> or click outside to close
        </div>
      </div>
    </div>
  );
};

export default Modal;