import {combineEpics} from 'redux-observable';
import {initAuthenticationOnAppBootstrapEpic} from './init-authentication-listener/init-authentication-on-app-bootstrap.epic';
import {redirectAfterLogin} from './login/redirect-after-login.epic';
import {logoutEpic} from './logout/logout.epic';
import {redirectAfterLogout} from './logout/redirect-after-logout.epic';

export const authenticationEpic = combineEpics(
    initAuthenticationOnAppBootstrapEpic,
    logoutEpic,
    redirectAfterLogin,
    redirectAfterLogout
);