import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getTagColors, tagColorPalette } from '../utils/tagColors.js';

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
    opacity: isDragging ? 0.5 : (isEditing ? 1 : (completed ? 0.7 : 1)),
  };
  const [editText, setEditText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const liRef = useRef<HTMLLIElement>(null);

  const tags = text.match(/#\w+/g) || [];



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

  const className = [
    'Todo-Item',
    isEditing && 'Todo-Item--editing',
    isSelected && 'Todo-Item--selected',
    completed && 'Todo-Item--completed',
    isDragging && 'Todo-Item--dragging'
  ].filter(Boolean).join(' ');

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
        ...style,
        cursor: isEditing ? 'default' : 'grab'
      }}
      className={className}
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
        className={`Todo-Item__Checkbox ${completed ? 'Todo-Item__Checkbox--checked' : ''}`}
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
          className="Todo-Item__Input"
          autoFocus
        />
      ) : (
        <>
          <span className={`Todo-Item__Text ${completed ? 'Todo-Item__Text--completed' : ''}`}>{text}</span>
          {tags.length > 0 && (
            <div className="Todo-Item__Tag-Container">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="Todo-Item__Tag"
                  style={getTagColors(tag, tagColorMap)}
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
