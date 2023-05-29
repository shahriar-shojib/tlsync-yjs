import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from '@hocuspocus/provider';
import { TAB_ID, TLRecord, TLUser, TldrawEditorConfig } from '@tldraw/tldraw';
import { FC, useMemo } from 'react';
import { Editor } from './Editor';

type Props = {
  ws: HocuspocusProviderWebsocket;
  room: string;
  userID: string;
};

export const Provider: FC<Props> = ({ room, userID, ws }) => {
  const config = useMemo(() => TldrawEditorConfig.default, []);

  const store = useMemo(() => {
    return config.createStore({
      instanceId: TAB_ID,
      userId: TLUser.createCustomId(userID),
    });
  }, [config, userID]);

  const provider = useMemo(() => {
    const provider = new HocuspocusProvider({
      name: room,
      websocketProvider: ws,

      onSynced: () => {
        const data: Record<string, TLRecord> = provider.document
          .getMap<TLRecord>('content')
          .toJSON();

        const mapped = Object.values(data);

        store.put(mapped, 'initialize');
      },
    });

    return provider;
  }, [room, store, ws]);

  return <Editor store={store} provider={provider} />;
};
