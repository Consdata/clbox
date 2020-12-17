import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../../../state/app-state";
import {InboxFilter} from "../inbox-filter";
import styled from "styled-components";
import {FeedbackCard} from "../../../../feedback/components/feedback-item/feedback-card";
import {Message} from "../../../../message/model/message";
import {discardInboxFeedback} from "../../../state/discard-inbox-feedback/discard-inbox-feedback.action";
import {editFeedbackComment} from "../../../state/edit-feedback-comment/edit-feedback-comment.action";
import {editFeedbackLabels} from "../../../state/edit-feedback-labels/edit-feedback-labels.action";

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

const InboxMessagesView = ({messages, inboxLabels, filter, onDiscard, onCommentChange, onLabelsChange}: ViewProps) => {
    const filtered = filterMessages(messages, filter);
    const ordered = sortByDate(filtered); // TODO: user defined sort
    return <div>
        {ordered && ordered.map(msg => <InboxItem key={msg.id}>
            <FeedbackCard
                feedback={msg}
                existingLabels={inboxLabels}
                onDiscard={() => onDiscard(msg)}
                onCommentChange={comment => onCommentChange(msg, comment)}
                onLabelsChange={labels => onLabelsChange(msg, labels)}
            />
        </InboxItem>)}
    </div>;
};

interface ViewProps extends ConnectedProps<typeof connector> {
    filter: InboxFilter;
}

const connector = connect(
    (state: AppState) => ({
        messages: state.inbox.messages?.byId && Object.values(state.inbox.messages?.byId),
        inboxLabels: Object
            .entries(state.inbox.stats.labels)
            .filter(entry => entry[1] > 0)
            .map(entry => entry[0])
    }),
    {
        onDiscard: (message: Message) => discardInboxFeedback({message}),
        onCommentChange: (message: Message, text: string) => editFeedbackComment({message, text}),
        onLabelsChange: (message: Message, labels: string[]) => editFeedbackLabels({message, labels}),
    }
);

export const InboxMessages = connector(InboxMessagesView);
