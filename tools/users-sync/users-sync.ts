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
const compareObjects = (a, b, ignoreFields: string[] = []) => {
  const aKeys = Object.keys(a).filter(key => ignoreFields.indexOf(key) < 0);
  const bKeys = Object.keys(b).filter(key => ignoreFields.indexOf(key) < 0);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.map(aKey => a[aKey] === b[aKey]).every(match => match);
}

(async function () {
  console.log(`Update users with chapter link`);
  await updateCollection(`team/${team}/user/`, userMap, (id, existingUser) => {
      if (!compareObjects(existingUser, userMap[id], ['stats'])) {
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

function isActive(user) {
  const expire = user.expireDate;
  if (!expire) {
    return true;
  }
  return new Date().getTime() < new Date(expire).getTime();
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
        userCollection.doc(existingUser.id).update(docUpdate);
      }
      delete users[existingUser.id];
    } else if (removeUnknown) {
      console.log(`  remove user ${existingUser.id}`);
      userCollection.doc(existingUser.id).delete();
    }
  });
  Object.keys(users).forEach(user => {
    const newUserDoc = updateFn(user, {});
    if(isActive(newUserDoc)) {
      console.log(`  add user ${user}`);
      userCollection.doc(user).set(newUserDoc)
    } else {
      console.log(`  user ${user} already inactive!`)
    }
  });
  console.log(` synced users: ${usersToSync}`);
}
