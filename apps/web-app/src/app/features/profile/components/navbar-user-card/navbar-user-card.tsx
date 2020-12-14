import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../../state/app-state";
import {logout} from "../../../authentication/state/logout/logout.action";
import {Avatar, Button, createStyles, IconButton, Popover, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {pink} from "@material-ui/core/colors";
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        orange: {
            cursor: 'pointer',
            color: theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500],
        },
        popoverContent: {
            padding: 16
        },
        actions: {
            padding: 8,
            display: 'flex',
            justifyContent: 'center'
        }
    }),
);

const NavbarUserCardView = ({profile, onLogout}: ViewProps) => {
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return !profile ? <></> : <div>
        <Avatar className={styles.orange} onClick={ev => setAnchorEl(ev.currentTarget)}>
            {profile.username.substr(0, 2).toUpperCase()}
        </Avatar>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
        >
            <div className={styles.popoverContent}>
                <div><Typography variant={"subtitle1"}>{profile.display_name}</Typography></div>
                <div>{profile.email}</div>
                <div className={styles.actions}>
                    <IconButton>
                        <SettingsIcon/>
                    </IconButton>
                    <IconButton color="secondary" onClick={onLogout}>
                        <PowerSettingsNewIcon/>
                    </IconButton>
                </div>
            </div>
        </Popover>
    </div>;
};

type ViewProps = ConnectedProps<typeof connector>

const connector = connect(
    (state: AppState) => ({
        profile: state.profile?.profile
    }),
    {
        onLogout: () => logout()
    }
);

export const NavbarUserCard = connector(NavbarUserCardView);
