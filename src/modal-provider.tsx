import React from 'react';
import ModalManager from './modal-manager';

import useStore from './state/react';

type propType<M> = {
  children: React.ReactNode;
  modalManager: ModalManager<M>;
};
const ModalInternalContext = React.createContext<{ hide: VoidFunction }>({
  hide: () => {},
});

export const useModal = () => {
  const state = React.useContext(ModalInternalContext);
  return state;
};

export default function ModalProvider<M>({
  children,
  modalManager,
}: propType<M>) {
  const [state] = useStore(modalManager.store);

  return (
    <>
      {state.visibleModals.map((modalId) => {
        const Modal = modalManager.modals[modalId].component;
        const hide = () => modalManager.hideModal(modalId);

        return (
          <ModalInternalContext.Provider key={modalId} value={{ hide }}>
            <Modal />
          </ModalInternalContext.Provider>
        );
      })}
      {children}
    </>
  );
}
