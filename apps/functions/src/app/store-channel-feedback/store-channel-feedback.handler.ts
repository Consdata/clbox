import {PendingFeedbackMessage} from '../pending-feedback-message';

import {SlackUserProfile} from '../slack/slack-user-profile';
import {userList} from "../slack/fetch-user-list";

function now() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function message(fromUser: SlackUserProfile, payload: PendingFeedbackMessage) {
  return {
    date: now(),
    forSlack: payload.mention,
    from: fromUser.email,
    fromName: fromUser.display_name,
    fromSlack: payload.user,
    message: payload.feedback,
    type: 'channel'
  };
}

export const storeChannelFeedbackHandlerFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  config: import('firebase-functions').config.Config,
  firebase: typeof import('firebase-admin'),
  topic: string) => {
  return functions.pubsub.topic(topic).onPublish(
    async (topicMessage) => {
      const usersIndex = await userList(config.slack.bottoken);
      const payload: PendingFeedbackMessage = JSON.parse(Buffer.from(topicMessage.data, 'base64').toString());

      const fromUser: SlackUserProfile = usersIndex[payload.user]?.profile;
      const firestore = firebase.firestore();

      await firestore.runTransaction(async trn => {
        const inboxDoc = firestore.collection(`team/${payload.team}/channel/${payload.mention}/inbox`).doc();
        const sentDoc = firestore.collection(`team/${payload.team}/user/${fromUser.email}/sent-channel`).doc(inboxDoc.id);
        trn.set(inboxDoc, message(fromUser, payload));
        trn.set(sentDoc, message(fromUser, payload));
      });
    }
  );
}
