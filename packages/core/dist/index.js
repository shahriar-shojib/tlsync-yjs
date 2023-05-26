import { useAwareness } from './awareness';
import { useLocal } from './local';
import { useRemote } from './remote';
import {} from './types';
export const useYjs = (props) => {
    useRemote(props);
    useAwareness(props);
    useLocal(props);
};
//# sourceMappingURL=index.js.map