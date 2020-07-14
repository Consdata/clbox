import CssBaseline from '@material-ui/core/CssBaseline';
import {StylesProvider} from '@material-ui/core/styles';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './features/authentication/unauthenticated-app/unauthenticated-app';
import {AppState} from './state/app-state';

const AppWrapperView = ({authenticated}: ViewProps) =>
    <CssBaseline>
        <StylesProvider injectFirst>
            {authenticated === true && <AuthenticatedApp/>}
            {authenticated !== true && <UnauthenticatedApp/>}
        </StylesProvider>
    </CssBaseline>

interface ViewProps extends ConnectedProps<typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        authenticated: state.authentication.authenticated
    })
);

export const AppWrapper = connector(AppWrapperView);