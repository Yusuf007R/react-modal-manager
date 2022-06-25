import { ModalManager, ModalProvider } from '../src';
import Modal from 'react-modal';

import './index.css';
import { useState } from 'react';

const ConfirmationModal = ({ title }: { title: string }) => {
  const options = useModal();
  const resolve = (value: boolean) => {
    options.hide();
    options.resolve(value);
  };
  return (
    <Modal
      onRequestClose={options.hide}
      onAfterClose={options.unMount}
      closeTimeoutMS={500}
      ariaHideApp={false}
      isOpen={options.isVisible}
    >
      {title}
      <button onClick={() => resolve(true)}>Confirm</button>
      <button onClick={() => resolve(false)}>Reject</button>
    </Modal>
  );
};

const ModalComponent2 = () => {
  const options = useModal();
  const [counter, setCounter] = useState(0);
  return (
    <Modal
      onRequestClose={options.hide}
      onAfterClose={options.unMount}
      closeTimeoutMS={500}
      ariaHideApp={false}
      isOpen={options.isVisible}
    >
      {counter}
      <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setCounter((prev) => prev - 1)}>Decrement</button>
      <button onClick={options.hide}> close modal </button>
    </Modal>
  );
};

const modalManager = new ModalManager({
  'confirmation-modal': ConfirmationModal,
});

export const { useModal } = modalManager;

export default function Example() {
  const [result, setResult] = useState('');
  return (
    <ModalProvider modalManager={modalManager}>
      <button
        onClick={async () => {
          // here we can use the modal manager to open a modal by key
          const result = await modalManager.show('confirmation-modal', {
            title: 'Are you sure?',
          });
          setResult(result ? 'confirmed' : 'rejected');
        }}
      >
        Show confirmation modal
      </button>
      {result && <div> The promise result is: {result}</div>}
      <button
        onClick={() => {
          // here we can use the modal manager to open a modal directly by passing the component
          modalManager.show(ModalComponent2);
        }}
      >
        Show counter modal
      </button>
    </ModalProvider>
  );
}
