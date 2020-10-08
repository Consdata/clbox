const firebase = require('firebase-admin');
const users = require('./users/users');

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
const compareObjects = (a, b) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.map(aKey => a[aKey] === b[aKey]).every(match => match);
}

(async function () {
  console.log(`Update users with chapter link`);
  await updateCollection(`team/${team}/user/`, userMap, (id, existingUser) => {
      // TODO: init and rewrite old stats?
      if (!compareObjects(existingUser, userMap[id])) {
        return userMap[id];
      }
    },
    true
  );

  console.log(`Update system users`);
  await updateCollection(`user/`, chapterLeaderMap, (id, existingUser) => {
      if (!existingUser.teams[team]) {
        return {
          teams: {
            [team]: true
          }
        };
      }
    },
    false
  );
})();


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function updateCollection(collection, users, updateFn: (id, existingUser) => any, removeUnknown: boolean) {
  const userCollection = firebase.firestore().collection(collection);
  const existingUsers = await userCollection.get();
  const usersToSync = Object.keys(users).length;
  existingUsers.forEach(existingUser => {
    if (users[existingUser.id]) {
      const docUpdate = updateFn(existingUser.id, existingUser.data());
      if (docUpdate) {
        console.log(`doc update for user: ${existingUser.id}`);
        userCollection.doc(existingUser.id).set(docUpdate);
      }
      delete users[existingUser.id];
    } else if (removeUnknown) {
      console.log(`  remove user ${existingUser.id}`);
      userCollection.doc(existingUser.id).delete();
    }
  });
  Object.keys(users).forEach(user => {
    console.log(`  add user ${user}`);
    const newUserDoc = updateFn(user, {});
    userCollection.doc(user).set(newUserDoc)
  });
  console.log(` synced users: ${usersToSync}`);
}
