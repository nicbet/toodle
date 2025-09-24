import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useTodos } from '../hooks/useTodos.js';
import { useTagFiltering } from '../hooks/useTagFiltering.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import type { CompletionFilter } from '../hooks/useTodos.js';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
  scheduledAt: string | null;
  scheduleText: string | null;
}

interface TodoContextType {
  // From useTodos
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  completionFilter: CompletionFilter;
  setCompletionFilter: (filter: CompletionFilter | ((prev: CompletionFilter) => CompletionFilter)) => void;
  addTodo: (text: string) => void;
  saveCurrentAndAddNew: (currentId: number, currentText: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, text: string) => void;
  reorderTodos: (fromIndex: number, toIndex: number) => void;
  clearAllTodos: () => void;

  // From useTagFiltering
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allTags: string[];
  filteredTodos: Todo[];

  // Tag colors
  tagColorMap: Record<string, number>;
  setTagColorMap: (map: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todosData = useTodos();
  const tagFilteringData = useTagFiltering(todosData.todos, todosData.completionFilter);
  const [tagColorMap, setTagColorMap] = useLocalStorage<Record<string, number>>('tagColorMap', {});

  const value: TodoContextType = {
    ...todosData,
    ...tagFilteringData,
    tagColorMap,
    setTagColorMap,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
