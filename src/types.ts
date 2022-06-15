export enum ModalType {
  PRE_REGISTERED,
  RUNTIME_MODAL,
}

type visibleModalType<M> =
  | {
      key: keyof modals<M>;
      type: ModalType.PRE_REGISTERED;
      props: M[keyof modals<M>];
    }
  | {
      key: string | number;
      type: ModalType.RUNTIME_MODAL;
      props: { [key: string]: any };
    };

export type modalManagerStoreType<M> = {
  visibleModals: visibleModalType<M>[];
};

export type modalInfo<P> = {
  component: React.FC<P>;
};

export type modals<M> = {
  [K in keyof M]: modalInfo<M[K]>;
};

export type runtimeModals = {
  [key: string]: modalInfo<any>;
};

//utils types

export type MergeObjectUnion<U> = U extends infer O
  ? { [K in keyof O]: O[K] }
  : never;
