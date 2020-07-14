import {ConnectedRouter} from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {AppWrapper} from './app/app-wrapper';
import {requestAuthentication} from './app/features/authentication/state/request-authentication.action';
import {browserHistory} from './app/platform/browser-history';
import {store} from './app/store/store';
import './style.scss';

store.dispatch(requestAuthentication());

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={browserHistory}>
            <AppWrapper/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('clbox')
);
