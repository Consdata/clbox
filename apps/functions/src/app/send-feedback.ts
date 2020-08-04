import * as nodeFetch from 'node-fetch';
import {PendingKudosMessage} from './pending-kudos-message';
import {SlackUser} from './slack-user';

import {SlackUserIndex} from './slack-user-index';
import {SlackUserProfile} from './slack-user-profile';

function now() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

async function sendSlackMessage(slackHttpHeaders: { Authorization: string; 'Content-type': string }, channel: string, message: string) {
  await nodeFetch(`https://slack.com/api/chat.postMessage`, {
    method: 'POST',
    headers: slackHttpHeaders,
    body: JSON.stringify({
      channel: channel,
      text: message
    })
  });
}

function inboxMessage(forUser: SlackUserProfile, fromUser: SlackUserProfile, payload: PendingKudosMessage) {
  return {
    date: now(),
    for: forUser.email,
    forName: forUser.display_name,
    forSlack: payload.mention,
    from: fromUser.email,
    fromName: fromUser.display_name,
    fromSlack: payload.user,
    message: payload.feedback
  };
}

function failedToDeliverCollection(firebase: typeof import('firebase-admin'), team) {
  return firebase.firestore().collection(`team/${team}/inbox/failed-to-deliver/message`)
}

async function failedToSendFeedback(firebase: typeof import('firebase-admin'), headers, payload: PendingKudosMessage, error: string, message: string) {
  console.error(JSON.stringify({
    msg: error, payload
  }));
  return Promise.all([
    sendSlackMessage(headers, `@${payload.user}`, message),
    failedToDeliverCollection(firebase, payload.team).add({
      msg: error, date: now(), payload
    })
  ]);
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
        await failedToSendFeedback(
          firebase,
          slackHttpHeaders,
          payload,
          `Can't find user`,
          `User mentioned in feedback (${payload.mention}) not found.`
        );
      }

      const userCollection = firebase.firestore().collection(`team/${payload.team}/user/`);
      const chapterLeader = (await userCollection.doc(forUser.email).get())?.data()?.chapterLeader;
      if (chapterLeader !== undefined) {
        const inboxCollection = firebase.firestore().collection(`team/${payload.team}/inbox/${chapterLeader}/message`);
        await inboxCollection.add(inboxMessage(forUser, fromUser, payload));
      } else {
        await failedToSendFeedback(
          firebase,
          slackHttpHeaders,
          payload,
          `Can't find user chapter leader`,
          `User mentioned in feedback (${payload.mention}) has no chapter leader.`
        );
      }
    }
  );
}
