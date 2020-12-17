import {createAction} from '@reduxjs/toolkit';
import {EditFeedbackLabelsPayload} from './edit-feedback-labels.payload';

export const editFeedbackLabels = createAction<EditFeedbackLabelsPayload>('EditFeedbackLabels');
