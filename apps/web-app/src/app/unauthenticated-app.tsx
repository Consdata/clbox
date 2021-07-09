import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Redirect} from 'react-router';
import {AppRoutingUnauthenticated} from './app-routing';
import {LoginWait} from './features/authentication/components/login-wait/login-wait';
import {AppState} from './state/app-state';

export const UnauthenticatedAppView = ({authenticated}: ViewProps) => <div>
    {authenticated === undefined && <LoginWait/>}
    {authenticated === true && <Redirect to='/'/>}
    {authenticated === false && <AppRoutingUnauthenticated/>}
</div>;

type ViewProps = ConnectedProps<typeof connector>

const connector = connect(
    (state: AppState) => ({
        authenticated: state.authentication.authenticated
    })
);

export const UnauthenticatedApp = connector(UnauthenticatedAppView);
