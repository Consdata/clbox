import {Box, CircularProgress, MenuItem, Select} from '@material-ui/core';
import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import styled from 'styled-components';
import {AppState} from '../../../../state/app-state';
import {FeedbackCard} from '../../../feedback/components/feedback-item/feedback-card';
import {discardInboxFeedback} from '../../state/discard-inbox-feedback/discard-inbox-feedback.action';
import {InboxMessage} from '../../state/model/inbox-message';
import {InboxMessageState} from '../../state/model/inbox-message-state';

const InboxItem = styled.div`
    margin-bottom: 16px;
    width: 100%;
`;

const View = styled(Box)`
    width: 600px;
    margin: 32px auto;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const UserFilter = styled(Select)`
    margin-bottom: 16px;
`;

const InboxView = ({messages, onDiscard, users}: ViewProps) => {
    const [filter, setFilter] = useState('all');
    return <View>
        {!messages && <CircularProgress size={50}/>}
        {users?.length > 0 && <UserFilter value={filter} onChange={change => setFilter(change.target.value as string)}>
            {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
        </UserFilter>}
        {messages && messages.filter(message => message.state === InboxMessageState.Pending)
            .filter(message => filter === 'all' || filter === message.for)
            .map(message => <InboxItem key={message.id}>
                    <FeedbackCard feedback={message} onDiscard={() => onDiscard(message)}/>
                </InboxItem>
            )}
    </View>;
};

interface ViewProps extends ConnectedProps<typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        messages: state.inbox.messages ? Object.values(state.inbox.messages.byId).sort((a, b) => b.date.localeCompare(a.date)) : undefined,
        users: [{name: 'All', id: 'all'}, ...Object.values(state.inbox.messages?.byId ?? {}).map(message => ({
            name: message.forName,
            id: message.for
        }))].filter(
            (element, index, self) => self.findIndex(e => e.id === element.id) === index
        )
    }),
    {
        onDiscard: (message: InboxMessage) => discardInboxFeedback({message})
    }
);

export const Inbox = connector(InboxView);