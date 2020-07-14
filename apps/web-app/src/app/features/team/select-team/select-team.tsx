import {CircularProgress} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from '../../../state/app-state';

export const SelectTeamView = ({teams, team}: ViewProps) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const onOpen = event => setAnchorEl(event.currentTarget);
    const onClose = () => setAnchorEl(null);
    return <>
        <Button color="inherit" onClick={onOpen}>
            {teams?.length === 0 ? <CircularProgress size={8} color="secondary"/> : team.name}
        </Button>
        <Menu anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={onClose}
        >
            {teams?.map(team => <MenuItem key={team.id} onClick={onClose}>{team.name}</MenuItem>)}
        </Menu>
    </>;
};

interface ViewProps extends ConnectedProps<typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        teams: Object.values(state.team.teams?.byId ?? {}),
        team: state.team.current
    })
);

export const SelectTeam = connector(SelectTeamView);