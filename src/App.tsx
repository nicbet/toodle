import React, { useState, useEffect, useMemo } from 'react';
import TodoList from './components/TodoList.js';
import { KeyboardShortcutsModal } from './components/Modal.js';

declare global {
  interface Window {
    confetti: any;
  }
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const colorForTag = (tag: string) => {
    const hash = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 40%, 70%)`;
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    todos.forEach(todo => {
      (todo.text.match(/#\w+/g) || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (!selectedTag) return todos;
    return todos.filter(todo => (todo.text.match(/#\w+/g) || []).some(tag => tag === selectedTag));
  }, [todos, selectedTag]);

  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false, order: todos.length }];
    setTodos(newTodos);
    setSelectedIndex(newTodos.length - 1);
    setEditingIndex(newTodos.length - 1);
  };

  const saveCurrentAndAddNew = (currentId: number, currentText: string) => {
    setTodos(prevTodos => {
      const updated = prevTodos.map(todo => todo.id === currentId ? { ...todo, text: currentText } : todo);
      const newTodo = { id: Date.now(), text: '', completed: false, order: updated.length };
      const newTodos = [...updated, newTodo];
      setSelectedIndex(newTodos.length - 1);
      setEditingIndex(newTodos.length - 1);
      return newTodos;
    });
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    if (selectedTag) {
      const newFiltered = newTodos.filter(todo => (todo.text.match(/#\w+/g) || []).some(tag => tag === selectedTag));
      setSelectedIndex(prev => Math.min(prev, newFiltered.length - 1));
    } else {
      setSelectedIndex(prev => Math.min(prev, newTodos.length - 1));
    }
    setEditingIndex(null);
  };

  const updateTodo = (id: number, text: string) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text } : todo));
  };

  const reorderTodos = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= todos.length || toIndex < 0 || toIndex >= todos.length) {
      return;
    }

    const newTodos = [...todos];
    const movedTodo = newTodos[fromIndex]!;
    newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, movedTodo);

    // Update order values to maintain consistency
    const reorderedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index
    }));

    setTodos(reorderedTodos);

    // Update selectedIndex if it was affected by the move
    if (selectedIndex === fromIndex) {
      setSelectedIndex(toIndex);
    } else if (selectedIndex > fromIndex && selectedIndex <= toIndex) {
      setSelectedIndex(selectedIndex - 1);
    } else if (selectedIndex < fromIndex && selectedIndex >= toIndex) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const openCount = todos.filter(t => !t.completed).length;

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (selectedTag) {
      setSelectedIndex(prev => Math.min(prev, filteredTodos.length - 1));
    }
  }, [filteredTodos.length, selectedTag]);

  useEffect(() => {
    if (todos.length > 0 && todos.every(todo => todo.completed) && window.confetti) {
      // Confetti from all corners
      window.confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0 } // top-left
      });
      window.confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0 } // top-right
      });
      window.confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 } // bottom-left
      });
      window.confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 } // bottom-right
      });
    }
  }, [todos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if the event target is an input field
      const target = e.target as HTMLElement;
      const isInputField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === '/' && !isInputField) {
        e.preventDefault();
        addTodo('');
      } else if (e.key === '?' && !isInputField) {
        e.preventDefault();
        setShowShortcutsModal(true);
      } else if (todos.length > 0) {
        // Check Shift+Arrow combinations first (more specific)
        if (e.shiftKey && e.key === 'ArrowUp') {
          e.preventDefault();
          if (!selectedTag && selectedIndex > 0) {
            reorderTodos(selectedIndex, selectedIndex - 1);
            setSelectedIndex(selectedIndex - 1);
          }
        } else if (e.shiftKey && e.key === 'ArrowDown') {
          e.preventDefault();
          if (!selectedTag && selectedIndex < todos.length - 1) {
            reorderTodos(selectedIndex, selectedIndex + 1);
            setSelectedIndex(selectedIndex + 1);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(filteredTodos.length - 1, prev + 1));
        } else if (e.key === ' ') {
          e.preventDefault();
          if (filteredTodos[selectedIndex]) {
            toggleTodo(filteredTodos[selectedIndex].id);
          }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          if (filteredTodos[selectedIndex]) {
            deleteTodo(filteredTodos[selectedIndex].id);
          }
        } else if (e.key === 'e') {
          e.preventDefault();
          if (filteredTodos[selectedIndex] && editingIndex === null) {
            setEditingIndex(selectedIndex);
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, todos, filteredTodos, toggleTodo, deleteTodo, editingIndex, addTodo, reorderTodos, setShowShortcutsModal]);

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all todos?')) {
      setTodos([]);
    }
  };

  return (
    <>
      <button
        onClick={clearAll}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        title="Clear all todos"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M14.4 3.419a.639.639 0 0 1 1.2 0l.61 1.668a9.587 9.587 0 0 0 5.703 5.703l1.668.61a.639.639 0 0 1 0 1.2l-1.668.61a9.587 9.587 0 0 0-5.703 5.703l-.61 1.668a.639.639 0 0 1-1.2 0l-.61-1.668a9.587 9.587 0 0 0-5.703-5.703l-1.668-.61a.639.639 0 0 1 0-1.2l1.668-.61a9.587 9.587 0 0 0 5.703-5.703l.61-1.668ZM8 16.675a.266.266 0 0 1 .5 0l.254.694a3.992 3.992 0 0 0 2.376 2.377l.695.254a.266.266 0 0 1 0 .5l-.695.254a3.992 3.992 0 0 0-2.376 2.377l-.254.694a.266.266 0 0 1-.5 0l-.254-.694a3.992 3.992 0 0 0-2.376-2.377l-.695-.254a.266.266 0 0 1 0-.5l.695-.254a3.992 3.992 0 0 0 2.376-2.377L8 16.675ZM4.2.21a.32.32 0 0 1 .6 0l.305.833a4.793 4.793 0 0 0 2.852 2.852l.833.305a.32.32 0 0 1 0 .6l-.833.305a4.793 4.793 0 0 0-2.852 2.852L4.8 8.79a.32.32 0 0 1-.6 0l-.305-.833a4.793 4.793 0 0 0-2.852-2.852L.21 4.8a.32.32 0 0 1 0-.6l.833-.305a4.793 4.793 0 0 0 2.852-2.852L4.2.21Z"></path></svg>
      </button>
      <h1 style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.9)',
        zIndex: 10,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <polyline points="9,12 12,15 15,9"></polyline>
        </svg>
        Toodle
      </h1>
      {allTags.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          maxWidth: '600px',
          zIndex: 10
        }}>
          {allTags.map(tag => (
            <span
              key={tag}
              onClick={() => {
                const newTag = tag === selectedTag ? null : tag;
                setSelectedTag(newTag);
                setSelectedIndex(0);
              }}
              style={{
                backgroundColor: colorForTag(tag),
                color: '#333',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: selectedTag && selectedTag !== tag ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Fixed background that doesn't move */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 20% 50%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 40% 80%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 60% 10%, #ea580c 0%, transparent 50%), radial-gradient(circle at 90% 90%, #ec4899 0%, transparent 50%), #0f172a',
        zIndex: -1
      }}></div>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0 16px',
        marginTop: '20px'
      }}
      >
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          reorderTodos={reorderTodos}
          addTodo={addTodo}
          saveCurrentAndAddNew={saveCurrentAndAddNew}
        />
      </div>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.75rem',
        zIndex: 10,
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <kbd style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(4px)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.625rem',
            fontFamily: 'monospace',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '500'
          }}>?</kbd>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>Keyboard shortcuts</span>
        </div>
      </div>
      {todos.length === 0 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '1.5rem',
          fontWeight: '500',
          zIndex: 5
        }}>
          Press <kbd style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '1rem',
            fontFamily: 'monospace',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>/</kbd> to add your first todo
        </div>
      )}

      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

    </>
  );
};

export default App;
