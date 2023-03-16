import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { FocusTrap } from './components/FocusTrap';
import Nested from './components/Nested';
import FocusIs from './components/FocusIs';

function App() {
  const [open, setOpen] = useState(false);
  console.log(open);
  const handleOpen = (open = false) => {
    console.log(open);
    setOpen((open) => !open);
  };

  return (
    <div className="App">
      <FocusIs />
      <button>dud</button>
      <button>dud</button>
      <button>dud</button>
      <div>
        <button onClick={() => handleOpen()}>Trap is {open ? 'active' : 'inactive'}</button>
      </div>

      <Modal show={open} onClose={() => handleOpen()}>
        <FocusTrap isActive={open} focusFromEnd={false} trapFocus={true}>
          <Modal.Header>Hello</Modal.Header>
          <Modal.Body>
            <div>
              <button>BUTTON 1</button>
            </div>
            <div>
              <span tabIndex={0}>Focuasable span</span>
            </div>
            <div>
              <span tabIndex={1}>Un-Focuasable span</span>
            </div>
            <div>
              <button>BUTTON Auto</button>
            </div>
            <div>
              <button autoFocus={false}>BUTTON Auto</button>
            </div>
            <div>
              <button className="w-0 h-0"></button>
            </div>
            <Nested />
            <div>
              <button>BUTTON 2</button>
            </div>
          </Modal.Body>
        </FocusTrap>
      </Modal>
    </div>
  );
}

export default App;
