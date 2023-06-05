import { type TLRecord } from '@tldraw/tldraw';
import type { ID, RecordsDiff } from '@tldraw/tlstore';
import { useEffect } from 'react';
import { atom, react } from 'signia';
import { createInstancePresenceAtom } from './instance-presence.atom';
import type {
  AwarenessMap,
  AwarenessMessage,
  HookProps,
  PresenceUserAtom,
} from './types';
import { getRandomHexColor, useCleanup } from './utils';

export const useAwareness = ({
  provider: { awareness },
  store,
  userID,
  userName,
  color = getRandomHexColor(),
}: HookProps) => {
  useCleanup(() => {
    awareness.setLocalState(null);
  });

  //awareness
  useEffect(() => {
    const awarenessToUserMap = new Map<number, TLRecord>();

    const awarenessHandler = (
      { added, removed, updated }: AwarenessMessage,
      tx: any
    ) => {
      if (tx === 'local') {
        return;
      }

      const iter = (clientID: number): [ID<any>, TLRecord][] => {
        const state = awareness.getStates() as AwarenessMap;

        const awarenessValue = state.get(clientID);

        if (!awarenessValue) {
          return [];
        }

        return Object.entries(awarenessValue) as [ID<any>, TLRecord][];
      };

      const diff: RecordsDiff<TLRecord> = {
        added: {},
        removed: {},
        updated: {},
      };

      for (const add of added) {
        for (const [key, value] of iter(add)) {
          diff.added[key] = value;

          awarenessToUserMap.set(add, value);
        }
      }

      for (const update of updated) {
        for (const [_, value] of iter(update)) {
          const storeValue = store.get(value.id);

          if (!storeValue) {
            diff.added[value.id] = value;
            awarenessToUserMap.set(update, value);

            continue;
          }

          diff.updated[value.id] = [storeValue, value];
          awarenessToUserMap.set(update, value);
        }
      }

      for (const remove of removed) {
        const state = awarenessToUserMap.get(remove);

        if (!state) {
          continue;
        }

        const storeValue = store.get(state.id);

        if (!storeValue) {
          continue;
        }

        diff.removed[storeValue.id] = storeValue;
      }

      store.mergeRemoteChanges(() => {
        store.applyDiff(diff);
      });
    };

    awareness.on('update', awarenessHandler);

    return () => {
      awareness.off('update', awarenessHandler);

      awarenessToUserMap.clear();
    };
  }, [awareness, store]);

  useEffect(() => {
    const userData: PresenceUserAtom = {
      id: userID,
      color,
      name: userName,
    };

    const user = atom('_instance_presence_user_atom', userData);

    const computedPresence = createInstancePresenceAtom(user)(store);

    const stop = react('presence_updater', () => {
      const presence = computedPresence.value;

      if (!presence) {
        return;
      }

      awareness.setLocalStateField(presence.id, presence);
    });

    return () => {
      stop();
    };
  }, [awareness, color, store, userID, userName]);
};
