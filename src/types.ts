export type modalManagerStoreType = {
  visibleModals: string[];
};

export type modalType<P> = {
  component: React.ComponentType<P>;
};

export type preRegisteredModals<M> = {
  [K in keyof M]: modalType<M[K]>;
};

//utils types

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends React.Component<infer TProps, any>
    ? TProps
    : TComponentOrTProps;
