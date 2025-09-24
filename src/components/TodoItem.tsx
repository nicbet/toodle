import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getTagColors } from '../utils/tagColors.js';
import { Clock } from 'lucide-react';
import { formatScheduledAt, isDueToday, isDueTomorrow, isPastDue } from '../utils/schedule.js';

const TodoItem: React.FC<{
  id: number;
  text: string;
  completed: boolean;
  scheduledAt: string | null;
  scheduleText: string | null;
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
}> = ({ text, completed, scheduledAt, scheduleText, toggleTodo, id, index, isSelected, setSelectedIndex, isEditing, setEditingIndex, updateTodo, deleteTodo, addTodo, saveCurrentAndAddNew, allTags, tagColorMap }) => {
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
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : (isEditing ? 1 : (completed ? 0.7 : 1)),
  };
  const composeEditableValue = () => {
    const base = text.trim();
    if (scheduleText) {
      if (!base) {
        return scheduleText.trim();
      }
      return `${base} ${scheduleText}`.trim();
    }
    return base;
  };

  const [editText, setEditText] = useState(composeEditableValue);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const liRef = useRef<HTMLLIElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const setRefs = useCallback((node: HTMLLIElement | null) => {
    setNodeRef(node);
    liRef.current = node;
  }, [setNodeRef]);

  const tags = text.match(/#\w+/g) || [];
  const isOverdue = isPastDue(scheduledAt);
  const isDueSameDay = !isOverdue && isDueToday(scheduledAt);
  const isDueNextDay = !isOverdue && !isDueSameDay && isDueTomorrow(scheduledAt);
  const scheduledDisplay = formatScheduledAt(scheduledAt);
  const displayText = text || scheduleText || '';



  useEffect(() => {
    setEditText(composeEditableValue());
    if (isEditing) {
      inputRef.current?.select();
      liRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [text, scheduleText, isEditing]);

  useEffect(() => {
    if (isSelected && !isEditing && liRef.current) {
      if (!scrollContainerRef.current) {
        let parent: HTMLElement | null = liRef.current.parentElement;
        while (parent) {
          const { overflowY } = window.getComputedStyle(parent);
          if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
            scrollContainerRef.current = parent;
            break;
          }
          parent = parent.parentElement;
        }
        if (!scrollContainerRef.current && document.scrollingElement instanceof HTMLElement) {
          scrollContainerRef.current = document.scrollingElement;
        }
      }

      const item = liRef.current;
      const container = scrollContainerRef.current;

      if (!container) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const getVerticalGap = (element: HTMLElement) => {
        const styles = window.getComputedStyle(element);
        const rowGap = parseFloat(styles.rowGap);
        if (!Number.isNaN(rowGap)) {
          return rowGap;
        }
        const gap = parseFloat(styles.gap);
        return Number.isNaN(gap) ? 0 : gap;
      };

      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const containerScrollTop = container.scrollTop;
      const margin = getVerticalGap(container);

      if (itemRect.top < containerRect.top + margin) {
        const deltaTop = itemRect.top - containerRect.top;
        const targetTop = Math.max(0, containerScrollTop + deltaTop - margin);
        if (typeof container.scrollTo === 'function') {
          container.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
          container.scrollTop = targetTop;
        }
      } else if (itemRect.bottom > containerRect.bottom - margin) {
        const deltaBottom = itemRect.bottom - containerRect.bottom;
        const maxScroll = container.scrollHeight - container.clientHeight;
        const targetTop = Math.min(maxScroll, containerScrollTop + deltaBottom + margin);
        if (typeof container.scrollTo === 'function') {
          container.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
          container.scrollTop = targetTop;
        }
      }
    }
  }, [isSelected, isEditing]);

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
    isDragging && 'Todo-Item--dragging',
  ].filter(Boolean).join(' ');

  const scheduleClassName = [
    'Todo-Item__Schedule',
    isOverdue && 'Todo-Item__Schedule--overdue',
    isDueSameDay && 'Todo-Item__Schedule--today',
    isDueNextDay && 'Todo-Item__Schedule--tomorrow',
  ].filter(Boolean).join(' ');

  return (
    <li
      ref={setRefs}
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
          <span className={`Todo-Item__Text ${completed ? 'Todo-Item__Text--completed' : ''}`}>
            {displayText}
            {scheduledAt && (
              <span
                className={scheduleClassName}
                title={scheduledDisplay ?? undefined}
                aria-label={scheduledDisplay ? `Scheduled for ${scheduledDisplay}` : 'Scheduled task'}
              >
                <Clock size={18} strokeWidth={2.4} aria-hidden="true" />
              </span>
            )}
          </span>
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
