import { HocuspocusProvider } from '@hocuspocus/provider';
import {
  Canvas,
  ContextMenu,
  TLStore,
  TldrawEditor,
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
};

export const Editor: FC<Props> = props => {
  useYjs(props);

  return (
    <div className="tldraw__editor">
      <TldrawEditor store={props.store}>
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
