import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { storeType } from '.';

export default function useStore<T>(store: storeType<T>) {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return [state, store.setState] as const;
}
