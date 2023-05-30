import type { TLRecord, TLStore } from '@tldraw/tldraw';
import type { IdOf } from '@tldraw/tlstore';
import type { Awareness } from 'y-protocols/awareness.js';
import type { Doc } from 'yjs';

export const awarenessKeys: Array<TLRecord['typeName']> = ['instance_presence'];

export const contentKeys: Array<TLRecord['typeName']> = [
  'asset',
  'shape',
  'page',
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

export type AwarenessMap = Map<number, Record<IdOf<TLRecord>, TLRecord>>;

export type HookProps = {
  provider: YProvider;
  store: TLStore;
  userID: string;
  userName: string;
};
