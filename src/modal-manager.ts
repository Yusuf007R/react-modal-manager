import type { ComponentPropsWithoutRef } from 'react';
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

  /**
   * ModalManager
   * @param {Modals} modals  Initial modals to be registered
   */
  constructor(modals: Exact<M>) {
    this.modals = modals;
  }

  /**
   * Show a modal.
   * @param {string | React.FC<any>} modal this can be either a string or a component.
   * If it is a component It will be first registered to the manager and then shown.
   * @return {Promise<any>} A promise that can be resolved from inside the modal component with the resolve function from the {@link ModalManager.useModal useModal} hook.
   * If the promise is not resolved before unmounting the modal, the promise will be rejected.
   */
  show<Modal extends GenericModalKey<M> | React.FC<any>>(
    modal: Modal,
    props: Modal extends React.FC<infer Props>
      ? Props
      : Modal extends keyof M
      ? ComponentPropsWithoutRef<M[Modal]['component']>
      : any
  ): Promise<any> {
    let key = modal as string;
    if (typeof modal === 'function') {
      const id = `__RUNTIME-MODAL-${this.internalRuntimeModalId++}__`;
      this.runtimeModals[id] = { component: modal as React.FC<any> };
      key = id;
    }

    const isRuntimeModal = this.runtimeModals[key] !== undefined;

    if (!isRuntimeModal && this.modals[key] === undefined) {
      const msg = `Modal key: ${modal as string} not found`;
      devLog(msg);
      return Promise.reject(msg) as Promise<any>;
    }

    let reject: (value: any) => void;
    let resolve: (value: any) => void;
    const promise = new Promise<any>((res, rej) => {
      reject = rej;
      resolve = res;
    });

    this.store.setState((state) => {
      state.mountedModals[key] = {
        key: key,
        type: isRuntimeModal
          ? ModalType.RUNTIME_MODAL
          : ModalType.PRE_REGISTERED,
        props,
        isVisible: true,
        promise: {
          resolve,
          reject,
          value: promise,
        },
      };
      return state;
    });

    return promise;
  }

  /**
   * Hide a modal.
   * This will only hide the modal (set isVisible to false).
   * it Will not unmount the modal.
   * @see {@link ModalManager.unMount unMount} for unmounting the modal.
   * @param {string} key Thet key of the modal to hide.
   */
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

  /**
   * Unmount a modal.
   * This will unmount the modal if its a runtime modal. it will also completely remove the   modal from the manager. Pre-registered can be mounted again. By calling "show" method.
   * @param {string} key Thet key of the modal to unMount.
   * If the modal promise is not resolved before unmounting the modal, the promise will be rejected.
   */
  unMount = (key: GenericModalKey<M>) => {
    let isRuntimeModal = false;
    const _key = key as string;
    if (this.store.getState().mountedModals[_key] === undefined) {
      devLog(`Modal key: ${_key} not found`);
      return;
    }

    this.store.setState((state) => {
      const mountedModal = state.mountedModals[_key];
      isRuntimeModal = mountedModal.type === ModalType.RUNTIME_MODAL;
      //* if the promise is not resolved yet, it will be rejected, if not it will just be ignored.
      mountedModal.promise.reject('Modal Unmounted before promise resolved');

      delete state.mountedModals[_key];
      return state;
    });
    if (isRuntimeModal) {
      delete this.runtimeModals[key as string | number];
    }
  };

  useModal = _useModal as (key?: GenericModalKey<M>) => ModalAPI;
}
