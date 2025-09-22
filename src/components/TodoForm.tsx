import React, { useState } from 'react';

const TodoForm: React.FC<{ addTodo: (text: string) => void }> = ({ addTodo }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="Todo-Form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo"
        className="Todo-Form__Input"
      />
      <button type="submit" className="Todo-Form__Button">Add Todo</button>
    </form>
  );
};

export default TodoForm;
