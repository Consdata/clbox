import {TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router';
import styled from 'styled-components';
import {firebaseApp} from '../../../firebase/firebase.app';
import {FullScreenCentered} from '../../../layout/full-screen-centered';

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

export const ResetPassword = ({history}: RouteComponentProps) => {
    const [state, setState] = useState({
        email: '',
        message: ''
    });
    const onRedirectToLogin = () => history.push('/login');
    const handleEmailChange = event => {
        setState({
            ...state,
            email: event.target.value
        });
    }
    const handleSubmit = event => {
        event.preventDefault();
        firebaseApp.auth().sendPasswordResetEmail(state.email).then(
            () => {
                setState({
                    ...state,
                    message: 'Reset link sent'
                })
            },
            error => setState({
                ...state,
                message: error.message
            })
        )
    }
    return <FullScreenCentered>
        <Form onSubmit={handleSubmit}>
            <FullWithTextField id="email" value={state.email} onChange={handleEmailChange} label="Email"/>
            <Spacer/>
            {state.message ?? <div>state.message</div>}
            <Button color="primary" type="submit">Reset password</Button>
            <SecondaryLink color="textSecondary" onClick={onRedirectToLogin}>Return to login</SecondaryLink>
        </Form>
    </FullScreenCentered>;
};