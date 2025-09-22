import { useState, useMemo } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
}

export const useTagFiltering = (todos: Todo[]) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  return {
    selectedTag,
    setSelectedTag,
    allTags,
    filteredTodos,
  };
};