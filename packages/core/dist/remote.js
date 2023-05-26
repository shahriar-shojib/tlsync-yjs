import { useEffect } from 'react';
export const useRemote = ({ provider: { document }, store }) => {
    //y.doc changes
    useEffect(() => {
        const content = document.getMap('content');
        const handleChange = (events, tx) => {
            if (tx.origin === 'local') {
                return;
            }
            const diff = {
                added: {},
                removed: {},
                updated: {},
            };
            for (const event of events) {
                event.keysChanged.forEach((key) => {
                    const record = event.target.get(key);
                    if (!record) {
                        diff.removed[key] = store.get(key);
                        return;
                    }
                    if (store.has(key)) {
                        diff.updated[key] = [store.get(key), record];
                        return;
                    }
                    diff.added[key] = record;
                });
            }
            store.mergeRemoteChanges(() => {
                store.applyDiff(diff);
            });
        };
        content.observeDeep(handleChange);
        return () => {
            content.unobserveDeep(handleChange);
        };
    }, [document, store]);
};
//# sourceMappingURL=remote.js.map