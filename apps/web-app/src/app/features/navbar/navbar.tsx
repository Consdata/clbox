import {Toolbar} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {userAuthenticationRevoked} from '../authentication/state/user-authentication-revoked.action';
import {SelectTeam} from '../team/select-team/select-team';

const Actions = styled.div`
    padding: 0 12px;
`;

const ActionButton = styled(props => <Button color="inherit" {...props}>{props.children}</Button>)`
    min-width: 0;
`;

const Filler = styled.div`
    flex: 1;
`;

const NavbarView = ({onLogout}: ConnectedProps<typeof connector>) => (
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6">clbox</Typography>
            <Actions>
                <SelectTeam></SelectTeam>
                <ActionButton color="inherit" component={Link} to="/dashboard">Dashboard</ActionButton>
                <ActionButton color="inherit" component={Link} to="/chapter">Chapter</ActionButton>
                <ActionButton color="inherit" component={Link} to="/mine">Ty</ActionButton>
            </Actions>
            <Filler/>
            <ActionButton onClick={onLogout}>Logout</ActionButton>
        </Toolbar>
    </AppBar>
);

const connector = connect(
    undefined,
    {
        onLogout: () => userAuthenticationRevoked()
    }
);

export const Navbar = connector(NavbarView);

