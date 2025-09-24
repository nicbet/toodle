import React from 'react';
import { TODAY_FILTER, TOMORROW_FILTER, PAST_DUE_FILTER } from '../utils/schedule.js';

interface AppFooterProps {
  todos: Array<{ id: number; text: string; completed: boolean; order: number; scheduledAt: string | null; scheduleText: string | null }>;
  filteredTodos: Array<{ id: number; text: string; completed: boolean; order: number; scheduledAt: string | null; scheduleText: string | null }>;
  selectedTag: string | null;
  completionFilter: 'all' | 'hideCompleted' | 'showCompletedOnly';
}

const AppFooter: React.FC<AppFooterProps> = ({ todos, filteredTodos, selectedTag, completionFilter }) => {
  const getModes = () => {
    const modes = [];
    if (selectedTag === TODAY_FILTER) {
      modes.push('Today');
    } else if (selectedTag === TOMORROW_FILTER) {
      modes.push('Tomorrow');
    } else if (selectedTag === PAST_DUE_FILTER) {
      modes.push('Past due');
    } else if (selectedTag) {
      modes.push('Filter by tag');
    }
    if (completionFilter === 'hideCompleted') modes.push('Filter completed');
    if (completionFilter === 'showCompletedOnly') modes.push('Completed only');
    return modes;
  };

  const getCountInfo = () => {
    const visibleCount = filteredTodos.length;
    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.completed).length;
    const remainingCount = totalCount - completedCount;

    if (selectedTag && completionFilter === 'hideCompleted') {
      return `${visibleCount} visible (${totalCount} total, ${completedCount} completed)`;
    } else if (selectedTag && completionFilter === 'showCompletedOnly') {
      return `${visibleCount} completed (${totalCount} total)`;
    } else if (selectedTag) {
      return `${visibleCount} visible (${totalCount} total)`;
    } else if (completionFilter === 'hideCompleted') {
      return `${visibleCount} visible (${completedCount} hidden)`;
    } else if (completionFilter === 'showCompletedOnly') {
      return `${visibleCount} completed (${remainingCount} hidden)`;
    } else {
      return `${totalCount} todos`;
    }
  };

  const getHelpHints = () => {
    const hints = [];
    if (selectedTag) hints.push("Press 'Esc' to clear filters");
    if (completionFilter === 'hideCompleted') hints.push("Press 'F' to show completed");
    if (completionFilter === 'showCompletedOnly') hints.push("Press 'C' to show all todos");
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
