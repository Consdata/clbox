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

async function syncInboxFilterStats(user: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) {
  const inbox = await firebase.firestore()
    .collection(`team/${team}/user/${user.id}/inbox`)
    .listDocuments();
  const messageExtracts = await Promise.all(inbox.map(async doc => {
    const message = (await doc.get()).data();
    return {
      user: message.type !== 'channel' && {
        email: message.for,
        name: message.forName,
        count: 0
      },
      channel: message.type === 'channel' && {
          name: message.for,
          shortName: message.forName,
          count: 0
      },
      labels: message.labels ?? [],
      date: message.date
    };
  }));
  const filterStats = messageExtracts.reduce(
    (stats, extract) => {
      extract.labels.forEach(label => {
        stats.labels[label] = (stats.labels[label] ?? 0) + 1
      });
      if (extract.user) {
        stats.users[extract.user.email] = stats.users[extract.user.email] || extract.user;
        stats.users[extract.user.email].count++;
      } else {
        stats.channels[extract.channel.name] = stats.channels[extract.channel.name] || extract.channel;
        stats.channels[extract.channel.name].count++;
      }
      return stats;
    },
    {users: {}, labels: {}, channels: {}} as any
  );
  console.log(`  syncing user inbox ${user.id}=${JSON.stringify(filterStats)}`);
  if (run) {
    await firebase.firestore()
      .collection(`team/${team}/user/${user.id}/data/`)
      .doc('inbox-filter-stats')
      .set(filterStats);

  }
}

(async function () {
  console.log(`Synchronize user filter stats`);
  const users = await firebase.firestore().collection(`team/${team}/user/`).listDocuments();
  await Promise.all(
    users
      .filter(user => limitScope ? limitScope.split(',').includes(user.id) : true)
      .map(async user => {
        await syncInboxFilterStats(user);
      })
  );
})();
