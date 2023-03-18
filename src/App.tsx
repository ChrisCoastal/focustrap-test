import { useState } from 'react';
// import { Modal } from 'flowbite-react';
// import { FocusTrap } from './components/FocusTrap';
import NestedButton from './components/NestedButton';
import FragmentButton from './components/FragmentButton';
import FocusIs from './components/FocusIs';
import TestModal from './components/TestModal';
import AutoFocusButton from './components/AutoFocusButton';

function App() {
  const [open, setOpen] = useState(false);
  const [insert, setInsert] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
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
        <div>
          <span className="mr-4">AutoFocus child {autoFocus ? 'ON' : 'OFF'}</span>
          <input
            type="checkbox"
            onChange={() => setAutoFocus((autoFocus) => !autoFocus)}
            checked={autoFocus}
          />
        </div>
        <label htmlFor="toggle">Trap is {open ? 'active' : 'inactive'}</label>
        <button
          onClick={() => handleOpen()}
          id="toggle"
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-8 py-6 rounded-md font-bold text-white">
          Toggle Modal
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
        <AutoFocusButton autoFocus={autoFocus} />
        <NestedButton />
        <FragmentButton />
      </TestModal>
    </div>
  );
}

export default App;
