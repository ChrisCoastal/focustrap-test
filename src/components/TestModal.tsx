import React from 'react';
import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { FocusTrap } from './FocusTrap/FocusTrap';

export type TestModalProps = {
  show: boolean;
  onClose: () => void;
  trapOptions: {
    trapFocus?: boolean;
    focusFromEnd?: boolean;
  };
  children?: React.ReactNode;
};

const TestModal: FC<TestModalProps> = ({ show, onClose, trapOptions, children }) => {
  const modalRoot = document.getElementById('modal-root');
  !modalRoot && console.error('Modal root not found!');

  return show && modalRoot
    ? createPortal(
        <div role="dialog">
          <FocusTrap trapFocus={trapOptions.trapFocus} focusFromEnd={trapOptions.focusFromEnd}>
            <div className="bg-stone-200 border border-stone-800 absolute px-8 py-4 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-right">
              <div>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-br from-indigo-500 to-indigo-700 h-6 w-6 rounded-full text-white">
                  X
                </button>
              </div>
              <div className="flex flex-col items-center gap-4">{children}</div>
            </div>
          </FocusTrap>
        </div>,
        modalRoot
      )
    : null;
};

export default TestModal;
