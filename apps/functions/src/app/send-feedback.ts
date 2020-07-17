import * as rp from 'request-promise';
import {PendingKudosMessage} from './pending-kudos-message';
import {SlackUser} from './slack-user';

import {SlackUserIndex} from './slack-user-index';
import {SlackUserProfile} from './slack-user-profile';

export const sendFeedbackFactory = (
    functions: import('firebase-functions').FunctionBuilder,
    config: import('firebase-functions').config.Config,
    firebase: typeof import('firebase-admin')) => {
    const slackBotToken = config.slack.bottoken;
    const usersIndexPromise: Promise<SlackUserIndex> = rp({
        uri: `https://slack.com/api/users.list?token=${slackBotToken}`,
        transform: response => response.members,
        json: true
    }).then(
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

            const fromUser: SlackUserProfile = usersIndex[payload.user].profile;
            const forUser: SlackUserProfile = usersIndex[payload.mention].profile;
            const userCollection = firebase.firestore().collection(`team/${payload.team}/user/`);
            const chapterLeader = (await userCollection.doc(forUser.email).get()).data().chapterLeader;
            if (chapterLeader !== undefined) {
                const inboxCollection = firebase.firestore().collection(`team/${payload.team}/inbox/${chapterLeader}/message`);
                await inboxCollection.add({
                    date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    for: forUser.email,
                    forName: forUser.display_name,
                    from: fromUser.email,
                    fromName: fromUser.display_name,
                    message: payload.feedback
                });
            } else {
                // TODO: what now?!
            }
        }
    );
}
