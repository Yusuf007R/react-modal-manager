import React, { createContext, Fragment, useContext, useMemo } from 'react';
import ModalManager from './modal-manager';

import useStore from './store/react';
import { GenericModalKey, ModalAPI, Modals, ModalType } from './types';
import devLog from './utils';

export const ModalInternalContext = createContext<string | number | null>(null);
const ModalManagerContext = createContext<ModalManager<any> | null>(null);

export const _useModal = (key?: GenericModalKey<any>): ModalAPI => {
  const modalKey = useContext(ModalInternalContext);
  const manager = useContext(ModalManagerContext) as ModalManager<any>;
  const _key = (key || modalKey || '') as string;
  const [state] = useStore(manager.store);
  const isVisible = state.mountedModals[_key]?.isVisible;

  return useMemo(() => {
    if (!_key || isVisible === undefined) devLog('Modal key not found');
    const hide = () => manager?.hide(_key);
    const unMount = () => manager?.unMount(_key);
    return {
      isVisible: isVisible ?? false,
      hide,
      unMount,
    };
  }, [isVisible, manager, _key]);
};

type ModalProviderType<M extends Modals> = {
  children: React.ReactNode;
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
    <Fragment>
      {Object.values(state.mountedModals).map((modalData) => {
        const ModalComp =
          modalData.type === ModalType.PRE_REGISTERED
            ? modalManager.modals[modalData.key]?.component
            : modalManager.runtimeModals[modalData.key]?.component;

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
    </Fragment>
  );
}

type Modaltype = {
  modalProps: any;
  ModalComp: React.ComponentType<any>;
  modalKey: string;
};

const Modal = React.memo(function Modal({
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
