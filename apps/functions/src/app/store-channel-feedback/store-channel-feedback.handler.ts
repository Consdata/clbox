import {PendingFeedbackMessage} from '../pending-feedback-message';

import {SlackUserProfile} from '../slack/slack-user-profile';
import {userList} from "../slack/fetch-user-list";
import {sendSlackMessage} from "../slack/send-slack-message";

function now() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function asMessage(channel, fromUser: SlackUserProfile, payload: PendingFeedbackMessage) {
    return {
        date: now(),
        for: payload.mention,
        forName: channel.short_name,
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

            const channel = await firestore.collection(`team/${payload.team}/channel`)
                .doc(payload.mention)
                .get();

            if (channel.exists) {
                await firestore.runTransaction(async trn => {
                    const channelInboxDoc = firestore.collection(`team/${payload.team}/channel/${payload.mention}/inbox`).doc();
                    const sentDoc = firestore.collection(`team/${payload.team}/user/${fromUser.email}/sent`).doc(channelInboxDoc.id);
                    const userInboxDocs = channel.data()
                        .managers
                        .map(
                            email => firestore
                                .collection(`team/${payload.team}/user/${email}/inbox`)
                                .doc(channelInboxDoc.id)
                        );

                    const message = asMessage(channel.data(), fromUser, payload);
                    userInboxDocs.forEach(doc => trn.set(doc, message));
                    trn.set(channelInboxDoc, message);
                    trn.set(sentDoc, message);
                })
            } else {
                await Promise.all([
                    firestore.collection(`team/${payload.team}/channel/failed-to-deliver/inbox`).add({
                        msg: `Can't find channel for feedback`, date: now(), payload
                    }),
                    sendSlackMessage(config.slack.bottoken, {
                        channel: `@${payload.user}`,
                        text: `Channel mentioned in feedback (${payload.mention}) not found.`
                    })
                ]);
            }
        }
    );
}
