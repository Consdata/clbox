import {routerMiddleware} from 'connected-react-router';
import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import {browserHistory} from './browser-history';
import {configureRootReducer} from './root-reducer';

const storeEnhancer = composeWithDevTools({})(
    applyMiddleware(
        routerMiddleware(browserHistory)
    ),
);

export const configureStore = (initialState) => createStore(
    configureRootReducer(browserHistory),
    initialState,
    storeEnhancer,
);