import React, {
  ReactNode,
  ComponentType,
  createContext,
  memo,
  useContext,
  useMemo,
} from 'react';

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
  const {
    isVisible,
    promise: { reject, resolve },
  } = state.mountedModals[_key];

  return useMemo(() => {
    if (!_key || isVisible === undefined) devLog('Modal key not found');
    const hide = () => manager?.hide(_key);
    const unMount = () => manager?.unMount(_key);
    return {
      isVisible: isVisible ?? false,
      hide,
      reject,
      resolve,
      unMount,
    };
  }, [_key, isVisible, reject, resolve, manager]);
};

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
