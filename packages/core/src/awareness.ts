import type { TLRecord } from '@tldraw/tldraw';
import type { RecordsDiff } from '@tldraw/tlstore';
import { useEffect } from 'react';
import type { AwarenessMap, AwarenessMessage, HookProps } from './types';

export const useAwareness = ({ provider: { awareness }, store }: HookProps) => {
  //awareness
  useEffect(() => {
    const awarenessHandler = (
      { added, removed, updated }: AwarenessMessage,
      tx: any
    ) => {
      if (tx === 'local') {
        return;
      }

      const iter = (clientID: number): [string, TLRecord][] => {
        const state = awareness.getStates() as AwarenessMap;

        const awarenessValue = state.get(clientID);

        if (!awarenessValue) {
          return [];
        }

        return Object.entries(awarenessValue);
      };

      const diff: RecordsDiff<TLRecord> = {
        added: {},
        removed: {},
        updated: {},
      };

      for (const add of added) {
        for (const [key, value] of iter(add)) {
          diff.added[key] = value;
        }
      }

      for (const update of updated) {
        for (const [_, value] of iter(update)) {
          const storeValue = store.get(value.id);

          if (!storeValue) {
            diff.added[value.id] = value;
            continue;
          }

          diff.updated[value.id] = [storeValue, value];
        }
      }

      for (const remove of removed) {
        for (const [key, value] of iter(remove)) {
          diff.removed[key] = value;
        }
      }

      store.mergeRemoteChanges(() => {
        store.applyDiff(diff);
      });
    };

    awareness.on('update', awarenessHandler);

    return () => {
      awareness.off('update', awarenessHandler);
      awareness.setLocalState(null);
    };
  }, [awareness, store]);
};
