import { useEffect } from 'react';
import { awarenessKeys, contentKeys } from './types';
export const useLocal = ({ provider: { awareness, document }, store, }) => {
    //local changes
    useEffect(() => {
        const content = document.getMap('content');
        const handleChange = (key, value) => {
            if (contentKeys.includes(value.typeName)) {
                content.set(key, value);
            }
            if (awarenessKeys.includes(value.typeName)) {
                awareness.setLocalStateField(key, value);
            }
        };
        const handleRemove = (key, _value) => {
            if (awarenessKeys.includes(_value.typeName)) {
                awareness.setLocalStateField(key, null);
            }
            content.delete(key);
        };
        const unsub = store.listen(history => {
            if (history.source === 'remote')
                return;
            document.transact(() => {
                Object.entries(history.changes.added).forEach(([key, value]) => handleChange(key, value));
                Object.entries(history.changes.removed).forEach(([key, value]) => {
                    handleRemove(key, value);
                });
                Object.entries(history.changes.updated).forEach(([key, [, value]]) => {
                    handleChange(key, value);
                });
            });
        });
        return unsub;
    }, [awareness, document, store]);
};
//# sourceMappingURL=local.js.map