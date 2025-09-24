import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { parseSchedule } from '../utils/schedule.js';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
  scheduledAt: string | null;
  scheduleText: string | null;
}

export type CompletionFilter = 'all' | 'hideCompleted' | 'showCompletedOnly';

const determineInitialCompletionFilter = (): CompletionFilter => {
  try {
    const storedFilter = window.localStorage.getItem('completionFilter');
    if (storedFilter) {
      const parsed = JSON.parse(storedFilter);
      if (parsed === 'all' || parsed === 'hideCompleted' || parsed === 'showCompletedOnly') {
        return parsed;
      }
    }

    const legacyHideCompleted = window.localStorage.getItem('hideCompleted');
    if (legacyHideCompleted) {
      const legacyParsed = JSON.parse(legacyHideCompleted);
      if (legacyParsed === true) {
        return 'hideCompleted';
      }
    }
  } catch (error) {
    console.error('Error determining initial completion filter:', error);
  }

  return 'all';
};

export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [completionFilter, setCompletionFilter] = useLocalStorage<CompletionFilter>('completionFilter', determineInitialCompletionFilter());

  useEffect(() => {
    try {
      window.localStorage.removeItem('hideCompleted');
    } catch (error) {
      console.error('Error cleaning up legacy hideCompleted flag:', error);
    }
  }, []);

  useEffect(() => {
    if (todos.some(todo => (todo as { scheduledAt?: string | null }).scheduledAt === undefined || (todo as { scheduleText?: string | null }).scheduleText === undefined)) {
      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        scheduledAt: (todo as { scheduledAt?: string | null }).scheduledAt ?? null,
        scheduleText: (todo as { scheduleText?: string | null }).scheduleText ?? null,
      })));
    }
  }, [todos, setTodos]);

  const addTodo = (text: string) => {
    const { cleanedText, scheduledAt, scheduleText } = parseSchedule(text);
    const baseText = cleanedText;
    const newTodos = [
      ...todos,
      {
        id: Date.now(),
        text: baseText,
        completed: false,
        order: todos.length,
        scheduledAt,
        scheduleText: scheduleText ?? null,
      }
    ];
    setTodos(newTodos);
    setSelectedIndex(newTodos.length - 1);
    setEditingIndex(newTodos.length - 1);
  };

  const saveCurrentAndAddNew = (currentId: number, currentText: string) => {
    setTodos(prevTodos => {
      const updated = prevTodos.map(todo => {
        if (todo.id !== currentId) return todo;
        const { cleanedText, scheduledAt, scheduleText } = parseSchedule(currentText);
        const baseText = cleanedText;
        return { ...todo, text: baseText, scheduledAt, scheduleText: scheduleText ?? null };
      });
      const newTodo = {
        id: Date.now(),
        text: '',
        completed: false,
        order: updated.length,
        scheduledAt: null,
        scheduleText: null,
      };
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
    setSelectedIndex(prev => Math.min(prev, newTodos.length - 1));
    setEditingIndex(null);
  };

  const updateTodo = (id: number, text: string) => {
    const { cleanedText, scheduledAt, scheduleText } = parseSchedule(text);
    const baseText = cleanedText;
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: baseText, scheduledAt, scheduleText: scheduleText ?? null } : todo));
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

  const clearAllTodos = () => {
    if (window.confirm('Are you sure you want to clear all todos?')) {
      setTodos([]);
      setSelectedIndex(0);
      setEditingIndex(null);
    }
  };

  return {
    todos,
    setTodos,
    selectedIndex,
    setSelectedIndex,
    editingIndex,
    setEditingIndex,
    completionFilter,
    setCompletionFilter,
    addTodo,
    saveCurrentAndAddNew,
    toggleTodo,
    deleteTodo,
    updateTodo,
    reorderTodos,
    clearAllTodos,
  };
};
