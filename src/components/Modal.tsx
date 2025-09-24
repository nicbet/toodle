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
    <div className="Modal__Overlay">
      <div className="Modal__Content">
        <h2 className="Modal__Title">Add New Todo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter todo item"
            className="Modal__Input"
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
      className="Keyboard-Shortcuts-Modal__Overlay"
      onClick={handleBackdropClick}
    >
      <div className="Keyboard-Shortcuts-Modal__Content">
        <button
          onClick={onClose}
          className="Keyboard-Shortcuts-Modal__Close-Button"
        >
          ×
        </button>

        <h2 className="Keyboard-Shortcuts-Modal__Title">
          Keyboard Shortcuts
        </h2>

        <div className="Keyboard-Shortcuts-Modal__Shortcuts">
          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Add new todo</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">/</kbd>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Navigate items</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">↑↓</kbd>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Reorder items</span>
            <div className="Keyboard-Shortcuts-Modal__Shortcut-Keys">
              <kbd className="Keyboard-Shortcuts-Modal__Kbd">Shift</kbd>
              <span style={{ color: '#6b7280' }}>+</span>
              <kbd className="Keyboard-Shortcuts-Modal__Kbd">↑↓</kbd>
            </div>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Toggle completion</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">Space</kbd>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Edit item</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">E</kbd>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Delete item</span>
            <div className="Keyboard-Shortcuts-Modal__Shortcut-Keys">
              <kbd className="Keyboard-Shortcuts-Modal__Kbd">⌫</kbd>
              <span style={{ color: '#6b7280' }}>or</span>
              <kbd className="Keyboard-Shortcuts-Modal__Kbd">Del</kbd>
            </div>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Clear all todos</span>
            <div className="Keyboard-Shortcuts-Modal__Shortcut-Keys">
              <kbd className="Keyboard-Shortcuts-Modal__Kbd">Shift</kbd>
              <span style={{ color: '#6b7280' }}>+</span>
              <kbd className="Keyboard-Shortcuts-Modal__Kbd">Del</kbd>
            </div>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Toggle hide completed</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">F</kbd>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Toggle completed-only view</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">C</kbd>
          </div>

          <div className="Keyboard-Shortcuts-Modal__Shortcut">
            <span className="Keyboard-Shortcuts-Modal__Shortcut-Label">Show shortcuts</span>
            <kbd className="Keyboard-Shortcuts-Modal__Kbd">?</kbd>
          </div>
        </div>

        <div className="Keyboard-Shortcuts-Modal__Footer">
          Press <kbd className="Keyboard-Shortcuts-Modal__Footer-Kbd">Esc</kbd> or click outside to close
        </div>
      </div>
    </div>
  );
};

export default Modal;
