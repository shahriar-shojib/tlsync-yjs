import type { TLRecord, TLStore } from '@tldraw/tldraw';
import type { Awareness } from 'y-protocols/awareness.js';
import type { Doc } from 'yjs';
export declare const awarenessKeys: Array<TLRecord['typeName']>;
export declare const contentKeys: Array<TLRecord['typeName']>;
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
