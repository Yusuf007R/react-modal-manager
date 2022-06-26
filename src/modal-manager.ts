import type { ComponentPropsWithoutRef } from 'react';
import { _useModal } from './react/hooks';

import createStore from './store';
import {
  ModalManagerStoreType,
  Modals,
  Exact,
  GenericModalKey,
  ModalAPI,
  PromiseAPI,
} from './types';
import { devLog } from './utils';

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
  constructor(modals?: Exact<M>) {
    this.modals = modals ?? ({} as M);
  }

  /**
   * Show a modal.
   * @param {string | React.FC<any>} modal this can be either a string or a component.
   * If it is a component It will be first registered to the manager and then shown.
   * @returns {Promise<any>} promise that can be resolved from inside the modal component with the {@link ModalAPI.resolve resolve} function from the {@link ModalManager.useModal useModal} hook.
   *
   * If the promise is not resolved before unmounting the modal, the promise will be rejected.
   */
  show<Modal extends GenericModalKey<M> | React.FC<any>>(
    modal: Modal,
    props?: Modal extends React.FC<infer Props>
      ? Props
      : Modal extends keyof M
      ? ComponentPropsWithoutRef<M[Modal]>
      : any
  ): Promise<any> {
    let key = modal as string;
    if (typeof modal === 'function') {
      const id = `__RUNTIME-MODAL-${this.internalRuntimeModalId++}__`;
      this.runtimeModals[id] = modal as React.FC<any>;
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
        type: isRuntimeModal ? 'runtime' : 'registered',
        props: props ?? {},
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
      state.mountedModals[_key]!.isVisible = false;
      return state;
    });
  };

  /**
   * Unmount a modal.
   * This will unmount the modal if its a runtime modal. it will also completely remove the   modal from the manager. registered can be mounted again. By calling "show" method.
   *
   * @param {string} key Thet key of the modal to unMount.
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
      isRuntimeModal = mountedModal?.type === 'runtime';
      // mountedModal.promise.reject('Modal Unmounted before promise resolved');

      delete state.mountedModals[_key];
      return state;
    });
    if (isRuntimeModal) {
      delete this.runtimeModals[key as string | number];
    }
  };

  /**
   * Use this to access the {@link PromiseAPI PromiseAPI}
   * @param {string} key Thet key of the modal to get the promise from. If modal does not exists or is not mounted, it will return undefined.
   * @returns {PromiseAPI | undefined} promise API
   */
  getPromiseAPI = (key: GenericModalKey<M>): PromiseAPI | undefined => {
    const modal = this.store.getState().mountedModals[key as string];
    if (!modal) {
      devLog(`Modal key: ${key as string} not found`);
      return;
    }
    return modal.promise;
  };

  /**
   * Use this hook to access the {@link ModalAPI ModalAPI}.
   * @param {string} key Thet key of the modal to use. If you are inside a modal, you do not need to pass the key. The key will be automatically passed
   *
   * But if you are outside of a modal, you need to pass the key.
   * @returns {ModalAPI} a {@link ModalAPI ModalAPI} object.
   */
  useModal = _useModal as (key?: GenericModalKey<M>) => ModalAPI;
}
