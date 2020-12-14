import {createAction} from '@reduxjs/toolkit';
import {DiscardInboxFeedbackPayload} from './discard-inbox-feedback.payload';

export const discardInboxFeedback = createAction<DiscardInboxFeedbackPayload>('DiscardInboxFeedback');
