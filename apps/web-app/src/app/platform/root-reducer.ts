import {connectRouter} from 'connected-react-router';
import {combineReducers} from 'redux';

export const configureRootReducer = (history) => combineReducers({
    router: connectRouter(history)
})