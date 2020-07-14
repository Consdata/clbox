import {TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux'
import {RouteComponentProps} from 'react-router';
import styled from 'styled-components';
import {AppState} from '../../../../state/app-state';
import {FullScreenCentered} from '../../../layout/full-screen-centered';
import {login} from '../../state/login/login.action';

const Form = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 250px;
`;

const SecondaryLink = styled(Link)`
    cursor: pointer;
`;

const FullWithTextField = styled(TextField)`
    width: 100%;
    margin-bottom: 4px;
`;

const Spacer = styled.div`
    margin-bottom: 16px;
`;

const ErrorMessage = styled.div`
    color: red;
`;

const LoginView = ({loginStatus, onLogin, history}: ConnectedProps<typeof connector> & RouteComponentProps) => {
    const [state, setState] = useState({
        email: '',
        password: ''
    });
    return <FullScreenCentered>
        <Form>
            <FullWithTextField id="email"
                               label="Email"
                               value={state.email}
                               onChange={ev => setState({...state, email: ev.currentTarget.value})}
            />
            <FullWithTextField id="password"
                               type="password"
                               autoComplete="current-password"
                               label="Password"
                               value={state.password}
                               onChange={ev => setState({...state, password: ev.currentTarget.value})}
            />
            {loginStatus && <ErrorMessage>{loginStatus}</ErrorMessage>}
            <Spacer/>
            <Button color="primary" onClick={() => onLogin(state.email, state.password)}>Login</Button>
            <SecondaryLink color="textSecondary" onClick={() => history.push('/restore')}>Restore password</SecondaryLink>
        </Form>
    </FullScreenCentered>;
};

const connector = connect(
    (state: AppState) => ({
        loginStatus: state.authentication.statusMessage
    }),
    {
        onLogin: (email: string, password: string) => login({
            email, password
        })
    }
);

export const Login = connector(LoginView);

