import {
  App,
  InstancePresenceRecordType,
  TAB_ID,
  type TLInstancePresence,
  type TLRecord,
} from '@tldraw/tldraw';
import type { ID, RecordsDiff } from '@tldraw/tlstore';
import { useCallback, useEffect } from 'react';
import type { Awareness } from 'y-protocols/awareness.js';
import type { AwarenessMap, AwarenessMessage, HookProps } from './types';

const getNewAwarenessValue = (
  updated: TLRecord,
  awareness: Awareness,
  id: string
) => {
  const presence = awareness.getLocalState()![id] as TLInstancePresence;

  if (updated.typeName === 'instance') {
    const picked = pick(
      updated,
      'currentPageId',
      'followingUserId',
      'brush',
      'scribble',
      'screenBounds'
    );

    const pickedCursor = pick(updated.cursor, 'rotation', 'type');

    const merged: TLInstancePresence = {
      ...presence,
      ...picked,
      cursor: {
        ...presence.cursor,
        ...pickedCursor,
      },

      lastActivityTimestamp: Date.now(),
    };

    awareness.setLocalStateField(presence.id, merged);
  }

  if (updated.typeName === 'pointer') {
    const picked = pick(updated, 'x', 'y');

    const merged: TLInstancePresence = {
      ...presence,
      cursor: {
        ...presence.cursor,
        ...picked,
      },
      lastActivityTimestamp: Date.now(),
    };

    awareness.setLocalStateField(presence.id, merged);
  }

  if (updated.typeName === 'camera') {
    const picked = pick(updated, 'x', 'y', 'z');

    const merged: TLInstancePresence = {
      ...presence,
      camera: {
        ...picked,
      },
      lastActivityTimestamp: Date.now(),
    };

    awareness.setLocalStateField(presence.id, merged);
  }

  if (updated.typeName === 'instance_page_state') {
    const merged: TLInstancePresence = {
      ...presence,
      selectedIds: updated.selectedIds,
      lastActivityTimestamp: Date.now(),
    };

    awareness.setLocalStateField(presence.id, merged);
  }
};

function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = obj[key];
  });
  return ret;
}

const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const useAwareness = ({
  provider: { awareness },
  store,
  userID,
  userName,
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
    (app: App) => {
      const presence = InstancePresenceRecordType.create({
        instanceId: TAB_ID,
        userId: userID,
        userName,
        currentPageId: app.currentPageId,
        color: getRandomHexColor(),
      });
      app.store.put([presence]);

      awareness.setLocalStateField(presence.id, presence);

      const unsub = store.listen(({ changes, source }) => {
        if (source === 'remote') return;

        for (const [, updated] of Object.values(changes.updated)) {
          getNewAwarenessValue(updated, awareness, presence.id);
        }

        for (const added of Object.values(changes.added)) {
          getNewAwarenessValue(added, awareness, presence.id);
        }

        // for (const removed of Object.values(changes.removed)) {
        //   getNewAwarenessValue(removed, awareness, presence.id);
        // }
      });

      return unsub;
    },
    [awareness, store, userID, userName]
  );

  return onMount;
};
