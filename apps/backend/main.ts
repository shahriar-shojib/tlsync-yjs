import { Database } from '@hocuspocus/extension-database';
import { Server } from '@hocuspocus/server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import * as Y from 'yjs';

const server = Server.configure({
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const doc = await readFile(`./data/${documentName}.bin`).catch(
          () => null
        );

        if (doc) {
          console.log('doc loaded from disk', documentName);
        }

        return doc;
      },
      store: async ({ documentName, state }) => {
        await writeFile(`./data/${documentName}.bin`, state);
      },
    }),
  ],

  onLoadDocument: async ({ documentName }) => {
    const doc = new Y.Doc();

    console.log('doc created', documentName);

    const content = doc.getMap('content');

    return doc;
  },

  onStoreDocument: async ({ documentName, document }) => {
    await writeFile(
      `./data/${documentName}.json`,
      JSON.stringify(document.getMap('content').toJSON())
    );
  },
});

const main = async () => {
  await mkdir('./data', { recursive: true }).catch(() => null);
  await server.listen(12000);
  console.log('Server is running on port 12000');
};

main();
