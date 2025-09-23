import React from 'react';

interface AppFooterProps {
  todos: Array<{ id: number; text: string; completed: boolean; order: number }>;
  filteredTodos: Array<{ id: number; text: string; completed: boolean; order: number }>;
  selectedTag: string | null;
  hideCompleted: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ todos, filteredTodos, selectedTag, hideCompleted }) => {
  const getModes = () => {
    const modes = [];
    if (selectedTag) modes.push('Filter by tag');
    if (hideCompleted) modes.push('Filter completed');
    return modes;
  };

  const getCountInfo = () => {
    const visibleCount = filteredTodos.length;
    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.completed).length;
    
    if (selectedTag && hideCompleted) {
      return `${visibleCount} visible (${totalCount} total, ${completedCount} completed)`;
    } else if (selectedTag) {
      return `${visibleCount} visible (${totalCount} total)`;
    } else if (hideCompleted) {
      return `${visibleCount} visible (${completedCount} hidden)`;
    } else {
      return `${totalCount} todos`;
    }
  };

  const getHelpHints = () => {
    const hints = [];
    if (selectedTag) hints.push("Press 'Esc' to clear filters");
    if (hideCompleted) hints.push("Press 'F' to show completed");
    if (hints.length === 0) hints.push("Press '?' to show shortcuts");
    return hints;
  };

  const version = '1.0.0';

  const modes = getModes();
  const countInfo = getCountInfo();
  const hints = getHelpHints();

  const footerItems = [];
  
  if (modes.length > 0) {
    footerItems.push(<span key="mode" className="App__Footer-Mode">{modes.join(' & ')}</span>);
  }
  
  footerItems.push(<span key="count" className="App__Footer-Count">{countInfo}</span>);
  footerItems.push(<span key="hints" className="App__Footer-Hint">{hints.join(', ')}</span>);
  footerItems.push(<span key="version" className="App__Footer-Version">v{version}</span>);

  return (
    <div className="App__Footer">
      <div className="App__Footer-Content">
        {footerItems.map((item, index) => (
          <React.Fragment key={item.key}>
            {item}
            {index < footerItems.length - 1 && <span className="App__Footer-Separator"> • </span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AppFooter;
