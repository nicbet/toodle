import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList.js';

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

  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false, order: todos.length }];
    setTodos(newTodos);
    setSelectedIndex(newTodos.length - 1);
    setEditingIndex(newTodos.length - 1);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    setSelectedIndex(prev => Math.min(prev, newTodos.length - 1));
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
  const completedCount = todos.filter(t => t.completed).length;

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
      if (e.key === '/') {
        e.preventDefault();
        addTodo('');
      } else if (todos.length > 0) {
        // Check Shift+Arrow combinations first (more specific)
        if (e.shiftKey && e.key === 'ArrowUp') {
          e.preventDefault();
          if (selectedIndex > 0) {
            reorderTodos(selectedIndex, selectedIndex - 1);
            setSelectedIndex(selectedIndex - 1);
          }
        } else if (e.shiftKey && e.key === 'ArrowDown') {
          e.preventDefault();
          if (selectedIndex < todos.length - 1) {
            reorderTodos(selectedIndex, selectedIndex + 1);
            setSelectedIndex(selectedIndex + 1);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(todos.length - 1, prev + 1));
        } else if (e.key === ' ') {
          e.preventDefault();
          if (todos[selectedIndex]) {
            toggleTodo(todos[selectedIndex].id);
          }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          if (todos[selectedIndex]) {
            deleteTodo(todos[selectedIndex].id);
          }
        } else if (e.key === 'e') {
          e.preventDefault();
          if (todos[selectedIndex] && editingIndex === null) {
            setEditingIndex(selectedIndex);
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, todos, toggleTodo, deleteTodo, editingIndex, addTodo, reorderTodos]);

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
        padding: '0 16px'
      }}>
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          reorderTodos={reorderTodos}
        />
      </div>
      <div style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '12px',
        backgroundColor: 'rgba(156,163,175,0.5)',
        borderRadius: '4px',
        overflow: 'hidden',
        backdropFilter: 'blur(4px)',
        zIndex: 10
      }}>
        <div style={{
          width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%`,
          height: '100%',
          backgroundColor: 'rgba(34,197,94,0.8)',
          transition: 'width 0.3s ease'
        }}></div>
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
        <div>Press "/" to add • Arrow keys to navigate • "E" to edit</div>
        <div>'Space' to toggle • 'Backspace' or 'Delete' to remove</div>
        <div>Shift+↑/↓ to reorder • Drag to reorder</div>
      </div>
      {todos.length === 0 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '1.25rem',
          fontWeight: '500',
          zIndex: 5
        }}>
          Press "/" to add your first todo
        </div>
      )}

    </>
  );
};

export default App;
