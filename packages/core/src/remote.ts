import type { TLRecord } from '@tldraw/tldraw';
import type { ID, RecordsDiff } from '@tldraw/tlstore';
import { useEffect } from 'react';
import type { Transaction, YMapEvent } from 'yjs';
import type { HookProps } from './types';

type ChangeHandler = (events: YMapEvent<TLRecord>[], tx: Transaction) => void;

export const useRemote = ({ provider: { document }, store }: HookProps) => {
  //y.doc changes
  useEffect(() => {
    const content = document.getMap<TLRecord>('content');

    const handleChange: ChangeHandler = (events, tx) => {
      if (tx.origin === 'local') {
        return;
      }

      const diff: RecordsDiff<TLRecord> = {
        added: {},
        removed: {},
        updated: {},
      };

      for (const event of events) {
        event.keysChanged.forEach((key: ID<TLRecord>) => {
          const record = event.target.get(key);

          if (!record) {
            diff.removed[key] = store.get(key)!;
            return;
          }

          if (store.has(key)) {
            diff.updated[key] = [store.get(key)!, record];
            return;
          }

          diff.added[key] = record;
        });
      }

      store.mergeRemoteChanges(() => {
        store.applyDiff(diff);
      });
    };

    content.observeDeep(handleChange as any);

    return () => {
      content.unobserveDeep(handleChange as any);
    };
  }, [document, store]);
};
