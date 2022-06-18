import { ComponentPropsWithoutRef } from 'react';
import { _useModal } from './modal-provider';

import createStore from './store';
import {
  ModalManagerStoreType,
  ModalType,
  Modals,
  Exact,
  GenericModalKey,
  ModalAPI,
} from './types';
import devLog from './utils';

export default class ModalManager<M extends Modals> {
  private internalRuntimeModalId: number = 1;

  private initalModalStore: ModalManagerStoreType = {
    mountedModals: {},
  };
  readonly store = createStore(this.initalModalStore);

  modals: M;

  runtimeModals: Modals = {};

  constructor(modals: Exact<M>) {
    this.modals = modals;
  }

  show<Modal extends GenericModalKey<M> | React.FC<any>>(
    modal: Modal,
    props: Modal extends React.FC<infer Props>
      ? Props
      : Modal extends keyof M
      ? ComponentPropsWithoutRef<M[Modal]['component']>
      : any
  ) {
    let key: string | number = modal as string;
    if (typeof modal === 'function') {
      const id = this.internalRuntimeModalId++;
      this.runtimeModals[id] = { component: modal as React.FC<any> };
      key = id;
    }

    const isRuntimeModal = this.runtimeModals[key] !== undefined;

    if (!isRuntimeModal && this.modals[key] === undefined) {
      devLog(`Modal key: ${modal as string} not found`);
      return;
    }

    this.store.setState((state) => {
      state.mountedModals[key] = {
        key: key,
        type: isRuntimeModal
          ? ModalType.RUNTIME_MODAL
          : ModalType.PRE_REGISTERED,
        props,
        isVisible: true,
      };
      return state;
    });
  }

  hide = (key: GenericModalKey<M>) => {
    const _key = key as string;
    if (this.store.getState().mountedModals[_key] === undefined) {
      devLog(`Modal key: ${_key} not found`);
      return;
    }
    this.store.setState((state) => {
      state.mountedModals[_key].isVisible = false;
      return state;
    });
  };

  unMount = (key: GenericModalKey<M>) => {
    let isRuntimeModal = false;
    const _key = key as string;
    if (this.store.getState().mountedModals[_key] === undefined) {
      devLog(`Modal key: ${_key} not found`);
      return;
    }
    this.store.setState((state) => {
      state.mountedModals[_key].isVisible = false;
      isRuntimeModal =
        state.mountedModals[_key].type === ModalType.RUNTIME_MODAL;
      return state;
    });
    if (isRuntimeModal) {
      delete this.runtimeModals[key as string | number];
    }
  };

  useModal = _useModal as (key?: GenericModalKey<M>) => ModalAPI;
}
