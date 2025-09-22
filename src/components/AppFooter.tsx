import React from 'react';

interface AppFooterProps {
  todos: Array<{ id: number; text: string; completed: boolean; order: number }>;
  filteredTodos: Array<{ id: number; text: string; completed: boolean; order: number }>;
  selectedTag: string | null;
  hideCompleted: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ todos, filteredTodos, selectedTag, hideCompleted }) => {
  const getFooterContent = () => {
    if (selectedTag) {
      // When filtering by tag: "Filter: x todos (y total)"
      return `Filter: ${filteredTodos.length} todos (${todos.length} total)`;
    } else if (hideCompleted) {
      // When hiding completed: "X completed items hidden - press 'F' to show"
      const hiddenCount = todos.filter(todo => todo.completed).length;
      return `${hiddenCount} completed items hidden - press 'F' to show`;
    } else {
      // Default: keyboard shortcuts hint
      return (
        <div className="App__Footer-Shortcut">
          <kbd className="App__Footer-Kbd">?</kbd>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>Keyboard shortcuts</span>
        </div>
      );
    }
  };

  return (
    <div className="App__Footer">
      {typeof getFooterContent() === 'string' ? (
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>
          {getFooterContent()}
        </span>
      ) : (
        getFooterContent()
      )}
    </div>
  );
};

export default AppFooter;