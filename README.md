## Project structure

| path            | description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| `packages/core` | core library that handles yjs syncing and awareness                                     |
| `apps/frontend` | example frontend project to demonstrate how this library would work with tldraw and yjs |
| `apps/backend`  | example backend project to handle yjs sync with hocuspocus and persistence              |

## Development instructions

this project uses pnpm workspaces. to install dependencies, run `pnpm i` in the root directory.

## Scripts

| script              | description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm dev`          | runs frontend and backend in parallel, open http://localhost:5173/ in browser to visit frontend |
| `pnpm dev:packages` | runs dev on all packages, used for incremental build of packages when they change               |
