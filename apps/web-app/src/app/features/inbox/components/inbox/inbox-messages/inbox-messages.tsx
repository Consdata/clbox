import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../../../state/app-state";
import {InboxFilter} from "../inbox-filter";
import styled from "styled-components";
import {FeedbackCard} from "../../../../feedback/components/feedback-item/feedback-card";
import {Message} from "../../../../message/model/message";
import {discardInboxFeedback} from "../../../state/discard-inbox-feedback/discard-inbox-feedback.action";

function filterMessages(messages, filter: InboxFilter) {
    return messages?.filter(msg => {
        if (filter?.label && !msg.labelMap?.[filter.label]) {
            return false;
        }
        if (filter?.user && msg.for !== filter.user) {
            return false;
        }
        if (filter?.channel && msg.for !== filter.channel) {
            return false;
        }
        return true;
    });
}

function sortByDate(messages) {
    return messages?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const InboxItem = styled.div`
    margin-bottom: 16px;
    width: 100%;
`;

const InboxMessagesView = ({messages, filter, onDiscard}: ViewProps) => {
    const filtered = filterMessages(messages, filter);
    const ordered = sortByDate(filtered); // TODO: user defined sort
    return <div>
        {ordered && ordered.map(msg => <InboxItem key={msg.id}>
            <FeedbackCard feedback={msg} onDiscard={() => onDiscard(msg)}/>
        </InboxItem>)}
    </div>;
};

interface ViewProps extends ConnectedProps<typeof connector> {
    filter: InboxFilter;
}

const connector = connect(
    (state: AppState) => ({
        messages: state.inbox.messages?.byId && Object.values(state.inbox.messages?.byId)
    }),
    {
        onDiscard: (message: Message) => discardInboxFeedback({message})
    }
);

export const InboxMessages = connector(InboxMessagesView);