import React from 'react';
import type { FC } from 'react';

type AutoFocusButtonProps = {
  autoFocus?: boolean;
};

const AutoFocusButton: FC<AutoFocusButtonProps> = ({ autoFocus }) => {
  return (
    <>
      <button
        autoFocus={autoFocus}
        className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-4 py-2 rounded-md text-sm font-bold text-white">
        AutoFocus {autoFocus ? 'ON' : 'OFF'}
      </button>
    </>
  );
};

export default AutoFocusButton;
