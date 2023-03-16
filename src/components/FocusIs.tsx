import React, { useEffect, useState } from 'react';

const FocusIs = () => {
  const [focusEl, setFocusEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const getActiveElement = () => document.activeElement as HTMLElement;

    setFocusEl(getActiveElement());

    document.addEventListener('focusin', () => {
      setFocusEl(getActiveElement());
    });

    return () => {
      document.removeEventListener('focusin', () => {
        setFocusEl(getActiveElement());
      });
    };
  }, []);

  return (
    <div>
      Focus is on <span className="text-blue-500">{focusEl?.tagName}</span>
    </div>
  );
};

export default FocusIs;
