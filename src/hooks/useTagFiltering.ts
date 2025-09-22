import { useState, useMemo } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
}

export const useTagFiltering = (todos: Todo[], hideCompleted: boolean) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    todos.forEach(todo => {
      (todo.text.match(/#\w+/g) || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // First filter by tag if selected
    if (selectedTag) {
      filtered = filtered.filter(todo => (todo.text.match(/#\w+/g) || []).some(tag => tag === selectedTag));
    }

    // Then filter out completed todos if hideCompleted is true
    if (hideCompleted) {
      filtered = filtered.filter(todo => !todo.completed);
    }

    return filtered;
  }, [todos, selectedTag, hideCompleted]);

  return {
    selectedTag,
    setSelectedTag,
    allTags,
    filteredTodos,
  };
};