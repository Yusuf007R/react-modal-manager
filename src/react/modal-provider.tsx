import React, { ReactNode, ComponentType, createContext, memo } from 'react';
import useStore from './hooks';

import ModalManager from '../modal-manager';

import { Modals, ModalType } from '../types';

export const ModalInternalContext = createContext<string | number | null>(null);
export const ModalManagerContext = createContext<ModalManager<any> | null>(
  null
);

type ModalProviderType<M extends Modals> = {
  children: ReactNode;
  modalManager: ModalManager<M>;
};

export default function ModalProvider<M extends Modals>({
  children,
  modalManager,
}: ModalProviderType<M>) {
  return (
    <ModalManagerContext.Provider value={modalManager}>
      <ModalRenderer modalManager={modalManager} />

      {children}
    </ModalManagerContext.Provider>
  );
}

type ModalRendererType<M extends Modals> = {
  modalManager: ModalManager<M>;
};

function ModalRenderer<M extends Modals>({
  modalManager,
}: ModalRendererType<M>) {
  const [state] = useStore(modalManager.store);

  return (
    <>
      {Object.values(state.mountedModals).map((modalData) => {
        const ModalComp =
          modalData.type === ModalType.PRE_REGISTERED
            ? modalManager.modals[modalData.key]
            : modalManager.runtimeModals[modalData.key];

        if (!Modal) return null;
        const key = modalData.key as string;
        return (
          <Modal
            key={key}
            ModalComp={ModalComp}
            modalProps={modalData.props}
            modalKey={key}
          />
        );
      })}
    </>
  );
}

type Modaltype = {
  modalProps: any;
  ModalComp: ComponentType<any>;
  modalKey: string;
};

const Modal = memo(function Modal({
  modalKey,
  modalProps,
  ModalComp,
}: Modaltype) {
  return (
    <ModalInternalContext.Provider value={modalKey}>
      <ModalComp {...(modalProps as any)} />
    </ModalInternalContext.Provider>
  );
});
