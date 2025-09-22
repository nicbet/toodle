import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <div className="App__Footer">
      <div className="App__Footer-Shortcut">
        <kbd className="App__Footer-Kbd">?</kbd>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>Keyboard shortcuts</span>
      </div>
    </div>
  );
};

export default AppFooter;