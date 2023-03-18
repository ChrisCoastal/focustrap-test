import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import type { TestModalProps } from '../TestModal';
import { useState } from 'react';
import NestedButton from '../NestedButton';
import FragmentButton from '../FragmentButton';
import FocusIs from '../FocusIs';
import TestModal from '../TestModal';

describe('Components / FocusTrap', () => {
  let user: UserEvent;
  let openButton: HTMLElement;
  let modalRoot: HTMLDivElement;
  let modal: HTMLElement;

  beforeEach(async () => {
    console.log(userEvent);
    user = userEvent.setup();
    render(<TestFocusModal />);

    openButton = screen.getByText('Toggle modal');
    await userEvent.click(openButton);
    modalRoot = document.getElementById('modal-root')! as HTMLDivElement;
    modal = within(modalRoot).getByRole('dialog');
  });

  describe('A11y', () => {
    it('should focus on first focusable element within trap', async () => {
      const firstButton = within(modal).getAllByRole('button')[0];

      expect(modal).toContainElement(firstButton);
      await waitFor(() => expect(firstButton).toHaveFocus());
    });

    it.todo('should focus on last focussable element when focusFromEnd is passed', async () => {
      await user.click(openButton);
      const focusFrom = screen.getByRole('checkbox');
      await user.click(focusFrom);
      await user.click(openButton);
      // const firstButton = within(modal).getAllByRole('button')[0];
      const lastButton = within(modal).getAllByRole('button')[2];

      // await waitFor(() => expect(firstButton).not.toHaveFocus());
      await waitFor(() => expect(lastButton).toHaveFocus());
    });

    it.todo('should return focus to previously focussed element on unmount', async () => {
      const firstButton = within(modal).getAllByRole('button')[0];

      await waitFor(() => expect(firstButton).toHaveFocus());
      await user.click(firstButton);
      await waitFor(() => expect(openButton).toHaveFocus());
    });

    it.todo('should re-query focusable elements if children change', async () => {
      const buttons = within(modal).getAllByRole('button');
      expect(buttons.length).toBe(3);
      const lastButton = buttons[2];

      await user.click(lastButton);

      const updatedModal = within(modalRoot).getByRole('dialog');
      const updatedButtons = within(updatedModal).getAllByRole('button');
      await waitFor(() => expect(updatedButtons.length).toBe(4));
    });
  });

  describe('Keyboard interactions', () => {
    // keyoard interactions cannot be tested using testing library
    // testing library uses JSDom which does not reproduce browser behaviour for keyboard events
    // this could be tested using Puppeteer
    it.todo(
      'should move focus from firstFocusable to lastFocusable element on <shift + tab> input',
      async () => {
        const buttons = within(modal).getAllByRole('button');
        expect(buttons.length).toBe(3);
        const firstButton = buttons[0];
        const lastButton = buttons[2];

        await waitFor(() => expect(firstButton).toHaveFocus());
        await user.keyboard('{shift}{tab}');
        await waitFor(() => expect(lastButton).toHaveFocus());
      }
    );

    it.todo(
      'should move focus from lastFocusable to firstFocusable element on <tab> input',
      async () => {
        const buttons = within(modal).getAllByRole('button');
        expect(buttons.length).toBe(3);
        const firstButton = buttons[0];
        const lastButton = buttons[2];

        await user.keyboard('{tab}{tab}');
        await waitFor(() => expect(lastButton).toHaveFocus());
        await user.keyboard('{tab}');
        await waitFor(() => expect(firstButton).toHaveFocus());
      }
    );
  });
});

const TestFocusModal = () => {
  const [open, setOpen] = useState(false);
  const [insert, setInsert] = useState(false);
  const [trap, setTrap] = useState(true);
  const [end, setEnd] = useState(false);

  const trapOptions = {
    isActive: open,
    trapFocus: trap,
    focusFromEnd: end
  };

  const handleOpen = () => {
    setOpen((open) => !open);
    setInsert(false);
  };
  const handleInsert = () => {
    setInsert((insert) => !insert);
  };

  return (
    <div className="App">
      <div id="modal-root"></div>
      <div className="flex flex-col items-center mt-4">
        <FocusIs />
        <div>
          <span className="mr-4">Focus is trapped {trap ? 'ON' : 'OFF'}</span>
          <input type="checkbox" onChange={() => setTrap((trap) => !trap)} checked={trap} />
        </div>
        <div>
          <span className="mr-4">Init focus from end {end ? 'ON' : 'OFF'}</span>
          <input type="checkbox" onChange={() => setEnd((end) => !end)} checked={end} />
        </div>
        <label htmlFor="toggle">Trap is {open ? 'active' : 'inactive'}</label>
        <button
          onClick={() => handleOpen()}
          id="toggle"
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-8 py-6 rounded-md font-bold text-white">
          Toggle modal
        </button>
      </div>

      <TestModal show={open} onClose={handleOpen} trapOptions={trapOptions}>
        <button
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-4 py-2 rounded-md text-sm font-bold text-white"
          onClick={handleInsert}>
          Button
        </button>
        {insert && (
          <button
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-4 py-2 rounded-md text-sm font-bold text-white"
            onClick={() => handleOpen()}>
            Inserted Button
          </button>
        )}
        <NestedButton />
        <FragmentButton />
      </TestModal>
    </div>
  );
};
