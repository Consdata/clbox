import * as nodeFetch from 'node-fetch';
import {PendingKudosMessage} from './pending-kudos-message';
import {SlackUser} from './slack-user';

import {SlackUserIndex} from './slack-user-index';
import {SlackUserProfile} from './slack-user-profile';

async function sendSlackMessage(slackHttpHeaders: { Authorization: string; 'Content-type': string }, channel: string, message: string) {
  await nodeFetch(`https://slack.com/api/chat.postMessage`, {
    method: 'POST',
    headers: slackHttpHeaders,
    body: JSON.stringify({
      channel: channel,
      text: message
    })
  })
}

function inboxMessage(forUser: SlackUserProfile, fromUser: SlackUserProfile, payload: PendingKudosMessage) {
  return {
    date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    for: forUser.email,
    forName: forUser.display_name,
    from: fromUser.email,
    fromName: fromUser.display_name,
    message: payload.feedback
  };
}

export const sendFeedbackFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  config: import('firebase-functions').config.Config,
  firebase: typeof import('firebase-admin')) => {
  const slackHttpHeaders = {
    Authorization: `Bearer ${config.slack.bottoken}`,
    'Content-type': 'application/json'
  };
  const usersIndexPromise: Promise<SlackUserIndex> = nodeFetch(`https://slack.com/api/users.list`, {headers: slackHttpHeaders})
    .then(res => res.json())
    .then(res => res.members)
    .then(
      (users: SlackUser[]) => users.reduce((index, user) => ({
          ...index,
          [user.name]: user
        }),
        {}
      )
    );
  return functions.pubsub.topic('pending-slack-notifications').onPublish(
    async (message, context) => {
      const usersIndex = await usersIndexPromise;
      const payload: PendingKudosMessage = JSON.parse(Buffer.from(message.data, 'base64').toString());

      const fromUser: SlackUserProfile = usersIndex[payload.user]?.profile;
      const forUser: SlackUserProfile = usersIndex[payload.mention]?.profile;
      if (!forUser) {
        await sendSlackMessage(slackHttpHeaders, `@${payload.user}`, `User mentioned in feedback (${payload.mention}) not found.`);
      }

      const userCollection = firebase.firestore().collection(`team/${payload.team}/user/`);
      const chapterLeader = (await userCollection.doc(forUser.email).get())?.data()?.chapterLeader;
      if (chapterLeader !== undefined) {
        const inboxCollection = firebase.firestore().collection(`team/${payload.team}/inbox/${chapterLeader}/message`);
        await inboxCollection.add(inboxMessage(forUser, fromUser, payload));
      } else {
        await sendSlackMessage(slackHttpHeaders, `@${payload.user}`, `User mentioned in feedback (${payload.mention}) has no chapter leader.`);
      }
    }
  );
}
