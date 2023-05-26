import type { TLRecord } from '@tldraw/tldraw';
import { useEffect } from 'react';
import { awarenessKeys, contentKeys, type HookProps } from './types';

export const useLocal = ({
  provider: { awareness, document },
  store,
}: HookProps) => {
  //local changes
  useEffect(() => {
    const content = document.getMap<TLRecord>('content');

    const handleChange = (key: string, value: TLRecord) => {
      if (contentKeys.includes(value.typeName)) {
        content.set(key, value);
      }

      if (awarenessKeys.includes(value.typeName)) {
        awareness.setLocalStateField(key, value);
      }
    };

    const handleRemove = (key: string, _value: TLRecord) => {
      if (awarenessKeys.includes(_value.typeName)) {
        awareness.setLocalStateField(key, null);
      }

      content.delete(key);
    };

    const unsub = store.listen(history => {
      if (history.source === 'remote') return;

      document.transact(() => {
        Object.entries(history.changes.added).forEach(([key, value]) =>
          handleChange(key, value)
        );

        Object.entries(history.changes.removed).forEach(([key, value]) => {
          handleRemove(key, value);
        });

        Object.entries(history.changes.updated).forEach(([key, [, value]]) => {
          handleChange(key, value);
        });
      });
    });

    return unsub;
  }, [awareness, document, store]);
};
