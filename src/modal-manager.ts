import React from 'react';
import ModalProvider from './modal-provider';

import createStore from './state';
import {
  MergeObjectUnion,
  modalManagerStoreType,
  ModalType,
  modals,
  runtimeModals,
} from './types';

export default class ModalManager<M> {
  id: number = 0;

  private initalModalStore: modalManagerStoreType<M> = {
    visibleModals: [],
  };
  readonly store = createStore(this.initalModalStore);

  modals: modals<M> = {} as modals<M>;

  runtimeModals: runtimeModals = {};

  builder<
    K extends string,
    P,
    V extends {
      [Key in K]: P;
    }
  >(key: K, comp: React.FC<P>) {
    // ? is this okay?, its not internally typesafe
    // ? but it should be okay from the outside
    (this.modals as any)[key] = {
      component: comp,
    };
    return this as unknown as ModalManager<MergeObjectUnion<M & V>>;
  }

  showModal<P extends keyof modals<M> | React.FC<any>>(
    modal: P,
    props: P extends React.FC<infer Props>
      ? Props
      : P extends keyof modals<M>
      ? M[P]
      : never
  ) {
    if (typeof modal === 'string') {
      this.store.setState((state) => {
        state.visibleModals.push({
          key: modal as keyof modals<M>,
          type: ModalType.PRE_REGISTERED,
          props,
        });
        return state;
      });
      return;
    }
    const id = this.id++;
    this.runtimeModals[id] = { component: modal as React.FC<any> };
    this.store.setState((state) => {
      state.visibleModals.push({
        key: id,
        type: ModalType.RUNTIME_MODAL,
        props,
      });
      return state;
    });
  }

  hideModal = (key: keyof modals<M> | string | number) => {
    let isRuntimeModal: boolean = false;
    this.store.setState((state) => {
      state.visibleModals = state.visibleModals.filter((modal) => {
        if (modal.key !== key) return true;
        isRuntimeModal = modal.type === ModalType.RUNTIME_MODAL;
        return false;
      });
      return state;
    });

    if (isRuntimeModal) {
      delete this.runtimeModals[key as string];
    }
  };

  Provider = ({ children }: { children: React.ReactNode }) =>
    ModalProvider({ children, modalManager: this });
}
