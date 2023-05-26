import { useAwareness } from './awareness';
import { useLocal } from './local';
import { useRemote } from './remote';
import { type HookProps } from './types';

export const useYjs = (props: HookProps) => {
  useRemote(props);
  useAwareness(props);
  useLocal(props);
};
