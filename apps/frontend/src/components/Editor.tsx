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

type Props = {
  store: TLStore;
  provider: HocuspocusProvider;
  config: TldrawEditorConfig;
  userID: string;
};

export const Editor: FC<Props> = ({ config, userID, ...props }) => {
  const { onMount } = useYjs({
    provider: props.provider,
    store: props.store,
    userID,
    userName: `User ${userID}`,
  });

  return (
    <div className="tldraw__editor">
      <TldrawEditor config={config} store={props.store} onMount={onMount}>
        <TldrawUiContextProvider>
          <ContextMenu>
            <Canvas />
          </ContextMenu>
          <TldrawUi overrides={{}} />
        </TldrawUiContextProvider>
      </TldrawEditor>
    </div>
  );
};
