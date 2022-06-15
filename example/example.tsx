import ModalManager from '../src';
import Modal from 'react-modal';
import { useModal } from '../src/modal-provider';

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
    <Modal ariaHideApp={false} isOpen={true}>
      {counter}
      <button onClick={options.hide}>closeModal</button>
    </Modal>
  );
};

const modalManager = new ModalManager()
  .builder('modal1', ModalComponent1)
  .builder('modal2', ModalComponent2);

export default function Example() {
  return (
    <modalManager.Provider>
      <button
        onClick={() => modalManager.showModal(ModalComponent2, { counter: 10 })}
      >
        show preregistered modal
      </button>
    </modalManager.Provider>
  );
}
