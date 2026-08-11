import React from 'react';

/**
 * Wraps children in a container that re-triggers a fade+slide animation
 * whenever `tabKey` changes. Uses a CSS class + React key remount.
 */
export const PageTransition = ({ tabKey, children }) => {
  return (
    <div key={tabKey} className="page-transition">
      {children}
    </div>
  );
};
