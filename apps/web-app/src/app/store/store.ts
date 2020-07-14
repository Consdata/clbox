import {configureStore} from '@reduxjs/toolkit';
import {routerMiddleware} from 'connected-react-router';
import {browserHistory} from '../platform/browser-history';
import {epicMiddleware} from './epic-middleware';
import {rootEpic} from './root-epic';
import {rootReducer} from './root-reducer';

export const store = configureStore({
    reducer: rootReducer(browserHistory),
    middleware: [routerMiddleware(browserHistory), epicMiddleware]
});

epicMiddleware.run(rootEpic);