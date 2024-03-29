import { useContext, useMemo } from 'react';
import ModalManager from '../modal-manager';
import { ModalInternalContext, ModalManagerContext } from './modal-provider';

import { GenericModalKey, ModalAPI } from '../types';
import { devLog } from '../utils';

import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { setStateArg, storeType } from '../store';

/**
 *
 * @param store The store to use.
 * It will subscribe to the store and update the state when the store changes.
 * This should only be use internally by the modal manager.
 * DO NOT USE THIS HOOK DIRECTLY.
 * @returns {readonly [T, (arg: setStateArg<T>) => void]}
 */
export default function useStore<T>(
  store: storeType<T>
): readonly [T, (arg: setStateArg<T>) => void] {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return [state, store.setState] as const;
}

//* the JSDOC for this hook is in the modal-manager.ts file.
export const _useModal = (key?: GenericModalKey<any>): ModalAPI => {
  const modalKey = useContext(ModalInternalContext);
  const manager = useContext(ModalManagerContext) as ModalManager<any>;
  const _key = (key || modalKey || '') as string;
  const [state] = useStore(manager.store);
  const modal = state.mountedModals[_key]!;
  const isVisible = modal?.isVisible;

  return useMemo(() => {
    if (!_key || isVisible === undefined) devLog('Modal key not found');

    return {
      isVisible: isVisible ?? false,
      hide: () => manager?.hide(_key),
      reject: modal.promise.reject,
      resolve: modal.promise.resolve,
      unMount: () => manager?.unMount(_key),
    };
  }, [_key, isVisible, manager, modal.promise.reject, modal.promise.resolve]);
};
