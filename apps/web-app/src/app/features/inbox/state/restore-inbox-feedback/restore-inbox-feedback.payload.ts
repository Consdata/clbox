import {InboxMessage} from '../model/inbox-message';

export interface RestoreInboxFeedbackPayload {
    message: InboxMessage;
}