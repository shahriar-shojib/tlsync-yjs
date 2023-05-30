import {
  InstancePresenceRecordType,
  type TLInstancePresence,
  type TLStore,
} from '@tldraw/tldraw';
import { computed, type Signal } from 'signia';
import { PresenceUserAtom } from './types';

/**
 *
 * source: https://github.com/tldraw/tldraw/blob/main/packages/tlschema/src/createPresenceStateDerivation.ts
 *
 */
export const createInstancePresenceAtom =
  ($user: Signal<PresenceUserAtom>) =>
  (store: TLStore): Signal<TLInstancePresence | null> => {
    const $instance = store.query.record('instance', () => ({
      id: { eq: store.props.instanceId },
    }));

    const $pageState = store.query.record('instance_page_state', () => ({
      instanceId: { eq: store.props.instanceId },
      pageId: { eq: $instance.value?.currentPageId ?? ('' as any) },
    }));

    const $camera = store.query.record('camera', () => ({
      id: { eq: $pageState.value?.cameraId ?? ('' as any) },
    }));

    const $pointer = store.query.record('pointer');

    return computed('instancePresence', () => {
      const pageState = $pageState.value;
      const instance = $instance.value;
      const camera = $camera.value;
      const pointer = $pointer.value;
      const user = $user.value;
      if (!pageState || !instance || !camera || !pointer || !user) {
        return null;
      }

      return InstancePresenceRecordType.create({
        id: InstancePresenceRecordType.createCustomId(store.props.instanceId),
        instanceId: store.props.instanceId,
        selectedIds: pageState.selectedIds,
        brush: instance.brush,
        scribble: instance.scribble,
        userId: user.id,
        userName: user.name,
        followingUserId: instance.followingUserId,
        camera: {
          x: camera.x,
          y: camera.y,
          z: camera.z,
        },
        color: user.color,
        currentPageId: instance.currentPageId,
        cursor: {
          x: pointer.x,
          y: pointer.y,
          rotation: instance.cursor.rotation,
          type: instance.cursor.type,
        },
        lastActivityTimestamp: pointer.lastActivityTimestamp,
        screenBounds: instance.screenBounds,
      });
    });
  };
