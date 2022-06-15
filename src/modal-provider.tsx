import React from 'react';
import ModalManager from './modal-manager';

import useStore from './state/react';
import { ModalType } from './types';

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
      {state.visibleModals.map((modalData) => {
        const Modal =
          modalData.type === ModalType.PRE_REGISTERED
            ? modalManager.modals[modalData.key].component
            : modalManager.runtimeModals[modalData.key].component;

        const hide = () => modalManager.hideModal(modalData.key);

        return (
          <ModalInternalContext.Provider
            key={modalData.key as string}
            value={{ hide }}
          >
            <Modal {...(modalData.props as any)} />
          </ModalInternalContext.Provider>
        );
      })}
      {children}
    </>
  );
}
