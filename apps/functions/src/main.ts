import {PubSub} from '@google-cloud/pubsub';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FunctionBuilder} from 'firebase-functions';
import {createUserFactory} from './app/create-user/create-user.handler';
import {expireUserAccountsFactory} from './app/expire-user-accounts/expire-user-accounts-factory';
import {feedbackStatsFactory} from './app/feedback-stats/feedback-stats-factory';
import {getChapterStatsFactory} from './app/get-chapter-stats/get-chapter-stats-factory';
import {kudosHandlerFactory} from './app/kudos/kudos.handler';
import {notificationAfterLeaderChangeFactory} from './app/notification-after-leader-change/notification-after-leader-change-factory';
import {notificationAfterFeedbackFactory} from './app/notyfication-after-feedback/notyfication-after-feedback.handler';
import {sendFeedbackFactory} from './app/send-feedback/send-feedback.handler';
import {userFeedbackStatsFactory} from './app/user-feedback-stats/user-feedback-stats-factory';
import {storeChannelFeedbackHandlerFactory} from "./app/store-channel-feedback/store-channel-feedback.handler";

firebase.initializeApp();

const region = functions.region('europe-west3');
const functionBuilder: () => FunctionBuilder = () => region
  .runWith({
    maxInstances: 5,
    memory: '256MB'
  });

export const sendFeedback = sendFeedbackFactory(functionBuilder(), functions.config(), firebase, 'pending-user-feedbacks');
export const storeChannelFeedback = storeChannelFeedbackHandlerFactory(functionBuilder(), functions.config(), firebase, 'pending-channel-feedbacks');
export const notificationAfterFeedback = notificationAfterFeedbackFactory(functionBuilder(), functions.config());
export const notificationAfterLeaderChange = notificationAfterLeaderChangeFactory(functionBuilder(), functions.config());
export const feedbackStats = feedbackStatsFactory(functionBuilder(), firebase);
export const userFeedbackStats = userFeedbackStatsFactory(functionBuilder(), firebase);
export const createUser = createUserFactory(functionBuilder(), firebase);
export const expireUserAccounts = expireUserAccountsFactory(functionBuilder(), firebase);
export const getChapterStats = getChapterStatsFactory(functionBuilder(), firebase);
export const kudosHandler = kudosHandlerFactory(
  functionBuilder().runWith({memory: '512MB'}),
  functions.config(),
  new PubSub(),
  'pending-user-feedbacks',
  'pending-channel-feedbacks'
);
