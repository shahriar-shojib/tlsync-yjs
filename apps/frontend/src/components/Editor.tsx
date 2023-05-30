import { HocuspocusProvider } from '@hocuspocus/provider';
import {
  Canvas,
  ContextMenu,
  TLStore,
  TldrawEditor,
  TldrawEditorConfig,
  TldrawUi,
  TldrawUiContextProvider,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/editor.css';
import '@tldraw/tldraw/ui.css';
import { useYjs } from '@tlsync-yjs/core';
import { FC } from 'react';
import { useRoomContext } from '../context/room.context';

type Props = {
  store: TLStore;
  provider: HocuspocusProvider;
  config: TldrawEditorConfig;
};

export const Editor: FC<Props> = ({ config, ...props }) => {
  const { userID, name } = useRoomContext();

  const { onMount } = useYjs({
    provider: props.provider,
    store: props.store,
    userID,
    userName: name,
  });

  return (
    <div className="tldraw__editor">
      <TldrawEditor config={config} store={props.store} onMount={onMount}>
        <TldrawUiContextProvider>
          <ContextMenu>
            <Canvas />
          </ContextMenu>
          <TldrawUi />
        </TldrawUiContextProvider>
      </TldrawEditor>
    </div>
  );
};
