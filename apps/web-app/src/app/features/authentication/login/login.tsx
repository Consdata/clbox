import {TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux'
import {RouteComponentProps} from 'react-router';
import styled from 'styled-components';
import {FullScreenCentered} from '../../layout/full-screen-centered';
import {userAuthenticated} from '../state/user-authenticated.action';

const Form = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 200px;
`;

const SecondaryLink = styled(Link)`
    cursor: pointer;
`;

const FullWithTextField = styled(TextField)`
    width: 100%;
`;

const Spacer = styled.div`
    margin-bottom: 16px;
`;

const LoginView = ({onLogin, history}: ConnectedProps<typeof connector> & RouteComponentProps) =>
    <FullScreenCentered>
        <Form>
            <FullWithTextField id="standard-basic" label="Email"/>
            <FullWithTextField id="standard-basic" type="password" autoComplete="current-password" label="Password"/>
            <Spacer/>
            <Button color="primary" onClick={onLogin}>Login</Button>
            <SecondaryLink color="textSecondary" onClick={() => history.push('/restore')}>Restore password</SecondaryLink>
        </Form>
    </FullScreenCentered>;

const connector = connect(
    undefined,
    {
        onLogin: () => userAuthenticated(),
    }
);

export const Login = connector(LoginView);

