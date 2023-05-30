import { App, type TLRecord } from '@tldraw/tldraw';
import type { ID, RecordsDiff } from '@tldraw/tlstore';
import { useCallback, useEffect } from 'react';
import { atom, react } from 'signia';
import { createInstancePresenceAtom } from './instance-presence.atom';
import type {
  AwarenessMap,
  AwarenessMessage,
  HookProps,
  PresenceUserAtom,
} from './types';
import { getRandomHexColor } from './utils';

export const useAwareness = ({
  provider: { awareness },
  store,
  userID,
  userName,
  color = getRandomHexColor(),
}: HookProps) => {
  const markAsLeaving = useCallback(() => {
    awareness.setLocalState(null);
  }, [awareness]);

  useEffect(() => {
    window.addEventListener('beforeunload', markAsLeaving);

    window.addEventListener('close', markAsLeaving);

    return () => {
      window.removeEventListener('beforeunload', markAsLeaving);
      window.removeEventListener('close', markAsLeaving);
    };
  }, [markAsLeaving]);

  //awareness
  useEffect(() => {
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

  const onMount = useCallback(
    (_app: App) => {
      const userData: PresenceUserAtom = {
        id: userID,
        color,
        name: userName,
      };

      const user = atom('userAtom', userData);

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
    },
    [awareness, color, store, userID, userName]
  );

  return onMount;
};
