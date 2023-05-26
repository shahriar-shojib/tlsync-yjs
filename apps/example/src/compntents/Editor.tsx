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

export const Editor: FC<{
  store: TLStore;
  provider: HocuspocusProvider;
}> = props => {
  useYjs(props);

  return (
    <div className="tldraw__editor">
      <TldrawEditor
        store={props.store}
        onMount={app => ((window as any).app = app)}
      >
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
