import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  addTodo: (text: string) => void;
  saveCurrentAndAddNew: (currentId: number, currentText: string) => void;
  allTags: string[];
  tagColorMap: Record<string, number>;
}> = ({ text, completed, toggleTodo, id, index, isSelected, setSelectedIndex, isEditing, setEditingIndex, updateTodo, deleteTodo, addTodo, saveCurrentAndAddNew, allTags, tagColorMap }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const [editText, setEditText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const liRef = useRef<HTMLLIElement>(null);

  const tags = text.match(/#\w+/g) || [];

  // Catppuccin Mocha pastel palette for tags
  const tagColorPalette = [
    '#f5e0dc', '#f2cdcd', '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5',
    '#89dceb', '#74c7ec', '#89b4fa', '#b4befe', '#cdd6f4', '#bac2de', '#a6adc8', '#9399b2', '#7f849c', '#6c7086',
    '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89dceb', '#74c7ec'
  ];

  const getTagColors = (tag: string) => {
    // Use the persistent tag color mapping
    const paletteIndex = tagColorMap[tag] || 0;
    const backgroundColor = tagColorPalette[paletteIndex % tagColorPalette.length]!;

    // Calculate luminance to determine text color
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return {
      backgroundColor,
      color: luminance > 0.5 ? '#1e1e2e' : '#cdd6f4' // Dark text on light bg, light text on dark bg
    };
  };

  const colorForTag = (tag: string) => getTagColors(tag).backgroundColor;

  useEffect(() => {
    setEditText(text);
    if (isEditing) {
      inputRef.current?.select();
      liRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [text, isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.stopPropagation();
      saveCurrentAndAddNew(id, editText);
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      if (editText.trim() === '') {
        deleteTodo(id);
      } else {
        updateTodo(id, editText);
        setEditingIndex(null);
      }
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      if (editText.trim() === '') {
        deleteTodo(id);
      } else {
        setEditingIndex(null);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Allow global handler to process after saving
      if (editText.trim() === '') {
        deleteTodo(id);
      } else {
        updateTodo(id, editText);
        setEditingIndex(null);
      }
    } else {
      e.stopPropagation();
    }
  };

  const baseStyle = {
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
    cursor: isEditing ? 'default' : 'pointer',
    // Override dnd-kit focus styles
    outline: 'none',
    WebkitTapHighlightColor: 'transparent'
  };

  return (
    <li
      ref={setNodeRef}
      onClick={() => {
        if (!isEditing) {
          setSelectedIndex(index);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...baseStyle,
        ...style,
        cursor: isEditing ? 'default' : 'grab'
      }}
      className="todo-item"
      {...attributes}
      {...listeners}>
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => {
          e.stopPropagation();
          toggleTodo(id);
        }}
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
          onMouseDown={(e) => e.stopPropagation()}
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
           {tags.length > 0 && (
             <div style={{ display: 'flex', gap: '4px', marginLeft: '12px', marginRight: '4px' }}>
               {tags.map(tag => (
                 <span
                   key={tag}
                    style={{
                      ...getTagColors(tag),
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                 >
                   {tag}
                 </span>
               ))}
             </div>
           )}
        </>
      )}
    </li>
  );
};

export default TodoItem;
