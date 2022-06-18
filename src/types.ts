export enum ModalType {
  PRE_REGISTERED,
  RUNTIME_MODAL,
}

export type ModalAPI = {
  isVisible: boolean;
  hide: () => void;
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
