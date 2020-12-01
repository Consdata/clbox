(() => {
    const firebase = require('firebase-admin');

    const [, , ...args] = process.argv;
    const team = args[0];
    const project = args[1];

    if (!team || !project) {
        throw new Error(`expected team projectId`);
    }

    firebase.initializeApp({
        projectId: project
    });

    (async function () {
        console.log(`Looking for messages in inbox`);
        const sent = firebase.firestore().collection(`team/${team}/sent/`);
        const users = await sent.listDocuments();
        const userMessages: any[][] = await Promise.all(users
            .filter(user => user.id !== `failed-to-deliver`)
            .map(user => {
                console.log(`Looking for user inbox messages [user=${user.id}]`);
                return user.collection('message').get().then(snapshot => snapshot.docs.map(message => ({
                    id: message.id,
                    userSent: user.id,
                    ...message.data()
                })));
            }));
        const messages = userMessages.reduce((all, user) => [...all, ...user], []);
        const wrongSentMessages = messages.filter(message => message.userSent !== message.from);
        console.log(`wrongSentMessages=${JSON.stringify(wrongSentMessages?.map(message => message.id))}`);
    })();
})();
