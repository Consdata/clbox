function asStatsUpdate(firebase, message) {
    const update = {};

    (message.labels || []).forEach(label => update[`labels`] = {
        ...update['labels'],
        [label]: firebase.firestore.FieldValue.increment(-1)
    });
    if (message.type === 'channel') {
        update['channels'] = {
            ...update['channels'],
            [message.forSlack]: {
                count: firebase.firestore.FieldValue.increment(-1)
            }
        };
    } else {
        update['users'] = {
            ...update['users'],
            [message.for]: {
                count: firebase.firestore.FieldValue.increment(-1)
            }
        };
    }

    return update;
}

export const updateFilterStatsAfterInboxDeleteFactory = (
    functions: import('firebase-functions').FunctionBuilder,
    config: import('firebase-functions').config.Config,
    firebase: typeof import('firebase-admin')
) => functions.firestore.document('team/{team}/user/{user}/inbox/{messageId}').onDelete(
    async (change, context) => {
        console.log(`Update user filter stats after inbox message delete`);
        const statsDoc = firebase.firestore()
            .collection(`team/${context.params.team}/user/${context.params.user}/data`)
            .doc(`inbox-filter-stats`);
        const update = asStatsUpdate(firebase, change.data());
        console.log(`${statsDoc.path}=>${JSON.stringify(update)}`);
        await statsDoc.set(update, {merge: true});
    }
)
