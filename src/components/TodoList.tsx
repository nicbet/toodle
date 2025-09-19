import React from 'react';
import TodoItem from './TodoItem.js';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC<{
  todos: Todo[];
  toggleTodo: (id: number) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  updateTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void
}> = ({ todos, toggleTodo, selectedIndex, setSelectedIndex, editingIndex, setEditingIndex, updateTodo, deleteTodo }) => (
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
);

export default TodoList;
