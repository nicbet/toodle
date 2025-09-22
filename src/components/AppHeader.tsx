import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <>
      <h1 className="App__Title">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <polyline points="9,12 12,15 15,9"></polyline>
        </svg>
        Toodle
      </h1>
    </>
  );
};

export default AppHeader;