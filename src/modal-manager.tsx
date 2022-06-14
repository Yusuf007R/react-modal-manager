import React from 'react';
import ModalProvider from './modal-provider';

import createStore from './state';
import {
  ExtractProps,
  modalManagerStoreType,
  modalType,
  preRegisteredModals,
} from './types';

export default class ModalManager<M> {
  private initalModalStore: modalManagerStoreType = {
    visibleModals: [],
  };
  readonly store = createStore(this.initalModalStore);

  preRegisteredModals: preRegisteredModals<M>;

  constructor(preregistered: preRegisteredModals<M>) {
    this.preRegisteredModals = preregistered;
  }

  modals: {
    [key: string]: modalType<any>;
  } = {};

  addModal = (key: string, component: React.ComponentType<any>) => {
    this.store.setState((state) => {
      this.modals[key] = {
        component,
      };
      return state;
    });
  };

  removeModal = (key: string) => {
    this.store.setState((state) => {
      delete this.modals[key];

      return state;
    });
  };

  showModal<K extends keyof preRegisteredModals<M>>(
    modalKey: K,
    props: ExtractProps<M[K]>
  ) {}

  showRuntimeModal = (key: string) => {
    this.store.setState((state) => {
      state.visibleModals.push(key);
      return state;
    });
  };

  hideModal = (key: string) => {
    this.store.setState((state) => {
      state.visibleModals = state.visibleModals.filter(
        (modalKey) => modalKey !== key
      );
      return state;
    });
  };

  Provider = ({ children }: { children: React.ReactNode }) => (
    <ModalProvider modalManager={this}>{children}</ModalProvider>
  );
}
