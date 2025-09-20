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
}> = ({ todos, toggleTodo, selectedIndex, setSelectedIndex, editingIndex, setEditingIndex, updateTodo, deleteTodo, reorderTodos }) => {
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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ul style={{
            listStyle: 'none',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: 'calc(100vh - 260px)',
            overflowY: 'auto'
          }}>
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
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;
