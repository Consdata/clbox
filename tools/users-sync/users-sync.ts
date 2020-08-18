const firebase = require('firebase-admin');
const users = require('./users');

const [, , ...args] = process.argv;
const team = args[0];
const project = args[1];

if (!team || !project) {
  throw new Error(`expected team projectId`);
}

firebase.initializeApp({
  projectId: project
});

const userMap = users.users.reduce(
  (map, user) => ({
    ...map,
    [user.email]: user
  }),
  {}
);
const chapterLeaderMap = users.users
  .map(user => user.chapterLeader)
  .filter(onlyUnique)
  .reduce(
    (map, user) => ({
      ...map,
      [user]: user
    }),
    {}
  );

(async function () {
  console.log(`Update users with chapter link`);
  await updateCollection(`team/${team}/user/`, userMap, user => ({
      chapterLeader: userMap[user].chapterLeader
    }),
    true
  );

  console.log(`Update system users`);
  await updateCollection(`user/`, chapterLeaderMap, user => ({
      teams: {
        [team]: true
      }
    }),
    false
  );
})();


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function updateCollection(collection, users, updateFn: (user) => any, removeUnknown: boolean) {
  const userCollection = firebase.firestore().collection(collection);
  const existingUsers = await userCollection.get();
  const usersToSync = Object.keys(users).length;
  existingUsers.forEach(existingUser => {
    if (users[existingUser.id]) {
      if (existingUser.data().chapterLeader !== users[existingUser.id].chapterLeader) {
        console.log(`  update user ${existingUser.id}`);
        userCollection.doc(existingUser.id).update(updateFn(existingUser.id));
      }
      delete users[existingUser.id];
    } else if (removeUnknown) {
      console.log(`  remove user ${existingUser.id}`);
      userCollection.doc(existingUser.id).delete();
    }
  });
  Object.keys(users).forEach(user => {
    console.log(`  add user ${user}`);
    userCollection.doc(user).set(updateFn(user))
  });
  console.log(` synced users: ${usersToSync}`);
}
