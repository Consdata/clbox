import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../../../../state/app-state";
import styled from "styled-components";
import {Badge, createStyles, Theme, Typography, withStyles} from "@material-ui/core";
import {InboxFilter} from "../inbox-filter";

const FilterGroup = styled.div`
    margin-bottom: 8px;
`;

const FilterGroupItem = styled.div`
    margin-left: 8px;
    cursor: pointer;
    user-select: none;
`;

const FilterGroupAllHeader = styled.div`
    cursor: pointer;
    user-select: none;
`;

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            right: -16,
            top: 11,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        }
    }),
)(Badge);

function sumMessages(users: { count: number }[], channels: { count: number }[], labels: [string, number][]) {
    return users.reduce((r, u) => r + u.count, 0)
        + channels.reduce((r, c) => r + c.count, 0)
        + labels.reduce((r, l) => r + l[1], 0);
}

const InboxSideFilterView = ({stats, filter, onFilter}: ViewProps) => {
    const users = Object.values(stats.users).filter(user => user.count > 0).sort((a, b) => a.name.localeCompare(b.name));
    const channels = Object.values(stats.channels).filter(channel => channel.count > 0).sort((a, b) => a.name.localeCompare(b.name));
    const labels = Object.entries(stats.labels).filter(label => label[1] > 0).sort((a, b) => a[0].localeCompare(b[0]));
    const allCount = sumMessages(users, channels, labels);

    const filterAll = !filter.channel && !filter.user && !filter.label;

    return <div>
        <FilterGroup>
            <FilterGroupAllHeader>
                <StyledBadge badgeContent={allCount} color={filterAll ? 'secondary' : 'primary'}>
                    <Typography onClick={() => onFilter({})}>All</Typography>
                </StyledBadge>
            </FilterGroupAllHeader>
        </FilterGroup>
        {users.length > 0 && <FilterGroup>
            <Typography variant={"subtitle2"}>People</Typography>
            <div>
                {users.map(user => <FilterGroupItem key={user.email}>
                    <StyledBadge badgeContent={user.count} color={filter.user === user.email ? 'secondary' : 'primary'}>
                        <Typography onClick={() => onFilter({user: user.email})}>{user.name}</Typography>
                    </StyledBadge>
                </FilterGroupItem>)}
            </div>
        </FilterGroup>}
        {channels.length > 0 && <FilterGroup>
            <Typography variant={"subtitle2"}>Channels</Typography>
            <div>
                {channels.map(channel => <FilterGroupItem key={channel.name}>
                    <StyledBadge badgeContent={channel.count} color={filter.channel === channel.name ? 'secondary' : 'primary'}>
                        <Typography onClick={() => onFilter({channel: channel.name})}>{channel.shortName}</Typography>
                    </StyledBadge>
                </FilterGroupItem>)}
            </div>
        </FilterGroup>}
        {labels.length > 0 && <FilterGroup>
            <Typography variant={"subtitle2"}>Labels</Typography>
            <div>
                {labels.map(label => <FilterGroupItem key={label[0]}>
                    <StyledBadge badgeContent={label[1]} color={filter.label === label[0] ? 'secondary' : 'primary'}>
                        <Typography onClick={() => onFilter({label: label[0]})}>{label[0]}</Typography>
                    </StyledBadge>
                </FilterGroupItem>)}
            </div>
        </FilterGroup>}
    </div>;
};

interface ViewProps extends ConnectedProps<typeof connector> {
    filter: InboxFilter;
    onFilter: (filter: InboxFilter) => void;
}

const connector = connect(
    (state: AppState) => ({
        stats: state.inbox.stats
    }),
    {}
);

export const InboxSideFilter = connector(InboxSideFilterView);
