import { useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
  scheduledAt: string | null;
  scheduleText: string | null;
}

type CompletionFilter = 'all' | 'hideCompleted' | 'showCompletedOnly';

interface UseKeyboardShortcutsProps {
  selectedIndex: number;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  todos: Todo[];
  filteredTodos: Todo[];
  selectedTag: string | null;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  addTodo: (text: string) => void;
  reorderTodos: (fromIndex: number, toIndex: number) => void;
  setEditingIndex: (index: number | null) => void;
  setShowShortcutsModal: (show: boolean) => void;
  clearAllTodos: () => void;
  setCompletionFilter: (filter: CompletionFilter | ((prev: CompletionFilter) => CompletionFilter)) => void;
  setSelectedTag: (tag: string | null) => void;
}

export const useKeyboardShortcuts = ({
  selectedIndex,
  setSelectedIndex,
  todos,
  filteredTodos,
  selectedTag,
  toggleTodo,
  deleteTodo,
  addTodo,
  reorderTodos,
  setEditingIndex,
  setShowShortcutsModal,
  clearAllTodos,
  setCompletionFilter,
  setSelectedTag,
}: UseKeyboardShortcutsProps) => {
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
        } else if (e.shiftKey && e.key === 'Delete') {
          e.preventDefault();
          clearAllTodos();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          if (filteredTodos[selectedIndex]) {
            deleteTodo(filteredTodos[selectedIndex].id);
          }
        } else if (e.key === 'e') {
          e.preventDefault();
          if (filteredTodos[selectedIndex] && setEditingIndex !== null) {
            setEditingIndex(selectedIndex);
          }
        } else if (e.key === 'f') {
          e.preventDefault();
          setCompletionFilter(prev => prev === 'hideCompleted' ? 'all' : 'hideCompleted');
        } else if (e.key === 'c') {
          e.preventDefault();
          setCompletionFilter(prev => prev === 'showCompletedOnly' ? 'all' : 'showCompletedOnly');
        } else if (e.key === 'Escape') {
          e.preventDefault();
          if (selectedTag) {
            setSelectedTag(null);
            setSelectedIndex(0);
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, todos, filteredTodos, selectedTag, toggleTodo, deleteTodo, addTodo, reorderTodos, setEditingIndex, setShowShortcutsModal, clearAllTodos, setCompletionFilter, setSelectedTag]);
};
