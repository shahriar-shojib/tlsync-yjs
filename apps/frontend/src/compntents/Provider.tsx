import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from '@hocuspocus/provider';
import { TAB_ID, TLUser, TldrawEditorConfig } from '@tldraw/tldraw';
import { FC, useMemo, useState } from 'react';
import { Editor } from './Editor';

type Props = {
  ws: HocuspocusProviderWebsocket;
  room: string;
  userID: string;
};

export const Provider: FC<Props> = ({ room, userID, ws }) => {
  const config = useMemo(() => TldrawEditorConfig.default, []);

  const [loading, setLoading] = useState(true);

  const provider = useMemo(() => {
    return new HocuspocusProvider({
      name: room,
      websocketProvider: ws,

      onSynced: () => {
        setLoading(false);
      },
    });
  }, [room, ws]);

  const store = useMemo(() => {
    return config.createStore({
      instanceId: TAB_ID,
      userId: TLUser.createCustomId(userID),
      initialData: loading ? {} : provider.document.getMap('content').toJSON(),
    });
  }, [config, loading, provider.document, userID]);

  if (loading) return <div>loading</div>;

  return <Editor store={store} provider={provider} />;
};
