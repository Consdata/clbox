import {configureStore} from '@reduxjs/toolkit';
import {routerMiddleware} from 'connected-react-router';
import {browserHistory} from '../platform/browser-history';
import {epicMiddleware} from './epic-middleware';
import {rootEpic} from './root-epic';
import {rootReducer} from './root-reducer';
import * as Sentry from "@sentry/react";
import {AppState} from '../state/app-state';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  stateTransformer: state => {
    return {
      ...state,
      inbox: {
        messages: undefined
      },
      sent: {
        messages: undefined
      }
    } as AppState;
  }
});

export const store = configureStore({
  reducer: rootReducer(browserHistory),
  middleware: [routerMiddleware(browserHistory), epicMiddleware],
  enhancers: [sentryReduxEnhancer]
});

epicMiddleware.run(rootEpic);
