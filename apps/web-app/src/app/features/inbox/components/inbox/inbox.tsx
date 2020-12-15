import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from '../../../../state/app-state';
import {Message} from '../../../message/model/message';
import {discardInboxFeedback} from "../../state/discard-inbox-feedback/discard-inbox-feedback.action";
import {InboxSideFilter} from "./inbox-side-filter/inbox-side-filter";
import {InboxFilter} from "./inbox-filter";
import {InboxMessages} from "./inbox-messages/inbox-messages";
import styled from "styled-components";

function filterBasedOnCurrent(updated: InboxFilter, filter: InboxFilter) {
    if (updated.user) {
        return {
            ...filter, channel: undefined, user: filter.user === updated.user ? undefined : updated.user
        };
    } else if (updated.channel) {
        return {
            ...filter, user: undefined, channel: filter.channel === updated.channel ? undefined : updated.channel
        };
    } else if (updated.label) {
        return {
            ...filter, label: updated.label === filter.label ? undefined : updated.label
        }
    } else {
        return {};
    }
}

const Layout = styled.div`
    display: flex;
    & > div:nth-child(1) {
        flex-basis: 200px;
        margin-right: 64px;
    }
    & > div:nth-child(2) {
        flex: 1;
    }
`;

const InboxView = ({}: ViewProps) => {
    const [filter, setFilter] = useState({} as InboxFilter);
    const updateFilter = (updated: InboxFilter) => setFilter(
        filterBasedOnCurrent(updated, filter)
    );
    return <Layout>
        <InboxSideFilter filter={filter} onFilter={updateFilter}/>
        <InboxMessages filter={filter} />
    </Layout>;
};

type ViewProps = ConnectedProps<typeof connector>

const connector = connect(
    (state: AppState) => ({}),
    {}
);

export const Inbox = connector(InboxView);
