import CssBaseline from '@material-ui/core/CssBaseline';
import {StylesProvider} from '@material-ui/core/styles';
import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './features/authentication/components/unauthenticated-app/unauthenticated-app';
import {appBootstrap} from './platform/app-bootstrap';
import {AppState} from './state/app-state';

const AppWrapperView = ({authenticated, bootstrapped}: ViewProps) => {
    useEffect(() => {
        bootstrapped()
    }, []);
    return <CssBaseline>
        <StylesProvider injectFirst>
            {authenticated === true && <AuthenticatedApp/>}
            {authenticated !== true && <UnauthenticatedApp/>}
        </StylesProvider>
    </CssBaseline>;
}

interface ViewProps extends ConnectedProps<typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        authenticated: state.authentication.authenticated
    }),
    {
        bootstrapped: () => appBootstrap()
    }
);

export const AppWrapper = connector(AppWrapperView);