import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from '@hocuspocus/provider';
import { TAB_ID, TLRecord, TldrawEditorConfig } from '@tldraw/tldraw';
import { FC, useMemo } from 'react';
import { useRoomContext } from '../context/room.context';
import { Editor } from './Editor';

type Props = {
  ws: HocuspocusProviderWebsocket;
};

export const Provider: FC<Props> = ({ ws }) => {
  const config = useMemo(() => new TldrawEditorConfig({}), []);

  const { room } = useRoomContext();

  const store = useMemo(() => {
    return config.createStore({
      instanceId: TAB_ID,
    });
  }, [config]);

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

  return <Editor store={store} provider={provider} config={config} />;
};
