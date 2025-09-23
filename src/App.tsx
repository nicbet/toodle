import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList.js';
import { KeyboardShortcutsModal } from './components/Modal.js';
import AppHeader from './components/AppHeader.js';
import TagFilterBar from './components/TagFilterBar.js';
import AppFooter from './components/AppFooter.js';
import ThemeToggle from './components/ThemeToggle.js';
import { tagColorPalette } from './utils/tagColors.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { TodoProvider, useTodoContext } from './contexts/TodoContext.js';
import { ThemeProvider } from './contexts/ThemeContext.js';

declare global {
  interface Window {
    confetti: any;
  }
}

const AppContent: React.FC = () => {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const {
    todos,
    setTodos,
    selectedIndex,
    setSelectedIndex,
    editingIndex,
    setEditingIndex,
    hideCompleted,
    setHideCompleted,
    addTodo,
    saveCurrentAndAddNew,
    toggleTodo,
    deleteTodo,
    updateTodo,
    reorderTodos,
    selectedTag,
    setSelectedTag,
    allTags,
    filteredTodos,
    tagColorMap,
    setTagColorMap,
    clearAllTodos,
  } = useTodoContext();



  // Assign colors to new tags
  useEffect(() => {
    const newTagColorMap = { ...tagColorMap };
    const usedColors = new Set(Object.values(tagColorMap));

    allTags.forEach(tag => {
      if (!(tag in newTagColorMap)) {
        // Find an unused color index
        let colorIndex = 0;
        while (usedColors.has(colorIndex)) {
          colorIndex = (colorIndex + 1) % tagColorPalette.length;
        }
        newTagColorMap[tag] = colorIndex;
        usedColors.add(colorIndex);
      }
    });

    // Clean up colors for tags that no longer exist
    Object.keys(newTagColorMap).forEach(tag => {
      if (!allTags.includes(tag)) {
        delete newTagColorMap[tag];
      }
    });

    if (JSON.stringify(newTagColorMap) !== JSON.stringify(tagColorMap)) {
      setTagColorMap(newTagColorMap);
    }
  }, [allTags, tagColorMap]);

  const openCount = todos.filter(t => !t.completed).length;



  useEffect(() => {
    if (selectedTag) {
      setSelectedIndex(prev => Math.min(prev, filteredTodos.length - 1));
    }
  }, [filteredTodos.length, selectedTag]);

  useEffect(() => {
    if (todos.length > 0 && todos.every(todo => todo.completed) && window.confetti) {
      // Confetti from all corners
      window.confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0 } // top-left
      });
      window.confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0 } // top-right
      });
      window.confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 } // bottom-left
      });
      window.confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 } // bottom-right
      });
    }
  }, [todos]);

  useKeyboardShortcuts({
    selectedIndex,
    setSelectedIndex,
    todos,
    filteredTodos,
    selectedTag,
    toggleTodo,
    deleteTodo,
    addTodo,
    reorderTodos,
    setEditingIndex,
    setShowShortcutsModal,
    clearAllTodos,
    setHideCompleted,
    setSelectedTag,
  });



  return (
    <>
      <ThemeToggle />
      <AppHeader />
      <TagFilterBar
        allTags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        setSelectedIndex={setSelectedIndex}
        tagColorMap={tagColorMap}
      />

      {/* Fixed background that doesn't move */}
      <div className="App__Background"></div>
      <div className="App__Container">
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          reorderTodos={reorderTodos}
          addTodo={addTodo}
          saveCurrentAndAddNew={saveCurrentAndAddNew}
          allTags={allTags}
          tagColorMap={tagColorMap}
          totalTodosCount={todos.length}
          selectedTag={selectedTag}
          hideCompleted={hideCompleted}
        />
      </div>

      <AppFooter
        todos={todos}
        filteredTodos={filteredTodos}
        selectedTag={selectedTag}
        hideCompleted={hideCompleted}
      />
      {todos.length === 0 && (
        <div className="App__Empty-State">
          Press <kbd className="App__Empty-State-Kbd">/</kbd> to add your first todo
        </div>
      )}

      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
};

export default App;