import React, { useState, useEffect, useRef } from 'react';

const TodoItem: React.FC<{
  id: number;
  text: string;
  completed: boolean;
  index: number;
  toggleTodo: (id: number) => void;
  isSelected: boolean;
  setSelectedIndex: (index: number) => void;
  isEditing: boolean;
  setEditingIndex: (index: number | null) => void;
  updateTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
}> = ({ text, completed, toggleTodo, id, index, isSelected, setSelectedIndex, isEditing, setEditingIndex, updateTodo, deleteTodo }) => {
  const [editText, setEditText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setEditText(text);
    if (isEditing) {
      inputRef.current?.select();
      liRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [text, isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      updateTodo(id, editText);
      setEditingIndex(null);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      if (editText.trim() === '') {
        deleteTodo(id);
      } else {
        setEditingIndex(null);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === '/') {
      // Allow global handler to process after saving
      updateTodo(id, editText);
      setEditingIndex(null);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <li
      ref={liRef}
      onClick={() => {
        if (!isEditing) {
          setSelectedIndex(index);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '16px',
        width: '500px',
        backgroundColor: isEditing ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(4px)',
        borderRadius: '8px',
        boxShadow: isEditing ? '0 4px 12px rgba(255,107,53,0.5)' : isSelected ? '0 0 15px rgba(0,102,255,0.6), 0 4px 12px rgba(59,130,246,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
        border: `2px solid ${isEditing ? '#ff6b35' : 'transparent'}`,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        // keep text decoration on the text node only so child elements (like the checkmark)
        // don't get visually struck through by inherited text-decoration rendering
        color: completed ? '#999999' : '#ffffff',
        opacity: completed ? 0.7 : 1,
        cursor: isEditing ? 'default' : 'pointer'
      }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => toggleTodo(id)}
        style={{
          display: 'none'
        }}
      />
      <span
        onClick={(e) => {
          e.stopPropagation();
          toggleTodo(id);
        }}
        style={{
          marginRight: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: completed ? 'rgba(34,197,94,0.8)' : 'transparent',
          border: '2px solid rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'white',
          backdropFilter: 'blur(4px)',
          textDecoration: 'none'
        }}
      >
        {completed ? '✔' : ''}
      </span>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (editText.trim() === '') deleteTodo(id); setEditingIndex(null); }}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: '#ffffff',
            fontSize: 'inherit'
          }}
          autoFocus
        />
      ) : (
        <>
          <span style={{ flex: 1, textDecoration: completed ? 'line-through' : 'none' }}>{text}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTodo(id);
            }}
            style={{
              marginLeft: '12px',
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: (isSelected || isHovered) ? 0.9 : 0,
              visibility: (isSelected || isHovered) ? 'visible' : 'hidden',
              transition: 'opacity 0.15s ease, visibility 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = (isSelected || isHovered) ? '0.9' : '0'}
            title="Delete todo"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0 1-2,2H7a2,2 0 0 1-2-2V6m3,0V4a2,2 0 0 1 2-2h4a2,2 0 0 1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
