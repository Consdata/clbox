import {Box, CircularProgress} from '@material-ui/core';
import React from 'react';
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

const InboxView = ({messages, onDiscard}: ViewProps) => <View>
    {!messages && <CircularProgress size={50}/>}
    {messages && messages.filter(message => message.state === InboxMessageState.Pending).map(message => <InboxItem key={message.id}>
        <FeedbackCard feedback={message} onDiscard={() => onDiscard(message)}/>
    </InboxItem>)}
</View>;

interface ViewProps extends ConnectedProps<typeof connector> {
}

const connector = connect(
    (state: AppState) => ({
        messages: state.inbox.messages ? Object.values(state.inbox.messages.byId) : undefined
    }),
    {
        onDiscard: (message: InboxMessage) => discardInboxFeedback({message})
    }
);

export const Inbox = connector(InboxView);