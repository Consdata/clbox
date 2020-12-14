function changedArray(before, after) {
    const newItems = [];
    const missingItems = [];

    before.forEach(item => {
        if (!after.includes(item)) {
            missingItems.push(item);
        }
    });
    after.forEach(item => {
        if (!before.includes(item)) {
            newItems.push(item);
        }
    });

    return [newItems, missingItems];
}

function asStatsUpdate(firebase, before, after) {
    const update = {};

    const [newLabels, removedLabels] = changedArray(before.labels ?? [], after.labels ?? []);
    newLabels.forEach(label => update['labels'] = {
            ...update['labels'],
            [label]: firebase.firestore.FieldValue.increment(1)
        }
    );
    removedLabels.forEach(label => update['labels'] = {
            ...update['labels'],
            [label]: firebase.firestore.FieldValue.increment(-1)
        }
    );

    return update;
}

export const updateFilterStatsAfterInboxChangeFactory = (
    functions: import('firebase-functions').FunctionBuilder,
    config: import('firebase-functions').config.Config,
    firebase: typeof import('firebase-admin')
) => functions.firestore.document('team/{team}/user/{user}/inbox/{messageId}').onUpdate(
    async (change, context) => {
        console.log(`Update user filter stats after inbox message update`);
        const statsDoc = firebase.firestore()
            .collection(`team/${context.params.team}/user/${context.params.user}/data`)
            .doc(`inbox-filter-stats`);
        const update = asStatsUpdate(firebase, change.before.data(), change.after.data());
        console.log(`${statsDoc.path}=>${JSON.stringify(update)}`);
        await statsDoc.set(update, {merge: true});
    }
)
