import {PubSub} from '@google-cloud/pubsub';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FunctionBuilder} from 'firebase-functions';
import {awakeHandlerFactory} from './app/awake-handler';
import {kudosHandlerFactory} from './app/kudos-handler';
import {sendFeedbackFactory} from './app/send-feedback';

firebase.initializeApp();

const region = functions.region('europe-west3');
const functionBuilder: FunctionBuilder = region
  .runWith({
    maxInstances: 1
  });

export const awakeHandler = awakeHandlerFactory(functionBuilder);
export const kudosHandler = kudosHandlerFactory(functionBuilder.runWith({memory: '512MB'}), functions.config(), new PubSub());
export const sendFeedback = sendFeedbackFactory(functionBuilder, functions.config(), firebase);
