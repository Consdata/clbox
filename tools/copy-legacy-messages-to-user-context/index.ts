import * as firebase from 'firebase-admin';

const [, , ...args] = process.argv;
const team = args[0];
const project = args[1];
const run = args[2] === 'true' || false;
const limitScope = args[3];

if (!team || !project) {
  throw new Error(`expected team projectId`);
}

firebase.initializeApp({
  projectId: project
});

(async function () {
  console.log(`Copy inbox/sent messages`);
  const users = await firebase.firestore().collection(`team/${team}/user/`).listDocuments();
  await Promise.all(
    users
      .filter(user => limitScope ? limitScope.split(',').includes(user.id) : true)
      .map(async user => {
        const inbox = await firebase.firestore()
          .collection(`team/${team}/inbox/${user.id}/message`)
          .listDocuments()

        await Promise.all(inbox.map(async message => {
          const targetDocRef = user.collection('inbox').doc(message.id);
          if (!(await targetDocRef.get()).exists) {
            const srcDoc = await message.get();
            console.log(`    syncing inbox message: ${message.path} => ${targetDocRef.path}`)
            if (run) {
              await targetDocRef.set(srcDoc.data());
            }
          }
        }));

        const sent = await firebase.firestore()
          .collection(`team/${team}/sent/${user.id}/message`)
          .listDocuments();
        await Promise.all(sent.map(async message => {
          const targetDocRef = user.collection('sent').doc(message.id);
          if (!(await targetDocRef.get()).exists) {
            const srcDoc = await message.get();
            console.log(`     syncing sent message: ${message.path} => ${targetDocRef.path}`)
            if (run) {
              await targetDocRef.set(srcDoc.data());
            }
          }
        }));
      })
  );
})();
