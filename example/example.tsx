import ModalManager from '../src';
import Modal from 'react-modal';
import { useModal } from '../src/modal-provider';

const ModalComponent1 = ({ ModalProps }: { ModalProps: 'test1' }) => {
  const options = useModal();
  return (
    <Modal ariaHideApp={false} isOpen={true}>
      <button onClick={options.hide}>closeModal</button>
    </Modal>
  );
};

const ModalComponent2 = ({ ModalProps2 }: { ModalProps2: 'test2' }) => {
  const options = useModal();
  return (
    <Modal ariaHideApp={false} isOpen={true}>
      <button onClick={options.hide}>closeModal</button>
    </Modal>
  );
};

const modalManager = new ModalManager({
  Modal1: { component: ModalComponent1 },
  Modal2: { component: ModalComponent2 },
});

export default function Example() {
  return (
    <modalManager.Provider>
      <button
        onClick={() =>
          modalManager.showModal('Modal1', { ModalProps: 'test1' })
        }
      >
        add modal
      </button>
    </modalManager.Provider>
  );
}
