import type { TLRecord, TLStore } from '@tldraw/tldraw';
import type { Awareness } from 'y-protocols/awareness.js';
import type { Doc } from 'yjs';

export const awarenessKeys: Array<TLRecord['typeName']> = [
  'user',
  'user_presence',
  'instance_page_state',
  'instance',
  'user_document',
];

export const contentKeys: Array<TLRecord['typeName']> = [
  'shape',
  'page',
  'asset',
  'document',
];

export interface YProvider {
  document: Doc;
  awareness: Awareness;
}

export type AwarenessMessage = {
  added: number[];
  updated: number[];
  removed: number[];
};

export type AwarenessMap = Map<number, Record<string, TLRecord>>;

export type HookProps = {
  provider: YProvider;
  store: TLStore;
};
