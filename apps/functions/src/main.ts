import {PubSub} from '@google-cloud/pubsub';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FunctionBuilder} from 'firebase-functions';
import {awakeHandlerFactory} from './app/awake/awake.handler';
import {feedbackStatsFactory} from './app/feedback-stats-factory';
import {kudosHandlerFactory} from './app/kudos/kudos.handler';
import {notificationAfterFeedbackFactory} from './app/notyfication-after-feedback/notyfication-after-feedback.handler';
import {registerUserFactory} from './app/register-user/register-user.handler';
import {sendFeedbackFactory} from './app/send-feedback/send-feedback.handler';

firebase.initializeApp();

const region = functions.region('europe-west3');
const functionBuilder: () => FunctionBuilder = () => region
  .runWith({
    maxInstances: 5,
    memory: '512MB'
  });

export const awakeHandler = awakeHandlerFactory(functionBuilder());
export const sendFeedback = sendFeedbackFactory(functionBuilder(), functions.config(), firebase);
export const notificationAfterFeedback = notificationAfterFeedbackFactory(functionBuilder(), functions.config());
export const feedbackStats = feedbackStatsFactory(functionBuilder(), firebase);
export const kudosHandler = kudosHandlerFactory(functionBuilder().runWith({memory: '512MB'}), functions.config(), new PubSub());
export const registerUserHandler = registerUserFactory(functionBuilder(), firebase);
