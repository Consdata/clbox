import CssBaseline from '@material-ui/core/CssBaseline';
import {ConnectedRouter} from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import {Integrations} from '@sentry/tracing';
import {Provider} from 'react-redux';
import {AppWrapper} from './app/app-wrapper';
import {firebaseAnalytics} from './app/features/firebase/firebase.analytics';
import {firebaseApp} from './app/features/firebase/firebase.app';
import {FirebaseContext} from './app/features/firebase/firebase.context';
import {firebasePerformance} from './app/features/firebase/firebase.performance';
import {browserHistory} from './app/platform/browser-history';
import {store} from './app/store/store';
import {environment} from './environments/environment';

if (environment.production) {
  Sentry.init({
    dsn: "https://0bb4a7c3843648c085e15040403fb489@o335597.ingest.sentry.io/5628995",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    normalizeDepth: 10,
    release: process.env.NX_RELEASE_VERSION || undefined
  });
}

ReactDOM.render(
  <CssBaseline>
    <FirebaseContext.Provider value={firebaseApp}>
      <Provider store={store}>
        <ConnectedRouter history={browserHistory}>
          <AppWrapper/>
        </ConnectedRouter>
      </Provider>
    </FirebaseContext.Provider>
  </CssBaseline>,
  document.getElementById('clbox')
);

firebasePerformance.trace('app#afterRender');
firebaseAnalytics.logEvent('app_bootstrap');
