import { ModalManager, ModalProvider } from '../src';
import Modal from 'react-modal';

import './index.css';

const ModalComponent1 = ({ title }: { title: string }) => {
  const options = useModal();
  return (
    <Modal ariaHideApp={false} isOpen={true}>
      {title}
      <button onClick={options.hide}>closeModal</button>
    </Modal>
  );
};

const ModalComponent2 = ({ counter }: { counter: number }) => {
  const options = useModal();

  return (
    <Modal
      onRequestClose={options.hide}
      onAfterClose={options.unMount}
      closeTimeoutMS={500}
      ariaHideApp={false}
      isOpen={options.isVisible}
    >
      {counter}
      <button
        onClick={() => {
          options.hide();
          options.resolve('clicked');
        }}
      >
        closeModal
      </button>
    </Modal>
  );
};

const modalManager = new ModalManager({
  'confirmation-modal': ModalComponent1,
  modal2: ModalComponent2,
});

export const { useModal } = modalManager;

export default function Example() {
  return (
    <ModalProvider modalManager={modalManager}>
      <button
        onClick={async () => {
          console.log(await modalManager.show('modal2', { counter: 1 }));
        }}
      >
        Show modal
      </button>
    </ModalProvider>
  );
}
