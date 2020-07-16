import {createAction} from '@reduxjs/toolkit';
import {RestoreInboxFeedbackPayload} from './restore-inbox-feedback.payload';

export const restoreInboxFeedback = createAction<RestoreInboxFeedbackPayload>('restoreInboxFeedback');