import CreateStore from './state';

export type modalStateType = {
  isVisible: boolean;
};

export type modalType = {
  component: React.ComponentType;
  state: modalStateType;
};

export type storeType = {
  modals: {
    [key: string]: modalType;
  };
  // preRegisteredModals: T;
};

const defaultModalState: modalStateType = {
  isVisible: false,
};

function ModalManager() {
  const store = CreateStore({ modals: {} } as storeType);

  const addModal = (key: string, component: React.ComponentType) => {
    store.setState((state) => {
      state.modals[key] = {
        component,
        state: defaultModalState,
      };
      return state;
    });
  };

  const removeModal = (key: string) => {
    store.setState((state) => {
      delete state.modals[key];
      return state;
    });
  };

  const showModal = (key: string) => {
    store.setState((state) => {
      state.modals[key].state.isVisible = true;
      return state;
    });
  };

  const hideModal = (key: string) => {
    store.setState((state) => {
      state.modals[key].state.isVisible = false;
      return state;
    });
  };

  return { store };
}
export default ModalManager;
