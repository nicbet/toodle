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
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          color: '#374151',
          outline: 'none',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px #93c5fd'}
        onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = 'none'}
      />
      <button type="submit" style={{
        width: '100%',
        marginTop: '12px',
        padding: '12px',
        backgroundColor: 'rgba(59,130,246,0.8)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
      }}
      onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(59,130,246,0.9)'}
      onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(59,130,246,0.8)'}
      >Add Todo</button>
    </form>
  );
};

export default TodoForm;
