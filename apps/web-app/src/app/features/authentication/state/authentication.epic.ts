import {combineEpics} from 'redux-observable';
import {clearAuthenticationStatusEpic} from './clear-authentication-status/clear-authentication-status.epic';
import {initAuthenticationOnAppBootstrapEpic} from './init-authentication-listener/init-authentication-on-app-bootstrap.epic';
import {loginWithEmailEpic} from './login-with-email/login-with-email.epic';
import {redirectAfterLogin} from './login/redirect-after-login.epic';
import {logoutEpic} from './logout/logout.epic';
import {redirectAfterLogout} from './logout/redirect-after-logout.epic';

export const authenticationEpic = combineEpics(
    initAuthenticationOnAppBootstrapEpic,
    loginWithEmailEpic,
    logoutEpic,
    redirectAfterLogin,
    redirectAfterLogout,
    clearAuthenticationStatusEpic
);