import {TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import styled from 'styled-components';
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

export const RestorePassword = ({history}: RouteComponentProps) => {
    const onRedirectToLogin = () => history.push('/login');
    return <FullScreenCentered>
        <Form>
            <FullWithTextField id="email" label="Email"/>
            <Spacer/>
            <Button color="primary">Restore password</Button>
            <SecondaryLink color="textSecondary" onClick={onRedirectToLogin}>Return to login</SecondaryLink>
        </Form>
    </FullScreenCentered>;
};