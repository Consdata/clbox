import {PubSub} from '@google-cloud/pubsub';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FunctionBuilder} from 'firebase-functions';
import {awakeHandlerFactory} from './app/awake/awake.handler';
import {feedbackStatsFactory} from './app/feedback-stats-factory';
import {kudosHandlerFactory} from './app/kudos/kudos.handler';
import {notificationAfterFeedbackFactory} from './app/notyfication-after-feedback/notyfication-after-feedback.handler';
import {createUserFactory} from './app/create-user/create-user.handler';
import {sendFeedbackFactory} from './app/send-feedback/send-feedback.handler';
import {userFeedbackStatsFactory} from 'apps/functions/src/app/user-feedback-stats-factory';

firebase.initializeApp();

const region = functions.region('europe-west3');
const functionBuilder: () => FunctionBuilder = () => region
  .runWith({
    maxInstances: 5,
    memory: '256MB'
  });

export const awakeHandler = awakeHandlerFactory(functionBuilder());
export const sendFeedback = sendFeedbackFactory(functionBuilder(), functions.config(), firebase);
export const notificationAfterFeedback = notificationAfterFeedbackFactory(functionBuilder(), functions.config());
export const feedbackStats = feedbackStatsFactory(functionBuilder(), firebase);
export const userFeedbackStats = userFeedbackStatsFactory(functionBuilder(), firebase);
export const createUser = createUserFactory(functionBuilder(), firebase);
export const kudosHandler = kudosHandlerFactory(functionBuilder().runWith({memory: '512MB'}), functions.config(), new PubSub());
