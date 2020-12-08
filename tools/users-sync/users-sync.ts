import * as firebase from 'firebase-admin';
import {users} from './users';
import {syncCollection} from "./sync-collection";
import {channels} from "./channels";

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
  console.log(`Users sync (run=${run})`);

  console.log(`Update users`);
  await syncCollection(
    run,
    limitScope,
    'team user',
    firebase.firestore().collection(`team/${team}/user/`),
    Object.values(users),
    user => user.email,
    ['stats']
  );

  console.log(`Update channels`)
  await syncCollection(
    run,
    limitScope,
    'channel',
    firebase.firestore().collection(`team/${team}/channel/`),
    channels,
    channel => channel.slackChannel,
    []
  );
})();
