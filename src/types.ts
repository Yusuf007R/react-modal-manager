// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type ModalManager from './modal-manager';

export enum ModalType {
  PRE_REGISTERED,
  RUNTIME_MODAL,
}

export type ModalAPI = {
  /**
   * Modal visibility state. Default: false (hidden)
   */
  isVisible: boolean;
  /**
   * Function to hide the modal.
   */
  hide: () => void;
  /**
   * Method to unmount the modal.
   * @see {@link ModalManager.unMount unMount} for more info.
   */
  unMount: () => void;
};

export type MountedModals = {
  key: string | number;
  isVisible: boolean;
  type: ModalType;
  props: { [key: string]: any };
};

export type ModalManagerStoreType = {
  mountedModals: {
    [key: string]: MountedModals;
  };
};

export type Modals = {
  [K: string]: ModalsData;
};

export type ModalsData = {
  component: React.FC<any>;
};

export type GenericModalKey<M> = keyof M | (string & {});

export type MergeObjectUnion<U> = U extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export type Exact<T> = {
  [P in keyof T]: T[P];
};
