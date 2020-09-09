import CssBaseline from '@material-ui/core/CssBaseline';
import {ConnectedRouter} from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {AppWrapper} from './app/app-wrapper';
import {firebaseApp} from './app/features/firebase/firebase.app';
import {FirebaseContext} from './app/features/firebase/firebase.context';
import {firebasePerformance} from './app/features/firebase/firebase.performance';
import {browserHistory} from './app/platform/browser-history';
import {store} from './app/store/store';

firebasePerformance.trace('app#beforeRender');

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
