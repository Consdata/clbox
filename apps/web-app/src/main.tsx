import {ConnectedRouter} from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {App} from './app/app';
import {browserHistory} from './app/platform/browser-history';
import {configureStore} from './app/platform/store';
import './style.scss';

const store = configureStore({});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={browserHistory}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('clbox')
);
