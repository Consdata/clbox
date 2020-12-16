import {createAction} from '@reduxjs/toolkit';
import {EditFeedbackCommentPayload} from './edit-feedback-comment.payload';

export const editFeedbackComment = createAction<EditFeedbackCommentPayload>('EditFeedbackComment');
