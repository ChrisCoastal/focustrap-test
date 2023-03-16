import { useState, useRef } from 'react';
import { Modal } from 'flowbite-react';
import { FocusTrap } from './components/FocusTrap';
import Nested from './components/Nested';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="App">
      <div>
        <button onClick={() => setOpen((open) => !open)}>open is {open}</button>
      </div>
      <label htmlFor="from-end">focus from end</label>
      <input type="checkbox" id="from-end"></input>
      <label htmlFor="trap-focus">trap focus</label>
      <input type="checkbox" id="trap-focus"></input>
      <label htmlFor="autoFocus">autoFocus child</label>
      <input type="checkbox" id="autoFocus"></input>
      <div>
        <button onClick={() => setOpen((open) => !open)}>
          Trap is {open ? 'active' : 'inactive'}
        </button>
      </div>
      <Modal show={open} onClose={() => setOpen(false)}>
        <FocusTrap isActive={open} focusFromEnd={true} trapFocus={false}>
          <Modal.Header>Hello</Modal.Header>
          <Modal.Body>
            <div>
              <button>BUTTON 1</button>
            </div>
            <div>
              <button autoFocus>BUTTON Auto</button>
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
