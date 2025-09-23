import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoItem from './TodoItem.js';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  order: number;
}

const TodoList: React.FC<{
  todos: Todo[];
  toggleTodo: (id: number) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  updateTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
  reorderTodos: (fromIndex: number, toIndex: number) => void;
  addTodo: (text: string) => void;
  saveCurrentAndAddNew: (currentId: number, currentText: string) => void;
  allTags: string[];
  tagColorMap: Record<string, number>;
  totalTodosCount: number;
  selectedTag: string | null;
  hideCompleted: boolean;
}> = ({ todos, toggleTodo, selectedIndex, setSelectedIndex, editingIndex, setEditingIndex, updateTodo, deleteTodo, reorderTodos, addTodo, saveCurrentAndAddNew, allTags, tagColorMap, totalTodosCount, selectedTag, hideCompleted }) => {
  const getEmptyStateMessage = () => {
    if (selectedTag && hideCompleted) {
      return (
        <>
          No todos match the current filters.
          <br />
          Try <kbd className="Todo-List__Empty-State-Kbd">esc</kbd> to clear tag filter or <kbd className="Todo-List__Empty-State-Kbd">f</kbd> to show completed todos.
        </>
      );
    } else if (selectedTag) {
      return (
        <>
          No todos with tag "{selectedTag}".
          <br />
          Press <kbd className="Todo-List__Empty-State-Kbd">esc</kbd> to clear the filter.
        </>
      );
    } else if (hideCompleted) {
      return (
        <>
          All {totalTodosCount} todos are completed!
          <br />
          Press <kbd className="Todo-List__Empty-State-Kbd">f</kbd> to show them.
        </>
      );
    }
    return null;
  };

  if (todos.length === 0 && totalTodosCount > 0) {
    const message = getEmptyStateMessage();
    if (message) {
      return (
        <div className="Todo-List__Container">
          <div className="Todo-List__Empty-State">
            {message}
          </div>
        </div>
      );
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id);
      const newIndex = todos.findIndex(todo => todo.id === over.id);
      reorderTodos(oldIndex, newIndex);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
        <div className="Todo-List__Container">
          <ul className="Todo-List__List">
            {todos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                {...todo}
                index={index}
                toggleTodo={toggleTodo}
                isSelected={index === selectedIndex}
                setSelectedIndex={setSelectedIndex}
                isEditing={index === editingIndex}
                setEditingIndex={setEditingIndex}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
                addTodo={addTodo}
                saveCurrentAndAddNew={saveCurrentAndAddNew}
                allTags={allTags}
                tagColorMap={tagColorMap}
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;
