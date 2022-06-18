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
      onAfterClose={() => options.unMount}
      closeTimeoutMS={500}
      ariaHideApp={false}
      isOpen={options.isVisible}
    >
      {counter}
      <button onClick={options.hide}>closeModal</button>
    </Modal>
  );
};

const modalManager = new ModalManager({
  madal1: { component: ModalComponent1 },
  modal2: { component: ModalComponent2 },
});

export const { useModal } = modalManager;

export default function Example() {
  return (
    <ModalProvider modalManager={modalManager}>
      <button onClick={() => modalManager.show('modal2', { counter: 1 })}>
        show preregistered modal
      </button>
    </ModalProvider>
  );
}
