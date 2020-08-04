import {PubSub} from '@google-cloud/pubsub';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FunctionBuilder} from 'firebase-functions';
import {awakeHandlerFactory} from './app/awake-handler';
import {kudosHandlerFactory} from './app/kudos-handler';
import {notificationAfterFeedbackFactory} from './app/notyfication-after-feedback';
import {sendFeedbackFactory} from './app/send-feedback';

firebase.initializeApp();

const region = functions.region('europe-west3');
const functionBuilder: () => FunctionBuilder = () => region
  .runWith({
    maxInstances: 5
  });

export const awakeHandler = awakeHandlerFactory(functionBuilder());
export const sendFeedback = sendFeedbackFactory(functionBuilder(), functions.config(), firebase);
export const notificationAfterFeedback = notificationAfterFeedbackFactory(functionBuilder(), functions.config());
export const kudosHandler = kudosHandlerFactory(functionBuilder().runWith({memory: '512MB'}), functions.config(), new PubSub());
