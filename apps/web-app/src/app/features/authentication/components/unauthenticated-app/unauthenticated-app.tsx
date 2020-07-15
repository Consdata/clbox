import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router';
import {AppState} from '../../../../state/app-state';
import {LoginWait} from '../login-wait/login-wait';
import {Login} from '../login/login';
import {ResetPassword} from '../restore-password/reset-password';

export const UnauthenticatedAppView = ({authenticated}: ViewProps) => <div>
    {authenticated === undefined && <LoginWait/>}
    {authenticated === true && <Redirect to='/'/>}
    {authenticated === false && <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/reset' component={ResetPassword}/>
        <Redirect to='/login'/>
    </Switch>}
</div>;

interface ViewProps extends ConnectedProps<typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        authenticated: state.authentication.authenticated
    })
);

export const UnauthenticatedApp = connector(UnauthenticatedAppView);