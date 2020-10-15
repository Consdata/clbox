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
    console.log(`Looking for messages in sent`);
    const sentCollection = firebase.firestore().collection(`team/${team}/sent/`);
    const userCollection = firebase.firestore().collection(`team/${team}/user/`);
    const users = await sentCollection.listDocuments();
    await Promise.all(
      users.filter(user => user.id !== `failed-to-deliver`)
        .map(async user => {
          const stats = {};
          const messages = await user.collection('message').get();
          messages.forEach(message => {
            const date = message.data().date.substring(0, 10);
            stats[date] = (stats[date] ?? 0) + 1;
          });
          await userCollection.doc(user.id).update({
            stats: {
              2020: { // quick and dirty
                ...stats,
                summary: Object.values(stats).reduce((sum: number, current: number) => sum + current, 0)
              }
            }
          })
        })
    );
  })();
})();
